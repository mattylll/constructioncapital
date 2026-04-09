import path from "path";
import fs from "fs";

// ── Types ────────────────────────────────────────────────────────────────────

export type NewsCategory =
  | "rate-update"
  | "lender-news"
  | "market-commentary"
  | "deal-announcement"
  | "regulatory";

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
}

export const NEWS_CATEGORIES: {
  slug: NewsCategory;
  label: string;
  description: string;
}[] = [
  {
    slug: "rate-update",
    label: "Rate Updates",
    description: "Interest rate changes, base rate decisions, and pricing trends",
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

// ── Database helper ──────────────────────────────────────────────────────────

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
}

function getDb() {
  if (!fs.existsSync(DB_PATH)) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    const db = new Database(DB_PATH, { readonly: true });
    db.pragma("journal_mode = WAL");
    return db;
  } catch {
    // better-sqlite3 is a devDependency — unavailable in production builds
    return null;
  }
}

function rowToArticle(row: RawArticleRow): NewsArticle {
  return {
    ...row,
    category: row.category as NewsCategory,
    tags: JSON.parse(row.tags || "[]"),
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

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
