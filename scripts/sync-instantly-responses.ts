/**
 * Sync Instantly.ai Responses to GoHighLevel CRM
 *
 * Polls the Instantly v2 API for leads marked interested in the planning
 * outreach campaign, then creates GHL contacts/opportunities via pushLeadToGHL().
 *
 * Tags: "Outreach - Planning Data" to distinguish from website leads.
 *
 * Env: INSTANTLY_API_KEY, GHL_API_KEY, GHL_LOCATION_ID,
 *      INSTANTLY_CAMPAIGN_ID | INSTANTLY_CAMPAIGN_NAME (defaults to the weekly planning campaign)
 *
 * Usage:
 *   npx tsx scripts/sync-instantly-responses.ts
 *   npx tsx scripts/sync-instantly-responses.ts --campaign <campaign-id>
 *   npx tsx scripts/sync-instantly-responses.ts --all-campaigns   # every campaign in the workspace
 *   npx tsx scripts/sync-instantly-responses.ts --dry-run
 */

import * as fs from "fs";
import * as path from "path";

import { pushLeadToGHL } from "../src/lib/ghl";
import { loadEnvLocal } from "./lib/env";
import { INTEREST_STATUS_LABEL, InstantlyClient, leadVariables, type InstantlyCampaign } from "./lib/instantly";
import { CAMPAIGN_NAME_DEFAULT } from "./lib/outreach-copy";

loadEnvLocal();

interface SyncLogEntry {
  email: string;
  instantlyLeadId: string;
  ghlContactId: string;
  ghlOpportunityId: string;
  syncedAt: string;
}

const API_KEY = process.env.INSTANTLY_API_KEY;
const SYNC_LOG_PATH = path.join(process.cwd(), "data", "generated", "developer-prospects", "ghl-sync-log.json");

const args = process.argv.slice(2);
const campaignFlag = args.indexOf("--campaign");
const campaignId = campaignFlag !== -1 ? args[campaignFlag + 1] : process.env.INSTANTLY_CAMPAIGN_ID;
const allCampaigns = args.includes("--all-campaigns");
const isDryRun = args.includes("--dry-run");
const campaignName = process.env.INSTANTLY_CAMPAIGN_NAME ?? CAMPAIGN_NAME_DEFAULT;

function loadSyncLog(): SyncLogEntry[] {
  if (!fs.existsSync(SYNC_LOG_PATH)) return [];
  return JSON.parse(fs.readFileSync(SYNC_LOG_PATH, "utf-8"));
}

function saveSyncLog(log: SyncLogEntry[]): void {
  fs.mkdirSync(path.dirname(SYNC_LOG_PATH), { recursive: true });
  fs.writeFileSync(SYNC_LOG_PATH, JSON.stringify(log, null, 2), "utf-8");
}

/** "£1.3m" → 1300000, "£650k" → 650000 */
function parseGbp(value: string | undefined): number {
  if (!value) return 0;
  const m = value.replace(/[£,\s]/g, "").match(/^([\d.]+)([mk])?$/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const unit = (m[2] ?? "").toLowerCase();
  return Math.round(n * (unit === "m" ? 1_000_000 : unit === "k" ? 1_000 : 1));
}

async function main() {
  if (!API_KEY) {
    console.error("Missing INSTANTLY_API_KEY environment variable");
    process.exit(1);
  }
  const instantly = new InstantlyClient(API_KEY);

  let campaigns: InstantlyCampaign[];
  if (campaignId) {
    campaigns = [await instantly.getCampaign(campaignId)];
  } else if (allCampaigns) {
    campaigns = await instantly.listCampaigns();
  } else {
    campaigns = (await instantly.listCampaigns()).filter((c) => c.name.trim().toLowerCase() === campaignName.toLowerCase());
    if (campaigns.length === 0) {
      console.log(`No campaign named "${campaignName}" found. Pass --campaign <id> or --all-campaigns.`);
      return;
    }
  }
  console.log(`Syncing ${campaigns.length} campaign(s)`);

  const syncLog = loadSyncLog();
  const alreadySynced = new Set(syncLog.map((e) => e.email.toLowerCase()));

  let totalSynced = 0;
  let totalSkipped = 0;

  for (const campaign of campaigns) {
    console.log(`\nCampaign: ${campaign.name} (${campaign.id})`);
    const leads = await instantly.listLeads(campaign.id);
    // 1 interested, 2 meeting booked, 3 meeting completed, 4 closed
    const interested = leads.filter((l) => typeof l.lt_interest_status === "number" && l.lt_interest_status >= 1);
    const replied = leads.filter((l) => (l.email_reply_count ?? 0) > 0).length;
    console.log(`  Leads: ${leads.length}; replied: ${replied}; interested or better: ${interested.length}`);

    for (const lead of interested) {
      const email = lead.email.toLowerCase();
      if (alreadySynced.has(email)) {
        totalSkipped++;
        continue;
      }

      const vars = leadVariables(lead);
      const fullName = `${lead.first_name || ""} ${lead.last_name || ""}`.trim();
      const interestLabel = INTEREST_STATUS_LABEL[lead.lt_interest_status as number] ?? String(lead.lt_interest_status);
      const gdv = parseGbp(vars.gdv);
      const loanAmount = parseGbp(vars.loanAmount ?? vars.loan_amount);
      const siteAddress = vars.siteAddress ?? vars.site_address ?? "";
      const planningReference = vars.planningReference ?? vars.planning_reference ?? "";

      if (isDryRun) {
        console.log(`  [DRY RUN] ${email} — ${lead.company_name ?? ""} — ${interestLabel} — ${siteAddress}`);
        totalSynced++;
        continue;
      }

      console.log(`  Syncing: ${email} (${lead.company_name ?? ""}) — ${interestLabel}`);
      try {
        const result = await pushLeadToGHL({
          full_name: fullName || lead.company_name || email,
          email,
          phone: "",
          company: lead.company_name ?? "",
          project_location: vars.townName ?? vars.town_name ?? siteAddress,
          project_postcode: vars.sitePostcode ?? vars.site_postcode ?? "",
          project_type: "Development",
          units: parseInt((vars.unitsText ?? vars.units ?? "0").replace(/\D+/g, ""), 10) || undefined,
          gdv,
          total_cost: 0,
          loan_amount: loanAmount,
          loan_type: "Development Finance",
          additional_info: [
            `Instantly interest: ${interestLabel}`,
            `Planning Ref: ${planningReference || "N/A"} (${vars.localAuthority ?? vars.local_authority ?? ""})`,
            `Site: ${siteAddress || "N/A"}`,
            `Consent: ${vars.consentStage ?? ""}`,
            `Planning URL: ${vars.planningUrl ?? ""}`,
            `Contact role: ${vars.contactRole ?? ""}`,
          ].join("\n"),
          source_page: "Outreach - Planning Data",
          utm_source: "instantly",
          utm_medium: "email",
          utm_campaign: campaign.id,
          lead_source: "planning_outreach",
          lead_kind: "planning_outreach",
          pipeline_stage: "new",
          planning_reference: planningReference || undefined,
          article_url: vars.locationPageUrl ?? vars.article_url ?? undefined,
        });

        if (!result.ok) {
          console.error(`    GHL push failed: ${result.error.slice(0, 100)}`);
          continue;
        }

        syncLog.push({
          email,
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

  if (!isDryRun) saveSyncLog(syncLog);

  console.log(`\n--- Done ---`);
  console.log(`Synced: ${totalSynced}`);
  console.log(`Skipped (already synced): ${totalSkipped}`);
  console.log(`Log: ${SYNC_LOG_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
