/**
 * Weekly planning-approval outreach pipeline.
 *
 *   planning data (approved, finance-size schemes)
 *     → applicant / agent names from the portal detail page where the scraper lacks them
 *     → owner resolution (Companies House, optional) + contact discovery (Apollo, credit-safe)
 *     → leads pushed into the Instantly campaign with per-site variables
 *     → run report + state so nothing is enriched or emailed twice
 *
 * Usage:
 *   npx tsx scripts/planning-outreach-weekly.ts                 # full weekly run
 *   npx tsx scripts/planning-outreach-weekly.ts --dry-run       # enrich, but no Instantly writes and no state writes
 *   npx tsx scripts/planning-outreach-weekly.ts --no-enrich     # candidates + applicant details only (no API credits)
 *   npx tsx scripts/planning-outreach-weekly.ts --no-push       # enrich + report, do not push
 *   npx tsx scripts/planning-outreach-weekly.ts --bootstrap     # mark every current approval as seen (skip the backlog)
 *   npx tsx scripts/planning-outreach-weekly.ts --limit 40 --max-age-days 45 --include-agents
 *   npx tsx scripts/planning-outreach-weekly.ts --source planit --since-days 90   # national feed (PlanIt) instead of our scrapers
 *
 * Env: INSTANTLY_API_KEY (required to push), APOLLO_API_KEY (contacts),
 *      REOON_API_KEY (email verification before push; --exclude-catch-all or REOON_ALLOW_CATCH_ALL=0 to drop catch-alls),
 *      COMPANIES_HOUSE_API_KEY (optional, improves individual-applicant matching),
 *      INSTANTLY_CAMPAIGN_ID | INSTANTLY_CAMPAIGN_NAME, INSTANTLY_SENDER_DOMAINS,
 *      INSTANTLY_DAILY_LIMIT, INSTANTLY_AUTO_ACTIVATE, APOLLO_MAX_ENRICH_PER_RUN
 */

import * as fs from "fs";
import * as path from "path";

import { SITE_URL } from "@/lib/constants";

import { loadEnvLocal } from "./lib/env";
import { ApolloClient } from "./lib/apollo";
import { CompaniesHouseClient } from "./lib/companies-house";
import { CAMPAIGN_STATUS_LABEL, InstantlyClient, type InstantlyCampaign } from "./lib/instantly";
import { OwnerResolver, type OwnerResolution, type ResolvedContact } from "./lib/owner-resolution";
import { ReoonClient, type Verification } from "./lib/reoon";
import { CAMPAIGN_NAME_DEFAULT, buildSchedule, buildSequence } from "./lib/outreach-copy";
import { fetchApplicantDetails, isFastwebDetailUrl, isIdoxDetailUrl, mapWithHostThrottle, type ApplicantDetails } from "./lib/planning-applicants";
import { buildVariables } from "./lib/outreach-variables";
import { fetchPlanItPermitted, planItToCandidates } from "./lib/planit";
import {
  STAGE_LABEL,
  deslugify,
  formatComparable,
  formatGBP,
  postcodeDistrict,
  siteKey,
  dedupeBySite,
  selectApprovedCandidates,
  sortCandidates,
  toIsoDate,
  type Candidate,
} from "./lib/planning-candidates";

loadEnvLocal();

// ── CLI ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const num = (name: string, fallback: number) => {
  const i = args.indexOf(name);
  if (i === -1) return fallback;
  const v = Number(args[i + 1]);
  return Number.isFinite(v) ? v : fallback;
};
const str = (name: string) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};

const DRY_RUN = flag("--dry-run");
const NO_ENRICH = flag("--no-enrich");
const NO_PUSH = flag("--no-push") || DRY_RUN;
const BOOTSTRAP = flag("--bootstrap");
const INCLUDE_AGENTS = flag("--include-agents");
const INCLUDE_LOW_CONFIDENCE = flag("--include-low-confidence");
const EXCLUDE_CATCH_ALL = flag("--exclude-catch-all") || process.env.REOON_ALLOW_CATCH_ALL === "0";
const LIMIT = num("--limit", 60);
const MAX_AGE_DAYS = num("--max-age-days", 45);
const MIN_GDV = num("--min-gdv", 500_000);
const MIN_UNITS = num("--min-units", 2);
/** Schemes above this are plc / housing-association territory, not cold-email prospects; they are listed in the report instead. */
const MAX_UNITS = num("--max-units", 150);
const MAX_ENRICH = num("--max-enrich", Number(process.env.APOLLO_MAX_ENRICH_PER_RUN ?? 40));
const CAMPAIGN_ID_ARG = str("--campaign") ?? process.env.INSTANTLY_CAMPAIGN_ID;
/** Candidate source: "local" (our scrapers), "planit" (national feed), or "both". */
const SOURCE = (str("--source") ?? "local") as "local" | "planit" | "both";
const SINCE_DAYS = num("--since-days", 90);
/** Use only PlanIt windows already on disk (PlanIt rate-limits anonymous pulls hard). */
const PLANIT_CACHED_ONLY = flag("--planit-cached-only");
/** Re-run sites whose last outcome found no contact (e.g. after adding a data source such as Companies House). */
const RETRY_UNRESOLVED = flag("--retry-unresolved");
const RETRYABLE = new Set(["unresolved", "owner_identified_no_email", "no_applicant", "not_enriched", "retracted_false_match", "verification_rejected"]);
const CAMPAIGN_NAME = process.env.INSTANTLY_CAMPAIGN_NAME ?? CAMPAIGN_NAME_DEFAULT;
const SENDER_DOMAINS = (process.env.INSTANTLY_SENDER_DOMAINS ?? "constructioncapital,construction-capital").split(",");

// ── Paths ────────────────────────────────────────────────────────────────────

const OUT_ROOT = path.join(process.cwd(), "data", "generated", "planning-outreach");
const STATE_PATH = path.join(OUT_ROOT, "state.json");
const OUTREACH_LOG_PATH = path.join(process.cwd(), "data", "generated", "developer-prospects", "outreach-log.json");
const RUN_ID = toIsoDate(new Date());
const RUN_DIR = path.join(OUT_ROOT, "runs", RUN_ID);

// ── State ────────────────────────────────────────────────────────────────────

interface ProcessedEntry {
  firstSeen: string;
  processedAt: string;
  runId: string;
  outcome: string;
  emails: string[];
  reference: string;
  localAuthority: string;
}

interface State {
  version: 1;
  processed: Record<string, ProcessedEntry>;
}

interface OutreachLogEntry {
  normalisedName: string;
  email: string;
  campaignId: string;
  pushedAt: string;
  instantlyLeadId: string | null;
  planningReference?: string;
}

function readJsonFile<T>(p: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(p: string, data: unknown): void {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf-8");
}

function csvEscape(v: unknown): string {
  const raw = v === null || v === undefined ? "" : String(v);
  return `"${raw.replace(/"/g, '""')}"`;
}

function writeCsv(p: string, rows: Array<Record<string, unknown>>): void {
  if (rows.length === 0) {
    fs.writeFileSync(p, "", "utf-8");
    return;
  }
  const headers = Object.keys(rows[0]);
  const body = rows.map((r) => headers.map((h) => csvEscape(r[h])).join(","));
  fs.writeFileSync(p, [headers.map(csvEscape).join(","), ...body].join("\n"), "utf-8");
}

// ── Types for this run ───────────────────────────────────────────────────────

interface WorkItem {
  candidate: Candidate;
  details: ApplicantDetails | null;
  applicantName: string;
  applicantCompany: string;
  agentName: string;
  agentCompany: string;
  resolution: OwnerResolution | null;
  verifications: Verification[];
  pushed: Array<{ email: string; leadId: string | null; role: string; verification?: string }>;
  skippedEmails: Array<{ email: string; reason: string }>;
}

// ── Stage 1: candidates ──────────────────────────────────────────────────────

async function pickCandidates(state: State): Promise<{
  fresh: Candidate[];
  mergedSameSite: Candidate[];
  totalApproved: number;
  tooOld: number;
  alreadySeen: number;
}> {
  const all: Candidate[] = [];
  if (SOURCE === "local" || SOURCE === "both") {
    all.push(...selectApprovedCandidates({ minUnits: MIN_UNITS, minGdv: MIN_GDV }));
  }
  if (SOURCE === "planit" || SOURCE === "both") {
    const records = await fetchPlanItPermitted({ sinceDays: SINCE_DAYS, cachedOnly: PLANIT_CACHED_ONLY, log: (s) => console.log(s) });
    const conv = planItToCandidates(records, { minUnits: MIN_UNITS, minGdv: MIN_GDV });
    const s = conv.stats;
    console.log(`  PlanIt: ${s.records} permitted records → ${conv.candidates.length} finance-size candidates (skipped type ${s.skippedType}, no units ${s.noUnits}, below threshold ${s.belowThreshold}, unmapped area ${s.unmappedArea})`);
    const top = Object.entries(s.unmappedAreas).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `${k} ${v}`).join(", ");
    if (top) console.log(`  PlanIt unmapped areas (no sold data): ${top}`);
    all.push(...conv.candidates);
  }
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - Math.max(MAX_AGE_DAYS, SOURCE === "local" ? 0 : SINCE_DAYS));
  const cutoffIso = toIsoDate(cutoff);

  // Already-processed sites, by key and by reference + postcode (sources name authorities differently).
  const seenRefs = new Set<string>();
  for (const [k, e] of Object.entries(state.processed)) {
    if (RETRY_UNRESOLVED && RETRYABLE.has(e.outcome) && e.emails.length === 0) continue;
    seenRefs.add(k);
    if (e.reference) seenRefs.add(`ref::${e.reference.toLowerCase()}`);
  }

  let tooOld = 0;
  let alreadySeen = 0;
  let major = 0;
  const eligible: Candidate[] = [];
  for (const c of all) {
    if (seenRefs.has(c.key) || seenRefs.has(`ref::${c.app.reference.toLowerCase()}`)) {
      alreadySeen++;
      continue;
    }
    if ((c.units ?? 0) > MAX_UNITS) {
      major++;
      continue;
    }
    if (c.decisionDateIso && c.decisionDateIso < cutoffIso) {
      tooOld++;
      continue;
    }
    eligible.push(c);
  }

  // One outreach target per site: CN01/CN02/VAR applications for the same plot collapse to the best one.
  const deduped = dedupeBySite(eligible);
  const keep = new Set(deduped.map((c) => c.key));
  const mergedSameSite = eligible.filter((c) => !keep.has(c.key));
  if (major) console.log(`  Skipped ${major} major schemes over ${MAX_UNITS} units (see --max-units)`);
  return { fresh: sortCandidates(deduped), mergedSameSite, totalApproved: all.length, tooOld, alreadySeen };
}

// ── Stage 2: applicant details ───────────────────────────────────────────────

async function enrichApplicants(items: WorkItem[]): Promise<void> {
  const needs = items.filter((w) => {
    const url = w.candidate.app.sourceUrl;
    const lacksApplicant = !w.applicantName && !w.applicantCompany;
    return lacksApplicant && (isIdoxDetailUrl(url) || isFastwebDetailUrl(url));
  });
  if (needs.length === 0) return;
  console.log(`  Fetching applicant details for ${needs.length} applications from portal detail pages...`);

  const results = await mapWithHostThrottle(
    needs,
    (w) => w.candidate.app.sourceUrl,
    (w) => fetchApplicantDetails(w.candidate.app.sourceUrl),
    { concurrency: 4, perHostDelayMs: 1500 }
  );

  results.forEach((d, i) => {
    const w = needs[i];
    w.details = d;
    if (d.applicantName) w.applicantName = d.applicantName;
    if (d.agentName && !w.agentName) w.agentName = d.agentName;
    if (d.agentCompany && !w.agentCompany) w.agentCompany = d.agentCompany;
  });

  const filled = results.filter((d) => d.applicantName).length;
  const errors = results.filter((d) => d.error).length;
  console.log(`  Applicant names recovered: ${filled}/${needs.length} (${errors} fetch errors)`);
}

// ── Stage 4: Instantly ───────────────────────────────────────────────────────

async function ensureCampaign(instantly: InstantlyClient): Promise<InstantlyCampaign | null> {
  if (CAMPAIGN_ID_ARG) return instantly.getCampaign(CAMPAIGN_ID_ARG);

  const existing = (await instantly.listCampaigns()).find((c) => c.name.trim().toLowerCase() === CAMPAIGN_NAME.toLowerCase());
  if (existing) return instantly.getCampaign(existing.id);

  const senders = await instantly.listSendingAccounts(SENDER_DOMAINS);
  if (DRY_RUN) {
    console.log(`  [DRY RUN] campaign "${CAMPAIGN_NAME}" does not exist yet; a live run would create it with ${senders.length} sending accounts: ${senders.map((s) => s.email).join(", ")}`);
    return null;
  }
  if (senders.length === 0) {
    throw new Error(`No active Instantly sending accounts match INSTANTLY_SENDER_DOMAINS=${SENDER_DOMAINS.join(",")}`);
  }
  console.log(`  Creating Instantly campaign "${CAMPAIGN_NAME}" with ${senders.length} sending accounts: ${senders.map((s) => s.email).join(", ")}`);
  const created = await instantly.createCampaign({
    name: CAMPAIGN_NAME,
    campaign_schedule: { schedules: buildSchedule() },
    sequences: [{ steps: buildSequence() }],
    email_list: senders.map((s) => s.email),
    daily_limit: Number(process.env.INSTANTLY_DAILY_LIMIT ?? 60),
    stop_on_reply: true,
    stop_on_auto_reply: true,
    link_tracking: false,
    open_tracking: false,
    text_only: true,
    first_email_text_only: true,
    email_gap: 10,
    random_wait_max: 10,
    insert_unsubscribe_header: true,
    prioritize_new_leads: false,
    stop_for_company: true,
  });
  if (process.env.INSTANTLY_AUTO_ACTIVATE === "1") {
    await instantly.activateCampaign(created.id);
    return instantly.getCampaign(created.id);
  }
  return created;
}

// ── Report ───────────────────────────────────────────────────────────────────

interface Funnel {
  approvedFinanceTargets: number;
  alreadyProcessed: number;
  tooOld: number;
  freshCandidates: number;
  processedThisRun: number;
  applicantKnownBefore: number;
  applicantKnownAfter: number;
  ownerCompanyIdentified: number;
  ownerContactWithEmail: number;
  agentContactWithEmail: number;
  leadsPushed: number;
  leadsSkippedDuplicate: number;
  letterRouteOnly: number;
  emailsVerified: number;
  emailsSafe: number;
  emailsCatchAll: number;
  emailsRejected: number;
}

function buildReport(items: WorkItem[], funnel: Funnel, campaign: InstantlyCampaign | null, apollo: ApolloClient | null): string {
  const pct = (n: number, d: number) => (d ? `${Math.round((100 * n) / d)}%` : "n/a");
  const rows: string[] = [];
  rows.push(`# Planning approvals outreach: run ${RUN_ID}`);
  rows.push("");
  rows.push(`Mode: ${DRY_RUN ? "dry run" : NO_PUSH ? "no push" : "live"}${NO_ENRICH ? ", no enrichment" : ""}`);
  if (campaign) {
    rows.push(`Instantly campaign: ${campaign.name} (${campaign.id}), status: ${CAMPAIGN_STATUS_LABEL[campaign.status] ?? campaign.status}, sending accounts: ${(campaign.email_list ?? []).length}`);
    if (campaign.status === 0) rows.push("**Campaign is still a draft. Leads are queued but nothing sends until it is activated in Instantly.**");
  }
  if (apollo) rows.push(`Apollo usage: ${apollo.usage.searches} free searches, ${apollo.usage.enrichments} enrich calls, ~${apollo.usage.creditsUsedEstimate} credits`);
  rows.push(`Email verification: ${funnel.emailsVerified ? `Reoon power mode, ${funnel.emailsVerified} checked` : "not run"}`);
  rows.push("");
  rows.push("## Funnel");
  rows.push("");
  rows.push("| Stage | Count | Rate |");
  rows.push("|---|---:|---:|");
  rows.push(`| Approved finance-size applications in dataset | ${funnel.approvedFinanceTargets} | |`);
  rows.push(`| Already processed in earlier runs | ${funnel.alreadyProcessed} | |`);
  rows.push(`| Decision older than ${MAX_AGE_DAYS} days | ${funnel.tooOld} | |`);
  rows.push(`| Fresh candidates | ${funnel.freshCandidates} | |`);
  rows.push(`| Processed this run (limit ${LIMIT}) | ${funnel.processedThisRun} | |`);
  rows.push(`| Applicant name known from scrape | ${funnel.applicantKnownBefore} | ${pct(funnel.applicantKnownBefore, funnel.processedThisRun)} |`);
  rows.push(`| Applicant name known after detail fetch | ${funnel.applicantKnownAfter} | ${pct(funnel.applicantKnownAfter, funnel.processedThisRun)} |`);
  rows.push(`| Excluded organisations (plc / HA / public body), no lookups | ${items.filter((w) => w.resolution?.outcome === "excluded_organisation").length} | |`);
  rows.push(`| Owner company identified | ${funnel.ownerCompanyIdentified} | ${pct(funnel.ownerCompanyIdentified, funnel.processedThisRun)} |`);
  rows.push(`| Companies House match (number + directors) | ${items.filter((w) => w.resolution?.ownerCompany).length} | |`);
  rows.push(`| Sites widened via director graph | ${items.filter((w) => (w.resolution?.associatedCompanies.length ?? 0) > 0).length} | |`);
  rows.push(`| Owner / director contact with work email | ${funnel.ownerContactWithEmail} | ${pct(funnel.ownerContactWithEmail, funnel.processedThisRun)} |`);
  rows.push(`| Agent contact with work email | ${funnel.agentContactWithEmail} | ${pct(funnel.agentContactWithEmail, funnel.processedThisRun)} |`);
  rows.push(`| Emails verified (Reoon power mode) | ${funnel.emailsVerified} | |`);
  rows.push(`| Verified safe | ${funnel.emailsSafe} | ${pct(funnel.emailsSafe, funnel.emailsVerified)} |`);
  rows.push(`| Catch-all domain (${EXCLUDE_CATCH_ALL ? "excluded" : "sent"}) | ${funnel.emailsCatchAll} | ${pct(funnel.emailsCatchAll, funnel.emailsVerified)} |`);
  rows.push(`| Rejected by verifier | ${funnel.emailsRejected} | ${pct(funnel.emailsRejected, funnel.emailsVerified)} |`);
  rows.push(`| Leads pushed to Instantly | ${funnel.leadsPushed} | ${pct(funnel.leadsPushed, funnel.processedThisRun)} |`);
  rows.push(`| Skipped as duplicate email | ${funnel.leadsSkippedDuplicate} | |`);
  rows.push(`| Owner identified, letter route only | ${funnel.letterRouteOnly} | |`);
  rows.push("");

  const pushed = items.filter((w) => w.pushed.length > 0);
  if (pushed.length) {
    rows.push("## Leads pushed");
    rows.push("");
    rows.push("| Site | Authority | Ref | Units | GDV | Loan | Contact | Role | Confidence | Email check |");
    rows.push("|---|---|---|---:|---:|---:|---|---|---|---|");
    for (const w of pushed) {
      for (const p of w.pushed) {
        const contact = w.resolution?.contacts.find((c) => c.email === p.email);
        rows.push(
          `| ${w.candidate.app.address} | ${w.candidate.localAuthority} | ${w.candidate.app.reference} | ${w.candidate.units ?? ""} | ${formatGBP(w.candidate.gdv)} | ${formatGBP(w.candidate.loanAmount)} | ${contact ? `${contact.firstName} ${contact.lastName}, ${contact.title} (${contact.companyName})` : p.email} | ${p.role} | ${contact?.confidence ?? ""} | ${p.verification ?? ""} |`
        );
      }
    }
    rows.push("");
  }

  const letters = items.filter((w) => w.pushed.length === 0 && w.resolution?.ownerCompany?.registeredOffice);
  if (letters.length) {
    rows.push("## Owner identified, no work email (letter route)");
    rows.push("");
    rows.push("| Site | Ref | Company | Company no. | Registered office | Directors |");
    rows.push("|---|---|---|---|---|---|");
    for (const w of letters) {
      const ch = w.resolution!.ownerCompany!;
      const office = [ch.registeredOffice!.addressLine1, ch.registeredOffice!.addressLine2, ch.registeredOffice!.locality, ch.registeredOffice!.postalCode].filter(Boolean).join(", ");
      rows.push(`| ${w.candidate.app.address} | ${w.candidate.app.reference} | ${ch.companyName} | ${ch.companyNumber} | ${office} | ${ch.directors.map((d) => `${d.firstName} ${d.lastName}`).join("; ")} |`);
    }
    rows.push("");
  }

  const unresolved = items.filter((w) => w.pushed.length === 0 && !w.resolution?.ownerCompany?.registeredOffice);
  if (unresolved.length) {
    rows.push("## Not resolved");
    rows.push("");
    rows.push("| Site | Authority | Ref | Applicant | Agent | Outcome | Notes |");
    rows.push("|---|---|---|---|---|---|---|");
    for (const w of unresolved) {
      rows.push(
        `| ${w.candidate.app.address} | ${w.candidate.localAuthority} | ${w.candidate.app.reference} | ${w.applicantCompany || w.applicantName || ""} | ${w.agentCompany || w.agentName || ""} | ${w.resolution?.outcome ?? "not enriched"} | ${(w.resolution?.notes ?? []).join("; ").replace(/\|/g, "/")} |`
      );
    }
    rows.push("");
  }

  return rows.join("\n");
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(`\nPlanning approvals outreach: run ${RUN_ID}`);
  console.log(`  Mode: ${DRY_RUN ? "DRY RUN" : NO_PUSH ? "NO PUSH" : "LIVE"}${NO_ENRICH ? " (no enrichment)" : ""}`);

  const state = readJsonFile<State>(STATE_PATH, { version: 1, processed: {} });
  const { fresh, mergedSameSite, totalApproved, tooOld, alreadySeen } = await pickCandidates(state);
  console.log(`  Approved finance-size applications: ${totalApproved}; already processed: ${alreadySeen}; older than ${MAX_AGE_DAYS} days: ${tooOld}; same-site duplicates: ${mergedSameSite.length}; fresh sites: ${fresh.length}`);

  if (BOOTSTRAP) {
    const now = new Date().toISOString();
    for (const c of fresh) {
      state.processed[c.key] = {
        firstSeen: now,
        processedAt: now,
        runId: RUN_ID,
        outcome: "bootstrap_skipped",
        emails: [],
        reference: c.app.reference,
        localAuthority: c.localAuthority,
      };
    }
    if (!DRY_RUN) writeJson(STATE_PATH, state);
    console.log(`  Bootstrap: marked ${fresh.length} existing approvals as seen. Next run only picks up new ones.`);
    return;
  }

  const batch = fresh.slice(0, LIMIT);
  const items: WorkItem[] = batch.map((candidate) => ({
    candidate,
    details: null,
    applicantName: candidate.app.applicantName?.trim() ?? "",
    applicantCompany: candidate.app.applicantCompany?.trim() ?? "",
    agentName: candidate.app.agentName?.trim() ?? "",
    agentCompany: candidate.app.agentCompany?.trim() ?? "",
    resolution: null,
    verifications: [],
    pushed: [],
    skippedEmails: [],
  }));
  const applicantKnownBefore = items.filter((w) => w.applicantName || w.applicantCompany).length;

  console.log(`\n[1/4] Applicant details`);
  await enrichApplicants(items);
  const applicantKnownAfter = items.filter((w) => w.applicantName || w.applicantCompany).length;

  // Clients
  const apollo = !NO_ENRICH && process.env.APOLLO_API_KEY ? new ApolloClient(process.env.APOLLO_API_KEY, { maxEnrichmentsPerRun: MAX_ENRICH }) : null;
  const ch = !NO_ENRICH && process.env.COMPANIES_HOUSE_API_KEY ? new CompaniesHouseClient(process.env.COMPANIES_HOUSE_API_KEY) : null;
  if (!NO_ENRICH) {
    if (!apollo) console.log("  APOLLO_API_KEY not set: contact discovery disabled");
    if (!ch) console.log("  COMPANIES_HOUSE_API_KEY not set: individual applicants cannot be linked to their companies");
  }

  console.log(`\n[2/4] Owner resolution${NO_ENRICH ? " (skipped)" : ""}`);
  if (!NO_ENRICH) {
    const resolver = new OwnerResolver(apollo, ch, { includeAgents: INCLUDE_AGENTS, maxContactsPerCompany: 2 });
    let i = 0;
    for (const w of items) {
      i++;
      const label = `${w.candidate.app.reference} ${w.candidate.app.address}`.slice(0, 70);
      process.stdout.write(`  [${i}/${items.length}] ${label.padEnd(72)} `);
      w.resolution = await resolver.resolve({
        applicantName: w.applicantName,
        applicantCompany: w.applicantCompany,
        agentName: w.agentName,
        agentCompany: w.agentCompany,
        sitePostcodeDistrict: postcodeDistrict(w.candidate.app.postcode),
      });
      const emails = w.resolution.contacts.map((c) => `${c.role}:${c.email}`).join(", ");
      console.log(`${w.resolution.outcome}${emails ? ` → ${emails}` : ""}`);
    }
    if (apollo) console.log(`  Apollo: ${apollo.usage.searches} free searches, ${apollo.usage.enrichments} enrich calls (~${apollo.usage.creditsUsedEstimate} credits)`);
  }

  console.log(`\n[3/4] Instantly push${NO_PUSH ? " (skipped)" : ""}`);
  let campaign: InstantlyCampaign | null = null;
  const outreachLog = readJsonFile<OutreachLogEntry[]>(OUTREACH_LOG_PATH, []);
  const alreadyEmailed = new Set(outreachLog.map((e) => e.email.toLowerCase()));
  for (const entry of Object.values(state.processed)) for (const e of entry.emails) alreadyEmailed.add(e.toLowerCase());
  const seenThisRun = new Set<string>();
  let duplicates = 0;

  const reoon = !NO_ENRICH && process.env.REOON_API_KEY ? new ReoonClient(process.env.REOON_API_KEY, { allowCatchAll: !EXCLUDE_CATCH_ALL }) : null;
  if (!NO_ENRICH && !reoon) console.log("  REOON_API_KEY not set: emails will NOT be verified before push");

  if (!NO_ENRICH) {
    const instantly = process.env.INSTANTLY_API_KEY ? new InstantlyClient(process.env.INSTANTLY_API_KEY) : null;
    if (!instantly) {
      console.log("  INSTANTLY_API_KEY not set: cannot push");
    } else {
      try {
        campaign = await ensureCampaign(instantly);
        if (campaign) console.log(`  Campaign: ${campaign.name} (${campaign.id}) status=${CAMPAIGN_STATUS_LABEL[campaign.status] ?? campaign.status}`);
      } catch (err) {
        console.log(`  Campaign lookup/create failed: ${(err as Error).message}`);
      }

      for (const w of items) {
        for (const contact of w.resolution?.contacts ?? []) {
          const email = contact.email.toLowerCase();
          if (!email.includes("@")) continue;
          if (contact.role === "agent" && !INCLUDE_AGENTS) {
            w.skippedEmails.push({ email, reason: "agent (run with --include-agents)" });
            continue;
          }
          if (contact.confidence === "low" && !INCLUDE_LOW_CONFIDENCE) {
            w.skippedEmails.push({ email, reason: "low confidence (run with --include-low-confidence)" });
            continue;
          }
          if (alreadyEmailed.has(email) || seenThisRun.has(email)) {
            duplicates++;
            w.skippedEmails.push({ email, reason: "already contacted" });
            continue;
          }
          seenThisRun.add(email);

          // Verify with Reoon (power mode) before anything reaches Instantly.
          let verificationLabel = "unverified";
          if (reoon) {
            const v = await reoon.verify(email, "power");
            w.verifications.push(v);
            verificationLabel = v.verdict === "send" ? `safe (${v.score ?? "-"})` : v.verdict === "send_catch_all" ? "catch-all" : `rejected: ${v.reason}`;
            if (v.verdict === "reject") {
              w.skippedEmails.push({ email, reason: `verification failed: ${v.reason}` });
              console.log(`  REJECTED ${email}: ${v.reason}`);
              continue;
            }
          }

          if (NO_PUSH || !campaign) {
            w.pushed.push({ email, leadId: null, role: contact.role, verification: verificationLabel });
            console.log(`  ${DRY_RUN ? "[DRY RUN]" : "[NO PUSH]"} ${email} (${verificationLabel}) ← ${w.candidate.app.address}`);
            continue;
          }

          try {
            const lead = await instantly.createLead({
              campaign: campaign.id,
              email,
              first_name: contact.firstName,
              last_name: contact.lastName,
              company_name: contact.companyName,
              website: contact.companyDomain || undefined,
              custom_variables: buildVariables(w.candidate, contact.role),
              skip_if_in_workspace: true,
              skip_if_in_campaign: true,
              // Reoon has already checked the inbox; Instantly's own import check would only add cost.
              verify_leads_on_import: false,
            });
            w.pushed.push({ email, leadId: lead?.id ?? null, role: contact.role, verification: verificationLabel });
            outreachLog.push({
              normalisedName: contact.companyName.toLowerCase(),
              email,
              campaignId: campaign.id,
              pushedAt: new Date().toISOString(),
              instantlyLeadId: lead?.id ?? null,
              planningReference: w.candidate.app.reference,
            });
            console.log(`  pushed ${email} (${verificationLabel}) ← ${w.candidate.app.address}`);
          } catch (err) {
            w.skippedEmails.push({ email, reason: `Instantly error: ${(err as Error).message.slice(0, 120)}` });
            console.log(`  FAILED ${email}: ${(err as Error).message.slice(0, 120)}`);
          }
        }
      }
    }
  }

  console.log(`\n[4/4] Report + state`);
  const funnel: Funnel = {
    approvedFinanceTargets: totalApproved,
    alreadyProcessed: alreadySeen,
    tooOld,
    freshCandidates: fresh.length,
    processedThisRun: items.length,
    applicantKnownBefore,
    applicantKnownAfter,
    ownerCompanyIdentified: items.filter((w) => w.resolution?.ownerCompany || w.resolution?.ownerCompanyName).length,
    ownerContactWithEmail: items.filter((w) => w.resolution?.contacts.some((c) => c.role !== "agent")).length,
    agentContactWithEmail: items.filter((w) => w.resolution?.contacts.some((c) => c.role === "agent")).length,
    leadsPushed: items.reduce((s, w) => s + w.pushed.length, 0),
    leadsSkippedDuplicate: duplicates,
    letterRouteOnly: items.filter((w) => w.pushed.length === 0 && w.resolution?.ownerCompany?.registeredOffice).length,
    emailsVerified: reoon?.usage.verified ?? 0,
    emailsSafe: reoon?.usage.safe ?? 0,
    emailsCatchAll: reoon?.usage.catchAll ?? 0,
    emailsRejected: reoon?.usage.rejected ?? 0,
  };

  fs.mkdirSync(RUN_DIR, { recursive: true });
  writeJson(path.join(RUN_DIR, "report.json"), { runId: RUN_ID, mode: { DRY_RUN, NO_PUSH, NO_ENRICH }, funnel, campaign: campaign ? { id: campaign.id, name: campaign.name, status: campaign.status } : null, apollo: apollo?.usage ?? null });
  fs.writeFileSync(path.join(RUN_DIR, "report.md"), buildReport(items, funnel, campaign, apollo), "utf-8");
  writeJson(
    path.join(RUN_DIR, "candidates.json"),
    items.map((w) => ({
      key: w.candidate.key,
      reference: w.candidate.app.reference,
      localAuthority: w.candidate.localAuthority,
      county: w.candidate.countySlug,
      town: w.candidate.townSlug,
      address: w.candidate.app.address,
      postcode: w.candidate.app.postcode,
      proposal: w.candidate.app.proposal,
      consentStage: w.candidate.consentStage,
      decisionDate: w.candidate.decisionDateIso,
      units: w.candidate.units,
      schemeType: w.candidate.schemeType,
      unitValue: w.candidate.unitValue,
      gdv: w.candidate.gdv,
      ltgdv: w.candidate.ltgdv,
      loanAmount: w.candidate.loanAmount,
      valuationSource: w.candidate.valuationSource,
      sold: w.candidate.sold,
      comparables: w.candidate.comparables,
      stack: w.candidate.stack,
      applicantName: w.applicantName,
      applicantCompany: w.applicantCompany,
      agentName: w.agentName,
      agentCompany: w.agentCompany,
      applicantDetailSource: w.details?.source ?? null,
      resolution: w.resolution,
      verifications: w.verifications.map((v) => ({ email: v.email, verdict: v.verdict, status: v.status, score: v.score, reason: v.reason })),
      pushed: w.pushed,
      skippedEmails: w.skippedEmails,
      planningUrl: w.candidate.app.sourceUrl,
    }))
  );
  writeCsv(
    path.join(RUN_DIR, "leads.csv"),
    items.flatMap((w) =>
      (w.resolution?.contacts ?? []).map((c) => ({
        pushed: w.pushed.some((p) => p.email === c.email) ? "yes" : "no",
        email: c.email,
        emailCheck: w.verifications.find((v) => v.email === c.email)?.status ?? "",
        emailScore: w.verifications.find((v) => v.email === c.email)?.score ?? "",
        firstName: c.firstName,
        lastName: c.lastName,
        title: c.title,
        company: c.companyName,
        role: c.role,
        confidence: c.confidence,
        siteAddress: w.candidate.app.address,
        planningReference: w.candidate.app.reference,
        localAuthority: w.candidate.localAuthority,
        units: w.candidate.units ?? "",
        schemeType: w.candidate.schemeType,
        unitValue: w.candidate.unitValue ?? "",
        gdv: w.candidate.gdv,
        totalCost: w.candidate.stack?.totalCost ?? "",
        senior: w.candidate.loanAmount,
        stretchSenior: w.candidate.stack?.stretchSenior ?? "",
        mezzanine: w.candidate.stack?.mezzanine ?? "",
        totalDebt: w.candidate.stack?.totalDebt ?? "",
        equityWithMezz: w.candidate.stack?.equityWithMezz ?? "",
        soldMedian: w.candidate.sold?.medianPrice ?? "",
        soldCount12m: w.candidate.sold?.transactionCount12m ?? "",
        comparables: w.candidate.comparables.map(formatComparable).join(" | "),
        planningUrl: w.candidate.app.sourceUrl,
      }))
    )
  );
  writeCsv(
    path.join(RUN_DIR, "letters.csv"),
    items
      .filter((w) => w.pushed.length === 0 && w.resolution?.ownerCompany?.registeredOffice)
      .map((w) => {
        const ch = w.resolution!.ownerCompany!;
        const o = ch.registeredOffice!;
        return {
          company: ch.companyName,
          companyNumber: ch.companyNumber,
          directors: ch.directors.map((d) => `${d.firstName} ${d.lastName}`).join("; "),
          addressLine1: o.addressLine1,
          addressLine2: o.addressLine2,
          locality: o.locality,
          region: o.region,
          postcode: o.postalCode,
          siteAddress: w.candidate.app.address,
          planningReference: w.candidate.app.reference,
          localAuthority: w.candidate.localAuthority,
          units: w.candidate.units ?? "",
          gdv: w.candidate.gdv,
          loanAmount: w.candidate.loanAmount,
        };
      })
  );

  if (!DRY_RUN) {
    const now = new Date().toISOString();
    const processedSites = new Set(items.map((w) => siteKey(w.candidate.localAuthority, w.candidate.app.address, w.candidate.app.postcode)));
    for (const c of mergedSameSite) {
      if (!processedSites.has(siteKey(c.localAuthority, c.app.address, c.app.postcode))) continue;
      state.processed[c.key] = {
        firstSeen: now,
        processedAt: now,
        runId: RUN_ID,
        outcome: "merged_same_site",
        emails: [],
        reference: c.app.reference,
        localAuthority: c.localAuthority,
      };
    }
    for (const w of items) {
      state.processed[w.candidate.key] = {
        firstSeen: state.processed[w.candidate.key]?.firstSeen ?? now,
        processedAt: now,
        runId: RUN_ID,
        outcome: w.pushed.length ? (NO_PUSH ? "resolved_not_pushed" : "pushed") : (w.resolution?.outcome ?? "not_enriched"),
        emails: w.pushed.map((p) => p.email),
        reference: w.candidate.app.reference,
        localAuthority: w.candidate.localAuthority,
      };
    }
    writeJson(STATE_PATH, state);
    if (!NO_PUSH) writeJson(OUTREACH_LOG_PATH, outreachLog);
  }

  console.log(`\n  Processed ${items.length} | applicant known ${applicantKnownBefore}→${applicantKnownAfter} | owner company ${funnel.ownerCompanyIdentified} | owner contact ${funnel.ownerContactWithEmail} | pushed ${funnel.leadsPushed} | letters ${funnel.letterRouteOnly}`);
  console.log(`  Report: ${path.join(RUN_DIR, "report.md")}`);
  if (campaign?.status === 0) console.log(`\n  NOTE: campaign "${campaign.name}" is a DRAFT in Instantly. Review the sequence and activate it; leads are already queued.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
