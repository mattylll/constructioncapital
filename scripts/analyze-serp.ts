/**
 * SERP Analyzer — DataForSEO-powered
 *
 * For each target keyword, fetches:
 *   1. Google UK SERP top 10 + features
 *   2. On-page content of top 5 URLs (headings, plain text, word count)
 *   3. Related keywords with volume, CPC, difficulty
 *   4. Keyword overview (volume, difficulty, intent)
 *
 * Post-processes locally:
 *   - N-gram keyword density across top 10
 *   - Industry-entity frequency (lenders, products, metrics, regulators, property types)
 *   - Competitor classification (broker / lender / directory / editorial / other)
 *
 * Output:
 *   data/generated/serp-analysis/raw/{keyword-slug}/*.json   (raw API responses)
 *   data/generated/serp-analysis/reports/{keyword-slug}.md   (markdown brief)
 *   data/generated/serp-analysis/master-brief.md             (aggregate brief)
 *
 * Usage:
 *   npx tsx scripts/analyze-serp.ts --keyword "development finance manchester"
 *   npx tsx scripts/analyze-serp.ts --site manchester-dev
 *   npx tsx scripts/analyze-serp.ts --all
 *   npx tsx scripts/analyze-serp.ts --all --type development-finance --limit 5
 *   npx tsx scripts/analyze-serp.ts --all --no-skip-fetched                   # force refresh
 *
 * Env:
 *   DATAFORSEO_AUTH (base64 "login:password" — already set in .env.local)
 */

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { MICROSITES, getMicrositeBySlug, type MicrositeConfig } from "../microsites.config";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// ─── Config ─────────────────────────────────────────────────────────────────

const DATAFORSEO_AUTH = process.env.DATAFORSEO_AUTH;
const API_BASE = "https://api.dataforseo.com/v3";
const UK_LOCATION_CODE = 2826;
const THROTTLE_MS = 150; // small jitter between parallel batches only
const OUT_DIR = path.join(process.cwd(), "data", "generated", "serp-analysis");
const RAW_DIR = path.join(OUT_DIR, "raw");
const REPORT_DIR = path.join(OUT_DIR, "reports");
const BRIEF_DIR = path.join(OUT_DIR, "briefs");
const TOP_N_PARSE = 10;

// ─── Industry entity dictionary ─────────────────────────────────────────────
// Curated UK property-development-finance entities to search for in top-ranking
// content. More reliable than generic NER for this niche.

const ENTITIES = {
  lenders: [
    "Aldermore", "LendInvest", "OakNorth", "Paragon", "HSBC", "Barclays", "Lloyds",
    "NatWest", "Santander", "RBS", "Shawbrook", "Together", "United Trust Bank",
    "Octane Capital", "Octopus Real Estate", "Assetz Capital", "Precise Mortgages",
    "West One", "MT Finance", "Hope Capital", "Alternative Bridging", "Bridgebank",
    "Glenhawk", "Roma Finance", "Avamore Capital", "Atelier Capital", "Maslow Capital",
    "Puma Property Finance", "Investec", "Close Brothers", "Secure Trust", "Metro Bank",
    "Cambridge & Counties", "Cynergy Bank", "Hampshire Trust", "InterBay",
    "Kuflink", "Proplend", "Funding Circle", "Pluto Finance", "CrowdProperty",
    "Blend Network", "Molo", "CBRE", "Savills",
  ],
  products: [
    "senior debt", "stretch senior", "mezzanine", "mezzanine finance",
    "joint venture", "JV equity", "equity finance", "preferred equity",
    "exit finance", "development exit", "bridging", "bridging finance",
    "bridging loan", "development finance", "refurbishment finance",
    "heavy refurbishment", "light refurbishment", "PDR finance",
    "permitted development", "conversion finance", "commercial bridging",
    "auction finance", "land finance", "construction finance",
  ],
  metrics: [
    "LTGDV", "LTC", "LTV", "GDV", "IRR", "ROI", "loan to cost", "loan to value",
    "loan to gross development value", "gross development value", "arrangement fee",
    "exit fee", "interest rate", "coupon", "day one", "drawdown", "facility",
  ],
  regulators: [
    "FCA", "Financial Conduct Authority", "NACFB", "FIBA", "CCA",
    "Consumer Credit Act", "PRA",
  ],
  propertyTypes: [
    "residential", "commercial", "mixed-use", "PBSA", "student accommodation",
    "BTR", "build to rent", "HMO", "house in multiple occupation", "apartment",
    "flat", "house", "townhouse", "semi-detached", "detached", "terraced",
    "new build", "off-plan", "brownfield", "greenfield", "care home",
    "industrial", "office", "retail", "hotel",
  ],
  processTerms: [
    "planning permission", "planning consent", "outline planning", "detailed planning",
    "section 106", "CIL", "community infrastructure levy", "monitoring surveyor",
    "quantity surveyor", "valuation", "RICS", "professional team", "SPV",
    "special purpose vehicle", "due diligence", "personal guarantee",
    "first charge", "second charge", "debenture", "legal charge",
  ],
};

// Common broker domains (rough heuristic for competitor classification).
// NOT exhaustive — any unknown commercial domain is "broker" by default.
const LENDER_DOMAINS = [
  "lendinvest.com", "oaknorth.co.uk", "aldermore.co.uk", "paragonbank.co.uk",
  "hsbc.co.uk", "barclays.co.uk", "lloydsbank.com", "natwest.com",
  "shawbrook.co.uk", "togethermoney.com", "utbank.co.uk", "octanecapital.co.uk",
  "octopusrealestate.com", "assetzcapital.co.uk", "westoneloans.co.uk",
  "mt-finance.com", "hopecapital.co.uk", "glenhawk.com", "romafinance.co.uk",
  "maslowcapital.com", "pumapropertyfinance.co.uk", "investec.com",
  "closebrothers.com", "securetrustbank.com", "metrobankonline.co.uk",
  "ccbank.co.uk", "cynergybank.co.uk", "htb.co.uk", "interbay.co.uk",
  "kuflink.com", "proplend.com", "plutofinance.com", "crowdproperty.com",
];
const DIRECTORY_DOMAINS = [
  "yell.com", "checkatrade.com", "trustpilot.com", "bark.com", "unbiased.co.uk",
  "moneysupermarket.com", "comparethemarket.com", "which.co.uk",
];
const EDITORIAL_DOMAINS = [
  "ft.com", "theguardian.com", "telegraph.co.uk", "bbc.co.uk", "thetimes.co.uk",
  "reuters.com", "bloomberg.com", "cityam.com", "propertyweek.com",
  "bridgingandcommercialfinance.co.uk", "mortgagestrategy.co.uk",
];

// ─── CLI parsing ────────────────────────────────────────────────────────────

interface Args {
  keyword?: string;
  site?: string;
  all: boolean;
  type?: "development-finance" | "bridging" | "niche";
  limit?: number;
  skipFetched: boolean;
  reportOnly: boolean;
  fromShortlist?: string;
}

function parseArgs(): Args {
  const a = process.argv.slice(2);
  const get = (k: string): string | undefined => {
    const i = a.indexOf(k);
    return i >= 0 ? a[i + 1] : undefined;
  };
  const has = (k: string) => a.includes(k);
  const limitStr = get("--limit");
  const typeStr = get("--type") as Args["type"];
  return {
    keyword: get("--keyword"),
    site: get("--site"),
    all: has("--all"),
    type: typeStr,
    limit: limitStr ? parseInt(limitStr, 10) : undefined,
    skipFetched: !has("--no-skip-fetched"),
    reportOnly: has("--report-only"),
    fromShortlist: get("--from-shortlist"),
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function slugify(kw: string) {
  return kw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function dataforseoFetch(endpoint: string, body: unknown[]): Promise<any> {
  if (!DATAFORSEO_AUTH) throw new Error("DATAFORSEO_AUTH not set in .env.local");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${DATAFORSEO_AUTH}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DataForSEO ${res.status} ${endpoint}: ${text.slice(0, 500)}`);
  }
  return res.json();
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function saveJson(filePath: string, data: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readJsonIfExists<T = unknown>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function classifyDomain(domain: string): "lender" | "directory" | "editorial" | "broker" | "other" {
  const d = domain.toLowerCase().replace(/^www\./, "");
  if (LENDER_DOMAINS.some((x) => d === x || d.endsWith("." + x))) return "lender";
  if (DIRECTORY_DOMAINS.some((x) => d === x || d.endsWith("." + x))) return "directory";
  if (EDITORIAL_DOMAINS.some((x) => d === x || d.endsWith("." + x))) return "editorial";
  if (d.includes("gov.uk") || d.includes("wikipedia.org")) return "other";
  return "broker";
}

// ─── Step 1: SERP ───────────────────────────────────────────────────────────

interface SerpItem {
  rank: number;
  type: string;
  url: string;
  domain: string;
  title: string;
  description: string;
  classification: ReturnType<typeof classifyDomain>;
}

interface SerpResult {
  keyword: string;
  totalResultsCount: number | null;
  items: SerpItem[];
  features: {
    hasPAA: boolean;
    paaQuestions: string[];
    hasFeaturedSnippet: boolean;
    featuredSnippetSource: string | null;
    hasAiOverview: boolean;
    relatedSearches: string[];
    hasLocalPack: boolean;
  };
  rawCost: number;
}

async function fetchSerp(keyword: string, rawDir: string, skipFetched: boolean): Promise<SerpResult> {
  const rawFile = path.join(rawDir, "01-serp.json");
  let raw = skipFetched ? readJsonIfExists(rawFile) : null;
  if (!raw) {
    console.log(`  ↓ SERP: "${keyword}"`);
    raw = await dataforseoFetch("/serp/google/organic/live/advanced", [
      {
        keyword,
        location_code: UK_LOCATION_CODE,
        language_code: "en",
        depth: 20,
        device: "desktop",
        people_also_ask_click_depth: 1,
      },
    ]);
    saveJson(rawFile, raw);
    await sleep(THROTTLE_MS);
  } else {
    console.log(`  ✓ SERP cached`);
  }

  const task = (raw as any).tasks?.[0];
  const result = task?.result?.[0];
  const items = (result?.items ?? []) as any[];

  const organic = items
    .filter((x) => x.type === "organic")
    .slice(0, 10)
    .map((x, i): SerpItem => {
      const domain = (x.domain || "").replace(/^www\./, "");
      return {
        rank: x.rank_group || x.rank_absolute || i + 1,
        type: x.type,
        url: x.url || "",
        domain,
        title: x.title || "",
        description: x.description || "",
        classification: classifyDomain(domain),
      };
    });

  const paaItems = items.filter((x) => x.type === "people_also_ask");
  const paaQuestions: string[] = [];
  for (const p of paaItems) {
    for (const it of p.items ?? []) {
      if (it.title) paaQuestions.push(it.title);
    }
  }

  const featuredSnippet = items.find((x) => x.type === "featured_snippet");
  const aiOverview = items.find((x) => x.type === "ai_overview");
  const related = items.find((x) => x.type === "related_searches");
  const localPack = items.find((x) => x.type === "local_pack");

  return {
    keyword,
    totalResultsCount: result?.se_results_count ?? null,
    items: organic,
    features: {
      hasPAA: paaQuestions.length > 0,
      paaQuestions,
      hasFeaturedSnippet: !!featuredSnippet,
      featuredSnippetSource: featuredSnippet?.domain || null,
      hasAiOverview: !!aiOverview,
      relatedSearches: related?.items?.map((x: any) => x.title || x.query).filter(Boolean) ?? [],
      hasLocalPack: !!localPack,
    },
    rawCost: (raw as any).cost || 0,
  };
}

// ─── Step 2: Content parsing (top 10) ───────────────────────────────────────

interface PageContent {
  url: string;
  rank: number;
  wordCount: number;
  plainText: string;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  fetchedOk: boolean;
  error?: string;
}

async function fetchContent(
  item: SerpItem,
  rawDir: string,
  skipFetched: boolean,
): Promise<PageContent> {
  const rawFile = path.join(rawDir, `02-content-rank${item.rank}.json`);
  let raw = skipFetched ? readJsonIfExists(rawFile) : null;
  if (!raw) {
    console.log(`  ↓ Content: rank ${item.rank} ${item.domain}`);
    try {
      raw = await dataforseoFetch("/on_page/content_parsing/live", [
        { url: item.url, enable_javascript: true },
      ]);
      saveJson(rawFile, raw);
    } catch (err) {
      console.log(`    ✗ ${(err as Error).message.slice(0, 150)}`);
      return {
        url: item.url,
        rank: item.rank,
        wordCount: 0,
        plainText: "",
        headings: { h1: [], h2: [], h3: [] },
        fetchedOk: false,
        error: (err as Error).message,
      };
    }
    await sleep(THROTTLE_MS);
  } else {
    console.log(`  ✓ Content cached rank ${item.rank}`);
  }

  const page = (raw as any).tasks?.[0]?.result?.[0]?.items?.[0]?.page_content;
  if (!page) {
    return {
      url: item.url,
      rank: item.rank,
      wordCount: 0,
      plainText: "",
      headings: { h1: [], h2: [], h3: [] },
      fetchedOk: false,
      error: "No page_content in response",
    };
  }

  // Extract text from content sections
  const sections: any[] = page.main_topic || [];
  const allText: string[] = [];
  const h1: string[] = [];
  const h2: string[] = [];
  const h3: string[] = [];

  function walk(nodes: any[] | undefined) {
    if (!nodes) return;
    for (const n of nodes) {
      if (typeof n.text === "string") allText.push(n.text);
      if (n.h_title) {
        if (n.level === 1) h1.push(n.h_title);
        else if (n.level === 2) h2.push(n.h_title);
        else if (n.level === 3) h3.push(n.h_title);
      }
      // Recursive structures seen in DataForSEO content_parsing
      if (Array.isArray(n.primary_content)) walk(n.primary_content);
      if (Array.isArray(n.secondary_content)) walk(n.secondary_content);
    }
  }

  // content_parsing returns structure under tasks[0].result[0].items[0].page_content.main_topic[]
  // Each main_topic has h_title, level, primary_content[] with {text|h_title}
  walk(sections);

  const plainText = allText.join(" ").replace(/\s+/g, " ").trim();
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  return {
    url: item.url,
    rank: item.rank,
    wordCount,
    plainText,
    headings: { h1, h2, h3 },
    fetchedOk: wordCount > 0,
  };
}

// ─── Step 3: Related keywords ───────────────────────────────────────────────

interface RelatedKeyword {
  keyword: string;
  searchVolume: number | null;
  cpc: number | null;
  competition: number | null;
  keywordDifficulty: number | null;
}

async function fetchRelatedKeywords(
  keyword: string,
  rawDir: string,
  skipFetched: boolean,
): Promise<RelatedKeyword[]> {
  // Use keyword_suggestions — more reliable for low-volume local seeds.
  // related_keywords often returns empty for niche geo keywords.
  const rawFile = path.join(rawDir, "03-keyword-suggestions.json");
  let raw = skipFetched ? readJsonIfExists(rawFile) : null;
  if (!raw) {
    console.log(`  ↓ Keyword suggestions`);
    try {
      raw = await dataforseoFetch("/dataforseo_labs/google/keyword_suggestions/live", [
        {
          keyword,
          location_code: UK_LOCATION_CODE,
          language_code: "en",
          limit: 50,
          include_seed_keyword: true,
          include_serp_info: false,
          order_by: ["keyword_info.search_volume,desc"],
        },
      ]);
      saveJson(rawFile, raw);
    } catch (err) {
      console.log(`    ✗ Suggestions: ${(err as Error).message.slice(0, 150)}`);
      return [];
    }
    await sleep(THROTTLE_MS);
  } else {
    console.log(`  ✓ Suggestions cached`);
  }

  const items = (raw as any).tasks?.[0]?.result?.[0]?.items ?? [];
  return items
    .slice(0, 50)
    .map((x: any): RelatedKeyword => {
      const info = x.keyword_info ?? {};
      const props = x.keyword_properties ?? {};
      return {
        keyword: x.keyword || "",
        searchVolume: info.search_volume ?? null,
        cpc: info.cpc ?? null,
        competition: info.competition ?? null,
        keywordDifficulty: props.keyword_difficulty ?? null,
      };
    })
    .filter((x: RelatedKeyword) => x.keyword);
}

// ─── Step 4: Keyword overview ───────────────────────────────────────────────

interface KeywordOverview {
  keyword: string;
  searchVolume: number | null;
  cpc: number | null;
  competition: number | null;
  keywordDifficulty: number | null;
  searchIntent: string | null;
}

async function fetchKeywordOverview(
  keyword: string,
  rawDir: string,
  skipFetched: boolean,
): Promise<KeywordOverview | null> {
  const rawFile = path.join(rawDir, "04-keyword-overview.json");
  let raw = skipFetched ? readJsonIfExists(rawFile) : null;
  if (!raw) {
    console.log(`  ↓ Keyword overview`);
    try {
      raw = await dataforseoFetch("/dataforseo_labs/google/keyword_overview/live", [
        {
          keywords: [keyword],
          location_code: UK_LOCATION_CODE,
          language_code: "en",
          include_serp_info: false,
        },
      ]);
      saveJson(rawFile, raw);
    } catch (err) {
      console.log(`    ✗ Overview: ${(err as Error).message.slice(0, 150)}`);
      return null;
    }
    await sleep(THROTTLE_MS);
  } else {
    console.log(`  ✓ Overview cached`);
  }

  const item = (raw as any).tasks?.[0]?.result?.[0]?.items?.[0];
  if (!item) return null;
  const info = item.keyword_info ?? {};
  const intent = item.search_intent_info?.main_intent ?? null;
  return {
    keyword: item.keyword,
    searchVolume: info.search_volume ?? null,
    cpc: info.cpc ?? null,
    competition: info.competition ?? null,
    keywordDifficulty: item.keyword_properties?.keyword_difficulty ?? null,
    searchIntent: intent,
  };
}

// ─── Post-processing: n-grams ───────────────────────────────────────────────

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "up", "about", "into", "through", "during",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "will", "would", "should", "can", "could", "may",
  "might", "must", "shall", "this", "that", "these", "those", "i", "you",
  "he", "she", "it", "we", "they", "what", "which", "who", "whom", "whose",
  "as", "so", "not", "no", "yes", "here", "there", "when", "where", "why",
  "how", "all", "any", "both", "each", "few", "more", "most", "other", "some",
  "such", "than", "too", "very", "just", "also", "our", "your", "their",
  "out", "over", "under", "then", "now", "only", "new", "one", "two", "three",
  "us", "them", "him", "her", "his", "hers", "its", "ours", "yours", "theirs",
  "s", "t", "ll", "re", "ve", "d", "m",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[£$€]/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

interface NGramEntry {
  term: string;
  totalCount: number;
  pagesContaining: number;
}

function computeNGrams(pages: PageContent[], n: number, topK: number): NGramEntry[] {
  const perPage: Array<Map<string, number>> = pages.map((p) => {
    const tokens = tokenize(p.plainText);
    const counts = new Map<string, number>();
    if (tokens.length < n) return counts;
    for (let i = 0; i <= tokens.length - n; i++) {
      const gram = tokens.slice(i, i + n).join(" ");
      if (gram.split(" ").every((x) => STOP_WORDS.has(x))) continue;
      counts.set(gram, (counts.get(gram) || 0) + 1);
    }
    return counts;
  });

  const total = new Map<string, number>();
  const pageHits = new Map<string, number>();
  for (const pageCounts of perPage) {
    pageCounts.forEach((count, term) => {
      total.set(term, (total.get(term) || 0) + count);
      pageHits.set(term, (pageHits.get(term) || 0) + 1);
    });
  }

  const arr: NGramEntry[] = [];
  total.forEach((count, term) => {
    arr.push({ term, totalCount: count, pagesContaining: pageHits.get(term) || 0 });
  });
  // Rank by pagesContaining (breadth), then totalCount (depth)
  arr.sort((a, b) => b.pagesContaining - a.pagesContaining || b.totalCount - a.totalCount);
  return arr.slice(0, topK);
}

// ─── Post-processing: entity frequency ──────────────────────────────────────

interface EntityHit {
  entity: string;
  category: string;
  totalMentions: number;
  pagesContaining: number;
}

function findEntities(pages: PageContent[]): EntityHit[] {
  const hits: EntityHit[] = [];
  for (const [category, list] of Object.entries(ENTITIES)) {
    for (const entity of list) {
      const re = new RegExp(`\\b${entity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      let totalMentions = 0;
      let pagesContaining = 0;
      for (const p of pages) {
        const m = p.plainText.match(re);
        if (m && m.length) {
          totalMentions += m.length;
          pagesContaining++;
        }
      }
      if (totalMentions > 0) {
        hits.push({ entity, category, totalMentions, pagesContaining });
      }
    }
  }
  hits.sort((a, b) => b.pagesContaining - a.pagesContaining || b.totalMentions - a.totalMentions);
  return hits;
}

// ─── Report generation ─────────────────────────────────────────────────────

interface AnalysisBundle {
  serp: SerpResult;
  pages: PageContent[];
  related: RelatedKeyword[];
  overview: KeywordOverview | null;
  nGrams: { unigrams: NGramEntry[]; bigrams: NGramEntry[]; trigrams: NGramEntry[] };
  entities: EntityHit[];
}

function generateReport(bundle: AnalysisBundle): string {
  const { serp, pages, related, overview, nGrams, entities } = bundle;
  const kw = serp.keyword;
  const okPages = pages.filter((p) => p.fetchedOk);
  const avgWords = okPages.length
    ? Math.round(okPages.reduce((s, p) => s + p.wordCount, 0) / okPages.length)
    : 0;

  const byCat = (cat: string, n = 15) =>
    entities.filter((e) => e.category === cat).slice(0, n);

  const md: string[] = [];
  md.push(`# SERP Analysis: "${kw}"`);
  md.push("");
  md.push(`_Generated: ${new Date().toISOString()}_`);
  md.push("");

  // Overview
  md.push("## Keyword Overview");
  md.push("");
  if (overview) {
    md.push(`- **Search volume (UK):** ${overview.searchVolume ?? "—"}`);
    md.push(`- **CPC (GBP):** ${overview.cpc != null ? `£${overview.cpc.toFixed(2)}` : "—"}`);
    md.push(`- **Competition:** ${overview.competition != null ? overview.competition.toFixed(2) : "—"}`);
    md.push(`- **Keyword difficulty:** ${overview.keywordDifficulty ?? "—"}`);
    md.push(`- **Search intent:** ${overview.searchIntent ?? "—"}`);
  } else {
    md.push("_No overview data returned._");
  }
  md.push("");

  // SERP features
  md.push("## SERP Features");
  md.push("");
  md.push(`- **People Also Ask:** ${serp.features.hasPAA ? `Yes (${serp.features.paaQuestions.length} questions)` : "No"}`);
  md.push(`- **Featured Snippet:** ${serp.features.hasFeaturedSnippet ? `Yes (${serp.features.featuredSnippetSource})` : "No"}`);
  md.push(`- **AI Overview:** ${serp.features.hasAiOverview ? "Yes" : "No"}`);
  md.push(`- **Local Pack:** ${serp.features.hasLocalPack ? "Yes" : "No"}`);
  md.push(`- **Total results:** ${serp.totalResultsCount?.toLocaleString() ?? "—"}`);
  md.push("");
  if (serp.features.paaQuestions.length) {
    md.push("### People Also Ask");
    md.push("");
    serp.features.paaQuestions.forEach((q) => md.push(`- ${q}`));
    md.push("");
  }
  if (serp.features.relatedSearches.length) {
    md.push("### Related Searches");
    md.push("");
    serp.features.relatedSearches.forEach((q) => md.push(`- ${q}`));
    md.push("");
  }

  // Top 10 organic
  md.push("## Top 10 Organic Results");
  md.push("");
  md.push("| Rank | Type | Domain | Title |");
  md.push("|------|------|--------|-------|");
  for (const r of serp.items) {
    md.push(`| ${r.rank} | ${r.classification} | ${r.domain} | ${r.title.replace(/\|/g, "\\|")} |`);
  }
  md.push("");

  // Competitor mix
  const mix: Record<string, number> = {};
  for (const r of serp.items) mix[r.classification] = (mix[r.classification] || 0) + 1;
  md.push("### Competitor Mix");
  md.push("");
  Object.entries(mix).forEach(([k, v]) => md.push(`- **${k}:** ${v}`));
  md.push("");

  // Content analysis
  md.push("## Content Analysis (Top 10 Pages)");
  md.push("");
  md.push(`- **Pages successfully parsed:** ${okPages.length} / ${pages.length}`);
  md.push(`- **Average word count:** ${avgWords.toLocaleString()}`);
  md.push(`- **Word count range:** ${okPages.length ? Math.min(...okPages.map((p) => p.wordCount)).toLocaleString() : "—"} – ${okPages.length ? Math.max(...okPages.map((p) => p.wordCount)).toLocaleString() : "—"}`);
  md.push("");

  for (const p of pages) {
    md.push(`### Rank ${p.rank} — ${new URL(p.url).hostname.replace(/^www\./, "")}`);
    md.push("");
    md.push(`- URL: ${p.url}`);
    md.push(`- Word count: ${p.wordCount.toLocaleString()}`);
    if (p.fetchedOk) {
      if (p.headings.h1.length) md.push(`- **H1:** ${p.headings.h1.join(" | ")}`);
      if (p.headings.h2.length) md.push(`- **H2s:**`);
      p.headings.h2.slice(0, 15).forEach((h) => md.push(`  - ${h}`));
    } else {
      md.push(`- _Failed to parse: ${p.error ?? "unknown"}_`);
    }
    md.push("");
  }

  // Entities
  md.push("## Industry Entities");
  md.push("");
  for (const cat of ["lenders", "products", "metrics", "regulators", "propertyTypes", "processTerms"]) {
    const hits = byCat(cat);
    if (!hits.length) continue;
    md.push(`### ${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
    md.push("");
    md.push(`| Entity | Mentions | Pages |`);
    md.push(`|--------|----------|-------|`);
    for (const h of hits) {
      md.push(`| ${h.entity} | ${h.totalMentions} | ${h.pagesContaining} / ${okPages.length} |`);
    }
    md.push("");
  }

  // N-grams
  md.push("## Keyword Density (n-grams)");
  md.push("");
  md.push("Sorted by _pages containing_ (breadth across the top-ranking set), then total count.");
  md.push("");
  const dumpNGrams = (label: string, arr: NGramEntry[]) => {
    md.push(`### ${label}`);
    md.push("");
    md.push(`| Term | Pages | Total |`);
    md.push(`|------|-------|-------|`);
    arr.slice(0, 25).forEach((e) =>
      md.push(`| ${e.term} | ${e.pagesContaining} / ${okPages.length} | ${e.totalCount} |`),
    );
    md.push("");
  };
  dumpNGrams("Unigrams (top 25)", nGrams.unigrams);
  dumpNGrams("Bigrams (top 25)", nGrams.bigrams);
  dumpNGrams("Trigrams (top 25)", nGrams.trigrams);

  // Related keywords
  md.push("## Related Keywords");
  md.push("");
  if (related.length) {
    md.push(`| Keyword | Volume | CPC (£) | Competition | KD |`);
    md.push(`|---------|--------|---------|-------------|-----|`);
    for (const r of related.slice(0, 30)) {
      md.push(
        `| ${r.keyword} | ${r.searchVolume ?? "—"} | ${r.cpc != null ? r.cpc.toFixed(2) : "—"} | ${r.competition != null ? r.competition.toFixed(2) : "—"} | ${r.keywordDifficulty ?? "—"} |`,
      );
    }
  } else {
    md.push("_No related keyword data returned._");
  }
  md.push("");

  // Redesign implications
  md.push("## Redesign Implications");
  md.push("");
  const impl: string[] = [];
  if (avgWords > 0) impl.push(`**Target word count:** aim for ~${Math.max(1500, avgWords)} words (top-5 avg: ${avgWords}).`);
  if (serp.features.paaQuestions.length)
    impl.push(`**FAQ must answer PAA:** ${serp.features.paaQuestions.slice(0, 5).join("; ")}.`);
  const stakesBigrams = nGrams.bigrams.filter((g) => g.pagesContaining >= Math.ceil(okPages.length / 2));
  if (stakesBigrams.length)
    impl.push(`**Table-stakes phrases (on ${Math.ceil(okPages.length / 2)}+ pages):** ${stakesBigrams.slice(0, 10).map((x) => `"${x.term}"`).join(", ")}.`);
  const topLenders = byCat("lenders", 10).filter((e) => e.pagesContaining >= 2);
  if (topLenders.length)
    impl.push(`**Lenders to name on the page:** ${topLenders.map((x) => x.entity).join(", ")}.`);
  const topMetrics = byCat("metrics", 10).filter((e) => e.pagesContaining >= Math.ceil(okPages.length / 2));
  if (topMetrics.length)
    impl.push(`**Finance metrics to surface:** ${topMetrics.map((x) => x.entity).join(", ")}.`);
  const brokerCount = mix.broker || 0;
  const lenderCount = mix.lender || 0;
  impl.push(`**Competitive set:** ${brokerCount} broker pages, ${lenderCount} lender pages in top 10 — ${brokerCount >= 5 ? "broker-dominated SERP, positioning should lean 'specialist broker'" : "lender-dominated SERP, content must out-compete lenders on depth/locality"}.`);

  impl.forEach((s, i) => md.push(`${i + 1}. ${s}`));
  md.push("");

  return md.join("\n");
}

// ─── JSON brief (machine-readable output for rewriters) ────────────────────

interface BriefPage {
  rank: number;
  url: string;
  domain: string;
  classification: string;
  h1: string[];
  h2: string[];
  h3: string[];
  wordCount: number;
  fetchedOk: boolean;
}

interface BriefOutput {
  keyword: string;
  slug: string;
  generatedAt: string;
  overview: {
    searchVolume: number | null;
    cpc: number | null;
    keywordDifficulty: number | null;
    searchIntent: string | null;
  };
  serpFeatures: SerpResult["features"];
  competitorMix: Record<string, number>;
  top10: BriefPage[];
  aggregates: {
    pagesParsed: number;
    avgWordCount: number;
    minWordCount: number;
    maxWordCount: number;
    targetWordCount: number;
    dominantH2s: Array<{ heading: string; pagesContaining: number; sources: number[] }>;
    topEntities: Array<{ entity: string; category: string; mentions: number; pages: number }>;
    consensusDensity: {
      unigrams: Array<{ term: string; pagesContaining: number; totalCount: number }>;
      bigrams: Array<{ term: string; pagesContaining: number; totalCount: number }>;
      trigrams: Array<{ term: string; pagesContaining: number; totalCount: number }>;
    };
  };
  related: RelatedKeyword[];
}

function buildBrief(kw: string, bundle: AnalysisBundle): BriefOutput {
  const { serp, pages, related, overview, nGrams, entities } = bundle;
  const okPages = pages.filter((p) => p.fetchedOk);
  const wordCounts = okPages.map((p) => p.wordCount);
  const avg = wordCounts.length ? Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length) : 0;
  const min = wordCounts.length ? Math.min(...wordCounts) : 0;
  const max = wordCounts.length ? Math.max(...wordCounts) : 0;

  // Dominant H2s: cluster by normalised form. Two H2s are the "same" if their
  // token sets (post-stopword, lowercased) share a Jaccard similarity ≥ 0.5.
  const normalize = (s: string) =>
    new Set(
      s.toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP_WORDS.has(w)),
    );
  const jaccard = (a: Set<string>, b: Set<string>) => {
    if (!a.size || !b.size) return 0;
    let inter = 0;
    a.forEach((x) => { if (b.has(x)) inter++; });
    return inter / (a.size + b.size - inter);
  };
  interface Cluster { canonical: string; pages: Set<number>; allForms: string[]; norm: Set<string> }
  const clusters: Cluster[] = [];
  for (const p of okPages) {
    for (const h2 of p.headings.h2) {
      const trimmed = h2.trim();
      if (!trimmed) continue;
      const norm = normalize(trimmed);
      if (norm.size === 0) continue;
      let matched = false;
      for (const c of clusters) {
        if (jaccard(norm, c.norm) >= 0.5) {
          c.pages.add(p.rank);
          c.allForms.push(trimmed);
          matched = true;
          break;
        }
      }
      if (!matched) {
        clusters.push({ canonical: trimmed, pages: new Set([p.rank]), allForms: [trimmed], norm });
      }
    }
  }
  const dominantH2s = clusters
    .filter((c) => c.pages.size >= 2)
    .sort((a, b) => b.pages.size - a.pages.size)
    .slice(0, 25)
    .map((c) => ({
      heading: c.canonical,
      pagesContaining: c.pages.size,
      sources: Array.from(c.pages).sort((a, b) => a - b),
    }));

  const topEntities = entities
    .slice(0, 30)
    .map((e) => ({
      entity: e.entity,
      category: e.category,
      mentions: e.totalMentions,
      pages: e.pagesContaining,
    }));

  const consensusThreshold = Math.max(2, Math.ceil(okPages.length / 2));
  const consensus = (arr: NGramEntry[]) =>
    arr
      .filter((g) => g.pagesContaining >= consensusThreshold)
      .slice(0, 30)
      .map((g) => ({ term: g.term, pagesContaining: g.pagesContaining, totalCount: g.totalCount }));

  const competitorMix: Record<string, number> = {};
  for (const r of serp.items) competitorMix[r.classification] = (competitorMix[r.classification] || 0) + 1;

  const top10: BriefPage[] = pages.map((p) => {
    const serpItem = serp.items.find((x) => x.rank === p.rank);
    return {
      rank: p.rank,
      url: p.url,
      domain: serpItem?.domain ?? new URL(p.url).hostname.replace(/^www\./, ""),
      classification: serpItem?.classification ?? "other",
      h1: p.headings.h1,
      h2: p.headings.h2,
      h3: p.headings.h3,
      wordCount: p.wordCount,
      fetchedOk: p.fetchedOk,
    };
  });

  return {
    keyword: kw,
    slug: slugify(kw),
    generatedAt: new Date().toISOString(),
    overview: {
      searchVolume: overview?.searchVolume ?? null,
      cpc: overview?.cpc ?? null,
      keywordDifficulty: overview?.keywordDifficulty ?? null,
      searchIntent: overview?.searchIntent ?? null,
    },
    serpFeatures: serp.features,
    competitorMix,
    top10,
    aggregates: {
      pagesParsed: okPages.length,
      avgWordCount: avg,
      minWordCount: min,
      maxWordCount: max,
      targetWordCount: Math.max(1800, Math.round(avg * 1.1)),
      dominantH2s,
      topEntities,
      consensusDensity: {
        unigrams: consensus(nGrams.unigrams),
        bigrams: consensus(nGrams.bigrams),
        trigrams: consensus(nGrams.trigrams),
      },
    },
    related,
  };
}

// ─── Analyze one keyword ────────────────────────────────────────────────────

async function analyzeKeyword(
  keyword: string,
  opts: { skipFetched: boolean; reportOnly: boolean },
): Promise<AnalysisBundle> {
  const slug = slugify(keyword);
  const rawDir = path.join(RAW_DIR, slug);
  ensureDir(rawDir);

  console.log(`\n━━━ ${keyword} ━━━`);

  let serp: SerpResult;
  let pages: PageContent[];
  let related: RelatedKeyword[];
  let overview: KeywordOverview | null;

  const skip = opts.reportOnly ? true : opts.skipFetched;
  if (opts.reportOnly) {
    const serpRaw = readJsonIfExists(path.join(rawDir, "01-serp.json"));
    if (!serpRaw) throw new Error(`No cached SERP for "${keyword}" — remove --report-only`);
  }

  // SERP first — content fetches depend on its URLs.
  serp = await fetchSerp(keyword, rawDir, skip);

  // Now fan out: all content fetches + suggestions + overview in parallel.
  const contentPromises = serp.items.slice(0, TOP_N_PARSE).map((item) => fetchContent(item, rawDir, skip));
  const suggestionsPromise = fetchRelatedKeywords(keyword, rawDir, skip);
  const overviewPromise = fetchKeywordOverview(keyword, rawDir, skip);
  const results = await Promise.all([
    Promise.all(contentPromises),
    suggestionsPromise,
    overviewPromise,
  ]);
  pages = results[0];
  related = results[1];
  overview = results[2];

  const nGrams = {
    unigrams: computeNGrams(pages, 1, 60),
    bigrams: computeNGrams(pages, 2, 60),
    trigrams: computeNGrams(pages, 3, 60),
  };
  const entities = findEntities(pages);

  const bundle: AnalysisBundle = { serp, pages, related, overview, nGrams, entities };
  const report = generateReport(bundle);
  const reportFile = path.join(REPORT_DIR, `${slug}.md`);
  ensureDir(REPORT_DIR);
  fs.writeFileSync(reportFile, report);
  console.log(`  → Report: ${path.relative(process.cwd(), reportFile)}`);

  const brief = buildBrief(keyword, bundle);
  const briefFile = path.join(BRIEF_DIR, `${slug}.json`);
  ensureDir(BRIEF_DIR);
  fs.writeFileSync(briefFile, JSON.stringify(brief, null, 2));
  console.log(`  → Brief:  ${path.relative(process.cwd(), briefFile)}`);

  return bundle;
}

// ─── Keyword resolution for microsites ──────────────────────────────────────

function keywordsForSite(site: MicrositeConfig): string[] {
  const loc = site.locationName.toLowerCase();
  if (site.type === "development-finance") {
    // Run both phrasings — canonical "development finance [loc]" is polluted at
    // several cities by MSc courses / international dev finance; pair with the
    // cleaner "property development finance [loc]" to pick a per-site winner.
    return [`development finance ${loc}`, `property development finance ${loc}`];
  }
  if (site.type === "bridging") {
    return [`bridging finance ${loc}`, `bridging loans ${loc}`];
  }
  if (site.type === "niche") {
    const nicheMap: Record<string, string> = {
      "ssas-property": "ssas property finance",
      "sipp-property": "sipp property finance",
      "tradesman-finance": "tradesman finance",
    };
    return [nicheMap[site.slug] || site.brandName.toLowerCase()];
  }
  return [];
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  if (!DATAFORSEO_AUTH) {
    console.error("✗ DATAFORSEO_AUTH missing in .env.local");
    process.exit(1);
  }

  ensureDir(OUT_DIR);
  ensureDir(RAW_DIR);
  ensureDir(REPORT_DIR);
  ensureDir(BRIEF_DIR);

  // Build target keyword list
  const targets: Array<{ keyword: string; site?: MicrositeConfig }> = [];

  if (args.keyword) {
    targets.push({ keyword: args.keyword });
  } else if (args.fromShortlist) {
    const shortlistPath = path.isAbsolute(args.fromShortlist)
      ? args.fromShortlist
      : path.join(process.cwd(), args.fromShortlist);
    const shortlist = JSON.parse(fs.readFileSync(shortlistPath, "utf8")) as {
      entries: Array<{ primaryKeyword: string }>;
    };
    for (const entry of shortlist.entries) {
      targets.push({ keyword: entry.primaryKeyword });
    }
    console.log(`✓ Loaded ${targets.length} keywords from ${path.basename(shortlistPath)}`);
  } else if (args.site) {
    const s = getMicrositeBySlug(args.site);
    if (!s) {
      console.error(`✗ Unknown site: ${args.site}`);
      process.exit(1);
    }
    for (const kw of keywordsForSite(s)) targets.push({ keyword: kw, site: s });
  } else if (args.all) {
    const sites = args.type ? MICROSITES.filter((m) => m.type === args.type) : MICROSITES;
    for (const s of sites) {
      for (const kw of keywordsForSite(s)) targets.push({ keyword: kw, site: s });
    }
  } else {
    console.error(
      "Usage: --keyword <kw> | --site <slug> | --all [--type <t>] [--limit N] | --from-shortlist <path>",
    );
    process.exit(1);
  }

  const limited = args.limit ? targets.slice(0, args.limit) : targets;
  console.log(`Targets: ${limited.length}${args.limit ? ` (limited from ${targets.length})` : ""}`);
  if (args.skipFetched) console.log("Resume mode: skipping keywords with cached raw data.");
  else console.log("Refresh mode: re-fetching all keywords.");

  const summaryRows: Array<{
    keyword: string;
    siteSlug?: string;
    siteType?: string;
    volume: number | null;
    kd: number | null;
    top3Domains: string[];
    pagesParsed: number;
    avgWords: number;
    topBigrams: string[];
    topLenders: string[];
  }> = [];

  for (let i = 0; i < limited.length; i++) {
    const t = limited[i];
    console.log(`\n[${i + 1}/${limited.length}] ${t.keyword}${t.site ? ` (${t.site.slug})` : ""}`);
    try {
      const bundle = await analyzeKeyword(t.keyword, {
        skipFetched: args.skipFetched,
        reportOnly: args.reportOnly,
      });
      const ok = bundle.pages.filter((p) => p.fetchedOk);
      summaryRows.push({
        keyword: t.keyword,
        siteSlug: t.site?.slug,
        siteType: t.site?.type,
        volume: bundle.overview?.searchVolume ?? null,
        kd: bundle.overview?.keywordDifficulty ?? null,
        top3Domains: bundle.serp.items.slice(0, 3).map((x) => x.domain),
        pagesParsed: ok.length,
        avgWords: ok.length ? Math.round(ok.reduce((s, p) => s + p.wordCount, 0) / ok.length) : 0,
        topBigrams: bundle.nGrams.bigrams
          .filter((g) => g.pagesContaining >= Math.ceil(ok.length / 2))
          .slice(0, 5)
          .map((g) => g.term),
        topLenders: bundle.entities
          .filter((e) => e.category === "lenders" && e.pagesContaining >= 2)
          .slice(0, 5)
          .map((e) => e.entity),
      });
    } catch (err) {
      console.error(`  ✗ Failed: ${(err as Error).message}`);
    }
  }

  // Master brief
  const masterPath = path.join(OUT_DIR, "master-brief.md");
  const m: string[] = [];
  m.push(`# SERP Analysis — Master Brief`);
  m.push("");
  m.push(`_Generated: ${new Date().toISOString()}_`);
  m.push(`_Keywords analysed: ${summaryRows.length}_`);
  m.push("");
  m.push("## Summary Table");
  m.push("");
  m.push("| Keyword | Site | Type | Vol | KD | Words (avg) | Top 3 domains |");
  m.push("|---------|------|------|-----|----|-------------|---------------|");
  for (const r of summaryRows) {
    m.push(
      `| ${r.keyword} | ${r.siteSlug ?? "—"} | ${r.siteType ?? "—"} | ${r.volume ?? "—"} | ${r.kd ?? "—"} | ${r.avgWords} | ${r.top3Domains.join(", ")} |`,
    );
  }
  m.push("");

  // Per-site keyword winner (dev-finance and bridging each have 2 phrasings)
  const perSite = new Map<string, typeof summaryRows>();
  for (const r of summaryRows) {
    if (!r.siteSlug) continue;
    const list = perSite.get(r.siteSlug) ?? [];
    list.push(r);
    perSite.set(r.siteSlug, list);
  }
  const multiKeywordSites = Array.from(perSite.entries()).filter(([, list]) => list.length >= 2);
  if (multiKeywordSites.length > 0) {
    m.push("## Per-Site Keyword Winner");
    m.push("");
    m.push("For sites with multiple phrasings tested. Winner = higher volume; ties broken by lower KD.");
    m.push("");
    m.push("| Site | Type | Winner (vol) | Loser (vol) | Δ |");
    m.push("|------|------|--------------|-------------|---|");
    for (const [slug, list] of multiKeywordSites) {
      const sorted = [...list].sort((a, b) => {
        const av = a.volume ?? -1;
        const bv = b.volume ?? -1;
        if (av !== bv) return bv - av;
        return (a.kd ?? 100) - (b.kd ?? 100);
      });
      const w = sorted[0];
      const l = sorted[1];
      m.push(
        `| ${slug} | ${w.siteType ?? "—"} | ${w.keyword} (${w.volume ?? "—"}) | ${l.keyword} (${l.volume ?? "—"}) | ${(w.volume ?? 0) - (l.volume ?? 0)} |`,
      );
    }
    m.push("");
  }

  // Aggregate entity frequency across all keywords (pilot-useful)
  m.push("## Table-Stakes Across Network");
  m.push("");
  m.push(
    "Top bigrams and lenders appearing across the most keyword reports — these are the shared patterns the new template must cover regardless of location.",
  );
  m.push("");
  const allBigrams = new Map<string, number>();
  const allLenders = new Map<string, number>();
  for (const r of summaryRows) {
    for (const b of r.topBigrams) allBigrams.set(b, (allBigrams.get(b) || 0) + 1);
    for (const l of r.topLenders) allLenders.set(l, (allLenders.get(l) || 0) + 1);
  }
  const topBigramsNet = Array.from(allBigrams.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20);
  const topLendersNet = Array.from(allLenders.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20);
  m.push("### Bigrams");
  m.push("");
  m.push("| Bigram | Keywords containing it |");
  m.push("|--------|------------------------|");
  topBigramsNet.forEach(([b, c]) => m.push(`| ${b} | ${c} / ${summaryRows.length} |`));
  m.push("");
  m.push("### Lenders");
  m.push("");
  m.push("| Lender | Keywords mentioning |");
  m.push("|--------|---------------------|");
  topLendersNet.forEach(([l, c]) => m.push(`| ${l} | ${c} / ${summaryRows.length} |`));
  m.push("");

  fs.writeFileSync(masterPath, m.join("\n"));
  console.log(`\n✓ Master brief: ${path.relative(process.cwd(), masterPath)}`);
  console.log(`✓ Per-keyword reports: ${path.relative(process.cwd(), REPORT_DIR)}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
