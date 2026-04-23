/**
 * Keyword winner picker — reads SERP-analysis raw data for every microsite,
 * picks the best keyword phrasing per site, and writes
 * data/generated/serp-analysis/keyword-winners.json.
 *
 * "Best" = higher 12-month search volume. Ties → lower keyword difficulty.
 *
 * The propagation script (scripts/redesign-microsites.ts) loads this file at
 * runtime and uses each winner for the site's H1/meta.
 *
 * Usage:
 *   npx tsx scripts/pick-keyword-winners.ts
 *   npx tsx scripts/pick-keyword-winners.ts --print   # dump to stdout only, no write
 */

import * as fs from "fs";
import * as path from "path";
import { MICROSITES, type MicrositeConfig } from "../microsites.config";

const OUT = path.join(
  process.cwd(),
  "data",
  "generated",
  "serp-analysis",
  "keyword-winners.json",
);
const RAW = path.join(process.cwd(), "data", "generated", "serp-analysis", "raw");

function slugify(kw: string) {
  return kw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function keywordsFor(site: MicrositeConfig): string[] {
  const loc = site.locationName.toLowerCase();
  if (site.type === "development-finance") {
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

interface KeywordStats {
  keyword: string;
  volume: number | null;
  kd: number | null;
  intent: string | null;
  competition: number | null;
}

function loadStats(keyword: string): KeywordStats | null {
  const dir = path.join(RAW, slugify(keyword));
  const overviewPath = path.join(dir, "04-keyword-overview.json");
  if (!fs.existsSync(overviewPath)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(overviewPath, "utf-8"));
    const item = raw.tasks?.[0]?.result?.[0]?.items?.[0];
    if (!item) return null;
    const info = item.keyword_info ?? {};
    return {
      keyword,
      volume: info.search_volume ?? null,
      kd: item.keyword_properties?.keyword_difficulty ?? null,
      intent: item.search_intent_info?.main_intent ?? null,
      competition: info.competition ?? null,
    };
  } catch {
    return null;
  }
}

function score(s: KeywordStats): number {
  // Rank by volume, then -KD. Null volume = 0, null KD = 100 (worst).
  const v = s.volume ?? 0;
  const kd = s.kd ?? 100;
  return v * 1000 - kd;
}

interface WinnerEntry {
  siteSlug: string;
  siteType: MicrositeConfig["type"];
  locationName: string;
  winnerKeyword: string;
  winnerVolume: number | null;
  winnerKd: number | null;
  winnerIntent: string | null;
  loserKeyword: string | null;
  loserVolume: number | null;
  loserKd: number | null;
  deltaVolume: number | null;
  notes: string;
}

function main() {
  const print = process.argv.includes("--print");
  const results: WinnerEntry[] = [];

  for (const site of MICROSITES) {
    const keywords = keywordsFor(site);
    const stats = keywords
      .map(loadStats)
      .filter((x): x is KeywordStats => x !== null);

    if (stats.length === 0) {
      results.push({
        siteSlug: site.slug,
        siteType: site.type,
        locationName: site.locationName,
        winnerKeyword: keywords[0] ?? "",
        winnerVolume: null,
        winnerKd: null,
        winnerIntent: null,
        loserKeyword: keywords[1] ?? null,
        loserVolume: null,
        loserKd: null,
        deltaVolume: null,
        notes: "No SERP data yet — using default phrasing",
      });
      continue;
    }

    stats.sort((a, b) => score(b) - score(a));
    const w = stats[0];
    const l = stats[1] ?? null;
    results.push({
      siteSlug: site.slug,
      siteType: site.type,
      locationName: site.locationName,
      winnerKeyword: w.keyword,
      winnerVolume: w.volume,
      winnerKd: w.kd,
      winnerIntent: w.intent,
      loserKeyword: l?.keyword ?? null,
      loserVolume: l?.volume ?? null,
      loserKd: l?.kd ?? null,
      deltaVolume: w.volume != null && l?.volume != null ? w.volume - l.volume : null,
      notes: stats.length < keywords.length ? "Partial data — not all phrasings analysed" : "",
    });
  }

  // Stable sort for readability
  results.sort((a, b) => {
    const tOrder = { "development-finance": 0, bridging: 1, niche: 2 } as const;
    if (tOrder[a.siteType] !== tOrder[b.siteType]) return tOrder[a.siteType] - tOrder[b.siteType];
    return a.siteSlug.localeCompare(b.siteSlug);
  });

  if (print) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(results, null, 2), "utf-8");
    console.log(`✓ Wrote ${results.length} entries to ${path.relative(process.cwd(), OUT)}`);
  }

  // Summary
  const withData = results.filter((r) => r.winnerVolume != null).length;
  const pickedPropertyForm = results.filter((r) =>
    r.winnerKeyword.startsWith("property development finance"),
  ).length;
  const pickedBridgingLoans = results.filter((r) =>
    r.winnerKeyword.startsWith("bridging loans "),
  ).length;
  const pickedBridgingFinance = results.filter((r) =>
    r.winnerKeyword.startsWith("bridging finance "),
  ).length;
  console.log(`\nSummary:`);
  console.log(`  Sites with SERP data: ${withData} / ${results.length}`);
  console.log(`  Dev-finance sites choosing "property development finance [loc]": ${pickedPropertyForm}`);
  console.log(`  Bridging sites choosing "bridging loans [loc]": ${pickedBridgingLoans}`);
  console.log(`  Bridging sites choosing "bridging finance [loc]": ${pickedBridgingFinance}`);
}

main();
