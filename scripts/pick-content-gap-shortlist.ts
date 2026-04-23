/**
 * Pick the top-30 content gap shortlist for wave 1.
 *
 * Reads:  data/generated/serp-analysis/content-gap-{date}.json (latest)
 * Writes: data/generated/serp-analysis/content-gap-shortlist-30.json
 *
 * Logic:
 *  1. Load all gaps from the latest content-gap-*.json
 *  2. Drop topically-wrong items (equity release ≠ developer equity, etc.)
 *  3. Dedupe near-duplicates by Jaccard token similarity (>=0.7) — keep the
 *     highest-scoring representative; record the rest as `secondaryKeywords`
 *  4. Apply cluster diversity caps: at least 1 from each represented cluster,
 *     max 8 from any single cluster
 *  5. Pick top 30 by opportunityScore (post-dedupe, post-cap)
 *  6. Slugify; collision-check against existing GUIDES; suggest category +
 *     relatedServices per cluster
 *
 * Usage:
 *   npx tsx scripts/pick-content-gap-shortlist.ts                    # wave 1
 *   npx tsx scripts/pick-content-gap-shortlist.ts --wave 2           # wave 2 (auto-excludes wave 1)
 *   npx tsx scripts/pick-content-gap-shortlist.ts --size 50          # custom batch size
 *   npx tsx scripts/pick-content-gap-shortlist.ts --exclude file1,…  # explicit exclude list
 */

import * as fs from "fs";
import * as path from "path";
import { GUIDES } from "../src/lib/guides/index";
import type { GuideCategory } from "../src/lib/guides/types";

const DEFAULT_SIZE = 30;
const MAX_PER_CLUSTER = 8;
const JACCARD_THRESHOLD = 0.7;

const OUT_DIR = path.join(process.cwd(), "data", "generated", "serp-analysis");

// ─── CLI ─────────────────────────────────────────────────────────────────────

interface Args {
  wave: number;
  size: number;
  exclude: string[];
}

function parseArgs(): Args {
  const a = process.argv.slice(2);
  const get = (k: string): string | undefined => {
    const i = a.indexOf(k);
    return i >= 0 ? a[i + 1] : undefined;
  };
  const wave = parseInt(get("--wave") ?? "1", 10);
  const size = parseInt(get("--size") ?? String(DEFAULT_SIZE), 10);
  const exclude = (get("--exclude") ?? "").split(",").map((s) => s.trim()).filter(Boolean);

  // Auto-exclude prior wave shortlists when wave > 1
  if (wave > 1 && !exclude.length) {
    for (let w = 1; w < wave; w++) {
      const f = path.join(OUT_DIR, `content-gap-shortlist-wave-${w}.json`);
      if (fs.existsSync(f)) exclude.push(f);
    }
    // Back-compat: wave-1 was originally written as shortlist-30.json
    if (wave > 1) {
      const legacy = path.join(OUT_DIR, "content-gap-shortlist-30.json");
      if (fs.existsSync(legacy) && !exclude.includes(legacy)) exclude.push(legacy);
    }
  }

  return { wave, size, exclude };
}

// ─── Cluster → guide metadata mapping ────────────────────────────────────────

const CLUSTER_TO_CATEGORY: Record<string, GuideCategory> = {
  bridging: "bridging",
  "commercial-mortgages": "commercial",
  "exit-finance": "structuring",
  "development-finance": "development-finance",
  mezzanine: "mezzanine",
  "equity-jv": "equity",
  refurbishment: "refurbishment",
  brokers: "comparison",
  pricing: "valuations",
  planning: "legal",
  "valuation-metrics": "valuations",
  "developer-profile": "application",
  general: "general",
};

const CLUSTER_TO_SERVICES: Record<string, string[]> = {
  bridging: ["bridging-loans"],
  "commercial-mortgages": ["commercial-mortgages"],
  "exit-finance": ["development-exit-finance"],
  "development-finance": ["development-finance"],
  mezzanine: ["mezzanine-finance"],
  "equity-jv": ["equity-jv"],
  refurbishment: ["refurbishment-finance"],
  brokers: ["development-finance", "bridging-loans"],
  pricing: ["bridging-loans", "development-finance"],
  planning: ["development-finance"],
  "valuation-metrics": ["development-finance"],
  "developer-profile": ["development-finance"],
  general: [],
};

// Drop these keywords entirely — clustered wrong or off-topic for our audience
const TOPIC_BLOCKLIST: RegExp[] = [
  /equity release/i,         // retiree product, not developer JV equity
  /debt consolidation/i,     // consumer debt, not developer
  /home improvement/i,       // homeowner, not developer
  /capital employed/i,       // accounting term, not relevant intent
  /\baria finance\b/i,       // brand match (competitor)
  /minecraft|lego|game/i,    // off-topic noise (just-in-case)
];

// ─── Helpers ────────────────────────────────────────────────────────────────

interface RawGap {
  keyword: string;
  searchVolume: number;
  cpc: number | null;
  keywordDifficulty: number | null;
  intent: string | null;
  competitorsRanking: number;
  competitors: Array<{ domain: string; position: number; url: string }>;
  ourPosition: number | null;
  opportunityScore: number;
  cluster: string;
}

interface ShortlistEntry {
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  cluster: string;
  suggestedCategory: GuideCategory;
  suggestedRelatedServices: string[];
  searchVolume: number;
  totalSecondaryVolume: number;
  keywordDifficulty: number | null;
  intent: string | null;
  opportunityScore: number;
  competitorsRanking: number;
  topCompetitor: { domain: string; position: number; url: string } | null;
}

const STOP = new Set([
  "the", "a", "an", "of", "for", "to", "in", "on", "at", "by", "with", "and",
  "or", "is", "are", "was", "were", "be", "do", "does", "did", "how", "what",
  "which", "who", "when", "where", "why", "uk", "you", "your", "i", "me", "my",
]);

function tokenSet(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .map(stem)
      .filter((w) => w.length > 1 && !STOP.has(w)),
  );
}

function stem(w: string): string {
  // Crude stemmer — enough for dedupe of "loans"/"loan", "rates"/"rate"
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 3 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s")) return w.slice(0, -1);
  if (w.length > 4 && w.endsWith("ing")) return w.slice(0, -3);
  return w;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function findLatestGapFile(): string {
  const files = fs
    .readdirSync(OUT_DIR)
    .filter((f) => /^content-gap-\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort()
    .reverse();
  if (!files.length) throw new Error("No content-gap-*.json file found in " + OUT_DIR);
  return path.join(OUT_DIR, files[0]);
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs();
  const inputPath = findLatestGapFile();
  console.log(`✓ Reading ${path.relative(process.cwd(), inputPath)}`);
  console.log(`✓ Wave ${args.wave}, batch size ${args.size}`);
  const data = JSON.parse(fs.readFileSync(inputPath, "utf8")) as { gaps: RawGap[] };

  // Step 0: load excluded keywords from prior shortlists
  const excludedKeywords = new Set<string>();
  for (const f of args.exclude) {
    const prior = JSON.parse(fs.readFileSync(f, "utf8")) as { entries: Array<{ primaryKeyword: string; secondaryKeywords: string[] }> };
    for (const e of prior.entries) {
      excludedKeywords.add(e.primaryKeyword.toLowerCase());
      for (const s of e.secondaryKeywords) excludedKeywords.add(s.toLowerCase());
    }
    console.log(`  ✓ Excluding ${prior.entries.length} entries from ${path.basename(f)}`);
  }

  // Step 1: drop topically-wrong items + previously-shortlisted
  const filtered = data.gaps.filter(
    (g) => !TOPIC_BLOCKLIST.some((re) => re.test(g.keyword)) && !excludedKeywords.has(g.keyword.toLowerCase()),
  );
  console.log(`✓ ${data.gaps.length} → ${filtered.length} after topic blocklist + prior-wave exclusions`);

  // Step 2: dedupe by Jaccard similarity, sorted by score desc
  const sorted = [...filtered].sort((a, b) => b.opportunityScore - a.opportunityScore);
  const tokens: Map<string, Set<string>> = new Map();
  const groups: Array<{ primary: RawGap; secondary: RawGap[] }> = [];

  for (const g of sorted) {
    const ts = tokenSet(g.keyword);
    tokens.set(g.keyword, ts);

    let merged = false;
    for (const grp of groups) {
      const ptokens = tokens.get(grp.primary.keyword)!;
      // Same cluster + high Jaccard → duplicate
      if (grp.primary.cluster === g.cluster && jaccard(ptokens, ts) >= JACCARD_THRESHOLD) {
        grp.secondary.push(g);
        merged = true;
        break;
      }
    }
    if (!merged) groups.push({ primary: g, secondary: [] });
  }
  console.log(`✓ ${filtered.length} → ${groups.length} groups after Jaccard dedupe (≥${JACCARD_THRESHOLD})`);

  // Step 3: enforce cluster diversity caps + pick top SHORTLIST_SIZE
  const existingSlugs = new Set(GUIDES.map((g) => g.slug));
  const picked: ShortlistEntry[] = [];
  const perCluster = new Map<string, number>();

  // First pass: take the top-1 from each represented cluster (guarantees ≥1 per cluster)
  const clusters = Array.from(new Set(groups.map((g) => g.primary.cluster)));
  for (const cluster of clusters) {
    const candidate = groups.find(
      (g) => g.primary.cluster === cluster && !picked.find((p) => p.primaryKeyword === g.primary.keyword),
    );
    if (!candidate) continue;
    const entry = toEntry(candidate, existingSlugs);
    picked.push(entry);
    perCluster.set(cluster, (perCluster.get(cluster) ?? 0) + 1);
    existingSlugs.add(entry.slug);
  }

  // Trim if first pass already exceeded batch size
  while (picked.length > args.size) {
    const dropped = picked.pop()!;
    perCluster.set(dropped.cluster, (perCluster.get(dropped.cluster) ?? 1) - 1);
    existingSlugs.delete(dropped.slug);
  }

  // Second pass: fill remaining slots by score, respecting MAX_PER_CLUSTER
  for (const grp of groups) {
    if (picked.length >= args.size) break;
    if (picked.find((p) => p.primaryKeyword === grp.primary.keyword)) continue;
    const c = perCluster.get(grp.primary.cluster) ?? 0;
    if (c >= MAX_PER_CLUSTER) continue;
    const entry = toEntry(grp, existingSlugs);
    picked.push(entry);
    perCluster.set(grp.primary.cluster, c + 1);
    existingSlugs.add(entry.slug);
  }

  // Step 4: stable sort final list by score desc for output readability
  picked.sort((a, b) => b.opportunityScore - a.opportunityScore);

  // Step 5: write output + summary
  const out = {
    generatedAt: new Date().toISOString(),
    wave: args.wave,
    sourceFile: path.relative(process.cwd(), inputPath),
    excludedFromFiles: args.exclude.map((f) => path.relative(process.cwd(), f)),
    totalCandidates: data.gaps.length,
    afterBlocklist: filtered.length,
    afterDedupe: groups.length,
    shortlistSize: picked.length,
    clusterDistribution: Object.fromEntries(perCluster),
    entries: picked,
  };
  const outPath = path.join(OUT_DIR, `content-gap-shortlist-wave-${args.wave}.json`);
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  // Wave 1 also writes to the legacy filename for back-compat with the plan
  if (args.wave === 1) {
    fs.writeFileSync(path.join(OUT_DIR, "content-gap-shortlist-30.json"), JSON.stringify(out, null, 2));
  }
  console.log(`\n✓ Wrote ${path.relative(process.cwd(), outPath)}`);

  console.log(`\nCluster distribution in shortlist:`);
  for (const [c, n] of Array.from(perCluster.entries()).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${c.padEnd(22)} ${n}`);
  }
  console.log(`\nTotal: ${picked.length} entries`);

  console.log(`\nTop 10 by score:`);
  for (const e of picked.slice(0, 10)) {
    const sec = e.secondaryKeywords.length ? ` (+${e.secondaryKeywords.length} variants)` : "";
    console.log(`  ${String(e.opportunityScore).padStart(5)} | ${String(e.searchVolume).padStart(5)} | KD ${String(e.keywordDifficulty ?? "—").padStart(2)} | ${e.cluster.padEnd(20)} | ${e.primaryKeyword}${sec}`);
  }
}

function toEntry(grp: { primary: RawGap; secondary: RawGap[] }, existingSlugs: Set<string>): ShortlistEntry {
  const { primary, secondary } = grp;
  const baseSlug = slugify(primary.keyword);
  let slug = baseSlug;
  let n = 2;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${n++}`;
  }
  const top = primary.competitors.length
    ? [...primary.competitors].sort((a, b) => a.position - b.position)[0]
    : null;
  return {
    slug,
    primaryKeyword: primary.keyword,
    secondaryKeywords: secondary.map((s) => s.keyword),
    cluster: primary.cluster,
    suggestedCategory: CLUSTER_TO_CATEGORY[primary.cluster] ?? "general",
    suggestedRelatedServices: CLUSTER_TO_SERVICES[primary.cluster] ?? [],
    searchVolume: primary.searchVolume,
    totalSecondaryVolume: secondary.reduce((s, x) => s + x.searchVolume, 0),
    keywordDifficulty: primary.keywordDifficulty,
    intent: primary.intent,
    opportunityScore: primary.opportunityScore,
    competitorsRanking: primary.competitorsRanking,
    topCompetitor: top,
  };
}

main();
