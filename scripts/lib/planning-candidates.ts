/**
 * Approved-planning candidate selection.
 *
 * Reads every data/generated/planning/{county}/{town}/latest.json, keeps the
 * approved applications that look like finance targets (units or GDV above
 * threshold), infers missing unit counts and GDV from the proposal text and
 * local sold-price medians, and classifies the consent stage.
 *
 * Shared by the weekly outreach pipeline. Mirrors the inference rules in
 * generate-weekly-planning-outreach.ts (which cannot be imported because it
 * runs on load).
 */

import * as fs from "fs";
import * as path from "path";

import { buildCapitalStack, type CapitalStack } from "./capital-stack";

export interface PlanningApplication {
  reference: string;
  address: string;
  postcode: string;
  ward: string;
  proposal: string;
  category: string;
  units: number | null;
  estimatedGdv: number | null;
  status: string;
  decision: string;
  receivedDate: string;
  decisionDate: string;
  applicantName: string;
  applicantCompany: string;
  agentName: string;
  agentCompany: string;
  sourceUrl: string;
}

export interface PlanningFile {
  updatedAt: string;
  townSlug: string;
  countySlug: string;
  localAuthority: string;
  approvedApplications: PlanningApplication[];
  pendingApplications?: PlanningApplication[];
}

export type ConsentStage =
  | "primary_consent"
  | "reserved_matters"
  | "outline"
  | "condition_discharge"
  | "variation"
  | "non_material_amendment";

/** Lower = contacted first. Discharge of conditions is pre-commencement, so it ranks high. */
export const STAGE_PRIORITY: Record<ConsentStage, number> = {
  primary_consent: 0,
  reserved_matters: 1,
  condition_discharge: 2,
  variation: 3,
  outline: 4,
  non_material_amendment: 5,
};

export const STAGE_LABEL: Record<ConsentStage, string> = {
  primary_consent: "full planning consent",
  reserved_matters: "reserved matters approval",
  condition_discharge: "discharge of conditions",
  variation: "variation of condition",
  outline: "outline consent",
  non_material_amendment: "non-material amendment",
};

export type SchemeType = "flats" | "houses" | "mixed" | "unknown";

export interface Comparable {
  address: string;
  postcode: string;
  price: number;
  date: string;
  propertyType: string;
  newBuild: boolean;
}

export interface SoldSnapshot {
  medianPrice: number;
  medianByType: Record<string, number>;
  transactionCount12m: number;
  yoyChange: number | null;
  newBuildPremium: number | null;
  recentTransactions: Comparable[];
}

export interface Candidate {
  /** `${localAuthority}::${reference}` */
  key: string;
  app: PlanningApplication;
  countySlug: string;
  townSlug: string;
  localAuthority: string;
  consentStage: ConsentStage;
  decisionDateIso: string | null;
  units: number | null;
  schemeType: SchemeType;
  /** Sold-price value applied per unit when GDV is inferred. */
  unitValue: number | null;
  gdv: number;
  ltgdv: number;
  loanAmount: number;
  valuationSource: "appraisal" | "scraper" | "sold-data-by-type" | "sold-data-median" | "town-stats" | "county-median" | "none";
  sold: { medianPrice: number; transactionCount12m: number; yoyChange: number | null } | null;
  comparables: Comparable[];
  /** Full indicative stack (senior / stretch / mezz / equity); null when units are unknown. */
  stack: CapitalStack | null;
}

export const DEFAULT_LTGDV = 0.65;

const PLANNING_DIR = path.join(process.cwd(), "data", "generated", "planning");
const SOLD_DATA_DIR = path.join(process.cwd(), "data", "generated", "sold-data");
const TOWN_STATS_DIR = path.join(process.cwd(), "data", "generated", "town-stats");
const COUNTY_ALIASES: Record<string, string[]> = {
  "east-sussex": ["sussex"],
  "west-sussex": ["sussex"],
};

// ── Small helpers ────────────────────────────────────────────────────────────

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const d = new Date(`${iso[1]}-${iso[2]}-${iso[3]}T00:00:00Z`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const uk = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (uk) {
    const [, dd, mm, yyyy] = uk;
    const d = new Date(`${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}T00:00:00Z`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const words = value.match(/^\w{3}\s+\d{1,2}\s+\w{3}\s+\d{4}/) || value.match(/^\d{1,2}\s+\w+\s+\d{4}/);
  if (words) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function deslugify(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatGBP(amount: number): string {
  if (amount >= 1_000_000) return `£${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 0 : 1)}m`;
  if (amount >= 1_000) return `£${Math.round(amount / 1_000)}k`;
  return `£${Math.round(amount).toLocaleString("en-GB")}`;
}

export function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

/** Outward postcode district, e.g. "CW8 2HB" → "CW8". */
export function postcodeDistrict(postcode: string | null | undefined): string {
  const m = (postcode ?? "").toUpperCase().replace(/\s+/g, " ").trim().match(/^([A-Z]{1,2}\d[A-Z\d]?)/);
  return m ? m[1] : "";
}

export function extractPostcode(text: string): string {
  const m = (text ?? "").toUpperCase().match(/\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/);
  return m ? m[1].replace(/\s+/, " ") : "";
}

// ── Unit inference ───────────────────────────────────────────────────────────

const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90,
};

const UNIT_TOKEN =
  "(?:dwelling|dwellings|unit|units|home|homes|house|houses|apartment|apartments|flat|flats|maisonette|maisonettes|bungalow|bungalows)";
const NUMBER_TOKEN =
  "(?:\\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)";

function parseUnitCount(raw: string): number | null {
  const value = raw.toLowerCase().replace(/-/g, " ").trim();
  const numeric = Number.parseInt(value, 10);
  if (Number.isFinite(numeric) && numeric > 0 && numeric < 500) return numeric;
  const total = value
    .split(/\s+/)
    .filter(Boolean)
    .reduce((sum, part) => sum + (NUMBER_WORDS[part] ?? 0), 0);
  return total > 0 && total < 500 ? total : null;
}

export function inferUnitsFromProposal(proposal: string): number | null {
  const p = (proposal ?? "").toLowerCase().replace(/\bno\./g, "no").replace(/\s+/g, " ");
  const hasResidentialSignal = /\b(dwelling|flat|apartment|residential|house|home|bungalow|maisonette)\b/i.test(p);
  const hasEquipmentSignal =
    /\b(antenna|telecom|telecommunications|radio\s+unit|remote\s+radio|transmission\s+dish|base\s+station|mast|cabinet|plant|condenser|generator)\b/i.test(p);
  if (hasEquipmentSignal && !hasResidentialSignal) return null;

  const patterns = [
    new RegExp(`\\b(${NUMBER_TOKEN})\\s*(?:no\\s*)?(?:residential\\s+)?${UNIT_TOKEN}\\b`, "i"),
    new RegExp(`\\b(${NUMBER_TOKEN})\\s*(?:x|no)\\s*(?:[a-z\\s-]+\\s+)?${UNIT_TOKEN}\\b`, "i"),
    new RegExp(`\\b(?:erection|construction|development|provision|creation|formation)\\s+of\\s+(${NUMBER_TOKEN})\\s+(?:[a-z\\s-]+\\s+)?${UNIT_TOKEN}\\b`, "i"),
    new RegExp(`\\b(?:into|to\\s+form|to\\s+create|providing|provide)\\s+(${NUMBER_TOKEN})\\s+(?:[a-z\\s-]+\\s+)?${UNIT_TOKEN}\\b`, "i"),
    new RegExp(`\\b(${NUMBER_TOKEN})\\s*(?:bed\\s*)?(?:room\\s*)?${UNIT_TOKEN}\\b`, "i"),
  ];
  for (const pattern of patterns) {
    const match = p.match(pattern);
    const units = match ? parseUnitCount(match[1]) : null;
    if (units) return units;
  }
  if (p.includes("single dwelling") || p.includes("1 dwelling") || p.includes("one dwelling")) return 1;
  if (
    (p.includes("change of use") || p.includes("conversion")) &&
    (p.includes("dwelling") || p.includes("residential")) &&
    !new RegExp(`\\b${NUMBER_TOKEN}\\s+${UNIT_TOKEN}\\b`, "i").test(p)
  ) {
    return 1;
  }
  return null;
}

export function getUnits(app: PlanningApplication): number | null {
  if (app.units && app.units > 0) return app.units;
  return inferUnitsFromProposal(app.proposal || "");
}

export function classifyConsentStage(app: PlanningApplication): ConsentStage {
  // Reference suffixes are the most reliable signal: 22/01105/CN16, 24/00840/2CN10, 26/00905/VAR, .../NMA, .../DOC, .../REM, .../OUT
  const ref = (app.reference ?? "").toUpperCase();
  if (/\/(NMA|NMAM|MMA)\d*\b/.test(ref)) return "non_material_amendment";
  if (/\/(\d?CN|DOC|DISC|COND|AOD|AOC|CND|DCN|CD|DC|DET|ADC)\d*\b/.test(ref)) return "condition_discharge";
  if (/\/(VAR|VOC|S73|VCN|MAJ73|MIN73)\d*\b/.test(ref)) return "variation";
  if (/\/(REM|ARM|RM)\d*\b/.test(ref)) return "reserved_matters";
  if (/\/(OUT|OPA|OPP)\d*\b/.test(ref)) return "outline";

  const text = `${app.reference} ${app.category} ${app.proposal}`.toLowerCase();
  if (/\b(non[-\s]?material amendment|nma|ame|amd)\b/.test(text)) return "non_material_amendment";
  if (/\b(discharge of condition|approval of details|condition discharge|details pursuant|drc|dis)\b/.test(text)) return "condition_discharge";
  if (/\b(variation of condition|removal of condition|section 73|s73|voc)\b/.test(text)) return "variation";
  if (/\b(reserved matters|approval of reserved matters|rem|arm)\b/.test(text)) return "reserved_matters";
  if (/\b(outline application|outline planning|outline consent|outline permission|outline approval|hybrid planning)\b/.test(text)) return "outline";
  return "primary_consent";
}

/** Normalised site identity so several applications for one plot (CN01, CN02, VAR...) collapse into one outreach target. */
export function siteKey(localAuthority: string, address: string, postcode?: string): string {
  const addr = (address ?? "")
    .toLowerCase()
    .replace(/\b(land (to the )?(east|west|north|south) of|land at|land adjacent to|land adj|site of|former|rear of|plot \d+)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  // Sources name the same authority differently ("Ealing" vs "London Borough of Ealing"),
  // so prefer the postcode as the scope when we have one.
  const pc = (postcode ?? extractPostcode(address)).toUpperCase().replace(/\s+/g, "");
  const scope = pc || localAuthority.toLowerCase();
  return `${scope}::${addr.replace(pc.toLowerCase(), "").replace(pc.toLowerCase().replace(/(\d[a-z]{2})$/, " $1"), "").trim()}`;
}

/** Keep one candidate per site: the highest-priority stage, then the largest GDV. */
export function dedupeBySite(candidates: Candidate[]): Candidate[] {
  const best = new Map<string, Candidate>();
  for (const c of candidates) {
    const key = siteKey(c.localAuthority, c.app.address, c.app.postcode);
    const current = best.get(key);
    if (!current) {
      best.set(key, c);
      continue;
    }
    const better =
      STAGE_PRIORITY[c.consentStage] < STAGE_PRIORITY[current.consentStage] ||
      (STAGE_PRIORITY[c.consentStage] === STAGE_PRIORITY[current.consentStage] && c.gdv > current.gdv);
    if (better) best.set(key, c);
  }
  return [...best.values()];
}

// ── Sold data, valuation, comparables ────────────────────────────────────────

type SoldFile = {
  stats?: {
    medianPrice?: number;
    medianByType?: Record<string, number>;
    transactionCount12m?: number;
    yoyChange?: number | null;
    newBuildPremium?: number | null;
  };
  recentTransactions?: Array<{
    price: number;
    date: string;
    postcode: string;
    propertyType: string;
    newBuild?: boolean;
    address: string;
  }>;
};

const soldCache = new Map<string, SoldSnapshot | null>();
const countyMedianCache = new Map<string, number | null>();

export function getSoldSnapshot(countySlug: string, townSlug: string): SoldSnapshot | null {
  const cacheKey = `${countySlug}/${townSlug}`;
  if (soldCache.has(cacheKey)) return soldCache.get(cacheKey)!;
  let result: SoldSnapshot | null = null;
  for (const county of [countySlug, ...(COUNTY_ALIASES[countySlug] ?? [])]) {
    const sold = readJson<SoldFile>(path.join(SOLD_DATA_DIR, county, townSlug, "latest.json"));
    if (sold?.stats?.medianPrice && sold.stats.medianPrice > 0) {
      result = {
        medianPrice: sold.stats.medianPrice,
        medianByType: sold.stats.medianByType ?? {},
        transactionCount12m: sold.stats.transactionCount12m ?? 0,
        yoyChange: sold.stats.yoyChange ?? null,
        newBuildPremium: sold.stats.newBuildPremium ?? null,
        recentTransactions: (sold.recentTransactions ?? []).map((t) => ({
          address: t.address ?? "",
          postcode: t.postcode ?? "",
          price: t.price,
          date: t.date,
          propertyType: t.propertyType ?? "",
          newBuild: Boolean(t.newBuild),
        })),
      };
      break;
    }
  }
  soldCache.set(cacheKey, result);
  return result;
}

function getTownStatsMedian(countySlug: string, townSlug: string): number | null {
  for (const county of [countySlug, ...(COUNTY_ALIASES[countySlug] ?? [])]) {
    const stats = readJson<{ stats?: { medianPrice?: number }; medianPrice?: number }>(
      path.join(TOWN_STATS_DIR, county, `${townSlug}.json`)
    );
    const median = stats?.stats?.medianPrice ?? stats?.medianPrice;
    if (median && median > 0) return median;
  }
  return null;
}

export function inferSchemeType(proposal: string): SchemeType {
  const p = (proposal ?? "").toLowerCase();
  const flats = /\b(flat|flats|apartment|apartments|maisonette|maisonettes|studio|studios)\b/.test(p);
  const houses = /\b(dwelling|dwellings|house|houses|bungalow|bungalows|home|homes|townhouse|townhouses)\b/.test(p);
  if (flats && houses) return "mixed";
  if (flats) return "flats";
  if (houses) return "houses";
  return "unknown";
}

/** Sold-price value per unit for the scheme type, from medianByType (D/S/T/F) when available. */
export function unitValueFor(sold: SoldSnapshot, schemeType: SchemeType): { value: number; byType: boolean } {
  const t = sold.medianByType ?? {};
  if (schemeType === "flats" && t.F) return { value: t.F, byType: true };
  if (schemeType === "houses") {
    const houseMedians = [t.S, t.T, t.D].filter((v): v is number => typeof v === "number" && v > 0);
    if (houseMedians.length) {
      houseMedians.sort((a, b) => a - b);
      return { value: houseMedians[Math.floor(houseMedians.length / 2)], byType: true };
    }
  }
  return { value: sold.medianPrice, byType: false };
}

export const PROPERTY_TYPE_LABEL: Record<string, string> = {
  D: "detached house",
  S: "semi-detached house",
  T: "terraced house",
  F: "flat",
  O: "other",
};

function typeMatches(schemeType: SchemeType, propertyType: string): boolean {
  if (schemeType === "flats") return propertyType === "F";
  if (schemeType === "houses") return propertyType === "D" || propertyType === "S" || propertyType === "T";
  return true;
}

/**
 * Up to `n` recent sales to quote as comparables: same property type as the
 * scheme first, same postcode district first, newest first, then widen.
 */
export function pickComparables(sold: SoldSnapshot | null, sitePostcode: string, schemeType: SchemeType, n = 3): Comparable[] {
  if (!sold) return [];
  const district = postcodeDistrict(sitePostcode);
  const area = district.replace(/\d.*$/, "");
  const score = (t: Comparable) => {
    let s = 0;
    if (typeMatches(schemeType, t.propertyType)) s += 4;
    const d = postcodeDistrict(t.postcode);
    if (district && d === district) s += 3;
    else if (area && d.startsWith(area)) s += 1;
    if (t.newBuild) s += 1;
    return s;
  };
  return [...sold.recentTransactions]
    .filter((t) => t.price > 0 && t.address)
    .sort((a, b) => score(b) - score(a) || b.date.localeCompare(a.date))
    .slice(0, n);
}

function titleCaseAddress(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\s+,/g, ",")
    .replace(/\s+/g, " ")
    .trim();
}

/** "Flat 15, Springfield Court, Lynton Road, W3 9EA: £347,500 (flat, June 2026)" */
export function formatComparable(c: Comparable): string {
  const when = new Date(`${c.date}T00:00:00Z`);
  const month = Number.isNaN(when.getTime()) ? c.date : when.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const type = PROPERTY_TYPE_LABEL[c.propertyType] ?? "property";
  const price = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(c.price);
  return `${titleCaseAddress(c.address)}, ${c.postcode}: ${price} (${c.newBuild ? "new build " : ""}${type}, ${month})`;
}

function getCountyMedian(countySlug: string): number | null {
  if (countyMedianCache.has(countySlug)) return countyMedianCache.get(countySlug)!;
  const medians: number[] = [];
  for (const county of [countySlug, ...(COUNTY_ALIASES[countySlug] ?? [])]) {
    const dir = path.join(SOLD_DATA_DIR, county);
    if (!fs.existsSync(dir)) continue;
    for (const town of fs.readdirSync(dir)) {
      const sold = readJson<SoldFile>(path.join(dir, town, "latest.json"));
      if (sold?.stats?.medianPrice && sold.stats.medianPrice > 0) medians.push(sold.stats.medianPrice);
    }
  }
  medians.sort((a, b) => a - b);
  const result = medians.length ? medians[Math.floor(medians.length / 2)] : null;
  countyMedianCache.set(countySlug, result);
  return result;
}

// ── Loading + selection ──────────────────────────────────────────────────────

export function readPlanningFiles(): PlanningFile[] {
  if (!fs.existsSync(PLANNING_DIR)) return [];
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (item === "latest.json") files.push(full);
    }
  };
  walk(PLANNING_DIR);
  return files.map((f) => readJson<PlanningFile>(f)).filter((d): d is PlanningFile => Boolean(d));
}

export function candidateKey(localAuthority: string, reference: string): string {
  return `${localAuthority}::${reference}`.toLowerCase();
}

export interface SelectOptions {
  minUnits: number;
  minGdv: number;
  ltgdv?: number; // default DEFAULT_LTGDV (0.65)
}

/**
 * GDV is sized from the sold data whenever we know the unit count: units × the
 * town's median for the scheme's property type. The scraper's own estimate is
 * only used when units are unknown.
 */
export function buildCandidate(
  app: PlanningApplication,
  file: PlanningFile,
  opts: SelectOptions
): Candidate | null {
  const units = getUnits(app);
  const schemeType = inferSchemeType(app.proposal);
  const postcode = app.postcode || extractPostcode(app.address);
  const sold = getSoldSnapshot(file.countySlug, file.townSlug);

  let gdv = 0;
  let unitValue: number | null = null;
  let valuationSource: Candidate["valuationSource"] = "none";
  let stack: CapitalStack | null = null;

  if (units) {
    // The appraisal model gives GDV (sold-price median by type plus the measured
    // new-build premium) and a full cost build-up, so the stack reconciles.
    const town = sold ? null : getTownStatsMedian(file.countySlug, file.townSlug);
    stack = buildCapitalStack({
      units,
      proposal: app.proposal ?? "",
      category: app.category ?? "",
      countySlug: file.countySlug,
      schemeType,
      blendedMedian: sold?.medianPrice ?? town ?? getCountyMedian(file.countySlug),
      medianByType: sold?.medianByType ?? null,
      newBuildPremium: sold?.newBuildPremium ?? null,
      storedEstimatedGdv: app.estimatedGdv ?? null,
    });
  }

  if (stack) {
    gdv = stack.gdv;
    unitValue = stack.gdvPerUnit;
    valuationSource = "appraisal";
  } else if (units && sold) {
    const uv = unitValueFor(sold, schemeType);
    unitValue = uv.value;
    gdv = Math.round(units * uv.value);
    valuationSource = uv.byType ? "sold-data-by-type" : "sold-data-median";
  } else if (units) {
    const town = getTownStatsMedian(file.countySlug, file.townSlug);
    const county = town ?? getCountyMedian(file.countySlug);
    if (county) {
      unitValue = county;
      gdv = Math.round(units * county);
      valuationSource = town ? "town-stats" : "county-median";
    }
  }
  if (gdv === 0 && app.estimatedGdv && app.estimatedGdv > 0) {
    gdv = app.estimatedGdv;
    valuationSource = "scraper";
  }

  const isTarget = (units ?? 0) >= opts.minUnits || gdv >= opts.minGdv;
  if (!isTarget) return null;

  const ltgdv = opts.ltgdv ?? DEFAULT_LTGDV;
  const decision = parseDate(app.decisionDate);
  return {
    key: candidateKey(file.localAuthority, app.reference),
    app: { ...app, postcode },
    countySlug: file.countySlug,
    townSlug: file.townSlug,
    localAuthority: file.localAuthority,
    consentStage: classifyConsentStage(app),
    decisionDateIso: decision ? toIsoDate(decision) : null,
    units,
    schemeType,
    unitValue,
    gdv,
    ltgdv,
    loanAmount: stack ? stack.senior : Math.round(gdv * ltgdv),
    valuationSource,
    sold: sold ? { medianPrice: sold.medianPrice, transactionCount12m: sold.transactionCount12m, yoyChange: sold.yoyChange } : null,
    comparables: pickComparables(sold, postcode, schemeType, 3),
    stack,
  };
}

/** Every approved finance-target application across all towns, deduplicated by authority + reference. */
export function selectApprovedCandidates(opts: SelectOptions): Candidate[] {
  const seen = new Set<string>();
  const out: Candidate[] = [];
  for (const file of readPlanningFiles()) {
    for (const app of file.approvedApplications ?? []) {
      if (!app.reference) continue;
      const key = candidateKey(file.localAuthority, app.reference);
      if (seen.has(key)) continue;
      seen.add(key);
      const candidate = buildCandidate(app, file, opts);
      if (candidate) out.push(candidate);
    }
  }
  return out;
}

export function sortCandidates(candidates: Candidate[]): Candidate[] {
  return [...candidates].sort((a, b) => {
    const stage = STAGE_PRIORITY[a.consentStage] - STAGE_PRIORITY[b.consentStage];
    if (stage !== 0) return stage;
    return b.gdv - a.gdv;
  });
}
