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
    title: `${townName} Development Finance — Property Market Data & Lending | ${countyName}`,
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
    name: `${SITE_NAME} — ${townName}`,
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

      {/* Hero Section */}
      <section className="hero-gradient noise-overlay relative overflow-hidden py-20 text-white sm:py-28">
        {/* Architectural grid background */}
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="town-hero-grid"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#town-hero-grid)" />
          </svg>
        </div>

        {/* Radial glow */}
        <div
          className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2"
          style={{
            width: "600px",
            height: "500px",
            background:
              "radial-gradient(ellipse, oklch(0.75 0.12 85 / 0.08) 0%, transparent 60%)",
          }}
        />

        {/* Diagonal gold beam */}
        <div
          className="pointer-events-none absolute -right-40 top-0 h-[160%] w-[2px] origin-top-right rotate-[22deg]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--gold) 30%, var(--gold) 50%, transparent 100%)",
            opacity: 0.12,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8"><Breadcrumbs items={breadcrumbItems} /></div>

          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl flex-1">
              <div className="mb-8 h-[2px] w-20" style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-light))" }} />
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] sm:text-sm" style={{ color: "var(--gold)" }}>
                {countyName}
              </p>

              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                <span className="gold-gradient-text italic">{townName}</span>
                <br />Development Finance
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-white/60 sm:text-xl">
                Expert property development finance in {townName}, {countyName}.
                {soldData ? ` Median price ${formatPrice(soldData.stats.medianPrice)}, ${soldData.stats.transactionCount12m.toLocaleString("en-GB")} annual sales.` : ""}{" "}
                We connect developers with competitive funding from 100+ lenders.
              </p>

              <div className="mt-10">
                <Button asChild size="lg" className="cta-shimmer h-14 bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark">
                  <Link href="/deal-room">
                    Start Your {townName} Deal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Key stats */}
            {soldData && (
              <div className="grid w-full grid-cols-2 gap-3 md:w-[280px] md:shrink-0">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <PoundSterling className="mb-2 h-4 w-4 text-gold/70" />
                  <p className="text-2xl font-black tracking-tight" style={{ color: "var(--gold)" }}>{formatPriceShort(soldData.stats.medianPrice)}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Median Price</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <BarChart3 className="mb-2 h-4 w-4 text-gold/70" />
                  <p className="text-2xl font-black tracking-tight" style={{ color: "var(--gold)" }}>{soldData.stats.transactionCount12m.toLocaleString("en-GB")}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Sales (12m)</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  {soldData.stats.yoyChange >= 0 ? <TrendingUp className="mb-2 h-4 w-4 text-green-400/70" /> : <TrendingDown className="mb-2 h-4 w-4 text-red-400/70" />}
                  <p className={`text-2xl font-black tracking-tight ${soldData.stats.yoyChange >= 0 ? "text-green-400" : "text-red-400"}`}>{soldData.stats.yoyChange > 0 ? "+" : ""}{soldData.stats.yoyChange}%</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">YoY Change</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <Building2 className="mb-2 h-4 w-4 text-gold/70" />
                  <p className="text-2xl font-black tracking-tight" style={{ color: "var(--gold)" }}>{soldData.stats.newBuildCount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">New Builds</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom gold edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--gold) 20%, var(--gold) 80%, transparent 100%)",
            opacity: 0.35,
          }}
        />
      </section>

      {/* Location Hero Image */}
      <LocationHeroImage
        countySlug={county}
        townSlug={town}
        locationName={`${townName}, ${countyName}`}
      />

      {/* Town Overview — finance-focused narrative */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div
              className="mb-5 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
              Property Finance in {townName}
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              {townOverview.map((paragraph, i) => (
                <p key={i}>
                  {paragraph.links
                    ? renderTextWithLinks(paragraph.text, paragraph.links)
                    : paragraph.text}
                </p>
              ))}
            </div>

            {/* Links to market reports */}
            {(() => {
              const townReport = getReportByTownSlug(county, town);
              const countyReport = getReportByCountySlug(county);
              return (
                <div className="mt-6 flex flex-col gap-2">
                  {townReport && (
                    <Link
                      href={`/market-reports/${townReport.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-gold-dark hover:text-gold"
                    >
                      {townName} Property Market Report
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  {countyReport && (
                    <Link
                      href={`/market-reports/${countyReport.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-gold-dark hover:text-gold"
                    >
                      {countyName} County Market Report
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Services Grid — core offering, positioned high for user intent */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div
              className="mb-5 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
              style={{ color: "var(--gold-dark)" }}
            >
              Our Services
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Property Finance in {townName}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Select a service to learn more about how we can help fund your{" "}
              {townName} development project.
            </p>
          </div>

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
      </section>

      {/* Live Market Snapshot — data supports the finance narrative */}
      {townStats && (
        <MarketSnapshot stats={townStats.marketSnapshot} townName={townName} />
      )}

      {/* Local GDV Calculator — engagement tool near market data */}
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

      {/* Town Market Insights — editorial content, unique per town */}
      {townMarketData && (
        <TownMarketInsights data={townMarketData} townName={townName} />
      )}

      {/* Recent Sold Prices — from Land Registry data */}
      {soldData && (
        <RecentSoldPrices
          transactions={soldData.recentTransactions}
          stats={soldData.stats}
          townName={townName}
        />
      )}

      {/* Planning Applications — approved + pending */}
      {planningData && (
        <PlanningApplicationsTable
          approved={planningData.approvedApplications}
          pending={planningData.pendingApplications}
          summary={planningData.summary}
          townName={townName}
        />
      )}

      {/* FAQs — data-driven, unique per town */}
      {townFaqs.length > 0 && (
        <section className="bg-muted/30 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div
                className="mb-5 h-[2px] w-14"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gold), var(--gold-light))",
                }}
              />
              <p
                className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
                style={{ color: "var(--gold-dark)" }}
              >
                Common Questions
              </p>
              <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
                Property Finance in {townName} — FAQs
              </h2>

              <div className="space-y-4">
                {townFaqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-border bg-card/70 transition-colors open:bg-card"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-5 text-base font-semibold leading-snug [&::-webkit-details-marker]:hidden">
                      {faq.question}
                      <ChevronRight className="ml-3 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90" />
                    </summary>
                    <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </div>
                  </details>
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

      {/* Local Case Studies */}
      <LocalCaseStudies caseStudies={localCaseStudies} locationName={countyName} />

      {/* Location Map — reference section near bottom */}
      <LocationMap locationName={townName} countyName={countyName} />

      {/* Related Towns */}
      <RelatedTowns towns={relatedTowns} currentTown={townName} />

      {/* CTA */}
      <LocationCTA townName={townName} />
    </>
  );
}
