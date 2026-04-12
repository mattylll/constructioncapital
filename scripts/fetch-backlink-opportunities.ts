/**
 * Backlink Opportunity Scraper
 *
 * Uses DataForSEO APIs to find backlink opportunities from competitors
 * ranking for target keywords. Stores results in Turso/libsql.
 *
 * Pipeline:
 *   1. SERP analysis — find who ranks for each keyword
 *   2. Competitor aggregation — identify top competitor domains
 *   3. Backlink extraction — get competitor backlink profiles
 *   4. Domain intersection — find link gaps (link to them, not us)
 *
 * Usage:
 *   npx tsx scripts/fetch-backlink-opportunities.ts
 *   npx tsx scripts/fetch-backlink-opportunities.ts --step serp
 *   npx tsx scripts/fetch-backlink-opportunities.ts --step backlinks
 *   npx tsx scripts/fetch-backlink-opportunities.ts --step intersection
 *   npx tsx scripts/fetch-backlink-opportunities.ts --limit 20
 */

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { createClient } from "@libsql/client";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// ─── Configuration ───────────────────────────────────────────

const DATAFORSEO_AUTH = process.env.DATAFORSEO_AUTH;
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

const API_BASE = "https://api.dataforseo.com/v3";
const THROTTLE_MS = 500; // between API calls
const UK_LOCATION_CODE = 2826; // United Kingdom
const OUR_DOMAINS = [
  "constructioncapital.co.uk",
  "construction-capital.co.uk",
  "www.constructioncapital.co.uk",
  "www.construction-capital.co.uk",
];

// Large generic domains to exclude from competitor analysis
const EXCLUDED_DOMAINS = new Set([
  "wikipedia.org",
  "en.wikipedia.org",
  "gov.uk",
  "www.gov.uk",
  "youtube.com",
  "www.youtube.com",
  "facebook.com",
  "twitter.com",
  "linkedin.com",
  "instagram.com",
  "amazon.co.uk",
  "amazon.com",
  "reddit.com",
  "www.reddit.com",
  "bbc.co.uk",
  "www.bbc.co.uk",
  "theguardian.com",
  "telegraph.co.uk",
  "thetimes.co.uk",
  "ft.com",
  "which.co.uk",
]);

// Raw output directory
const RAW_DIR = path.join(process.cwd(), "data", "backlinks-raw");

// ─── Types ───────────────────────────────────────────────────

interface KeywordEntry {
  keyword: string;
  searchVolume: number | null;
  cpcGbp: number | null;
  competition: string;
  intent: string;
  pageType: string;
}

// ─── Helpers ─────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getDb() {
  if (!TURSO_DATABASE_URL) throw new Error("TURSO_DATABASE_URL not set");
  return createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });
}

async function dataforseoFetch(endpoint: string, body: unknown[]) {
  if (!DATAFORSEO_AUTH) throw new Error("DATAFORSEO_AUTH not set in .env.local");

  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${DATAFORSEO_AUTH}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DataForSEO ${res.status}: ${text}`);
  }

  return res.json();
}

function saveRaw(filename: string, data: unknown) {
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(RAW_DIR, filename),
    JSON.stringify(data, null, 2)
  );
}

// ─── Keyword Parsing ─────────────────────────────────────────

function parseKeywords(): KeywordEntry[] {
  // Deduplicated keyword list from user input
  const raw: KeywordEntry[] = [
    { keyword: "property development lenders", searchVolume: 1000, cpcGbp: 14.97, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "property development loan", searchVolume: 1000, cpcGbp: 14.97, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "property development finance", searchVolume: 720, cpcGbp: 13.31, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "bridging finance for property development", searchVolume: 390, cpcGbp: 39.65, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "bridging loan for property development", searchVolume: 390, cpcGbp: 39.65, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "commercial property development finance", searchVolume: 210, cpcGbp: 13.36, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "business loan for property development", searchVolume: 210, cpcGbp: 19.84, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "property refurbishment loan", searchVolume: 170, cpcGbp: 15.37, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "residential development finance", searchVolume: 170, cpcGbp: 12.92, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "property development funding", searchVolume: 170, cpcGbp: 10.72, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "property refurbishment finance", searchVolume: 140, cpcGbp: 3.86, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "development finance UK", searchVolume: 140, cpcGbp: 15.87, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "development loans uk", searchVolume: 110, cpcGbp: 14.18, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "house development loan", searchVolume: 90, cpcGbp: 16.38, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "property developer finance", searchVolume: 90, cpcGbp: 11.05, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "residential development loans", searchVolume: 90, cpcGbp: 19.83, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "construction loan uk", searchVolume: 90, cpcGbp: 22.11, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "property development finance uk", searchVolume: 90, cpcGbp: 23.74, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "property development loans uk", searchVolume: 90, cpcGbp: 20.37, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "residential property development finance", searchVolume: 70, cpcGbp: null, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "development bridging loan", searchVolume: 70, cpcGbp: 32.40, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "development bridging finance", searchVolume: 70, cpcGbp: 32.40, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "property development finance options", searchVolume: 50, cpcGbp: null, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "residential property development loan", searchVolume: 50, cpcGbp: 9.04, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "heavy refurbishment finance", searchVolume: 50, cpcGbp: null, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "commercial property development loan", searchVolume: 50, cpcGbp: null, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "joint venture finance for property development", searchVolume: 50, cpcGbp: 24.28, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "ground up development finance", searchVolume: 50, cpcGbp: 27.28, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "commercial bridging loan for property development", searchVolume: 40, cpcGbp: null, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "development finance lenders uk", searchVolume: 40, cpcGbp: 8.12, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "land development loans", searchVolume: 40, cpcGbp: 8.66, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "construction finance UK", searchVolume: 40, cpcGbp: null, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "commercial bridging loan for property developers", searchVolume: 30, cpcGbp: null, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "care home development finance", searchVolume: 30, cpcGbp: 6.45, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "bridging loan for property developers", searchVolume: 30, cpcGbp: null, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "development property finance", searchVolume: 30, cpcGbp: null, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "building development finance", searchVolume: 30, cpcGbp: 27.22, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "bridging and development finance", searchVolume: 30, cpcGbp: 15.95, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "real estate development financing", searchVolume: 30, cpcGbp: 24.04, competition: "High", intent: "Commercial", pageType: "Content page" },
    { keyword: "best property development loans", searchVolume: 30, cpcGbp: 15.05, competition: "High", intent: "Commercial", pageType: "Content page" },
    // Informational keywords
    { keyword: "development finance due diligence", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "development finance application process", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "what do development finance lenders look for", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "development finance profit margin", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "development finance for beginners", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Commercial", pageType: "Guide / Blog post" },
    { keyword: "property development finance guide", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "how to finance a property development", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Commercial", pageType: "Guide / Blog post" },
    { keyword: "property development appraisal", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "development finance drawdown", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "development finance GDV explained", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "development finance LTV", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "development finance LTC ratio", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "development finance costs UK", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "how to get development finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Commercial", pageType: "Guide / Blog post" },
    { keyword: "development finance vs bridging finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "development finance explained", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    { keyword: "what is development finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Informational", pageType: "Guide / Blog post" },
    // Geo keywords
    { keyword: "development finance broker London", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Location page" },
    { keyword: "development finance broker Manchester", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Location page" },
    { keyword: "development finance London", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Location page" },
    { keyword: "development finance Manchester", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Location page" },
    { keyword: "development finance Birmingham", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Location page" },
    { keyword: "development finance Leeds", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Location page" },
    { keyword: "development finance Bristol", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Location page" },
    // Scheme types
    { keyword: "development finance interest rates UK", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Commercial", pageType: "Scheme type page" },
    { keyword: "90% GDV development finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Commercial", pageType: "Scheme type page" },
    { keyword: "pre-planning development finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Scheme type page" },
    { keyword: "brownfield development finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Scheme type page" },
    // Loan products
    { keyword: "mezzanine finance development", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Commercial", pageType: "Product service page" },
    { keyword: "development exit finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Product service page" },
    { keyword: "100% development finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Product service page" },
    { keyword: "permitted development finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Product service page" },
    { keyword: "light refurbishment finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Product service page" },
    { keyword: "barn conversion finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Product service page" },
    { keyword: "office to residential conversion finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Product service page" },
    { keyword: "first time developer finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Product service page" },
    // Core service
    { keyword: "development finance calculator", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Commercial", pageType: "Pillar / Homepage" },
    { keyword: "development finance rates UK", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Commercial", pageType: "Pillar / Homepage" },
    { keyword: "development finance broker", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Pillar / Homepage" },
    { keyword: "development finance lender", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Pillar / Homepage" },
    { keyword: "development finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Commercial", pageType: "Pillar / Homepage" },
    // Developer segments
    { keyword: "build to rent finance UK", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Segment landing page" },
    { keyword: "HMO development finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Segment landing page" },
    { keyword: "student accommodation development finance", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Segment landing page" },
    { keyword: "development finance for small developers", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Segment landing page" },
    { keyword: "development finance SPV", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Segment landing page" },
    { keyword: "development finance adverse credit", searchVolume: null, cpcGbp: null, competition: "Low", intent: "Transactional", pageType: "Segment landing page" },
  ];

  // Deduplicate by keyword (case-insensitive)
  const seen = new Set<string>();
  return raw.filter((entry) => {
    const key = entry.keyword.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Step 1: SERP Analysis ──────────────────────────────────

async function runSerpAnalysis(db: ReturnType<typeof createClient>) {
  const keywords = parseKeywords();
  console.log(`\n━━━ STEP 1: SERP Analysis ━━━`);
  console.log(`Processing ${keywords.length} unique keywords...\n`);

  // Insert keywords
  for (const kw of keywords) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO backlink_keywords (keyword, search_volume, cpc_gbp, competition, intent, page_type)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [kw.keyword, kw.searchVolume, kw.cpcGbp, kw.competition, kw.intent, kw.pageType],
    });
  }
  console.log(`Inserted ${keywords.length} keywords into DB`);

  // Fetch SERP for each keyword
  let totalCost = 0;
  let processed = 0;

  for (const kw of keywords) {
    processed++;
    try {
      // Get keyword ID
      const kwRow = await db.execute({
        sql: `SELECT id FROM backlink_keywords WHERE keyword = ?`,
        args: [kw.keyword],
      });
      const keywordId = kwRow.rows[0]?.id as number;

      // Check if already fetched
      const existing = await db.execute({
        sql: `SELECT COUNT(*) as cnt FROM backlink_serp_results WHERE keyword_id = ?`,
        args: [keywordId],
      });
      if ((existing.rows[0]?.cnt as number) > 0) {
        console.log(`  [${processed}/${keywords.length}] SKIP "${kw.keyword}" (already fetched)`);
        continue;
      }

      console.log(`  [${processed}/${keywords.length}] Fetching SERP for "${kw.keyword}"...`);

      const data = await dataforseoFetch("/serp/google/organic/live/regular", [
        {
          keyword: kw.keyword,
          location_code: UK_LOCATION_CODE,
          language_code: "en",
          depth: 20,
          device: "desktop",
        },
      ]);

      totalCost += data.cost || 0;
      saveRaw(`serp-${kw.keyword.replace(/\s+/g, "-").toLowerCase()}.json`, data);

      // Extract organic results
      const task = data.tasks?.[0];
      if (task?.status_code !== 20000 || !task.result?.[0]?.items) {
        console.log(`    ⚠ No results for "${kw.keyword}"`);
        await sleep(THROTTLE_MS);
        continue;
      }

      const items = task.result[0].items.filter(
        (item: { type: string }) => item.type === "organic"
      );

      for (const item of items) {
        const domain = (item.domain || "").replace(/^www\./, "");
        await db.execute({
          sql: `INSERT INTO backlink_serp_results (keyword_id, position, domain, url, title)
                VALUES (?, ?, ?, ?, ?)`,
          args: [keywordId, item.rank_absolute || item.rank_group || 0, domain, item.url || "", item.title || ""],
        });
      }

      console.log(`    ✓ ${items.length} organic results`);
      await sleep(THROTTLE_MS);
    } catch (err) {
      console.error(`    ✗ Error for "${kw.keyword}":`, (err as Error).message);
      await sleep(THROTTLE_MS);
    }
  }

  console.log(`\nSERP analysis complete. Total API cost: $${totalCost.toFixed(4)}`);
}

// ─── Step 2: Aggregate Competitors ──────────────────────────

async function aggregateCompetitors(db: ReturnType<typeof createClient>) {
  console.log(`\n━━━ STEP 2: Aggregate Competitors ━━━\n`);

  // Get domain frequency from SERP results
  const rows = await db.execute({
    sql: `SELECT domain, COUNT(DISTINCT keyword_id) as keyword_count, AVG(position) as avg_pos
          FROM backlink_serp_results
          GROUP BY domain
          ORDER BY keyword_count DESC`,
    args: [],
  });

  let inserted = 0;
  for (const row of rows.rows) {
    const domain = row.domain as string;

    // Skip our own domains and excluded large sites
    if (OUR_DOMAINS.some((d) => domain.includes(d))) continue;
    if (EXCLUDED_DOMAINS.has(domain)) continue;

    await db.execute({
      sql: `INSERT OR REPLACE INTO backlink_competitors (domain, keywords_ranking, avg_position)
            VALUES (?, ?, ?)`,
      args: [domain, row.keyword_count as number, row.avg_pos as number],
    });
    inserted++;
  }

  console.log(`Identified ${inserted} competitor domains`);

  // Show top 20
  const top = await db.execute({
    sql: `SELECT domain, keywords_ranking, ROUND(avg_position, 1) as avg_pos
          FROM backlink_competitors
          ORDER BY keywords_ranking DESC, avg_position ASC
          LIMIT 20`,
    args: [],
  });

  console.log(`\nTop 20 competitors:`);
  for (const row of top.rows) {
    console.log(`  ${row.domain} — ranks for ${row.keywords_ranking} keywords (avg pos: ${row.avg_pos})`);
  }
}

// ─── Step 3: Fetch Competitor Backlinks ─────────────────────

async function fetchCompetitorBacklinks(
  db: ReturnType<typeof createClient>,
  competitorLimit: number
) {
  console.log(`\n━━━ STEP 3: Fetch Competitor Backlinks ━━━\n`);

  // Get top competitors
  const competitors = await db.execute({
    sql: `SELECT domain FROM backlink_competitors
          ORDER BY keywords_ranking DESC, avg_position ASC
          LIMIT ?`,
    args: [competitorLimit],
  });

  console.log(`Fetching backlinks for top ${competitors.rows.length} competitors...\n`);

  let totalCost = 0;
  let totalOpportunities = 0;

  for (let i = 0; i < competitors.rows.length; i++) {
    const domain = competitors.rows[i].domain as string;

    try {
      console.log(`  [${i + 1}/${competitors.rows.length}] ${domain}...`);

      // First get summary for the competitor
      const summaryData = await dataforseoFetch("/backlinks/summary/live", [
        {
          target: domain,
          include_subdomains: true,
          backlinks_status_type: "live",
        },
      ]);

      totalCost += summaryData.cost || 0;

      const summary = summaryData.tasks?.[0]?.result?.[0];
      if (summary) {
        await db.execute({
          sql: `UPDATE backlink_competitors
                SET domain_rank = ?, total_backlinks = ?, referring_domains = ?, fetched_at = datetime('now')
                WHERE domain = ?`,
          args: [summary.rank || 0, summary.backlinks || 0, summary.referring_domains || 0, domain],
        });
      }

      await sleep(THROTTLE_MS);

      // Get their dofollow backlinks (one per domain)
      const blData = await dataforseoFetch("/backlinks/backlinks/live", [
        {
          target: domain,
          mode: "one_per_domain",
          filters: ["dofollow", "=", true],
          order_by: ["domain_from_rank,desc"],
          limit: 1000,
          backlinks_status_type: "live",
          include_subdomains: true,
          exclude_internal_backlinks: true,
          rank_scale: "one_hundred",
        },
      ]);

      totalCost += blData.cost || 0;
      saveRaw(`backlinks-${domain.replace(/\./g, "-")}.json`, blData);

      const blTask = blData.tasks?.[0];
      if (blTask?.status_code !== 20000 || !blTask.result?.[0]?.items) {
        console.log(`    ⚠ No backlinks returned`);
        await sleep(THROTTLE_MS);
        continue;
      }

      const items = blTask.result[0].items;
      let inserted = 0;

      for (const bl of items) {
        const sourceDomain = (bl.domain_from || "").replace(/^www\./, "");
        // Skip if the source is one of our own domains
        if (OUR_DOMAINS.some((d) => sourceDomain.includes(d))) continue;

        try {
          await db.execute({
            sql: `INSERT OR IGNORE INTO backlink_opportunities
                  (source_domain, source_url, source_domain_rank, target_competitor, target_url,
                   anchor_text, dofollow, spam_score, first_seen, last_seen, link_type,
                   page_from_language, page_from_title)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              sourceDomain,
              bl.url_from || "",
              bl.domain_from_rank || 0,
              domain,
              bl.url_to || "",
              bl.anchor || "",
              bl.dofollow ? 1 : 0,
              bl.backlink_spam_score || 0,
              bl.first_seen || null,
              bl.last_seen || null,
              bl.item_type || "anchor",
              bl.page_from_language || null,
              bl.page_from_title || null,
            ],
          });
          inserted++;
        } catch {
          // Duplicate — skip
        }
      }

      totalOpportunities += inserted;
      console.log(`    ✓ ${inserted} backlinks stored (${items.length} fetched, rank: ${summary?.rank || "?"})`);
      await sleep(THROTTLE_MS);
    } catch (err) {
      console.error(`    ✗ Error for ${domain}:`, (err as Error).message);
      await sleep(THROTTLE_MS);
    }
  }

  console.log(`\nBacklink extraction complete.`);
  console.log(`Total opportunities stored: ${totalOpportunities}`);
  console.log(`API cost this step: $${totalCost.toFixed(4)}`);
}

// ─── Step 4: Domain Intersection ────────────────────────────

async function runDomainIntersection(
  db: ReturnType<typeof createClient>,
  competitorLimit: number
) {
  console.log(`\n━━━ STEP 4: Domain Intersection (Link Gap) ━━━\n`);

  // Get top competitors for intersection
  const competitors = await db.execute({
    sql: `SELECT domain FROM backlink_competitors
          WHERE domain_rank IS NOT NULL AND domain_rank > 0
          ORDER BY keywords_ranking DESC, avg_position ASC
          LIMIT ?`,
    args: [Math.min(competitorLimit, 19)], // API supports max 20 targets
  });

  if (competitors.rows.length < 2) {
    console.log("Not enough competitors with rank data. Run --step backlinks first.");
    return;
  }

  const competitorDomains = competitors.rows.map((r) => r.domain as string);
  console.log(`Comparing ${competitorDomains.length} competitors for link gaps...\n`);

  // Build targets object (max 20 per request)
  // Process in batches of 19 (leaving room for max 20)
  let totalCost = 0;
  const batchSize = 19;

  for (let batch = 0; batch < competitorDomains.length; batch += batchSize) {
    const batchDomains = competitorDomains.slice(batch, batch + batchSize);
    const targets: Record<string, string> = {};
    batchDomains.forEach((d, i) => {
      targets[String(i + 1)] = d;
    });

    console.log(`  Batch ${Math.floor(batch / batchSize) + 1}: ${batchDomains.length} competitors`);

    try {
      const data = await dataforseoFetch("/backlinks/domain_intersection/live", [
        {
          targets,
          exclude_targets: OUR_DOMAINS,
          limit: 1000,
          order_by: ["1.rank,desc"],
          include_subdomains: false,
          exclude_internal_backlinks: true,
        },
      ]);

      totalCost += data.cost || 0;
      saveRaw(`intersection-batch-${batch}.json`, data);

      const task = data.tasks?.[0];
      if (task?.status_code !== 20000 || !task.result?.[0]?.items) {
        console.log(`    ⚠ No intersection results`);
        await sleep(THROTTLE_MS);
        continue;
      }

      const items = task.result[0].items;
      let inserted = 0;

      for (const item of items) {
        // Count how many competitors this domain links to
        const intersection = item.domain_intersection || {};
        let competitorsLinked = 0;
        let totalBacklinks = 0;
        let maxRank = 0;
        let intersectionDomain = "";

        for (const key of Object.keys(intersection)) {
          const entry = intersection[key];
          if (entry && entry.backlinks > 0) {
            competitorsLinked++;
            totalBacklinks += entry.backlinks || 0;
            if (!intersectionDomain && entry.target) {
              // The domain field is the referring domain
              intersectionDomain = (entry.target as string).replace(/^www\./, "");
            }
            maxRank = Math.max(maxRank, entry.rank || 0);
          }
        }

        // The referring domain is in the first entry's target or we need to extract differently
        // In domain_intersection, each item represents a referring domain
        // Extract domain from the first available entry
        const firstKey = Object.keys(intersection)[0];
        const refDomain = firstKey ? (intersection[firstKey]?.target || "").replace(/^www\./, "") : "";

        if (!refDomain || competitorsLinked < 2) continue;

        try {
          await db.execute({
            sql: `INSERT OR REPLACE INTO backlink_intersections
                  (domain, domain_rank, competitors_linked, total_backlinks_to_competitors)
                  VALUES (?, ?, ?, ?)`,
            args: [refDomain, maxRank, competitorsLinked, totalBacklinks],
          });
          inserted++;
        } catch {
          // Duplicate — skip
        }
      }

      console.log(`    ✓ ${inserted} intersection domains stored`);
    } catch (err) {
      console.error(`    ✗ Error:`, (err as Error).message);
    }

    await sleep(THROTTLE_MS);
  }

  console.log(`\nDomain intersection complete. API cost: $${totalCost.toFixed(4)}`);
}

// ─── Step 5: Our Own Summary ────────────────────────────────

async function fetchOurSummary() {
  console.log(`\n━━━ STEP 5: Our Backlink Summary ━━━\n`);

  try {
    const data = await dataforseoFetch("/backlinks/summary/live", [
      {
        target: "constructioncapital.co.uk",
        include_subdomains: true,
        backlinks_status_type: "live",
      },
    ]);

    saveRaw("our-summary.json", data);

    const summary = data.tasks?.[0]?.result?.[0];
    if (summary) {
      console.log(`  Domain Rank: ${summary.rank}`);
      console.log(`  Total Backlinks: ${summary.backlinks}`);
      console.log(`  Referring Domains: ${summary.referring_domains}`);
      console.log(`  Referring Main Domains: ${summary.referring_main_domains}`);
      console.log(`  Broken Backlinks: ${summary.broken_backlinks}`);
      console.log(`  Spam Score: ${summary.backlinks_spam_score}`);
    } else {
      console.log("  No summary data returned (domain may be too new)");
    }

    console.log(`  API cost: $${(data.cost || 0).toFixed(4)}`);
  } catch (err) {
    console.error(`  Error:`, (err as Error).message);
  }
}

// ─── Schema Init ─────────────────────────────────────────────

async function initSchema(db: ReturnType<typeof createClient>) {
  console.log("Initializing backlinks schema...");

  await db.batch([
    {
      sql: `CREATE TABLE IF NOT EXISTS backlink_keywords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        keyword TEXT NOT NULL UNIQUE,
        search_volume INTEGER,
        cpc_gbp REAL,
        competition TEXT,
        intent TEXT,
        page_type TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS backlink_serp_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        keyword_id INTEGER NOT NULL,
        position INTEGER NOT NULL,
        domain TEXT NOT NULL,
        url TEXT NOT NULL,
        title TEXT,
        fetched_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (keyword_id) REFERENCES backlink_keywords(id)
      )`,
      args: [],
    },
    { sql: `CREATE INDEX IF NOT EXISTS idx_serp_keyword ON backlink_serp_results(keyword_id)`, args: [] },
    { sql: `CREATE INDEX IF NOT EXISTS idx_serp_domain ON backlink_serp_results(domain)`, args: [] },
    {
      sql: `CREATE TABLE IF NOT EXISTS backlink_competitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain TEXT NOT NULL UNIQUE,
        keywords_ranking INTEGER DEFAULT 0,
        avg_position REAL,
        domain_rank INTEGER,
        total_backlinks INTEGER,
        referring_domains INTEGER,
        is_direct_competitor INTEGER DEFAULT 0,
        fetched_at TEXT DEFAULT (datetime('now'))
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS backlink_opportunities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_domain TEXT NOT NULL,
        source_url TEXT NOT NULL,
        source_domain_rank INTEGER,
        target_competitor TEXT NOT NULL,
        target_url TEXT,
        anchor_text TEXT,
        dofollow INTEGER DEFAULT 1,
        spam_score INTEGER DEFAULT 0,
        first_seen TEXT,
        last_seen TEXT,
        link_type TEXT,
        page_from_language TEXT,
        page_from_title TEXT,
        links_to_us INTEGER DEFAULT 0,
        outreach_status TEXT DEFAULT 'new',
        outreach_notes TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        UNIQUE(source_url, target_competitor)
      )`,
      args: [],
    },
    { sql: `CREATE INDEX IF NOT EXISTS idx_opp_source_domain ON backlink_opportunities(source_domain)`, args: [] },
    { sql: `CREATE INDEX IF NOT EXISTS idx_opp_status ON backlink_opportunities(outreach_status)`, args: [] },
    { sql: `CREATE INDEX IF NOT EXISTS idx_opp_rank ON backlink_opportunities(source_domain_rank DESC)`, args: [] },
    { sql: `CREATE INDEX IF NOT EXISTS idx_opp_competitor ON backlink_opportunities(target_competitor)`, args: [] },
    {
      sql: `CREATE TABLE IF NOT EXISTS backlink_intersections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain TEXT NOT NULL UNIQUE,
        domain_rank INTEGER,
        competitors_linked INTEGER,
        total_backlinks_to_competitors INTEGER,
        links_to_us INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      )`,
      args: [],
    },
    { sql: `CREATE INDEX IF NOT EXISTS idx_intersect_rank ON backlink_intersections(domain_rank DESC)`, args: [] },
  ]);

  console.log("Schema initialized ✓\n");
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const step = args.find((a) => a.startsWith("--step="))?.split("=")[1]
    || (args.includes("--step") ? args[args.indexOf("--step") + 1] : null);
  const limitArg = args.find((a) => a.startsWith("--limit="))?.split("=")[1]
    || (args.includes("--limit") ? args[args.indexOf("--limit") + 1] : null);
  const competitorLimit = limitArg ? parseInt(limitArg, 10) : 40;

  console.log("╔══════════════════════════════════════════════╗");
  console.log("║   Backlink Opportunity Scraper               ║");
  console.log("║   DataForSEO → Turso DB                      ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log(`\nStep: ${step || "all"} | Competitor limit: ${competitorLimit}\n`);

  // Validate credentials
  if (!DATAFORSEO_AUTH) {
    console.error("ERROR: DATAFORSEO_AUTH not set in .env.local");
    process.exit(1);
  }
  if (!TURSO_DATABASE_URL) {
    console.error("ERROR: TURSO_DATABASE_URL not set in .env.local");
    process.exit(1);
  }

  const db = getDb();
  await initSchema(db);

  const runAll = !step;

  if (runAll || step === "serp") {
    await runSerpAnalysis(db);
    await aggregateCompetitors(db);
  }

  if (runAll || step === "backlinks") {
    await fetchCompetitorBacklinks(db, competitorLimit);
  }

  if (runAll || step === "intersection") {
    await runDomainIntersection(db, competitorLimit);
  }

  if (runAll) {
    await fetchOurSummary();
  }

  // Final summary
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║   RESULTS SUMMARY                            ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  const counts = await Promise.all([
    db.execute({ sql: `SELECT COUNT(*) as cnt FROM backlink_keywords`, args: [] }),
    db.execute({ sql: `SELECT COUNT(*) as cnt FROM backlink_serp_results`, args: [] }),
    db.execute({ sql: `SELECT COUNT(*) as cnt FROM backlink_competitors`, args: [] }),
    db.execute({ sql: `SELECT COUNT(*) as cnt FROM backlink_opportunities`, args: [] }),
    db.execute({ sql: `SELECT COUNT(*) as cnt FROM backlink_opportunities WHERE links_to_us = 0`, args: [] }),
    db.execute({ sql: `SELECT COUNT(*) as cnt FROM backlink_intersections`, args: [] }),
  ]);

  console.log(`  Keywords tracked:        ${counts[0].rows[0]?.cnt}`);
  console.log(`  SERP results stored:     ${counts[1].rows[0]?.cnt}`);
  console.log(`  Competitors identified:  ${counts[2].rows[0]?.cnt}`);
  console.log(`  Total backlinks stored:  ${counts[3].rows[0]?.cnt}`);
  console.log(`  Backlink opportunities:  ${counts[4].rows[0]?.cnt}`);
  console.log(`  Intersection domains:    ${counts[5].rows[0]?.cnt}`);

  // Top opportunities
  const topOpps = await db.execute({
    sql: `SELECT source_domain, source_domain_rank, COUNT(*) as links_to_competitors
          FROM backlink_opportunities
          WHERE links_to_us = 0 AND source_domain_rank > 20
          GROUP BY source_domain
          ORDER BY source_domain_rank DESC
          LIMIT 15`,
    args: [],
  });

  if (topOpps.rows.length > 0) {
    console.log(`\n  Top backlink opportunities (by domain authority):`);
    for (const row of topOpps.rows) {
      console.log(`    DA ${row.source_domain_rank} | ${row.source_domain} (links to ${row.links_to_competitors} competitors)`);
    }
  }

  console.log("\nDone ✓");
}

// Load env vars from .env.local

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
