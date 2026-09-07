/**
 * PlanIt (planit.org.uk) as a national "decided recently" feed.
 *
 * PlanIt aggregates every UK planning register. We pull permitted medium and
 * large applications by decision date, map each authority onto our own
 * county/town slugs (for sold-price data), and turn them into the same
 * Candidate shape the scraped data uses, so enrichment and the campaign push
 * are unchanged.
 *
 * API: https://www.planit.org.uk/api/  (free, page size ≤ 500, be polite)
 */

import * as fs from "fs";
import * as path from "path";

import {
  buildCandidate,
  extractPostcode,
  inferUnitsFromProposal,
  postcodeDistrict,
  readJson,
  type Candidate,
  type PlanningApplication,
  type PlanningFile,
  type SelectOptions,
} from "./planning-candidates";

const API = "https://www.planit.org.uk/api/applics/json";
const CACHE_DIR = path.join(process.cwd(), "data", "generated", "planning-outreach", "planit-cache");
const MANIFEST_PATH = path.join(process.cwd(), "data", "generated", "planning-coverage", "manifest.json");
const SOLD_DATA_DIR = path.join(process.cwd(), "data", "generated", "sold-data");

export interface PlanItRecord {
  name: string;
  uid: string;
  reference?: string;
  area_name: string;
  address: string;
  postcode: string | null;
  description: string | null;
  app_type: string | null;
  app_size: string | null;
  app_state: string | null;
  decided_date: string | null;
  start_date: string | null;
  url: string | null;
  link: string | null;
  other_fields?: Record<string, unknown>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/**
 * Fetch every permitted medium/large application decided in the last `sinceDays`.
 * Queried in 7-day decision-date windows (deep offset pages time out on PlanIt),
 * each window checkpointed to disk so a re-run resumes rather than restarts.
 */
export async function fetchPlanItPermitted(opts: { sinceDays: number; pageSize?: number; cachedOnly?: boolean; log?: (s: string) => void }): Promise<PlanItRecord[]> {
  const since = isoDaysAgo(opts.sinceDays);
  const today = new Date().toISOString().slice(0, 10);
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const finalFile = path.join(CACHE_DIR, `permitted_${since}_to_${today}.json`);
  const cached = readJson<PlanItRecord[]>(finalFile);
  if (cached) {
    opts.log?.(`  PlanIt: ${cached.length} records from cache (${path.basename(finalFile)})`);
    return cached;
  }

  // PlanIt caps a response at 1,000,000 bytes, so keep pages small and select only the fields we use.
  const pageSize = Math.min(opts.pageSize ?? 200, 300);
  const byName = new Map<string, PlanItRecord>();
  const failedWindows: string[] = [];

  // Windows are anchored to a fixed date so the same 7-day buckets (and cache files) are
  // reused whichever day the pipeline runs; records before `since` are dropped after loading.
  const ANCHOR = new Date("2026-06-11T00:00:00Z");
  const sinceDate = new Date(`${since}T00:00:00Z`);
  const firstStart = new Date(ANCHOR);
  while (firstStart > sinceDate) firstStart.setUTCDate(firstStart.getUTCDate() - 7);
  while (firstStart.getTime() + 7 * 86_400_000 <= sinceDate.getTime()) firstStart.setUTCDate(firstStart.getUTCDate() + 7);
  for (let winStart = firstStart; winStart <= new Date(`${today}T00:00:00Z`); ) {
    const winEnd = new Date(winStart);
    winEnd.setUTCDate(winEnd.getUTCDate() + 6);
    const a = winStart.toISOString().slice(0, 10);
    const b = (winEnd > new Date(`${today}T00:00:00Z`) ? today : winEnd.toISOString().slice(0, 10));
    const winFile = path.join(CACHE_DIR, `window_${a}_${b}.json`);
    let records = readJson<PlanItRecord[]>(winFile);
    if (!records && opts.cachedOnly) {
      failedWindows.push(`${a}..${b}: not cached (cachedOnly)`);
      records = [];
    }
    if (!records) {
      try {
        records = await fetchWindow(a, b, pageSize, opts.log);
        fs.writeFileSync(winFile, JSON.stringify(records), "utf-8");
      } catch (err) {
        failedWindows.push(`${a}..${b}: ${(err as Error).message}`);
        records = [];
      }
    }
    for (const r of records) {
      if (r.decided_date && r.decided_date < since) continue;
      byName.set(r.name ?? `${r.area_name}/${r.uid}`, r);
    }
    opts.log?.(`  PlanIt: ${a} to ${b}: ${records.length} records (running total ${byName.size})`);
    await sleep(3000);
    winStart = new Date(winEnd);
    winStart.setUTCDate(winStart.getUTCDate() + 1);
  }

  const all = [...byName.values()];
  if (failedWindows.length) {
    opts.log?.(`  PlanIt: ${failedWindows.length} window(s) failed and were skipped: ${failedWindows.join("; ")}`);
  } else {
    fs.writeFileSync(finalFile, JSON.stringify(all), "utf-8");
  }
  return all;
}

async function fetchWindow(from: string, to: string, pageSize: number, log?: (s: string) => void): Promise<PlanItRecord[]> {
  const out: PlanItRecord[] = [];
  let total = Infinity;
  for (let page = 1; (page - 1) * pageSize < total && page <= 60; page++) {
    const url = new URL(API);
    url.searchParams.set("decided_start", from);
    url.searchParams.set("decided_end", to);
    url.searchParams.set("app_state", "Permitted");
    url.searchParams.set("app_size", "Medium,Large");
    url.searchParams.set("pg_sz", String(pageSize));
    url.searchParams.set("page", String(page));
    url.searchParams.set("sort", "-decided_date");
    url.searchParams.set("select", "name,uid,reference,area_name,address,postcode,description,app_type,app_size,app_state,decided_date,start_date,url,link,other_fields");
    url.searchParams.set("compress", "on");

    let data: { total?: number; records?: PlanItRecord[] } | null = null;
    let lastErr = "";
    for (let attempt = 0; attempt < 6 && !data; attempt++) {
      try {
        const res = await fetch(url, { headers: { "User-Agent": "ConstructionCapital-outreach/1.0" }, signal: AbortSignal.timeout(90_000) });
        if (res.status === 429 || res.status >= 500) {
          // PlanIt throttles hard; back off for a minute or more before retrying.
          lastErr = `HTTP ${res.status}`;
          log?.(`    ${lastErr}, waiting ${60 * (attempt + 1)}s`);
          await sleep(60_000 * (attempt + 1));
          continue;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
        data = (await res.json()) as { total?: number; records?: PlanItRecord[] };
      } catch (err) {
        lastErr = (err as Error).message;
        await sleep(5_000 * (attempt + 1));
      }
    }
    if (!data) throw new Error(`page ${page} failed: ${lastErr}`);
    total = data.total ?? 0;
    out.push(...(data.records ?? []));
    log?.(`    page ${page}: ${out.length}/${total}`);
    if ((data.records ?? []).length < pageSize) break;
    await sleep(3000);
  }
  return out;
}

// ── Authority + town mapping ─────────────────────────────────────────────────

function normLpa(s: string): string {
  return (s ?? "")
    .toLowerCase()
    .replace(/\b(london borough of|royal borough of|city of|borough of|metropolitan borough|county borough|borough|district|city|council|the|and|&|of|upon|on|under)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface TownRef {
  county: string;
  town: string;
  lpa: string;
}

let lpaIndex: Map<string, TownRef[]> | null = null;
let districtIndex: Map<string, TownRef> | null = null;

function buildIndexes(): void {
  if (lpaIndex && districtIndex) return;
  lpaIndex = new Map();
  const manifest = readJson<{ rows: Array<{ county: string; town: string; lpa: string }> }>(MANIFEST_PATH);
  for (const r of manifest?.rows ?? []) {
    if (!r.lpa || !r.county || !r.town) continue;
    const key = normLpa(r.lpa);
    const list = lpaIndex.get(key) ?? [];
    if (!list.some((t) => t.county === r.county && t.town === r.town)) list.push({ county: r.county, town: r.town, lpa: r.lpa });
    lpaIndex.set(key, list);
  }

  // Postcode district → town, from the postcodes of each town's recent sales.
  districtIndex = new Map();
  const counts = new Map<string, Map<string, number>>();
  if (fs.existsSync(SOLD_DATA_DIR)) {
    for (const county of fs.readdirSync(SOLD_DATA_DIR)) {
      const countyDir = path.join(SOLD_DATA_DIR, county);
      if (!fs.statSync(countyDir).isDirectory()) continue;
      for (const town of fs.readdirSync(countyDir)) {
        const sold = readJson<{ recentTransactions?: Array<{ postcode: string }> }>(path.join(countyDir, town, "latest.json"));
        for (const t of sold?.recentTransactions ?? []) {
          const d = postcodeDistrict(t.postcode);
          if (!d) continue;
          const m = counts.get(d) ?? new Map<string, number>();
          const k = `${county}/${town}`;
          m.set(k, (m.get(k) ?? 0) + 1);
          counts.set(d, m);
        }
      }
    }
  }
  for (const [district, m] of counts) {
    const best = [...m.entries()].sort((a, b) => b[1] - a[1])[0];
    const [county, town] = best[0].split("/");
    districtIndex.set(district, { county, town, lpa: "" });
  }
}

export interface AreaMapping {
  county: string;
  town: string;
  matchedBy: "lpa+district" | "district" | "lpa" | "none";
}

/** Map a PlanIt area + site postcode onto our county/town slugs (for sold-price data). */
export function mapArea(areaName: string, postcode: string): AreaMapping {
  buildIndexes();
  const towns = lpaIndex!.get(normLpa(areaName)) ?? [];
  const district = postcodeDistrict(postcode);
  const byDistrict = district ? districtIndex!.get(district) : undefined;

  if (byDistrict && towns.some((t) => t.county === byDistrict.county && t.town === byDistrict.town)) {
    return { county: byDistrict.county, town: byDistrict.town, matchedBy: "lpa+district" };
  }
  if (byDistrict && towns.some((t) => t.county === byDistrict.county)) {
    return { county: byDistrict.county, town: byDistrict.town, matchedBy: "district" };
  }
  if (towns.length) return { county: towns[0].county, town: towns[0].town, matchedBy: "lpa" };
  if (byDistrict) return { county: byDistrict.county, town: byDistrict.town, matchedBy: "district" };
  return { county: "", town: "", matchedBy: "none" };
}

// ── Records → candidates ─────────────────────────────────────────────────────

const SKIP_APP_TYPES = new Set(["Trees", "Advertising", "Telecoms"]);
/** Not consents: screening/scoping opinions, lawfulness certificates, demolition notices, hedgerows. */
const SKIP_DESCRIPTION =
  /\b(screening opinion|scoping opinion|eia screening|environmental impact assessment (screening|scoping)|certificate of lawful|lawful development certificate|lawfulness|prior notification of (proposed )?demolition|hedgerow removal|tree preservation)\b/i;
const SEE_SOURCE = /^(see source|not available|n\/a)?$/i;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function classifyCategory(appType: string | null, description: string): string {
  const d = description.toLowerCase();
  if (/\b(change of use|conversion|convert)\b/.test(d)) return "conversion";
  if (/\b(prior approval|prior notification)\b/.test(d)) return "prior_approval";
  if (/\b(demolition)\b/.test(d) && /\b(erection|construction|new)\b/.test(d)) return "demolition_rebuild";
  if (appType === "Outline" || appType === "Full") return "new_build";
  return "other_residential";
}

export interface PlanItConversion {
  candidates: Candidate[];
  stats: {
    records: number;
    skippedType: number;
    noUnits: number;
    belowThreshold: number;
    unmappedArea: number;
    unmappedAreas: Record<string, number>;
  };
}

export function planItToCandidates(records: PlanItRecord[], opts: SelectOptions): PlanItConversion {
  const stats: PlanItConversion["stats"] = { records: records.length, skippedType: 0, noUnits: 0, belowThreshold: 0, unmappedArea: 0, unmappedAreas: {} };
  const out: Candidate[] = [];
  const seen = new Set<string>();

  for (const r of records) {
    const o = r.other_fields ?? {};
    const description = str(r.description);
    if ((r.app_type && SKIP_APP_TYPES.has(r.app_type)) || SKIP_DESCRIPTION.test(description) || /\/(SCREEN|SCOPE|EIA|EIASCR|EIASCO|LDC|CLOPUD|CLEUD|CLP|CLE|DEM|TPO|HH)\d*\b/i.test(str(r.uid))) {
      stats.skippedType++;
      continue;
    }
    const dwellings = Number(o.n_dwellings ?? o.num_dwellings ?? o.units);
    const units = Number.isFinite(dwellings) && dwellings > 0 ? Math.round(dwellings) : inferUnitsFromProposal(description);
    if (!units) {
      stats.noUnits++;
      continue;
    }
    if (units < opts.minUnits) {
      stats.belowThreshold++;
      continue;
    }

    const postcode = str(r.postcode) || extractPostcode(str(r.address));
    const area = mapArea(r.area_name, postcode);
    if (area.matchedBy === "none") {
      stats.unmappedArea++;
      stats.unmappedAreas[r.area_name] = (stats.unmappedAreas[r.area_name] ?? 0) + 1;
      continue;
    }

    const applicantName = SEE_SOURCE.test(str(o.applicant_name)) ? "" : str(o.applicant_name);
    const applicantCompany = SEE_SOURCE.test(str(o.applicant_company)) ? "" : str(o.applicant_company);
    const agentName = SEE_SOURCE.test(str(o.agent_name)) ? "" : str(o.agent_name);
    const agentCompany = SEE_SOURCE.test(str(o.agent_company)) ? "" : str(o.agent_company);

    const app: PlanningApplication = {
      reference: str(r.reference) || str(r.uid),
      address: str(r.address),
      postcode,
      ward: "",
      proposal: description,
      category: `${classifyCategory(r.app_type, description)}${r.app_type === "Conditions" ? " discharge of condition" : r.app_type === "Amendment" ? " non-material amendment" : r.app_type === "Outline" ? " outline application" : ""}`,
      units,
      estimatedGdv: null,
      status: "approved",
      decision: str(o.decision) || "Permitted",
      receivedDate: str(o.date_received) || str(r.start_date),
      decisionDate: str(r.decided_date),
      applicantName,
      applicantCompany,
      agentName,
      agentCompany,
      sourceUrl: str(r.url) || str(r.link),
    };
    const file: PlanningFile = {
      updatedAt: new Date().toISOString(),
      townSlug: area.town,
      countySlug: area.county,
      localAuthority: r.area_name,
      approvedApplications: [],
    };
    const candidate = buildCandidate(app, file, opts);
    if (!candidate) {
      stats.belowThreshold++;
      continue;
    }
    if (seen.has(candidate.key)) continue;
    seen.add(candidate.key);
    out.push(candidate);
  }
  return { candidates: out, stats };
}
