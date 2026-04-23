/**
 * Content Quality Review
 *
 * Uses Gemini API to review generated articles for:
 *   - Factual consistency with source data
 *   - Brand tone and Construction Capital positioning
 *   - SEO keyword density
 *   - Readability
 *   - FCA compliance (no guarantees, no misleading claims)
 *
 * Output: Quality score (0-100) + issues list. Below threshold → flagged.
 *
 * Env: GEMINI_API_KEY
 *
 * Usage:
 *   npx tsx scripts/review-content-quality.ts --county hertfordshire
 *   npx tsx scripts/review-content-quality.ts --all
 *   npx tsx scripts/review-content-quality.ts --file path/to/article.json
 *   npx tsx scripts/review-content-quality.ts --threshold 70
 */

import * as fs from "fs";
import * as path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ── Config ──────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data", "generated");
const OUTPUT_DIR = path.join(DATA_DIR, "content-review");
const DEFAULT_THRESHOLD = 70;

let _genAI: GoogleGenerativeAI | null = null;
function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("Missing GEMINI_API_KEY environment variable");
    _genAI = new GoogleGenerativeAI(key);
  }
  return _genAI;
}

// ── Types ───────────────────────────────────────────────────────────────────

interface ContentFile {
  path: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  county: string;
}

interface ReviewResult {
  file: string;
  slug: string;
  title: string;
  overallScore: number;
  scores: {
    factualAccuracy: number;
    brandTone: number;
    seoKeywords: number;
    readability: number;
    fcaCompliance: number;
  };
  issues: {
    severity: "high" | "medium" | "low";
    category: string;
    description: string;
  }[];
  summary: string;
  flagged: boolean;
}

// ── Data Loading ────────────────────────────────────────────────────────────

function findContentFiles(county?: string): ContentFile[] {
  const files: ContentFile[] = [];
  const micrositeDir = path.join(DATA_DIR, "microsite-content");

  if (!fs.existsSync(micrositeDir)) return files;

  const counties = county
    ? [county]
    : fs.readdirSync(micrositeDir).filter((c) => {
        const stat = fs.statSync(path.join(micrositeDir, c));
        return stat.isDirectory();
      });

  for (const c of counties) {
    const countyDir = path.join(micrositeDir, c);

    // Roundups
    const roundupsDir = path.join(countyDir, "roundups");
    if (fs.existsSync(roundupsDir)) {
      for (const f of fs.readdirSync(roundupsDir).filter((f) => f.endsWith(".json"))) {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(roundupsDir, f), "utf-8"));
          files.push({
            path: path.join(roundupsDir, f),
            slug: data.slug,
            title: data.title,
            content: data.content,
            category: "roundup",
            county: c,
          });
        } catch { /* skip */ }
      }
    }

    // Planning articles
    const planningDir = path.join(countyDir, "planning");
    if (fs.existsSync(planningDir)) {
      for (const f of fs.readdirSync(planningDir).filter((f) => f.endsWith(".json"))) {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(planningDir, f), "utf-8"));
          files.push({
            path: path.join(planningDir, f),
            slug: data.slug,
            title: data.title,
            content: data.content,
            category: "planning",
            county: c,
          });
        } catch { /* skip */ }
      }
    }

    // Listicles
    const listiclesDir = path.join(countyDir, "listicles");
    if (fs.existsSync(listiclesDir)) {
      for (const f of fs.readdirSync(listiclesDir).filter((f) => f.endsWith(".json"))) {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(listiclesDir, f), "utf-8"));
          files.push({
            path: path.join(listiclesDir, f),
            slug: data.slug,
            title: data.title,
            content: data.body || data.content,
            category: "listicle",
            county: c,
          });
        } catch { /* skip */ }
      }
    }
  }

  return files;
}

function loadSourceData(county: string): string {
  // Load summary stats for fact-checking
  const parts: string[] = [];

  const soldDir = path.join(DATA_DIR, "sold-data", county);
  if (fs.existsSync(soldDir)) {
    for (const town of fs.readdirSync(soldDir)) {
      const statsFile = path.join(soldDir, town, "latest.json");
      if (!fs.existsSync(statsFile)) continue;
      try {
        const data = JSON.parse(fs.readFileSync(statsFile, "utf-8"));
        const s = data.stats;
        parts.push(`${town}: median £${s.medianPrice}, txns ${s.transactionCount12m}, yoy ${s.yoyChange}%`);
      } catch { /* skip */ }
    }
  }

  const planDir = path.join(DATA_DIR, "planning", county);
  if (fs.existsSync(planDir)) {
    for (const town of fs.readdirSync(planDir)) {
      const file = path.join(planDir, town, "latest.json");
      if (!fs.existsSync(file)) continue;
      try {
        const data = JSON.parse(fs.readFileSync(file, "utf-8"));
        const s = data.summary;
        parts.push(`${town} planning: ${s.totalUnits} units, GDV £${s.totalEstimatedGDV}, approval ${s.approvalRate}%`);
      } catch { /* skip */ }
    }
  }

  return parts.join("\n");
}

// ── Review ──────────────────────────────────────────────────────────────────

async function reviewContent(file: ContentFile, sourceData: string): Promise<ReviewResult> {
  const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are a content quality reviewer for a UK development finance brokerage called Construction Capital. Review this article and score it.

## Article
Title: ${file.title}
Category: ${file.category}
Content:
${file.content.slice(0, 4000)}

## Source Data (for fact-checking)
${sourceData.slice(0, 2000)}

## Review Criteria

Score each category 0-100:

1. **Factual Accuracy** — Do the numbers match the source data? Are claims verifiable? Any fabricated statistics?
2. **Brand Tone** — Professional, data-driven, British English? Does it position Construction Capital appropriately (expert, not pushy)?
3. **SEO Keywords** — Does it include relevant terms (development finance, property market, {location name}, bridging loans, planning)?
4. **Readability** — Clear structure? Appropriate heading hierarchy? Not too dense or too thin?
5. **FCA Compliance** — No guarantees of returns, no misleading rate promises, no unqualified financial advice? Terms like "indicative" used where appropriate?

## Output Format

Respond with ONLY valid JSON:
{
  "scores": {
    "factualAccuracy": <0-100>,
    "brandTone": <0-100>,
    "seoKeywords": <0-100>,
    "readability": <0-100>,
    "fcaCompliance": <0-100>
  },
  "issues": [
    { "severity": "high|medium|low", "category": "factual|brand|seo|readability|fca", "description": "..." }
  ],
  "summary": "1-2 sentence overall assessment"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      file: file.path,
      slug: file.slug,
      title: file.title,
      overallScore: 0,
      scores: { factualAccuracy: 0, brandTone: 0, seoKeywords: 0, readability: 0, fcaCompliance: 0 },
      issues: [{ severity: "high", category: "review", description: "Failed to parse review response" }],
      summary: "Review failed",
      flagged: true,
    };
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const scores = parsed.scores;
  const overallScore = Math.round(
    (scores.factualAccuracy + scores.brandTone + scores.seoKeywords + scores.readability + scores.fcaCompliance) / 5
  );

  return {
    file: file.path,
    slug: file.slug,
    title: file.title,
    overallScore,
    scores,
    issues: parsed.issues || [],
    summary: parsed.summary || "",
    flagged: false, // Set below based on threshold
  };
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const countyFlag = args.indexOf("--county");
const countyFilter = countyFlag !== -1 ? args[countyFlag + 1] : undefined;
const fileFlag = args.indexOf("--file");
const fileFilter = fileFlag !== -1 ? args[fileFlag + 1] : undefined;
const thresholdFlag = args.indexOf("--threshold");
const threshold = thresholdFlag !== -1 ? parseInt(args[thresholdFlag + 1], 10) : DEFAULT_THRESHOLD;
const isAll = args.includes("--all");

if (!countyFilter && !fileFilter && !isAll) {
  console.log("Usage:");
  console.log("  npx tsx scripts/review-content-quality.ts --county hertfordshire");
  console.log("  npx tsx scripts/review-content-quality.ts --all");
  console.log("  npx tsx scripts/review-content-quality.ts --file path/to/article.json");
  console.log("  npx tsx scripts/review-content-quality.ts --county hertfordshire --threshold 80");
  console.log(`\nDefault threshold: ${DEFAULT_THRESHOLD}`);
  console.log("\nAvailable content:");

  const micrositeDir = path.join(DATA_DIR, "microsite-content");
  if (fs.existsSync(micrositeDir)) {
    for (const c of fs.readdirSync(micrositeDir).sort()) {
      const stat = fs.statSync(path.join(micrositeDir, c));
      if (stat.isDirectory()) {
        const files = findContentFiles(c);
        if (files.length > 0) console.log(`  ${c}: ${files.length} article(s)`);
      }
    }
  }
  process.exit(0);
}

async function main() {
  let files: ContentFile[];

  if (fileFilter) {
    const data = JSON.parse(fs.readFileSync(fileFilter, "utf-8"));
    files = [{
      path: fileFilter,
      slug: data.slug || path.basename(fileFilter, ".json"),
      title: data.title || "Unknown",
      content: data.content || data.body || "",
      category: data.category || "unknown",
      county: "",
    }];
  } else {
    files = findContentFiles(countyFilter);
  }

  if (files.length === 0) {
    console.log("No content files found.");
    process.exit(0);
  }

  console.log(`Reviewing ${files.length} article(s) (threshold: ${threshold})...\n`);

  const results: ReviewResult[] = [];
  let passed = 0;
  let flagged = 0;

  for (const file of files) {
    process.stdout.write(`  ${file.slug.slice(0, 60).padEnd(62)} `);

    try {
      const sourceData = file.county ? loadSourceData(file.county) : "";
      const result = await reviewContent(file, sourceData);
      result.flagged = result.overallScore < threshold;

      if (result.flagged) {
        flagged++;
        console.log(`FLAGGED  ${result.overallScore}/100`);
      } else {
        passed++;
        console.log(`PASS     ${result.overallScore}/100`);
      }

      // Show high-severity issues inline
      const highIssues = result.issues.filter((i) => i.severity === "high");
      for (const issue of highIssues) {
        console.log(`    ⚠ [${issue.category}] ${issue.description}`);
      }

      results.push(result);

      // Rate limit
      await new Promise((r) => setTimeout(r, 500));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`ERROR    ${msg.slice(0, 60)}`);
      results.push({
        file: file.path,
        slug: file.slug,
        title: file.title,
        overallScore: 0,
        scores: { factualAccuracy: 0, brandTone: 0, seoKeywords: 0, readability: 0, fcaCompliance: 0 },
        issues: [{ severity: "high", category: "review", description: msg }],
        summary: "Review failed",
        flagged: true,
      });
      flagged++;
    }
  }

  // Save results
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const dateStr = new Date().toISOString().split("T")[0];
  const outPath = path.join(OUTPUT_DIR, `${dateStr}-review.json`);
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf-8");

  // Summary
  console.log(`\n--- Summary ---`);
  console.log(`Reviewed: ${results.length}`);
  console.log(`Passed (≥${threshold}): ${passed}`);
  console.log(`Flagged (<${threshold}): ${flagged}`);

  if (results.length > 0) {
    const avg = Math.round(results.reduce((s, r) => s + r.overallScore, 0) / results.length);
    console.log(`Average score: ${avg}/100`);
  }

  // Score breakdown
  if (results.length > 0) {
    const cats = ["factualAccuracy", "brandTone", "seoKeywords", "readability", "fcaCompliance"] as const;
    console.log(`\nCategory averages:`);
    for (const cat of cats) {
      const avg = Math.round(results.reduce((s, r) => s + r.scores[cat], 0) / results.length);
      console.log(`  ${cat.padEnd(18)} ${avg}/100`);
    }
  }

  console.log(`\nReport: ${outPath}`);

  if (flagged > 0) {
    console.log(`\nFlagged articles need manual review before publishing.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
