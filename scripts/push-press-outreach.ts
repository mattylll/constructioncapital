/**
 * Push Press Packages to Journalists via Instantly.ai
 *
 * Takes generated press packages and pushes journalist contacts as leads
 * to an Instantly.ai campaign with the press release content as template
 * variables. Uses a separate campaign from developer outreach.
 *
 * API: Instantly.ai REST API
 * Env: INSTANTLY_API_KEY
 *
 * Usage:
 *   npx tsx scripts/push-press-outreach.ts --campaign <campaign-id> --county hertfordshire
 *   npx tsx scripts/push-press-outreach.ts --campaign <campaign-id> --all
 *   npx tsx scripts/push-press-outreach.ts --campaign <campaign-id> --county hertfordshire --dry-run
 *   npx tsx scripts/push-press-outreach.ts --list-campaigns
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ───────────────────────────────────────────────────────────────────

interface JournalistTarget {
  name: string;
  newspaper: string;
  contact: string;
  type: "property" | "finance" | "general";
  editor: string;
}

interface PressPackage {
  county: string;
  countyName: string;
  date: string;
  pressRelease: string;
  dataTableCsv: string;
  journalistTargets: JournalistTarget[];
  townCount: number;
  totalTransactions: number;
  avgMedianPrice: number;
  pipelineUnits: number;
  pipelineGdv: number;
}

interface OutreachLogEntry {
  email: string;
  journalistName: string;
  newspaper: string;
  county: string;
  campaignId: string;
  pushedAt: string;
}

// ── Config ──────────────────────────────────────────────────────────────────

const PACKAGES_DIR = path.join(process.cwd(), "data", "generated", "press-packages");
const LOG_PATH = path.join(process.cwd(), "data", "generated", "press-outreach", "outreach-log.json");

const API_KEY = process.env.INSTANTLY_API_KEY;
const API_BASE = "https://api.instantly.ai/api/v1";
const RATE_LIMIT_MS = 500;

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const campaignFlag = args.indexOf("--campaign");
const campaignId = campaignFlag !== -1 ? args[campaignFlag + 1] : undefined;
const countyFlag = args.indexOf("--county");
const countyFilter = countyFlag !== -1 ? args[countyFlag + 1] : undefined;
const isAll = args.includes("--all");
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
  if (!fs.existsSync(LOG_PATH)) return [];
  return JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));
}

function saveOutreachLog(log: OutreachLogEntry[]): void {
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), "utf-8");
}

function extractEmail(contact: string): string | null {
  // Extract email from contact string like "editor@stalbanstimes.co.uk | 07702 679146"
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = contact.match(emailPattern);
  return match ? match[0] : null;
}

function extractName(fullName: string): { firstName: string; lastName: string } {
  // Handle names like "Matt Adams (Editor — covers property)"
  const cleaned = fullName.replace(/\s*\(.*?\)\s*/g, "").trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function formatGBP(amount: number): string {
  if (amount >= 1_000_000_000) return `£${(amount / 1_000_000_000).toFixed(1)}bn`;
  if (amount >= 1_000_000) return `£${(amount / 1_000_000).toFixed(1)}m`;
  if (amount >= 1_000) return `£${Math.round(amount / 1_000)}k`;
  return `£${amount.toLocaleString()}`;
}

function getLatestPackage(county: string): PressPackage | null {
  const countyDir = path.join(PACKAGES_DIR, county);
  if (!fs.existsSync(countyDir)) return null;

  // Find the most recent date folder
  const dates = fs.readdirSync(countyDir).sort().reverse();
  for (const date of dates) {
    const pkgPath = path.join(countyDir, date, "package.json");
    if (fs.existsSync(pkgPath)) {
      return JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    }
  }
  return null;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!API_KEY && !isDryRun) {
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
    console.log("Usage:");
    console.log("  npx tsx scripts/push-press-outreach.ts --campaign <id> --county hertfordshire");
    console.log("  npx tsx scripts/push-press-outreach.ts --campaign <id> --all");
    console.log("  npx tsx scripts/push-press-outreach.ts --list-campaigns");
    console.log("\nAvailable counties with press packages:");

    if (fs.existsSync(PACKAGES_DIR)) {
      for (const c of fs.readdirSync(PACKAGES_DIR).sort()) {
        const pkg = getLatestPackage(c);
        if (pkg) {
          console.log(`  ${c} — ${pkg.date} — ${pkg.journalistTargets.length} targets`);
        }
      }
    }
    process.exit(0);
  }

  if (!countyFilter && !isAll) {
    console.error("Specify --county <slug> or --all");
    process.exit(1);
  }

  // Get counties
  let counties: string[];
  if (countyFilter) {
    counties = [countyFilter];
  } else {
    counties = fs.existsSync(PACKAGES_DIR) ? fs.readdirSync(PACKAGES_DIR).sort() : [];
  }

  const log = loadOutreachLog();
  const alreadyPushed = new Set(log.map((e) => `${e.email}:${e.county}`));

  let totalPushed = 0;
  let totalSkipped = 0;
  let totalNoEmail = 0;

  for (const county of counties) {
    const pkg = getLatestPackage(county);
    if (!pkg) {
      console.log(`\n${county}: [SKIP] No press package found`);
      continue;
    }

    console.log(`\n${pkg.countyName} (${pkg.date})`);
    console.log(`  ${pkg.journalistTargets.length} journalist targets`);

    // Build headline for template variables
    const headline = `${pkg.countyName} Property Market: ${formatGBP(pkg.avgMedianPrice)} Average Price, ${pkg.totalTransactions.toLocaleString()} Transactions, ${pkg.pipelineUnits.toLocaleString()} Units in Pipeline`;

    // Truncate press release for email (first 2000 chars for template)
    const excerptEnd = pkg.pressRelease.indexOf("### Notes to Editors");
    const pressExcerpt = excerptEnd > 0 ? pkg.pressRelease.slice(0, excerptEnd).trim() : pkg.pressRelease.slice(0, 2000);

    for (const journalist of pkg.journalistTargets) {
      const email = extractEmail(journalist.contact);
      if (!email) {
        totalNoEmail++;
        continue;
      }

      const key = `${email}:${county}`;
      if (alreadyPushed.has(key)) {
        totalSkipped++;
        continue;
      }

      const { firstName, lastName } = extractName(journalist.name);

      const customVars: Record<string, string> = {
        county_name: pkg.countyName,
        newspaper_name: journalist.newspaper,
        headline,
        total_transactions: pkg.totalTransactions.toLocaleString(),
        avg_median_price: formatGBP(pkg.avgMedianPrice),
        pipeline_units: pkg.pipelineUnits.toLocaleString(),
        pipeline_gdv: formatGBP(pkg.pipelineGdv),
        town_count: String(pkg.townCount),
        press_excerpt: pressExcerpt,
        journalist_type: journalist.type,
        package_date: pkg.date,
      };

      if (isDryRun) {
        console.log(`  [DRY RUN] ${email.padEnd(40)} ${journalist.newspaper} (${journalist.type})`);
        totalPushed++;
        continue;
      }

      try {
        process.stdout.write(`  [PUSH] ${email.padEnd(40)} `);

        await addLead(
          campaignId,
          email,
          firstName,
          lastName,
          journalist.newspaper,
          customVars
        );

        log.push({
          email,
          journalistName: journalist.name,
          newspaper: journalist.newspaper,
          county,
          campaignId,
          pushedAt: new Date().toISOString(),
        });

        console.log(`OK (${journalist.type})`);
        totalPushed++;
        await sleep(RATE_LIMIT_MS);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log(`ERROR: ${msg.slice(0, 80)}`);
      }
    }
  }

  saveOutreachLog(log);

  console.log(`\n--- Done ---`);
  console.log(`Pushed: ${totalPushed}`);
  console.log(`Skipped (already pushed): ${totalSkipped}`);
  console.log(`No email found: ${totalNoEmail}`);
  console.log(`Log: ${LOG_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
