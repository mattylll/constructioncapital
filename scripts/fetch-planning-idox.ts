/**
 * Idox Public Access Planning Data Scraper
 *
 * Fetches planning applications from UK local authorities that use the
 * Idox Public Access portal system (~60-70% of UK councils). Scrapes
 * server-rendered HTML search results, normalises them to the same
 * canonical format as the Civica pipeline, and writes identical output.
 *
 * Usage:
 *   npx tsx scripts/fetch-planning-idox.ts --all                     # All enabled authorities
 *   npx tsx scripts/fetch-planning-idox.ts --authority reigate-banstead  # Single authority
 *   npx tsx scripts/fetch-planning-idox.ts --all --months 6          # Custom date range
 *
 * Output:
 *   data/planning-exports/{authority-id}-raw-api-{date}.json          # Raw normalised data
 *   data/generated/planning/{county}/{town}/latest.json               # Website pipeline JSON
 */

import * as fs from "fs";
import * as path from "path";
import type { AuthorityTown } from "./planning-authorities";

// ─── Configuration ───────────────────────────────────────────

const RESULTS_PER_PAGE = 10; // Idox always returns 10 per page
const THROTTLE_MS = 1500; // ms between HTTP requests (be respectful to HTML portals)
const THROTTLE_BETWEEN_MONTHS_MS = 3000; // Extra pause between monthly searches
const MAX_RETRIES = 3; // Retry failed requests with exponential backoff
const DEFAULT_MONTHS = 12;

// UK-wide fallback medians when local sold data is unavailable
const FALLBACK_MEDIANS: Record<string, number> = {
  detached: 450000,
  semi_detached: 290000,
  terraced: 245000,
  flat: 230000,
  blended: 295000,
};

// ─── Idox Authority Types ────────────────────────────────────

interface IdoxAuthority {
  /** Short unique identifier, e.g. "reigate-banstead" */
  id: string;
  /** Full council name */
  name: string;
  /** Portal base URL (no trailing slash), e.g. "https://planning.reigate-banstead.gov.uk" */
  baseUrl: string;
  /** Which towns in our site this authority covers */
  towns: AuthorityTown[];
  /** Whether this authority is enabled for fetching */
  enabled: boolean;
  /** Override the default "/online-applications" path prefix (e.g. "/publicaccess", "/view") */
  searchPath?: string;
}

/** Returns the Idox path prefix for an authority (default: "/online-applications") */
function idoxPath(authority: IdoxAuthority): string {
  return authority.searchPath ?? "/online-applications";
}

// ─── Idox Authority Registry ─────────────────────────────────

const IDOX_AUTHORITIES: IdoxAuthority[] = [
  {
    id: "reigate-banstead",
    name: "Reigate and Banstead Borough Council",
    baseUrl: "https://planning.reigate-banstead.gov.uk",
    towns: [
      { townSlug: "reigate", countySlug: "surrey" },
      { townSlug: "redhill", countySlug: "surrey" },
    ],
    enabled: true,
  },
  {
    id: "epsom-ewell",
    name: "Epsom and Ewell Borough Council",
    baseUrl: "https://eplanning.epsom-ewell.gov.uk",
    towns: [{ townSlug: "epsom", countySlug: "surrey" }],
    enabled: true,
  },
  {
    id: "mole-valley",
    name: "Mole Valley District Council",
    baseUrl: "https://planningapps.molevalley.gov.uk",
    towns: [
      { townSlug: "dorking", countySlug: "surrey" },
      { townSlug: "leatherhead", countySlug: "surrey" },
    ],
    enabled: false,
  },
  {
    id: "guildford",
    name: "Guildford Borough Council",
    baseUrl: "https://planning.guildford.gov.uk",
    towns: [{ townSlug: "guildford", countySlug: "surrey" }],
    enabled: false,
  },
  // spelthorne moved to "spelthorne-new" with correct publicaccess URL
  {
    id: "elmbridge",
    name: "Elmbridge Borough Council",
    baseUrl: "https://emaps.elmbridge.gov.uk",
    towns: [{ townSlug: "weybridge", countySlug: "surrey" }],
    enabled: false, // 404 on search page
  },

  // ── London Boroughs (Idox Public Access) ──────────────────
  {
    id: "croydon",
    name: "London Borough of Croydon",
    baseUrl: "https://publicaccess3.croydon.gov.uk",
    towns: [{ townSlug: "croydon", countySlug: "greater-london" }],
    enabled: true,
  },
  {
    id: "ealing",
    name: "London Borough of Ealing",
    baseUrl: "https://pam.ealing.gov.uk",
    towns: [{ townSlug: "ealing", countySlug: "greater-london" }],
    enabled: true,
  },
  {
    id: "greenwich",
    name: "Royal Borough of Greenwich",
    baseUrl: "https://planning.royalgreenwich.gov.uk",
    towns: [{ townSlug: "woolwich", countySlug: "greater-london" }],
    enabled: true,
  },
  {
    id: "brent",
    name: "London Borough of Brent",
    baseUrl: "https://pa.brent.gov.uk",
    towns: [{ townSlug: "wembley", countySlug: "greater-london" }],
    enabled: false, // Ref format YY/NNNN has no type suffix — can't classify
  },
  {
    id: "barnet",
    name: "London Borough of Barnet",
    baseUrl: "https://publicaccess.barnet.gov.uk",
    towns: [], // No matching town pages yet
    enabled: false,
  },
  {
    id: "newham",
    name: "London Borough of Newham",
    baseUrl: "https://pa.newham.gov.uk",
    towns: [{ townSlug: "stratford", countySlug: "greater-london" }],
    enabled: true,
  },
  {
    id: "lewisham",
    name: "London Borough of Lewisham",
    baseUrl: "https://planning.lewisham.gov.uk",
    towns: [{ townSlug: "lewisham", countySlug: "greater-london" }],
    enabled: true,
  },
  {
    id: "lambeth",
    name: "London Borough of Lambeth",
    baseUrl: "https://planning.lambeth.gov.uk",
    towns: [{ townSlug: "brixton", countySlug: "greater-london" }],
    enabled: true,
  },
  {
    id: "southwark",
    name: "London Borough of Southwark",
    baseUrl: "https://planning.southwark.gov.uk",
    towns: [{ townSlug: "bermondsey", countySlug: "greater-london" }],
    enabled: true,
  },

  // ── Kent ────────────────────────────────────────────────────
  {
    id: "canterbury",
    name: "Canterbury City Council",
    baseUrl: "https://pa.canterbury.gov.uk",
    towns: [{ townSlug: "canterbury", countySlug: "kent" }],
    enabled: true,
  },
  {
    id: "tonbridge-malling",
    name: "Tonbridge and Malling Borough Council",
    baseUrl: "https://publicaccess.tmbc.gov.uk",
    towns: [{ townSlug: "tonbridge", countySlug: "kent" }],
    enabled: true,
  },
  {
    id: "dover",
    name: "Dover District Council",
    baseUrl: "https://publicaccess.dover.gov.uk",
    towns: [{ townSlug: "dover", countySlug: "kent" }],
    enabled: true,
  },
  {
    id: "sevenoaks",
    name: "Sevenoaks District Council",
    baseUrl: "https://pa.sevenoaks.gov.uk",
    towns: [{ townSlug: "sevenoaks", countySlug: "kent" }],
    enabled: true,
  },

  // ── Surrey (additional) ─────────────────────────────────────
  {
    id: "surrey-heath",
    name: "Surrey Heath Borough Council",
    baseUrl: "https://publicaccess.surreyheath.gov.uk",
    towns: [{ townSlug: "camberley", countySlug: "surrey" }],
    enabled: true,
  },
  {
    id: "spelthorne-new",
    name: "Spelthorne Borough Council",
    baseUrl: "https://publicaccess.spelthorne.gov.uk",
    towns: [{ townSlug: "staines", countySlug: "surrey" }],
    enabled: true,
  },

  // ── Hampshire ───────────────────────────────────────────────
  {
    id: "portsmouth",
    name: "Portsmouth City Council",
    baseUrl: "https://publicaccess.portsmouth.gov.uk",
    towns: [{ townSlug: "portsmouth", countySlug: "hampshire" }],
    enabled: true,
  },
  {
    id: "rushmoor",
    name: "Rushmoor Borough Council",
    baseUrl: "https://publicaccess.rushmoor.gov.uk",
    towns: [
      { townSlug: "farnborough", countySlug: "hampshire" },
      { townSlug: "aldershot", countySlug: "hampshire" },
    ],
    enabled: true,
  },
  {
    id: "hart",
    name: "Hart District Council",
    baseUrl: "https://publicaccess.hart.gov.uk",
    towns: [{ townSlug: "fleet", countySlug: "hampshire" }],
    enabled: true,
  },

  // ── Sussex (additional) ─────────────────────────────────────
  {
    id: "adur-worthing",
    name: "Adur & Worthing Councils",
    baseUrl: "https://planning.adur-worthing.gov.uk",
    towns: [{ townSlug: "worthing", countySlug: "sussex" }],
    enabled: true,
  },
  {
    id: "hastings",
    name: "Hastings Borough Council",
    baseUrl: "https://publicaccess.hastings.gov.uk",
    towns: [{ townSlug: "hastings", countySlug: "sussex" }],
    enabled: true,
  },
  {
    id: "chichester",
    name: "Chichester District Council",
    baseUrl: "https://publicaccess.chichester.gov.uk",
    towns: [
      { townSlug: "chichester", countySlug: "sussex" },
      { townSlug: "bognor-regis", countySlug: "sussex" },
    ],
    enabled: true,
  },
  {
    id: "mid-sussex",
    name: "Mid Sussex District Council",
    baseUrl: "https://pa.midsussex.gov.uk",
    towns: [{ townSlug: "haywards-heath", countySlug: "sussex" }],
    enabled: true,
  },

  // ── Berkshire ───────────────────────────────────────────────
  {
    id: "west-berkshire",
    name: "West Berkshire Council",
    baseUrl: "https://publicaccess.westberks.gov.uk",
    towns: [
      { townSlug: "newbury", countySlug: "berkshire" },
      { townSlug: "thatcham", countySlug: "berkshire" },
    ],
    enabled: true,
  },

  // ── Buckinghamshire ─────────────────────────────────────────
  {
    id: "buckinghamshire",
    name: "Buckinghamshire Council",
    baseUrl: "https://publicaccess.buckinghamshire.gov.uk",
    towns: [
      { townSlug: "aylesbury", countySlug: "buckinghamshire" },
      { townSlug: "high-wycombe", countySlug: "buckinghamshire" },
      { townSlug: "amersham", countySlug: "buckinghamshire" },
      { townSlug: "beaconsfield", countySlug: "buckinghamshire" },
      { townSlug: "marlow", countySlug: "buckinghamshire" },
      { townSlug: "chesham", countySlug: "buckinghamshire" },
      { townSlug: "buckingham", countySlug: "buckinghamshire" },
      { townSlug: "princes-risborough", countySlug: "buckinghamshire" },
    ],
    enabled: true,
  },

  // ── Oxfordshire ─────────────────────────────────────────────
  {
    id: "west-oxfordshire",
    name: "West Oxfordshire District Council",
    baseUrl: "https://publicaccess.westoxon.gov.uk",
    towns: [{ townSlug: "witney", countySlug: "oxfordshire" }],
    enabled: true,
  },

  // ── Hertfordshire (additional) ──────────────────────────────
  {
    id: "stevenage",
    name: "Stevenage Borough Council",
    baseUrl: "https://publicaccess.stevenage.gov.uk",
    towns: [{ townSlug: "stevenage", countySlug: "hertfordshire" }],
    enabled: true,
  },
  {
    id: "east-herts",
    name: "East Hertfordshire District Council",
    baseUrl: "https://publicaccess.eastherts.gov.uk",
    towns: [
      { townSlug: "hertford", countySlug: "hertfordshire" },
      { townSlug: "bishops-stortford", countySlug: "hertfordshire" },
    ],
    enabled: true,
  },

  // ── Bristol & South West ────────────────────────────────────
  {
    id: "bristol",
    name: "Bristol City Council",
    baseUrl: "https://pa.bristol.gov.uk",
    towns: [
      { townSlug: "bristol-city-centre", countySlug: "bristol" },
      { townSlug: "bedminster", countySlug: "bristol" },
      { townSlug: "bishopston", countySlug: "bristol" },
      { townSlug: "filton", countySlug: "bristol" },
      { townSlug: "hengrove", countySlug: "bristol" },
      { townSlug: "keynsham", countySlug: "bristol" },
    ],
    enabled: true,
  },
  {
    id: "exeter",
    name: "Exeter City Council",
    baseUrl: "https://publicaccess.exeter.gov.uk",
    towns: [{ townSlug: "exeter", countySlug: "devon" }],
    enabled: true,
  },
  {
    id: "plymouth",
    name: "Plymouth City Council",
    baseUrl: "https://planning.plymouth.gov.uk",
    towns: [{ townSlug: "plymouth", countySlug: "devon" }],
    enabled: true,
  },
  {
    id: "cornwall",
    name: "Cornwall Council",
    baseUrl: "https://planning.cornwall.gov.uk",
    towns: [
      { townSlug: "truro", countySlug: "cornwall" },
      { townSlug: "falmouth", countySlug: "cornwall" },
      { townSlug: "newquay", countySlug: "cornwall" },
      { townSlug: "penzance", countySlug: "cornwall" },
      { townSlug: "st-austell", countySlug: "cornwall" },
      { townSlug: "bodmin", countySlug: "cornwall" },
      { townSlug: "camborne", countySlug: "cornwall" },
      { townSlug: "bude", countySlug: "cornwall" },
    ],
    enabled: true,
  },
  {
    id: "cheltenham",
    name: "Cheltenham Borough Council",
    baseUrl: "https://publicaccess.cheltenham.gov.uk",
    towns: [{ townSlug: "cheltenham", countySlug: "gloucestershire" }],
    enabled: true,
  },
  {
    id: "gloucester",
    name: "Gloucester City Council",
    baseUrl: "https://publicaccess.gloucester.gov.uk",
    towns: [{ townSlug: "gloucester", countySlug: "gloucestershire" }],
    enabled: true,
  },

  // ── Greater Manchester ──────────────────────────────────────
  {
    id: "manchester",
    name: "Manchester City Council",
    baseUrl: "https://pa.manchester.gov.uk",
    towns: [{ townSlug: "manchester", countySlug: "greater-manchester" }],
    enabled: true,
  },
  {
    id: "bury",
    name: "Bury Council",
    baseUrl: "https://planning.bury.gov.uk",
    towns: [{ townSlug: "bury", countySlug: "greater-manchester" }],
    enabled: true,
  },
  {
    id: "wigan",
    name: "Wigan Council",
    baseUrl: "https://planning.wigan.gov.uk",
    towns: [{ townSlug: "wigan", countySlug: "greater-manchester" }],
    enabled: true,
  },

  // ── Yorkshire ───────────────────────────────────────────────
  {
    id: "leeds",
    name: "Leeds City Council",
    baseUrl: "https://publicaccess.leeds.gov.uk",
    towns: [{ townSlug: "leeds", countySlug: "west-yorkshire" }],
    enabled: true,
  },
  {
    id: "bradford",
    name: "City of Bradford",
    baseUrl: "https://planning.bradford.gov.uk",
    towns: [
      { townSlug: "bradford", countySlug: "west-yorkshire" },
      { townSlug: "ilkley", countySlug: "west-yorkshire" },
    ],
    enabled: true,
  },
  {
    id: "wakefield",
    name: "Wakefield Council",
    baseUrl: "https://planning.wakefield.gov.uk",
    towns: [
      { townSlug: "wakefield", countySlug: "west-yorkshire" },
      { townSlug: "pontefract", countySlug: "west-yorkshire" },
    ],
    enabled: true,
  },
  {
    id: "doncaster",
    name: "City of Doncaster Council",
    baseUrl: "https://planning.doncaster.gov.uk",
    towns: [
      { townSlug: "doncaster", countySlug: "south-yorkshire" },
      { townSlug: "mexborough", countySlug: "south-yorkshire" },
    ],
    enabled: true,
  },
  {
    id: "north-yorkshire",
    name: "North Yorkshire Council",
    baseUrl: "https://publicaccess.northyorks.gov.uk",
    towns: [
      { townSlug: "harrogate", countySlug: "north-yorkshire" },
      { townSlug: "scarborough", countySlug: "north-yorkshire" },
      { townSlug: "skipton", countySlug: "north-yorkshire" },
      { townSlug: "ripon", countySlug: "north-yorkshire" },
      { townSlug: "northallerton", countySlug: "north-yorkshire" },
      { townSlug: "knaresborough", countySlug: "north-yorkshire" },
      { townSlug: "whitby", countySlug: "north-yorkshire" },
    ],
    enabled: true,
  },

  // ── North East ──────────────────────────────────────────────
  {
    id: "durham",
    name: "Durham County Council",
    baseUrl: "https://publicaccess.durham.gov.uk",
    towns: [
      { townSlug: "durham", countySlug: "county-durham" },
      { townSlug: "bishop-auckland", countySlug: "county-durham" },
      { townSlug: "newton-aycliffe", countySlug: "county-durham" },
      { townSlug: "consett", countySlug: "county-durham" },
      { townSlug: "chester-le-street", countySlug: "county-durham" },
      { townSlug: "peterlee", countySlug: "county-durham" },
    ],
    enabled: true,
  },
  {
    id: "northumberland",
    name: "Northumberland County Council",
    baseUrl: "https://publicaccess.northumberland.gov.uk",
    towns: [
      { townSlug: "morpeth", countySlug: "northumberland" },
      { townSlug: "blyth", countySlug: "northumberland" },
      { townSlug: "cramlington", countySlug: "northumberland" },
      { townSlug: "alnwick", countySlug: "northumberland" },
      { townSlug: "hexham", countySlug: "northumberland" },
      { townSlug: "berwick-upon-tweed", countySlug: "northumberland" },
    ],
    enabled: true,
  },

  // ── Merseyside ──────────────────────────────────────────────
  {
    id: "sefton",
    name: "Sefton Council",
    baseUrl: "https://pa.sefton.gov.uk",
    towns: [
      { townSlug: "southport", countySlug: "merseyside" },
      { townSlug: "bootle", countySlug: "merseyside" },
    ],
    enabled: true,
  },
  {
    id: "st-helens",
    name: "St Helens Council",
    baseUrl: "https://publicaccess.sthelens.gov.uk",
    towns: [{ townSlug: "st-helens", countySlug: "merseyside" }],
    enabled: true,
  },

  // ── Lancashire ──────────────────────────────────────────────
  {
    id: "lancaster",
    name: "Lancaster City Council",
    baseUrl: "https://planning.lancaster.gov.uk",
    towns: [{ townSlug: "lancaster", countySlug: "lancashire" }],
    enabled: true,
  },
  {
    id: "burnley",
    name: "Burnley Borough Council",
    baseUrl: "https://publicaccess.burnley.gov.uk",
    towns: [{ townSlug: "burnley", countySlug: "lancashire" }],
    enabled: true,
  },
  {
    id: "chorley",
    name: "Chorley Council",
    baseUrl: "https://planning.chorley.gov.uk",
    towns: [{ townSlug: "chorley", countySlug: "lancashire" }],
    enabled: true,
  },

  // ── Cheshire ────────────────────────────────────────────────
  {
    id: "cheshire-west",
    name: "Cheshire West and Chester Council",
    baseUrl: "https://pa.cheshirewestandchester.gov.uk",
    towns: [
      { townSlug: "chester", countySlug: "cheshire" },
      { townSlug: "northwich", countySlug: "cheshire" },
      { townSlug: "ellesmere-port", countySlug: "cheshire" },
    ],
    enabled: true,
  },

  // ── Derbyshire ──────────────────────────────────────────────
  {
    id: "chesterfield",
    name: "Chesterfield Borough Council",
    baseUrl: "https://publicaccess.chesterfield.gov.uk",
    towns: [{ townSlug: "chesterfield", countySlug: "derbyshire" }],
    enabled: true,
  },
  {
    id: "derbyshire-dales",
    name: "Derbyshire Dales District Council",
    baseUrl: "https://planning.derbyshiredales.gov.uk",
    towns: [
      { townSlug: "matlock", countySlug: "derbyshire" },
      { townSlug: "buxton", countySlug: "derbyshire" },
    ],
    enabled: true,
  },

  // ── Nottinghamshire (additional) ────────────────────────────
  {
    id: "nottingham-city",
    name: "Nottingham City Council",
    baseUrl: "https://publicaccess.nottinghamcity.gov.uk",
    towns: [{ townSlug: "nottingham", countySlug: "nottinghamshire" }],
    enabled: true,
  },
  {
    id: "mansfield",
    name: "Mansfield District Council",
    baseUrl: "https://planning.mansfield.gov.uk",
    towns: [{ townSlug: "mansfield", countySlug: "nottinghamshire" }],
    enabled: true,
  },
  {
    id: "newark-sherwood",
    name: "Newark and Sherwood District Council",
    baseUrl: "https://publicaccess.newark-sherwooddc.gov.uk",
    towns: [{ townSlug: "newark", countySlug: "nottinghamshire" }],
    enabled: true,
  },
  {
    id: "bassetlaw",
    name: "Bassetlaw District Council",
    baseUrl: "https://publicaccess.bassetlaw.gov.uk",
    towns: [
      { townSlug: "worksop", countySlug: "nottinghamshire" },
      { townSlug: "retford", countySlug: "nottinghamshire" },
    ],
    enabled: true,
  },

  // ── Northamptonshire ────────────────────────────────────────
  {
    id: "north-northants",
    name: "North Northamptonshire Council",
    baseUrl: "https://publicaccess.northnorthants.gov.uk",
    towns: [
      { townSlug: "kettering", countySlug: "northamptonshire" },
      { townSlug: "corby", countySlug: "northamptonshire" },
      { townSlug: "wellingborough", countySlug: "northamptonshire" },
      { townSlug: "rushden", countySlug: "northamptonshire" },
    ],
    enabled: true,
  },

  // ── Lincolnshire ────────────────────────────────────────────
  {
    id: "lincoln",
    name: "City of Lincoln Council",
    baseUrl: "https://planning.lincoln.gov.uk",
    towns: [{ townSlug: "lincoln", countySlug: "lincolnshire" }],
    enabled: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // NEW AUTHORITIES — added to close coverage gap (Apr 2026)
  // ═══════════════════════════════════════════════════════════════

  // ── Berkshire ───────────────────────────────────────────────
  {
    id: "bracknell-forest",
    name: "Bracknell Forest Council",
    baseUrl: "https://planapp.bracknell-forest.gov.uk",
    towns: [{ townSlug: "bracknell", countySlug: "berkshire" }],
    enabled: true,
  },
  {
    id: "rbwm",
    name: "Royal Borough of Windsor & Maidenhead",
    baseUrl: "https://publicaccess.rbwm.gov.uk",
    towns: [
      { townSlug: "maidenhead", countySlug: "berkshire" },
      { townSlug: "windsor", countySlug: "berkshire" },
    ],
    enabled: true,
  },

  // ── Kent (additional) ──────────────────────────────────────
  {
    id: "maidstone",
    name: "Maidstone Borough Council (Mid Kent)",
    baseUrl: "https://pa.midkent.gov.uk",
    towns: [{ townSlug: "maidstone", countySlug: "kent" }],
    enabled: true,
  },
  {
    id: "medway",
    name: "Medway Council",
    baseUrl: "https://publicaccess1.medway.gov.uk",
    towns: [{ townSlug: "chatham", countySlug: "kent" }],
    enabled: true,
  },
  {
    id: "gravesham",
    name: "Gravesham Borough Council",
    baseUrl: "https://plan.gravesham.gov.uk",
    towns: [{ townSlug: "gravesend", countySlug: "kent" }],
    enabled: true,
  },
  {
    id: "dartford",
    name: "Dartford Borough Council",
    baseUrl: "https://publicaccess.dartford.gov.uk",
    towns: [{ townSlug: "dartford", countySlug: "kent" }],
    enabled: true,
  },
  {
    id: "thanet",
    name: "Thanet District Council",
    baseUrl: "https://planning.thanet.gov.uk",
    towns: [{ townSlug: "margate", countySlug: "kent" }],
    enabled: true,
  },

  // ── Oxfordshire (additional) ───────────────────────────────
  {
    id: "oxford-city",
    name: "Oxford City Council",
    baseUrl: "https://public.oxford.gov.uk",
    towns: [{ townSlug: "oxford", countySlug: "oxfordshire" }],
    enabled: true,
  },

  // ── Surrey (additional) ────────────────────────────────────
  {
    id: "woking",
    name: "Woking Borough Council",
    baseUrl: "https://caps.woking.gov.uk",
    towns: [{ townSlug: "woking", countySlug: "surrey" }],
    enabled: true,
  },

  // ── Sussex (additional) ────────────────────────────────────
  {
    id: "brighton-hove",
    name: "Brighton & Hove City Council",
    baseUrl: "https://planningapps.brighton-hove.gov.uk",
    towns: [{ townSlug: "brighton", countySlug: "sussex" }],
    enabled: true,
  },
  {
    id: "horsham",
    name: "Horsham District Council",
    baseUrl: "https://public-access.horsham.gov.uk",
    towns: [{ townSlug: "horsham", countySlug: "sussex" }],
    searchPath: "/public-access",
    enabled: true,
  },

  // ── Greater London (additional) ────────────────────────────
  {
    id: "barking-dagenham",
    name: "London Borough of Barking & Dagenham",
    baseUrl: "https://paplan.lbbd.gov.uk",
    towns: [{ townSlug: "barking", countySlug: "greater-london" }],
    enabled: true,
  },

  // ── Hampshire (additional) ─────────────────────────────────
  {
    id: "southampton",
    name: "Southampton City Council",
    baseUrl: "https://planningpublicaccess.southampton.gov.uk",
    towns: [{ townSlug: "southampton", countySlug: "hampshire" }],
    enabled: true,
  },
  {
    id: "winchester",
    name: "Winchester City Council",
    baseUrl: "https://planningapps.winchester.gov.uk",
    towns: [{ townSlug: "winchester", countySlug: "hampshire" }],
    enabled: true,
  },
  {
    id: "basingstoke-deane",
    name: "Basingstoke & Deane Borough Council",
    baseUrl: "https://publicaccess.basingstoke.gov.uk",
    towns: [{ townSlug: "basingstoke", countySlug: "hampshire" }],
    enabled: true,
  },
  {
    id: "test-valley",
    name: "Test Valley Borough Council",
    baseUrl: "https://view-applications.testvalley.gov.uk",
    towns: [{ townSlug: "andover", countySlug: "hampshire" }],
    enabled: true,
  },

  // ── Hertfordshire (additional) ─────────────────────────────
  {
    id: "watford",
    name: "Watford Borough Council",
    baseUrl: "https://pa.watford.gov.uk",
    towns: [{ townSlug: "watford", countySlug: "hertfordshire" }],
    searchPath: "/publicaccess",
    enabled: true,
  },
  {
    id: "dacorum",
    name: "Dacorum Borough Council",
    baseUrl: "https://planning.dacorum.gov.uk",
    towns: [{ townSlug: "hemel-hempstead", countySlug: "hertfordshire" }],
    searchPath: "/publicaccess",
    enabled: true,
  },
  {
    id: "welwyn-hatfield",
    name: "Welwyn Hatfield Borough Council",
    baseUrl: "https://planning.welhat.gov.uk",
    towns: [
      { townSlug: "welwyn-garden-city", countySlug: "hertfordshire" },
      { townSlug: "hatfield", countySlug: "hertfordshire" },
    ],
    enabled: true,
  },
  {
    id: "hertsmere",
    name: "Hertsmere Borough Council",
    baseUrl: "https://www6.hertsmere.gov.uk",
    towns: [{ townSlug: "borehamwood", countySlug: "hertfordshire" }],
    enabled: true,
  },

  // ── Bedfordshire ───────────────────────────────────────────
  {
    id: "bedford",
    name: "Bedford Borough Council",
    baseUrl: "https://publicaccess.bedford.gov.uk",
    towns: [{ townSlug: "bedford", countySlug: "bedfordshire" }],
    enabled: true,
  },
  {
    id: "luton",
    name: "Luton Borough Council",
    baseUrl: "https://planning.luton.gov.uk",
    towns: [{ townSlug: "luton", countySlug: "bedfordshire" }],
    enabled: true,
  },

  // ── Cambridgeshire ─────────────────────────────────────────
  {
    id: "greater-cambridge",
    name: "Greater Cambridge Shared Planning",
    baseUrl: "https://applications.greatercambridgeplanning.org",
    towns: [{ townSlug: "cambridge", countySlug: "cambridgeshire" }],
    enabled: true,
  },
  {
    id: "huntingdonshire",
    name: "Huntingdonshire District Council",
    baseUrl: "https://publicaccess.huntingdonshire.gov.uk",
    towns: [
      { townSlug: "huntingdon", countySlug: "cambridgeshire" },
      { townSlug: "st-neots", countySlug: "cambridgeshire" },
      { townSlug: "st-ives", countySlug: "cambridgeshire" },
    ],
    enabled: true,
  },
  {
    id: "east-cambs",
    name: "East Cambridgeshire District Council",
    baseUrl: "https://pa.eastcambs.gov.uk",
    towns: [{ townSlug: "ely", countySlug: "cambridgeshire" }],
    enabled: true,
  },
  {
    id: "fenland",
    name: "Fenland District Council",
    baseUrl: "https://www.fenland.gov.uk",
    towns: [
      { townSlug: "march", countySlug: "cambridgeshire" },
      { townSlug: "wisbech", countySlug: "cambridgeshire" },
    ],
    searchPath: "/publicaccess",
    enabled: true,
  },

  // ── Derbyshire (additional) ────────────────────────────────
  {
    id: "derby-city",
    name: "Derby City Council",
    baseUrl: "https://eplanning.derby.gov.uk",
    towns: [{ townSlug: "derby", countySlug: "derbyshire" }],
    enabled: true,
  },

  // ── Leicestershire ─────────────────────────────────────────
  {
    id: "leicester-city",
    name: "Leicester City Council",
    baseUrl: "https://planning.leicester.gov.uk",
    towns: [{ townSlug: "leicester", countySlug: "leicestershire" }],
    enabled: true,
  },
  {
    id: "hinckley-bosworth",
    name: "Hinckley & Bosworth Borough Council",
    baseUrl: "https://pa.hinckley-bosworth.gov.uk",
    towns: [{ townSlug: "hinckley", countySlug: "leicestershire" }],
    enabled: true,
  },
  {
    id: "melton",
    name: "Melton Borough Council",
    baseUrl: "https://pa.melton.gov.uk",
    towns: [{ townSlug: "melton-mowbray", countySlug: "leicestershire" }],
    enabled: true,
  },
  {
    id: "harborough",
    name: "Harborough District Council",
    baseUrl: "https://pa2.harborough.gov.uk",
    towns: [{ townSlug: "market-harborough", countySlug: "leicestershire" }],
    enabled: true,
  },
  {
    id: "nw-leicestershire",
    name: "North West Leicestershire District Council",
    baseUrl: "https://plans.nwleics.gov.uk",
    towns: [{ townSlug: "coalville", countySlug: "leicestershire" }],
    searchPath: "/public-access",
    enabled: true,
  },
  {
    id: "oadby-wigston",
    name: "Oadby & Wigston Borough Council",
    baseUrl: "https://pa.oadby-wigston.gov.uk",
    towns: [{ townSlug: "wigston", countySlug: "leicestershire" }],
    enabled: true,
  },

  // ── Nottinghamshire (additional) ───────────────────────────
  {
    id: "rushcliffe",
    name: "Rushcliffe Borough Council",
    baseUrl: "https://planningon-line.rushcliffe.gov.uk",
    towns: [{ townSlug: "west-bridgford", countySlug: "nottinghamshire" }],
    enabled: true,
  },
  {
    id: "gedling",
    name: "Gedling Borough Council",
    baseUrl: "https://pawam.gedling.gov.uk",
    towns: [{ townSlug: "arnold", countySlug: "nottinghamshire" }],
    enabled: true,
  },

  // ── Shropshire ─────────────────────────────────────────────
  {
    id: "shropshire",
    name: "Shropshire Council",
    baseUrl: "https://pa.shropshire.gov.uk",
    towns: [
      { townSlug: "shrewsbury", countySlug: "shropshire" },
      { townSlug: "oswestry", countySlug: "shropshire" },
      { townSlug: "bridgnorth", countySlug: "shropshire" },
      { townSlug: "market-drayton", countySlug: "shropshire" },
      { townSlug: "ludlow", countySlug: "shropshire" },
    ],
    enabled: true,
  },

  // ── Staffordshire ──────────────────────────────────────────
  {
    id: "stoke-on-trent",
    name: "Stoke-on-Trent City Council",
    baseUrl: "https://planning.stoke.gov.uk",
    towns: [{ townSlug: "stoke-on-trent", countySlug: "staffordshire" }],
    enabled: true,
  },
  {
    id: "stafford",
    name: "Stafford Borough Council",
    baseUrl: "https://www12.staffordbc.gov.uk",
    towns: [{ townSlug: "stafford", countySlug: "staffordshire" }],
    enabled: true,
  },
  {
    id: "lichfield",
    name: "Lichfield District Council",
    baseUrl: "https://planning.lichfielddc.gov.uk",
    towns: [{ townSlug: "lichfield", countySlug: "staffordshire" }],
    enabled: true,
  },
  {
    id: "newcastle-under-lyme",
    name: "Newcastle-under-Lyme Borough Council",
    baseUrl: "https://publicaccess.newcastle-staffs.gov.uk",
    towns: [{ townSlug: "newcastle-under-lyme", countySlug: "staffordshire" }],
    enabled: true,
  },

  // ── Warwickshire ───────────────────────────────────────────
  {
    id: "warwick",
    name: "Warwick District Council",
    baseUrl: "https://planningdocuments.warwickdc.gov.uk",
    towns: [
      { townSlug: "leamington-spa", countySlug: "warwickshire" },
      { townSlug: "warwick", countySlug: "warwickshire" },
      { townSlug: "kenilworth", countySlug: "warwickshire" },
    ],
    enabled: true,
  },

  // ── West Midlands ──────────────────────────────────────────
  {
    id: "wolverhampton",
    name: "Wolverhampton City Council",
    baseUrl: "https://planningonline.wolverhampton.gov.uk",
    towns: [{ townSlug: "wolverhampton", countySlug: "west-midlands" }],
    enabled: true,
  },
  {
    id: "solihull",
    name: "Solihull Metropolitan Borough Council",
    baseUrl: "https://publicaccess.solihull.gov.uk",
    towns: [{ townSlug: "solihull", countySlug: "west-midlands" }],
    enabled: true,
  },
  {
    id: "sandwell",
    name: "Sandwell Metropolitan Borough Council",
    baseUrl: "https://webcaps.sandwell.gov.uk",
    towns: [{ townSlug: "west-bromwich", countySlug: "west-midlands" }],
    searchPath: "/publicaccess",
    enabled: true,
  },

  // ── Worcestershire ─────────────────────────────────────────
  {
    id: "bromsgrove-redditch",
    name: "Bromsgrove & Redditch Councils",
    baseUrl: "https://publicaccess.bromsgroveandredditch.gov.uk",
    towns: [
      { townSlug: "redditch", countySlug: "worcestershire" },
      { townSlug: "bromsgrove", countySlug: "worcestershire" },
    ],
    enabled: true,
  },
  {
    id: "wyre-forest",
    name: "Wyre Forest District Council",
    baseUrl: "https://planningpa.wyreforestdc.gov.uk",
    towns: [{ townSlug: "kidderminster", countySlug: "worcestershire" }],
    enabled: true,
  },

  // ── Devon (additional) ─────────────────────────────────────
  {
    id: "torbay",
    name: "Torbay Council",
    baseUrl: "https://publicaccess.torbay.gov.uk",
    towns: [
      { townSlug: "torquay", countySlug: "devon" },
      { townSlug: "paignton", countySlug: "devon" },
    ],
    enabled: true,
  },
  {
    id: "teignbridge",
    name: "Teignbridge District Council",
    baseUrl: "https://publicaccess.teignbridge.gov.uk",
    towns: [{ townSlug: "newton-abbot", countySlug: "devon" }],
    enabled: true,
  },
  {
    id: "north-devon",
    name: "North Devon District Council",
    baseUrl: "https://planning.northdevon.gov.uk",
    towns: [{ townSlug: "barnstaple", countySlug: "devon" }],
    enabled: true,
  },
  {
    id: "mid-devon",
    name: "Mid Devon District Council",
    baseUrl: "https://planning.middevon.gov.uk",
    towns: [{ townSlug: "tiverton", countySlug: "devon" }],
    enabled: true,
  },
  {
    id: "east-devon",
    name: "East Devon District Council",
    baseUrl: "https://planning.eastdevon.gov.uk",
    towns: [{ townSlug: "exmouth", countySlug: "devon" }],
    enabled: true,
  },

  // ── Dorset ─────────────────────────────────────────────────
  {
    id: "bcp",
    name: "BCP Council (Bournemouth, Christchurch & Poole)",
    baseUrl: "https://planning.bcpcouncil.gov.uk",
    towns: [
      { townSlug: "bournemouth", countySlug: "dorset" },
      { townSlug: "poole", countySlug: "dorset" },
      { townSlug: "christchurch", countySlug: "dorset" },
    ],
    enabled: true,
  },

  // ── Gloucestershire (additional) ──────────────────────────
  {
    id: "stroud",
    name: "Stroud District Council",
    baseUrl: "https://publicaccess.stroud.gov.uk",
    towns: [{ townSlug: "stroud", countySlug: "gloucestershire" }],
    enabled: true,
  },
  {
    id: "cotswold",
    name: "Cotswold District Council",
    baseUrl: "https://publicaccess.cotswold.gov.uk",
    towns: [{ townSlug: "cirencester", countySlug: "gloucestershire" }],
    enabled: true,
  },
  {
    id: "tewkesbury",
    name: "Tewkesbury Borough Council",
    baseUrl: "https://publicaccess.tewkesbury.gov.uk",
    towns: [{ townSlug: "tewkesbury", countySlug: "gloucestershire" }],
    enabled: true,
  },
  {
    id: "forest-of-dean",
    name: "Forest of Dean District Council",
    baseUrl: "https://publicaccess.fdean.gov.uk",
    towns: [{ townSlug: "lydney", countySlug: "gloucestershire" }],
    enabled: true,
  },

  // ── Somerset ───────────────────────────────────────────────
  {
    id: "north-somerset",
    name: "North Somerset Council",
    baseUrl: "https://planning.n-somerset.gov.uk",
    towns: [{ townSlug: "weston-super-mare", countySlug: "somerset" }],
    enabled: true,
  },
  {
    id: "south-somerset",
    name: "South Somerset District Council (legacy portal)",
    baseUrl: "https://publicaccess.southsomerset.gov.uk",
    towns: [{ townSlug: "yeovil", countySlug: "somerset" }],
    enabled: true,
  },
  {
    id: "mendip",
    name: "Mendip District Council (legacy portal)",
    baseUrl: "https://publicaccess.mendip.gov.uk",
    towns: [
      { townSlug: "frome", countySlug: "somerset" },
      { townSlug: "glastonbury", countySlug: "somerset" },
      { townSlug: "wells", countySlug: "somerset" },
    ],
    enabled: true,
  },

  // ── Wiltshire ──────────────────────────────────────────────
  {
    id: "swindon",
    name: "Swindon Borough Council",
    baseUrl: "https://pa.swindon.gov.uk",
    towns: [{ townSlug: "swindon", countySlug: "wiltshire" }],
    searchPath: "/publicaccess",
    enabled: true,
  },

  // ── Greater Manchester (additional) ────────────────────────
  {
    id: "salford",
    name: "Salford City Council",
    baseUrl: "https://publicaccess.salford.gov.uk",
    towns: [{ townSlug: "salford", countySlug: "greater-manchester" }],
    searchPath: "/publicaccess",
    enabled: true,
  },
  {
    id: "stockport",
    name: "Stockport Metropolitan Borough Council",
    baseUrl: "https://planning.stockport.gov.uk",
    towns: [{ townSlug: "stockport", countySlug: "greater-manchester" }],
    searchPath: "/PlanningData-live",
    enabled: true,
  },
  {
    id: "bolton",
    name: "Bolton Metropolitan Borough Council",
    baseUrl: "https://paplanning.bolton.gov.uk",
    towns: [{ townSlug: "bolton", countySlug: "greater-manchester" }],
    enabled: true,
  },
  {
    id: "rochdale",
    name: "Rochdale Metropolitan Borough Council",
    baseUrl: "https://publicaccess.rochdale.gov.uk",
    towns: [{ townSlug: "rochdale", countySlug: "greater-manchester" }],
    enabled: true,
  },
  {
    id: "oldham",
    name: "Oldham Metropolitan Borough Council",
    baseUrl: "https://planningpa.oldham.gov.uk",
    towns: [{ townSlug: "oldham", countySlug: "greater-manchester" }],
    enabled: true,
  },
  {
    id: "trafford",
    name: "Trafford Council",
    baseUrl: "https://pa.trafford.gov.uk",
    towns: [{ townSlug: "altrincham", countySlug: "greater-manchester" }],
    enabled: true,
  },
  {
    id: "tameside",
    name: "Tameside Metropolitan Borough Council",
    baseUrl: "https://publicaccess.tameside.gov.uk",
    towns: [{ townSlug: "ashton-under-lyne", countySlug: "greater-manchester" }],
    enabled: true,
  },

  // ── Lancashire (additional) ────────────────────────────────
  {
    id: "blackpool",
    name: "Blackpool Council",
    baseUrl: "https://idoxpa.blackpool.gov.uk",
    towns: [{ townSlug: "blackpool", countySlug: "lancashire" }],
    enabled: true,
  },

  // ── East Riding & Hull ─────────────────────────────────────
  {
    id: "hull",
    name: "Hull City Council",
    baseUrl: "https://www.hullcc.gov.uk",
    towns: [{ townSlug: "hull", countySlug: "east-riding-of-yorkshire" }],
    searchPath: "/padcbc/publicaccess-live",
    enabled: true,
  },
  {
    id: "east-riding",
    name: "East Riding of Yorkshire Council",
    baseUrl: "https://newplanningaccess.eastriding.gov.uk",
    towns: [
      { townSlug: "beverley", countySlug: "east-riding-of-yorkshire" },
      { townSlug: "bridlington", countySlug: "east-riding-of-yorkshire" },
      { townSlug: "goole", countySlug: "east-riding-of-yorkshire" },
      { townSlug: "driffield", countySlug: "east-riding-of-yorkshire" },
      { townSlug: "hessle", countySlug: "east-riding-of-yorkshire" },
    ],
    searchPath: "/newplanningaccess",
    enabled: true,
  },

  // ── South Yorkshire (additional) ──────────────────────────
  {
    id: "sheffield",
    name: "Sheffield City Council",
    baseUrl: "https://planningapps.sheffield.gov.uk",
    towns: [{ townSlug: "sheffield", countySlug: "south-yorkshire" }],
    enabled: true,
  },

  // ── West Yorkshire (additional) ───────────────────────────
  {
    id: "calderdale",
    name: "Calderdale Council",
    baseUrl: "https://portal.calderdale.gov.uk",
    towns: [{ townSlug: "halifax", countySlug: "west-yorkshire" }],
    enabled: true,
  },

  // ── North Yorkshire (additional) ──────────────────────────
  {
    id: "york",
    name: "City of York Council",
    baseUrl: "https://planningaccess.york.gov.uk",
    towns: [{ townSlug: "york", countySlug: "north-yorkshire" }],
    enabled: true,
  },

  // ── Norfolk (additional) ──────────────────────────────────
  {
    id: "norwich",
    name: "Norwich City Council",
    baseUrl: "https://planning.norwich.gov.uk",
    towns: [{ townSlug: "norwich", countySlug: "norfolk" }],
    enabled: true,
  },
  {
    id: "north-norfolk",
    name: "North Norfolk District Council",
    baseUrl: "https://idoxpa.north-norfolk.gov.uk",
    towns: [{ townSlug: "cromer", countySlug: "norfolk" }],
    enabled: true,
  },
  {
    id: "south-norfolk",
    name: "South Norfolk Council",
    baseUrl: "https://info.south-norfolk.gov.uk",
    towns: [{ townSlug: "wymondham", countySlug: "norfolk" }],
    enabled: true,
  },

  // ── Suffolk ────────────────────────────────────────────────
  {
    id: "west-suffolk",
    name: "West Suffolk Council",
    baseUrl: "https://planning.westsuffolk.gov.uk",
    towns: [
      { townSlug: "bury-st-edmunds", countySlug: "suffolk" },
      { townSlug: "newmarket", countySlug: "suffolk" },
    ],
    enabled: true,
  },
  {
    id: "babergh-mid-suffolk",
    name: "Babergh & Mid Suffolk Councils",
    baseUrl: "https://planning.baberghmidsuffolk.gov.uk",
    towns: [
      { townSlug: "sudbury", countySlug: "suffolk" },
      { townSlug: "stowmarket", countySlug: "suffolk" },
    ],
    enabled: true,
  },
  {
    id: "east-suffolk",
    name: "East Suffolk Council",
    baseUrl: "https://publicaccess.eastsuffolk.gov.uk",
    towns: [
      { townSlug: "lowestoft", countySlug: "suffolk" },
      { townSlug: "felixstowe", countySlug: "suffolk" },
      { townSlug: "leiston", countySlug: "suffolk" },
    ],
    enabled: true,
  },

  // ── Tyne & Wear ───────────────────────────────────────────
  {
    id: "sunderland",
    name: "Sunderland City Council",
    baseUrl: "https://online-applications.sunderland.gov.uk",
    towns: [
      { townSlug: "sunderland", countySlug: "tyne-and-wear" },
      { townSlug: "washington", countySlug: "tyne-and-wear" },
    ],
    enabled: true,
  },
  {
    id: "gateshead",
    name: "Gateshead Council",
    baseUrl: "https://public.gateshead.gov.uk",
    towns: [{ townSlug: "gateshead", countySlug: "tyne-and-wear" }],
    enabled: true,
  },

  // ── Merseyside (additional) ───────────────────────────────
  {
    id: "wirral",
    name: "Wirral Council",
    baseUrl: "https://planning.wirral.gov.uk",
    towns: [
      { townSlug: "birkenhead", countySlug: "merseyside" },
      { townSlug: "wallasey", countySlug: "merseyside" },
    ],
    enabled: true,
  },

  // ── Lincolnshire (additional) ─────────────────────────────
  {
    id: "north-kesteven",
    name: "North Kesteven District Council",
    baseUrl: "https://planningonline.n-kesteven.gov.uk",
    towns: [{ townSlug: "sleaford", countySlug: "lincolnshire" }],
    enabled: true,
  },
  {
    id: "south-kesteven",
    name: "South Kesteven District Council",
    baseUrl: "https://planning.southkesteven.gov.uk",
    towns: [
      { townSlug: "grantham", countySlug: "lincolnshire" },
      { townSlug: "stamford", countySlug: "lincolnshire" },
    ],
    enabled: true,
  },

  // ── Cumbria ────────────────────────────────────────────────
  {
    id: "cumberland",
    name: "Cumberland Council",
    baseUrl: "https://publicaccess.carlisle.gov.uk",
    towns: [
      { townSlug: "carlisle", countySlug: "cumbria" },
      { townSlug: "workington", countySlug: "cumbria" },
      { townSlug: "whitehaven", countySlug: "cumbria" },
    ],
    enabled: true,
  },

  // ── Wales ──────────────────────────────────────────────────
  {
    id: "cardiff",
    name: "Cardiff Council",
    baseUrl: "https://www.cardiffidoxcloud.wales",
    towns: [
      { townSlug: "cardiff-city-centre", countySlug: "cardiff" },
      { townSlug: "cardiff-bay", countySlug: "cardiff" },
      { townSlug: "canton", countySlug: "cardiff" },
      { townSlug: "cathays", countySlug: "cardiff" },
      { townSlug: "splott", countySlug: "cardiff" },
      { townSlug: "pontcanna", countySlug: "cardiff" },
    ],
    searchPath: "/publicaccess",
    enabled: true,
  },
  {
    id: "newport",
    name: "Newport City Council",
    baseUrl: "https://publicaccess.newport.gov.uk",
    towns: [
      { townSlug: "newport-city-centre", countySlug: "newport" },
      { townSlug: "caerleon", countySlug: "newport" },
      { townSlug: "maindee", countySlug: "newport" },
    ],
    enabled: true,
  },
  {
    id: "torfaen",
    name: "Torfaen County Borough Council",
    baseUrl: "https://planningonline.torfaen.gov.uk",
    towns: [
      { townSlug: "cwmbran", countySlug: "newport" },
      { townSlug: "pontypool", countySlug: "newport" },
    ],
    enabled: true,
  },
  {
    id: "powys",
    name: "Powys County Council",
    baseUrl: "https://pa.powys.gov.uk",
    towns: [
      { townSlug: "brecon", countySlug: "powys" },
      { townSlug: "newtown", countySlug: "powys" },
      { townSlug: "welshpool", countySlug: "powys" },
      { townSlug: "llandrindod-wells", countySlug: "powys" },
      { townSlug: "builth-wells", countySlug: "powys" },
      { townSlug: "hay-on-wye", countySlug: "powys" },
    ],
    enabled: true,
  },
  {
    id: "swansea",
    name: "Swansea Council",
    baseUrl: "https://planningapps.swansea.gov.uk",
    towns: [
      { townSlug: "swansea-city-centre", countySlug: "swansea" },
      { townSlug: "mumbles", countySlug: "swansea" },
      { townSlug: "sa1-waterfront", countySlug: "swansea" },
      { townSlug: "sketty", countySlug: "swansea" },
      { townSlug: "morriston", countySlug: "swansea" },
    ],
    enabled: true,
  },
  {
    id: "neath-port-talbot",
    name: "Neath Port Talbot Council",
    baseUrl: "https://planningonline.npt.gov.uk",
    towns: [{ townSlug: "neath", countySlug: "swansea" }],
    enabled: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // Added 2026-04-21 after portal-system probe — verified Idox Public Access
  // ═══════════════════════════════════════════════════════════════
  {
    id: "basildon",
    name: "Basildon Borough Council",
    baseUrl: "https://planning.basildon.gov.uk",
    towns: [{ townSlug: "basildon", countySlug: "essex" }],
    enabled: true,
  },
  {
    id: "brentwood",
    name: "Brentwood Borough Council",
    baseUrl: "https://publicaccess.brentwood.gov.uk",
    towns: [{ townSlug: "brentwood", countySlug: "essex" }],
    enabled: true,
  },
  {
    id: "southend",
    name: "Southend-on-Sea City Council",
    baseUrl: "https://publicaccess.southend.gov.uk",
    towns: [{ townSlug: "southend-on-sea", countySlug: "essex" }],
    enabled: true,
  },
  {
    id: "thurrock",
    name: "Thurrock Council",
    baseUrl: "https://regs.thurrock.gov.uk",
    towns: [{ townSlug: "grays", countySlug: "essex" }],
    enabled: true,
  },
  {
    id: "kings-lynn-west-norfolk",
    name: "King's Lynn & West Norfolk Borough Council",
    baseUrl: "https://online.west-norfolk.gov.uk",
    towns: [{ townSlug: "kings-lynn", countySlug: "norfolk" }],
    enabled: true,
  },
  {
    id: "south-gloucestershire",
    name: "South Gloucestershire Council",
    baseUrl: "https://developments.southglos.gov.uk",
    towns: [{ townSlug: "filton", countySlug: "bristol" }],
    enabled: true,
  },
];

// ─── Lookup Helpers ──────────────────────────────────────────

function getIdoxAuthority(id: string): IdoxAuthority | undefined {
  return IDOX_AUTHORITIES.find((a) => a.id === id);
}

function getEnabledIdoxAuthorities(): IdoxAuthority[] {
  return IDOX_AUTHORITIES.filter((a) => a.enabled);
}

// ─── Types ───────────────────────────────────────────────────

interface IdoxSearchResult {
  /** Link href containing keyVal, e.g. "/online-applications/applicationDetails.do?...keyVal=ABC123" */
  detailUrl: string;
  /** The keyVal parameter extracted from the detail URL */
  keyVal: string;
  /** Reference number from link text */
  reference: string;
  /** Address from <p class="address"> */
  address: string;
  /** Proposal/description from <p class="description"> or metaInfo */
  proposal: string;
  /** Status from <span class="caseStatus"> */
  status: string;
  /** Date from "Validated:" or "Received:" in metaInfo */
  dateStr: string;
}

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

// ─── Helpers ─────────────────────────────────────────────────

function formatDateDDMMYYYY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Parse Idox date format "Fri 31 Jan 2025" → "31/01/2025"
 * Also handles "31 Jan 2025" without day-of-week prefix.
 */
function parseIdoxDate(dateStr: string): string {
  if (!dateStr || !dateStr.trim()) return "";

  const months: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04",
    May: "05", Jun: "06", Jul: "07", Aug: "08",
    Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };

  // Match "Fri 31 Jan 2025" or "31 Jan 2025"
  const match = dateStr.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i);
  if (!match) return "";

  const day = match[1].padStart(2, "0");
  const monthKey = match[2].charAt(0).toUpperCase() + match[2].slice(1, 3).toLowerCase();
  const month = months[monthKey];
  const year = match[3];

  if (!month) return "";
  return `${day}/${month}/${year}`;
}

function extractPostcode(address: string): string {
  const match = address.match(/([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})/i);
  return match ? match[1].toUpperCase().replace(/\s+/, " ") : "";
}

function extractUnits(proposal: string): number | null {
  const p = proposal.toLowerCase();
  const patterns = [
    /(\d+)\s*(?:no\.?\s*)?(?:residential\s+)?(?:dwelling|unit|home|house|apartment|flat|maisonette)s?/i,
    /(?:erection|construction|development|provision|creation)\s+of\s+(\d+)\s/i,
    /(\d+)\s*(?:x|no\.?)\s*(?:\d[\s-]*bed)/i,
    /(\d+)\s*(?:bed\s*)?(?:room\s*)?(?:apartment|flat|house|dwelling|unit|home)s?/i,
    /(?:into|to\s+form|to\s+create|providing)\s+(\d+)\s/i,
  ];
  for (const pattern of patterns) {
    const match = p.match(pattern);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > 0 && num < 500) return num;
    }
  }
  if (p.includes("single dwelling") || p.includes("1 dwelling") || p.includes("one dwelling")) return 1;
  if (
    (p.includes("change of use") || p.includes("conversion")) &&
    (p.includes("dwelling") || p.includes("residential")) &&
    !p.match(/\d+\s*(?:dwelling|unit|flat|apartment)/)
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
// (Copied from fetch-planning-batch.ts for identical categorisation)

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
  // "K" moved to EXCLUDED — consultation by other borough
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
  // Idox-specific codes commonly seen in Reigate & Banstead etc.
  "PDE", "VAR", "CPL", "CPE",
  // Reigate & Banstead specific
  "F",  // Full application
  "CU", // Change of Use
  "RET", // Retrospective
  "AGD", // Agricultural Determination
  "DED", // Demolition
  "CONLA", // Conservation Area (Listed alteration)
  // Prior approval variants: PAP3MA, PAP14J, PAP14A, PAP3R, P20ZA
  // (handled by startsWith check below)
  // Reserved Matters variants: RM1G, RM4B
  // (handled by startsWith check below)
  // Variation of S106
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
  // Idox householder codes
  "HOUS", "HSE", "HHOLD",
  // Reigate & Banstead specific
  "CAN", // Cancelled/withdrawn
  "CLP", // Certificate of Lawfulness Proposed
  "CLE", // Certificate of Lawfulness Existing
  "CON", // Conservation area consent (non-residential unless proposal says otherwise)
  "BNG", // Biodiversity Net Gain
  "TED", // Telecom Equipment Determination
  "SCOPE", // EIA Scoping
  "SCREEN", // EIA Screening
  "HRN", // Hedgerow Removal Notice
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
    if (appType === "Householder" || appType === "HOUS" || appType === "HHOLD" || appType === "FLH" || appType === "FLHF" || appType === "HD" || appType === "HH" || appType === "HS" || appType === "HSE" || appType === "Prior Notification Householder" || appType === "Householder Application") return { category: "householder", isRelevant: false, reason: `Excluded type: ${appType}` };
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

// ─── Median Price Loading ────────────────────────────────────

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

// ─── Cookie Management ───────────────────────────────────────

/**
 * Simple cookie jar that parses Set-Cookie headers and replays them.
 * Idox uses JSESSIONID for session tracking.
 */
class CookieJar {
  private cookies: Map<string, string> = new Map();

  /** Parse Set-Cookie headers from a fetch Response */
  absorb(response: Response): void {
    const setCookies = response.headers.getSetCookie?.() ?? [];
    for (const header of setCookies) {
      // Extract name=value from "name=value; Path=/; HttpOnly"
      const nameValue = header.split(";")[0]?.trim();
      if (nameValue) {
        const eqIdx = nameValue.indexOf("=");
        if (eqIdx > 0) {
          const name = nameValue.substring(0, eqIdx);
          const value = nameValue.substring(eqIdx + 1);
          this.cookies.set(name, value);
        }
      }
    }
  }

  /** Return a Cookie header string */
  toString(): string {
    const parts: string[] = [];
    for (const [name, value] of this.cookies) {
      parts.push(`${name}=${value}`);
    }
    return parts.join("; ");
  }

  get size(): number {
    return this.cookies.size;
  }
}

// ─── HTML Parsing (regex-based, no dependencies) ─────────────

/**
 * Decode common HTML entities to plain text.
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&nbsp;/g, " ");
}

/**
 * Strip HTML tags and collapse whitespace.
 */
function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

/**
 * Extract the CSRF token from the Idox search page HTML.
 * Looks for: <input type="hidden" name="_csrf" value="TOKEN">
 */
function extractCsrf(html: string): string {
  const match = html.match(/<input[^>]+name=["']_csrf["'][^>]+value=["']([^"']+)["']/i)
    || html.match(/<input[^>]+value=["']([^"']+)["'][^>]+name=["']_csrf["']/i);
  if (!match) {
    throw new Error("Could not find CSRF token in search page HTML");
  }
  return match[1];
}

/**
 * Retry a function with exponential backoff on 429/5xx errors.
 */
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

/**
 * Extract total results count from HTML.
 * Looks for text like "of 208" or "Showing 1-10 of 208 results"
 */
function extractTotalCount(html: string): number {
  // Try "of NNN" pattern (most common in Idox)
  const match = html.match(/of\s+(\d[\d,]*)\s/i);
  if (match) {
    return parseInt(match[1].replace(/,/g, ""), 10);
  }
  // Try "NNN results" pattern
  const match2 = html.match(/(\d[\d,]*)\s+results?/i);
  if (match2) {
    return parseInt(match2[1].replace(/,/g, ""), 10);
  }
  return 0;
}

/**
 * Parse search result items from Idox HTML.
 * Each result is in an <li class="searchresult"> block.
 */
function parseSearchResults(html: string): IdoxSearchResult[] {
  const results: IdoxSearchResult[] = [];

  // Split on <li class="searchresult"> boundaries
  const chunks = html.split(/<li\s+class=["']searchresult["']/i);

  for (let i = 1; i < chunks.length; i++) {
    const chunk = chunks[i];
    const endLi = chunk.indexOf("</li>");
    const block = endLi >= 0 ? chunk.substring(0, endLi) : chunk;

    // Extract link href and keyVal
    const hrefMatch = block.match(/<a\s+href=["']([^"']*keyVal=([^"'&]+)[^"']*)["']/i);
    if (!hrefMatch) continue;

    const detailUrl = decodeHtmlEntities(hrefMatch[1]);
    const keyVal = hrefMatch[2];

    // Proposal: some portals wrap it in <div class="summaryLinkTextClamp"> (Reigate),
    // others put text directly in the <a> tag (Greenwich). Try both.
    let proposal = "";
    const clampMatch = block.match(/<div\s+class=["']summaryLinkTextClamp["'][^>]*>([\s\S]*?)<\/div>/i);
    if (clampMatch) {
      proposal = stripHtml(clampMatch[1]);
    } else {
      // Fall back to text inside the <a> tag (before any child elements)
      const linkTextMatch = block.match(/<a\s+href=["'][^"']*keyVal=[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
      if (linkTextMatch) {
        proposal = stripHtml(linkTextMatch[1]);
      }
    }

    // Address from <p class="address">
    const addressMatch = block.match(/<p\s+class=["']address["'][^>]*>([\s\S]*?)<\/p>/i);
    const address = addressMatch ? stripHtml(addressMatch[1]) : "";

    // Meta info contains: "Ref. No: XX/XXXXX/TYPE | Validated: ... | Status: ..."
    const metaMatch = block.match(/<p\s+class=["']metaInfo["'][^>]*>([\s\S]*?)<\/p>/i);
    const metaText = metaMatch ? stripHtml(metaMatch[1]) : "";

    // Extract reference from meta: "Ref. No: 26/00119/NMAMD1"
    const refMatch = metaText.match(/Ref\.?\s*(?:No)?:?\s*(\S+)/i);
    const reference = refMatch ? refMatch[1].trim() : "";

    // Extract date from meta: "Validated: Tue 31 Mar 2026" or "Received: Fri 10 Apr 2026"
    // Some portals use Validated, others use Received
    const validatedMatch = metaText.match(/(?:Validated|Received):\s*(.+?)(?:\||$)/i);

    // Extract status from meta: "Status: Registered" or "Status: Decided"
    const statusMatch = metaText.match(/Status:\s*(.+?)(?:\||$)/i);
    const status = statusMatch ? statusMatch[1].trim() : "";

    // Parse date string like "Tue 31 Mar 2026" → "31/03/2026"
    const rawDate = validatedMatch ? validatedMatch[1].trim() : "";
    let dateStr = "";
    if (rawDate) {
      const dateObj = new Date(rawDate);
      if (!isNaN(dateObj.getTime())) {
        const dd = String(dateObj.getDate()).padStart(2, "0");
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const yyyy = dateObj.getFullYear();
        dateStr = `${dd}/${mm}/${yyyy}`;
      }
    }

    results.push({
      detailUrl,
      keyVal,
      reference,
      address,
      proposal,
      status,
      dateStr,
    });
  }

  return results;
}

// ─── Idox HTTP Scraping ──────────────────────────────────────

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

/**
 * Step 1: Load the advanced search page to get a CSRF token and session cookie.
 */
async function getSearchSession(
  authority: IdoxAuthority
): Promise<{ csrf: string; cookies: CookieJar }> {
  const url = `${authority.baseUrl}${idoxPath(authority)}/search.do?action=advanced&searchType=Application`;
  const cookies = new CookieJar();

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html",
    },
    redirect: "follow",
  });

  if (!resp.ok) {
    throw new Error(`Failed to load search page: ${resp.status} ${resp.statusText}`);
  }

  cookies.absorb(resp);
  const html = await resp.text();
  const csrf = extractCsrf(html);

  console.log(`  🔑 Got CSRF token (${csrf.substring(0, 12)}...) and ${cookies.size} session cookies`);

  return { csrf, cookies };
}

/**
 * Step 2: Submit search form and get the first page of results.
 */
async function submitSearch(
  authority: IdoxAuthority,
  csrf: string,
  cookies: CookieJar,
  dateFrom: string,
  dateTo: string
): Promise<{ html: string; cookies: CookieJar }> {
  const url = `${authority.baseUrl}${idoxPath(authority)}/advancedSearchResults.do?action=firstPage`;

  const formData = new URLSearchParams();
  formData.set("_csrf", csrf);
  formData.set("caseAddressType", "Application");
  formData.set("searchType", "Application");
  formData.set("date(applicationReceivedStart)", dateFrom);
  formData.set("date(applicationReceivedEnd)", dateTo);

  const headers: Record<string, string> = {
    "User-Agent": USER_AGENT,
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    Cookie: cookies.toString(),
    Referer: `${authority.baseUrl}${idoxPath(authority)}/search.do?action=advanced&searchType=Application`,
    Origin: authority.baseUrl,
  };

  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: formData.toString(),
    redirect: "follow",
  });

  // Some Idox portals return 403 on the POST but work if we handle the response manually.
  // Log the actual status for debugging.
  if (!resp.ok) {
    // Try reading the body to see if there's an error message
    const errBody = await resp.text().catch(() => "");
    const snippet = errBody.substring(0, 200).replace(/\s+/g, " ").trim();
    throw new Error(`Search submission failed: ${resp.status} ${resp.statusText}${snippet ? ` — ${snippet}` : ""}`);
  }

  cookies.absorb(resp);
  const html = await resp.text();

  return { html, cookies };
}

/**
 * Step 3: Fetch a specific page of results.
 */
async function fetchResultsPage(
  authority: IdoxAuthority,
  cookies: CookieJar,
  pageNum: number
): Promise<{ html: string; cookies: CookieJar }> {
  const url = `${authority.baseUrl}${idoxPath(authority)}/pagedSearchResults.do?action=page&searchCriteria.page=${pageNum}`;

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html",
      Cookie: cookies.toString(),
    },
    redirect: "follow",
  });

  if (!resp.ok) {
    throw new Error(`Page ${pageNum} fetch failed: ${resp.status} ${resp.statusText}`);
  }

  cookies.absorb(resp);
  const html = await resp.text();

  return { html, cookies };
}

/**
 * Generate monthly date ranges between two DD/MM/YYYY dates.
 * Idox portals reject queries returning too many results, so we
 * split a 12-month range into individual months.
 */
function generateMonthlyRanges(
  dateFrom: string,
  dateTo: string
): Array<{ from: string; to: string }> {
  // Parse DD/MM/YYYY
  const [dFrom, mFrom, yFrom] = dateFrom.split("/").map(Number);
  const [dTo, mTo, yTo] = dateTo.split("/").map(Number);

  const start = new Date(yFrom, mFrom - 1, dFrom);
  const end = new Date(yTo, mTo - 1, dTo);
  const ranges: Array<{ from: string; to: string }> = [];

  let cursor = new Date(start);
  while (cursor < end) {
    const rangeStart = new Date(cursor);
    // Move to end of month or end date, whichever is earlier
    const nextMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0); // last day of current month
    const rangeEnd = nextMonth < end ? nextMonth : end;

    ranges.push({
      from: formatDateDDMMYYYY(rangeStart),
      to: formatDateDDMMYYYY(rangeEnd),
    });

    // Move cursor to 1st of next month
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  return ranges;
}

/**
 * Scrape a single date range, handling pagination.
 * Returns results or null if "too many results" error.
 */
async function scrapeDateRange(
  authority: IdoxAuthority,
  dateFrom: string,
  dateTo: string,
  cookies: CookieJar,
  csrf: string
): Promise<{ results: IdoxSearchResult[]; cookies: CookieJar }> {
  // Submit search
  const { html: firstPageHtml, cookies: updatedCookies } = await submitSearch(
    authority, csrf, cookies, dateFrom, dateTo
  );

  // Debug: dump first page HTML if DEBUG_HTML env var is set
  if (process.env.DEBUG_HTML) {
    const debugPath = `/tmp/idox-debug-${authority.id}.html`;
    fs.writeFileSync(debugPath, firstPageHtml, "utf-8");
    console.log(`    🔍 Debug HTML written to ${debugPath}`);
  }

  // Check for "too many results" error
  if (firstPageHtml.includes("Too many results") || firstPageHtml.includes("too many results")) {
    throw new Error("TOO_MANY_RESULTS");
  }

  const firstPageResults = parseSearchResults(firstPageHtml);

  if (firstPageResults.length === 0) {
    if (firstPageHtml.includes("No results found") || firstPageHtml.includes("did not find any")) {
      return { results: [], cookies: updatedCookies };
    }
    return { results: [], cookies: updatedCookies };
  }

  // Extract total results count: "Showing 1-10 of 180"
  const totalMatch = firstPageHtml.match(/of\s+(\d[\d,]*)<\/span>/i);
  const totalCount = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ""), 10) : 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / RESULTS_PER_PAGE) : 1;

  const allResults: IdoxSearchResult[] = [...firstPageResults];
  let currentCookies = updatedCookies;

  // Paginate through remaining pages
  for (let page = 2; page <= totalPages; page++) {
    await sleep(THROTTLE_MS);

    try {
      const { html, cookies: pageCookies } = await withRetry(
        () => fetchResultsPage(authority, currentCookies, page),
        `Page ${page}`
      );
      currentCookies = pageCookies;

      const pageResults = parseSearchResults(html);
      if (pageResults.length === 0) break;
      allResults.push(...pageResults);
    } catch (err) {
      console.error(`    ❌ Error fetching page ${page}: ${err}`);
      continue;
    }

    // Safety limit
    if (allResults.length > 5000) break;
  }

  return { results: allResults, cookies: currentCookies };
}

/**
 * Scrape all search results from an Idox portal for a given date range.
 * Splits into monthly chunks to avoid "too many results" errors.
 * Gets a fresh session for each monthly chunk since Idox CSRF tokens
 * are single-use per search submission.
 */
async function scrapeAllResults(
  authority: IdoxAuthority,
  dateFrom: string,
  dateTo: string
): Promise<IdoxSearchResult[]> {
  // Split into monthly ranges
  const monthlyRanges = generateMonthlyRanges(dateFrom, dateTo);
  console.log(`  📅 Splitting into ${monthlyRanges.length} monthly date ranges`);

  const allResults: IdoxSearchResult[] = [];

  for (let i = 0; i < monthlyRanges.length; i++) {
    const range = monthlyRanges[i];
    console.log(`  📡 Searching ${range.from} → ${range.to} (${i + 1}/${monthlyRanges.length})...`);

    try {
      // Fresh session for each month (CSRF is single-use)
      const { csrf, cookies } = await withRetry(
        () => getSearchSession(authority),
        `Session ${i + 1}`
      );
      await sleep(THROTTLE_MS);

      const { results } = await scrapeDateRange(
        authority, range.from, range.to, cookies, csrf
      );
      console.log(`    ✓ ${results.length} results`);
      allResults.push(...results);
    } catch (err) {
      if (String(err).includes("TOO_MANY_RESULTS")) {
        console.log(`    ⚠️  Too many results for ${range.from}–${range.to}, skipping`);
      } else {
        console.error(`    ❌ Error: ${err}`);
      }
    }

    await sleep(THROTTLE_BETWEEN_MONTHS_MS);
  }

  return allResults;
}

// ─── Idox → Canonical Format Conversion ──────────────────────

/**
 * Convert an Idox search result to the canonical RawApp format
 * used by the processing pipeline.
 */
function normaliseIdoxResult(
  result: IdoxSearchResult,
  authority: IdoxAuthority
): RawApp {
  // Extract application type code from reference (e.g., "25/00187/FUL" → "FUL")
  const refCode = extractRefTypeCode(result.reference) || "";

  return {
    ref_no: result.reference,
    planning_portal_ref_no: "",
    application_address: result.address,
    UPRNDisplay: "",
    proposal: result.proposal,
    app_type: refCode, // Use the extracted ref code as app_type for categorisation
    app_status: result.status,
    decision_notice_type: result.status, // Idox shows decision in the status field
    decision_date: "",
    decision_level: "",
    received_date: result.dateStr || "",
    valid_date: result.dateStr || "",
    expiry_date: "",
    ward: "",
    parish: "",
    case_officer: "",
    ApplicantContactNoName: "",
    AgentContactNoName: "",
    site_area: "",
    KeyNo: result.keyVal,
    postcode: extractPostcode(result.address),
    _authority_id: authority.id,
    _base_url: authority.baseUrl,
  };
}

// ─── Processing Pipeline ─────────────────────────────────────

function buildIdoxSourceUrl(keyVal: string, authority: IdoxAuthority): string {
  if (!keyVal) return "";
  return `${authority.baseUrl}${idoxPath(authority)}/applicationDetails.do?activeTab=summary&keyVal=${keyVal}`;
}

function processApplications(
  rawApps: RawApp[],
  authority: IdoxAuthority,
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
      source_url: buildIdoxSourceUrl(raw.KeyNo || "", authority),
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

function writeWebsiteJson(
  processed: ProcessedApp[],
  authority: IdoxAuthority,
  townSlug: string,
  countySlug: string
): void {
  const relevant = processed.filter((a) => a.is_relevant);

  const approvedApps = relevant.filter((a) => {
    const status = a.status.toUpperCase();
    const decision = a.decision.toUpperCase();
    return (
      status === "APP" || status === "APPROVED" ||
      status === "AAPR" || status === "AEGPD" ||
      decision === "APP" || decision === "AAPR" || decision === "AEGPD" ||
      decision.includes("APPROVE") ||
      decision.includes("CONDITIONAL PERMISSION") ||
      decision.includes("CONSENT") ||
      decision.includes("PERMITTED DEV") ||
      decision.includes("LIST.BLD.APP") ||
      decision.includes("ACCEPT AMEND") ||
      // Idox-specific status strings: "Decided (Approved)", "Decided (Permitted Development)",
      // "Decided (Prior Approval Not Required)"
      status.includes("APPROV") ||
      status.includes("GRANTED") ||
      status.includes("PERMIT") ||
      status.includes("NOT REQUIRED") // Prior Approval Not Required = approved
    );
  });
  const refusedApps = relevant.filter((a) => {
    const status = a.status.toUpperCase();
    const decision = a.decision.toUpperCase();
    return (
      status === "REF" || status === "REFUSED" ||
      decision === "REF" ||
      decision.includes("REFUS") ||
      // Idox-specific: "Decided (Refused)"
      status.includes("REFUS")
    );
  });
  const withdrawnApps = relevant.filter((a) => {
    const status = a.status.toUpperCase();
    return status.includes("WITHDRAWN");
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

  // Sort approved by decision date (newest first), pending by received date (newest first)
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
        source: "idox",
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

async function processAuthority(
  authority: IdoxAuthority,
  dateFrom: string,
  dateTo: string,
  months: number
): Promise<void> {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  🏛️  ${authority.name} (${authority.id})`);
  console.log(`  Portal: Idox Public Access`);
  console.log(`  URL: ${authority.baseUrl}`);
  console.log(`  Period: ${dateFrom} to ${dateTo} (${months} months)`);
  console.log(`${"═".repeat(60)}`);

  // ── Scrape ────────────────────────────────────────────────
  let searchResults: IdoxSearchResult[];
  try {
    searchResults = await scrapeAllResults(authority, dateFrom, dateTo);
  } catch (err) {
    console.error(`  ❌ Failed to scrape ${authority.id}: ${err}`);
    return;
  }

  console.log(`\n  📦 Scraped: ${searchResults.length} search results`);

  if (searchResults.length === 0) {
    console.log(`  ℹ️  No results to process`);
    return;
  }

  // Normalise to canonical RawApp format
  const rawApps = searchResults.map((r) => normaliseIdoxResult(r, authority));

  // Deduplicate on ref_no
  const deduped = new Map<string, RawApp>();
  for (const app of rawApps) {
    const ref = app.ref_no || "";
    if (ref) {
      deduped.set(ref, app);
    }
  }
  const results = Array.from(deduped.values());
  console.log(`  📦 After dedup: ${results.length} unique applications`);

  // Save raw normalised data
  const today = new Date().toISOString().split("T")[0];
  const exportDir = path.join(process.cwd(), "data", "planning-exports");
  fs.mkdirSync(exportDir, { recursive: true });

  const rawPath = path.join(exportDir, `${authority.id}-raw-api-${today}.json`);
  fs.writeFileSync(rawPath, JSON.stringify(results, null, 2));
  console.log(`  💾 Raw data: ${rawPath}`);

  // ── Process for each town ──────────────────────────────────
  for (const town of authority.towns) {
    console.log(`\n  🏘️  Processing for ${town.countySlug}/${town.townSlug}...`);

    const medians = loadMedianPrices(town.countySlug, town.townSlug);
    console.log(`  💰 Medians: detached £${medians.detached.toLocaleString("en-GB")}, flat £${medians.flat.toLocaleString("en-GB")}, blended £${medians.blended.toLocaleString("en-GB")}`);

    const processed = processApplications(
      results,
      authority,
      town.townSlug,
      town.countySlug,
      medians
    );

    // Print category breakdown
    const categories = new Map<string, number>();
    for (const app of processed) {
      const key = `${app.is_relevant ? "✓" : "✗"} ${app.category}`;
      categories.set(key, (categories.get(key) || 0) + 1);
    }
    console.log(`\n  Category breakdown:`);
    for (const [cat, count] of [...categories.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`    ${count.toString().padStart(4)}  ${cat}`);
    }

    // Write website pipeline JSON
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
        "  npx tsx scripts/fetch-planning-idox.ts --authority <id>\n" +
        "  npx tsx scripts/fetch-planning-idox.ts --all\n" +
        "  npx tsx scripts/fetch-planning-idox.ts --all --months 6\n" +
        "\nAvailable Idox authorities:"
    );
    for (const a of getEnabledIdoxAuthorities()) {
      console.error(`  ✅ ${a.id} — ${a.name}`);
    }
    console.error("\nDisabled (use --authority to force):");
    for (const a of IDOX_AUTHORITIES.filter((x) => !x.enabled)) {
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
  const dateFrom = formatDateDDMMYYYY(from);
  const dateTo = formatDateDDMMYYYY(now);

  let authorities: IdoxAuthority[];

  if (all) {
    authorities = getEnabledIdoxAuthorities();
    console.log(`\n🚀 Batch scraping ${authorities.length} enabled Idox authorities (${months} months)`);
  } else {
    const auth = getIdoxAuthority(authorityId!);
    if (!auth) {
      console.error(`❌ Unknown Idox authority: ${authorityId}`);
      console.error("Available IDs:");
      for (const a of IDOX_AUTHORITIES) {
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

  // Process authorities concurrently — each hits a different server
  const CONCURRENCY = all ? 10 : 1;

  async function processOne(authority: IdoxAuthority) {
    try {
      await processAuthority(authority, dateFrom, dateTo, months);
      results.push({ id: authority.id, name: authority.name, success: true });
    } catch (err) {
      console.error(`\n❌ Fatal error processing ${authority.id}: ${err}`);
      results.push({
        id: authority.id,
        name: authority.name,
        success: false,
        error: String(err),
      });
    }
  }

  if (CONCURRENCY > 1 && authorities.length > 1) {
    console.log(`  ⚡ Running ${CONCURRENCY} authorities concurrently\n`);
    // Process in chunks of CONCURRENCY
    for (let i = 0; i < authorities.length; i += CONCURRENCY) {
      const chunk = authorities.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map(processOne));
    }
  } else {
    for (const authority of authorities) {
      await processOne(authority);
      if (authorities.length > 1) {
        await sleep(2000);
      }
    }
  }

  // ── Summary ────────────────────────────────────────────────
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
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
