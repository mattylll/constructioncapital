/**
 * Applicant / agent detail enrichment from planning-portal detail pages.
 *
 * The Idox and FastWeb scrapers only read the search results, which do not
 * include the applicant. Idox's "Further information" tab
 * (`applicationDetails.do?activeTab=details`) lists Applicant Name, Agent
 * Name, Agent Company Name and Agent Address on a plain GET, so we fetch that
 * one page per candidate and fill the gaps. Other vendors (Civica, Arcus,
 * Agile) already carry the applicant in the scraped JSON.
 */

import * as https from "https";
import * as http from "http";

export interface ApplicantDetails {
  applicantName: string;
  applicantAddress: string;
  agentName: string;
  agentCompany: string;
  agentAddress: string;
  source: "idox-details" | "fastweb-detail" | "none";
  insecureTls?: boolean;
  error?: string;
}

const EMPTY: ApplicantDetails = {
  applicantName: "",
  applicantAddress: "",
  agentName: "",
  agentCompany: "",
  agentAddress: "",
  source: "none",
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const NOT_AVAILABLE = /^(not available|n\/a|none|-|unknown)$/i;

function clean(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function thTdPairs(html: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /<th[^>]*>\s*([\s\S]*?)\s*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const label = clean(m[1]).toLowerCase();
    const value = clean(m[2]);
    if (label && !map.has(label)) map.set(label, NOT_AVAILABLE.test(value) ? "" : value);
  }
  return map;
}

/** Fetch text with a timeout; falls back to a relaxed-TLS https request when the portal's cert chain is broken. */
async function fetchHtml(url: string, timeoutMs = 25_000): Promise<{ html: string; insecureTls: boolean }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
      redirect: "follow",
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { html: await res.text(), insecureTls: false };
  } catch (err) {
    const msg = err instanceof Error ? `${err.message} ${(err as { cause?: { code?: string } }).cause?.code ?? ""}` : String(err);
    const certProblem = /CERT|certificate|UNABLE_TO_VERIFY|self.signed|HPE_HEADER_OVERFLOW/i.test(msg);
    if (!certProblem) throw err;
    // Public read-only page; the councils' portals routinely ship incomplete
    // chains. Retry without verification and flag it in the result.
    const html = await new Promise<string>((resolve, reject) => {
      const u = new URL(url);
      const lib = u.protocol === "http:" ? http : https;
      const req = lib.request(
        u,
        {
          method: "GET",
          headers: { "User-Agent": UA, Accept: "text/html,*/*" },
          rejectUnauthorized: false,
          maxHeaderSize: 64 * 1024,
        } as https.RequestOptions,
        (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            resolve(fetchHtml(new URL(res.headers.location, url).toString(), timeoutMs).then((r) => r.html));
            res.resume();
            return;
          }
          const chunks: Buffer[] = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        }
      );
      req.setTimeout(timeoutMs, () => req.destroy(new Error("timeout")));
      req.on("error", reject);
      req.end();
    });
    return { html, insecureTls: true };
  } finally {
    clearTimeout(timer);
  }
}

export function isIdoxDetailUrl(url: string): boolean {
  return /applicationDetails\.do\?/i.test(url ?? "");
}

export function isFastwebDetailUrl(url: string): boolean {
  return /FastWebPL\/detail\.asp/i.test(url ?? "");
}

export async function fetchIdoxApplicant(sourceUrl: string): Promise<ApplicantDetails> {
  const url = sourceUrl.includes("activeTab=")
    ? sourceUrl.replace(/activeTab=[a-zA-Z]+/, "activeTab=details")
    : `${sourceUrl}&activeTab=details`;
  try {
    const { html, insecureTls } = await fetchHtml(url);
    const rows = thTdPairs(html);
    const applicantName = rows.get("applicant name") ?? "";
    if (!rows.size) return { ...EMPTY, error: "no detail table found", insecureTls };
    return {
      applicantName,
      applicantAddress: rows.get("applicant address") ?? "",
      agentName: rows.get("agent name") ?? "",
      agentCompany: rows.get("agent company name") ?? "",
      agentAddress: rows.get("agent address") ?? "",
      source: "idox-details",
      insecureTls,
    };
  } catch (err) {
    return { ...EMPTY, error: err instanceof Error ? err.message : String(err) };
  }
}

/** FastWeb detail pages label fields inline ("Applicant:", "Agent:"); best-effort. */
export async function fetchFastwebApplicant(sourceUrl: string): Promise<ApplicantDetails> {
  try {
    const { html, insecureTls } = await fetchHtml(sourceUrl);
    const text = clean(html);
    const grab = (label: string) => {
      const m = text.match(new RegExp(`${label}\\s*:?\\s*([^:]{2,120}?)(?=\\s+[A-Z][a-z]+(?: [A-Z][a-z]+)?\\s*:|$)`, "i"));
      return m ? m[1].trim() : "";
    };
    const applicantName = grab("Applicant(?: Name)?");
    const agentName = grab("Agent(?: Name)?");
    if (!applicantName && !agentName) return { ...EMPTY, error: "no applicant fields found", insecureTls };
    return {
      applicantName,
      applicantAddress: "",
      agentName,
      agentCompany: "",
      agentAddress: "",
      source: "fastweb-detail",
      insecureTls,
    };
  } catch (err) {
    return { ...EMPTY, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function fetchApplicantDetails(sourceUrl: string): Promise<ApplicantDetails> {
  if (!sourceUrl) return EMPTY;
  if (isIdoxDetailUrl(sourceUrl)) return fetchIdoxApplicant(sourceUrl);
  if (isFastwebDetailUrl(sourceUrl)) return fetchFastwebApplicant(sourceUrl);
  return EMPTY;
}

/**
 * Run `fn` over `items` with a concurrency cap and a per-host politeness
 * delay, so we never hammer one council's portal.
 */
export async function mapWithHostThrottle<T, R>(
  items: T[],
  getUrl: (item: T) => string,
  fn: (item: T) => Promise<R>,
  opts: { concurrency?: number; perHostDelayMs?: number } = {}
): Promise<R[]> {
  const concurrency = opts.concurrency ?? 4;
  const perHostDelay = opts.perHostDelayMs ?? 1500;
  const results: R[] = new Array(items.length);
  const lastHit = new Map<string, number>();
  let next = 0;

  async function worker() {
    for (;;) {
      const idx = next++;
      if (idx >= items.length) return;
      const item = items[idx];
      let host = "";
      try {
        host = new URL(getUrl(item)).hostname;
      } catch {
        host = "";
      }
      if (host) {
        const wait = (lastHit.get(host) ?? 0) + perHostDelay - Date.now();
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
        lastHit.set(host, Date.now());
      }
      results[idx] = await fn(item);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}
