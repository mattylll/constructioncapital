import type { MarketReport, ReportCategory } from "./types";
import { TOWN_REPORTS } from "./reports/town";

// County reports
import bedfordshire_property_market from "./reports/county/bedfordshire-property-market";
import berkshire_property_market from "./reports/county/berkshire-property-market";
import bristol_property_market from "./reports/county/bristol-property-market";
import buckinghamshire_property_market from "./reports/county/buckinghamshire-property-market";
import cambridgeshire_property_market from "./reports/county/cambridgeshire-property-market";
import cardiff_property_market from "./reports/county/cardiff-property-market";
import cheshire_property_market from "./reports/county/cheshire-property-market";
import cornwall_property_market from "./reports/county/cornwall-property-market";
import county_durham_property_market from "./reports/county/county-durham-property-market";
import cumbria_property_market from "./reports/county/cumbria-property-market";
import derbyshire_property_market from "./reports/county/derbyshire-property-market";
import devon_property_market from "./reports/county/devon-property-market";
import dorset_property_market from "./reports/county/dorset-property-market";
import east_riding_of_yorkshire_property_market from "./reports/county/east-riding-of-yorkshire-property-market";
import essex_property_market from "./reports/county/essex-property-market";
import gloucestershire_property_market from "./reports/county/gloucestershire-property-market";
import greater_london_property_market from "./reports/county/greater-london-property-market";
import greater_manchester_property_market from "./reports/county/greater-manchester-property-market";
import gwynedd_property_market from "./reports/county/gwynedd-property-market";
import hampshire_property_market from "./reports/county/hampshire-property-market";
import hertfordshire_property_market from "./reports/county/hertfordshire-property-market";
import kent_property_market from "./reports/county/kent-property-market";
import lancashire_property_market from "./reports/county/lancashire-property-market";
import leicestershire_property_market from "./reports/county/leicestershire-property-market";
import lincolnshire_property_market from "./reports/county/lincolnshire-property-market";
import merseyside_property_market from "./reports/county/merseyside-property-market";
import newport_property_market from "./reports/county/newport-property-market";
import norfolk_property_market from "./reports/county/norfolk-property-market";
import north_yorkshire_property_market from "./reports/county/north-yorkshire-property-market";
import northamptonshire_property_market from "./reports/county/northamptonshire-property-market";
import northumberland_property_market from "./reports/county/northumberland-property-market";
import nottinghamshire_property_market from "./reports/county/nottinghamshire-property-market";
import oxfordshire_property_market from "./reports/county/oxfordshire-property-market";
import powys_property_market from "./reports/county/powys-property-market";
import shropshire_property_market from "./reports/county/shropshire-property-market";
import somerset_property_market from "./reports/county/somerset-property-market";
import south_yorkshire_property_market from "./reports/county/south-yorkshire-property-market";
import staffordshire_property_market from "./reports/county/staffordshire-property-market";
import suffolk_property_market from "./reports/county/suffolk-property-market";
import surrey_property_market from "./reports/county/surrey-property-market";
import sussex_property_market from "./reports/county/sussex-property-market";
import swansea_property_market from "./reports/county/swansea-property-market";
import tyne_and_wear_property_market from "./reports/county/tyne-and-wear-property-market";
import warwickshire_property_market from "./reports/county/warwickshire-property-market";
import west_midlands_property_market from "./reports/county/west-midlands-property-market";
import west_yorkshire_property_market from "./reports/county/west-yorkshire-property-market";
import wiltshire_property_market from "./reports/county/wiltshire-property-market";
import worcestershire_property_market from "./reports/county/worcestershire-property-market";

// Regional reports
import east_of_england_market_overview from "./reports/regional/east-of-england-market-overview";
import london_and_south_east_market_overview from "./reports/regional/london-and-south-east-market-overview";
import midlands_market_overview from "./reports/regional/midlands-market-overview";
import north_east_and_yorkshire_market_overview from "./reports/regional/north-east-and-yorkshire-market-overview";
import north_west_market_overview from "./reports/regional/north-west-market-overview";
import south_west_market_overview from "./reports/regional/south-west-market-overview";
import wales_market_overview from "./reports/regional/wales-market-overview";

// Thematic reports
import development_finance_hotspots_2026 from "./reports/thematic/development-finance-hotspots-2026";
import most_active_property_markets_2026 from "./reports/thematic/most-active-property-markets-2026";
import new_build_premium_analysis_2026 from "./reports/thematic/new-build-premium-analysis-2026";
import property_type_price_guide_2026 from "./reports/thematic/property-type-price-guide-2026";
import uk_house_price_changes_2026 from "./reports/thematic/uk-house-price-changes-2026";

export const MARKET_REPORTS: MarketReport[] = [
  // County (loaded first for priority in slug lookups)
  bedfordshire_property_market,
  berkshire_property_market,
  bristol_property_market,
  buckinghamshire_property_market,
  cambridgeshire_property_market,
  cardiff_property_market,
  cheshire_property_market,
  cornwall_property_market,
  county_durham_property_market,
  cumbria_property_market,
  derbyshire_property_market,
  devon_property_market,
  dorset_property_market,
  east_riding_of_yorkshire_property_market,
  essex_property_market,
  gloucestershire_property_market,
  greater_london_property_market,
  greater_manchester_property_market,
  gwynedd_property_market,
  hampshire_property_market,
  hertfordshire_property_market,
  kent_property_market,
  lancashire_property_market,
  leicestershire_property_market,
  lincolnshire_property_market,
  merseyside_property_market,
  newport_property_market,
  norfolk_property_market,
  north_yorkshire_property_market,
  northamptonshire_property_market,
  northumberland_property_market,
  nottinghamshire_property_market,
  oxfordshire_property_market,
  powys_property_market,
  shropshire_property_market,
  somerset_property_market,
  south_yorkshire_property_market,
  staffordshire_property_market,
  suffolk_property_market,
  surrey_property_market,
  sussex_property_market,
  swansea_property_market,
  tyne_and_wear_property_market,
  warwickshire_property_market,
  west_midlands_property_market,
  west_yorkshire_property_market,
  wiltshire_property_market,
  worcestershire_property_market,
  // Regional
  east_of_england_market_overview,
  london_and_south_east_market_overview,
  midlands_market_overview,
  north_east_and_yorkshire_market_overview,
  north_west_market_overview,
  south_west_market_overview,
  wales_market_overview,
  // Thematic
  development_finance_hotspots_2026,
  most_active_property_markets_2026,
  new_build_premium_analysis_2026,
  property_type_price_guide_2026,
  uk_house_price_changes_2026,
  // Town (auto-imported from barrel)
  ...TOWN_REPORTS,
];

const slugMap = new Map(MARKET_REPORTS.map((r) => [r.slug, r]));
const countySlugMap = new Map(
  MARKET_REPORTS.filter((r) => r.category === "county" && r.countySlug).map((r) => [r.countySlug!, r])
);
const townSlugMap = new Map(
  MARKET_REPORTS.filter((r) => r.category === "town" && r.townSlug && r.countySlug).map((r) => [`${r.countySlug}/${r.townSlug}`, r])
);

export function getReportBySlug(slug: string): MarketReport | undefined {
  return slugMap.get(slug);
}

export function getReportByCountySlug(countySlug: string): MarketReport | undefined {
  return countySlugMap.get(countySlug);
}

/** Get a town-level report by county/town slug pair */
export function getReportByTownSlug(countySlug: string, townSlug: string): MarketReport | undefined {
  return townSlugMap.get(`${countySlug}/${townSlug}`);
}

export function getRelatedReports(slug: string): MarketReport[] {
  const report = slugMap.get(slug);
  if (!report) return [];
  return report.relatedReportSlugs
    .map((s) => slugMap.get(s))
    .filter((r): r is MarketReport => r !== undefined)
    .slice(0, 5);
}

export function getReportsByCategory(category: ReportCategory): MarketReport[] {
  return MARKET_REPORTS.filter((r) => r.category === category);
}

export function getReportsByRegion(region: string): MarketReport[] {
  return MARKET_REPORTS.filter((r) => r.region === region);
}

export function getAllRegions(): string[] {
  const regions = new Set(MARKET_REPORTS.map((r) => r.region).filter(Boolean) as string[]);
  return [...regions].sort();
}
