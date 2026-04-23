/**
 * Automated Market Roundup Generator
 *
 * Combines Land Registry stats, planning data, and (optionally) lender activity
 * to produce editorial-quality market roundup articles. Uses OpenAI for writing,
 * with quotes attributed to Matt Lenzie.
 *
 * Output:
 *   - Inserts into SQLite news DB (main site)
 *   - Saves location-specific versions for microsites
 *
 * Usage:
 *   npx tsx scripts/generate-market-roundups.ts --county hertfordshire
 *   npx tsx scripts/generate-market-roundups.ts --all
 *   npx tsx scripts/generate-market-roundups.ts --county hertfordshire --no-db
 */

import * as fs from "fs";
import * as path from "path";
import Database from "better-sqlite3";
import OpenAI from "openai";

// ── Config ──────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data", "generated");
const DB_DIR = path.join(process.cwd(), "data", "sqlite");
const DB_PATH = path.join(DB_DIR, "news.db");
const OUTPUT_DIR = path.join(DATA_DIR, "microsite-content");

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

// ── Types ───────────────────────────────────────────────────────────────────

interface TownStats {
  updatedAt: string;
  townSlug: string;
  countySlug: string;
  stats: {
    medianPrice: number;
    medianByType?: Record<string, number>;
    transactionCount12m: number;
    yoyChange: number;
    newBuildCount: number;
    existingCount: number;
    newBuildPremium: number;
  };
}

interface PlanningData {
  updatedAt: string;
  townSlug: string;
  countySlug: string;
  localAuthority: string;
  summary: {
    total: number;
    relevant: number;
    approved: number;
    pending: number;
    refused: number;
    approvedUnits: number;
    pendingUnits: number;
    totalUnits: number;
    approvedGdv: number;
    pendingGdv: number;
    totalEstimatedGDV: number;
    approvalRate: number;
  };
}

interface CountyRoundup {
  county: string;
  countyName: string;
  towns: {
    slug: string;
    name: string;
    stats: TownStats["stats"] | null;
    planning: PlanningData["summary"] | null;
  }[];
  aggregateStats: {
    totalTransactions: number;
    avgMedianPrice: number;
    totalPipelineUnits: number;
    totalPipelineGdv: number;
    avgApprovalRate: number;
  };
}

// ── Data Loading ────────────────────────────────────────────────────────────

function loadCountyData(county: string): CountyRoundup | null {
  const townStatsDir = path.join(DATA_DIR, "sold-data", county);
  const planningDir = path.join(DATA_DIR, "planning", county);

  const towns: CountyRoundup["towns"] = [];

  // Load town stats
  if (fs.existsSync(townStatsDir)) {
    for (const townDir of fs.readdirSync(townStatsDir)) {
      const statsFile = path.join(townStatsDir, townDir, "latest.json");
      if (!fs.existsSync(statsFile)) continue;

      try {
        const data: TownStats = JSON.parse(fs.readFileSync(statsFile, "utf-8"));
        const planningFile = path.join(planningDir, townDir, "latest.json");
        let planning: PlanningData["summary"] | null = null;
        if (fs.existsSync(planningFile)) {
          const pData: PlanningData = JSON.parse(fs.readFileSync(planningFile, "utf-8"));
          planning = pData.summary;
        }

        towns.push({
          slug: townDir,
          name: townDir
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          stats: data.stats,
          planning,
        });
      } catch {
        // Skip malformed files
      }
    }
  }

  // Also check planning dir for towns without sold data
  if (fs.existsSync(planningDir)) {
    for (const townDir of fs.readdirSync(planningDir)) {
      if (towns.some((t) => t.slug === townDir)) continue;
      const planningFile = path.join(planningDir, townDir, "latest.json");
      if (!fs.existsSync(planningFile)) continue;

      try {
        const pData: PlanningData = JSON.parse(fs.readFileSync(planningFile, "utf-8"));
        towns.push({
          slug: townDir,
          name: townDir
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          stats: null,
          planning: pData.summary,
        });
      } catch {
        // Skip
      }
    }
  }

  if (towns.length === 0) return null;

  // Aggregate stats
  const withStats = towns.filter((t) => t.stats);
  const withPlanning = towns.filter((t) => t.planning);

  const countyName = county
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    county,
    countyName,
    towns,
    aggregateStats: {
      totalTransactions: withStats.reduce((s, t) => s + (t.stats?.transactionCount12m || 0), 0),
      avgMedianPrice:
        withStats.length > 0
          ? Math.round(withStats.reduce((s, t) => s + (t.stats?.medianPrice || 0), 0) / withStats.length)
          : 0,
      totalPipelineUnits: withPlanning.reduce((s, t) => s + (t.planning?.totalUnits || 0), 0),
      totalPipelineGdv: withPlanning.reduce((s, t) => s + (t.planning?.totalEstimatedGDV || 0), 0),
      avgApprovalRate:
        withPlanning.length > 0
          ? Math.round(withPlanning.reduce((s, t) => s + (t.planning?.approvalRate || 0), 0) / withPlanning.length)
          : 0,
    },
  };
}

function formatGBP(amount: number): string {
  if (amount >= 1_000_000_000) return `£${(amount / 1_000_000_000).toFixed(1)}bn`;
  if (amount >= 1_000_000) return `£${(amount / 1_000_000).toFixed(1)}m`;
  if (amount >= 1_000) return `£${Math.round(amount / 1_000)}k`;
  return `£${amount.toLocaleString()}`;
}

// ── Article Generation ──────────────────────────────────────────────────────

async function generateRoundup(data: CountyRoundup): Promise<{ title: string; excerpt: string; body: string; tags: string[] }> {
  const now = new Date();
  const monthYear = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  // Build data summary for the prompt
  const townSummaries = data.towns
    .map((t) => {
      const lines = [`${t.name}:`];
      if (t.stats) {
        lines.push(`  Median price: ${formatGBP(t.stats.medianPrice)}, YoY: ${t.stats.yoyChange > 0 ? "+" : ""}${t.stats.yoyChange}%, Transactions: ${t.stats.transactionCount12m}`);
        lines.push(`  New builds: ${t.stats.newBuildCount}, New build premium: ${t.stats.newBuildPremium.toFixed(1)}%`);
        if (t.stats.medianByType) {
          const types: Record<string, string> = { D: "Detached", S: "Semi", T: "Terraced", F: "Flat" };
          const typeStr = Object.entries(t.stats.medianByType).map(([k, v]) => `${types[k] || k}: ${formatGBP(v)}`).join(", ");
          lines.push(`  By type: ${typeStr}`);
        }
      }
      if (t.planning) {
        lines.push(`  Planning: ${t.planning.approved} approved, ${t.planning.pending} pending, ${t.planning.approvalRate}% approval rate`);
        lines.push(`  Pipeline: ${t.planning.totalUnits} units, ${formatGBP(t.planning.totalEstimatedGDV)} est. GDV`);
      }
      return lines.join("\n");
    })
    .join("\n\n");

  const prompt = `You are a UK property market analyst writing for Construction Capital, a specialist development finance brokerage. Write a market roundup article for ${data.countyName} for ${monthYear}.

## Data
County aggregate:
- Total transactions (12m): ${data.aggregateStats.totalTransactions.toLocaleString()}
- Average median price: ${formatGBP(data.aggregateStats.avgMedianPrice)}
- Pipeline units: ${data.aggregateStats.totalPipelineUnits.toLocaleString()}
- Pipeline GDV: ${formatGBP(data.aggregateStats.totalPipelineGdv)}
- Avg approval rate: ${data.aggregateStats.avgApprovalRate}%

Town-by-town:
${townSummaries}

## Requirements
- 800-1,200 words
- Professional, data-driven tone. British English.
- Include one quote from "Matt Lenzie, Director at Construction Capital" offering market insight
- Reference specific data points with source attribution (HM Land Registry Price Paid Data, Local Planning Authority data)
- Structure: Overview → Price Trends → Planning Pipeline → Development Opportunity → What This Means for Developers
- End with a CTA to contact Construction Capital
- Markdown format, H2/H3 headings, no H1

Write the article now. Output ONLY the markdown content.`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 3000,
  });

  const body = response.choices[0]?.message?.content || "";
  const title = `${data.countyName} Development Market Roundup — ${monthYear}`;
  const excerpt = `Market analysis for ${data.countyName}: ${data.aggregateStats.totalTransactions.toLocaleString()} transactions, ${formatGBP(data.aggregateStats.avgMedianPrice)} median price, and ${data.aggregateStats.totalPipelineUnits.toLocaleString()} units in the planning pipeline.`;
  const tags = [
    "market-roundup",
    data.county,
    ...data.towns.slice(0, 5).map((t) => t.slug),
  ];

  return { title, excerpt, body, tags };
}

// ── Database ────────────────────────────────────────────────────────────────

function ensureDbSchema(db: Database.Database): void {
  // Update schema to allow market-commentary for roundups
  // The existing constraint only allows 5 categories — roundups go under market-commentary
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Matt Lenzie',
      published_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      is_published INTEGER NOT NULL DEFAULT 1
    )
  `);
}

function insertArticle(
  db: Database.Database,
  slug: string,
  title: string,
  excerpt: string,
  body: string,
  tags: string[]
): void {
  const now = new Date().toISOString();

  const existing = db.prepare("SELECT id FROM articles WHERE slug = ?").get(slug);
  if (existing) {
    db.prepare("UPDATE articles SET title = ?, excerpt = ?, body = ?, tags = ?, updated_at = ? WHERE slug = ?")
      .run(title, excerpt, body, JSON.stringify(tags), now, slug);
    console.log(`    [UPDATED] ${slug} in news DB`);
  } else {
    db.prepare(
      "INSERT INTO articles (slug, title, excerpt, body, category, author, published_at, updated_at, tags, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(slug, title, excerpt, body, "market-commentary", "Matt Lenzie", now, now, JSON.stringify(tags), 1);
    console.log(`    [INSERTED] ${slug} into news DB`);
  }
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const countyFlag = args.indexOf("--county");
const countyFilter = countyFlag !== -1 ? args[countyFlag + 1] : undefined;
const isAll = args.includes("--all");
const noDb = args.includes("--no-db");

if (!countyFilter && !isAll) {
  console.log("Usage:");
  console.log("  npx tsx scripts/generate-market-roundups.ts --county hertfordshire");
  console.log("  npx tsx scripts/generate-market-roundups.ts --all");
  console.log("  npx tsx scripts/generate-market-roundups.ts --all --no-db");
  console.log("\nAvailable counties with data:");

  const soldDir = path.join(DATA_DIR, "sold-data");
  if (fs.existsSync(soldDir)) {
    for (const c of fs.readdirSync(soldDir).sort()) {
      console.log(`  ${c}`);
    }
  }
  process.exit(0);
}

async function main() {
  // Get counties to process
  const soldDir = path.join(DATA_DIR, "sold-data");
  let counties: string[];

  if (countyFilter) {
    counties = [countyFilter];
  } else {
    counties = fs.existsSync(soldDir) ? fs.readdirSync(soldDir).sort() : [];
  }

  console.log(`Processing ${counties.length} county/counties...\n`);

  let db: Database.Database | null = null;
  if (!noDb) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    ensureDbSchema(db);
  }

  let generated = 0;

  for (const county of counties) {
    console.log(`\n${county}`);

    const data = loadCountyData(county);
    if (!data) {
      console.log("  [SKIP] No data found");
      continue;
    }

    console.log(`  ${data.towns.length} towns, ${data.aggregateStats.totalTransactions} transactions`);

    try {
      const article = await generateRoundup(data);
      const slug = article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Save to news DB
      if (db) {
        insertArticle(db, slug, article.title, article.excerpt, article.body, article.tags);
      }

      // Save for microsites
      const micrositeDir = path.join(OUTPUT_DIR, county, "roundups");
      fs.mkdirSync(micrositeDir, { recursive: true });
      const outPath = path.join(micrositeDir, `${slug}.json`);
      fs.writeFileSync(
        outPath,
        JSON.stringify({
          slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.body,
          author: "Matt Lenzie",
          publishDate: new Date().toISOString().split("T")[0],
          category: "Market Roundup",
          tags: article.tags,
        }, null, 2),
        "utf-8"
      );
      console.log(`  [SAVED] ${outPath}`);
      generated++;

      // Rate limit between API calls
      await new Promise((r) => setTimeout(r, 1000));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`  [ERROR] ${msg.slice(0, 100)}`);
    }
  }

  if (db) db.close();

  console.log(`\n--- Done ---`);
  console.log(`Generated: ${generated} roundups`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
