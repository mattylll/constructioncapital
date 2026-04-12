import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export function getBacklinksDb(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set");
  }

  client = createClient({ url, authToken });
  return client;
}

/**
 * Initialize the backlinks schema. Safe to call multiple times.
 */
export async function initBacklinksSchema() {
  const db = getBacklinksDb();

  await db.batch([
    // Keywords we're targeting
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
    // SERP results per keyword
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
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_serp_keyword ON backlink_serp_results(keyword_id)`,
      args: [],
    },
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_serp_domain ON backlink_serp_results(domain)`,
      args: [],
    },
    // Competitor domains aggregated
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
    // Individual backlink opportunities
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
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_opp_source_domain ON backlink_opportunities(source_domain)`,
      args: [],
    },
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_opp_status ON backlink_opportunities(outreach_status)`,
      args: [],
    },
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_opp_rank ON backlink_opportunities(source_domain_rank DESC)`,
      args: [],
    },
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_opp_competitor ON backlink_opportunities(target_competitor)`,
      args: [],
    },
    // Domain intersection - high-value link gap targets
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
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_intersect_rank ON backlink_intersections(domain_rank DESC)`,
      args: [],
    },
  ]);

  return { success: true };
}
