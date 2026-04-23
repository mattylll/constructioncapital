/**
 * Context-aware compliance checker for Construction Capital content.
 *
 * The rule (per memory/feedback_regulatory_claims.md): Construction Capital
 * is NOT FCA regulated and NOT a NACFB member. We must never claim either,
 * directly or implicitly.
 *
 * But the English word "regulated" has legitimate product-category uses —
 * "regulated bridging loan" is FCA industry shorthand for consumer bridging
 * secured on an owner-occupied home. A blanket ban on the word rejects
 * technically-accurate guides about standard industry terminology.
 *
 * This checker therefore flags two tiers:
 *   - ABSOLUTE: standalone regulator mentions (FCA, NACFB, FCA-numbered etc.)
 *   - CONTEXTUAL: only when "regulated"/"authorised" is attached to us
 *                 ("we are regulated", "authorised by the FCA", "our FCA licence")
 */

export interface ComplianceResult {
  ok: boolean;
  offenders: string[];
}

const ABSOLUTE_PATTERNS: RegExp[] = [
  /\bFCA\b/,
  /\bNACFB\b/,
  /\bFinancial Conduct Authority\b/i,
  /\bregistered intermediary\b/i,
  /\bPrudential Regulation Authority\b/i,
  /\bFRN[-\s]?\d+/i, // FCA firm reference numbers
];

const CONTEXTUAL_PATTERNS: RegExp[] = [
  // "we/our/us/Construction Capital are regulated/authorised"
  /\b(we|our|us|Construction Capital|the\s+(?:broker|brokerage|firm|company|intermediary))\s+(?:is|are|am|being)\s+(?:fully\s+|formally\s+|currently\s+|now\s+|proudly\s+|FCA[-\s]?)?(?:regulated|authorised)\b/i,
  // "regulated/authorised by/under the FCA/PRA/Financial …"
  /\b(?:authorised|regulated)\s+(?:and\s+(?:regulated|authorised)\s+)?(?:by|under)\s+(?:the\s+)?(?:FCA|Financial|PRA|Prudential|UK\s+regulator)/i,
  // "our/my/Construction Capital's FCA authorisation / regulation / licence"
  /\b(our|my|Construction Capital'?s?)\s+(?:FCA\s+)?(?:authorisation|regulation|licence|license|FRN|firm reference)/i,
  // "as an (FCA-)regulated/authorised broker/firm"
  /\bas\s+an?\s+(?:FCA[-\s]?)?(?:regulated|authorised)\s+(?:broker|firm|brokerage|intermediary|mortgage\s+broker|adviser|company)\b/i,
];

export function checkCompliance(text: string): ComplianceResult {
  const offenders: string[] = [];
  for (const re of ABSOLUTE_PATTERNS) {
    const m = text.match(re);
    if (m) offenders.push(`absolute: "${m[0]}"`);
  }
  for (const re of CONTEXTUAL_PATTERNS) {
    const m = text.match(re);
    if (m) offenders.push(`claim: "${m[0]}"`);
  }
  return { ok: offenders.length === 0, offenders };
}

/** Check many fields at once, returning per-field offenders. */
export function checkComplianceFields(
  fields: Array<{ label: string; text: string }>,
): ComplianceResult {
  const offenders: string[] = [];
  for (const f of fields) {
    const r = checkCompliance(f.text);
    if (!r.ok) {
      for (const o of r.offenders) offenders.push(`${f.label} → ${o}`);
    }
  }
  return { ok: offenders.length === 0, offenders };
}
