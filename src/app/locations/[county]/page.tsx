import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ChevronRight, ArrowRight, TrendingUp, TrendingDown, Building2, BarChart3, PoundSterling, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/locations/breadcrumbs";
import { LocationCTA } from "@/components/locations/location-cta";
import { JsonLd } from "@/components/ui/json-ld";
import {
  CTAButton,
  EditorialSection,
  PageHero,
  ProseSection,
  SectionHeader,
} from "@/components/editorial/primitives";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
import { getCaseStudiesByCounty } from "@/lib/case-studies";
import { getCountyOverview } from "@/lib/location-content";
import { LocalCaseStudies } from "@/components/locations/local-case-studies";
import { LocationMap } from "@/components/locations/location-map";
import { LocationHeroImage } from "@/components/locations/location-hero-image";
import { getCountyAggregateData } from "@/lib/local-market-data";
import { getReportByCountySlug } from "@/lib/market-reports";
import { SERVICES } from "@/lib/services";
import { UK_COUNTIES, getCountyBySlug, type TownData } from "@/lib/uk-locations-data";
import { getGuidesByLocation } from "@/lib/guides";

export const dynamicParams = true;
export const revalidate = 86400;

function deslugify(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}m`.replace(".00m", "m");
  
return `£${Math.round(n).toLocaleString("en-GB")}`;
}

function formatPriceShort(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1000) return `£${Math.round(n / 1000)}k`;
  
return `£${n}`;
}

const TYPE_LABELS: Record<string, string> = { D: "Detached", S: "Semi-detached", T: "Terraced", F: "Flat/Apartment" };
const NATIONAL_MEDIAN = 285000;

interface PageProps {
  params: Promise<{ county: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county } = await params;
  const countyData = getCountyBySlug(county);
  const countyName = countyData?.name ?? deslugify(county);
  const agg = countyData ? getCountyAggregateData(county, countyData.towns) : null;

  const desc = agg
    ? `Development finance in ${countyName}: median property price ${formatPrice(agg.medianPrice)}, ${agg.totalTransactions.toLocaleString("en-GB")} sales, ${agg.avgYoyChange > 0 ? "+" : ""}${agg.avgYoyChange}% YoY. ${agg.townCount} towns, 100+ lenders.`
    : `Find development finance, bridging loans, mezzanine finance and commercial mortgages in ${countyName}. Expert property finance brokers with local knowledge.`;

  return {
    title: `${countyName} Development Finance - Property Market Data & Lending`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/locations/${county}` },
    openGraph: {
      title: `${countyName} Development Finance | ${SITE_NAME}`,
      description: desc,
      url: `${SITE_URL}/locations/${county}`,
      type: "website",
    },
  };
}

export async function generateStaticParams(): Promise<{ county: string }[]> {
  return [];
}

export default async function CountyPage({ params }: PageProps) {
  const { county } = await params;
  const countyData = getCountyBySlug(county);
  const countyName = countyData?.name ?? deslugify(county);
  const towns: TownData[] = countyData?.towns ?? [];
  const localCaseStudies = getCaseStudiesByCounty(county);
  const countyOverview = countyData ? [countyData.overview] : getCountyOverview(county, countyName);
  const agg = countyData ? getCountyAggregateData(county, countyData.towns) : null;
  const countyReport = getReportByCountySlug(county);
  const relatedGuides = getGuidesByLocation(county);

  // Sort towns for comparison
  const townsByPrice = agg ? [...agg.towns].sort((a, b) => b.medianPrice - a.medianPrice) : [];
  const townsByVolume = agg ? [...agg.towns].sort((a, b) => b.transactionCount12m - a.transactionCount12m) : [];
  const townsByGrowth = agg ? [...agg.towns].sort((a, b) => b.yoyChange - a.yoyChange) : [];

  const priceVsNational = agg
    ? agg.medianPrice > NATIONAL_MEDIAN
      ? `${formatPriceShort(agg.medianPrice - NATIONAL_MEDIAN)} above the UK average`
      : `${formatPriceShort(NATIONAL_MEDIAN - agg.medianPrice)} below the UK average`
    : null;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: countyName },
  ];

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
    name: `${SITE_NAME} - ${countyName}`,
    description: `Development finance, bridging loans, mezzanine finance and commercial mortgages in ${countyName}.`,
    url: `${SITE_URL}/locations/${county}`,
    areaServed: {
      "@type": "AdministrativeArea",
      name: countyName,
      containedInPlace: { "@type": "Country", name: "United Kingdom" },
    },
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    serviceType: ["Development Finance", "Mezzanine Finance", "Bridging Loans", "Equity & Joint Ventures", "Refurbishment Finance", "Commercial Mortgages", "Development Exit Finance"],
  };

  // FAQs for schema
  const faqs = agg ? [
    {
      q: `What is the average house price in ${countyName}?`,
      a: `The median house price across ${countyName}'s ${agg.townCount} principal towns is ${formatPrice(agg.medianPrice)}, based on ${agg.totalTransactions.toLocaleString("en-GB")} transactions in the past 12 months. ${agg.medianByType.D ? `Detached homes average ${formatPrice(agg.medianByType.D)}` : ""}${agg.medianByType.F ? ` and flats average ${formatPrice(agg.medianByType.F)}` : ""}.`,
    },
    {
      q: `Can I get development finance in ${countyName}?`,
      a: `Yes. Construction Capital arranges development finance across ${countyName} from 100+ lenders including banks, funds, and family offices. Typical terms: senior debt from 6.5% p.a. at 65-70% LTGDV, mezzanine to 85-90% of costs, and bridging loans completing in 5-10 days.`,
    },
    {
      q: `Which towns in ${countyName} have the highest property prices?`,
      a: townsByPrice.length >= 3
        ? `The most expensive towns in ${countyName} are ${townsByPrice.slice(0, 3).map(t => `${t.name} (${formatPrice(t.medianPrice)})`).join(", ")}.`
        : `See our town-by-town analysis below for full price data across ${countyName}.`,
    },
    {
      q: `Is ${countyName} a good area for property development?`,
      a: `${countyName} recorded ${agg.totalTransactions.toLocaleString("en-GB")} sales and ${agg.totalNewBuilds} new-build completions in the past 12 months, with prices ${agg.avgYoyChange > 0 ? "rising" : agg.avgYoyChange === 0 ? "stable" : "softening"} at ${agg.avgYoyChange > 0 ? "+" : ""}${agg.avgYoyChange}% YoY. ${agg.totalTransactions > 5000 ? "This is a deep, liquid market with strong exit confidence." : "Developers should assess local demand carefully but opportunities exist."}`,
    },
  ] : [];

  const faqJsonLd = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={localBusinessJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      {/* Hero with key stats */}
      <PageHero
        tone="paper"
        breadcrumbs={breadcrumbItems}
        eyebrow={countyName}
        title={
          <>
            <span className="italic" style={{ color: "var(--navy)" }}>{countyName}</span>
            <br />
            development finance.
          </>
        }
        deck={
          <>
            Expert property development finance across {countyName}.
            {agg
              ? ` ${agg.townCount} towns, ${agg.totalTransactions.toLocaleString("en-GB")} annual transactions, median price ${formatPrice(agg.medianPrice)}. `
              : " "}
            We connect developers with competitive funding from our panel of 100+ lenders.
          </>
        }
        stats={
          agg
            ? [
                { label: "Median price", value: formatPriceShort(agg.medianPrice) },
                { label: "Sales (12m)", value: agg.totalTransactions.toLocaleString("en-GB") },
                {
                  label: "YoY change",
                  value: `${agg.avgYoyChange > 0 ? "+" : ""}${agg.avgYoyChange}%`,
                },
              ]
            : undefined
        }
        actions={
          <div className="flex flex-wrap items-center gap-4">
            <CTAButton href="/deal-room" variant="navy" size="lg">
              Start a {countyName} deal
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
      <LocationHeroImage countySlug={county} locationName={countyName} />

      {/* Market Overview - rich content */}
      <EditorialSection tone="paper">
        <ProseSection
          title={
            <>
              Property development
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                in {countyName}.
              </span>
            </>
          }
        >
          <div className="space-y-4">
              {countyOverview.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {agg && (
                <>
                  <p>
                    The {countyName} property market recorded <strong className="text-foreground">{agg.totalTransactions.toLocaleString("en-GB")}</strong> residential transactions over the past 12 months, with a county-wide median sale price of <strong className="text-foreground">{formatPrice(agg.medianPrice)}</strong> - {priceVsNational}. Prices have shown {agg.avgYoyChange > 0 ? "growth" : agg.avgYoyChange === 0 ? "stability" : "softening"}, with a year-on-year change of <strong className="text-foreground">{agg.avgYoyChange > 0 ? "+" : ""}{agg.avgYoyChange}%</strong> across the county&apos;s {agg.townCount} principal towns.
                  </p>
                  {agg.totalNewBuilds > 0 && (
                    <p>
                      New-build completions totalled <strong className="text-foreground">{agg.totalNewBuilds.toLocaleString("en-GB")}</strong> over the same period, representing {((agg.totalNewBuilds / agg.totalTransactions) * 100).toFixed(1)}% of total transactions. {agg.totalNewBuilds > 100 ? "This signals an active development pipeline with proven buyer demand." : "Development activity is moderate, suggesting potential for increased supply to meet demand."}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Development drivers */}
            {countyData?.drivers && countyData.drivers.length > 0 && (
              <div className="mt-8">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--gold-dark)" }}>
                  Key Development Drivers
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {countyData.drivers.map((driver) => (
                    <div key={driver} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-4">
                      <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--gold)" }} />
                      <span className="text-sm font-medium text-foreground">{driver}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Link to full market report */}
            {countyReport && (
              <div
                className="not-prose mt-8 border p-6"
                style={{ borderColor: "var(--stone-dark)", background: "oklch(0.75 0.12 85 / 0.05)" }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p
                      className="text-[10px] font-medium uppercase tracking-[0.26em]"
                      style={{ color: "var(--gold-dark)" }}
                    >
                      In-depth analysis
                    </p>
                    <p
                      className="font-heading mt-3 text-[20px] font-medium leading-tight tracking-tight"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {countyReport.title}
                    </p>
                    <p
                      className="mt-2 text-[13px]"
                      style={{ color: "oklch(0.50 0.02 255)" }}
                    >
                      {countyReport.readingTime} · {countyReport.sections.length} sections with charts and data tables
                    </p>
                  </div>
                  <CTAButton
                    href={`/market-reports/${countyReport.slug}`}
                    variant="navy"
                  >
                    Read report
                  </CTAButton>
                </div>
              </div>
            )}
        </ProseSection>
      </EditorialSection>

      {/* Price by Property Type */}
      {agg && Object.keys(agg.medianByType).length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="Price analysis"
            title={
              <>
                {countyName} house prices
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  by property type.
                </span>
              </>
            }
            body="Understanding price variation across property types is essential for developers assessing scheme viability. The spread between property types indicates the range of opportunities available."
          />
          <div className="mt-16 mx-auto max-w-4xl">

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Property Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">{countyName} Median</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">UK Average</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(agg.medianByType)
                      .filter(([, v]) => v > 0)
                      .sort(([, a], [, b]) => b - a)
                      .map(([type, price]) => {
                        const national: Record<string, number> = { D: 420000, S: 265000, T: 230000, F: 225000 };
                        const diff = price - (national[type] || 0);
                        
return (
                          <tr key={type} className="border-b border-border last:border-0">
                            <td className="px-4 py-3 font-medium text-foreground">{TYPE_LABELS[type] || type}</td>
                            <td className="px-4 py-3 font-semibold text-foreground">{formatPrice(price)}</td>
                            <td className="px-4 py-3 text-muted-foreground">{formatPrice(national[type] || 0)}</td>
                            <td className={`px-4 py-3 font-medium ${diff > 0 ? "text-green-600" : "text-red-500"}`}>
                              {diff > 0 ? "+" : ""}{formatPriceShort(diff)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {agg.medianByType.D && agg.medianByType.F && (
                <p
                  className="mt-6 text-[15px] leading-[1.65]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  The{" "}
                  <strong style={{ color: "var(--navy-dark)" }}>
                    {formatPriceShort(agg.medianByType.D - agg.medianByType.F)} spread
                  </strong>{" "}
                  between detached homes and flats creates development
                  opportunities across the specification spectrum — from
                  high-value family homes to accessible apartment schemes.
                </p>
              )}
          </div>
        </EditorialSection>
      )}

      {/* Town-by-Town Comparison */}
      {agg && agg.towns.length > 1 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="Town comparison"
            title={
              <>
                {countyName} town-by-town
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  price data.
                </span>
              </>
            }
            body={`${countyName} encompasses ${agg.townCount} principal towns with distinct market characteristics. Ranked by median price alongside transaction volume and annual price movement.`}
          />
          <div className="mt-16 mx-auto max-w-4xl">

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Town</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Median Price</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Sales (12m)</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">YoY Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {townsByPrice.map((town) => (
                      <tr key={town.slug} className="border-b border-border last:border-0 transition-colors hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <Link href={`/locations/${county}/${town.slug}`} className="font-medium text-gold-dark hover:text-gold">
                            {town.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">{formatPrice(town.medianPrice)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{town.transactionCount12m.toLocaleString("en-GB")}</td>
                        <td className={`px-4 py-3 font-medium ${town.yoyChange > 0 ? "text-green-600" : town.yoyChange < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                          {town.yoyChange > 0 ? "+" : ""}{town.yoyChange}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Highlights */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {townsByPrice.length >= 3 && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">Most Expensive</p>
                    {townsByPrice.slice(0, 3).map(t => (
                      <p key={t.slug} className="text-sm">
                        <Link href={`/locations/${county}/${t.slug}`} className="font-medium text-foreground hover:text-gold-dark">{t.name}</Link>
                        <span className="text-muted-foreground"> - {formatPrice(t.medianPrice)}</span>
                      </p>
                    ))}
                  </div>
                )}
                {townsByPrice.length >= 3 && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">Most Affordable</p>
                    {townsByPrice.slice(-3).reverse().map(t => (
                      <p key={t.slug} className="text-sm">
                        <Link href={`/locations/${county}/${t.slug}`} className="font-medium text-foreground hover:text-gold-dark">{t.name}</Link>
                        <span className="text-muted-foreground"> - {formatPrice(t.medianPrice)}</span>
                      </p>
                    ))}
                  </div>
                )}
                {townsByVolume.length >= 3 && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">Most Active</p>
                    {townsByVolume.slice(0, 3).map(t => (
                      <p key={t.slug} className="text-sm">
                        <Link href={`/locations/${county}/${t.slug}`} className="font-medium text-foreground hover:text-gold-dark">{t.name}</Link>
                        <span className="text-muted-foreground"> - {t.transactionCount12m.toLocaleString("en-GB")} sales</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
          </div>
        </EditorialSection>
      )}

      {/* Development Finance Section */}
      <EditorialSection tone="stone">
        <ProseSection
          tone="stone"
          title={
            <>
              Development finance
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                in {countyName}.
              </span>
            </>
          }
        >
          <div className="space-y-4">
              <p>
                Whether you&apos;re planning a ground-up residential development, converting a commercial building, or acquiring a site at auction in {countyName}, Construction Capital sources the optimal finance structure from our panel of 100+ lenders, funds, and family offices.
              </p>
              {agg && agg.medianByType.D && (
                <p>
                  For a typical {countyName} development with a GDV based on detached home values of {formatPrice(agg.medianByType.D)}, senior development finance of <strong className="text-foreground">{formatPrice(Math.round(agg.medianByType.D * 0.65))}</strong> at 65% LTGDV is achievable. Mezzanine finance can stretch total borrowing to 85-90% of costs, reducing the equity requirement to as little as 10-15%.
                </p>
              )}

            <div className="not-prose mt-10 grid gap-px border-y sm:grid-cols-2 lg:grid-cols-3" style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}>
              {SERVICES.slice(0, 6).map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex flex-col gap-3 px-6 py-6 transition-colors"
                  style={{ background: "var(--stone)" }}
                >
                  <h3
                    className="font-heading text-[18px] font-medium leading-tight tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {service.name}
                  </h3>
                  <p className="text-[14px] leading-[1.55]" style={{ color: "oklch(0.35 0.04 255)" }}>
                    {service.shortDesc}
                  </p>
                  <span
                    className="numeral-tabular text-[11px] font-medium uppercase tracking-[0.22em]"
                    style={{ color: "var(--gold-dark)" }}
                  >
                    {service.typicalRate}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </ProseSection>
      </EditorialSection>

      {/* Towns Grid */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow={`Locations in ${countyName}`}
          title={
            <>
              Explore {countyName}
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                town by town.
              </span>
            </>
          }
          body="Select a town for local property finance services, market data, and recent sold prices."
        />

        <div className="mt-16 grid gap-px border-y sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}>
            {towns.map((town) => {
              const townAgg = agg?.towns.find(t => t.slug === town.slug);
              return (
                <Link
                  key={town.slug}
                  href={`/locations/${county}/${town.slug}`}
                  className="group relative flex flex-col gap-3 px-6 py-6 transition-colors"
                  style={{ background: "var(--paper)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className="font-heading text-[18px] font-medium leading-tight tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {town.name}
                    </h3>
                    <ChevronRight
                      className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                      style={{ color: "var(--gold-dark)" }}
                    />
                  </div>
                  {townAgg ? (
                    <p
                      className="numeral-tabular text-[11px] font-medium uppercase tracking-[0.22em]"
                      style={{ color: "oklch(0.50 0.02 255)" }}
                    >
                      {formatPriceShort(townAgg.medianPrice)} median · {townAgg.transactionCount12m} sales
                    </p>
                  ) : (
                    <p
                      className="line-clamp-2 text-[13px] leading-[1.5]"
                      style={{ color: "oklch(0.35 0.04 255)" }}
                    >
                      {town.context}
                    </p>
                  )}
                </Link>
              );
            })}
        </div>
      </EditorialSection>

      {/* Local Case Studies */}
      <LocalCaseStudies caseStudies={localCaseStudies} locationName={countyName} />

      {/* FAQs */}
      {faqs.length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="Common questions"
            title={
              <>
                {countyName}
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  — answered.
                </span>
              </>
            }
          />
          <div className="mt-16 mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border-b"
                style={{ borderColor: "var(--stone-dark)" }}
              >
                <summary
                  className="flex cursor-pointer items-center justify-between py-5 font-heading text-[18px] font-medium leading-snug tracking-tight [&::-webkit-details-marker]:hidden"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {faq.q}
                  <ChevronRight
                    className="ml-3 h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-90"
                    style={{ color: "var(--gold-dark)" }}
                  />
                </summary>
                <p
                  className="pb-6 text-[16px] leading-[1.65]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  {faq.a}
                </p>
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
                <ChevronRight
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
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </EditorialSection>
      )}

      {/* Map - moved to bottom */}
      <LocationMap locationName={countyName} countyName="United Kingdom" />

      {/* CTA */}
      <LocationCTA townName={countyName} />
    </>
  );
}
