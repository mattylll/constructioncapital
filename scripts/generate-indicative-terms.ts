/**
 * Generate Indicative Finance Terms for Developer Prospects
 *
 * Calculates personalised indicative terms for each prospect based on their
 * planning data (GDV, units, development type) and adds a short personalised
 * summary for use in outreach emails.
 *
 * Usage:
 *   npx tsx scripts/generate-indicative-terms.ts
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ───────────────────────────────────────────────────────────────────

interface ContactEnrichedProspect {
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
  companiesHouse: any;
  contacts: any[];
  apolloEnrichedAt: string;
}

interface IndicativeTerms {
  /** Indicative loan amount (65-75% LTGDV) */
  loanAmount: number;
  loanAmountFormatted: string;
  /** Loan-to-GDV percentage */
  ltgdv: number;
  /** Interest rate range */
  rateFrom: number;
  rateTo: number;
  /** Arrangement fee percentage */
  arrangementFee: number;
  /** Term in months */
  termMonths: number;
  /** Personalised 2-3 sentence summary */
  summary: string;
  /** Primary site referenced */
  primarySite: string;
  /** Primary GDV */
  primaryGdv: number;
  primaryGdvFormatted: string;
}

interface ProspectWithTerms extends ContactEnrichedProspect {
  indicativeTerms: IndicativeTerms | null;
  termsGeneratedAt: string;
}

// ── Config ──────────────────────────────────────────────────────────────────

// Try contacts.json first (fully enriched), fall back to enriched.json, then prospects.json
const PROSPECTS_DIR = path.join(process.cwd(), "data", "generated", "developer-prospects");
const CANDIDATES = ["contacts.json", "enriched.json", "prospects.json"];
const OUTPUT_PATH = path.join(PROSPECTS_DIR, "with-terms.json");

// ── Rate/Term Bands ─────────────────────────────────────────────────────────

function calculateTerms(prospect: ContactEnrichedProspect): IndicativeTerms | null {
  if (prospect.totalEstimatedGdv <= 0) return null;

  // Find the largest application (primary deal)
  const primary = prospect.applications
    .filter((a) => a.estimatedGdv && a.estimatedGdv > 0)
    .sort((a, b) => (b.estimatedGdv || 0) - (a.estimatedGdv || 0))[0];

  if (!primary || !primary.estimatedGdv) return null;

  const gdv = primary.estimatedGdv;
  const units = primary.units || prospect.totalUnits || 1;

  // Determine rate band based on GDV and scheme size
  let rateFrom: number;
  let rateTo: number;
  let ltgdv: number;
  let arrangementFee: number;
  let termMonths: number;

  if (gdv >= 10_000_000) {
    // Large schemes: more competitive
    rateFrom = 6.5;
    rateTo = 8.5;
    ltgdv = 65;
    arrangementFee = 1.5;
    termMonths = 24;
  } else if (gdv >= 3_000_000) {
    // Mid-size schemes
    rateFrom = 7.0;
    rateTo = 9.0;
    ltgdv = 65;
    arrangementFee = 1.75;
    termMonths = 18;
  } else if (gdv >= 1_000_000) {
    // Smaller schemes
    rateFrom = 7.5;
    rateTo = 9.5;
    ltgdv = 65;
    arrangementFee = 2.0;
    termMonths = 18;
  } else {
    // Micro schemes
    rateFrom = 8.0;
    rateTo = 10.5;
    ltgdv = 60;
    arrangementFee = 2.0;
    termMonths = 12;
  }

  const loanAmount = Math.round(gdv * (ltgdv / 100));

  // Build personalised summary
  const townName = formatTownName(primary.townSlug);
  const address = primary.address.split(",")[0].trim();
  const unitsText = units > 1 ? `${units}-unit` : "single-unit";
  const devType = inferDevType(primary.proposal);

  const summary = [
    `We noticed your ${unitsText} ${devType} at ${address}, ${townName} with an estimated GDV of ${formatGBP(gdv)}.`,
    `Based on the scheme profile, our panel can offer indicative senior debt of ${formatGBP(loanAmount)} (${ltgdv}% LTGDV) at rates from ${rateFrom}% per annum, with a ${termMonths}-month term.`,
    `We would be happy to provide formal indicative terms within 24 hours — no upfront fees, no obligation.`,
  ].join(" ");

  return {
    loanAmount,
    loanAmountFormatted: formatGBP(loanAmount),
    ltgdv,
    rateFrom,
    rateTo,
    arrangementFee,
    termMonths,
    summary,
    primarySite: primary.address,
    primaryGdv: gdv,
    primaryGdvFormatted: formatGBP(gdv),
  };
}

function formatGBP(amount: number): string {
  if (amount >= 1_000_000) return `£${(amount / 1_000_000).toFixed(1)}m`;
  if (amount >= 1_000) return `£${(amount / 1_000).toFixed(0)}k`;
  return `£${amount.toLocaleString()}`;
}

function formatTownName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function inferDevType(proposal: string): string {
  const p = proposal.toLowerCase();
  if (p.includes("conversion") || p.includes("change of use") || p.includes("convert")) return "conversion scheme";
  if (p.includes("flat") || p.includes("apartment")) return "apartment development";
  if (p.includes("house") || p.includes("dwelling") || p.includes("bungalow")) return "residential development";
  if (p.includes("demolition") && (p.includes("erect") || p.includes("construct"))) return "redevelopment scheme";
  if (p.includes("mixed use") || p.includes("mixed-use")) return "mixed-use development";
  return "development scheme";
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  // Find input file
  let inputPath = "";
  for (const candidate of CANDIDATES) {
    const p = path.join(PROSPECTS_DIR, candidate);
    if (fs.existsSync(p)) {
      inputPath = p;
      break;
    }
  }

  if (!inputPath) {
    console.error("No prospect data found. Run the extraction pipeline first.");
    process.exit(1);
  }

  console.log(`Loading prospects from: ${inputPath}`);
  const prospects: ContactEnrichedProspect[] = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  console.log(`Loaded ${prospects.length} prospects\n`);

  let withTerms = 0;
  let withoutGdv = 0;
  const results: ProspectWithTerms[] = [];

  for (const prospect of prospects) {
    const terms = calculateTerms(prospect);

    results.push({
      ...prospect,
      indicativeTerms: terms,
      termsGeneratedAt: terms ? new Date().toISOString() : "",
    });

    if (terms) {
      withTerms++;
    } else {
      withoutGdv++;
    }
  }

  // Sort by loan amount descending
  results.sort((a, b) => (b.indicativeTerms?.loanAmount || 0) - (a.indicativeTerms?.loanAmount || 0));

  // Save
  fs.mkdirSync(PROSPECTS_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf-8");

  // Print top deals
  console.log("Top 15 deals by indicative loan amount:\n");
  console.log(
    "  " +
    "Company".padEnd(35) +
    "GDV".padStart(12) +
    "Loan".padStart(12) +
    "Rate".padStart(10) +
    "  Location"
  );
  console.log("  " + "-".repeat(80));

  for (const p of results.filter((r) => r.indicativeTerms).slice(0, 15)) {
    const t = p.indicativeTerms!;
    console.log(
      "  " +
      p.companyName.slice(0, 33).padEnd(35) +
      t.primaryGdvFormatted.padStart(12) +
      t.loanAmountFormatted.padStart(12) +
      `${t.rateFrom}-${t.rateTo}%`.padStart(10) +
      "  " +
      p.locations[0]
    );
  }

  console.log(`\n--- Done ---`);
  console.log(`With terms: ${withTerms}`);
  console.log(`Without GDV: ${withoutGdv}`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

main();
