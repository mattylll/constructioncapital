/**
 * Convert promoted guides into 6-scene Remotion video scripts.
 *
 * Reads guide drafts from data/generated/guide-drafts/{slug}.ts (or the
 * promoted wave file when --promoted is passed) and asks Claude to produce
 * a JSON script that mirrors the existing location-script shape so we can
 * reuse `createLocationComposition` unchanged.
 *
 * Output: remotion/data/scripts/guides/{slug}.json
 *
 * The output JSON is the visual script + narration only — Phase 5b (the
 * Fish Audio voiceover step) will fill in `timings` after generating MP3s
 * and measuring their durations.
 *
 * Usage:
 *   npx tsx scripts/generate-video-scripts-from-guides.ts                   # all drafts
 *   npx tsx scripts/generate-video-scripts-from-guides.ts --slugs a,b
 *   npx tsx scripts/generate-video-scripts-from-guides.ts --resume          # skip existing
 *   npx tsx scripts/generate-video-scripts-from-guides.ts --model opus      # default sonnet
 */

import * as fs from "fs";
import * as path from "path";
import { runClaude } from "./lib/claude";
import { checkCompliance } from "./lib/compliance";
import type { Guide } from "../src/lib/guides/types";

const ROOT = process.cwd();
const DRAFTS_DIR = path.join(ROOT, "data", "generated", "guide-drafts");
const OUT_DIR = path.join(ROOT, "remotion", "data", "scripts", "guides");

// Brand-safe placeholder hero image. Swap per-cluster later (Unsplash etc.).
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80&auto=format&fit=crop";

// ─── CLI ────────────────────────────────────────────────────────────────────

interface Args {
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
    slugs: get("--slugs")?.split(",").map((s) => s.trim()),
    resume: a.includes("--resume"),
    model: (get("--model") as Args["model"]) ?? "sonnet",
    limit: get("--limit") ? parseInt(get("--limit")!, 10) : undefined,
  };
}

// ─── Prompt ──────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You convert long-form UK property finance guides into short-form video explainer scripts.

The output is JSON — a single object, no prose, no markdown fences. The shape mirrors the existing Construction Capital location video shape so the same Remotion compositions can render it.

VOICE & TONE for narration:
- Conversational but expert. As if you're explaining to a developer over coffee.
- UK English. Read £ as "pounds", % as "percent", LTV as "L T V", GDV as "G D V".
- Each scene's narration should run 8-15 seconds when spoken at natural pace (so 25-50 words).
- Hook the viewer in the first 5 seconds.

COMPLIANCE — ABSOLUTE BANS:
- Construction Capital is NOT FCA regulated and NOT a NACFB member.
- NEVER say: "FCA", "Financial Conduct Authority", "NACFB", "regulated", "authorised", "registered intermediary".
- Permitted credentials only: "25+ years experience", "£500M+ funds arranged", "100+ lender panel", "nationwide UK coverage".

SCENE STRUCTURE (must produce all 6, in this order):

1. **title** — opening brand frame. Visual props: { brand, main, mainLine2, subtitle }.
   - brand: "CONSTRUCTION CAPITAL" (always)
   - main: 2-4 word headline derived from guide title
   - mainLine2: continuation/qualifier (e.g., "Explained", "Guide", "How It Works") — keep short
   - subtitle: cluster or context (e.g., "UK Property Finance", "Bridging Loans")
   - Voiceover: 6-15 word punchy hook line. Will be spoken slowly under the title card.

2. **hook** — what the video answers. Visual props: { line1, line2, subline, preview }.
   - line1, line2: split a single 8-12 word question across two lines on screen
   - subline: 15-25 word framing — what the developer's pain is
   - preview: short tee-up like "Here's what you need to know."
   - Voiceover: 30-50 words. The complete spoken hook — the question, the stakes, and the promise.

3. **marketOverview** — bullet list of key facts. Visual props: { badge, title, subtitle, items }.
   - badge: short uppercase label (e.g., "QUICK FACTS", "AT A GLANCE")
   - title: 3-6 word section heading
   - subtitle: 5-10 word context
   - items: array of 3-4 objects { highlight: short value or label, detail: 8-15 word explanation }
   - Voiceover: 35-50 words covering all bullets in connected prose.

4. **priceBreakdown** — 3-4 callout cards (typically numbers, ranges, or short headlines). Visual props: { badge, title, cards }.
   - badge: e.g., "TYPICAL TERMS", "RATES & LTV"
   - title: 3-6 word heading
   - cards: array of 3-4 objects { label: short value/headline, description: 6-12 word context }
   - Voiceover: 35-50 words walking through the cards.

5. **whyCC** — Construction Capital credentials block. Visual props: { title, stats, benefits }.
   - title: "Why Construction Capital?" (always)
   - stats: ARRAY of 3 objects in this exact order: [{ value: "25+", label: "Years Experience" }, { value: "100+", label: "Lender Panel" }, { value: "£500M+", label: "Funds Arranged" }]
   - benefits: 3-4 strings, each a short value-prop bullet (max 12 words). NEVER mention regulation/authorisation/FCA/NACFB.
   - Voiceover: 30-45 words. Lead with the stats, end with a benefit.

6. **cta** — call to action. Visual props: { line1, website, tagline, disclaimer }.
   - line1: question or invitation, 6-10 words (e.g., "Need bridging finance for your project?")
   - website: "constructioncapital.co.uk" (always)
   - tagline: "Expert advice. Competitive rates. Nationwide coverage." (always)
   - disclaimer: short risk warning line, neutral tone (no regulator references)
   - Voiceover: 20-30 words pushing to the website.

Return JSON in this exact shape:

{
  "guideSlug": "<slug>",
  "guideTitle": "<title>",
  "imageUrl": "<the imageUrl I will pass in your prompt>",
  "scenes": {
    "title": { ... },
    "hook": { ... },
    "marketOverview": { ... },
    "priceBreakdown": { ... },
    "whyCC": { ... },
    "cta": { ... }
  },
  "voiceover": {
    "title": "...",
    "hook": "...",
    "marketOverview": "...",
    "priceBreakdown": "...",
    "whyCC": "...",
    "cta": "..."
  }
}

Return ONLY the JSON object. No prose, no fences.`;

function buildPrompt(guide: Guide, imageUrl: string): string {
  const sectionDigest = guide.sections
    .map((s, i) => `## Section ${i + 1}: ${s.heading}\n${s.content
      .map((c) => c.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
      .filter((c) => c.length > 20)
      .join("\n\n")}`)
    .join("\n\n");
  const faqDigest = guide.faqs?.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n") ?? "";

  return `Convert this guide into a 6-scene video script.

GUIDE METADATA:
- slug: ${guide.slug}
- title: ${guide.title}
- category: ${guide.category}
- excerpt: ${guide.excerpt}
- imageUrl to use: ${imageUrl}

GUIDE BODY (HTML stripped for clarity):

${sectionDigest.slice(0, 12000)}

${faqDigest ? `FAQs FROM THE GUIDE:\n\n${faqDigest.slice(0, 4000)}` : ""}

REMEMBER:
- Output ONLY the JSON object (no prose, no fences)
- Set guideSlug to "${guide.slug}", guideTitle to "${guide.title}", imageUrl to "${imageUrl}"
- whyCC.stats must be the exact 3-item array specified in the system prompt
- whyCC.title must be "Why Construction Capital?"
- cta.website must be "constructioncapital.co.uk", cta.tagline as specified
- NO references to FCA, NACFB, regulated, authorised — anywhere.`;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

async function loadDraft(slug: string): Promise<Guide | null> {
  const file = path.join(DRAFTS_DIR, `${slug}.ts`);
  if (!fs.existsSync(file)) return null;
  const mod = await import(`${file}?v=${Date.now()}`);
  return (mod.draft ?? null) as Guide | null;
}

function tryParseJson(text: string): unknown {
  const stripped = text
    .trim()
    .replace(/^```(?:json|javascript|ts|typescript)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
  return JSON.parse(stripped);
}

interface VideoScript {
  guideSlug: string;
  guideTitle: string;
  imageUrl: string;
  scenes: {
    title: Record<string, unknown>;
    hook: Record<string, unknown>;
    marketOverview: Record<string, unknown>;
    priceBreakdown: Record<string, unknown>;
    whyCC: Record<string, unknown>;
    cta: Record<string, unknown>;
  };
  voiceover: {
    title: string;
    hook: string;
    marketOverview: string;
    priceBreakdown: string;
    whyCC: string;
    cta: string;
  };
}

const REQUIRED_SCENE_KEYS = ["title", "hook", "marketOverview", "priceBreakdown", "whyCC", "cta"] as const;

function validateScript(parsed: unknown, expectedSlug: string): { ok: true; script: VideoScript } | { ok: false; reason: string } {
  if (!parsed || typeof parsed !== "object") return { ok: false, reason: "not-an-object" };
  const s = parsed as Record<string, any>;
  if (s.guideSlug !== expectedSlug) return { ok: false, reason: `guideSlug mismatch: expected ${expectedSlug}, got ${s.guideSlug}` };
  if (!s.scenes || typeof s.scenes !== "object") return { ok: false, reason: "missing scenes object" };
  if (!s.voiceover || typeof s.voiceover !== "object") return { ok: false, reason: "missing voiceover object" };
  for (const key of REQUIRED_SCENE_KEYS) {
    if (!s.scenes[key]) return { ok: false, reason: `scenes.${key} missing` };
    if (typeof s.voiceover[key] !== "string" || s.voiceover[key].trim().length < 5)
      return { ok: false, reason: `voiceover.${key} missing or too short` };
  }
  // Spot-check the brand requirements
  if (s.scenes.cta.website !== "constructioncapital.co.uk")
    return { ok: false, reason: "cta.website must be constructioncapital.co.uk" };
  if (s.scenes.whyCC.title !== "Why Construction Capital?")
    return { ok: false, reason: "whyCC.title must be 'Why Construction Capital?'" };
  return { ok: true, script: s as VideoScript };
}

function complianceCheck(script: VideoScript): string[] {
  const offenders: string[] = [];
  for (const key of REQUIRED_SCENE_KEYS) {
    const text = JSON.stringify(script.scenes[key]) + " " + script.voiceover[key];
    const r = checkCompliance(text);
    if (!r.ok) offenders.push(`${key}: ${r.offenders.join(", ")}`);
  }
  return offenders;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  ensureDir(OUT_DIR);

  let slugs: string[];
  if (args.slugs) {
    slugs = args.slugs;
  } else {
    slugs = fs
      .readdirSync(DRAFTS_DIR)
      .filter((f) => f.endsWith(".ts") && !f.startsWith("_"))
      .map((f) => path.basename(f, ".ts"));
  }
  if (args.limit) slugs = slugs.slice(0, args.limit);

  console.log(`✓ ${slugs.length} guide drafts to convert (model: ${args.model})`);

  let written = 0;
  let skipped = 0;
  let failed = 0;

  for (const [i, slug] of slugs.entries()) {
    const tag = `[${i + 1}/${slugs.length}] ${slug}`;
    const outFile = path.join(OUT_DIR, `${slug}.json`);

    if (args.resume && fs.existsSync(outFile)) {
      console.log(`${tag} → cached`);
      skipped++;
      continue;
    }

    const guide = await loadDraft(slug);
    if (!guide) {
      console.error(`${tag} ✗ no draft at ${slug}.ts`);
      failed++;
      continue;
    }

    console.log(`${tag} ↓ Claude (${args.model})...`);
    const t0 = Date.now();
    let raw: string;
    try {
      raw = await runClaude({
        prompt: buildPrompt(guide, DEFAULT_IMAGE),
        systemPrompt: SYSTEM_PROMPT,
        model: args.model,
        timeoutMs: 240_000,
      });
    } catch (err) {
      console.error(`${tag} ✗ ${(err as Error).message}`);
      failed++;
      continue;
    }
    const dt = ((Date.now() - t0) / 1000).toFixed(1);

    let parsed: unknown;
    try {
      parsed = tryParseJson(raw);
    } catch (err) {
      console.error(`${tag} ✗ JSON parse failed (${dt}s): ${(err as Error).message}`);
      failed++;
      continue;
    }

    const validation = validateScript(parsed, slug);
    if (!validation.ok) {
      console.error(`${tag} ✗ schema invalid (${dt}s): ${validation.reason}`);
      failed++;
      continue;
    }

    const offenders = complianceCheck(validation.script);
    if (offenders.length) {
      console.error(`${tag} ✗ compliance fail (${dt}s):`);
      offenders.forEach((o) => console.error(`    - ${o}`));
      failed++;
      continue;
    }

    fs.writeFileSync(outFile, JSON.stringify(validation.script, null, 2));
    const vWords = Object.values(validation.script.voiceover).join(" ").split(/\s+/).filter(Boolean).length;
    console.log(`${tag} ✓ ${dt}s | ${vWords} voiceover words`);
    written++;
  }

  console.log(`\n────────────────────────────────────────`);
  console.log(`Written: ${written}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed:  ${failed}`);
  console.log(`────────────────────────────────────────`);
  console.log(`\nNext: run remotion/scripts/generate-voiceovers-fish.mjs`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
