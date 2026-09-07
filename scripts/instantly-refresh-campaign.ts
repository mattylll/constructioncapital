/**
 * Push the current email copy and per-lead variables to the live Instantly campaign.
 *
 * Use after editing scripts/lib/outreach-copy.ts or the stack maths so leads
 * already queued get the new sequence and the new figures.
 *
 *   npx tsx scripts/instantly-refresh-campaign.ts            # sequence + variables
 *   npx tsx scripts/instantly-refresh-campaign.ts --dry-run  # show what would change
 *   npx tsx scripts/instantly-refresh-campaign.ts --render   # print email 1 for each lead
 */

import { loadEnvLocal } from "./lib/env";
import { InstantlyClient, leadVariables } from "./lib/instantly";
import { CAMPAIGN_NAME_DEFAULT, buildSequence } from "./lib/outreach-copy";
import { candidateKey, selectApprovedCandidates, type Candidate } from "./lib/planning-candidates";
import { buildVariables } from "./lib/outreach-variables";

loadEnvLocal();

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const RENDER = args.includes("--render");

function render(template: string, vars: Record<string, string>): string {
  return template
    .replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`)
    .replace(/<div><br \/><\/div>/g, "\n")
    .replace(/<div>/g, "")
    .replace(/<\/div>/g, "\n");
}

async function main() {
  const instantly = new InstantlyClient(process.env.INSTANTLY_API_KEY ?? "");
  const name = process.env.INSTANTLY_CAMPAIGN_NAME ?? CAMPAIGN_NAME_DEFAULT;
  const campaign = process.env.INSTANTLY_CAMPAIGN_ID
    ? await instantly.getCampaign(process.env.INSTANTLY_CAMPAIGN_ID)
    : (await instantly.listCampaigns()).find((c) => c.name.trim().toLowerCase() === name.toLowerCase());
  if (!campaign) throw new Error(`Campaign "${name}" not found`);
  console.log(`Campaign: ${campaign.name} (${campaign.id}) status=${campaign.status}`);

  // 1. Sequence
  const sequence = buildSequence();
  if (DRY_RUN) console.log(`[DRY RUN] would update sequence: ${sequence.length} steps`);
  else {
    await instantly.updateCampaign(campaign.id, { sequences: [{ steps: sequence }] });
    console.log(`Sequence updated: ${sequence.length} steps`);
  }

  // 2. Variables for leads already in the campaign, recomputed from current planning data.
  const candidates = new Map<string, Candidate>();
  for (const c of selectApprovedCandidates({ minUnits: 1, minGdv: 0 })) candidates.set(c.key, c);

  const leads = await instantly.listLeads(campaign.id);
  console.log(`Leads in campaign: ${leads.length}`);
  let updated = 0;
  for (const lead of leads) {
    const vars = leadVariables(lead);
    const key = candidateKey(vars.localAuthority ?? "", vars.planningReference ?? "");
    const candidate = candidates.get(key);
    if (!candidate) {
      console.log(`  ${lead.email}: no current candidate for ${vars.planningReference} (${vars.localAuthority}), left as is`);
      continue;
    }
    const role = (vars.contactRole as "owner" | "director" | "agent") || "owner";
    const next = buildVariables(candidate, role);
    if (RENDER) {
      const step = sequence[0].variants[0];
      const all = { ...next, firstName: lead.first_name ?? "", companyName: lead.company_name ?? "" };
      console.log(`\n================ ${lead.email} ================\nSUBJECT: ${render(step.subject, all)}\n\n${render(step.body, all)}`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`  [DRY RUN] ${lead.email}: senior ${next.seniorLoan}, stretch ${next.stretchSenior}, mezz ${next.mezzanine}, equity ${next.equityWithMezz}`);
      continue;
    }
    await instantly.updateLead(lead.id, { custom_variables: next });
    updated++;
    console.log(`  updated ${lead.email}: senior ${next.seniorLoan}, stretch ${next.stretchSenior}, mezz ${next.mezzanine}, equity ${next.equityWithMezz}`);
  }
  if (!RENDER) console.log(`Done. Leads updated: ${updated}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
