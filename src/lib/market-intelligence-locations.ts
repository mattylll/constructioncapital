/**
 * Strategic Top-50 Locations for Market Intelligence Reports
 *
 * Curated list balancing UK regional coverage, brand-priority cities, and
 * data availability. Each entry's `countySlug`/`townSlug` must match the
 * paths used in data/generated/{planning,sold-data,town-stats}.
 *
 * Used by:
 *   - scripts/generate-market-intelligence.ts (article generation)
 *   - src/app/market-intelligence/[town]/page.tsx (page rendering)
 *   - src/app/market-intelligence/page.tsx (index)
 */

export interface MarketIntelligenceLocation {
  /** URL slug — used for /market-intelligence/[slug] */
  slug: string;
  /** Display name */
  name: string;
  /** Maps to data/generated/.../countySlug/townSlug/... */
  countySlug: string;
  townSlug: string;
  /** Display county for breadcrumbs / schema */
  county: string;
  /** Regional grouping for index page */
  region:
    | "london"
    | "south-east"
    | "south-west"
    | "midlands"
    | "north-west"
    | "north-east"
    | "yorkshire"
    | "east-anglia"
    | "wales";
  /** UK city tier — drives page weighting + internal-link priority */
  tier: 1 | 2 | 3;
}

export const TOP_50_LOCATIONS: MarketIntelligenceLocation[] = [
  // ─── London (10) ─────────────────────────────────────────────────────────
  { slug: "croydon", name: "Croydon", countySlug: "greater-london", townSlug: "croydon", county: "Greater London", region: "london", tier: 1 },
  { slug: "lewisham", name: "Lewisham", countySlug: "greater-london", townSlug: "lewisham", county: "Greater London", region: "london", tier: 1 },
  { slug: "brixton", name: "Brixton (Lambeth)", countySlug: "greater-london", townSlug: "brixton", county: "Greater London", region: "london", tier: 1 },
  { slug: "southwark", name: "Southwark", countySlug: "greater-london", townSlug: "southwark", county: "Greater London", region: "london", tier: 1 },
  { slug: "hackney", name: "Hackney", countySlug: "greater-london", townSlug: "hackney", county: "Greater London", region: "london", tier: 1 },
  { slug: "tower-hamlets", name: "Tower Hamlets", countySlug: "greater-london", townSlug: "tower-hamlets", county: "Greater London", region: "london", tier: 1 },
  { slug: "wandsworth", name: "Wandsworth", countySlug: "greater-london", townSlug: "wandsworth", county: "Greater London", region: "london", tier: 1 },
  { slug: "walthamstow", name: "Walthamstow", countySlug: "greater-london", townSlug: "walthamstow", county: "Greater London", region: "london", tier: 2 },
  { slug: "ealing", name: "Ealing", countySlug: "greater-london", townSlug: "ealing", county: "Greater London", region: "london", tier: 1 },
  { slug: "camden", name: "Camden", countySlug: "greater-london", townSlug: "camden", county: "Greater London", region: "london", tier: 1 },

  // ─── Major Regional Cities (15) ─────────────────────────────────────────
  { slug: "manchester", name: "Manchester", countySlug: "greater-manchester", townSlug: "manchester", county: "Greater Manchester", region: "north-west", tier: 1 },
  { slug: "birmingham", name: "Birmingham", countySlug: "west-midlands", townSlug: "birmingham", county: "West Midlands", region: "midlands", tier: 1 },
  { slug: "liverpool", name: "Liverpool", countySlug: "merseyside", townSlug: "liverpool", county: "Merseyside", region: "north-west", tier: 1 },
  { slug: "leeds", name: "Leeds", countySlug: "west-yorkshire", townSlug: "leeds", county: "West Yorkshire", region: "yorkshire", tier: 1 },
  { slug: "sheffield", name: "Sheffield", countySlug: "south-yorkshire", townSlug: "sheffield", county: "South Yorkshire", region: "yorkshire", tier: 1 },
  { slug: "newcastle", name: "Newcastle upon Tyne", countySlug: "tyne-and-wear", townSlug: "newcastle", county: "Tyne and Wear", region: "north-east", tier: 1 },
  { slug: "bristol", name: "Bristol", countySlug: "bristol", townSlug: "bristol-city-centre", county: "Bristol", region: "south-west", tier: 1 },
  { slug: "nottingham", name: "Nottingham", countySlug: "nottinghamshire", townSlug: "nottingham", county: "Nottinghamshire", region: "midlands", tier: 1 },
  { slug: "leicester", name: "Leicester", countySlug: "leicestershire", townSlug: "leicester", county: "Leicestershire", region: "midlands", tier: 1 },
  { slug: "coventry", name: "Coventry", countySlug: "west-midlands", townSlug: "coventry", county: "West Midlands", region: "midlands", tier: 1 },
  { slug: "cardiff", name: "Cardiff", countySlug: "cardiff", townSlug: "cardiff-city-centre", county: "Cardiff", region: "wales", tier: 1 },
  { slug: "cambridge", name: "Cambridge", countySlug: "cambridgeshire", townSlug: "cambridge", county: "Cambridgeshire", region: "east-anglia", tier: 2 },
  { slug: "oxford", name: "Oxford", countySlug: "oxfordshire", townSlug: "oxford", county: "Oxfordshire", region: "south-east", tier: 2 },
  { slug: "bradford", name: "Bradford", countySlug: "west-yorkshire", townSlug: "bradford", county: "West Yorkshire", region: "yorkshire", tier: 2 },
  { slug: "sunderland", name: "Sunderland", countySlug: "tyne-and-wear", townSlug: "sunderland", county: "Tyne and Wear", region: "north-east", tier: 2 },

  // ─── South & Growth Markets (10) ────────────────────────────────────────
  { slug: "bath", name: "Bath", countySlug: "somerset", townSlug: "bath", county: "Somerset", region: "south-west", tier: 2 },
  { slug: "brighton", name: "Brighton", countySlug: "sussex", townSlug: "brighton", county: "East Sussex", region: "south-east", tier: 2 },
  { slug: "reading", name: "Reading", countySlug: "berkshire", townSlug: "reading", county: "Berkshire", region: "south-east", tier: 2 },
  { slug: "portsmouth", name: "Portsmouth", countySlug: "hampshire", townSlug: "portsmouth", county: "Hampshire", region: "south-east", tier: 2 },
  { slug: "southampton", name: "Southampton", countySlug: "hampshire", townSlug: "southampton", county: "Hampshire", region: "south-east", tier: 2 },
  { slug: "bournemouth", name: "Bournemouth", countySlug: "dorset", townSlug: "bournemouth", county: "Dorset", region: "south-west", tier: 2 },
  { slug: "guildford", name: "Guildford", countySlug: "surrey", townSlug: "guildford", county: "Surrey", region: "south-east", tier: 2 },
  { slug: "woking", name: "Woking", countySlug: "surrey", townSlug: "woking", county: "Surrey", region: "south-east", tier: 3 },
  { slug: "winchester", name: "Winchester", countySlug: "hampshire", townSlug: "winchester", county: "Hampshire", region: "south-east", tier: 3 },
  { slug: "watford", name: "Watford", countySlug: "hertfordshire", townSlug: "watford", county: "Hertfordshire", region: "south-east", tier: 2 },

  // ─── East / Midlands (8) ────────────────────────────────────────────────
  { slug: "norwich", name: "Norwich", countySlug: "norfolk", townSlug: "norwich", county: "Norfolk", region: "east-anglia", tier: 2 },
  { slug: "peterborough", name: "Peterborough", countySlug: "cambridgeshire", townSlug: "peterborough", county: "Cambridgeshire", region: "east-anglia", tier: 2 },
  { slug: "colchester", name: "Colchester", countySlug: "essex", townSlug: "colchester", county: "Essex", region: "east-anglia", tier: 3 },
  { slug: "chelmsford", name: "Chelmsford", countySlug: "essex", townSlug: "chelmsford", county: "Essex", region: "east-anglia", tier: 3 },
  { slug: "york", name: "York", countySlug: "north-yorkshire", townSlug: "york", county: "North Yorkshire", region: "yorkshire", tier: 2 },
  { slug: "derby", name: "Derby", countySlug: "derbyshire", townSlug: "derby", county: "Derbyshire", region: "midlands", tier: 2 },
  { slug: "stoke", name: "Stoke-on-Trent", countySlug: "staffordshire", townSlug: "stoke-on-trent", county: "Staffordshire", region: "midlands", tier: 2 },
  { slug: "bedford", name: "Bedford", countySlug: "bedfordshire", townSlug: "bedford", county: "Bedfordshire", region: "east-anglia", tier: 2 },

  // ─── North-West / Northern (7) ──────────────────────────────────────────
  { slug: "chester", name: "Chester", countySlug: "cheshire", townSlug: "chester", county: "Cheshire", region: "north-west", tier: 2 },
  { slug: "warrington", name: "Warrington", countySlug: "cheshire", townSlug: "warrington", county: "Cheshire", region: "north-west", tier: 3 },
  { slug: "preston", name: "Preston", countySlug: "lancashire", townSlug: "preston", county: "Lancashire", region: "north-west", tier: 2 },
  { slug: "blackpool", name: "Blackpool", countySlug: "lancashire", townSlug: "blackpool", county: "Lancashire", region: "north-west", tier: 3 },
  { slug: "stockport", name: "Stockport", countySlug: "greater-manchester", townSlug: "stockport", county: "Greater Manchester", region: "north-west", tier: 2 },
  { slug: "bolton", name: "Bolton", countySlug: "greater-manchester", townSlug: "bolton", county: "Greater Manchester", region: "north-west", tier: 3 },
  { slug: "hull", name: "Hull", countySlug: "east-riding-of-yorkshire", townSlug: "hull", county: "East Riding of Yorkshire", region: "yorkshire", tier: 2 },
];

if (TOP_50_LOCATIONS.length !== 50) {
  throw new Error(`Expected 50 locations, got ${TOP_50_LOCATIONS.length}`);
}
