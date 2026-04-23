import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export function getAnalyticsDb(): Client {
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
 * Initialize the analytics schema. Call once on first deploy or via setup script.
 */
export async function initAnalyticsSchema() {
  const db = getAnalyticsDb();

  await db.batch([
    {
      sql: `CREATE TABLE IF NOT EXISTS sites (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        domain TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT (datetime('now'))
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        site_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        visitor_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        path TEXT,
        url TEXT,
        referrer TEXT,
        title TEXT,
        data TEXT,
        screen_w INTEGER,
        screen_h INTEGER,
        viewport_w INTEGER,
        viewport_h INTEGER,
        language TEXT,
        ua TEXT,
        country TEXT,
        is_new_visitor INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (site_id) REFERENCES sites(id)
      )`,
      args: [],
    },
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_events_site_created ON events(site_id, created_at)`,
      args: [],
    },
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_events_site_type ON events(site_id, event_type, created_at)`,
      args: [],
    },
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id)`,
      args: [],
    },
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_events_path ON events(site_id, path, event_type)`,
      args: [],
    },
  ]);

  return { success: true };
}
