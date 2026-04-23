/**
 * Push Developer Prospects to Instantly.ai
 *
 * Takes prospects with indicative terms and contact data, then pushes them
 * as leads to an Instantly.ai campaign with custom variables for personalisation.
 *
 * API: Instantly.ai REST API
 * Env: INSTANTLY_API_KEY
 *
 * Usage:
 *   npx tsx scripts/push-to-instantly.ts --campaign <campaign-id>
 *   npx tsx scripts/push-to-instantly.ts --campaign <id> --limit 50
 *   npx tsx scripts/push-to-instantly.ts --campaign <id> --dry-run
 *   npx tsx scripts/push-to-instantly.ts --list-campaigns
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ───────────────────────────────────────────────────────────────────

interface ProspectWithTerms {
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
    townSlug: string;
    countySlug: string;
    sourceUrl: string;
  }>;
  totalApplications: number;
  totalUnits: number;
  totalEstimatedGdv: number;
  locations: string[];
  developmentTypes: string[];
  contacts: Array<{
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    linkedinUrl: string;
    companyDomain: string;
  }>;
  companiesHouse: {
    companyName: string;
    companyNumber: string;
    directors: Array<{ name: string; role: string }>;
  } | null;
  indicativeTerms: {
    loanAmount: number;
    loanAmountFormatted: string;
    ltgdv: number;
    rateFrom: number;
    rateTo: number;
    arrangementFee: number;
    termMonths: number;
    summary: string;
    primarySite: string;
    primaryGdv: number;
    primaryGdvFormatted: string;
  } | null;
  outreachStatus: string;
}

interface OutreachLogEntry {
  normalisedName: string;
  email: string;
  campaignId: string;
  pushedAt: string;
  instantlyLeadId: string | null;
}

// ── Config ──────────────────────────────────────────────────────────────────

const PROSPECTS_DIR = path.join(process.cwd(), "data", "generated", "developer-prospects");
const CANDIDATES = ["with-terms.json", "contacts.json", "enriched.json"];
const OUTREACH_LOG_PATH = path.join(PROSPECTS_DIR, "outreach-log.json");

const API_KEY = process.env.INSTANTLY_API_KEY;
const API_BASE = "https://api.instantly.ai/api/v1";

const RATE_LIMIT_MS = 500;

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const campaignFlag = args.indexOf("--campaign");
const campaignId = campaignFlag !== -1 ? args[campaignFlag + 1] : undefined;
const limitArg = args.indexOf("--limit") !== -1 ? parseInt(args[args.indexOf("--limit") + 1], 10) : Infinity;
const isDryRun = args.includes("--dry-run");
const listCampaigns = args.includes("--list-campaigns");

// ── API ─────────────────────────────────────────────────────────────────────

async function fetchCampaigns(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/campaign/list?api_key=${API_KEY}`);
  if (!res.ok) throw new Error(`Instantly API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function addLead(
  campaignId: string,
  email: string,
  firstName: string,
  lastName: string,
  companyName: string,
  customVars: Record<string, string>
): Promise<any> {
  const res = await fetch(`${API_BASE}/lead/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: API_KEY,
      campaign_id: campaignId,
      skip_if_in_workspace: true,
      leads: [
        {
          email,
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
          custom_variables: customVars,
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Instantly API ${res.status}: ${text}`);
  }
  return res.json();
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function loadOutreachLog(): OutreachLogEntry[] {
  if (!fs.existsSync(OUTREACH_LOG_PATH)) return [];
  return JSON.parse(fs.readFileSync(OUTREACH_LOG_PATH, "utf-8"));
}

function saveOutreachLog(log: OutreachLogEntry[]): void {
  fs.writeFileSync(OUTREACH_LOG_PATH, JSON.stringify(log, null, 2), "utf-8");
}

function formatTownName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!API_KEY) {
    console.error("Missing INSTANTLY_API_KEY environment variable");
    process.exit(1);
  }

  if (listCampaigns) {
    const campaigns = await fetchCampaigns();
    console.log("\nInstantly Campaigns:\n");
    for (const c of campaigns) {
      console.log(`  ${c.id}  ${c.name}  (${c.status})`);
    }
    process.exit(0);
  }

  if (!campaignId) {
    console.log("Usage: npx tsx scripts/push-to-instantly.ts --campaign <campaign-id>");
    console.log("       npx tsx scripts/push-to-instantly.ts --list-campaigns");
    process.exit(0);
  }

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
    console.error("No prospect data found. Run the enrichment pipeline first.");
    process.exit(1);
  }

  console.log(`Loading prospects from: ${inputPath}`);
  const prospects: ProspectWithTerms[] = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  console.log(`Loaded ${prospects.length} prospects`);

  // Load outreach log to prevent duplicates
  const log = loadOutreachLog();
  const alreadyPushed = new Set(log.map((e) => e.email));

  // Filter to prospects with emails and indicative terms
  const eligible = prospects.filter((p) => {
    const hasEmail = p.contacts?.some((c) => c.email);
    const hasTerms = p.indicativeTerms;
    return hasEmail && hasTerms;
  });

  console.log(`Eligible (has email + terms): ${eligible.length}`);

  let pushed = 0;
  let skipped = 0;
  let errors = 0;

  for (const prospect of eligible) {
    if (pushed >= limitArg) break;

    // Get the primary contact with an email
    const contact = prospect.contacts.find((c) => c.email);
    if (!contact || !contact.email) continue;

    if (alreadyPushed.has(contact.email)) {
      skipped++;
      continue;
    }

    const terms = prospect.indicativeTerms!;
    const primary = prospect.applications[0];
    const townName = formatTownName(primary?.townSlug || "");

    const customVars: Record<string, string> = {
      company_name: prospect.companiesHouse?.companyName || prospect.companyName,
      site_address: primary?.address || "",
      site_postcode: primary?.postcode || "",
      units: String(prospect.totalUnits),
      gdv: terms.primaryGdvFormatted,
      loan_amount: terms.loanAmountFormatted,
      rate_from: `${terms.rateFrom}%`,
      rate_to: `${terms.rateTo}%`,
      term_months: String(terms.termMonths),
      planning_reference: primary?.reference || "",
      town_name: townName,
      personalised_summary: terms.summary,
      contact_title: contact.title || "",
      linkedin_url: contact.linkedinUrl || "",
    };

    if (isDryRun) {
      console.log(`  [DRY RUN] ${contact.email} — ${prospect.companyName} — ${terms.loanAmountFormatted}`);
      pushed++;
      continue;
    }

    try {
      process.stdout.write(`  [${pushed + 1}] ${contact.email.padEnd(35)} `);

      const result = await addLead(
        campaignId,
        contact.email,
        contact.firstName,
        contact.lastName,
        prospect.companiesHouse?.companyName || prospect.companyName,
        customVars
      );

      log.push({
        normalisedName: prospect.normalisedName,
        email: contact.email,
        campaignId,
        pushedAt: new Date().toISOString(),
        instantlyLeadId: result?.leads?.[0]?.id || null,
      });

      console.log(`OK — ${terms.loanAmountFormatted}`);
      pushed++;
      await sleep(RATE_LIMIT_MS);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`ERROR: ${msg.slice(0, 80)}`);
      errors++;
    }
  }

  // Save outreach log
  saveOutreachLog(log);

  console.log(`\n--- Done ---`);
  console.log(`Pushed: ${pushed}`);
  console.log(`Skipped (already pushed): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Log: ${OUTREACH_LOG_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
