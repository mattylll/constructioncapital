import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ChevronRight, ArrowRight, TrendingUp, TrendingDown, Building2, BarChart3, PoundSterling, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/locations/breadcrumbs";
import { LocationCTA } from "@/components/locations/location-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
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
      <section className="hero-gradient noise-overlay relative overflow-hidden py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <svg className="h-full w-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="county-hero-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#county-hero-grid)" />
          </svg>
        </div>

        <div className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2" style={{ width: "600px", height: "500px", background: "radial-gradient(ellipse, oklch(0.75 0.12 85 / 0.08) 0%, transparent 60%)" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8"><Breadcrumbs items={breadcrumbItems} /></div>

          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            {/* Left: title + CTA */}
            <div className="max-w-2xl flex-1">
              <div className="mb-8 h-[2px] w-20" style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-light))" }} />
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] sm:text-sm" style={{ color: "var(--gold)" }}>
                {countyName}
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                <span className="gold-gradient-text italic">{countyName}</span>
                <br />Development Finance
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/60 sm:text-xl">
                Expert property development finance across {countyName}.
                {agg ? ` ${agg.townCount} towns, ${agg.totalTransactions.toLocaleString("en-GB")} annual transactions, median price ${formatPrice(agg.medianPrice)}.` : ""}{" "}
                We connect developers with competitive funding from our panel of 100+ lenders.
              </p>
              <div className="mt-10">
                <Button asChild size="lg" className="cta-shimmer h-14 bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark">
                  <Link href="/deal-room">
                    Start Your {countyName} Deal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: key stats cards */}
            {agg && (
              <div className="grid w-full grid-cols-2 gap-3 md:w-[280px] md:shrink-0">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <PoundSterling className="mb-2 h-4 w-4 text-gold/70" />
                  <p className="text-2xl font-black tracking-tight" style={{ color: "var(--gold)" }}>{formatPriceShort(agg.medianPrice)}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Median Price</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <BarChart3 className="mb-2 h-4 w-4 text-gold/70" />
                  <p className="text-2xl font-black tracking-tight" style={{ color: "var(--gold)" }}>{agg.totalTransactions.toLocaleString("en-GB")}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Sales (12m)</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  {agg.avgYoyChange >= 0 ? <TrendingUp className="mb-2 h-4 w-4 text-green-400/70" /> : <TrendingDown className="mb-2 h-4 w-4 text-red-400/70" />}
                  <p className={`text-2xl font-black tracking-tight ${agg.avgYoyChange >= 0 ? "text-green-400" : "text-red-400"}`}>{agg.avgYoyChange > 0 ? "+" : ""}{agg.avgYoyChange}%</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">YoY Change</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <Building2 className="mb-2 h-4 w-4 text-gold/70" />
                  <p className="text-2xl font-black tracking-tight" style={{ color: "var(--gold)" }}>{agg.totalNewBuilds.toLocaleString("en-GB")}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">New Builds</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent 0%, var(--gold) 20%, var(--gold) 80%, transparent 100%)", opacity: 0.35 }} />
      </section>

      {/* Location Hero Image */}
      <LocationHeroImage countySlug={county} locationName={countyName} />

      {/* Market Overview - rich content */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 h-[2px] w-14" style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-light))" }} />
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm" style={{ color: "var(--gold-dark)" }}>Market Overview</p>
            <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
              Property Development in {countyName}
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
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
              <div className="mt-8 rounded-xl border border-gold/20 bg-gold/5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">In-Depth Analysis</p>
                    <p className="mt-1 font-bold text-foreground">{countyReport.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{countyReport.readingTime} - {countyReport.sections.length} sections with charts and data tables</p>
                  </div>
                  <Link href={`/market-reports/${countyReport.slug}`} className="shrink-0 rounded-lg bg-gold px-4 py-2 text-sm font-bold text-navy-dark transition-all hover:bg-gold-dark">
                    Read Report
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Price by Property Type */}
      {agg && Object.keys(agg.medianByType).length > 0 && (
        <section className="bg-muted/30 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="mb-5 h-[2px] w-14" style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-light))" }} />
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm" style={{ color: "var(--gold-dark)" }}>Price Analysis</p>
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                {countyName} House Prices by Property Type
              </h2>
              <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                Understanding price variation across property types is essential for developers assessing scheme viability. The spread between property types indicates the range of opportunities available.
              </p>

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
                <p className="mt-4 text-sm text-muted-foreground">
                  The <strong className="text-foreground">{formatPriceShort(agg.medianByType.D - agg.medianByType.F)} spread</strong> between detached homes and flats creates development opportunities across the specification spectrum - from high-value family homes to accessible apartment schemes.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Town-by-Town Comparison */}
      {agg && agg.towns.length > 1 && (
        <section className="bg-background py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="mb-5 h-[2px] w-14" style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-light))" }} />
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm" style={{ color: "var(--gold-dark)" }}>Town Comparison</p>
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                {countyName} Town-by-Town Price Data
              </h2>
              <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                {countyName} encompasses {agg.townCount} principal towns with distinct market characteristics. The table ranks each town by median price alongside transaction volume and annual price movement.
              </p>

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
          </div>
        </section>
      )}

      {/* Development Finance Section */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 h-[2px] w-14" style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-light))" }} />
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm" style={{ color: "var(--gold-dark)" }}>Finance Solutions</p>
            <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
              Development Finance in {countyName}
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Whether you&apos;re planning a ground-up residential development, converting a commercial building, or acquiring a site at auction in {countyName}, Construction Capital sources the optimal finance structure from our panel of 100+ lenders, funds, and family offices.
              </p>
              {agg && agg.medianByType.D && (
                <p>
                  For a typical {countyName} development with a GDV based on detached home values of {formatPrice(agg.medianByType.D)}, senior development finance of <strong className="text-foreground">{formatPrice(Math.round(agg.medianByType.D * 0.65))}</strong> at 65% LTGDV is achievable. Mezzanine finance can stretch total borrowing to 85-90% of costs, reducing the equity requirement to as little as 10-15%.
                </p>
              )}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.slice(0, 6).map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30"
                >
                  <h3 className="mb-1 font-bold text-foreground">{service.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{service.shortDesc}</p>
                  <span className="inline-flex rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: "oklch(0.75 0.12 85 / 0.1)", color: "var(--gold-dark)" }}>
                    {service.typicalRate}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Towns Grid */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-5 h-[2px] w-14" style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-light))" }} />
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm" style={{ color: "var(--gold-dark)" }}>
              Locations in {countyName}
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Explore {countyName} Towns
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Select a town for local property finance services, market data, and recent sold prices.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {towns.map((town) => {
              const townAgg = agg?.towns.find(t => t.slug === town.slug);
              return (
                <Link
                  key={town.slug}
                  href={`/locations/${county}/${town.slug}`}
                  className="glass-card group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <div className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "linear-gradient(90deg, transparent 10%, var(--gold) 50%, transparent 90%)" }} />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg, oklch(0.25 0.06 255 / 0.08), oklch(0.25 0.06 255 / 0.03))", border: "1px solid oklch(0.25 0.06 255 / 0.06)" }}>
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-foreground">{town.name}</h3>
                        {townAgg ? (
                          <p className="text-xs text-muted-foreground">
                            {formatPriceShort(townAgg.medianPrice)} median &middot; {townAgg.transactionCount12m} sales
                          </p>
                        ) : (
                          <p className="line-clamp-1 text-xs text-muted-foreground">{town.context}</p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local Case Studies */}
      <LocalCaseStudies caseStudies={localCaseStudies} locationName={countyName} />

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="bg-muted/20 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="mb-5 h-[2px] w-14" style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-light))" }} />
              <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
                Frequently Asked Questions - {countyName}
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-3 font-bold text-foreground">{faq.q}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <section className="bg-background py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="mb-5 h-[2px] w-14" style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-light))" }} />
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm" style={{ color: "var(--gold-dark)" }}>
                Expert Guides
              </p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Development Finance Guides
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30"
                >
                  <div>
                    <h3 className="mb-1 font-bold text-foreground group-hover:text-gold-dark transition-colors">
                      {guide.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">{guide.readingTime} read</span>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-gold" />
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/guides" className="text-sm font-medium text-gold-dark hover:underline">
                View all guides →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Map - moved to bottom */}
      <LocationMap locationName={countyName} countyName="United Kingdom" />

      {/* CTA */}
      <LocationCTA townName={countyName} />
    </>
  );
}
