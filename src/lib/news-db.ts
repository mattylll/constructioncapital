import path from "path";
import fs from "fs";

// ── Types ────────────────────────────────────────────────────────────────────

export type NewsCategory =
  | "rate-update"
  | "lender-news"
  | "market-commentary"
  | "deal-announcement"
  | "regulatory";

export type NewsTier = "daily-brief" | "deal-note" | "editor-pick" | "legacy";

export type NewsGenerationSource = "automated" | "manual";

export interface NewsDataSource {
  /** Full URL (external citation) OR `data/generated/...` file path (internal). */
  url: string;
  /** Human-readable label: "ONS House Price Index — Mar 2026", "Kent planning pipeline". */
  label: string;
}

export interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: NewsCategory;
  author: string;
  published_at: string;
  updated_at: string;
  tags: string[];
  is_published: number;
  /** Publishing tier — daily-brief | deal-note | editor-pick | legacy. */
  tier: NewsTier;
  /** JSON-parsed citations. Every numeric claim in the body should map to one. */
  data_sources: NewsDataSource[];
  /** Was this article written by the daily pipeline or edited in by hand? */
  generation_source: NewsGenerationSource;
  /** ULID (or similar) tying the article to the generator run that produced it. */
  source_run_id: string | null;
}

export const NEWS_CATEGORIES: {
  slug: NewsCategory;
  label: string;
  description: string;
}[] = [
  {
    slug: "rate-update",
    label: "Rate Updates",
    description:
      "Interest rate changes, base rate decisions, and pricing trends",
  },
  {
    slug: "lender-news",
    label: "Lender News",
    description: "New products, lender launches, and panel updates",
  },
  {
    slug: "market-commentary",
    label: "Market Commentary",
    description: "Analysis of UK property development and finance markets",
  },
  {
    slug: "deal-announcement",
    label: "Deal Announcements",
    description: "Completed transactions and case studies from our pipeline",
  },
  {
    slug: "regulatory",
    label: "Regulatory",
    description: "FCA updates, Building Safety Act, and compliance changes",
  },
];

// ── Database helpers ─────────────────────────────────────────────────────────

const DB_PATH = path.join(process.cwd(), "data", "sqlite", "news.db");

interface RawArticleRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  published_at: string;
  updated_at: string;
  tags: string;
  is_published: number;
  tier: string | null;
  data_sources: string | null;
  generation_source: string | null;
  source_run_id: string | null;
}

type SqliteDb = {
  prepare: (sql: string) => {
    all: (...args: unknown[]) => unknown[];
    get: (...args: unknown[]) => unknown;
    run: (...args: unknown[]) => { lastInsertRowid: number | bigint; changes: number };
  };
  pragma: (key: string) => unknown;
  close: () => void;
  transaction: <T>(fn: () => T) => () => T;
  exec: (sql: string) => void;
};

let migrationRun = false;

function getDb(options: { writable?: boolean } = {}): SqliteDb | null {
  if (!fs.existsSync(DB_PATH)) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    const db: SqliteDb = new Database(DB_PATH, {
      readonly: !options.writable,
    });
    db.pragma("journal_mode = WAL");
    if (options.writable && !migrationRun) {
      runMigration(db);
      migrationRun = true;
    }
    return db;
  } catch {
    // better-sqlite3 is a devDependency — unavailable in production builds.
    return null;
  }
}

/**
 * Idempotent schema migration. Adds the Part B columns if they are missing.
 * Safe to call repeatedly; checks pragma table_info first.
 */
function runMigration(db: SqliteDb) {
  const columns = db.prepare("PRAGMA table_info(articles)").all() as {
    name: string;
  }[];
  const existing = new Set(columns.map((c) => c.name));

  const additions: { name: string; sql: string }[] = [
    {
      name: "tier",
      sql: "ALTER TABLE articles ADD COLUMN tier TEXT DEFAULT 'legacy'",
    },
    {
      name: "data_sources",
      sql: "ALTER TABLE articles ADD COLUMN data_sources TEXT DEFAULT '[]'",
    },
    {
      name: "generation_source",
      sql: "ALTER TABLE articles ADD COLUMN generation_source TEXT DEFAULT 'manual'",
    },
    {
      name: "source_run_id",
      sql: "ALTER TABLE articles ADD COLUMN source_run_id TEXT",
    },
  ];

  for (const col of additions) {
    if (!existing.has(col.name)) {
      db.exec(col.sql);
    }
  }
}

function rowToArticle(row: RawArticleRow): NewsArticle {
  let dataSources: NewsDataSource[] = [];
  try {
    if (row.data_sources) dataSources = JSON.parse(row.data_sources);
  } catch {
    dataSources = [];
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    category: row.category as NewsCategory,
    author: row.author,
    published_at: row.published_at,
    updated_at: row.updated_at,
    tags: safeJsonArray(row.tags),
    is_published: row.is_published,
    tier: (row.tier as NewsTier) ?? "legacy",
    data_sources: dataSources,
    generation_source:
      (row.generation_source as NewsGenerationSource) ?? "manual",
    source_run_id: row.source_run_id ?? null,
  };
}

function safeJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ── Public read API ──────────────────────────────────────────────────────────

export function getPublishedArticles(): NewsArticle[] {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = db
      .prepare(
        "SELECT * FROM articles WHERE is_published = 1 ORDER BY published_at DESC"
      )
      .all() as RawArticleRow[];
    return rows.map(rowToArticle);
  } finally {
    db.close();
  }
}

export function getAllArticles(): NewsArticle[] {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = db
      .prepare("SELECT * FROM articles ORDER BY published_at DESC")
      .all() as RawArticleRow[];
    return rows.map(rowToArticle);
  } finally {
    db.close();
  }
}

export function getArticleBySlug(slug: string): NewsArticle | null {
  const db = getDb();
  if (!db) return null;
  try {
    const row = db
      .prepare(
        "SELECT * FROM articles WHERE slug = ? AND is_published = 1"
      )
      .get(slug) as RawArticleRow | undefined;
    return row ? rowToArticle(row) : null;
  } finally {
    db.close();
  }
}

export function getArticleById(id: number): NewsArticle | null {
  const db = getDb();
  if (!db) return null;
  try {
    const row = db
      .prepare("SELECT * FROM articles WHERE id = ?")
      .get(id) as RawArticleRow | undefined;
    return row ? rowToArticle(row) : null;
  } finally {
    db.close();
  }
}

export function getArticlesByCategory(category: string): NewsArticle[] {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = db
      .prepare(
        "SELECT * FROM articles WHERE category = ? AND is_published = 1 ORDER BY published_at DESC"
      )
      .all(category) as RawArticleRow[];
    return rows.map(rowToArticle);
  } finally {
    db.close();
  }
}

export function getRecentArticles(limit: number): NewsArticle[] {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = db
      .prepare(
        "SELECT * FROM articles WHERE is_published = 1 ORDER BY published_at DESC LIMIT ?"
      )
      .all(limit) as RawArticleRow[];
    return rows.map(rowToArticle);
  } finally {
    db.close();
  }
}

export function getRelatedArticles(
  slug: string,
  limit: number
): NewsArticle[] {
  const db = getDb();
  if (!db) return [];
  try {
    const current = db
      .prepare("SELECT category FROM articles WHERE slug = ?")
      .get(slug) as { category: string } | undefined;
    if (!current) return [];

    const rows = db
      .prepare(
        "SELECT * FROM articles WHERE category = ? AND slug != ? AND is_published = 1 ORDER BY published_at DESC LIMIT ?"
      )
      .all(current.category, slug, limit) as RawArticleRow[];
    return rows.map(rowToArticle);
  } finally {
    db.close();
  }
}

// ── Write API (admin + daily pipeline) ───────────────────────────────────────
//
// NOTE: SQLite writes don't persist on Vercel (ephemeral filesystem). These
// functions are intended for:
//   - local dev on Matt's Mac
//   - the daily news script run via GitHub Action (which commits the DB)
//   - future Turso migration (drop-in — just swap the driver)
// They should never be called from page components or client code.

export interface NewArticleInput {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: NewsCategory;
  author?: string;
  tags?: string[];
  tier?: NewsTier;
  data_sources?: NewsDataSource[];
  generation_source?: NewsGenerationSource;
  source_run_id?: string | null;
  is_published?: boolean;
  published_at?: string;
}

export function createArticle(input: NewArticleInput): NewsArticle {
  const db = getDb({ writable: true });
  if (!db) throw new Error("News DB unavailable — cannot create article.");
  try {
    const now = new Date().toISOString();
    const published_at = input.published_at ?? now;
    const is_published = input.is_published === false ? 0 : 1;

    const stmt = db.prepare(`
      INSERT INTO articles (
        slug, title, excerpt, body, category, author,
        published_at, updated_at, tags, is_published,
        tier, data_sources, generation_source, source_run_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      input.slug,
      input.title,
      input.excerpt,
      input.body,
      input.category,
      input.author ?? "Matt Lenzie",
      published_at,
      now,
      JSON.stringify(input.tags ?? []),
      is_published,
      input.tier ?? "daily-brief",
      JSON.stringify(input.data_sources ?? []),
      input.generation_source ?? "automated",
      input.source_run_id ?? null
    );

    const row = db
      .prepare("SELECT * FROM articles WHERE id = ?")
      .get(Number(result.lastInsertRowid)) as RawArticleRow;
    return rowToArticle(row);
  } finally {
    db.close();
  }
}

export interface UpdateArticleInput {
  title?: string;
  excerpt?: string;
  body?: string;
  category?: NewsCategory;
  tags?: string[];
  tier?: NewsTier;
  data_sources?: NewsDataSource[];
  is_published?: boolean;
}

export function updateArticle(
  id: number,
  input: UpdateArticleInput
): NewsArticle | null {
  const db = getDb({ writable: true });
  if (!db) throw new Error("News DB unavailable — cannot update article.");
  try {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.title !== undefined) {
      fields.push("title = ?");
      values.push(input.title);
    }
    if (input.excerpt !== undefined) {
      fields.push("excerpt = ?");
      values.push(input.excerpt);
    }
    if (input.body !== undefined) {
      fields.push("body = ?");
      values.push(input.body);
    }
    if (input.category !== undefined) {
      fields.push("category = ?");
      values.push(input.category);
    }
    if (input.tags !== undefined) {
      fields.push("tags = ?");
      values.push(JSON.stringify(input.tags));
    }
    if (input.tier !== undefined) {
      fields.push("tier = ?");
      values.push(input.tier);
    }
    if (input.data_sources !== undefined) {
      fields.push("data_sources = ?");
      values.push(JSON.stringify(input.data_sources));
    }
    if (input.is_published !== undefined) {
      fields.push("is_published = ?");
      values.push(input.is_published ? 1 : 0);
    }

    if (fields.length === 0) {
      const existing = db
        .prepare("SELECT * FROM articles WHERE id = ?")
        .get(id) as RawArticleRow | undefined;
      return existing ? rowToArticle(existing) : null;
    }

    fields.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);

    db.prepare(
      `UPDATE articles SET ${fields.join(", ")} WHERE id = ?`
    ).run(...values);

    const row = db
      .prepare("SELECT * FROM articles WHERE id = ?")
      .get(id) as RawArticleRow | undefined;
    return row ? rowToArticle(row) : null;
  } finally {
    db.close();
  }
}

export function setPublished(id: number, published: boolean): boolean {
  const db = getDb({ writable: true });
  if (!db) throw new Error("News DB unavailable — cannot change publish state.");
  try {
    const result = db
      .prepare(
        "UPDATE articles SET is_published = ?, updated_at = ? WHERE id = ?"
      )
      .run(published ? 1 : 0, new Date().toISOString(), id);
    return result.changes > 0;
  } finally {
    db.close();
  }
}

export function deleteArticle(id: number): boolean {
  const db = getDb({ writable: true });
  if (!db) throw new Error("News DB unavailable — cannot delete article.");
  try {
    const result = db
      .prepare("DELETE FROM articles WHERE id = ?")
      .run(id);
    return result.changes > 0;
  } finally {
    db.close();
  }
}

/**
 * Ensures the DB schema has the Part B columns. Useful to call from admin
 * routes before the first write, or from seed scripts.
 */
export function ensureSchema(): void {
  const db = getDb({ writable: true });
  if (!db) return;
  try {
    // getDb({ writable: true }) already runs the migration on first call.
  } finally {
    db.close();
  }
}
