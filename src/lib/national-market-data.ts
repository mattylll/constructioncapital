import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

export interface NationalMarketSummary {
  /** Number of UK towns with a town-stats file. */
  townsTracked: number;
  /** Total Land Registry transactions observed across tracked towns in the last 12 months. */
  transactions12m: number;
  /** Median of town-level median prices across tracked towns (£). */
  medianOfMedianPrices: number;
  /** Number of tracked towns with a positive YoY median-price movement. */
  townsWithPositiveYoy: number;
  /** Headline YoY figure (median across towns with non-zero readings). */
  medianYoyChange: number;
  /** Most recent `updatedAt` timestamp observed across the dataset (ISO). */
  dataAsOf: string;
}

interface TownSnapshotFile {
  updatedAt?: string;
  marketSnapshot?: {
    medianPrice?: number;
    transactionCount12m?: number;
    yoyPriceChange?: number;
  };
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

/**
 * Walk `data/generated/town-stats/**\/*.json` and aggregate national figures.
 * Memoised per server instance via `react.cache`; safe to call from server components.
 */
export const getNationalMarketSummary = cache((): NationalMarketSummary => {
  const root = path.join(process.cwd(), "data", "generated", "town-stats");

  const files: string[] = [];
  if (!fs.existsSync(root)) {
    return {
      townsTracked: 0,
      transactions12m: 0,
      medianOfMedianPrices: 0,
      townsWithPositiveYoy: 0,
      medianYoyChange: 0,
      dataAsOf: "",
    };
  }

  for (const county of fs.readdirSync(root, { withFileTypes: true })) {
    if (!county.isDirectory()) continue;
    const countyDir = path.join(root, county.name);
    for (const file of fs.readdirSync(countyDir)) {
      if (file.endsWith(".json")) {
        files.push(path.join(countyDir, file));
      }
    }
  }

  const medianPrices: number[] = [];
  const yoyChanges: number[] = [];
  let transactionsTotal = 0;
  let positiveYoyCount = 0;
  let latestUpdate = 0;

  for (const filePath of files) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed: TownSnapshotFile = JSON.parse(raw);

      if (parsed.updatedAt) {
        const ts = Date.parse(parsed.updatedAt);
        if (!Number.isNaN(ts) && ts > latestUpdate) latestUpdate = ts;
      }

      const snap = parsed.marketSnapshot;
      if (!snap) continue;

      if (typeof snap.medianPrice === "number" && snap.medianPrice > 0) {
        medianPrices.push(snap.medianPrice);
      }
      if (typeof snap.transactionCount12m === "number") {
        transactionsTotal += snap.transactionCount12m;
      }
      if (typeof snap.yoyPriceChange === "number") {
        yoyChanges.push(snap.yoyPriceChange);
        if (snap.yoyPriceChange > 0) positiveYoyCount += 1;
      }
    } catch {
      // skip malformed files — national strip must not fail the build
      continue;
    }
  }

  const nonZeroYoy = yoyChanges.filter((v) => v !== 0);

  return {
    townsTracked: files.length,
    transactions12m: transactionsTotal,
    medianOfMedianPrices: median(medianPrices),
    townsWithPositiveYoy: positiveYoyCount,
    medianYoyChange: median(nonZeroYoy.length > 0 ? nonZeroYoy : [0]),
    dataAsOf:
      latestUpdate > 0
        ? new Date(latestUpdate).toISOString()
        : "",
  };
});
