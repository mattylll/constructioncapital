/**
 * Batch Planning Data Fetcher
 *
 * Fetches planning applications from multiple UK local authorities that use
 * the Civica Portal360 API. Supports three schema families (PBDC, GFPlanning,
 * PLANNINGCASE) and normalises all data into a common format for processing.
 *
 * Usage:
 *   npx tsx scripts/fetch-planning-batch.ts --all                     # All enabled authorities
 *   npx tsx scripts/fetch-planning-batch.ts --authority chelmsford    # Single authority
 *   npx tsx scripts/fetch-planning-batch.ts --all --months 6          # Custom date range
 *
 * Output:
 *   data/planning-exports/{authority-id}-raw-api-{date}.json          # Raw normalised data
 *   data/generated/planning/{county}/{town}/latest.json               # Website pipeline JSON
 */

import * as fs from "fs";
import * as path from "path";
import {
  type PlanningAuthority,
  PLANNING_AUTHORITIES,
  getAuthority,
  getEnabledAuthorities,
  normaliseFields,
} from "./planning-authorities";

// ─── Configuration ───────────────────────────────────────────

const PAGE_SIZE = 50;
const THROTTLE_MS = 500; // ms between API requests
const DEFAULT_MONTHS = 12;

// UK-wide fallback medians when local sold data is unavailable
const FALLBACK_MEDIANS: Record<string, number> = {
  detached: 450000,
  semi_detached: 290000,
  terraced: 245000,
  flat: 230000,
  blended: 295000,
};

// ─── Types ───────────────────────────────────────────────────

interface RawApiItem {
  Items: Array<{ FieldName: string; Value: string }>;
  KeyNo?: string;
  KeyNumber?: string;
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

// ─── Helpers ─────────────────────────────────────────────────

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function flattenItem(item: RawApiItem): Record<string, string> {
  const result: Record<string, string> = {};
  for (const field of item.Items) {
    result[field.FieldName] = field.Value ?? "";
  }
  // Carry through top-level KeyNo/KeyNumber (used by GFPlanning and PLANNINGCASE)
  if (item.KeyNo) result.KeyNo = item.KeyNo;
  if (item.KeyNumber) result.KeyNumber = item.KeyNumber;
  return result;
}

function extractPostcode(address: string): string {
  const match = address.match(/([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})/i);
  return match ? match[1].toUpperCase().replace(/\s+/, " ") : "";
}

function extractUnits(proposal: string): number | null {
  const p = proposal.toLowerCase();
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
      if (num > 0 && num < 500) return num;
    }
  }
  if (p.includes("single dwelling") || p.includes("1 dwelling") || p.includes("one dwelling")) return 1;
  if (
    (p.includes("change of use") || p.includes("conversion")) &&
    (p.includes("dwelling") || p.includes("residential")) &&
    !p.match(/\d+\s*(?:dwelling|unit|flat|apartment)/)
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

const RELEVANT_TYPE_CODES = new Set([
  // ── St Albans (PBDC) descriptive names ────────────────────
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
  // St Albans short codes
  "MIND", "MOR", "MORI", "SSM", "SMG", "LSM", "LSA", "LMG", "LRD",
  "MGT", "MPI", "COU", "PIP", "NAC", "PAOR", "PAAR", "PARR", "PAAF",
  "DEM", "LBB", "EIA", "SCR", "EXE", "ENF",

  // ── Lewes-Eastbourne (PBDC) short codes ───────────────────
  "FUL",     // Full planning application
  "OUT",     // Outline planning
  "VAR",     // Variation of condition (s73)
  "REM",     // Reserved matters
  "CPL",     // Certificate of proposed lawful use
  "CPE",     // Certificate of existing lawful use
  "LBC",     // Listed building consent
  "PDE",     // Prior determination
  "AGR",     // Agricultural
  "CND",     // Conditions
  "COND",    // Conditions (alt)
  "MPO",     // Modification of planning obligation
  "OHL",     // Overhead lines
  "CPO",     // Compulsory purchase order
  "LDP",     // Local development plan
  "P3OPA",   // Prior approval - office to residential
  "P3RPA",   // Prior approval - retail to residential
  "P3MPA",   // Prior approval - mixed use
  "P3PPA",   // Prior approval - permitted development

  // ── Chelmsford ref-code types (extracted from reference numbers) ──
  "S73",     // Section 73 variation
  "CUPAMA",  // Change of use prior approval - residential
  "CUPAQ",   // Change of use prior approval - office
  "CUPAR",   // Change of use prior approval - retail
  "PRIOR",   // Prior approval
  "SUPA",    // Prior approval (sub-type)
  "AG",      // Agricultural (may include barn conversions)
  "MOD106",  // Section 106 modification

  // ── Great Yarmouth (PLANNINGCASE) descriptive names ───────
  "Full",
  "Change of Use",
  "Outline",
  "Reserved Matters",
  "Listed Building",
  "Prior Approval",
  "Reg3or4 or NCC or EE",
  "Proposed Use",
  "Permitted Dev Extn",
  "Lawful/Establish.Use",
  "S.73 app - full",
  "S.73 app - outline",
  "S.73 app - CoU",
  "Perm' in Principle",
  "Local Develop't Orde",

  // ── Common full-text variations across councils ───────────
  "Full Application",
  "Full Planning",
  "Outline Application",
  "Reserved Matters Application",
  "Variation of Condition",
  "Removal of Condition",
  "Listed Building Consent",
  "Certificate of Lawfulness",

  // ── Ashfield descriptive names ────────────────────────────
  "Full Planning Application",
  "Outline Planning Application",
  "Major Full",
  "Major Outline",
  "Major Reserved Matters",
  "Major Remove / Vary condition",
  "Reserved Matter Application",
  "Application to Remove / Vary a Condition",
  "Application submitted under Section 73 of the Act",
  "Listed Building Consent - Extensions / Alterations",
  "Conservation Area Consent",
  "Full General Regulations submitted by ADC under Regulation 3",
  "Demolition Prior Notification",
  "Demolition Determination",
  "Applications sumbitted by Nottinghamshire County Council under Regulation 3",
  "Modify/Remove Section 106 Agreement",
  "Applications submitted under Private Acts",
]);

const EXCLUDED_TYPE_CODES = new Set([
  // ── St Albans (PBDC) descriptive names ────────────────────
  "Tree works in conservation area",
  "Tree works to TPO trees(s)",
  "Planning Portal Tree Submission",
  "Advert",
  "Advert (pre-2009)",
  "Householder",
  "Prior Notification Householder",
  "Certificate of Lawfulness - (proposed)",
  "Certificate of Lawfulness (existing)",
  "Certificate of Lawfulness (existing) (pre-2009)",
  "Certificate of Lawfulness (Proposed) (pre-2009)",
  "Discharge of Condition",
  "Non Materials Amendment",
  "EIA - SCOPING OPINION",
  "EIA - SCREENING OPINION",
  "Awaiting Validation",
  "Incomplete",
  "Invalid",
  "Withdrawn",
  "Withdrawn (pre-2009)",
  "Notifications",
  "Notifications (pre-2009)",
  "Pre-app",
  "Neighbouring Local Authority Consultation",
  "Section 53 Determination",
  "Established Use",
  "Hazardous Substance Consent",
  "Prior Approval - Telecommunications (pre-2009)",
  "Prior Approval - Agricultural Buildings (pre-2009)",
  "Prior approval - solar panels to non-domestic building",
  "Prior approval - shops to restaurant and cafe",
  "Prior Approval - to state school or nursery",
  "Agricultural Building",
  "Enforcement",
  "Environmental Impact Assessment",
  "PAV",
  "County Council",
  "planning portal submissions",
  // St Albans short codes
  "HSE", "TCA", "TPO", "T", "W", "CON", "CLP", "CEX", "MAL", "NMA",
  "NCS", "ADV", "INC", "INV", "AVA", "PPOR", "TELC", "PASP", "PAO",
  "AGB", "HCC", "S106",

  // ── Lewes-Eastbourne (PBDC) short codes ───────────────────
  "HOUS",      // Householder
  "DISCON",    // Discharge of condition
  "DCOND",     // Discharge of condition (alt)
  "NMA",       // Non-material amendment (already in St Albans set)
  "PREAPP",    // Pre-application
  "BBREG5",    // Building regs
  "TEREG5",    // Building regs (alt)
  "TCONSV",    // Tree conservation
  "STCA",      // S211 trees in conservation area
  "SPREAP",    // Strategic pre-app
  "Full Plans", // Building control (not planning)
  "LB Consent", // Listed building consent (minor works — exclude)
  "Discharg",  // Discharge of condition (alt)
  "TREES",     // Tree works
  "TEL",       // Telecoms
  "WPD",       // Withdrawn prior determination
  "SCREEN",    // EIA screening
  "HEDG",      // Hedgerow
  "PCAMS",     // Planning compliance
  "SADV",      // Signs/advertisements
  "Non-Material Change", // NMA alt
  "Advertisement", // Already in St Albans but re-listed for clarity
  "WAS",       // Waste
  "APNB",      // Agricultural prior notification - building
  "APNW",      // Agricultural prior notification - works

  // ── Great Yarmouth (PLANNINGCASE) descriptive names ───────
  "Householder",           // Already present from St Albans
  "Condition Discharge",
  "Works to TPO trees",
  "Pre-App Enquiry",
  "Telecoms 28 day not.",
  "Telecom 14 day enq",
  "Trees in Con.Area",
  "Advertisement",
  "Non Material Amendm'",
  "EIA Screening",
  "Obligation/106 Det.",
  "Planning Perform' Ag",
  "s106 Deed of Varia'n",
  "Determination 56",
  "Certified Location",

  // ── GFPlanning broad categories (Chelmsford-style) ────────
  // These councils put all record types in one database. Only
  // "Development Management" contains planning applications.
  "Building Control",
  "Local Land Charges",
  "Housing Assistance",
  "Complaint",
  "High Hedges",
  "Trees & Landscaping",

  // ── Common full-text variations ───────────────────────────
  "Householder Application",
  "Tree Preservation Order",
  "Trees in Conservation Area",
  "Discharge of Conditions",
  "Non-Material Amendment",
  "Pre-Application",
  "Pre-Application Advice",
  "Telecommunications",
  "Advertisement Consent",

  // ── Ashfield descriptive excluded names ───────────────────
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
  "County Matter",
  "Hedgerow Removal notices",
  "Screening / Scoping Opinions",
  "Submission in Complaince with a Condition",
  "Consultations on applications submitted by ADC under Regulation 4",
  // Ashfield short codes
  "CD", "RG", "PA", "NMA", "BD", "DM", "SF", "Q",
  "SCR", "EXT", "CB", "FSR", "MEXT",
  "PACU", "PATE", "PAOT", "PAAD",
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
  if (p.length < 60 && !p.match(/dwelling|unit|flat|apartment|residential|house|home/)) {
    if (MAINTENANCE_PATTERNS.some((pat) => pat.test(p))) return true;
  }
  if (p.includes("like for like") || p.includes("like-for-like")) return true;
  return false;
}

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
  _ref_type?: string;
  [key: string]: string | undefined;
}

/**
 * Extract a type code from the reference number when the app_type field
 * is a broad category (e.g., "Development Management" in Chelmsford).
 * Reference format: YY/NNNNN/TYPE or YY/NNNNN/TYPE/N
 */
function extractRefTypeCode(refNo: string): string | null {
  const m = refNo.match(/\d+\/\d+\/(\w+)/);
  return m ? m[1].toUpperCase() : null;
}

// Ref codes that indicate relevant application types
const RELEVANT_REF_CODES = new Set([
  "FUL", "OUT", "REM", "S73", "PIP", "DEM", "LBC",
  "CUPAMA", "CUPAQ", "CUPAR", "PRIOR", "SUPA", "AG", "MOD106",
]);

// Ref codes that indicate excluded application types
const EXCLUDED_REF_CODES = new Set([
  "PE", "PEPD", "TELPE", "DOC", "DD", "TPO", "CAT",
  "CLOPUD", "CLEUD", "NMAT", "ADV", "HHPA", "HHPAA",
  "OBS3", "OBS4", "REQ", "CM", "EIASO", "COD", "EB",
  "PROW", "S19", "TEL56", "CHL",
  // Enforcement
  "ENF", "ENFB", "ENFT1", "ENFT2", "ENFT3", "ENFC", "ENFA",
  // Other excluded
  "ADVREF", "TPOREF", "NONDET", "REFUSE", "HH", "S195", "COND",
]);

// Broad GFPlanning app_type values that need ref-based sub-classification
const BROAD_APP_TYPES = new Set([
  "Development Management",
  "Appeal",
  "Enforcement",
]);

function categorise(app: RawApp): { category: string; isRelevant: boolean; reason: string } {
  let appType = app.app_type || "";
  const proposal = (app.proposal || "").toLowerCase();

  // For GFPlanning councils with broad app_type, extract type from reference
  if (BROAD_APP_TYPES.has(appType) || appType === "") {
    const refCode = extractRefTypeCode(app.ref_no || "");
    if (refCode) {
      if (EXCLUDED_REF_CODES.has(refCode)) {
        if (refCode === "TPO" || refCode === "CAT") return { category: "trees", isRelevant: false, reason: `Ref type: ${refCode}` };
        if (refCode === "ADV") return { category: "advertisement", isRelevant: false, reason: `Ref type: ${refCode}` };
        if (refCode === "HHPA" || refCode === "HHPAA") return { category: "householder", isRelevant: false, reason: `Ref type: ${refCode}` };
        if (refCode === "PE" || refCode === "PEPD" || refCode === "TELPE") return { category: "excluded", isRelevant: false, reason: `Pre-app ref: ${refCode}` };
        if (refCode === "DOC" || refCode === "DD") return { category: "excluded", isRelevant: false, reason: `Discharge ref: ${refCode}` };
        if (refCode === "NMAT") return { category: "excluded", isRelevant: false, reason: `NMA ref: ${refCode}` };
        if (refCode === "CLOPUD" || refCode === "CLEUD") return { category: "excluded", isRelevant: false, reason: `Certificate ref: ${refCode}` };
        return { category: "excluded", isRelevant: false, reason: `Excluded ref: ${refCode}` };
      }
      if (RELEVANT_REF_CODES.has(refCode)) {
        // Override appType with the ref code so downstream categorisation works
        appType = refCode;
      }
    }
  }

  if (EXCLUDED_TYPE_CODES.has(appType)) {
    if (appType.includes("Tree") || appType.includes("TPO") || appType === "TCA" || appType === "TCONSV" || appType === "STPO") return { category: "trees", isRelevant: false, reason: `Excluded type: ${appType}` };
    if (appType.includes("Advert")) return { category: "advertisement", isRelevant: false, reason: `Excluded type: ${appType}` };
    if (appType === "Householder" || appType === "HOUS" || appType === "Prior Notification Householder" || appType === "Householder Application") return { category: "householder", isRelevant: false, reason: `Excluded type: ${appType}` };
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

// ─── Median Price Loading ────────────────────────────────────

interface SoldDataFile {
  stats: {
    medianPrice: number;
    medianByType: Record<string, number>;
  };
}

/**
 * Load median sold prices for a town from the Land Registry pipeline.
 * Falls back to UK-wide averages if data is unavailable.
 */
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

// ─── API Fetching ────────────────────────────────────────────

function buildSearchFields(
  authority: PlanningAuthority,
  dateFrom: string,
  dateTo: string
): Record<string, string> {
  const { searchDateField } = authority;

  switch (authority.schemaFamily) {
    case "pbdc":
      return {
        [`${searchDateField}From`]: dateFrom,
        [`${searchDateField}To`]: dateTo,
      };

    case "gfplanning":
      // GFPlanning uses SDate5From/SDate5To (not received_dateFrom)
      return {
        [`${searchDateField}From`]: dateFrom,
        [`${searchDateField}To`]: dateTo,
      };

    case "planningcase":
      // PLANNINGCASE uses DateRcvdFrom/DateRcvdTo
      return {
        [`${searchDateField}From`]: dateFrom,
        [`${searchDateField}To`]: dateTo,
      };

    default:
      throw new Error(`Unknown schema family: ${authority.schemaFamily}`);
  }
}

async function fetchPage(
  authority: PlanningAuthority,
  fromRow: number,
  toRow: number,
  dateFrom: string,
  dateTo: string
): Promise<{ items: RawApiItem[]; totalRows: number }> {
  const url = `${authority.baseUrl}${authority.apiPath}`;
  const body = {
    refType: authority.refType,
    fromRow,
    toRow,
    searchFields: buildSearchFields(authority, dateFrom, dateTo),
    NoTotalRows: false,
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    throw new Error(`API returned ${resp.status}: ${resp.statusText} (${url})`);
  }

  const data = await resp.json();
  const items: RawApiItem[] = data.KeyObjects || [];
  const totalRows: number = data.TotalRows || 0;

  return { items, totalRows };
}

async function fetchAllApplications(
  authority: PlanningAuthority,
  dateFrom: string,
  dateTo: string
): Promise<Record<string, string>[]> {
  console.log(`  📡 Fetching rows 1-${PAGE_SIZE}...`);
  const first = await fetchPage(authority, 1, PAGE_SIZE, dateFrom, dateTo);
  const totalRows = first.totalRows;
  console.log(`  📊 Total rows: ${totalRows}`);

  const allItems: RawApiItem[] = [...first.items];

  // Some councils (e.g., Tandridge) report TotalRows=0 but still return records.
  // If TotalRows is 0 but items were returned, paginate until we get an empty page.
  const useOpenPagination = totalRows === 0 && first.items.length > 0;
  if (useOpenPagination) {
    console.log(`  ℹ️  TotalRows=0 but got ${first.items.length} items — using open pagination`);
  }

  let fromRow = PAGE_SIZE + 1;
  while (useOpenPagination ? true : fromRow <= totalRows) {
    const toRow = useOpenPagination
      ? fromRow + PAGE_SIZE - 1
      : Math.min(fromRow + PAGE_SIZE - 1, totalRows);
    console.log(`  📡 Fetching rows ${fromRow}-${toRow}...`);
    await sleep(THROTTLE_MS);

    try {
      const page = await fetchPage(authority, fromRow, toRow, dateFrom, dateTo);
      if (page.items.length === 0) {
        if (useOpenPagination) break; // No more records
      }
      allItems.push(...page.items);
    } catch (err) {
      console.error(`  ❌ Error fetching rows ${fromRow}-${toRow}: ${err}`);
      if (useOpenPagination) break; // Stop on error in open pagination mode
    }

    fromRow += PAGE_SIZE;

    // Safety limit for open pagination to avoid infinite loops
    if (useOpenPagination && allItems.length > 50000) {
      console.log(`  ⚠️  Open pagination safety limit reached (${allItems.length} items)`);
      break;
    }
  }

  // Flatten and normalise field names to canonical PBDC format
  return allItems.map((item) => {
    const flat = flattenItem(item);
    return normaliseFields(flat, authority.schemaFamily, authority);
  });
}

// ─── Processing Pipeline ─────────────────────────────────────

function buildSourceUrl(app: RawApp, authority: PlanningAuthority): string {
  if (!app.KeyNo) return "";
  return `${authority.baseUrl}/planning/search-applications#VIEW?RefType=${authority.refType}&KeyNo=${app.KeyNo}`;
}

function processApplications(
  rawApps: RawApp[],
  authority: PlanningAuthority,
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
      source_url: buildSourceUrl(raw, authority),
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
  authority: PlanningAuthority,
  townSlug: string,
  countySlug: string
): void {
  const relevant = processed.filter((a) => a.is_relevant);

  const approvedApps = relevant.filter((a) => {
    const status = a.status.toUpperCase();
    const decision = a.decision.toUpperCase();
    // PBDC short codes: APP, AAPR, AEGPD
    // PLANNINGCASE text: APPROVE, APPROVE (CONDITIONS), ADV. CONSENT, LIST.BLD.APP, PERMITTED DEV.
    // St Albans: Approved, Conditional Permission, Consent
    return (
      status === "APP" || status === "APPROVED" ||
      status === "AAPR" || status === "AEGPD" ||
      decision === "APP" || decision === "AAPR" || decision === "AEGPD" ||
      decision.includes("APPROVE") ||
      decision.includes("CONDITIONAL PERMISSION") ||
      decision.includes("CONSENT") ||
      decision.includes("PERMITTED DEV") ||
      decision.includes("LIST.BLD.APP") ||
      decision.includes("ACCEPT AMEND")
    );
  });
  const refusedApps = relevant.filter((a) => {
    const status = a.status.toUpperCase();
    const decision = a.decision.toUpperCase();
    return (
      status === "REF" || status === "REFUSED" ||
      decision === "REF" ||
      decision.includes("REFUS")
    );
  });
  const pendingApps = relevant.filter(
    (a) =>
      !approvedApps.includes(a) &&
      !refusedApps.includes(a)
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
  authority: PlanningAuthority,
  dateFrom: string,
  dateTo: string,
  months: number
): Promise<void> {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  🏛️  ${authority.name} (${authority.id})`);
  console.log(`  Schema: ${authority.schemaFamily} | RefType: ${authority.refType}`);
  console.log(`  Period: ${dateFrom} to ${dateTo} (${months} months)`);
  console.log(`${"═".repeat(60)}`);

  // ── Fetch ──────────────────────────────────────────────────
  let applications: Record<string, string>[];
  try {
    applications = await fetchAllApplications(authority, dateFrom, dateTo);
  } catch (err) {
    console.error(`  ❌ Failed to fetch ${authority.id}: ${err}`);
    return;
  }

  // Deduplicate on ref_no
  const deduped = new Map<string, Record<string, string>>();
  for (const app of applications) {
    const ref = app.ref_no || "";
    if (ref) {
      deduped.set(ref, app);
    }
  }
  const results = Array.from(deduped.values());

  console.log(`\n  📦 Fetched: ${applications.length} raw records`);
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
      results as unknown as RawApp[],
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
        "  npx tsx scripts/fetch-planning-batch.ts --authority <id>\n" +
        "  npx tsx scripts/fetch-planning-batch.ts --all\n" +
        "  npx tsx scripts/fetch-planning-batch.ts --all --months 6\n" +
        "\nAvailable authorities:"
    );
    for (const a of getEnabledAuthorities()) {
      console.error(`  ✅ ${a.id} — ${a.name} (${a.schemaFamily})`);
    }
    console.error("\nDisabled (use --authority to force):");
    for (const a of PLANNING_AUTHORITIES.filter((x) => !x.enabled)) {
      console.error(`  ⏸️  ${a.id} — ${a.name} (${a.schemaFamily})`);
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
  const dateFrom = formatDate(from);
  const dateTo = formatDate(now);

  let authorities: PlanningAuthority[];

  if (all) {
    authorities = getEnabledAuthorities();
    console.log(`\n🚀 Batch fetching ${authorities.length} enabled authorities (${months} months)`);
  } else {
    const auth = getAuthority(authorityId!);
    if (!auth) {
      console.error(`❌ Unknown authority: ${authorityId}`);
      console.error("Available IDs:");
      for (const a of PLANNING_AUTHORITIES) {
        const status = a.enabled ? "✅" : "⏸️";
        console.error(`  ${status} ${a.id} — ${a.name}`);
      }
      process.exit(1);
    }
    if (!auth.enabled) {
      console.log(`⚠️  ${auth.id} is disabled — fetching anyway as explicitly requested`);
    }
    authorities = [auth];
  }

  const results: { id: string; name: string; success: boolean; error?: string }[] = [];

  for (const authority of authorities) {
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

    // Throttle between authorities to be respectful
    if (authorities.length > 1) {
      await sleep(1000);
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
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
