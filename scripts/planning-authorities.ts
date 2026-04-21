/**
 * Planning Authority Configuration
 *
 * Maps UK local authorities that use Civica Portal360 to our internal
 * town/county structure. Supports three Civica schema families:
 *   - PBDC: St Albans-style field names (ref_no, proposal, etc.)
 *   - GFPlanning: Generic SText/SPicklist field names (Chelmsford, Ashfield)
 *   - PLANNINGCASE: Descriptive field names (Great Yarmouth)
 *
 * The normaliseFields() function maps all schemas to the PBDC canonical format
 * so downstream processing code works identically regardless of source.
 */

// ─── Types ───────────────────────────────────────────────────

export type SchemaFamily = "pbdc" | "gfplanning" | "planningcase";
export type RefType = "PBDC" | "GFPlanning" | "PLANNINGCASE";

export interface AuthorityTown {
  townSlug: string;
  countySlug: string;
}

export interface PlanningAuthority {
  /** Short unique identifier, e.g. "st-albans" */
  id: string;
  /** Full council name */
  name: string;
  /** Portal base URL (no trailing slash) */
  baseUrl: string;
  /** API endpoint path */
  apiPath: string;
  /** Civica refType parameter */
  refType: RefType;
  /** Schema family for field normalisation */
  schemaFamily: SchemaFamily;
  /** Which towns in our site this authority covers */
  towns: AuthorityTown[];
  /** Date field name used in search filters */
  searchDateField: string;
  /** Whether this authority is enabled for fetching */
  enabled: boolean;
}

// ─── Authority Registry ──────────────────────────────────────

export const PLANNING_AUTHORITIES: PlanningAuthority[] = [
  // ── PBDC Schema ────────────────────────────────────────────

  {
    id: "st-albans",
    name: "St Albans City and District Council",
    baseUrl: "https://planningapplications.stalbans.gov.uk",
    apiPath: "/w2webparts/Resource/Civica/Handler.ashx/keyobject/pagedsearch",
    refType: "PBDC",
    schemaFamily: "pbdc",
    towns: [
      { townSlug: "st-albans", countySlug: "hertfordshire" },
      { townSlug: "harpenden", countySlug: "hertfordshire" },
    ],
    searchDateField: "received_date",
    enabled: true,
  },
  {
    id: "lewes-eastbourne",
    name: "Lewes and Eastbourne Councils",
    baseUrl: "https://padocs.lewes-eastbourne.gov.uk",
    apiPath: "/civica/Resource/Civica/Handler.ashx/keyobject/pagedsearch",
    refType: "PBDC",
    schemaFamily: "pbdc",
    towns: [
      { townSlug: "lewes", countySlug: "east-sussex" },
      { townSlug: "eastbourne", countySlug: "east-sussex" },
      { townSlug: "peacehaven", countySlug: "east-sussex" },
      { townSlug: "seaford", countySlug: "east-sussex" },
      { townSlug: "newhaven", countySlug: "east-sussex" },
    ],
    searchDateField: "received_date",
    enabled: true,
  },

  // ── GFPlanning Schema ──────────────────────────────────────

  {
    id: "chelmsford",
    name: "Chelmsford City Council",
    baseUrl: "https://planning.chelmsford.gov.uk",
    apiPath: "/w2webparts/Resource/Civica/Handler.ashx/keyobject/pagedsearch",
    refType: "GFPlanning",
    schemaFamily: "gfplanning",
    towns: [{ townSlug: "chelmsford", countySlug: "essex" }],
    searchDateField: "SDate5",
    enabled: true,
  },

  // ── PLANNINGCASE Schema ────────────────────────────────────

  {
    id: "great-yarmouth",
    name: "Great Yarmouth Borough Council",
    baseUrl: "https://portal.great-yarmouth.gov.uk",
    apiPath: "/civica/Resource/Civica/Handler.ashx/keyobject/pagedsearch",
    refType: "PLANNINGCASE",
    schemaFamily: "planningcase",
    towns: [{ townSlug: "great-yarmouth", countySlug: "norfolk" }],
    searchDateField: "DateRcvd",
    enabled: true,
  },

  // ── Disabled (to be probed/tested) ─────────────────────────

  {
    id: "ashfield",
    name: "Ashfield District Council",
    baseUrl: "https://planning.ashfield.gov.uk",
    apiPath: "/civica/Resource/Civica/Handler.ashx/keyobject/pagedsearch",
    refType: "GFPlanning",
    schemaFamily: "gfplanning",
    towns: [{ townSlug: "sutton-in-ashfield", countySlug: "nottinghamshire" }],
    searchDateField: "SDate1", // Valid Date — Ashfield doesn't have SDate5
    enabled: true,
  },
  {
    id: "waverley",
    name: "Waverley Borough Council",
    baseUrl: "https://planning360.waverley.gov.uk",
    apiPath: "/w2webparts/Resource/Civica/Handler.ashx/keyobject/pagedsearch",
    refType: "PBDC",
    schemaFamily: "pbdc",
    towns: [
      { townSlug: "godalming", countySlug: "surrey" },
      { townSlug: "farnham", countySlug: "surrey" },
      { townSlug: "haslemere", countySlug: "surrey" },
      { townSlug: "cranleigh", countySlug: "surrey" },
    ],
    searchDateField: "received_date",
    enabled: false,
  },
  {
    id: "waltham-forest",
    name: "London Borough of Waltham Forest",
    baseUrl: "https://planning.walthamforest.gov.uk",
    apiPath: "/w2webparts/Resource/Civica/Handler.ashx/keyobject/pagedsearch",
    refType: "PBDC",
    schemaFamily: "pbdc",
    towns: [{ townSlug: "walthamstow", countySlug: "greater-london" }],
    searchDateField: "received_date",
    enabled: false,
  },
  {
    id: "maldon",
    name: "Maldon District Council",
    baseUrl: "https://cdp.maldon.gov.uk",
    apiPath: "/w2webparts/Resource/Civica/Handler.ashx/keyobject/pagedsearch",
    refType: "GFPlanning",
    schemaFamily: "gfplanning",
    towns: [{ townSlug: "maldon", countySlug: "essex" }],
    searchDateField: "SDate5",
    enabled: false, // Connection refused from this network — needs investigation
  },
  {
    id: "harrow",
    name: "London Borough of Harrow",
    baseUrl: "https://planning.harrow.gov.uk",
    apiPath: "/w2webparts/Resource/Civica/Handler.ashx/keyobject/pagedsearch",
    refType: "PBDC",
    schemaFamily: "pbdc",
    towns: [{ townSlug: "harrow", countySlug: "greater-london" }],
    searchDateField: "received_date",
    enabled: false,
  },
  {
    id: "tandridge",
    name: "Tandridge District Council",
    baseUrl: "https://plandocs.tandridge.gov.uk",
    apiPath: "/w2webparts/Resource/Civica/Handler.ashx/keyobject/pagedsearch",
    refType: "GFPlanning",
    schemaFamily: "gfplanning",
    towns: [{ townSlug: "oxted", countySlug: "surrey" }],
    searchDateField: "SDate5",
    enabled: false, // API ignores date filters — returns all 249K records unfiltered
  },
  // NOTE: Reigate & Banstead uses Idox Public Access, NOT Civica Portal360.
  // Requires a different scraping approach. Removed from this registry.
  // {
  //   id: "reigate-banstead",
  //   name: "Reigate and Banstead Borough Council",
  //   baseUrl: "https://planning.reigate-banstead.gov.uk",
  //   ...
  // },
];

// ─── Lookup Helpers ──────────────────────────────────────────

/** Get a single authority by ID */
export function getAuthority(id: string): PlanningAuthority | undefined {
  return PLANNING_AUTHORITIES.find((a) => a.id === id);
}

/** Get all enabled authorities */
export function getEnabledAuthorities(): PlanningAuthority[] {
  return PLANNING_AUTHORITIES.filter((a) => a.enabled);
}

// ─── Field Normalisation ─────────────────────────────────────

/**
 * Normalise raw Civica API field names to the canonical PBDC format.
 *
 * The existing process-planning-data.ts expects PBDC-style field names
 * (ref_no, proposal, app_type, etc.). This function maps GFPlanning and
 * PLANNINGCASE schemas into that same shape so all downstream processing
 * works identically regardless of source authority.
 */
export function normaliseFields(
  raw: Record<string, string>,
  schemaFamily: SchemaFamily,
  authority: PlanningAuthority
): Record<string, string> {
  switch (schemaFamily) {
    case "pbdc":
      // Already in canonical format — pass through
      return { ...raw };

    case "gfplanning":
      return normaliseGFPlanning(raw, authority);

    case "planningcase":
      return normalisePlanningCase(raw, authority);

    default:
      throw new Error(`Unknown schema family: ${schemaFamily}`);
  }
}

function normaliseGFPlanning(
  raw: Record<string, string>,
  authority: PlanningAuthority
): Record<string, string> {
  // GFPlanning uses generic field names — each council maps them differently.
  // Common fields: SDescription (ref), SDate1 (valid), SDate3 (decision),
  // SDate5 (received), AText6 (postcode), APicklist2 (ward), APicklist3 (parish).
  //
  // Varying fields by council:
  //   Chelmsford: SText9=address, SText1=applicant, SText2=agent, SPicklist5=app_type
  //   Ashfield:   ApplicationAddress=address, SText1=applicant, SText3=agent, SPicklist1=app_type
  //   Tandridge:  (similar to Chelmsford, TBC)
  //   Maldon:     (similar to Chelmsford, TBC)
  //
  // Strategy: try the most specific/derived field first, fall back to generic.

  // Address: prefer ApplicationAddress (derived), then SText9, then concatenate AText1-5
  let address = raw.ApplicationAddress || raw.SText9 || "";
  if (!address) {
    const parts = [
      raw.AText1 || "",
      raw.AText2 || "",
      raw.AText3 || "",
      raw.AText4 || "",
      raw.AText5 || "",
    ].filter(Boolean);
    address = parts.join(", ");
  }

  return {
    ref_no: raw.SDescription || "",
    planning_portal_ref_no: "",
    // Proposal: SText10 is common, Proposal is a derived field on some councils
    proposal: raw.SText10 || raw.Proposal || "",
    // App type: SPicklist5 (Chelmsford) or SPicklist1 (Ashfield) — try both
    app_type: raw.SPicklist5 || raw.SPicklist1 || "",
    app_status: "",
    decision_notice_type: raw.SPicklist2 || "",
    received_date: raw.SDate5 || raw.SDate1 || "", // SDate5 (Chelmsford) or SDate1 (Ashfield)
    valid_date: raw.SDate1 || "",
    decision_date: raw.SDate3 || "",
    expiry_date: "",
    ward: raw.APicklist2 || "",
    parish: raw.APicklist3 || "",
    case_officer: raw.SPicklist3 || "",
    ApplicantContactNoName: raw.SText1 || "",
    // Agent: SText2 (Chelmsford) or SText3 (Ashfield) — try both
    AgentContactNoName: raw.SText2 || raw.SText3 || "",
    application_address: address,
    UPRNDisplay: raw.ANumeric1 || "",
    site_area: "",
    KeyNo: raw.KeyNumber || "",
    postcode: raw.AText6 || "",
    // Preserve the source authority for URL generation
    _authority_id: authority.id,
    _base_url: authority.baseUrl,
    _ref_type: authority.refType,
  };
}

function normalisePlanningCase(
  raw: Record<string, string>,
  authority: PlanningAuthority
): Record<string, string> {
  // Concatenate location lines into a single address
  const addressParts = [
    raw.LocationLine1 || "",
    raw.LocationLine2 || "",
    raw.LocationLine3 || "",
    raw.LocationLine4 || "",
    raw.LocationLine5 || "",
    raw.LocationPostcode || "",
  ].filter(Boolean);
  const fullAddress = addressParts.join(", ");

  return {
    ref_no: raw.KeyNo || "",
    planning_portal_ref_no: "",
    proposal: raw.DevelopmentDescription || "",
    app_type: raw.Type || "",
    app_status: "",
    decision_notice_type: raw.Decision || "",
    received_date: raw.DateRcvd || "",
    valid_date: raw.DateAccepted || "",
    decision_date: raw.DateDecision || "",
    expiry_date: "",
    ward: raw.WDP || "",
    parish: "",
    case_officer: raw.Officer || "",
    ApplicantContactNoName: raw.ApplicantName || "",
    AgentContactNoName: raw.AgentName || "",
    application_address: fullAddress,
    UPRNDisplay: "",
    site_area: "",
    KeyNo: raw.KeyNo || "",
    postcode: raw.LocationPostcode || "",
    // Preserve the source authority for URL generation
    _authority_id: authority.id,
    _base_url: authority.baseUrl,
    _ref_type: authority.refType,
  };
}
