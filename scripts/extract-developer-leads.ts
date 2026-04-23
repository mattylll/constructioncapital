/**
 * Extract Developer Leads from Planning Data
 *
 * Reads processed planning data from data/generated/planning/{county}/{town}/latest.json,
 * extracts applicant/company information from relevant applications, deduplicates by company,
 * and produces a prospect list ready for enrichment.
 *
 * Usage:
 *   npx tsx scripts/extract-developer-leads.ts
 *   npx tsx scripts/extract-developer-leads.ts --county hertfordshire
 *   npx tsx scripts/extract-developer-leads.ts --min-gdv 500000
 *   npx tsx scripts/extract-developer-leads.ts --min-units 3
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ───────────────────────────────────────────────────────────────────

interface PlanningApplication {
  reference: string;
  address: string;
  postcode: string;
  ward: string;
  proposal: string;
  category: string;
  units: number | null;
  estimatedGdv: number | null;
  status: string;
  decision: string;
  receivedDate: string;
  decisionDate: string;
  applicantName: string;
  applicantCompany: string;
  agentName: string;
  agentCompany: string;
  sourceUrl: string;
}

interface PlanningData {
  updatedAt: string;
  townSlug: string;
  countySlug: string;
  localAuthority: string;
  summary: Record<string, number>;
  approvedApplications: PlanningApplication[];
  pendingApplications: PlanningApplication[];
}

interface DeveloperProspect {
  /** Primary identifier — company name or individual name */
  companyName: string;
  /** Individual name if different from company */
  contactName: string;
  /** Normalised company name for dedup */
  normalisedName: string;
  /** All planning applications for this prospect */
  applications: {
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
  }[];
  /** Aggregate stats */
  totalApplications: number;
  totalUnits: number;
  totalEstimatedGdv: number;
  locations: string[];
  developmentTypes: string[];
  /** Agent info (often an architect or planning consultant) */
  agentName: string;
  agentCompany: string;
  /** Enrichment status (for downstream scripts) */
  enrichmentStatus: "pending";
  outreachStatus: "new";
}

// ── Config ──────────────────────────────────────────────────────────────────

const PLANNING_DIR = path.join(process.cwd(), "data", "generated", "planning");
const OUTPUT_DIR = path.join(process.cwd(), "data", "generated", "developer-prospects");

// ── CLI args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const countyFilter = args.indexOf("--county") !== -1 ? args[args.indexOf("--county") + 1] : undefined;
const minGdvArg = args.indexOf("--min-gdv") !== -1 ? parseInt(args[args.indexOf("--min-gdv") + 1], 10) : 500_000;
const minUnitsArg = args.indexOf("--min-units") !== -1 ? parseInt(args[args.indexOf("--min-units") + 1], 10) : 2;

// ── Helpers ─────────────────────────────────────────────────────────────────

function normaliseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(mr|mrs|ms|miss|dr|prof|sir)\b\.?\s*/g, "")
    .replace(/\b(ltd|limited|llp|plc|inc|corp)\b\.?/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isCompanyName(name: string): boolean {
  return /\b(ltd|limited|llp|plc|inc|corp|group|holdings|partners|partnership|developments|properties|homes|construction|building|estates|investments|capital|ventures)\b/i.test(name);
}

function extractCompanyFromName(nameField: string): { name: string; company: string } {
  if (!nameField || !nameField.trim()) return { name: "", company: "" };

  // Portal360 format: "Mr John Smith (ABC Developments Ltd)"
  const bracketMatch = nameField.match(/^(.+?)\s*\((.+?)\)\s*$/);
  if (bracketMatch) {
    return { name: bracketMatch[1].trim(), company: bracketMatch[2].trim() };
  }

  // If the name itself looks like a company
  if (isCompanyName(nameField)) {
    return { name: nameField.trim(), company: nameField.trim() };
  }

  return { name: nameField.trim(), company: "" };
}

function categoriseDevelopment(proposal: string): string {
  const p = proposal.toLowerCase();
  if (p.includes("demolition") && (p.includes("erect") || p.includes("construct"))) return "demolition-rebuild";
  if (p.includes("conversion") || p.includes("change of use") || p.includes("convert")) return "conversion";
  if (p.includes("flat") || p.includes("apartment")) return "flats";
  if (p.includes("house") || p.includes("dwelling") || p.includes("bungalow")) return "houses";
  if (p.includes("mixed use") || p.includes("mixed-use")) return "mixed-use";
  if (p.includes("commercial") || p.includes("office") || p.includes("retail")) return "commercial";
  if (p.includes("prior approval") || p.includes("prior notification")) return "prior-approval";
  return "other";
}

// ── Data Loading ────────────────────────────────────────────────────────────

function loadAllPlanningData(): PlanningData[] {
  const results: PlanningData[] = [];

  if (!fs.existsSync(PLANNING_DIR)) {
    console.error(`Planning data directory not found: ${PLANNING_DIR}`);
    process.exit(1);
  }

  const counties = fs.readdirSync(PLANNING_DIR).filter((f) =>
    fs.statSync(path.join(PLANNING_DIR, f)).isDirectory()
  );

  for (const county of counties) {
    if (countyFilter && county !== countyFilter) continue;

    const countyDir = path.join(PLANNING_DIR, county);
    const towns = fs.readdirSync(countyDir).filter((f) =>
      fs.statSync(path.join(countyDir, f)).isDirectory()
    );

    for (const town of towns) {
      const filePath = path.join(countyDir, town, "latest.json");
      if (!fs.existsSync(filePath)) continue;

      try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as PlanningData;
        results.push(data);
      } catch {
        console.warn(`  [WARN] Failed to parse: ${filePath}`);
      }
    }
  }

  return results;
}

// ── Extraction ──────────────────────────────────────────────────────────────

function extractProspects(allData: PlanningData[]): Map<string, DeveloperProspect> {
  const prospects = new Map<string, DeveloperProspect>();

  let totalApps = 0;
  let relevantApps = 0;
  let skippedNoName = 0;
  let skippedLowGdv = 0;

  for (const data of allData) {
    const allApps = [...(data.approvedApplications || []), ...(data.pendingApplications || [])];

    for (const app of allApps) {
      totalApps++;

      // Filter: must have units OR estimated GDV above threshold
      const hasUnits = app.units !== null && app.units >= minUnitsArg;
      const hasGdv = app.estimatedGdv !== null && app.estimatedGdv >= minGdvArg;

      if (!hasUnits && !hasGdv) {
        skippedLowGdv++;
        continue;
      }

      relevantApps++;

      // Extract applicant info
      const applicant = app.applicantCompany
        ? { name: app.applicantName, company: app.applicantCompany }
        : extractCompanyFromName(app.applicantName);

      // Determine the primary identifier for grouping
      const primaryId = applicant.company || applicant.name;
      if (!primaryId) {
        skippedNoName++;
        continue;
      }

      const normId = normaliseName(primaryId);
      if (!normId) {
        skippedNoName++;
        continue;
      }

      // Get or create prospect
      let prospect = prospects.get(normId);
      if (!prospect) {
        // Also extract agent info
        const agent = app.agentCompany
          ? { name: app.agentName, company: app.agentCompany }
          : extractCompanyFromName(app.agentName);

        prospect = {
          companyName: applicant.company || applicant.name,
          contactName: applicant.name,
          normalisedName: normId,
          applications: [],
          totalApplications: 0,
          totalUnits: 0,
          totalEstimatedGdv: 0,
          locations: [],
          developmentTypes: [],
          agentName: agent.name,
          agentCompany: agent.company,
          enrichmentStatus: "pending",
          outreachStatus: "new",
        };
        prospects.set(normId, prospect);
      }

      // Add application
      prospect.applications.push({
        reference: app.reference,
        address: app.address,
        postcode: app.postcode,
        proposal: app.proposal,
        units: app.units,
        estimatedGdv: app.estimatedGdv,
        status: app.status,
        decision: app.decision,
        receivedDate: app.receivedDate,
        townSlug: data.townSlug,
        countySlug: data.countySlug,
        localAuthority: data.localAuthority,
        sourceUrl: app.sourceUrl,
      });

      prospect.totalApplications++;
      if (app.units) prospect.totalUnits += app.units;
      if (app.estimatedGdv) prospect.totalEstimatedGdv += app.estimatedGdv;

      // Track locations
      const loc = `${data.countySlug}/${data.townSlug}`;
      if (!prospect.locations.includes(loc)) prospect.locations.push(loc);

      // Track development types
      const devType = categoriseDevelopment(app.proposal);
      if (!prospect.developmentTypes.includes(devType)) prospect.developmentTypes.push(devType);
    }
  }

  console.log(`\nExtraction stats:`);
  console.log(`  Total applications scanned: ${totalApps}`);
  console.log(`  Relevant (>=${minUnitsArg} units or >=${formatGBP(minGdvArg)} GDV): ${relevantApps}`);
  console.log(`  Skipped (below threshold): ${skippedLowGdv}`);
  console.log(`  Skipped (no applicant name): ${skippedNoName}`);
  console.log(`  Unique prospects: ${prospects.size}`);

  return prospects;
}

function formatGBP(amount: number): string {
  if (amount >= 1_000_000) return `£${(amount / 1_000_000).toFixed(1)}m`;
  if (amount >= 1_000) return `£${(amount / 1_000).toFixed(0)}k`;
  return `£${amount.toLocaleString()}`;
}

// ── Output ──────────────────────────────────────────────────────────────────

function saveProspects(prospects: Map<string, DeveloperProspect>): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Sort by total estimated GDV descending
  const sorted = Array.from(prospects.values())
    .sort((a, b) => b.totalEstimatedGdv - a.totalEstimatedGdv);

  const outputPath = path.join(OUTPUT_DIR, "prospects.json");
  fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2), "utf-8");
  console.log(`\nSaved ${sorted.length} prospects to ${outputPath}`);

  // Print top 20
  console.log(`\nTop 20 prospects by estimated GDV:\n`);
  console.log(
    "  " +
    "Company/Name".padEnd(40) +
    "Apps".padStart(5) +
    "Units".padStart(7) +
    "Est. GDV".padStart(12) +
    "  Locations"
  );
  console.log("  " + "-".repeat(80));

  for (const p of sorted.slice(0, 20)) {
    console.log(
      "  " +
      p.companyName.slice(0, 38).padEnd(40) +
      p.totalApplications.toString().padStart(5) +
      p.totalUnits.toString().padStart(7) +
      formatGBP(p.totalEstimatedGdv).padStart(12) +
      "  " +
      p.locations.join(", ")
    );
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

console.log("Loading planning data...");
const allData = loadAllPlanningData();
console.log(`Loaded planning data for ${allData.length} town(s)`);

if (allData.length === 0) {
  console.log("No planning data found. Run planning data pipeline first:");
  console.log("  npx tsx scripts/fetch-planning-data.ts");
  console.log("  npx tsx scripts/process-planning-data.ts <output-file>");
  process.exit(0);
}

const prospects = extractProspects(allData);
saveProspects(prospects);
