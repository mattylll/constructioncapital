/**
 * Fetch and process HM Land Registry Price Paid data for St Albans.
 *
 * Downloads yearly CSV files from HMLR, filters to St Albans district,
 * computes aggregated stats, and outputs JSON for the website pipeline.
 *
 * HMLR CSV format (no header row):
 *   0: Transaction ID
 *   1: Price
 *   2: Date (YYYY-MM-DD HH:MM)
 *   3: Postcode
 *   4: Property Type (D=Detached, S=Semi, T=Terraced, F=Flat, O=Other)
 *   5: Old/New (Y=new build, N=existing)
 *   6: Duration (F=Freehold, L=Leasehold)
 *   7: PAON (house number/name)
 *   8: SAON (flat number)
 *   9: Street
 *  10: Locality
 *  11: Town/City
 *  12: District
 *  13: County
 *  14: PPD Category (A=standard, B=additional)
 *  15: Record Status (A=addition, C=change, D=delete)
 *
 * Usage:
 *   npx tsx scripts/fetch-land-registry-data.ts
 *   npx tsx scripts/fetch-land-registry-data.ts --years 2025,2026
 */

import * as fs from "fs";
import * as path from "path";
import { createReadStream } from "fs";
import { createInterface } from "readline";

// ─── Configuration ───────────────────────────────────────────

const BASE_URL =
  "http://prod.publicdata.landregistry.gov.uk.s3-website-eu-west-1.amazonaws.com";

const DISTRICT_FILTER = "ST ALBANS";
const TOWN_SLUG = "st-albans";
const COUNTY_SLUG = "hertfordshire";

const DATA_DIR = path.join(process.cwd(), "data", "land-registry");
const OUTPUT_DIR = path.join(process.cwd(), "data", "generated");

// ─── Types ───────────────────────────────────────────────────

interface Transaction {
  transactionId: string;
  price: number;
  date: string;
  postcode: string;
  propertyType: string; // D, S, T, F, O
  newBuild: boolean;
  tenure: string; // F, L
  address: string;
  street: string;
  town: string;
  district: string;
}

// ─── Helpers ─────────────────────────────────────────────────

function parseCSVLine(line: string): string[] {
  // HMLR CSV uses double-quoted fields with commas
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function buildAddress(paon: string, saon: string, street: string): string {
  const parts: string[] = [];
  if (saon) parts.push(saon);
  if (paon) parts.push(paon);
  if (street) parts.push(street);
  return parts.join(", ");
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

const PROPERTY_TYPE_NAMES: Record<string, string> = {
  D: "Detached",
  S: "Semi-Detached",
  T: "Terraced",
  F: "Flat",
  O: "Other",
};

// ─── Download ────────────────────────────────────────────────

async function downloadFile(url: string, dest: string): Promise<void> {
  console.log(`  Downloading ${url}...`);
  const resp = await fetch(url, { redirect: "follow" });
  if (!resp.ok) {
    throw new Error(`Download failed: ${resp.status} ${resp.statusText}`);
  }

  const totalBytes = parseInt(resp.headers.get("content-length") || "0", 10);
  const totalMB = totalBytes > 0 ? (totalBytes / 1024 / 1024).toFixed(0) : "?";
  console.log(`  Size: ~${totalMB}MB`);

  const buffer = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  console.log(`  Saved to ${dest}`);
}

// ─── Parse + Filter ──────────────────────────────────────────

async function parseAndFilter(
  csvPath: string,
  districtFilter: string
): Promise<Transaction[]> {
  const transactions: Transaction[] = [];
  const rl = createInterface({
    input: createReadStream(csvPath, { encoding: "utf-8" }),
    crlfDelay: Infinity,
  });

  let lineCount = 0;
  let matchCount = 0;

  for await (const line of rl) {
    lineCount++;
    if (lineCount % 100000 === 0) {
      process.stdout.write(`\r  Parsed ${(lineCount / 1000).toFixed(0)}k lines, ${matchCount} matches...`);
    }

    const fields = parseCSVLine(line);
    if (fields.length < 16) continue;

    // Filter by district (field 12)
    const district = fields[12].trim().toUpperCase();
    if (district !== districtFilter) continue;

    // Skip deletions
    if (fields[15].trim() === "D") continue;

    const price = parseInt(fields[1], 10);
    if (!price || price <= 0) continue;

    matchCount++;
    transactions.push({
      transactionId: fields[0].replace(/[{}]/g, ""),
      price,
      date: fields[2].split(" ")[0], // "2025-06-15 00:00" → "2025-06-15"
      postcode: fields[3].trim(),
      propertyType: fields[4].trim(),
      newBuild: fields[5].trim() === "Y",
      tenure: fields[6].trim(),
      address: buildAddress(fields[7].trim(), fields[8].trim(), fields[9].trim()),
      street: fields[9].trim(),
      town: fields[11].trim(),
      district: fields[12].trim(),
    });
  }

  console.log(`\r  Parsed ${(lineCount / 1000).toFixed(0)}k lines, ${matchCount} matches       `);
  return transactions;
}

// ─── Compute Stats ───────────────────────────────────────────

function computeStats(transactions: Transaction[]) {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const twoYearsAgo = new Date(now);
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  const oneYearAgoStr = oneYearAgo.toISOString().split("T")[0];
  const twoYearsAgoStr = twoYearsAgo.toISOString().split("T")[0];

  const last12m = transactions.filter((t) => t.date >= oneYearAgoStr);
  const prior12m = transactions.filter(
    (t) => t.date >= twoYearsAgoStr && t.date < oneYearAgoStr
  );

  const prices12m = last12m.map((t) => t.price);
  const pricesPrior = prior12m.map((t) => t.price);

  const medianPrice = median(prices12m);
  const medianPrior = median(pricesPrior);
  const yoyChange =
    medianPrior > 0
      ? parseFloat((((medianPrice - medianPrior) / medianPrior) * 100).toFixed(1))
      : 0;

  // Median by property type
  const medianByType: Record<string, number> = {};
  for (const type of ["D", "S", "T", "F"]) {
    const typePrices = last12m
      .filter((t) => t.propertyType === type)
      .map((t) => t.price);
    if (typePrices.length >= 3) {
      medianByType[type] = median(typePrices);
    }
  }

  // New build stats
  const newBuilds = last12m.filter((t) => t.newBuild);
  const existing = last12m.filter((t) => !t.newBuild);
  const newBuildMedian = newBuilds.length >= 3 ? median(newBuilds.map((t) => t.price)) : 0;
  const existingMedian = existing.length >= 3 ? median(existing.map((t) => t.price)) : 0;
  const newBuildPremium =
    existingMedian > 0
      ? parseFloat((((newBuildMedian - existingMedian) / existingMedian) * 100).toFixed(1))
      : 0;

  return {
    medianPrice,
    medianByType,
    transactionCount12m: last12m.length,
    yoyChange,
    newBuildCount: newBuilds.length,
    existingCount: existing.length,
    newBuildPremium,
    // Recent transactions for the table (sorted by date desc)
    recentTransactions: [...last12m]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 20)
      .map((t) => ({
        price: t.price,
        date: t.date,
        postcode: t.postcode,
        propertyType: t.propertyType,
        newBuild: t.newBuild,
        tenure: t.tenure,
        address: t.address,
      })),
  };
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const yearsIdx = args.indexOf("--years");
  const years =
    yearsIdx >= 0
      ? args[yearsIdx + 1].split(",").map((y) => y.trim())
      : ["2025", "2026"];

  fs.mkdirSync(DATA_DIR, { recursive: true });

  // Download CSV files
  for (const year of years) {
    const csvPath = path.join(DATA_DIR, `pp-${year}.csv`);
    if (fs.existsSync(csvPath)) {
      const stats = fs.statSync(csvPath);
      const ageDays =
        (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
      if (ageDays < 7) {
        console.log(`  Skipping download for ${year} (cached, ${ageDays.toFixed(0)} days old)`);
        continue;
      }
    }
    const url = `${BASE_URL}/pp-${year}.csv`;
    await downloadFile(url, csvPath);
  }

  // Parse and filter all CSV files
  let allTransactions: Transaction[] = [];
  for (const year of years) {
    const csvPath = path.join(DATA_DIR, `pp-${year}.csv`);
    if (!fs.existsSync(csvPath)) {
      console.log(`  Warning: ${csvPath} not found, skipping`);
      continue;
    }
    console.log(`\n  Processing ${year}...`);
    const transactions = await parseAndFilter(csvPath, DISTRICT_FILTER);
    allTransactions.push(...transactions);
  }

  // Deduplicate by transaction ID (keep latest)
  const deduped = new Map<string, Transaction>();
  for (const t of allTransactions) {
    deduped.set(t.transactionId, t);
  }
  allTransactions = Array.from(deduped.values());

  console.log(`\n  Total St Albans transactions: ${allTransactions.length}`);

  // Compute stats
  const stats = computeStats(allTransactions);

  console.log(`\n  ═══════════════════════════════════════════════════════`);
  console.log(`  St Albans Sold Price Data — Summary`);
  console.log(`  ═══════════════════════════════════════════════════════`);
  console.log(`  Transactions (12m): ${stats.transactionCount12m}`);
  console.log(`  Median price: £${stats.medianPrice.toLocaleString("en-GB")}`);
  console.log(`  YoY change: ${stats.yoyChange > 0 ? "+" : ""}${stats.yoyChange}%`);
  console.log(`  New builds: ${stats.newBuildCount} (${stats.newBuildPremium > 0 ? "+" : ""}${stats.newBuildPremium}% premium)`);
  console.log(`\n  Median by type:`);
  for (const [type, price] of Object.entries(stats.medianByType)) {
    console.log(`    ${PROPERTY_TYPE_NAMES[type] || type}: £${price.toLocaleString("en-GB")}`);
  }

  // Write sold data JSON
  const soldDataDir = path.join(OUTPUT_DIR, "sold-data", COUNTY_SLUG, TOWN_SLUG);
  fs.mkdirSync(soldDataDir, { recursive: true });
  const soldDataPath = path.join(soldDataDir, "latest.json");
  fs.writeFileSync(
    soldDataPath,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        townSlug: TOWN_SLUG,
        countySlug: COUNTY_SLUG,
        stats: {
          medianPrice: stats.medianPrice,
          medianByType: stats.medianByType,
          transactionCount12m: stats.transactionCount12m,
          yoyChange: stats.yoyChange,
          newBuildCount: stats.newBuildCount,
          existingCount: stats.existingCount,
          newBuildPremium: stats.newBuildPremium,
        },
        recentTransactions: stats.recentTransactions,
      },
      null,
      2
    )
  );
  console.log(`\n  Sold data JSON saved: ${soldDataPath}`);

  // Write town stats JSON (combining sold data stats)
  // Planning stats will be merged separately
  const townStatsDir = path.join(OUTPUT_DIR, "town-stats", COUNTY_SLUG);
  fs.mkdirSync(townStatsDir, { recursive: true });
  const townStatsPath = path.join(townStatsDir, `${TOWN_SLUG}.json`);

  // Read existing planning data to merge
  let planningStats = {
    approvedApps12m: 0,
    pipelineUnits: 0,
    pipelineGdv: 0,
    approvalRate: 0,
  };
  const planningPath = path.join(
    OUTPUT_DIR,
    "planning",
    COUNTY_SLUG,
    TOWN_SLUG,
    "latest.json"
  );
  try {
    const planning = JSON.parse(fs.readFileSync(planningPath, "utf-8"));
    planningStats = {
      approvedApps12m: planning.summary?.approved || 0,
      pipelineUnits: planning.summary?.totalUnits || 0,
      pipelineGdv: planning.summary?.totalEstimatedGDV || 0,
      approvalRate: planning.summary?.approvalRate || 0,
    };
  } catch {
    console.log("  Note: No planning data found, town stats will have planning fields at 0");
  }

  fs.writeFileSync(
    townStatsPath,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        townSlug: TOWN_SLUG,
        countySlug: COUNTY_SLUG,
        marketSnapshot: {
          medianPrice: stats.medianPrice,
          transactionCount12m: stats.transactionCount12m,
          yoyPriceChange: stats.yoyChange,
          ...planningStats,
        },
      },
      null,
      2
    )
  );
  console.log(`  Town stats JSON saved: ${townStatsPath}`);

  console.log("\n  Done!\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
