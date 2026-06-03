/**
 * WS0 — Demand-ranked target list (credit-free).
 *
 * Joins three existing sources into one prioritised target list:
 *   1. data/generated/keyword-research/location-volume-2026-04-29.json
 *      — true DataForSEO monthly volume for 31 finance products × UK locations.
 *   2. GSC Queries export — real impressions + current position per query.
 *   3. GSC Pages export    — which URL currently ranks + its position.
 *
 * Output: data/generated/serp-analysis/demand-ranked-targets-<date>.{json,md}
 *
 * No API calls. Run: node scripts/build-demand-targets.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATE = "2026-06-03";

const GSC_DIR =
  "/Users/mattlenzie/Downloads/constructioncapital.co.uk-Performance-on-Search-2026-06-03";

// ── Minimal RFC-4180 CSV parser (handles quoted, multi-line fields) ──────────
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function loadGsc(file) {
  const rows = parseCsv(readFileSync(join(GSC_DIR, file), "utf8"));
  rows.shift(); // header
  return rows
    .filter((r) => r.length >= 5)
    .map((r) => ({
      key: r[0].trim(),
      clicks: Number(r[1]),
      impressions: Number(r[2]),
      ctr: r[3],
      position: Number(r[4]),
    }));
}

const queries = loadGsc("Queries.csv");
const pages = loadGsc("Pages.csv");
const queryByKw = new Map(queries.map((q) => [q.key.toLowerCase(), q]));

const volume = JSON.parse(
  readFileSync(
    join(ROOT, "data/generated/keyword-research/location-volume-2026-04-29.json"),
    "utf8"
  )
).filter((v) => v.searchVolume > 0);

// ── Winnability: how reachable is page 1 from the current position ───────────
function winnability(pos) {
  if (pos == null) return 0.3; // unknown / not ranking yet
  if (pos <= 3) return 1.0;
  if (pos <= 10) return 0.9;
  if (pos <= 20) return 0.6;
  if (pos <= 40) return 0.3;
  return 0.1;
}

// ── 1) Validated-volume finance × location targets (WS2 / WS3) ───────────────
const financeTargets = volume
  .map((v) => {
    const g = queryByKw.get(v.keyword.toLowerCase());
    const pos = g ? g.position : null;
    const score = v.searchVolume * winnability(pos);
    return {
      keyword: v.keyword,
      product: v.product,
      location: v.location,
      locationType: v.locationType, // city | county
      intent: v.intent,
      volume: v.searchVolume,
      cpc: v.cpc ?? null,
      competition: v.competition ?? null,
      gscPosition: pos,
      gscImpressions: g ? g.impressions : 0,
      gscClicks: g ? g.clicks : 0,
      score: Math.round(score),
    };
  })
  .sort((a, b) => b.score - a.score);

// ── 2) GSC-observed demand NOT covered by the volume file ────────────────────
// (house-price/valuation/property-market, calculators, head rate terms)
const RX = {
  calculator: /calculator|yield calc/i,
  houseprice: /house price|property market|house valuation|sold price|average house|property price/i,
  rates: /\b(rates?|interest rate)\b/i,
  serviceLoc:
    /(bridging|development finance|commercial mortgage|mezzanine|refurbishment|auction|construction)/i,
};
function category(kw) {
  if (RX.calculator.test(kw)) return "calculator";
  if (RX.houseprice.test(kw)) return "house-price";
  if (RX.rates.test(kw)) return "rate-headterm";
  if (RX.serviceLoc.test(kw)) return "service";
  return "other";
}

const gscOpportunities = queries
  .filter((q) => q.impressions >= 10) // meaningful demand
  .map((q) => ({
    keyword: q.key,
    category: category(q.key),
    impressions: q.impressions,
    clicks: q.clicks,
    position: q.position,
    win: winnability(q.position),
    // opportunity = demand × reachability, penalise if already clicking well
    opportunity: Math.round(q.impressions * winnability(q.position)),
  }))
  .sort((a, b) => b.opportunity - a.opportunity);

// ── 3) CTR misses: page-1, real impressions, zero clicks (WS1 cheapest wins) ─
const ctrMisses = pages
  .filter((p) => p.position <= 10 && p.impressions >= 40 && p.clicks === 0)
  .sort((a, b) => b.impressions - a.impressions);

// ── 4) Striking distance pages: pos 4–20 with impressions (WS1/WS2 depth) ────
const strikingPages = pages
  .filter((p) => p.position >= 4 && p.position <= 20 && p.impressions >= 20)
  .sort((a, b) => b.impressions - a.impressions);

// ── Write JSON ───────────────────────────────────────────────────────────────
const out = {
  generatedAt: DATE,
  sources: {
    volume: "location-volume-2026-04-29.json (DataForSEO Labs, UK)",
    gsc: "GSC Performance export 2026-06-03",
  },
  financeTargets,
  gscOpportunities,
  ctrMisses,
  strikingPages,
};
writeFileSync(
  join(ROOT, `data/generated/serp-analysis/demand-ranked-targets-${DATE}.json`),
  JSON.stringify(out, null, 2)
);

// ── Write Markdown summary ───────────────────────────────────────────────────
const fmtPos = (p) => (p == null ? "—" : p.toFixed(1));
const top = (arr, n) => arr.slice(0, n);

let md = `# Demand-ranked SEO targets — ${DATE}\n\n`;
md += `Joined from existing DataForSEO volume (2026-04-29) + GSC export (2026-06-03). No new API calls.\n\n`;

md += `## A. Validated-volume finance × location (WS2 / WS3) — top 40 by score\n\n`;
md += `Score = monthly volume × winnability(current GSC position). These have **real demand**.\n\n`;
md += `| Keyword | Vol/mo | Type | Intent | GSC pos | Impr | Clicks | Score |\n|---|---:|---|---|---:|---:|---:|---:|\n`;
for (const t of top(financeTargets, 40))
  md += `| ${t.keyword} | ${t.volume} | ${t.locationType} | ${t.intent} | ${fmtPos(t.gscPosition)} | ${t.gscImpressions} | ${t.gscClicks} | ${t.score} |\n`;

md += `\n## B. CTR misses — page-1, high impressions, ZERO clicks (WS1, cheapest wins)\n\n`;
md += `Rewrite metaTitle/metaDescription only. No structural change.\n\n`;
md += `| Page | Impr | Pos |\n|---|---:|---:|\n`;
for (const p of top(ctrMisses, 25))
  md += `| ${p.key.replace("https://constructioncapital.co.uk", "")} | ${p.impressions} | ${fmtPos(p.position)} |\n`;

md += `\n## C. GSC-observed demand opportunities (head / calculator / house-price)\n\n`;
md += `Demand proxy = impressions (these term families are NOT in the volume file). opportunity = impressions × winnability.\n\n`;
md += `| Keyword | Category | Impr | Pos | Opportunity |\n|---|---|---:|---:|---:|\n`;
for (const o of top(gscOpportunities, 40))
  md += `| ${o.keyword} | ${o.category} | ${o.impressions} | ${fmtPos(o.position)} | ${o.opportunity} |\n`;

md += `\n## D. Striking-distance pages (pos 4–20, impr ≥ 20) — WS1/WS2 depth targets\n\n`;
md += `| Page | Impr | Pos |\n|---|---:|---:|\n`;
for (const p of top(strikingPages, 40))
  md += `| ${p.key.replace("https://constructioncapital.co.uk", "")} | ${p.impressions} | ${fmtPos(p.position)} |\n`;

md += `\n## Gaps needing a (small) fresh DataForSEO pull\n\n`;
md += `The volume file covers finance products only. To put true volume + difficulty on the WS1/WS4 opportunities, a small batch (~40–60 keywords) would cover: house-price/valuation/property-market head terms, calculator head terms (buy-to-let, bridging, rental-yield), and head rate terms (commercial mortgage rates, development finance rates). Confirm before pulling.\n`;

writeFileSync(
  join(ROOT, `data/generated/serp-analysis/demand-ranked-targets-${DATE}.md`),
  md
);

console.log("Finance targets (non-zero vol):", financeTargets.length);
console.log("CTR misses (page-1, 0-click, ≥40 impr):", ctrMisses.length);
console.log("GSC opportunities (≥10 impr):", gscOpportunities.length);
console.log("Striking-distance pages:", strikingPages.length);
console.log(`\nWrote demand-ranked-targets-${DATE}.{json,md}`);
