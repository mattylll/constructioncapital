/**
 * AgileApplications Planning Data Scraper
 *
 * Fetches planning applications from UK local authorities that use the
 * "AgileApplications" (Agile / Sunagile) citizen portal system. Unlike the
 * Idox Public Access portal (fetch-planning-idox.ts), this is a clean JSON
 * REST API — no HTML scraping, no cookies, no CSRF, no pagination:
 *
 *   GET https://planningapi.agileapplications.co.uk/api/application/search?location=<query>
 *   Headers: x-product: CITIZENPORTAL, x-service: PA, x-client: <COUNCIL_CODE>
 *
 * Omitting any of the three headers returns 401. The response is a single
 * JSON object `{ "total": N, "results": [...] }` — confirmed live against
 * Slough Borough Council (client code SLOUGH) on 2026-07-05.
 *
 * IMPORTANT — no server-side date filtering: adding dateFrom/dateTo query
 * params to the request has no effect (confirmed empirically — the same
 * `location=` query returns an identical `total` with or without extra date
 * params). The API also enforces an undocumented result cap: broad queries
 * (e.g. a bare town/council name) return HTTP 400
 * `{"code":400,"message":"Too many records have been found (N), please
 * refine your search criteria."}`. So every authority in the registry below
 * carries an explicit `locationQuery` (a specific street-name-shaped search
 * term, e.g. "High Street") that has been confirmed to return a manageable,
 * real result set without tripping that cap. Because there is no way to
 * page through or otherwise enumerate "every application in the town" via
 * this endpoint, this scraper — like the task that specified it — treats
 * one `location=` query per authority as the full fetch, then narrows to
 * the requested "last N months" window with CLIENT-SIDE filtering on
 * `registrationDate` after the fact.
 *
 * Field mapping onto the canonical RawApp/ProcessedApp shape, the
 * categorisation pipeline (`categorise`, `extractUnits`, `estimateGDV`,
 * `extractCompany`, `extractPostcode`, `loadMedianPrices`, the type-code
 * Sets, `extractRefTypeCode`, `parseUnitCount`, `NUMBER_WORDS`,
 * `UNIT_TOKEN`, `NUMBER_TOKEN`, `MAINTENANCE_PATTERNS`,
 * `isMaintenanceProposal`, `FALLBACK_MEDIANS`) and `writeWebsiteJson` are
 * copied from fetch-planning-idox.ts (which in turn credits
 * fetch-planning-batch.ts for the original categorisation logic — see that
 * file's own comment near its RELEVANT_TYPE_CODES definition). Agile-specific
 * additions to the shared Sets/logic are called out inline with
 * "// Agile:" comments — they were derived from real API responses for
 * Slough, Cannock Chase, Rugby and Redbridge (see registry below), not
 * guessed.
 *
 * Usage:
 *   npx tsx scripts/fetch-planning-agile.ts --all                        # All enabled authorities
 *   npx tsx scripts/fetch-planning-agile.ts --authority slough           # Single authority
 *   npx tsx scripts/fetch-planning-agile.ts --authority slough --months 1  # Custom date window
 *
 * Output:
 *   data/planning-exports/{authority-id}-raw-api-{date}.json    # Raw normalised data
 *   data/generated/planning/{county}/{town}/latest.json          # Website pipeline JSON
 */

import * as fs from "fs";
import * as path from "path";
import type { AuthorityTown } from "./planning-authorities";

// ─── Configuration ───────────────────────────────────────────

const MAX_RETRIES = 3; // Retry on 429/5xx/network errors only (no session to manage)
const DEFAULT_MONTHS = 12;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const AGILE_API_BASE = "https://planningapi.agileapplications.co.uk/api/application/search";
const AGILE_PORTAL_BASE = "https://planning.agileapplications.co.uk";

// UK-wide fallback medians when local sold data is unavailable
// (copied verbatim from fetch-planning-idox.ts)
const FALLBACK_MEDIANS: Record<string, number> = {
  detached: 450000,
  semi_detached: 290000,
  terraced: 245000,
  flat: 230000,
  blended: 295000,
};

// ─── Agile Authority Types ───────────────────────────────────

interface AgileAuthority {
  /** Short unique identifier, e.g. "slough" */
  id: string;
  /** Full council name */
  name: string;
  /** The x-client header value this authority's tenant is registered under */
  clientCode: string;
  /**
   * The `location=` search term to send. The Agile API has no "give me
   * everything" mode — a query has to be specific enough to stay under an
   * undocumented result cap (broad queries 400 with "Too many records have
   * been found"). "High Street" has been confirmed empirically to return a
   * real, manageable result set for every enabled authority below.
   */
  locationQuery: string;
  /** Which towns in our site this authority covers */
  towns: AuthorityTown[];
  /** Whether this authority is enabled for fetching */
  enabled: boolean;
}

// ─── Agile Authority Registry ────────────────────────────────
//
// Verified live 2026-07-05 by calling the API directly with
// `location=High+Street` and the headers x-product: CITIZENPORTAL,
// x-service: PA, x-client: <code>. A 401 means missing/wrong headers; a
// 400 "Database configuration not retrieved for customer X" means the
// client code itself is wrong (this message is generic and returned for
// ANY unrecognised code, including deliberately-bogus strings — it is not
// a "close guess" signal, confirmed by testing a nonsense code and getting
// byte-identical phrasing).

const AGILE_AUTHORITIES: AgileAuthority[] = [
  {
    id: "slough",
    name: "Slough Borough Council",
    clientCode: "SLOUGH",
    locationQuery: "High Street",
    towns: [{ townSlug: "slough", countySlug: "berkshire" }],
    enabled: true, // Confirmed: 200 OK, total 2800, real applications back to 1980
  },
  {
    id: "islington",
    name: "London Borough of Islington",
    // TODO: verify clientCode. Tried: ISLINGTON, ISL, ISLI, ISLN, IBC,
    // LBISLINGTON, LBISL, "LB ISLINGTON", ISLINGTONLBC, ISLINGTONBC,
    // ISLINGTON2, "ISLINGTON COUNCIL" — every one returned the same generic
    // 400 "Database configuration not retrieved" as a deliberately-bogus
    // control string, so none of these are confirmed. The SPA shell at
    // planning.agileapplications.co.uk/islington returns byte-identical
    // HTML to a bogus path (it's a client-side-routed shell — the URL
    // slug gives no signal about which tenants actually exist).
    clientCode: "",
    locationQuery: "High Street",
    towns: [{ townSlug: "islington", countySlug: "greater-london" }],
    enabled: false,
  },
  {
    id: "cannock-chase",
    name: "Cannock Chase District Council",
    clientCode: "CANNOCK",
    locationQuery: "High Street",
    towns: [{ townSlug: "cannock", countySlug: "staffordshire" }],
    enabled: true, // Confirmed: 200 OK, total 107, real applications (e.g. ref "CH/87/309")
  },
  {
    id: "rugby",
    name: "Rugby Borough Council",
    clientCode: "RUGBY",
    locationQuery: "High Street",
    towns: [{ townSlug: "rugby", countySlug: "warwickshire" }],
    enabled: true, // Confirmed: 200 OK, total 397, real applications (e.g. ref "R05/0993/949/PLN")
  },
  {
    id: "redbridge",
    name: "London Borough of Redbridge",
    clientCode: "REDBRIDGE",
    locationQuery: "High Street",
    towns: [{ townSlug: "redbridge", countySlug: "greater-london" }],
    enabled: true, // Confirmed: 200 OK, total 2949, real applications (e.g. ref "1892/02C")
  },
];

// NOTE on Mole Valley: fetch-planning-idox.ts has a disabled "mole-valley"
// entry (Surrey, towns dorking/leatherhead) because its old Idox URL may be
// dead. Checked whether Mole Valley has since moved to AgileApplications:
// tried client codes MOLEVALLEY, "MOLE VALLEY", MVDC, MOLE, MOLEVAL,
// MOLEVALLEYDC, "MOLE VALLEY DC", MOLEVALLEYDISTRICT, MOLEVALLEYBC,
// MOLEV, "MOLE-VALLEY", MVBC — all returned the same generic "Database
// configuration not retrieved" 400 as a bogus control string. No entry
// added here; could not confirm Mole Valley is on this Agile deployment
// at all (or it uses a client code unrelated to the council's name).

// NOTE on scope: per project instructions, Warwick, Salford, Tonbridge &
// Malling (already active under fetch-planning-idox.ts), Flintshire,
// Middlesbrough, Fife, Peak District / New Forest National Park
// Authorities, Old Oak & Park Royal / London Legacy development
// corporations, and Ireland-based tenants (Dublin/South Dublin/Fingal) are
// deliberately NOT added here — several of these hostnames actually appear
// in the CSP header of the generic Agile SPA shell (*.richmond.gov.uk,
// *.staffordshire.gov.uk, *.wandsworth.gov.uk, *.flintshire.gov.uk,
// *.dublincity.ie, *.southdublin.ie), confirming they share this platform,
// but they are out of scope for this registry.

// ─── Lookup Helpers ──────────────────────────────────────────

function getAgileAuthority(id: string): AgileAuthority | undefined {
  return AGILE_AUTHORITIES.find((a) => a.id === id);
}

function getEnabledAgileAuthorities(): AgileAuthority[] {
  return AGILE_AUTHORITIES.filter((a) => a.enabled);
}

// ─── Canonical Types (copied verbatim from fetch-planning-idox.ts) ───

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

// ─── Agile API Response Shape ─────────────────────────────────
// Confirmed live from https://planningapi.agileapplications.co.uk/api/application/search
// (Slough, x-client: SLOUGH, location=High+Street, 2026-07-05). Only the
// fields we actually consume are typed strictly; the rest pass through as
// unknown so a schema drift on a field we don't use doesn't break the build.

interface AgileSearchResult {
  id: number;
  applicationType: string | null;
  reference: string;
  webReference: string | null;
  proposal: string | null;
  location: string | null;
  applicantSurname: string | null;
  agentName: string | null;
  decisionText: string | null;
  registrationDate: string | null; // ISO date string, e.g. "1985-01-04T00:00:00"
  validDate: string | null;
  decisionDate: string | null;
  ward: string | null;
  status: string | null;
  statusOwner: string | null;
  [key: string]: unknown;
}

interface AgileSearchResponse {
  total: number;
  results: AgileSearchResult[];
}

interface AgileApiErrorEntry {
  code: number;
  message: string;
  messageDetails?: string;
}

// ─── Helpers (copied verbatim from fetch-planning-idox.ts) ───────────

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
// (Copied from fetch-planning-idox.ts, which itself credits
// fetch-planning-batch.ts for the original categorisation logic.
// Agile-specific additions below are marked "// Agile:" and were derived
// from real live API responses for Slough, Cannock Chase, Rugby and
// Redbridge on 2026-07-05 — not guessed.)

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
  // Agile: confirmed live applicationType values (Slough/Cannock Chase/Rugby/Redbridge, 2026-07-05)
  "Full Planning Permission", // Redbridge synonym of "Full Planning Application"
  "Outline Planning", // Slough synonym of "Outline Planning Application"
  "Outline Planning APP", // Cannock Chase synonym
  "Reserved Matters", // Cannock Chase — bare synonym of "Reserved Matters Application"
  "Details Following Outline (Reserved Matters)", // Redbridge synonym of Reserved Matters
  "Permitted Development with Consultation", // Slough — PD requiring prior-approval-style consultation
  "Regulation 3 Full", // Slough — full app submitted by the council itself (cf. existing Reg3 entries)
  "Regulation 3 Outline",
  "County Reg.3. Application", // Cannock Chase synonym of council-submitted Reg 3 app
  "CCDC-Reg 3. Application", // Cannock Chase synonym
  "Section 73 - Minor", // Redbridge synonym of S73 variation of condition
  "8 Weeks PA", // Rugby — standard 8-week statutory determination track (their generic "planning application" bucket, confirmed via sample proposals: extensions, conversions, dwellings)
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
  // Agile: confirmed live applicationType values (Slough/Cannock Chase/Rugby/Redbridge, 2026-07-05)
  "Submission of Details", // Slough — discharge-of-condition equivalent
  "Certificate Proposed (Use/Development)", // Slough
  "Certificate Existing (Use/Development)", // Slough
  "Cert. Lawfulness Proposed", // Redbridge synonym
  "Cert. Lawfulness Existing", // Redbridge synonym
  "Lawful Use/Development Cert App", // Cannock Chase synonym
  "Exisiting Lawful Use/Dev Cert Isued", // Cannock Chase (sic — real observed value, kept verbatim)
  "Licensing Application", // Slough — not a planning application
  "Non Material Amendments", // Slough plural synonym
  "Non-Material Amendment(s)", // Redbridge synonym
  "Tele Notifications", // Slough telecoms synonym
  "Telecommunications Application", // Slough telecoms synonym
  "Extension Planning Application", // Slough — extension-only, mirrors idox "extensions" treatment
  "Tree Application for Works", // Slough
  "Tree Preservation Order", // Slough (also present above from idox, harmless duplicate avoided— see note)
  "Tree Application for Conservations Area", // Slough (sic)
  "Works to Trees in Con. Area", // Redbridge
  "Works to TPO Tree(s)", // Redbridge
  "Works to trees", // Rugby
  "Environmental Assessment Application", // Slough
  "Environmental Screening Opinion", // Slough
  "Invalid Application", // Slough synonym of "Invalid"
  "Demolition", // Slough — bare demolition with no accompanying rebuild signal in the type itself
  "Advertisement Consent", // Redbridge (idox has bare "Advert"/"Advertisement" already; Agile-specific full phrase)
  "8 Weeks Advert", // Rugby telecoms/advert equivalent
  "Discharge of Condition(s)", // Redbridge plural/parenthetical synonym
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
  "PDE", "VAR", "CPL", "CPE",
  "F", "CU", "RET", "AGD", "DED", "CONLA",
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
  "HOUS", "HSE", "HHOLD",
  "CAN", "CLP", "CLE", "CON", "BNG", "TED",
  "SCOPE", "SCREEN", "HRN",
]);

// Broad app_type values that need ref-based sub-classification
const BROAD_APP_TYPES = new Set([
  "Development Management",
  "Appeal",
  "Enforcement",
]);

function extractRefTypeCode(refNo: string): string | null {
  // Format 1: "YY/NNNNN/TYPE" (e.g., "25/00187/FUL") — also incidentally
  // matches the trailing segment of Rugby's 4-part "R05/0993/949/PLN" refs
  // since the regex isn't anchored to the start of the string.
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

  // Agile: normalise any "Prior Approval …" phrasing (e.g. "Prior Approval:
  // (Class O) Office to Dwelling", "Prior Approval Determination", "Telecoms
  // Prior Approval") down to the bare "Prior Approval" string that's already
  // in RELEVANT_TYPE_CODES, mirroring how the idox ref-code path below
  // normalises PAP/PA-prefixed codes. This is done BEFORE the exact-match
  // set lookup so every real-world class-letter variant is caught rather
  // than silently falling through to "unclassified".
  if (/prior approval/i.test(appType)) {
    appType = "Prior Approval";
  }

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
      // Agile: PD prior-approval for solar/heat pump/EV/plant installs is not
      // a relevant "development" for finance purposes (no units/GDV) — mirrors
      // isMaintenanceProposal's own equipment keyword list. Found via real
      // Rugby data ("Non-domestic solar prior approval").
      if (proposal.match(/\b(solar|photovoltaic|pv\s+panel|heat\s+pump|air\s+source|ev\s+charg|battery\s+storage)\b/)) {
        return { category: "plant_equipment", isRelevant: false, reason: `Plant/equipment prior approval: ${appType}` };
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

// ─── Median Price Loading (copied verbatim from fetch-planning-idox.ts) ───

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

// ─── Retry Helper (mirrors fetch-planning-idox.ts's withRetry) ───────

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
      const isRetryable = msg.includes("429") || msg.includes("503") || msg.includes("fetch failed");
      if (!isRetryable || attempt === retries) throw err;
      const delay = Math.pow(2, attempt + 1) * 2000; // 4s, 8s, 16s
      console.log(`    ⏳ ${label}: retrying in ${delay / 1000}s (attempt ${attempt + 1}/${retries})...`);
      await sleep(delay);
    }
  }
  throw new Error("Unreachable");
}

// ─── Agile HTTP Fetch ─────────────────────────────────────────

/**
 * Single GET request against the Agile search API for one authority.
 * No pagination, no session/CSRF — just the three required headers.
 * Throws on any non-2xx response (including the API's own 400 "Too many
 * records"/"Database configuration not retrieved" errors) so a real failure
 * is never silently recorded as zero results.
 */
async function fetchAgileResults(authority: AgileAuthority): Promise<AgileSearchResponse> {
  const url = `${AGILE_API_BASE}?location=${encodeURIComponent(authority.locationQuery)}`;

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
      "x-product": "CITIZENPORTAL",
      "x-service": "PA",
      "x-client": authority.clientCode,
    },
  });

  if (!resp.ok) {
    const bodyText = await resp.text().catch(() => "");
    let detail = bodyText.slice(0, 300).replace(/\s+/g, " ").trim();
    // The API's error body is a JSON array of { code, message } — surface
    // the message directly when present, it's much more actionable than
    // the raw HTTP status (e.g. "Too many records have been found (41084),
    // please refine your search criteria.").
    try {
      const parsed = JSON.parse(bodyText) as AgileApiErrorEntry[] | AgileApiErrorEntry;
      const first = Array.isArray(parsed) ? parsed[0] : parsed;
      if (first?.message) detail = first.message;
    } catch {
      // Not JSON — keep the raw text snippet
    }
    throw new Error(`Agile API request failed: ${resp.status} ${resp.statusText}${detail ? ` — ${detail}` : ""}`);
  }

  const data = (await resp.json()) as AgileSearchResponse;
  return data;
}

// ─── Agile → Canonical Format Conversion ─────────────────────

/** Convert an Agile ISO date string (e.g. "1985-01-04T00:00:00") to DD/MM/YYYY. */
function isoToDDMMYYYY(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return formatDateDDMMYYYY(d);
}

/**
 * Convert an Agile search result to the canonical RawApp format used by
 * the processing pipeline.
 *
 * Field mapping: reference → ref_no, location → application_address,
 * proposal → proposal, applicationType → app_type, status/decisionText →
 * app_status/decision_notice_type, registrationDate/decisionDate →
 * received_date/decision_date, ward → ward, agentName → AgentContactNoName,
 * applicantSurname → ApplicantContactNoName (no company/name split
 * available from this source — extractCompany() below still applies its
 * own bracket/company-suffix heuristics on whatever string comes through).
 */
function normaliseAgileResult(
  result: AgileSearchResult,
  authority: AgileAuthority
): RawApp {
  const address = result.location || "";

  return {
    ref_no: result.reference || "",
    planning_portal_ref_no: result.webReference || "",
    application_address: address,
    UPRNDisplay: "",
    proposal: result.proposal || "",
    app_type: result.applicationType || "",
    app_status: result.status || "",
    decision_notice_type: result.decisionText || "",
    decision_date: isoToDDMMYYYY(result.decisionDate),
    decision_level: "",
    received_date: isoToDDMMYYYY(result.registrationDate),
    valid_date: isoToDDMMYYYY(result.validDate),
    expiry_date: "",
    ward: result.ward || "",
    parish: "",
    case_officer: "",
    ApplicantContactNoName: result.applicantSurname || "",
    AgentContactNoName: result.agentName || "",
    site_area: "",
    KeyNo: String(result.id ?? ""),
    postcode: extractPostcode(address),
    _authority_id: authority.id,
    _base_url: AGILE_PORTAL_BASE,
  };
}

// ─── Processing Pipeline ─────────────────────────────────────

/**
 * The Agile REST API doesn't expose an obvious stable per-application
 * detail URL (the citizen portal at planning.agileapplications.co.uk is a
 * client-side-routed SPA that serves byte-identical HTML for any path, so
 * there's no way to confirm a "/slough/search-results?reference=..."-style
 * pattern actually resolves to the right record without driving a real
 * browser session against it). Per instructions: leave blank rather than
 * inventing a pattern.
 */
function buildAgileSourceUrl(): string {
  return "";
}

function processApplications(
  rawApps: RawApp[],
  authority: AgileAuthority,
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
      source_url: buildAgileSourceUrl(),
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

function writeWebsiteJson(
  processed: ProcessedApp[],
  authority: AgileAuthority,
  townSlug: string,
  countySlug: string,
  windowMonths: number
): void {
  const relevant = processed.filter((a) => a.is_relevant);
  const windowTo = new Date();
  const windowFrom = new Date();
  windowFrom.setMonth(windowFrom.getMonth() - windowMonths);

  // Compute refused/withdrawn FIRST and have approved exclude them. This
  // matters for Agile specifically: real Redbridge decisionText includes
  // "Refuse Permission/Consent" — which contains the substring "Consent"
  // and would otherwise be misclassified as an approval by the original
  // idox CONSENT-substring check. Refusal/withdrawal phrasing always wins.
  const refusedApps = relevant.filter((a) => {
    const status = a.status.toUpperCase();
    const decision = a.decision.toUpperCase();
    return (
      status === "REF" || status === "REFUSED" ||
      decision === "REF" ||
      decision.includes("REFUS") ||
      // Idox-specific: "Decided (Refused)"
      status.includes("REFUS")
    );
  });
  const withdrawnApps = relevant.filter((a) => {
    if (refusedApps.includes(a)) return false;
    const status = a.status.toUpperCase();
    const decision = a.decision.toUpperCase();
    // Agile: "Withdrawn by Applicant/Agent" / "Withdrawn (Treated As)" live
    // in the decisionText field (→ a.decision here), not the status field
    // idox always used — without this the original status-only check would
    // silently drop these into "pending".
    return status.includes("WITHDRAWN") || decision.includes("WITHDRAWN");
  });
  const approvedApps = relevant.filter((a) => {
    if (refusedApps.includes(a) || withdrawnApps.includes(a)) return false;
    const status = a.status.toUpperCase();
    const decision = a.decision.toUpperCase();
    return (
      status === "APP" || status === "APPROVED" ||
      status === "AAPR" || status === "AEGPD" ||
      decision === "APP" || decision === "AAPR" || decision === "AEGPD" ||
      // Agile: broadened from "APPROVE" to "APPROV" — real decisionText
      // values are often terse past-tense-free forms like "Approval" or
      // "Full - Approval with Conditions" which don't contain "APPROVE".
      decision.includes("APPROV") ||
      decision.includes("CONDITIONAL PERMISSION") ||
      decision.includes("CONSENT") ||
      decision.includes("PERMITTED DEV") ||
      decision.includes("LIST.BLD.APP") ||
      decision.includes("ACCEPT AMEND") ||
      // Agile: "Prior Approval Not Required", "Permission Not Required",
      // "X Not Required" — these live in the decision field, not status.
      decision.includes("NOT REQUIRED") ||
      // Agile: "Prior Approval; Granted/Informative", "Prior Approval
      // Required - Granted" — GRANT substring lives in the decision field.
      decision.includes("GRANT") ||
      // Idox-specific status strings: "Decided (Approved)", "Decided (Permitted Development)",
      // "Decided (Prior Approval Not Required)"
      status.includes("APPROV") ||
      status.includes("GRANTED") ||
      status.includes("PERMIT") ||
      status.includes("NOT REQUIRED") // Prior Approval Not Required = approved
    );
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

  // Sort approved by decision date (newest first), pending by received date (newest first)
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
        source: "agile",
        dataset: {
          windowMonths,
          from: windowFrom.toISOString().slice(0, 10),
          to: windowTo.toISOString().slice(0, 10),
          retrievedAt: windowTo.toISOString(),
        },
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

// ─── Authority Processing ────────────────────────────────────

async function processAuthority(
  authority: AgileAuthority,
  fromDate: Date,
  toDate: Date,
  months: number
): Promise<void> {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  🏛️  ${authority.name} (${authority.id})`);
  console.log(`  Portal: AgileApplications (x-client: ${authority.clientCode})`);
  console.log(`  Query: location="${authority.locationQuery}"`);
  console.log(`  Period: ${formatDateDDMMYYYY(fromDate)} to ${formatDateDDMMYYYY(toDate)} (${months} months, filtered client-side)`);
  console.log(`${"═".repeat(60)}`);

  // ── Fetch ─────────────────────────────────────────────────
  // A non-2xx response (bad client code, "too many records", network error)
  // is a hard failure — never silently recorded as zero results.
  let apiResponse: AgileSearchResponse;
  try {
    apiResponse = await withRetry(() => fetchAgileResults(authority), `Fetch ${authority.id}`);
  } catch (err) {
    console.error(`  ❌ Failed to fetch ${authority.id}: ${err}`);
    throw err;
  }

  const allResults = apiResponse.results || [];
  console.log(`\n  📦 Fetched: ${allResults.length} total results (API reports total=${apiResponse.total})`);

  // ── Client-side date filtering ───────────────────────────────
  // The API ignores date params entirely (confirmed empirically) so we
  // filter to the requested window on registrationDate ourselves. Apps
  // with no registrationDate are excluded from the window rather than
  // assumed-recent.
  const windowResults = allResults.filter((r) => {
    if (!r.registrationDate) return false;
    const d = new Date(r.registrationDate);
    if (isNaN(d.getTime())) return false;
    return d >= fromDate && d <= toDate;
  });
  console.log(`  📅 After date filter (last ${months} months): ${windowResults.length} results`);

  if (windowResults.length === 0) {
    console.log(`  ℹ️  No results in the requested window — this is a genuine zero, not a failure`);
    return;
  }

  // Normalise to canonical RawApp format
  const rawApps = windowResults.map((r) => normaliseAgileResult(r, authority));

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
    writeWebsiteJson(processed, authority, town.townSlug, town.countySlug, months);
  }
}

// ─── CLI ─────────────────────────────────────────────────────

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
        "  npx tsx scripts/fetch-planning-agile.ts --authority <id>\n" +
        "  npx tsx scripts/fetch-planning-agile.ts --all\n" +
        "  npx tsx scripts/fetch-planning-agile.ts --all --months 6\n" +
        "\nAvailable Agile authorities:"
    );
    for (const a of getEnabledAgileAuthorities()) {
      console.error(`  ✅ ${a.id} — ${a.name}`);
    }
    console.error("\nDisabled (use --authority to force):");
    for (const a of AGILE_AUTHORITIES.filter((x) => !x.enabled)) {
      console.error(`  ⏸️  ${a.id} — ${a.name}`);
    }
    process.exit(1);
  }

  return { authorityId, all, months };
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const { authorityId, all, months } = parseArgs();

  const now = new Date();
  const from = new Date(now);
  from.setMonth(from.getMonth() - months);

  let authorities: AgileAuthority[];

  if (all) {
    authorities = getEnabledAgileAuthorities();
    console.log(`\n🚀 Batch scraping ${authorities.length} enabled Agile authorities (${months} months)`);
  } else {
    const auth = getAgileAuthority(authorityId!);
    if (!auth) {
      console.error(`❌ Unknown Agile authority: ${authorityId}`);
      console.error("Available IDs:");
      for (const a of AGILE_AUTHORITIES) {
        const status = a.enabled ? "✅" : "⏸️";
        console.error(`  ${status} ${a.id} — ${a.name}`);
      }
      process.exit(1);
    }
    if (!auth.enabled) {
      if (!auth.clientCode) {
        console.error(`❌ ${auth.id} has no confirmed clientCode — cannot fetch. See registry comment for what was tried.`);
        process.exit(1);
      }
      console.log(`⚠️  ${auth.id} is disabled — scraping anyway as explicitly requested`);
    }
    authorities = [auth];
  }

  const results: { id: string; name: string; success: boolean; error?: string }[] = [];

  async function processOne(authority: AgileAuthority) {
    try {
      await processAuthority(authority, from, now, months);
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

  // Process authorities concurrently — each hits the same API host but on
  // independent single requests, so a small concurrency cap is plenty.
  const CONCURRENCY = all ? 4 : 1;

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
        await sleep(1000);
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
