/**
 * Convert Title Case H2 headings in content-gap-wave-1.ts to sentence case
 * to match the style of the top-performing originals (market.ts,
 * valuations.ts, hidden-fees.ts).
 *
 * Preserves:
 *   - Acronyms (LTV, GDV, RICS, HMRC, SDLT, VAT, CGT, BMV, BADR, MDR, ATED,
 *     JCT, SPV, TOGC, MPC, SONIA, SOFR, EBITDA, EPC, HMO, BTL, UK, US, EU,
 *     CIL, NACFB, NPV, IRR, LTGDV, AVM, DiP, AIP)
 *   - Numerics and percentages at the start ("100% commercial mortgage…")
 *   - "Step-by-Step" → "Step-by-step"
 *   - First word always capitalised
 *   - Proper nouns we use: Section 106, Bank of England, Construction Capital,
 *     Spring Budget, Autumn Budget, Section, Stamp Duty, Capital Gains Tax,
 *     Multiple Dwellings Relief, Companies House, Land Registry, HM Treasury
 *
 * Usage: npx tsx scripts/normalize-guide-headings.ts [--write]
 */

import * as fs from "fs";
import * as path from "path";

const KEEP_UPPER = new Set([
  "LTV", "GDV", "RICS", "HMRC", "SDLT", "VAT", "CGT", "BMV", "BADR",
  "MDR", "ATED", "JCT", "SPV", "TOGC", "MPC", "SONIA", "SOFR", "EBITDA",
  "EPC", "HMO", "BTL", "UK", "US", "EU", "CIL", "NACFB", "NPV", "IRR",
  "LTGDV", "AVM", "DiP", "AIP", "Q1", "Q2", "Q3", "Q4", "B2B", "B2C",
  "PRA", "FCA", "FSA", "GBP", "USD", "EUR", "ICR", "DSCR", "LTC",
  "PG", "ID", "AML", "KYC", "TIO", "TLO", "PMV",
]);

// Multi-word phrases that should keep their internal capitalisation.
// Listed lowercase here for the match; the replacement is the preserved form.
const KEEP_PHRASES: Array<[RegExp, string]> = [
  [/\bsection 106\b/gi, "Section 106"],
  [/\bbank of england\b/gi, "Bank of England"],
  [/\bconstruction capital\b/gi, "Construction Capital"],
  [/\bspring budget\b/gi, "Spring Budget"],
  [/\bautumn budget\b/gi, "Autumn Budget"],
  [/\bstamp duty\b/gi, "Stamp Duty"],
  [/\bcapital gains tax\b/gi, "Capital Gains Tax"],
  [/\bmultiple dwellings relief\b/gi, "Multiple Dwellings Relief"],
  [/\bcompanies house\b/gi, "Companies House"],
  [/\bland registry\b/gi, "Land Registry"],
  [/\bhm treasury\b/gi, "HM Treasury"],
  [/\bhm revenue\b/gi, "HM Revenue"],
  [/\bbusiness asset disposal relief\b/gi, "Business Asset Disposal Relief"],
  [/\bred book\b/gi, "Red Book"],
  [/\bdiy\b/gi, "DIY"],
];

function toSentenceCase(heading: string): string {
  // Strategy: split on whitespace; lowercase each token except acronyms;
  // re-uppercase first letter of first token; then re-apply protected phrases.

  // Tokenise, preserving punctuation attached to words.
  const tokens = heading.split(/(\s+)/);
  const out = tokens.map((tok, idx) => {
    if (/^\s+$/.test(tok)) return tok;

    // Strip leading/trailing punctuation for the comparison
    const m = tok.match(/^([^\w%]*)([\w%/']+(?:[-/'][\w%]+)*)?(.*)$/);
    if (!m) return tok;
    const [, lead, core = "", trail] = m;

    if (!core) return tok;

    // Preserve known acronyms (case-insensitive match)
    if (KEEP_UPPER.has(core.toUpperCase())) {
      return lead + core.toUpperCase() + trail;
    }

    // Starts with a digit (e.g. "100%", "5%", "180-day") → leave as-is
    if (/^\d/.test(core)) {
      return tok;
    }

    // For all other tokens, lowercase
    return lead + core.toLowerCase() + trail;
  });

  let result = out.join("");

  // Apply protected phrases (case-insensitive → canonical form)
  for (const [re, rep] of KEEP_PHRASES) {
    result = result.replace(re, rep);
  }

  // Capitalise the first character of the heading (first letter only)
  result = result.replace(/^([^\w]*)([a-z])/, (_m, lead, ch) => lead + ch.toUpperCase());

  // Re-capitalise the first letter after a sentence terminator (? or .)
  // so multi-sentence headings (e.g. "What is X? A quick refresher") read
  // correctly. We deliberately do NOT capitalise after ":" — sentence case
  // convention keeps lowercase after a colon as a continuation.
  result = result.replace(/([?.])\s+([a-z])/g, (_m, p, ch: string) => `${p} ${ch.toUpperCase()}`);

  return result;
}

// ─── Main ──────────────────────────────────────────────────────────────────

const filePath = path.join(process.cwd(), process.argv[2] && !process.argv[2].startsWith("--")
  ? process.argv[2]
  : "src/lib/guides/content-gap-wave-1.ts");
const original = fs.readFileSync(filePath, "utf-8");

// Match both JSON-style ("heading":) and TS-style (heading:) heading keys
const HEADING_RE = /(["']?)heading\1:\s*"([^"]+)"/g;

const changes: Array<{ before: string; after: string }> = [];
const transformed = original.replace(HEADING_RE, (_m, quote: string, heading: string) => {
  const next = toSentenceCase(heading);
  if (next !== heading) {
    changes.push({ before: heading, after: next });
  }
  return `${quote}heading${quote}: "${next}"`;
});

console.log(`Headings changed: ${changes.length}\n`);
for (const c of changes.slice(0, 25)) {
  console.log(`  - ${c.before}`);
  console.log(`  + ${c.after}\n`);
}
if (changes.length > 25) {
  console.log(`  …and ${changes.length - 25} more.\n`);
}

const write = process.argv.includes("--write");
if (write) {
  fs.writeFileSync(filePath, transformed, "utf-8");
  console.log(`Wrote ${filePath}`);
} else {
  console.log(`Dry run — pass --write to apply.`);
}
