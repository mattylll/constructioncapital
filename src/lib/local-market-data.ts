/**
 * Data access layer for pre-computed local market data.
 *
 * Reads JSON files from data/generated/ at build/ISR time.
 * Returns null when data doesn't exist for a given town (graceful fallback).
 *
 * Server-only - do not use in client components.
 */

import fs from "fs";
import path from "path";

// ─── Types ───────────────────────────────────────────────────

export interface TownStats {
  updatedAt: string;
  townSlug: string;
  countySlug: string;
  marketSnapshot: {
    medianPrice: number;
    transactionCount12m: number;
    yoyPriceChange: number;
    approvedApps12m: number;
    pipelineUnits: number;
    pipelineGdv: number;
    approvalRate: number;
  };
}

export interface SoldTransaction {
  price: number;
  date: string;
  postcode: string;
  propertyType: string;
  newBuild: boolean;
  tenure: string;
  address: string;
}

export interface SoldData {
  updatedAt: string;
  townSlug: string;
  countySlug: string;
  stats: {
    medianPrice: number;
    medianByType: Record<string, number>;
    transactionCount12m: number;
    yoyChange: number;
    newBuildCount: number;
    existingCount: number;
    newBuildPremium: number;
  };
  recentTransactions: SoldTransaction[];
}

export interface PlanningApp {
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

export interface PlanningData {
  updatedAt: string;
  townSlug: string;
  countySlug: string;
  localAuthority: string;
  summary: {
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
  };
  approvedApplications: PlanningApp[];
  pendingApplications: PlanningApp[];
}

// ─── Readers ─────────────────────────────────────────────────

function readJSON<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    
return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

export interface CountyAggregateData {
  medianPrice: number;
  totalTransactions: number;
  avgYoyChange: number;
  totalNewBuilds: number;
  medianByType: Record<string, number>;
  townCount: number;
  towns: {
    name: string;
    slug: string;
    medianPrice: number;
    transactionCount12m: number;
    yoyChange: number;
    newBuildCount: number;
    medianByType: Record<string, number>;
  }[];
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export function getCountyAggregateData(
  countySlug: string,
  towns: { name: string; slug: string }[]
): CountyAggregateData | null {
  const soldDataDir = path.join(process.cwd(), "data", "generated", "sold-data", countySlug);
  if (!fs.existsSync(soldDataDir)) return null;

  const townData: CountyAggregateData["towns"] = [];
  const allPrices: number[] = [];
  const yoyValues: number[] = [];
  let totalTx = 0;
  let totalNB = 0;
  const typeD: number[] = [];
  const typeS: number[] = [];
  const typeT: number[] = [];
  const typeF: number[] = [];

  for (const town of towns) {
    const data = getSoldData(countySlug, town.slug);
    if (!data) continue;

    townData.push({
      name: town.name,
      slug: town.slug,
      medianPrice: data.stats.medianPrice,
      transactionCount12m: data.stats.transactionCount12m,
      yoyChange: data.stats.yoyChange,
      newBuildCount: data.stats.newBuildCount,
      medianByType: data.stats.medianByType,
    });

    allPrices.push(data.stats.medianPrice);
    totalTx += data.stats.transactionCount12m;
    totalNB += data.stats.newBuildCount;
    yoyValues.push(data.stats.yoyChange);
    if (data.stats.medianByType.D) typeD.push(data.stats.medianByType.D);
    if (data.stats.medianByType.S) typeS.push(data.stats.medianByType.S);
    if (data.stats.medianByType.T) typeT.push(data.stats.medianByType.T);
    if (data.stats.medianByType.F) typeF.push(data.stats.medianByType.F);
  }

  if (townData.length === 0) return null;

  return {
    medianPrice: median(allPrices),
    totalTransactions: totalTx,
    avgYoyChange: yoyValues.length > 0
      ? parseFloat((yoyValues.reduce((a, b) => a + b, 0) / yoyValues.length).toFixed(1))
      : 0,
    totalNewBuilds: totalNB,
    medianByType: {
      ...(typeD.length > 0 ? { D: median(typeD) } : {}),
      ...(typeS.length > 0 ? { S: median(typeS) } : {}),
      ...(typeT.length > 0 ? { T: median(typeT) } : {}),
      ...(typeF.length > 0 ? { F: median(typeF) } : {}),
    },
    townCount: townData.length,
    towns: townData,
  };
}

export function getTownStats(
  countySlug: string,
  townSlug: string
): TownStats | null {
  const filePath = path.join(
    process.cwd(),
    "data",
    "generated",
    "town-stats",
    countySlug,
    `${townSlug}.json`
  );
  
return readJSON<TownStats>(filePath);
}

export function getSoldData(
  countySlug: string,
  townSlug: string
): SoldData | null {
  const filePath = path.join(
    process.cwd(),
    "data",
    "generated",
    "sold-data",
    countySlug,
    townSlug,
    "latest.json"
  );
  
return readJSON<SoldData>(filePath);
}

export function getPlanningData(
  countySlug: string,
  townSlug: string
): PlanningData | null {
  const filePath = path.join(
    process.cwd(),
    "data",
    "generated",
    "planning",
    countySlug,
    townSlug,
    "latest.json"
  );
  
return readJSON<PlanningData>(filePath);
}

// ─── Guide Market Data ──────────────────────────────────────

export interface GuideMarketData {
  /** Aggregated sold price stats across all related counties */
  medianPrice: number;
  totalTransactions: number;
  avgYoyChange: number;
  newBuildPremium: number;
  medianByType: Record<string, number>;
  /** Top towns by transaction count — for internal linking */
  topTowns: {
    name: string;
    slug: string;
    countySlug: string;
    medianPrice: number;
    transactionCount12m: number;
    yoyChange: number;
  }[];
  /** Planning pipeline — only populated if planning data exists for related counties */
  planning: {
    totalApproved: number;
    totalPending: number;
    pipelineUnits: number;
    pipelineGdv: number;
    avgApprovalRate: number;
    categories: Record<string, number>;
  } | null;
  /** Number of counties and towns included in this data */
  countyCount: number;
  townCount: number;
}

/**
 * Aggregate regional market data across multiple counties for guide pages.
 * Uses the guide's relatedLocations (county slugs) to pull sold + planning data.
 */
export function getGuideMarketData(
  countySlugs: string[],
  getTowns: (countySlug: string) => { name: string; slug: string }[]
): GuideMarketData | null {
  if (countySlugs.length === 0) return null;

  const allPrices: number[] = [];
  const yoyValues: number[] = [];
  const newBuildPremiums: number[] = [];
  let totalTx = 0;
  const typeD: number[] = [];
  const typeS: number[] = [];
  const typeT: number[] = [];
  const typeF: number[] = [];

  const allTowns: GuideMarketData["topTowns"] = [];
  let totalTownCount = 0;
  let countyCount = 0;

  // Planning aggregation
  let totalApproved = 0;
  let totalPending = 0;
  let pipelineUnits = 0;
  let pipelineGdv = 0;
  const approvalRates: number[] = [];
  const categories: Record<string, number> = {};
  let hasPlanningData = false;

  for (const countySlug of countySlugs) {
    const towns = getTowns(countySlug);
    if (towns.length === 0) continue;

    let countyHasData = false;

    for (const town of towns) {
      const data = getSoldData(countySlug, town.slug);
      if (!data) continue;

      countyHasData = true;
      totalTownCount++;

      allPrices.push(data.stats.medianPrice);
      totalTx += data.stats.transactionCount12m;
      yoyValues.push(data.stats.yoyChange);
      if (data.stats.newBuildPremium !== 0) {
        newBuildPremiums.push(data.stats.newBuildPremium);
      }
      if (data.stats.medianByType.D) typeD.push(data.stats.medianByType.D);
      if (data.stats.medianByType.S) typeS.push(data.stats.medianByType.S);
      if (data.stats.medianByType.T) typeT.push(data.stats.medianByType.T);
      if (data.stats.medianByType.F) typeF.push(data.stats.medianByType.F);

      allTowns.push({
        name: town.name,
        slug: town.slug,
        countySlug,
        medianPrice: data.stats.medianPrice,
        transactionCount12m: data.stats.transactionCount12m,
        yoyChange: data.stats.yoyChange,
      });

      // Planning data (only exists for some counties)
      const planning = getPlanningData(countySlug, town.slug);
      if (planning && planning.summary.total > 0) {
        hasPlanningData = true;
        totalApproved += planning.summary.approved;
        totalPending += planning.summary.pending;
        pipelineUnits += planning.summary.totalUnits;
        pipelineGdv += planning.summary.totalEstimatedGDV;
        if (planning.summary.approvalRate > 0) {
          approvalRates.push(planning.summary.approvalRate);
        }
        // Aggregate categories from apps
        for (const app of [...planning.approvedApplications, ...planning.pendingApplications]) {
          const cat = app.category || "other";
          categories[cat] = (categories[cat] || 0) + 1;
        }
      }
    }

    if (countyHasData) countyCount++;
  }

  if (allPrices.length === 0) return null;

  // Sort towns by transaction count, take top 5
  const topTowns = allTowns
    .sort((a, b) => b.transactionCount12m - a.transactionCount12m)
    .slice(0, 5);

  return {
    medianPrice: median(allPrices),
    totalTransactions: totalTx,
    avgYoyChange: yoyValues.length > 0
      ? parseFloat((yoyValues.reduce((a, b) => a + b, 0) / yoyValues.length).toFixed(1))
      : 0,
    newBuildPremium: newBuildPremiums.length > 0
      ? parseFloat((newBuildPremiums.reduce((a, b) => a + b, 0) / newBuildPremiums.length).toFixed(1))
      : 0,
    medianByType: {
      ...(typeD.length > 0 ? { D: median(typeD) } : {}),
      ...(typeS.length > 0 ? { S: median(typeS) } : {}),
      ...(typeT.length > 0 ? { T: median(typeT) } : {}),
      ...(typeF.length > 0 ? { F: median(typeF) } : {}),
    },
    topTowns,
    planning: hasPlanningData
      ? {
          totalApproved,
          totalPending,
          pipelineUnits,
          pipelineGdv,
          avgApprovalRate: approvalRates.length > 0
            ? parseFloat((approvalRates.reduce((a, b) => a + b, 0) / approvalRates.length).toFixed(0))
            : 0,
          categories,
        }
      : null,
    countyCount,
    townCount: totalTownCount,
  };
}
