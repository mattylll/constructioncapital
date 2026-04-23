/**
 * Render guide drafts as human-readable Markdown so you can review them
 * before promoting. Writes .md alongside the .ts in a _readable/ subdir,
 * and also prints the requested draft to stdout for quick terminal review.
 *
 * Usage:
 *   npx tsx scripts/preview-guide-drafts.ts                    # convert all to _readable/
 *   npx tsx scripts/preview-guide-drafts.ts --slug <slug>      # print one to stdout
 *   npx tsx scripts/preview-guide-drafts.ts --open             # same as default then `open` the folder (macOS)
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import type { Guide } from "../src/lib/guides/types";

const ROOT = process.cwd();
const DRAFTS_DIR = path.join(ROOT, "data", "generated", "guide-drafts");
const OUT_DIR = path.join(DRAFTS_DIR, "_readable");

function parseArgs() {
  const a = process.argv.slice(2);
  const get = (k: string) => {
    const i = a.indexOf(k);
    return i >= 0 ? a[i + 1] : undefined;
  };
  return { slug: get("--slug"), open: a.includes("--open") };
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/(h[1-6]|div|section|article|li|tr|td|th)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&pound;/g, "£")
    .replace(/&amp;/g, "&")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function isHtmlBlock(s: string): boolean {
  const t = s.trimStart();
  return t.startsWith("<table") || t.startsWith("<div") || t.startsWith("<ul") || t.startsWith("<ol");
}

function renderAsMarkdown(g: Guide): string {
  const wc = g.sections
    .flatMap((s) => s.content)
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const lines: string[] = [];
  lines.push(`# ${g.title}`);
  lines.push("");
  lines.push(`> ${g.excerpt}`);
  lines.push("");
  lines.push(`**Slug:** \`${g.slug}\``);
  lines.push(`**Category:** ${g.category}`);
  lines.push(`**Reading time:** ${g.readingTime}   **Word count:** ${wc.toLocaleString()}`);
  lines.push(`**Meta title:** ${g.metaTitle}   (${g.metaTitle.length} chars)`);
  lines.push(`**Meta description:** ${g.metaDescription}   (${g.metaDescription.length} chars)`);
  lines.push(`**Related services:** ${g.relatedServices.join(", ") || "—"}`);
  lines.push(`**Related slugs:** ${g.relatedSlugs.join(", ") || "—"}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const s of g.sections) {
    lines.push(`## ${s.heading}`);
    lines.push("");
    for (const c of s.content) {
      if (isHtmlBlock(c)) {
        // Render HTML block as plain text with a leading marker
        lines.push("_[inline HTML block — rendered as plain text below]_");
        lines.push("");
        lines.push("```");
        lines.push(stripHtml(c));
        lines.push("```");
        lines.push("");
      } else {
        lines.push(stripHtml(c));
        lines.push("");
      }
    }
  }

  if (g.faqs && g.faqs.length) {
    lines.push("---");
    lines.push("");
    lines.push("## FAQs");
    lines.push("");
    for (const f of g.faqs) {
      lines.push(`**Q: ${f.question}**`);
      lines.push("");
      lines.push(stripHtml(f.answer));
      lines.push("");
    }
  }

  return lines.join("\n");
}

async function loadDraft(file: string): Promise<Guide | null> {
  const mod = await import(`${file}?v=${Date.now()}`);
  return (mod.draft ?? null) as Guide | null;
}

async function main() {
  const args = parseArgs();

  if (!fs.existsSync(DRAFTS_DIR)) {
    console.error(`No drafts at ${DRAFTS_DIR}`);
    process.exit(1);
  }

  // Single-slug mode: print to stdout
  if (args.slug) {
    const file = path.join(DRAFTS_DIR, `${args.slug}.ts`);
    if (!fs.existsSync(file)) {
      console.error(`Not found: ${file}`);
      process.exit(1);
    }
    const draft = await loadDraft(file);
    if (!draft) {
      console.error(`No draft export in ${file}`);
      process.exit(1);
    }
    process.stdout.write(renderAsMarkdown(draft));
    return;
  }

  // Batch mode: write all to _readable/
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const draftFiles = fs
    .readdirSync(DRAFTS_DIR)
    .filter((f) => f.endsWith(".ts") && !f.startsWith("_"));
  console.log(`Converting ${draftFiles.length} draft(s)…`);
  for (const f of draftFiles) {
    const draft = await loadDraft(path.join(DRAFTS_DIR, f));
    if (!draft) {
      console.log(`  ✗ ${f} — no draft export`);
      continue;
    }
    const outFile = path.join(OUT_DIR, f.replace(/\.ts$/, ".md"));
    fs.writeFileSync(outFile, renderAsMarkdown(draft));
    console.log(`  ✓ ${path.relative(ROOT, outFile)}`);
  }
  console.log(`\n${draftFiles.length} file(s) written to ${path.relative(ROOT, OUT_DIR)}/`);

  if (args.open) {
    try {
      execSync(`open "${OUT_DIR}"`, { stdio: "ignore" });
    } catch {
      // noop — --open is macOS-only
    }
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
