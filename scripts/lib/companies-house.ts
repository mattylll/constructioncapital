/**
 * Companies House public data API (free, 600 requests / 5 minutes).
 * Env: COMPANIES_HOUSE_API_KEY (register at
 * https://developer.company-information.service.gov.uk/).
 *
 * Optional in the outreach pipeline: when absent, owner resolution falls back
 * to Apollo's free organisation-name search only.
 */

const BASE = "https://api.company-information.service.gov.uk";

export interface ChAddress {
  addressLine1: string;
  addressLine2: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface ChOfficer {
  name: string; // "SMITH, John Michael" as returned
  firstName: string;
  lastName: string;
  role: string;
  appointedOn: string;
  /** "/officers/{id}/appointments" — the director's other companies. */
  appointmentsLink?: string;
}

export interface ChPsc {
  name: string;
  firstName: string;
  lastName: string;
  kind: string; // individual-person-with-significant-control | corporate-entity-... | legal-person-...
  naturesOfControl: string[];
  companyNumber?: string; // for corporate PSCs where CH links the identification
}

/** Another company a director / PSC sits on: the way in to SPV owners who are not in Apollo. */
export interface AssociatedCompany {
  companyNumber: string;
  companyName: string;
  companyStatus: string;
  role: string;
  appointedOn: string;
  viaPerson: string; // "John Smith"
  propertyLike: boolean;
}

export interface ChCompany {
  companyNumber: string;
  companyName: string;
  companyStatus: string;
  companyType: string;
  incorporationDate: string;
  sicCodes: string[];
  registeredOffice: ChAddress | null;
  directors: ChOfficer[];
  matchConfidence: "exact" | "fuzzy" | "sic-match" | "officer-link";
}

export const PROPERTY_SIC_CODES = new Set([
  "41100", "41201", "41202", "68100", "68201", "68209", "68310", "68320",
  "43110", "43120", "43990", "64209", "70100", "68200",
]);

const PROPERTY_NAME_HINT =
  /\b(develop|propert|homes|estates|land|construct|build|housing|invest|capital|ventures|realty|residential|living|dwellings)/i;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** "SMITH, John Michael" → { firstName: "John", lastName: "Smith" } */
export function splitOfficerName(raw: string): { firstName: string; lastName: string } {
  const [surname, forenames] = (raw ?? "").split(",").map((s) => s.trim());
  if (forenames) {
    const first = forenames.split(/\s+/).filter((t) => !/^(mr|mrs|ms|miss|dr|sir|prof)\.?$/i.test(t))[0] ?? "";
    return { firstName: titleCase(first), lastName: titleCase(surname) };
  }
  const parts = (raw ?? "").split(/\s+/).filter(Boolean);
  return { firstName: titleCase(parts[0] ?? ""), lastName: titleCase(parts[parts.length - 1] ?? "") };
}

/** "Mr Matthew Aaron Lenzie" → { firstName: "Matthew", lastName: "Lenzie" } */
export function splitPscName(raw: string): { firstName: string; lastName: string } {
  const parts = (raw ?? "").split(/\s+/).filter((t) => t && !/^(mr|mrs|ms|miss|dr|sir|prof|lady|lord)\.?$/i.test(t));
  return { firstName: titleCase(parts[0] ?? ""), lastName: titleCase(parts[parts.length - 1] ?? "") };
}

function titleCase(s: string): string {
  return s.toLowerCase().replace(/(^|[\s'-])([a-z])/g, (_, p, c) => p + c.toUpperCase());
}

function toAddress(a: Record<string, string> | undefined): ChAddress | null {
  if (!a) return null;
  return {
    addressLine1: a.address_line_1 ?? a.premises ?? "",
    addressLine2: a.address_line_2 ?? "",
    locality: a.locality ?? "",
    region: a.region ?? "",
    postalCode: a.postal_code ?? "",
    country: a.country ?? "",
  };
}

export class CompaniesHouseClient {
  constructor(private readonly apiKey: string) {
    if (!apiKey) throw new Error("CompaniesHouseClient: missing API key");
  }

  private async get<T>(endpoint: string): Promise<T | null> {
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch(`${BASE}${endpoint}`, {
        headers: { Authorization: `Basic ${Buffer.from(`${this.apiKey}:`).toString("base64")}` },
      });
      if (res.status === 429) {
        await sleep(60_000);
        continue;
      }
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Companies House ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const data = (await res.json()) as T;
      await sleep(550);
      return data;
    }
    return null;
  }

  async searchCompanies(query: string, limit = 5): Promise<Array<Record<string, unknown>>> {
    const data = await this.get<{ items?: Array<Record<string, unknown>> }>(
      `/search/companies?q=${encodeURIComponent(query)}&items_per_page=${limit}`
    );
    return data?.items ?? [];
  }

  async getCompany(companyNumber: string): Promise<ChCompany | null> {
    const profile = await this.get<Record<string, unknown>>(`/company/${companyNumber}`);
    if (!profile) return null;
    const officers = await this.get<{ items?: Array<Record<string, unknown>> }>(
      `/company/${companyNumber}/officers?items_per_page=20`
    );
    const directors: ChOfficer[] = (officers?.items ?? [])
      .filter((o) => !o.resigned_on && /director|llp-member|member/i.test(String(o.officer_role ?? "")))
      .map((o) => {
        const name = String(o.name ?? "");
        const split = splitOfficerName(name);
        const links = o.links as { officer?: { appointments?: string } } | undefined;
        return { name, ...split, role: String(o.officer_role ?? ""), appointedOn: String(o.appointed_on ?? ""), appointmentsLink: links?.officer?.appointments };
      });

    return {
      companyNumber,
      companyName: String(profile.company_name ?? ""),
      companyStatus: String(profile.company_status ?? ""),
      companyType: String(profile.type ?? ""),
      incorporationDate: String(profile.date_of_creation ?? ""),
      sicCodes: (profile.sic_codes as string[] | undefined) ?? [],
      registeredOffice: toAddress(profile.registered_office_address as Record<string, string> | undefined),
      directors,
      matchConfidence: "exact",
    };
  }

  /** Active persons with significant control (beneficial owners). */
  async getPscs(companyNumber: string): Promise<ChPsc[]> {
    const data = await this.get<{ items?: Array<Record<string, unknown>> }>(`/company/${companyNumber}/persons-with-significant-control`);
    return (data?.items ?? [])
      .filter((p) => !p.ceased_on)
      .map((p) => {
        const name = String(p.name ?? "");
        const kind = String(p.kind ?? "");
        const ident = p.identification as { registration_number?: string } | undefined;
        const split = /individual/.test(kind) ? splitPscName(name) : { firstName: "", lastName: "" };
        return { name, ...split, kind, naturesOfControl: (p.natures_of_control as string[] | undefined) ?? [], companyNumber: ident?.registration_number };
      });
  }

  /** A director's other appointments (active, director-level), newest first. */
  async getAppointments(appointmentsLink: string, viaPerson: string, limit = 8): Promise<AssociatedCompany[]> {
    const data = await this.get<{ items?: Array<Record<string, unknown>> }>(`${appointmentsLink}?items_per_page=35`);
    const out: AssociatedCompany[] = [];
    for (const a of data?.items ?? []) {
      if (a.resigned_on) continue;
      const to = a.appointed_to as Record<string, string> | undefined;
      if (!to?.company_number || to.company_status !== "active") continue;
      if (!/director|member/i.test(String(a.officer_role ?? ""))) continue;
      out.push({
        companyNumber: to.company_number,
        companyName: to.company_name ?? "",
        companyStatus: to.company_status,
        role: String(a.officer_role ?? ""),
        appointedOn: String(a.appointed_on ?? ""),
        viaPerson,
        propertyLike: PROPERTY_NAME_HINT.test(to.company_name ?? ""),
      });
    }
    return out.sort((a, b) => Number(b.propertyLike) - Number(a.propertyLike) || b.appointedOn.localeCompare(a.appointedOn)).slice(0, limit);
  }

  /**
   * Widen from one SPV to the people behind it and everything else they run:
   * directors + individual PSCs, then each person's other active companies.
   */
  async expandGraph(company: ChCompany, opts: { maxPeople?: number; maxCompanies?: number } = {}): Promise<{ pscs: ChPsc[]; associated: AssociatedCompany[] }> {
    const pscs = await this.getPscs(company.companyNumber).catch(() => [] as ChPsc[]);
    const associated: AssociatedCompany[] = [];
    const seen = new Set<string>([company.companyNumber]);
    for (const d of company.directors.slice(0, opts.maxPeople ?? 3)) {
      if (!d.appointmentsLink) continue;
      const appts = await this.getAppointments(d.appointmentsLink, `${d.firstName} ${d.lastName}`.trim()).catch(() => [] as AssociatedCompany[]);
      for (const a of appts) {
        if (seen.has(a.companyNumber)) continue;
        seen.add(a.companyNumber);
        associated.push(a);
        if (associated.length >= (opts.maxCompanies ?? 8)) return { pscs, associated };
      }
    }
    return { pscs, associated };
  }

  /** Resolve a company by name: exact title match, else property-SIC match, else first active fuzzy hit. */
  async resolveByName(name: string): Promise<ChCompany | null> {
    const cleaned = name.replace(/\s+/g, " ").trim();
    if (cleaned.length < 3) return null;
    const results = await this.searchCompanies(cleaned, 5);
    if (results.length === 0) return null;

    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
    const target = norm(cleaned);
    let pick: Record<string, unknown> | undefined;
    let confidence: ChCompany["matchConfidence"] = "fuzzy";

    pick = results.find((r) => norm(String(r.title ?? "")) === target);
    if (pick) confidence = "exact";
    if (!pick) {
      pick = results.find((r) => String(r.company_status) === "active" && norm(String(r.title ?? "")).includes(target));
    }
    if (!pick) {
      pick = results.find((r) => String(r.company_status) === "active");
      if (!pick) return null;
      // Fuzzy hits must at least share the leading word or be a property company.
      const leading = target.split(" ")[0];
      const title = norm(String(pick.title ?? ""));
      if (!title.startsWith(leading) && !PROPERTY_NAME_HINT.test(title)) return null;
    }

    const company = await this.getCompany(String(pick.company_number));
    if (!company) return null;
    if (confidence === "fuzzy" && company.sicCodes.some((s) => PROPERTY_SIC_CODES.has(s))) confidence = "sic-match";
    return { ...company, matchConfidence: confidence };
  }

  /**
   * For an individual applicant: find active directorships at property-type
   * companies. Prefers companies whose registered office shares the site's
   * postcode district. Returns at most one company.
   */
  async resolveIndividual(fullName: string, sitePostcodeDistrict: string): Promise<ChCompany | null> {
    const data = await this.get<{ items?: Array<Record<string, unknown>> }>(
      `/search/officers?q=${encodeURIComponent(fullName)}&items_per_page=8`
    );
    const officers = data?.items ?? [];
    const wantedSurname = fullName.trim().split(/\s+/).pop()?.toLowerCase() ?? "";
    const wantedFirst = fullName.trim().split(/\s+/)[0]?.toLowerCase() ?? "";

    const candidates: Array<{ company: ChCompany; score: number }> = [];
    for (const officer of officers.slice(0, 5)) {
      const split = splitOfficerName(String(officer.title ?? ""));
      if (split.lastName.toLowerCase() !== wantedSurname) continue;
      if (wantedFirst && split.firstName && split.firstName.toLowerCase() !== wantedFirst) continue;
      const link = (officer.links as { self?: string } | undefined)?.self;
      if (!link) continue;
      const appts = await this.get<{ items?: Array<Record<string, unknown>> }>(`${link}?items_per_page=20`);
      for (const appt of appts?.items ?? []) {
        if (appt.resigned_on) continue;
        const appointedTo = appt.appointed_to as Record<string, string> | undefined;
        if (!appointedTo?.company_number || appointedTo.company_status !== "active") continue;
        if (!/director|member/i.test(String(appt.officer_role ?? ""))) continue;
        const companyName = appointedTo.company_name ?? "";
        const address = appt.address as Record<string, string> | undefined;
        const district = (address?.postal_code ?? "").toUpperCase().match(/^([A-Z]{1,2}\d[A-Z\d]?)/)?.[1] ?? "";
        let score = 0;
        if (PROPERTY_NAME_HINT.test(companyName)) score += 2;
        if (sitePostcodeDistrict && district === sitePostcodeDistrict) score += 3;
        candidates.push({
          company: {
            companyNumber: appointedTo.company_number,
            companyName,
            companyStatus: appointedTo.company_status,
            companyType: "",
            incorporationDate: "",
            sicCodes: [],
            registeredOffice: toAddress(address),
            directors: [{ name: String(officer.title ?? ""), ...split, role: String(appt.officer_role ?? ""), appointedOn: String(appt.appointed_on ?? "") }],
            matchConfidence: "officer-link",
          },
          score,
        });
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    if (!best || best.score < 2) return null;
    const full = await this.getCompany(best.company.companyNumber);
    if (!full) return best.company;
    if (!full.sicCodes.some((s) => PROPERTY_SIC_CODES.has(s)) && !PROPERTY_NAME_HINT.test(full.companyName)) return null;
    return { ...full, matchConfidence: "officer-link" };
  }
}
