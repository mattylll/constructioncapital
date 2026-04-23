/**
 * Social Media Content Generator
 *
 * Takes market roundups, planning articles, and press releases, then generates
 * platform-specific social media content for LinkedIn, X/Twitter, and Facebook.
 *
 * Uses OpenAI for content adaptation, or template-based fallback with --no-ai.
 *
 * Usage:
 *   npx tsx scripts/generate-social-content.ts --county hertfordshire
 *   npx tsx scripts/generate-social-content.ts --all
 *   npx tsx scripts/generate-social-content.ts --county hertfordshire --no-ai
 *   npx tsx scripts/generate-social-content.ts --county hertfordshire --platform linkedin
 */

import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";

// ── Config ──────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data", "generated");
const OUTPUT_DIR = path.join(DATA_DIR, "social-content");

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

// ── Types ───────────────────────────────────────────────────────────────────

interface ContentSource {
  type: "roundup" | "planning" | "press";
  county: string;
  countyName: string;
  title: string;
  excerpt: string;
  content: string;
  stats: {
    transactions?: number;
    avgMedianPrice?: number;
    pipelineUnits?: number;
    pipelineGdv?: number;
  };
}

interface SocialPost {
  platform: "linkedin" | "twitter" | "facebook";
  content: string;
  hashtags: string[];
  sourceType: string;
  county: string;
  generatedAt: string;
}

// ── Data Loading ────────────────────────────────────────────────────────────

function loadContentSources(county: string): ContentSource[] {
  const sources: ContentSource[] = [];
  const countyName = slugToName(county);

  // Market roundups
  const roundupsDir = path.join(DATA_DIR, "microsite-content", county, "roundups");
  if (fs.existsSync(roundupsDir)) {
    for (const file of fs.readdirSync(roundupsDir).filter((f) => f.endsWith(".json"))) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(roundupsDir, file), "utf-8"));
        sources.push({
          type: "roundup",
          county,
          countyName,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          stats: parseStatsFromExcerpt(data.excerpt),
        });
      } catch { /* skip */ }
    }
  }

  // Planning articles
  const planningDir = path.join(DATA_DIR, "microsite-content", county, "planning");
  if (fs.existsSync(planningDir)) {
    for (const file of fs.readdirSync(planningDir).filter((f) => f.endsWith(".json"))) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(planningDir, file), "utf-8"));
        sources.push({
          type: "planning",
          county,
          countyName,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          stats: parseStatsFromExcerpt(data.excerpt),
        });
      } catch { /* skip */ }
    }
  }

  // Press releases
  const pressDir = path.join(DATA_DIR, "press-packages", county);
  if (fs.existsSync(pressDir)) {
    const dates = fs.readdirSync(pressDir).sort().reverse();
    for (const date of dates.slice(0, 1)) {
      const releasePath = path.join(pressDir, date, "press-release.md");
      const pkgPath = path.join(pressDir, date, "package.json");
      if (fs.existsSync(releasePath) && fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
          sources.push({
            type: "press",
            county,
            countyName,
            title: `${countyName} Property Market Update`,
            excerpt: `${pkg.totalTransactions?.toLocaleString()} transactions, ${formatGBP(pkg.avgMedianPrice)} median price`,
            content: fs.readFileSync(releasePath, "utf-8"),
            stats: {
              transactions: pkg.totalTransactions,
              avgMedianPrice: pkg.avgMedianPrice,
              pipelineUnits: pkg.pipelineUnits,
              pipelineGdv: pkg.pipelineGdv,
            },
          });
        } catch { /* skip */ }
      }
    }
  }

  return sources;
}

function parseStatsFromExcerpt(excerpt: string): ContentSource["stats"] {
  const stats: ContentSource["stats"] = {};
  const txnMatch = excerpt.match(/([\d,]+)\s*transactions/);
  if (txnMatch) stats.transactions = parseInt(txnMatch[1].replace(/,/g, ""), 10);
  const priceMatch = excerpt.match(/£([\d.]+[kmb])/i);
  if (priceMatch) stats.avgMedianPrice = parseShortGBP(priceMatch[1]);
  const unitsMatch = excerpt.match(/([\d,]+)\s*units/);
  if (unitsMatch) stats.pipelineUnits = parseInt(unitsMatch[1].replace(/,/g, ""), 10);
  return stats;
}

function parseShortGBP(s: string): number {
  const num = parseFloat(s);
  if (s.endsWith("bn") || s.endsWith("b")) return num * 1_000_000_000;
  if (s.endsWith("m")) return num * 1_000_000;
  if (s.endsWith("k")) return num * 1_000;
  return num;
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

function getHashtags(countyName: string, type: string): string[] {
  const base = ["#PropertyMarket", "#DevelopmentFinance", "#UKProperty"];
  const countyTag = `#${countyName.replace(/\s+/g, "")}`;
  if (type === "planning") return [countyTag, "#Planning", "#PropertyDevelopment", ...base];
  if (type === "roundup") return [countyTag, "#MarketUpdate", "#HousePrices", ...base];
  return [countyTag, "#PressRelease", ...base];
}

// ── Template-Based Generation ───────────────────────────────────────────────

function generateTemplatePost(source: ContentSource, platform: "linkedin" | "twitter" | "facebook"): SocialPost {
  const hashtags = getHashtags(source.countyName, source.type);
  let content: string;

  if (platform === "linkedin") {
    content = generateLinkedInTemplate(source, hashtags);
  } else if (platform === "twitter") {
    content = generateTwitterTemplate(source, hashtags);
  } else {
    content = generateFacebookTemplate(source, hashtags);
  }

  return {
    platform,
    content,
    hashtags,
    sourceType: source.type,
    county: source.county,
    generatedAt: new Date().toISOString(),
  };
}

function generateLinkedInTemplate(source: ContentSource, hashtags: string[]): string {
  const s = source.stats;
  let post = "";

  if (source.type === "roundup" || source.type === "press") {
    post = `${source.countyName} Property Market Update\n\n`;
    if (s.transactions) post += `${s.transactions.toLocaleString()} transactions in the last 12 months\n`;
    if (s.avgMedianPrice) post += `${formatGBP(s.avgMedianPrice)} average median price\n`;
    if (s.pipelineUnits) post += `${s.pipelineUnits.toLocaleString()} units in the planning pipeline\n`;
    if (s.pipelineGdv) post += `${formatGBP(s.pipelineGdv)} estimated GDV\n`;
    post += `\nOur latest analysis of HM Land Registry and local planning data shows ${source.countyName} remains an active market for residential developers.\n`;
    post += `\nFull report on our website. If you're developing in ${source.countyName} and need finance, we can provide indicative terms within 24 hours.\n`;
  } else {
    post = `${source.countyName} Planning Pipeline Update\n\n`;
    if (s.pipelineUnits) post += `${s.pipelineUnits.toLocaleString()} residential units in the pipeline\n`;
    post += `\nOur analysis of local planning authority data highlights the latest development activity across ${source.countyName}.\n`;
    post += `\nDevelopers with consented sites — speak to us about development finance. Indicative terms within 24 hours, no upfront fees.\n`;
  }

  post += `\n${hashtags.slice(0, 5).join(" ")}`;
  return post;
}

function generateTwitterTemplate(source: ContentSource, hashtags: string[]): string {
  const s = source.stats;

  if (source.type === "roundup" || source.type === "press") {
    let tweet = `${source.countyName} property market update:\n\n`;
    if (s.transactions) tweet += `${s.transactions.toLocaleString()} transactions\n`;
    if (s.avgMedianPrice) tweet += `${formatGBP(s.avgMedianPrice)} avg price\n`;
    if (s.pipelineUnits) tweet += `${s.pipelineUnits.toLocaleString()} units in pipeline\n`;
    tweet += `\nFull data on our website.`;
    tweet += `\n\n${hashtags.slice(0, 3).join(" ")}`;
    return tweet;
  }

  let tweet = `${source.countyName} planning update: `;
  if (s.pipelineUnits) tweet += `${s.pipelineUnits.toLocaleString()} residential units in the pipeline. `;
  tweet += `Full analysis on our website.`;
  tweet += `\n\n${hashtags.slice(0, 3).join(" ")}`;
  return tweet;
}

function generateFacebookTemplate(source: ContentSource, hashtags: string[]): string {
  const s = source.stats;
  let post = "";

  if (source.type === "roundup" || source.type === "press") {
    post = `Our latest ${source.countyName} property market report is out.\n\n`;
    post += `Key findings:\n`;
    if (s.transactions) post += `- ${s.transactions.toLocaleString()} residential transactions in the past year\n`;
    if (s.avgMedianPrice) post += `- Average median price: ${formatGBP(s.avgMedianPrice)}\n`;
    if (s.pipelineUnits) post += `- ${s.pipelineUnits.toLocaleString()} new homes in the planning pipeline\n`;
    if (s.pipelineGdv) post += `- Pipeline value: ${formatGBP(s.pipelineGdv)}\n`;
    post += `\nWhether you're a developer looking for finance or a buyer tracking the market, our full report has the details. Link in comments.\n`;
  } else {
    post = `Planning update for ${source.countyName}:\n\n`;
    if (s.pipelineUnits) post += `${s.pipelineUnits.toLocaleString()} residential units are currently in the planning pipeline. `;
    post += `We've analysed the latest applications from local planning authorities to identify key development trends.\n`;
    post += `\nIf you're a developer with a consented site in ${source.countyName}, we can help with finance. Full article linked in comments.\n`;
  }

  post += `\n${hashtags.slice(0, 4).join(" ")}`;
  return post;
}

// ── AI-Based Generation ─────────────────────────────────────────────────────

async function generateAiPosts(source: ContentSource): Promise<SocialPost[]> {
  const hashtags = getHashtags(source.countyName, source.type);

  const prompt = `You are a social media manager for Construction Capital, a UK development finance brokerage. Generate social media posts based on this article.

## Article
Title: ${source.title}
Excerpt: ${source.excerpt}
Stats: ${JSON.stringify(source.stats)}
Content (first 1500 chars): ${source.content.slice(0, 1500)}

## Requirements
Generate 3 posts — one for each platform. Output as JSON array with objects: { platform, content, hashtags }

### LinkedIn
- Professional, data-led tone
- 800-1,300 characters
- Lead with the most compelling stat
- End with a soft CTA (speak to us for finance / indicative terms within 24 hours)
- 3-5 relevant hashtags

### X/Twitter
- Punchy, stat-forward
- Under 280 characters (excluding hashtags)
- One tweet, not a thread
- 2-3 hashtags

### Facebook
- Conversational but authoritative
- 400-800 characters
- Include bullet points for key stats
- End with engagement prompt or CTA
- 3-4 hashtags

All posts must:
- Use British English
- Reference Construction Capital naturally (not forced)
- Be factual — only cite numbers from the data provided
- Not include links (those are added separately)

Output ONLY valid JSON array.`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1500,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content || "{}";
  try {
    const parsed = JSON.parse(raw);
    const posts = Array.isArray(parsed) ? parsed : parsed.posts || [];
    return posts.map((p: any) => ({
      platform: p.platform,
      content: p.content,
      hashtags: p.hashtags || hashtags,
      sourceType: source.type,
      county: source.county,
      generatedAt: new Date().toISOString(),
    }));
  } catch {
    console.log("    [WARN] Failed to parse AI response, falling back to templates");
    return ["linkedin", "twitter", "facebook"].map((platform) =>
      generateTemplatePost(source, platform as any)
    );
  }
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const countyFlag = args.indexOf("--county");
const countyFilter = countyFlag !== -1 ? args[countyFlag + 1] : undefined;
const platformFlag = args.indexOf("--platform");
const platformFilter = platformFlag !== -1 ? args[platformFlag + 1] : undefined;
const isAll = args.includes("--all");
const noAi = args.includes("--no-ai");

if (!countyFilter && !isAll) {
  console.log("Usage:");
  console.log("  npx tsx scripts/generate-social-content.ts --county hertfordshire");
  console.log("  npx tsx scripts/generate-social-content.ts --all");
  console.log("  npx tsx scripts/generate-social-content.ts --county hertfordshire --no-ai");
  console.log("  npx tsx scripts/generate-social-content.ts --county hertfordshire --platform linkedin");
  console.log("\nAvailable counties with content:");

  const micrositeDir = path.join(DATA_DIR, "microsite-content");
  if (fs.existsSync(micrositeDir)) {
    for (const c of fs.readdirSync(micrositeDir).sort()) {
      const stat = fs.statSync(path.join(micrositeDir, c));
      if (stat.isDirectory()) console.log(`  ${c}`);
    }
  }
  process.exit(0);
}

async function main() {
  // Get counties
  let counties: string[];
  if (countyFilter) {
    counties = [countyFilter];
  } else {
    const micrositeDir = path.join(DATA_DIR, "microsite-content");
    counties = fs.existsSync(micrositeDir)
      ? fs.readdirSync(micrositeDir).filter((c) => fs.statSync(path.join(micrositeDir, c)).isDirectory()).sort()
      : [];
  }

  const platforms: ("linkedin" | "twitter" | "facebook")[] = platformFilter
    ? [platformFilter as any]
    : ["linkedin", "twitter", "facebook"];

  console.log(`Processing ${counties.length} county/counties for ${platforms.join(", ")}...\n`);

  let totalPosts = 0;
  const dateStr = new Date().toISOString().split("T")[0];

  for (const county of counties) {
    const countyName = slugToName(county);
    console.log(`\n${countyName}`);

    const sources = loadContentSources(county);
    if (sources.length === 0) {
      console.log("  [SKIP] No content sources");
      continue;
    }

    console.log(`  ${sources.length} content source(s): ${sources.map((s) => s.type).join(", ")}`);

    const allPosts: SocialPost[] = [];

    for (const source of sources) {
      try {
        let posts: SocialPost[];

        if (noAi) {
          posts = platforms.map((p) => generateTemplatePost(source, p));
          console.log(`  [TEMPLATE] ${source.type}: ${posts.length} posts`);
        } else {
          posts = await generateAiPosts(source);
          // Filter to requested platforms
          posts = posts.filter((p) => platforms.includes(p.platform));
          console.log(`  [AI] ${source.type}: ${posts.length} posts`);
          await new Promise((r) => setTimeout(r, 1000));
        }

        allPosts.push(...posts);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`  [ERROR] ${source.type}: ${msg.slice(0, 100)}`);
      }
    }

    // Save by platform
    const outDir = path.join(OUTPUT_DIR, dateStr, county);
    fs.mkdirSync(outDir, { recursive: true });

    for (const platform of platforms) {
      const platformPosts = allPosts.filter((p) => p.platform === platform);
      if (platformPosts.length === 0) continue;

      fs.writeFileSync(
        path.join(outDir, `${platform}.json`),
        JSON.stringify(platformPosts, null, 2),
        "utf-8"
      );
    }

    // Save combined
    fs.writeFileSync(
      path.join(outDir, "all.json"),
      JSON.stringify(allPosts, null, 2),
      "utf-8"
    );

    totalPosts += allPosts.length;
    console.log(`  [SAVED] ${outDir} (${allPosts.length} posts)`);
  }

  console.log(`\n--- Done ---`);
  console.log(`Total posts: ${totalPosts}`);
  console.log(`Output: ${OUTPUT_DIR}/${dateStr}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
