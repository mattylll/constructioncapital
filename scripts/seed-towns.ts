/**
 * Seed Towns Script
 *
 * Populates the Convex database with ~100 major UK towns and their counties.
 * Idempotent: skips records that already exist.
 *
 * Usage:
 *   npx tsx scripts/seed-towns.ts
 *
 * Requires:
 *   - CONVEX_URL or NEXT_PUBLIC_CONVEX_URL in .env.local or environment
 *   - Convex mutations: locations.create, counties.create
 *     (run `npx convex dev` first to generate the API)
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as path from "path";
import * as fs from "fs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TownData {
  name: string;
  county: string;
  region: string;
  population: number;
  lat: number;
  lng: number;
}

interface CountyAggregate {
  name: string;
  slug: string;
  region: string;
  townCount: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Minimal .env file parser (no external dependency required).
 * Reads KEY=VALUE lines and sets them on process.env if not already set.
 */
function loadEnvFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;

  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    // Remove surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Only set if not already in environment
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
  return true;
}

function loadEnv(): void {
  const root = path.resolve(__dirname, "..");
  const envLocalPath = path.join(root, ".env.local");
  const envPath = path.join(root, ".env");

  if (loadEnvFile(envLocalPath)) {
    console.log("[env] Loaded .env.local");
  } else if (loadEnvFile(envPath)) {
    console.log("[env] Loaded .env");
  } else {
    console.log("[env] No .env file found, using environment variables");
  }
}

// ---------------------------------------------------------------------------
// Town Data (100+ towns across all UK regions)
// ---------------------------------------------------------------------------

const towns: TownData[] = [
  // ─── London (14 locations) ────────────────────────────────────────────────
  { name: "City of London", county: "Greater London", region: "London", population: 8982, lat: 51.5155, lng: -0.0922 },
  { name: "Westminster", county: "Greater London", region: "London", population: 261000, lat: 51.4975, lng: -0.1357 },
  { name: "Camden", county: "Greater London", region: "London", population: 270000, lat: 51.5290, lng: -0.1255 },
  { name: "Islington", county: "Greater London", region: "London", population: 242000, lat: 51.5362, lng: -0.1033 },
  { name: "Hackney", county: "Greater London", region: "London", population: 281000, lat: 51.5450, lng: -0.0553 },
  { name: "Tower Hamlets", county: "Greater London", region: "London", population: 324000, lat: 51.5152, lng: -0.0198 },
  { name: "Greenwich", county: "Greater London", region: "London", population: 289000, lat: 51.4934, lng: 0.0098 },
  { name: "Lewisham", county: "Greater London", region: "London", population: 305000, lat: 51.4415, lng: -0.0117 },
  { name: "Southwark", county: "Greater London", region: "London", population: 320000, lat: 51.5035, lng: -0.0804 },
  { name: "Lambeth", county: "Greater London", region: "London", population: 326000, lat: 51.4571, lng: -0.1231 },
  { name: "Croydon", county: "Greater London", region: "London", population: 386000, lat: 51.3762, lng: -0.0982 },
  { name: "Ealing", county: "Greater London", region: "London", population: 341000, lat: 51.5130, lng: -0.3089 },
  { name: "Richmond upon Thames", county: "Greater London", region: "London", population: 198000, lat: 51.4613, lng: -0.3037 },
  { name: "Barnet", county: "Greater London", region: "London", population: 402000, lat: 51.6252, lng: -0.1517 },

  // ─── South East (13 locations) ────────────────────────────────────────────
  { name: "Brighton", county: "East Sussex", region: "South East", population: 229000, lat: 50.8225, lng: -0.1372 },
  { name: "Reading", county: "Berkshire", region: "South East", population: 174000, lat: 51.4543, lng: -0.9781 },
  { name: "Oxford", county: "Oxfordshire", region: "South East", population: 152000, lat: 51.7520, lng: -1.2577 },
  { name: "Milton Keynes", county: "Buckinghamshire", region: "South East", population: 248000, lat: 52.0406, lng: -0.7594 },
  { name: "Canterbury", county: "Kent", region: "South East", population: 55000, lat: 51.2802, lng: 1.0789 },
  { name: "Maidstone", county: "Kent", region: "South East", population: 113000, lat: 51.2724, lng: 0.5290 },
  { name: "Guildford", county: "Surrey", region: "South East", population: 82000, lat: 51.2362, lng: -0.5704 },
  { name: "Winchester", county: "Hampshire", region: "South East", population: 45000, lat: 51.0632, lng: -1.3080 },
  { name: "Southampton", county: "Hampshire", region: "South East", population: 252000, lat: 50.9097, lng: -1.4044 },
  { name: "Portsmouth", county: "Hampshire", region: "South East", population: 215000, lat: 50.8198, lng: -1.0880 },
  { name: "Slough", county: "Berkshire", region: "South East", population: 164000, lat: 51.5105, lng: -0.5950 },
  { name: "Crawley", county: "West Sussex", region: "South East", population: 114000, lat: 51.1092, lng: -0.1872 },
  { name: "Tunbridge Wells", county: "Kent", region: "South East", population: 60000, lat: 51.1320, lng: 0.2637 },

  // ─── South West (10 locations) ────────────────────────────────────────────
  { name: "Bristol", county: "Bristol", region: "South West", population: 472000, lat: 51.4545, lng: -2.5879 },
  { name: "Bath", county: "Somerset", region: "South West", population: 90000, lat: 51.3811, lng: -2.3590 },
  { name: "Exeter", county: "Devon", region: "South West", population: 131000, lat: 50.7184, lng: -3.5339 },
  { name: "Plymouth", county: "Devon", region: "South West", population: 262000, lat: 50.3755, lng: -4.1427 },
  { name: "Cheltenham", county: "Gloucestershire", region: "South West", population: 119000, lat: 51.8994, lng: -2.0783 },
  { name: "Gloucester", county: "Gloucestershire", region: "South West", population: 130000, lat: 51.8642, lng: -2.2382 },
  { name: "Swindon", county: "Wiltshire", region: "South West", population: 185000, lat: 51.5558, lng: -1.7797 },
  { name: "Bournemouth", county: "Dorset", region: "South West", population: 187000, lat: 50.7192, lng: -1.8808 },
  { name: "Taunton", county: "Somerset", region: "South West", population: 70000, lat: 51.0190, lng: -3.1003 },
  { name: "Salisbury", county: "Wiltshire", region: "South West", population: 45000, lat: 51.0688, lng: -1.7945 },

  // ─── East of England (10 locations) ───────────────────────────────────────
  { name: "Cambridge", county: "Cambridgeshire", region: "East of England", population: 145000, lat: 52.2053, lng: 0.1218 },
  { name: "Norwich", county: "Norfolk", region: "East of England", population: 144000, lat: 52.6309, lng: 1.2974 },
  { name: "Ipswich", county: "Suffolk", region: "East of England", population: 139000, lat: 52.0567, lng: 1.1482 },
  { name: "Colchester", county: "Essex", region: "East of England", population: 122000, lat: 51.8959, lng: 0.8919 },
  { name: "Chelmsford", county: "Essex", region: "East of England", population: 178000, lat: 51.7356, lng: 0.4685 },
  { name: "Southend-on-Sea", county: "Essex", region: "East of England", population: 183000, lat: 51.5459, lng: 0.7077 },
  { name: "Luton", county: "Bedfordshire", region: "East of England", population: 225000, lat: 51.8787, lng: -0.4200 },
  { name: "St Albans", county: "Hertfordshire", region: "East of England", population: 82000, lat: 51.7553, lng: -0.3360 },
  { name: "Watford", county: "Hertfordshire", region: "East of England", population: 102000, lat: 51.6565, lng: -0.3903 },
  { name: "Peterborough", county: "Cambridgeshire", region: "East of England", population: 203000, lat: 52.5695, lng: -0.2405 },

  // ─── East Midlands (8 locations) ──────────────────────────────────────────
  { name: "Nottingham", county: "Nottinghamshire", region: "East Midlands", population: 332000, lat: 52.9548, lng: -1.1581 },
  { name: "Leicester", county: "Leicestershire", region: "East Midlands", population: 354000, lat: 52.6369, lng: -1.1398 },
  { name: "Derby", county: "Derbyshire", region: "East Midlands", population: 257000, lat: 52.9225, lng: -1.4746 },
  { name: "Lincoln", county: "Lincolnshire", region: "East Midlands", population: 100000, lat: 53.2307, lng: -0.5406 },
  { name: "Northampton", county: "Northamptonshire", region: "East Midlands", population: 225000, lat: 52.2405, lng: -0.9027 },
  { name: "Mansfield", county: "Nottinghamshire", region: "East Midlands", population: 108000, lat: 53.1472, lng: -1.1987 },
  { name: "Loughborough", county: "Leicestershire", region: "East Midlands", population: 65000, lat: 52.7721, lng: -1.2065 },
  { name: "Corby", county: "Northamptonshire", region: "East Midlands", population: 72000, lat: 52.4875, lng: -0.6887 },

  // ─── West Midlands (9 locations) ──────────────────────────────────────────
  { name: "Birmingham", county: "West Midlands", region: "West Midlands", population: 1141000, lat: 52.4862, lng: -1.8904 },
  { name: "Coventry", county: "West Midlands", region: "West Midlands", population: 371000, lat: 52.4068, lng: -1.5197 },
  { name: "Wolverhampton", county: "West Midlands", region: "West Midlands", population: 263000, lat: 52.5870, lng: -2.1288 },
  { name: "Stoke-on-Trent", county: "Staffordshire", region: "West Midlands", population: 256000, lat: 53.0027, lng: -2.1794 },
  { name: "Worcester", county: "Worcestershire", region: "West Midlands", population: 101000, lat: 52.1920, lng: -2.2216 },
  { name: "Solihull", county: "West Midlands", region: "West Midlands", population: 214000, lat: 52.4130, lng: -1.7743 },
  { name: "Walsall", county: "West Midlands", region: "West Midlands", population: 283000, lat: 52.5860, lng: -1.9821 },
  { name: "Telford", county: "Shropshire", region: "West Midlands", population: 155000, lat: 52.6766, lng: -2.4469 },
  { name: "Hereford", county: "Herefordshire", region: "West Midlands", population: 58000, lat: 52.0565, lng: -2.7160 },

  // ─── North West (11 locations) ────────────────────────────────────────────
  { name: "Manchester", county: "Greater Manchester", region: "North West", population: 553000, lat: 53.4808, lng: -2.2426 },
  { name: "Liverpool", county: "Merseyside", region: "North West", population: 498000, lat: 53.4084, lng: -2.9916 },
  { name: "Chester", county: "Cheshire", region: "North West", population: 83000, lat: 53.1906, lng: -2.8912 },
  { name: "Warrington", county: "Cheshire", region: "North West", population: 210000, lat: 53.3900, lng: -2.5970 },
  { name: "Preston", county: "Lancashire", region: "North West", population: 141000, lat: 53.7632, lng: -2.7031 },
  { name: "Blackpool", county: "Lancashire", region: "North West", population: 139000, lat: 53.8175, lng: -3.0357 },
  { name: "Bolton", county: "Greater Manchester", region: "North West", population: 195000, lat: 53.5785, lng: -2.4299 },
  { name: "Stockport", county: "Greater Manchester", region: "North West", population: 293000, lat: 53.4106, lng: -2.1575 },
  { name: "Salford", county: "Greater Manchester", region: "North West", population: 269000, lat: 53.4875, lng: -2.2901 },
  { name: "Wigan", county: "Greater Manchester", region: "North West", population: 326000, lat: 53.5448, lng: -2.6325 },
  { name: "Lancaster", county: "Lancashire", region: "North West", population: 52000, lat: 54.0466, lng: -2.8007 },

  // ─── North East (6 locations) ─────────────────────────────────────────────
  { name: "Newcastle upon Tyne", county: "Tyne and Wear", region: "North East", population: 302000, lat: 54.9783, lng: -1.6178 },
  { name: "Sunderland", county: "Tyne and Wear", region: "North East", population: 277000, lat: 54.9069, lng: -1.3838 },
  { name: "Durham", county: "County Durham", region: "North East", population: 48000, lat: 54.7761, lng: -1.5733 },
  { name: "Middlesbrough", county: "North Yorkshire", region: "North East", population: 140000, lat: 54.5742, lng: -1.2350 },
  { name: "Darlington", county: "County Durham", region: "North East", population: 106000, lat: 54.5233, lng: -1.5527 },
  { name: "Gateshead", county: "Tyne and Wear", region: "North East", population: 120000, lat: 54.9627, lng: -1.6014 },

  // ─── Yorkshire and the Humber (11 locations) ──────────────────────────────
  { name: "Leeds", county: "West Yorkshire", region: "Yorkshire and the Humber", population: 793000, lat: 53.8008, lng: -1.5491 },
  { name: "Sheffield", county: "South Yorkshire", region: "Yorkshire and the Humber", population: 584000, lat: 53.3811, lng: -1.4701 },
  { name: "Bradford", county: "West Yorkshire", region: "Yorkshire and the Humber", population: 537000, lat: 53.7960, lng: -1.7594 },
  { name: "York", county: "North Yorkshire", region: "Yorkshire and the Humber", population: 210000, lat: 53.9591, lng: -1.0815 },
  { name: "Hull", county: "East Riding of Yorkshire", region: "Yorkshire and the Humber", population: 260000, lat: 53.7457, lng: -0.3367 },
  { name: "Doncaster", county: "South Yorkshire", region: "Yorkshire and the Humber", population: 311000, lat: 53.5228, lng: -1.1285 },
  { name: "Wakefield", county: "West Yorkshire", region: "Yorkshire and the Humber", population: 340000, lat: 53.6830, lng: -1.4977 },
  { name: "Huddersfield", county: "West Yorkshire", region: "Yorkshire and the Humber", population: 162000, lat: 53.6458, lng: -1.7850 },
  { name: "Rotherham", county: "South Yorkshire", region: "Yorkshire and the Humber", population: 265000, lat: 53.4326, lng: -1.3568 },
  { name: "Harrogate", county: "North Yorkshire", region: "Yorkshire and the Humber", population: 75000, lat: 53.9921, lng: -1.5418 },
  { name: "Scarborough", county: "North Yorkshire", region: "Yorkshire and the Humber", population: 61000, lat: 54.2830, lng: -0.3999 },

  // ─── Scotland (8 locations) ───────────────────────────────────────────────
  { name: "Edinburgh", county: "City of Edinburgh", region: "Scotland", population: 527000, lat: 55.9533, lng: -3.1883 },
  { name: "Glasgow", county: "City of Glasgow", region: "Scotland", population: 635000, lat: 55.8642, lng: -4.2518 },
  { name: "Aberdeen", county: "Aberdeenshire", region: "Scotland", population: 229000, lat: 57.1497, lng: -2.0943 },
  { name: "Dundee", county: "City of Dundee", region: "Scotland", population: 149000, lat: 56.4620, lng: -2.9707 },
  { name: "Inverness", county: "Highland", region: "Scotland", population: 63000, lat: 57.4778, lng: -4.2247 },
  { name: "Stirling", county: "Stirling", region: "Scotland", population: 37000, lat: 56.1165, lng: -3.9369 },
  { name: "Perth", county: "Perth and Kinross", region: "Scotland", population: 47000, lat: 56.3952, lng: -3.4372 },
  { name: "Paisley", county: "Renfrewshire", region: "Scotland", population: 77000, lat: 55.8456, lng: -4.4239 },

  // ─── Wales (6 locations) ──────────────────────────────────────────────────
  { name: "Cardiff", county: "Cardiff", region: "Wales", population: 362000, lat: 51.4816, lng: -3.1791 },
  { name: "Swansea", county: "Swansea", region: "Wales", population: 246000, lat: 51.6214, lng: -3.9436 },
  { name: "Newport", county: "Newport", region: "Wales", population: 155000, lat: 51.5842, lng: -2.9977 },
  { name: "Wrexham", county: "Wrexham", region: "Wales", population: 65000, lat: 53.0510, lng: -2.9916 },
  { name: "Bangor", county: "Gwynedd", region: "Wales", population: 18000, lat: 53.2274, lng: -4.1293 },
  { name: "Aberystwyth", county: "Ceredigion", region: "Wales", population: 16000, lat: 52.4153, lng: -4.0829 },

  // ─── Northern Ireland (4 locations) ───────────────────────────────────────
  { name: "Belfast", county: "County Antrim", region: "Northern Ireland", population: 343000, lat: 54.5973, lng: -5.9301 },
  { name: "Derry", county: "County Londonderry", region: "Northern Ireland", population: 85000, lat: 54.9966, lng: -7.3086 },
  { name: "Lisburn", county: "County Antrim", region: "Northern Ireland", population: 75000, lat: 54.5162, lng: -6.0580 },
  { name: "Newry", county: "County Down", region: "Northern Ireland", population: 27000, lat: 54.1751, lng: -6.3402 },
];

// ---------------------------------------------------------------------------
// Main script
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  loadEnv();

  const convexUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;

  if (!convexUrl) {
    console.error(
      "[error] CONVEX_URL or NEXT_PUBLIC_CONVEX_URL not found in environment.\n" +
        "  Set it in .env.local or pass it directly:\n" +
        "  CONVEX_URL=https://your-deployment.convex.cloud npx tsx scripts/seed-towns.ts"
    );
    process.exit(1);
  }

  console.log(`[info] Connecting to Convex at ${convexUrl}`);
  const client = new ConvexHttpClient(convexUrl);

  // ── Fetch existing locations for idempotency ──────────────────────────────
  console.log("[info] Fetching existing locations...");

  let existingLocations: Array<{ county_slug: string; town_slug: string }> = [];
  try {
    existingLocations = await client.query(api.locations.getAll, {});
  } catch {
    // Fall back to getTopLocations if getAll not available
    try {
      existingLocations = await client.query(api.locations.getTopLocations, {
        limit: 1000,
      });
    } catch {
      console.log(
        "[warn] Could not fetch existing locations (table may be empty)."
      );
    }
  }

  const existingKeys = new Set(
    existingLocations.map((l) => `${l.county_slug}::${l.town_slug}`)
  );
  console.log(`[info] Found ${existingLocations.length} existing locations.`);

  // ── Fetch existing counties for idempotency ───────────────────────────────
  let existingCounties: Array<{ slug: string }> = [];
  try {
    existingCounties = await client.query(api.counties.getAll, {});
  } catch {
    console.log(
      "[warn] Could not fetch existing counties (table may be empty)."
    );
  }

  const existingCountySlugs = new Set(existingCounties.map((c) => c.slug));
  console.log(`[info] Found ${existingCounties.length} existing counties.`);

  // ── Build county aggregates from town data ────────────────────────────────
  const countyMap = new Map<string, CountyAggregate>();

  for (const town of towns) {
    const slug = slugify(town.county);
    const existing = countyMap.get(slug);
    if (existing) {
      existing.townCount++;
    } else {
      countyMap.set(slug, {
        name: town.county,
        slug,
        region: town.region,
        townCount: 1,
      });
    }
  }

  // ── Insert counties ───────────────────────────────────────────────────────
  console.log(`\n[info] Processing ${countyMap.size} counties...`);
  let countiesInserted = 0;
  let countiesSkipped = 0;

  for (const [, county] of countyMap) {
    if (existingCountySlugs.has(county.slug)) {
      countiesSkipped++;
      continue;
    }

    try {
      await client.mutation(api.counties.create, {
        name: county.name,
        slug: county.slug,
        region: county.region,
        description: `Property development finance in ${county.name}. Construction Capital arranges development finance, bridging loans, mezzanine finance, and more for projects across ${county.name}.`,
        meta_title: `Development Finance in ${county.name} | Construction Capital`,
        meta_description: `Expert property development finance brokerage in ${county.name}. Access senior debt, bridging loans, mezzanine finance and equity for construction projects across ${county.name}.`,
        town_count: county.townCount,
      });
      countiesInserted++;
      console.log(`  [+] County: ${county.name} (${county.slug})`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  [!] Failed to insert county ${county.name}: ${message}`);
    }
  }

  console.log(
    `[info] Counties: ${countiesInserted} inserted, ${countiesSkipped} skipped (already exist).`
  );

  // ── Insert locations ──────────────────────────────────────────────────────
  console.log(`\n[info] Processing ${towns.length} towns...`);
  let locationsInserted = 0;
  let locationsSkipped = 0;

  for (const town of towns) {
    const countySlug = slugify(town.county);
    const townSlug = slugify(town.name);
    const key = `${countySlug}::${townSlug}`;

    if (existingKeys.has(key)) {
      locationsSkipped++;
      continue;
    }

    try {
      await client.mutation(api.locations.create, {
        county: town.county,
        county_slug: countySlug,
        town: town.name,
        town_slug: townSlug,
        region: town.region,
        population: town.population,
        latitude: town.lat,
        longitude: town.lng,
        is_published: true,
        priority: Math.round(town.population / 1000),
      });
      locationsInserted++;
      console.log(
        `  [+] ${town.name}, ${town.county} (${countySlug}/${townSlug})`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  [!] Failed to insert ${town.name}: ${message}`);
    }
  }

  console.log(
    `\n[info] Locations: ${locationsInserted} inserted, ${locationsSkipped} skipped (already exist).`
  );

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n========================================");
  console.log("  Seed complete");
  console.log(`  Total towns in dataset:   ${towns.length}`);
  console.log(`  Towns inserted:           ${locationsInserted}`);
  console.log(`  Towns skipped:            ${locationsSkipped}`);
  console.log(`  Counties inserted:        ${countiesInserted}`);
  console.log(`  Counties skipped:         ${countiesSkipped}`);
  console.log("========================================\n");
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
