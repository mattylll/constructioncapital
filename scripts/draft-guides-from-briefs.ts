/**
 * Draft guides from NeuronWriter-style SERP briefs using Claude (subscription).
 *
 * For each entry in the shortlist:
 *  1. Read the SERP brief at data/generated/serp-analysis/reports/{slug}.md
 *  2. Build a Claude prompt with the brief + compliance guardrails + Guide schema
 *  3. Call Claude (opus) via the subscription helper, expecting JSON output
 *  4. Validate the response against the Guide schema (light runtime check)
 *  5. Run the compliance grep — banned terms quarantine the draft to _rejected/
 *  6. Write a TypeScript file: data/generated/guide-drafts/{slug}.ts
 *
 * Usage:
 *   npx tsx scripts/draft-guides-from-briefs.ts                 # all wave 1
 *   npx tsx scripts/draft-guides-from-briefs.ts --wave 2
 *   npx tsx scripts/draft-guides-from-briefs.ts --slugs slug1,slug2
 *   npx tsx scripts/draft-guides-from-briefs.ts --resume        # skip drafts that already exist
 *   npx tsx scripts/draft-guides-from-briefs.ts --model sonnet  # cheaper/faster (testing)
 */

import * as fs from "fs";
import * as path from "path";
import { runClaude } from "./lib/claude";
import { checkComplianceFields } from "./lib/compliance";
import { GUIDES } from "../src/lib/guides/index";
import { SERVICES } from "../src/lib/services";
import type { GuideCategory } from "../src/lib/guides/types";

const ROOT = process.cwd();
const SHORTLIST_DIR = path.join(ROOT, "data", "generated", "serp-analysis");
const REPORTS_DIR = path.join(SHORTLIST_DIR, "reports");
const DRAFTS_DIR = path.join(ROOT, "data", "generated", "guide-drafts");
const REJECTED_DIR = path.join(DRAFTS_DIR, "_rejected");

const TODAY = new Date().toISOString().slice(0, 10);

// ─── CLI ─────────────────────────────────────────────────────────────────────

interface Args {
  wave: number;
  slugs?: string[];
  resume: boolean;
  model: "opus" | "sonnet" | "haiku";
  limit?: number;
}

function parseArgs(): Args {
  const a = process.argv.slice(2);
  const get = (k: string): string | undefined => {
    const i = a.indexOf(k);
    return i >= 0 ? a[i + 1] : undefined;
  };
  return {
    wave: parseInt(get("--wave") ?? "1", 10),
    slugs: get("--slugs")?.split(",").map((s) => s.trim()),
    resume: a.includes("--resume"),
    model: (get("--model") as Args["model"]) ?? "opus",
    limit: get("--limit") ? parseInt(get("--limit")!, 10) : undefined,
  };
}

// ─── Types matching shortlist ───────────────────────────────────────────────

interface ShortlistEntry {
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  cluster: string;
  suggestedCategory: GuideCategory;
  suggestedRelatedServices: string[];
  searchVolume: number;
  totalSecondaryVolume: number;
  keywordDifficulty: number | null;
  intent: string | null;
  opportunityScore: number;
  competitorsRanking: number;
  topCompetitor: { domain: string; position: number; url: string } | null;
}

// ─── Prompt construction ────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You write production-quality SEO guides for Construction Capital, a UK property development finance brokerage. Your audience is UK property developers seeking funding for ground-up builds, conversions, refurbishments, bridging loans, and commercial mortgages.

OUTPUT FORMAT (CRITICAL):
You will return a single JSON object — no prose, no markdown fences, no code blocks. Just the JSON. The object must conform exactly to the Guide schema described in the user prompt.

VOICE & TONE:
- UK English spelling (organise, colour, behaviour, programme, valuation)
- Factual, expert, no marketing puffery
- Speak to a developer who knows the basics but wants depth
- Use £ for money, p.a. for annual, p.m. for monthly, % for percentages
- Cite typical market figures (rates, LTVs, terms) — these are general industry knowledge, not endorsements

COMPLIANCE — ABSOLUTE BANS (DO NOT BREACH):
- Construction Capital is NOT FCA regulated and NOT a NACFB member.
- NEVER mention "FCA", "Financial Conduct Authority", "NACFB", "registered intermediary", "PRA", "Prudential Regulation Authority", or any FCA firm reference number (FRN-xxxx). Refer to consumer protections generically ("consumer credit rules apply", "affordability checks are required") without naming the regulator.
- NEVER claim Construction Capital itself is regulated, authorised, licensed, or a member of any regulatory body. Do not write "we are regulated", "our authorisation", "as a regulated broker", "authorised by…", or similar.
- The words "regulated" and "authorised" as NEUTRAL ADJECTIVES describing a product class ARE allowed when the surrounding text makes clear you're describing the industry product category (e.g. "a regulated bridging loan is secured on the borrower's own home", "the regulated vs unregulated distinction"). They must NEVER describe Construction Capital.
- Permitted Construction Capital credentials ONLY: "25+ years experience", "£500M+ funds arranged", "100+ lender panel", "nationwide UK coverage".
- Any factual market claim must be the kind of statement that could be sourced (Land Registry, ONS, gov.uk, public lender rate cards). If you can't ground it factually, omit it.

CONTENT QUALITY MANDATES:
- 4 to 6 sections, each with a clear H2 (the "heading" field)
- Each section's "content" is an ARRAY OF STRINGS — each string is either:
  (a) a plain paragraph (no surrounding tags)
  (b) a single inline-HTML block (a <table>, <div>, <ul>, <ol>) for structured info
- Include at least one HTML comparison table OR one expert-insight callout box (use the class strings shown in the example)
- Cover every PAA question from the brief inside the body OR FAQs
- Mention the lenders, products, metrics that appear on multiple top-ranking pages
- Use internal links naturally: <a href="/services/{slug}">service name</a>, <a href="/guides/{slug}">guide title</a>
- Word count target: at least 1500 words across all section content combined

FAQ MANDATES:
- 4 to 6 FAQs, each derived from a PAA question or common search refinement
- Question: phrased exactly as a user would type
- Answer: 2-4 sentences, factual, no fluff

EXEMPLAR HTML BLOCKS (use these class strings verbatim):

Expert insight callout:
<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">Based on our experience arranging over &pound;500M in property finance, …</p></div>

Comparison table:
<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Option A</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Rate</td><td class="py-2 px-3 border-b">…</td></tr></tbody></table>

You will be evaluated on: structural conformance to the schema, depth and accuracy of the content, coverage of PAA questions, and zero-tolerance compliance with the banned-term list.`;

function buildUserPrompt(entry: ShortlistEntry, brief: string, suggestedRelatedSlugs: string[]): string {
  const allowedCategories: GuideCategory[] = [
    "development-finance", "bridging", "mezzanine", "equity", "refurbishment",
    "commercial", "general", "hidden-fees", "defaults", "valuations", "legal",
    "application", "structuring", "market", "comparison",
  ];
  const allowedServices = SERVICES.map((s) => s.slug);

  return `Write a guide for the keyword: **"${entry.primaryKeyword}"** ${entry.secondaryKeywords.length ? `(also covering: ${entry.secondaryKeywords.join(", ")})` : ""}

Cluster: ${entry.cluster}
Search intent: ${entry.intent ?? "informational"}
Search volume (UK): ${entry.searchVolume}/mo  |  KD: ${entry.keywordDifficulty ?? "—"}

The slug for this guide MUST be: \`${entry.slug}\`
Suggested category: \`${entry.suggestedCategory}\` (must be one of: ${allowedCategories.join(", ")})
Suggested relatedServices: ${JSON.stringify(entry.suggestedRelatedServices)}  (must each be one of: ${allowedServices.join(", ")})

For relatedSlugs, pick 3-4 from this list of existing guides most relevant to the topic:
${suggestedRelatedSlugs.map((s) => `  - ${s}`).join("\n")}

────────────────────────────────────────
NEURONWRITER BRIEF (top-10 SERP analysis from DataForSEO):
────────────────────────────────────────

${brief.slice(0, 18000)}

────────────────────────────────────────
RETURN A SINGLE JSON OBJECT — NO PROSE, NO MARKDOWN FENCES — matching this schema exactly:
────────────────────────────────────────

{
  "slug": "${entry.slug}",
  "title": "string — H1 of the guide, includes the primary keyword naturally, max 70 chars",
  "metaTitle": "string — SEO title for <head>, max 60 chars, includes primary keyword",
  "metaDescription": "string — SEO description, 150-158 chars, includes primary keyword + benefit",
  "excerpt": "string — 1-2 sentence summary shown above the article body",
  "category": "${entry.suggestedCategory}",
  "readingTime": "X min read",
  "datePublished": "${TODAY}",
  "dateModified": "${TODAY}",
  "sections": [
    {
      "heading": "H2 string",
      "content": [
        "paragraph string",
        "paragraph string with internal <a href=\\"/services/...\\">link</a>",
        "<table class=\\"...\\">…</table>"
      ]
    }
    // 4-6 sections total
  ],
  "relatedSlugs": ["existing-slug-1", "existing-slug-2", "existing-slug-3"],
  "relatedServices": ${JSON.stringify(entry.suggestedRelatedServices)},
  "relatedLocations": [],
  "faqs": [
    { "question": "string?", "answer": "string" }
    // 4-6 FAQs
  ]
}

REMEMBER: NO "FCA", "NACFB", "regulated", "authorised", or any regulatory claim. Only the four permitted credentials. UK English. Return ONLY the JSON object.`;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function readShortlist(wave: number): ShortlistEntry[] {
  const file = path.join(SHORTLIST_DIR, `content-gap-shortlist-wave-${wave}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Shortlist not found: ${file}. Run pick-content-gap-shortlist.ts first.`);
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as { entries: ShortlistEntry[] };
  return data.entries;
}

function readBrief(slug: string): string | null {
  // The shortlist's slug differs from the SERP-report slug because Phase 1
  // applies collision suffixes. The brief is keyed by the slugified primary
  // keyword (analyze-serp.ts uses the same kebab-case rule on the keyword).
  const briefPath = path.join(REPORTS_DIR, `${slug}.md`);
  if (fs.existsSync(briefPath)) return fs.readFileSync(briefPath, "utf8");
  return null;
}

function pickRelatedSlugs(entry: ShortlistEntry): string[] {
  // Suggest 6 candidates from existing GUIDES, prioritising same category
  // then same cluster keywords. The LLM will pick the 3-4 best fits.
  const sameCategory = GUIDES.filter((g) => g.category === entry.suggestedCategory);
  const others = GUIDES.filter((g) => g.category !== entry.suggestedCategory);
  return [...sameCategory.slice(0, 4), ...others.slice(0, 4)].map((g) => g.slug);
}

function tryParseJson(text: string): unknown {
  // Strip code fences if Claude added them despite instructions
  const stripped = text
    .trim()
    .replace(/^```(?:json|javascript|ts|typescript)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
  return JSON.parse(stripped);
}

interface ValidatedGuide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  readingTime: string;
  datePublished: string;
  dateModified: string;
  sections: Array<{ heading: string; content: string[] }>;
  relatedSlugs: string[];
  relatedServices: string[];
  relatedLocations: string[];
  faqs?: Array<{ question: string; answer: string }>;
}

function validateGuide(parsed: unknown, expectedSlug: string): { ok: true; guide: ValidatedGuide } | { ok: false; reason: string } {
  if (!parsed || typeof parsed !== "object") return { ok: false, reason: "not-an-object" };
  const g = parsed as Record<string, any>;
  const required = ["slug", "title", "metaTitle", "metaDescription", "excerpt", "category", "sections", "relatedSlugs", "relatedServices", "relatedLocations"];
  for (const k of required) {
    if (!(k in g)) return { ok: false, reason: `missing field: ${k}` };
  }
  if (g.slug !== expectedSlug) return { ok: false, reason: `slug mismatch: expected ${expectedSlug}, got ${g.slug}` };
  if (!Array.isArray(g.sections) || g.sections.length < 3) return { ok: false, reason: `sections must be array of ≥3, got ${g.sections?.length}` };
  for (const [i, s] of g.sections.entries()) {
    if (!s.heading || typeof s.heading !== "string") return { ok: false, reason: `section[${i}].heading missing` };
    if (!Array.isArray(s.content) || !s.content.every((x: any) => typeof x === "string"))
      return { ok: false, reason: `section[${i}].content must be string[]` };
  }
  // Defaults for optional / missing
  if (!g.readingTime) g.readingTime = estimateReadingTime(g.sections);
  if (!g.datePublished) g.datePublished = TODAY;
  if (!g.dateModified) g.dateModified = TODAY;
  return { ok: true, guide: g as ValidatedGuide };
}

function estimateReadingTime(sections: Array<{ content: string[] }>): string {
  const words = sections.flatMap((s) => s.content).join(" ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(3, Math.round(words / 200))} min read`;
}

function complianceCheck(guide: ValidatedGuide): { ok: boolean; offenders: string[] } {
  const fields: Array<{ label: string; text: string }> = [
    { label: "title", text: guide.title },
    { label: "metaTitle", text: guide.metaTitle },
    { label: "metaDescription", text: guide.metaDescription },
    { label: "excerpt", text: guide.excerpt },
  ];
  for (const s of guide.sections) {
    fields.push({ label: `section:${s.heading}`, text: s.heading });
    s.content.forEach((c, i) => fields.push({ label: `section:${s.heading}[${i}]`, text: c }));
  }
  guide.faqs?.forEach((f, i) => {
    fields.push({ label: `faq[${i}].q`, text: f.question });
    fields.push({ label: `faq[${i}].a`, text: f.answer });
  });
  return checkComplianceFields(fields);
}

function emitTsFile(guide: ValidatedGuide): string {
  // JSON.stringify produces double-quoted strings; valid TS object literal
  const body = JSON.stringify(guide, null, 2);
  return `import type { Guide } from "@/lib/guides/types";\n\nexport const draft: Guide = ${body};\n`;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  ensureDir(DRAFTS_DIR);
  ensureDir(REJECTED_DIR);

  let entries = readShortlist(args.wave);
  if (args.slugs) entries = entries.filter((e) => args.slugs!.includes(e.slug));
  if (args.limit) entries = entries.slice(0, args.limit);

  console.log(`✓ Loaded ${entries.length} shortlist entries (wave ${args.wave}, model ${args.model})`);

  let drafted = 0;
  let skipped = 0;
  let rejected = 0;
  let failed = 0;

  for (const [i, entry] of entries.entries()) {
    const tag = `[${i + 1}/${entries.length}] ${entry.slug}`;
    const outPath = path.join(DRAFTS_DIR, `${entry.slug}.ts`);

    if (args.resume && fs.existsSync(outPath)) {
      console.log(`${tag} → cached, skipping`);
      skipped++;
      continue;
    }

    const brief = readBrief(entry.slug);
    if (!brief) {
      console.error(`${tag} ✗ no brief at reports/${entry.slug}.md — run analyze-serp first`);
      failed++;
      continue;
    }

    const relatedSuggestions = pickRelatedSlugs(entry);
    const userPrompt = buildUserPrompt(entry, brief, relatedSuggestions);

    console.log(`${tag} ↓ Claude draft (model: ${args.model})...`);
    const t0 = Date.now();
    let raw: string;
    try {
      raw = await runClaude({
        prompt: userPrompt,
        systemPrompt: SYSTEM_PROMPT,
        model: args.model,
        timeoutMs: 480_000,
      });
    } catch (err) {
      console.error(`${tag} ✗ Claude error: ${(err as Error).message}`);
      failed++;
      continue;
    }
    const dt = ((Date.now() - t0) / 1000).toFixed(1);

    let parsed: unknown;
    try {
      parsed = tryParseJson(raw);
    } catch (err) {
      console.error(`${tag} ✗ JSON parse failed (${dt}s): ${(err as Error).message}`);
      // Save raw for debugging
      fs.writeFileSync(path.join(REJECTED_DIR, `${entry.slug}.raw.txt`), raw);
      failed++;
      continue;
    }

    const validation = validateGuide(parsed, entry.slug);
    if (!validation.ok) {
      console.error(`${tag} ✗ schema invalid (${dt}s): ${validation.reason}`);
      fs.writeFileSync(path.join(REJECTED_DIR, `${entry.slug}.invalid.json`), JSON.stringify(parsed, null, 2));
      failed++;
      continue;
    }

    const compliance = complianceCheck(validation.guide);
    if (!compliance.ok) {
      console.error(`${tag} ✗ compliance fail (${dt}s):`);
      compliance.offenders.forEach((o) => console.error(`    - ${o}`));
      fs.writeFileSync(
        path.join(REJECTED_DIR, `${entry.slug}.compliance.ts`),
        emitTsFile(validation.guide),
      );
      rejected++;
      continue;
    }

    fs.writeFileSync(outPath, emitTsFile(validation.guide));
    const wc = validation.guide.sections.flatMap((s) => s.content).join(" ").split(/\s+/).filter(Boolean).length;
    console.log(`${tag} ✓ ${dt}s | ${validation.guide.sections.length} sections | ${wc} words | ${validation.guide.faqs?.length ?? 0} FAQs`);
    drafted++;
  }

  console.log(`\n────────────────────────────────────────`);
  console.log(`Drafted:  ${drafted}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Rejected: ${rejected} (compliance — see ${path.relative(ROOT, REJECTED_DIR)})`);
  console.log(`Failed:   ${failed} (parse/schema/Claude — see ${path.relative(ROOT, REJECTED_DIR)})`);
  console.log(`────────────────────────────────────────`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
