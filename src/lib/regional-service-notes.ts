/**
 * Region × service editorial notes, spliced into service-page content
 * sections so the "why use a broker" middle differs by region as well as by
 * town data. Phase 1 covers Yorkshire and the North East (the pages under
 * external scrutiny); remaining regions are added incrementally.
 *
 * Rules: real places and programmes only, no invented lender names, no
 * regulatory claims, British English.
 */

import type { Region } from "@/lib/location-content";

type ServiceSlug =
  | "development-finance"
  | "mezzanine-finance"
  | "bridging-loans"
  | "equity-jv"
  | "refurbishment-finance"
  | "commercial-mortgages"
  | "development-exit-finance";

export const REGIONAL_SERVICE_NOTES: Partial<
  Record<Region, Partial<Record<ServiceSlug, string>>>
> = {
  yorkshire: {
    "development-finance":
      "Yorkshire development lending has matured markedly: several national and regional funders now run dedicated northern books, and schemes in Leeds, Sheffield, and the surrounding towns are assessed against genuine local comparables rather than southern benchmarks. Build costs in the region typically run 10-20% below the South East while city-centre rental demand keeps exit values resilient, which is why senior lenders will regularly stretch to full leverage on well-evidenced Yorkshire schemes.",
    "mezzanine-finance":
      "Mezzanine appetite in Yorkshire tracks the strength of the region's exit story: funders top up senior facilities most readily on schemes near employment growth - Leeds city centre and its South Bank, Sheffield's advanced manufacturing corridor - where sales rates are demonstrable. Expect mezzanine pricing to reflect the scheme's absorption evidence rather than a regional discount.",
    "bridging-loans":
      "Bridging in Yorkshire is frequently used to secure auction stock and unbroken terraces ahead of refurbishment - the region's Victorian housing stock trades quickly at accessible lot sizes. Lenders comfortable with northern valuations will typically complete in days, and exit routes via refinance or sale are well-established in the region's high-yield rental markets.",
    "equity-jv":
      "Equity investors increasingly look north for the margin story: Yorkshire's combination of accessible land values and resilient exit pricing produces return profiles that southern schemes struggle to match. JV partners will want local delivery evidence - a Yorkshire-based contractor and agent lineup materially strengthens the case.",
    "refurbishment-finance":
      "Yorkshire's mill, warehouse, and Victorian terrace stock makes it one of the UK's most active refurbishment markets. Conversion costs run well below new-build, and lenders familiar with the region's heritage stock understand both the planning sensitivities and the premium that well-executed character conversions achieve in cities like Leeds, Sheffield, and York.",
    "commercial-mortgages":
      "Commercial investment lending in Yorkshire prices off the region's strong yield base: mixed-use and retail-with-resi assets in the region's town centres routinely out-yield southern equivalents. Lenders active in the region will lend against sustainable rental evidence rather than discounted northern assumptions.",
    "development-exit-finance":
      "Development exit facilities are particularly useful in Yorkshire's steadier sales markets: rather than discounting completed units to clear senior debt, developers refinance onto a cheaper exit facility and sell at full market pace. The region's rental strength also opens a retain-and-refinance route via term debt.",
  },
  "north-east": {
    "development-finance":
      "North East development lending rewards realistic appraisals: land enters cheaply, build costs are the lowest of any English region, and the viability question is usually exit pricing rather than cost. Lenders with genuine regional knowledge - rather than a London lens - will fund schemes in Newcastle, Sunderland, and the surrounding towns at leverage that reflects the region's demonstrable rental strength.",
    "mezzanine-finance":
      "Mezzanine in the North East is most readily available on schemes with employment-anchored demand - Newcastle's city centre and Quayside, the advanced manufacturing belt around Sunderland - where absorption evidence supports the stretched leverage. On smaller schemes, the region's low entry costs often mean modest equity gaps that mezzanine closes efficiently.",
    "bridging-loans":
      "Bridging is a staple of the North East market: auction lot sizes are among the most accessible in the UK, and the region's strong gross yields make bridge-to-let and bridge-to-refurbishment exits straightforward to evidence. Lenders familiar with North East valuations complete quickly at these price points.",
    "equity-jv":
      "The North East offers equity investors the UK's most accessible entry point per unit, with returns driven by yield rather than capital growth assumptions. JV partners will scrutinise exit evidence closely - schemes underpinned by the region's regeneration programmes and employment anchors present the strongest case.",
    "refurbishment-finance":
      "The North East's Victorian and Edwardian stock, together with its heritage market towns, supports an active refurbishment market at entry prices that keep total project costs modest. Refurbishment facilities in the region are typically sized comfortably within value-add evidence, and the strong rental market provides a reliable refinance exit.",
    "commercial-mortgages":
      "Commercial investment yields in the North East rank among the strongest in the UK, and lenders active in the region price against that sustainable income rather than speculative growth. Town-centre mixed-use assets and well-let secondary stock both find committed funders at sensible leverage.",
    "development-exit-finance":
      "In the North East's steadier sales markets, development exit finance lets developers hold completed stock at a lower funding cost while sales complete at full value - or pivot to the region's strong rental market via term refinance rather than discounting to sell.",
  },
};

export function getRegionalServiceNote(
  region: Region,
  serviceSlug: string
): string | null {
  return REGIONAL_SERVICE_NOTES[region]?.[serviceSlug as ServiceSlug] ?? null;
}
