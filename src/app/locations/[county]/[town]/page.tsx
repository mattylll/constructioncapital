import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Layers,
  Clock,
  Handshake,
  Wrench,
  Landmark,
  ChevronRight,
  ArrowRight,
  PoundSterling,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/locations/breadcrumbs";
import { RelatedTowns } from "@/components/locations/related-towns";
import { LocationCTA } from "@/components/locations/location-cta";
import { JsonLd } from "@/components/ui/json-ld";
import {
  CTAButton,
  EditorialSection,
  PageHero,
  ProseSection,
  SectionHeader,
} from "@/components/editorial/primitives";
import { SERVICES } from "@/lib/services";
import { SITE_NAME, SITE_URL, CONTACT } from "@/lib/constants";
import { getCaseStudiesByCounty } from "@/lib/case-studies";
import { getTownOverview, getDataDrivenOverview, getTownFaqs } from "@/lib/location-content";
import { getTownMarketData } from "@/lib/town-market-data";
import { TownMarketInsights } from "@/components/locations/town-market-insights";
import { LocalCaseStudies } from "@/components/locations/local-case-studies";
import { LocationMap } from "@/components/locations/location-map";
import { LocationHeroImage } from "@/components/locations/location-hero-image";
import {
  UK_COUNTIES,
  getTownInCounty,
  getRelatedTowns as getRealRelatedTowns,
  getCountyBySlug,
} from "@/lib/uk-locations-data";
import {
  getPlanningData,
  getSoldData,
  getTownStats,
} from "@/lib/local-market-data";
import { getReportByCountySlug, getReportByTownSlug } from "@/lib/market-reports";
import { MarketSnapshot } from "@/components/locations/market-snapshot";
import { RecentSoldPrices } from "@/components/locations/recent-sold-prices";
import { PlanningApplicationsTable } from "@/components/locations/planning-applications-table";
import { LocalGdvCalculator } from "@/components/locations/local-gdv-calculator";
import { getGuidesByLocation } from "@/lib/guides";
import { getLocationVideoId } from "@/lib/location-videos";
import { LocationVideo } from "@/components/locations/location-video";

// ISR configuration
export const dynamicParams = true;
export const revalidate = 86400; // Revalidate every 24 hours

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Layers,
  Clock,
  Handshake,
  Wrench,
  Landmark,
};

function deslugify(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function formatPriceShort(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1000) return `£${Math.round(n / 1000)}k`;
  
return `£${n}`;
}

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}m`.replace(".00m", "m");
  
return `£${Math.round(n).toLocaleString("en-GB")}`;
}

// Helper to render text with embedded links
function renderTextWithLinks(
  text: string,
  links: { text: string; href: string }[],
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  for (const link of links) {
    const idx = remaining.toLowerCase().indexOf(link.text.toLowerCase());
    if (idx === -1) continue;

    if (idx > 0) {
      parts.push(remaining.slice(0, idx));
    }
    parts.push(
      <Link
        key={keyIdx++}
        href={link.href}
        className="font-semibold text-gold-dark underline decoration-gold/30 underline-offset-2 transition-colors hover:text-gold hover:decoration-gold/60"
      >
        {remaining.slice(idx, idx + link.text.length)}
      </Link>,
    );
    remaining = remaining.slice(idx + link.text.length);
  }

  if (remaining) {
    parts.push(remaining);
  }

  return parts;
}

interface PageProps {
  params: Promise<{ county: string; town: string }>;
}

// Service slugs that must not be treated as town names
const SERVICE_SLUGS: Set<string> = new Set(SERVICES.map((s) => s.slug));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county, town } = await params;

  if (SERVICE_SLUGS.has(town)) {
    notFound();
  }

  const countyName = deslugify(county);
  const townName = deslugify(town);
  const sold = getSoldData(county, town);

  const desc = sold
    ? `Development finance in ${townName}, ${countyName}: median price ${formatPrice(sold.stats.medianPrice)}, ${sold.stats.transactionCount12m.toLocaleString("en-GB")} sales, ${sold.stats.yoyChange > 0 ? "+" : ""}${sold.stats.yoyChange}% YoY. Bridging, mezzanine, senior debt from 100+ lenders.`
    : `Development finance, bridging loans, mezzanine finance and commercial mortgages in ${townName}, ${countyName}. Expert property finance brokers with local knowledge.`;

  return {
    title: `${townName} Development Finance - Property Market Data & Lending | ${countyName}`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/locations/${county}/${town}` },
    openGraph: {
      title: `${townName} Development Finance | ${countyName} | ${SITE_NAME}`,
      description: desc,
      url: `${SITE_URL}/locations/${county}/${town}`,
      type: "website",
    },
  };
}

// Town pages use ISR (dynamicParams=true, revalidate=86400).
// Built on first request, then cached for 24 hours.
export async function generateStaticParams(): Promise<{ county: string; town: string }[]> {
  return [];
}


export default async function TownPage({ params }: PageProps) {
  const { county, town } = await params;

  if (SERVICE_SLUGS.has(town)) {
    notFound();
  }

  const countyData = getCountyBySlug(county);
  const countyName = countyData?.name ?? deslugify(county);
  const townData = getTownInCounty(county, town);
  const townName = townData?.name ?? deslugify(town);

  const localCaseStudies = getCaseStudiesByCounty(county);
  const relatedGuides = getGuidesByLocation(county);
  const videoId = getLocationVideoId(county, town);
  const townMarketData = getTownMarketData(county, town);
  const planningData = getPlanningData(county, town);
  const soldData = getSoldData(county, town);
  const townStats = getTownStats(county, town);
  const realRelated = getRealRelatedTowns(county, town, 6);
  const relatedTowns = realRelated.map((t) => {
    const relStats = getTownStats(county, t.slug);
    
return {
      name: t.name,
      slug: t.slug,
      countySlug: county,
      context: t.context,
      medianPrice: relStats?.marketSnapshot.medianPrice,
    };
  });

  // Use custom overview from market data, then data-driven, then generic
  type OverviewParagraph = { text: string; links?: { text: string; href: string }[] };
  const hasMarketData = soldData?.stats || townStats;
  const townOverview: OverviewParagraph[] = townMarketData?.overview
    ? townMarketData.overview.map((text) => ({ text }))
    : hasMarketData
      ? getDataDrivenOverview(townName, countyName, county, town, {
          context: townData?.context,
          medianPrice: soldData?.stats?.medianPrice ?? townStats?.marketSnapshot.medianPrice,
          medianByType: soldData?.stats?.medianByType,
          transactionCount12m: soldData?.stats?.transactionCount12m ?? townStats?.marketSnapshot.transactionCount12m,
          yoyChange: soldData?.stats?.yoyChange ?? townStats?.marketSnapshot.yoyPriceChange,
          newBuildCount: soldData?.stats?.newBuildCount,
        })
      : (townData?.context
          ? [townData.context, ...getTownOverview(townName, countyName, county)]
          : getTownOverview(townName, countyName, county)
        ).map((text) => ({ text }));

  // Generate town-level FAQs
  const townFaqs = getTownFaqs(townName, countyName, county, town, {
    medianPrice: soldData?.stats?.medianPrice ?? townStats?.marketSnapshot.medianPrice,
    medianByType: soldData?.stats?.medianByType,
    transactionCount12m: soldData?.stats?.transactionCount12m ?? townStats?.marketSnapshot.transactionCount12m,
    yoyChange: soldData?.stats?.yoyChange ?? townStats?.marketSnapshot.yoyPriceChange,
    context: townData?.context,
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: countyName, href: `/locations/${county}` },
    { label: townName },
  ];

  // JSON-LD Structured Data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${SITE_URL}${item.href}` : undefined,
    })),
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `${SITE_NAME} - ${townName}`,
    description: `Development finance, bridging loans, mezzanine finance and commercial mortgages in ${townName}, ${countyName}. Expert property finance brokers with local knowledge.`,
    url: `${SITE_URL}/locations/${county}/${town}`,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressCountry: "GB",
    },
    areaServed: {
      "@type": "City",
      name: townName,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: countyName,
      },
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    serviceType: [
      "Development Finance",
      "Mezzanine Finance",
      "Bridging Loans",
      "Equity & Joint Ventures",
      "Refurbishment Finance",
      "Commercial Mortgages",
    ],
  };

  // FAQ JSON-LD
  const faqJsonLd = townFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: townFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={localBusinessJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      {videoId && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: `${townName} Property Market Update - ${SITE_NAME}`,
            description: `Data-driven property market update for ${townName}, ${countyName}. Covering median prices, transaction volumes, year-on-year trends, and development finance opportunities.`,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            uploadDate: "2026-04-17",
            contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
            embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
            },
          }}
        />
      )}

      {/* Hero Section */}
      <PageHero
        tone="paper"
        breadcrumbs={breadcrumbItems}
        eyebrow={countyName}
        title={
          <>
            <span className="italic" style={{ color: "var(--navy)" }}>{townName}</span>
            <br />
            development finance.
          </>
        }
        deck={
          <>
            Expert property development finance in {townName}, {countyName}.
            {soldData
              ? ` Median price ${formatPrice(soldData.stats.medianPrice)}, ${soldData.stats.transactionCount12m.toLocaleString("en-GB")} annual sales. `
              : " "}
            We connect developers with competitive funding from 100+ lenders.
          </>
        }
        stats={
          soldData
            ? [
                { label: "Median price", value: formatPriceShort(soldData.stats.medianPrice) },
                { label: "Sales (12m)", value: soldData.stats.transactionCount12m.toLocaleString("en-GB") },
                {
                  label: "YoY change",
                  value: `${soldData.stats.yoyChange > 0 ? "+" : ""}${soldData.stats.yoyChange}%`,
                },
              ]
            : undefined
        }
        actions={
          <div className="flex flex-wrap items-center gap-4">
            <CTAButton href="/deal-room" variant="navy" size="lg">
              Start a {townName} deal
            </CTAButton>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="numeral-tabular editorial-link inline-flex h-14 items-center text-lg font-medium tracking-tight"
              style={{ color: "var(--navy-dark)" }}
            >
              Or call {CONTACT.phone}
            </a>
          </div>
        }
      />

      {/* Location Hero Image */}
      <LocationHeroImage
        countySlug={county}
        townSlug={town}
        locationName={`${townName}, ${countyName}`}
      />

      {/* Town Overview - finance-focused narrative */}
      <EditorialSection tone="paper">
        <ProseSection
          title={
            <>
              Property finance
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                in {townName}.
              </span>
            </>
          }
        >
          {townOverview.map((paragraph, i) => (
            <p key={i}>
              {paragraph.links
                ? renderTextWithLinks(paragraph.text, paragraph.links)
                : paragraph.text}
            </p>
          ))}
          {(() => {
            const townReport = getReportByTownSlug(county, town);
            const countyReport = getReportByCountySlug(county);
            if (!townReport && !countyReport) return null;
            return (
              <div className="not-prose mt-8 flex flex-col gap-3">
                {townReport && (
                  <Link
                    href={`/market-reports/${townReport.slug}`}
                    className="editorial-link inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em]"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    <span>
                      {townName} Property Market Report
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
                {countyReport && (
                  <Link
                    href={`/market-reports/${countyReport.slug}`}
                    className="editorial-link inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em]"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    <span>
                      {countyName} County Market Report
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            );
          })()}
        </ProseSection>
      </EditorialSection>

      {/* Location Market Update Video */}
      <LocationVideo
        townName={townName}
        countyName={countyName}
        countySlug={county}
        townSlug={town}
        youtubeId={videoId}
      />

      {/* Services Grid - core offering, positioned high for user intent */}
      <EditorialSection tone="stone">
        <SectionHeader
          tone="stone"
          eyebrow="The capital stack"
          title={
            <>
              Seven funding routes for
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                every {townName} scheme.
              </span>
            </>
          }
          body={`Senior debt, mezzanine, bridging, equity, refurbishment, commercial mortgages and exit finance — arranged for ${townName} developers on the deal, not the product sheet.`}
        />

        <div className="mt-16">
          {/* Services grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = iconMap[service.icon] || Building2;

              return (
                <Link
                  key={service.slug}
                  href={`/locations/${county}/${town}/${service.slug}`}
                  className="glass-card group relative overflow-hidden rounded-2xl p-7"
                >
                  {/* Top accent line on hover */}
                  <div
                    className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 10%, var(--gold) 50%, transparent 90%)",
                    }}
                  />

                  {/* Corner glow on hover */}
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle, oklch(0.75 0.12 85 / 0.08), transparent 70%)",
                    }}
                  />

                  <div className="relative">
                    <div
                      className="mb-5 flex h-13 w-13 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                        border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                      }}
                    >
                      <Icon
                        className="h-6 w-6"
                        style={{ color: "var(--gold)" }}
                      />
                    </div>

                    <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground">
                      {service.name}
                    </h3>

                    <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                      {service.shortDesc}
                    </p>

                    <div className="mb-5 flex items-center gap-3">
                      <span
                        className="rounded-full px-3 py-1 text-xs font-bold"
                        style={{
                          backgroundColor: "oklch(0.75 0.12 85 / 0.1)",
                          color: "var(--gold-dark)",
                        }}
                      >
                        {service.typicalRate}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {service.typicalLtv}
                      </span>
                    </div>

                    <span className="inline-flex items-center text-sm font-bold text-gold-dark transition-all duration-300 group-hover:text-gold group-hover:tracking-wide">
                      {service.name} in {townName}
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </EditorialSection>

      {/* Live Market Snapshot - data supports the finance narrative */}
      {townStats && (
        <MarketSnapshot stats={townStats.marketSnapshot} townName={townName} />
      )}

      {/* Local GDV Calculator - engagement tool near market data */}
      {townStats && (
        <LocalGdvCalculator
          defaultGdv={
            soldData?.stats?.medianByType?.["S"]
              ? soldData.stats.medianByType["S"] * 6
              : townStats.marketSnapshot.medianPrice * 4
          }
          defaultLandCost={
            soldData?.stats?.medianByType?.["S"]
              ? Math.round(soldData.stats.medianByType["S"] * 1.5)
              : Math.round(townStats.marketSnapshot.medianPrice * 1.2)
          }
          townName={townName}
        />
      )}

      {/* Town Market Insights - editorial content, unique per town */}
      {townMarketData && (
        <TownMarketInsights data={townMarketData} townName={townName} />
      )}

      {/* Recent Sold Prices - from Land Registry data */}
      {soldData && (
        <RecentSoldPrices
          transactions={soldData.recentTransactions}
          stats={soldData.stats}
          townName={townName}
        />
      )}

      {/* Planning Applications - approved + pending */}
      {planningData && (
        <PlanningApplicationsTable
          approved={planningData.approvedApplications}
          pending={planningData.pendingApplications}
          summary={planningData.summary}
          townName={townName}
        />
      )}

      {/* FAQs - data-driven, unique per town */}
      {townFaqs.length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="Common questions"
            title={
              <>
                Property finance in {townName}
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  — answered.
                </span>
              </>
            }
          />
          <div className="mt-16 mx-auto max-w-3xl space-y-3">
            {townFaqs.map((faq, i) => (
              <details
                key={i}
                className="group border-b"
                style={{ borderColor: "var(--stone-dark)" }}
              >
                <summary className="flex cursor-pointer items-center justify-between py-5 font-heading text-[18px] font-medium leading-snug tracking-tight [&::-webkit-details-marker]:hidden" style={{ color: "var(--navy-dark)" }}>
                  {faq.question}
                  <ChevronRight
                    className="ml-3 h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-90"
                    style={{ color: "var(--gold-dark)" }}
                  />
                </summary>
                <div
                  className="pb-6 text-[16px] leading-[1.65]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </EditorialSection>
      )}

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="Expert guides"
            title={
              <>
                Further reading
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  on development finance.
                </span>
              </>
            }
          />
          <div className="mt-16 grid gap-px border-y sm:grid-cols-2" style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}>
            {relatedGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group flex items-start justify-between gap-6 p-7 transition-colors"
                style={{ background: "var(--paper)" }}
              >
                <div>
                  <h3
                    className="font-heading text-[20px] font-medium leading-[1.2] tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {guide.title}
                  </h3>
                  <span
                    className="mt-3 inline-block text-[11px] font-medium uppercase tracking-[0.22em]"
                    style={{ color: "oklch(0.50 0.02 255)" }}
                  >
                    {guide.readingTime} read
                  </span>
                </div>
                <ArrowRight
                  className="mt-1 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "var(--gold-dark)" }}
                />
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/guides"
              className="editorial-link inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em]"
              style={{ color: "var(--navy-dark)" }}
            >
              View all guides
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </EditorialSection>
      )}

      {/* Local Case Studies */}
      <LocalCaseStudies caseStudies={localCaseStudies} locationName={countyName} />

      {/* Location Map - reference section near bottom */}
      <LocationMap locationName={townName} countyName={countyName} />

      {/* Related Towns */}
      <RelatedTowns towns={relatedTowns} currentTown={townName} />

      {/* CTA */}
      <LocationCTA townName={townName} />
    </>
  );
}
