/**
 * Location Entity Variants (Bradley Benner / Semantic Mastery methodology)
 *
 * For each town we serve, this file records the entity variants Wikipedia
 * itself uses for that place — drawn from the page title, bolded text in
 * the lead, and the "What links here" redirect list. We pair them with the
 * containing administrative areas (district / county / region / country)
 * and the official list of neighbourhoods / suburbs.
 *
 * The location template uses these variants to produce DIFFERENT phrasing
 * at the URL → SEO title → H1 → H2 → H3 levels rather than repeating the
 * same phrase, which is the core Benner principle for entity-based
 * geographic SEO.
 *
 * Coverage is intentionally incremental — populated for the towns/counties
 * where Google Search Console has shown high impressions but low CTR (the
 * "ranking but not clicking" cohort). The template falls back to generic
 * patterns for towns not listed here.
 */

export interface TownEntity {
  /** Primary entity term — Wikipedia page title */
  primary: string;
  /** Wikipedia bolded variants + redirect titles (in priority order) */
  variants: string[];
  /** "Best", "leading", "top-rated", "specialist" — pick one per H1 */
  triggerWord: string;
  /** Containing administrative units */
  district?: string;
  county: string;
  /** Wikipedia region (West Midlands region, North West England, etc.) */
  region: string;
  country: "England" | "Scotland" | "Wales" | "Northern Ireland";
  /** Local neighbourhoods / suburbs / areas — used as H3 list */
  neighbourhoods: string[];
  /** A handful of landmarks for body copy local-trust signals */
  landmarks: string[];
  /** Short factual line for SEO title fallback (e.g. "West Coast Main Line town") */
  shortDescriptor?: string;
}

export interface CountyEntity {
  primary: string;
  variants: string[];
  region: string;
  country: "England" | "Scotland" | "Wales" | "Northern Ireland";
  /** "Non-metropolitan county", "Ceremonial county", "Metropolitan county" — for body copy */
  countyType: string;
  /** Largest settlement — useful for body copy */
  largestSettlement?: string;
}

// ─── Towns ────────────────────────────────────────────────────────────────

export const TOWN_ENTITIES: Record<string, TownEntity> = {
  // staffordshire/stafford
  "staffordshire/stafford": {
    primary: "Stafford",
    variants: [
      "Stafford",
      "Stafford, Staffordshire",
      "the county town of Staffordshire",
      "Stafford town",
      "Stafford, England",
    ],
    triggerWord: "specialist",
    district: "Borough of Stafford",
    county: "Staffordshire",
    region: "West Midlands",
    country: "England",
    neighbourhoods: [
      "Baswich",
      "Beaconside",
      "Castlefields",
      "Coppenhall",
      "Doxey",
      "Forebridge",
      "Highfields",
      "Holmcroft",
      "Hyde Lea",
      "Littleworth",
      "Moss Pit",
      "Parkside",
      "Rickerscote",
      "Silkmore",
      "Tillington",
      "Walton on the Hill",
      "Wildwood",
    ],
    landmarks: [
      "Stafford Castle",
      "Ancient High House",
      "Shire Hall",
      "St Chad's Church",
      "Shugborough Hall",
    ],
    shortDescriptor: "West Coast Main Line town",
  },

  // nottinghamshire/nottingham
  "nottinghamshire/nottingham": {
    primary: "Nottingham",
    variants: [
      "Nottingham",
      "the City of Nottingham",
      "Nottingham, Nottinghamshire",
      "Nottingham, East Midlands",
      "Nottingham city",
    ],
    triggerWord: "specialist",
    district: "City of Nottingham",
    county: "Nottinghamshire",
    region: "East Midlands",
    country: "England",
    neighbourhoods: [
      "The Lace Market",
      "Hockley",
      "The Park Estate",
      "West Bridgford",
      "Beeston",
      "Sherwood",
      "Mapperley",
      "Wollaton",
      "Lenton",
      "Radford",
      "Hyson Green",
      "St Ann's",
      "Sneinton",
      "Carrington",
    ],
    landmarks: [
      "Nottingham Castle",
      "Old Market Square",
      "Wollaton Hall",
      "the Lace Market",
      "Trent Bridge",
    ],
    shortDescriptor: "East Midlands core city",
  },

  // dorset/poole
  "dorset/poole": {
    primary: "Poole",
    variants: [
      "Poole",
      "the Borough of Poole",
      "Poole, Dorset",
      "Poole harbourside",
      "Poole, England",
    ],
    triggerWord: "specialist",
    district: "Bournemouth, Christchurch and Poole",
    county: "Dorset",
    region: "South West",
    country: "England",
    neighbourhoods: [
      "Sandbanks",
      "Canford Cliffs",
      "Branksome Park",
      "Lilliput",
      "Parkstone",
      "Penn Hill",
      "Hamworthy",
      "Oakdale",
      "Broadstone",
      "Creekmoor",
      "Canford Heath",
      "Newtown",
      "Holes Bay",
      "Lower Parkstone",
    ],
    landmarks: [
      "Poole Harbour",
      "Sandbanks peninsula",
      "Brownsea Island",
      "Poole Quay",
      "Compton Acres",
    ],
    shortDescriptor: "south coast harbour town",
  },

  // east-riding-of-yorkshire/hull
  "east-riding-of-yorkshire/hull": {
    primary: "Kingston upon Hull",
    variants: [
      "Hull",
      "Kingston upon Hull",
      "the city of Hull",
      "Hull, East Yorkshire",
      "Hull, Yorkshire",
    ],
    triggerWord: "specialist",
    district: "Kingston upon Hull City Council area",
    county: "East Riding of Yorkshire",
    region: "Yorkshire and the Humber",
    country: "England",
    neighbourhoods: [
      "the Old Town",
      "the Marina",
      "Hessle Road",
      "Anlaby Road",
      "Newland Avenue",
      "Beverley Road",
      "Holderness Road",
      "Sutton",
      "Bransholme",
      "Orchard Park",
      "Avenues Conservation Area",
      "Princes Avenue",
      "Spring Bank",
      "Hessle",
      "Cottingham",
    ],
    landmarks: [
      "the Humber Bridge",
      "Hull Marina",
      "The Deep aquarium",
      "Hull Minster",
      "the Old Town",
    ],
    shortDescriptor: "Humber estuary port city",
  },

  // hampshire/portsmouth
  "hampshire/portsmouth": {
    primary: "Portsmouth",
    variants: [
      "Portsmouth",
      "the city of Portsmouth",
      "Portsmouth, Hampshire",
      "Portsmouth city",
      "Portsea Island",
    ],
    triggerWord: "specialist",
    district: "Portsmouth City Council area",
    county: "Hampshire",
    region: "South East",
    country: "England",
    neighbourhoods: [
      "Old Portsmouth",
      "Southsea",
      "Portsea",
      "Landport",
      "Buckland",
      "Fratton",
      "Milton",
      "North End",
      "Hilsea",
      "Copnor",
      "Eastney",
      "Cosham",
      "Drayton",
      "Farlington",
      "Paulsgrove",
    ],
    landmarks: [
      "Portsmouth Historic Dockyard",
      "Spinnaker Tower",
      "Gunwharf Quays",
      "Southsea Castle",
      "HMS Victory",
    ],
    shortDescriptor: "south coast naval city",
  },

  // west-midlands/wolverhampton
  "west-midlands/wolverhampton": {
    primary: "Wolverhampton",
    variants: [
      "Wolverhampton",
      "the city of Wolverhampton",
      "Wolverhampton, West Midlands",
      "Wolverhampton, Staffordshire", // historic — useful entity association
      "the City of Wolverhampton",
    ],
    triggerWord: "specialist",
    district: "City of Wolverhampton Council area",
    county: "West Midlands",
    region: "West Midlands",
    country: "England",
    neighbourhoods: [
      "Bilston",
      "Tettenhall",
      "Wednesfield",
      "Penn",
      "Whitmore Reans",
      "Blakenhall",
      "Bushbury",
      "Compton",
      "Heath Town",
      "Park Village",
      "Oxley",
      "Fallings Park",
      "Merry Hill",
      "Finchfield",
      "Low Hill",
    ],
    landmarks: [
      "St Peter's Collegiate Church",
      "Molineux Stadium",
      "the Grand Theatre",
      "Wolverhampton Art Gallery",
      "Bantock House",
    ],
    shortDescriptor: "Black Country cathedral city",
  },

  // essex/harlow
  "essex/harlow": {
    primary: "Harlow",
    variants: [
      "Harlow",
      "Harlow New Town",
      "Harlow, Essex",
      "the Borough of Harlow",
      "Harlow town",
    ],
    triggerWord: "specialist",
    district: "Harlow District",
    county: "Essex",
    region: "East of England",
    country: "England",
    neighbourhoods: [
      "Old Harlow",
      "Church Langley",
      "Newhall",
      "Mark Hall",
      "Netteswell",
      "Little Parndon",
      "Great Parndon",
      "Latton Bush",
      "Tye Green",
      "Sumners",
      "Bush Fair",
      "Staple Tye",
      "Potter Street",
      "Kingsmoor",
    ],
    landmarks: [
      "the Town Park",
      "Harlow Mill",
      "the Gibberd Garden",
      "Harlow sculpture trail",
      "Mark Hall Cycle Museum",
    ],
    shortDescriptor: "M11 corridor new town",
  },

  // oxfordshire/oxford
  "oxfordshire/oxford": {
    primary: "Oxford",
    variants: [
      "Oxford",
      "the City of Oxford",
      "Oxford, Oxfordshire",
      "Oxford city",
      "the City of Dreaming Spires",
    ],
    triggerWord: "leading",
    district: "Oxford City Council area",
    county: "Oxfordshire",
    region: "South East",
    country: "England",
    neighbourhoods: [
      "Jericho",
      "Summertown",
      "Cowley",
      "Headington",
      "Marston",
      "Iffley",
      "Wolvercote",
      "Botley",
      "St Clement's",
      "Grandpont",
      "New Hinksey",
      "Florence Park",
      "East Oxford",
      "North Oxford",
      "Blackbird Leys",
    ],
    landmarks: [
      "the University of Oxford",
      "the Radcliffe Camera",
      "Christ Church",
      "the Bodleian Library",
      "the Oxford Castle quarter",
    ],
    shortDescriptor: "Thames Valley university city",
  },
};

// ─── Counties ────────────────────────────────────────────────────────────

export const COUNTY_ENTITIES: Record<string, CountyEntity> = {
  staffordshire: {
    primary: "Staffordshire",
    variants: ["Staffordshire", "Staffs", "the county of Staffordshire"],
    region: "West Midlands",
    country: "England",
    countyType: "Non-metropolitan and ceremonial county",
    largestSettlement: "Stoke-on-Trent",
  },
  nottinghamshire: {
    primary: "Nottinghamshire",
    variants: ["Nottinghamshire", "Notts", "the county of Nottinghamshire"],
    region: "East Midlands",
    country: "England",
    countyType: "Non-metropolitan and ceremonial county",
    largestSettlement: "Nottingham",
  },
  dorset: {
    primary: "Dorset",
    variants: ["Dorset", "the county of Dorset"],
    region: "South West",
    country: "England",
    countyType: "Ceremonial county",
    largestSettlement: "Bournemouth",
  },
  "east-riding-of-yorkshire": {
    primary: "the East Riding of Yorkshire",
    variants: [
      "the East Riding of Yorkshire",
      "East Yorkshire",
      "the East Riding",
    ],
    region: "Yorkshire and the Humber",
    country: "England",
    countyType: "Non-metropolitan and ceremonial county",
    largestSettlement: "Kingston upon Hull",
  },
  hampshire: {
    primary: "Hampshire",
    variants: ["Hampshire", "Hants", "the county of Hampshire"],
    region: "South East",
    country: "England",
    countyType: "Non-metropolitan and ceremonial county",
    largestSettlement: "Southampton",
  },
  "west-midlands": {
    primary: "the West Midlands",
    variants: [
      "the West Midlands",
      "the West Midlands metropolitan county",
      "the Black Country & Birmingham conurbation",
    ],
    region: "West Midlands",
    country: "England",
    countyType: "Metropolitan and ceremonial county",
    largestSettlement: "Birmingham",
  },
  essex: {
    primary: "Essex",
    variants: ["Essex", "the county of Essex"],
    region: "East of England",
    country: "England",
    countyType: "Non-metropolitan and ceremonial county",
    largestSettlement: "Southend-on-Sea",
  },
  oxfordshire: {
    primary: "Oxfordshire",
    variants: ["Oxfordshire", "Oxon", "the county of Oxfordshire"],
    region: "South East",
    country: "England",
    countyType: "Non-metropolitan and ceremonial county",
    largestSettlement: "Oxford",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────

export function getTownEntity(
  countySlug: string,
  townSlug: string
): TownEntity | undefined {
  return TOWN_ENTITIES[`${countySlug}/${townSlug}`];
}

export function getCountyEntity(countySlug: string): CountyEntity | undefined {
  return COUNTY_ENTITIES[countySlug];
}

/**
 * Service entity variants — used to ensure URL slug, SEO title, H1, and H2
 * use different phrasing for the same underlying service.
 */
export const SERVICE_ENTITY_VARIANTS: Record<
  string,
  { canonical: string; h1: string; h2: string; meta: string; body: string }
> = {
  "commercial-mortgages": {
    canonical: "Commercial Mortgages",
    h1: "Commercial Mortgage Broker",
    h2: "Commercial Property Finance",
    meta: "Commercial Mortgages",
    body: "commercial property lending",
  },
  "development-finance": {
    canonical: "Development Finance",
    h1: "Property Development Finance",
    h2: "Senior Development Lending",
    meta: "Development Finance",
    body: "development funding",
  },
  "bridging-loans": {
    canonical: "Bridging Loans",
    h1: "Bridging Finance",
    h2: "Short-Term Property Lending",
    meta: "Bridging Loans",
    body: "bridging credit",
  },
  "mezzanine-finance": {
    canonical: "Mezzanine Finance",
    h1: "Mezzanine Property Funding",
    h2: "Second-Charge Development Capital",
    meta: "Mezzanine Finance",
    body: "mezzanine capital",
  },
  "equity-jv": {
    canonical: "Equity & Joint Ventures",
    h1: "Equity & JV Partners",
    h2: "Property Joint Venture Capital",
    meta: "Equity & JV",
    body: "equity capital and joint venture funding",
  },
  "refurbishment-finance": {
    canonical: "Refurbishment Finance",
    h1: "Property Refurbishment Loans",
    h2: "Light & Heavy Refurb Funding",
    meta: "Refurbishment Finance",
    body: "refurbishment lending",
  },
  "development-exit-finance": {
    canonical: "Development Exit Finance",
    h1: "Development Exit Bridging",
    h2: "Post-Practical-Completion Refinance",
    meta: "Development Exit Finance",
    body: "exit refinance",
  },
};

export function getServiceVariants(slug: string) {
  return SERVICE_ENTITY_VARIANTS[slug];
}
