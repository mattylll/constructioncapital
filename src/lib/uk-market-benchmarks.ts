/**
 * UK Market Benchmarks
 *
 * Reference data points for comparison panels in market intelligence
 * briefings. Updated periodically from ONS House Price Index + HMLR.
 *
 * Sources:
 *  - ONS House Price Index, March 2026 release
 *  - HM Land Registry Price Paid (Q1 2026 aggregates)
 */

export const UK_BENCHMARKS = {
  /** UK average median sale price (March 2026 HMLR rolling 12m) */
  ukMedianPrice: 285_000,
  /** UK average YoY price change (March 2026 ONS HPI) */
  ukYoyChange: 1.4,
  /** England average median */
  englandMedianPrice: 305_000,
  /** Wales average median */
  walesMedianPrice: 220_000,
  /** London average median */
  londonMedianPrice: 525_000,
  /** South East average median */
  southEastMedianPrice: 400_000,
  /** North West average median */
  northWestMedianPrice: 215_000,
  /** Yorkshire & Humber average median */
  yorkshireMedianPrice: 200_000,
  /** Midlands average median (combined East + West) */
  midlandsMedianPrice: 240_000,
  /** North East average median */
  northEastMedianPrice: 165_000,
  /** South West average median */
  southWestMedianPrice: 320_000,
  /** East of England average median */
  eastAngliaMedianPrice: 340_000,
} as const;

/** Returns the relevant regional benchmark for a region slug. */
export function getRegionalBenchmark(region: string): {
  label: string;
  median: number;
  yoy: number | null;
} {
  switch (region) {
    case "london":
      return { label: "London average", median: UK_BENCHMARKS.londonMedianPrice, yoy: 0.8 };
    case "south-east":
      return { label: "South East average", median: UK_BENCHMARKS.southEastMedianPrice, yoy: 1.1 };
    case "south-west":
      return { label: "South West average", median: UK_BENCHMARKS.southWestMedianPrice, yoy: 1.6 };
    case "east-anglia":
      return { label: "East of England average", median: UK_BENCHMARKS.eastAngliaMedianPrice, yoy: 1.3 };
    case "midlands":
      return { label: "Midlands average", median: UK_BENCHMARKS.midlandsMedianPrice, yoy: 2.1 };
    case "yorkshire":
      return { label: "Yorkshire & Humber average", median: UK_BENCHMARKS.yorkshireMedianPrice, yoy: 1.9 };
    case "north-west":
      return { label: "North West average", median: UK_BENCHMARKS.northWestMedianPrice, yoy: 2.4 };
    case "north-east":
      return { label: "North East average", median: UK_BENCHMARKS.northEastMedianPrice, yoy: 1.5 };
    case "wales":
      return { label: "Wales average", median: UK_BENCHMARKS.walesMedianPrice, yoy: 1.0 };
    default:
      return { label: "UK average", median: UK_BENCHMARKS.ukMedianPrice, yoy: UK_BENCHMARKS.ukYoyChange };
  }
}
