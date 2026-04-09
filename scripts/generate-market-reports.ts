#!/usr/bin/env npx tsx
/**
 * Market Report Generator
 *
 * Reads Land Registry sold-data JSON files, aggregates per county and region,
 * then generates MarketReport TypeScript data files for cornerstone content.
 *
 * Usage: npx tsx scripts/generate-market-reports.ts
 */

import fs from "fs";
import path from "path";

// ── Types ──────────────────────────────────────────────────────────

interface SoldStats {
  medianPrice: number;
  medianByType: { D?: number; S?: number; T?: number; F?: number };
  transactionCount12m: number;
  yoyChange: number;
  newBuildCount: number;
  existingCount: number;
  newBuildPremium: number;
}

interface Transaction {
  price: number;
  date: string;
  postcode: string;
  propertyType: string;
  newBuild: boolean;
  tenure: string;
  address: string;
}

interface SoldData {
  updatedAt: string;
  townSlug: string;
  countySlug: string;
  stats: SoldStats;
  recentTransactions: Transaction[];
}

interface TownAgg {
  name: string;
  slug: string;
  countySlug: string;
  context: string;
  stats: SoldStats;
  topTransactions: Transaction[];
}

interface CountyAgg {
  name: string;
  slug: string;
  region: string;
  overview: string;
  drivers: string[];
  towns: TownAgg[];
  // Aggregated stats
  medianPrice: number;
  totalTransactions: number;
  avgYoyChange: number;
  totalNewBuilds: number;
  medianByType: { D?: number; S?: number; T?: number; F?: number };
  topTransactions: Transaction[];
}

interface RegionAgg {
  name: string;
  slug: string;
  counties: CountyAgg[];
  medianPrice: number;
  totalTransactions: number;
  avgYoyChange: number;
  totalNewBuilds: number;
}

interface ReportSection {
  heading: string;
  content: string[];
}

interface ReportFaq {
  question: string;
  answer: string;
}

interface MarketReport {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: "county" | "regional" | "thematic" | "town";
  region?: string;
  countySlug?: string;
  townSlug?: string;
  datePublished: string;
  dateModified: string;
  readingTime: string;
  sections: ReportSection[];
  faqs: ReportFaq[];
  relatedReportSlugs: string[];
  relatedTownSlugs: string[];
  relatedServiceSlugs: string[];
  charts?: {
    priceByType?: { name: string; value: number }[];
    townPrices?: { name: string; value: number }[];
    townYoyChange?: { name: string; value: number }[];
  };
}

// ── Paths ──────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "..");
const SOLD_DATA_DIR = path.join(ROOT, "data/generated/sold-data");
const OUTPUT_DIR = path.join(ROOT, "src/lib/market-reports/reports");

// ── Helpers ────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  D: "detached",
  S: "semi-detached",
  T: "terraced",
  F: "flat",
};

const TYPE_LABELS_UPPER: Record<string, string> = {
  D: "Detached",
  S: "Semi-detached",
  T: "Terraced",
  F: "Flat",
};

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}m`.replace(".00m", "m");
  return `£${Math.round(n).toLocaleString("en-GB")}`;
}

function formatPriceShort(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1000) return `£${Math.round(n / 1000)}k`;
  return `£${n}`;
}

function deslugify(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function regionSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function estimateReadingTime(sections: ReportSection[]): string {
  const words = sections.reduce((acc, s) => {
    return acc + s.content.reduce((a, p) => a + p.replace(/<[^>]*>/g, "").split(/\s+/).length, 0);
  }, 0);
  const mins = Math.max(5, Math.ceil(words / 200));
  return `${mins} min read`;
}

function townLink(countySlug: string, townSlug: string, townName: string): string {
  return `<a href="/locations/${countySlug}/${townSlug}">${townName}</a>`;
}

function serviceLink(slug: string, name: string): string {
  return `<a href="/services/${slug}">${name}</a>`;
}

function countyLink(slug: string, name: string): string {
  return `<a href="/locations/${slug}">${name}</a>`;
}

function reportLink(slug: string, name: string): string {
  return `<a href="/market-reports/${slug}">${name}</a>`;
}

function trendWord(yoy: number): string {
  if (yoy > 3) return "strong growth";
  if (yoy > 0) return "modest growth";
  if (yoy > -2) return "broadly stable";
  if (yoy > -5) return "a moderate decline";
  return "a notable decline";
}

function trendDirection(yoy: number): string {
  if (yoy > 0) return "rising";
  if (yoy === 0) return "flat";
  return "falling";
}

const TODAY = new Date().toISOString().split("T")[0];

// UK national benchmarks (approximate 2025/2026 values)
const NATIONAL_MEDIAN = 285000;
const NATIONAL_MEDIAN_BY_TYPE: Record<string, number> = {
  D: 420000,
  S: 265000,
  T: 230000,
  F: 225000,
};

// ── Load UK Counties Data ──────────────────────────────────────────

interface CountyDataRaw {
  name: string;
  slug: string;
  region: string;
  overview: string;
  drivers: string[];
  towns: { name: string; slug: string; context: string }[];
}

function loadUkCounties(): CountyDataRaw[] {
  // We'll dynamically import or parse — since it's TS, let's read and extract via regex
  const filePath = path.join(ROOT, "src/lib/uk-locations-data.ts");
  // Use a simpler approach: require the compiled JS or use eval
  // Actually, we'll use tsx so we can import TS directly
  // But for a script, let's just read sold-data dirs and match to UK_COUNTIES
  // We need the county metadata — let's parse it
  const content = fs.readFileSync(filePath, "utf-8");

  const counties: CountyDataRaw[] = [];
  // Match county objects — find pattern: { name: "X", slug: "x", region: "R", overview: "...", drivers: [...], towns: [...] }
  // Use a simpler approach: extract each county block

  // Split by the county-level objects (they have region: and overview: fields)
  const blocks = content.split(/\n  \{[\s\n]*name:/);

  for (const block of blocks.slice(1)) {
    // Re-add what we split on
    const fullBlock = '{ name:' + block;
    const nameMatch = fullBlock.match(/name:\s*"([^"]+)"/);
    const slugMatch = fullBlock.match(/slug:\s*"([^"]+)"/);
    const regionMatch = fullBlock.match(/region:\s*"([^"]+)"/);
    const overviewMatch = fullBlock.match(/overview:\s*\n?\s*"([\s\S]*?)(?:(?<!\\)"\s*,)/);
    const driversMatch = fullBlock.match(/drivers:\s*\[([\s\S]*?)\]/);
    const townsBlock = fullBlock.match(/towns:\s*\[([\s\S]*?)\n\s*\]/);

    if (!nameMatch || !slugMatch || !regionMatch) continue;
    // Only county-level entries have region
    if (!regionMatch) continue;

    let overview = "";
    if (overviewMatch) {
      overview = overviewMatch[1].replace(/\s+/g, " ").trim();
    }

    const drivers: string[] = [];
    if (driversMatch) {
      const driverMatches = driversMatch[1].matchAll(/"([^"]+)"/g);
      for (const dm of driverMatches) {
        drivers.push(dm[1]);
      }
    }

    const towns: { name: string; slug: string; context: string }[] = [];
    if (townsBlock) {
      const townMatches = townsBlock[1].matchAll(
        /name:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?context:\s*"([^"]+)"/g
      );
      for (const tm of townMatches) {
        towns.push({ name: tm[1], slug: tm[2], context: tm[3] });
      }
    }

    counties.push({
      name: nameMatch[1],
      slug: slugMatch[1],
      region: regionMatch[1],
      overview,
      drivers,
      towns,
    });
  }

  return counties;
}

// ── Data Loading ───────────────────────────────────────────────────

function loadSoldData(): Map<string, Map<string, SoldData>> {
  const result = new Map<string, Map<string, SoldData>>();

  if (!fs.existsSync(SOLD_DATA_DIR)) {
    console.error("Sold data directory not found:", SOLD_DATA_DIR);
    process.exit(1);
  }

  const counties = fs.readdirSync(SOLD_DATA_DIR).filter((f) =>
    fs.statSync(path.join(SOLD_DATA_DIR, f)).isDirectory()
  );

  for (const county of counties) {
    const countyDir = path.join(SOLD_DATA_DIR, county);
    const towns = fs.readdirSync(countyDir).filter((f) =>
      fs.statSync(path.join(countyDir, f)).isDirectory()
    );

    const townMap = new Map<string, SoldData>();
    for (const town of towns) {
      const jsonPath = path.join(countyDir, town, "latest.json");
      if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as SoldData;
        townMap.set(town, data);
      }
    }
    result.set(county, townMap);
  }

  return result;
}

// ── Aggregation ────────────────────────────────────────────────────

function aggregateCounties(
  soldData: Map<string, Map<string, SoldData>>,
  ukCounties: CountyDataRaw[]
): CountyAgg[] {
  const countyMap = new Map(ukCounties.map((c) => [c.slug, c]));
  const results: CountyAgg[] = [];

  for (const [countySlug, townMap] of soldData) {
    const countyInfo = countyMap.get(countySlug);
    if (!countyInfo) continue; // Skip counties not in our data

    const towns: TownAgg[] = [];
    const allPrices: number[] = [];
    let totalTransactions = 0;
    let totalNewBuilds = 0;
    const yoyValues: number[] = [];
    const typeD: number[] = [];
    const typeS: number[] = [];
    const typeT: number[] = [];
    const typeF: number[] = [];
    const allTransactions: (Transaction & { townName: string; townSlug: string })[] = [];

    for (const [townSlug, data] of townMap) {
      const townInfo = countyInfo.towns.find((t) => t.slug === townSlug);
      if (!townInfo) continue;

      towns.push({
        name: townInfo.name,
        slug: townSlug,
        countySlug,
        context: townInfo.context,
        stats: data.stats,
        topTransactions: (data.recentTransactions || []).slice(0, 5),
      });

      allPrices.push(data.stats.medianPrice);
      totalTransactions += data.stats.transactionCount12m;
      totalNewBuilds += data.stats.newBuildCount;
      yoyValues.push(data.stats.yoyChange);

      if (data.stats.medianByType.D) typeD.push(data.stats.medianByType.D);
      if (data.stats.medianByType.S) typeS.push(data.stats.medianByType.S);
      if (data.stats.medianByType.T) typeT.push(data.stats.medianByType.T);
      if (data.stats.medianByType.F) typeF.push(data.stats.medianByType.F);

      for (const tx of (data.recentTransactions || []).slice(0, 10)) {
        allTransactions.push({ ...tx, townName: townInfo.name, townSlug });
      }
    }

    // Sort towns by name for consistency
    towns.sort((a, b) => a.name.localeCompare(b.name));

    // Get top transactions by price
    allTransactions.sort((a, b) => b.price - a.price);
    const topTx = allTransactions.slice(0, 8);

    results.push({
      name: countyInfo.name,
      slug: countySlug,
      region: countyInfo.region,
      overview: countyInfo.overview,
      drivers: countyInfo.drivers,
      towns,
      medianPrice: median(allPrices),
      totalTransactions,
      avgYoyChange: yoyValues.length > 0
        ? parseFloat((yoyValues.reduce((a, b) => a + b, 0) / yoyValues.length).toFixed(1))
        : 0,
      totalNewBuilds,
      medianByType: {
        ...(typeD.length > 0 ? { D: median(typeD) } : {}),
        ...(typeS.length > 0 ? { S: median(typeS) } : {}),
        ...(typeT.length > 0 ? { T: median(typeT) } : {}),
        ...(typeF.length > 0 ? { F: median(typeF) } : {}),
      },
      topTransactions: topTx,
    });
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

function aggregateRegions(counties: CountyAgg[]): RegionAgg[] {
  const regionMap = new Map<string, CountyAgg[]>();
  for (const county of counties) {
    const existing = regionMap.get(county.region) || [];
    existing.push(county);
    regionMap.set(county.region, existing);
  }

  const regions: RegionAgg[] = [];
  for (const [name, regionCounties] of regionMap) {
    const prices = regionCounties.map((c) => c.medianPrice);
    const totalTx = regionCounties.reduce((a, c) => a + c.totalTransactions, 0);
    const avgYoy = regionCounties.reduce((a, c) => a + c.avgYoyChange, 0) / regionCounties.length;
    const totalNB = regionCounties.reduce((a, c) => a + c.totalNewBuilds, 0);

    regions.push({
      name,
      slug: regionSlug(name),
      counties: regionCounties.sort((a, b) => a.name.localeCompare(b.name)),
      medianPrice: median(prices),
      totalTransactions: totalTx,
      avgYoyChange: parseFloat(avgYoy.toFixed(1)),
      totalNewBuilds: totalNB,
    });
  }

  return regions.sort((a, b) => a.name.localeCompare(b.name));
}

// ── County Report Generator ────────────────────────────────────────

function generateCountyReport(county: CountyAgg, allCounties: CountyAgg[]): MarketReport {
  const slug = `${county.slug}-property-market`;
  const regionCounties = allCounties.filter((c) => c.region === county.region && c.slug !== county.slug);
  const regionSlugStr = regionSlug(county.region);

  const sections: ReportSection[] = [];

  // 1. Market Overview
  const priceVsNational = county.medianPrice > NATIONAL_MEDIAN
    ? `${formatPriceShort(county.medianPrice - NATIONAL_MEDIAN)} above`
    : county.medianPrice < NATIONAL_MEDIAN
    ? `${formatPriceShort(NATIONAL_MEDIAN - county.medianPrice)} below`
    : "in line with";

  sections.push({
    heading: `${county.name} Property Market Overview`,
    content: [
      `${county.overview}`,
      `The ${countyLink(county.slug, county.name)} property market recorded <strong>${county.totalTransactions.toLocaleString("en-GB")}</strong> residential transactions over the past 12 months, with a median sale price of <strong>${formatPrice(county.medianPrice)}</strong> — ${priceVsNational} the UK national median of ${formatPrice(NATIONAL_MEDIAN)}. Prices have shown ${trendWord(county.avgYoyChange)}, with a year-on-year change of <strong>${county.avgYoyChange > 0 ? "+" : ""}${county.avgYoyChange}%</strong> across the county's principal towns.`,
      county.drivers.length > 0
        ? `Key drivers of the ${county.name} property market include ${county.drivers.slice(0, 3).join(", ")}.${county.drivers.length > 3 ? ` Additional factors include ${county.drivers.slice(3).join(" and ")}.` : ""}`
        : "",
    ].filter(Boolean),
  });

  // 2. Price Analysis by Property Type
  const typeEntries = Object.entries(county.medianByType)
    .filter(([, v]) => v && v > 0)
    .sort(([, a], [, b]) => (b || 0) - (a || 0));

  const typeRows = typeEntries.map(([type, price]) => {
    const national = NATIONAL_MEDIAN_BY_TYPE[type] || 0;
    const diff = price! - national;
    const diffStr = diff > 0 ? `+${formatPriceShort(diff)}` : `-${formatPriceShort(Math.abs(diff))}`;
    return `<tr><td><strong>${TYPE_LABELS_UPPER[type] || type}</strong></td><td>${formatPrice(price!)}</td><td>${national > 0 ? formatPrice(national) : "N/A"}</td><td>${national > 0 ? diffStr : "—"}</td></tr>`;
  });

  const dominantType = typeEntries.length > 0 ? TYPE_LABELS[typeEntries[0][0]] : "detached";
  const mostAffordable = typeEntries.length > 0 ? TYPE_LABELS[typeEntries[typeEntries.length - 1][0]] : "flat";

  sections.push({
    heading: `${county.name} House Prices by Property Type`,
    content: [
      `Understanding price variation across property types is essential for developers assessing scheme viability in ${county.name}. The spread between the most and least expensive property types indicates the range of development opportunities available.`,
      typeRows.length > 0
        ? `<table><thead><tr><th>Property Type</th><th>${county.name} Median</th><th>UK Median</th><th>Difference</th></tr></thead><tbody>${typeRows.join("")}</tbody></table>`
        : "",
      typeEntries.length >= 2
        ? `${TYPE_LABELS_UPPER[typeEntries[0][0]]} homes command the highest prices at <strong>${formatPrice(typeEntries[0][1]!)}</strong>, while ${mostAffordable} properties offer the most accessible entry point at <strong>${formatPrice(typeEntries[typeEntries.length - 1][1]!)}</strong>. This ${formatPriceShort(typeEntries[0][1]! - typeEntries[typeEntries.length - 1][1]!)} spread suggests opportunities for developers converting or building across the type spectrum.`
        : "",
    ].filter(Boolean),
  });

  // 3. Town-by-Town Comparison
  const townsByPrice = [...county.towns].sort((a, b) => b.stats.medianPrice - a.stats.medianPrice);
  const townsByVolume = [...county.towns].sort((a, b) => b.stats.transactionCount12m - a.stats.transactionCount12m);
  const townsByGrowth = [...county.towns].sort((a, b) => b.stats.yoyChange - a.stats.yoyChange);

  const townRows = townsByPrice.map((t) =>
    `<tr><td>${townLink(county.slug, t.slug, t.name)}</td><td>${formatPrice(t.stats.medianPrice)}</td><td>${t.stats.transactionCount12m.toLocaleString("en-GB")}</td><td>${t.stats.yoyChange > 0 ? "+" : ""}${t.stats.yoyChange}%</td></tr>`
  );

  const top3Expensive = townsByPrice.slice(0, 3);
  const top3Affordable = townsByPrice.slice(-3).reverse();
  const top3Active = townsByVolume.slice(0, 3);

  sections.push({
    heading: `${county.name} Town-by-Town Price Comparison`,
    content: [
      `${county.name} encompasses ${county.towns.length} principal towns, each with distinct market characteristics. The table below ranks every town by median sale price, alongside transaction volume and annual price movement.`,
      `<table><thead><tr><th>Town</th><th>Median Price</th><th>Sales (12m)</th><th>YoY Change</th></tr></thead><tbody>${townRows.join("")}</tbody></table>`,
      `<strong>Most expensive:</strong> ${top3Expensive.map((t) => `${townLink(county.slug, t.slug, t.name)} (${formatPrice(t.stats.medianPrice)})`).join(", ")}. ${top3Expensive[0] ? `${top3Expensive[0].name}'s premium reflects ${top3Expensive[0].context.toLowerCase()}.` : ""}`,
      `<strong>Most affordable:</strong> ${top3Affordable.map((t) => `${townLink(county.slug, t.slug, t.name)} (${formatPrice(t.stats.medianPrice)})`).join(", ")}. These locations may offer stronger yields and lower entry costs for developers.`,
      `<strong>Most active:</strong> ${top3Active.map((t) => `${townLink(county.slug, t.slug, t.name)} (${t.stats.transactionCount12m.toLocaleString("en-GB")} sales)`).join(", ")}. High transaction volumes indicate strong liquidity — critical for exit strategy confidence.`,
    ],
  });

  // 4. New Build Market
  const newBuildTowns = [...county.towns]
    .filter((t) => t.stats.newBuildCount > 0)
    .sort((a, b) => b.stats.newBuildCount - a.stats.newBuildCount);

  const avgPremium = county.towns.length > 0
    ? county.towns
        .filter((t) => t.stats.newBuildPremium !== 0)
        .reduce((a, t) => a + t.stats.newBuildPremium, 0) /
      Math.max(1, county.towns.filter((t) => t.stats.newBuildPremium !== 0).length)
    : 0;

  const premiumWord = avgPremium > 0 ? "premium" : "discount";
  const newBuildPct = county.totalTransactions > 0
    ? ((county.totalNewBuilds / county.totalTransactions) * 100).toFixed(1)
    : "0";

  sections.push({
    heading: `New Build Homes in ${county.name}`,
    content: [
      `New-build properties accounted for <strong>${county.totalNewBuilds.toLocaleString("en-GB")}</strong> of ${county.totalTransactions.toLocaleString("en-GB")} total transactions (<strong>${newBuildPct}%</strong>) across ${county.name} in the past 12 months. ${county.totalNewBuilds > 50 ? "This indicates an active development pipeline with sustained buyer demand for new homes." : "The relatively low new-build share may indicate either planning constraints or an opportunity for developers to address unmet demand."}`,
      avgPremium !== 0
        ? `New-build properties in ${county.name} traded at an average <strong>${premiumWord} of ${Math.abs(avgPremium).toFixed(1)}%</strong> compared to existing stock. ${avgPremium > 0 ? "This premium supports development viability, as end values comfortably exceed second-hand comparables." : "This discount suggests that developers may need to focus on design quality, specification, and location to achieve values above existing stock."}`
        : "",
      newBuildTowns.length > 0
        ? `The most active new-build markets are ${newBuildTowns.slice(0, 3).map((t) => `${townLink(county.slug, t.slug, t.name)} (${t.stats.newBuildCount} completions)`).join(", ")}.`
        : "",
    ].filter(Boolean),
  });

  // 5. Transaction Activity & Liquidity
  const totalVolEst = county.totalTransactions * county.medianPrice;

  sections.push({
    heading: `${county.name} Property Transaction Activity`,
    content: [
      `${county.name} recorded <strong>${county.totalTransactions.toLocaleString("en-GB")}</strong> residential sales over the past 12 months, representing an estimated <strong>${formatPrice(totalVolEst)}</strong> in total transacted value. ${county.totalTransactions > 5000 ? "This is a deep, liquid market where developers can have confidence in their exit strategy." : county.totalTransactions > 2000 ? "This represents a moderately active market with reasonable exit confidence." : "This is a smaller market where developers should carefully assess demand and ensure robust exit strategies."}`,
      `${top3Active.length >= 3 ? `Transaction activity is concentrated in ${top3Active[0].name} (${top3Active[0].stats.transactionCount12m.toLocaleString("en-GB")} sales), ${top3Active[1].name} (${top3Active[1].stats.transactionCount12m.toLocaleString("en-GB")}), and ${top3Active[2].name} (${top3Active[2].stats.transactionCount12m.toLocaleString("en-GB")}), which together account for ${Math.round(((top3Active[0].stats.transactionCount12m + top3Active[1].stats.transactionCount12m + top3Active[2].stats.transactionCount12m) / county.totalTransactions) * 100)}% of county-wide volume.` : ""}`,
      `For developers, liquidity directly affects finance terms. Lenders are more comfortable providing higher loan-to-value ratios and competitive rates in areas with strong transaction volumes, as the evidence of comparable sales reduces valuation risk.`,
    ],
  });

  // 6. Development Finance Implications
  const typicalGdv = county.medianByType.D || county.medianPrice * 1.5;
  const seniorDebt = Math.round(typicalGdv * 0.65);
  const typicalEquity = Math.round(typicalGdv * 0.35 - typicalGdv * 0.1);

  sections.push({
    heading: `Development Finance in ${county.name}`,
    content: [
      `The ${county.name} market data carries direct implications for developers seeking finance. With a median property value of ${formatPrice(county.medianPrice)} and detached homes at ${county.medianByType.D ? formatPrice(county.medianByType.D) : "a premium"}, typical scheme GDVs support a range of finance structures.`,
      `For a standard ${serviceLink("development-finance", "development finance")} facility in ${county.name}, a scheme with a GDV of ${formatPrice(typicalGdv)} would typically attract <strong>senior debt of ${formatPrice(seniorDebt)}</strong> at 65% LTGDV. ${serviceLink("mezzanine-finance", "Mezzanine finance")} can stretch total borrowing to 85-90% of costs, reducing the equity requirement to as little as 10-15% of project costs.`,
      `For developers looking to acquire sites quickly — particularly at auction — ${serviceLink("bridging-loans", "bridging loans")} provide rapid access to capital, typically completing within 5-10 working days. Once construction is complete, ${serviceLink("development-exit-finance", "development exit finance")} replaces the development facility at a lower rate, providing breathing room to sell units at optimal prices.`,
      `${county.avgYoyChange > 0 ? `With prices ${trendDirection(county.avgYoyChange)} at ${county.avgYoyChange}% year-on-year, the market environment is supportive of new development. Lenders view rising markets favourably when assessing applications.` : `While prices are ${trendDirection(county.avgYoyChange)} at ${county.avgYoyChange}%, experienced developers can still achieve strong returns by focusing on well-located sites with clear demand drivers. Lenders will scrutinise comparable evidence more carefully in a softer market.`}`,
      `For ${serviceLink("refurbishment-finance", "refurbishment")} and conversion projects, ${county.name}'s existing stock — particularly ${mostAffordable} properties priced from ${typeEntries.length > 0 ? formatPrice(typeEntries[typeEntries.length - 1][1]!) : formatPrice(county.medianPrice * 0.6)} — offers value-add opportunities where the uplift from renovation can generate attractive profit on cost.`,
    ],
  });

  // 7. Notable Transactions
  const topTx = county.topTransactions.slice(0, 5);
  if (topTx.length > 0) {
    const txRows = topTx.map((tx) => {
      const txTown = (tx as Transaction & { townName?: string; townSlug?: string });
      return `<tr><td>${formatPrice(tx.price)}</td><td>${TYPE_LABELS_UPPER[tx.propertyType] || tx.propertyType}</td><td>${tx.postcode}</td><td>${tx.date}</td><td>${tx.newBuild ? "New build" : "Existing"}</td></tr>`;
    });

    sections.push({
      heading: `Highest-Value Property Sales in ${county.name}`,
      content: [
        `The highest-value sales recorded in ${county.name} over recent months illustrate the upper end of the market and the types of premium property transacting:`,
        `<table><thead><tr><th>Price</th><th>Type</th><th>Postcode</th><th>Date</th><th>Status</th></tr></thead><tbody>${txRows.join("")}</tbody></table>`,
        `These transactions highlight the achievable end values for premium developments in ${county.name}. ${topTx[0].price > 500000 ? `Sales above ${formatPriceShort(500000)} demonstrate appetite for higher-specification homes in desirable locations.` : `While values are moderate, the consistent transaction flow indicates reliable demand.`}`,
      ],
    });
  }

  // 8. Outlook & Opportunities
  const growingTowns = townsByGrowth.filter((t) => t.stats.yoyChange > 0);
  const decliningTowns = townsByGrowth.filter((t) => t.stats.yoyChange < -2);

  sections.push({
    heading: `${county.name} Property Market Outlook 2026`,
    content: [
      `${county.name}'s property market is ${county.avgYoyChange > 0 ? "on an upward trajectory" : county.avgYoyChange > -2 ? "in a period of consolidation" : "experiencing a correction"}, with ${growingTowns.length} of ${county.towns.length} towns recording year-on-year price growth.`,
      growingTowns.length > 0
        ? `The fastest-growing markets are ${growingTowns.slice(0, 3).map((t) => `${townLink(county.slug, t.slug, t.name)} (+${t.stats.yoyChange}%)`).join(", ")}. These areas offer the strongest market momentum for new development.`
        : "",
      decliningTowns.length > 0
        ? `Conversely, ${decliningTowns.slice(0, 2).map((t) => `${t.name} (${t.stats.yoyChange}%)`).join(" and ")} ${decliningTowns.length === 1 ? "has" : "have"} seen price softening. For experienced developers, this can present buying opportunities — acquiring land at lower values while planning for a market recovery.`
        : "",
      county.drivers.length > 0
        ? `Looking ahead, ${county.name}'s development pipeline will be shaped by ${county.drivers.slice(0, 2).join(" and ")}. Developers who align their schemes with these structural demand drivers are best positioned to secure finance and achieve strong returns.`
        : "",
      `To discuss financing a development in ${county.name}, submit your scheme details through our ${serviceLink("development-finance", "deal room")} for indicative terms within 24 hours from our panel of 100+ lenders.`,
    ].filter(Boolean),
  });

  // FAQs
  const faqs: ReportFaq[] = [
    {
      question: `What is the average house price in ${county.name}?`,
      answer: `The median house price across ${county.name}'s principal towns is ${formatPrice(county.medianPrice)}, based on ${county.totalTransactions.toLocaleString("en-GB")} transactions recorded over the past 12 months. ${typeEntries.length >= 2 ? `${TYPE_LABELS_UPPER[typeEntries[0][0]]} homes average ${formatPrice(typeEntries[0][1]!)} while ${TYPE_LABELS[typeEntries[typeEntries.length - 1][0]]} properties average ${formatPrice(typeEntries[typeEntries.length - 1][1]!)}.` : ""}`,
    },
    {
      question: `Is ${county.name} a good area for property development?`,
      answer: `${county.name} recorded ${county.totalTransactions.toLocaleString("en-GB")} residential transactions in the past 12 months with prices ${trendDirection(county.avgYoyChange)} ${county.avgYoyChange}% year-on-year, indicating ${county.totalTransactions > 3000 ? "a liquid market with strong exit confidence for developers" : "a market where developers should carefully assess local demand"}. ${county.totalNewBuilds > 0 ? `${county.totalNewBuilds} new-build completions demonstrate active development activity.` : ""} ${county.drivers.length > 0 ? `Key growth drivers include ${county.drivers[0].toLowerCase()}.` : ""}`,
    },
    {
      question: `What types of development finance are available in ${county.name}?`,
      answer: `Developers in ${county.name} can access development finance (from 6.5% p.a., up to 65-70% LTGDV), mezzanine finance to stretch borrowing to 85-90% of costs, bridging loans for rapid acquisitions, and development exit finance once construction completes. Construction Capital sources terms from 100+ lenders, family offices, and equity partners.`,
    },
    {
      question: `Which towns in ${county.name} have the highest property prices?`,
      answer: `The most expensive towns in ${county.name} are ${top3Expensive.map((t) => `${t.name} (${formatPrice(t.stats.medianPrice)})`).join(", ")}. ${top3Affordable.length > 0 ? `The most affordable include ${top3Affordable.map((t) => `${t.name} (${formatPrice(t.stats.medianPrice)})`).join(", ")}.` : ""}`,
    },
    {
      question: `How is the ${county.name} property market performing in 2026?`,
      answer: `${county.name} property prices are ${trendDirection(county.avgYoyChange)} at ${county.avgYoyChange > 0 ? "+" : ""}${county.avgYoyChange}% year-on-year. ${growingTowns.length > 0 ? `The strongest performers are ${growingTowns.slice(0, 2).map((t) => `${t.name} (+${t.stats.yoyChange}%)`).join(" and ")}.` : ""} Transaction volumes of ${county.totalTransactions.toLocaleString("en-GB")} sales indicate ${county.totalTransactions > 5000 ? "robust" : county.totalTransactions > 2000 ? "healthy" : "steady"} market activity.`,
    },
  ];

  // Related reports
  const relatedReportSlugs = [
    `${regionSlugStr}-market-overview`,
    ...regionCounties.slice(0, 3).map((c) => `${c.slug}-property-market`),
  ];

  const relatedTownSlugs = county.towns.map((t) => `${county.slug}/${t.slug}`);
  const relatedServiceSlugs = [
    "development-finance",
    "bridging-loans",
    "mezzanine-finance",
    "development-exit-finance",
  ];

  return {
    slug,
    title: `${county.name} Property Market: Prices, Trends & Development Finance (2026)`,
    metaTitle: `${county.name} Property Market Report 2026 — House Prices, Sold Data & Finance`,
    metaDescription: `${county.name} property market analysis: median price ${formatPrice(county.medianPrice)}, ${county.totalTransactions.toLocaleString("en-GB")} sales, ${county.avgYoyChange > 0 ? "+" : ""}${county.avgYoyChange}% YoY. Town comparisons, new builds & development finance across ${county.towns.length} towns.`,
    excerpt: `${county.towns.length} towns analysed. Median price ${formatPrice(county.medianPrice)}, ${county.totalTransactions.toLocaleString("en-GB")} transactions, ${county.avgYoyChange > 0 ? "+" : ""}${county.avgYoyChange}% YoY.`,
    category: "county",
    region: county.region,
    countySlug: county.slug,
    datePublished: TODAY,
    dateModified: TODAY,
    readingTime: estimateReadingTime(sections),
    sections,
    faqs,
    relatedReportSlugs,
    relatedTownSlugs,
    relatedServiceSlugs,
    charts: {
      priceByType: typeEntries.map(([type, price]) => ({
        name: TYPE_LABELS_UPPER[type] || type,
        value: price!,
      })),
      townPrices: townsByPrice.map((t) => ({
        name: t.name,
        value: t.stats.medianPrice,
      })),
      townYoyChange: townsByGrowth.map((t) => ({
        name: t.name,
        value: t.stats.yoyChange,
      })),
    },
  };
}

// ── Regional Report Generator ──────────────────────────────────────

function generateRegionalReport(region: RegionAgg, allCounties: CountyAgg[]): MarketReport {
  const slug = `${region.slug}-market-overview`;
  const sections: ReportSection[] = [];

  // 1. Regional Overview
  sections.push({
    heading: `${region.name} Property Market Overview`,
    content: [
      `The ${region.name} region encompasses <strong>${region.counties.length} counties</strong>, recording a combined <strong>${region.totalTransactions.toLocaleString("en-GB")}</strong> residential transactions over the past 12 months. The regional median property price stands at <strong>${formatPrice(region.medianPrice)}</strong>, with prices ${trendDirection(region.avgYoyChange)} at <strong>${region.avgYoyChange > 0 ? "+" : ""}${region.avgYoyChange}%</strong> year-on-year.`,
      `${region.totalNewBuilds > 0 ? `New-build activity across the region totalled <strong>${region.totalNewBuilds.toLocaleString("en-GB")} completions</strong>, demonstrating an active development pipeline.` : ""}`,
    ].filter(Boolean),
  });

  // 2. County Comparison Table
  const countyRows = region.counties
    .sort((a, b) => b.medianPrice - a.medianPrice)
    .map((c) =>
      `<tr><td>${reportLink(`${c.slug}-property-market`, c.name)}</td><td>${formatPrice(c.medianPrice)}</td><td>${c.totalTransactions.toLocaleString("en-GB")}</td><td>${c.avgYoyChange > 0 ? "+" : ""}${c.avgYoyChange}%</td><td>${c.totalNewBuilds}</td></tr>`
    );

  sections.push({
    heading: "County-by-County Comparison",
    content: [
      `The table below compares all ${region.counties.length} counties in the ${region.name} region, ranked by median property price. Click any county name for the full market report.`,
      `<table><thead><tr><th>County</th><th>Median Price</th><th>Sales (12m)</th><th>YoY Change</th><th>New Builds</th></tr></thead><tbody>${countyRows.join("")}</tbody></table>`,
    ],
  });

  // 3. Price Geography
  const mostExpensive = region.counties.sort((a, b) => b.medianPrice - a.medianPrice)[0];
  const leastExpensive = region.counties.sort((a, b) => a.medianPrice - b.medianPrice)[0];
  const priceSpread = mostExpensive && leastExpensive
    ? mostExpensive.medianPrice - leastExpensive.medianPrice
    : 0;

  sections.push({
    heading: "Price Geography",
    content: [
      mostExpensive && leastExpensive
        ? `Property prices across ${region.name} vary significantly. ${reportLink(`${mostExpensive.slug}-property-market`, mostExpensive.name)} commands the highest median price at <strong>${formatPrice(mostExpensive.medianPrice)}</strong>, while ${reportLink(`${leastExpensive.slug}-property-market`, leastExpensive.name)} offers the most affordable entry at <strong>${formatPrice(leastExpensive.medianPrice)}</strong> — a spread of <strong>${formatPriceShort(priceSpread)}</strong>.`
        : "",
      `This price differential creates opportunities across the risk-return spectrum. Premium locations offer higher GDVs but require larger capital commitments, while more affordable areas can deliver stronger percentage returns on lower absolute investment.`,
    ].filter(Boolean),
  });

  // 4. Development Hotspots
  const byNewBuilds = [...region.counties].sort((a, b) => b.totalNewBuilds - a.totalNewBuilds);
  const byVolume = [...region.counties].sort((a, b) => b.totalTransactions - a.totalTransactions);

  sections.push({
    heading: "Development Hotspots",
    content: [
      `The most active development markets in ${region.name}, measured by new-build completions, are ${byNewBuilds.slice(0, 3).map((c) => `${reportLink(`${c.slug}-property-market`, c.name)} (${c.totalNewBuilds} new builds)`).join(", ")}.`,
      `By total transaction volume — an indicator of market liquidity and exit confidence — ${byVolume.slice(0, 3).map((c) => `${reportLink(`${c.slug}-property-market`, c.name)} (${c.totalTransactions.toLocaleString("en-GB")} sales)`).join(", ")} lead the region.`,
      `Developers entering the ${region.name} market should weigh these two metrics together: new-build activity shows where planning consent is achievable, while transaction volume confirms buyer demand.`,
    ],
  });

  // 5. Finance Landscape
  sections.push({
    heading: "Finance Landscape",
    content: [
      `Development finance across ${region.name} varies by location and scheme size. In premium areas like ${mostExpensive ? mostExpensive.name : "higher-value counties"}, typical scheme GDVs support larger facilities, while more affordable counties may suit developers using ${serviceLink("bridging-loans", "bridging finance")} for refurbishment-led strategies.`,
      `${serviceLink("development-finance", "Senior development finance")} is available from 6.5% p.a. at up to 65-70% LTGDV, with ${serviceLink("mezzanine-finance", "mezzanine finance")} stretching total borrowing to 85-90% of costs. For developers building across multiple sites in the region, portfolio-level facilities can offer better terms.`,
      `Construction Capital sources terms from 100+ lenders across the ${region.name} region. Submit your scheme through our <a href="/deal-room">deal room</a> for indicative terms within 24 hours.`,
    ],
  });

  // 6. Key Takeaways
  const growingCounties = region.counties.filter((c) => c.avgYoyChange > 0);
  sections.push({
    heading: "Key Takeaways",
    content: [
      `<ul>
<li><strong>Market size:</strong> ${region.totalTransactions.toLocaleString("en-GB")} transactions across ${region.counties.length} counties — ${region.totalTransactions > 20000 ? "one of the UK's most active regions" : "a significant regional market"}.</li>
<li><strong>Price range:</strong> ${leastExpensive ? formatPrice(leastExpensive.medianPrice) : "N/A"} to ${mostExpensive ? formatPrice(mostExpensive.medianPrice) : "N/A"} median prices, offering opportunities across the capital spectrum.</li>
<li><strong>Market direction:</strong> ${growingCounties.length} of ${region.counties.length} counties showing year-on-year price growth.</li>
<li><strong>New build activity:</strong> ${region.totalNewBuilds.toLocaleString("en-GB")} completions across the region, ${region.totalNewBuilds > 500 ? "indicating a healthy development pipeline" : "suggesting room for new supply"}.</li>
<li><strong>Finance availability:</strong> Full range of development finance, mezzanine, bridging, and exit products available across all ${region.name} counties.</li>
</ul>`,
    ],
  });

  const faqs: ReportFaq[] = [
    {
      question: `What is the average house price in ${region.name}?`,
      answer: `The median house price across ${region.name} is ${formatPrice(region.medianPrice)}, based on ${region.totalTransactions.toLocaleString("en-GB")} transactions over the past 12 months. Prices range from ${leastExpensive ? formatPrice(leastExpensive.medianPrice) : "N/A"} in ${leastExpensive ? leastExpensive.name : "the most affordable county"} to ${mostExpensive ? formatPrice(mostExpensive.medianPrice) : "N/A"} in ${mostExpensive ? mostExpensive.name : "the most expensive county"}.`,
    },
    {
      question: `Which county in ${region.name} is best for property development?`,
      answer: `This depends on your strategy. ${byVolume[0] ? `${byVolume[0].name} offers the highest transaction volumes (${byVolume[0].totalTransactions.toLocaleString("en-GB")} sales) for exit confidence.` : ""} ${byNewBuilds[0] ? `${byNewBuilds[0].name} has the most new-build activity (${byNewBuilds[0].totalNewBuilds} completions).` : ""} See the individual county reports for detailed analysis.`,
    },
    {
      question: `How are property prices trending in ${region.name}?`,
      answer: `Prices across ${region.name} are ${trendDirection(region.avgYoyChange)} at ${region.avgYoyChange > 0 ? "+" : ""}${region.avgYoyChange}% year-on-year. ${growingCounties.length} of ${region.counties.length} counties are seeing price growth.`,
    },
  ];

  return {
    slug,
    title: `${region.name} Property Market: Regional Analysis & County Comparison (2026)`,
    metaTitle: `${region.name} Property Market 2026 — County Prices, Trends & Development Hotspots`,
    metaDescription: `${region.name} property market overview: ${region.counties.length} counties, ${region.totalTransactions.toLocaleString("en-GB")} sales, median ${formatPrice(region.medianPrice)}. County comparisons, development hotspots & finance options.`,
    excerpt: `${region.counties.length} counties, ${region.totalTransactions.toLocaleString("en-GB")} transactions, median ${formatPrice(region.medianPrice)}.`,
    category: "regional",
    region: region.name,
    datePublished: TODAY,
    dateModified: TODAY,
    readingTime: estimateReadingTime(sections),
    sections,
    faqs,
    relatedReportSlugs: region.counties.map((c) => `${c.slug}-property-market`),
    relatedTownSlugs: [],
    relatedServiceSlugs: ["development-finance", "bridging-loans", "mezzanine-finance"],
  };
}

// ── Thematic Report Generators ─────────────────────────────────────

function generateNewBuildReport(counties: CountyAgg[]): MarketReport {
  const slug = "new-build-premium-analysis-2026";
  const sorted = [...counties]
    .filter((c) => c.totalNewBuilds > 0)
    .sort((a, b) => b.totalNewBuilds - a.totalNewBuilds);

  const premiumCounties = counties
    .filter((c) => c.towns.some((t) => t.stats.newBuildPremium > 0))
    .map((c) => ({
      ...c,
      avgPremium:
        c.towns.filter((t) => t.stats.newBuildPremium !== 0).reduce((a, t) => a + t.stats.newBuildPremium, 0) /
        Math.max(1, c.towns.filter((t) => t.stats.newBuildPremium !== 0).length),
    }))
    .sort((a, b) => b.avgPremium - a.avgPremium);

  const discountCounties = counties
    .filter((c) => c.towns.some((t) => t.stats.newBuildPremium < -5))
    .map((c) => ({
      ...c,
      avgPremium:
        c.towns.filter((t) => t.stats.newBuildPremium !== 0).reduce((a, t) => a + t.stats.newBuildPremium, 0) /
        Math.max(1, c.towns.filter((t) => t.stats.newBuildPremium !== 0).length),
    }))
    .sort((a, b) => a.avgPremium - b.avgPremium);

  const totalNewBuilds = counties.reduce((a, c) => a + c.totalNewBuilds, 0);
  const totalTx = counties.reduce((a, c) => a + c.totalTransactions, 0);

  const sections: ReportSection[] = [
    {
      heading: "UK New Build Market Overview",
      content: [
        `New-build homes accounted for <strong>${totalNewBuilds.toLocaleString("en-GB")}</strong> of <strong>${totalTx.toLocaleString("en-GB")}</strong> total residential transactions (<strong>${((totalNewBuilds / totalTx) * 100).toFixed(1)}%</strong>) across England and Wales in the past 12 months. This analysis examines the new-build premium — or discount — in every county to help developers understand where newly built homes command higher values than existing stock.`,
      ],
    },
    {
      heading: "Counties with the Strongest New Build Premium",
      content: [
        premiumCounties.length > 0
          ? `The strongest new-build premiums are found in ${premiumCounties.slice(0, 5).map((c) => `${reportLink(`${c.slug}-property-market`, c.name)} (+${c.avgPremium.toFixed(1)}%)`).join(", ")}. These are markets where buyers willingly pay more for new construction, supporting strong development viability.`
          : "Few counties show a consistent new-build premium across all towns.",
        `A positive premium is the clearest indicator that ${serviceLink("development-finance", "development finance")} schemes can achieve end values above comparable second-hand stock, de-risking the appraisal.`,
      ],
    },
    {
      heading: "Counties Where New Builds Trade at a Discount",
      content: [
        discountCounties.length > 0
          ? `Conversely, ${discountCounties.slice(0, 5).map((c) => `${reportLink(`${c.slug}-property-market`, c.name)} (${c.avgPremium.toFixed(1)}%)`).join(", ")} see new-build properties trading below existing stock. This may reflect oversupply of new-build flats, Help to Buy withdrawal effects, or a market preference for period character.`
          : "No counties show significant new-build discounts.",
        `Developers working in discount markets should focus on premium specification, energy efficiency, and lifestyle features to differentiate from existing stock.`,
      ],
    },
    {
      heading: "New Build Activity by County",
      content: [
        `The most active new-build counties are ${sorted.slice(0, 5).map((c) => `${reportLink(`${c.slug}-property-market`, c.name)} (${c.totalNewBuilds} completions)`).join(", ")}.`,
        `High new-build volumes indicate both planning consent availability and proven buyer demand — two essential factors for any development finance application.`,
      ],
    },
    {
      heading: "Implications for Developers and Investors",
      content: [
        `Understanding the new-build premium landscape is critical for development appraisals. In premium markets, developers can confidently project end values above comparables. In discount markets, the focus shifts to cost control and specification.`,
        `Whether building in a premium or discount market, Construction Capital can source competitive ${serviceLink("development-finance", "development finance")} terms from our panel of 100+ lenders. Submit your scheme via our <a href="/deal-room">deal room</a> for indicative terms within 24 hours.`,
      ],
    },
  ];

  return {
    slug,
    title: "UK New Build Premium Analysis 2026",
    metaTitle: "UK New Build Premium Analysis 2026 | New Build vs Existing Prices",
    metaDescription: `Analysis of new-build premiums and discounts across ${counties.length} UK counties. Where do new homes command higher prices — and where don't they?`,
    excerpt: `${totalNewBuilds.toLocaleString("en-GB")} new builds analysed across ${counties.length} counties.`,
    category: "thematic",
    datePublished: TODAY,
    dateModified: TODAY,
    readingTime: estimateReadingTime(sections),
    sections,
    faqs: [
      {
        question: "Do new builds sell for more than existing homes?",
        answer: `It depends on the location. Some counties see new-build premiums of 10-20%, while others see discounts. Our county-level analysis breaks down the premium or discount in each area.`,
      },
      {
        question: "How does the new build premium affect development finance?",
        answer: `A positive new-build premium strengthens development appraisals by increasing projected GDV. Lenders view schemes more favourably when new-build comparables exceed existing stock values, potentially offering higher LTV ratios and better rates.`,
      },
    ],
    relatedReportSlugs: sorted.slice(0, 5).map((c) => `${c.slug}-property-market`),
    relatedTownSlugs: [],
    relatedServiceSlugs: ["development-finance", "mezzanine-finance"],
  };
}

function generateMostActiveReport(counties: CountyAgg[]): MarketReport {
  const slug = "most-active-property-markets-2026";
  const allTowns = counties.flatMap((c) =>
    c.towns.map((t) => ({ ...t, countyName: c.name }))
  );
  const topTowns = allTowns.sort((a, b) => b.stats.transactionCount12m - a.stats.transactionCount12m).slice(0, 30);
  const topCounties = [...counties].sort((a, b) => b.totalTransactions - a.totalTransactions);

  const sections: ReportSection[] = [
    {
      heading: "UK's Most Active Property Markets",
      content: [
        `Transaction volume is one of the most important metrics for property developers and investors. High volumes indicate strong buyer demand, reliable comparable evidence for valuations, and confidence in exit strategies. This report ranks the UK's most active property markets by transaction count over the past 12 months.`,
      ],
    },
    {
      heading: "Top 20 Towns by Transaction Volume",
      content: [
        `<table><thead><tr><th>#</th><th>Town</th><th>County</th><th>Sales (12m)</th><th>Median Price</th><th>YoY</th></tr></thead><tbody>${topTowns.slice(0, 20).map((t, i) => `<tr><td>${i + 1}</td><td>${townLink(t.countySlug, t.slug, t.name)}</td><td>${t.countyName}</td><td>${t.stats.transactionCount12m.toLocaleString("en-GB")}</td><td>${formatPrice(t.stats.medianPrice)}</td><td>${t.stats.yoyChange > 0 ? "+" : ""}${t.stats.yoyChange}%</td></tr>`).join("")}</tbody></table>`,
        `${topTowns[0] ? `${topTowns[0].name} in ${topTowns[0].countyName} leads the country with ${topTowns[0].stats.transactionCount12m.toLocaleString("en-GB")} transactions` : ""}, demonstrating exceptional market depth.`,
      ],
    },
    {
      heading: "Top Counties by Total Volume",
      content: [
        `At the county level, ${topCounties.slice(0, 5).map((c) => `${reportLink(`${c.slug}-property-market`, c.name)} (${c.totalTransactions.toLocaleString("en-GB")})`).join(", ")} record the highest aggregate transaction volumes.`,
        `These are the deepest property markets in the UK — where lenders are most comfortable providing finance and where developers have the clearest comparable evidence for their appraisals.`,
      ],
    },
    {
      heading: "Why Transaction Volume Matters for Development Finance",
      content: [
        `Lenders assess the "exit risk" of every development scheme. In high-volume markets, there is abundant comparable evidence to support valuations, buyer pools are large, and homes sell faster. This translates directly into better ${serviceLink("development-finance", "finance terms")}: higher LTV ratios, lower interest rates, and faster credit decisions.`,
        `In lower-volume markets, developers may need to demonstrate stronger pre-sales or marketing strategies. ${serviceLink("bridging-loans", "Bridging finance")} can be particularly useful for securing sites quickly in competitive areas.`,
      ],
    },
  ];

  return {
    slug,
    title: "Most Active Property Markets in the UK 2026",
    metaTitle: "Most Active Property Markets in the UK 2026 | Transaction Volume Rankings",
    metaDescription: `Ranked: the UK's busiest property markets by transaction volume. Top towns and counties for developer confidence and exit strategy planning.`,
    excerpt: `The UK's busiest property markets ranked by transaction volume.`,
    category: "thematic",
    datePublished: TODAY,
    dateModified: TODAY,
    readingTime: estimateReadingTime(sections),
    sections,
    faqs: [
      {
        question: "Which UK town has the most property sales?",
        answer: topTowns[0]
          ? `${topTowns[0].name} in ${topTowns[0].countyName} recorded the highest transaction volume with ${topTowns[0].stats.transactionCount12m.toLocaleString("en-GB")} sales over the past 12 months.`
          : "See our report for the full ranking.",
      },
    ],
    relatedReportSlugs: topCounties.slice(0, 5).map((c) => `${c.slug}-property-market`),
    relatedTownSlugs: topTowns.slice(0, 10).map((t) => `${t.countySlug}/${t.slug}`),
    relatedServiceSlugs: ["development-finance", "bridging-loans"],
  };
}

function generatePriceChangeReport(counties: CountyAgg[]): MarketReport {
  const slug = "uk-house-price-changes-2026";
  const allTowns = counties.flatMap((c) =>
    c.towns.map((t) => ({ ...t, countyName: c.name }))
  );
  const risingTowns = allTowns.filter((t) => t.stats.yoyChange > 0).sort((a, b) => b.stats.yoyChange - a.stats.yoyChange);
  const fallingTowns = allTowns.filter((t) => t.stats.yoyChange < 0).sort((a, b) => a.stats.yoyChange - b.stats.yoyChange);
  const risingCounties = [...counties].filter((c) => c.avgYoyChange > 0).sort((a, b) => b.avgYoyChange - a.avgYoyChange);
  const fallingCounties = [...counties].filter((c) => c.avgYoyChange < 0).sort((a, b) => a.avgYoyChange - b.avgYoyChange);

  const sections: ReportSection[] = [
    {
      heading: "UK House Price Trends 2026",
      content: [
        `House prices across England and Wales are telling a nuanced story in 2026. Of ${counties.length} counties analysed, <strong>${risingCounties.length}</strong> are seeing year-on-year price growth while <strong>${fallingCounties.length}</strong> are experiencing declines. This report breaks down exactly where prices are moving — and what it means for developers and investors.`,
      ],
    },
    {
      heading: "Fastest Rising Markets",
      content: [
        `<table><thead><tr><th>#</th><th>Town</th><th>County</th><th>YoY Change</th><th>Median Price</th></tr></thead><tbody>${risingTowns.slice(0, 15).map((t, i) => `<tr><td>${i + 1}</td><td>${townLink(t.countySlug, t.slug, t.name)}</td><td>${t.countyName}</td><td>+${t.stats.yoyChange}%</td><td>${formatPrice(t.stats.medianPrice)}</td></tr>`).join("")}</tbody></table>`,
        risingTowns[0]
          ? `${risingTowns[0].name} leads with <strong>+${risingTowns[0].stats.yoyChange}%</strong> growth. Rising markets offer developers the dual benefit of increasing land values and strengthening end values during the build period.`
          : "",
      ].filter(Boolean),
    },
    {
      heading: "Markets Under Pressure",
      content: [
        fallingTowns.length > 0
          ? `<table><thead><tr><th>#</th><th>Town</th><th>County</th><th>YoY Change</th><th>Median Price</th></tr></thead><tbody>${fallingTowns.slice(0, 15).map((t, i) => `<tr><td>${i + 1}</td><td>${townLink(t.countySlug, t.slug, t.name)}</td><td>${t.countyName}</td><td>${t.stats.yoyChange}%</td><td>${formatPrice(t.stats.medianPrice)}</td></tr>`).join("")}</tbody></table>`
          : "No significant declines recorded.",
        `Declining markets are not necessarily bad for developers. Lower land values reduce acquisition costs, and well-timed development through a market trough can deliver strong returns as prices recover. The key is ensuring conservative appraisals and adequate ${serviceLink("development-finance", "finance")} contingency.`,
      ],
    },
    {
      heading: "County-Level Price Direction",
      content: [
        `At county level, the strongest growth is in ${risingCounties.slice(0, 3).map((c) => `${reportLink(`${c.slug}-property-market`, c.name)} (+${c.avgYoyChange}%)`).join(", ")}.`,
        fallingCounties.length > 0
          ? `Counties seeing declines include ${fallingCounties.slice(0, 3).map((c) => `${reportLink(`${c.slug}-property-market`, c.name)} (${c.avgYoyChange}%)`).join(", ")}.`
          : "",
      ].filter(Boolean),
    },
    {
      heading: "What This Means for Development Finance",
      content: [
        `Price direction affects every aspect of development finance. In rising markets, lenders are more comfortable with forward-looking valuations and may offer higher LTV ratios. In falling markets, valuers will be more conservative, and developers should expect lenders to stress-test their appraisals.`,
        `Regardless of market direction, Construction Capital works with 100+ lenders to find competitive terms. Submit your scheme via our <a href="/deal-room">deal room</a>.`,
      ],
    },
  ];

  return {
    slug,
    title: "UK House Price Changes: Where Prices Are Rising and Falling in 2026",
    metaTitle: "UK House Price Changes 2026 | Where Prices Are Rising & Falling",
    metaDescription: `Comprehensive analysis of UK house price movements in 2026. Town-by-town rankings of the fastest rising and falling markets.`,
    excerpt: `${risingCounties.length} counties rising, ${fallingCounties.length} falling. Full town-by-town breakdown.`,
    category: "thematic",
    datePublished: TODAY,
    dateModified: TODAY,
    readingTime: estimateReadingTime(sections),
    sections,
    faqs: [
      {
        question: "Where are house prices rising fastest in the UK?",
        answer: risingTowns[0]
          ? `${risingTowns[0].name} in ${risingTowns[0].countyName} is seeing the fastest growth at +${risingTowns[0].stats.yoyChange}% year-on-year.`
          : "See our report for the full ranking.",
      },
      {
        question: "Where are house prices falling in the UK?",
        answer: fallingTowns[0]
          ? `${fallingTowns[0].name} in ${fallingTowns[0].countyName} has seen the largest decline at ${fallingTowns[0].stats.yoyChange}% year-on-year. However, price declines can create opportunities for developers buying land at lower values.`
          : "Most markets are currently stable or rising.",
      },
    ],
    relatedReportSlugs: [...risingCounties.slice(0, 3), ...fallingCounties.slice(0, 2)].map(
      (c) => `${c.slug}-property-market`
    ),
    relatedTownSlugs: risingTowns.slice(0, 5).map((t) => `${t.countySlug}/${t.slug}`),
    relatedServiceSlugs: ["development-finance", "bridging-loans"],
  };
}

function generatePropertyTypeReport(counties: CountyAgg[]): MarketReport {
  const slug = "property-type-price-guide-2026";

  // Aggregate by type across all counties
  const typeData: Record<string, { prices: number[]; counties: string[] }> = {
    D: { prices: [], counties: [] },
    S: { prices: [], counties: [] },
    T: { prices: [], counties: [] },
    F: { prices: [], counties: [] },
  };

  for (const county of counties) {
    for (const [type, price] of Object.entries(county.medianByType)) {
      if (price && price > 0 && typeData[type]) {
        typeData[type].prices.push(price);
        typeData[type].counties.push(county.name);
      }
    }
  }

  // Most expensive county for each type
  const expensiveByType: Record<string, { county: CountyAgg; price: number }> = {};
  const cheapestByType: Record<string, { county: CountyAgg; price: number }> = {};
  for (const type of ["D", "S", "T", "F"]) {
    let maxPrice = 0;
    let minPrice = Infinity;
    let maxCounty: CountyAgg | null = null;
    let minCounty: CountyAgg | null = null;
    for (const county of counties) {
      const price = county.medianByType[type as keyof typeof county.medianByType];
      if (price && price > maxPrice) {
        maxPrice = price;
        maxCounty = county;
      }
      if (price && price < minPrice) {
        minPrice = price;
        minCounty = county;
      }
    }
    if (maxCounty) expensiveByType[type] = { county: maxCounty, price: maxPrice };
    if (minCounty) cheapestByType[type] = { county: minCounty, price: minPrice };
  }

  const sections: ReportSection[] = [
    {
      heading: "Property Type Price Guide 2026",
      content: [
        `Property prices vary dramatically by type across the UK. A detached home in one county can cost the same as a flat in another. This guide breaks down median prices by property type — detached, semi-detached, terraced, and flat — across all ${counties.length} counties analysed, helping developers identify where each type of development is most viable.`,
      ],
    },
    {
      heading: "National Median by Property Type",
      content: [
        `<table><thead><tr><th>Property Type</th><th>Median Price</th><th>Most Expensive County</th><th>Most Affordable County</th></tr></thead><tbody>${["D", "S", "T", "F"].map((type) => {
          const exp = expensiveByType[type];
          const chp = cheapestByType[type];
          return `<tr><td><strong>${TYPE_LABELS_UPPER[type]}</strong></td><td>${formatPrice(median(typeData[type].prices))}</td><td>${exp ? `${exp.county.name} (${formatPrice(exp.price)})` : "—"}</td><td>${chp ? `${chp.county.name} (${formatPrice(chp.price)})` : "—"}</td></tr>`;
        }).join("")}</tbody></table>`,
      ],
    },
    {
      heading: "Detached Homes: Premium Development",
      content: [
        `Detached homes command a national median of <strong>${formatPrice(median(typeData.D.prices))}</strong>. ${expensiveByType.D ? `The premium market is led by ${reportLink(`${expensiveByType.D.county.slug}-property-market`, expensiveByType.D.county.name)} at ${formatPrice(expensiveByType.D.price)}` : ""}, while ${cheapestByType.D ? `${reportLink(`${cheapestByType.D.county.slug}-property-market`, cheapestByType.D.county.name)} offers detached homes from ${formatPrice(cheapestByType.D.price)}` : "more affordable locations offer entry-level detached opportunities"}.`,
        `For developers, detached homes typically deliver the highest absolute profit per unit but require larger plots. ${serviceLink("development-finance", "Development finance")} for detached schemes generally benefits from strong comparable evidence and premium buyer demand.`,
      ],
    },
    {
      heading: "Flats: Volume Development",
      content: [
        `Flats have a national median of <strong>${formatPrice(median(typeData.F.prices))}</strong>. The flat market is driven by urban demand, buy-to-let investors, and first-time buyers.`,
        `Flat developments typically deliver lower per-unit values but higher density, making them suitable for urban sites where land values are high. ${serviceLink("refurbishment-finance", "Refurbishment finance")} is commonly used for flat conversion schemes — transforming commercial buildings or large houses into apartments.`,
      ],
    },
    {
      heading: "Development Strategy by Type",
      content: [
        `The spread between detached and flat prices in any given location reveals the optimal development strategy. A wide spread (over ${formatPriceShort(150000)}) suggests strong demand for premium housing. A narrow spread suggests a more uniform market where density-led flat development may be more profitable.`,
        `Construction Capital can source finance for any development type. ${serviceLink("development-finance", "Development finance")} from 6.5% p.a., ${serviceLink("mezzanine-finance", "mezzanine finance")} to stretch borrowing, or ${serviceLink("equity-jv", "equity and JV structures")} for larger schemes. <a href="/deal-room">Submit your scheme</a> for terms.`,
      ],
    },
  ];

  return {
    slug,
    title: "Property Type Price Guide: Detached vs Flats Across the UK 2026",
    metaTitle: "Property Type Price Guide 2026 | Detached, Semi, Terrace & Flat Prices UK",
    metaDescription: `UK property prices by type: detached, semi-detached, terraced, and flat median prices across ${counties.length} counties with development finance analysis.`,
    excerpt: `Detached to flat prices compared across ${counties.length} counties.`,
    category: "thematic",
    datePublished: TODAY,
    dateModified: TODAY,
    readingTime: estimateReadingTime(sections),
    sections,
    faqs: [
      {
        question: "What is the average UK detached house price?",
        answer: `The median detached house price across the counties we analysed is ${formatPrice(median(typeData.D.prices))}. ${expensiveByType.D ? `Prices range from ${cheapestByType.D ? formatPrice(cheapestByType.D.price) : "lower values"} to ${formatPrice(expensiveByType.D.price)} in ${expensiveByType.D.county.name}.` : ""}`,
      },
      {
        question: "What is the average UK flat price?",
        answer: `The median flat price is ${formatPrice(median(typeData.F.prices))}. Flat prices vary significantly by location, with urban centres commanding premiums.`,
      },
    ],
    relatedReportSlugs: Object.values(expensiveByType)
      .map((e) => `${e.county.slug}-property-market`)
      .slice(0, 4),
    relatedTownSlugs: [],
    relatedServiceSlugs: ["development-finance", "refurbishment-finance", "equity-jv"],
  };
}

function generateHotspotsReport(counties: CountyAgg[]): MarketReport {
  const slug = "development-finance-hotspots-2026";

  // Score each county: combine new builds, volume, and growth
  const scored = counties.map((c) => {
    const volumeScore = Math.min(c.totalTransactions / 10000, 1) * 30;
    const newBuildScore = Math.min(c.totalNewBuilds / 200, 1) * 40;
    const growthScore = Math.max(0, Math.min((c.avgYoyChange + 5) / 15, 1)) * 30;
    return { ...c, score: volumeScore + newBuildScore + growthScore };
  });
  const ranked = scored.sort((a, b) => b.score - a.score);

  const sections: ReportSection[] = [
    {
      heading: "Development Finance Hotspots 2026",
      content: [
        `Where should developers be looking in 2026? This report combines three key metrics — new-build completions (developer activity), transaction volume (exit confidence), and price growth (market momentum) — to identify the UK's most attractive development finance markets.`,
      ],
    },
    {
      heading: "Top 15 Development Hotspots",
      content: [
        `<table><thead><tr><th>#</th><th>County</th><th>New Builds</th><th>Sales (12m)</th><th>YoY</th><th>Median Price</th></tr></thead><tbody>${ranked.slice(0, 15).map((c, i) => `<tr><td>${i + 1}</td><td>${reportLink(`${c.slug}-property-market`, c.name)}</td><td>${c.totalNewBuilds}</td><td>${c.totalTransactions.toLocaleString("en-GB")}</td><td>${c.avgYoyChange > 0 ? "+" : ""}${c.avgYoyChange}%</td><td>${formatPrice(c.medianPrice)}</td></tr>`).join("")}</tbody></table>`,
        ranked[0]
          ? `<strong>${ranked[0].name}</strong> tops our ranking with ${ranked[0].totalNewBuilds} new-build completions, ${ranked[0].totalTransactions.toLocaleString("en-GB")} transactions, and ${ranked[0].avgYoyChange > 0 ? "+" : ""}${ranked[0].avgYoyChange}% price growth. This combination of active development, strong liquidity, and positive price direction makes it the most attractive market for ${serviceLink("development-finance", "development finance")} in 2026.`
          : "",
      ].filter(Boolean),
    },
    {
      heading: "Emerging Opportunities",
      content: [
        `Beyond the top-ranked hotspots, several counties show strong growth momentum that may signal emerging opportunities:`,
        `${ranked.filter((c) => c.avgYoyChange > 2).slice(0, 5).map((c) => `<strong>${reportLink(`${c.slug}-property-market`, c.name)}</strong>: ${c.avgYoyChange > 0 ? "+" : ""}${c.avgYoyChange}% growth with median prices at ${formatPrice(c.medianPrice)}. ${c.drivers[0] || ""}`).join("<br/><br/>")}`,
      ],
    },
    {
      heading: "Financing Development in Hotspot Areas",
      content: [
        `The hotspot counties identified in this report are precisely the areas where lenders are most active. Strong comparable evidence, proven buyer demand, and positive market momentum all contribute to favourable ${serviceLink("development-finance", "finance terms")}.`,
        `Typical facilities in these areas: ${serviceLink("development-finance", "senior development finance")} from 6.5% p.a. at 65-70% LTGDV, with ${serviceLink("mezzanine-finance", "mezzanine")} available to stretch to 85-90% of costs. For rapid site acquisitions, ${serviceLink("bridging-loans", "bridging loans")} complete in as little as 5 days.`,
        `Ready to develop in one of these hotspot areas? <a href="/deal-room">Submit your scheme</a> for indicative terms within 24 hours.`,
      ],
    },
  ];

  return {
    slug,
    title: "Development Finance Hotspots: Where Developers Are Building in 2026",
    metaTitle: "Development Finance Hotspots 2026 | Best UK Areas for Property Developers",
    metaDescription: `The UK's top development finance hotspots ranked by new-build activity, transaction volume, and price growth. Data-driven guide for developers.`,
    excerpt: `Top ${Math.min(15, ranked.length)} development hotspots ranked by composite score.`,
    category: "thematic",
    datePublished: TODAY,
    dateModified: TODAY,
    readingTime: estimateReadingTime(sections),
    sections,
    faqs: [
      {
        question: "Where is the best place to develop property in the UK?",
        answer: ranked[0]
          ? `Our analysis ranks ${ranked[0].name} as the top development hotspot in 2026, based on new-build activity (${ranked[0].totalNewBuilds} completions), transaction volume (${ranked[0].totalTransactions.toLocaleString("en-GB")} sales), and price growth (${ranked[0].avgYoyChange > 0 ? "+" : ""}${ranked[0].avgYoyChange}%). See the full ranking for all ${ranked.length} counties.`
          : "See our full ranking.",
      },
    ],
    relatedReportSlugs: ranked.slice(0, 5).map((c) => `${c.slug}-property-market`),
    relatedTownSlugs: [],
    relatedServiceSlugs: ["development-finance", "mezzanine-finance", "bridging-loans", "equity-jv"],
  };
}

// ── Town Report Generator ─────────────────────────────────────────

function generateTownReport(town: TownAgg, county: CountyAgg): MarketReport {
  const slug = `${town.slug}-${county.slug}-property-market`;
  const countyReportSlug = `${county.slug}-property-market`;
  const regionSlugStr = regionSlug(county.region);
  const sections: ReportSection[] = [];
  const stats = town.stats;

  // Price vs county and national
  const priceVsCounty = stats.medianPrice > county.medianPrice
    ? `${formatPriceShort(stats.medianPrice - county.medianPrice)} above the ${county.name} county median of ${formatPrice(county.medianPrice)}`
    : stats.medianPrice < county.medianPrice
    ? `${formatPriceShort(county.medianPrice - stats.medianPrice)} below the ${county.name} county median of ${formatPrice(county.medianPrice)}`
    : `in line with the ${county.name} county median`;

  const priceVsNational = stats.medianPrice > NATIONAL_MEDIAN
    ? `${formatPriceShort(stats.medianPrice - NATIONAL_MEDIAN)} above`
    : stats.medianPrice < NATIONAL_MEDIAN
    ? `${formatPriceShort(NATIONAL_MEDIAN - stats.medianPrice)} below`
    : "in line with";

  // Town rank within county
  const priceRank = [...county.towns].sort((a, b) => b.stats.medianPrice - a.stats.medianPrice).findIndex((t) => t.slug === town.slug) + 1;
  const volumeRank = [...county.towns].sort((a, b) => b.stats.transactionCount12m - a.stats.transactionCount12m).findIndex((t) => t.slug === town.slug) + 1;
  const ordinal = (n: number) => n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;

  // 1. Market Overview
  sections.push({
    heading: `${town.name} Property Market Overview`,
    content: [
      `${town.context}`,
      `The ${townLink(county.slug, town.slug, town.name)} property market recorded <strong>${stats.transactionCount12m.toLocaleString("en-GB")}</strong> residential sales over the past 12 months, with a median sale price of <strong>${formatPrice(stats.medianPrice)}</strong>. This places ${town.name} ${priceVsCounty}, and ${priceVsNational} the UK national median of ${formatPrice(NATIONAL_MEDIAN)}.`,
      `Prices in ${town.name} have shown ${trendWord(stats.yoyChange)}, with a year-on-year change of <strong>${stats.yoyChange > 0 ? "+" : ""}${stats.yoyChange}%</strong>. Within ${countyLink(county.slug, county.name)}, ${town.name} ranks ${ordinal(priceRank)} by price out of ${county.towns.length} principal towns, and ${ordinal(volumeRank)} by transaction volume.`,
    ],
  });

  // 2. Price by Property Type
  const typeEntries = Object.entries(stats.medianByType)
    .filter(([, v]) => v && v > 0)
    .sort(([, a], [, b]) => (b || 0) - (a || 0));

  if (typeEntries.length > 0) {
    const typeRows = typeEntries.map(([type, price]) => {
      const countyPrice = county.medianByType[type as keyof typeof county.medianByType];
      const national = NATIONAL_MEDIAN_BY_TYPE[type] || 0;
      return `<tr><td><strong>${TYPE_LABELS_UPPER[type] || type}</strong></td><td>${formatPrice(price!)}</td><td>${countyPrice ? formatPrice(countyPrice) : "—"}</td><td>${national > 0 ? formatPrice(national) : "—"}</td></tr>`;
    });

    const spread = typeEntries.length >= 2
      ? typeEntries[0][1]! - typeEntries[typeEntries.length - 1][1]!
      : 0;

    sections.push({
      heading: `${town.name} House Prices by Property Type`,
      content: [
        `Property prices in ${town.name} vary significantly by type. The table below compares ${town.name} prices with ${county.name} county averages and UK national figures.`,
        `<table><thead><tr><th>Type</th><th>${town.name}</th><th>${county.name} Avg</th><th>UK Avg</th></tr></thead><tbody>${typeRows.join("")}</tbody></table>`,
        typeEntries.length >= 2
          ? `${TYPE_LABELS_UPPER[typeEntries[0][0]]} homes in ${town.name} command <strong>${formatPrice(typeEntries[0][1]!)}</strong>, while ${TYPE_LABELS[typeEntries[typeEntries.length - 1][0]]} properties are most accessible at <strong>${formatPrice(typeEntries[typeEntries.length - 1][1]!)}</strong>. The <strong>${formatPriceShort(spread)} spread</strong> between the most and least expensive types indicates ${spread > 200000 ? "a diverse market with opportunities across the development spectrum" : "a relatively compressed market where margins between types are tighter"}.`
          : "",
      ].filter(Boolean),
    });
  }

  // 3. New Build Activity
  if (stats.newBuildCount > 0 || stats.newBuildPremium !== 0) {
    const newBuildPct = stats.transactionCount12m > 0
      ? ((stats.newBuildCount / stats.transactionCount12m) * 100).toFixed(1)
      : "0";
    const premWord = stats.newBuildPremium > 0 ? "premium" : "discount";

    sections.push({
      heading: `New Build Homes in ${town.name}`,
      content: [
        `${town.name} recorded <strong>${stats.newBuildCount}</strong> new-build transactions in the past 12 months, representing <strong>${newBuildPct}%</strong> of total sales. ${stats.newBuildCount > 20 ? "This indicates meaningful developer activity and proven buyer demand for new homes in the area." : stats.newBuildCount > 5 ? "There is moderate development activity, with room for further growth." : "New-build supply is limited, potentially indicating either planning constraints or an untapped opportunity for developers."}`,
        stats.newBuildPremium !== 0
          ? `New-build properties in ${town.name} traded at a <strong>${premWord} of ${Math.abs(stats.newBuildPremium).toFixed(1)}%</strong> versus existing stock. ${stats.newBuildPremium > 0 ? "This premium supports the viability of new development, as buyers are willing to pay more for new homes." : "Developers should focus on specification, design quality, and location to maximise values above comparable second-hand stock."}`
          : "",
        `Across the wider ${reportLink(countyReportSlug, county.name)} market, ${county.totalNewBuilds.toLocaleString("en-GB")} new-build completions were recorded — see our ${reportLink(countyReportSlug, `${county.name} property market report`)} for the full county picture.`,
      ].filter(Boolean),
    });
  }

  // 4. Recent Notable Transactions
  const topTx = (town.topTransactions || []).slice(0, 8);
  if (topTx.length > 0) {
    const txRows = topTx.map((tx) =>
      `<tr><td>${formatPrice(tx.price)}</td><td>${TYPE_LABELS_UPPER[tx.propertyType] || tx.propertyType}</td><td>${tx.postcode}</td><td>${tx.date}</td><td>${tx.newBuild ? "New" : "Existing"}</td></tr>`
    );

    sections.push({
      heading: `Recent Property Sales in ${town.name}`,
      content: [
        `The following table shows the most recent property transactions recorded in ${town.name}, providing real-time evidence of achieved prices for buyers, sellers, and developers:`,
        `<table><thead><tr><th>Price</th><th>Type</th><th>Postcode</th><th>Date</th><th>Status</th></tr></thead><tbody>${txRows.join("")}</tbody></table>`,
        `These transactions are sourced from HM Land Registry Price Paid data and represent completed, registered sales. ${topTx.length >= 5 ? `The range from ${formatPrice(Math.min(...topTx.map((t) => t.price)))} to ${formatPrice(Math.max(...topTx.map((t) => t.price)))} illustrates the breadth of the ${town.name} market.` : ""}`,
      ],
    });
  }

  // 5. Development Finance Implications
  const typicalGdv = stats.medianByType.D || stats.medianPrice * 1.4;
  const seniorDebt = Math.round(typicalGdv * 0.65);

  sections.push({
    heading: `Development Finance in ${town.name}`,
    content: [
      `For developers considering ${town.name}, the local market data translates directly into finance structuring. With a median value of ${formatPrice(stats.medianPrice)} and ${stats.medianByType.D ? `detached homes at ${formatPrice(stats.medianByType.D)}` : "strong demand across property types"}, lenders can assess scheme viability with confidence.`,
      `A typical ${serviceLink("development-finance", "development finance")} facility for a ${town.name} scheme with a GDV of ${formatPrice(typicalGdv)} would attract <strong>senior debt of approximately ${formatPrice(seniorDebt)}</strong> at 65% LTGDV. ${serviceLink("mezzanine-finance", "Mezzanine finance")} can stretch total borrowing to 85-90% of costs, while ${serviceLink("bridging-loans", "bridging loans")} enable rapid site acquisitions completing in as little as 5 working days.`,
      `${stats.yoyChange > 0 ? `With prices rising ${stats.yoyChange}% year-on-year, ${town.name} presents a supportive environment for new development. Lenders view positive price momentum favourably when assessing loan applications.` : `While prices have ${stats.yoyChange === 0 ? "remained flat" : `softened ${Math.abs(stats.yoyChange)}%`} year-on-year, experienced developers can still generate strong returns in ${town.name} by targeting well-located sites with clear demand drivers.`}`,
      `Ready to develop in ${town.name}? <a href="/deal-room">Submit your scheme</a> for indicative terms within 24 hours from our panel of 100+ lenders.`,
    ],
  });

  // 6. How Town Fits in County Context
  const nearbyTowns = county.towns
    .filter((t) => t.slug !== town.slug)
    .sort((a, b) => Math.abs(a.stats.medianPrice - stats.medianPrice) - Math.abs(b.stats.medianPrice - stats.medianPrice))
    .slice(0, 5);

  if (nearbyTowns.length > 0) {
    const compRows = nearbyTowns.map((t) =>
      `<tr><td>${townLink(county.slug, t.slug, t.name)}</td><td>${formatPrice(t.stats.medianPrice)}</td><td>${t.stats.transactionCount12m.toLocaleString("en-GB")}</td><td>${t.stats.yoyChange > 0 ? "+" : ""}${t.stats.yoyChange}%</td></tr>`
    );

    sections.push({
      heading: `${town.name} Compared to Nearby ${county.name} Towns`,
      content: [
        `To put ${town.name}'s market in context, the table below compares it with similarly-priced towns across ${countyLink(county.slug, county.name)}:`,
        `<table><thead><tr><th>Town</th><th>Median Price</th><th>Sales (12m)</th><th>YoY Change</th></tr></thead><tbody><tr><td><strong>${town.name}</strong></td><td><strong>${formatPrice(stats.medianPrice)}</strong></td><td><strong>${stats.transactionCount12m.toLocaleString("en-GB")}</strong></td><td><strong>${stats.yoyChange > 0 ? "+" : ""}${stats.yoyChange}%</strong></td></tr>${compRows.join("")}</tbody></table>`,
        `For the full ${county.name} town-by-town breakdown, see our comprehensive ${reportLink(countyReportSlug, `${county.name} property market report`)}.`,
      ],
    });
  }

  // FAQs
  const faqs: ReportFaq[] = [
    {
      question: `What is the average house price in ${town.name}?`,
      answer: `The median house price in ${town.name} is ${formatPrice(stats.medianPrice)}, based on ${stats.transactionCount12m.toLocaleString("en-GB")} transactions over the past 12 months. ${typeEntries.length >= 2 ? `${TYPE_LABELS_UPPER[typeEntries[0][0]]} homes average ${formatPrice(typeEntries[0][1]!)} while ${TYPE_LABELS[typeEntries[typeEntries.length - 1][0]]} properties average ${formatPrice(typeEntries[typeEntries.length - 1][1]!)}.` : ""}`,
    },
    {
      question: `Are house prices rising or falling in ${town.name}?`,
      answer: `House prices in ${town.name} are ${trendDirection(stats.yoyChange)} at ${stats.yoyChange > 0 ? "+" : ""}${stats.yoyChange}% year-on-year. ${stats.yoyChange > 0 ? "This positive trend suggests sustained buyer demand." : stats.yoyChange === 0 ? "The market is broadly stable." : "This decline may present buying opportunities for investors and developers."} The wider ${county.name} market is ${trendDirection(county.avgYoyChange)} at ${county.avgYoyChange > 0 ? "+" : ""}${county.avgYoyChange}%.`,
    },
    {
      question: `How many properties sold in ${town.name} recently?`,
      answer: `${town.name} recorded ${stats.transactionCount12m.toLocaleString("en-GB")} residential property sales in the past 12 months. ${stats.transactionCount12m > 500 ? "This high volume indicates a liquid, active market." : stats.transactionCount12m > 200 ? "This represents a reasonably active market." : "This is a smaller market where properties may take longer to sell."}`,
    },
    {
      question: `What development finance is available for projects in ${town.name}?`,
      answer: `Developers in ${town.name} can access development finance from 6.5% p.a. at 65-70% LTGDV, mezzanine finance stretching to 85-90% of costs, bridging loans completing in 5-10 days, and development exit finance. Construction Capital sources the best terms from 100+ lenders.`,
    },
  ];

  // Charts
  const charts: MarketReport["charts"] = {};
  if (typeEntries.length > 0) {
    charts.priceByType = typeEntries.map(([type, price]) => ({
      name: TYPE_LABELS_UPPER[type] || type,
      value: price!,
    }));
  }

  // Related
  const siblingTowns = county.towns
    .filter((t) => t.slug !== town.slug)
    .slice(0, 4)
    .map((t) => `${t.slug}-${county.slug}-property-market`);

  return {
    slug,
    title: `${town.name} Property Market: House Prices, Sold Data & Development Finance (2026)`,
    metaTitle: `${town.name} House Prices 2026 — Property Market Data & Development Finance | ${county.name}`,
    metaDescription: `${town.name} property prices: median ${formatPrice(stats.medianPrice)}, ${stats.transactionCount12m.toLocaleString("en-GB")} sales, ${stats.yoyChange > 0 ? "+" : ""}${stats.yoyChange}% YoY. ${typeEntries.length >= 2 ? `${TYPE_LABELS_UPPER[typeEntries[0][0]]} ${formatPrice(typeEntries[0][1]!)}, ${TYPE_LABELS_UPPER[typeEntries[typeEntries.length - 1][0]]} ${formatPrice(typeEntries[typeEntries.length - 1][1]!)}. ` : ""}Land Registry data for ${town.name}, ${county.name}.`,
    excerpt: `Median price ${formatPrice(stats.medianPrice)}, ${stats.transactionCount12m.toLocaleString("en-GB")} sales, ${stats.yoyChange > 0 ? "+" : ""}${stats.yoyChange}% YoY. ${county.name} county.`,
    category: "town",
    region: county.region,
    countySlug: county.slug,
    townSlug: town.slug,
    datePublished: TODAY,
    dateModified: TODAY,
    readingTime: estimateReadingTime(sections),
    sections,
    faqs,
    relatedReportSlugs: [countyReportSlug, `${regionSlugStr}-market-overview`, ...siblingTowns],
    relatedTownSlugs: [`${county.slug}/${town.slug}`],
    relatedServiceSlugs: ["development-finance", "bridging-loans", "mezzanine-finance"],
    charts: Object.keys(charts).length > 0 ? charts : undefined,
  };
}

// ── File Writing ───────────────────────────────────────────────────

function writeReport(report: MarketReport, subDir: string): void {
  const dir = path.join(OUTPUT_DIR, subDir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${report.slug}.ts`);

  // Escape backticks and dollar signs in content
  const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");

  const content = `import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "${report.slug}",
  title: "${escape(report.title)}",
  metaTitle: "${escape(report.metaTitle)}",
  metaDescription: "${escape(report.metaDescription)}",
  excerpt: "${escape(report.excerpt)}",
  category: "${report.category}",
  ${report.region ? `region: "${escape(report.region)}",` : ""}
  ${report.countySlug ? `countySlug: "${report.countySlug}",` : ""}
  ${report.townSlug ? `townSlug: "${report.townSlug}",` : ""}
  datePublished: "${report.datePublished}",
  dateModified: "${report.dateModified}",
  readingTime: "${report.readingTime}",
  sections: [
${report.sections
  .map(
    (s) => `    {
      heading: \`${escape(s.heading)}\`,
      content: [
${s.content.map((p) => `        \`${escape(p)}\`,`).join("\n")}
      ],
    },`
  )
  .join("\n")}
  ],
  faqs: [
${report.faqs
  .map(
    (f) => `    {
      question: \`${escape(f.question)}\`,
      answer: \`${escape(f.answer)}\`,
    },`
  )
  .join("\n")}
  ],
  relatedReportSlugs: [${report.relatedReportSlugs.map((s) => `"${s}"`).join(", ")}],
  relatedTownSlugs: [${report.relatedTownSlugs.map((s) => `"${s}"`).join(", ")}],
  relatedServiceSlugs: [${report.relatedServiceSlugs.map((s) => `"${s}"`).join(", ")}],${report.charts ? `
  charts: ${JSON.stringify(report.charts)},` : ""}
};

export default report;
`;

  fs.writeFileSync(filePath, content);
}

// ── Main ───────────────────────────────────────────────────────────

function main() {
  console.log("Loading UK counties data...");
  const ukCounties = loadUkCounties();
  console.log(`  Found ${ukCounties.length} counties`);

  console.log("Loading sold data...");
  const soldData = loadSoldData();
  console.log(`  Found ${soldData.size} counties with sold data`);

  console.log("Aggregating county data...");
  const counties = aggregateCounties(soldData, ukCounties);
  console.log(`  Aggregated ${counties.length} counties`);

  console.log("Aggregating regional data...");
  const regions = aggregateRegions(counties);
  console.log(`  Aggregated ${regions.length} regions`);

  // Clean output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate county reports
  console.log("\nGenerating county reports...");
  const countyReports: MarketReport[] = [];
  for (const county of counties) {
    const report = generateCountyReport(county, counties);
    writeReport(report, "county");
    countyReports.push(report);
    process.stdout.write(".");
  }
  console.log(`\n  Generated ${countyReports.length} county reports`);

  // Generate regional reports
  console.log("Generating regional reports...");
  const regionalReports: MarketReport[] = [];
  for (const region of regions) {
    const report = generateRegionalReport(region, counties);
    writeReport(report, "regional");
    regionalReports.push(report);
    process.stdout.write(".");
  }
  console.log(`\n  Generated ${regionalReports.length} regional reports`);

  // Generate thematic reports
  console.log("Generating thematic reports...");
  const thematicReports: MarketReport[] = [];

  const nbReport = generateNewBuildReport(counties);
  writeReport(nbReport, "thematic");
  thematicReports.push(nbReport);
  process.stdout.write(".");

  const activeReport = generateMostActiveReport(counties);
  writeReport(activeReport, "thematic");
  thematicReports.push(activeReport);
  process.stdout.write(".");

  const priceReport = generatePriceChangeReport(counties);
  writeReport(priceReport, "thematic");
  thematicReports.push(priceReport);
  process.stdout.write(".");

  const typeReport = generatePropertyTypeReport(counties);
  writeReport(typeReport, "thematic");
  thematicReports.push(typeReport);
  process.stdout.write(".");

  const hotspotsReport = generateHotspotsReport(counties);
  writeReport(hotspotsReport, "thematic");
  thematicReports.push(hotspotsReport);
  process.stdout.write(".");

  console.log(`\n  Generated ${thematicReports.length} thematic reports`);

  // Generate town reports
  console.log("Generating town reports...");
  const townReports: MarketReport[] = [];
  for (const county of counties) {
    for (const town of county.towns) {
      const report = generateTownReport(town, county);
      writeReport(report, `town`);
      townReports.push(report);
      process.stdout.write(".");
    }
  }
  console.log(`\n  Generated ${townReports.length} town reports`);

  // Generate town barrel file
  console.log("Generating town barrel index...");
  const townImports = townReports.map((r) => {
    const varName = r.slug.replace(/-/g, "_");
    return `import ${varName} from "./${r.slug}";`;
  });
  const townExports = townReports.map((r) => r.slug.replace(/-/g, "_"));
  const townBarrel = `import type { MarketReport } from "../../types";\n\n${townImports.join("\n")}\n\nexport const TOWN_REPORTS: MarketReport[] = [\n  ${townExports.join(",\n  ")},\n];\n`;
  const townIndexPath = path.join(OUTPUT_DIR, "town", "index.ts");
  fs.writeFileSync(townIndexPath, townBarrel);
  console.log("  Generated town/index.ts barrel");

  // Summary
  const total = countyReports.length + regionalReports.length + thematicReports.length + townReports.length;
  console.log(`\n✓ Generated ${total} market reports`);
  console.log(`  County: ${countyReports.length}`);
  console.log(`  Regional: ${regionalReports.length}`);
  console.log(`  Thematic: ${thematicReports.length}`);
  console.log(`  Town: ${townReports.length}`);
}

main();
