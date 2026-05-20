import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarketIntelligenceReportView } from "@/components/market-intelligence/report";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { TOP_50_LOCATIONS } from "@/lib/market-intelligence-locations";
import { getMarketIntelligenceReport } from "@/lib/market-intelligence-data";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return TOP_50_LOCATIONS.map((loc) => ({ town: loc.slug }));
}

type RouteParams = { town: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { town } = await params;
  const location = TOP_50_LOCATIONS.find((l) => l.slug === town);
  if (!location) return { title: "Market intelligence" };

  const report = getMarketIntelligenceReport(location);
  if (!report) {
    return {
      title: `${location.name} development finance market intelligence | ${SITE_NAME}`,
      description: `${location.name} property market data, planning pipeline, and development finance commentary.`,
      alternates: { canonical: `${SITE_URL}/market-intelligence/${location.slug}` },
    };
  }

  const { editorial } = report;
  return {
    title: `${editorial.headline} | ${SITE_NAME}`,
    description: editorial.metaDescription,
    alternates: { canonical: `${SITE_URL}/market-intelligence/${location.slug}` },
    openGraph: {
      title: editorial.headline,
      description: editorial.metaDescription,
      url: `${SITE_URL}/market-intelligence/${location.slug}`,
      type: "article",
      publishedTime: editorial.generatedAt,
      locale: "en_GB",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: editorial.headline,
      description: editorial.metaDescription,
    },
  };
}

export default async function MarketIntelligenceTownPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { town } = await params;
  const location = TOP_50_LOCATIONS.find((l) => l.slug === town);
  if (!location) notFound();

  const report = getMarketIntelligenceReport(location);
  if (!report) notFound();

  const { editorial } = report;
  const url = `${SITE_URL}/market-intelligence/${location.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: editorial.headline,
          description: editorial.metaDescription,
          datePublished: editorial.generatedAt,
          dateModified: editorial.generatedAt,
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          about: {
            "@type": "Place",
            name: location.name,
            address: {
              "@type": "PostalAddress",
              addressLocality: location.name,
              addressRegion: location.county,
              addressCountry: "GB",
            },
          },
          keywords: editorial.tags?.join(", "),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Market Intelligence", item: `${SITE_URL}/market-intelligence` },
            { "@type": "ListItem", position: 3, name: location.name, item: url },
          ],
        }}
      />
      <MarketIntelligenceReportView report={report} />
    </>
  );
}
