import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import {
  EditorialSection,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  TOP_50_LOCATIONS,
  type MarketIntelligenceLocation,
} from "@/lib/market-intelligence-locations";
import { getEditorial } from "@/lib/market-intelligence-data";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: `UK Development Finance Market Intelligence | ${SITE_NAME}`,
  description:
    "Real-time market intelligence for UK development finance brokers and developers — live planning pipelines, sold-price trends, and lender appetite analysis across 50 UK cities.",
  alternates: { canonical: `${SITE_URL}/market-intelligence` },
  openGraph: {
    title: `UK Development Finance Market Intelligence`,
    description:
      "Live planning pipelines, sold-price trends, and lender appetite across 50 UK cities — updated monthly.",
    url: `${SITE_URL}/market-intelligence`,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
  },
};

const REGION_ORDER: MarketIntelligenceLocation["region"][] = [
  "london",
  "south-east",
  "south-west",
  "east-anglia",
  "midlands",
  "yorkshire",
  "north-west",
  "north-east",
  "wales",
];

const REGION_LABELS: Record<MarketIntelligenceLocation["region"], string> = {
  london: "Greater London",
  "south-east": "South East",
  "south-west": "South West",
  "east-anglia": "East of England",
  midlands: "Midlands",
  yorkshire: "Yorkshire & Humber",
  "north-west": "North West",
  "north-east": "North East",
  wales: "Wales",
};

export default function MarketIntelligenceIndexPage() {
  const byRegion = REGION_ORDER.map((region) => ({
    region,
    locations: TOP_50_LOCATIONS.filter((l) => l.region === region),
  })).filter((g) => g.locations.length > 0);

  const generatedCount = TOP_50_LOCATIONS.filter((l) => getEditorial(l.slug) !== null).length;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `UK Development Finance Market Intelligence`,
          description:
            "Live planning pipelines, sold-price trends, and lender appetite across 50 UK cities.",
          url: `${SITE_URL}/market-intelligence`,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: TOP_50_LOCATIONS.length,
            itemListElement: TOP_50_LOCATIONS.map((loc, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${loc.name} development finance market intelligence`,
              url: `${SITE_URL}/market-intelligence/${loc.slug}`,
            })),
          },
        }}
      />

      <PageHero
        eyebrow="Market intelligence"
        title={`UK development finance market — ${generatedCount} city briefings`}
        deck="Live planning pipelines, sold-price trends, and lender appetite for the UK's most active development markets. Refreshed monthly from Land Registry and local planning portals."
        tone="navy"
        breadcrumbs={[{ label: "Market Intelligence" }]}
      />

      {REGION_ORDER.map((region) => {
        const group = byRegion.find((g) => g.region === region);
        if (!group) return null;
        return (
          <EditorialSection key={region} tone={region === "london" ? "paper" : "stone"}>
            <SectionHeader
              eyebrow={REGION_LABELS[region]}
              title={`${REGION_LABELS[region]} markets`}
              align="asymmetric"
            />
            <ul className="mt-12 grid grid-cols-1 gap-px border-y bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
              {group.locations.map((loc) => {
                const ed = getEditorial(loc.slug);
                return (
                  <li key={loc.slug} className="bg-white p-6">
                    <Link href={`/market-intelligence/${loc.slug}`} className="group block">
                      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
                        <MapPin className="h-3 w-3" />
                        <span>{loc.county}</span>
                      </div>
                      <h3 className="font-heading mb-2 text-xl text-navy-dark transition-colors group-hover:text-[color:var(--gold-dark)]">
                        {loc.name}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-stone-600">
                        {ed?.subhead ??
                          `Live development pipeline, sold prices, and finance terms for ${loc.name}.`}
                      </p>
                      <span className="inline-flex items-center text-sm font-medium text-navy-dark group-hover:text-[color:var(--gold-dark)]">
                        Read briefing <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </EditorialSection>
        );
      })}
    </>
  );
}
