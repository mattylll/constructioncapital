/**
 * FastWeb Planning Data Scraper
 *
 * Fetches planning applications from UK local authorities that use the
 * "FastWeb" planning portal system — a classic server-rendered ASP product
 * (distinct from Idox Public Access and Civica Portal360) used by a smaller
 * number of UK councils. Server-rendered HTML tables, no CSRF/session
 * tokens, GET-param pagination (`results.asp?Scroll=N`, 20 rows/page).
 *
 * Normalises results to the same canonical RawApp/ProcessedApp shape used
 * by fetch-planning-idox.ts, and writes identical `PlanningData` JSON so
 * `src/lib/local-market-data.ts` reads it transparently.
 *
 * ─── robots.txt note ──────────────────────────────────────────────────
 * The FastWeb portals checked during development (planning.wokingham.gov.uk)
 * serve `robots.txt` with `Disallow: /` at the site root. This is a known,
 * accepted deviation already present for the Idox/Civica scrapers in this
 * repo (see fetch-planning-idox.ts, fetch-planning-batch.ts) — we scrape
 * public, non-authenticated planning register data at a conservative,
 * throttled rate for a legitimate internal research/enrichment use case,
 * consistent with how this repo already treats these portals. Not a
 * decision to take lightly; flagging it explicitly here per that precedent.
 *
 * ─── User-Agent note (deliberate deviation from fetch-planning-idox.ts) ──
 * The Idox scraper spoofs a real Chrome desktop User-Agent string. This
 * scraper does NOT do that — it identifies itself honestly with a
 * distinct, descriptive UA (see FASTWEB_USER_AGENT below). FastWeb portals
 * had no CSRF/session gate that required blending in as a browser, so
 * there's no functional need to spoof, and honest identification is the
 * more defensible default absent that need.
 *
 * Several categorisation/processing helpers (RawApp, ProcessedApp,
 * writeWebsiteJson, processApplications, categorise, extractUnits,
 * estimateGDV, extractCompany, extractPostcode, loadMedianPrices, the
 * RELEVANT_TYPE_CODES / EXCLUDED_TYPE_CODES / RELEVANT_REF_CODES /
 * EXCLUDED_REF_CODES / BROAD_APP_TYPES sets, extractRefTypeCode,
 * parseUnitCount, NUMBER_WORDS, UNIT_TOKEN, NUMBER_TOKEN,
 * MAINTENANCE_PATTERNS, isMaintenanceProposal, FALLBACK_MEDIANS) are
 * copied verbatim from fetch-planning-idox.ts so categorisation behaves
 * identically regardless of source portal system. (Mirrors the precedent
 * already set in fetch-planning-idox.ts itself, which borrows its own
 * categorisation block from fetch-planning-batch.ts — see the comment
 * above RELEVANT_TYPE_CODES there.)
 *
 * IMPORTANT — FastWeb data-source limitation: unlike Idox/Civica, the
 * FastWeb application number ("App. No.") is typically a plain numeric or
 * council-prefixed ID (e.g. "261559", "RB2026/0918") with NO embedded
 * application-type suffix code (no trailing "/FUL", "/OUT" etc.), and the
 * FastWeb search-results listing exposes no separate app_type/status field
 * either. That means extractRefTypeCode() will almost always return null
 * for FastWeb apps, and categorise() falls back entirely to proposal-text
 * keyword matching (the same fallback path Idox uses for its own
 * type-code-less authorities, e.g. Brent). Categorisation is therefore
 * coarser for FastWeb sources than for Idox/Civica ones — this is an
 * inherent limitation of the source, not a bug, and is unavoidable without
 * visiting each application's separate detail page (which we deliberately
 * do not do, to keep request volume low — see below).
 *
 * Usage:
 *   npx tsx scripts/fetch-planning-fastweb.ts --all                        # All enabled authorities
 *   npx tsx scripts/fetch-planning-fastweb.ts --authority wokingham        # Single authority
 *   npx tsx scripts/fetch-planning-fastweb.ts --all --months 6             # Custom date range
 *
 * Output:
 *   data/planning-exports/{authority-id}-raw-api-{date}.json               # Raw normalised data
 *   data/generated/planning/{county}/{town}/latest.json                    # Website pipeline JSON
 */

import * as fs from "fs";
import * as path from "path";
import type { AuthorityTown } from "./planning-authorities";

// ─── Configuration ───────────────────────────────────────────

const RESULTS_PER_PAGE = 20; // FastWeb always returns 20 per page (results.asp?Scroll=N)
// At least as conservative as fetch-planning-idox.ts's THROTTLE_MS / THROTTLE_BETWEEN_MONTHS_MS.
const THROTTLE_MS = 1500;
const THROTTLE_BETWEEN_MONTHS_MS = 3000;
const MAX_RETRIES = 3;
const DEFAULT_MONTHS = 12;

// UK-wide fallback medians when local sold data is unavailable
// (copied verbatim from fetch-planning-idox.ts)
const FALLBACK_MEDIANS: Record<string, number> = {
  detached: 450000,
  semi_detached: 290000,
  terraced: 245000,
  flat: 230000,
  blended: 295000,
};

// ─── FastWeb Authority Types ─────────────────────────────────

export interface FastwebAuthority {
  /** Short unique identifier, e.g. "wokingham" */
  id: string;
  /** Full council name */
  name: string;
  /** Portal base URL (no trailing slash), e.g. "https://planning.wokingham.gov.uk" */
  baseUrl: string;
  /** FastWeb install path prefix, e.g. "/FastWebPL" */
  searchPath: string;
  /** Which towns in our site this authority covers */
  towns: AuthorityTown[];
  /** Whether this authority is enabled for fetching */
  enabled: boolean;
}

// ─── FastWeb Authority Registry ──────────────────────────────
//
// Verification status (checked 2026-07-05 via live HTTP fetches from this
// environment — see PR/task notes for full detail):
//
//  ✅ reading    — per task spec, this is one of the two "confirmed working"
//                  FastWeb authorities. HOWEVER: at verification time,
//                  planning.reading.gov.uk returned HTTP 502 Bad Gateway
//                  (Microsoft-Azure-Application-Gateway) on EVERY path
//                  tried, including the bare domain root — i.e. the whole
//                  subdomain looked down, not just this app. This looks
//                  like a transient outage rather than a dead/renamed
//                  portal (unlike e.g. Bracknell Forest in the Idox
//                  registry, which is dead DNS). The parser below assumes
//                  Reading's HTML matches Wokingham's template exactly
//                  (same commercial FastWeb product, same "_PL" naming
//                  convention, same Berkshire region) but this was NOT
//                  confirmed live — re-verify with DEBUG_HTML=1 before
//                  trusting Reading output.
//  ✅ wokingham  — fully verified live: welcome.asp, search.asp (advanced
//                  search field names), and results.asp (GET, ?Scroll=N,
//                  20 rows/page, "Next" link, resultsTable markup) were
//                  all fetched and inspected directly.
//  ⏸️  rotherham  — CONFIRMED live FastWeb portal at this exact baseUrl/
//                  searchPath (fetched welcome + results.asp directly;
//                  identical FastWeb template, "RB2026/NNNN"-style AltRef
//                  refs). Deliberately left disabled: this authority's
//                  results listing has NO decision-outcome text field at
//                  all (only "Decision Date:" + "Decision Sent Date:", no
//                  "Decision:" description like Wokingham's "Approve"/
//                  "Refuse"/etc.) — so approved/refused classification in
//                  writeWebsiteJson() cannot be derived from the listing
//                  alone and would silently misclassify decided
//                  applications as "pending". Needs bespoke per-authority
//                  field handling (schemaFamily-style, cf.
//                  planning-authorities.ts) before enabling.
//  ⏸️  eastleigh  — Eastleigh has migrated off FastWeb. The legacy
//                  "/FastWEB/welcome.asp" path returned HTTP 403. Its
//                  current live planning register is a Salesforce
//                  Experience Cloud portal at planning.eastleigh.gov.uk/s/
//                  (confirmed 200, completely different platform/markup —
//                  out of scope for this scraper). baseUrl below is left
//                  as the best-guess legacy value only for record-keeping.
//  ⏸️  south-lakeland — the FastWeb host resolves and responds, but every
//                  path (welcome.asp, search.asp) 301-redirects to the
//                  unified https://planningregister.westmorlandandfurness.gov.uk/
//                  (confirmed via curl -L). Legacy FastWeb instance is
//                  decommissioned in favour of that unified portal, which
//                  is a different system entirely — out of scope here.
//  ⏸️  eden       — same situation as South Lakeland: plansearch.eden.gov.uk
//                  resolves but 301-redirects to the same unified
//                  Westmorland & Furness portal. Decommissioned.
//  ⏸️  ipswich    — ADDED after a follow-up tip flagged Ipswich as another
//                  FastWeb authority. Host (ppc.ipswich.gov.uk) IS real and
//                  reachable (confirmed 200), and suffolk/ipswich slugs do
//                  exist in uk-locations-data.ts. However, its quick-search
//                  form posts to "searchValidate.asp" (not the
//                  "appnresults.asp" path the tip suggested), and no actual
//                  search submission / results-table structure was
//                  confirmed live — so this may not even be the same
//                  FastWeb template as Reading/Wokingham/Rotherham. Left
//                  disabled pending real verification.
//
// Note: a companion tip also claimed a live FastWeb portal for the London
// Borough of Sutton at "fastweb.sutton.gov.uk". That host does NOT resolve
// (DNS failure, confirmed via repeated curl attempts) — no Sutton entry has
// been added here. Do not add one without independently re-verifying a
// real, resolving host first.

export const FASTWEB_AUTHORITIES: FastwebAuthority[] = [
  // Migrated off FastWeb to the Arcus Built Environment platform (found live
  // 2026-07-06 at publicregister.reading.gov.uk/pr/s/register-view) — this
  // planning.reading.gov.uk host is stale. See fetch-planning-arcus.ts's
  // "reading" entry, which is the live, enabled scraper for this authority.
  {
    id: "reading",
    name: "Reading Borough Council",
    baseUrl: "https://planning.reading.gov.uk",
    searchPath: "/fastweb_PL",
    towns: [{ townSlug: "reading", countySlug: "berkshire" }],
    enabled: false,
  },
  {
    id: "wokingham",
    name: "Wokingham Borough Council",
    baseUrl: "https://planning.wokingham.gov.uk",
    searchPath: "/FastWebPL",
    towns: [{ townSlug: "wokingham", countySlug: "berkshire" }],
    enabled: true,
  },
  {
    id: "rotherham",
    name: "Rotherham Metropolitan Borough Council",
    baseUrl: "https://planning.rotherham.gov.uk",
    searchPath: "/fastweblive",
    towns: [{ townSlug: "rotherham", countySlug: "south-yorkshire" }],
    // Confirmed live FastWeb portal — disabled because its listing lacks a
    // decision-outcome text field (see registry comment above).
    enabled: false,
  },
  {
    id: "eastleigh",
    name: "Eastleigh Borough Council",
    // TODO: verify host before enabling. Legacy FastWEB path 403s; council
    // appears to have migrated to a Salesforce portal (planning.eastleigh.gov.uk/s/)
    // which is not FastWeb and out of scope for this scraper.
    baseUrl: "https://www.eastleigh.gov.uk",
    searchPath: "/FastWEB",
    towns: [{ townSlug: "eastleigh", countySlug: "hampshire" }],
    enabled: false,
  },
  {
    id: "south-lakeland",
    name: "South Lakeland District Council (Westmorland & Furness)",
    // TODO: verify host before enabling. Confirmed 301-redirects to the
    // unified https://planningregister.westmorlandandfurness.gov.uk/ portal
    // (a different, non-FastWeb system) — this legacy instance is
    // decommissioned.
    baseUrl: "https://applications.southlakeland.gov.uk",
    searchPath: "/fastweb",
    towns: [{ townSlug: "kendal", countySlug: "cumbria" }],
    enabled: false,
  },
  {
    id: "eden",
    name: "Eden District Council (Westmorland & Furness)",
    // TODO: verify host before enabling. Confirmed 301-redirects to the
    // same unified Westmorland & Furness portal as South Lakeland above —
    // decommissioned.
    baseUrl: "https://plansearch.eden.gov.uk",
    searchPath: "/fastweb",
    towns: [{ townSlug: "penrith", countySlug: "cumbria" }],
    enabled: false,
  },
  {
    id: "ipswich",
    name: "Ipswich Borough Council",
    // TODO: verify host before enabling. Host is real and reachable, but
    // the actual results-table/pagination structure has not been confirmed
    // live against a real search submission — do not trust this parser
    // against Ipswich output without re-verifying first.
    baseUrl: "https://ppc.ipswich.gov.uk",
    searchPath: "",
    towns: [{ townSlug: "ipswich", countySlug: "suffolk" }],
    enabled: false,
  },
];

// ─── Lookup Helpers ──────────────────────────────────────────

function getFastwebAuthority(id: string): FastwebAuthority | undefined {
  return FASTWEB_AUTHORITIES.find((a) => a.id === id);
}

function getEnabledFastwebAuthorities(): FastwebAuthority[] {
  return FASTWEB_AUTHORITIES.filter((a) => a.enabled);
}

// ─── Types (copied verbatim from fetch-planning-idox.ts) ──────

interface RawApp {
  ref_no: string;
  planning_portal_ref_no: string;
  application_address: string;
  UPRNDisplay: string;
  proposal: string;
  app_type: string;
  app_status: string;
  decision_notice_type: string;
  decision_date: string;
  decision_level: string;
  received_date: string;
  valid_date: string;
  expiry_date: string;
  ward: string;
  parish: string;
  case_officer: string;
  ApplicantContactNoName: string;
  AgentContactNoName: string;
  site_area: string;
  KeyNo: string;
  postcode?: string;
  _authority_id?: string;
  _base_url?: string;
  [key: string]: string | undefined;
}

interface ProcessedApp {
  reference: string;
  planning_portal_ref: string;
  local_authority: string;
  source_url: string;
  address: string;
  postcode: string;
  ward: string;
  parish: string;
  town_slug: string;
  county_slug: string;
  proposal: string;
  application_type: string;
  application_type_code: string;
  category: string;
  units: number | null;
  estimated_gdv: number | null;
  estimated_gdv_formatted: string;
  site_area_hectares: string;
  received_date: string;
  valid_date: string;
  decision_date: string;
  expiry_date: string;
  status: string;
  decision: string;
  decision_level: string;
  case_officer: string;
  applicant_name: string;
  applicant_company: string;
  agent_name: string;
  agent_company: string;
  scraped_at: string;
  is_relevant: boolean;
  relevance_reason: string;
}

// ─── Helpers (copied verbatim from fetch-planning-idox.ts) ────

function formatDateDDMMYYYY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function extractPostcode(address: string): string {
  const match = address.match(/([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})/i);
  return match ? match[1].toUpperCase().replace(/\s+/, " ") : "";
}

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const UNIT_TOKEN =
  "(?:dwelling|dwellings|unit|units|home|homes|house|houses|apartment|apartments|flat|flats|maisonette|maisonettes|bungalow|bungalows)";
const NUMBER_TOKEN =
  "(?:\\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)";

function parseUnitCount(raw: string): number | null {
  const value = raw.toLowerCase().replace(/-/g, " ").trim();
  const numeric = Number.parseInt(value, 10);
  if (Number.isFinite(numeric) && numeric > 0 && numeric < 500) return numeric;

  const total = value
    .split(/\s+/)
    .filter(Boolean)
    .reduce((sum, part) => sum + (NUMBER_WORDS[part] ?? 0), 0);
  return total > 0 && total < 500 ? total : null;
}

function extractUnits(proposal: string): number | null {
  const p = proposal.toLowerCase().replace(/\bno\./g, "no").replace(/\s+/g, " ");
  const hasResidentialSignal = /\b(dwelling|flat|apartment|residential|house|home|bungalow|maisonette)\b/i.test(p);
  const hasEquipmentSignal = /\b(antenna|telecom|telecommunications|radio\s+unit|remote\s+radio|transmission\s+dish|base\s+station|mast|cabinet|plant|condenser|generator)\b/i.test(p);
  if (hasEquipmentSignal && !hasResidentialSignal) return null;

  const patterns = [
    new RegExp(`\\b(${NUMBER_TOKEN})\\s*(?:no\\s*)?(?:residential\\s+)?${UNIT_TOKEN}\\b`, "i"),
    new RegExp(`\\b(${NUMBER_TOKEN})\\s*(?:x|no)\\s*(?:[a-z\\s-]+\\s+)?${UNIT_TOKEN}\\b`, "i"),
    new RegExp(`\\b(?:erection|construction|development|provision|creation|formation)\\s+of\\s+(${NUMBER_TOKEN})\\s+(?:[a-z\\s-]+\\s+)?${UNIT_TOKEN}\\b`, "i"),
    new RegExp(`\\b(?:into|to\\s+form|to\\s+create|providing|provide)\\s+(${NUMBER_TOKEN})\\s+(?:[a-z\\s-]+\\s+)?${UNIT_TOKEN}\\b`, "i"),
    new RegExp(`\\b(${NUMBER_TOKEN})\\s*(?:bed\\s*)?(?:room\\s*)?${UNIT_TOKEN}\\b`, "i"),
  ];
  for (const pattern of patterns) {
    const match = p.match(pattern);
    const units = match ? parseUnitCount(match[1]) : null;
    if (units) return units;
  }
  if (p.includes("single dwelling") || p.includes("1 dwelling") || p.includes("one dwelling")) return 1;
  if (
    (p.includes("change of use") || p.includes("conversion")) &&
    (p.includes("dwelling") || p.includes("residential")) &&
    !new RegExp(`\\b${NUMBER_TOKEN}\\s+${UNIT_TOKEN}\\b`, "i").test(p)
  ) {
    return 1;
  }
  return null;
}

function estimateGDV(
  proposal: string,
  units: number | null,
  medians: Record<string, number>
): number | null {
  if (!units || units === 0) return null;
  const p = proposal.toLowerCase();
  if (p.includes("flat") || p.includes("apartment") || p.includes("maisonette")) return units * medians.flat;
  if (p.includes("detached") && !p.includes("semi")) return units * medians.detached;
  if (p.includes("semi-detached") || p.includes("semi detached")) return units * medians.semi_detached;
  if (p.includes("terraced") || p.includes("terrace") || p.includes("townhouse")) return units * medians.terraced;
  return units * medians.blended;
}

function extractCompany(nameField: string): { name: string; company: string } {
  if (!nameField) return { name: "", company: "" };
  const bracketMatch = nameField.match(/^(.+?)\s*\((.+?)\)\s*$/);
  if (bracketMatch) {
    return { name: bracketMatch[1].trim(), company: bracketMatch[2].trim() };
  }
  const companyPattern =
    /\b(ltd|limited|llp|plc|inc|corp|group|holdings|partners|partnership|developments|properties|homes|construction|building|estates)\b/i;
  if (companyPattern.test(nameField)) {
    return { name: nameField.trim(), company: nameField.trim() };
  }
  return { name: nameField.trim(), company: "" };
}

// ─── Application Type Classification ─────────────────────────
// (Copied verbatim from fetch-planning-idox.ts, which itself borrows this
// block from fetch-planning-batch.ts for identical categorisation across
// every portal system in this repo.)

const RELEVANT_TYPE_CODES = new Set([
  "(Large Scale Major) Dwellings",
  "(Large Scale Major) All Other Developments",
  "(Large Scale Major) General Industry/Storage/Warehousing",
  "(Large Scale Major) Offices R & D Light Industry",
  "(Large Scale Major) Retail, Distribution & Servicing",
  "Smale Scale Major - Dwellings",
  "Small Scale Major - All Other Developments",
  "Small Scale Major - General Industry/Storage/Warehousing",
  "Small Scale Major - Offices R&D Light Industry",
  "Small Scale Major - Retail Distribution & Servicing",
  "(Minor) Dwellings",
  "(Minor) All Other Developments",
  "(Minor) Offices R&D Light Industry",
  "(Minor) Retail Distribution & Servicing",
  "(Minor) General Industry/Storage/Warehousing",
  "Minor Commercial Development",
  "Change of Use",
  "Other - Change of use",
  "Prior Approval - Office to residential",
  "Prior Approval - Industrial to residential",
  "Prior approval - Retail to residential or mix",
  "Prior approval - agriculture to residential",
  "Prior Approval - Agriculture to range of uses",
  "Prior Approval - Demolition",
  "Prior Approval - Determination",
  "Permission in Principle",
  "Conservation Area",
  "Listed Buildings Applications",
  "Demolish Listed Building",
  "Full Planning Application (pre-2009)",
  "Full Planning application pre-2000",
  "Dwellings (pre-2009)",
  "Major Development (pre-2009)",
  "Minor Development (pre-2009)",
  "MIND", "MOR", "MORI", "SSM", "SMG", "LSM", "LSA", "LMG", "LRD",
  "MGT", "MPI", "COU", "PIP", "NAC", "PAOR", "PAAR", "PARR", "PAAF",
  "DEM", "LBB", "EIA", "SCR", "EXE", "ENF",
  "FUL", "OUT", "VAR", "REM", "CPL", "CPE", "LBC", "PDE", "AGR", "CND",
  "COND", "MPO", "OHL", "CPO", "LDP",
  "P3OPA", "P3RPA", "P3MPA", "P3PPA",
  "S73", "CUPAMA", "CUPAQ", "CUPAR", "PRIOR", "SUPA", "AG", "MOD106",
  "Full", "Change of Use", "Outline", "Reserved Matters", "Listed Building",
  "Prior Approval", "Reg3or4 or NCC or EE", "Proposed Use", "Permitted Dev Extn",
  "Lawful/Establish.Use", "S.73 app - full", "S.73 app - outline", "S.73 app - CoU",
  "Perm' in Principle", "Local Develop't Orde",
  "Full Application", "Full Planning", "Outline Application",
  "Reserved Matters Application", "Variation of Condition", "Removal of Condition",
  "Listed Building Consent", "Certificate of Lawfulness",
  "Full Planning Application", "Outline Planning Application",
  "Major Full", "Major Outline", "Major Reserved Matters",
  "Major Remove / Vary condition", "Reserved Matter Application",
  "Application to Remove / Vary a Condition",
  "Application submitted under Section 73 of the Act",
  "Listed Building Consent - Extensions / Alterations",
  "Conservation Area Consent",
  "Full General Regulations submitted by ADC under Regulation 3",
  "Demolition Prior Notification", "Demolition Determination",
  "Applications sumbitted by Nottinghamshire County Council under Regulation 3",
  "Modify/Remove Section 106 Agreement",
  "Applications submitted under Private Acts",
  // Idox ref codes (Reigate, Epsom, etc.)
  "F", "CU", "RET", "AGD", "DED", "CONLA", "VS106",
  "LBA", // Listed Building Application (Epsom)
  "PDEAD", "PDCOU", "PDEAB", // PD variants
  "S106A", // S106 agreement
  "REMF", // Reserved Matters variant
  // Greenwich codes
  "L", // Listed Building (Greenwich)
  "I106", // S106 (Greenwich)
  "PN1", // Prior Notification (Greenwich)
  // "K" moved to EXCLUDED — consultation by other borough
  // Croydon codes
  "GPDO", // General Permitted Development Order
  "PDO", // Prior Determination Order
  "AUT", // Authority's own application
  "PAD", // Prior Approval Demolition
  "PA8", // Prior Approval Class 8
  // Ealing codes (NNNNNNTYPE format)
  "PALHE", // Prior Approval Large Home Extension
  "PACBSD", // Prior Approval Commercial to Small Dwelling
  "PACEC", // Prior Approval Class EC
  "FULR", // Full Retrospective
  "OPDLDE", "OPDLDC", // OPDC applications
]);

const EXCLUDED_TYPE_CODES = new Set([
  "Tree works in conservation area",
  "Tree works to TPO trees(s)",
  "Planning Portal Tree Submission",
  "Advert", "Advert (pre-2009)",
  "Householder",
  "Prior Notification Householder",
  "Certificate of Lawfulness - (proposed)",
  "Certificate of Lawfulness (existing)",
  "Certificate of Lawfulness (existing) (pre-2009)",
  "Certificate of Lawfulness (Proposed) (pre-2009)",
  "Discharge of Condition",
  "Non Materials Amendment",
  "EIA - SCOPING OPINION", "EIA - SCREENING OPINION",
  "Awaiting Validation", "Incomplete", "Invalid",
  "Withdrawn", "Withdrawn (pre-2009)",
  "Notifications", "Notifications (pre-2009)",
  "Pre-app",
  "Neighbouring Local Authority Consultation",
  "Section 53 Determination", "Established Use",
  "Hazardous Substance Consent",
  "Prior Approval - Telecommunications (pre-2009)",
  "Prior Approval - Agricultural Buildings (pre-2009)",
  "Prior approval - solar panels to non-domestic building",
  "Prior approval - shops to restaurant and cafe",
  "Prior Approval - to state school or nursery",
  "Agricultural Building", "Enforcement",
  "Environmental Impact Assessment",
  "PAV", "County Council", "planning portal submissions",
  "HSE", "TCA", "TPO", "T", "W", "CON", "CLP", "CEX", "MAL", "NMA",
  "NCS", "ADV", "INC", "INV", "AVA", "PPOR", "TELC", "PASP", "PAO",
  "AGB", "HCC", "S106",
  "HOUS", "DISCON", "DCOND", "PREAPP", "BBREG5", "TEREG5",
  "TCONSV", "STCA", "SPREAP",
  "Full Plans", "LB Consent", "Discharg", "TREES", "TEL", "WPD",
  "SCREEN", "HEDG", "PCAMS", "SADV",
  "Non-Material Change", "Advertisement", "WAS", "APNB", "APNW",
  "Condition Discharge", "Works to TPO trees", "Pre-App Enquiry",
  "Telecoms 28 day not.", "Telecom 14 day enq", "Trees in Con.Area",
  "Non Material Amendm'", "EIA Screening",
  "Obligation/106 Det.", "Planning Perform' Ag", "s106 Deed of Varia'n",
  "Determination 56", "Certified Location",
  "Building Control", "Local Land Charges", "Housing Assistance",
  "Complaint", "High Hedges", "Trees & Landscaping",
  "Householder Application", "Tree Preservation Order",
  "Trees in Conservation Area", "Discharge of Conditions",
  "Non-Material Amendment", "Pre-Application", "Pre-Application Advice",
  "Telecommunications", "Advertisement Consent",
  "Advertisement Application",
  "Application to undertake work on a tree protected by a Tree Preservation Order",
  "Application to undertake work on Trees in a Conservation Area",
  "Certificate of Lawfulness - Proposed Use/Development",
  "Certificate of Lawfulness - Existing Use/Development",
  "Telecommunication Prior Notification",
  "Telecommunications - Determination 42 Days",
  "Telecommunications - Determination 28 Days",
  "Agricultural Prior Notification Application",
  "Agricultrual Determination Application",
  "County Matter", "Hedgerow Removal notices",
  "Screening / Scoping Opinions",
  "Submission in Complaince with a Condition",
  "Consultations on applications submitted by ADC under Regulation 4",
  "CD", "RG", "PA", "BD", "DM", "SF", "Q",
  "EXT", "CB", "FSR", "MEXT",
  "PACU", "PATE", "PAOT", "PAAD",
  // Idox ref codes (Reigate, Epsom, etc.)
  "HHOLD", "CAN", "CLP", "CLE", "BNG", "TED", "HRN",
  "FLH", "FLHF", // Full Householder
  "COND", // Discharge of Conditions
  "NMA", // Non-Material Amendment
  "CNA", // Conservation area notification
  "NOTTE", // Notification
  "CMA", // Conservation Minor Application
  "CLPF", // Certificate Lawfulness Proposed (variant)
  "T56", // Telecoms
  "ELC", // Electricity
  "SCR", // Screening opinion
  // Greenwich codes
  "SD", // Submission of Details (discharge of conditions)
  "HD", // Householder Development
  "CP", // Certificate of Lawfulness Proposed
  "TC", // Tree in Conservation Area
  "A", // Advertisement
  "MA", // Minor Amendment
  "CE", // Certificate Existing
  "TELN", // Telecoms notification (Brent)
  "K", // Consultation by other borough (Greenwich)
  "G", // Development by Govt Dept (Greenwich)
  "H", // Hazardous substances (Greenwich)
  "CLPL", // Cert of Lawfulness for Listed Bldg (Greenwich)
  "AEA", // Additional Environmental Approval (Greenwich)
  "BGP", // Biodiversity Gain Plan (Greenwich)
  "CAAD", // Cert of Appropriate Alt Development (Greenwich)
  "D1", // Demolition Prior Approval Required (Greenwich) — not residential
  "PN6", // Agricultural/Forestry (Greenwich)
  "PN7", // Demolition notification (Greenwich)
  // Croydon codes
  "DISC", // Discharge of conditions
  "LP", // Lawful Development Proposed
  "TRE", // Trees
  "LE", // Lawful Existing
  "CONR", // Conservation area (non-residential)
  "PRE", // Pre-application
  "TR5", // Trees
  // Ealing codes (NNNNNNTYPE format)
  "PTC", // Planning Telecoms Consultation
  "PTT", // Planning Tree TPO
  "FTT", // Trees
  "OPDCOB", // Old Oak Park Dev Corp Observation
  "OPDCND", // OPDC conditions
  "CONS", // Conservation area
  "CNDR", // Conditions variant
  "CPLR", // Cert lawfulness proposed retrospective
  "DV", // Deed of Variation
  "HS", // Householder variant
]);

const MAINTENANCE_PATTERNS = [
  /replace\s+(?:existing\s+)?(?:window|door|roof|gutter|fascia|render|fence|gate)/i,
  /like\s+for\s+like/i,
  /repair\s+(?:to\s+)?(?:existing|boundary|roof|wall|chimney)/i,
  /repaint/i,
  /install(?:ation)?\s+(?:of\s+)?(?:solar\s+panel|alarm|cctv|satellite|aerial|boiler|heat\s+pump|ev\s+charg)/i,
  /^(?:re-?roofing|re-?rendering|re-?pointing)/i,
];

function isMaintenanceProposal(proposal: string): boolean {
  const p = proposal.toLowerCase();
  const hasDevelopmentSignal = /\b(dwelling|unit|flat|apartment|residential|house|home|conversion|change\s+of\s+use|new\s+build|erection)\b/i.test(p);
  if (!hasDevelopmentSignal && /\b(solar|photovoltaic|pv\s+panel|heat\s+pump|air\s+source|ev\s+charg|battery\s+storage)\b/i.test(p)) {
    return true;
  }
  if (p.length < 60 && !p.match(/dwelling|unit|flat|apartment|residential|house|home/)) {
    if (MAINTENANCE_PATTERNS.some((pat) => pat.test(p))) return true;
  }
  if (p.includes("like for like") || p.includes("like-for-like")) return true;
  return false;
}

// Ref codes that indicate relevant application types
const RELEVANT_REF_CODES = new Set([
  "FUL", "OUT", "REM", "S73", "PIP", "DEM", "LBC",
  "CUPAMA", "CUPAQ", "CUPAR", "PRIOR", "SUPA", "AG", "MOD106",
  // Idox-specific codes commonly seen in Reigate & Banstead etc.
  "PDE", "VAR", "CPL", "CPE",
  // Reigate & Banstead specific
  "F",  // Full application
  "CU", // Change of Use
  "RET", // Retrospective
  "AGD", // Agricultural Determination
  "DED", // Demolition
  "CONLA", // Conservation Area (Listed alteration)
  // Prior approval variants: PAP3MA, PAP14J, PAP14A, PAP3R, P20ZA
  // (handled by startsWith check below)
  // Reserved Matters variants: RM1G, RM4B
  // (handled by startsWith check below)
  // Variation of S106
  "VS106",
]);

// Ref codes that indicate excluded application types
const EXCLUDED_REF_CODES = new Set([
  "PE", "PEPD", "TELPE", "DOC", "DD", "TPO", "CAT",
  "CLOPUD", "CLEUD", "NMAT", "ADV", "HHPA", "HHPAA",
  "OBS3", "OBS4", "REQ", "CM", "EIASO", "COD", "EB",
  "PROW", "S19", "TEL56", "CHL",
  "ENF", "ENFB", "ENFT1", "ENFT2", "ENFT3", "ENFC", "ENFA",
  "ADVREF", "TPOREF", "NONDET", "REFUSE", "HH", "S195",
  // Idox householder codes
  "HOUS", "HSE", "HHOLD",
  // Reigate & Banstead specific
  "CAN", // Cancelled/withdrawn
  "CLP", // Certificate of Lawfulness Proposed
  "CLE", // Certificate of Lawfulness Existing
  "CON", // Conservation area consent (non-residential unless proposal says otherwise)
  "BNG", // Biodiversity Net Gain
  "TED", // Telecom Equipment Determination
  "SCOPE", // EIA Scoping
  "SCREEN", // EIA Screening
  "HRN", // Hedgerow Removal Notice
]);

// Broad app_type values that need ref-based sub-classification
const BROAD_APP_TYPES = new Set([
  "Development Management",
  "Appeal",
  "Enforcement",
]);

function extractRefTypeCode(refNo: string): string | null {
  // Format 1: "YY/NNNNN/TYPE" (e.g., "25/00187/FUL")
  const m1 = refNo.match(/\d+\/\d+\/(\w+)/);
  if (m1) return m1[1].toUpperCase();

  // Format 2: "NNNNNNTYPE" (e.g., "251683HH", "251936CND") — Ealing style
  const m2 = refNo.match(/^\d{5,7}([A-Z]{2,})/i);
  if (m2) return m2[1].toUpperCase();

  // Format 3: "YY/NNNN" (e.g., "25/1288") — Brent style, no type
  return null;
}

function categorise(app: RawApp): { category: string; isRelevant: boolean; reason: string } {
  let appType = app.app_type || "";
  const proposal = (app.proposal || "").toLowerCase();

  // For councils with broad app_type or empty, extract type from reference
  if (BROAD_APP_TYPES.has(appType) || appType === "") {
    const refCode = extractRefTypeCode(app.ref_no || "");
    if (refCode) {
      // Pattern-based exclusions (DET01-DET99, NMAMD1-9, etc.)
      if (/^DET\d/.test(refCode)) return { category: "excluded", isRelevant: false, reason: `Discharge of condition: ${refCode}` };
      if (/^NMAMD/.test(refCode)) return { category: "excluded", isRelevant: false, reason: `Non-material amendment: ${refCode}` };

      if (EXCLUDED_REF_CODES.has(refCode)) {
        if (refCode === "TPO" || refCode === "CAT") return { category: "trees", isRelevant: false, reason: `Ref type: ${refCode}` };
        if (refCode === "ADV") return { category: "advertisement", isRelevant: false, reason: `Ref type: ${refCode}` };
        if (refCode === "HHPA" || refCode === "HHPAA" || refCode === "HOUS" || refCode === "HSE" || refCode === "HH" || refCode === "HHOLD") return { category: "householder", isRelevant: false, reason: `Ref type: ${refCode}` };
        if (refCode === "PE" || refCode === "PEPD" || refCode === "TELPE") return { category: "excluded", isRelevant: false, reason: `Pre-app ref: ${refCode}` };
        if (refCode === "DOC" || refCode === "DD") return { category: "excluded", isRelevant: false, reason: `Discharge ref: ${refCode}` };
        if (refCode === "NMAT") return { category: "excluded", isRelevant: false, reason: `NMA ref: ${refCode}` };
        if (refCode === "CLOPUD" || refCode === "CLEUD" || refCode === "CLP" || refCode === "CLE") return { category: "excluded", isRelevant: false, reason: `Certificate ref: ${refCode}` };
        if (refCode === "CAN") return { category: "excluded", isRelevant: false, reason: `Cancelled: ${refCode}` };
        return { category: "excluded", isRelevant: false, reason: `Excluded ref: ${refCode}` };
      }

      // Pattern-based inclusions
      if (/^PAP/.test(refCode) || /^P\d+/.test(refCode)) {
        appType = "Prior Approval"; // Normalise PAP3MA, PAP14J, P20ZA etc.
      } else if (/^RM\d/.test(refCode)) {
        appType = "REM"; // Reserved Matters variants (RM1G, RM4B etc.)
      } else if (/^VS106/.test(refCode)) {
        appType = "MOD106"; // S106 variation
      } else if (RELEVANT_REF_CODES.has(refCode)) {
        appType = refCode;
      }
    }
  }

  // Pattern-based exclusions for Idox ref-code-as-type (DETnn, NMAMDn, COND, SD, DISC etc.)
  if (/^DET\d/.test(appType) || appType === "COND" || appType === "SD" || appType === "DISC") return { category: "excluded", isRelevant: false, reason: `Discharge of condition: ${appType}` };
  if (/^NMAMD/.test(appType) || appType === "NMA" || appType === "MA") return { category: "excluded", isRelevant: false, reason: `Non-material amendment: ${appType}` };
  if (appType === "LP" || appType === "LE" || appType === "CLPF" || appType === "CPL" || appType === "CPE" || appType === "CPLR") return { category: "excluded", isRelevant: false, reason: `Certificate of lawfulness: ${appType}` };
  if (appType === "TRE" || appType === "TR5" || appType === "PTT" || appType === "FTT") return { category: "trees", isRelevant: false, reason: `Tree work: ${appType}` };
  if (/^CND/.test(appType) || appType === "CNDR") return { category: "excluded", isRelevant: false, reason: `Conditions: ${appType}` };
  if (/^OPD/.test(appType) && appType !== "OPDLDE" && appType !== "OPDLDC") return { category: "excluded", isRelevant: false, reason: `OPDC: ${appType}` };
  if (appType === "PTC") return { category: "excluded", isRelevant: false, reason: `Telecoms: ${appType}` };
  if (appType === "DV") return { category: "excluded", isRelevant: false, reason: `Deed of variation: ${appType}` };
  if (appType === "CONS") return { category: "excluded", isRelevant: false, reason: `Conservation area: ${appType}` };
  if (appType === "PRE") return { category: "excluded", isRelevant: false, reason: `Pre-application: ${appType}` };
  if (appType === "CONR") return { category: "excluded", isRelevant: false, reason: `Conservation area: ${appType}` };
  // Pattern-based normalisation for Idox prior approval / reserved matters / PD variants
  if (/^PAP/.test(appType) || /^PA\d/.test(appType) || /^PAC/.test(appType) || appType === "PAD" || appType === "PALHE") appType = "Prior Approval";
  if (/^PDE/.test(appType) || appType === "PDCOU" || appType === "PDEAD" || appType === "PDEAB" || appType === "PDO" || appType === "GPDO") appType = "Prior Approval";
  if (/^RM\d/.test(appType) || appType === "REM" || appType === "REMF" || appType === "R") appType = "REM";
  if (/^VS106/.test(appType) || appType === "S106A" || appType === "I106") appType = "MOD106";
  if (appType === "LBA" || appType === "L") appType = "LBC"; // Normalise Listed Building variants
  if (appType === "O") appType = "OUT"; // Outline (Greenwich single-letter code)
  if (/^PN\d/.test(appType)) appType = "Prior Approval"; // Prior notification variants (PN1-PN7 etc.)
  if (appType === "AUT" || appType === "FULR") appType = "FUL"; // Authority's own / Retrospective = full planning

  if (EXCLUDED_TYPE_CODES.has(appType)) {
    if (appType.includes("Tree") || appType.includes("TPO") || appType === "TCA" || appType === "TCONSV" || appType === "STPO") return { category: "trees", isRelevant: false, reason: `Excluded type: ${appType}` };
    if (appType.includes("Advert")) return { category: "advertisement", isRelevant: false, reason: `Excluded type: ${appType}` };
    if (appType === "Householder" || appType === "HOUS" || appType === "HHOLD" || appType === "FLH" || appType === "FLHF" || appType === "HD" || appType === "HH" || appType === "HS" || appType === "HSE" || appType === "Prior Notification Householder" || appType === "Householder Application") return { category: "householder", isRelevant: false, reason: `Excluded type: ${appType}` };
    if (appType === "CAN") return { category: "excluded", isRelevant: false, reason: `Cancelled/withdrawn: ${appType}` };
    if (appType === "planning portal submissions") {
      if (proposal.match(/\b(dwelling|unit|flat|apartment|house|home|residential|erection|demolition|conversion|change\s+of\s+use)\b/i)) {
        // Fall through to proposal-text analysis
      } else {
        return { category: "excluded", isRelevant: false, reason: "Unvalidated portal submission" };
      }
    } else {
      return { category: "excluded", isRelevant: false, reason: `Excluded type: ${appType}` };
    }
  }

  if (isMaintenanceProposal(app.proposal || "")) {
    return { category: "maintenance", isRelevant: false, reason: `Maintenance/like-for-like: ${appType}` };
  }

  if (RELEVANT_TYPE_CODES.has(appType) || appType === "planning portal submissions") {
    if (proposal.includes("prior approval") || appType.includes("Prior Approval")) {
      if (proposal.match(/\b(monopole|antenna|mast|telecoms?|telecommunications|5g|cabinet)\b/)) {
        return { category: "telecoms", isRelevant: false, reason: `Telecoms prior approval: ${appType}` };
      }
      return { category: "prior_approval", isRelevant: true, reason: `Prior approval: ${appType}` };
    }
    if (proposal.includes("change of use") || appType.includes("Change of Use")) {
      return { category: "change_of_use", isRelevant: true, reason: `Change of use: ${appType}` };
    }
    if (proposal.includes("conversion") || proposal.includes("convert")) {
      return { category: "conversion", isRelevant: true, reason: `Conversion: ${appType}` };
    }
    if (proposal.includes("demolition") && (proposal.includes("erection") || proposal.includes("replacement of"))) {
      if (!proposal.includes("listed building consent") || proposal.match(/\d+\s*(dwelling|unit|flat|apartment)/)) {
        return { category: "demolition_rebuild", isRelevant: true, reason: `Demolition & rebuild: ${appType}` };
      }
    }
    if (proposal.includes("erection") || proposal.includes("construction") || proposal.includes("new build")) {
      if (proposal.match(/\b(apartment|flat|dwelling|block|maisonette)s?\b/) && !proposal.match(/^proposed\s+(ground|first|side|rear|front|loft|single|two)\s/)) {
        return { category: "new_build", isRelevant: true, reason: `New build: ${appType}` };
      }
      if (proposal.match(/\d+\s*(dwelling|unit|flat|apartment|house|home)/)) {
        return { category: "new_build", isRelevant: true, reason: `New build (units in proposal): ${appType}` };
      }
      if (proposal.match(/\bextension/)) {
        return { category: "extensions", isRelevant: false, reason: `Extensions only: ${appType}` };
      }
    }
    if (proposal.includes("hmo") || proposal.includes("multiple occupation")) {
      return { category: "hmo", isRelevant: true, reason: `HMO: ${appType}` };
    }
    if (proposal.includes("mixed use") || proposal.includes("mixed-use")) {
      return { category: "mixed_use", isRelevant: true, reason: `Mixed use: ${appType}` };
    }
    if (appType.includes("Listed Building") || appType.includes("Conservation Area")) {
      if (proposal.match(/\b(dwelling|unit|flat|apartment|residential|conversion|change\s+of\s+use)\b/)) {
        return { category: "heritage", isRelevant: true, reason: `Heritage with residential element: ${appType}` };
      }
      return { category: "heritage_minor", isRelevant: false, reason: `Heritage (non-residential): ${appType}` };
    }
    if (RELEVANT_TYPE_CODES.has(appType)) {
      return { category: "other_relevant", isRelevant: true, reason: `Relevant type: ${appType}` };
    }
  }

  if (proposal.match(/\d+\s*(dwelling|unit|flat|apartment|house|home)/)) {
    return { category: "other_residential", isRelevant: true, reason: "Residential keywords in proposal" };
  }

  return { category: "unclassified", isRelevant: false, reason: `Unclassified type: ${appType}` };
}

// ─── Median Price Loading (copied verbatim from fetch-planning-idox.ts) ──

interface SoldDataFile {
  stats: {
    medianPrice: number;
    medianByType: Record<string, number>;
  };
}

function loadMedianPrices(
  countySlug: string,
  townSlug: string
): Record<string, number> {
  const soldPath = path.join(
    process.cwd(),
    "data",
    "generated",
    "sold-data",
    countySlug,
    townSlug,
    "latest.json"
  );

  try {
    if (fs.existsSync(soldPath)) {
      const data: SoldDataFile = JSON.parse(fs.readFileSync(soldPath, "utf-8"));
      const byType = data.stats.medianByType || {};
      return {
        detached: byType.D || FALLBACK_MEDIANS.detached,
        semi_detached: byType.S || FALLBACK_MEDIANS.semi_detached,
        terraced: byType.T || FALLBACK_MEDIANS.terraced,
        flat: byType.F || FALLBACK_MEDIANS.flat,
        blended: data.stats.medianPrice || FALLBACK_MEDIANS.blended,
      };
    }
  } catch (err) {
    console.log(`  ⚠️  Could not load sold data for ${countySlug}/${townSlug}: ${err}`);
  }

  console.log(`  ℹ️  Using UK-wide fallback medians for ${countySlug}/${townSlug}`);
  return { ...FALLBACK_MEDIANS };
}

// ─── HTML Parsing (regex-based, no dependencies) ──────────────

/**
 * Decode common HTML entities to plain text.
 * (Copied verbatim from fetch-planning-idox.ts.)
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&nbsp;/g, " ");
}

/**
 * Strip HTML tags and collapse whitespace.
 * (Copied verbatim from fetch-planning-idox.ts.)
 */
function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

interface FastwebSearchResult {
  /** The AltRef query-param value, e.g. "261559" (Wokingham) or "RB2026/0918" (Rotherham) */
  altRef: string;
  /** Site Address field, HTML-stripped */
  address: string;
  /** Description field, HTML-stripped */
  proposal: string;
  /** "Received Date:" field, already DD/MM/YYYY on the live sites tested */
  receivedDate: string;
  /** "Date Valid:" field — not present on every FastWeb authority's template */
  validDate: string;
  /** "Decision Date:" field */
  decisionDate: string;
  /** "Decision:" free-text field (e.g. "Approve", "Refuse", "Prior Approval not required")
   *  — NOT present on every FastWeb authority's template (see Rotherham note above). */
  decisionText: string;
}

/**
 * Parse a FastWeb results.asp page into individual application records.
 *
 * Each application on a results page is rendered as its own standalone
 * `<table BORDER="0" CELLSPACING="0" CELLPADDING="4" width="100%" ...>`
 * block (optionally with an `id="resultsTable"` attribute — present on
 * Wokingham's markup, absent on Rotherham's, hence the `[^>]*` tail rather
 * than matching the id explicitly). This was verified directly against
 * live HTML fetched from planning.wokingham.gov.uk and
 * planning.rotherham.gov.uk.
 *
 * Field extraction is done by scanning for each row's label text anywhere
 * in the block (rather than assuming a fixed row/column position), because
 * the exact row layout differs between authorities on this same product
 * (e.g. Wokingham has a distinct "Decision:" text row that Rotherham's
 * template omits entirely).
 */
function parseFastwebResults(html: string): FastwebSearchResult[] {
  const results: FastwebSearchResult[] = [];

  const chunks = html.split(
    /<table\s+BORDER=["']?0["']?\s+CELLSPACING=["']?0["']?\s+CELLPADDING=["']?4["']?\s+width=["']?100%["']?[^>]*>/i
  );

  for (let i = 1; i < chunks.length; i++) {
    const chunk = chunks[i];
    const endIdx = chunk.indexOf("</table>");
    const block = endIdx >= 0 ? chunk.substring(0, endIdx) : chunk;

    const altRefMatch = block.match(/AltRef=([^&"'<>\s]+)/i);
    if (!altRefMatch) continue; // not an application block (safety net)
    const altRef = decodeURIComponent(decodeHtmlEntities(altRefMatch[1]));

    const addressMatch = block.match(/Site Address:\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    const address = addressMatch ? stripHtml(addressMatch[1]) : "";

    const proposalMatch = block.match(/Description:\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    const proposal = proposalMatch ? stripHtml(proposalMatch[1]) : "";

    const receivedMatch = block.match(/Received Date:\s*<\/td>\s*<td[^>]*>([^<]*)<\/td>/i);
    const receivedDate = receivedMatch ? receivedMatch[1].trim() : "";

    const validMatch = block.match(/Date Valid:\s*<\/td>\s*<td[^>]*>([^<]*)<\/td>/i);
    const validDate = validMatch ? validMatch[1].trim() : "";

    const decisionDateMatch = block.match(/Decision Date:\s*<\/td>\s*<td[^>]*>([^<]*)<\/td>/i);
    const decisionDate = decisionDateMatch ? decisionDateMatch[1].trim() : "";

    // Deliberately requires the colon directly after "Decision" so this does
    // NOT also match "Decision Date:" or "Decision Sent Date:" above.
    const decisionTextMatch = block.match(/Decision:\s*<\/td>\s*<td[^>]*>([^<]*)<\/td>/i);
    const decisionText = decisionTextMatch ? decisionTextMatch[1].trim() : "";

    results.push({
      altRef,
      address,
      proposal,
      receivedDate,
      validDate,
      decisionDate,
      decisionText,
    });
  }

  return results;
}

/**
 * Whether a FastWeb results.asp page has a further page of results.
 * Verified live: the last page shows only a "Previous" link, every
 * earlier page shows a "Next" link to `results.asp?Scroll=N+1&...`.
 */
function hasNextPage(html: string): boolean {
  return />Next<\/a>/i.test(html);
}

// ─── FastWeb HTTP Scraping ────────────────────────────────────

// Deliberately NOT a spoofed browser UA — see file header note.
const FASTWEB_USER_AGENT =
  "ConstructionCapitalResearchBot/1.0 (+https://constructioncapital.co.uk; planning-data-research; low-volume, throttled)";

/**
 * Retry a function with exponential backoff on 429/5xx/network errors.
 * (Same idiom as fetch-planning-idox.ts's withRetry.)
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  retries = MAX_RETRIES
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const msg = String(err);
      const isRetryable = msg.includes("429") || msg.includes("502") || msg.includes("503") || msg.includes("fetch failed");
      if (!isRetryable || attempt === retries) throw err;
      const delay = Math.pow(2, attempt + 1) * 2000; // 4s, 8s, 16s
      console.log(`    ⏳ ${label}: retrying in ${delay / 1000}s (attempt ${attempt + 1}/${retries})...`);
      await sleep(delay);
    }
  }
  throw new Error("Unreachable");
}

/**
 * Fetch a single results.asp page (GET, no session/CSRF needed — verified
 * live against Wokingham and Rotherham: a plain unauthenticated GET with
 * the date-range + Scroll query params returns the results table directly).
 */
async function fetchFastwebPage(
  authority: FastwebAuthority,
  dateFrom: string,
  dateTo: string,
  pageNum: number
): Promise<string> {
  const params = new URLSearchParams();
  params.set("DateReceivedStart", dateFrom);
  params.set("DateReceivedEnd", dateTo);
  params.set("Sort1", "DateReceived DESC");
  params.set("Sort2", "ApplicationNumber");
  params.set("Scroll", String(pageNum));

  const url = `${authority.baseUrl}${authority.searchPath}/results.asp?${params.toString()}`;

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": FASTWEB_USER_AGENT,
      Accept: "text/html",
    },
    redirect: "follow",
  });

  if (!resp.ok) {
    throw new Error(`Page ${pageNum} fetch failed: ${resp.status} ${resp.statusText}`);
  }

  return resp.text();
}

/**
 * Generate monthly date ranges between two DD/MM/YYYY dates.
 * (Same idiom as fetch-planning-idox.ts's generateMonthlyRanges — kept as
 * a distinct copy here since the original is not exported.)
 */
function generateMonthlyRanges(
  dateFrom: string,
  dateTo: string
): Array<{ from: string; to: string }> {
  const [dFrom, mFrom, yFrom] = dateFrom.split("/").map(Number);
  const [dTo, mTo, yTo] = dateTo.split("/").map(Number);

  const start = new Date(yFrom, mFrom - 1, dFrom);
  const end = new Date(yTo, mTo - 1, dTo);
  const ranges: Array<{ from: string; to: string }> = [];

  let cursor = new Date(start);
  while (cursor < end) {
    const rangeStart = new Date(cursor);
    const nextMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const rangeEnd = nextMonth < end ? nextMonth : end;

    ranges.push({
      from: formatDateDDMMYYYY(rangeStart),
      to: formatDateDDMMYYYY(rangeEnd),
    });

    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  return ranges;
}

/**
 * Scrape every page of a single date range, paginating via ?Scroll=N.
 */
async function scrapeDateRange(
  authority: FastwebAuthority,
  dateFrom: string,
  dateTo: string
): Promise<FastwebSearchResult[]> {
  const allResults: FastwebSearchResult[] = [];
  let page = 1;

  while (true) {
    const html = await withRetry(
      () => fetchFastwebPage(authority, dateFrom, dateTo, page),
      `Page ${page}`
    );

    if (process.env.DEBUG_HTML) {
      const debugPath = `/tmp/fastweb-debug-${authority.id}-p${page}.html`;
      fs.writeFileSync(debugPath, html, "utf-8");
      console.log(`    🔍 Debug HTML written to ${debugPath}`);
    }

    const pageResults = parseFastwebResults(html);
    allResults.push(...pageResults);

    const morePages = pageResults.length > 0 && hasNextPage(html);
    if (!morePages) break;

    page++;

    // Safety limit — mirrors the existing `if (allResults.length > 5000) break;`
    // idiom in fetch-planning-idox.ts's scrapeDateRange.
    if (allResults.length > 5000) break;

    await sleep(THROTTLE_MS);
  }

  return allResults;
}

/**
 * Scrape all search results from a FastWeb portal for a given date range,
 * split into monthly chunks (mirrors fetch-planning-idox.ts's
 * scrapeAllResults — FastWeb has not been observed to reject large date
 * ranges with a "too many results" error the way Idox does, but chunking
 * keeps individual requests small and matches the existing convention).
 */
async function scrapeAllResults(
  authority: FastwebAuthority,
  dateFrom: string,
  dateTo: string
): Promise<{ results: FastwebSearchResult[]; monthsAttempted: number; monthsErrored: number }> {
  const monthlyRanges = generateMonthlyRanges(dateFrom, dateTo);
  console.log(`  📅 Splitting into ${monthlyRanges.length} monthly date ranges`);

  const allResults: FastwebSearchResult[] = [];
  let monthsErrored = 0;

  for (let i = 0; i < monthlyRanges.length; i++) {
    const range = monthlyRanges[i];
    console.log(`  📡 Searching ${range.from} → ${range.to} (${i + 1}/${monthlyRanges.length})...`);

    try {
      const results = await scrapeDateRange(authority, range.from, range.to);
      console.log(`    ✓ ${results.length} results`);
      allResults.push(...results);
    } catch (err) {
      console.error(`    ❌ Error: ${err}`);
      monthsErrored++;
    }

    await sleep(THROTTLE_BETWEEN_MONTHS_MS);
  }

  return { results: allResults, monthsAttempted: monthlyRanges.length, monthsErrored };
}

// ─── FastWeb → Canonical Format Conversion ────────────────────

function normaliseFastwebResult(
  result: FastwebSearchResult,
  authority: FastwebAuthority
): RawApp {
  return {
    ref_no: result.altRef,
    planning_portal_ref_no: "",
    application_address: result.address,
    UPRNDisplay: "",
    proposal: result.proposal,
    // No application-type/ref-code field exists on this source — categorise()
    // falls back to proposal-text matching (see file header note).
    app_type: "",
    // Synthetic status derived from presence of a decision, so
    // writeWebsiteJson()'s substring checks (APPROV/REFUS/etc, run against
    // `decision_notice_type`) do the real classification work; this field
    // only needs to avoid accidentally matching any of those keywords.
    app_status: result.decisionText ? "Decided" : "Registered",
    decision_notice_type: result.decisionText,
    decision_date: result.decisionDate,
    decision_level: "",
    received_date: result.receivedDate,
    valid_date: result.validDate,
    expiry_date: "",
    ward: "",
    parish: "",
    case_officer: "",
    ApplicantContactNoName: "",
    AgentContactNoName: "",
    site_area: "",
    KeyNo: result.altRef,
    postcode: extractPostcode(result.address),
    _authority_id: authority.id,
    _base_url: authority.baseUrl,
  };
}

// ─── Processing Pipeline ──────────────────────────────────────

function buildFastwebSourceUrl(altRef: string, authority: FastwebAuthority): string {
  if (!altRef) return "";
  return `${authority.baseUrl}${authority.searchPath}/detail.asp?AltRef=${encodeURIComponent(altRef)}`;
}

/**
 * Copied verbatim from fetch-planning-idox.ts's processApplications, with
 * the authority type and source-URL builder swapped for FastWeb's.
 */
function processApplications(
  rawApps: RawApp[],
  authority: FastwebAuthority,
  townSlug: string,
  countySlug: string,
  medians: Record<string, number>
): ProcessedApp[] {
  const processed: ProcessedApp[] = [];

  for (const raw of rawApps) {
    const { category, isRelevant, reason } = categorise(raw);
    const units = isRelevant ? extractUnits(raw.proposal || "") : null;
    const gdv = estimateGDV(raw.proposal || "", units, medians);
    const applicant = extractCompany(raw.ApplicantContactNoName || "");
    const agent = extractCompany(raw.AgentContactNoName || "");
    const address = raw.application_address || raw.UPRNDisplay || "";
    const postcode = raw.postcode || extractPostcode(address);

    processed.push({
      reference: raw.ref_no || "",
      planning_portal_ref: raw.planning_portal_ref_no || "",
      local_authority: authority.name,
      source_url: buildFastwebSourceUrl(raw.KeyNo || "", authority),
      address,
      postcode,
      ward: raw.ward || "",
      parish: raw.parish || "",
      town_slug: townSlug,
      county_slug: countySlug,
      proposal: raw.proposal || "",
      application_type: raw.app_type || "",
      application_type_code: raw.app_type || "",
      category,
      units,
      estimated_gdv: gdv,
      estimated_gdv_formatted: gdv ? `£${gdv.toLocaleString("en-GB")}` : "",
      site_area_hectares: raw.site_area || "",
      received_date: raw.received_date || "",
      valid_date: raw.valid_date || "",
      decision_date: raw.decision_date || "",
      expiry_date: raw.expiry_date || "",
      status: raw.app_status || "",
      decision: raw.decision_notice_type || "",
      decision_level: raw.decision_level || "",
      case_officer: raw.case_officer || "",
      applicant_name: applicant.name,
      applicant_company: applicant.company,
      agent_name: agent.name,
      agent_company: agent.company,
      scraped_at: new Date().toISOString(),
      is_relevant: isRelevant,
      relevance_reason: reason,
    });
  }

  return processed;
}

/**
 * Copied verbatim from fetch-planning-idox.ts's writeWebsiteJson, with
 * `source: "fastweb"` in place of Idox's `source: "idox"` (see that exact
 * line in fetch-planning-idox.ts's writeWebsiteJson).
 */
function writeWebsiteJson(
  processed: ProcessedApp[],
  authority: FastwebAuthority,
  townSlug: string,
  countySlug: string
): void {
  const relevant = processed.filter((a) => a.is_relevant);

  const approvedApps = relevant.filter((a) => {
    const status = a.status.toUpperCase();
    const decision = a.decision.toUpperCase();
    return (
      status === "APP" || status === "APPROVED" ||
      status === "AAPR" || status === "AEGPD" ||
      decision === "APP" || decision === "AAPR" || decision === "AEGPD" ||
      decision.includes("APPROVE") ||
      decision.includes("CONDITIONAL PERMISSION") ||
      decision.includes("CONSENT") ||
      decision.includes("PERMITTED DEV") ||
      decision.includes("LIST.BLD.APP") ||
      decision.includes("ACCEPT AMEND") ||
      status.includes("APPROV") ||
      status.includes("GRANTED") ||
      status.includes("PERMIT") ||
      status.includes("NOT REQUIRED") // Prior Approval Not Required = approved
    );
  });
  const refusedApps = relevant.filter((a) => {
    const status = a.status.toUpperCase();
    const decision = a.decision.toUpperCase();
    return (
      status === "REF" || status === "REFUSED" ||
      decision === "REF" ||
      decision.includes("REFUS") ||
      status.includes("REFUS")
    );
  });
  const withdrawnApps = relevant.filter((a) => {
    const status = a.status.toUpperCase();
    return status.includes("WITHDRAWN");
  });
  const pendingApps = relevant.filter(
    (a) =>
      !approvedApps.includes(a) &&
      !refusedApps.includes(a) &&
      !withdrawnApps.includes(a)
  );

  const approvedUnits = approvedApps.reduce((s, a) => s + (a.units || 0), 0);
  const pendingUnits = pendingApps.reduce((s, a) => s + (a.units || 0), 0);
  const approvedGdv = approvedApps.reduce((s, a) => s + (a.estimated_gdv || 0), 0);
  const pendingGdv = pendingApps.reduce((s, a) => s + (a.estimated_gdv || 0), 0);
  const decidedCount = approvedApps.length + refusedApps.length;
  const approvalRate = decidedCount > 0 ? Math.round((approvedApps.length / decidedCount) * 100) : 0;

  const toWebApp = (a: ProcessedApp) => ({
    reference: a.reference,
    address: a.address,
    postcode: a.postcode,
    ward: a.ward,
    proposal: a.proposal,
    category: a.category,
    units: a.units,
    estimatedGdv: a.estimated_gdv,
    status: a.status,
    decision: a.decision,
    receivedDate: a.received_date,
    decisionDate: a.decision_date,
    applicantName: a.applicant_name,
    applicantCompany: a.applicant_company,
    agentName: a.agent_name,
    agentCompany: a.agent_company,
    sourceUrl: a.source_url,
  });

  const sortedApproved = [...approvedApps].sort((a, b) => {
    const da = a.decision_date.split("/").reverse().join("") || "0";
    const db = b.decision_date.split("/").reverse().join("") || "0";
    return db.localeCompare(da);
  });
  const sortedPending = [...pendingApps].sort((a, b) => {
    const da = a.received_date.split("/").reverse().join("") || "0";
    const db = b.received_date.split("/").reverse().join("") || "0";
    return db.localeCompare(da);
  });

  const generatedDir = path.join(process.cwd(), "data", "generated", "planning", countySlug, townSlug);
  fs.mkdirSync(generatedDir, { recursive: true });
  const latestPath = path.join(generatedDir, "latest.json");

  fs.writeFileSync(
    latestPath,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        townSlug,
        countySlug,
        localAuthority: authority.name,
        source: "fastweb",
        summary: {
          total: processed.length,
          relevant: relevant.length,
          approved: approvedApps.length,
          pending: pendingApps.length,
          refused: refusedApps.length,
          approvedUnits,
          pendingUnits,
          totalUnits: approvedUnits + pendingUnits,
          approvedGdv,
          pendingGdv,
          totalEstimatedGDV: approvedGdv + pendingGdv,
          approvalRate,
        },
        approvedApplications: sortedApproved.map(toWebApp),
        pendingApplications: sortedPending.map(toWebApp),
      },
      null,
      2
    )
  );

  console.log(`  💾 Website JSON: ${latestPath}`);
  console.log(`     ├─ Relevant: ${relevant.length} (${approvedApps.length} approved, ${pendingApps.length} pending, ${refusedApps.length} refused)`);
  console.log(`     ├─ Units: ${approvedUnits + pendingUnits} (${approvedUnits} approved, ${pendingUnits} pending)`);
  console.log(`     ├─ Est. GDV: £${((approvedGdv + pendingGdv) / 1000000).toFixed(1)}M`);
  console.log(`     └─ Approval rate: ${approvalRate}%`);
}

// ─── Authority Processing ─────────────────────────────────────

async function processAuthority(
  authority: FastwebAuthority,
  dateFrom: string,
  dateTo: string,
  months: number
): Promise<void> {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  🏛️  ${authority.name} (${authority.id})`);
  console.log(`  Portal: FastWeb`);
  console.log(`  URL: ${authority.baseUrl}${authority.searchPath}`);
  console.log(`  Period: ${dateFrom} to ${dateTo} (${months} months)`);
  console.log(`${"═".repeat(60)}`);

  // ── Scrape ────────────────────────────────────────────────
  let searchResults: FastwebSearchResult[];
  try {
    const scrapeOutcome = await scrapeAllResults(authority, dateFrom, dateTo);
    // Distinguish "every monthly request errored" (authority likely
    // unreachable/dead) from "genuinely zero results" — mirrors the fix
    // just applied to fetch-planning-idox.ts's processAuthority.
    if (scrapeOutcome.monthsErrored > 0 && scrapeOutcome.monthsErrored === scrapeOutcome.monthsAttempted) {
      throw new Error(
        `All ${scrapeOutcome.monthsAttempted} monthly requests failed — authority likely unreachable (dead URL or portal down)`
      );
    }
    if (scrapeOutcome.monthsErrored > 0) {
      console.log(`  ⚠️  Partial failure: ${scrapeOutcome.monthsErrored}/${scrapeOutcome.monthsAttempted} months errored`);
    }
    searchResults = scrapeOutcome.results;
  } catch (err) {
    console.error(`  ❌ Failed to scrape ${authority.id}: ${err}`);
    throw err;
  }

  console.log(`\n  📦 Scraped: ${searchResults.length} search results`);

  if (searchResults.length === 0) {
    console.log(`  ℹ️  No results to process`);
    return;
  }

  // Normalise to canonical RawApp format
  const rawApps = searchResults.map((r) => normaliseFastwebResult(r, authority));

  // Deduplicate on ref_no
  const deduped = new Map<string, RawApp>();
  for (const app of rawApps) {
    const ref = app.ref_no || "";
    if (ref) {
      deduped.set(ref, app);
    }
  }
  const results = Array.from(deduped.values());
  console.log(`  📦 After dedup: ${results.length} unique applications`);

  // Save raw normalised data
  const today = new Date().toISOString().split("T")[0];
  const exportDir = path.join(process.cwd(), "data", "planning-exports");
  fs.mkdirSync(exportDir, { recursive: true });

  const rawPath = path.join(exportDir, `${authority.id}-raw-api-${today}.json`);
  fs.writeFileSync(rawPath, JSON.stringify(results, null, 2));
  console.log(`  💾 Raw data: ${rawPath}`);

  // ── Process for each town ──────────────────────────────────
  for (const town of authority.towns) {
    console.log(`\n  🏘️  Processing for ${town.countySlug}/${town.townSlug}...`);

    const medians = loadMedianPrices(town.countySlug, town.townSlug);
    console.log(`  💰 Medians: detached £${medians.detached.toLocaleString("en-GB")}, flat £${medians.flat.toLocaleString("en-GB")}, blended £${medians.blended.toLocaleString("en-GB")}`);

    const processed = processApplications(
      results,
      authority,
      town.townSlug,
      town.countySlug,
      medians
    );

    // Print category breakdown
    const categories = new Map<string, number>();
    for (const app of processed) {
      const key = `${app.is_relevant ? "✓" : "✗"} ${app.category}`;
      categories.set(key, (categories.get(key) || 0) + 1);
    }
    console.log(`\n  Category breakdown:`);
    for (const [cat, count] of [...categories.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`    ${count.toString().padStart(4)}  ${cat}`);
    }

    // Write website pipeline JSON
    writeWebsiteJson(processed, authority, town.townSlug, town.countySlug);
  }
}

// ─── CLI ──────────────────────────────────────────────────────
//
// CRITICAL SAFETY NOTE: this mirrors fetch-planning-idox.ts's parseArgs()
// exactly. A bare invocation or `--help` MUST print usage and exit(1)
// *before* any authority is touched — never fall through to main()'s
// file-writing code without an explicit --authority/--all flag.

function parseArgs(): {
  authorityId: string | null;
  all: boolean;
  months: number;
} {
  const args = process.argv.slice(2);
  let authorityId: string | null = null;
  let all = false;
  let months = DEFAULT_MONTHS;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--authority":
        authorityId = args[++i];
        break;
      case "--all":
        all = true;
        break;
      case "--months":
        months = parseInt(args[++i], 10);
        break;
    }
  }

  if (!authorityId && !all) {
    console.error(
      "Usage:\n" +
        "  npx tsx scripts/fetch-planning-fastweb.ts --authority <id>\n" +
        "  npx tsx scripts/fetch-planning-fastweb.ts --all\n" +
        "  npx tsx scripts/fetch-planning-fastweb.ts --all --months 6\n" +
        "\nAvailable FastWeb authorities:"
    );
    for (const a of getEnabledFastwebAuthorities()) {
      console.error(`  ✅ ${a.id} — ${a.name}`);
    }
    console.error("\nDisabled (use --authority to force):");
    for (const a of FASTWEB_AUTHORITIES.filter((x) => !x.enabled)) {
      console.error(`  ⏸️  ${a.id} — ${a.name}`);
    }
    process.exit(1);
  }

  return { authorityId, all, months };
}

// ─── Main ─────────────────────────────────────────────────────

async function main() {
  const { authorityId, all, months } = parseArgs();

  const now = new Date();
  const from = new Date(now);
  from.setMonth(from.getMonth() - months);
  const dateFrom = formatDateDDMMYYYY(from);
  const dateTo = formatDateDDMMYYYY(now);

  let authorities: FastwebAuthority[];

  if (all) {
    authorities = getEnabledFastwebAuthorities();
    console.log(`\n🚀 Batch scraping ${authorities.length} enabled FastWeb authorities (${months} months)`);
  } else {
    const auth = getFastwebAuthority(authorityId!);
    if (!auth) {
      console.error(`❌ Unknown FastWeb authority: ${authorityId}`);
      console.error("Available IDs:");
      for (const a of FASTWEB_AUTHORITIES) {
        const status = a.enabled ? "✅" : "⏸️";
        console.error(`  ${status} ${a.id} — ${a.name}`);
      }
      process.exit(1);
    }
    if (!auth.enabled) {
      console.log(`⚠️  ${auth.id} is disabled — scraping anyway as explicitly requested`);
    }
    authorities = [auth];
  }

  const results: { id: string; name: string; success: boolean; error?: string }[] = [];

  // Process authorities concurrently — each hits a different server
  const CONCURRENCY = all ? 10 : 1;

  async function processOne(authority: FastwebAuthority) {
    try {
      await processAuthority(authority, dateFrom, dateTo, months);
      results.push({ id: authority.id, name: authority.name, success: true });
    } catch (err) {
      console.error(`\n❌ Fatal error processing ${authority.id}: ${err}`);
      results.push({
        id: authority.id,
        name: authority.name,
        success: false,
        error: String(err),
      });
    }
  }

  if (CONCURRENCY > 1 && authorities.length > 1) {
    console.log(`  ⚡ Running ${CONCURRENCY} authorities concurrently\n`);
    for (let i = 0; i < authorities.length; i += CONCURRENCY) {
      const chunk = authorities.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map(processOne));
    }
  } else {
    for (const authority of authorities) {
      await processOne(authority);
      if (authorities.length > 1) {
        await sleep(2000);
      }
    }
  }

  // ── Summary ────────────────────────────────────────────────
  console.log(`\n${"═".repeat(60)}`);
  console.log("  📋 Batch Summary");
  console.log(`${"═".repeat(60)}`);

  for (const r of results) {
    const icon = r.success ? "✅" : "❌";
    const errStr = r.error ? ` — ${r.error}` : "";
    console.log(`  ${icon} ${r.id} (${r.name})${errStr}`);
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;
  console.log(`\n  Total: ${successCount} succeeded, ${failCount} failed`);
  console.log("\n  Done! 🎉\n");

  if (failCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
