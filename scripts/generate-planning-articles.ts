/**
 * Planning Article Auto-Generator
 *
 * For each local authority with planning data, generates a news article
 * summarising notable planning applications. Outputs to both the main
 * site news DB and microsite-specific versions.
 *
 * Uses OpenAI for editorial content, with real planning data as source.
 *
 * Usage:
 *   npx tsx scripts/generate-planning-articles.ts --county hertfordshire
 *   npx tsx scripts/generate-planning-articles.ts --all
 *   npx tsx scripts/generate-planning-articles.ts --county hertfordshire --no-db
 *   npx tsx scripts/generate-planning-articles.ts --county hertfordshire --no-ai
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

interface PlanningApplication {
  reference: string;
  address: string;
  proposal: string;
  status: string;
  decision: string;
  receivedDate: string;
  decisionDate: string;
  applicantName: string;
  applicantCompany: string;
  agentName: string;
  agentCompany: string;
  is_relevant: boolean;
  units: number | null;
  estimatedGdv: number | null;
  developmentType: string;
}

interface PlanningFile {
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
  approvedApplications: PlanningApplication[];
  pendingApplications: PlanningApplication[];
}

interface TownPlanningData {
  townSlug: string;
  townName: string;
  countySlug: string;
  localAuthority: string;
  summary: PlanningFile["summary"];
  notableApps: PlanningApplication[];
}

// ── Data Loading ────────────────────────────────────────────────────────────

function loadPlanningData(county: string): TownPlanningData[] {
  const planningDir = path.join(DATA_DIR, "planning", county);
  if (!fs.existsSync(planningDir)) return [];

  const towns: TownPlanningData[] = [];

  for (const townDir of fs.readdirSync(planningDir)) {
    const filePath = path.join(planningDir, townDir, "latest.json");
    if (!fs.existsSync(filePath)) continue;

    try {
      const data: PlanningFile = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const allApps = [
        ...(data.approvedApplications || []),
        ...(data.pendingApplications || []),
      ];
      if (allApps.length === 0 && data.summary.relevant === 0) continue;

      // Find notable applications (with units or high GDV)
      const notable = allApps
        .filter((a) => a.units || (a.estimatedGdv && a.estimatedGdv > 500_000))
        .sort((a, b) => (b.estimatedGdv || 0) - (a.estimatedGdv || 0))
        .slice(0, 10);

      towns.push({
        townSlug: townDir,
        townName: slugToName(townDir),
        countySlug: county,
        localAuthority: data.localAuthority,
        summary: data.summary,
        notableApps: notable,
      });
    } catch {
      // Skip malformed
    }
  }

  return towns;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatGBP(amount: number): string {
  if (amount >= 1_000_000_000) return `£${(amount / 1_000_000_000).toFixed(1)}bn`;
  if (amount >= 1_000_000) return `£${(amount / 1_000_000).toFixed(1)}m`;
  if (amount >= 1_000) return `£${Math.round(amount / 1_000)}k`;
  return `£${amount.toLocaleString()}`;
}

function getCurrentQuarter(): string {
  const now = new Date();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  return `Q${q} ${now.getFullYear()}`;
}

// ── Article Generation ──────────────────────────────────────────────────────

function generateTemplateArticle(
  countyName: string,
  towns: TownPlanningData[]
): { title: string; excerpt: string; body: string; tags: string[] } {
  const quarter = getCurrentQuarter();
  const totalUnits = towns.reduce((s, t) => s + t.summary.totalUnits, 0);
  const totalGdv = towns.reduce((s, t) => s + t.summary.totalEstimatedGDV, 0);
  const totalApproved = towns.reduce((s, t) => s + t.summary.approved, 0);
  const totalPending = towns.reduce((s, t) => s + t.summary.pending, 0);
  const totalRefused = towns.reduce((s, t) => s + t.summary.refused, 0);

  const title = `${countyName} Planning Round-Up: ${totalUnits.toLocaleString()} Residential Units in the Pipeline — ${quarter}`;
  const excerpt = `A review of planning applications across ${countyName}: ${totalApproved} approved, ${totalPending} pending decision, with ${totalUnits.toLocaleString()} units representing ${formatGBP(totalGdv)} estimated GDV.`;

  let body = `## ${countyName} Planning Pipeline — ${quarter}\n\n`;
  body += `Analysis of local planning authority data across ${countyName} reveals **${totalUnits.toLocaleString()} residential units** currently in the development pipeline, with an estimated gross development value of **${formatGBP(totalGdv)}**.\n\n`;
  body += `Of the applications tracked, **${totalApproved} have been approved**, **${totalPending} are pending** decision, and **${totalRefused} have been refused**.\n\n`;

  // Town-by-town breakdown
  const sortedTowns = [...towns].sort((a, b) => b.summary.totalUnits - a.summary.totalUnits);

  for (const town of sortedTowns) {
    body += `### ${town.townName}\n\n`;
    body += `${town.localAuthority} has **${town.summary.relevant} relevant applications** in the pipeline: ${town.summary.approved} approved, ${town.summary.pending} pending, ${town.summary.refused} refused. `;
    body += `The pipeline comprises **${town.summary.totalUnits} units** with an estimated GDV of **${formatGBP(town.summary.totalEstimatedGDV)}**. `;

    if (town.summary.approvalRate > 0) {
      body += `The current approval rate stands at ${town.summary.approvalRate}%.\n\n`;
    } else {
      body += `\n\n`;
    }

    // Notable applications
    if (town.notableApps.length > 0) {
      body += `**Notable applications:**\n\n`;
      for (const app of town.notableApps.slice(0, 5)) {
        const units = app.units ? `${app.units} units` : "";
        const gdv = app.estimatedGdv ? `est. GDV ${formatGBP(app.estimatedGdv)}` : "";
        const detail = [units, gdv].filter(Boolean).join(", ");
        const status = app.decision || app.status;
        body += `- **${app.reference}** — ${app.address}. ${app.proposal.slice(0, 150)}${app.proposal.length > 150 ? "..." : ""} (${status}${detail ? ` — ${detail}` : ""})\n`;
      }
      body += `\n`;
    }
  }

  // Summary table
  body += `### Summary\n\n`;
  body += `| Town | Approved | Pending | Refused | Units | Est. GDV |\n`;
  body += `|------|----------|---------|---------|-------|----------|\n`;
  for (const t of sortedTowns) {
    body += `| ${t.townName} | ${t.summary.approved} | ${t.summary.pending} | ${t.summary.refused} | ${t.summary.totalUnits} | ${formatGBP(t.summary.totalEstimatedGDV)} |\n`;
  }

  body += `\n### What This Means for Developers\n\n`;
  body += `With ${totalUnits.toLocaleString()} units in the pipeline across ${countyName}, developers with consented sites are well-positioned to secure development finance. `;
  body += `Construction Capital can arrange indicative terms within 24 hours for schemes with planning permission — [speak to our team](/deal-room) to discuss your project.\n\n`;
  body += `*Data sourced from local planning authority public registers via Portal360. GDV estimates based on unit counts and local median prices by property type.*\n`;

  const tags = [
    "planning",
    towns[0]?.countySlug || "",
    ...sortedTowns.slice(0, 5).map((t) => t.townSlug),
  ].filter(Boolean);

  return { title, excerpt, body, tags };
}

async function generateAiArticle(
  countyName: string,
  towns: TownPlanningData[]
): Promise<{ title: string; excerpt: string; body: string; tags: string[] }> {
  const quarter = getCurrentQuarter();
  const totalUnits = towns.reduce((s, t) => s + t.summary.totalUnits, 0);
  const totalGdv = towns.reduce((s, t) => s + t.summary.totalEstimatedGDV, 0);

  // Build data summary for prompt
  const townSummaries = towns
    .sort((a, b) => b.summary.totalUnits - a.summary.totalUnits)
    .map((t) => {
      const lines = [`${t.townName} (${t.localAuthority}):`];
      lines.push(`  Pipeline: ${t.summary.approved} approved, ${t.summary.pending} pending, ${t.summary.refused} refused`);
      lines.push(`  Units: ${t.summary.totalUnits}, Est. GDV: ${formatGBP(t.summary.totalEstimatedGDV)}, Approval rate: ${t.summary.approvalRate}%`);

      if (t.notableApps.length > 0) {
        lines.push(`  Notable:`);
        for (const app of t.notableApps.slice(0, 3)) {
          const detail = [
            app.units ? `${app.units} units` : "",
            app.estimatedGdv ? formatGBP(app.estimatedGdv) : "",
          ].filter(Boolean).join(", ");
          lines.push(`    - ${app.reference}: ${app.proposal.slice(0, 100)} (${app.decision || app.status}${detail ? `, ${detail}` : ""})`);
        }
      }
      return lines.join("\n");
    })
    .join("\n\n");

  const prompt = `You are a UK property market analyst writing for Construction Capital, a specialist development finance brokerage. Write a planning round-up article for ${countyName} for ${quarter}.

## Data
Total pipeline: ${totalUnits.toLocaleString()} units, ${formatGBP(totalGdv)} estimated GDV

Town-by-town:
${townSummaries}

## Requirements
- 600-1,000 words
- Professional, data-driven tone. British English.
- Include one quote from "Matt Lenzie, Director at Construction Capital" offering insight on the development pipeline
- Reference specific planning applications by reference number where notable
- Structure: Overview → Town-by-Town Highlights → Development Opportunity → CTA
- Include a summary data table (markdown)
- End with CTA to contact Construction Capital for development finance
- Attribute data to local planning authority public registers
- Markdown format, H2/H3 headings, no H1

Write the article now. Output ONLY the markdown content.`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2500,
  });

  const body = response.choices[0]?.message?.content || "";
  const title = `${countyName} Planning Round-Up: ${totalUnits.toLocaleString()} Residential Units in the Pipeline — ${quarter}`;
  const excerpt = `Planning analysis for ${countyName}: ${totalUnits.toLocaleString()} units in the pipeline representing ${formatGBP(totalGdv)} estimated GDV across ${towns.length} towns.`;
  const tags = [
    "planning",
    towns[0]?.countySlug || "",
    ...towns.slice(0, 5).map((t) => t.townSlug),
  ].filter(Boolean);

  return { title, excerpt, body, tags };
}

// ── Database ────────────────────────────────────────────────────────────────

function ensureDbSchema(db: Database.Database): void {
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
    console.log(`    [UPDATED] ${slug}`);
  } else {
    db.prepare(
      "INSERT INTO articles (slug, title, excerpt, body, category, author, published_at, updated_at, tags, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(slug, title, excerpt, body, "market-commentary", "Matt Lenzie", now, now, JSON.stringify(tags), 1);
    console.log(`    [INSERTED] ${slug}`);
  }
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const countyFlag = args.indexOf("--county");
const countyFilter = countyFlag !== -1 ? args[countyFlag + 1] : undefined;
const isAll = args.includes("--all");
const noDb = args.includes("--no-db");
const noAi = args.includes("--no-ai");

if (!countyFilter && !isAll) {
  console.log("Usage:");
  console.log("  npx tsx scripts/generate-planning-articles.ts --county hertfordshire");
  console.log("  npx tsx scripts/generate-planning-articles.ts --all");
  console.log("  npx tsx scripts/generate-planning-articles.ts --county hertfordshire --no-db --no-ai");
  console.log("\nAvailable counties with planning data:");

  const planDir = path.join(DATA_DIR, "planning");
  if (fs.existsSync(planDir)) {
    for (const c of fs.readdirSync(planDir).sort()) {
      const towns = fs.readdirSync(path.join(planDir, c));
      console.log(`  ${c} (${towns.length} towns)`);
    }
  }
  process.exit(0);
}

async function main() {
  // Get counties to process
  const planDir = path.join(DATA_DIR, "planning");
  let counties: string[];

  if (countyFilter) {
    counties = [countyFilter];
  } else {
    counties = fs.existsSync(planDir) ? fs.readdirSync(planDir).sort() : [];
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
    const countyName = slugToName(county);
    console.log(`\n${countyName}`);

    const towns = loadPlanningData(county);
    if (towns.length === 0) {
      console.log("  [SKIP] No planning data");
      continue;
    }

    const totalUnits = towns.reduce((s, t) => s + t.summary.totalUnits, 0);
    console.log(`  ${towns.length} towns, ${totalUnits} pipeline units`);

    try {
      let article: { title: string; excerpt: string; body: string; tags: string[] };

      if (noAi) {
        article = generateTemplateArticle(countyName, towns);
        console.log("  [TEMPLATE] Generated from template");
      } else {
        article = await generateAiArticle(countyName, towns);
        console.log("  [AI] Generated via OpenAI");
      }

      const slug = article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Save to news DB
      if (db) {
        insertArticle(db, slug, article.title, article.excerpt, article.body, article.tags);
      }

      // Save for microsites
      const micrositeDir = path.join(OUTPUT_DIR, county, "planning");
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
          category: "Planning",
          tags: article.tags,
        }, null, 2),
        "utf-8"
      );
      console.log(`  [SAVED] ${outPath}`);
      generated++;

      // Rate limit between AI calls
      if (!noAi) await new Promise((r) => setTimeout(r, 1000));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`  [ERROR] ${msg.slice(0, 100)}`);
    }
  }

  if (db) db.close();

  console.log(`\n--- Done ---`);
  console.log(`Generated: ${generated} planning articles`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
