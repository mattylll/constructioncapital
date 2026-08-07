import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

export interface NationalMarketSummary {
  /** Number of UK towns with a town-stats file. */
  townsTracked: number;
  /**
   * Number of towns actually contributing to the aggregates below. Lower than
   * `townsTracked` because towns sharing an HMLR district are counted once —
   * use this as the denominator for any "X of Y towns" claim, never
   * `townsTracked`.
   */
  townsCounted: number;
  /**
   * Total Land Registry transactions in the last 12 months, counting each HMLR
   * district once rather than once per town sharing it.
   */
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
  /** True when this town's figures are its HMLR district's, not its own. */
  isDistrictLevelFallback?: boolean;
  /** HMLR district(s) the transactions were drawn from. */
  hmlrDistricts?: string[];
  marketSnapshot?: {
    medianPrice?: number;
    transactionCount12m?: number;
    yoyPriceChange?: number | null;
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
      townsCounted: 0,
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

  const parsedFiles: { path: string; data: TownSnapshotFile }[] = [];
  for (const filePath of files) {
    try {
      const data: TownSnapshotFile = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      if (data.updatedAt) {
        const ts = Date.parse(data.updatedAt);
        if (!Number.isNaN(ts) && ts > latestUpdate) latestUpdate = ts;
      }
      if (data.marketSnapshot) parsedFiles.push({ path: filePath, data });
    } catch {
      // skip malformed files — national strip must not fail the build
      continue;
    }
  }

  // Towns sharing an HMLR district can each carry that whole district's
  // transactions, so summing every town counts the same sales repeatedly
  // (all six Cardiff neighbourhoods hold the full Cardiff figure). Group by
  // district and count each district once. Files written before
  // `hmlrDistricts` existed have no district to group on, so each is treated
  // as its own group — that degrades to the previous behaviour rather than
  // silently collapsing unrelated towns together.
  const groups = new Map<string, { path: string; data: TownSnapshotFile }[]>();
  for (const entry of parsedFiles) {
    const districts = entry.data.hmlrDistricts;
    const key =
      districts && districts.length > 0
        ? [...districts].sort().join("|")
        : `__ungrouped__:${entry.path}`;
    const bucket = groups.get(key);
    if (bucket) bucket.push(entry);
    else groups.set(key, [entry]);
  }

  const counted: TownSnapshotFile[] = [];
  for (const members of groups.values()) {
    if (members.length === 1) {
      counted.push(members[0].data);
      continue;
    }
    // A fallback town's figures are a superset of its properly-attributed
    // siblings', so prefer the siblings whenever any exist.
    const specific = members.filter((m) => !m.data.isDistrictLevelFallback);
    if (specific.length > 0) {
      for (const m of specific) counted.push(m.data);
      continue;
    }
    // Every member is district-level: they are copies of one another, so keep
    // a single representative. Dropping them all would erase the area
    // entirely. Sort by path for a stable choice across builds.
    const representative = [...members].sort((a, b) => a.path.localeCompare(b.path))[0];
    counted.push(representative.data);
  }

  for (const data of counted) {
    const snap = data.marketSnapshot;
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
  }

  return {
    townsTracked: files.length,
    townsCounted: counted.length,
    transactions12m: transactionsTotal,
    medianOfMedianPrices: median(medianPrices),
    townsWithPositiveYoy: positiveYoyCount,
    medianYoyChange: median(yoyChanges),
    dataAsOf:
      latestUpdate > 0
        ? new Date(latestUpdate).toISOString()
        : "",
  };
});
