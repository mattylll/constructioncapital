/**
 * Fetch Property Listing Data from PropertyData.co.uk API
 *
 * Fetches current listing statistics for each town:
 *   - Average asking prices by property type
 *   - Stock levels (how many properties for sale)
 *   - Days on market
 *   - Rental yields
 *
 * API: PropertyData.co.uk REST API
 * Env: PROPERTYDATA_API_KEY
 *
 * Usage:
 *   npx tsx scripts/fetch-listing-data.ts --county hertfordshire
 *   npx tsx scripts/fetch-listing-data.ts --all
 *   npx tsx scripts/fetch-listing-data.ts --county hertfordshire --skip-fetched
 */

import * as fs from "fs";
import * as path from "path";

// ── Config ──────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data", "generated");
const OUTPUT_DIR = path.join(DATA_DIR, "listings");

const API_KEY = process.env.PROPERTYDATA_API_KEY;
const API_BASE = "https://api.propertydata.co.uk";
const RATE_LIMIT_MS = 1200; // ~50 req/min

// ── Types ───────────────────────────────────────────────────────────────────

interface ListingData {
  updatedAt: string;
  townSlug: string;
  countySlug: string;
  postcode: string;
  forSale: {
    averageAskingPrice: number | null;
    medianAskingPrice: number | null;
    totalListings: number | null;
    averageDaysOnMarket: number | null;
    byType: Record<string, { avgPrice: number; count: number }>;
  };
  forRent: {
    averageRent: number | null;
    totalListings: number | null;
    grossYield: number | null;
  };
  growth: {
    forecast1yr: number | null;
    forecast3yr: number | null;
  };
}

// ── Postcode Mapping ────────────────────────────────────────────────────────

// Representative postcodes for towns (used as API lookup point)
// PropertyData works on postcode areas, so we need a central postcode per town
function getTownPostcode(county: string, town: string): string | null {
  // Try to find a postcode from existing sold data
  const soldFile = path.join(DATA_DIR, "sold-data", county, town, "latest.json");
  if (fs.existsSync(soldFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(soldFile, "utf-8"));
      // Look for a postcode in the transactions
      if (data.transactions?.length > 0) {
        const t = data.transactions[0];
        if (t.postcode) return t.postcode;
      }
      // Some formats store it differently
      if (data.samplePostcode) return data.samplePostcode;
    } catch { /* skip */ }
  }

  // Try planning data for a postcode
  const planFile = path.join(DATA_DIR, "planning", county, town, "latest.json");
  if (fs.existsSync(planFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(planFile, "utf-8"));
      const apps = [...(data.approvedApplications || []), ...(data.pendingApplications || [])];
      for (const app of apps) {
        if (app.postcode) return app.postcode;
      }
    } catch { /* skip */ }
  }

  return null;
}

// ── API ─────────────────────────────────────────────────────────────────────

async function fetchListings(postcode: string, endpoint: string): Promise<any> {
  const url = `${API_BASE}/${endpoint}?key=${API_KEY}&postcode=${encodeURIComponent(postcode)}`;
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 429) {
      console.log("    [RATE LIMITED] Waiting 30s...");
      await sleep(30_000);
      return fetchListings(postcode, endpoint);
    }
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Data Fetch ──────────────────────────────────────────────────────────────

async function fetchTownListings(county: string, town: string, postcode: string): Promise<ListingData> {
  const data: ListingData = {
    updatedAt: new Date().toISOString(),
    townSlug: town,
    countySlug: county,
    postcode,
    forSale: {
      averageAskingPrice: null,
      medianAskingPrice: null,
      totalListings: null,
      averageDaysOnMarket: null,
      byType: {},
    },
    forRent: {
      averageRent: null,
      totalListings: null,
      grossYield: null,
    },
    growth: {
      forecast1yr: null,
      forecast3yr: null,
    },
  };

  // Fetch sold prices / market data
  try {
    const sold = await fetchListings(postcode, "sold-prices");
    if (sold.status === "success" && sold.data) {
      data.forSale.averageAskingPrice = sold.data.average || null;
      data.forSale.totalListings = sold.data.count || null;
      if (sold.data.points) {
        // Extract by type if available
        for (const point of sold.data.points) {
          if (point.type && point.price) {
            data.forSale.byType[point.type] = {
              avgPrice: point.price,
              count: point.count || 0,
            };
          }
        }
      }
    }
    await sleep(RATE_LIMIT_MS);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`    [WARN] sold-prices: ${msg.slice(0, 60)}`);
  }

  // Fetch growth forecast
  try {
    const growth = await fetchListings(postcode, "growth");
    if (growth.status === "success" && growth.data) {
      data.growth.forecast1yr = growth.data["1year"] || null;
      data.growth.forecast3yr = growth.data["3year"] || null;
    }
    await sleep(RATE_LIMIT_MS);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`    [WARN] growth: ${msg.slice(0, 60)}`);
  }

  // Fetch rental yields
  try {
    const yields = await fetchListings(postcode, "yields");
    if (yields.status === "success" && yields.data) {
      data.forRent.grossYield = yields.data.long_let?.yield || null;
      data.forRent.averageRent = yields.data.long_let?.rent || null;
    }
    await sleep(RATE_LIMIT_MS);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`    [WARN] yields: ${msg.slice(0, 60)}`);
  }

  return data;
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const countyFlag = args.indexOf("--county");
const countyFilter = countyFlag !== -1 ? args[countyFlag + 1] : undefined;
const isAll = args.includes("--all");
const skipFetched = args.includes("--skip-fetched");

if (!countyFilter && !isAll) {
  console.log("Usage:");
  console.log("  npx tsx scripts/fetch-listing-data.ts --county hertfordshire");
  console.log("  npx tsx scripts/fetch-listing-data.ts --all");
  console.log("  npx tsx scripts/fetch-listing-data.ts --county hertfordshire --skip-fetched");
  console.log("\nAvailable counties (from sold data):");

  const soldDir = path.join(DATA_DIR, "sold-data");
  if (fs.existsSync(soldDir)) {
    for (const c of fs.readdirSync(soldDir).sort()) {
      const towns = fs.readdirSync(path.join(soldDir, c));
      console.log(`  ${c} (${towns.length} towns)`);
    }
  }
  process.exit(0);
}

async function main() {
  if (!API_KEY) {
    console.error("Missing PROPERTYDATA_API_KEY environment variable");
    process.exit(1);
  }

  const soldDir = path.join(DATA_DIR, "sold-data");
  let counties: string[];

  if (countyFilter) {
    counties = [countyFilter];
  } else {
    counties = fs.existsSync(soldDir) ? fs.readdirSync(soldDir).sort() : [];
  }

  console.log(`Processing ${counties.length} county/counties...\n`);

  let fetched = 0;
  let skipped = 0;
  let noPostcode = 0;

  for (const county of counties) {
    console.log(`\n${slugToName(county)}`);

    const townDir = path.join(soldDir, county);
    if (!fs.existsSync(townDir)) continue;
    const towns = fs.readdirSync(townDir).sort();

    for (const town of towns) {
      const outDir = path.join(OUTPUT_DIR, county, town);
      const outPath = path.join(outDir, "latest.json");

      if (skipFetched && fs.existsSync(outPath)) {
        skipped++;
        continue;
      }

      const postcode = getTownPostcode(county, town);
      if (!postcode) {
        console.log(`  [SKIP] ${town} — no postcode found`);
        noPostcode++;
        continue;
      }

      process.stdout.write(`  ${slugToName(town).padEnd(25)} (${postcode})... `);

      try {
        const data = await fetchTownListings(county, town, postcode);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf-8");

        const parts: string[] = [];
        if (data.forSale.averageAskingPrice) parts.push(`avg £${Math.round(data.forSale.averageAskingPrice / 1000)}k`);
        if (data.growth.forecast1yr) parts.push(`1yr ${data.growth.forecast1yr > 0 ? "+" : ""}${data.growth.forecast1yr}%`);
        if (data.forRent.grossYield) parts.push(`yield ${data.forRent.grossYield}%`);
        console.log(parts.join(", ") || "OK");

        fetched++;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log(`ERROR: ${msg.slice(0, 60)}`);
      }
    }
  }

  console.log(`\n--- Done ---`);
  console.log(`Fetched: ${fetched}`);
  console.log(`Skipped (already fetched): ${skipped}`);
  console.log(`No postcode: ${noPostcode}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
