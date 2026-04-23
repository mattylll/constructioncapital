/**
 * Fetch Companies House Charges Data (Lender Intelligence)
 *
 * For development companies identified in the planning pipeline, fetches
 * registered charges from Companies House. This reveals:
 *   - Which lenders are active in which locations
 *   - Typical charge amounts by area
 *   - Competitive intelligence on lender activity
 *
 * API: Companies House REST API (600 requests per 5 minutes)
 * Env: COMPANIES_HOUSE_API_KEY
 *
 * Usage:
 *   npx tsx scripts/fetch-charges-data.ts
 *   npx tsx scripts/fetch-charges-data.ts --limit 100
 *   npx tsx scripts/fetch-charges-data.ts --skip-fetched
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ───────────────────────────────────────────────────────────────────

interface ChargeRecord {
  companyNumber: string;
  companyName: string;
  chargeCode: string;
  lenderName: string;
  chargeAmount: number | null;
  createdDate: string;
  deliveredDate: string;
  status: string;
  description: string;
  propertyAddresses: string[];
  countySlug: string;
  townSlug: string;
}

interface LenderActivity {
  lenderName: string;
  totalCharges: number;
  totalAmount: number;
  locations: string[];
  companies: string[];
  recentCharges: ChargeRecord[];
}

// ── Config ──────────────────────────────────────────────────────────────────

const ENRICHED_PATH = path.join(process.cwd(), "data", "generated", "developer-prospects", "enriched.json");
const OUTPUT_DIR = path.join(process.cwd(), "data", "generated", "lender-activity");

const API_KEY = process.env.COMPANIES_HOUSE_API_KEY;
const API_BASE = "https://api.company-information.service.gov.uk";
const RATE_LIMIT_MS = 550;

// ── API ─────────────────────────────────────────────────────────────────────

async function getCharges(companyNumber: string): Promise<any[]> {
  const url = `${API_BASE}/company/${companyNumber}/charges`;
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${Buffer.from(API_KEY + ":").toString("base64")}` },
  });

  if (!res.ok) {
    if (res.status === 429) {
      console.log("    [RATE LIMITED] Waiting 60s...");
      await sleep(60_000);
      return getCharges(companyNumber);
    }
    if (res.status === 404) return []; // No charges registered
    return [];
  }

  const data = await res.json();
  return data.items || [];
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Processing ──────────────────────────────────────────────────────────────

function extractLenderName(charge: any): string {
  // The "persons_entitled" field contains the lender name
  const persons = charge.persons_entitled || [];
  if (persons.length > 0) {
    return persons[0].name || "";
  }
  // Sometimes in classification description
  return charge.classification?.description || "Unknown";
}

function extractAmount(charge: any): number | null {
  // Secured amount from particulars
  if (charge.particulars?.fixed_charge) return charge.particulars.fixed_charge;
  if (charge.particulars?.floating_charge) return charge.particulars.floating_charge;
  // Sometimes in secured details
  if (charge.secured_details?.amount) return charge.secured_details.amount;
  return null;
}

function extractPropertyAddresses(charge: any): string[] {
  const desc = charge.particulars?.description || "";
  // Try to extract addresses from the particulars description
  // These often contain property addresses
  const addresses: string[] = [];
  if (desc) {
    // Look for postcode patterns to identify addresses
    const postcodePattern = /[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/gi;
    const matches = desc.match(postcodePattern);
    if (matches) {
      addresses.push(...matches.map((m: string) => m.toUpperCase()));
    }
  }
  return addresses;
}

// ── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const limitArg = args.indexOf("--limit") !== -1 ? parseInt(args[args.indexOf("--limit") + 1], 10) : Infinity;
const skipFetched = args.includes("--skip-fetched");

async function main() {
  if (!API_KEY) {
    console.error("Missing COMPANIES_HOUSE_API_KEY environment variable");
    process.exit(1);
  }

  if (!fs.existsSync(ENRICHED_PATH)) {
    console.error(`Enriched prospects not found: ${ENRICHED_PATH}`);
    console.error("Run: npx tsx scripts/enrich-companies-house.ts");
    process.exit(1);
  }

  const prospects = JSON.parse(fs.readFileSync(ENRICHED_PATH, "utf-8"));
  const withCH = prospects.filter((p: any) => p.companiesHouse?.companyNumber);
  console.log(`Loaded ${withCH.length} prospects with Companies House numbers`);

  // Load existing charges if available
  const allChargesPath = path.join(OUTPUT_DIR, "all-charges.json");
  let existingCharges: ChargeRecord[] = [];
  if (skipFetched && fs.existsSync(allChargesPath)) {
    existingCharges = JSON.parse(fs.readFileSync(allChargesPath, "utf-8"));
    console.log(`Found ${existingCharges.length} existing charge records`);
  }
  const fetchedCompanies = new Set(existingCharges.map((c) => c.companyNumber));

  const allCharges: ChargeRecord[] = [...existingCharges];
  let fetched = 0;
  let totalNewCharges = 0;

  for (const prospect of withCH) {
    if (fetched >= limitArg) break;

    const companyNumber = prospect.companiesHouse.companyNumber;
    const companyName = prospect.companiesHouse.companyName;

    if (skipFetched && fetchedCompanies.has(companyNumber)) continue;

    process.stdout.write(`  [${fetched + 1}] ${companyName.slice(0, 45)}... `);

    try {
      const charges = await getCharges(companyNumber);
      await sleep(RATE_LIMIT_MS);

      for (const charge of charges) {
        allCharges.push({
          companyNumber,
          companyName,
          chargeCode: charge.charge_code || `${companyNumber}-${charge.charge_number}`,
          lenderName: extractLenderName(charge),
          chargeAmount: extractAmount(charge),
          createdDate: charge.created_on || "",
          deliveredDate: charge.delivered_on || "",
          status: charge.status || "",
          description: (charge.particulars?.description || "").slice(0, 300),
          propertyAddresses: extractPropertyAddresses(charge),
          countySlug: prospect.locations?.[0]?.split("/")?.[0] || "",
          townSlug: prospect.locations?.[0]?.split("/")?.[1] || "",
        });
        totalNewCharges++;
      }

      console.log(`${charges.length} charge(s)`);
      fetched++;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`ERROR: ${msg.slice(0, 80)}`);
      fetched++;
    }
  }

  // Save all charges
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(allChargesPath, JSON.stringify(allCharges, null, 2), "utf-8");

  // Aggregate by lender
  const lenderMap = new Map<string, LenderActivity>();

  for (const charge of allCharges) {
    const lender = charge.lenderName;
    if (!lender || lender === "Unknown") continue;

    let activity = lenderMap.get(lender);
    if (!activity) {
      activity = {
        lenderName: lender,
        totalCharges: 0,
        totalAmount: 0,
        locations: [],
        companies: [],
        recentCharges: [],
      };
      lenderMap.set(lender, activity);
    }

    activity.totalCharges++;
    if (charge.chargeAmount) activity.totalAmount += charge.chargeAmount;

    const loc = `${charge.countySlug}/${charge.townSlug}`;
    if (loc !== "/" && !activity.locations.includes(loc)) activity.locations.push(loc);
    if (!activity.companies.includes(charge.companyName)) activity.companies.push(charge.companyName);

    // Keep 5 most recent charges
    activity.recentCharges.push(charge);
    activity.recentCharges.sort((a, b) => b.createdDate.localeCompare(a.createdDate));
    if (activity.recentCharges.length > 5) activity.recentCharges = activity.recentCharges.slice(0, 5);
  }

  // Sort by total charges and save
  const byLender = Array.from(lenderMap.values()).sort((a, b) => b.totalCharges - a.totalCharges);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "by-lender.json"),
    JSON.stringify(byLender, null, 2),
    "utf-8"
  );

  // Aggregate by location
  const locationMap = new Map<string, ChargeRecord[]>();
  for (const charge of allCharges) {
    const loc = `${charge.countySlug}/${charge.townSlug}`;
    if (loc === "/") continue;
    if (!locationMap.has(loc)) locationMap.set(loc, []);
    locationMap.get(loc)!.push(charge);
  }

  const byLocation: Record<string, { charges: number; lenders: string[]; totalAmount: number }> = {};
  for (const [loc, charges] of locationMap) {
    const lenders = [...new Set(charges.map((c) => c.lenderName).filter(Boolean))];
    byLocation[loc] = {
      charges: charges.length,
      lenders,
      totalAmount: charges.reduce((sum, c) => sum + (c.chargeAmount || 0), 0),
    };
  }
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "by-location.json"),
    JSON.stringify(byLocation, null, 2),
    "utf-8"
  );

  // Summary
  console.log(`\n--- Done ---`);
  console.log(`Companies fetched: ${fetched}`);
  console.log(`New charges found: ${totalNewCharges}`);
  console.log(`Total charges: ${allCharges.length}`);
  console.log(`Unique lenders: ${lenderMap.size}`);
  console.log(`Output: ${OUTPUT_DIR}`);

  if (byLender.length > 0) {
    console.log(`\nTop 10 lenders by charge count:\n`);
    for (const l of byLender.slice(0, 10)) {
      console.log(`  ${l.lenderName.slice(0, 50).padEnd(52)} ${l.totalCharges} charges  ${l.locations.length} locations`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
