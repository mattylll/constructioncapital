import type { MarketReport } from "../../types";

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
