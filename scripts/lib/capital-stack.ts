/**
 * Indicative capital stack for a consented scheme.
 *
 * Built on the site's own appraisal model (src/lib/development-appraisal.ts:
 * BCIS-informed build cost, on-costs, finance, 17.5% profit target) so the
 * numbers in the email reconcile with what the location pages publish.
 *
 * Layers, in line with the leverage the site advertises (src/lib/services.ts):
 *   senior          65% LTGDV, capped at 85% of cost
 *   stretch senior  70% LTGDV, capped at 90% of cost
 *   mezzanine       tops total debt up to 75% LTGDV / 90% of cost, behind senior
 *   equity / JV     the balance of cost; JV partners fund up to 100% of cost
 *                   for a profit share
 *
 * All figures are indicative and rounded; land cost is the residual value at
 * the target margin because the actual purchase price is never known.
 */

import {
  appraiseScheme,
  detectUnitType,
  type AppraisalResult,
  type UnitType,
} from "@/lib/development-appraisal";

export const SENIOR_LTGDV = 0.65;
export const SENIOR_MAX_LTC = 0.85;
export const STRETCH_LTGDV = 0.7;
export const STRETCH_MAX_LTC = 0.9;
export const MEZZ_TOTAL_LTGDV = 0.75;
export const MEZZ_TOTAL_LTC = 0.9;

export interface CapitalStack {
  gdv: number;
  gdvPerUnit: number;
  gdvBasis: string;
  buildCost: number;
  onCosts: number; // externals + professional fees + contingency + CIL + sales costs
  financeCosts: number; // interest + fees on the senior facility
  landValue: number; // residual at target profit, floored at 0
  totalCost: number; // land + build + on-costs + finance
  targetProfit: number;
  targetProfitPct: number;
  senior: number;
  seniorLtgdv: number;
  seniorLtc: number;
  stretchSenior: number;
  stretchLtgdv: number;
  stretchLtc: number;
  mezzanine: number;
  totalDebt: number; // senior + mezzanine
  totalDebtLtgdv: number;
  totalDebtLtc: number;
  equityWithSenior: number; // cost not covered by senior alone
  equityWithMezz: number; // cost not covered by senior + mezz
  termMonths: number;
  marginalViability: boolean;
  /**
   * False when modelled cost leaves no room for the target margin (cost > ~90% of
   * GDV). The email then quotes leverage against GDV only and does not print a
   * cost or equity figure, because the residual-land model is not credible there.
   */
  costModelCredible: boolean;
  assumptions: string[];
}

export interface StackInput {
  units: number;
  proposal: string;
  category: string;
  countySlug: string;
  schemeType: "flats" | "houses" | "mixed" | "unknown";
  blendedMedian: number | null;
  medianByType: Record<string, number> | null;
  newBuildPremium: number | null;
  storedEstimatedGdv: number | null;
}

function round1k(n: number): number {
  return Math.round(n / 1000) * 1000;
}

/**
 * Unit type for the appraisal. Houses whose sub-type is not stated in the
 * proposal get a blended house median (S/T/D) rather than the flat-inclusive
 * town median or an arbitrary "terraced" assumption.
 */
function valuationBasis(input: StackInput): { unitType: UnitType; blendedMedian: number | null } {
  const detected = detectUnitType(input.proposal);
  if (input.schemeType === "flats") return { unitType: "flat", blendedMedian: input.blendedMedian };
  if (input.schemeType === "houses") {
    if (detected && detected !== "flat") return { unitType: detected, blendedMedian: input.blendedMedian };
    const t = input.medianByType ?? {};
    const houseMedians = [t.S, t.T, t.D].filter((v): v is number => typeof v === "number" && v > 0).sort((a, b) => a - b);
    const houseMedian = houseMedians.length ? houseMedians[Math.floor(houseMedians.length / 2)] : null;
    return { unitType: null, blendedMedian: houseMedian ?? input.blendedMedian };
  }
  return { unitType: detected, blendedMedian: input.blendedMedian };
}

export function buildCapitalStack(input: StackInput): CapitalStack | null {
  if (!input.units || input.units < 1) return null;

  const basis = valuationBasis(input);
  const appraisal: AppraisalResult | null = appraiseScheme({
    units: input.units,
    unitType: basis.unitType,
    category: input.category || "new_build",
    proposal: input.proposal,
    countySlug: input.countySlug,
    blendedMedian: basis.blendedMedian,
    medianByType: input.medianByType,
    newBuildPremium: input.newBuildPremium,
    storedEstimatedGdv: input.storedEstimatedGdv,
  });
  if (!appraisal || appraisal.gdv <= 0) return null;

  const gdv = appraisal.gdv;
  const onCosts =
    appraisal.externals + appraisal.professionalFees + appraisal.contingency + (appraisal.cil ?? 0) + appraisal.salesCosts;
  const financeCosts = appraisal.finance.interest + appraisal.finance.fees;
  const landValue = Math.max(0, appraisal.residualLandValue);
  const totalCost = round1k(landValue + appraisal.buildCost + onCosts + financeCosts);

  const senior = round1k(Math.min(gdv * SENIOR_LTGDV, totalCost * SENIOR_MAX_LTC));
  const stretchSenior = round1k(Math.max(senior, Math.min(gdv * STRETCH_LTGDV, totalCost * STRETCH_MAX_LTC)));
  const totalDebt = round1k(Math.max(senior, Math.min(gdv * MEZZ_TOTAL_LTGDV, totalCost * MEZZ_TOTAL_LTC)));
  const mezzanine = Math.max(0, totalDebt - senior);

  return {
    gdv,
    gdvPerUnit: appraisal.gdvPerUnit,
    gdvBasis: appraisal.gdvBasis,
    buildCost: appraisal.buildCost,
    onCosts: round1k(onCosts),
    financeCosts: round1k(financeCosts),
    landValue,
    totalCost,
    targetProfit: appraisal.targetProfit,
    targetProfitPct: appraisal.targetProfitPct,
    senior,
    seniorLtgdv: senior / gdv,
    seniorLtc: totalCost ? senior / totalCost : 0,
    stretchSenior,
    stretchLtgdv: stretchSenior / gdv,
    stretchLtc: totalCost ? stretchSenior / totalCost : 0,
    mezzanine,
    totalDebt,
    totalDebtLtgdv: totalDebt / gdv,
    totalDebtLtc: totalCost ? totalDebt / totalCost : 0,
    equityWithSenior: Math.max(0, totalCost - senior),
    equityWithMezz: Math.max(0, totalCost - totalDebt),
    termMonths: appraisal.finance.termMonths,
    marginalViability: appraisal.marginalViability,
    costModelCredible: !appraisal.marginalViability && totalCost > 0 && totalCost <= gdv * 0.9,
    assumptions: appraisal.assumptions,
  };
}

export function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}
