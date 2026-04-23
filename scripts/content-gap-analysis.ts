/**
 * Content Gap Analysis — DataForSEO Labs
 *
 * 1. Build seed keyword list from src/lib/services.ts (core services) and
 *    src/lib/guides/* (informational/guide keywords).
 * 2. Run /dataforseo_labs/google/serp_competitors/live on a representative
 *    seed sample to discover the top organic competitors in UK SERPs.
 * 3. Pick the 10 competitors that appear most frequently across our seeds.
 * 4. For our domain (constructioncapital.co.uk) and each top-10 competitor,
 *    pull ranked keywords from /dataforseo_labs/google/ranked_keywords/live.
 * 5. Diff competitor keyword sets against our keyword set; aggregate by
 *    keyword, count how many competitors rank for it.
 * 6. Apply relevance filter (vol >= 50, KD <= 60, intent in
 *    {informational, commercial}, exclude branded competitor terms).
 * 7. Output:
 *      data/generated/serp-analysis/content-gap-{date}.json   (full data)
 *      data/generated/serp-analysis/content-gap-summary.md    (markdown)
 *
 * Uses cached DataForSEO Labs DB — no live SERP scraping cost.
 *
 * Usage:
 *   npx tsx scripts/content-gap-analysis.ts                 # full run
 *   npx tsx scripts/content-gap-analysis.ts --resume        # use cached raw
 *   npx tsx scripts/content-gap-analysis.ts --discover-only # competitors only
 *   npx tsx scripts/content-gap-analysis.ts --competitors a.com,b.com  # skip discovery
 */

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { SERVICES } from "../src/lib/services";
import { GUIDES } from "../src/lib/guides/index";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// ─── Config ─────────────────────────────────────────────────────────────────

const DATAFORSEO_AUTH = process.env.DATAFORSEO_AUTH;
const API_BASE = "https://api.dataforseo.com/v3";
const UK_LOCATION_CODE = 2826;
const OUR_DOMAIN = "constructioncapital.co.uk";

const OUT_DIR = path.join(process.cwd(), "data", "generated", "serp-analysis");
const RAW_DIR = path.join(OUT_DIR, "raw", "content-gap");
const TODAY = new Date().toISOString().slice(0, 10);

// Relevance filter
const FILTER = {
  minVolume: 50,
  maxKD: 60,
  allowedIntents: new Set(["informational", "commercial", "transactional"]),
  // Exclude keywords containing competitor brand fragments to avoid chasing
  // their branded queries.
  brandStopFragments: [
    "lendinvest", "oaknorth", "aldermore", "octopus", "shawbrook", "together",
    "paragon", "investec", "close brothers", "metro bank", "octane", "glenhawk",
    "roma finance", "kuflink", "proplend", "crowdproperty", "assetz",
    "knight frank", "savills", "cbre", "jll", "hsbc", "barclays", "lloyds",
    "natwest", "santander", "rbs", "nationwide", "halifax",
    // Our own brand
    "construction capital",
  ],
  // Keywords that suggest pure-job / off-topic intent
  offTopicFragments: [
    "salary", "jobs", "career", "graduate", "internship", "apprentice",
    "course", "msc", "phd", "degree", "training", "diploma", "qualification",
    "minecraft", "lego", "game", "gaming", "kit", "toy",
    "review", "reviews", " login", " sign in",
  ],
};

// Sample of seed keywords for competitor discovery. Cover all services and a
// handful of representative info/guide topics so we surface the right
// competitive set without paying for 135 separate SERP intersections.
const DISCOVERY_SEED_LIMIT = 40;

// Ranked-keywords pull size per domain. 1000 is the API max per call.
const RANKED_KEYWORDS_LIMIT = 1000;

// ─── CLI ────────────────────────────────────────────────────────────────────

interface Args {
  resume: boolean;
  discoverOnly: boolean;
  competitorsOverride?: string[];
  topN: number;
}

function parseArgs(): Args {
  const a = process.argv.slice(2);
  const get = (k: string): string | undefined => {
    const i = a.indexOf(k);
    return i >= 0 ? a[i + 1] : undefined;
  };
  const competitors = get("--competitors");
  return {
    resume: a.includes("--resume"),
    discoverOnly: a.includes("--discover-only"),
    competitorsOverride: competitors ? competitors.split(",").map((s) => s.trim()) : undefined,
    topN: get("--top") ? parseInt(get("--top")!, 10) : 10,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function slugifyDomain(domain: string) {
  return domain.replace(/^www\./, "").replace(/[^a-z0-9.]/gi, "_");
}

async function dfsFetch(endpoint: string, body: unknown[]): Promise<any> {
  if (!DATAFORSEO_AUTH) throw new Error("DATAFORSEO_AUTH missing in .env.local");
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
    throw new Error(`DataForSEO ${res.status} ${endpoint}: ${text.slice(0, 400)}`);
  }
  return res.json();
}

// ─── Step 1: Build seed list ────────────────────────────────────────────────

interface Seed {
  keyword: string;
  source: "service" | "guide";
  category: string;
  intent: "commercial" | "informational";
}

function buildSeeds(): Seed[] {
  const seeds: Seed[] = [];

  // Core service keywords — multiple natural phrasings per service.
  for (const svc of SERVICES) {
    const base = svc.name.toLowerCase();
    seeds.push({ keyword: base, source: "service", category: svc.slug, intent: "commercial" });
    seeds.push({ keyword: `${base} uk`, source: "service", category: svc.slug, intent: "commercial" });
    seeds.push({ keyword: `${base} broker`, source: "service", category: svc.slug, intent: "commercial" });
  }
  // Add a couple of high-intent variants
  seeds.push({ keyword: "property development finance", source: "service", category: "development-finance", intent: "commercial" });
  seeds.push({ keyword: "development finance lenders", source: "service", category: "development-finance", intent: "commercial" });
  seeds.push({ keyword: "bridging loan", source: "service", category: "bridging-loans", intent: "commercial" });
  seeds.push({ keyword: "bridging finance", source: "service", category: "bridging-loans", intent: "commercial" });
  seeds.push({ keyword: "auction finance", source: "service", category: "bridging-loans", intent: "commercial" });
  seeds.push({ keyword: "ltv calculator", source: "service", category: "calculators", intent: "informational" });
  seeds.push({ keyword: "gdv calculator", source: "service", category: "calculators", intent: "informational" });

  // Guide / informational keywords — derived from each guide slug.
  for (const g of GUIDES) {
    const kw = g.slug.replace(/-/g, " ");
    seeds.push({
      keyword: kw,
      source: "guide",
      category: g.category,
      intent: "informational",
    });
  }

  return seeds;
}

// ─── Step 2: Discover competitors via SERP intersections ────────────────────

interface CompetitorHit {
  domain: string;
  intersections: number;        // how many of our seed SERPs they appear in
  sumPositions: number;         // lower = better
  avgPosition: number;
  totalEtv: number;             // estimated traffic value across our seeds
  exampleKeywords: string[];
}

async function discoverCompetitors(seeds: Seed[], resume: boolean): Promise<CompetitorHit[]> {
  // Take a representative discovery sample: all service seeds + one guide seed
  // per category, capped at DISCOVERY_SEED_LIMIT.
  const serviceSeeds = seeds.filter((s) => s.source === "service");
  const guidesByCat = new Map<string, Seed[]>();
  for (const g of seeds.filter((s) => s.source === "guide")) {
    const list = guidesByCat.get(g.category) ?? [];
    list.push(g);
    guidesByCat.set(g.category, list);
  }
  const guideSeeds: Seed[] = [];
  for (const [, list] of guidesByCat) {
    guideSeeds.push(...list.slice(0, 2)); // 2 per category
  }
  const sample = [...serviceSeeds, ...guideSeeds].slice(0, DISCOVERY_SEED_LIMIT);
  const keywords = sample.map((s) => s.keyword);

  console.log(`\n[discover] Running SERP competitors on ${keywords.length} seed keywords…`);
  const rawFile = path.join(RAW_DIR, "01-serp-competitors.json");
  let raw = resume ? readJsonIfExists(rawFile) : null;
  if (!raw) {
    raw = await dfsFetch("/dataforseo_labs/google/serp_competitors/live", [
      {
        keywords,
        location_code: UK_LOCATION_CODE,
        language_code: "en",
        item_types: ["organic"],
        limit: 200,
      },
    ]);
    saveJson(rawFile, raw);
    const cost = (raw as any).cost || 0;
    console.log(`  → cost: $${cost.toFixed(4)} | cached at ${path.relative(process.cwd(), rawFile)}`);
  } else {
    console.log(`  ✓ Using cached SERP competitors data`);
  }

  const items = (raw as any).tasks?.[0]?.result?.[0]?.items ?? [];
  const out: CompetitorHit[] = items.map((it: any) => {
    const stripped = String(it.domain || "").replace(/^www\./, "");
    return {
      domain: stripped,
      intersections: it.keywords_count ?? 0,
      sumPositions: 0,
      avgPosition: it.avg_position ?? 0,
      totalEtv: it.etv ?? 0,
      exampleKeywords: Object.keys(it.keywords_positions ?? {}),
    };
  });

  // Strip our own domain and obvious noise: video, social, news aggregators,
  // price-comparison sites, government, retailers — not content competitors
  // for property development finance.
  const NOISE = new Set([
    "wikipedia.org", "en.wikipedia.org", "gov.uk", "british-business-bank.co.uk",
    "youtube.com", "facebook.com", "linkedin.com", "twitter.com", "x.com",
    "instagram.com", "reddit.com", "tiktok.com",
    "amazon.co.uk", "amazon.com", "ebay.co.uk", "argos.co.uk", "currys.co.uk",
    "moneysavingexpert.com", "moneysupermarket.com", "money.co.uk",
    "moneyfactscompare.co.uk", "comparethemarket.com", "uswitch.com",
    "trustpilot.com", "yell.com", "checkatrade.com",
  ]);
  // Sort by intersections desc, tiebreak by rating-like signal: visibility * etv
  const filtered = out
    .filter((c) => c.domain !== OUR_DOMAIN && !NOISE.has(c.domain))
    .sort((a, b) => b.intersections - a.intersections || b.totalEtv - a.totalEtv);
  return filtered;
}

// ─── Step 3: Ranked keywords for a domain ───────────────────────────────────

interface RankedKw {
  keyword: string;
  position: number;
  searchVolume: number | null;
  cpc: number | null;
  keywordDifficulty: number | null;
  intent: string | null;
  url: string;
  etv: number | null;
}

async function fetchRankedKeywords(domain: string, resume: boolean): Promise<RankedKw[]> {
  const file = path.join(RAW_DIR, `02-ranked-${slugifyDomain(domain)}.json`);
  let raw = resume ? readJsonIfExists(file) : null;
  if (!raw) {
    console.log(`  ↓ ranked_keywords for ${domain}`);
    try {
      raw = await dfsFetch("/dataforseo_labs/google/ranked_keywords/live", [
        {
          target: domain,
          location_code: UK_LOCATION_CODE,
          language_code: "en",
          limit: RANKED_KEYWORDS_LIMIT,
          ignore_synonyms: true,
          load_rank_absolute: true,
          filters: [
            ["ranked_serp_element.serp_item.rank_absolute", "<=", 30],
          ],
          order_by: ["keyword_data.keyword_info.search_volume,desc"],
        },
      ]);
      saveJson(file, raw);
      const cost = (raw as any).cost || 0;
      console.log(`    → cost: $${cost.toFixed(4)}`);
    } catch (err) {
      console.log(`    ✗ ${(err as Error).message.slice(0, 200)}`);
      return [];
    }
  } else {
    console.log(`  ✓ cached: ${domain}`);
  }

  const items = (raw as any).tasks?.[0]?.result?.[0]?.items ?? [];
  const rows: RankedKw[] = [];
  for (const it of items) {
    const kd = it.keyword_data ?? {};
    const info = kd.keyword_info ?? {};
    const intentInfo = kd.search_intent_info ?? {};
    const serpEl = it.ranked_serp_element?.serp_item ?? {};
    rows.push({
      keyword: kd.keyword ?? "",
      position: serpEl.rank_absolute ?? serpEl.rank_group ?? 0,
      searchVolume: info.search_volume ?? null,
      cpc: info.cpc ?? null,
      keywordDifficulty: kd.keyword_properties?.keyword_difficulty ?? null,
      intent: intentInfo.main_intent ?? null,
      url: serpEl.url ?? "",
      etv: serpEl.etv ?? null,
    });
  }
  return rows.filter((r) => r.keyword);
}

// ─── Step 4: Gap computation ────────────────────────────────────────────────

interface GapEntry {
  keyword: string;
  searchVolume: number;
  cpc: number | null;
  keywordDifficulty: number | null;
  intent: string | null;
  competitorsRanking: number;       // count of competitors ranking in top 30
  competitors: Array<{ domain: string; position: number; url: string }>;
  ourPosition: number | null;       // null if we don't rank
  opportunityScore: number;
  cluster: string;
}

function classifyCluster(kw: string): string {
  const k = kw.toLowerCase();
  if (/\b(bridging|auction)\b/.test(k)) return "bridging";
  if (/\b(mezzanine|stretch)\b/.test(k)) return "mezzanine";
  if (/\b(equity|jv|joint venture|preferred equity)\b/.test(k)) return "equity-jv";
  if (/\b(refurb|refurbishment|conversion|hmo)\b/.test(k)) return "refurbishment";
  if (/\b(commercial mortgage|commercial loan|semi-commercial)\b/.test(k)) return "commercial-mortgages";
  if (/\b(exit|development exit)\b/.test(k)) return "exit-finance";
  if (/\b(planning|section 106|cil|permitted development)\b/.test(k)) return "planning";
  if (/\b(gdv|ltv|ltc|valuation|surveyor)\b/.test(k)) return "valuation-metrics";
  if (/\b(broker|brokers|specialist)\b/.test(k)) return "brokers";
  if (/\b(rate|rates|cost|fee|fees|interest)\b/.test(k)) return "pricing";
  if (/\b(developer|developers|spv|company)\b/.test(k)) return "developer-profile";
  if (/\b(development finance|construction loan|build)\b/.test(k)) return "development-finance";
  return "general";
}

function isRelevant(row: RankedKw): { ok: boolean; reason?: string } {
  if (!row.keyword) return { ok: false, reason: "empty" };
  const k = row.keyword.toLowerCase();
  if ((row.searchVolume ?? 0) < FILTER.minVolume) return { ok: false, reason: "low-volume" };
  if (row.keywordDifficulty != null && row.keywordDifficulty > FILTER.maxKD)
    return { ok: false, reason: "high-kd" };
  if (row.intent && !FILTER.allowedIntents.has(row.intent))
    return { ok: false, reason: `intent:${row.intent}` };
  for (const f of FILTER.brandStopFragments) {
    if (k.includes(f)) return { ok: false, reason: "branded" };
  }
  for (const f of FILTER.offTopicFragments) {
    if (k.includes(f)) return { ok: false, reason: "off-topic" };
  }
  // Must be at least loosely on-topic for property finance
  const TOPIC_HINTS = [
    "finance", "loan", "loans", "lending", "lender", "lenders", "mortgage",
    "bridging", "mezzanine", "equity", "jv", "joint venture", "develop",
    "developer", "construction", "build", "build-to-rent", "refurb",
    "auction", "spv", "ltv", "ltc", "gdv", "planning", "permitted development",
    "section 106", "cil", "valuation", "broker", "capital", "funding",
    "property", "real estate", "investor", "investment", "yield", "rates",
    "rate", "interest", "fee", "fees", "calculator", "exit", "facility",
    "drawdown", "monitoring surveyor", "rics", "hmo", "btl", "buy to let",
  ];
  if (!TOPIC_HINTS.some((h) => k.includes(h))) return { ok: false, reason: "off-topic-strict" };
  return { ok: true };
}

function computeGaps(
  ourRows: RankedKw[],
  competitors: Map<string, RankedKw[]>,
): GapEntry[] {
  const ourMap = new Map<string, RankedKw>();
  for (const r of ourRows) ourMap.set(r.keyword.toLowerCase(), r);

  // Aggregate by keyword across competitors
  const agg = new Map<
    string,
    {
      sample: RankedKw;
      competitors: Map<string, { position: number; url: string }>;
    }
  >();

  for (const [domain, rows] of competitors) {
    for (const r of rows) {
      // We only consider top-10 ranks for gap candidates (real opportunities)
      if (r.position > 10) continue;
      const key = r.keyword.toLowerCase();
      const entry = agg.get(key) ?? { sample: r, competitors: new Map() };
      // Keep the strongest sample for metric reference
      if ((r.searchVolume ?? 0) > (entry.sample.searchVolume ?? 0)) entry.sample = r;
      entry.competitors.set(domain, { position: r.position, url: r.url });
      agg.set(key, entry);
    }
  }

  const gaps: GapEntry[] = [];
  for (const [key, info] of agg) {
    const our = ourMap.get(key);
    // Gap = we don't rank top 10, OR we rank but worse than median competitor
    const ourPos = our?.position ?? null;
    if (ourPos != null && ourPos <= 10) continue;
    if (info.competitors.size < 2) continue; // require at least 2 competitors for signal

    const sample = info.sample;
    const rel = isRelevant(sample);
    if (!rel.ok) continue;

    const vol = sample.searchVolume ?? 0;
    const kd = sample.keywordDifficulty ?? 50;
    const opportunityScore = Math.round((vol * info.competitors.size) / Math.max(kd, 5));

    gaps.push({
      keyword: sample.keyword,
      searchVolume: vol,
      cpc: sample.cpc,
      keywordDifficulty: sample.keywordDifficulty,
      intent: sample.intent,
      competitorsRanking: info.competitors.size,
      competitors: Array.from(info.competitors.entries()).map(([domain, v]) => ({
        domain,
        position: v.position,
        url: v.url,
      })),
      ourPosition: ourPos,
      opportunityScore,
      cluster: classifyCluster(sample.keyword),
    });
  }

  gaps.sort((a, b) => b.opportunityScore - a.opportunityScore);
  return gaps;
}

// ─── Step 5: Markdown summary ───────────────────────────────────────────────

function generateMarkdown(args: {
  ourDomain: string;
  competitors: CompetitorHit[];
  topCompetitors: string[];
  ourKeywordCount: number;
  competitorKeywordCounts: Map<string, number>;
  gaps: GapEntry[];
  totalCost: number;
}): string {
  const { ourDomain, competitors, topCompetitors, ourKeywordCount, competitorKeywordCounts, gaps, totalCost } = args;
  const md: string[] = [];
  md.push(`# Content Gap Analysis`);
  md.push("");
  md.push(`_Generated: ${new Date().toISOString()}_`);
  md.push(`_Our domain: \`${ourDomain}\` (UK)_  `);
  md.push(`_Total DataForSEO cost: $${totalCost.toFixed(4)}_`);
  md.push("");

  md.push(`## Methodology`);
  md.push("");
  md.push(`1. Seed keyword set: ${SERVICES.length} core services + ${GUIDES.length} guide keywords.`);
  md.push(`2. Competitor discovery via DataForSEO Labs **serp_competitors** (cached UK SERP DB).`);
  md.push(`3. Ranked-keyword pull (top 30) for our domain + top **${topCompetitors.length}** competitors via Labs **ranked_keywords**.`);
  md.push(`4. Gap = keyword where ≥2 competitors rank in top 10 and we do not.`);
  md.push(`5. Relevance filter: vol ≥ ${FILTER.minVolume}, KD ≤ ${FILTER.maxKD}, intent ∈ ${[...FILTER.allowedIntents].join("/")}, branded/off-topic excluded, must contain a property-finance topic hint.`);
  md.push(`6. Opportunity score = volume × competitors_ranking / max(KD, 5).`);
  md.push("");

  md.push(`## Top ${topCompetitors.length} Competitors (UK SERP overlap)`);
  md.push("");
  md.push(`| # | Domain | Intersections | Avg position | Est. traffic value | Our keywords vs theirs |`);
  md.push(`|---|--------|---------------|--------------|--------------------|------------------------|`);
  topCompetitors.forEach((d, i) => {
    const c = competitors.find((x) => x.domain === d);
    const theirCount = competitorKeywordCounts.get(d) ?? 0;
    md.push(
      `| ${i + 1} | ${d} | ${c?.intersections ?? 0} | ${(c?.avgPosition ?? 0).toFixed(1)} | $${(c?.totalEtv ?? 0).toFixed(0)} | ${ourKeywordCount} vs ${theirCount} |`,
    );
  });
  md.push("");

  md.push(`## Gap Summary`);
  md.push("");
  md.push(`- **Total gap keywords (post-filter):** ${gaps.length}`);
  const top100 = gaps.slice(0, 100);
  const sumVol = top100.reduce((s, g) => s + g.searchVolume, 0);
  md.push(`- **Combined monthly search volume of top 100 gaps:** ${sumVol.toLocaleString()}`);
  const avgKd = top100.length
    ? Math.round(top100.reduce((s, g) => s + (g.keywordDifficulty ?? 0), 0) / top100.length)
    : 0;
  md.push(`- **Avg KD of top 100 gaps:** ${avgKd}`);
  md.push("");

  // Cluster breakdown
  const byCluster = new Map<string, GapEntry[]>();
  for (const g of gaps) {
    const list = byCluster.get(g.cluster) ?? [];
    list.push(g);
    byCluster.set(g.cluster, list);
  }
  md.push(`## Gaps by Cluster`);
  md.push("");
  md.push(`| Cluster | Keywords | Total volume | Top opportunity |`);
  md.push(`|---------|----------|--------------|-----------------|`);
  const clusterRows = Array.from(byCluster.entries())
    .map(([cluster, list]) => ({
      cluster,
      count: list.length,
      vol: list.reduce((s, x) => s + x.searchVolume, 0),
      top: list[0],
    }))
    .sort((a, b) => b.vol - a.vol);
  for (const r of clusterRows) {
    md.push(`| ${r.cluster} | ${r.count} | ${r.vol.toLocaleString()} | ${r.top?.keyword ?? "—"} (vol ${r.top?.searchVolume ?? 0}, KD ${r.top?.keywordDifficulty ?? "—"}) |`);
  }
  md.push("");

  // Top 50 opportunities
  md.push(`## Top 50 Opportunities (by score)`);
  md.push("");
  md.push(`| # | Keyword | Vol | KD | Intent | # Comps | Score | Cluster | Top competitor |`);
  md.push(`|---|---------|-----|----|--------|---------|-------|---------|----------------|`);
  gaps.slice(0, 50).forEach((g, i) => {
    const top = g.competitors.sort((a, b) => a.position - b.position)[0];
    md.push(
      `| ${i + 1} | ${g.keyword} | ${g.searchVolume} | ${g.keywordDifficulty ?? "—"} | ${g.intent ?? "—"} | ${g.competitorsRanking} | ${g.opportunityScore} | ${g.cluster} | ${top?.domain} (#${top?.position}) |`,
    );
  });
  md.push("");

  // Per-cluster top 10
  md.push(`## Top 10 Opportunities per Cluster`);
  md.push("");
  for (const r of clusterRows) {
    if (r.count === 0) continue;
    md.push(`### ${r.cluster} (${r.count} keywords)`);
    md.push("");
    md.push(`| Keyword | Vol | KD | Intent | # Comps | Score |`);
    md.push(`|---------|-----|----|--------|---------|-------|`);
    const topList = (byCluster.get(r.cluster) ?? []).slice(0, 10);
    for (const g of topList) {
      md.push(
        `| ${g.keyword} | ${g.searchVolume} | ${g.keywordDifficulty ?? "—"} | ${g.intent ?? "—"} | ${g.competitorsRanking} | ${g.opportunityScore} |`,
      );
    }
    md.push("");
  }

  md.push(`## Recommended Next Actions`);
  md.push("");
  md.push(`1. **Build content for the top cluster** (${clusterRows[0]?.cluster ?? "—"}) — biggest combined volume gap.`);
  md.push(`2. **Convert top 10 informational gaps into guides** under \`src/lib/guides/\`. They share existing template + schema.`);
  md.push(`3. **Pair commercial gaps with service pages** in \`src/lib/services.ts\` or location pages where intent is local.`);
  md.push(`4. **Re-run quarterly** — \`npx tsx scripts/content-gap-analysis.ts\` — to track gap closure as new content ranks.`);
  md.push("");

  return md.join("\n");
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

  const seeds = buildSeeds();
  console.log(`\n✓ Seeds built: ${seeds.length} keywords (${seeds.filter((s) => s.source === "service").length} service / ${seeds.filter((s) => s.source === "guide").length} guide)`);

  // Step A: discover competitors (or accept override)
  let competitors: CompetitorHit[] = [];
  let topCompetitors: string[] = [];
  if (args.competitorsOverride && args.competitorsOverride.length) {
    topCompetitors = args.competitorsOverride;
    competitors = topCompetitors.map((domain) => ({
      domain, intersections: 0, sumPositions: 0, avgPosition: 0, totalEtv: 0, exampleKeywords: [],
    }));
    console.log(`\n[discover] Using override competitors: ${topCompetitors.join(", ")}`);
  } else {
    competitors = await discoverCompetitors(seeds, args.resume);
    topCompetitors = competitors.slice(0, args.topN).map((c) => c.domain);
    console.log(`\n✓ Top ${args.topN} competitors:`);
    competitors.slice(0, args.topN).forEach((c, i) =>
      console.log(`  ${i + 1}. ${c.domain.padEnd(40)} intersections=${c.intersections} avgPos=${c.avgPosition.toFixed(1)} etv=$${c.totalEtv.toFixed(0)}`),
    );
  }

  if (args.discoverOnly) {
    saveJson(path.join(OUT_DIR, `content-gap-competitors-${TODAY}.json`), { competitors, topCompetitors });
    console.log(`\n✓ Discover-only mode — wrote competitors JSON.`);
    return;
  }

  // Step B: pull ranked keywords for us + each competitor
  console.log(`\n[ranked] Fetching ranked keywords for our domain + ${topCompetitors.length} competitors…`);
  const ourRows = await fetchRankedKeywords(OUR_DOMAIN, args.resume);
  console.log(`  ✓ ${OUR_DOMAIN}: ${ourRows.length} ranked keywords`);

  const competitorRows = new Map<string, RankedKw[]>();
  const competitorKeywordCounts = new Map<string, number>();
  for (const dom of topCompetitors) {
    const rows = await fetchRankedKeywords(dom, args.resume);
    competitorRows.set(dom, rows);
    competitorKeywordCounts.set(dom, rows.length);
    console.log(`  ✓ ${dom}: ${rows.length} ranked keywords`);
  }

  // Step C: compute gaps
  console.log(`\n[gap] Computing gaps…`);
  const gaps = computeGaps(ourRows, competitorRows);
  console.log(`  → ${gaps.length} relevant gap keywords`);

  // Step D: cost summary
  let totalCost = 0;
  for (const f of fs.readdirSync(RAW_DIR)) {
    if (!f.endsWith(".json")) continue;
    const j = readJsonIfExists<any>(path.join(RAW_DIR, f));
    totalCost += j?.cost || 0;
  }

  // Step E: write outputs
  const jsonOut = {
    generatedAt: new Date().toISOString(),
    ourDomain: OUR_DOMAIN,
    locationCode: UK_LOCATION_CODE,
    seedCount: seeds.length,
    competitorsDiscovered: competitors.length,
    topCompetitors,
    competitorMetrics: competitors.slice(0, args.topN),
    ourKeywordCount: ourRows.length,
    competitorKeywordCounts: Object.fromEntries(competitorKeywordCounts),
    filter: {
      minVolume: FILTER.minVolume,
      maxKD: FILTER.maxKD,
      allowedIntents: [...FILTER.allowedIntents],
    },
    totalCost,
    gapCount: gaps.length,
    gaps,
  };
  const jsonPath = path.join(OUT_DIR, `content-gap-${TODAY}.json`);
  saveJson(jsonPath, jsonOut);
  console.log(`\n✓ JSON: ${path.relative(process.cwd(), jsonPath)}`);

  const md = generateMarkdown({
    ourDomain: OUR_DOMAIN,
    competitors,
    topCompetitors,
    ourKeywordCount: ourRows.length,
    competitorKeywordCounts,
    gaps,
    totalCost,
  });
  const mdPath = path.join(OUT_DIR, "content-gap-summary.md");
  fs.writeFileSync(mdPath, md);
  console.log(`✓ MD:   ${path.relative(process.cwd(), mdPath)}`);
  console.log(`\nTotal DataForSEO spend: $${totalCost.toFixed(4)}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
