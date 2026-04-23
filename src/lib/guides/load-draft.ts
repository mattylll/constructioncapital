/**
 * Server-only helper to load a guide draft from `data/generated/guide-drafts/`.
 * The drafts are TypeScript files of the form:
 *
 *   import type { Guide } from "@/lib/guides/types";
 *   export const draft: Guide = { …json… };
 *
 * We don't want to invoke a TS loader from the Next.js route, so we parse
 * the object literal out of the source text and JSON.parse it. The drafter
 * writes drafts via JSON.stringify so the body is always valid JSON.
 */

// Server-only helper (relies on `fs`). Called from Next.js server components
// only — not exported through any client-component bundle.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Guide } from "./types";

const DRAFTS_DIR = join(process.cwd(), "data", "generated", "guide-drafts");

export function listDraftSlugs(): string[] {
  if (!existsSync(DRAFTS_DIR)) return [];
  
return readdirSync(DRAFTS_DIR)
    .filter((f) => f.endsWith(".ts") && !f.startsWith("_"))
    .map((f) => f.replace(/\.ts$/, ""))
    .sort();
}

export function loadGuideDraft(slug: string): Guide | null {
  const path = join(DRAFTS_DIR, `${slug}.ts`);
  if (!existsSync(path)) return null;
  const src = readFileSync(path, "utf8");

  // Extract the object literal. The drafter writes:
  //   export const draft: Guide = { ... };\n
  const match = src.match(/export\s+const\s+draft\s*:\s*Guide\s*=\s*(\{[\s\S]*\})\s*;\s*$/m);
  if (!match) return null;

  try {
    return JSON.parse(match[1]) as Guide;
  } catch {
    return null;
  }
}
