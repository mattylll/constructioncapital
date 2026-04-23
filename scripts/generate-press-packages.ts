/**
 * Press Package Generator
 *
 * Takes market roundup data + journalist database and produces press-ready
 * packages for local media outreach. Each package includes:
 *   - Localised press release (markdown)
 *   - Data table (CSV)
 *   - Journalist targets for the county
 *
 * Attribution cites the location microsite as data source for backlink potential.
 *
 * Usage:
 *   npx tsx scripts/generate-press-packages.ts --county hertfordshire
 *   npx tsx scripts/generate-press-packages.ts --all
 *   npx tsx scripts/generate-press-packages.ts --county hertfordshire --no-ai
 */

import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";

// ── Config ──────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data", "generated");
const NEWSPAPERS_PATH = path.join(process.cwd(), "data", "newspapers.json");
const OUTPUT_DIR = path.join(DATA_DIR, "press-packages");

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

// ── Types ───────────────────────────────────────────────────────────────────

interface TownStats {
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

interface Journalist {
  nation: string;
  county: string;
  keyTowns: string[];
  newspaper: string;
  url: string;
  type: string;
  publisher: string;
  journalist: string;
  contact: string;
  editor: string;
}

interface Newspaper {
  nation: string;
  county: string;
  townCount: number;
  keyTowns: string[];
  newspaper: string;
  url: string;
  type: string;
  publisher: string;
  editor: string;
  additionalPapers: string;
}

interface NewspaperDb {
  newspapers: Newspaper[];
  propertyJournalists: Journalist[];
  financeJournalists: Journalist[];
}

interface TownData {
  slug: string;
  name: string;
  stats: TownStats["stats"] | null;
  planning: PlanningData["summary"] | null;
}

interface PressPackage {
  county: string;
  countyName: string;
  date: string;
  pressRelease: string;
  dataTableCsv: string;
  journalistTargets: {
    name: string;
    newspaper: string;
    contact: string;
    type: "property" | "finance" | "general";
    editor: string;
  }[];
  townCount: number;
  totalTransactions: number;
  avgMedianPrice: number;
  pipelineUnits: number;
  pipelineGdv: number;
}

// ── Data Loading ────────────────────────────────────────────────────────────

function loadCountyTownData(county: string): TownData[] {
  const townStatsDir = path.join(DATA_DIR, "sold-data", county);
  const planningDir = path.join(DATA_DIR, "planning", county);
  const towns: TownData[] = [];

  if (fs.existsSync(townStatsDir)) {
    for (const townDir of fs.readdirSync(townStatsDir)) {
      const statsFile = path.join(townStatsDir, townDir, "latest.json");
      if (!fs.existsSync(statsFile)) continue;

      try {
        const data: TownStats = JSON.parse(fs.readFileSync(statsFile, "utf-8"));
        const planningFile = path.join(planningDir, townDir, "latest.json");
        let planning: PlanningData["summary"] | null = null;
        if (fs.existsSync(planningFile)) {
          planning = JSON.parse(fs.readFileSync(planningFile, "utf-8")).summary;
        }

        towns.push({
          slug: townDir,
          name: slugToName(townDir),
          stats: data.stats,
          planning,
        });
      } catch {
        // Skip malformed
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
        const pData = JSON.parse(fs.readFileSync(planningFile, "utf-8"));
        towns.push({
          slug: townDir,
          name: slugToName(townDir),
          stats: null,
          planning: pData.summary,
        });
      } catch {
        // Skip
      }
    }
  }

  return towns;
}

function loadJournalistDb(): NewspaperDb {
  return JSON.parse(fs.readFileSync(NEWSPAPERS_PATH, "utf-8"));
}

function getJournalistsForCounty(
  db: NewspaperDb,
  countyName: string
): PressPackage["journalistTargets"] {
  const targets: PressPackage["journalistTargets"] = [];

  // Property journalists
  for (const j of db.propertyJournalists) {
    if (j.county.toLowerCase() === countyName.toLowerCase()) {
      targets.push({
        name: j.journalist,
        newspaper: j.newspaper,
        contact: j.contact,
        type: "property",
        editor: j.editor,
      });
    }
  }

  // Finance journalists
  for (const j of db.financeJournalists) {
    if (j.county.toLowerCase() === countyName.toLowerCase()) {
      targets.push({
        name: j.journalist,
        newspaper: j.newspaper,
        contact: j.contact,
        type: "finance",
        editor: j.editor,
      });
    }
  }

  // General newspapers (editors as fallback)
  for (const n of db.newspapers) {
    if (n.county.toLowerCase() === countyName.toLowerCase() && n.editor) {
      // Don't duplicate if already have a journalist at this paper
      if (targets.some((t) => t.newspaper === n.newspaper)) continue;
      targets.push({
        name: n.editor,
        newspaper: n.newspaper,
        contact: "",
        type: "general",
        editor: n.editor,
      });
    }
  }

  return targets;
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

function countySlugToMicrositeDomain(county: string): string {
  // Map county slugs to likely microsite domains for attribution
  const clean = county.replace(/-/g, "");
  return `${clean}developmentfinance.co.uk`;
}

// ── CSV Generation ──────────────────────────────────────────────────────────

function generateDataTableCsv(towns: TownData[], countyName: string): string {
  const rows: string[] = [];
  rows.push("Town,Median Price,YoY Change (%),Transactions (12m),New Build Count,New Build Premium (%),Planning Approved,Planning Pending,Pipeline Units,Estimated GDV");

  // Sort by transaction count descending
  const sorted = [...towns].sort(
    (a, b) => (b.stats?.transactionCount12m || 0) - (a.stats?.transactionCount12m || 0)
  );

  for (const t of sorted) {
    const s = t.stats;
    const p = t.planning;
    rows.push(
      [
        t.name,
        s ? formatGBP(s.medianPrice) : "",
        s ? (s.yoyChange > 0 ? `+${s.yoyChange}` : String(s.yoyChange)) : "",
        s ? String(s.transactionCount12m) : "",
        s ? String(s.newBuildCount) : "",
        s ? s.newBuildPremium.toFixed(1) : "",
        p ? String(p.approved) : "",
        p ? String(p.pending) : "",
        p ? String(p.totalUnits) : "",
        p ? formatGBP(p.totalEstimatedGDV) : "",
      ].join(",")
    );
  }

  return rows.join("\n");
}

// ── Press Release Generation ────────────────────────────────────────────────

function generatePressReleaseTemplate(
  countyName: string,
  towns: TownData[],
  aggregateStats: {
    totalTransactions: number;
    avgMedianPrice: number;
    pipelineUnits: number;
    pipelineGdv: number;
    avgApprovalRate: number;
  }
): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const monthYear = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const micrositeDomain = countySlugToMicrositeDomain(
    countyName.toLowerCase().replace(/\s+/g, "-")
  );

  // Find top movers
  const withStats = towns.filter((t) => t.stats);
  const topRiser = withStats.sort((a, b) => (b.stats?.yoyChange || 0) - (a.stats?.yoyChange || 0))[0];
  const topFaller = withStats.sort((a, b) => (a.stats?.yoyChange || 0) - (b.stats?.yoyChange || 0))[0];
  const mostActive = withStats.sort(
    (a, b) => (b.stats?.transactionCount12m || 0) - (a.stats?.transactionCount12m || 0)
  )[0];

  const withPlanning = towns.filter((t) => t.planning);
  const biggestPipeline = withPlanning.sort(
    (a, b) => (b.planning?.totalUnits || 0) - (a.planning?.totalUnits || 0)
  )[0];

  let release = `# PRESS RELEASE

**FOR IMMEDIATE RELEASE**
**${dateStr}**

## ${countyName} Property Market: ${formatGBP(aggregateStats.avgMedianPrice)} Average Price Across ${aggregateStats.totalTransactions.toLocaleString()} Transactions as Development Pipeline Reaches ${aggregateStats.pipelineUnits.toLocaleString()} Units

**New analysis of HM Land Registry and local planning data reveals the state of ${countyName}'s residential property and development market in ${monthYear}.**

${countyName} — Analysis of the latest HM Land Registry Price Paid Data shows ${aggregateStats.totalTransactions.toLocaleString()} residential transactions completed across ${countyName} in the past 12 months, with an average median price of ${formatGBP(aggregateStats.avgMedianPrice)}.`;

  if (topRiser?.stats && topRiser.stats.yoyChange > 0) {
    release += ` ${topRiser.name} led price growth at +${topRiser.stats.yoyChange}% year-on-year, while`;
  }
  if (mostActive?.stats) {
    release += ` ${mostActive.name} recorded the highest transaction volume with ${mostActive.stats.transactionCount12m.toLocaleString()} sales.`;
  }

  release += `

### Development Pipeline

Local planning authority data shows ${aggregateStats.pipelineUnits.toLocaleString()} residential units currently in the planning pipeline across ${countyName}, representing an estimated gross development value (GDV) of ${formatGBP(aggregateStats.pipelineGdv)}.`;

  if (biggestPipeline?.planning) {
    release += ` ${biggestPipeline.name} has the largest development pipeline with ${biggestPipeline.planning.totalUnits.toLocaleString()} units across ${biggestPipeline.planning.approved + biggestPipeline.planning.pending} applications.`;
  }

  if (aggregateStats.avgApprovalRate > 0) {
    release += ` The average planning approval rate across the county stands at ${aggregateStats.avgApprovalRate}%.`;
  }

  release += `

### Market Commentary

Matt Lenzie, Director at Construction Capital, commented:

> "${countyName} continues to present strong opportunities for residential developers. With ${aggregateStats.pipelineUnits.toLocaleString()} units in the pipeline and median prices`;

  if (topRiser?.stats && topRiser.stats.yoyChange > 0) {
    release += ` rising ${topRiser.stats.yoyChange}% year-on-year in ${topRiser.name}`;
  }

  release += `, developers with planning consent are well-positioned. We're seeing strong demand from our lender panel for schemes across ${countyName}, particularly`;

  if (biggestPipeline) {
    release += ` in ${biggestPipeline.name}`;
  }

  release += ` where pipeline activity signals sustained development appetite."

### Town-by-Town Summary

| Town | Median Price | YoY Change | Transactions | Pipeline Units |
|------|-------------|------------|--------------|----------------|`;

  const sorted = [...towns]
    .filter((t) => t.stats)
    .sort((a, b) => (b.stats?.transactionCount12m || 0) - (a.stats?.transactionCount12m || 0));

  for (const t of sorted) {
    const s = t.stats!;
    const p = t.planning;
    release += `\n| ${t.name} | ${formatGBP(s.medianPrice)} | ${s.yoyChange > 0 ? "+" : ""}${s.yoyChange}% | ${s.transactionCount12m.toLocaleString()} | ${p ? p.totalUnits.toLocaleString() : "N/A"} |`;
  }

  release += `

### Notes to Editors

1. Price data sourced from HM Land Registry Price Paid Data, covering transactions registered in the 12 months to the most recent available quarter.
2. Planning data sourced from local planning authority public registers via the Portal360/Civica planning portal.
3. Estimated GDV calculations are based on unit counts and local median prices by property type.
4. Full data and methodology available at ${micrositeDomain}

### About Construction Capital

Construction Capital is a specialist development finance brokerage with access to over 100 lenders across the UK. The firm arranges development finance, bridging loans, mezzanine finance, and structured funding for residential and commercial schemes.

**Media Contact:**
Matt Lenzie, Director
Construction Capital
info@constructioncapital.co.uk
constructioncapital.co.uk

---
*Source: ${micrositeDomain} — ${countyName} Property Market Data ${monthYear}*
`;

  return release;
}

async function generateAiPressRelease(
  countyName: string,
  towns: TownData[],
  aggregateStats: {
    totalTransactions: number;
    avgMedianPrice: number;
    pipelineUnits: number;
    pipelineGdv: number;
    avgApprovalRate: number;
  }
): Promise<string> {
  const monthYear = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const micrositeDomain = countySlugToMicrositeDomain(
    countyName.toLowerCase().replace(/\s+/g, "-")
  );

  const townSummaries = towns
    .filter((t) => t.stats)
    .sort((a, b) => (b.stats?.transactionCount12m || 0) - (a.stats?.transactionCount12m || 0))
    .map((t) => {
      const lines = [`${t.name}:`];
      if (t.stats) {
        lines.push(`  Median: ${formatGBP(t.stats.medianPrice)}, YoY: ${t.stats.yoyChange > 0 ? "+" : ""}${t.stats.yoyChange}%, Txns: ${t.stats.transactionCount12m}`);
      }
      if (t.planning) {
        lines.push(`  Pipeline: ${t.planning.totalUnits} units, ${formatGBP(t.planning.totalEstimatedGDV)} GDV, ${t.planning.approvalRate}% approval`);
      }
      return lines.join("\n");
    })
    .join("\n");

  const prompt = `You are a PR professional writing a press release for local UK media. Write a press release for ${countyName}'s property and development market for ${monthYear}.

## Data
- Total transactions (12m): ${aggregateStats.totalTransactions.toLocaleString()}
- Average median price: ${formatGBP(aggregateStats.avgMedianPrice)}
- Pipeline units: ${aggregateStats.pipelineUnits.toLocaleString()}
- Pipeline GDV: ${formatGBP(aggregateStats.pipelineGdv)}
- Avg approval rate: ${aggregateStats.avgApprovalRate}%

Town data:
${townSummaries}

## Requirements
- Press release format with FOR IMMEDIATE RELEASE header, headline, standfirst, body, quote, notes to editors
- 400-600 words
- Lead with the most newsworthy data point (biggest price move, transaction volume, or pipeline figure)
- Include one quote from "Matt Lenzie, Director at Construction Capital"
- Quote should offer market insight relevant to developers and homebuyers, not be promotional
- Reference HM Land Registry Price Paid Data and local planning authority data as sources
- Include a data table (markdown) with town-by-town figures
- End with "About Construction Capital" boilerplate and media contact
- Source attribution: "Source: ${micrositeDomain} — ${countyName} Property Market Data ${monthYear}"
- Professional, factual tone suitable for local newspaper editors
- British English

Write the press release now. Output ONLY the markdown content.`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content || "";
}

// ── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const countyFlag = args.indexOf("--county");
const countyFilter = countyFlag !== -1 ? args[countyFlag + 1] : undefined;
const isAll = args.includes("--all");
const noAi = args.includes("--no-ai");

if (!countyFilter && !isAll) {
  console.log("Usage:");
  console.log("  npx tsx scripts/generate-press-packages.ts --county hertfordshire");
  console.log("  npx tsx scripts/generate-press-packages.ts --all");
  console.log("  npx tsx scripts/generate-press-packages.ts --county hertfordshire --no-ai");
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
  const db = loadJournalistDb();
  console.log(`Loaded journalist DB: ${db.newspapers.length} papers, ${db.propertyJournalists.length} property journalists, ${db.financeJournalists.length} finance journalists`);

  // Get counties to process
  const soldDir = path.join(DATA_DIR, "sold-data");
  let counties: string[];

  if (countyFilter) {
    counties = [countyFilter];
  } else {
    counties = fs.existsSync(soldDir) ? fs.readdirSync(soldDir).sort() : [];
  }

  console.log(`Processing ${counties.length} county/counties...\n`);

  let generated = 0;

  for (const county of counties) {
    const countyName = slugToName(county);
    console.log(`\n${countyName}`);

    const towns = loadCountyTownData(county);
    if (towns.length === 0) {
      console.log("  [SKIP] No data found");
      continue;
    }

    // Aggregate stats
    const withStats = towns.filter((t) => t.stats);
    const withPlanning = towns.filter((t) => t.planning);

    const aggregateStats = {
      totalTransactions: withStats.reduce((s, t) => s + (t.stats?.transactionCount12m || 0), 0),
      avgMedianPrice:
        withStats.length > 0
          ? Math.round(withStats.reduce((s, t) => s + (t.stats?.medianPrice || 0), 0) / withStats.length)
          : 0,
      pipelineUnits: withPlanning.reduce((s, t) => s + (t.planning?.totalUnits || 0), 0),
      pipelineGdv: withPlanning.reduce((s, t) => s + (t.planning?.totalEstimatedGDV || 0), 0),
      avgApprovalRate:
        withPlanning.length > 0
          ? Math.round(withPlanning.reduce((s, t) => s + (t.planning?.approvalRate || 0), 0) / withPlanning.length)
          : 0,
    };

    console.log(`  ${towns.length} towns, ${aggregateStats.totalTransactions} txns, ${formatGBP(aggregateStats.avgMedianPrice)} avg median`);

    // Find journalists
    const journalists = getJournalistsForCounty(db, countyName);
    console.log(`  ${journalists.length} journalist targets (${journalists.filter((j) => j.type === "property").length} property, ${journalists.filter((j) => j.type === "finance").length} finance)`);

    try {
      // Generate press release
      let pressRelease: string;
      if (noAi) {
        pressRelease = generatePressReleaseTemplate(countyName, towns, aggregateStats);
        console.log("  [TEMPLATE] Generated press release from template");
      } else {
        pressRelease = await generateAiPressRelease(countyName, towns, aggregateStats);
        console.log("  [AI] Generated press release via OpenAI");
      }

      // Generate CSV data table
      const csv = generateDataTableCsv(towns, countyName);

      // Build package
      const dateStr = new Date().toISOString().split("T")[0];
      const packageDir = path.join(OUTPUT_DIR, county, dateStr);
      fs.mkdirSync(packageDir, { recursive: true });

      // Save press release
      fs.writeFileSync(path.join(packageDir, "press-release.md"), pressRelease, "utf-8");

      // Save data table
      fs.writeFileSync(path.join(packageDir, "data-table.csv"), csv, "utf-8");

      // Save journalist targets
      fs.writeFileSync(
        path.join(packageDir, "journalist-targets.json"),
        JSON.stringify(journalists, null, 2),
        "utf-8"
      );

      // Save full package metadata
      const pkg: PressPackage = {
        county,
        countyName,
        date: dateStr,
        pressRelease,
        dataTableCsv: csv,
        journalistTargets: journalists,
        townCount: towns.length,
        totalTransactions: aggregateStats.totalTransactions,
        avgMedianPrice: aggregateStats.avgMedianPrice,
        pipelineUnits: aggregateStats.pipelineUnits,
        pipelineGdv: aggregateStats.pipelineGdv,
      };

      fs.writeFileSync(
        path.join(packageDir, "package.json"),
        JSON.stringify(pkg, null, 2),
        "utf-8"
      );

      console.log(`  [SAVED] ${packageDir}`);
      generated++;

      // Rate limit between AI calls
      if (!noAi) await new Promise((r) => setTimeout(r, 1000));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`  [ERROR] ${msg.slice(0, 100)}`);
    }
  }

  console.log(`\n--- Done ---`);
  console.log(`Generated: ${generated} press packages`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
