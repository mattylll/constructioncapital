/**
 * Apollo.io client with a strict credit policy.
 *
 * Rules (from Matt, and confirmed against docs.apollo.io):
 *   1. `POST /mixed_people/api_search` costs 0 credits. It returns person IDs,
 *      first names, obfuscated surnames, titles, organisation names and a
 *      `has_email` flag. Use it to confirm a person EXISTS before anything else.
 *   2. `POST /people/match` (enrichment) costs 1 credit when it returns
 *      demographics or an email (plus 8 if a mobile is returned, which we never
 *      request). Calling it with a name that is not in the database still
 *      creates a stub record. So it is ONLY ever called with an `id` obtained
 *      from step 1, and only when `has_email` is true.
 *   3. `mixed_companies/search` costs 1 credit per page and `organizations/enrich`
 *      1 credit per org. Neither is used; organisation lookups go through the
 *      free people search filtered by `q_organization_name`.
 */

const BASE = "https://api.apollo.io/api/v1";

export interface ApolloSearchPerson {
  id: string;
  first_name: string;
  last_name_obfuscated?: string;
  last_name?: string;
  title: string | null;
  has_email: boolean;
  has_direct_phone?: string | boolean;
  organization?: { name?: string; primary_domain?: string } | null;
}

export interface ApolloPerson {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  title: string | null;
  email: string | null;
  email_status: string | null;
  linkedin_url: string | null;
  organization?: { name?: string; primary_domain?: string; website_url?: string } | null;
  city?: string | null;
  country?: string | null;
}

export interface ApolloUsage {
  searches: number;
  enrichments: number;
  creditsUsedEstimate: number;
}

export const DECISION_MAKER_TITLES = [
  "Director",
  "Managing Director",
  "Owner",
  "Founder",
  "Co-Founder",
  "Chief Executive",
  "CEO",
  "Partner",
  "Principal",
  "Development Director",
  "Land Director",
  "Development Manager",
  "Land Manager",
  "Finance Director",
  "Head of Development",
  "Head of Land",
];

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** "Wa***s" matches "Watkins"; "C" matches "C"; empty pattern matches nothing. */
export function matchesObfuscatedSurname(obfuscated: string | undefined, surname: string): boolean {
  if (!obfuscated || !surname) return false;
  const target = surname.toLowerCase().replace(/[^a-z]/g, "");
  const pattern = obfuscated.toLowerCase();
  if (!pattern.includes("*")) return pattern.replace(/[^a-z]/g, "") === target;
  const [head, tail] = pattern.split(/\*+/);
  return target.startsWith(head) && target.endsWith(tail ?? "") && target.length > head.length;
}

export function titleLooksSenior(title: string | null | undefined): boolean {
  if (!title) return false;
  return /\b(director|owner|founder|principal|partner|chief|ceo|managing|head of|md\b|proprietor|chairman|chair\b)/i.test(title);
}

export class ApolloClient {
  readonly usage: ApolloUsage = { searches: 0, enrichments: 0, creditsUsedEstimate: 0 };
  private readonly maxEnrichments: number;

  constructor(
    private readonly apiKey: string,
    opts: { maxEnrichmentsPerRun?: number } = {}
  ) {
    if (!apiKey) throw new Error("ApolloClient: missing API key");
    this.maxEnrichments = opts.maxEnrichmentsPerRun ?? 40;
  }

  get enrichmentBudgetRemaining(): number {
    return Math.max(0, this.maxEnrichments - this.usage.enrichments);
  }

  private async post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    for (let attempt = 0; attempt < 4; attempt++) {
      const res = await fetch(`${BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });
      if (res.status === 429 || res.status >= 500) {
        await sleep(15_000 * (attempt + 1));
        continue;
      }
      const text = await res.text();
      if (!res.ok) throw new Error(`Apollo ${res.status}: ${text.slice(0, 300)}`);
      return JSON.parse(text) as T;
    }
    throw new Error("Apollo: rate limited after retries");
  }

  /** FREE. Confirms who exists at an organisation without spending credits. */
  async searchPeople(params: {
    organizationName?: string;
    keywords?: string;
    titles?: string[];
    perPage?: number;
  }): Promise<ApolloSearchPerson[]> {
    const body: Record<string, unknown> = {
      person_locations: ["United Kingdom"],
      per_page: params.perPage ?? 10,
      page: 1,
    };
    if (params.organizationName) body.q_organization_name = params.organizationName;
    if (params.keywords) body.q_keywords = params.keywords;
    if (params.titles?.length) body.person_titles = params.titles;

    this.usage.searches++;
    const data = await this.post<{ people?: ApolloSearchPerson[] }>("/mixed_people/api_search", body);
    await sleep(350);
    return data.people ?? [];
  }

  /**
   * COSTS 1 CREDIT when an email is found. Only accepts an Apollo person ID
   * returned by `searchPeople`, never a free-text name.
   */
  async enrichById(id: string): Promise<ApolloPerson | null> {
    if (!/^[a-f0-9]{24}$/i.test(id)) throw new Error(`enrichById: refusing non-ID input "${id}"`);
    if (this.enrichmentBudgetRemaining <= 0) return null;

    this.usage.enrichments++;
    const data = await this.post<{ person?: ApolloPerson | null }>("/people/match", {
      id,
      reveal_personal_emails: false,
      reveal_phone_number: false,
    });
    await sleep(350);
    const person = data.person ?? null;
    if (person?.email && !/email_not_unlocked/i.test(person.email)) {
      this.usage.creditsUsedEstimate += 1;
      return person;
    }
    return person;
  }
}

/** Company-name normalisation for comparing an Apollo organisation to a planning applicant. */
export function normaliseCompany(name: string): string {
  return (name ?? "")
    .toLowerCase()
    .replace(/\b(ltd|limited|llp|plc|inc|corp|co|company|group|holdings|uk|the)\b\.?/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * True when the shorter name's tokens appear, in order, inside the longer name
 * ("Ashwood Homes" ⊂ "Ashwood Homes Group Ltd"). Order matters: "James Alexander
 * Engineering" must not match "Alexander James Associates".
 */
export function companyNamesMatch(a: string, b: string): boolean {
  const na = normaliseCompany(a);
  const nb = normaliseCompany(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const ta = na.split(" ").filter((t) => t.length > 1);
  const tb = nb.split(" ").filter((t) => t.length > 1);
  if (ta.length === 0 || tb.length === 0) return false;
  const [short, long] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  let i = 0;
  for (const t of long) if (t === short[i]) i++;
  return i === short.length;
}
