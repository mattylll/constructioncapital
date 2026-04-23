/**
 * Sync Instantly.ai Responses to GoHighLevel CRM
 *
 * Polls Instantly API for positive replies to outreach campaigns,
 * then creates GHL contacts/opportunities via the existing pushLeadToGHL().
 *
 * Tags: "Outreach - Planning Data" to distinguish from website leads.
 *
 * Env: INSTANTLY_API_KEY, GHL_API_KEY, GHL_LOCATION_ID
 *
 * Usage:
 *   npx tsx scripts/sync-instantly-responses.ts
 *   npx tsx scripts/sync-instantly-responses.ts --campaign <campaign-id>
 *   npx tsx scripts/sync-instantly-responses.ts --dry-run
 */

import * as fs from "fs";
import * as path from "path";
import { pushLeadToGHL } from "../src/lib/ghl";

// ── Types ───────────────────────────────────────────────────────────────────

interface InstantlyLead {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  status: string;
  custom_variables: Record<string, string>;
  replied: boolean;
  interested: boolean;
}

interface SyncLogEntry {
  email: string;
  instantlyLeadId: string;
  ghlContactId: string;
  ghlOpportunityId: string;
  syncedAt: string;
}

// ── Config ──────────────────────────────────────────────────────────────────

const API_KEY = process.env.INSTANTLY_API_KEY;
const API_BASE = "https://api.instantly.ai/api/v1";
const SYNC_LOG_PATH = path.join(
  process.cwd(),
  "data",
  "generated",
  "developer-prospects",
  "ghl-sync-log.json"
);

// ── API ─────────────────────────────────────────────────────────────────────

async function getCampaigns(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/campaign/list?api_key=${API_KEY}`);
  if (!res.ok) throw new Error(`Instantly ${res.status}: ${await res.text()}`);
  return res.json();
}

async function getLeads(campaignId: string, status: string = "interested"): Promise<InstantlyLead[]> {
  const allLeads: InstantlyLead[] = [];
  let skip = 0;
  const limit = 100;

  // Paginate through all leads
  while (true) {
    const url = `${API_BASE}/lead/list?api_key=${API_KEY}&campaign_id=${campaignId}&limit=${limit}&skip=${skip}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Instantly ${res.status}: ${await res.text()}`);

    const leads: InstantlyLead[] = await res.json();
    if (leads.length === 0) break;

    // Filter by status
    const filtered = leads.filter((l) => {
      if (status === "interested") return l.interested;
      if (status === "replied") return l.replied;
      return l.status === status;
    });
    allLeads.push(...filtered);

    skip += limit;
    if (leads.length < limit) break;
  }

  return allLeads;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function loadSyncLog(): SyncLogEntry[] {
  if (!fs.existsSync(SYNC_LOG_PATH)) return [];
  return JSON.parse(fs.readFileSync(SYNC_LOG_PATH, "utf-8"));
}

function saveSyncLog(log: SyncLogEntry[]): void {
  fs.mkdirSync(path.dirname(SYNC_LOG_PATH), { recursive: true });
  fs.writeFileSync(SYNC_LOG_PATH, JSON.stringify(log, null, 2), "utf-8");
}

// ── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const campaignFlag = args.indexOf("--campaign");
const campaignId = campaignFlag !== -1 ? args[campaignFlag + 1] : undefined;
const isDryRun = args.includes("--dry-run");

async function main() {
  if (!API_KEY) {
    console.error("Missing INSTANTLY_API_KEY environment variable");
    process.exit(1);
  }

  // Get campaigns
  let campaigns: any[];
  if (campaignId) {
    campaigns = [{ id: campaignId, name: "specified" }];
  } else {
    campaigns = await getCampaigns();
    console.log(`Found ${campaigns.length} campaign(s)`);
  }

  const syncLog = loadSyncLog();
  const alreadySynced = new Set(syncLog.map((e) => e.email));

  let totalSynced = 0;
  let totalSkipped = 0;

  for (const campaign of campaigns) {
    console.log(`\nCampaign: ${campaign.name || campaign.id}`);

    // Get interested/replied leads
    const leads = await getLeads(campaign.id, "interested");
    console.log(`  Interested leads: ${leads.length}`);

    for (const lead of leads) {
      if (alreadySynced.has(lead.email)) {
        totalSkipped++;
        continue;
      }

      const vars = lead.custom_variables || {};
      const fullName = `${lead.first_name || ""} ${lead.last_name || ""}`.trim();
      const loanAmount = parseFloat(vars.loan_amount?.replace(/[£,km]/g, "") || "0") * 1000;
      const gdv = parseFloat(vars.gdv?.replace(/[£,km]/g, "") || "0") * 1000;

      if (isDryRun) {
        console.log(`  [DRY RUN] ${lead.email} — ${lead.company_name} — ${vars.loan_amount || "?"}`);
        totalSynced++;
        continue;
      }

      console.log(`  Syncing: ${lead.email} (${lead.company_name})`);

      try {
        const result = await pushLeadToGHL({
          full_name: fullName || lead.company_name,
          email: lead.email,
          phone: "",
          company: lead.company_name,
          project_location: vars.town_name || vars.site_address || "",
          project_postcode: vars.site_postcode || "",
          project_type: "Development",
          units: parseInt(vars.units || "0", 10) || undefined,
          gdv: gdv || 0,
          total_cost: 0,
          loan_amount: loanAmount || 0,
          loan_type: "Development Finance",
          additional_info: `Planning Ref: ${vars.planning_reference || "N/A"}\nSite: ${vars.site_address || "N/A"}\n${vars.personalised_summary || ""}`,
          source_page: "Outreach - Planning Data",
          utm_source: "instantly",
          utm_medium: "email",
          utm_campaign: campaign.id,
        });

        syncLog.push({
          email: lead.email,
          instantlyLeadId: lead.id,
          ghlContactId: result.contactId || "",
          ghlOpportunityId: result.opportunityId || "",
          syncedAt: new Date().toISOString(),
        });

        totalSynced++;
        console.log(`    GHL: contact=${result.contactId} opp=${result.opportunityId}`);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`    ERROR: ${msg.slice(0, 100)}`);
      }
    }
  }

  saveSyncLog(syncLog);

  console.log(`\n--- Done ---`);
  console.log(`Synced: ${totalSynced}`);
  console.log(`Skipped: ${totalSkipped}`);
  console.log(`Log: ${SYNC_LOG_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
