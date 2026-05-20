/**
 * Re-classify Planning Relevance (Post-Processing Filter)
 *
 * The upstream Idox/Civica fetchers mark FUL (full planning) apps as
 * "relevant" by default — letting through extensions, condition variations,
 * window replacements, and other non-development applications.
 *
 * This script applies stricter proposal-text rules to existing latest.json
 * files, drops the false positives, and recomputes summaries.
 *
 * Usage:
 *   npx tsx scripts/reclassify-planning-relevance.ts --dry-run        # impact report only
 *   npx tsx scripts/reclassify-planning-relevance.ts --apply          # rewrite files in place
 *   npx tsx scripts/reclassify-planning-relevance.ts --apply --town bedford
 */

import * as fs from "fs";
import * as path from "path";

const PLANNING_DIR = path.join(process.cwd(), "data", "generated", "planning");

interface WebApp {
  reference: string;
  address: string;
  postcode?: string;
  ward?: string;
  proposal: string;
  category?: string;
  units: number | null;
  estimatedGdv: number | null;
  status: string;
  decision: string;
  receivedDate: string;
  decisionDate: string;
  applicantName?: string;
  applicantCompany?: string;
  agentName?: string;
  agentCompany?: string;
  sourceUrl?: string;
}

interface LatestFile {
  updatedAt: string;
  townSlug: string;
  countySlug: string;
  localAuthority: string;
  summary: {
    total: number;
    relevant: number;
    approved: number;
    pending: number;
    refused: number;
    approvedUnits: number;
    pendingUnits: number;
    totalUnits: number;
    approvedGdv: number;
    pendingGdv: number;
    totalEstimatedGDV: number;
    approvalRate: number;
  };
  approvedApplications: WebApp[];
  pendingApplications: WebApp[];
}

// ─── Strict relevance rules ─────────────────────────────────────────────────

// Hard-exclude patterns: if proposal matches any, drop regardless of other signals.
const HARD_EXCLUDE_PATTERNS: RegExp[] = [
  // Variations & amendments — these are tweaks to existing approvals, not new dev
  /\bvariation\s+of\s+condition/i,
  /\bvary\s+condition/i,
  /\bnon[\s-]?material\s+amendment/i,
  /\bremoval\s+of\s+condition/i,
  /\bdischarge\s+(of\s+)?condition/i,
  /\bapplication\s+to\s+discharge\s+condition/i,
  /\bs73\s+application/i,
  /\bsection\s+73\b/i,
  // Window / door / fenestration / cladding / rendering — all maintenance
  /\breplacement\s+(of\s+)?(all\s+)?(existing\s+)?(white\s+)?(upvc\s+)?windows?\b/i,
  /\breplacement\s+windows?\b/i,
  /\brendering\s+of\s+(the\s+)?(existing\s+)?brickwork/i,
  /\bre-?roofing\b/i,
  /\bre-?cladding\b/i,
  /\bcladding\s+to\s+existing/i,
  /\bfenestration\s+alteration/i,
  // Single-element additions to existing homes
  /\b(new\s+)?entrance\s+porch\b/i,
  /\b(new\s+)?front\s+porch\b/i,
  /^\s*(proposed\s+)?porch\b/i,
  /\bbalcony\s+and\s+alteration/i,
  /\b(proposed\s+)?balcony\s+to\s+(first|ground|rear|front)\b/i,
  // Garage/outbuilding work that isn't conversion to dwelling
  /\bgarage\s+conversion\s+(to|into)\s+(habitable|office|study|playroom|gym|store)/i,
  /\bconversion\s+of\s+(existing\s+)?(integral\s+)?garage\s+(into|to)\s+(habitable|office|study|playroom|gym|living)/i,
  /\b(detached|attached)\s+garage\s+(extension|alteration)/i,
  // Pure landscaping / parking
  /\b(additional\s+)?car\s+parking\s+spaces?\b/i,
  /\bcar\s+park(ing)?\s+(extension|expansion|alteration)/i,
  /\bresurfacing\s+of\b/i,
  /\boverflow\s+car\s+park/i,
  // Containers, sheds, storage
  /\b(stoned\s+up\s+)?container\s+storage\s+facility/i,
  /\bshipping\s+container\b/i,
  /\b(timber|metal)\s+shed\b/i,
  // Energy/utility installations that aren't dwellings
  /\b(solar|photovoltaic|pv)\s+(panels?|array)\b/i,
  /\bair\s+source\s+heat\s+pump\b/i,
  /\bground\s+source\s+heat\s+pump\b/i,
  /\bev\s+charg(er|ing\s+point)/i,
  // Conservatory only
  /^\s*(proposed\s+)?(erection\s+of\s+)?conservatory\b/i,
  /\bconservatory\s+to\s+(side|rear|front)\s+elevation\b/i,
  /\breplace\s+conservatory\b/i,
  /\bextension\s+to\s+replace\s+conservatory\b/i,
];

// Extension exclusion — only if NOT accompanied by new-dwelling signals
const EXTENSION_PATTERNS: RegExp[] = [
  /\bsingle\s+storey\s+(rear|side|front|wrap[\s-]?around)\s+extension\b/i,
  /\btwo[\s-]?storey\s+(rear|side|front)\s+extension\b/i,
  /\bfirst[\s-]?floor\s+(rear|side|front)\s+extension\b/i,
  /\b(rear|side|front)\s+extension(\s+to)?\s+(existing|to\s+the)/i,
  /\bsingle\s+storey\s+extension\b/i,
  /\bproposed\s+extension\s+to\s+(existing\s+)?(dwelling|house|home|property)/i,
  /\bloft\s+conversion\s+with\s+(dormer|rear\s+dormer)/i,
];

// New-dwelling signals — require a POSITIVE new-build indicator.
// We deliberately do NOT include "existing dwelling" patterns; that phrasing
// indicates a householder application on a pre-existing home.
const NEW_DWELLING_SIGNALS: RegExp[] = [
  // Explicit unit counts: "5 dwellings", "12 no. flats", "20 new apartments", "6no. dwellinghouses"
  /\b(\d+)\s*(no\.?\s*)?(new\s+)?(residential\s+)?(dwellings?|dwellinghouses?|flats?|apartments?|maisonettes?)\b/i,
  /\b(\d+)\s*(no\.?\s*)?(new\s+)?(houses?|homes?|units?)\b\s*(?!.*\b(extension|existing)\b)/i,
  // Number-words: "five dwellings", "ten flats", "single self-contained dwelling" etc
  /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|one\s+hundred)\s+(new\s+)?(residential\s+)?(dwellings?|dwellinghouses?|flats?|apartments?|maisonettes?|houses?|homes?|units?)\b/i,
  /\bsingle\s+(new\s+)?(self[\s-]?contained\s+|residential\s+)?(dwelling|dwellinghouse|flat|apartment|residential\s+unit)\b/i,
  // Erection / construction of N dwellings
  /\b(erection|construction|provision|formation|creation)\s+of\s+(a\s+|\d+\s+|\w+\s+)?(new\s+)?(dwelling|residential\s+unit|block\s+of\s+(flats?|apartments?))/i,
  // Demolition + erection / replacement with dwellings
  /\bdemolition\s+of\s+.{0,120}\b(and|with|to\s+(enable|allow))\b.{0,120}\b(erection|construction|replacement\s+with|build)\s+.{0,80}\b(dwelling|flat|apartment|residential|block|house|home)/i,
  // Residential development phrasing
  /\bresidential\s+development\b/i,
  /\bnew[\s-]?build\s+(dwellings?|residential|housing|flats?|apartments?|homes?|estate)/i,
  /\bself[\s-]?build\s+dwelling/i,
  /\b\d+\s+self[\s-]?build/i,
  /\bblock\s+of\s+(\d+\s+|\w+\s+)?(flats?|apartments?|maisonettes?)/i,
  // Change of use to residential
  /\bchange\s+of\s+use\s+.{0,120}\bto\s+(\d+\s+)?(residential|dwellings?|flats?|apartments?|c3\b|hmo|sui\s+generis\s+residential)/i,
  /\bchange\s+of\s+use\s+from\s+.{0,80}\b(?:office|retail|industrial|warehouse|agricultural|class\s+e|class\s+b|public\s+house|pub|hotel|c1|c2|b1|b8|e\(g\)|e\(c\))\b.{0,80}\b(residential|c3|dwelling|flat|apartment)/i,
  // Conversion to residential — handles "to / into / to form / to provide / to create" + dwelling nouns
  /\bconversion\s+(of|from)\s+.{0,180}\b(to|into|to\s+(form|provide|create|facilitate|enable|allow))\s+.{0,40}(\d+\s+)?(no\.?\s*)?(dwellings?|dwellinghouses?|flats?|apartments?|residential|hmo|maisonettes?|sheltered\s+housing|homes?|houses?)/i,
  // Conversion of specific building types — only if accompanied by residential signal within the proposal
  /\bconversion\s+of\s+(?:existing\s+)?(barn|barns|outbuilding|outbuildings|agricultural\s+building|office\s+building|office|warehouse|public\s+house|pub|hotel|chapel|church|mill|former\s+\w+)\b.{0,250}\b(dwellings?|dwellinghouses?|residential|flats?|apartments?|homes?|hmo|c3\b)/i,
  // Subdivision into dwellings
  /\bsubdivision\s+of\s+.{0,80}(into|to\s+form)\s+(\d+\s+)?(no\.?\s*)?(dwellings?|flats?|apartments?|hmo)/i,
  // HMO / multiple occupation
  /\b(?:sui\s+generis\s+)?hmo\b/i,
  /\bhouse\s+in\s+multiple\s+occupation/i,
  /\bc4\s+\(hmo\)/i,
  // Mixed use development
  /\bmixed[\s-]?use\s+(scheme|development|building|proposal)/i,
  // Outline / reserved matters for housing
  /\boutline\s+(planning\s+)?(application|permission|consent)\s+(for|with)\s+.{0,80}(residential|housing|dwellings?|homes?|flats?|apartments?)/i,
  /\boutline\s+(planning\s+)?(application|permission|consent)\s+.{0,80}\b\d+\s+(dwelling|home|unit|flat|apartment|house)/i,
  /\breserved\s+matters\s+(application|approval|submission)/i,
  // Prior approval for office/class-E to residential
  /\bprior\s+approval\s+.{0,140}\b(office|class\s+e|class\s+b|commercial|agricultural|public\s+house|warehouse).{0,80}\b(to|into|change\s+to)\s+.{0,40}(residential|dwellings?|flats?|apartments?|c3\b)/i,
  // Care home / sheltered housing / extra-care
  /\b(care\s+home|sheltered\s+housing|extra[\s-]?care|retirement\s+living|retirement\s+village|assisted\s+living)\b/i,
  // Student accommodation
  /\b(purpose[\s-]?built\s+)?student\s+accommodation/i,
  /\bpbsa\b/i,
  // Build-to-rent / co-living
  /\b(build[\s-]?to[\s-]?rent|btr|co[\s-]?living)\b/i,
  // Affordable housing as a standalone phrase
  /\baffordable\s+housing\s+(scheme|development)/i,
];

// "Existing dwelling/property/home" indicates work on a pre-existing residence
// — usually a householder application, not new development.
const EXISTING_PROPERTY_SIGNAL = /\b(existing|to\s+(?:the\s+)?(?:host\s+)?)\s*(dwelling|property|house|home|building|premises|terrace|terraced|semi[\s-]?detached|detached|bungalow)\b/i;

function isStrictlyRelevant(proposal: string): {
  relevant: boolean;
  reason: string;
} {
  if (!proposal || proposal.trim().length === 0) {
    return { relevant: false, reason: "empty proposal" };
  }

  const p = proposal.toLowerCase();

  // 1. Hard exclusions always win
  for (const pat of HARD_EXCLUDE_PATTERNS) {
    if (pat.test(p)) {
      return { relevant: false, reason: `hard-exclude: ${pat.source.slice(0, 40)}` };
    }
  }

  // 2. New-dwelling signals — if present, mark relevant
  for (const pat of NEW_DWELLING_SIGNALS) {
    if (pat.test(p)) {
      return { relevant: true, reason: `new-dwelling signal: ${pat.source.slice(0, 40)}` };
    }
  }

  // 3. Extensions without new-dwelling signal — not relevant
  for (const pat of EXTENSION_PATTERNS) {
    if (pat.test(p)) {
      return { relevant: false, reason: `extension only: ${pat.source.slice(0, 40)}` };
    }
  }

  // 4. Generic extension catch — any "extension" + "existing/host" signal
  if (/\bextension\b/i.test(p) && EXISTING_PROPERTY_SIGNAL.test(p)) {
    return { relevant: false, reason: "extension on existing property" };
  }
  // Pure extension proposals with no new-dwelling signal at all
  if (/\bextension\b/i.test(p)) {
    return { relevant: false, reason: "extension without new-dwelling signal" };
  }

  // 5. Demolition without erection
  if (/\bdemolition\b/i.test(p) && !/\b(erection|construction|new\s+build|replacement\s+building)\b/i.test(p)) {
    return { relevant: false, reason: "demolition only" };
  }

  // 6. Commercial-only signals → not relevant for dev finance brokerage
  if (
    /\b(retail|shop|store|warehouse|industrial|office|commercial)\b/i.test(p) &&
    !/\b(dwelling|flat|apartment|residential|new\s+homes?|change\s+of\s+use\s+to|conversion\s+to)\b/i.test(p)
  ) {
    return { relevant: false, reason: "commercial only" };
  }

  // 7. Listed Building Consent style — heritage tweaks
  if (/\b(listed\s+building\s+consent|heritage\s+statement)\b/i.test(p) && !/\b(dwelling|flat|apartment|residential|conversion)\b/i.test(p)) {
    return { relevant: false, reason: "heritage minor" };
  }

  // 8. NO loose fallback. If we didn't hit a positive new-dwelling signal above,
  //    it's not relevant — even if the proposal mentions "dwelling" in the
  //    context of "existing dwelling" / "host dwelling" / householder work.
  return { relevant: false, reason: "no positive new-dwelling signal" };
}

// ─── Main ──────────────────────────────────────────────────────────────────

function recomputeSummary(file: LatestFile): LatestFile["summary"] {
  const approved = file.approvedApplications;
  const pending = file.pendingApplications;
  const sum = (apps: WebApp[], k: "units" | "estimatedGdv") =>
    apps.reduce((s, a) => s + (a[k] || 0), 0);

  const total = approved.length + pending.length;
  const decided = approved.length; // refused not retained in latest.json
  const approvalRate = decided > 0 ? Math.round((approved.length / decided) * 100) : 0;

  return {
    total,
    relevant: total,
    approved: approved.length,
    pending: pending.length,
    refused: 0, // refused apps aren't carried in latest.json
    approvedUnits: sum(approved, "units"),
    pendingUnits: sum(pending, "units"),
    totalUnits: sum(approved, "units") + sum(pending, "units"),
    approvedGdv: sum(approved, "estimatedGdv"),
    pendingGdv: sum(pending, "estimatedGdv"),
    totalEstimatedGDV: sum(approved, "estimatedGdv") + sum(pending, "estimatedGdv"),
    approvalRate,
  };
}

function main(): void {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const dryRun = args.includes("--dry-run") || !apply;
  const townFilter = args.includes("--town") ? args[args.indexOf("--town") + 1] : null;

  if (!fs.existsSync(PLANNING_DIR)) {
    console.error(`Planning dir not found: ${PLANNING_DIR}`);
    process.exit(1);
  }

  const files: string[] = [];
  for (const county of fs.readdirSync(PLANNING_DIR)) {
    const countyDir = path.join(PLANNING_DIR, county);
    if (!fs.statSync(countyDir).isDirectory()) continue;
    for (const town of fs.readdirSync(countyDir)) {
      if (townFilter && town !== townFilter) continue;
      const filePath = path.join(countyDir, town, "latest.json");
      if (fs.existsSync(filePath)) files.push(filePath);
    }
  }

  console.log(`Scanning ${files.length} town files${dryRun ? " (DRY RUN)" : " (APPLY)"}...\n`);

  let totalBefore = 0,
    totalAfter = 0,
    gdvBefore = 0,
    gdvAfter = 0,
    unitsBefore = 0,
    unitsAfter = 0,
    townsTouched = 0;

  const biggestDrops: Array<{ town: string; before: number; after: number; dropped: number }> = [];

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as LatestFile;

    const beforePending = data.pendingApplications.length;
    const beforeApproved = data.approvedApplications.length;
    const beforeGdv = (data.summary.pendingGdv || 0) + (data.summary.approvedGdv || 0);
    const beforeUnits = (data.summary.pendingUnits || 0) + (data.summary.approvedUnits || 0);

    const filteredPending = data.pendingApplications.filter((a) => isStrictlyRelevant(a.proposal).relevant);
    const filteredApproved = data.approvedApplications.filter((a) => isStrictlyRelevant(a.proposal).relevant);

    data.pendingApplications = filteredPending;
    data.approvedApplications = filteredApproved;
    data.summary = recomputeSummary(data);

    const afterPending = filteredPending.length;
    const afterApproved = filteredApproved.length;
    const afterGdv = data.summary.totalEstimatedGDV;
    const afterUnits = data.summary.totalUnits;

    totalBefore += beforePending + beforeApproved;
    totalAfter += afterPending + afterApproved;
    gdvBefore += beforeGdv;
    gdvAfter += afterGdv;
    unitsBefore += beforeUnits;
    unitsAfter += afterUnits;

    const dropped = beforePending + beforeApproved - afterPending - afterApproved;
    if (dropped > 0) {
      townsTouched++;
      biggestDrops.push({
        town: `${data.countySlug}/${data.townSlug}`,
        before: beforePending + beforeApproved,
        after: afterPending + afterApproved,
        dropped,
      });
    }

    if (apply && dropped > 0) {
      data.updatedAt = new Date().toISOString();
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    }
  }

  // ── Report ──
  console.log("══════════════════════════════════════════");
  console.log(`Towns touched:           ${townsTouched} / ${files.length}`);
  console.log(`Apps before / after:     ${totalBefore.toLocaleString()} → ${totalAfter.toLocaleString()} (${(totalBefore - totalAfter).toLocaleString()} dropped, ${Math.round(((totalBefore - totalAfter) / totalBefore) * 100)}%)`);
  console.log(`Units before / after:    ${unitsBefore.toLocaleString()} → ${unitsAfter.toLocaleString()}`);
  console.log(`GDV before / after:      £${Math.round(gdvBefore / 1e6).toLocaleString()}M → £${Math.round(gdvAfter / 1e6).toLocaleString()}M`);
  console.log("══════════════════════════════════════════\n");

  console.log("Top 15 biggest absolute drops:");
  biggestDrops.sort((a, b) => b.dropped - a.dropped).slice(0, 15).forEach((d) => {
    console.log(`  ${d.town.padEnd(45)}  ${d.before.toString().padStart(3)} → ${d.after.toString().padStart(3)}  (-${d.dropped})`);
  });

  if (dryRun) {
    console.log("\n(Dry run — no files modified. Re-run with --apply to write changes.)");
  } else {
    console.log("\nFiles updated. Run `git diff --stat data/generated/planning/` to see changes.");
  }
}

main();
