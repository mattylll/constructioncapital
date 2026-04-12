/**
 * Generate press-ready market report files from existing market data.
 *
 * Usage: npx tsx scripts/generate-pr-reports.ts
 *
 * Reads sold-data and planning JSON from data/generated/ and outputs
 * TypeScript report files to src/lib/market-reports/reports/press/.
 */

import * as fs from "fs";
import * as path from "path";

// ── Paths ────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "..");
const SOLD_DATA_DIR = path.join(ROOT, "data/generated/sold-data");
const PLANNING_DIR = path.join(ROOT, "data/generated/planning");
const OUTPUT_DIR = path.join(
  ROOT,
  "src/lib/market-reports/reports/press"
);

const DATE = "2026-04-12";

// ── Types ────────────────────────────────────────────────────────────────────

interface SoldStats {
  medianPrice: number;
  medianByType: Record<string, number>;
  transactionCount12m: number;
  yoyChange: number;
  newBuildCount: number;
  existingCount: number;
  newBuildPremium: number;
}

interface SoldData {
  townSlug: string;
  countySlug: string;
  stats: SoldStats;
  recentTransactions: {
    price: number;
    date: string;
    propertyType: string;
    newBuild: boolean;
    address: string;
  }[];
}

interface PlanningSummary {
  total: number;
  relevant: number;
  approved: number;
  pending: number;
  refused: number;
  approvedUnits: number;
  pendingUnits: number;
  totalUnits: number;
  approvedGdv: number;
  pendingGdv: number;
  totalEstimatedGDV: number;
  approvalRate: number;
}

interface PlanningApp {
  reference: string;
  address: string;
  proposal: string;
  category: string;
  units: number | null;
  estimatedGdv: number | null;
  status: string;
  decision: string;
  receivedDate: string;
  decisionDate: string;
}

interface PlanningData {
  townSlug: string;
  countySlug: string;
  localAuthority: string;
  summary: PlanningSummary;
  approvedApplications: PlanningApp[];
  pendingApplications: PlanningApp[];
}

interface TownRecord {
  townSlug: string;
  countySlug: string;
  stats: SoldStats;
}

interface CountyAggregate {
  countySlug: string;
  towns: TownRecord[];
  totalTransactions: number;
  medianPrice: number;
  avgYoyChange: number;
  totalNewBuild: number;
  totalExisting: number;
  avgNewBuildPremium: number;
  medianDetached: number;
  medianFlat: number;
}

// ── Region mapping ───────────────────────────────────────────────────────────

const REGION_MAP: Record<string, string[]> = {
  "London & South East": [
    "greater-london", "surrey", "kent", "sussex", "berkshire",
    "buckinghamshire", "hampshire", "oxfordshire", "hertfordshire", "essex",
  ],
  "South West": [
    "cornwall", "devon", "dorset", "somerset", "gloucestershire",
    "wiltshire", "bristol",
  ],
  "East of England": [
    "cambridgeshire", "norfolk", "suffolk", "bedfordshire",
    "northamptonshire", "lincolnshire",
  ],
  "West Midlands": [
    "west-midlands", "warwickshire", "worcestershire", "staffordshire",
    "shropshire",
  ],
  "East Midlands": ["derbyshire", "leicestershire", "nottinghamshire"],
  "North West": [
    "greater-manchester", "merseyside", "lancashire", "cheshire", "cumbria",
  ],
  "Yorkshire & Humber": [
    "west-yorkshire", "south-yorkshire", "north-yorkshire",
    "east-riding-of-yorkshire",
  ],
  "North East": ["tyne-and-wear", "northumberland", "county-durham"],
  Wales: ["cardiff", "swansea", "gwynedd", "newport", "powys"],
};

function getRegionForCounty(countySlug: string): string {
  for (const [region, counties] of Object.entries(REGION_MAP)) {
    if (counties.includes(countySlug)) return region;
  }
  return "Other";
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function fmtPrice(n: number): string {
  return "£" + Math.round(n).toLocaleString("en-GB");
}

function fmtPct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

function fmtBigNumber(n: number): string {
  if (n >= 1_000_000_000) return `£${(n / 1_000_000_000).toFixed(1)}bn`;
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}m`;
  return fmtPrice(n);
}

function townLink(countySlug: string, townSlug: string): string {
  return `<a href="/locations/${countySlug}/${townSlug}">${titleCase(townSlug)}</a>`;
}

function countyReportLink(countySlug: string): string {
  return `<a href="/market-reports/${countySlug}-property-market">${titleCase(countySlug)}</a>`;
}

function readingTime(text: string): string {
  const words = text.split(/\s+/).length;
  const mins = Math.max(3, Math.ceil(words / 200));
  return `${mins} min read`;
}

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function escapeTs(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

// ── Data loading ─────────────────────────────────────────────────────────────

function loadAllSoldData(): TownRecord[] {
  const records: TownRecord[] = [];
  const counties = fs.readdirSync(SOLD_DATA_DIR);
  for (const county of counties) {
    const countyDir = path.join(SOLD_DATA_DIR, county);
    if (!fs.statSync(countyDir).isDirectory()) continue;
    const towns = fs.readdirSync(countyDir);
    for (const town of towns) {
      const file = path.join(countyDir, town, "latest.json");
      if (!fs.existsSync(file)) continue;
      try {
        const data: SoldData = JSON.parse(fs.readFileSync(file, "utf-8"));
        records.push({
          townSlug: data.townSlug || town,
          countySlug: data.countySlug || county,
          stats: data.stats,
        });
      } catch {
        // skip malformed files
      }
    }
  }
  return records;
}

function loadAllPlanningData(): PlanningData[] {
  const records: PlanningData[] = [];
  if (!fs.existsSync(PLANNING_DIR)) return records;
  const counties = fs.readdirSync(PLANNING_DIR);
  for (const county of counties) {
    const countyDir = path.join(PLANNING_DIR, county);
    if (!fs.statSync(countyDir).isDirectory()) continue;
    const towns = fs.readdirSync(countyDir);
    for (const town of towns) {
      const file = path.join(countyDir, town, "latest.json");
      if (!fs.existsSync(file)) continue;
      try {
        const data = JSON.parse(fs.readFileSync(file, "utf-8"));
        records.push({
          townSlug: data.townSlug || town,
          countySlug: data.countySlug || county,
          localAuthority: data.localAuthority || "",
          summary: data.summary,
          approvedApplications: data.approvedApplications || [],
          pendingApplications: data.pendingApplications || [],
        });
      } catch {
        // skip
      }
    }
  }
  return records;
}

function aggregateByCounty(towns: TownRecord[]): CountyAggregate[] {
  const byCounty = new Map<string, TownRecord[]>();
  for (const t of towns) {
    const arr = byCounty.get(t.countySlug) || [];
    arr.push(t);
    byCounty.set(t.countySlug, arr);
  }
  const result: CountyAggregate[] = [];
  for (const [countySlug, countyTowns] of byCounty) {
    const totalTransactions = countyTowns.reduce((s, t) => s + t.stats.transactionCount12m, 0);
    const prices = countyTowns.map((t) => t.stats.medianPrice).filter((p) => p > 0);
    const yoyValues = countyTowns.map((t) => t.stats.yoyChange);
    const totalNewBuild = countyTowns.reduce((s, t) => s + t.stats.newBuildCount, 0);
    const totalExisting = countyTowns.reduce((s, t) => s + t.stats.existingCount, 0);
    const premiums = countyTowns
      .filter((t) => t.stats.newBuildPremium !== 0 && t.stats.newBuildCount > 0)
      .map((t) => t.stats.newBuildPremium);
    const detachedPrices = countyTowns
      .map((t) => t.stats.medianByType["D"])
      .filter((p) => p && p > 0);
    const flatPrices = countyTowns
      .map((t) => t.stats.medianByType["F"])
      .filter((p) => p && p > 0);

    result.push({
      countySlug,
      towns: countyTowns,
      totalTransactions,
      medianPrice: median(prices),
      avgYoyChange:
        yoyValues.length > 0
          ? yoyValues.reduce((s, v) => s + v, 0) / yoyValues.length
          : 0,
      totalNewBuild,
      totalExisting,
      avgNewBuildPremium:
        premiums.length > 0
          ? premiums.reduce((s, v) => s + v, 0) / premiums.length
          : 0,
      medianDetached: median(detachedPrices),
      medianFlat: median(flatPrices),
    });
  }
  return result;
}

// ── Report builders ──────────────────────────────────────────────────────────

function buildFastestGrowingReport(towns: TownRecord[]): string {
  console.log("  Building: fastest-growing-markets-q1-2026");

  const sorted = [...towns]
    .filter((t) => t.stats.transactionCount12m > 10)
    .sort((a, b) => b.stats.yoyChange - a.stats.yoyChange);
  const top20 = sorted.slice(0, 20);
  const bottom10 = sorted.slice(-10).reverse();

  const totalTowns = sorted.length;
  const rising = sorted.filter((t) => t.stats.yoyChange > 0).length;
  const falling = sorted.filter((t) => t.stats.yoyChange < 0).length;

  const topTableRows = top20
    .map(
      (t, i) =>
        `<tr><td>${i + 1}</td><td>${townLink(t.countySlug, t.townSlug)}</td><td>${countyReportLink(t.countySlug)}</td><td>${fmtPct(t.stats.yoyChange)}</td><td>${fmtPrice(t.stats.medianPrice)}</td><td>${t.stats.transactionCount12m.toLocaleString("en-GB")}</td></tr>`
    )
    .join("");
  const topTable = `<table><thead><tr><th>#</th><th>Town</th><th>County</th><th>YoY Change</th><th>Median Price</th><th>Transactions (12m)</th></tr></thead><tbody>${topTableRows}</tbody></table>`;

  const bottomTableRows = bottom10
    .map(
      (t, i) =>
        `<tr><td>${i + 1}</td><td>${townLink(t.countySlug, t.townSlug)}</td><td>${countyReportLink(t.countySlug)}</td><td>${fmtPct(t.stats.yoyChange)}</td><td>${fmtPrice(t.stats.medianPrice)}</td><td>${t.stats.transactionCount12m.toLocaleString("en-GB")}</td></tr>`
    )
    .join("");
  const bottomTable = `<table><thead><tr><th>#</th><th>Town</th><th>County</th><th>YoY Change</th><th>Median Price</th><th>Transactions (12m)</th></tr></thead><tbody>${bottomTableRows}</tbody></table>`;

  const chartData = top20.slice(0, 15).map((t) => ({
    name: titleCase(t.townSlug),
    value: parseFloat(t.stats.yoyChange.toFixed(1)),
  }));

  const relatedCountySlugs = [
    ...new Set(top20.slice(0, 5).map((t) => `${t.countySlug}-property-market`)),
  ].slice(0, 5);

  const allContent = `
Of ${totalTowns} towns with meaningful transaction volumes, ${rising} are recording year-on-year price growth whilst ${falling} are seeing declines.
${topTable}
${top20[0] ? `${titleCase(top20[0].townSlug)} leads the table with ${fmtPct(top20[0].stats.yoyChange)} growth, where the median price now sits at ${fmtPrice(top20[0].stats.medianPrice)}.` : ""}
${bottomTable}
Declining markets are not necessarily a warning sign for developers. Lower land values reduce acquisition costs, and strategic development through a price trough can deliver strong returns.
Rising markets offer developers the advantage of appreciating end values during the build period, whilst falling markets present land acquisition opportunities. Understanding these dynamics is essential when structuring <a href="/services/development-finance">development finance</a>.
For <a href="/services/bridging-loans">bridging loan</a> exits, rising markets provide greater certainty on refinance valuations. In declining markets, <a href="/services/mezzanine-finance">mezzanine finance</a> can help bridge the gap between senior debt and equity.
Whether your scheme is in a rising or falling market, Construction Capital can source competitive terms from 100+ lenders. Submit your project via our <a href="/deal-room">deal room</a> for a no-obligation quote.
`;

  const wordCount = allContent.split(/\s+/).length;
  const readTime = `${Math.max(3, Math.ceil(wordCount / 200))} min read`;

  const report = `import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "fastest-growing-markets-q1-2026",
  title: "Fastest-Growing Property Markets in England & Wales Q1 2026",
  metaTitle: "Fastest-Growing Property Markets Q1 2026 | Price Growth Rankings",
  metaDescription: "Data-driven ranking of the fastest-growing and fastest-falling property markets across England and Wales in Q1 2026, based on Land Registry transactions.",
  excerpt: "${rising} towns rising, ${falling} falling. Full town-by-town rankings with transaction data.",
  category: "thematic",
  datePublished: "${DATE}",
  dateModified: "${DATE}",
  readingTime: "${readTime}",
  sections: [
    {
      heading: "Q1 2026 Market Overview",
      content: [
        ${JSON.stringify(escapeTs(`Of ${totalTowns} towns with meaningful transaction volumes (>10 sales in the past 12 months), <strong>${rising}</strong> are recording year-on-year price growth whilst <strong>${falling}</strong> are seeing declines. This report ranks every market by price momentum to highlight where developers face rising end values — and where land acquisition bargains may be emerging.`))},
      ],
    },
    {
      heading: "Top 20 Fastest-Rising Markets",
      content: [
        ${JSON.stringify(escapeTs(topTable))},
        ${JSON.stringify(escapeTs(top20[0] ? `${titleCase(top20[0].townSlug)} in ${titleCase(top20[0].countySlug)} leads the table with <strong>${fmtPct(top20[0].stats.yoyChange)}</strong> growth, where the median price now sits at ${fmtPrice(top20[0].stats.medianPrice)}. ${top20[1] ? `${titleCase(top20[1].townSlug)} follows at ${fmtPct(top20[1].stats.yoyChange)}, with ${titleCase(top20[2]?.townSlug || "")} in third place at ${fmtPct(top20[2]?.stats.yoyChange || 0)}.` : ""}` : ""))},
        ${JSON.stringify(escapeTs(`Rising markets offer developers the advantage of appreciating end values during the build period. For schemes funded with <a href="/services/development-finance">development finance</a>, this can improve profit margins between drawdown and exit.`))},
      ],
    },
    {
      heading: "Top 10 Markets Under Pressure",
      content: [
        ${JSON.stringify(escapeTs(bottomTable))},
        ${JSON.stringify(escapeTs(`Declining markets are not necessarily a warning sign for developers. Lower land values reduce acquisition costs, and strategic development through a price trough can deliver strong returns as the market recovers. The key is conservative appraisals and adequate contingency in your <a href="/services/development-finance">development finance</a> structure.`))},
      ],
    },
    {
      heading: "Regional Patterns",
      content: [
        ${JSON.stringify(escapeTs(`Welsh markets feature prominently among the fastest risers, with towns in ${countyReportLink("gwynedd")} and ${countyReportLink("powys")} showing strong momentum. In the North, ${countyReportLink("tyne-and-wear")} and ${countyReportLink("county-durham")} towns appear in the growth table, suggesting a northward shift in demand.`))},
        ${JSON.stringify(escapeTs(`The South and East of England show more mixed results. Whilst individual towns are growing, county-level averages tend to be more subdued, reflecting higher base prices and the impact of elevated mortgage rates on buyer affordability.`))},
      ],
    },
    {
      heading: "What This Means for Developers",
      content: [
        ${JSON.stringify(escapeTs(`For <a href="/services/bridging-loans">bridging loan</a> exits, rising markets provide greater certainty on refinance valuations. In declining markets, <a href="/services/mezzanine-finance">mezzanine finance</a> can help bridge the gap between senior debt and equity when valuers take a cautious view.`))},
        ${JSON.stringify(escapeTs(`Whether your scheme is in a rising or falling market, Construction Capital sources competitive terms from 100+ lenders. Submit your project via our <a href="/deal-room">deal room</a> for a no-obligation quote.`))},
      ],
    },
  ],
  faqs: [
    {
      question: "Where are property prices rising fastest in Q1 2026?",
      answer: ${JSON.stringify(escapeTs(top20[0] ? `${titleCase(top20[0].townSlug)} in ${titleCase(top20[0].countySlug)} leads with ${fmtPct(top20[0].stats.yoyChange)} year-on-year growth, based on Land Registry transaction data.` : "Data pending."))},
    },
    {
      question: "Where are property prices falling the most?",
      answer: ${JSON.stringify(escapeTs(bottom10[0] ? `${titleCase(bottom10[0].townSlug)} in ${titleCase(bottom10[0].countySlug)} has seen the largest decline at ${fmtPct(bottom10[0].stats.yoyChange)} year-on-year. However, price declines can create opportunities for developers acquiring land at lower values.` : "Data pending."))},
    },
    {
      question: "How does price growth affect development finance?",
      answer: "In rising markets, lenders are typically more comfortable with forward-looking valuations and may offer higher loan-to-value ratios. In falling markets, valuers will be more conservative, meaning developers should stress-test their appraisals and consider additional contingency.",
    },
  ],
  relatedReportSlugs: ${JSON.stringify(relatedCountySlugs)},
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "mezzanine-finance"],
  charts: {
    townYoyChange: ${JSON.stringify(chartData)},
  },
};

export default report;
`;

  return report;
}

function buildAffordableHotspotsReport(towns: TownRecord[]): string {
  console.log("  Building: affordable-development-hotspots-2026");

  const activeTowns = towns
    .filter((t) => t.stats.transactionCount12m > 20 && t.stats.medianPrice > 0)
    .sort((a, b) => a.stats.medianPrice - b.stats.medianPrice);

  const top30 = activeTowns.slice(0, 30);

  // Group by region
  const byRegion = new Map<string, TownRecord[]>();
  for (const t of top30) {
    const region = getRegionForCounty(t.countySlug);
    const arr = byRegion.get(region) || [];
    arr.push(t);
    byRegion.set(region, arr);
  }

  const tableRows = top30
    .slice(0, 20)
    .map(
      (t, i) =>
        `<tr><td>${i + 1}</td><td>${townLink(t.countySlug, t.townSlug)}</td><td>${countyReportLink(t.countySlug)}</td><td>${fmtPrice(t.stats.medianPrice)}</td><td>${fmtPct(t.stats.yoyChange)}</td><td>${t.stats.transactionCount12m.toLocaleString("en-GB")}</td></tr>`
    )
    .join("");
  const table = `<table><thead><tr><th>#</th><th>Town</th><th>County</th><th>Median Price</th><th>YoY Change</th><th>Transactions (12m)</th></tr></thead><tbody>${tableRows}</tbody></table>`;

  const regionSections: string[] = [];
  for (const [region, regionTowns] of byRegion) {
    const townList = regionTowns
      .map((t) => `${townLink(t.countySlug, t.townSlug)} (${fmtPrice(t.stats.medianPrice)})`)
      .join(", ");
    regionSections.push(
      `<strong>${region}:</strong> ${townList}`
    );
  }

  const chartData = top30.slice(0, 15).map((t) => ({
    name: titleCase(t.townSlug),
    value: t.stats.medianPrice,
  }));

  const nationalMedian = median(towns.filter((t) => t.stats.medianPrice > 0).map((t) => t.stats.medianPrice));

  const relatedCountySlugs = [
    ...new Set(top30.slice(0, 10).map((t) => `${t.countySlug}-property-market`)),
  ].slice(0, 5);

  const report = `import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "affordable-development-hotspots-2026",
  title: "Affordable Entry Points: Where First-Time Developers Are Starting in 2026",
  metaTitle: "Affordable Development Hotspots 2026 | Lowest Entry Points for Developers",
  metaDescription: "Discover the most affordable property markets in England and Wales with active transaction volumes. Data-driven guide for first-time developers seeking low-cost entry points.",
  excerpt: "The 20 most affordable markets with active sales — from ${fmtPrice(top30[0]?.stats.medianPrice || 0)} to ${fmtPrice(top30[19]?.stats.medianPrice || 0)}.",
  category: "thematic",
  datePublished: "${DATE}",
  dateModified: "${DATE}",
  readingTime: "5 min read",
  sections: [
    {
      heading: "Finding Affordable Entry Points",
      content: [
        ${JSON.stringify(escapeTs(`With the national median price sitting at ${fmtPrice(nationalMedian)}, many first-time developers assume they need substantial capital to enter the market. This report identifies towns where median prices are significantly below the national average — but where transaction volumes confirm an active, liquid market.`))},
        ${JSON.stringify(escapeTs(`We filtered for towns with more than 20 transactions in the past 12 months, ensuring these are genuine markets rather than statistical anomalies from low sample sizes.`))},
      ],
    },
    {
      heading: "Top 20 Most Affordable Active Markets",
      content: [
        ${JSON.stringify(escapeTs(table))},
        ${JSON.stringify(escapeTs(top30[0] ? `At just ${fmtPrice(top30[0].stats.medianPrice)}, ${titleCase(top30[0].townSlug)} in ${titleCase(top30[0].countySlug)} offers the lowest entry point among active markets. With ${top30[0].stats.transactionCount12m.toLocaleString("en-GB")} transactions in the past year, it is far from a dormant market.` : ""))},
      ],
    },
    {
      heading: "Regional Breakdown",
      content: [
        ${JSON.stringify(escapeTs(`The most affordable active markets cluster in several key regions:`))},
        ${JSON.stringify(escapeTs(regionSections.join("<br/><br/>")))},
      ],
    },
    {
      heading: "The Developer Opportunity",
      content: [
        ${JSON.stringify(escapeTs(`Low median prices mean lower land acquisition costs, which reduces the equity required to start a scheme. A first-time developer targeting a small conversion or new-build project in a sub-${fmtPrice(150000)} market might need as little as £30,000–£50,000 in equity when combined with <a href="/services/development-finance">development finance</a> at 65–70% LTV.`))},
        ${JSON.stringify(escapeTs(`The gap between acquisition cost and gross development value (GDV) tends to be proportionally wider in affordable markets, particularly for conversion and change-of-use schemes. A terraced house purchased for ${fmtPrice(top30[0]?.stats.medianPrice || 80000)} and converted into two flats can generate meaningful returns even at modest sale prices.`))},
      ],
    },
    {
      heading: "Getting Started",
      content: [
        ${JSON.stringify(escapeTs(`First-time developers should focus on markets with both affordability and liquidity. Transaction counts above 50 per year suggest strong buyer demand, making exit strategies more reliable. Pair this with <a href="/services/bridging-loans">bridging finance</a> for acquisition and <a href="/services/development-finance">development finance</a> for the build.`))},
        ${JSON.stringify(escapeTs(`Construction Capital specialises in helping first-time developers secure funding. Submit your scheme via our <a href="/deal-room">deal room</a> and we will match you with appropriate lenders.`))},
      ],
    },
  ],
  faqs: [
    {
      question: "Where is the cheapest place to develop property in England?",
      answer: ${JSON.stringify(escapeTs(top30[0] ? `Based on Land Registry data, ${titleCase(top30[0].townSlug)} in ${titleCase(top30[0].countySlug)} has the lowest median price at ${fmtPrice(top30[0].stats.medianPrice)} among towns with more than 20 transactions in the past 12 months.` : "Data pending."))},
    },
    {
      question: "How much equity do first-time developers need?",
      answer: "This depends on the scheme size and lender, but in affordable markets with median prices under £150,000, a small conversion project might require £30,000–£50,000 in equity when combined with development finance at 65–70% loan-to-value.",
    },
    {
      question: "Are cheap property markets risky for developers?",
      answer: "Not necessarily. Low prices reduce acquisition risk, and towns with high transaction volumes confirm active buyer demand. The key is ensuring realistic appraisals and choosing a market with genuine liquidity rather than one with low prices due to lack of demand.",
    },
  ],
  relatedReportSlugs: ${JSON.stringify(relatedCountySlugs)},
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "mezzanine-finance"],
  charts: {
    townPrices: ${JSON.stringify(chartData)},
  },
};

export default report;
`;

  return report;
}

function buildNewBuildPremiumReport(towns: TownRecord[], counties: CountyAggregate[]): string {
  console.log("  Building: new-build-premium-report-q1-2026");

  const countiesWithNewBuild = counties
    .filter((c) => c.totalNewBuild >= 5)
    .sort((a, b) => b.avgNewBuildPremium - a.avgNewBuildPremium);

  const topPremium = countiesWithNewBuild.slice(0, 15);
  const bottomPremium = [...countiesWithNewBuild].sort((a, b) => a.avgNewBuildPremium - b.avgNewBuildPremium).slice(0, 10);

  const totalNewBuild = counties.reduce((s, c) => s + c.totalNewBuild, 0);
  const totalExisting = counties.reduce((s, c) => s + c.totalExisting, 0);
  const nationalNewBuildPct = ((totalNewBuild / (totalNewBuild + totalExisting)) * 100).toFixed(1);

  const premiumTableRows = topPremium
    .map(
      (c, i) =>
        `<tr><td>${i + 1}</td><td>${countyReportLink(c.countySlug)}</td><td>${fmtPct(c.avgNewBuildPremium)}</td><td>${c.totalNewBuild.toLocaleString("en-GB")}</td><td>${fmtPrice(c.medianPrice)}</td></tr>`
    )
    .join("");
  const premiumTable = `<table><thead><tr><th>#</th><th>County</th><th>New Build Premium</th><th>New Build Sales</th><th>Median Price</th></tr></thead><tbody>${premiumTableRows}</tbody></table>`;

  const discountTableRows = bottomPremium
    .filter((c) => c.avgNewBuildPremium < 0)
    .map(
      (c, i) =>
        `<tr><td>${i + 1}</td><td>${countyReportLink(c.countySlug)}</td><td>${fmtPct(c.avgNewBuildPremium)}</td><td>${c.totalNewBuild.toLocaleString("en-GB")}</td><td>${fmtPrice(c.medianPrice)}</td></tr>`
    )
    .join("");
  const discountTable = discountTableRows
    ? `<table><thead><tr><th>#</th><th>County</th><th>New Build Premium</th><th>New Build Sales</th><th>Median Price</th></tr></thead><tbody>${discountTableRows}</tbody></table>`
    : "";

  const chartData = topPremium.slice(0, 15).map((c) => ({
    name: titleCase(c.countySlug),
    value: parseFloat(c.avgNewBuildPremium.toFixed(1)),
  }));

  const relatedCountySlugs = topPremium.slice(0, 5).map((c) => `${c.countySlug}-property-market`);

  const report = `import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "new-build-premium-report-q1-2026",
  title: "UK New Build Premium Report Q1 2026",
  metaTitle: "New Build Premium Report Q1 2026 | County-by-County Price Gaps",
  metaDescription: "Press-ready analysis of new build vs existing property price premiums across England and Wales. County-level rankings showing where new builds command the highest margins.",
  excerpt: "${totalNewBuild.toLocaleString("en-GB")} new build transactions analysed. County-by-county premium rankings.",
  category: "thematic",
  datePublished: "${DATE}",
  dateModified: "${DATE}",
  readingTime: "5 min read",
  sections: [
    {
      heading: "The New Build Premium Landscape",
      content: [
        ${JSON.stringify(escapeTs(`Across ${counties.length} counties, ${totalNewBuild.toLocaleString("en-GB")} new build transactions were recorded in the past 12 months — representing ${nationalNewBuildPct}% of all residential sales. But the premium buyers pay for new build over existing stock varies dramatically by location.`))},
        ${JSON.stringify(escapeTs(`This report analyses the average new build premium at county level, revealing where developers can command the highest margins — and where new build stock is, surprisingly, selling at a discount to existing properties.`))},
      ],
    },
    {
      heading: "Highest New Build Premiums by County",
      content: [
        ${JSON.stringify(escapeTs(premiumTable))},
        ${JSON.stringify(escapeTs(topPremium[0] ? `${titleCase(topPremium[0].countySlug)} tops the table with an average new build premium of <strong>${fmtPct(topPremium[0].avgNewBuildPremium)}</strong>. For developers, this translates directly into higher profit margins on new-build schemes funded with <a href="/services/development-finance">development finance</a>.` : ""))},
      ],
    },
    ${discountTable ? `{
      heading: "Where New Builds Sell at a Discount",
      content: [
        ${JSON.stringify(escapeTs(discountTable))},
        ${JSON.stringify(escapeTs(`A negative new build premium does not necessarily indicate a poor market for developers. It often reflects the mix of new build stock — for example, a county dominated by new-build flats will show a lower average price than one dominated by detached houses. Context matters.`))},
      ],
    },` : `{
      heading: "Markets with Minimal Premiums",
      content: [
        ${JSON.stringify(escapeTs(`Several counties show new build premiums close to zero, suggesting developers should focus on build quality differentiation and specification to command higher prices.`))},
      ],
    },`}
    {
      heading: "Implications for Development Appraisals",
      content: [
        ${JSON.stringify(escapeTs(`The new build premium is a critical input to any development appraisal. In counties where premiums exceed 15%, developers can afford to pay more for land and still achieve target margins. Where premiums are thin or negative, the focus shifts to build cost efficiency and exit strategy.`))},
        ${JSON.stringify(escapeTs(`Lenders structuring <a href="/services/development-finance">development finance</a> will scrutinise the assumed end values carefully. In high-premium counties, comparable evidence for new build pricing is readily available. In low-premium areas, valuers may take a more cautious approach.`))},
      ],
    },
    {
      heading: "Funding Your New Build Scheme",
      content: [
        ${JSON.stringify(escapeTs(`Whether you are targeting a high-premium county or seeking to unlock value in a competitive market, the right finance structure makes all the difference. <a href="/services/mezzanine-finance">Mezzanine finance</a> can top up senior debt in high-value schemes, whilst <a href="/services/bridging-loans">bridging loans</a> enable rapid site acquisition.`))},
        ${JSON.stringify(escapeTs(`Submit your scheme via our <a href="/deal-room">deal room</a> and we will source the most competitive terms from our panel of 100+ lenders.`))},
      ],
    },
  ],
  faqs: [
    {
      question: "What is the average new build premium in England and Wales?",
      answer: ${JSON.stringify(escapeTs((() => {
        const allPremiums = countiesWithNewBuild.map((c) => c.avgNewBuildPremium);
        const avg = allPremiums.reduce((s, v) => s + v, 0) / allPremiums.length;
        return `Based on our analysis of ${totalNewBuild.toLocaleString("en-GB")} new build transactions, the average county-level new build premium is ${fmtPct(avg)}.`;
      })()))},
    },
    {
      question: "Where do new builds command the highest premiums?",
      answer: ${JSON.stringify(escapeTs(topPremium[0] ? `${titleCase(topPremium[0].countySlug)} has the highest average new build premium at ${fmtPct(topPremium[0].avgNewBuildPremium)}, based on ${topPremium[0].totalNewBuild.toLocaleString("en-GB")} new build transactions in the past 12 months.` : "Data pending."))},
    },
    {
      question: "Does a negative new build premium mean developers lose money?",
      answer: "Not necessarily. A negative premium at county level can reflect the mix of new build stock — for example, predominantly flatted schemes in a county where detached houses set the benchmark. Individual scheme profitability depends on build costs, land price, and local demand.",
    },
  ],
  relatedReportSlugs: ${JSON.stringify(relatedCountySlugs)},
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "mezzanine-finance"],
  charts: {
    townYoyChange: ${JSON.stringify(chartData)},
  },
};

export default report;
`;

  return report;
}

function buildPlanningPipelineReport(planning: PlanningData[], towns: TownRecord[]): string {
  console.log("  Building: planning-pipeline-hotspots-2026");

  // Build a lookup for sold data
  const soldLookup = new Map<string, TownRecord>();
  for (const t of towns) {
    soldLookup.set(`${t.countySlug}/${t.townSlug}`, t);
  }

  // Sort by total estimated GDV
  const sortedByGdv = [...planning]
    .filter((p) => p.summary.totalEstimatedGDV > 0)
    .sort((a, b) => b.summary.totalEstimatedGDV - a.summary.totalEstimatedGDV);

  const sortedByUnits = [...planning]
    .filter((p) => p.summary.totalUnits > 0)
    .sort((a, b) => b.summary.totalUnits - a.summary.totalUnits);

  const totalGdv = planning.reduce((s, p) => s + p.summary.totalEstimatedGDV, 0);
  const totalUnits = planning.reduce((s, p) => s + p.summary.totalUnits, 0);
  const totalApps = planning.reduce((s, p) => s + p.summary.relevant, 0);
  const totalApproved = planning.reduce((s, p) => s + p.summary.approved, 0);
  const totalPending = planning.reduce((s, p) => s + p.summary.pending, 0);

  // Category breakdown from applications
  const categories = new Map<string, { count: number; units: number }>();
  for (const p of planning) {
    for (const app of [...p.approvedApplications, ...p.pendingApplications]) {
      const cat = app.category || "other_relevant";
      const existing = categories.get(cat) || { count: 0, units: 0 };
      existing.count++;
      existing.units += app.units || 0;
      categories.set(cat, existing);
    }
  }

  const gdvTableRows = sortedByGdv
    .slice(0, 15)
    .map(
      (p, i) =>
        `<tr><td>${i + 1}</td><td>${townLink(p.countySlug, p.townSlug)}</td><td>${countyReportLink(p.countySlug)}</td><td>${fmtBigNumber(p.summary.totalEstimatedGDV)}</td><td>${p.summary.totalUnits.toLocaleString("en-GB")}</td><td>${p.summary.relevant.toLocaleString("en-GB")}</td></tr>`
    )
    .join("");
  const gdvTable = `<table><thead><tr><th>#</th><th>Town</th><th>County</th><th>Pipeline GDV</th><th>Total Units</th><th>Applications</th></tr></thead><tbody>${gdvTableRows}</tbody></table>`;

  const categoryRows: string[] = [];
  const catNames: Record<string, string> = {
    new_build: "New Build",
    conversion: "Conversion",
    change_of_use: "Change of Use",
    extension: "Extension",
    other_relevant: "Other Relevant",
  };
  for (const [cat, data] of categories) {
    categoryRows.push(`<strong>${catNames[cat] || titleCase(cat)}:</strong> ${data.count.toLocaleString("en-GB")} applications, ${data.units.toLocaleString("en-GB")} units`);
  }

  const chartData = sortedByGdv.slice(0, 15).map((p) => ({
    name: titleCase(p.townSlug),
    value: Math.round(p.summary.totalEstimatedGDV / 1_000_000),
  }));

  const planningCounties = [...new Set(planning.map((p) => p.countySlug))];
  const relatedCountySlugs = planningCounties.slice(0, 5).map((c) => `${c}-property-market`);

  const report = `import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "planning-pipeline-hotspots-2026",
  title: "Planning Approval Hotspots: Where Developers Are Building in 2026",
  metaTitle: "Planning Pipeline Hotspots 2026 | GDV Rankings & Approval Rates",
  metaDescription: "Analysis of planning pipelines across ${planningCounties.length} counties. Ranked by estimated GDV, approved units, and development category breakdown.",
  excerpt: "${fmtBigNumber(totalGdv)} pipeline GDV across ${totalApps.toLocaleString("en-GB")} applications in ${planningCounties.length} counties.",
  category: "thematic",
  datePublished: "${DATE}",
  dateModified: "${DATE}",
  readingTime: "5 min read",
  sections: [
    {
      heading: "The 2026 Planning Pipeline",
      content: [
        ${JSON.stringify(escapeTs(`Across ${planningCounties.length} counties with planning data — ${planningCounties.map((c) => countyReportLink(c)).join(", ")} — we identified <strong>${totalApps.toLocaleString("en-GB")}</strong> relevant planning applications with a combined estimated gross development value (GDV) of <strong>${fmtBigNumber(totalGdv)}</strong> and <strong>${totalUnits.toLocaleString("en-GB")}</strong> residential units in the pipeline.`))},
        ${JSON.stringify(escapeTs(`Of these, ${totalApproved.toLocaleString("en-GB")} have been approved and ${totalPending.toLocaleString("en-GB")} are awaiting decision.`))},
      ],
    },
    {
      heading: "Top Towns by Pipeline GDV",
      content: [
        ${JSON.stringify(escapeTs(gdvTable))},
        ${JSON.stringify(escapeTs(sortedByGdv[0] ? `${titleCase(sortedByGdv[0].townSlug)} leads with an estimated pipeline GDV of <strong>${fmtBigNumber(sortedByGdv[0].summary.totalEstimatedGDV)}</strong> across ${sortedByGdv[0].summary.totalUnits.toLocaleString("en-GB")} units. This signals significant developer confidence in the area and substantial demand for <a href="/services/development-finance">development finance</a>.` : ""))},
      ],
    },
    {
      heading: "Development Category Breakdown",
      content: [
        ${JSON.stringify(escapeTs(`The planning pipeline breaks down by development type as follows:`))},
        ${JSON.stringify(escapeTs(categoryRows.join("<br/>")))},
        ${JSON.stringify(escapeTs(`Conversion and change-of-use schemes often offer faster routes to completion and may be funded with <a href="/services/bridging-loans">bridging finance</a> for acquisition followed by <a href="/services/development-finance">development finance</a> for the build.`))},
      ],
    },
    {
      heading: "Implications for Development Finance",
      content: [
        ${JSON.stringify(escapeTs(`A strong planning pipeline indicates where lenders are likely to have appetite. Towns with high GDV pipelines typically attract more valuer activity, creating better comparable evidence for loan applications. For developers seeking <a href="/services/mezzanine-finance">mezzanine finance</a> to stretch their equity, demonstrable local demand is a key factor in lender appetite.`))},
        ${JSON.stringify(escapeTs(`Submit your planning-approved scheme via our <a href="/deal-room">deal room</a> to access competitive development finance terms from 100+ lenders.`))},
      ],
    },
  ],
  faqs: [
    {
      question: "Which town has the largest planning pipeline in 2026?",
      answer: ${JSON.stringify(escapeTs(sortedByGdv[0] ? `${titleCase(sortedByGdv[0].townSlug)} in ${titleCase(sortedByGdv[0].countySlug)} has the largest pipeline by estimated GDV at ${fmtBigNumber(sortedByGdv[0].summary.totalEstimatedGDV)}, with ${sortedByGdv[0].summary.totalUnits.toLocaleString("en-GB")} residential units.` : "Data pending."))},
    },
    {
      question: "How many planning applications are in the pipeline?",
      answer: ${JSON.stringify(escapeTs(`Across ${planningCounties.length} counties analysed, there are ${totalApps.toLocaleString("en-GB")} relevant planning applications with an estimated total GDV of ${fmtBigNumber(totalGdv)}.`))},
    },
    {
      question: "Does planning approval help secure development finance?",
      answer: "Yes. Planning approval is typically a prerequisite for development finance. Lenders view approved schemes as lower risk, which can result in better terms, higher LTV ratios, and more competitive interest rates.",
    },
  ],
  relatedReportSlugs: ${JSON.stringify(relatedCountySlugs)},
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "mezzanine-finance"],
  charts: {
    townPrices: ${JSON.stringify(chartData)},
  },
};

export default report;
`;

  return report;
}

function buildPropertyTypeGapsReport(towns: TownRecord[], counties: CountyAggregate[]): string {
  console.log("  Building: property-type-price-gaps-2026");

  const countiesWithBoth = counties
    .filter((c) => c.medianDetached > 0 && c.medianFlat > 0)
    .map((c) => ({
      ...c,
      gap: c.medianDetached - c.medianFlat,
      gapPct: ((c.medianDetached - c.medianFlat) / c.medianFlat) * 100,
    }))
    .sort((a, b) => b.gap - a.gap);

  const topGap = countiesWithBoth.slice(0, 15);
  const bottomGap = [...countiesWithBoth].sort((a, b) => a.gap - b.gap).slice(0, 10);

  // National averages
  const allDetached = towns.map((t) => t.stats.medianByType["D"]).filter((p) => p && p > 0);
  const allSemi = towns.map((t) => t.stats.medianByType["S"]).filter((p) => p && p > 0);
  const allTerraced = towns.map((t) => t.stats.medianByType["T"]).filter((p) => p && p > 0);
  const allFlat = towns.map((t) => t.stats.medianByType["F"]).filter((p) => p && p > 0);

  const nationalDetached = median(allDetached);
  const nationalSemi = median(allSemi);
  const nationalTerraced = median(allTerraced);
  const nationalFlat = median(allFlat);

  const topTableRows = topGap
    .map(
      (c, i) =>
        `<tr><td>${i + 1}</td><td>${countyReportLink(c.countySlug)}</td><td>${fmtPrice(c.medianDetached)}</td><td>${fmtPrice(c.medianFlat)}</td><td>${fmtPrice(c.gap)}</td><td>${fmtPct(c.gapPct)}</td></tr>`
    )
    .join("");
  const topTable = `<table><thead><tr><th>#</th><th>County</th><th>Detached Median</th><th>Flat Median</th><th>Gap (£)</th><th>Gap (%)</th></tr></thead><tbody>${topTableRows}</tbody></table>`;

  const bottomTableRows = bottomGap
    .map(
      (c, i) =>
        `<tr><td>${i + 1}</td><td>${countyReportLink(c.countySlug)}</td><td>${fmtPrice(c.medianDetached)}</td><td>${fmtPrice(c.medianFlat)}</td><td>${fmtPrice(c.gap)}</td><td>${fmtPct(c.gapPct)}</td></tr>`
    )
    .join("");
  const bottomTable = `<table><thead><tr><th>#</th><th>County</th><th>Detached Median</th><th>Flat Median</th><th>Gap (£)</th><th>Gap (%)</th></tr></thead><tbody>${bottomTableRows}</tbody></table>`;

  const chartData = [
    { name: "Detached", value: nationalDetached },
    { name: "Semi-Detached", value: nationalSemi },
    { name: "Terraced", value: nationalTerraced },
    { name: "Flat", value: nationalFlat },
  ];

  const relatedCountySlugs = topGap.slice(0, 5).map((c) => `${c.countySlug}-property-market`);

  const report = `import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "property-type-price-gaps-2026",
  title: "Mind the Gap: Detached vs Flat Price Differentials Across England 2026",
  metaTitle: "Detached vs Flat Price Gaps 2026 | County Rankings for Developers",
  metaDescription: "County-by-county analysis of the price gap between detached houses and flats. Where the biggest differentials create opportunities for conversion and subdivision developers.",
  excerpt: "National gap: ${fmtPrice(nationalDetached - nationalFlat)}. County rankings from widest to narrowest spread.",
  category: "thematic",
  datePublished: "${DATE}",
  dateModified: "${DATE}",
  readingTime: "5 min read",
  sections: [
    {
      heading: "The Price Type Spectrum",
      content: [
        ${JSON.stringify(escapeTs(`Across England and Wales, the national median prices by property type are: <strong>Detached ${fmtPrice(nationalDetached)}</strong>, Semi-Detached ${fmtPrice(nationalSemi)}, Terraced ${fmtPrice(nationalTerraced)}, and Flats ${fmtPrice(nationalFlat)}. The gap between detached and flat values — ${fmtPrice(nationalDetached - nationalFlat)} or ${((((nationalDetached - nationalFlat) / nationalFlat) * 100)).toFixed(0)}% — represents a key metric for developers considering conversion and subdivision schemes.`))},
      ],
    },
    {
      heading: "Widest Price Gaps by County",
      content: [
        ${JSON.stringify(escapeTs(topTable))},
        ${JSON.stringify(escapeTs(topGap[0] ? `${titleCase(topGap[0].countySlug)} has the widest detached-to-flat gap at <strong>${fmtPrice(topGap[0].gap)}</strong> (${fmtPct(topGap[0].gapPct)}). In these counties, converting a large detached house into flats can unlock significant value — provided planning consent is achievable and the local flat market has sufficient demand.` : ""))},
      ],
    },
    {
      heading: "Narrowest Price Gaps",
      content: [
        ${JSON.stringify(escapeTs(bottomTable))},
        ${JSON.stringify(escapeTs(`Counties with narrow gaps typically have either high flat values (such as London) or low detached prices. In these markets, subdivision may not generate sufficient uplift to justify the conversion costs, and developers should consider alternative strategies such as new build or refurbishment.`))},
      ],
    },
    {
      heading: "The Conversion Opportunity",
      content: [
        ${JSON.stringify(escapeTs(`Where the detached-to-flat gap exceeds 200%, developers can potentially acquire a detached property, convert it into multiple flats, and generate a combined GDV that significantly exceeds the purchase price. This strategy works best when paired with <a href="/services/development-finance">development finance</a> for the conversion works and <a href="/services/bridging-loans">bridging finance</a> for the initial acquisition.`))},
        ${JSON.stringify(escapeTs(`Planning consent for conversion and subdivision can be more straightforward than new build in many areas, as the external appearance of the building may be largely unchanged. Check local authority policies in your target area before committing.`))},
      ],
    },
    {
      heading: "Finance Your Conversion Scheme",
      content: [
        ${JSON.stringify(escapeTs(`Construction Capital can source <a href="/services/development-finance">development finance</a> for conversion projects from £150,000 to £25m+. Whether you are converting a single house into flats or tackling a commercial-to-residential change of use, we will find the right lender. <a href="/services/mezzanine-finance">Mezzanine finance</a> can top up your equity position where the gap between senior debt and total costs needs bridging.`))},
        ${JSON.stringify(escapeTs(`Submit your scheme via our <a href="/deal-room">deal room</a> for a no-obligation quote.`))},
      ],
    },
  ],
  faqs: [
    {
      question: "Where is the biggest price gap between detached houses and flats?",
      answer: ${JSON.stringify(escapeTs(topGap[0] ? `${titleCase(topGap[0].countySlug)} has the widest gap at ${fmtPrice(topGap[0].gap)}, with detached houses at a median of ${fmtPrice(topGap[0].medianDetached)} versus flats at ${fmtPrice(topGap[0].medianFlat)}.` : "Data pending."))},
    },
    {
      question: "Is converting a house into flats profitable?",
      answer: "It can be highly profitable in counties where the detached-to-flat price gap exceeds 200%. The key factors are purchase price, conversion costs, planning consent, and local flat demand. A development appraisal should always be run before committing.",
    },
    {
      question: "What finance is available for conversion projects?",
      answer: "Development finance is the primary product for conversion projects, typically covering 65-75% of costs. Bridging loans can fund the initial acquisition, and mezzanine finance can top up the equity position for larger schemes.",
    },
  ],
  relatedReportSlugs: ${JSON.stringify(relatedCountySlugs)},
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "mezzanine-finance"],
  charts: {
    priceByType: ${JSON.stringify(chartData)},
  },
};

export default report;
`;

  return report;
}

function buildBarometerReport(
  towns: TownRecord[],
  counties: CountyAggregate[],
  planning: PlanningData[]
): string {
  console.log("  Building: development-market-barometer-q1-2026");

  const totalTransactions = towns.reduce((s, t) => s + t.stats.transactionCount12m, 0);
  const nationalMedian = median(towns.filter((t) => t.stats.medianPrice > 0).map((t) => t.stats.medianPrice));
  const yoyValues = towns.filter((t) => t.stats.transactionCount12m > 10).map((t) => t.stats.yoyChange);
  const avgYoy = yoyValues.reduce((s, v) => s + v, 0) / yoyValues.length;
  const totalNewBuild = towns.reduce((s, t) => s + t.stats.newBuildCount, 0);
  const totalExisting = towns.reduce((s, t) => s + t.stats.existingCount, 0);
  const risingCount = yoyValues.filter((v) => v > 0).length;
  const fallingCount = yoyValues.filter((v) => v < 0).length;

  // Regional aggregation
  const regionData: {
    region: string;
    transactions: number;
    medianPrice: number;
    avgYoy: number;
    newBuild: number;
    countyCount: number;
  }[] = [];

  for (const [region, regionCounties] of Object.entries(REGION_MAP)) {
    const rCounties = counties.filter((c) => regionCounties.includes(c.countySlug));
    if (rCounties.length === 0) continue;
    const rTransactions = rCounties.reduce((s, c) => s + c.totalTransactions, 0);
    const rPrices = rCounties.map((c) => c.medianPrice).filter((p) => p > 0);
    const rYoy = rCounties.map((c) => c.avgYoyChange);
    const rNewBuild = rCounties.reduce((s, c) => s + c.totalNewBuild, 0);
    regionData.push({
      region,
      transactions: rTransactions,
      medianPrice: median(rPrices),
      avgYoy: rYoy.reduce((s, v) => s + v, 0) / rYoy.length,
      newBuild: rNewBuild,
      countyCount: rCounties.length,
    });
  }

  regionData.sort((a, b) => b.transactions - a.transactions);

  const regionTableRows = regionData
    .map(
      (r) =>
        `<tr><td>${r.region}</td><td>${r.transactions.toLocaleString("en-GB")}</td><td>${fmtPrice(r.medianPrice)}</td><td>${fmtPct(r.avgYoy)}</td><td>${r.newBuild.toLocaleString("en-GB")}</td><td>${r.countyCount}</td></tr>`
    )
    .join("");
  const regionTable = `<table><thead><tr><th>Region</th><th>Transactions</th><th>Median Price</th><th>Avg YoY</th><th>New Builds</th><th>Counties</th></tr></thead><tbody>${regionTableRows}</tbody></table>`;

  // Planning summary
  const totalPlanningGdv = planning.reduce((s, p) => s + p.summary.totalEstimatedGDV, 0);
  const totalPlanningUnits = planning.reduce((s, p) => s + p.summary.totalUnits, 0);
  const totalPlanningApps = planning.reduce((s, p) => s + p.summary.relevant, 0);
  const planningCounties = [...new Set(planning.map((p) => p.countySlug))];

  const chartData = regionData.map((r) => ({
    name: r.region,
    value: parseFloat(r.avgYoy.toFixed(1)),
  }));

  const topRegion = regionData[0];
  const relatedCountySlugs = regionData
    .slice(0, 3)
    .flatMap((r) => {
      const regionCounties = REGION_MAP[r.region] || [];
      return regionCounties.slice(0, 2).map((c) => `${c}-property-market`);
    })
    .slice(0, 5);

  const report = `import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "development-market-barometer-q1-2026",
  title: "Development Finance Market Barometer Q1 2026",
  metaTitle: "Development Finance Market Barometer Q1 2026 | National Overview",
  metaDescription: "Comprehensive national overview of the UK development market in Q1 2026. Regional breakdowns, transaction volumes, price trends, and planning pipeline analysis.",
  excerpt: "${totalTransactions.toLocaleString("en-GB")} transactions, ${fmtPrice(nationalMedian)} national median, ${fmtPct(avgYoy)} average YoY.",
  category: "thematic",
  datePublished: "${DATE}",
  dateModified: "${DATE}",
  readingTime: "6 min read",
  sections: [
    {
      heading: "National Market Snapshot",
      content: [
        ${JSON.stringify(escapeTs(`The UK development market in Q1 2026 is characterised by <strong>${totalTransactions.toLocaleString("en-GB")}</strong> residential transactions in the past 12 months across ${counties.length} counties. The national median price stands at <strong>${fmtPrice(nationalMedian)}</strong>, with an average year-on-year change of <strong>${fmtPct(avgYoy)}</strong>.`))},
        ${JSON.stringify(escapeTs(`Of towns with meaningful transaction volumes, <strong>${risingCount}</strong> are recording price growth and <strong>${fallingCount}</strong> are seeing declines. New build activity accounts for ${totalNewBuild.toLocaleString("en-GB")} of ${(totalNewBuild + totalExisting).toLocaleString("en-GB")} total transactions (${((totalNewBuild / (totalNewBuild + totalExisting)) * 100).toFixed(1)}%).`))},
      ],
    },
    {
      heading: "Regional Performance",
      content: [
        ${JSON.stringify(escapeTs(regionTable))},
        ${JSON.stringify(escapeTs(topRegion ? `<strong>${topRegion.region}</strong> leads by transaction volume with ${topRegion.transactions.toLocaleString("en-GB")} sales across ${topRegion.countyCount} counties, at a median price of ${fmtPrice(topRegion.medianPrice)} and ${fmtPct(topRegion.avgYoy)} average year-on-year change.` : ""))},
      ],
    },
    {
      heading: "Planning Pipeline Overview",
      content: [
        ${JSON.stringify(escapeTs(`Across ${planningCounties.length} counties with planning data (${planningCounties.map((c) => countyReportLink(c)).join(", ")}), the development pipeline contains <strong>${totalPlanningApps.toLocaleString("en-GB")}</strong> relevant applications with an estimated total GDV of <strong>${fmtBigNumber(totalPlanningGdv)}</strong> and <strong>${totalPlanningUnits.toLocaleString("en-GB")}</strong> residential units.`))},
        ${JSON.stringify(escapeTs(`This pipeline signals continued developer confidence and sustained demand for <a href="/services/development-finance">development finance</a> across the South East and East of England in particular.`))},
      ],
    },
    {
      heading: "Lender Appetite and Market Conditions",
      content: [
        ${JSON.stringify(escapeTs(`Development finance lenders are broadly active in Q1 2026, with appetite strongest in regions showing stable or growing prices. Senior debt is typically available at 60–70% LTV (of GDV) for experienced developers, with rates from 7–10% per annum depending on scheme risk.`))},
        ${JSON.stringify(escapeTs(`For first-time developers or higher-risk schemes, <a href="/services/mezzanine-finance">mezzanine finance</a> can bridge the gap between senior debt and equity, enabling projects to proceed with less personal capital. <a href="/services/bridging-loans">Bridging loans</a> remain the go-to product for site acquisition ahead of planning or development finance drawdown.`))},
      ],
    },
    {
      heading: "Submit Your Scheme",
      content: [
        ${JSON.stringify(escapeTs(`The data in this barometer is drawn from Land Registry transaction records and local authority planning portals. For developers looking to capitalise on current market conditions, Construction Capital provides access to 100+ development finance lenders.`))},
        ${JSON.stringify(escapeTs(`Submit your scheme via our <a href="/deal-room">deal room</a> for a no-obligation quote, or explore our <a href="/services/development-finance">development finance</a> page to understand the options available.`))},
      ],
    },
  ],
  faqs: [
    {
      question: "What is the current average house price in England and Wales?",
      answer: ${JSON.stringify(escapeTs(`Based on Land Registry data across ${counties.length} counties and ${towns.length} towns, the national median price is ${fmtPrice(nationalMedian)} as of Q1 2026.`))},
    },
    {
      question: "Are house prices rising or falling in 2026?",
      answer: ${JSON.stringify(escapeTs(`It varies by location. Of towns with meaningful transaction volumes, ${risingCount} are seeing year-on-year growth and ${fallingCount} are experiencing declines. The national average year-on-year change is ${fmtPct(avgYoy)}.`))},
    },
    {
      question: "How much new build activity is there in the UK?",
      answer: ${JSON.stringify(escapeTs(`New build transactions account for ${totalNewBuild.toLocaleString("en-GB")} of ${(totalNewBuild + totalExisting).toLocaleString("en-GB")} total sales (${((totalNewBuild / (totalNewBuild + totalExisting)) * 100).toFixed(1)}%), based on Land Registry data across 48 counties.`))},
    },
  ],
  relatedReportSlugs: ${JSON.stringify(relatedCountySlugs)},
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "mezzanine-finance"],
  charts: {
    townYoyChange: ${JSON.stringify(chartData)},
  },
};

export default report;
`;

  return report;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Press Report Generator ===\n");

  // Load data
  console.log("Loading sold data...");
  const towns = loadAllSoldData();
  console.log(`  Loaded ${towns.length} towns from ${new Set(towns.map((t) => t.countySlug)).size} counties`);

  console.log("Loading planning data...");
  const planning = loadAllPlanningData();
  console.log(`  Loaded ${planning.length} towns from ${new Set(planning.map((p) => p.countySlug)).size} counties`);

  console.log("Aggregating county data...");
  const counties = aggregateByCounty(towns);
  console.log(`  Aggregated ${counties.length} counties\n`);

  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate reports
  console.log("Generating reports...");

  const reports: { filename: string; content: string }[] = [
    {
      filename: "fastest-growing-markets-q1-2026.ts",
      content: buildFastestGrowingReport(towns),
    },
    {
      filename: "affordable-development-hotspots-2026.ts",
      content: buildAffordableHotspotsReport(towns),
    },
    {
      filename: "new-build-premium-report-q1-2026.ts",
      content: buildNewBuildPremiumReport(towns, counties),
    },
    {
      filename: "planning-pipeline-hotspots-2026.ts",
      content: buildPlanningPipelineReport(planning, towns),
    },
    {
      filename: "property-type-price-gaps-2026.ts",
      content: buildPropertyTypeGapsReport(towns, counties),
    },
    {
      filename: "development-market-barometer-q1-2026.ts",
      content: buildBarometerReport(towns, counties, planning),
    },
  ];

  for (const report of reports) {
    const filePath = path.join(OUTPUT_DIR, report.filename);
    fs.writeFileSync(filePath, report.content.trim() + "\n", "utf-8");
    console.log(`  ✓ ${report.filename}`);
  }

  // Generate barrel file
  console.log("\nGenerating barrel file...");
  const barrel = `import type { MarketReport } from "../../types";

import fastestGrowing from "./fastest-growing-markets-q1-2026";
import affordableHotspots from "./affordable-development-hotspots-2026";
import newBuildPremium from "./new-build-premium-report-q1-2026";
import planningPipeline from "./planning-pipeline-hotspots-2026";
import propertyTypeGaps from "./property-type-price-gaps-2026";
import barometer from "./development-market-barometer-q1-2026";

export const PRESS_REPORTS: MarketReport[] = [
  fastestGrowing,
  affordableHotspots,
  newBuildPremium,
  planningPipeline,
  propertyTypeGaps,
  barometer,
];
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, "index.ts"), barrel, "utf-8");
  console.log("  ✓ index.ts");

  console.log(`\nDone! Generated ${reports.length} reports + barrel file in ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
