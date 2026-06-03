/**
 * WS1 — Title/meta CTR test for house-price market-reports (in-place, surgical).
 *
 * Rewrites ONLY metaTitle + metaDescription on the existing town + county report
 * files, deriving figures from each file's own `excerpt`/`title` (no regeneration
 * from sold-data, so body content, numbers and dates are untouched).
 *
 * New format leads with the concrete median — the CTR lever that differentiates a
 * finance brand's report from portal listings on the "house prices [place]" SERP.
 * Kept identical to the generator template so a future full regenerate stays in sync.
 *
 * Run: node scripts/refresh-report-meta.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORTS = join(__dirname, "..", "src/lib/market-reports/reports");

const cohorts = [
  {
    dir: join(REPORTS, "town"),
    excerpt:
      /excerpt:\s*"Median price (£[\d,]+),\s*([\d,]+) sales,\s*([+-]?[\d.]+)% YoY\.\s*.+? county\."/,
    desc: (place, median, sales, yoy) =>
      `${place} house prices 2026: ${median} median, ${sales} sales, ${yoy}% YoY. Sold-price trends by property type, new-build premiums and development finance.`,
  },
  {
    dir: join(REPORTS, "county"),
    excerpt:
      /excerpt:\s*"[\d,]+ towns analysed\. Median price (£[\d,]+),\s*([\d,]+) transactions,\s*([+-]?[\d.]+)% YoY\."/,
    desc: (place, median, sales, yoy) =>
      `${place} house prices 2026: ${median} median, ${sales} sales, ${yoy}% YoY. Town-by-town comparison, new-build premiums and development finance.`,
  },
];

let changed = 0;
const skipped = [];

for (const c of cohorts) {
  const files = readdirSync(c.dir).filter((f) => f.endsWith(".ts") && f !== "index.ts");
  for (const f of files) {
    const path = join(c.dir, f);
    const src = readFileSync(path, "utf8");

    const titleM = src.match(/title:\s*"([^"]+?) Property Market:/);
    const exM = src.match(c.excerpt);
    if (!titleM || !exM) {
      skipped.push(f);
      continue;
    }
    const place = titleM[1];
    const [, median, sales, yoy] = exM;

    const metaTitle = `${place} House Prices 2026: ${median} Median`;
    const metaDescription = c.desc(place, median, sales, yoy);

    const next = src
      .replace(/^(\s*metaTitle:\s*")[^"]*(",)$/m, `$1${metaTitle}$2`)
      .replace(/^(\s*metaDescription:\s*")[^"]*(",)$/m, `$1${metaDescription}$2`);

    if (next !== src) {
      writeFileSync(path, next);
      changed++;
    }
  }
}

console.log(`Reports updated: ${changed}`);
if (skipped.length) {
  console.log(`Skipped (unparsed) ${skipped.length}: ${skipped.join(", ")}`);
}
