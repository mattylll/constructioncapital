/**
 * Process raw planning application data from Portal360 API.
 * Categorises, filters, extracts units/GDV, and outputs JSON + Excel.
 *
 * Usage:
 *   npx tsx scripts/process-planning-data.ts data/planning-exports/st-albans-raw-api-2026-04-07.json
 */

import * as fs from "fs";
import * as path from "path";
import XLSX from "xlsx";

// ─── Configuration ───────────────────────────────────────────

const LOCAL_AUTHORITY = "St Albans City and District Council";
const TOWN_SLUG = "st-albans";
const COUNTY_SLUG = "hertfordshire";
const BASE_URL = "https://planningapplications.stalbans.gov.uk";

// St Albans median sold prices (for GDV estimation)
const MEDIANS: Record<string, number> = {
  detached: 892000,
  semi_detached: 580000,
  terraced: 445000,
  flat: 327000,
  blended: 560000,
};

// ─── Types ───────────────────────────────────────────────────

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
  [key: string]: string;
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
  if ((p.includes("change of use") || p.includes("conversion")) &&
      (p.includes("dwelling") || p.includes("residential")) &&
      !p.match(/\d+\s*(?:dwelling|unit|flat|apartment)/)) {
    return 1;
  }
  return null;
}

function estimateGDV(proposal: string, units: number | null): number | null {
  if (!units || units === 0) return null;
  const p = proposal.toLowerCase();
  if (p.includes("flat") || p.includes("apartment") || p.includes("maisonette")) return units * MEDIANS.flat;
  if (p.includes("detached") && !p.includes("semi")) return units * MEDIANS.detached;
  if (p.includes("semi-detached") || p.includes("semi detached")) return units * MEDIANS.semi_detached;
  if (p.includes("terraced") || p.includes("terrace") || p.includes("townhouse")) return units * MEDIANS.terraced;
  return units * MEDIANS.blended;
}

function extractCompany(nameField: string): { name: string; company: string } {
  if (!nameField) return { name: "", company: "" };

  // Portal360 format: "Mr John Smith (ABC Developments Ltd)"
  const bracketMatch = nameField.match(/^(.+?)\s*\((.+?)\)\s*$/);
  if (bracketMatch) {
    return { name: bracketMatch[1].trim(), company: bracketMatch[2].trim() };
  }

  // Check if the whole name looks like a company
  const companyPattern = /\b(ltd|limited|llp|plc|inc|corp|group|holdings|partners|partnership|developments|properties|homes|construction|building|estates)\b/i;
  if (companyPattern.test(nameField)) {
    return { name: nameField.trim(), company: nameField.trim() };
  }

  return { name: nameField.trim(), company: "" };
}

// Application type codes that are relevant for development
const RELEVANT_TYPE_CODES = new Set([
  // ─── Long names (from recent/validated applications) ───
  // Major
  "(Large Scale Major) Dwellings",
  "(Large Scale Major) All Other Developments",
  "(Large Scale Major) General Industry/Storage/Warehousing",
  "(Large Scale Major) Offices R & D Light Industry",
  "(Large Scale Major) Retail, Distribution & Servicing",
  // Small Scale Major
  "Smale Scale Major - Dwellings",
  "Small Scale Major - All Other Developments",
  "Small Scale Major - General Industry/Storage/Warehousing",
  "Small Scale Major - Offices R&D Light Industry",
  "Small Scale Major - Retail Distribution & Servicing",
  // Minor residential
  "(Minor) Dwellings",
  "(Minor) All Other Developments",
  "(Minor) Offices R&D Light Industry",
  "(Minor) Retail Distribution & Servicing",
  "(Minor) General Industry/Storage/Warehousing",
  "Minor Commercial Development",
  // Change of use
  "Change of Use",
  "Other - Change of use",
  // Prior approvals (residential conversions)
  "Prior Approval - Office to residential",
  "Prior Approval - Industrial to residential",
  "Prior approval - Retail to residential or mix",
  "Prior approval - agriculture to residential",
  "Prior Approval - Agriculture to range of uses",
  "Prior Approval - Demolition",
  "Prior Approval - Determination",
  // Other
  "Permission in Principle",
  "Conservation Area",
  "Listed Buildings Applications",
  "Demolish Listed Building",
  "Full Planning Application (pre-2009)",
  "Full Planning application pre-2000",
  "Dwellings (pre-2009)",
  "Major Development (pre-2009)",
  "Minor Development (pre-2009)",
  // ─── Short codes (from older/bulk API data) ───
  "MIND",   // Minor Dwellings
  "MOR",    // Minor Other Residential
  "MORI",   // Minor Other Industrial
  "SSM",    // Small Scale Major
  "SMG",    // Small Scale Major General
  "LSM",    // Large Scale Major (reserved matters etc.)
  "LSA",    // Large Scale Major (amendments)
  "LMG",    // Large Scale Major General
  "LRD",    // Large Scale Major Retail/Distribution
  "MGT",    // Major Gypsy/Traveller
  "MPI",    // Major Public/Infrastructure (variations)
  "COU",    // Change of Use
  "PIP",    // Permission in Principle
  "NAC",    // Reserved Matters Application
  "PAOR",   // Prior Approval - Office to Residential
  "PAAR",   // Prior Approval - Agriculture to Residential
  "PARR",   // Prior Approval - Retail to Residential
  "PAAF",   // Prior Approval - Agriculture to Flexible
  "DEM",    // Prior Approval - Demolition
  "LBB",    // Listed Building
  "EIA",    // Environmental Impact Assessment (large schemes)
  "SCR",    // Screening Opinion (large schemes)
  "EXE",    // Exempt works (some tree, treat as check)
  "ENF",    // Enforcement (deemed applications)
]);

const EXCLUDED_TYPE_CODES = new Set([
  // ─── Long names ───
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
  // ─── Short codes ───
  "HSE",    // Householder
  "TCA",    // Tree works in conservation area
  "TPO",    // Tree works TPO
  "T",      // Tree works (other)
  "W",      // Withdrawn
  "CON",    // Discharge of Condition
  "CLP",    // Certificate of Lawfulness (proposed)
  "CEX",    // Certificate of Lawfulness (existing)
  "MAL",    // Minor alterations (householder-type)
  "NMA",    // Non Material Amendment
  "NCS",    // Prior Notification (householder extensions)
  "ADV",    // Advertisement
  "INC",    // Incomplete
  "INV",    // Invalid
  "AVA",    // Awaiting Validation
  "PPOR",   // Planning portal submissions (unvalidated)
  "TELC",   // Telecoms
  "PASP",   // Prior Approval - Solar Panels
  "PAO",    // Prior Approval - Other (forestry etc.)
  "AGB",    // Agricultural Building
  "HCC",    // County Council consultation
  "S106",   // Section 106 discharge
]);

// Proposals that indicate minor/maintenance work, not real development
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
  // Very short proposals with no residential keywords are likely maintenance
  if (p.length < 60 && !p.match(/dwelling|unit|flat|apartment|residential|house|home/)) {
    if (MAINTENANCE_PATTERNS.some((pat) => pat.test(p))) return true;
  }
  // Explicit like-for-like replacements
  if (p.includes("like for like") || p.includes("like-for-like")) return true;
  return false;
}

function categorise(app: RawApp): { category: string; isRelevant: boolean; reason: string } {
  const appType = app.app_type || "";
  const proposal = (app.proposal || "").toLowerCase();

  // First check by application type code
  if (EXCLUDED_TYPE_CODES.has(appType)) {
    if (appType.includes("Tree") || appType.includes("TPO")) return { category: "trees", isRelevant: false, reason: `Excluded type: ${appType}` };
    if (appType.includes("Advert")) return { category: "advertisement", isRelevant: false, reason: `Excluded type: ${appType}` };
    if (appType === "Householder" || appType === "Prior Notification Householder") return { category: "householder", isRelevant: false, reason: `Excluded type: ${appType}` };
    // "planning portal submissions" — mostly unvalidated/empty, but check for real proposals
    if (appType === "planning portal submissions") {
      // If it has a substantive residential/development proposal, analyse it further
      if (proposal.match(/\b(dwelling|unit|flat|apartment|house|home|residential|erection|demolition|conversion|change\s+of\s+use)\b/i)) {
        // Fall through to proposal-text analysis below
      } else {
        return { category: "excluded", isRelevant: false, reason: `Unvalidated portal submission` };
      }
    } else {
      return { category: "excluded", isRelevant: false, reason: `Excluded type: ${appType}` };
    }
  }

  // Check for maintenance/minor works that slip through as "(Minor) All Other Developments" etc.
  if (isMaintenanceProposal(app.proposal || "")) {
    return { category: "maintenance", isRelevant: false, reason: `Maintenance/like-for-like: ${appType}` };
  }

  // Explicit relevant types (or portal submissions that passed the keyword check above)
  if (RELEVANT_TYPE_CODES.has(appType) || appType === "planning portal submissions") {
    // Sub-categorise based on proposal text
    if (proposal.includes("prior approval") || appType.includes("Prior Approval")) {
      // Filter out telecoms/infrastructure prior approvals
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
    // Demolition + rebuild — but not "removal of timbers" type structural work
    if (proposal.includes("demolition") && (proposal.includes("erection") || proposal.includes("replacement of"))) {
      // Check it's not just listed building structural repair
      if (!proposal.includes("listed building consent") || proposal.match(/\d+\s*(dwelling|unit|flat|apartment)/)) {
        return { category: "demolition_rebuild", isRelevant: true, reason: `Demolition & rebuild: ${appType}` };
      }
    }
    if (proposal.includes("erection") || proposal.includes("construction") || proposal.includes("new build")) {
      // Check it's not just extensions to an existing dwelling (householder-like)
      if (proposal.match(/\b(apartment|flat|dwelling|block|maisonette)s?\b/) && !proposal.match(/^proposed\s+(ground|first|side|rear|front|loft|single|two)\s/)) {
        return { category: "new_build", isRelevant: true, reason: `New build: ${appType}` };
      }
      // "erection of X" without dwelling keywords — could be extensions
      if (proposal.match(/\d+\s*(dwelling|unit|flat|apartment|house|home)/)) {
        return { category: "new_build", isRelevant: true, reason: `New build (units in proposal): ${appType}` };
      }
      // Extensions disguised as "(Minor) All Other Developments"
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
    // Listed Building / Conservation Area — only relevant if proposal involves residential conversion or new units
    if (appType.includes("Listed Building") || appType.includes("Conservation Area")) {
      if (proposal.match(/\b(dwelling|unit|flat|apartment|residential|conversion|change\s+of\s+use)\b/)) {
        return { category: "heritage", isRelevant: true, reason: `Heritage with residential element: ${appType}` };
      }
      return { category: "heritage_minor", isRelevant: false, reason: `Heritage (non-residential): ${appType}` };
    }
    // If it's a relevant type code but none of the above matched, keep it but flag
    if (RELEVANT_TYPE_CODES.has(appType)) {
      return { category: "other_relevant", isRelevant: true, reason: `Relevant type: ${appType}` };
    }
  }

  // Catch-all: check proposal text for residential keywords with unit counts
  if (proposal.match(/\d+\s*(dwelling|unit|flat|apartment|house|home)/)) {
    return { category: "other_residential", isRelevant: true, reason: "Residential keywords in proposal" };
  }

  // Unknown type - flag for review
  return { category: "unclassified", isRelevant: false, reason: `Unclassified type: ${appType}` };
}

// ─── Main ────────────────────────────────────────────────────

function main() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error("Usage: npx tsx scripts/process-planning-data.ts <input-json-file>");
    process.exit(1);
  }

  const rawApps: RawApp[] = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
  console.log(`\nLoaded ${rawApps.length} raw applications from ${inputFile}`);

  const processed: ProcessedApp[] = [];

  for (const raw of rawApps) {
    const { category, isRelevant, reason } = categorise(raw);
    const units = isRelevant ? extractUnits(raw.proposal || "") : null;
    const gdv = estimateGDV(raw.proposal || "", units);
    const applicant = extractCompany(raw.ApplicantContactNoName || "");
    const agent = extractCompany(raw.AgentContactNoName || "");
    const address = raw.application_address || raw.UPRNDisplay || "";

    processed.push({
      reference: raw.ref_no || "",
      planning_portal_ref: raw.planning_portal_ref_no || "",
      local_authority: LOCAL_AUTHORITY,
      source_url: raw.KeyNo
        ? `${BASE_URL}/planning/search-applications#VIEW?RefType=PBDC&KeyNo=${raw.KeyNo}`
        : "",
      address,
      postcode: extractPostcode(address),
      ward: raw.ward || "",
      parish: raw.parish || "",
      town_slug: TOWN_SLUG,
      county_slug: COUNTY_SLUG,
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

  const relevant = processed.filter((a) => a.is_relevant);
  const irrelevant = processed.filter((a) => !a.is_relevant);

  // ─── Summary ─────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  St Albans Planning Data — Processing Results");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Total applications: ${processed.length}`);
  console.log(`  Relevant (development): ${relevant.length}`);
  console.log(`  Filtered out: ${irrelevant.length}`);

  if (relevant.length > 0) {
    const withUnits = relevant.filter((a) => a.units);
    const totalUnits = withUnits.reduce((sum, a) => sum + (a.units || 0), 0);
    const totalGDV = relevant.reduce((sum, a) => sum + (a.estimated_gdv || 0), 0);
    console.log(`\n  Relevant applications with unit counts: ${withUnits.length}`);
    console.log(`  Total units identified: ${totalUnits}`);
    console.log(`  Total estimated GDV: £${(totalGDV / 1000000).toFixed(1)}M`);
  }

  // Category breakdown
  const categories = new Map<string, number>();
  for (const app of processed) {
    const key = `${app.is_relevant ? "✓" : "✗"} ${app.category}`;
    categories.set(key, (categories.get(key) || 0) + 1);
  }
  console.log("\n  Category breakdown:");
  for (const [cat, count] of [...categories.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${cat}: ${count}`);
  }

  // Split relevant into approved and pending
  const approvedApps = relevant.filter(
    (a) =>
      a.status === "Approved" ||
      a.decision.toLowerCase().includes("approved") ||
      a.decision.toLowerCase().includes("conditional permission") ||
      a.decision.toLowerCase().includes("consent")
  );
  const pendingApps = relevant.filter(
    (a) => !approvedApps.includes(a) && a.status !== "Refused" && !a.decision.toLowerCase().includes("refus")
  );
  const refusedApps = relevant.filter(
    (a) => a.status === "Refused" || a.decision.toLowerCase().includes("refus")
  );

  const approvedUnits = approvedApps.reduce((s, a) => s + (a.units || 0), 0);
  const pendingUnits = pendingApps.reduce((s, a) => s + (a.units || 0), 0);
  const approvedGdv = approvedApps.reduce((s, a) => s + (a.estimated_gdv || 0), 0);
  const pendingGdv = pendingApps.reduce((s, a) => s + (a.estimated_gdv || 0), 0);
  const decidedCount = approvedApps.length + refusedApps.length;
  const approvalRate = decidedCount > 0 ? Math.round((approvedApps.length / decidedCount) * 100) : 0;

  console.log(`\n  Approved: ${approvedApps.length} (${approvedUnits} units, £${(approvedGdv / 1000000).toFixed(1)}M GDV)`);
  console.log(`  Pending: ${pendingApps.length} (${pendingUnits} units, £${(pendingGdv / 1000000).toFixed(1)}M GDV)`);
  console.log(`  Refused: ${refusedApps.length}`);
  console.log(`  Approval rate: ${approvalRate}%`);

  // Show top 5 approved by GDV
  const topApproved = [...approvedApps].sort((a, b) => (b.estimated_gdv || 0) - (a.estimated_gdv || 0)).slice(0, 5);
  if (topApproved.length > 0) {
    console.log("\n  ── Top Approved (by GDV) ──────────────────────────");
    for (const app of topApproved) {
      const unitsStr = app.units ? ` (${app.units} units)` : "";
      const gdvStr = app.estimated_gdv_formatted ? ` — Est. GDV: ${app.estimated_gdv_formatted}` : "";
      console.log(`\n  ${app.reference} [${app.category}]`);
      console.log(`    ${app.proposal.substring(0, 120)}`);
      console.log(`    ${app.address}`);
      console.log(`    Decision: ${app.decision} on ${app.decision_date}${unitsStr}${gdvStr}`);
    }
  }

  // Show top 5 pending by GDV
  const topPending = [...pendingApps].sort((a, b) => (b.estimated_gdv || 0) - (a.estimated_gdv || 0)).slice(0, 5);
  if (topPending.length > 0) {
    console.log("\n  ── Top Pending (by GDV) ───────────────────────────");
    for (const app of topPending) {
      const unitsStr = app.units ? ` (${app.units} units)` : "";
      const gdvStr = app.estimated_gdv_formatted ? ` — Est. GDV: ${app.estimated_gdv_formatted}` : "";
      console.log(`\n  ${app.reference} [${app.category}]`);
      console.log(`    ${app.proposal.substring(0, 120)}`);
      console.log(`    ${app.address}`);
      console.log(`    Status: ${app.status}${unitsStr}${gdvStr}`);
    }
  }

  // ─── Output Files ────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];
  const exportDir = path.join(process.cwd(), "data", "planning-exports");
  fs.mkdirSync(exportDir, { recursive: true });

  // JSON — full processed data
  const jsonPath = path.join(exportDir, `st-albans-processed-${today}.json`);
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        metadata: {
          local_authority: LOCAL_AUTHORITY,
          town_slug: TOWN_SLUG,
          county_slug: COUNTY_SLUG,
          processed_at: new Date().toISOString(),
          total_count: processed.length,
          relevant_count: relevant.length,
        },
        relevant: relevant,
        all: processed,
      },
      null,
      2
    )
  );
  console.log(`\n  JSON saved: ${jsonPath}`);

  // Excel
  const xlsxPath = path.join(exportDir, `st-albans-processed-${today}.xlsx`);

  const toRow = (app: ProcessedApp) => ({
    Reference: app.reference,
    Address: app.address,
    Postcode: app.postcode,
    Ward: app.ward,
    Parish: app.parish,
    Proposal: app.proposal,
    Category: app.category,
    "App Type": app.application_type,
    Units: app.units ?? "",
    "Est. GDV": app.estimated_gdv_formatted,
    "Site Area (ha)": app.site_area_hectares,
    Status: app.status,
    Decision: app.decision,
    "Received": app.received_date,
    "Decision Date": app.decision_date,
    "Decision Level": app.decision_level,
    Applicant: app.applicant_name,
    "Applicant Company": app.applicant_company,
    Agent: app.agent_name,
    "Agent Company": app.agent_company,
    "Case Officer": app.case_officer,
    "Portal Link": app.source_url,
    Relevant: app.is_relevant ? "Yes" : "No",
    "Relevance Reason": app.relevance_reason,
  });

  const wb = XLSX.utils.book_new();

  // Sheet 1: Relevant (for outreach)
  const ws1 = XLSX.utils.json_to_sheet(relevant.map(toRow));
  ws1["!cols"] = [
    { width: 16 }, { width: 45 }, { width: 10 }, { width: 15 }, { width: 18 },
    { width: 65 }, { width: 18 }, { width: 25 }, { width: 6 }, { width: 16 },
    { width: 10 }, { width: 18 }, { width: 18 }, { width: 12 }, { width: 12 },
    { width: 14 }, { width: 30 }, { width: 25 }, { width: 30 }, { width: 25 },
    { width: 20 }, { width: 55 }, { width: 8 }, { width: 35 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, "Relevant - Outreach");

  // Sheet 2: All
  const ws2 = XLSX.utils.json_to_sheet(processed.map(toRow));
  ws2["!cols"] = ws1["!cols"];
  XLSX.utils.book_append_sheet(wb, ws2, "All Applications");

  // Sheet 3: Summary
  const summaryRows = [
    { Metric: "Local Authority", Value: LOCAL_AUTHORITY },
    { Metric: "Processed At", Value: new Date().toISOString() },
    { Metric: "Total Applications", Value: String(processed.length) },
    { Metric: "Relevant (Development)", Value: String(relevant.length) },
    { Metric: "Filtered Out", Value: String(irrelevant.length) },
    { Metric: "", Value: "" },
    { Metric: "CATEGORY BREAKDOWN", Value: "" },
    ...[...categories.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({ Metric: cat, Value: String(count) })),
  ];
  const ws3 = XLSX.utils.json_to_sheet(summaryRows);
  ws3["!cols"] = [{ width: 35 }, { width: 20 }];
  XLSX.utils.book_append_sheet(wb, ws3, "Summary");

  XLSX.writeFile(wb, xlsxPath);
  console.log(`  Excel saved: ${xlsxPath}`);

  // Website pipeline JSON (relevant only, split pending/approved)
  const generatedDir = path.join(process.cwd(), "data", "generated", "planning", COUNTY_SLUG, TOWN_SLUG);
  fs.mkdirSync(generatedDir, { recursive: true });
  const latestPath = path.join(generatedDir, "latest.json");

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

  fs.writeFileSync(
    latestPath,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        townSlug: TOWN_SLUG,
        countySlug: COUNTY_SLUG,
        localAuthority: LOCAL_AUTHORITY,
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
  console.log(`  Website JSON saved: ${latestPath}`);

  console.log("\n  Done!\n");
}

main();
