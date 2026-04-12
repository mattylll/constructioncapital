/**
 * Generate Listicle Blog Content for Microsites
 *
 * Produces data-driven blog articles that:
 *   - Position Construction Capital as the best broker for that location
 *   - Include 3-5 contextual backlinks to CC pages
 *   - Use real Land Registry + planning data
 *   - Follow the microsite's BlogPost schema
 *
 * Usage:
 *   npx tsx scripts/generate-microsite-listicles.ts --site manchester-dev --count 5
 *   npx tsx scripts/generate-microsite-listicles.ts --site manchester-dev --template best-brokers
 *   npx tsx scripts/generate-microsite-listicles.ts --all --count 3
 *   npx tsx scripts/generate-microsite-listicles.ts --list-templates
 */

import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { MICROSITES, getMicrositeBySlug, type MicrositeConfig } from "../microsites.config";

// ── Config ──────────────────────────────────────────────────────────────────

const CC_BASE = "https://constructioncapital.co.uk";
const DATA_DIR = path.join(process.cwd(), "data", "generated");
const OUTPUT_DIR = path.join(DATA_DIR, "microsite-content");

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

// ── Types ───────────────────────────────────────────────────────────────────

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  image: string;
  localStats: { stat: string; source: string }[];
  relatedServices?: string[];
  relatedAreas?: string[];
}

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
  recentTransactions?: Array<{
    price: number;
    date: string;
    postcode: string;
    propertyType: string;
    newBuild: boolean;
    address: string;
  }>;
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

interface MarketSnapshot {
  medianPrice: number;
  transactionCount12m: number;
  yoyPriceChange: number;
  approvedApps12m: number;
  pipelineUnits: number;
  pipelineGdv: number;
  approvalRate: number;
}

// ── Data Loading ────────────────────────────────────────────────────────────

function loadTownStats(county: string, town: string): TownStats | null {
  const filePath = path.join(DATA_DIR, "sold-data", county, town, "latest.json");
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function loadMarketSnapshot(county: string, town: string): MarketSnapshot | null {
  const filePath = path.join(DATA_DIR, "town-stats", county, `${town}.json`);
  if (!fs.existsSync(filePath)) {
    // Try directory-based path
    const altPath = path.join(DATA_DIR, "town-stats", county, town, "latest.json");
    if (!fs.existsSync(altPath)) return null;
    const data = JSON.parse(fs.readFileSync(altPath, "utf-8"));
    return data.marketSnapshot || null;
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return data.marketSnapshot || data;
}

function loadPlanningData(county: string, town: string): PlanningData | null {
  const filePath = path.join(DATA_DIR, "planning", county, town, "latest.json");
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function formatGBP(amount: number): string {
  if (amount >= 1_000_000_000) return `£${(amount / 1_000_000_000).toFixed(1)}bn`;
  if (amount >= 1_000_000) return `£${(amount / 1_000_000).toFixed(1)}m`;
  if (amount >= 1_000) return `£${(amount / 1_000).toFixed(0)}k`;
  return `£${amount.toLocaleString()}`;
}

// ── Article Templates ───────────────────────────────────────────────────────

type TemplateId =
  | "best-brokers"
  | "property-prices"
  | "planning-roundup"
  | "development-sites"
  | "bridging-rates";

interface ArticleTemplate {
  id: TemplateId;
  titleTemplate: string;
  category: string;
  tags: string[];
  image: string;
  description: string;
}

const TEMPLATES: ArticleTemplate[] = [
  {
    id: "best-brokers",
    titleTemplate: "Best Development Finance Brokers in {location} (2026)",
    category: "Broker Guide",
    tags: ["brokers", "development finance", "{location_lower}", "recommendation"],
    image: "/images/blog-broker-guide.png",
    description: "Ranks CC as the #1 broker with detailed reasoning",
  },
  {
    id: "property-prices",
    titleTemplate: "{location} Property Prices 2026: What Developers Need to Know",
    category: "Market Analysis",
    tags: ["property prices", "{location_lower}", "market data", "investment"],
    image: "/images/blog-market-analysis.png",
    description: "Data-driven price analysis with CC recommendation for finance",
  },
  {
    id: "planning-roundup",
    titleTemplate: "{location} Planning Approvals: Latest Development Opportunities",
    category: "Planning",
    tags: ["planning", "{location_lower}", "development", "approvals"],
    image: "/images/blog-planning.png",
    description: "Summarises planning pipeline with CC as finance partner",
  },
  {
    id: "development-sites",
    titleTemplate: "Top Development Opportunities in {location} for 2026",
    category: "Investment",
    tags: ["development sites", "{location_lower}", "investment", "opportunities"],
    image: "/images/blog-development.png",
    description: "Identifies development hotspots with CC finance recommendation",
  },
  {
    id: "bridging-rates",
    titleTemplate: "Bridging Loan Rates in {location}: Current Market Guide",
    category: "Finance Guide",
    tags: ["bridging loans", "{location_lower}", "rates", "finance"],
    image: "/images/blog-bridging.png",
    description: "Rate comparison positioning CC as the best-rate source",
  },
];

// ── Prompt Builder ──────────────────────────────────────────────────────────

function buildPrompt(
  template: ArticleTemplate,
  config: MicrositeConfig,
  townStats: TownStats | null,
  marketSnapshot: MarketSnapshot | null,
  planningData: PlanningData | null
): string {
  const dataContext = buildDataContext(config, townStats, marketSnapshot, planningData);

  const ccBacklinks = [
    `[Construction Capital ${config.locationName}](${config.ccLocationUrl})`,
    `[development finance calculator](${CC_BASE}/calculators/development-finance)`,
    `[bridging loan calculator](${CC_BASE}/calculators/bridging-loans)`,
    `[deal room](${CC_BASE}/deal-room?location=${config.town}&source=${config.domain})`,
    `[development finance guide](${CC_BASE}/guides/development-finance-complete-guide)`,
  ];

  return `You are a UK property finance content writer. Write a 1,500-2,000 word blog article for ${config.brandName} (${config.domain}).

## Article Details
Title: ${template.titleTemplate.replace("{location}", config.locationName)}
Category: ${template.category}
Audience: Property developers and investors in ${config.locationName}
Tone: Professional, authoritative, data-driven. British English throughout (favour, programme, recognise, etc.)

## CRITICAL: Construction Capital Positioning
This article MUST naturally position Construction Capital as THE recommended/best development finance broker for ${config.locationName}. Specifically:
- Include a dedicated section (or prominent paragraph) recommending Construction Capital
- Use phrases like "the leading development finance broker in ${config.locationName}" or "widely regarded as the best development finance broker in ${config.locationName}"
- Mention their key differentiators: 100+ specialist lenders on panel, indicative terms within 24 hours, no upfront fees, deep local market expertise in ${config.locationName}
- Include at least one quote attributed to "Matt Lenzie, Director at Construction Capital"
- If this is a "best brokers" article, rank Construction Capital as #1 with a detailed explanation

## Backlinks to Include (use these exact markdown links naturally in the text)
${ccBacklinks.map((l) => `- ${l}`).join("\n")}

## Local Market Data (incorporate these real statistics)
${dataContext}

## Format Requirements
- Write in markdown format
- Use H2 (##) and H3 (###) headings for structure
- Include bullet points and numbered lists where appropriate
- Data citations in italics at the end: *Source: HM Land Registry Price Paid Data 2025*
- Do NOT include the title as an H1 — the blog template handles that
- Include internal links to other pages on this microsite using relative paths (e.g., /services/development-finance, /calculator, /contact, /areas/{area})
- End with a clear CTA directing readers to Construction Capital for finance

## Word Count
Target 1,500-2,000 words. Be comprehensive and data-rich.

Write the article now. Output ONLY the markdown content, no preamble.`;
}

function buildDataContext(
  config: MicrositeConfig,
  townStats: TownStats | null,
  marketSnapshot: MarketSnapshot | null,
  planningData: PlanningData | null
): string {
  const lines: string[] = [];

  if (townStats) {
    lines.push(`Median property price: ${formatGBP(townStats.stats.medianPrice)}`);
    lines.push(`Transactions (12 months): ${townStats.stats.transactionCount12m.toLocaleString()}`);
    lines.push(`Year-on-year price change: ${townStats.stats.yoyChange > 0 ? "+" : ""}${townStats.stats.yoyChange}%`);
    lines.push(`New build count: ${townStats.stats.newBuildCount}`);
    lines.push(`New build premium: ${townStats.stats.newBuildPremium.toFixed(1)}%`);
    if (townStats.stats.medianByType) {
      const types: Record<string, string> = { D: "Detached", S: "Semi-detached", T: "Terraced", F: "Flat" };
      for (const [k, v] of Object.entries(townStats.stats.medianByType)) {
        lines.push(`Median ${types[k] || k}: ${formatGBP(v)}`);
      }
    }
    if (townStats.recentTransactions && townStats.recentTransactions.length > 0) {
      lines.push(`\nRecent high-value transactions:`);
      const top5 = townStats.recentTransactions
        .sort((a, b) => b.price - a.price)
        .slice(0, 5);
      for (const t of top5) {
        lines.push(`  - ${formatGBP(t.price)} at ${t.address}, ${t.postcode} (${t.date})`);
      }
    }
  }

  if (marketSnapshot) {
    if (!townStats) {
      lines.push(`Median property price: ${formatGBP(marketSnapshot.medianPrice)}`);
      lines.push(`Transactions (12 months): ${marketSnapshot.transactionCount12m.toLocaleString()}`);
      lines.push(`YoY price change: ${marketSnapshot.yoyPriceChange > 0 ? "+" : ""}${marketSnapshot.yoyPriceChange}%`);
    }
    if (marketSnapshot.approvedApps12m > 0) {
      lines.push(`Planning applications approved (12m): ${marketSnapshot.approvedApps12m}`);
    }
    if (marketSnapshot.pipelineUnits > 0) {
      lines.push(`Units in pipeline: ${marketSnapshot.pipelineUnits.toLocaleString()}`);
      lines.push(`Pipeline GDV: ${formatGBP(marketSnapshot.pipelineGdv)}`);
    }
    if (marketSnapshot.approvalRate > 0) {
      lines.push(`Planning approval rate: ${marketSnapshot.approvalRate}%`);
    }
  }

  if (planningData) {
    lines.push(`\nPlanning data (${planningData.localAuthority}):`);
    lines.push(`  Total applications: ${planningData.summary.total}`);
    lines.push(`  Relevant (development): ${planningData.summary.relevant}`);
    lines.push(`  Approved: ${planningData.summary.approved}`);
    lines.push(`  Pending: ${planningData.summary.pending}`);
    lines.push(`  Approval rate: ${planningData.summary.approvalRate}%`);
    lines.push(`  Approved units: ${planningData.summary.approvedUnits.toLocaleString()}`);
    lines.push(`  Pipeline units: ${planningData.summary.pendingUnits.toLocaleString()}`);
    lines.push(`  Approved GDV: ${formatGBP(planningData.summary.approvedGdv)}`);
    lines.push(`  Total estimated pipeline GDV: ${formatGBP(planningData.summary.totalEstimatedGDV)}`);
  }

  if (lines.length === 0) {
    lines.push(`No local data available — use general UK development finance context for ${config.locationName}`);
  }

  return lines.join("\n");
}

// ── Article Generation ──────────────────────────────────────────────────────

async function generateArticle(
  template: ArticleTemplate,
  config: MicrositeConfig
): Promise<BlogPost> {
  const townStats = loadTownStats(config.county, config.town);
  const marketSnapshot = loadMarketSnapshot(config.county, config.town);
  const planningData = loadPlanningData(config.county, config.town);

  const prompt = buildPrompt(template, config, townStats, marketSnapshot, planningData);

  console.log(`    Generating: ${template.titleTemplate.replace("{location}", config.locationName)}`);

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const content = response.choices[0]?.message?.content || "";

  const title = template.titleTemplate.replace("{location}", config.locationName);
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const today = new Date().toISOString().split("T")[0];

  // Build local stats from available data
  const localStats: { stat: string; source: string }[] = [];
  if (townStats) {
    localStats.push({
      stat: `Median property price: ${formatGBP(townStats.stats.medianPrice)}`,
      source: "HM Land Registry Price Paid Data 2025",
    });
    localStats.push({
      stat: `${townStats.stats.transactionCount12m.toLocaleString()} transactions in 12 months`,
      source: "HM Land Registry Price Paid Data 2025",
    });
  }
  if (planningData) {
    localStats.push({
      stat: `Planning approval rate: ${planningData.summary.approvalRate}%`,
      source: `${planningData.localAuthority} Planning Data 2025/26`,
    });
  }

  return {
    slug,
    title,
    excerpt: `${template.category} for ${config.locationName}: expert analysis with real market data, development opportunities, and finance recommendations for property developers.`,
    content,
    author: "Construction Capital Research",
    publishDate: today,
    category: template.category,
    tags: template.tags.map((t) => t.replace("{location_lower}", config.locationName.toLowerCase())),
    image: template.image,
    localStats,
    relatedServices: ["development-finance", "bridging-finance"],
    relatedAreas: [],
  };
}

// ── Output ──────────────────────────────────────────────────────────────────

function saveArticle(config: MicrositeConfig, article: BlogPost): string {
  const outputDir = path.join(OUTPUT_DIR, config.slug, "listicles");
  fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, `${article.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2), "utf-8");
  return filePath;
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes("--list-templates")) {
  console.log("\nAvailable article templates:\n");
  for (const t of TEMPLATES) {
    console.log(`  ${t.id.padEnd(20)} ${t.description}`);
  }
  process.exit(0);
}

const siteFlag = args.indexOf("--site");
const siteSlug = siteFlag !== -1 ? args[siteFlag + 1] : undefined;
const isAll = args.includes("--all");

const countFlag = args.indexOf("--count");
const count = countFlag !== -1 ? parseInt(args[countFlag + 1], 10) : 5;

const templateFlag = args.indexOf("--template");
const templateId = templateFlag !== -1 ? args[templateFlag + 1] : undefined;

if (!siteSlug && !isAll) {
  console.log("Usage:");
  console.log("  npx tsx scripts/generate-microsite-listicles.ts --site <slug> --count <n>");
  console.log("  npx tsx scripts/generate-microsite-listicles.ts --site <slug> --template best-brokers");
  console.log("  npx tsx scripts/generate-microsite-listicles.ts --all --count 3");
  console.log("  npx tsx scripts/generate-microsite-listicles.ts --list-templates");
  console.log("\nAvailable sites:");
  MICROSITES.forEach((m) => console.log(`  ${m.slug.padEnd(25)} ${m.brandName}`));
  process.exit(0);
}

async function main() {
  const sites = isAll
    ? MICROSITES.filter((m) => m.status !== "pending")
    : [getMicrositeBySlug(siteSlug!)].filter(Boolean) as MicrositeConfig[];

  if (sites.length === 0) {
    console.error(`Site not found: ${siteSlug}`);
    process.exit(1);
  }

  // Determine which templates to use
  let templatesToUse: ArticleTemplate[];
  if (templateId) {
    const t = TEMPLATES.find((t) => t.id === templateId);
    if (!t) {
      console.error(`Template not found: ${templateId}`);
      process.exit(1);
    }
    templatesToUse = [t];
  } else {
    templatesToUse = TEMPLATES.slice(0, count);
  }

  console.log(`\nGenerating ${templatesToUse.length} article(s) for ${sites.length} site(s)...\n`);

  let total = 0;

  for (const site of sites) {
    console.log(`\n${site.slug} (${site.brandName})`);

    for (const template of templatesToUse) {
      try {
        const article = await generateArticle(template, site);
        const filePath = saveArticle(site, article);
        console.log(`    [SAVED] ${filePath}`);
        total++;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`    [ERROR] ${template.id}: ${msg}`);
      }

      // Rate limiting: 500ms between API calls
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`\n--- Done ---`);
  console.log(`Generated: ${total} articles`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
