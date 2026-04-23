/**
 * Enrich Developer Prospects via Apollo.io API
 *
 * Takes enriched prospects from data/generated/developer-prospects/enriched.json,
 * searches Apollo for decision-makers at each company, and adds contact details:
 *   - Email, phone, LinkedIn URL
 *   - Title/role
 *   - Company domain
 *
 * Usage:
 *   npx tsx scripts/enrich-apollo-contacts.ts
 *   npx tsx scripts/enrich-apollo-contacts.ts --limit 50
 *   npx tsx scripts/enrich-apollo-contacts.ts --skip-enriched
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ───────────────────────────────────────────────────────────────────

interface CompaniesHouseData {
  companyNumber: string;
  companyName: string;
  companyStatus: string;
  companyType: string;
  incorporationDate: string;
  sicCodes: string[];
  registeredOffice: {
    addressLine1: string;
    addressLine2: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  } | null;
  directors: Array<{
    name: string;
    role: string;
    appointedOn: string;
    nationality: string;
  }>;
  matchConfidence: string;
}

interface EnrichedProspect {
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
  companiesHouse: CompaniesHouseData | null;
  enrichedAt: string;
}

interface ApolloContact {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  companyDomain: string;
  apolloId: string;
}

interface ContactEnrichedProspect extends EnrichedProspect {
  contacts: ApolloContact[];
  apolloEnrichedAt: string;
}

// ── Config ──────────────────────────────────────────────────────────────────

const INPUT_PATH = path.join(process.cwd(), "data", "generated", "developer-prospects", "enriched.json");
const OUTPUT_PATH = path.join(process.cwd(), "data", "generated", "developer-prospects", "contacts.json");

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;
const APOLLO_BASE = "https://api.apollo.io/v1";

// Decision-maker titles to search for
const TARGET_TITLES = [
  "Director",
  "Managing Director",
  "Founder",
  "CEO",
  "Chief Executive",
  "Owner",
  "Partner",
  "Principal",
  "Development Director",
  "Land Director",
  "Finance Director",
];

const RATE_LIMIT_MS = 1000; // 1 request per second

// ── Apollo API ──────────────────────────────────────────────────────────────

async function searchPeople(companyName: string, domain?: string): Promise<any[]> {
  const body: Record<string, any> = {
    q_organization_name: companyName,
    person_titles: TARGET_TITLES,
    page: 1,
    per_page: 5,
    organization_locations: ["United Kingdom"],
  };

  if (domain) {
    body.q_organization_domains = domain;
  }

  const res = await fetch(`${APOLLO_BASE}/mixed_people/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": APOLLO_API_KEY!,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    if (res.status === 429) {
      console.log("    [RATE LIMITED] Waiting 60s...");
      await sleep(60_000);
      return searchPeople(companyName, domain);
    }
    throw new Error(`Apollo API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.people || [];
}

async function enrichPerson(apolloId: string): Promise<any> {
  const res = await fetch(`${APOLLO_BASE}/people/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": APOLLO_API_KEY!,
    },
    body: JSON.stringify({ id: apolloId, reveal_personal_emails: false }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.person || null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Processing ──────────────────────────────────────────────────────────────

async function findContacts(prospect: EnrichedProspect): Promise<ApolloContact[]> {
  const companyName = prospect.companiesHouse?.companyName || prospect.companyName;

  // Search Apollo for people at this company
  const people = await searchPeople(companyName);
  await sleep(RATE_LIMIT_MS);

  if (people.length === 0) return [];

  const contacts: ApolloContact[] = [];

  for (const person of people.slice(0, 3)) {
    // Get enriched data for email/phone
    let enriched = person;
    if (person.id && !person.email) {
      enriched = await enrichPerson(person.id);
      await sleep(RATE_LIMIT_MS);
      if (!enriched) enriched = person;
    }

    contacts.push({
      firstName: enriched.first_name || "",
      lastName: enriched.last_name || "",
      title: enriched.title || "",
      email: enriched.email || "",
      phone: enriched.phone_numbers?.[0]?.sanitized_number || enriched.phone || "",
      linkedinUrl: enriched.linkedin_url || "",
      companyDomain: enriched.organization?.primary_domain || "",
      apolloId: enriched.id || "",
    });
  }

  return contacts;
}

// ── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const limitArg = args.indexOf("--limit") !== -1 ? parseInt(args[args.indexOf("--limit") + 1], 10) : Infinity;
const skipEnriched = args.includes("--skip-enriched");

async function main() {
  if (!APOLLO_API_KEY) {
    console.error("Missing APOLLO_API_KEY environment variable");
    process.exit(1);
  }

  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`Enriched prospects not found: ${INPUT_PATH}`);
    console.error("Run: npx tsx scripts/enrich-companies-house.ts");
    process.exit(1);
  }

  const prospects: EnrichedProspect[] = JSON.parse(fs.readFileSync(INPUT_PATH, "utf-8"));
  console.log(`Loaded ${prospects.length} enriched prospects`);

  // Filter to those with Companies House data (more likely to find in Apollo)
  const withCH = prospects.filter((p) => p.companiesHouse);
  console.log(`${withCH.length} with Companies House data`);

  // Load existing contacts data if available
  let existingMap = new Map<string, ContactEnrichedProspect>();
  if (fs.existsSync(OUTPUT_PATH)) {
    const existing: ContactEnrichedProspect[] = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    existingMap = new Map(existing.map((e) => [e.normalisedName, e]));
    console.log(`Found ${existingMap.size} previously enriched contacts`);
  }

  let processed = 0;
  let withContacts = 0;
  let skipped = 0;
  const results: ContactEnrichedProspect[] = [];

  for (const prospect of prospects) {
    // Skip if no CH data
    if (!prospect.companiesHouse) {
      results.push({
        ...prospect,
        contacts: [],
        apolloEnrichedAt: "",
      });
      continue;
    }

    if (processed >= limitArg) {
      results.push({
        ...prospect,
        contacts: existingMap.get(prospect.normalisedName)?.contacts || [],
        apolloEnrichedAt: existingMap.get(prospect.normalisedName)?.apolloEnrichedAt || "",
      });
      continue;
    }

    // Skip if already enriched
    if (skipEnriched && existingMap.has(prospect.normalisedName)) {
      results.push(existingMap.get(prospect.normalisedName)!);
      skipped++;
      continue;
    }

    process.stdout.write(
      `  [${processed + 1}/${Math.min(withCH.length, limitArg)}] ${prospect.companyName.slice(0, 45)}... `
    );

    try {
      const contacts = await findContacts(prospect);
      results.push({
        ...prospect,
        contacts,
        apolloEnrichedAt: new Date().toISOString(),
      });

      if (contacts.length > 0) {
        const emails = contacts.filter((c) => c.email).length;
        console.log(`${contacts.length} contacts (${emails} emails)`);
        withContacts++;
      } else {
        console.log("no contacts found");
      }
      processed++;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`ERROR: ${msg.slice(0, 80)}`);
      results.push({
        ...prospect,
        contacts: [],
        apolloEnrichedAt: new Date().toISOString(),
      });
      processed++;
    }
  }

  // Save
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf-8");

  const totalContacts = results.reduce((sum, r) => sum + r.contacts.length, 0);
  const totalEmails = results.reduce(
    (sum, r) => sum + r.contacts.filter((c) => c.email).length,
    0
  );

  console.log(`\n--- Done ---`);
  console.log(`Processed: ${processed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`With contacts: ${withContacts}`);
  console.log(`Total contacts: ${totalContacts}`);
  console.log(`Total emails: ${totalEmails}`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
