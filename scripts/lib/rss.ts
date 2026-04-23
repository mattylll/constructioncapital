/**
 * Minimal, zero-dependency RSS/Atom fetcher.
 *
 * Handles both RSS 2.0 (`<item>`) and Atom (`<entry>`). Parses the fields
 * we actually care about — title, link, pubDate/published, summary — and
 * ignores everything else. Swap to `fast-xml-parser` or `rss-parser` if
 * feed quirks ever outgrow this.
 */

export interface FeedItem {
  feedId: string;
  feedName: string;
  title: string;
  link: string;
  published: string; // ISO
  summary: string;
}

const USER_AGENT =
  "ConstructionCapitalDailyBrief/1.0 (+https://constructioncapital.co.uk)";

export async function fetchFeed(
  source: { id: string; name: string; url: string }
): Promise<FeedItem[]> {
  let xml: string;
  try {
    const res = await fetch(source.url, {
      headers: {
        "user-agent": USER_AGENT,
        accept: "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.5",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.warn(`[rss] ${source.id} returned ${res.status}`);
      return [];
    }
    xml = await res.text();
  } catch (err) {
    console.warn(`[rss] ${source.id} fetch failed:`, (err as Error).message);
    return [];
  }

  const items = xml.includes("<item")
    ? parseRss(xml)
    : xml.includes("<entry")
      ? parseAtom(xml)
      : [];

  return items.map((item) => ({
    feedId: source.id,
    feedName: source.name,
    title: stripHtml(item.title),
    link: item.link,
    published: item.published,
    summary: stripHtml(item.summary).slice(0, 500),
  }));
}

interface RawItem {
  title: string;
  link: string;
  published: string;
  summary: string;
}

function parseRss(xml: string): RawItem[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
  return items.map((raw) => ({
    title: pick(raw, "title"),
    link: pick(raw, "link") || pickAttr(raw, "link", "href"),
    published:
      toIso(pick(raw, "pubDate")) ||
      toIso(pick(raw, "dc:date")) ||
      new Date().toISOString(),
    summary: pick(raw, "description") || pick(raw, "content:encoded") || "",
  }));
}

function parseAtom(xml: string): RawItem[] {
  const entries = xml.match(/<entry[\s\S]*?<\/entry>/g) ?? [];
  return entries.map((raw) => ({
    title: pick(raw, "title"),
    link: pickAttr(raw, "link", "href") || pick(raw, "id"),
    published:
      toIso(pick(raw, "published")) ||
      toIso(pick(raw, "updated")) ||
      new Date().toISOString(),
    summary: pick(raw, "summary") || pick(raw, "content") || "",
  }));
}

function pick(raw: string, tag: string): string {
  const m = raw.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!m) return "";
  const inner = m[1].trim();
  // Strip CDATA wrapper if present
  return inner.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function pickAttr(raw: string, tag: string, attr: string): string {
  const m = raw.match(new RegExp(`<${tag}[^>]*${attr}="([^"]+)"`, "i"));
  return m ? m[1] : "";
}

function toIso(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "" : d.toISOString();
}

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
