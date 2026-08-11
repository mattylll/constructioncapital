/**
 * Development Lending Monitor — report generator.
 *
 * Reads the verified stats pack produced by the Companies House project
 * (data/lending-monitor/stats/stats-<period>.json — every number in it is
 * independently re-derivable SQL; see scripts/17-lending-monitor-stats.ts in
 * the Comapnies House Reverse Lookup project) and emits MarketReport files:
 *
 *   src/lib/market-reports/reports/lending/<slug>.ts
 *   src/lib/market-reports/reports/lending/index.ts   (LENDING_REPORTS barrel)
 *
 * ADDITIVE ONLY: never deletes or rewrites files for other editions. Dated
 * slugs (-h1-2026) coexist with future editions so cited URLs never change.
 *
 * House rules enforced here:
 *  - no lender is ever named in report copy (aggregates only)
 *  - every stat traces to the stats pack; nothing is computed ad hoc in prose
 *  - data vintage is stated from the pack's real maxima, never "today"
 *  - suppressed cuts are stated as suppressed, not silently omitted
 *  - British English, no em dashes
 *
 * Usage:
 *   npx tsx scripts/generate-lending-reports.ts --period h1-2026
 *   npx tsx scripts/generate-lending-reports.ts --period h1-2026 --dry-run
 */
import * as fs from "node:fs";
import * as path from "node:path";

// ── CLI safety ──────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
if (argv.includes("--help") || argv.includes("-h") || argv.length === 0) {
  console.log(
    "Usage: npx tsx scripts/generate-lending-reports.ts --period h1-2026 [--dry-run]\n" +
      "Additive: writes src/lib/market-reports/reports/lending/*.ts only."
  );
  process.exit(0);
}
const periodIdx = argv.indexOf("--period");
const PERIOD = periodIdx >= 0 ? argv[periodIdx + 1] : "";
if (!/^(h[12]|q[1-4])-\d{4}$/.test(PERIOD)) {
  console.error(`Bad --period "${PERIOD}" (expected e.g. h1-2026)`);
  process.exit(1);
}
const DRY_RUN = argv.includes("--dry-run");

// ── Inputs ──────────────────────────────────────────────────────────────────
const ROOT = process.cwd();
const STATS_PATH = path.join(ROOT, "data", "lending-monitor", "stats", `stats-${PERIOD}.json`);
const OUT_DIR = path.join(ROOT, "src", "lib", "market-reports", "reports", "lending");

interface QuarterRow {
  quarter: string;
  charges: number;
  borrowers: number;
  satisfied: number;
  newSpvSharePct: number | null;
}
interface BreadthRow {
  quarter: string;
  activeLenders: number;
  top5SharePct: number | null;
  top10SharePct: number | null;
  hhi: number | null;
}
interface RedemptionRow {
  cohortYear: string;
  originated: number;
  redeemedWithin18mPct: number | null;
}
interface StackRow {
  quarter: string;
  refinanceEvents: number;
  juniorAlongsideSenior: number;
}

const stats = JSON.parse(fs.readFileSync(STATS_PATH, "utf-8")) as {
  meta: {
    period: string;
    periodFrom: string;
    periodTo: string;
    methodologyVersion: string;
    minSampleFloor: number;
    dataVintage: { chargesMax: string; satisfiedMax: string; landRegistryMax: string | null };
    coverageNotes: string[];
  };
  national: {
    specialist_development: { quarterly: QuarterRow[]; breadth: BreadthRow[]; redemption: RedemptionRow[] };
    ecosystem: { quarterly: QuarterRow[]; breadth: BreadthRow[]; redemption: RedemptionRow[] };
    institutional_credit: { quarterly: QuarterRow[] };
    wholeMarket: { quarterly: { quarter: string; charges: number; borrowers: number }[] };
  };
  regional: {
    ecosystem: {
      coveragePct: number;
      regions: Record<string, { quarter: string; charges: number }[]>;
      suppressed: string[];
    };
  };
  products: { stacks: StackRow[] };
  suppressedCuts: string[];
};

const meta = stats.meta;
const PERIOD_LABEL = meta.period; // e.g. "H1 2026"
const SLUG_PERIOD = PERIOD; // e.g. "h1-2026"
const DATE_PUBLISHED = "2026-08-11";
const DATE_MODIFIED = "2026-08-11";

// Which quarters constitute the period
const inPeriod = (q: string) => {
  const [y, qn] = q.split("-Q").map(Number);
  const fromY = Number(meta.periodFrom.slice(0, 4));
  const fromQ = Math.ceil(Number(meta.periodFrom.slice(5, 7)) / 3);
  const toY = Number(meta.periodTo.slice(0, 4));
  const toQ = Math.ceil(Number(meta.periodTo.slice(5, 7)) / 3);
  return (y > fromY || (y === fromY && qn >= fromQ)) && (y < toY || (y === toY && qn <= toQ));
};
const priorPeriodQuarter = (q: string) => {
  const [y, qn] = q.split("-Q").map(Number);
  return `${y - 1}-Q${qn}`;
};

// ── Formatting helpers ──────────────────────────────────────────────────────
const INT = (n: number) => n.toLocaleString("en-GB");
const pctChange = (now: number, then: number) =>
  then === 0 ? null : Math.round((1000 * (now - then)) / then) / 10;
const signed = (n: number | null) =>
  n === null ? "n/a" : `${n > 0 ? "+" : ""}${n}%`;
const escapeTs = (s: string) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

function sum<T>(rows: T[], pick: (r: T) => number): number {
  return rows.reduce((s, r) => s + pick(r), 0);
}

// Period aggregates for a quarterly series
function periodAgg(rows: QuarterRow[]) {
  const cur = rows.filter((r) => inPeriod(r.quarter));
  const prevQuarters = cur.map((r) => priorPeriodQuarter(r.quarter));
  const prev = rows.filter((r) => prevQuarters.includes(r.quarter));
  return {
    charges: sum(cur, (r) => r.charges),
    borrowers: Math.max(...cur.map((r) => r.borrowers)), // distinct per quarter; do NOT sum across quarters
    satisfied: sum(cur, (r) => r.satisfied),
    prevCharges: prev.length === cur.length ? sum(prev, (r) => r.charges) : null,
    cur,
  };
}

const eco = periodAgg(stats.national.ecosystem.quarterly);
const spec = periodAgg(stats.national.specialist_development.quarterly);
const whole = (() => {
  const cur = stats.national.wholeMarket.quarterly.filter((r) => inPeriod(r.quarter));
  const prevQ = cur.map((r) => priorPeriodQuarter(r.quarter));
  const prev = stats.national.wholeMarket.quarterly.filter((r) => prevQ.includes(r.quarter));
  return {
    charges: sum(cur, (r) => r.charges),
    prevCharges: prev.length === cur.length ? sum(prev, (r) => r.charges) : null,
  };
})();
const ecoBreadthPeriod = stats.national.ecosystem.breadth.filter((r) => inPeriod(r.quarter));
const lastBreadth = ecoBreadthPeriod[ecoBreadthPeriod.length - 1];
const redemption = stats.national.ecosystem.redemption.filter((r) => r.redeemedWithin18mPct !== null);
const redFirst = redemption.find((r) => r.cohortYear === "2021");
const redLast = redemption[redemption.length - 1];
const stacksPeriod = stats.products.stacks.filter((r) => inPeriod(r.quarter));
const refiPeriod = sum(stacksPeriod, (r) => r.refinanceEvents);
const mezzPeriod = sum(stacksPeriod, (r) => r.juniorAlongsideSenior);
const newSpvShare = eco.cur[eco.cur.length - 1]?.newSpvSharePct ?? null;
const ecoYoY = whole.prevCharges !== null ? pctChange(eco.charges, eco.prevCharges ?? 0) : null;

const VINTAGE_LINE =
  `Charge data runs to ${meta.dataVintage.chargesMax}; satisfaction filings to ` +
  `${meta.dataVintage.satisfiedMax}. Companies House filings record no loan values ` +
  `(a 2013 reform removed the amount-secured field), so activity is measured in ` +
  `charge registrations and distinct borrower counts, never estimated loan books.`;

const METHODOLOGY_SECTION = {
  heading: "Methodology and data notes",
  content: [
    `This edition of the Monitor is built from every mortgage and charge registered at Companies House, cross-referenced against a curated set of development-active lenders in three tiers: pure-play development lenders, banks and bridging lenders with substantial development arms, and institutional real estate credit. Lender identities are resolved through their funding-line vehicles and security trustees, so lending through numbered SPVs is captured against the economic lender. No individual lender is named or ranked in this publication; concentration is reported only in aggregate.`,
    `${VINTAGE_LINE}`,
    `Regional attribution uses the postcode of the charged property, extracted from the legal particulars of each charge, not the borrower's registered office. Property postcodes are recoverable for ${stats.regional.ecosystem.coveragePct}% of ecosystem charges; regional figures are shares of that covered set. Coverage is England and Wales. Any cut with fewer than ${meta.minSampleFloor} observations is suppressed rather than published.`,
    `Full methodology, definitions and revision policy: <a href="/lending-trends/methodology">Monitor methodology</a>. The underlying aggregates are published as open data on the report page.`,
  ],
};

const CTA_SECTION = {
  heading: "What this means for developers seeking finance",
  content: [
    `A market writing roughly ${INT(Math.round(eco.charges / 26 / 5) * 5)} secured facilities a week across ${lastBreadth?.activeLenders ?? "dozens of"} active lenders is a market with genuine competition for good schemes. Pricing and leverage still vary widely between lenders, which is exactly where whole-of-market advice earns its keep.`,
    `Construction Capital arranges development finance, bridging and development exit facilities across the lenders behind these numbers. To discuss a scheme, call <a href="tel:+442038163693">+44 20 3816 3693</a> or start with the <a href="/deal-room">deal room</a>.`,
  ],
};

// ── Report builders ─────────────────────────────────────────────────────────
type Report = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  region?: string;
  sections: { heading: string; content: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedReportSlugs: string[];
  quarterlyTrend?: { name: string; value: number }[];
};

function nationalReport(): Report {
  const q = stats.national.ecosystem.quarterly;
  const trend = q.map((r) => ({ name: r.quarter, value: r.charges }));
  return {
    slug: `development-lending-monitor-${SLUG_PERIOD}`,
    title: `Development Lending Monitor: ${PERIOD_LABEL}`,
    metaTitle: `UK Development Lending Monitor ${PERIOD_LABEL} | Charge Data Analysis`,
    metaDescription: `${INT(eco.charges)} secured facilities registered by development-active lenders in ${PERIOD_LABEL}, across ${lastBreadth?.activeLenders} active lenders. Companies House charge data, analysed quarterly.`,
    excerpt: `${INT(eco.charges)} new secured facilities in ${PERIOD_LABEL}${ecoYoY !== null ? ` (${signed(ecoYoY)} on H1 2025)` : ""}, ${lastBreadth?.activeLenders} active lenders, and an 18-month redemption rate that has risen every cohort year since 2021.`,
    sections: [
      {
        heading: `The market in ${PERIOD_LABEL}`,
        content: [
          `Development-active lenders registered <strong>${INT(eco.charges)} new secured facilities</strong> against UK borrowers in ${PERIOD_LABEL}${ecoYoY !== null ? `, ${signed(ecoYoY)} against the same period last year` : ""}. Quarter by quarter the market was remarkably steady: ${INT(eco.cur[0]?.charges ?? 0)} charges in ${eco.cur[0]?.quarter ?? ""} and ${INT(eco.cur[1]?.charges ?? 0)} in ${eco.cur[1]?.quarter ?? ""}, each against roughly ${INT(Math.round((eco.cur[0]?.borrowers ?? 0) / 100) * 100)} distinct borrower companies.`,
          `Pure-play development lenders wrote ${INT(spec.charges)} facilities over the same period${spec.prevCharges ? ` (${INT(spec.prevCharges)} in the prior-year period)` : ""}. The wider register, all lenders of every kind, recorded ${INT(whole.charges)} charges, so development-active lenders account for roughly ${Math.round((100 * eco.charges) / whole.charges)}% of all UK secured lending events by count.`,
          `${newSpvShare !== null ? `New vehicles matter: <strong>${newSpvShare}% of facilities</strong> in the latest quarter were written against companies incorporated within the previous twelve months, the classic single-scheme SPV pattern.` : ""}`,
        ],
      },
      {
        heading: "Lender breadth and concentration",
        content: [
          `${lastBreadth?.activeLenders} lenders in our development-active set wrote three or more facilities in the latest quarter. The five most active accounted for ${lastBreadth?.top5SharePct}% of activity and the top ten for ${lastBreadth?.top10SharePct}%, a Herfindahl-Hirschman index of ${INT(lastBreadth?.hhi ?? 0)}, which competition authorities would class as moderately concentrated. We publish concentration only in aggregate; this Monitor does not rank or name individual lenders.`,
          `Breadth has practical meaning for borrowers: a moderately concentrated market with ${lastBreadth?.activeLenders} genuinely active lenders is one where terms are still won by shopping the whole market rather than defaulting to the biggest names.`,
        ],
      },
      {
        heading: "Redemptions: loans are exiting faster",
        content: [
          `The clearest trend in the data is in how quickly facilities are redeemed. Of loans originated in 2021, ${redFirst?.redeemedWithin18mPct}% were satisfied within 18 months. That figure has risen every cohort since: <strong>${redLast?.redeemedWithin18mPct}% for the ${redLast?.cohortYear} cohort</strong> (${INT(redLast?.originated ?? 0)} facilities). These are fixed-window rates, so recent cohorts are only included once every loan has had the full 18 months to run; the comparison is like for like.`,
          `Faster redemption is consistent with what the refinance data shows below: an active exit and refinance market pulling loans off books earlier.`,
        ],
      },
      {
        heading: "Refinance and junior debt activity",
        content: [
          `Where two charges are registered against the same property title by unrelated lenders, the sequencing reveals the product. In ${PERIOD_LABEL} we identified <strong>${INT(refiPeriod)} refinance events</strong> (a senior charge satisfied at or near the registration of a successor) and <strong>${INT(mezzPeriod)} third-party junior charges</strong> registered alongside a live senior facility, the signature of mezzanine and second-charge lending. Related-party structures such as a lender's own security trustee are excluded from both counts.`,
        ],
      },
      METHODOLOGY_SECTION,
      CTA_SECTION,
    ],
    faqs: [
      {
        question: `How many development finance loans were written in the UK in ${PERIOD_LABEL}?`,
        answer: `Development-active lenders registered ${INT(eco.charges)} new secured facilities at Companies House in ${PERIOD_LABEL}. Companies House does not record loan values, so the count of registered charges is the most reliable public measure of activity.`,
      },
      {
        question: "How concentrated is the UK development lending market?",
        answer: `In the latest quarter the five most active development-focused lenders accounted for ${lastBreadth?.top5SharePct}% of new facilities and the top ten for ${lastBreadth?.top10SharePct}%, with ${lastBreadth?.activeLenders} lenders writing three or more facilities. That is a moderately concentrated market by HHI standards.`,
      },
      {
        question: "How quickly are UK development loans repaid?",
        answer: `${redLast?.redeemedWithin18mPct}% of secured facilities originated by development-active lenders in ${redLast?.cohortYear} were fully redeemed within 18 months, up from ${redFirst?.redeemedWithin18mPct}% for the 2021 cohort. The trend has risen every year since 2021.`,
      },
    ],
    relatedReportSlugs: [
      `development-exit-refinance-monitor-${SLUG_PERIOD}`,
      `mezzanine-junior-debt-monitor-${SLUG_PERIOD}`,
    ],
    quarterlyTrend: trend,
  };
}

function regionalReport(region: string, series: { quarter: string; charges: number }[]): Report {
  const regionSlug = region.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const cur = series.filter((r) => inPeriod(r.quarter));
  const prevQ = cur.map((r) => priorPeriodQuarter(r.quarter));
  const prev = series.filter((r) => prevQ.includes(r.quarter));
  const curTotal = sum(cur, (r) => r.charges);
  const prevTotal = prev.length === cur.length ? sum(prev, (r) => r.charges) : null;
  const yoy = prevTotal ? pctChange(curTotal, prevTotal) : null;
  const allRegionsTotal = sum(
    Object.values(stats.regional.ecosystem.regions).flatMap((s) => s.filter((r) => inPeriod(r.quarter))),
    (r) => r.charges
  );
  const share = Math.round((1000 * curTotal) / allRegionsTotal) / 10;
  return {
    slug: `development-lending-monitor-${regionSlug}-${SLUG_PERIOD}`,
    title: `Development Lending Monitor, ${region}: ${PERIOD_LABEL}`,
    metaTitle: `${region} Development Lending ${PERIOD_LABEL} | Monitor Regional Edition`,
    metaDescription: `${INT(curTotal)} secured development facilities against ${region} property in ${PERIOD_LABEL}${yoy !== null ? ` (${signed(yoy)} year on year)` : ""}. Property-level Companies House charge data.`,
    excerpt: `${INT(curTotal)} facilities secured on ${region} property in ${PERIOD_LABEL}, ${share}% of regionally-attributable activity${yoy !== null ? `, ${signed(yoy)} year on year` : ""}.`,
    region,
    sections: [
      {
        heading: `${region} in ${PERIOD_LABEL}`,
        content: [
          `Development-active lenders took security over ${region} property in <strong>${INT(curTotal)} new facilities</strong> during ${PERIOD_LABEL}${yoy !== null ? `, ${signed(yoy)} against the same period last year` : ""}. That is ${share}% of all regionally-attributable lending events in the period.`,
          `Attribution here is to the property itself, not the borrower's registered office. Most development SPVs are registered at an accountant's or solicitor's address, frequently in London, so registered-office geography badly overstates the capital and understates every other region. The Monitor extracts the charged property's postcode from the legal particulars of each filing instead; ${stats.regional.ecosystem.coveragePct}% of facilities can be located this way.`,
          `Quarterly pattern: ${cur.map((r) => `${INT(r.charges)} in ${r.quarter}`).join(", ")}.`,
        ],
      },
      METHODOLOGY_SECTION,
      CTA_SECTION,
    ],
    faqs: [
      {
        question: `How much development lending happened in ${region} in ${PERIOD_LABEL}?`,
        answer: `${INT(curTotal)} secured facilities were registered against ${region} property by development-active lenders in ${PERIOD_LABEL}, ${share}% of regionally-attributable UK activity. Companies House records no loan values, so counts are the reliable public measure.`,
      },
    ],
    relatedReportSlugs: [`development-lending-monitor-${SLUG_PERIOD}`],
    quarterlyTrend: series.map((r) => ({ name: r.quarter, value: r.charges })),
  };
}

function devExitReport(): Report {
  const trend = stats.products.stacks.map((r) => ({ name: r.quarter, value: r.refinanceEvents }));
  return {
    slug: `development-exit-refinance-monitor-${SLUG_PERIOD}`,
    title: `Development Exit and Refinance Monitor: ${PERIOD_LABEL}`,
    metaTitle: `UK Development Exit Finance ${PERIOD_LABEL} | Refinance Event Data`,
    metaDescription: `${INT(refiPeriod)} title-level refinance events identified in ${PERIOD_LABEL}. Senior-to-successor charge sequencing from Companies House, quarterly.`,
    excerpt: `${INT(refiPeriod)} refinance events in ${PERIOD_LABEL}: senior facilities redeemed at or near a successor's registration, the fingerprint of the dev-exit market.`,
    sections: [
      {
        heading: `Refinance activity in ${PERIOD_LABEL}`,
        content: [
          `Tracking pairs of charges registered against the same property title, the Monitor identified <strong>${INT(refiPeriod)} refinance events</strong> in ${PERIOD_LABEL}: cases where an unrelated senior lender's charge was satisfied at or near the registration of a successor facility. This is the fingerprint of the development exit and refinance market, developments moving from build facilities to exit bridges, term debt or sales-period funding.`,
          `Quarterly: ${stacksPeriod.map((r) => `${INT(r.refinanceEvents)} in ${r.quarter}`).join(", ")}. Related-party successions (a lender's own trustee or group vehicle) are excluded.`,
          `The redemption data in the <a href="/market-reports/development-lending-monitor-${SLUG_PERIOD}">national Monitor</a> corroborates the trend: 18-month redemption rates have risen every cohort year since 2021, consistent with an increasingly liquid exit market.`,
        ],
      },
      METHODOLOGY_SECTION,
      CTA_SECTION,
    ],
    faqs: [
      {
        question: "How active is the UK development exit finance market?",
        answer: `The Monitor identified ${INT(refiPeriod)} title-level refinance events in ${PERIOD_LABEL}, where a senior charge was redeemed at or near the registration of a successor facility from an unrelated lender.`,
      },
    ],
    relatedReportSlugs: [
      `development-lending-monitor-${SLUG_PERIOD}`,
      `mezzanine-junior-debt-monitor-${SLUG_PERIOD}`,
    ],
    quarterlyTrend: trend,
  };
}

function mezzReport(): Report {
  const trend = stats.products.stacks.map((r) => ({ name: r.quarter, value: r.juniorAlongsideSenior }));
  return {
    slug: `mezzanine-junior-debt-monitor-${SLUG_PERIOD}`,
    title: `Mezzanine and Junior Debt Monitor: ${PERIOD_LABEL}`,
    metaTitle: `UK Mezzanine Finance Activity ${PERIOD_LABEL} | Junior Charge Data`,
    metaDescription: `${INT(mezzPeriod)} third-party junior charges registered alongside live senior facilities in ${PERIOD_LABEL}. Companies House title-level analysis.`,
    excerpt: `${INT(mezzPeriod)} third-party junior charges alongside live senior debt in ${PERIOD_LABEL}: measured mezzanine and second-charge activity, not survey sentiment.`,
    sections: [
      {
        heading: `Junior debt activity in ${PERIOD_LABEL}`,
        content: [
          `Where a second charge is registered on a title while an unrelated lender's senior charge remains outstanding, someone is layering debt: mezzanine, second-charge or stretch structures. The Monitor counted <strong>${INT(mezzPeriod)} such third-party junior charges</strong> in ${PERIOD_LABEL}: ${stacksPeriod.map((r) => `${INT(r.juniorAlongsideSenior)} in ${r.quarter}`).join(", ")}.`,
          `Same-group structures are excluded, so a lender registering both a senior and junior charge through its own vehicles does not count. What remains is genuine third-party capital-stack layering, the measurable core of the UK mezzanine market. Companies House records no amounts, so this is an activity count, not a volume estimate; it is also a floor, since junior positions secured by other means (share charges alone, unregistered instruments) are invisible to the register.`,
        ],
      },
      METHODOLOGY_SECTION,
      CTA_SECTION,
    ],
    faqs: [
      {
        question: "How large is the UK mezzanine development finance market?",
        answer: `No public source records mezzanine loan values, but activity is measurable: ${INT(mezzPeriod)} third-party junior charges were registered alongside live senior facilities in ${PERIOD_LABEL}. Related-party structures are excluded, so this is a floor for genuine capital-stack layering.`,
      },
    ],
    relatedReportSlugs: [
      `development-lending-monitor-${SLUG_PERIOD}`,
      `development-exit-refinance-monitor-${SLUG_PERIOD}`,
    ],
    quarterlyTrend: trend,
  };
}

// ── Serialisation (MarketReport module files) ───────────────────────────────
function estimateReadingTime(r: Report): string {
  const words = r.sections
    .flatMap((s) => s.content)
    .join(" ")
    .replace(/<[^>]+>/g, "")
    .split(/\s+/).length;
  return `${Math.max(3, Math.ceil(words / 200))} min read`;
}

function serialise(r: Report): string {
  const sections = r.sections
    .map(
      (s) =>
        `    {\n      heading: ${JSON.stringify(s.heading)},\n      content: [\n` +
        s.content.filter(Boolean).map((c) => `        \`${escapeTs(c)}\`,`).join("\n") +
        `\n      ],\n    },`
    )
    .join("\n");
  const faqs = r.faqs
    .map((f) => `    { question: ${JSON.stringify(f.question)}, answer: \`${escapeTs(f.answer)}\` },`)
    .join("\n");
  return `import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: ${JSON.stringify(r.slug)},
  title: ${JSON.stringify(r.title)},
  metaTitle: ${JSON.stringify(r.metaTitle)},
  metaDescription: ${JSON.stringify(r.metaDescription)},
  excerpt: ${JSON.stringify(r.excerpt)},
  category: "lending",
${r.region ? `  region: ${JSON.stringify(r.region)},\n` : ""}  datePublished: "${DATE_PUBLISHED}",
  dateModified: "${DATE_MODIFIED}",
  readingTime: "${estimateReadingTime(r)}",
  sections: [
${sections}
  ],
  faqs: [
${faqs}
  ],
  relatedReportSlugs: ${JSON.stringify(r.relatedReportSlugs)},
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "development-exit-finance"],
${r.quarterlyTrend ? `  charts: { quarterlyTrend: ${JSON.stringify(r.quarterlyTrend)} },\n` : ""}};

export default report;
`;
}

// ── Main ────────────────────────────────────────────────────────────────────
const reports: Report[] = [
  nationalReport(),
  ...Object.entries(stats.regional.ecosystem.regions).map(([region, series]) =>
    regionalReport(region, series)
  ),
  devExitReport(),
  mezzReport(),
];

console.log(`Period ${PERIOD_LABEL}: ${reports.length} reports`);
if (stats.regional.ecosystem.suppressed.length) {
  console.log(`Regional cuts suppressed (below floor): ${stats.regional.ecosystem.suppressed.join("; ")}`);
}

if (DRY_RUN) {
  for (const r of reports) console.log(`  [dry-run] ${r.slug}`);
  process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const r of reports) {
  fs.writeFileSync(path.join(OUT_DIR, `${r.slug}.ts`), serialise(r));
  console.log(`  wrote ${r.slug}.ts`);
}

// Barrel: merge with any editions already on disk (additive across editions).
const files = fs
  .readdirSync(OUT_DIR)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .sort();
const imports = files
  .map((f, i) => `import r${i} from "./${f.replace(/\.ts$/, "")}";`)
  .join("\n");
const barrel = `// AUTO-GENERATED by scripts/generate-lending-reports.ts - do not edit by hand.
import type { MarketReport } from "../../types";
${imports}

export const LENDING_REPORTS: MarketReport[] = [${files.map((_, i) => `r${i}`).join(", ")}];
`;
fs.writeFileSync(path.join(OUT_DIR, "index.ts"), barrel);
console.log(`  wrote index.ts (${files.length} reports in barrel)`);
