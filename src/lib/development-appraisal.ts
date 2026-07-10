/**
 * Indicative development appraisal engine.
 *
 * Replaces the old fixed-ratio scheme economics (build cost = 45% of GDV,
 * which made "profit on GDV" a constant 47.0% on every page) with a
 * benchmark-based residual appraisal:
 *
 *   GDV            — HM Land Registry type-specific medians × the town's
 *                    MEASURED new-build premium (never a fixed multiple of
 *                    the blended median)
 *   Build cost     — regional £/sqm benchmark ranges × NDSS-derived floor
 *                    areas (computed at the mid-point, displayed as a range)
 *   On-costs       — externals, professional fees, contingency, sales costs,
 *                    CIL where the local rate is known
 *   Finance        — modelled from the facility terms the site itself quotes
 *   Residual       — implied land value at the industry-standard 17.5%
 *                    profit-on-GDV target. We never claim a per-scheme profit
 *                    figure: land cost is unknown, so profit is the target
 *                    and land value is the output, as in a real appraisal.
 *
 * All outputs are indicative and labelled as such in the UI.
 */

import { getRegion, type Region } from "@/lib/location-content";

// ─── Types ───────────────────────────────────────────────────

export type UnitType = "flat" | "terraced" | "semi" | "detached" | null;

export interface BuildCostRange {
  low: number;
  mid: number;
  high: number;
}

export interface AppraisalInput {
  units: number;
  /** Detected from the planning proposal text; null = unknown mix */
  unitType: UnitType;
  /** Planning category, e.g. "new_build", "conversion", "prior_approval" */
  category: string;
  /** Proposal text — used to detect conversions and tall buildings */
  proposal?: string;
  countySlug: string;
  /** Town blended median sold price (HM Land Registry) */
  blendedMedian?: number | null;
  /** Medians keyed D/S/T/F as in SoldData.stats.medianByType */
  medianByType?: Record<string, number> | null;
  /** Measured local new-build premium %, from sold data */
  newBuildPremium?: number | null;
  /** CIL £/sqm where the charging schedule rate is known */
  cilRatePerSqm?: number | null;
  /** Fallback when no Land Registry medians exist for the town */
  storedEstimatedGdv?: number | null;
}

export interface AppraisalResult {
  gdv: number;
  gdvPerUnit: number;
  /** Human-readable sentence describing how GDV was derived */
  gdvBasis: string;
  areaSqmPerUnit: number;
  totalAreaSqm: number;
  buildCostPerSqm: BuildCostRange;
  buildCost: number;
  buildCostRange: { low: number; high: number };
  externals: number;
  professionalFees: number;
  contingency: number;
  cil: number | null;
  salesCosts: number;
  finance: {
    facility: number;
    ltgdvPct: number;
    ratePct: number;
    termMonths: number;
    interest: number;
    fees: number;
  };
  totalCostsExLand: number;
  targetProfitPct: number;
  targetProfit: number;
  residualLandValue: number;
  residualPerUnit: number;
  /** true when residual ≤ 5% of GDV — viability is tight at benchmark costs */
  marginalViability: boolean;
  isConversion: boolean;
  assumptions: string[];
}

// ─── Benchmarks ──────────────────────────────────────────────

/**
 * New-build residential construction cost benchmarks, £/sqm GIA,
 * medium specification, excluding externals. Indicative ranges informed by
 * BCIS regional tender-price data and published cost models, 2025/26.
 */
const NEW_BUILD_COST_PER_SQM: Record<Region, BuildCostRange> = {
  "london-se": { low: 2250, mid: 2550, high: 2850 },
  "east-of-england": { low: 2100, mid: 2375, high: 2650 },
  "south-west": { low: 2050, mid: 2325, high: 2600 },
  "east-midlands": { low: 1900, mid: 2150, high: 2400 },
  "west-midlands": { low: 1900, mid: 2150, high: 2400 },
  "north-west": { low: 1850, mid: 2100, high: 2350 },
  yorkshire: { low: 1800, mid: 2050, high: 2300 },
  "north-east": { low: 1750, mid: 2000, high: 2250 },
  scotland: { low: 1900, mid: 2175, high: 2450 },
  wales: { low: 1850, mid: 2100, high: 2350 },
  "uk-generic": { low: 1950, mid: 2200, high: 2500 },
};

/** Inner-London costs sit well above the wider South East. */
const LONDON_NEW_BUILD: BuildCostRange = { low: 2600, mid: 2950, high: 3350 };

/** Conversion/refurb typically runs at ~60-65% of new-build cost. */
const CONVERSION_FACTOR = 0.62;

/**
 * Gross internal areas per unit (sqm), derived from the Nationally Described
 * Space Standard with a gross-up for common parts on flatted schemes.
 */
const UNIT_AREA_SQM: Record<Exclude<UnitType, null>, number> = {
  flat: 63,
  terraced: 79,
  semi: 93,
  detached: 124,
};

/** Unknown mix: assume flat-led at scale, house-led for small schemes. */
function defaultAreaForSchemeSize(units: number): number {
  if (units >= 30) return 68;
  if (units >= 10) return 85;
  
return 95;
}

// On-costs (shared with LocalGdvCalculator so assumptions never drift)
export const EXTERNALS_PCT = 0.1; // of construction; 12.5% for ≥50 units
export const EXTERNALS_PCT_LARGE = 0.125;
export const PROF_FEES_PCT_NEW_BUILD = 0.1; // of construction + externals
export const PROF_FEES_PCT_CONVERSION = 0.08;
export const CONTINGENCY_PCT_NEW_BUILD = 0.05;
export const CONTINGENCY_PCT_CONVERSION = 0.075;
export const SALES_COSTS_PCT = 0.035; // of GDV: agency, marketing, legals
export const TARGET_PROFIT_ON_GDV = 0.175; // industry-standard target margin

// Finance assumptions — aligned with the facility terms quoted sitewide
export const SENIOR_LTGDV = 0.65;
export const FINANCE_RATE_PA = 0.085;
export const FACILITY_UTILISATION = 0.575; // average drawdown over the term
export const FINANCE_FEES_PCT = 0.025; // 1.5% arrangement + 1% exit

/** Default new-build premium when the town has no measured figure. */
const DEFAULT_NEW_BUILD_PREMIUM_PCT = 5;
const MAX_CREDIBLE_PREMIUM_PCT = 25;

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Detect the dominant unit type from a planning proposal description.
 * Mirrors the keyword logic used by the planning scrapers' estimateGDV so
 * the renderer and the pipeline agree.
 */
export function detectUnitType(proposal: string): UnitType {
  const p = proposal.toLowerCase();
  if (/\bflat|\bapartment|\bstudio/.test(p)) return "flat";
  if (/semi[- ]detached/.test(p)) return "semi";
  if (/\bdetached/.test(p)) return "detached";
  if (/\bterrace/.test(p)) return "terraced";
  
return null;
}

/**
 * Conversion detection from proposal text — scraper categories are not
 * reliable ("change of use" schemes often arrive as other_residential).
 */
export function isConversionScheme(category: string, proposal: string): boolean {
  if (category === "prior_approval" || category === "conversion") return true;
  
return /change of use|conversion|convert(?:ed|ing)? (?:of|to|into)|prior approval/i.test(
    proposal
  );
}

/** Storey count from proposal text, if stated (e.g. "31 storey building"). */
export function detectStoreys(proposal: string): number | null {
  const m = proposal.match(/(\d{1,2})[- ]storey/i);
  
return m ? parseInt(m[1], 10) : null;
}

const TYPE_TO_MEDIAN_KEY: Record<Exclude<UnitType, null>, string> = {
  detached: "D",
  semi: "S",
  terraced: "T",
  flat: "F",
};

function termMonthsForScale(units: number): number {
  if (units >= 50) return 24;
  if (units >= 10) return 18;
  
return 12;
}

function round1k(n: number): number {
  return Math.round(n / 1000) * 1000;
}

// ─── Appraisal ───────────────────────────────────────────────

export function appraiseScheme(input: AppraisalInput): AppraisalResult | null {
  const { units, unitType, category, countySlug } = input;
  if (!units || units < 1) return null;

  const isConversion = isConversionScheme(category, input.proposal ?? "");
  const storeys = input.proposal ? detectStoreys(input.proposal) : null;
  const isTallBuilding = !isConversion && storeys !== null && storeys >= 10;
  const region = getRegion(countySlug);
  const assumptions: string[] = [];

  // ── GDV ──
  const typeKey = unitType ? TYPE_TO_MEDIAN_KEY[unitType] : null;
  const typeMedian =
    typeKey && input.medianByType?.[typeKey]
      ? input.medianByType[typeKey]
      : null;
  const baseUnitValue = typeMedian ?? input.blendedMedian ?? null;

  let gdv: number;
  let gdvBasis: string;
  if (baseUnitValue) {
    let premiumPct = 0;
    if (!isConversion) {
      const measured = input.newBuildPremium;
      premiumPct =
        measured !== null &&
        measured !== undefined &&
        measured > 0 &&
        measured <= MAX_CREDIBLE_PREMIUM_PCT
          ? measured
          : DEFAULT_NEW_BUILD_PREMIUM_PCT;
    }
    gdv = round1k(units * baseUnitValue * (1 + premiumPct / 100));
    const typeLabel = unitType
      ? { flat: "flat", terraced: "terraced house", semi: "semi-detached", detached: "detached house" }[unitType]
      : null;
    gdvBasis = typeLabel
      ? `HM Land Registry ${typeLabel} median of £${baseUnitValue.toLocaleString("en-GB")}`
      : `HM Land Registry blended median of £${baseUnitValue.toLocaleString("en-GB")}`;
    if (premiumPct > 0) {
      gdvBasis += ` plus a ${premiumPct.toFixed(1).replace(/\.0$/, "")}% new-build premium${
        input.newBuildPremium && premiumPct === input.newBuildPremium
          ? " (measured locally)"
          : " (assumed)"
      }`;
    }
    assumptions.push(`GDV: ${gdvBasis}.`);
  } else if (input.storedEstimatedGdv) {
    gdv = input.storedEstimatedGdv;
    gdvBasis = "estimate derived at data-collection time";
    assumptions.push("GDV: pipeline estimate (no local sold-price medians available).");
  } else {
    return null;
  }
  const gdvPerUnit = Math.round(gdv / units);

  // ── Build cost ──
  const areaSqmPerUnit = unitType
    ? UNIT_AREA_SQM[unitType]
    : defaultAreaForSchemeSize(units);
  const totalAreaSqm = areaSqmPerUnit * units;

  const baseRange =
    countySlug === "greater-london"
      ? LONDON_NEW_BUILD
      : NEW_BUILD_COST_PER_SQM[region];
  // High-rise construction carries a substantial cost premium over the
  // regional benchmark (structure, cores, fire engineering).
  const tallFactor = isTallBuilding ? 1.35 : 1;
  const scale = (n: number, f: number) => Math.round((n * f) / 10) * 10;
  const buildCostPerSqm: BuildCostRange = isConversion
    ? {
        low: scale(baseRange.low, CONVERSION_FACTOR),
        mid: scale(baseRange.mid, CONVERSION_FACTOR),
        high: scale(baseRange.high, CONVERSION_FACTOR),
      }
    : {
        low: scale(baseRange.low, tallFactor),
        mid: scale(baseRange.mid, tallFactor),
        high: scale(baseRange.high, tallFactor),
      };

  const buildCost = round1k(totalAreaSqm * buildCostPerSqm.mid);
  const buildCostRange = {
    low: round1k(totalAreaSqm * buildCostPerSqm.low),
    high: round1k(totalAreaSqm * buildCostPerSqm.high),
  };
  assumptions.push(
    `Build cost: £${buildCostPerSqm.low.toLocaleString("en-GB")}-£${buildCostPerSqm.high.toLocaleString("en-GB")}/sqm (${isConversion ? "conversion" : isTallBuilding ? `new build, uplifted for ${storeys}-storey construction` : "new build"}, indicative range informed by BCIS regional tender-price data, 2025/26) × ${areaSqmPerUnit} sqm/unit (NDSS-derived).`
  );

  // ── On-costs ──
  const externalsPct = units >= 50 ? EXTERNALS_PCT_LARGE : EXTERNALS_PCT;
  const externals = round1k(buildCost * externalsPct);
  const profFeesPct = isConversion
    ? PROF_FEES_PCT_CONVERSION
    : PROF_FEES_PCT_NEW_BUILD;
  const professionalFees = round1k((buildCost + externals) * profFeesPct);
  const contingencyPct = isConversion
    ? CONTINGENCY_PCT_CONVERSION
    : CONTINGENCY_PCT_NEW_BUILD;
  const contingency = round1k((buildCost + externals) * contingencyPct);
  const salesCosts = round1k(gdv * SALES_COSTS_PCT);
  const cil =
    input.cilRatePerSqm && input.cilRatePerSqm > 0 && !isConversion
      ? round1k(input.cilRatePerSqm * totalAreaSqm)
      : null;
  assumptions.push(
    `On-costs: externals ${(externalsPct * 100).toFixed(1).replace(/\.0$/, "")}%, professional fees ${profFeesPct * 100}%, contingency ${(contingencyPct * 100).toFixed(1).replace(/\.0$/, "")}%, sales & legals ${SALES_COSTS_PCT * 100}% of GDV${cil ? `, CIL at £${input.cilRatePerSqm}/sqm` : ". Excludes CIL/Section 106, which vary by charging schedule and scheme"}.`
  );

  // ── Finance ──
  const facility = round1k(gdv * SENIOR_LTGDV);
  const termMonths = termMonthsForScale(units);
  const interest = round1k(
    facility * FINANCE_RATE_PA * (termMonths / 12) * FACILITY_UTILISATION
  );
  const financeFees = round1k(facility * FINANCE_FEES_PCT);
  assumptions.push(
    `Finance: senior facility at ${SENIOR_LTGDV * 100}% LTGDV, ${(FINANCE_RATE_PA * 100).toFixed(1)}% pa on an average ${FACILITY_UTILISATION * 100}% drawdown over ${termMonths} months, plus ${FINANCE_FEES_PCT * 100}% arrangement and exit fees.`
  );

  // ── Residual ──
  const totalCostsExLand =
    buildCost +
    externals +
    professionalFees +
    contingency +
    (cil ?? 0) +
    salesCosts +
    interest +
    financeFees;
  const targetProfit = round1k(gdv * TARGET_PROFIT_ON_GDV);
  const residualLandValue = round1k(gdv - totalCostsExLand - targetProfit);
  assumptions.push(
    `Residual land value assumes the industry-standard ${TARGET_PROFIT_ON_GDV * 100}% developer profit-on-GDV target. Indicative appraisal, not a valuation or lending offer.`
  );

  return {
    gdv,
    gdvPerUnit,
    gdvBasis,
    areaSqmPerUnit,
    totalAreaSqm,
    buildCostPerSqm,
    buildCost,
    buildCostRange,
    externals,
    professionalFees,
    contingency,
    cil,
    salesCosts,
    finance: {
      facility,
      ltgdvPct: SENIOR_LTGDV * 100,
      ratePct: FINANCE_RATE_PA * 100,
      termMonths,
      interest,
      fees: financeFees,
    },
    totalCostsExLand,
    targetProfitPct: TARGET_PROFIT_ON_GDV * 100,
    targetProfit,
    residualLandValue,
    residualPerUnit: Math.round(residualLandValue / units),
    marginalViability: residualLandValue <= gdv * 0.05,
    isConversion,
    assumptions,
  };
}
