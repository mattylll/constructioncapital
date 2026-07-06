/**
 * Arcus Built Environment Planning Data Scraper
 *
 * Fetches planning applications from UK local authorities that use the
 * "Arcus Built Environment" (Arcus BE) public register — a Salesforce
 * Experience Cloud ("Community") product. Unlike the Idox/FastWeb HTML
 * scrapers, the public page (e.g.
 * https://publicaccess.bracknell-forest.gov.uk/s/register-view?c__r=Arcus_BE_Public_Register)
 * is a Salesforce Aura/LWC single-page app — raw HTML is an empty shell with
 * no data. All real data comes from a guest-accessible, stateless JSON-RPC
 * endpoint at:
 *
 *   POST {baseUrl}{pagePath}/sfsites/aura?r=N&aura.ApexAction.execute=1
 *
 * with `aura.token=null` — confirmed working via bare curl with no
 * cookies/session/CSRF against Bracknell Forest (and four other
 * authorities below) on 2026-07-05, using a real browser session
 * (Playwright) to observe the exact live request/response shapes before
 * writing any of this code. Everything below was verified against real
 * HTTP responses; nothing is guessed from the product's public marketing
 * material.
 *
 * ─── What was verified live (2026-07-05) ──────────────────────────────
 *
 * 1. Page shell HTML (a GET, no auth) embeds two values needed for every
 *    subsequent call, both extractable by regex from the raw HTML body:
 *      - `fwuid` — a per-deployment build hash (appears twice: once
 *        URL-encoded inside a preload `<script src="...l/%7B...%7D/...">`
 *        tag, once as a literal `"fwuid":"..."` inside an inline JSON blob).
 *      - the "loaded" app id, keyed by
 *        `APPLICATION@markup://siteforce:communityApp` (or, on at least one
 *        authority checked — Eastleigh — `siteforce:napiliApp`, which turned
 *        out to be a DIFFERENT, non-Arcus product; see the Eastleigh
 *        registry comment below).
 *    These two values plus a fixed `aura.context` shape (mode, app, loaded,
 *    dn:[], globals:{}, uad:false) are enough to make authenticated-looking
 *    guest calls — no cookie jar, no CSRF token, no session at all.
 *
 * 2. The real Apex action shape (captured from a live browser session, NOT
 *    guessed) is:
 *
 *      classname: "PR_SearchService"   (namespace: "arcuscommunity")
 *      method:    "search"
 *      params:    { request: { registerName, searchType, searchName,
 *                               advancedSearchName?, searchFilters? } }
 *
 *    This differs from the prior research brief in two ways discovered only
 *    by watching real traffic:
 *      - `namespace` MUST be `"arcuscommunity"` — omitting it (as a naive
 *        reading of "classname: PR_SearchService" might suggest) produces
 *        `{"message":"apex://PR_SearchService: No apex action available..."}`.
 *      - the search params are wrapped in an extra `"request"` object, not
 *        passed as flat params.
 *
 * 3. Two searchType values were confirmed live:
 *      - `"quick"` — a free-text `searchTerm` matched broadly across many
 *        fields (including, apparently, internal date-ish fields — a
 *        nonsense term returns 0 rows, but real terms like "extension" or
 *        "Ascot" both returned exactly 250 rows with `thresholdHit:true`,
 *        proving there's a hard 250-row return cap with NO pagination
 *        parameter exposed by this call). Not useful for "last N months".
 *      - `"advanced"` — accepts `searchFilters: [{fieldName,fieldValue,
 *        fieldDeveloperName}]` against a named `advancedSearchName` (e.g.
 *        "PA_ADV_All"). A real date-range filter here DOES work and returns
 *        proportional, correctly-windowed counts (verified: 5-day window →
 *        7 rows, ~5-week window → 118 rows, ~6-month window → capped at the
 *        same 250/thresholdHit:true ceiling). This scraper always uses
 *        `"advanced"` with a date-range filter, split into monthly chunks
 *        (mirroring fetch-planning-idox.ts's monthly-range convention) to
 *        stay under the 250 cap.
 *
 * 4. CRITICAL, verified-the-hard-way finding: the `fieldDeveloperName`
 *    strings for the "from"/"to" date filter are NOT a fixed pair of
 *    constants across authorities — every single one of the 5 confirmed
 *    authorities below uses a DIFFERENT pair:
 *      - Bracknell Forest:  "Validated_Date" / "Validated_Date_To"        → path arcusbuiltenv__Validated_Date__c
 *      - Bromley:           "PA_ADV_DateValidFrom" / "PA_ADV_DateValidTo" → path arcusbuiltenv__Valid_Date__c
 *      - Ashford:           "PA_ADV_DateValid" / "Date_Valid_To"          → path arcusbuiltenv__Valid_Date__c
 *      - Folkestone & Hythe:"PA_ADV_DateValidFrom" / "PA_ADV_DateValidTo" → path arcusbuiltenv__Valid_Date__c
 *      - Haringey:          "PA_ADV_DateValidatedFrom" / "...To"         → path arcusbuiltenv__Valid_Date__c
 *    Hardcoding any one of these (as an early draft of this script did,
 *    copying Bracknell's names to Ashford/Bromley/Folkestone) silently
 *    returns UNFILTERED, oldest-first results — a real bug caught only by
 *    checking a getRegister() call and independently confirming the
 *    returned records' own dates actually fell inside the requested window.
 *    This scraper therefore calls `PR_SearchService.getRegister` ONCE per
 *    authority (cached for the run) and dynamically discovers the correct
 *    from/to field-developer-name pair by:
 *      (a) finding the "Planning_Applications" advancedSearch's own
 *          DeveloperName (the `advancedSearchName` to send back), and
 *      (b) scanning its `arcuscommunity__Fields__r` for a field whose
 *          `arcuscommunity__Path__c` matches a preference-ordered list of
 *          candidate date paths (Validated_Date__c, then Valid_Date__c,
 *          then Received_Date__c), picking the two fields sharing that path
 *          whose MasterLabel text contains "from"/"to" (case-insensitive) —
 *          this label-based from/to detection is required because Ashford's
 *          "from" field is named "PA_ADV_DateValid" with no "From" suffix at
 *          all; only the label ("Date Valid From") disambiguates it.
 *    A results window is ALSO cross-checked client-side against whatever
 *    date value the record itself reports under the discovered path, as a
 *    defence-in-depth measure (mirrors fetch-planning-agile.ts's own
 *    client-side date re-check after a server-side filter it couldn't fully
 *    trust).
 *
 * 5. Detail enrichment: `classname: "PublicRegisterViewService"`,
 *    `method: "getRecordDetails"`, `params: {recordId, registerName}` is
 *    real and returns a `{ objectName, sections: [{ title, fields: [{
 *    label, name, type, value }] }] }` shape (NOT a flat object — the
 *    section layout and field order both vary per authority, so this
 *    scraper parses it generically into a `name → value` map rather than
 *    assuming any fixed section order). This is the only place Applicant
 *    Name, Agent Name, Officer Name, Current Decision Date, Determination
 *    Level, and the external Planning Portal reference live — none of
 *    those appear in the "search" list response, which only carries
 *    Name/Type/Status/Site_Address/Proposal/(validated date)/Current
 *    Decision (text, not date). Multiple `getRecordDetails` calls batch
 *    cleanly into a single Aura POST as multiple `actions[]` entries
 *    (confirmed live with a 3-action batch) — this scraper batches them in
 *    groups of 20 and only enriches applications that already passed
 *    `categorise()` as relevant, to bound the extra HTTP volume.
 *
 * 6. Stable detail-view URL pattern, confirmed by clicking through a real
 *    search result in a browser: `{baseUrl}{pagePath}/detail/{Id}?c__r={registerName}`.
 *
 * 7. No units/GDV fields exist on the object (same as the FastWeb/Agile
 *    scrapers) — `extractUnits`/`estimateGDV` below are copied verbatim and
 *    derive purely from the free-text `arcusbuiltenv__Proposal__c` field.
 *
 * 8. Real Arcus `arcusbuiltenv__Type__c` values are full English phrases,
 *    not idox-style codes (e.g. "Full planning permission", "Householder
 *    planning permission", "Approval of details reserved by a condition",
 *    "Prior approval Part 1 Class A.1(ea): Larger home extension"). These
 *    required genuine new entries in RELEVANT_TYPE_CODES/EXCLUDED_TYPE_CODES
 *    (marked "// Arcus:" below) plus a case-insensitive "prior approval"
 *    normalisation step — the real string uses a lower-case "approval",
 *    which the base (idox-derived) `appType.includes("Prior Approval")`
 *    check would silently miss. This mirrors the exact kind of
 *    case/substring bug fetch-planning-agile.ts found and fixed for its own
 *    source ("Refuse Permission" containing "Permission" not "Consent").
 *    Similarly, real decision text ("Approve", "Approve with Conditions",
 *    "Withdrawn") was checked against writeWebsiteJson's approved/refused/
 *    withdrawn classification — the Agile-fixed version (checking the
 *    decision field for "WITHDRAWN" in addition to status, and computing
 *    refused/withdrawn before approved) already handles every real string
 *    observed here, so it is reused verbatim rather than the older
 *    idox-only version.
 *
 * The processing pipeline (RawApp/ProcessedApp shapes, writeWebsiteJson,
 * categorise, extractUnits, estimateGDV, extractCompany, extractPostcode,
 * loadMedianPrices, the type-code Sets, extractRefTypeCode, parseUnitCount,
 * NUMBER_WORDS, UNIT_TOKEN, NUMBER_TOKEN, MAINTENANCE_PATTERNS,
 * isMaintenanceProposal, FALLBACK_MEDIANS) is copied from
 * fetch-planning-idox.ts (which in turn credits fetch-planning-batch.ts for
 * the original categorisation logic), with the Agile-evolved
 * writeWebsiteJson bug fixes and the Arcus-specific additions called out
 * inline with "// Arcus:" comments.
 *
 * Usage:
 *   npx tsx scripts/fetch-planning-arcus.ts --authority bracknell-forest
 *   npx tsx scripts/fetch-planning-arcus.ts --authority bracknell-forest --months 3
 *   npx tsx scripts/fetch-planning-arcus.ts --all
 *
 * Output:
 *   data/planning-exports/{authority-id}-raw-api-{date}.json    # Raw normalised data
 *   data/generated/planning/{county}/{town}/latest.json          # Website pipeline JSON
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as tls from "tls";
import type { AuthorityTown } from "./planning-authorities";

// ─── Configuration ───────────────────────────────────────────

const MAX_RETRIES = 3;
const DEFAULT_MONTHS = 12;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const THROTTLE_MS = 800; // be respectful — Arcus/Salesforce endpoints are shared infra
const DETAIL_BATCH_SIZE = 20; // getRecordDetails actions batched per Aura POST (confirmed working live)
const REGISTER_NAME = "Arcus_BE_Public_Register"; // confirmed constant across every Arcus BE deployment checked (Bracknell/Ashford/Bromley/Folkestone/Haringey/Wiltshire all use this exact c__r value)

// UK-wide fallback medians when local sold data is unavailable
// (copied verbatim from fetch-planning-idox.ts)
const FALLBACK_MEDIANS: Record<string, number> = {
  detached: 450000,
  semi_detached: 290000,
  terraced: 245000,
  flat: 230000,
  blended: 295000,
};

// ─── Arcus Authority Types ────────────────────────────────────

interface ArcusAuthority {
  /** Short unique identifier, e.g. "bracknell-forest" */
  id: string;
  /** Full council name */
  name: string;
  /** Portal base URL (no trailing slash), e.g. "https://publicaccess.bracknell-forest.gov.uk" */
  baseUrl: string;
  /**
   * Path prefix before "/sfsites/aura" and before the register-view page.
   * Confirmed to vary: Bracknell Forest uses "/s", Ashford/Bromley use
   * "/pr/s", Folkestone & Hythe uses "/PR3/s" (capital PR3 — a distinct
   * Experience Cloud site on the same org, confirmed live).
   */
  pagePath: string;
  /** Which towns in our site this authority covers */
  towns: AuthorityTown[];
  /** Whether this authority is enabled for fetching */
  enabled: boolean;
}

// ─── Arcus Authority Registry ─────────────────────────────────
//
// Every authority below was checked live: fetched the real page shell,
// extracted fwuid/appId by regex, and made a real POST against
// {baseUrl}{pagePath}/sfsites/aura. `enabled: true` means that round trip
// returned real application records (not a guess). `enabled: false` means
// either the platform doesn't match (confirmed different product) or a
// real error was returned (e.g. access denied) — never a guess.

const ARCUS_AUTHORITIES: ArcusAuthority[] = [
  {
    id: "bracknell-forest",
    name: "Bracknell Forest Council",
    baseUrl: "https://publicaccess.bracknell-forest.gov.uk",
    pagePath: "/s",
    towns: [{ townSlug: "bracknell", countySlug: "berkshire" }],
    enabled: true, // Primary confirmed authority — full live round trip verified 2026-07-05, see file header.
  },
  {
    id: "reading",
    name: "Reading Borough Council",
    baseUrl: "https://publicregister.reading.gov.uk",
    pagePath: "/pr/s",
    towns: [{ townSlug: "reading", countySlug: "berkshire" }],
    enabled: true, // Migrated off FastWeb to Arcus — confirmed live 2026-07-06, 344 real applications scraped. See fetch-planning-fastweb.ts's now-disabled "reading" entry.
  },
  {
    id: "ashford",
    name: "Ashford Borough Council",
    baseUrl: "https://abcportal.ashford.gov.uk",
    pagePath: "/pr/s",
    towns: [{ townSlug: "ashford", countySlug: "kent" }],
    enabled: true, // Confirmed live 2026-07-05: getRegister + advanced search with discovered date fields returned real applications (e.g. ref "PA/2026/1125").
  },
  {
    id: "bromley",
    name: "London Borough of Bromley",
    baseUrl: "https://planningaccess.bromley.gov.uk",
    pagePath: "/pr/s",
    towns: [{ townSlug: "bromley", countySlug: "greater-london" }],
    enabled: true, // Confirmed live 2026-07-05. NOTE: fetch-planning-idox.ts has no Bromley entry at all (checked — not a migration/duplicate case), so no cross-file edit was needed.
  },
  {
    id: "folkestone-hythe",
    name: "Folkestone & Hythe District Council",
    baseUrl: "https://folkestonehythedc.my.site.com",
    pagePath: "/PR3/s",
    towns: [{ townSlug: "folkestone", countySlug: "kent" }],
    enabled: true, // Confirmed live 2026-07-05 (e.g. ref "26/1029/FH"). Real page slug is "be-register-view", not "register-view" — the pagePath/aura endpoint is unaffected since it's independent of the page slug.
  },
  {
    id: "haringey",
    name: "Haringey Council",
    baseUrl: "https://publicregister.haringey.gov.uk",
    pagePath: "/pr/s",
    // Haringey borough has no dedicated "haringey" town in uk-locations-data.ts;
    // Tottenham (real town entry, greater-london) sits within the borough and
    // is the closest existing site town, so applications are attributed there.
    towns: [{ townSlug: "tottenham", countySlug: "greater-london" }],
    enabled: true, // Confirmed live 2026-07-05 (e.g. ref "HGY/2026/1870") once the correct discovered field names (PA_ADV_DateValidatedFrom/To) were used — an earlier attempt with Bracknell's field names silently returned unfiltered 1970s-era records.
  },
  {
    id: "wiltshire",
    name: "Wiltshire Council",
    baseUrl: "https://development.wiltshire.gov.uk",
    pagePath: "/pr/s",
    towns: [
      { townSlug: "salisbury", countySlug: "wiltshire" },
      { townSlug: "chippenham", countySlug: "wiltshire" },
      { townSlug: "trowbridge", countySlug: "wiltshire" },
      { townSlug: "devizes", countySlug: "wiltshire" },
    ],
    // TODO: verify further. Platform confirmed live (Arcus BE, shares Bracknell/
    // Haringey's fwuid build), and getRegister() succeeds, but the guest user
    // profile is NOT granted access to PR_SearchService.search itself — a real
    // POST returns {"message":"You do not have access to the Apex class named
    // 'PR_SearchService'."}. This is an org-level permission gate, not a
    // shape/guess problem. Disabled until Wiltshire's guest profile (or an
    // alternative confirmed-working method) is found to allow search calls.
    // No legacy Idox/Northgate entry exists for Wiltshire in
    // fetch-planning-idox.ts (only "swindon", a separate unitary authority),
    // so this is not a migration/duplicate case.
    enabled: false,
  },
  {
    id: "worcester",
    name: "Worcester City Council",
    baseUrl: "https://plan.worcester.gov.uk",
    pagePath: "/s",
    towns: [{ townSlug: "worcester", countySlug: "worcestershire" }],
    // TODO: NOT Arcus. Confirmed live 2026-07-05: plan.worcester.gov.uk serves a
    // small (~12KB) classic server-rendered "Quick Search"/"Advanced Search"
    // HTML page with no fwuid/Aura/Salesforce markers at all — a different
    // (likely Civica-family) portal product entirely. Left here disabled for
    // documentation only; would need a completely different scraper, out of
    // scope for this Arcus-specific script.
    enabled: false,
  },
  {
    id: "wychavon",
    name: "Wychavon District Council",
    baseUrl: "https://plan.wychavon.gov.uk",
    pagePath: "/s",
    // Wychavon is a district covering Evesham, Droitwich, Pershore etc. Both
    // Evesham and Droitwich exist as real towns in uk-locations-data.ts
    // (countySlug worcestershire); Pershore does not.
    towns: [
      { townSlug: "evesham", countySlug: "worcestershire" },
      { townSlug: "droitwich", countySlug: "worcestershire" },
    ],
    // TODO: NOT Arcus. Same finding as Worcester above — plan.wychavon.gov.uk
    // is a small classic "Quick Search"/"Advanced Search" HTML page (~17KB,
    // separate "/Search/Advanced" path), no Salesforce/Aura markers. Disabled;
    // out of scope for this scraper.
    enabled: false,
  },
  {
    id: "westmorland-furness",
    name: "Westmorland and Furness Council",
    baseUrl: "https://planningregister.westmorlandandfurness.gov.uk",
    pagePath: "/s",
    // fetch-planning-fastweb.ts has disabled "south-lakeland"/"eden" entries
    // (towns kendal/cumbria, penrith/cumbria) noting both legacy FastWeb hosts
    // 301-redirect to this exact unified westmorlandandfurness.gov.uk portal.
    // Recorded here so the same towns aren't silently dropped if this authority
    // is enabled later; NOT double-registered anywhere else right now since
    // this entry stays disabled.
    towns: [
      { townSlug: "kendal", countySlug: "cumbria" },
      { townSlug: "penrith", countySlug: "cumbria" },
    ],
    // TODO: UNVERIFIED. planningregister.westmorlandandfurness.gov.uk resolves
    // (200), but the page served ("Quick Search | Westmorland & Furness
    // Council", ~20KB, a form posting to "/Search/SiteResults") looks like the
    // council's general site search, not a dedicated planning register, and
    // has no Salesforce/Aura markers. Either this host isn't the real planning
    // portal, or the real register lives at an undiscovered path. Left
    // disabled — do not guess a working state.
    enabled: false,
  },
  {
    id: "eastleigh",
    name: "Eastleigh Borough Council",
    baseUrl: "https://planning.eastleigh.gov.uk",
    pagePath: "/s",
    towns: [{ townSlug: "eastleigh", countySlug: "hampshire" }],
    // TODO: NOT the standard Arcus BE community app used elsewhere in this
    // file. Confirmed live 2026-07-05: planning.eastleigh.gov.uk/s/ IS a
    // Salesforce Experience Cloud site (matches fetch-planning-fastweb.ts's
    // comment that Eastleigh migrated off FastWeb to "a Salesforce portal"),
    // and its underlying data model even uses an Arcus-provisioned object
    // (arcusbuilt__PApplication__c — note the older/different namespace
    // "arcusbuilt" vs "arcusbuiltenv" seen everywhere else in this file).
    // BUT the actual search call it makes is a bespoke custom Apex controller
    // — apex://LCPublicRegCont/ACTION$testSOQLSearch, taking a raw
    // client-supplied jsonInput/jsonWhereClause pair — NOT
    // arcuscommunity.PR_SearchService.search. This is a different, one-off
    // front-end built by/for Eastleigh on top of Arcus-shaped data, not the
    // standard Arcus BE public register component this scraper targets.
    // Left disabled; would need its own bespoke scraper, out of scope here.
    enabled: false,
  },
];

// ─── Lookup Helpers ──────────────────────────────────────────

function getArcusAuthority(id: string): ArcusAuthority | undefined {
  return ARCUS_AUTHORITIES.find((a) => a.id === id);
}

function getEnabledArcusAuthorities(): ArcusAuthority[] {
  return ARCUS_AUTHORITIES.filter((a) => a.enabled);
}

// ─── Canonical Types (copied verbatim from fetch-planning-idox.ts) ───

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
  postcode?: string;
  _authority_id?: string;
  _base_url?: string;
  [key: string]: string | undefined;
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

// ─── Helpers (copied verbatim from fetch-planning-idox.ts) ───────────

function formatDateDDMMYYYY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  
return `${dd}/${mm}/${yyyy}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function extractPostcode(address: string): string {
  const match = address.match(/([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})/i);
  
return match ? match[1].toUpperCase().replace(/\s+/, " ") : "";
}

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const UNIT_TOKEN =
  "(?:dwelling|dwellings|unit|units|home|homes|house|houses|apartment|apartments|flat|flats|maisonette|maisonettes|bungalow|bungalows)";
const NUMBER_TOKEN =
  "(?:\\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)";

function parseUnitCount(raw: string): number | null {
  const value = raw.toLowerCase().replace(/-/g, " ").trim();
  const numeric = Number.parseInt(value, 10);
  if (Number.isFinite(numeric) && numeric > 0 && numeric < 500) return numeric;

  const total = value
    .split(/\s+/)
    .filter(Boolean)
    .reduce((sum, part) => sum + (NUMBER_WORDS[part] ?? 0), 0);
  
return total > 0 && total < 500 ? total : null;
}

function extractUnits(proposal: string): number | null {
  const p = proposal.toLowerCase().replace(/\bno\./g, "no").replace(/\s+/g, " ");
  const hasResidentialSignal = /\b(dwelling|flat|apartment|residential|house|home|bungalow|maisonette)\b/i.test(p);
  const hasEquipmentSignal = /\b(antenna|telecom|telecommunications|radio\s+unit|remote\s+radio|transmission\s+dish|base\s+station|mast|cabinet|plant|condenser|generator)\b/i.test(p);
  if (hasEquipmentSignal && !hasResidentialSignal) return null;

  const patterns = [
    new RegExp(`\\b(${NUMBER_TOKEN})\\s*(?:no\\s*)?(?:residential\\s+)?${UNIT_TOKEN}\\b`, "i"),
    new RegExp(`\\b(${NUMBER_TOKEN})\\s*(?:x|no)\\s*(?:[a-z\\s-]+\\s+)?${UNIT_TOKEN}\\b`, "i"),
    new RegExp(`\\b(?:erection|construction|development|provision|creation|formation)\\s+of\\s+(${NUMBER_TOKEN})\\s+(?:[a-z\\s-]+\\s+)?${UNIT_TOKEN}\\b`, "i"),
    new RegExp(`\\b(?:into|to\\s+form|to\\s+create|providing|provide)\\s+(${NUMBER_TOKEN})\\s+(?:[a-z\\s-]+\\s+)?${UNIT_TOKEN}\\b`, "i"),
    new RegExp(`\\b(${NUMBER_TOKEN})\\s*(?:bed\\s*)?(?:room\\s*)?${UNIT_TOKEN}\\b`, "i"),
  ];
  for (const pattern of patterns) {
    const match = p.match(pattern);
    const units = match ? parseUnitCount(match[1]) : null;
    if (units) return units;
  }
  if (p.includes("single dwelling") || p.includes("1 dwelling") || p.includes("one dwelling")) return 1;
  if (
    (p.includes("change of use") || p.includes("conversion")) &&
    (p.includes("dwelling") || p.includes("residential")) &&
    !new RegExp(`\\b${NUMBER_TOKEN}\\s+${UNIT_TOKEN}\\b`, "i").test(p)
  ) {
    return 1;
  }
  
return null;
}

function estimateGDV(
  proposal: string,
  units: number | null,
  medians: Record<string, number>
): number | null {
  if (!units || units === 0) return null;
  const p = proposal.toLowerCase();
  if (p.includes("flat") || p.includes("apartment") || p.includes("maisonette")) return units * medians.flat;
  if (p.includes("detached") && !p.includes("semi")) return units * medians.detached;
  if (p.includes("semi-detached") || p.includes("semi detached")) return units * medians.semi_detached;
  if (p.includes("terraced") || p.includes("terrace") || p.includes("townhouse")) return units * medians.terraced;
  
return units * medians.blended;
}

function extractCompany(nameField: string): { name: string; company: string } {
  if (!nameField) return { name: "", company: "" };
  const bracketMatch = nameField.match(/^(.+?)\s*\((.+?)\)\s*$/);
  if (bracketMatch) {
    return { name: bracketMatch[1].trim(), company: bracketMatch[2].trim() };
  }
  const companyPattern =
    /\b(ltd|limited|llp|plc|inc|corp|group|holdings|partners|partnership|developments|properties|homes|construction|building|estates)\b/i;
  if (companyPattern.test(nameField)) {
    return { name: nameField.trim(), company: nameField.trim() };
  }
  
return { name: nameField.trim(), company: "" };
}

// ─── Application Type Classification ─────────────────────────
// (Copied from fetch-planning-idox.ts, which itself credits
// fetch-planning-batch.ts for the original categorisation logic.
// Arcus-specific additions below are marked "// Arcus:" and were derived
// from real live API responses for Bracknell Forest, Ashford, Bromley,
// Folkestone & Hythe and Haringey on 2026-07-05 — not guessed.)

const RELEVANT_TYPE_CODES = new Set([
  "(Large Scale Major) Dwellings",
  "(Large Scale Major) All Other Developments",
  "(Large Scale Major) General Industry/Storage/Warehousing",
  "(Large Scale Major) Offices R & D Light Industry",
  "(Large Scale Major) Retail, Distribution & Servicing",
  "Smale Scale Major - Dwellings",
  "Small Scale Major - All Other Developments",
  "Small Scale Major - General Industry/Storage/Warehousing",
  "Small Scale Major - Offices R&D Light Industry",
  "Small Scale Major - Retail Distribution & Servicing",
  "(Minor) Dwellings",
  "(Minor) All Other Developments",
  "(Minor) Offices R&D Light Industry",
  "(Minor) Retail Distribution & Servicing",
  "(Minor) General Industry/Storage/Warehousing",
  "Minor Commercial Development",
  "Change of Use",
  "Other - Change of use",
  "Prior Approval - Office to residential",
  "Prior Approval - Industrial to residential",
  "Prior approval - Retail to residential or mix",
  "Prior approval - agriculture to residential",
  "Prior Approval - Agriculture to range of uses",
  "Prior Approval - Demolition",
  "Prior Approval - Determination",
  "Permission in Principle",
  "Conservation Area",
  "Listed Buildings Applications",
  "Demolish Listed Building",
  "Full Planning Application (pre-2009)",
  "Full Planning application pre-2000",
  "Dwellings (pre-2009)",
  "Major Development (pre-2009)",
  "Minor Development (pre-2009)",
  "MIND", "MOR", "MORI", "SSM", "SMG", "LSM", "LSA", "LMG", "LRD",
  "MGT", "MPI", "COU", "PIP", "NAC", "PAOR", "PAAR", "PARR", "PAAF",
  "DEM", "LBB", "EIA", "SCR", "EXE", "ENF",
  "FUL", "OUT", "VAR", "REM", "CPL", "CPE", "LBC", "PDE", "AGR", "CND",
  "COND", "MPO", "OHL", "CPO", "LDP",
  "P3OPA", "P3RPA", "P3MPA", "P3PPA",
  "S73", "CUPAMA", "CUPAQ", "CUPAR", "PRIOR", "SUPA", "AG", "MOD106",
  "Full", "Change of Use", "Outline", "Reserved Matters", "Listed Building",
  "Prior Approval", "Reg3or4 or NCC or EE", "Proposed Use", "Permitted Dev Extn",
  "Lawful/Establish.Use", "S.73 app - full", "S.73 app - outline", "S.73 app - CoU",
  "Perm' in Principle", "Local Develop't Orde",
  "Full Application", "Full Planning", "Outline Application",
  "Reserved Matters Application", "Variation of Condition", "Removal of Condition",
  "Listed Building Consent", "Certificate of Lawfulness",
  "Full Planning Application", "Outline Planning Application",
  "Major Full", "Major Outline", "Major Reserved Matters",
  "Major Remove / Vary condition", "Reserved Matter Application",
  "Application to Remove / Vary a Condition",
  "Application submitted under Section 73 of the Act",
  "Listed Building Consent - Extensions / Alterations",
  "Conservation Area Consent",
  "Full General Regulations submitted by ADC under Regulation 3",
  "Demolition Prior Notification", "Demolition Determination",
  "Applications sumbitted by Nottinghamshire County Council under Regulation 3",
  "Modify/Remove Section 106 Agreement",
  "Applications submitted under Private Acts",
  // Idox ref codes (Reigate, Epsom, etc.)
  "F", "CU", "RET", "AGD", "DED", "CONLA", "VS106",
  "LBA", // Listed Building Application (Epsom)
  "PDEAD", "PDCOU", "PDEAB", // PD variants
  "S106A", // S106 agreement
  "REMF", // Reserved Matters variant
  // Greenwich codes
  "L", // Listed Building (Greenwich)
  "I106", // S106 (Greenwich)
  "PN1", // Prior Notification (Greenwich)
  // Croydon codes
  "GPDO", // General Permitted Development Order
  "PDO", // Prior Determination Order
  "AUT", // Authority's own application
  "PAD", // Prior Approval Demolition
  "PA8", // Prior Approval Class 8
  // Ealing codes (NNNNNNTYPE format)
  "PALHE", // Prior Approval Large Home Extension
  "PACBSD", // Prior Approval Commercial to Small Dwelling
  "PACEC", // Prior Approval Class EC
  "FULR", // Full Retrospective
  "OPDLDE", "OPDLDC", // OPDC applications
  // Arcus: confirmed live arcusbuiltenv__Type__c values (Bracknell Forest,
  // Ashford, Bromley, Folkestone & Hythe, Haringey, 2026-07-05)
  "Full planning permission", // synonym of "Full Planning Application"
  "Removal/variation of conditions", // synonym of "Variation of Condition"
  "Approval of reserved matters", // synonym of "Reserved Matters Application"
  "Listed building consent (Alt/Ext)", // synonym of "Listed Building Consent"
  // Arcus: confirmed live arcusbuiltenv__Type__c values (Ashford, 2026-07-05)
  "Change of use", // lower-case "use" — the base idox-derived set only has "Change of Use" (capital U), a case-sensitive Set.has() miss that would otherwise silently drop every real Ashford change-of-use application to "unclassified"
  "Outline planning permission: Some matters reserved", // synonym of "Outline Planning Application"
  // Arcus: confirmed live arcusbuiltenv__Type__c values (Folkestone & Hythe,
  // 2026-07-05) — different capitalisation than the Bracknell/Ashford/Bromley
  // variants already above (Set membership is case-sensitive, so each real
  // casing variant needs its own entry rather than assuming one covers all)
  "Full Planning Permission", // capital P in "Permission" — Folkestone's own casing of "Full planning permission" above
  "Listed Building Consent (Alt/Ext)", // capital B in "Building" — Folkestone's own casing of "Listed building consent (Alt/Ext)" above
  "PA - Offices to dwellings", // Folkestone's own short-form label for a Class O (offices-to-residential) prior approval, synonym of "Prior Approval - Office to residential" already in the base set
]);

const EXCLUDED_TYPE_CODES = new Set([
  "Tree works in conservation area",
  "Tree works to TPO trees(s)",
  "Planning Portal Tree Submission",
  "Advert", "Advert (pre-2009)",
  "Householder",
  "Prior Notification Householder",
  "Certificate of Lawfulness - (proposed)",
  "Certificate of Lawfulness (existing)",
  "Certificate of Lawfulness (existing) (pre-2009)",
  "Certificate of Lawfulness (Proposed) (pre-2009)",
  "Discharge of Condition",
  "Non Materials Amendment",
  "EIA - SCOPING OPINION", "EIA - SCREENING OPINION",
  "Awaiting Validation", "Incomplete", "Invalid",
  "Withdrawn", "Withdrawn (pre-2009)",
  "Notifications", "Notifications (pre-2009)",
  "Pre-app",
  "Neighbouring Local Authority Consultation",
  "Section 53 Determination", "Established Use",
  "Hazardous Substance Consent",
  "Prior Approval - Telecommunications (pre-2009)",
  "Prior Approval - Agricultural Buildings (pre-2009)",
  "Prior approval - solar panels to non-domestic building",
  "Prior approval - shops to restaurant and cafe",
  "Prior Approval - to state school or nursery",
  "Agricultural Building", "Enforcement",
  "Environmental Impact Assessment",
  "PAV", "County Council", "planning portal submissions",
  "HSE", "TCA", "TPO", "T", "W", "CON", "CLP", "CEX", "MAL", "NMA",
  "NCS", "ADV", "INC", "INV", "AVA", "PPOR", "TELC", "PASP", "PAO",
  "AGB", "HCC", "S106",
  "HOUS", "DISCON", "DCOND", "PREAPP", "BBREG5", "TEREG5",
  "TCONSV", "STCA", "SPREAP",
  "Full Plans", "LB Consent", "Discharg", "TREES", "TEL", "WPD",
  "SCREEN", "HEDG", "PCAMS", "SADV",
  "Non-Material Change", "Advertisement", "WAS", "APNB", "APNW",
  "Condition Discharge", "Works to TPO trees", "Pre-App Enquiry",
  "Telecoms 28 day not.", "Telecom 14 day enq", "Trees in Con.Area",
  "Non Material Amendm'", "EIA Screening",
  "Obligation/106 Det.", "Planning Perform' Ag", "s106 Deed of Varia'n",
  "Determination 56", "Certified Location",
  "Building Control", "Local Land Charges", "Housing Assistance",
  "Complaint", "High Hedges", "Trees & Landscaping",
  "Householder Application", "Tree Preservation Order",
  "Trees in Conservation Area", "Discharge of Conditions",
  "Non-Material Amendment", "Pre-Application", "Pre-Application Advice",
  "Telecommunications", "Advertisement Consent",
  "Advertisement Application",
  "Application to undertake work on a tree protected by a Tree Preservation Order",
  "Application to undertake work on Trees in a Conservation Area",
  "Certificate of Lawfulness - Proposed Use/Development",
  "Certificate of Lawfulness - Existing Use/Development",
  "Telecommunication Prior Notification",
  "Telecommunications - Determination 42 Days",
  "Telecommunications - Determination 28 Days",
  "Agricultural Prior Notification Application",
  "Agricultrual Determination Application",
  "County Matter", "Hedgerow Removal notices",
  "Screening / Scoping Opinions",
  "Submission in Complaince with a Condition",
  "Consultations on applications submitted by ADC under Regulation 4",
  "CD", "RG", "PA", "BD", "DM", "SF", "Q",
  "EXT", "CB", "FSR", "MEXT",
  "PACU", "PATE", "PAOT", "PAAD",
  // Idox ref codes (Reigate, Epsom, etc.)
  "HHOLD", "CAN", "CLP", "CLE", "BNG", "TED", "HRN",
  "FLH", "FLHF", // Full Householder
  "COND", // Discharge of Conditions
  "NMA", // Non-Material Amendment
  "CNA", // Conservation area notification
  "NOTTE", // Notification
  "CMA", // Conservation Minor Application
  "CLPF", // Certificate Lawfulness Proposed (variant)
  "T56", // Telecoms
  "ELC", // Electricity
  "SCR", // Screening opinion
  // Greenwich codes
  "SD", // Submission of Details (discharge of conditions)
  "HD", // Householder Development
  "CP", // Certificate of Lawfulness Proposed
  "TC", // Tree in Conservation Area
  "A", // Advertisement
  "MA", // Minor Amendment
  "CE", // Certificate Existing
  "TELN", // Telecoms notification (Brent)
  "K", // Consultation by other borough (Greenwich)
  "G", // Development by Govt Dept (Greenwich)
  "H", // Hazardous substances (Greenwich)
  "CLPL", // Cert of Lawfulness for Listed Bldg (Greenwich)
  "AEA", // Additional Environmental Approval (Greenwich)
  "BGP", // Biodiversity Gain Plan (Greenwich)
  "CAAD", // Cert of Appropriate Alt Development (Greenwich)
  "D1", // Demolition Prior Approval Required (Greenwich) — not residential
  "PN6", // Agricultural/Forestry (Greenwich)
  "PN7", // Demolition notification (Greenwich)
  // Croydon codes
  "DISC", // Discharge of conditions
  "LP", // Lawful Development Proposed
  "TRE", // Trees
  "LE", // Lawful Existing
  "CONR", // Conservation area (non-residential)
  "PRE", // Pre-application
  "TR5", // Trees
  // Ealing codes (NNNNNNTYPE format)
  "PTC", // Planning Telecoms Consultation
  "PTT", // Planning Tree TPO
  "FTT", // Trees
  "OPDCOB", // Old Oak Park Dev Corp Observation
  "OPDCND", // OPDC conditions
  "CONS", // Conservation area
  "CNDR", // Conditions variant
  "CPLR", // Cert lawfulness proposed retrospective
  "DV", // Deed of Variation
  "HS", // Householder variant
  // Arcus: confirmed live arcusbuiltenv__Type__c values (Bracknell Forest,
  // Ashford, Bromley, Folkestone & Hythe, Haringey, 2026-07-05)
  "Approval of details reserved by a condition", // discharge-of-condition equivalent
  "Householder planning permission", // synonym of "Householder"
  "Lawful development: Proposed use", // synonym of Certificate of Lawfulness (proposed)
  "Consent to display an advertisement", // synonym of "Advert"
  "Adjoining Authority Consultation", // synonym of "Neighbouring Local Authority Consultation"
  "Tree Work Application (TRTPO Application)", // tree work — categorised as "trees" via appType.includes("Tree") below
  "Tree 5 Day Notification (TR5 Application)", // tree notification
  "Consent under Tree Preservation Orders", // TPO consent
  // Arcus: confirmed live arcusbuiltenv__Type__c values (Ashford, 2026-07-05)
  "Discharge of Condition(s)", // Ashford's own phrasing of "Discharge of Condition" — added explicitly (not just left to fall through to "unclassified") so a discharge application whose proposal text happens to mention a unit count from the ORIGINAL permission isn't misread as a new relevant scheme
  "Lawful development: Existing use", // symmetric with "Lawful development: Proposed use" above — same reasoning
  "Tree Preservation Order - works related",
  "Notification of proposed works to trees in a conservation area", // lower-case "trees" — doesn't match the generic appType.includes("Tree") branch, so needs an explicit entry
  "Trees subject to a TPO - Dead or Dangerous",
  "Trees in a Conservation Area - Dead or Dangerous",
  // Arcus: confirmed live arcusbuiltenv__Type__c values (Folkestone & Hythe, 2026-07-05)
  "Works to Trees in a conservation area", // note lower-case "conservation area"
  "Works to Trees covered by a TPO",
  "Extension notification", // householder-scale, no new units
  "Agricultural notification",
  "Other authority consultations",
  "Screening Opinion - TCPA EIA 2006",
]);

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
  const hasDevelopmentSignal = /\b(dwelling|unit|flat|apartment|residential|house|home|conversion|change\s+of\s+use|new\s+build|erection)\b/i.test(p);
  if (!hasDevelopmentSignal && /\b(solar|photovoltaic|pv\s+panel|heat\s+pump|air\s+source|ev\s+charg|battery\s+storage)\b/i.test(p)) {
    return true;
  }
  if (p.length < 60 && !p.match(/dwelling|unit|flat|apartment|residential|house|home/)) {
    if (MAINTENANCE_PATTERNS.some((pat) => pat.test(p))) return true;
  }
  if (p.includes("like for like") || p.includes("like-for-like")) return true;
  
return false;
}

// Ref codes that indicate relevant application types
const RELEVANT_REF_CODES = new Set([
  "FUL", "OUT", "REM", "S73", "PIP", "DEM", "LBC",
  "CUPAMA", "CUPAQ", "CUPAR", "PRIOR", "SUPA", "AG", "MOD106",
  "PDE", "VAR", "CPL", "CPE",
  "F", "CU", "RET", "AGD", "DED", "CONLA",
  "VS106",
]);

// Ref codes that indicate excluded application types
const EXCLUDED_REF_CODES = new Set([
  "PE", "PEPD", "TELPE", "DOC", "DD", "TPO", "CAT",
  "CLOPUD", "CLEUD", "NMAT", "ADV", "HHPA", "HHPAA",
  "OBS3", "OBS4", "REQ", "CM", "EIASO", "COD", "EB",
  "PROW", "S19", "TEL56", "CHL",
  "ENF", "ENFB", "ENFT1", "ENFT2", "ENFT3", "ENFC", "ENFA",
  "ADVREF", "TPOREF", "NONDET", "REFUSE", "HH", "S195",
  "HOUS", "HSE", "HHOLD",
  "CAN", "CLP", "CLE", "CON", "BNG", "TED",
  "SCOPE", "SCREEN", "HRN",
]);

// Broad app_type values that need ref-based sub-classification
const BROAD_APP_TYPES = new Set([
  "Development Management",
  "Appeal",
  "Enforcement",
]);

function extractRefTypeCode(refNo: string): string | null {
  // Format 1: "YY/NNNNN/TYPE" (e.g., "25/00187/FUL")
  const m1 = refNo.match(/\d+\/\d+\/(\w+)/);
  if (m1) return m1[1].toUpperCase();

  // Format 2: "NNNNNNTYPE" (e.g., "251683HH", "251936CND") — Ealing style
  const m2 = refNo.match(/^\d{5,7}([A-Z]{2,})/i);
  if (m2) return m2[1].toUpperCase();

  // Format 3: "YY/NNNN" (e.g., "25/1288") — Brent style, no type
  return null;
}

function categorise(app: RawApp): { category: string; isRelevant: boolean; reason: string } {
  let appType = app.app_type || "";
  const proposal = (app.proposal || "").toLowerCase();

  // Arcus: normalise any "Prior approval …" phrasing (real observed values
  // use a LOWER-CASE "approval", e.g. "Prior approval Part 1 Class
  // A.1(ea): Larger home extension" — the base idox-derived
  // `appType.includes("Prior Approval")` check further below is
  // case-sensitive and would silently miss every real Arcus prior-approval
  // record without this normalisation. Mirrors the equivalent fix in
  // fetch-planning-agile.ts.
  if (/prior approval/i.test(appType)) {
    appType = "Prior Approval";
  }

  // For councils with broad app_type or empty, extract type from reference
  if (BROAD_APP_TYPES.has(appType) || appType === "") {
    const refCode = extractRefTypeCode(app.ref_no || "");
    if (refCode) {
      // Pattern-based exclusions (DET01-DET99, NMAMD1-9, etc.)
      if (/^DET\d/.test(refCode)) return { category: "excluded", isRelevant: false, reason: `Discharge of condition: ${refCode}` };
      if (/^NMAMD/.test(refCode)) return { category: "excluded", isRelevant: false, reason: `Non-material amendment: ${refCode}` };

      if (EXCLUDED_REF_CODES.has(refCode)) {
        if (refCode === "TPO" || refCode === "CAT") return { category: "trees", isRelevant: false, reason: `Ref type: ${refCode}` };
        if (refCode === "ADV") return { category: "advertisement", isRelevant: false, reason: `Ref type: ${refCode}` };
        if (refCode === "HHPA" || refCode === "HHPAA" || refCode === "HOUS" || refCode === "HSE" || refCode === "HH" || refCode === "HHOLD") return { category: "householder", isRelevant: false, reason: `Ref type: ${refCode}` };
        if (refCode === "PE" || refCode === "PEPD" || refCode === "TELPE") return { category: "excluded", isRelevant: false, reason: `Pre-app ref: ${refCode}` };
        if (refCode === "DOC" || refCode === "DD") return { category: "excluded", isRelevant: false, reason: `Discharge ref: ${refCode}` };
        if (refCode === "NMAT") return { category: "excluded", isRelevant: false, reason: `NMA ref: ${refCode}` };
        if (refCode === "CLOPUD" || refCode === "CLEUD" || refCode === "CLP" || refCode === "CLE") return { category: "excluded", isRelevant: false, reason: `Certificate ref: ${refCode}` };
        if (refCode === "CAN") return { category: "excluded", isRelevant: false, reason: `Cancelled: ${refCode}` };
        
return { category: "excluded", isRelevant: false, reason: `Excluded ref: ${refCode}` };
      }

      // Pattern-based inclusions
      if (/^PAP/.test(refCode) || /^P\d+/.test(refCode)) {
        appType = "Prior Approval"; // Normalise PAP3MA, PAP14J, P20ZA etc.
      } else if (/^RM\d/.test(refCode)) {
        appType = "REM"; // Reserved Matters variants (RM1G, RM4B etc.)
      } else if (/^VS106/.test(refCode)) {
        appType = "MOD106"; // S106 variation
      } else if (RELEVANT_REF_CODES.has(refCode)) {
        appType = refCode;
      }
    }
  }

  // Pattern-based exclusions for Idox ref-code-as-type (DETnn, NMAMDn, COND, SD, DISC etc.)
  if (/^DET\d/.test(appType) || appType === "COND" || appType === "SD" || appType === "DISC") return { category: "excluded", isRelevant: false, reason: `Discharge of condition: ${appType}` };
  if (/^NMAMD/.test(appType) || appType === "NMA" || appType === "MA") return { category: "excluded", isRelevant: false, reason: `Non-material amendment: ${appType}` };
  if (appType === "LP" || appType === "LE" || appType === "CLPF" || appType === "CPL" || appType === "CPE" || appType === "CPLR") return { category: "excluded", isRelevant: false, reason: `Certificate of lawfulness: ${appType}` };
  if (appType === "TRE" || appType === "TR5" || appType === "PTT" || appType === "FTT") return { category: "trees", isRelevant: false, reason: `Tree work: ${appType}` };
  if (/^CND/.test(appType) || appType === "CNDR") return { category: "excluded", isRelevant: false, reason: `Conditions: ${appType}` };
  if (/^OPD/.test(appType) && appType !== "OPDLDE" && appType !== "OPDLDC") return { category: "excluded", isRelevant: false, reason: `OPDC: ${appType}` };
  if (appType === "PTC") return { category: "excluded", isRelevant: false, reason: `Telecoms: ${appType}` };
  if (appType === "DV") return { category: "excluded", isRelevant: false, reason: `Deed of variation: ${appType}` };
  if (appType === "CONS") return { category: "excluded", isRelevant: false, reason: `Conservation area: ${appType}` };
  if (appType === "PRE") return { category: "excluded", isRelevant: false, reason: `Pre-application: ${appType}` };
  if (appType === "CONR") return { category: "excluded", isRelevant: false, reason: `Conservation area: ${appType}` };
  // Pattern-based normalisation for Idox prior approval / reserved matters / PD variants
  if (/^PAP/.test(appType) || /^PA\d/.test(appType) || /^PAC/.test(appType) || appType === "PAD" || appType === "PALHE") appType = "Prior Approval";
  if (/^PDE/.test(appType) || appType === "PDCOU" || appType === "PDEAD" || appType === "PDEAB" || appType === "PDO" || appType === "GPDO") appType = "Prior Approval";
  if (/^RM\d/.test(appType) || appType === "REM" || appType === "REMF" || appType === "R") appType = "REM";
  if (/^VS106/.test(appType) || appType === "S106A" || appType === "I106") appType = "MOD106";
  if (appType === "LBA" || appType === "L") appType = "LBC"; // Normalise Listed Building variants
  if (appType === "O") appType = "OUT"; // Outline (Greenwich single-letter code)
  if (/^PN\d/.test(appType)) appType = "Prior Approval"; // Prior notification variants (PN1-PN7 etc.)
  if (appType === "AUT" || appType === "FULR") appType = "FUL"; // Authority's own / Retrospective = full planning

  if (EXCLUDED_TYPE_CODES.has(appType)) {
    if (appType.includes("Tree") || appType.includes("TPO") || appType === "TCA" || appType === "TCONSV" || appType === "STPO") return { category: "trees", isRelevant: false, reason: `Excluded type: ${appType}` };
    if (appType.includes("Advert")) return { category: "advertisement", isRelevant: false, reason: `Excluded type: ${appType}` };
    if (appType === "Householder" || appType === "HOUS" || appType === "HHOLD" || appType === "FLH" || appType === "FLHF" || appType === "HD" || appType === "HH" || appType === "HS" || appType === "HSE" || appType === "Prior Notification Householder" || appType === "Householder Application" || appType === "Householder planning permission") return { category: "householder", isRelevant: false, reason: `Excluded type: ${appType}` };
    if (appType === "CAN") return { category: "excluded", isRelevant: false, reason: `Cancelled/withdrawn: ${appType}` };
    if (appType === "planning portal submissions") {
      if (proposal.match(/\b(dwelling|unit|flat|apartment|house|home|residential|erection|demolition|conversion|change\s+of\s+use)\b/i)) {
        // Fall through to proposal-text analysis
      } else {
        return { category: "excluded", isRelevant: false, reason: "Unvalidated portal submission" };
      }
    } else {
      return { category: "excluded", isRelevant: false, reason: `Excluded type: ${appType}` };
    }
  }

  if (isMaintenanceProposal(app.proposal || "")) {
    return { category: "maintenance", isRelevant: false, reason: `Maintenance/like-for-like: ${appType}` };
  }

  if (RELEVANT_TYPE_CODES.has(appType) || appType === "planning portal submissions") {
    if (proposal.includes("prior approval") || appType.includes("Prior Approval")) {
      if (proposal.match(/\b(monopole|antenna|mast|telecoms?|telecommunications|5g|cabinet)\b/)) {
        return { category: "telecoms", isRelevant: false, reason: `Telecoms prior approval: ${appType}` };
      }
      // Arcus: PD prior-approval for solar/heat pump/EV/plant installs is not
      // a relevant "development" for finance purposes (no units/GDV) —
      // mirrors isMaintenanceProposal's own equipment keyword list and the
      // equivalent fix in fetch-planning-agile.ts.
      if (proposal.match(/\b(solar|photovoltaic|pv\s+panel|heat\s+pump|air\s+source|ev\s+charg|battery\s+storage)\b/)) {
        return { category: "plant_equipment", isRelevant: false, reason: `Plant/equipment prior approval: ${appType}` };
      }
      
return { category: "prior_approval", isRelevant: true, reason: `Prior approval: ${appType}` };
    }
    if (proposal.includes("change of use") || appType.includes("Change of Use")) {
      return { category: "change_of_use", isRelevant: true, reason: `Change of use: ${appType}` };
    }
    if (proposal.includes("conversion") || proposal.includes("convert")) {
      return { category: "conversion", isRelevant: true, reason: `Conversion: ${appType}` };
    }
    if (proposal.includes("demolition") && (proposal.includes("erection") || proposal.includes("replacement of"))) {
      if (!proposal.includes("listed building consent") || proposal.match(/\d+\s*(dwelling|unit|flat|apartment)/)) {
        return { category: "demolition_rebuild", isRelevant: true, reason: `Demolition & rebuild: ${appType}` };
      }
    }
    if (proposal.includes("erection") || proposal.includes("construction") || proposal.includes("new build")) {
      if (proposal.match(/\b(apartment|flat|dwelling|block|maisonette)s?\b/) && !proposal.match(/^proposed\s+(ground|first|side|rear|front|loft|single|two)\s/)) {
        return { category: "new_build", isRelevant: true, reason: `New build: ${appType}` };
      }
      if (proposal.match(/\d+\s*(dwelling|unit|flat|apartment|house|home)/)) {
        return { category: "new_build", isRelevant: true, reason: `New build (units in proposal): ${appType}` };
      }
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
    if (appType.includes("Listed Building") || appType.includes("Conservation Area")) {
      if (proposal.match(/\b(dwelling|unit|flat|apartment|residential|conversion|change\s+of\s+use)\b/)) {
        return { category: "heritage", isRelevant: true, reason: `Heritage with residential element: ${appType}` };
      }
      
return { category: "heritage_minor", isRelevant: false, reason: `Heritage (non-residential): ${appType}` };
    }
    if (RELEVANT_TYPE_CODES.has(appType)) {
      return { category: "other_relevant", isRelevant: true, reason: `Relevant type: ${appType}` };
    }
  }

  if (proposal.match(/\d+\s*(dwelling|unit|flat|apartment|house|home)/)) {
    return { category: "other_residential", isRelevant: true, reason: "Residential keywords in proposal" };
  }

  return { category: "unclassified", isRelevant: false, reason: `Unclassified type: ${appType}` };
}

// ─── Median Price Loading (copied verbatim from fetch-planning-idox.ts) ───

interface SoldDataFile {
  stats: {
    medianPrice: number;
    medianByType: Record<string, number>;
  };
}

function loadMedianPrices(
  countySlug: string,
  townSlug: string
): Record<string, number> {
  const soldPath = path.join(
    process.cwd(),
    "data",
    "generated",
    "sold-data",
    countySlug,
    townSlug,
    "latest.json"
  );

  try {
    if (fs.existsSync(soldPath)) {
      const data: SoldDataFile = JSON.parse(fs.readFileSync(soldPath, "utf-8"));
      const byType = data.stats.medianByType || {};
      
return {
        detached: byType.D || FALLBACK_MEDIANS.detached,
        semi_detached: byType.S || FALLBACK_MEDIANS.semi_detached,
        terraced: byType.T || FALLBACK_MEDIANS.terraced,
        flat: byType.F || FALLBACK_MEDIANS.flat,
        blended: data.stats.medianPrice || FALLBACK_MEDIANS.blended,
      };
    }
  } catch (err) {
    console.log(`  ⚠️  Could not load sold data for ${countySlug}/${townSlug}: ${err}`);
  }

  console.log(`  ℹ️  Using UK-wide fallback medians for ${countySlug}/${townSlug}`);
  
return { ...FALLBACK_MEDIANS };
}

// ─── Retry Helper (mirrors fetch-planning-idox.ts's withRetry) ───────

async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  retries = MAX_RETRIES
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const msg = String(err);
      const isRetryable = msg.includes("429") || msg.includes("503") || msg.includes("fetch failed");
      if (!isRetryable || attempt === retries) throw err;
      const delay = Math.pow(2, attempt + 1) * 2000; // 4s, 8s, 16s
      console.log(`    ⏳ ${label}: retrying in ${delay / 1000}s (attempt ${attempt + 1}/${retries})...`);
      await sleep(delay);
    }
  }
  throw new Error("Unreachable");
}

// ─── TLS Chain Repair ─────────────────────────────────────────
//
// Discovered live and NOT a guess: Bracknell Forest's HTTPS server (and
// potentially others) serves an INCOMPLETE certificate chain — just the
// leaf certificate, no intermediate (confirmed via
// `openssl s_client -showcerts`, which shows exactly 1 certificate).
// macOS's system curl silently works around this via SecureTransport's
// automatic AIA (Authority Information Access) chasing, but Node's TLS
// stack does not do this by default, so a plain `fetch()` fails with
// "unable to verify the first certificate" / UNABLE_TO_VERIFY_LEAF_SIGNATURE.
// This is a genuine server misconfiguration that would affect ANY Node.js
// client (not an artifact of one machine), so this scraper repairs it
// itself rather than requiring an operator to pre-set NODE_EXTRA_CA_CERTS:
// on the first TLS failure for a given host, it fetches the missing
// intermediate certificate from the leaf cert's own AIA "CA Issuers" URL
// (exactly what a browser does) and adds ONLY that certificate to a
// per-host Agent. Full certificate verification still applies throughout —
// nothing is disabled.

const agentCache = new Map<string, https.Agent>();

function isCertChainError(err: unknown): boolean {
  const code = (err as { code?: string } | undefined)?.code;
  
return (
    code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    code === "SELF_SIGNED_CERT_IN_CHAIN" ||
    code === "CERT_UNTRUSTED" ||
    code === "DEPTH_ZERO_SELF_SIGNED_CERT"
  );
}

function fetchIntermediateCert(caIssuerUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = caIssuerUrl.startsWith("https:") ? https : http;
    client
      .get(caIssuerUrl, (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => {
          const der = Buffer.concat(chunks);
          const b64 = der.toString("base64");
          const lines = b64.match(/.{1,64}/g) || [];
          resolve(`-----BEGIN CERTIFICATE-----\n${lines.join("\n")}\n-----END CERTIFICATE-----\n`);
        });
      })
      .on("error", reject);
  });
}

/** Connects without verification just far enough to read the leaf cert's AIA "CA Issuers" URL. */
function getPeerCaIssuerUrl(hostname: string): Promise<string | null> {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: hostname, port: 443, servername: hostname, rejectUnauthorized: false },
      () => {
        const cert = socket.getPeerCertificate(false) as unknown as {
          infoAccess?: Record<string, string[]>;
        };
        const issuers = cert.infoAccess?.["CA Issuers - URI"];
        socket.end();
        resolve(issuers && issuers[0] ? issuers[0] : null);
      }
    );
    socket.on("error", () => resolve(null));
  });
}

async function repairAgentForHost(hostname: string): Promise<https.Agent> {
  const caIssuerUrl = await getPeerCaIssuerUrl(hostname);
  if (!caIssuerUrl) {
    return new https.Agent({ keepAlive: true });
  }
  const intermediatePem = await fetchIntermediateCert(caIssuerUrl);
  
return new https.Agent({ keepAlive: true, ca: [...tls.rootCertificates, intermediatePem] });
}

interface SimpleResponse {
  ok: boolean;
  status: number;
  statusText: string;
  text(): Promise<string>;
  json(): Promise<unknown>;
}

function httpsRequestOnce(
  url: string,
  init: { method: string; headers: Record<string, string>; body?: string },
  agent: https.Agent
): Promise<SimpleResponse> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        port: u.port || 443,
        path: `${u.pathname}${u.search}`,
        method: init.method,
        headers: init.headers,
        agent,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => {
          const bodyText = Buffer.concat(chunks).toString("utf-8");
          const status = res.statusCode || 0;
          resolve({
            ok: status >= 200 && status < 300,
            status,
            statusText: res.statusMessage || "",
            text: async () => bodyText,
            json: async () => JSON.parse(bodyText),
          });
        });
      }
    );
    req.on("error", reject);
    if (init.body) req.write(init.body);
    req.end();
  });
}

/**
 * A `fetch`-like wrapper (GET/POST only, no redirect-following — none of
 * the confirmed-live endpoints in this file redirect) that transparently
 * repairs an incomplete TLS certificate chain on first failure per host,
 * per the comment above.
 */
async function robustFetch(
  url: string,
  init: { method: string; headers: Record<string, string>; body?: string }
): Promise<SimpleResponse> {
  const hostname = new URL(url).hostname;
  let agent = agentCache.get(hostname);
  if (!agent) {
    agent = new https.Agent({ keepAlive: true });
    agentCache.set(hostname, agent);
  }

  try {
    return await httpsRequestOnce(url, init, agent);
  } catch (err) {
    if (!isCertChainError(err)) throw err;
    console.log(
      `  🔧 ${hostname} served an incomplete TLS certificate chain — fetching the missing intermediate via AIA and retrying...`
    );
    const repairedAgent = await repairAgentForHost(hostname);
    agentCache.set(hostname, repairedAgent);
    
return httpsRequestOnce(url, init, repairedAgent);
  }
}

// ─── Aura Envelope Plumbing ───────────────────────────────────
//
// Everything in this section was built from what was actually observed in
// a live browser session against Bracknell Forest, then cross-checked
// against Ashford/Bromley/Folkestone & Hythe/Haringey — not guessed from
// generic Aura/Salesforce documentation.

interface AuraContext {
  fwuid: string;
  appId: string;
}

/** Extracts fwuid + community app id from a live Arcus page shell HTML body. */
function extractAuraContext(html: string): AuraContext {
  // Both values appear URL-encoded (inside preload <script src="...l/%7B...%7D/...">
  // tags) AND as a literal inline JSON blob later in the same page — try the
  // URL-encoded form first since it's present on every authority checked,
  // then fall back to the literal form.
  const fwuidEncoded = html.match(/fwuid%22%3A%22([^%"]+)%22/);
  const fwuidLiteral = html.match(/"fwuid":"([^"]+)"/);
  const fwuid = fwuidEncoded?.[1] ?? fwuidLiteral?.[1];

  // The app id is keyed by "APPLICATION@markup://siteforce:communityApp" on
  // every confirmed-working authority. A different app name here (e.g.
  // "siteforce:napiliApp", observed at Eastleigh) is a real signal the site
  // is NOT the standard Arcus BE community component this scraper targets.
  const appIdEncoded = html.match(
    /APPLICATION%40markup%3A%2F%2Fsiteforce%3AcommunityApp%22%3A%22([^%"]+)%22/
  );
  const appIdLiteral = html.match(
    /"loaded":\{"APPLICATION@markup:\/\/siteforce:communityApp":"([^"]+)"/
  );
  const appId = appIdEncoded?.[1] ?? appIdLiteral?.[1];

  if (!fwuid || !appId) {
    throw new Error(
      "Could not extract fwuid/appId from page shell — this authority may not be running the standard Arcus BE 'siteforce:communityApp' community (see Eastleigh registry comment for a real example of this)."
    );
  }

  return { fwuid, appId };
}

async function fetchAuraContext(authority: ArcusAuthority): Promise<AuraContext> {
  const url = `${authority.baseUrl}${authority.pagePath}/register-view?c__r=${REGISTER_NAME}`;
  const resp = await robustFetch(url, {
    method: "GET",
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
  });
  if (!resp.ok) {
    throw new Error(`Failed to load page shell: ${resp.status} ${resp.statusText}`);
  }
  const html = await resp.text();
  
return extractAuraContext(html);
}

/** Single Apex action envelope, as sent inside the Aura `message` param. */
interface ApexAction {
  id: string;
  descriptor: "aura://ApexActionController/ACTION$execute";
  callingDescriptor: "UNKNOWN";
  params: {
    namespace: "arcuscommunity";
    classname: "PR_SearchService" | "PublicRegisterViewService";
    method: string;
    params: unknown;
    cacheable: boolean;
    isContinuation: boolean;
  };
}

function buildApexAction(
  actionId: number,
  classname: "PR_SearchService" | "PublicRegisterViewService",
  method: string,
  params: unknown,
  cacheable: boolean
): ApexAction {
  return {
    id: `${actionId};a`,
    descriptor: "aura://ApexActionController/ACTION$execute",
    callingDescriptor: "UNKNOWN",
    params: { namespace: "arcuscommunity", classname, method, params, cacheable, isContinuation: false },
  };
}

interface AuraActionResult {
  id: string;
  state: "SUCCESS" | "ERROR";
  returnValue?: { returnValue: unknown };
  error?: Array<{ message: string }>;
}

/**
 * POST a batch of Apex actions to the Aura endpoint. The `r` query param is
 * just a client-side sequence counter in the real app — confirmed live that
 * a fixed value works fine on every subsequent call since there is no
 * session/cookie state at all for this guest-accessible endpoint.
 */
async function postAuraActions(
  authority: ArcusAuthority,
  ctx: AuraContext,
  actions: ApexAction[]
): Promise<AuraActionResult[]> {
  const auraContext = {
    mode: "PROD",
    fwuid: ctx.fwuid,
    app: "siteforce:communityApp",
    loaded: { "APPLICATION@markup://siteforce:communityApp": ctx.appId },
    dn: [],
    globals: {},
    uad: false,
  };

  const body = new URLSearchParams({
    message: JSON.stringify({ actions }),
    "aura.context": JSON.stringify(auraContext),
    "aura.pageURI": `${authority.pagePath}/register-view?c__r=${REGISTER_NAME}`,
    "aura.token": "null",
  });

  const url = `${authority.baseUrl}${authority.pagePath}/sfsites/aura?r=1&aura.ApexAction.execute=${actions.length}`;
  const resp = await robustFetch(url, {
    method: "POST",
    headers: {
      "User-Agent": USER_AGENT,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`Aura request failed: ${resp.status} ${resp.statusText} — ${text.slice(0, 300)}`);
  }

  const json = (await resp.json()) as { actions: AuraActionResult[] };
  
return json.actions;
}

// ─── Register Config / Date-Filter Field Discovery ────────────

interface RegisterField {
  DeveloperName: string;
  MasterLabel: string;
  arcuscommunity__Path__c: string;
}

interface RegisterAdvancedSearch {
  DeveloperName: string; // this is the "advancedSearchName" to send back in search calls
  arcuscommunity__Search__r?: { DeveloperName?: string };
  arcuscommunity__Fields__r?: RegisterField[];
}

interface RegisterConfig {
  advancedSearches: RegisterAdvancedSearch[];
}

/** Real, verified-live candidate paths for a "date validated/received" filter, in preference order. */
const DATE_FIELD_PATH_CANDIDATES = [
  "arcusbuiltenv__Validated_Date__c", // Bracknell Forest
  "arcusbuiltenv__Valid_Date__c", // Ashford, Bromley, Folkestone & Hythe, Haringey
  "arcusbuiltenv__Received_Date__c", // fallback seen on Ashford (secondary date concept)
];

interface DateFilterFields {
  advancedSearchName: string;
  path: string;
  fromDevName: string;
  toDevName: string;
}

async function fetchRegisterConfig(
  authority: ArcusAuthority,
  ctx: AuraContext
): Promise<RegisterConfig> {
  const action = buildApexAction(1, "PR_SearchService", "getRegister", { registerName: REGISTER_NAME }, true);
  const [result] = await postAuraActions(authority, ctx, [action]);
  if (result.state !== "SUCCESS") {
    throw new Error(`getRegister failed: ${JSON.stringify(result.error)}`);
  }
  
return result.returnValue!.returnValue as RegisterConfig;
}

/**
 * Discover the real from/to searchFilter field-developer-names for the
 * Planning_Applications advanced search. This is NOT optional — verified
 * live that hardcoding any single authority's field names against another
 * authority silently returns an UNFILTERED result set (see file header).
 */
function discoverDateFilterFields(config: RegisterConfig): DateFilterFields | null {
  const planningSearch = config.advancedSearches.find(
    (s) => s.arcuscommunity__Search__r?.DeveloperName === "Planning_Applications"
  );
  if (!planningSearch?.arcuscommunity__Fields__r) return null;

  const fields = planningSearch.arcuscommunity__Fields__r;
  for (const candidatePath of DATE_FIELD_PATH_CANDIDATES) {
    const matches = fields.filter((f) => f.arcuscommunity__Path__c === candidatePath);
    if (matches.length < 2) continue;
    const fromField = matches.find((f) => /\bfrom\b/i.test(f.MasterLabel));
    const toField = matches.find((f) => /\bto\b/i.test(f.MasterLabel));
    if (fromField && toField) {
      return {
        advancedSearchName: planningSearch.DeveloperName,
        path: candidatePath,
        fromDevName: fromField.DeveloperName,
        toDevName: toField.DeveloperName,
      };
    }
  }
  
return null;
}

// ─── Search Types ──────────────────────────────────────────────

interface ArcusSearchRecord {
  Id: string;
  Name: string;
  arcusbuiltenv__Type__c?: string;
  arcusbuiltenv__Status__c?: string;
  arcusbuiltenv__Site_Address__c?: string;
  arcusbuiltenv__Proposal__c?: string;
  arcusbuiltenv__Current_Decision__c?: string;
  [key: string]: unknown;
}

interface ArcusViewField {
  MasterLabel: string;
  "arcuscommunity__Path__c"?: string;
}

interface ArcusSearchResponse {
  records: ArcusSearchRecord[];
  thresholdHit: boolean;
  view?: { fields?: ArcusViewField[] };
}

/**
 * Real, verified-live finding: even which record fields are RETURNED AT ALL
 * varies per authority, independently of the getRecordDetails-field-name
 * variability documented above. Confirmed live: Haringey's Site Address
 * lives under `Hidden_PR_Site_address__c` (not `arcusbuiltenv__Site_Address__c`)
 * — every one of the other 4 confirmed authorities uses the standard name,
 * so this was invisible until Haringey specifically was checked (its search
 * response came back with EVERY application's address blank until this was
 * found). The search response conveniently self-describes its own field
 * layout via `view.fields: [{MasterLabel, arcuscommunity__Path__c}]` — this
 * scraper reads that ONCE per authority (from the first non-empty search
 * response) and resolves the real path for each concept by label, instead
 * of assuming a fixed field name works everywhere.
 */
interface ViewFieldMap {
  siteAddressPath: string;
  typePath: string;
  statusPath: string;
  decisionPath: string;
  proposalPath: string;
}

const DEFAULT_VIEW_FIELD_MAP: ViewFieldMap = {
  siteAddressPath: "arcusbuiltenv__Site_Address__c",
  typePath: "arcusbuiltenv__Type__c",
  statusPath: "arcusbuiltenv__Status__c",
  decisionPath: "arcusbuiltenv__Current_Decision__c",
  proposalPath: "arcusbuiltenv__Proposal__c",
};

function resolveViewFieldPath(fields: ArcusViewField[], labelPattern: RegExp, fallback: string): string {
  const match = fields.find((f) => labelPattern.test(f.MasterLabel));
  
return match?.["arcuscommunity__Path__c"] || fallback;
}

function buildViewFieldMap(response: ArcusSearchResponse): ViewFieldMap {
  const fields = response.view?.fields;
  if (!fields || fields.length === 0) return DEFAULT_VIEW_FIELD_MAP;
  
return {
    siteAddressPath: resolveViewFieldPath(fields, /site address|location of works/i, DEFAULT_VIEW_FIELD_MAP.siteAddressPath),
    typePath: resolveViewFieldPath(fields, /application type/i, DEFAULT_VIEW_FIELD_MAP.typePath),
    statusPath: resolveViewFieldPath(fields, /^(application )?status$/i, DEFAULT_VIEW_FIELD_MAP.statusPath),
    decisionPath: resolveViewFieldPath(fields, /^decision$/i, DEFAULT_VIEW_FIELD_MAP.decisionPath),
    proposalPath: resolveViewFieldPath(fields, /proposal|description/i, DEFAULT_VIEW_FIELD_MAP.proposalPath),
  };
}

/**
 * Generate monthly date ranges — mirrors fetch-planning-idox.ts's
 * generateMonthlyRanges, needed here because the "advanced" search has a
 * confirmed hard 250-row return cap with no pagination.
 */
function generateMonthlyRanges(from: Date, to: Date): Array<{ from: Date; to: Date }> {
  const ranges: Array<{ from: Date; to: Date }> = [];
  let cursor = new Date(from);
  while (cursor < to) {
    const rangeStart = new Date(cursor);
    const nextMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const rangeEnd = nextMonth < to ? nextMonth : to;
    ranges.push({ from: rangeStart, to: rangeEnd });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  
return ranges;
}

function toISODate(d: Date): string {
  return d.toISOString().split("T")[0];
}

async function searchDateRange(
  authority: ArcusAuthority,
  ctx: AuraContext,
  dateFields: DateFilterFields,
  from: Date,
  to: Date
): Promise<ArcusSearchResponse> {
  const action = buildApexAction(
    1,
    "PR_SearchService",
    "search",
    {
      request: {
        registerName: REGISTER_NAME,
        searchType: "advanced",
        searchName: "Planning_Applications",
        advancedSearchName: dateFields.advancedSearchName,
        searchFilters: [
          { fieldName: dateFields.path, fieldValue: toISODate(from), fieldDeveloperName: dateFields.fromDevName },
          { fieldName: dateFields.path, fieldValue: toISODate(to), fieldDeveloperName: dateFields.toDevName },
        ],
      },
    },
    false
  );
  const [result] = await postAuraActions(authority, ctx, [action]);
  if (result.state !== "SUCCESS") {
    throw new Error(`search failed: ${JSON.stringify(result.error)}`);
  }
  
return result.returnValue!.returnValue as ArcusSearchResponse;
}

/**
 * Fetch getRecordDetails for a batch of record Ids in a single Aura POST
 * (confirmed live that multiple actions batch cleanly into one request).
 * Returns a name→value map per record, parsed generically from the
 * `sections[].fields[]` shape since section order/labels vary per
 * authority (verified — Bracknell's own layout differs subtly per record
 * type).
 */
/**
 * Real, verified-live finding: the underlying custom-field API names inside
 * getRecordDetails are ALSO not consistent across authorities — e.g.
 * Applicant Name is `arcusbuiltenv__Applicant_Name__c` at Bracknell Forest
 * but plain `Applicant_Name__c` (no namespace prefix) at Folkestone & Hythe,
 * and "Current Decision" is `arcusbuiltenv__Current_Decision__c` at
 * Bracknell but `Current_Decision_PR_Display__c` at Folkestone & Hythe. The
 * field LABEL text is far more consistent, so every field is stored keyed
 * both by its real API name (fast path, works for Bracknell/Ashford/Bromley)
 * AND by a `label:<lowercased label>` key (fallback path, needed for
 * Folkestone & Hythe's differently-named decision/applicant/agent fields).
 */
function detailLabelKey(label: string): string {
  return `label:${label.toLowerCase().trim()}`;
}

async function fetchRecordDetailsBatch(
  authority: ArcusAuthority,
  ctx: AuraContext,
  recordIds: string[]
): Promise<Map<string, Record<string, string>>> {
  const actions = recordIds.map((id, i) =>
    buildApexAction(i + 1, "PublicRegisterViewService", "getRecordDetails", { recordId: id, registerName: REGISTER_NAME }, true)
  );
  const results = await postAuraActions(authority, ctx, actions);

  const out = new Map<string, Record<string, string>>();
  results.forEach((result, i) => {
    const recordId = recordIds[i];
    if (result.state !== "SUCCESS") return; // leave unenriched rather than fail the whole batch
    const detail = result.returnValue!.returnValue as {
      sections: Array<{ fields: Array<{ name: string; label: string; value: string }> }>;
    };
    const fieldMap: Record<string, string> = {};
    for (const section of detail.sections || []) {
      for (const field of section.fields || []) {
        if (!field.value) continue;
        fieldMap[field.name] = field.value;
        if (field.label) fieldMap[detailLabelKey(field.label)] = field.value;
      }
    }
    out.set(recordId, fieldMap);
  });
  
return out;
}

/**
 * Look up a getRecordDetails value trying real field-API-name candidates
 * first (fast path), then falling back to a label-pattern scan (needed for
 * authorities that use non-standard field API names — see comment above).
 * `labelPattern` should positively match the wanted label and the caller is
 * responsible for excluding lookalikes (e.g. "current decision" must not
 * also match "Current Decision Date").
 */
function pickDetailField(
  detail: Record<string, string> | undefined,
  exactFieldNames: string[],
  labelPattern: RegExp
): string {
  if (!detail) return "";
  for (const name of exactFieldNames) {
    if (detail[name]) return detail[name];
  }
  for (const key of Object.keys(detail)) {
    if (!key.startsWith("label:")) continue;
    if (labelPattern.test(key.slice(6))) return detail[key];
  }
  
return "";
}

/** Converts an Arcus date value ("YYYY-MM-DD" or "YYYY-MM-DD HH:MM:SS") to DD/MM/YYYY. */
function arcusDateToDDMMYYYY(value: string | undefined | null): string {
  if (!value) return "";
  const datePart = value.slice(0, 10);
  const m = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  
return `${m[3]}/${m[2]}/${m[1]}`;
}

function formatAddress(raw: string | undefined): string {
  if (!raw) return "";
  
return raw.replace(/\r\n/g, ", ").replace(/\n/g, ", ").replace(/\s*,\s*,/g, ",").replace(/\s+/g, " ").trim();
}

// ─── Arcus → Canonical Format Conversion ─────────────────────

/**
 * Field mapping (per task spec): reference→ref_no, site address→
 * application_address, proposal→proposal, application type→app_type,
 * status/decision→app_status/decision_notice_type, validated date→
 * received_date, decision date→decision_date. Enrichment fields
 * (applicant/agent/officer/decision date/planning portal ref/parish/ward)
 * come from the optional `detail` map (getRecordDetails), only populated
 * for applications that already passed categorise() as relevant.
 */
function normaliseArcusResult(
  record: ArcusSearchRecord,
  authority: ArcusAuthority,
  dateFieldPath: string,
  viewFields: ViewFieldMap,
  detail: Record<string, string> | undefined
): RawApp {
  // Arcus: confirmed live that the real field NAME behind each concept
  // (site address, application type, status, decision) varies per
  // authority — `viewFields` is discovered per-authority from the search
  // response's own self-describing `view.fields` metadata (see
  // buildViewFieldMap / DEFAULT_VIEW_FIELD_MAP above), not assumed fixed.
  const address = formatAddress(record[viewFields.siteAddressPath] as string | undefined);
  const receivedDate = arcusDateToDDMMYYYY(
    (record[dateFieldPath] as string | undefined) ??
      pickDetailField(detail, ["arcusbuiltenv__Validated_Date__c", "arcusbuiltenv__Valid_Date__c", "arcusbuiltenv__Received_Date__c"], /^(validated|valid|received) date$/i)
  );
  const decisionDate = arcusDateToDDMMYYYY(
    pickDetailField(
      detail,
      ["arcusbuiltenv__Current_Decision_Date_Formula__c", "arcusbuiltenv__Decision_Notice_Sent_Date_Manual__c"],
      /^current decision date$|^decision notice sent date$/i
    )
  );

  return {
    ref_no: record.Name || "",
    planning_portal_ref_no: pickDetailField(detail, ["arcusbuiltenv__External_Id__c"], /planning portal reference/i),
    application_address: address,
    UPRNDisplay: "",
    proposal: (record[viewFields.proposalPath] as string | undefined) || "",
    // Arcus: confirmed live that some authorities (Ashford, Haringey) don't
    // surface an Application Type field in the search/list response at all
    // (their PA_ADV_All search's configured view fields simply omit it), so
    // fall back to getRecordDetails when present — and for at least one
    // authority (Haringey) it genuinely isn't present there either, in which
    // case this stays blank and categorise() falls back to proposal text.
    app_type: (record[viewFields.typePath] as string | undefined) || pickDetailField(detail, ["arcusbuiltenv__Type__c"], /^application type$/i),
    app_status: (record[viewFields.statusPath] as string | undefined) || "",
    // Arcus: confirmed live that some authorities (Folkestone & Hythe) don't
    // surface a usable decision field in the search/list response either
    // (same kind of gap as app_type on Ashford), AND their getRecordDetails
    // uses a differently-named field entirely (Current_Decision_PR_Display__c
    // vs Bracknell's arcusbuiltenv__Current_Decision__c) — pickDetailField's
    // label-based fallback (matching on "current decision", excluding "date")
    // covers both.
    decision_notice_type:
      (record[viewFields.decisionPath] as string | undefined) ||
      pickDetailField(detail, ["arcusbuiltenv__Current_Decision__c"], /^current decision(?! date)/i),
    decision_date: decisionDate,
    decision_level: pickDetailField(detail, ["arcusbuiltenv__Determination_Level__c"], /determination level/i),
    received_date: receivedDate,
    valid_date: receivedDate,
    expiry_date: "",
    ward: pickDetailField(detail, ["arcusbuiltenv__Wards__c"], /^wards?$/i),
    parish: pickDetailField(detail, ["arcusbuiltenv__Parishes__c"], /^parish(es)?$/i),
    case_officer: pickDetailField(detail, ["arcusbuiltenv__Officer_Name__c"], /officer name/i),
    // Arcus: confirmed live that Folkestone & Hythe's Applicant/Agent Name
    // fields have NO namespace prefix at all (Applicant_Name__c/Agent_Name__c)
    // unlike Bracknell's arcusbuiltenv__Applicant_Name__c/Agent_Name__c —
    // the label fallback ("Applicant Name"/"Agent Name") covers both.
    ApplicantContactNoName: pickDetailField(detail, ["arcusbuiltenv__Applicant_Name__c", "Applicant_Name__c"], /^applicant name$/i),
    AgentContactNoName: pickDetailField(detail, ["arcusbuiltenv__Agent_Name__c", "Agent_Name__c"], /^agent name$/i),
    site_area: "",
    KeyNo: record.Id,
    postcode: extractPostcode(address),
    _authority_id: authority.id,
    _base_url: authority.baseUrl,
  };
}

// ─── Processing Pipeline ─────────────────────────────────────

function buildArcusSourceUrl(recordId: string, authority: ArcusAuthority): string {
  if (!recordId) return "";

  // Confirmed live by clicking through a real search result in a browser session.
  return `${authority.baseUrl}${authority.pagePath}/detail/${recordId}?c__r=${REGISTER_NAME}`;
}

function processApplications(
  rawApps: RawApp[],
  authority: ArcusAuthority,
  townSlug: string,
  countySlug: string,
  medians: Record<string, number>
): ProcessedApp[] {
  const processed: ProcessedApp[] = [];

  for (const raw of rawApps) {
    const { category, isRelevant, reason } = categorise(raw);
    const units = isRelevant ? extractUnits(raw.proposal || "") : null;
    const gdv = estimateGDV(raw.proposal || "", units, medians);
    const applicant = extractCompany(raw.ApplicantContactNoName || "");
    const agent = extractCompany(raw.AgentContactNoName || "");
    const address = raw.application_address || raw.UPRNDisplay || "";
    const postcode = raw.postcode || extractPostcode(address);

    processed.push({
      reference: raw.ref_no || "",
      planning_portal_ref: raw.planning_portal_ref_no || "",
      local_authority: authority.name,
      source_url: buildArcusSourceUrl(raw.KeyNo || "", authority),
      address,
      postcode,
      ward: raw.ward || "",
      parish: raw.parish || "",
      town_slug: townSlug,
      county_slug: countySlug,
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

  return processed;
}

/**
 * writeWebsiteJson — copied from fetch-planning-agile.ts's evolved version
 * (which itself fixed a real idox-inherited bug: refused/withdrawn must be
 * computed BEFORE approved, and withdrawn must check the decision field too,
 * not just status). Verified against every real Arcus decision string
 * observed ("Approve", "Approve with Conditions", "Approve No Conditions",
 * "Refuse", "Withdrawn") — all classify correctly with no further changes
 * needed.
 */
function writeWebsiteJson(
  processed: ProcessedApp[],
  authority: ArcusAuthority,
  townSlug: string,
  countySlug: string
): void {
  const relevant = processed.filter((a) => a.is_relevant);

  const refusedApps = relevant.filter((a) => {
    const status = a.status.toUpperCase();
    const decision = a.decision.toUpperCase();
    
return (
      status === "REF" || status === "REFUSED" ||
      decision === "REF" ||
      decision.includes("REFUS") ||
      status.includes("REFUS")
    );
  });
  const withdrawnApps = relevant.filter((a) => {
    if (refusedApps.includes(a)) return false;
    const status = a.status.toUpperCase();
    const decision = a.decision.toUpperCase();
    
return status.includes("WITHDRAWN") || decision.includes("WITHDRAWN");
  });
  const approvedApps = relevant.filter((a) => {
    if (refusedApps.includes(a) || withdrawnApps.includes(a)) return false;
    const status = a.status.toUpperCase();
    const decision = a.decision.toUpperCase();
    
return (
      status === "APP" || status === "APPROVED" ||
      status === "AAPR" || status === "AEGPD" ||
      decision === "APP" || decision === "AAPR" || decision === "AEGPD" ||
      decision.includes("APPROV") ||
      decision.includes("CONDITIONAL PERMISSION") ||
      decision.includes("CONSENT") ||
      decision.includes("PERMITTED DEV") ||
      decision.includes("LIST.BLD.APP") ||
      decision.includes("ACCEPT AMEND") ||
      decision.includes("NOT REQUIRED") ||
      decision.includes("GRANT") ||
      status.includes("APPROV") ||
      status.includes("GRANTED") ||
      status.includes("PERMIT") ||
      status.includes("NOT REQUIRED")
    );
  });
  const pendingApps = relevant.filter(
    (a) =>
      !approvedApps.includes(a) &&
      !refusedApps.includes(a) &&
      !withdrawnApps.includes(a)
  );

  const approvedUnits = approvedApps.reduce((s, a) => s + (a.units || 0), 0);
  const pendingUnits = pendingApps.reduce((s, a) => s + (a.units || 0), 0);
  const approvedGdv = approvedApps.reduce((s, a) => s + (a.estimated_gdv || 0), 0);
  const pendingGdv = pendingApps.reduce((s, a) => s + (a.estimated_gdv || 0), 0);
  const decidedCount = approvedApps.length + refusedApps.length;
  const approvalRate = decidedCount > 0 ? Math.round((approvedApps.length / decidedCount) * 100) : 0;

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

  const generatedDir = path.join(process.cwd(), "data", "generated", "planning", countySlug, townSlug);
  fs.mkdirSync(generatedDir, { recursive: true });
  const latestPath = path.join(generatedDir, "latest.json");

  fs.writeFileSync(
    latestPath,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        townSlug,
        countySlug,
        localAuthority: authority.name,
        source: "arcus",
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

  console.log(`  💾 Website JSON: ${latestPath}`);
  console.log(`     ├─ Relevant: ${relevant.length} (${approvedApps.length} approved, ${pendingApps.length} pending, ${refusedApps.length} refused)`);
  console.log(`     ├─ Units: ${approvedUnits + pendingUnits} (${approvedUnits} approved, ${pendingUnits} pending)`);
  console.log(`     ├─ Est. GDV: £${((approvedGdv + pendingGdv) / 1000000).toFixed(1)}M`);
  console.log(`     └─ Approval rate: ${approvalRate}%`);
}

// ─── Authority Processing ────────────────────────────────────

async function scrapeAuthority(
  authority: ArcusAuthority,
  fromDate: Date,
  toDate: Date,
  months: number
): Promise<RawApp[]> {
  console.log(`  🔑 Fetching page shell to extract fwuid/appId...`);
  const ctx = await withRetry(() => fetchAuraContext(authority), "page shell");
  console.log(`  🔑 fwuid=${ctx.fwuid.slice(0, 16)}... appId=${ctx.appId}`);

  console.log(`  📋 Fetching register config (getRegister) to discover date-filter field names...`);
  const registerConfig = await withRetry(() => fetchRegisterConfig(authority, ctx), "getRegister");
  const dateFields = discoverDateFilterFields(registerConfig);
  if (!dateFields) {
    throw new Error(
      "Could not discover a Validated/Valid/Received date from/to field pair in this authority's Planning_Applications advanced search config — cannot safely date-filter (see file header for why hardcoding a guess is unsafe)."
    );
  }
  console.log(`  📅 Discovered date filter: ${dateFields.fromDevName}/${dateFields.toDevName} → ${dateFields.path}`);

  const monthlyRanges = generateMonthlyRanges(fromDate, toDate);
  console.log(`  📅 Splitting into ${monthlyRanges.length} monthly date ranges`);

  const allRecords: ArcusSearchRecord[] = [];
  let monthsErrored = 0;
  // Discovered once from the first non-empty response's self-describing
  // `view.fields` metadata — see ViewFieldMap comment above.
  let viewFields: ViewFieldMap = DEFAULT_VIEW_FIELD_MAP;
  let viewFieldsDiscovered = false;

  for (let i = 0; i < monthlyRanges.length; i++) {
    const range = monthlyRanges[i];
    console.log(`  📡 Searching ${toISODate(range.from)} → ${toISODate(range.to)} (${i + 1}/${monthlyRanges.length})...`);
    try {
      const response = await withRetry(
        () => searchDateRange(authority, ctx, dateFields, range.from, range.to),
        `Search ${i + 1}`
      );
      if (response.thresholdHit) {
        console.log(`    ⚠️  Hit the 250-row cap for this month — some applications in this window may be missing`);
      }
      console.log(`    ✓ ${response.records.length} results`);
      allRecords.push(...response.records);
      if (!viewFieldsDiscovered && response.records.length > 0) {
        viewFields = buildViewFieldMap(response);
        viewFieldsDiscovered = true;
        console.log(
          `  🗺️  Discovered field layout: siteAddress=${viewFields.siteAddressPath}, type=${viewFields.typePath}, status=${viewFields.statusPath}, decision=${viewFields.decisionPath}`
        );
      }
    } catch (err) {
      console.error(`    ❌ Error: ${err}`);
      monthsErrored++;
    }
    await sleep(THROTTLE_MS);
  }

  if (monthsErrored > 0 && monthsErrored === monthlyRanges.length) {
    throw new Error(`All ${monthlyRanges.length} monthly requests failed — authority likely unreachable or a real API error`);
  }
  if (monthsErrored > 0) {
    console.log(`  ⚠️  Partial failure: ${monthsErrored}/${monthlyRanges.length} months errored`);
  }

  // Deduplicate on Id
  const deduped = new Map<string, ArcusSearchRecord>();
  for (const record of allRecords) {
    if (record.Id) deduped.set(record.Id, record);
  }
  const records = Array.from(deduped.values());
  console.log(`  📦 After dedup: ${records.length} unique applications`);

  // Defence-in-depth client-side date re-check (mirrors fetch-planning-agile.ts's
  // own client-side date filtering after a server-side call it couldn't fully trust).
  const windowRecords = records.filter((r) => {
    const raw = r[dateFields.path] as string | undefined;
    if (!raw) return true; // keep — no date to check against, don't silently drop
    const d = new Date(raw.slice(0, 10));
    if (isNaN(d.getTime())) return true;
    
return d >= fromDate && d <= toDate;
  });
  if (windowRecords.length !== records.length) {
    console.log(`  📅 Client-side date safety filter removed ${records.length - windowRecords.length} out-of-window record(s)`);
  }

  // Normalise to canonical RawApp format first (no enrichment yet — categorise()
  // only needs ref_no/app_type/proposal, none of which require getRecordDetails).
  const rawAppsNoDetail = windowRecords.map((r) => normaliseArcusResult(r, authority, dateFields.path, viewFields, undefined));

  // Enrich (getRecordDetails) any application that either (a) categorise()
  // already flags as relevant, or (b) has no app_type at all from the search
  // response. (b) matters because at least one confirmed-live authority
  // (Ashford) doesn't surface arcusbuiltenv__Type__c in its Planning_Applications
  // search view fields — for those records categorise() is running blind on
  // proposal text alone and its "not relevant" verdict can't be trusted until
  // the real Application Type is fetched from getRecordDetails and re-checked
  // (processApplications below re-runs categorise() on the final, possibly
  // enriched, RawApp).
  const idsNeedingEnrichment = rawAppsNoDetail
    .filter((raw) => categorise(raw).isRelevant || !raw.app_type)
    .map((raw) => raw.KeyNo)
    .filter(Boolean);

  console.log(`  🔎 Enriching ${idsNeedingEnrichment.length} application(s) via getRecordDetails (batches of ${DETAIL_BATCH_SIZE})...`);
  const detailMap = new Map<string, Record<string, string>>();
  for (let i = 0; i < idsNeedingEnrichment.length; i += DETAIL_BATCH_SIZE) {
    const batch = idsNeedingEnrichment.slice(i, i + DETAIL_BATCH_SIZE);
    try {
      const batchDetails = await withRetry(
        () => fetchRecordDetailsBatch(authority, ctx, batch),
        `Detail batch ${Math.floor(i / DETAIL_BATCH_SIZE) + 1}`
      );
      for (const [id, fields] of batchDetails) detailMap.set(id, fields);
    } catch (err) {
      console.error(`    ⚠️  Detail batch failed (continuing without enrichment for this batch): ${err}`);
    }
    await sleep(THROTTLE_MS);
  }

  const recordById = new Map(windowRecords.map((r) => [r.Id, r]));
  const rawApps = rawAppsNoDetail.map((raw) => {
    const record = recordById.get(raw.KeyNo);
    if (!record) return raw;
    
return normaliseArcusResult(record, authority, dateFields.path, viewFields, detailMap.get(raw.KeyNo));
  });

  return rawApps;
}

async function processAuthority(
  authority: ArcusAuthority,
  fromDate: Date,
  toDate: Date,
  months: number
): Promise<void> {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  🏛️  ${authority.name} (${authority.id})`);
  console.log(`  Portal: Arcus Built Environment`);
  console.log(`  URL: ${authority.baseUrl}${authority.pagePath}`);
  console.log(`  Period: ${toISODate(fromDate)} to ${toISODate(toDate)} (${months} months)`);
  console.log(`${"═".repeat(60)}`);

  const rawApps = await scrapeAuthority(authority, fromDate, toDate, months);
  console.log(`\n  📦 Scraped: ${rawApps.length} applications`);

  if (rawApps.length === 0) {
    console.log(`  ℹ️  No results to process`);
    
return;
  }

  // Save raw normalised data
  const today = new Date().toISOString().split("T")[0];
  const exportDir = path.join(process.cwd(), "data", "planning-exports");
  fs.mkdirSync(exportDir, { recursive: true });
  const rawPath = path.join(exportDir, `${authority.id}-raw-api-${today}.json`);
  fs.writeFileSync(rawPath, JSON.stringify(rawApps, null, 2));
  console.log(`  💾 Raw data: ${rawPath}`);

  for (const town of authority.towns) {
    console.log(`\n  🏘️  Processing for ${town.countySlug}/${town.townSlug}...`);

    const medians = loadMedianPrices(town.countySlug, town.townSlug);
    console.log(`  💰 Medians: detached £${medians.detached.toLocaleString("en-GB")}, flat £${medians.flat.toLocaleString("en-GB")}, blended £${medians.blended.toLocaleString("en-GB")}`);

    const processed = processApplications(rawApps, authority, town.townSlug, town.countySlug, medians);

    const categories = new Map<string, number>();
    for (const app of processed) {
      const key = `${app.is_relevant ? "✓" : "✗"} ${app.category}`;
      categories.set(key, (categories.get(key) || 0) + 1);
    }
    console.log(`\n  Category breakdown:`);
    for (const [cat, count] of [...categories.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`    ${count.toString().padStart(4)}  ${cat}`);
    }

    writeWebsiteJson(processed, authority, town.townSlug, town.countySlug);
  }
}

// ─── CLI ─────────────────────────────────────────────────────

function parseArgs(): {
  authorityId: string | null;
  all: boolean;
  months: number;
} {
  const args = process.argv.slice(2);
  let authorityId: string | null = null;
  let all = false;
  let months = DEFAULT_MONTHS;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--authority":
        authorityId = args[++i];
        break;
      case "--all":
        all = true;
        break;
      case "--months":
        months = parseInt(args[++i], 10);
        break;
    }
  }

  if (!authorityId && !all) {
    console.error(
      "Usage:\n" +
        "  npx tsx scripts/fetch-planning-arcus.ts --authority <id>\n" +
        "  npx tsx scripts/fetch-planning-arcus.ts --all\n" +
        "  npx tsx scripts/fetch-planning-arcus.ts --all --months 6\n" +
        "\nAvailable Arcus authorities:"
    );
    for (const a of getEnabledArcusAuthorities()) {
      console.error(`  ✅ ${a.id} — ${a.name}`);
    }
    console.error("\nDisabled (use --authority to force):");
    for (const a of ARCUS_AUTHORITIES.filter((x) => !x.enabled)) {
      console.error(`  ⏸️  ${a.id} — ${a.name}`);
    }
    process.exit(1);
  }

  return { authorityId, all, months };
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const { authorityId, all, months } = parseArgs();

  const now = new Date();
  const from = new Date(now);
  from.setMonth(from.getMonth() - months);

  let authorities: ArcusAuthority[];

  if (all) {
    authorities = getEnabledArcusAuthorities();
    console.log(`\n🚀 Batch scraping ${authorities.length} enabled Arcus authorities (${months} months)`);
  } else {
    const auth = getArcusAuthority(authorityId!);
    if (!auth) {
      console.error(`❌ Unknown Arcus authority: ${authorityId}`);
      console.error("Available IDs:");
      for (const a of ARCUS_AUTHORITIES) {
        const status = a.enabled ? "✅" : "⏸️";
        console.error(`  ${status} ${a.id} — ${a.name}`);
      }
      process.exit(1);
    }
    if (!auth.enabled) {
      console.log(`⚠️  ${auth.id} is disabled — scraping anyway as explicitly requested`);
    }
    authorities = [auth];
  }

  const results: { id: string; name: string; success: boolean; error?: string }[] = [];

  async function processOne(authority: ArcusAuthority) {
    try {
      await processAuthority(authority, from, now, months);
      results.push({ id: authority.id, name: authority.name, success: true });
    } catch (err) {
      console.error(`\n❌ Fatal error processing ${authority.id}: ${err}`);
      results.push({ id: authority.id, name: authority.name, success: false, error: String(err) });
    }
  }

  const CONCURRENCY = all ? 4 : 1;
  if (CONCURRENCY > 1 && authorities.length > 1) {
    console.log(`  ⚡ Running ${CONCURRENCY} authorities concurrently\n`);
    for (let i = 0; i < authorities.length; i += CONCURRENCY) {
      const chunk = authorities.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map(processOne));
    }
  } else {
    for (const authority of authorities) {
      await processOne(authority);
      if (authorities.length > 1) await sleep(1000);
    }
  }

  console.log(`\n${"═".repeat(60)}`);
  console.log("  📋 Batch Summary");
  console.log(`${"═".repeat(60)}`);
  for (const r of results) {
    const icon = r.success ? "✅" : "❌";
    const errStr = r.error ? ` — ${r.error}` : "";
    console.log(`  ${icon} ${r.id} (${r.name})${errStr}`);
  }
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;
  console.log(`\n  Total: ${successCount} succeeded, ${failCount} failed`);
  console.log("\n  Done! 🎉\n");

  if (failCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
