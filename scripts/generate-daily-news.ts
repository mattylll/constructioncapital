/**
 * Daily news pipeline — generates one article per run.
 *
 * Run manually:
 *   npx tsx scripts/generate-daily-news.ts               # generate + publish
 *   npx tsx scripts/generate-daily-news.ts --dry-run     # fact sheet only, no Claude
 *   npx tsx scripts/generate-daily-news.ts --no-publish  # generate + save as draft
 *
 * Scheduled daily via .github/workflows/daily-news.yml (to be added).
 *
 * Pipeline:
 *   1. Fetch RSS feeds in parallel.
 *   2. Check today's scheduled releases (BoE, ONS, HMRC).
 *   3. Rank candidates, pick the strongest.
 *   4. Call Claude via local CLI (uses Matt's subscription — zero metered cost).
 *   5. Parse response, write to SQLite with is_published = 1 (or 0 for --no-publish).
 *   6. Revalidate /news so ISR picks it up.
 *
 * Matt reviews in /admin/news after the fact; nothing on the front of the
 * site is a one-way door.
 */

import fs from "fs";
import path from "path";

import {
  CANDIDATES_PER_RUN,
  RSS_SOURCES,
  SCHEDULED_RELEASES,
} from "./config/news-sources";
import { fetchFeed } from "./lib/rss";
import {
  annotateItems,
  buildFactSheet,
  type CandidateStory,
} from "./lib/fact-sheet";
import { runClaude, ClaudeError } from "./lib/claude";
import {
  createArticle,
  getAllArticles,
  type NewArticleInput,
  type NewsCategory,
} from "../src/lib/news-db";

interface CliFlags {
  dryRun: boolean;
  noPublish: boolean;
}

function parseArgs(): CliFlags {
  const argv = process.argv.slice(2);
  return {
    dryRun: argv.includes("--dry-run"),
    noPublish: argv.includes("--no-publish"),
  };
}

function runId(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `run-${stamp}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Voice samples — the three best-calibrated seed articles that act as voice
// guardrails in the Claude prompt. Pulled on startup from the DB.

function loadVoiceSamples(count = 3) {
  const all = getAllArticles();
  const legacy = all.filter((a) => a.tier === "legacy" && a.body.length > 500);
  return legacy.slice(0, count).map((a) => ({
    title: a.title,
    category: a.category,
    excerpt: a.excerpt,
    body: a.body,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Prompt assembly

function buildSystemPrompt(): string {
  return [
    "You are Matt Lenzie, founder of Construction Capital, an independent",
    "UK development finance brokerage. You write a daily news brief for",
    "UK property developers. Your voice is authoritative, data-specific,",
    "and conversational without being chummy.",
    "",
    "STRICT RULES:",
    "- 300–500 words. Do not exceed 500.",
    "- Every numeric claim must cite a source from the supplied fact sheet.",
    "  Cite by repeating the exact label in parentheses after the number.",
    "- Do NOT fabricate lender names, transaction values, or regulator",
    "  statements that aren't in the fact sheet.",
    "- Never claim Construction Capital is FCA-regulated or a NACFB member.",
    "  Property development finance is unregulated B2B lending.",
    "- No \"Dear readers\" / \"Stay tuned\" / blog clichés. Write like a broker",
    "  who read the tape this morning and has ten minutes before his next call.",
    "",
    "OUTPUT FORMAT — return valid JSON only, no markdown fences:",
    "{",
    "  \"slug\": \"kebab-case-slug\",",
    "  \"title\": \"Concise editorial headline (max 90 chars)\",",
    "  \"excerpt\": \"One-sentence 25–35 word summary for listings and meta.\",",
    "  \"body\": \"Multi-paragraph article. Paragraphs separated by blank lines. No markdown headings inside the body.\",",
    "  \"category\": \"rate-update | lender-news | market-commentary | deal-announcement | regulatory\",",
    "  \"tags\": [\"short\", \"keyword\", \"list\"]",
    "}",
  ].join("\n");
}

function buildUserPrompt(
  candidates: CandidateStory[],
  voiceSamples: ReturnType<typeof loadVoiceSamples>,
  today: Date
): string {
  const lines: string[] = [];

  lines.push(`# Today: ${today.toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push("# Voice samples (match this tone)");
  lines.push("");
  voiceSamples.forEach((s, i) => {
    lines.push(`## Sample ${i + 1}: ${s.title} (${s.category})`);
    lines.push(s.body.slice(0, 1200));
    lines.push("");
  });

  lines.push("# Candidate stories (ranked)");
  lines.push("");
  candidates.forEach((c, i) => {
    lines.push(`## Candidate ${i + 1} — score ${c.score.toFixed(2)}`);
    lines.push(`Suggested category: ${c.suggestedCategory}`);
    lines.push(`Headline angle: ${c.headline}`);
    lines.push(`Summary: ${c.summary}`);
    lines.push("Citations:");
    c.citations.forEach((cite) => lines.push(`  - "${cite.label}" — ${cite.url}`));
    lines.push("");
  });

  lines.push("# Instructions");
  lines.push(
    "Pick the single strongest candidate. Write one 300–500 word article."
  );
  lines.push(
    "If two candidates pair naturally, weave them together — but stay focused."
  );
  lines.push(
    "Include at least one data point with an explicit citation label from above."
  );

  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Main

async function main() {
  const flags = parseArgs();
  const today = new Date();
  const id = runId();

  console.log(`[daily-news] run ${id} starting (dryRun=${flags.dryRun}, noPublish=${flags.noPublish})`);

  // 1. Fetch feeds in parallel
  const feedResults = await Promise.all(
    RSS_SOURCES.map((src) => fetchFeed(src))
  );
  const items = annotateItems(feedResults.flat(), RSS_SOURCES);
  console.log(`[daily-news] pulled ${items.length} feed items from ${RSS_SOURCES.length} sources`);

  // 2. Scheduled releases for ±2 days
  const scheduledHits = SCHEDULED_RELEASES.filter((r) => {
    const diff = (new Date(r.date).getTime() - today.getTime()) / 864e5;
    return Math.abs(diff) <= 2;
  });
  if (scheduledHits.length) {
    console.log(`[daily-news] scheduled release hits: ${scheduledHits.map((r) => r.id).join(", ")}`);
  }

  // 3. Build + rank fact sheet
  const candidates = buildFactSheet({
    feedItems: items,
    scheduledHits,
    today,
    maxCandidates: CANDIDATES_PER_RUN,
  });

  if (candidates.length === 0) {
    console.warn("[daily-news] no candidates — nothing to publish today");
    return;
  }

  console.log(`[daily-news] ${candidates.length} candidates ranked. Top: "${candidates[0].headline}"`);

  // Save fact sheet for audit
  const auditDir = path.join(process.cwd(), "data", "generated", "news-runs");
  fs.mkdirSync(auditDir, { recursive: true });
  const auditPath = path.join(auditDir, `${id}.json`);
  fs.writeFileSync(
    auditPath,
    JSON.stringify({ id, today, candidates }, null, 2),
    "utf-8"
  );
  console.log(`[daily-news] fact sheet saved to ${auditPath}`);

  if (flags.dryRun) {
    console.log("[daily-news] --dry-run: skipping Claude + DB write");
    return;
  }

  // 4. Call Claude
  const voiceSamples = loadVoiceSamples();
  if (voiceSamples.length === 0) {
    console.warn("[daily-news] no legacy voice samples in DB — prompt will lack tone anchors");
  }

  let claudeText: string;
  try {
    claudeText = await runClaude({
      systemPrompt: buildSystemPrompt(),
      prompt: buildUserPrompt(candidates, voiceSamples, today),
      model: "sonnet",
      timeoutMs: 180_000,
    });
  } catch (err) {
    if (err instanceof ClaudeError) {
      console.error("[daily-news] Claude CLI failed:", err.message);
      console.error(err.stderr ?? "");
    } else {
      throw err;
    }
    process.exit(1);
  }

  // 5. Parse response
  const article = parseClaudeResponse(claudeText);
  if (!article) {
    console.error("[daily-news] could not parse JSON from Claude response. Raw output:");
    console.error(claudeText.slice(0, 2000));
    process.exit(1);
  }

  // Citations come from the chosen candidate(s). For v1, attach citations
  // from the top candidate — Claude is instructed to reference its sources
  // inline, so these are the audit trail.
  const chosen = candidates[0];

  // 6. Persist
  const input: NewArticleInput = {
    slug: `${today.toISOString().slice(0, 10)}-${article.slug}`.slice(0, 120),
    title: article.title,
    excerpt: article.excerpt,
    body: article.body,
    category: article.category as NewsCategory,
    tags: article.tags ?? [],
    tier: "daily-brief",
    generation_source: "automated",
    source_run_id: id,
    data_sources: chosen.citations.map((c) => ({
      label: c.label,
      url: c.url,
    })),
    is_published: !flags.noPublish,
    published_at: today.toISOString(),
  };

  const saved = createArticle(input);
  console.log(`[daily-news] saved article id=${saved.id}, slug=${saved.slug}, published=${saved.is_published === 1}`);
}

interface ParsedArticle {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags?: string[];
}

function parseClaudeResponse(text: string): ParsedArticle | null {
  let body = text.trim();
  // Strip markdown code fences if present
  body = body.replace(/^```(?:json)?\n/, "").replace(/\n```$/, "");

  // Find the first { ... } block
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    const obj = JSON.parse(body.slice(start, end + 1));
    if (
      typeof obj.slug === "string" &&
      typeof obj.title === "string" &&
      typeof obj.excerpt === "string" &&
      typeof obj.body === "string" &&
      typeof obj.category === "string"
    ) {
      return obj as ParsedArticle;
    }
  } catch {
    return null;
  }
  return null;
}

main().catch((err) => {
  console.error("[daily-news] fatal:", err);
  process.exit(1);
});
