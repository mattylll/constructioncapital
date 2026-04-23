/**
 * Enrich Developer Prospects via Companies House API
 *
 * Takes prospects from data/generated/developer-prospects/prospects.json,
 * searches Companies House for matching companies, and enriches with:
 *   - Company number, registration date, status
 *   - SIC codes (filtered for property/development)
 *   - Registered office address
 *   - Directors (active officers)
 *
 * API: Companies House REST API (600 requests per 5 minutes)
 * Env: COMPANIES_HOUSE_API_KEY
 *
 * Usage:
 *   npx tsx scripts/enrich-companies-house.ts
 *   npx tsx scripts/enrich-companies-house.ts --limit 50
 *   npx tsx scripts/enrich-companies-house.ts --skip-enriched
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ───────────────────────────────────────────────────────────────────

interface DeveloperProspect {
  companyName: string;
  contactName: string;
  normalisedName: string;
  applications: Array<{
    reference: string;
    address: string;
    postcode: string;
    proposal: string;
    units: number | null;
    estimatedGdv: number | null;
    status: string;
    decision: string;
    receivedDate: string;
    townSlug: string;
    countySlug: string;
    localAuthority: string;
    sourceUrl: string;
  }>;
  totalApplications: number;
  totalUnits: number;
  totalEstimatedGdv: number;
  locations: string[];
  developmentTypes: string[];
  agentName: string;
  agentCompany: string;
  enrichmentStatus: string;
  outreachStatus: string;
}

interface CompaniesHouseData {
  companyNumber: string;
  companyName: string;
  companyStatus: string;
  companyType: string;
  incorporationDate: string;
  sicCodes: string[];
  registeredOffice: {
    addressLine1: string;
    addressLine2: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  } | null;
  directors: Array<{
    name: string;
    role: string;
    appointedOn: string;
    nationality: string;
  }>;
  matchConfidence: "exact" | "fuzzy" | "sic-match" | "none";
}

interface EnrichedProspect extends DeveloperProspect {
  companiesHouse: CompaniesHouseData | null;
  enrichedAt: string;
}

// ── Config ──────────────────────────────────────────────────────────────────

const PROSPECTS_PATH = path.join(process.cwd(), "data", "generated", "developer-prospects", "prospects.json");
const OUTPUT_PATH = path.join(process.cwd(), "data", "generated", "developer-prospects", "enriched.json");

const API_KEY = process.env.COMPANIES_HOUSE_API_KEY;
const API_BASE = "https://api.company-information.service.gov.uk";

// Property development SIC codes
const PROPERTY_SIC_CODES = new Set([
  "41100", // Development of building projects
  "41201", // Construction of commercial buildings
  "41202", // Construction of domestic buildings
  "68100", // Buying and selling of own real estate
  "68201", // Renting and operating of Housing Association real estate
  "68202", // Letting and operating of conference and exhibition centres
  "68209", // Other letting and operating of own or leased real estate
  "68310", // Real estate agencies
  "68320", // Management of real estate on a fee or contract basis
  "43110", // Demolition
  "43120", // Site preparation
  "43990", // Other specialised construction activities
  "64209", // Activities of other holding companies
]);

// Rate limiting: 600 requests per 5 minutes = 2 per second
const RATE_LIMIT_MS = 550;

// ── API ─────────────────────────────────────────────────────────────────────

async function searchCompany(query: string): Promise<any[]> {
  const url = `${API_BASE}/search/companies?q=${encodeURIComponent(query)}&items_per_page=5`;
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${Buffer.from(API_KEY + ":").toString("base64")}` },
  });
  if (!res.ok) {
    if (res.status === 429) {
      console.log("    [RATE LIMITED] Waiting 60s...");
      await sleep(60_000);
      return searchCompany(query);
    }
    throw new Error(`CH API ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.items || [];
}

async function getCompanyProfile(companyNumber: string): Promise<any> {
  const url = `${API_BASE}/company/${companyNumber}`;
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${Buffer.from(API_KEY + ":").toString("base64")}` },
  });
  if (!res.ok) {
    if (res.status === 429) {
      console.log("    [RATE LIMITED] Waiting 60s...");
      await sleep(60_000);
      return getCompanyProfile(companyNumber);
    }
    return null;
  }
  return res.json();
}

async function getOfficers(companyNumber: string): Promise<any[]> {
  const url = `${API_BASE}/company/${companyNumber}/officers?items_per_page=20`;
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${Buffer.from(API_KEY + ":").toString("base64")}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items || []).filter((o: any) => !o.resigned_on);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Matching ────────────────────────────────────────────────────────────────

function isCompanyName(name: string): boolean {
  return /\b(ltd|limited|llp|plc|inc|corp|group|holdings|developments|properties|homes|construction|building|estates)\b/i.test(name);
}

function matchCompany(
  searchResults: any[],
  queryName: string
): { company: any; confidence: "exact" | "fuzzy" | "sic-match" | "none" } {
  if (searchResults.length === 0) return { company: null, confidence: "none" };

  const normQuery = queryName.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();

  // Check for exact match first
  for (const result of searchResults) {
    const normResult = (result.title || "").toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    if (normResult === normQuery) {
      return { company: result, confidence: "exact" };
    }
  }

  // Check for SIC code match (property development companies)
  for (const result of searchResults) {
    const sics = result.sic_codes || [];
    if (sics.some((s: string) => PROPERTY_SIC_CODES.has(s))) {
      return { company: result, confidence: "sic-match" };
    }
  }

  // Fuzzy match — first result if company status is active
  const active = searchResults.find((r) => r.company_status === "active");
  if (active) return { company: active, confidence: "fuzzy" };

  return { company: searchResults[0], confidence: "fuzzy" };
}

// ── Processing ──────────────────────────────────────────────────────────────

async function enrichProspect(prospect: DeveloperProspect): Promise<CompaniesHouseData | null> {
  const searchName = prospect.companyName;

  // Skip obvious non-company names
  if (!searchName || searchName.length < 3) return null;
  if (searchName.toLowerCase() === "c/o agent") return null;
  if (searchName.toLowerCase() === "n/a") return null;
  if (searchName.toLowerCase() === "in administration") return null;

  // Search Companies House
  const results = await searchCompany(searchName);
  await sleep(RATE_LIMIT_MS);

  const { company, confidence } = matchCompany(results, searchName);
  if (!company || confidence === "none") return null;

  // Get full profile
  const profile = await getCompanyProfile(company.company_number);
  await sleep(RATE_LIMIT_MS);

  if (!profile) return null;

  // Get officers (directors)
  const officers = await getOfficers(company.company_number);
  await sleep(RATE_LIMIT_MS);

  const registeredOffice = profile.registered_office_address
    ? {
        addressLine1: profile.registered_office_address.address_line_1 || "",
        addressLine2: profile.registered_office_address.address_line_2 || "",
        locality: profile.registered_office_address.locality || "",
        region: profile.registered_office_address.region || "",
        postalCode: profile.registered_office_address.postal_code || "",
        country: profile.registered_office_address.country || "",
      }
    : null;

  return {
    companyNumber: company.company_number,
    companyName: profile.company_name || company.title,
    companyStatus: profile.company_status || "",
    companyType: profile.type || "",
    incorporationDate: profile.date_of_creation || "",
    sicCodes: profile.sic_codes || [],
    registeredOffice,
    directors: officers
      .filter((o: any) => o.officer_role === "director" || o.officer_role === "llp-member")
      .map((o: any) => ({
        name: o.name || "",
        role: o.officer_role || "",
        appointedOn: o.appointed_on || "",
        nationality: o.nationality || "",
      })),
    matchConfidence: confidence,
  };
}

// ── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const limitArg = args.indexOf("--limit") !== -1 ? parseInt(args[args.indexOf("--limit") + 1], 10) : Infinity;
const skipEnriched = args.includes("--skip-enriched");

async function main() {
  if (!API_KEY) {
    console.error("Missing COMPANIES_HOUSE_API_KEY environment variable");
    console.error("Get a free key at: https://developer.company-information.service.gov.uk/");
    process.exit(1);
  }

  if (!fs.existsSync(PROSPECTS_PATH)) {
    console.error(`Prospects file not found: ${PROSPECTS_PATH}`);
    console.error("Run: npx tsx scripts/extract-developer-leads.ts");
    process.exit(1);
  }

  const prospects: DeveloperProspect[] = JSON.parse(fs.readFileSync(PROSPECTS_PATH, "utf-8"));
  console.log(`Loaded ${prospects.length} prospects`);

  // Load existing enrichment if available
  let existing: EnrichedProspect[] = [];
  if (fs.existsSync(OUTPUT_PATH)) {
    existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    console.log(`Found ${existing.length} previously enriched prospects`);
  }
  const enrichedMap = new Map(existing.map((e) => [e.normalisedName, e]));

  let enriched = 0;
  let skipped = 0;
  let failed = 0;
  const results: EnrichedProspect[] = [];

  for (const prospect of prospects) {
    if (enriched >= limitArg) break;

    // Skip if already enriched
    if (skipEnriched && enrichedMap.has(prospect.normalisedName)) {
      results.push(enrichedMap.get(prospect.normalisedName)!);
      skipped++;
      continue;
    }

    // Skip non-company individuals (less likely to have CH records)
    if (!isCompanyName(prospect.companyName) && !prospect.companyName.includes("(")) {
      results.push({
        ...prospect,
        companiesHouse: null,
        enrichedAt: new Date().toISOString(),
      });
      skipped++;
      continue;
    }

    process.stdout.write(`  [${enriched + 1}/${Math.min(prospects.length, limitArg)}] ${prospect.companyName.slice(0, 50)}... `);

    try {
      const chData = await enrichProspect(prospect);
      results.push({
        ...prospect,
        companiesHouse: chData,
        enrichedAt: new Date().toISOString(),
      });

      if (chData) {
        console.log(`${chData.companyNumber} (${chData.matchConfidence}) — ${chData.directors.length} directors`);
        enriched++;
      } else {
        console.log("no match");
        enriched++;
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`ERROR: ${msg.slice(0, 80)}`);
      results.push({
        ...prospect,
        companiesHouse: null,
        enrichedAt: new Date().toISOString(),
      });
      failed++;
    }
  }

  // Add any remaining un-processed prospects
  for (const prospect of prospects.slice(results.length)) {
    results.push({
      ...prospect,
      companiesHouse: null,
      enrichedAt: "",
    });
  }

  // Save
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf-8");

  const withCH = results.filter((r) => r.companiesHouse).length;
  const withDirectors = results.filter((r) => r.companiesHouse && r.companiesHouse.directors.length > 0).length;

  console.log(`\n--- Done ---`);
  console.log(`Enriched: ${enriched}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`With CH data: ${withCH}`);
  console.log(`With directors: ${withDirectors}`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
