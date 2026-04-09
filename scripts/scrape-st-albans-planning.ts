/**
 * St Albans Planning Applications Scraper
 *
 * Scrapes planning applications from the St Albans Portal360 planning portal.
 * Outputs both JSON (for website pipeline) and Excel (for outreach/review).
 *
 * Usage:
 *   npx tsx scripts/scrape-st-albans-planning.ts
 *   npx tsx scripts/scrape-st-albans-planning.ts --days 30
 *   npx tsx scripts/scrape-st-albans-planning.ts --from 2026-03-01 --to 2026-03-31
 *
 * Output:
 *   data/planning-exports/st-albans-YYYY-MM-DD.json
 *   data/planning-exports/st-albans-YYYY-MM-DD.xlsx
 */

import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import XLSX from "xlsx";

// ─── Configuration ───────────────────────────────────────────

const BASE_URL = "https://planningapplications.stalbans.gov.uk";
const SEARCH_URL = `${BASE_URL}/planning/search-applications`;
const LOCAL_AUTHORITY = "St Albans City and District Council";
const TOWN_SLUG = "st-albans";
const COUNTY_SLUG = "hertfordshire";

const RATE_LIMIT_MS = 1500; // 1.5 seconds between requests

// ─── Types ───────────────────────────────────────────────────

interface PlanningApplication {
  // Identification
  reference: string;
  planning_portal_ref: string;
  local_authority: string;
  source_url: string;

  // Location
  address: string;
  postcode: string;
  ward: string;
  parish: string;
  town_slug: string;
  county_slug: string;

  // Scheme
  proposal: string;
  application_type: string;
  category: string;
  units: number | null;
  estimated_gdv: number | null;

  // Dates
  received_date: string;
  valid_date: string;
  decision_date: string;
  expiry_date: string;

  // Status
  status: string;
  decision_level: string;
  case_officer: string;

  // Contacts (for outreach)
  applicant_name: string;
  applicant_address: string;
  applicant_company: string;
  agent_name: string;
  agent_address: string;
  agent_company: string;

  // Metadata
  scraped_at: string;
  week_key: string;
  is_relevant: boolean;
  relevance_reason: string;
}

// ─── Helpers ─────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getWeekKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === "N/A" || dateStr === "") return "";
  try {
    // Handle DD/MM/YYYY format
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    // Try ISO format
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
  } catch {
    // ignore
  }
  return dateStr;
}

function extractPostcode(address: string): string {
  const match = address.match(
    /([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})/i
  );
  return match ? match[1].toUpperCase().trim() : "";
}

/**
 * Extract unit count from proposal description.
 * Looks for patterns like "12 dwellings", "6 apartments", "4 flats", etc.
 */
function extractUnits(proposal: string): number | null {
  const p = proposal.toLowerCase();

  // Direct unit count patterns
  const patterns = [
    /(\d+)\s*(?:no\.?\s*)?(?:residential\s+)?(?:dwelling|unit|home|house|apartment|flat|maisonette)s?/i,
    /(?:erection|construction|development|provision|creation)\s+of\s+(\d+)\s/i,
    /(\d+)\s*(?:x|no\.?)\s*(?:\d[\s-]*bed)/i,
    /(\d+)\s*(?:bed\s*)?(?:room\s*)?(?:apartment|flat|house|dwelling|unit|home)s?/i,
    /(?:into|to\s+form|to\s+create|providing)\s+(\d+)\s/i,
  ];

  for (const pattern of patterns) {
    const match = p.match(pattern);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > 0 && num < 500) return num; // sanity check
    }
  }

  // Check for "change of use" to single dwelling
  if (
    p.includes("change of use") &&
    (p.includes("dwelling") || p.includes("residential"))
  ) {
    if (!p.match(/\d+\s*(?:dwelling|unit|flat|apartment)/)) {
      return 1;
    }
  }

  return null;
}

/**
 * Categorise the application based on proposal text.
 */
function categoriseApplication(
  proposal: string,
  appType: string
): { category: string; isRelevant: boolean; reason: string } {
  const p = proposal.toLowerCase();
  const t = appType.toLowerCase();

  // EXCLUDE: Trees, TPO, advertisements, signage
  if (
    t.includes("tree") ||
    t.includes("tpo") ||
    p.includes("tree preservation") ||
    p.includes("fell") && p.includes("tree")
  ) {
    return { category: "trees", isRelevant: false, reason: "Tree works" };
  }

  if (t.includes("advert") || p.includes("advertisement") || p.includes("signage") || p.includes("fascia sign")) {
    return { category: "advertisement", isRelevant: false, reason: "Advertisement/signage" };
  }

  // EXCLUDE: Minor householder
  const isHouseholder =
    t.includes("householder") ||
    (p.includes("single storey") && p.includes("extension")) ||
    (p.includes("rear extension") && !p.includes("demolition")) ||
    (p.includes("loft conversion") && !p.includes("convert")) ||
    p.includes("conservatory") ||
    p.includes("roof light") ||
    p.includes("replacement window") ||
    p.includes("garden room") ||
    p.includes("outbuilding") && !p.includes("convert");

  if (isHouseholder && !p.match(/\d+\s*(dwelling|unit|flat|apartment|house)/)) {
    return { category: "householder", isRelevant: false, reason: "Minor householder extension" };
  }

  // EXCLUDE: Minor listed building works
  if (
    t.includes("listed building") &&
    (p.includes("window") ||
      p.includes("internal alteration") ||
      p.includes("repointing") ||
      p.includes("repair"))
  ) {
    return { category: "listed_building_minor", isRelevant: false, reason: "Minor listed building works" };
  }

  // EXCLUDE: Fencing, boundaries, solar panels on houses
  if (
    p.includes("fence") ||
    p.includes("boundary wall") ||
    (p.includes("solar panel") && !p.match(/\d+\s*(dwelling|unit)/))
  ) {
    return { category: "minor_works", isRelevant: false, reason: "Minor works" };
  }

  // EXCLUDE: Certificates of lawfulness for minor works
  if (
    (t.includes("lawful") || t.includes("certificate")) &&
    (p.includes("extension") || p.includes("outbuilding") || p.includes("loft"))
  ) {
    return { category: "certificate_minor", isRelevant: false, reason: "Certificate of lawfulness - minor" };
  }

  // INCLUDE: New build residential
  if (
    p.includes("erection of") ||
    p.includes("construction of") ||
    p.includes("new build") ||
    p.includes("new dwelling") ||
    p.match(/\d+\s*(dwelling|home|house|residential\s+unit)/)
  ) {
    return { category: "new_build", isRelevant: true, reason: "New residential development" };
  }

  // INCLUDE: Conversions
  if (
    p.includes("conversion") ||
    p.includes("convert") ||
    p.includes("change of use") ||
    t.includes("change of use")
  ) {
    return { category: "conversion", isRelevant: true, reason: "Conversion/change of use" };
  }

  // INCLUDE: Prior approval (Class MA, Q, etc.)
  if (t.includes("prior") || p.includes("prior approval") || p.includes("prior notification")) {
    if (p.includes("residential") || p.includes("dwelling") || p.includes("class ma") || p.includes("class q")) {
      return { category: "prior_approval", isRelevant: true, reason: "Prior approval - residential" };
    }
    return { category: "prior_approval_other", isRelevant: false, reason: "Prior approval - non-residential" };
  }

  // INCLUDE: Demolition and rebuild
  if (p.includes("demolition") && (p.includes("erection") || p.includes("replacement") || p.includes("redevelopment"))) {
    return { category: "demolition_rebuild", isRelevant: true, reason: "Demolition and rebuild" };
  }

  // INCLUDE: Apartments/flats
  if (p.includes("apartment") || p.includes("flat")) {
    return { category: "new_build", isRelevant: true, reason: "Apartment/flat development" };
  }

  // INCLUDE: HMO
  if (p.includes("hmo") || p.includes("house in multiple occupation") || p.includes("multiple occupation")) {
    return { category: "hmo", isRelevant: true, reason: "HMO conversion" };
  }

  // INCLUDE: Commercial development (major)
  if (
    (p.includes("commercial") || p.includes("office") || p.includes("retail") || p.includes("industrial")) &&
    (p.includes("erection") || p.includes("development") || p.includes("construction"))
  ) {
    return { category: "commercial", isRelevant: true, reason: "Commercial development" };
  }

  // INCLUDE: Mixed use
  if (p.includes("mixed use") || p.includes("mixed-use")) {
    return { category: "mixed_use", isRelevant: true, reason: "Mixed-use development" };
  }

  // INCLUDE: Subdivision
  if (p.includes("subdivision") || p.includes("sub-division") || p.includes("subdivide")) {
    return { category: "subdivision", isRelevant: true, reason: "Property subdivision" };
  }

  // INCLUDE: Outline/reserved matters for residential
  if (
    (t.includes("outline") || t.includes("reserved")) &&
    (p.includes("residential") || p.includes("dwelling") || p.includes("housing"))
  ) {
    return { category: "outline", isRelevant: true, reason: "Outline/reserved matters - residential" };
  }

  // Default: flag for manual review if it mentions dwellings/units
  if (p.includes("dwelling") || p.includes("unit") || p.includes("residential")) {
    return { category: "other_residential", isRelevant: true, reason: "Other residential - review recommended" };
  }

  // Default: not relevant
  return { category: "other", isRelevant: false, reason: "Non-residential/minor" };
}

/**
 * Extract company name from applicant/agent name or address.
 */
function extractCompany(name: string, address: string): string {
  const combined = `${name} ${address}`.trim();

  // Common patterns: "Mr J Smith" is not a company, but "ABC Developments Ltd" is
  const companyIndicators = [
    /\b(ltd|limited|llp|plc|inc|corp|group|holdings|partners|partnership|developments|properties|homes|construction|building|estates)\b/i,
  ];

  for (const pattern of companyIndicators) {
    if (pattern.test(combined)) {
      // Try to extract just the company part from the name field first
      if (pattern.test(name)) return name.trim();
      // Otherwise check address for company name (sometimes in c/o lines)
      const coMatch = address.match(/(?:c\/o|care of)\s+(.+?)(?:,|$)/i);
      if (coMatch) return coMatch[1].trim();
    }
  }

  return "";
}

// ─── St Albans median sold prices (for GDV estimation) ──────

const ST_ALBANS_MEDIANS: Record<string, number> = {
  detached: 892000,
  semi_detached: 580000,
  terraced: 445000,
  flat: 327000,
  blended: 560000, // weighted average
};

/**
 * Estimate GDV based on unit count and local sold prices.
 * Very rough — uses blended average unless we can infer types from proposal.
 */
function estimateGDV(proposal: string, units: number | null): number | null {
  if (!units || units === 0) return null;

  const p = proposal.toLowerCase();

  // Try to determine property type from proposal
  if (p.includes("flat") || p.includes("apartment") || p.includes("maisonette")) {
    return units * ST_ALBANS_MEDIANS.flat;
  }
  if (p.includes("detached") && !p.includes("semi")) {
    return units * ST_ALBANS_MEDIANS.detached;
  }
  if (p.includes("semi-detached") || p.includes("semi detached")) {
    return units * ST_ALBANS_MEDIANS.semi_detached;
  }
  if (p.includes("terraced") || p.includes("terrace") || p.includes("townhouse")) {
    return units * ST_ALBANS_MEDIANS.terraced;
  }
  if (p.includes("house") || p.includes("dwelling") || p.includes("home")) {
    // Mix of types — use blended
    return units * ST_ALBANS_MEDIANS.blended;
  }

  return units * ST_ALBANS_MEDIANS.blended;
}

// ─── Portal Scraping ─────────────────────────────────────────

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-GB,en;q=0.9",
          ...options.headers,
        },
      });
      if (response.ok) return response;
      console.warn(`  HTTP ${response.status} for ${url}, retry ${i + 1}/${retries}`);
    } catch (err) {
      console.warn(`  Fetch error for ${url}, retry ${i + 1}/${retries}:`, err);
    }
    await sleep(2000 * (i + 1));
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

/**
 * Search the Portal360 API for applications within a date range.
 * Returns a list of application reference numbers and basic info.
 */
async function searchApplications(
  fromDate: string,
  toDate: string,
  dateField: "received" | "decision" = "received"
): Promise<string[]> {
  const refs: string[] = [];
  let page = 1;
  let hasMore = true;

  console.log(`\nSearching for applications (${dateField}_date: ${fromDate} to ${toDate})...`);

  while (hasMore) {
    const params = new URLSearchParams();
    params.set(`${dateField}_dateFrom`, fromDate);
    params.set(`${dateField}_dateTo`, toDate);

    const url = `${SEARCH_URL}?${params.toString()}&page=${page}`;
    console.log(`  Fetching page ${page}...`);

    await sleep(RATE_LIMIT_MS);
    const response = await fetchWithRetry(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Portal360 typically lists applications with links containing reference numbers
    // Look for application links in the results
    const appLinks = $('a[href*="/planning/"]').filter((_, el) => {
      const href = $(el).attr("href") || "";
      return !!(href.includes("ref_no=") || (href.includes("/planning/") && $(el).text().match(/\d+\/\d+/)));
    });

    if (appLinks.length === 0) {
      // Try alternative: look for reference patterns in the page text
      const refMatches = html.match(/\b\d{1}\/\d{4}\/\d{4}(?:\/[A-Z]+)?\b/g);
      if (refMatches) {
        refMatches.forEach((ref) => {
          if (!refs.includes(ref)) refs.push(ref);
        });
      }

      // Also try 5/YYYY/NNNN pattern (St Albans format)
      const saRefMatches = html.match(/\b5\/\d{4}\/\d{4}(?:\/[A-Z]+)?\b/g);
      if (saRefMatches) {
        saRefMatches.forEach((ref) => {
          if (!refs.includes(ref)) refs.push(ref);
        });
      }
    } else {
      appLinks.each((_, el) => {
        const text = $(el).text().trim();
        const refMatch = text.match(/\b\d{1}\/\d{4}\/\d{4}(?:\/[A-Z]+)?\b/);
        if (refMatch && !refs.includes(refMatch[0])) {
          refs.push(refMatch[0]);
        }
      });
    }

    // Check for pagination
    const nextLink = $('a:contains("Next")').length > 0 || $('a[aria-label="Next"]').length > 0;
    const resultCount = $(".search-results-count, .result-count").text();
    const totalMatch = resultCount.match(/(\d+)\s*(?:result|application)/i);

    if (!nextLink || page > 20) {
      hasMore = false;
    } else {
      page++;
    }
  }

  console.log(`  Found ${refs.length} application references`);
  return refs;
}

/**
 * Fetch full details for a single application from the portal.
 */
async function fetchApplicationDetails(
  reference: string
): Promise<Partial<PlanningApplication> | null> {
  const url = `${SEARCH_URL}?ref_no=${encodeURIComponent(reference)}`;

  await sleep(RATE_LIMIT_MS);
  try {
    const response = await fetchWithRetry(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract fields from the detail page
    const getField = (label: string): string => {
      // Portal360 typically uses label/value pairs
      let value = "";

      // Try: <th>Label</th><td>Value</td> pattern
      $("th, dt, .label, label").each((_, el) => {
        const text = $(el).text().trim().toLowerCase();
        if (text.includes(label.toLowerCase())) {
          const next = $(el).next("td, dd, .value, span").first();
          if (next.length) {
            value = next.text().trim();
          }
        }
      });

      // Try: "Label: Value" text patterns
      if (!value) {
        const pattern = new RegExp(`${label}[:\\s]+([^\\n]+)`, "i");
        const match = html.match(pattern);
        if (match) value = match[1].trim();
      }

      return value;
    };

    const address = getField("address") || getField("site address") || getField("application_address");
    const proposal = getField("proposal") || getField("description") || getField("development");
    const appType = getField("application type") || getField("app_type") || getField("type");
    const applicantName = getField("applicant") || getField("ApplicantContactNoName") || "";
    const agentName = getField("agent") || getField("AgentContactNoName") || "";

    return {
      reference,
      address: address || "",
      postcode: extractPostcode(address || ""),
      ward: getField("ward") || "",
      parish: getField("parish") || "",
      proposal: proposal || "",
      application_type: appType || "",
      received_date: formatDate(getField("received") || getField("received_date") || ""),
      valid_date: formatDate(getField("valid") || getField("valid_date") || ""),
      decision_date: formatDate(getField("decision date") || getField("decision_date") || ""),
      expiry_date: formatDate(getField("expiry") || getField("expiry_date") || ""),
      status: getField("status") || getField("app_status") || "",
      decision_level: getField("decision level") || getField("decision_level") || "",
      case_officer: getField("case officer") || getField("case_officer") || "",
      applicant_name: applicantName,
      agent_name: agentName,
      source_url: `${BASE_URL}/planning/search-applications?ref_no=${encodeURIComponent(reference)}`,
    };
  } catch (err) {
    console.warn(`  Failed to fetch details for ${reference}:`, err);
    return null;
  }
}

/**
 * Alternative approach: scrape the search results page which lists multiple applications.
 * Portal360 shows results in a list with expandable detail sections.
 */
async function scrapeSearchResults(
  fromDate: string,
  toDate: string,
  dateField: "received" | "decision" = "received"
): Promise<Partial<PlanningApplication>[]> {
  const applications: Partial<PlanningApplication>[] = [];
  let page = 1;
  let hasMore = true;

  console.log(`\nScraping search results (${dateField}_date: ${fromDate} to ${toDate})...`);

  while (hasMore) {
    // Format dates as DD/MM/YYYY for the portal
    const fromParts = fromDate.split("-");
    const toParts = toDate.split("-");
    const fromFormatted = `${fromParts[2]}/${fromParts[1]}/${fromParts[0]}`;
    const toFormatted = `${toParts[2]}/${toParts[1]}/${toParts[0]}`;

    const params = new URLSearchParams();
    params.set(`${dateField}_dateFrom`, fromFormatted);
    params.set(`${dateField}_dateTo`, toFormatted);

    const url = `${SEARCH_URL}?${params.toString()}&page=${page}`;
    console.log(`  Fetching page ${page}: ${url}`);

    await sleep(RATE_LIMIT_MS);

    try {
      const response = await fetchWithRetry(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      // Debug: save raw HTML for first page
      if (page === 1) {
        const debugPath = path.join(
          process.cwd(),
          "data",
          "planning-exports",
          "st-albans-debug-response.html"
        );
        fs.writeFileSync(debugPath, html);
        console.log(`  Saved debug HTML to ${debugPath}`);
        console.log(`  Page title: ${$("title").text()}`);
        console.log(`  Page size: ${html.length} bytes`);

        // Log some structure to understand the page
        const headings = $("h1, h2, h3").map((_, el) => $(el).text().trim()).get();
        console.log(`  Headings found: ${JSON.stringify(headings.slice(0, 10))}`);

        const tables = $("table").length;
        console.log(`  Tables found: ${tables}`);

        const links = $("a").length;
        console.log(`  Links found: ${links}`);
      }

      // Strategy 1: Look for application result cards/rows
      // Portal360 typically uses .application-result or similar
      let resultBlocks = $(".search-result, .application-result, .result-item, [class*='result']");

      // Strategy 2: Look for table rows with application data
      if (resultBlocks.length === 0) {
        resultBlocks = $("table tbody tr").filter((_, el) => {
          const text = $(el).text();
          return /\d\/\d{4}\/\d{4}/.test(text);
        });
      }

      // Strategy 3: Look for definition lists (common in Portal360)
      if (resultBlocks.length === 0) {
        resultBlocks = $("dl, .detail-block, .app-details").filter((_, el) => {
          const text = $(el).text();
          return /\d\/\d{4}\/\d{4}/.test(text);
        });
      }

      console.log(`  Found ${resultBlocks.length} result blocks on page ${page}`);

      if (resultBlocks.length === 0) {
        // Try to extract any reference numbers from the full page
        const allRefs = html.match(/\b5\/\d{4}\/\d{4}(?:\/[A-Z]+)?\b/g);
        if (allRefs) {
          console.log(`  Found ${allRefs.length} reference numbers in raw HTML`);
          const uniqueRefs = [...new Set(allRefs)];
          for (const ref of uniqueRefs) {
            applications.push({ reference: ref });
          }
        }
        hasMore = false;
        continue;
      }

      resultBlocks.each((_, el) => {
        const block = $(el);
        const text = block.text();

        const refMatch = text.match(/\b5\/\d{4}\/\d{4}(?:\/[A-Z]+)?\b/);
        if (!refMatch) return;

        const app: Partial<PlanningApplication> = {
          reference: refMatch[0],
        };

        // Try to extract fields from the block
        const getValue = (label: string): string => {
          const pattern = new RegExp(`${label}[:\\s]*([^\\n]+)`, "i");
          const match = text.match(pattern);
          return match ? match[1].trim() : "";
        };

        app.address = getValue("address") || getValue("site");
        app.proposal = getValue("proposal") || getValue("description") || getValue("development");
        app.application_type = getValue("type") || getValue("application type");
        app.received_date = formatDate(getValue("received"));
        app.valid_date = formatDate(getValue("valid"));
        app.status = getValue("status");
        app.ward = getValue("ward");
        app.parish = getValue("parish");
        app.applicant_name = getValue("applicant");
        app.agent_name = getValue("agent");
        app.decision_date = formatDate(getValue("decision date"));
        app.case_officer = getValue("case officer") || getValue("officer");

        if (app.address) {
          app.postcode = extractPostcode(app.address);
        }

        applications.push(app);
      });

      // Check for next page
      const nextPageLink =
        $('a:contains("Next"), a:contains("next"), a[rel="next"], .pagination a').filter(
          (_, el) => {
            const href = $(el).attr("href") || "";
            return href.includes(`page=${page + 1}`);
          }
        ).length > 0;

      if (!nextPageLink || resultBlocks.length === 0 || page >= 20) {
        hasMore = false;
      } else {
        page++;
      }
    } catch (err) {
      console.error(`  Error fetching page ${page}:`, err);
      hasMore = false;
    }
  }

  return applications;
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  let fromDate: string;
  let toDate: string;

  // Parse arguments
  const daysIdx = args.indexOf("--days");
  const fromIdx = args.indexOf("--from");
  const toIdx = args.indexOf("--to");

  if (fromIdx >= 0 && toIdx >= 0) {
    fromDate = args[fromIdx + 1];
    toDate = args[toIdx + 1];
  } else {
    const days = daysIdx >= 0 ? parseInt(args[daysIdx + 1], 10) : 28;
    const now = new Date();
    const from = new Date(now);
    from.setDate(from.getDate() - days);
    fromDate = from.toISOString().split("T")[0];
    toDate = now.toISOString().split("T")[0];
  }

  console.log("═══════════════════════════════════════════════════════");
  console.log("  St Albans Planning Applications Scraper");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Authority: ${LOCAL_AUTHORITY}`);
  console.log(`  Date range: ${fromDate} to ${toDate}`);
  console.log(`  Portal: ${BASE_URL}`);
  console.log("");

  // Step 1: Scrape search results
  const rawApplications = await scrapeSearchResults(fromDate, toDate, "received");

  // Also get recent decisions
  const rawDecisions = await scrapeSearchResults(fromDate, toDate, "decision");

  // Merge, deduplicating by reference
  const allRefs = new Map<string, Partial<PlanningApplication>>();
  for (const app of [...rawApplications, ...rawDecisions]) {
    if (app.reference && !allRefs.has(app.reference)) {
      allRefs.set(app.reference, app);
    }
  }

  console.log(`\nTotal unique applications found: ${allRefs.size}`);

  // Step 2: For applications where we only have a reference, fetch full details
  const applications: PlanningApplication[] = [];
  let fetched = 0;

  for (const [ref, rawApp] of allRefs) {
    fetched++;
    let details = rawApp;

    // If we're missing key fields, fetch individual details
    if (!details.proposal || !details.address) {
      console.log(`  [${fetched}/${allRefs.size}] Fetching details for ${ref}...`);
      const fetched_details = await fetchApplicationDetails(ref);
      if (fetched_details) {
        details = { ...details, ...fetched_details };
      }
    } else {
      console.log(`  [${fetched}/${allRefs.size}] Already have details for ${ref}`);
    }

    // Categorise
    const { category, isRelevant, reason } = categoriseApplication(
      details.proposal || "",
      details.application_type || ""
    );

    // Extract units and estimate GDV
    const units = extractUnits(details.proposal || "");
    const estimatedGdv = estimateGDV(details.proposal || "", units);

    // Extract company info
    const applicantCompany = extractCompany(
      details.applicant_name || "",
      details.applicant_address || ""
    );
    const agentCompany = extractCompany(
      details.agent_name || "",
      details.agent_address || ""
    );

    const application: PlanningApplication = {
      reference: ref,
      planning_portal_ref: "",
      local_authority: LOCAL_AUTHORITY,
      source_url:
        details.source_url ||
        `${BASE_URL}/planning/search-applications?ref_no=${encodeURIComponent(ref)}`,
      address: details.address || "",
      postcode: details.postcode || extractPostcode(details.address || ""),
      ward: details.ward || "",
      parish: details.parish || "",
      town_slug: TOWN_SLUG,
      county_slug: COUNTY_SLUG,
      proposal: details.proposal || "",
      application_type: details.application_type || "",
      category,
      units,
      estimated_gdv: estimatedGdv,
      received_date: details.received_date || "",
      valid_date: details.valid_date || "",
      decision_date: details.decision_date || "",
      expiry_date: details.expiry_date || "",
      status: details.status || "",
      decision_level: details.decision_level || "",
      case_officer: details.case_officer || "",
      applicant_name: details.applicant_name || "",
      applicant_address: details.applicant_address || "",
      applicant_company: applicantCompany,
      agent_name: details.agent_name || "",
      agent_address: details.agent_address || "",
      agent_company: agentCompany,
      scraped_at: new Date().toISOString(),
      week_key: getWeekKey(new Date()),
      is_relevant: isRelevant,
      relevance_reason: reason,
    };

    applications.push(application);
  }

  // Step 3: Output results
  const today = new Date().toISOString().split("T")[0];
  const exportDir = path.join(process.cwd(), "data", "planning-exports");
  fs.mkdirSync(exportDir, { recursive: true });

  // Separate relevant and all
  const relevant = applications.filter((a) => a.is_relevant);
  const irrelevant = applications.filter((a) => !a.is_relevant);

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  Results Summary");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Total applications scraped: ${applications.length}`);
  console.log(`  Relevant (development): ${relevant.length}`);
  console.log(`  Filtered out: ${irrelevant.length}`);
  if (relevant.length > 0) {
    const withUnits = relevant.filter((a) => a.units);
    const totalUnits = withUnits.reduce((sum, a) => sum + (a.units || 0), 0);
    const totalGDV = relevant.reduce((sum, a) => sum + (a.estimated_gdv || 0), 0);
    console.log(`  Applications with unit counts: ${withUnits.length}`);
    console.log(`  Total units identified: ${totalUnits}`);
    console.log(`  Total estimated GDV: £${(totalGDV / 1000000).toFixed(1)}M`);
  }
  console.log("");

  // Category breakdown
  const categories = new Map<string, number>();
  for (const app of applications) {
    categories.set(app.category, (categories.get(app.category) || 0) + 1);
  }
  console.log("  Category breakdown:");
  for (const [cat, count] of [...categories.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${cat}: ${count}`);
  }

  // Write JSON — all applications (website pipeline can filter)
  const jsonPath = path.join(exportDir, `st-albans-${today}.json`);
  const jsonData = {
    metadata: {
      local_authority: LOCAL_AUTHORITY,
      town_slug: TOWN_SLUG,
      county_slug: COUNTY_SLUG,
      date_range: { from: fromDate, to: toDate },
      scraped_at: new Date().toISOString(),
      total_count: applications.length,
      relevant_count: relevant.length,
    },
    applications: applications,
  };
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
  console.log(`\n  JSON saved: ${jsonPath}`);

  // Write Excel — two sheets: "Relevant" and "All Applications"
  const xlsxPath = path.join(exportDir, `st-albans-${today}.xlsx`);

  const toRow = (app: PlanningApplication) => ({
    Reference: app.reference,
    Address: app.address,
    Postcode: app.postcode,
    Ward: app.ward,
    Proposal: app.proposal,
    Category: app.category,
    "App Type": app.application_type,
    Units: app.units || "",
    "Est. GDV": app.estimated_gdv ? `£${app.estimated_gdv.toLocaleString()}` : "",
    Status: app.status,
    "Received Date": app.received_date,
    "Decision Date": app.decision_date,
    "Decision Level": app.decision_level,
    Applicant: app.applicant_name,
    "Applicant Company": app.applicant_company,
    Agent: app.agent_name,
    "Agent Company": app.agent_company,
    "Case Officer": app.case_officer,
    "Portal Link": app.source_url,
    "Relevance": app.is_relevant ? "Yes" : "No",
    "Relevance Reason": app.relevance_reason,
  });

  const wb = XLSX.utils.book_new();

  // Sheet 1: Relevant applications (for outreach)
  const relevantRows = relevant.map(toRow);
  const ws1 = XLSX.utils.json_to_sheet(relevantRows);

  // Set column widths
  ws1["!cols"] = [
    { width: 16 },  // Reference
    { width: 40 },  // Address
    { width: 10 },  // Postcode
    { width: 15 },  // Ward
    { width: 60 },  // Proposal
    { width: 18 },  // Category
    { width: 15 },  // App Type
    { width: 6 },   // Units
    { width: 15 },  // Est. GDV
    { width: 12 },  // Status
    { width: 12 },  // Received Date
    { width: 12 },  // Decision Date
    { width: 14 },  // Decision Level
    { width: 25 },  // Applicant
    { width: 25 },  // Applicant Company
    { width: 25 },  // Agent
    { width: 25 },  // Agent Company
    { width: 20 },  // Case Officer
    { width: 50 },  // Portal Link
    { width: 8 },   // Relevance
    { width: 30 },  // Relevance Reason
  ];

  XLSX.utils.book_append_sheet(wb, ws1, "Relevant - Outreach");

  // Sheet 2: All applications
  const allRows = applications.map(toRow);
  const ws2 = XLSX.utils.json_to_sheet(allRows);
  ws2["!cols"] = ws1["!cols"];
  XLSX.utils.book_append_sheet(wb, ws2, "All Applications");

  // Sheet 3: Summary stats
  const summaryData = [
    { Metric: "Local Authority", Value: LOCAL_AUTHORITY },
    { Metric: "Date Range", Value: `${fromDate} to ${toDate}` },
    { Metric: "Total Applications", Value: applications.length },
    { Metric: "Relevant (Development)", Value: relevant.length },
    { Metric: "Filtered Out", Value: irrelevant.length },
    { Metric: "", Value: "" },
    { Metric: "CATEGORY BREAKDOWN", Value: "" },
    ...[...categories.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({ Metric: cat, Value: count })),
  ];
  const ws3 = XLSX.utils.json_to_sheet(summaryData);
  ws3["!cols"] = [{ width: 30 }, { width: 20 }];
  XLSX.utils.book_append_sheet(wb, ws3, "Summary");

  XLSX.writeFile(wb, xlsxPath);
  console.log(`  Excel saved: ${xlsxPath}`);

  // Also write the generated JSON for the website pipeline
  const generatedDir = path.join(
    process.cwd(),
    "data",
    "generated",
    "planning",
    COUNTY_SLUG,
    TOWN_SLUG
  );
  fs.mkdirSync(generatedDir, { recursive: true });

  const latestJson = {
    updatedAt: new Date().toISOString(),
    townSlug: TOWN_SLUG,
    countySlug: COUNTY_SLUG,
    localAuthority: LOCAL_AUTHORITY,
    dateRange: { from: fromDate, to: toDate },
    summary: {
      total: applications.length,
      relevant: relevant.length,
      byStatus: Object.fromEntries(
        [...new Map<string, number>()].concat(
          ...applications
            .filter((a) => a.is_relevant)
            .map((a) => [[a.status || "unknown", 1]] as [string, number][])
        )
      ),
      totalUnits: relevant.reduce((sum, a) => sum + (a.units || 0), 0),
      totalEstimatedGDV: relevant.reduce(
        (sum, a) => sum + (a.estimated_gdv || 0),
        0
      ),
    },
    applications: relevant.map((a) => ({
      reference: a.reference,
      address: a.address,
      postcode: a.postcode,
      ward: a.ward,
      proposal: a.proposal,
      category: a.category,
      units: a.units,
      estimatedGdv: a.estimated_gdv,
      status: a.status,
      receivedDate: a.received_date,
      decisionDate: a.decision_date,
      sourceUrl: a.source_url,
    })),
  };

  const latestPath = path.join(generatedDir, "latest.json");
  fs.writeFileSync(latestPath, JSON.stringify(latestJson, null, 2));
  console.log(`  Website JSON saved: ${latestPath}`);

  console.log("\n  Done!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
