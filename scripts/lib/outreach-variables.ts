/**
 * Per-lead custom variables for the Instantly campaign, built from a
 * planning candidate (GDV, comparables, capital stack) and the contact role.
 * Shared by the weekly pipeline and the campaign-refresh script.
 */

import { SITE_URL } from "@/lib/constants";

import { pct } from "./capital-stack";
import { INTRO_AGENT, INTRO_DIRECTOR, INTRO_OWNER } from "./outreach-copy";
import { STAGE_LABEL, deslugify, formatComparable, type Candidate } from "./planning-candidates";

export type ContactRole = "owner" | "director" | "agent";

export function gbpFull(n: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

export function buildVariables(c: Candidate, role: ContactRole): Record<string, string> {
  const typeWord = c.schemeType === "flats" ? "flats" : c.schemeType === "houses" ? "houses" : "homes";
  const unitsText = c.units && c.units > 1 ? `${c.units} new ${typeWord}` : c.units === 1 ? "a single new home" : "the scheme";
  const intro = role === "agent" ? INTRO_AGENT : role === "director" ? INTRO_DIRECTOR : INTRO_OWNER;
  const comps = c.comparables.map(formatComparable);
  while (comps.length < 3) comps.push(comps.length === 0 ? "Further comparable sales available on request." : "");
  // Portals sometimes append "(Submitted as: ...)"; keep the email address line clean.
  const siteAddress = c.app.address.replace(/\s*\((submitted as|formerly|previously)[^)]*\)\s*$/i, "").replace(/\s+/g, " ").trim();

  // Stack lines. Whole sentences are built here so the template never shows a
  // bare "n/a". Cost and equity figures only appear when the cost model is
  // credible for the location; otherwise leverage is quoted against GDV only.
  const s = c.stack;
  const credible = Boolean(s && s.costModelCredible);
  const senior = s ? s.senior : c.loanAmount;
  const stretch = s ? s.stretchSenior : Math.round(c.gdv * 0.7);
  const totalDebt = s ? s.totalDebt : Math.round(c.gdv * 0.75);
  const mezz = Math.max(0, totalDebt - senior);
  const seniorPct = s ? pct(s.seniorLtgdv) : pct(c.ltgdv);
  const stretchPct = s ? pct(s.stretchLtgdv) : "70%";
  const debtPct = s ? pct(s.totalDebtLtgdv) : "75%";

  const stack = credible && s
    ? {
        costSuffix: `, against an estimated total cost of ${gbpFull(s.totalCost)} including land, build, fees and finance`,
        seniorLine: `${gbpFull(s.senior)} (${seniorPct} of GDV, ${pct(s.seniorLtc)} of cost), leaving around ${gbpFull(s.equityWithSenior)} of equity`,
        stretchLine: `${gbpFull(s.stretchSenior)} (${stretchPct} of GDV, ${pct(s.stretchLtc)} of cost) from a single lender`,
        mezzLine: `${gbpFull(s.totalDebt)} in total debt (${debtPct} of GDV, ${pct(s.totalDebtLtc)} of cost), with ${gbpFull(s.mezzanine)} of mezzanine behind the senior, leaving around ${gbpFull(s.equityWithMezz)} of equity. Mezzanine is subject to evaluation of the scheme and your experience`,
        equityLine: `a capital partner can fund the ${gbpFull(s.equityWithMezz)} balance, or up to 100% of cost, for a profit share`,
        equityWithSenior: gbpFull(s.equityWithSenior),
        equityWithMezz: gbpFull(s.equityWithMezz),
        termMonths: String(s.termMonths),
      }
    : {
        costSuffix: "",
        seniorLine: `${gbpFull(senior)} (${seniorPct} of GDV), with the balance of cost as equity`,
        stretchLine: `${gbpFull(stretch)} (${stretchPct} of GDV) from a single lender, subject to loan to cost`,
        mezzLine: `${gbpFull(totalDebt)} in total debt (${debtPct} of GDV), with ${gbpFull(mezz)} of mezzanine behind the senior. Mezzanine is subject to evaluation of the scheme and your experience`,
        equityLine: "a capital partner can fund the balance of cost, or up to 100% of it, for a profit share",
        equityWithSenior: "the balance of cost",
        equityWithMezz: "the balance of cost",
        termMonths: s ? String(s.termMonths) : "12 to 24",
      };

  return {
    siteAddress,
    sitePostcode: c.app.postcode,
    planningReference: c.app.reference,
    localAuthority: c.localAuthority,
    consentStage: STAGE_LABEL[c.consentStage],
    unitsText,
    gdv: gbpFull(c.gdv),
    unitValue: c.unitValue ? gbpFull(c.unitValue) : "the local median",
    soldMedian: c.sold ? gbpFull(c.sold.medianPrice) : "n/a",
    soldCount12m: c.sold ? c.sold.transactionCount12m.toLocaleString("en-GB") : "n/a",
    comp1: comps[0],
    comp2: comps[1],
    comp3: comps[2],
    ...stack,
    seniorLoan: gbpFull(senior),
    seniorLtgdv: seniorPct,
    stretchSenior: gbpFull(stretch),
    mezzanine: gbpFull(mezz),
    totalDebt: gbpFull(totalDebt),
    totalDebtLtgdv: debtPct,
    // kept for the GHL reply sync and older templates
    loanAmount: gbpFull(senior),
    ltgdv: seniorPct,
    townName: deslugify(c.townSlug),
    planningUrl: c.app.sourceUrl,
    intro,
    contactRole: role,
    decisionDate: c.decisionDateIso ?? "",
    locationPageUrl: `${SITE_URL}/locations/${c.countySlug}/${c.townSlug}/development-finance`,
  };
}
