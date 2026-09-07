/**
 * Owner resolution: planning applicant → company → decision-maker with a work email.
 *
 * Routes, in order of confidence:
 *   A. Applicant is a company  → Companies House (optional) for number / office /
 *      directors, then Apollo free search by organisation name, filtered to
 *      senior titles with has_email, then a single credit-costing enrich by ID.
 *   B. Applicant is a named individual → Companies House officer search to find
 *      an active property-company directorship near the site, then route A on
 *      that company; the director's own name is matched against Apollo's
 *      obfuscated surnames before any enrich.
 *   C. Agent (architect / planning consultant) → route A on the agent company,
 *      tagged as `agent` so it can be excluded or sent a different intro.
 *
 * Personal (non-work) emails are never revealed or used.
 */

import { ApolloClient, DECISION_MAKER_TITLES, companyNamesMatch, matchesObfuscatedSurname, titleLooksSenior, type ApolloSearchPerson } from "./apollo";
import { CompaniesHouseClient, type AssociatedCompany, type ChCompany, type ChPsc } from "./companies-house";

export type ContactRole = "owner" | "director" | "agent";
export type Confidence = "high" | "medium" | "low";

export interface ResolvedContact {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  emailStatus: string;
  linkedinUrl: string;
  companyName: string;
  companyDomain: string;
  role: ContactRole;
  confidence: Confidence;
  apolloId: string;
}

export interface OwnerResolution {
  applicantRaw: string;
  applicantKind: "company" | "individual" | "unknown";
  ownerCompany: ChCompany | null;
  ownerCompanyName: string;
  contacts: ResolvedContact[];
  /** People behind the owner company and their other active companies (from Companies House). */
  pscs: ChPsc[];
  associatedCompanies: AssociatedCompany[];
  agentCompanyName: string;
  outcome:
    | "owner_contact"
    | "agent_contact"
    | "owner_identified_no_email"
    | "no_applicant"
    | "excluded_organisation"
    | "unresolved";
  notes: string[];
}

export interface ResolveInput {
  applicantName: string;
  applicantCompany: string;
  agentName: string;
  agentCompany: string;
  sitePostcodeDistrict: string;
}

const NON_APPLICANTS = /^(c\/o|care of|n\/?a|not available|none|the occupier|owner|occupier|in administration|withheld|[-&.,\s]+)$/i;

/** Strip portal artefacts such as a leading "Agent Address" label or stray separators. */
export function cleanPartyName(raw: string): string {
  let s = (raw ?? "").replace(/\s+/g, " ").trim();
  s = s.replace(/^(agent|applicant)\s+(address|name)\s*:?\s*/i, "");
  s = s.replace(/^[-&.,\s]+|[-&.,\s]+$/g, "");
  if (NON_APPLICANTS.test(s)) return "";
  // A bare address (starts with a number / house name + road) is not a party name.
  if (/^\d+[a-z]?\s/i.test(s) && /\b(road|street|lane|avenue|close|drive|way|barn|farm|house)\b/i.test(s) && !isCompanyName(s)) return "";
  return s;
}
const TITLE_PREFIX = /^(mr|mrs|ms|miss|dr|prof|sir|lady|lord|rev|cllr)\.?\s+/i;
const COMPANY_HINT =
  /\b(ltd|limited|llp|plc|inc|corp|group|holdings|partners|partnership|developments?|properties|property|homes|construction|building|builders|estates?|investments?|capital|ventures|trust|council|association|housing|society|church|school|college|university|nhs|foundation|charity|ltd\.)\b/i;

export function isCompanyName(name: string): boolean {
  return COMPANY_HINT.test(name ?? "");
}

/** Volume housebuilders, housing associations, public bodies and retailers: not cold-email prospects. */
export function isExcludedOrganisation(name: string): boolean {
  if (!name) return false;
  if (looksLikeInstitution(name)) return true;
  return /\b(plc|homes england|development corporation|housing group|housing association|housing society|housing trust|clarion|l&q|peabody|places for people|sanctuary|orbit|sovereign|guinness partnership|taylor wimpey|vistry|barratt|bdw|persimmon|bellway|redrow|berkeley|crest nicholson|countryside|bloor|cala|miller homes|keepmoat|avant|wates|kier|galliford|morgan sindall|balfour beatty|laing|lovell|waitrose|john lewis|tesco|sainsbury|asda|aldi|lidl|morrisons|co-op|mcdonald|lloyds|barclays|hsbc|natwest|santander|nationwide|network rail|national grid|university|nhs|council)\b/i.test(name);
}

export function looksLikeInstitution(name: string): boolean {
  return /\b(council|borough|county|nhs|trust|university|college|school|church|diocese|parish|housing association|homes association|police|fire|network rail|national grid|highways|ministry|department|crown|duchy)\b/i.test(name ?? "");
}

/** "Mr and Mrs Jonathan and Sue Goodwin" → first person "Jonathan Goodwin". */
export function extractPersonName(raw: string): { firstName: string; lastName: string } | null {
  let s = (raw ?? "").replace(/\s+/g, " ").trim();
  if (!s || NON_APPLICANTS.test(s)) return null;
  s = s.replace(/\((.*?)\)/g, " ").trim(); // drop "(ABC Ltd)"
  s = s.replace(/\b(mr|mrs|ms|miss|dr|prof|sir|lady|lord|rev|cllr)\.?\s*(and|&)\s*(mr|mrs|ms|miss|dr)\.?\s*/gi, "");
  s = s.replace(TITLE_PREFIX, "").replace(TITLE_PREFIX, "");
  s = s.replace(/\b(and|&)\b.*$/i, (m) => {
    // "Jonathan and Sue Goodwin" → keep first forename + surname
    const surname = m.trim().split(/\s+/).pop() ?? "";
    return ` ${surname}`;
  });
  const tokens = s.split(/\s+/).filter((t) => /^[A-Za-z'’-]{2,}$/.test(t));
  if (tokens.length < 2) return null;
  const firstName = tokens[0];
  const lastName = tokens[tokens.length - 1];
  if (firstName.length < 2 || lastName.length < 2) return null;
  return { firstName: cap(firstName), lastName: cap(lastName) };
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * Company name from an applicant string. Handles:
 *   "Mr J Smith (ABC Developments Ltd)"  → ABC Developments Ltd
 *   "BARRY Vistry Group"                 → Vistry Group   (portal puts a forename first)
 *   "Capital&Centric - Martin Crews"     → Capital&Centric (company - person)
 *   "c/o Agent Homes Ltd"                → Agent Homes Ltd
 */
export function extractCompanyName(applicantName: string, applicantCompany: string): string {
  if (applicantCompany && !NON_APPLICANTS.test(applicantCompany)) return applicantCompany.trim();
  let raw = (applicantName ?? "").replace(/\s+/g, " ").trim();
  if (!raw || NON_APPLICANTS.test(raw)) return "";

  const bracket = raw.match(/\(([^)]{3,})\)\s*$/);
  if (bracket && isCompanyName(bracket[1])) return bracket[1].trim();

  // "Company - Person" or "Person - Company"
  const dash = raw.split(/\s+[-–]\s+/);
  if (dash.length === 2) {
    const [left, right] = dash;
    if (isCompanyName(left) || (!isCompanyName(right) && extractPersonName(right))) return left.trim();
    if (isCompanyName(right)) return right.trim();
  }

  raw = raw.replace(/^(c\/o|care of)\s+/i, "").trim();
  if (!isCompanyName(raw)) return "";

  // Drop a leading forename ("BARRY Vistry Group", "Mr Martin Crews Capital Homes Ltd") when the rest is still a company.
  const tokens = raw.split(" ");
  let start = 0;
  while (start < tokens.length - 1) {
    const t = tokens[start];
    const isTitle = TITLE_PREFIX.test(`${t} x`);
    const isCapsForename = /^[A-Z]{2,}$/.test(t) && !COMPANY_HINT.test(t) && !/&/.test(t);
    const rest = tokens.slice(start + 1).join(" ");
    const distinctive = rest.split(" ").filter((w) => !/^(ltd|limited|plc|llp|inc|corp)\.?$/i.test(w));
    // "BARRY Vistry Group" → "Vistry Group"; but "BDW Trading Ltd" keeps its acronym, since "Trading Ltd" is not a name.
    if ((isTitle || isCapsForename) && isCompanyName(rest) && distinctive.length >= 2) {
      start++;
      continue;
    }
    break;
  }
  return tokens.slice(start).join(" ").trim();
}

/** Agent strings that are really the housebuilder / developer rather than an architect or consultant. */
export function agentLooksLikeDeveloper(agent: string): boolean {
  if (!agent || NON_APPLICANTS.test(agent)) return false;
  if (/\b(architect|architecture|architectural|design|planning|consultan|surveyor|chartered|associates|studio|partnership llp|engineering|drawing|drafting)\b/i.test(agent)) return false;
  return /\b(homes|housing|developments?|developers?|construction|build(ers|ing)?|properties|property|estates|land|living|regeneration|group plc)\b/i.test(agent);
}

function emptyResult(applicantRaw: string, notes: string[]): OwnerResolution {
  return { applicantRaw, applicantKind: "unknown", ownerCompany: null, ownerCompanyName: "", contacts: [], pscs: [], associatedCompanies: [], agentCompanyName: "", outcome: "unresolved", notes };
}

export class OwnerResolver {
  constructor(
    private readonly apollo: ApolloClient | null,
    private readonly ch: CompaniesHouseClient | null,
    private readonly opts: { includeAgents: boolean; maxContactsPerCompany: number } = { includeAgents: false, maxContactsPerCompany: 2 }
  ) {}

  async resolve(rawInput: ResolveInput): Promise<OwnerResolution> {
    const notes: string[] = [];
    const input: ResolveInput = {
      ...rawInput,
      applicantName: cleanPartyName(rawInput.applicantName),
      applicantCompany: cleanPartyName(rawInput.applicantCompany),
      agentName: cleanPartyName(rawInput.agentName),
      agentCompany: cleanPartyName(rawInput.agentCompany),
    };
    const applicantRaw = (input.applicantCompany || input.applicantName || "").trim();
    if (applicantRaw && isExcludedOrganisation(applicantRaw)) {
      // Checked on the raw string, before any name parsing: "Homes England" is not a person.
      return { ...emptyResult(applicantRaw, notes), applicantKind: "company", ownerCompanyName: applicantRaw, outcome: "excluded_organisation", notes: [`applicant is an excluded organisation (${applicantRaw}); no lookups made`] };
    }
    const companyName = extractCompanyName(input.applicantName, input.applicantCompany);
    const person = companyName ? null : extractPersonName(input.applicantName);
    const agentCompanyName = (input.agentCompany || (isCompanyName(input.agentName) ? input.agentName : "")).trim();

    const result: OwnerResolution = {
      applicantRaw,
      applicantKind: companyName ? "company" : person ? "individual" : "unknown",
      ownerCompany: null,
      ownerCompanyName: companyName,
      contacts: [],
      pscs: [],
      associatedCompanies: [],
      agentCompanyName,
      outcome: "unresolved",
      notes,
    };

    if (!applicantRaw && !agentCompanyName) {
      result.outcome = "no_applicant";
      return result;
    }

    if (companyName && isExcludedOrganisation(companyName)) {
      // Plc housebuilders, housing associations, public bodies, retailers: no Companies House
      // or Apollo calls at all, so nothing is spent on a lead we would never send.
      notes.push(`applicant is an excluded organisation (${companyName}); no lookups made`);
      result.ownerCompanyName = companyName;
      result.outcome = "excluded_organisation";
      return result;
    }

    // Route A: company applicant
    if (companyName) {
      await this.resolveCompany(companyName, null, "owner", result);
    }

    // Route B: individual applicant → directorship → company
    if (!companyName && person && this.ch) {
      try {
        const company = await this.ch.resolveIndividual(`${person.firstName} ${person.lastName}`, input.sitePostcodeDistrict);
        if (company) {
          notes.push(`individual ${person.firstName} ${person.lastName} linked to ${company.companyName} (${company.companyNumber}) via Companies House officer search`);
          result.ownerCompany = company;
          result.ownerCompanyName = company.companyName;
          await this.resolveCompany(company.companyName, person, "director", result);
        } else {
          notes.push("individual applicant: no active property-company directorship found near the site");
        }
      } catch (err) {
        notes.push(`Companies House officer search failed: ${(err as Error).message}`);
      }
    } else if (!companyName && person && !this.ch) {
      notes.push("individual applicant: Companies House key not set, using Apollo name search only");
    }

    // Route B': named individual → Apollo free name search. Accepted only when the first name
    // matches exactly, the obfuscated surname fits, and the person is senior or works at a
    // property business (or at the agent company, which usually means an in-house planner).
    if (!companyName && person && result.contacts.length === 0 && this.apollo) {
      const known = [result.ownerCompanyName, ...result.associatedCompanies.map((a) => a.companyName)].filter(Boolean);
      await this.resolveIndividualViaApollo(person, agentCompanyName, result, known);
    }

    // Route C: agent. When the "agent" is itself a housebuilder (Jones Homes, Vistry...) it IS the
    // developer and is treated as an owner contact; otherwise only with --include-agents.
    if (result.contacts.length === 0 && agentCompanyName && !isExcludedOrganisation(agentCompanyName)) {
      if (agentLooksLikeDeveloper(agentCompanyName)) {
        notes.push(`agent "${agentCompanyName}" looks like the developer, treating as owner`);
        if (!result.ownerCompanyName) result.ownerCompanyName = agentCompanyName;
        await this.resolveCompany(agentCompanyName, null, "owner", result);
      } else if (this.opts.includeAgents) {
        await this.resolveCompany(agentCompanyName, null, "agent", result);
      }
    }

    if (result.contacts.some((c) => c.role !== "agent")) result.outcome = "owner_contact";
    else if (result.contacts.length > 0) result.outcome = "agent_contact";
    else if (result.ownerCompany || result.ownerCompanyName) result.outcome = "owner_identified_no_email";
    else result.outcome = "unresolved";
    return result;
  }

  private async resolveIndividualViaApollo(
    person: { firstName: string; lastName: string },
    agentCompanyName: string,
    result: OwnerResolution,
    knownCompanies: string[] = []
  ): Promise<void> {
    const notes = result.notes;
    if (!this.apollo) return;
    const fullName = `${person.firstName} ${person.lastName}`;
    let people: ApolloSearchPerson[] = [];
    try {
      people = await this.apollo.searchPeople({ keywords: fullName, perPage: 10 });
    } catch (err) {
      notes.push(`Apollo name search failed: ${(err as Error).message}`);
      return;
    }

    // Only organisations that plausibly own or build residential schemes. Generic "invest",
    // "capital" or "planning" matched asset managers, solicitors and consultancies.
    const propertyOrg = /\b(develop|propert|homes?\b|housing|estates?\b|\bland\b|construct|build|regeneration|realty|residential|living|lettings?|surveyors?|contractors?)/i;
    const matches = people
      .filter((p) => p.first_name?.toLowerCase() === person.firstName.toLowerCase())
      .filter((p) => matchesObfuscatedSurname(p.last_name_obfuscated ?? p.last_name, person.lastName))
      .map((p) => {
        const org = p.organization?.name ?? "";
        const atAgent = agentCompanyName ? companyNamesMatch(org, agentCompanyName) : false;
        // The person's own Companies House companies (the SPV, or anything else they direct) are the strongest signal.
        const atKnown = knownCompanies.some((k) => companyNamesMatch(org, k));
        const senior = titleLooksSenior(p.title);
        const property = propertyOrg.test(org) || atKnown;
        // A namesake with a senior title at an unrelated business is the classic false positive,
        // so a property-sector organisation (or the application's own agent) is mandatory.
        let confidence: Confidence | null = null;
        if (atAgent || atKnown || (senior && property)) confidence = "high";
        else if (property) confidence = "medium";
        if (isExcludedOrganisation(org)) confidence = null; // decided on the free payload, before any credit
        return { p, confidence, org };
      })
      .filter((m) => m.confidence !== null) as Array<{ p: ApolloSearchPerson; confidence: Confidence; org: string }>;

    if (matches.length === 0) {
      notes.push(`Apollo name search "${fullName}": ${people.length} results, none matching name + property/senior signals`);
      return;
    }
    if (matches.length > 1 && matches.every((m) => m.confidence !== "high")) {
      notes.push(`Apollo name search "${fullName}": ${matches.length} ambiguous matches (${matches.map((m) => m.org).join(", ")}), skipped`);
      return;
    }

    const best = matches.sort((a, b) => (a.confidence === "high" ? -1 : 1) - (b.confidence === "high" ? -1 : 1))[0];
    if (!best.p.has_email) {
      notes.push(`Apollo: ${fullName} found at ${best.org} but no email on record`);
      if (!result.ownerCompanyName) result.ownerCompanyName = best.org;
      return;
    }
    if (this.apollo.enrichmentBudgetRemaining <= 0) {
      notes.push("Apollo enrichment budget for this run exhausted");
      return;
    }
    try {
      const enriched = await this.apollo.enrichById(best.p.id);
      if (!enriched?.email || /email_not_unlocked/i.test(enriched.email)) {
        notes.push(`Apollo enrich ${fullName}: no work email returned`);
        return;
      }
      if (!result.ownerCompanyName) result.ownerCompanyName = enriched.organization?.name ?? best.org;
      notes.push(`Apollo: ${fullName} matched as ${enriched.title ?? best.p.title ?? ""} at ${enriched.organization?.name ?? best.org} (${best.confidence})`);
      result.contacts.push({
        firstName: enriched.first_name ?? person.firstName,
        lastName: enriched.last_name ?? person.lastName,
        title: enriched.title ?? best.p.title ?? "",
        email: enriched.email.toLowerCase(),
        emailStatus: enriched.email_status ?? "",
        linkedinUrl: enriched.linkedin_url ?? "",
        companyName: enriched.organization?.name ?? best.org,
        companyDomain: enriched.organization?.primary_domain ?? "",
        role: "director",
        confidence: best.confidence,
        apolloId: enriched.id,
      });
    } catch (err) {
      notes.push(`Apollo enrich failed: ${(err as Error).message}`);
    }
  }

  /**
   * SPVs are rarely in Apollo. Walk Companies House instead: the SPV's directors and
   * individual PSCs, then each person's other active companies (their trading vehicle
   * or group), and look those people up in Apollo by name and by those companies.
   */
  private async resolveViaDirectorGraph(
    ch: ChCompany | null,
    knownPerson: { firstName: string; lastName: string } | null,
    role: ContactRole,
    result: OwnerResolution,
    spvName: string
  ): Promise<void> {
    const notes = result.notes;
    if (!this.apollo) return;

    let people: Array<{ firstName: string; lastName: string }> = knownPerson ? [knownPerson] : [];
    let associated: AssociatedCompany[] = result.associatedCompanies;
    if (ch && this.ch) {
      try {
        const graph = await this.ch.expandGraph(ch, { maxPeople: 3, maxCompanies: 8 });
        result.pscs = graph.pscs;
        associated = graph.associated;
        result.associatedCompanies = associated;
        const pscPeople = graph.pscs.filter((p) => /individual/.test(p.kind) && p.firstName && p.lastName).map((p) => ({ firstName: p.firstName, lastName: p.lastName }));
        for (const d of ch.directors) if (d.firstName && d.lastName) people.push({ firstName: d.firstName, lastName: d.lastName });
        for (const p of pscPeople) if (!people.some((x) => x.firstName === p.firstName && x.lastName === p.lastName)) people.push(p);
        notes.push(`Companies House graph: ${people.length} people, ${associated.length} associated companies${associated.length ? ` (${associated.slice(0, 4).map((a) => a.companyName).join("; ")})` : ""}`);
      } catch (err) {
        notes.push(`Companies House graph failed: ${(err as Error).message}`);
      }
    }
    people = people.slice(0, 3);
    if (people.length === 0 && associated.length === 0) return;

    const knownCompanies = [spvName, ...(ch ? [ch.companyName] : []), ...associated.map((a) => a.companyName)];

    // 1. People by name, accepted when Apollo places them at one of their own companies or a property business.
    for (const person of people) {
      if (result.contacts.length >= this.opts.maxContactsPerCompany) break;
      await this.resolveIndividualViaApollo(person, "", result, knownCompanies);
    }
    if (result.contacts.length > 0) return;

    // 2. Associated companies by organisation (property-like first), matched back to the same people.
    for (const assoc of associated.filter((a) => a.propertyLike && !isExcludedOrganisation(a.companyName)).slice(0, 4)) {
      if (result.contacts.length >= this.opts.maxContactsPerCompany) break;
      let found: ApolloSearchPerson[] = [];
      try {
        found = await this.apollo.searchPeople({ organizationName: assoc.companyName, perPage: 10 });
      } catch (err) {
        notes.push(`Apollo search failed for ${assoc.companyName}: ${(err as Error).message}`);
        continue;
      }
      const there = found.filter((p) => companyNamesMatch(p.organization?.name ?? "", assoc.companyName) && p.has_email && !isExcludedOrganisation(p.organization?.name ?? ""));
      const match = there.find((p) => people.some((d) => p.first_name?.toLowerCase() === d.firstName.toLowerCase() && matchesObfuscatedSurname(p.last_name_obfuscated ?? p.last_name, d.lastName)))
        ?? there.find((p) => titleLooksSenior(p.title));
      if (!match) continue;
      if (this.apollo.enrichmentBudgetRemaining <= 0) {
        notes.push("Apollo enrichment budget for this run exhausted");
        return;
      }
      try {
        const enriched = await this.apollo.enrichById(match.id);
        if (!enriched?.email || /email_not_unlocked/i.test(enriched.email)) continue;
        const isDirector = people.some((d) => enriched.first_name?.toLowerCase() === d.firstName.toLowerCase());
        notes.push(`Apollo: ${enriched.name} found at associated company ${assoc.companyName} (${isDirector ? "director of the SPV" : "senior title"})`);
        result.contacts.push({
          firstName: enriched.first_name ?? match.first_name ?? "",
          lastName: enriched.last_name ?? "",
          title: enriched.title ?? match.title ?? "",
          email: enriched.email.toLowerCase(),
          emailStatus: enriched.email_status ?? "",
          linkedinUrl: enriched.linkedin_url ?? "",
          companyName: enriched.organization?.name ?? assoc.companyName,
          companyDomain: enriched.organization?.primary_domain ?? "",
          role: role === "agent" ? "agent" : "director",
          confidence: isDirector ? "high" : "medium",
          apolloId: enriched.id,
        });
      } catch (err) {
        notes.push(`Apollo enrich failed: ${(err as Error).message}`);
      }
    }
  }

  private async resolveCompany(
    companyName: string,
    knownPerson: { firstName: string; lastName: string } | null,
    role: ContactRole,
    result: OwnerResolution
  ): Promise<void> {
    const notes = result.notes;

    // Companies House first: registered office + directors give us the letter route and names to match.
    let ch: ChCompany | null = result.ownerCompany;
    if (!ch && this.ch && role !== "agent") {
      try {
        ch = await this.ch.resolveByName(companyName);
        if (ch) {
          notes.push(`Companies House: ${ch.companyName} (${ch.companyNumber}, ${ch.matchConfidence}, ${ch.directors.length} directors)`);
          result.ownerCompany = ch;
          result.ownerCompanyName = ch.companyName;
        } else {
          notes.push(`Companies House: no confident match for "${companyName}"`);
        }
      } catch (err) {
        notes.push(`Companies House lookup failed: ${(err as Error).message}`);
      }
    }

    if (!this.apollo) {
      notes.push("Apollo key not set: no contact discovery");
      return;
    }

    const searchName = ch?.companyName || companyName;
    if (isExcludedOrganisation(searchName)) {
      notes.push(`${searchName} is an excluded organisation; no Apollo search`);
      return;
    }
    let people: ApolloSearchPerson[] = [];
    try {
      people = await this.apollo.searchPeople({ organizationName: searchName, titles: DECISION_MAKER_TITLES, perPage: 10 });
      if (people.length === 0) {
        people = await this.apollo.searchPeople({ organizationName: searchName, perPage: 10 });
      }
    } catch (err) {
      notes.push(`Apollo search failed: ${(err as Error).message}`);
      return;
    }

    // Keep only people whose organisation actually matches the applicant company (and is not excluded).
    // Everything from here to the enrich call works on the free search payload, so credits are only
    // spent on a person who has already passed the organisation and title / director-name gates.
    const atCompany = people.filter((p) => companyNamesMatch(p.organization?.name ?? "", searchName) && !isExcludedOrganisation(p.organization?.name ?? ""));
    if (atCompany.length === 0) {
      notes.push(`Apollo: ${people.length} results for "${searchName}", none at a matching organisation`);
      await this.resolveViaDirectorGraph(ch, knownPerson, role, result, searchName);
      return;
    }

    const directorNames = knownPerson ? [knownPerson] : (ch?.directors ?? []).map((d) => ({ firstName: d.firstName, lastName: d.lastName }));

    const scored = atCompany
      .filter((p) => p.has_email)
      .map((p) => {
        let score = 0;
        let confidence: Confidence = "low";
        const nameMatch = directorNames.find(
          (d) => d.firstName && p.first_name?.toLowerCase() === d.firstName.toLowerCase() && matchesObfuscatedSurname(p.last_name_obfuscated ?? p.last_name, d.lastName)
        );
        if (nameMatch) {
          score += 10;
          confidence = "high";
        }
        if (titleLooksSenior(p.title)) {
          score += 3;
          if (confidence === "low") confidence = "medium";
        }
        if (knownPerson && !nameMatch) score -= 5;
        return { p, score, confidence };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.opts.maxContactsPerCompany);

    if (scored.length === 0) {
      notes.push(`Apollo: people found at ${searchName} but none with an email and a senior title / director-name match`);
      return;
    }

    for (const { p, confidence } of scored) {
      if (this.apollo.enrichmentBudgetRemaining <= 0) {
        notes.push("Apollo enrichment budget for this run exhausted");
        break;
      }
      try {
        const person = await this.apollo.enrichById(p.id);
        if (!person?.email || /email_not_unlocked/i.test(person.email)) {
          notes.push(`Apollo enrich ${p.first_name} ${p.last_name_obfuscated ?? ""}: no work email returned`);
          continue;
        }
        if (person.email_status && /invalid|unavailable/i.test(person.email_status)) {
          notes.push(`Apollo enrich ${person.name}: email status ${person.email_status}, skipped`);
          continue;
        }
        result.contacts.push({
          firstName: person.first_name ?? p.first_name ?? "",
          lastName: person.last_name ?? "",
          title: person.title ?? p.title ?? "",
          email: person.email.toLowerCase(),
          emailStatus: person.email_status ?? "",
          linkedinUrl: person.linkedin_url ?? "",
          companyName: person.organization?.name ?? searchName,
          companyDomain: person.organization?.primary_domain ?? "",
          role,
          confidence,
          apolloId: person.id,
        });
      } catch (err) {
        notes.push(`Apollo enrich failed: ${(err as Error).message}`);
      }
    }
  }
}
