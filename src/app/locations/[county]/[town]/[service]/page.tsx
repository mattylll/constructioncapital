import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp, Percent, CalendarDays, FileText , BookOpen, BarChart3, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/locations/breadcrumbs";
import { RelatedServices } from "@/components/locations/related-services";
import { RelatedTowns } from "@/components/locations/related-towns";
import { LocationCTA } from "@/components/locations/location-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { CTAButton, PageHero } from "@/components/editorial/primitives";
import { SERVICES, type Service } from "@/lib/services";
import { SITE_NAME, SITE_URL, CONTACT } from "@/lib/constants";
import { getCaseStudiesByCountyAndService, getCaseStudiesByCounty } from "@/lib/case-studies";
import {
  getMarketCommentary,
  getFaqs,
  getDealExample,
  getArrangementFee,
  getEnrichedMarketCommentary,
  getServiceFaqsWithData,
  getServicePageSections,
} from "@/lib/location-content";
import { LocalCaseStudies } from "@/components/locations/local-case-studies";
import { LocationMap } from "@/components/locations/location-map";
import { LocationHeroImage } from "@/components/locations/location-hero-image";
import {
  UK_COUNTIES,
  getTownInCounty,
  getRelatedTowns as getRealRelatedTowns,
  getCountyBySlug,
} from "@/lib/uk-locations-data";
import { getTownMarketData } from "@/lib/town-market-data";
import { getTownStats, getSoldData, getPlanningData } from "@/lib/local-market-data";
import { MarketSnapshot } from "@/components/locations/market-snapshot";
import { PlanningApplicationsTable } from "@/components/locations/planning-applications-table";
import { PlanningDealAnalysis } from "@/components/locations/planning-deal-analysis";
import { RecentSoldPrices } from "@/components/locations/recent-sold-prices";
import { getGuidesByService } from "@/lib/guides";
import { getReportByCountySlug, getReportByTownSlug } from "@/lib/market-reports";

// ISR configuration
export const dynamicParams = true;
export const revalidate = 86400; // Revalidate every 24 hours

// Helper to convert slug to display name
function deslugify(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Helper to convert name to slug
function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// Find service by slug
function findService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

// Varied title patterns per service - avoids near-duplicate title tags across thousands of pages
const SERVICE_TITLE_PATTERNS: Record<string, (town: string, county: string) => { title: string; h1: [string, string] }> = {
  "development-finance": (town, county) => ({
    title: `Development Finance in ${town}, ${county} - Rates from 6.5%`,
    h1: ["Development Finance", `in ${town}`],
  }),
  "mezzanine-finance": (town, county) => ({
    title: `Mezzanine Finance ${town} - Stretch to 90% LTGDV | ${county}`,
    h1: ["Mezzanine Finance", `for ${town} Developers`],
  }),
  "bridging-loans": (town, county) => ({
    title: `Bridging Loans in ${town} - Complete in 7 Days | ${county}`,
    h1: ["Bridging Loans", `in ${town}`],
  }),
  "equity-jv": (town, county) => ({
    title: `Equity & JV Partners for ${town} Developments | ${county}`,
    h1: ["Equity & Joint Ventures", `in ${town}`],
  }),
  "refurbishment-finance": (town, county) => ({
    title: `Refurbishment Finance ${town} - Light & Heavy Refurb | ${county}`,
    h1: ["Refurbishment Finance", `in ${town}`],
  }),
  "commercial-mortgages": (town, county) => ({
    title: `Commercial Mortgages in ${town} - Rates from 5.5% | ${county}`,
    h1: ["Commercial Mortgages", `in ${town}`],
  }),
  "development-exit-finance": (town, county) => ({
    title: `Development Exit Finance in ${town} - From 0.55% p.m. | ${county}`,
    h1: ["Development Exit Finance", `in ${town}`],
  }),
};

// Varied meta description patterns per service
const SERVICE_DESC_PATTERNS: Record<string, (town: string, county: string) => string> = {
  "development-finance": (town, county) =>
    `Development finance for ground-up projects in ${town}, ${county}. Rates from 6.5% p.a., up to 70% LTGDV. 100+ lender panel with 25+ years arranging senior debt for UK developers.`,
  "mezzanine-finance": (town, county) =>
    `Mezzanine finance in ${town}, ${county} to stretch your capital stack to 85-90% LTGDV. Reduce equity requirements on your ${town} development. Expert structuring from experienced brokers.`,
  "bridging-loans": (town, county) =>
    `Fast bridging loans in ${town}, ${county}. Complete in 7-14 days for auctions, acquisitions and time-sensitive deals. Rates from 0.55% p.m., LTVs up to 75%.`,
  "equity-jv": (town, county) =>
    `Find equity partners and JV capital for ${town} developments. We connect ${county} developers with family offices and institutional investors. Fund up to 100% of project costs.`,
  "refurbishment-finance": (town, county) =>
    `Light and heavy refurbishment finance in ${town}, ${county}. Fund renovations, conversions and HMO projects. Rates from 0.65% p.m. with fast completion times.`,
  "commercial-mortgages": (town, county) =>
    `Commercial mortgages in ${town}, ${county}. Long-term finance for offices, retail, industrial and mixed-use property. Rates from 5.5% p.a., LTVs up to 75%.`,
  "development-exit-finance": (town, county) =>
    `Development exit finance in ${town}, ${county}. Repay your development facility and sell completed units at the best price. Rates from 0.55% p.m., LTVs up to 75%.`,
};

interface PageProps {
  params: Promise<{ county: string; town: string; service: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county, town, service } = await params;
  const countyName = deslugify(county);
  const townName = deslugify(town);
  const serviceData = findService(service);
  const serviceName = serviceData?.name || deslugify(service);

  const titlePattern = SERVICE_TITLE_PATTERNS[service];
  const descPattern = SERVICE_DESC_PATTERNS[service];
  const title = titlePattern
    ? titlePattern(townName, countyName).title
    : `${serviceName} in ${townName}, ${countyName}`;
  const description = descPattern
    ? descPattern(townName, countyName)
    : `${serviceName} for property developers in ${townName}, ${countyName}. ${serviceData?.shortDesc || ""} Expert brokers with 25+ years experience and 100+ lender relationships.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/locations/${county}/${town}/${service}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/locations/${county}/${town}/${service}`,
      type: "website",
    },
  };
}

// Only prerender top-traffic service pages at build time.
// Remaining ~3,000 pages use ISR (dynamicParams=true, revalidate=86400)
// and are built on first request, then cached for 24 hours.
export async function generateStaticParams(): Promise<
  { county: string; town: string; service: string }[]
> {
  return [];
}



export default async function ServicePage({ params }: PageProps) {
  const { county, town, service } = await params;
  const countyData = getCountyBySlug(county);
  const countyName = countyData?.name ?? deslugify(county);
  const townData = getTownInCounty(county, town);
  const townName = townData?.name ?? deslugify(town);
  const serviceData = findService(service);
  const serviceName = serviceData?.name || deslugify(service);

  // Case studies: prefer exact county+service match, fall back to county-only
  const exactCaseStudies = getCaseStudiesByCountyAndService(county, service);
  const localCaseStudies = exactCaseStudies.length > 0
    ? exactCaseStudies
    : getCaseStudiesByCounty(county);

  const realRelated = getRealRelatedTowns(county, town, 6);
  const relatedTowns = realRelated.map((t) => ({
    name: t.name,
    slug: t.slug,
    countySlug: county,
  }));
  const dealExample = getDealExample(service, townName);
  const arrangementFee = getArrangementFee(service);
  const townMarketData = getTownMarketData(county, town);
  const townStats = getTownStats(county, town);
  const soldData = getSoldData(county, town);
  const planningData = getPlanningData(county, town);
  const relatedGuides = getGuidesByService(service, 3);
  const townReport = getReportByTownSlug(county, town);
  const countyReport = getReportByCountySlug(county);

  // Build local data for enrichment
  const localData = (soldData?.stats || townStats) ? {
    medianPrice: soldData?.stats?.medianPrice ?? townStats?.marketSnapshot.medianPrice,
    medianByType: soldData?.stats?.medianByType,
    transactionCount12m: soldData?.stats?.transactionCount12m ?? townStats?.marketSnapshot.transactionCount12m,
    yoyChange: soldData?.stats?.yoyChange ?? townStats?.marketSnapshot.yoyPriceChange,
    context: townData?.context,
  } : undefined;

  // Use town-specific service commentary when available, then enriched, then generic
  const marketCommentary = townMarketData?.serviceCommentary?.[service]
    ?? getEnrichedMarketCommentary(service, county, townName, countyName, localData);

  // Data-enriched FAQs
  const faqs = getServiceFaqsWithData(service, townName, countyName, localData);

  // Rich content sections for SEO depth
  const contentSections = getServicePageSections(service, townName, countyName, localData);

  // Varied H1 per service type
  const titlePattern = SERVICE_TITLE_PATTERNS[service];
  const h1Parts = titlePattern
    ? titlePattern(townName, countyName).h1
    : [serviceName, `in ${townName}`];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: countyName, href: `/locations/${county}` },
    { label: townName, href: `/locations/${county}/${town}` },
    { label: serviceName },
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const financialServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `${serviceName} in ${townName} - ${SITE_NAME}`,
    description: `${serviceName} for property developers in ${townName}, ${countyName}. ${serviceData?.shortDesc || ""}`,
    url: `${SITE_URL}/locations/${county}/${town}/${service}`,
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
    serviceType: serviceName,
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={financialServiceJsonLd} />

      <PageHero
        tone="paper"
        breadcrumbs={breadcrumbItems}
        eyebrow={`${townName}, ${countyName}`}
        title={
          <>
            <span className="italic" style={{ color: "var(--navy)" }}>{h1Parts[0]}</span>
            <br />
            {h1Parts[1]}
          </>
        }
        deck={
          serviceData?.longDesc ||
          `Expert ${serviceName.toLowerCase()} for property developers in ${townName}. We connect you with competitive funding from our panel of 100+ lenders.`
        }
        actions={
          <div className="flex flex-wrap items-center gap-4">
            <CTAButton href="/deal-room" variant="navy" size="lg">
              Get {serviceName.toLowerCase()} terms
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

      {/* Market Commentary */}
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
              {serviceName} Market in {townName}
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              {marketCommentary.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rich Content Sections - SEO depth with internal links */}
      {contentSections.length > 0 && (
        <section className="bg-muted/30 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-14">
              {contentSections.map((section, sIdx) => (
                <div key={sIdx}>
                  <div
                    className="mb-5 h-[2px] w-14"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--gold), var(--gold-light))",
                    }}
                  />
                  <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                    {section.title}
                  </h2>
                  {section.content.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className="mb-5 text-base leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:decoration-gold/40 [&_a]:underline-offset-2 hover:[&_a]:decoration-gold"
                      dangerouslySetInnerHTML={{ __html: p }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Local Market Snapshot - real data when available */}
      {townStats && (
        <MarketSnapshot stats={townStats.marketSnapshot} townName={townName} />
      )}

      {/* Planning Applications */}
      {planningData && (
        <PlanningApplicationsTable
          approved={planningData.approvedApplications}
          pending={planningData.pendingApplications}
          summary={planningData.summary}
          townName={townName}
        />
      )}

      {/* Deal Analysis - financial breakdown of key schemes */}
      {planningData && (
        <PlanningDealAnalysis
          applications={[
            ...planningData.approvedApplications,
            ...planningData.pendingApplications,
          ]}
          townName={townName}
          countyName={countyName}
          countySlug={county}
          townSlug={town}
          currentServiceSlug={service}
          medianPrice={
            soldData?.stats?.medianPrice ?? townStats?.marketSnapshot.medianPrice
          }
        />
      )}

      {/* Recent Sold Prices */}
      {soldData && soldData.recentTransactions.length > 0 && (
        <RecentSoldPrices
          transactions={soldData.recentTransactions}
          stats={soldData.stats}
          townName={townName}
        />
      )}

      {/* Rate Card */}
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
              Indicative Terms
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {serviceName} Rates
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Typical terms available for {serviceName.toLowerCase()} in{" "}
              {townName}. Actual rates depend on your project specifics and
              experience.
            </p>
          </div>

          {/* Rate table as styled cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                  border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                }}
              >
                <Percent className="h-6 w-6" style={{ color: "var(--gold)" }} />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Interest Rate
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {serviceData?.typicalRate || "From 6.5% p.a."}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                  border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                }}
              >
                <TrendingUp
                  className="h-6 w-6"
                  style={{ color: "var(--gold)" }}
                />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Loan to Value
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {serviceData?.typicalLtv || "Up to 70% LTGDV"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                  border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                }}
              >
                <CalendarDays
                  className="h-6 w-6"
                  style={{ color: "var(--gold)" }}
                />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Typical Term
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {serviceData?.typicalTerm || "12-24 months"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                  border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                }}
              >
                <FileText
                  className="h-6 w-6"
                  style={{ color: "var(--gold)" }}
                />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Arrangement Fee
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {arrangementFee}
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Rates shown are indicative and subject to individual assessment.
            Contact us for a bespoke quote.
          </p>
        </div>
      </section>

      {/* Deal Example */}
      <section className="bg-background py-16 sm:py-20">
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
              Representative Deal
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Example {serviceName} Structure
            </h2>
          </div>

          {/* Deal card */}
          <div
            className="relative overflow-hidden rounded-2xl p-8 sm:p-10"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.05 255) 0%, oklch(0.22 0.06 255) 100%)",
            }}
          >
            {/* Corner decoration */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10"
              style={{ backgroundColor: "var(--gold)" }}
            />

            <div className="relative">
              <h3
                className="mb-4 text-xl font-bold sm:text-2xl"
                style={{ color: "var(--gold)" }}
              >
                {dealExample.title}
              </h3>
              <p className="mb-8 max-w-2xl text-white/60">
                {dealExample.description}
              </p>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-white/40">GDV</p>
                  <p className="text-2xl font-bold text-white">
                    {dealExample.gdv}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/40">
                    Loan Amount
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {dealExample.loanAmount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/40">LTV</p>
                  <p className="text-2xl font-bold text-white">
                    {dealExample.ltv}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/40">Loan Type</p>
                  <p className="text-2xl font-bold text-white">
                    {dealExample.loanType}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            This is a representative example. Actual terms vary based on project
            specifics.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
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
              Common Questions
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {serviceName} FAQ
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-0">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group border-b border-border"
                >
                  <summary className="flex cursor-pointer items-center justify-between py-4 text-left text-base font-semibold transition-colors hover:text-foreground/80 [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <svg className="ml-2 h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </summary>
                  <div className="pb-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                </details>
              ))}
          </div>
        </div>
      </section>

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <section className="bg-background py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              Learn More
            </p>
            <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
              {serviceName} Guides
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/30 hover:-translate-y-1"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gold-dark" />
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {guide.readingTime}
                    </span>
                  </div>
                  <h3 className="mb-2 font-bold text-foreground group-hover:text-gold-dark transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {guide.excerpt}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Button asChild variant="outline" size="sm">
                <Link href="/guides">
                  View All Guides
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Market Reports */}
      {(countyReport || townReport) && (
        <section className="bg-muted/30 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              Market Intelligence
            </p>
            <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
              Local Market Reports
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {townReport && (
                <Link
                  href={`/market-reports/${townReport.slug}`}
                  className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/30"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gold-dark" />
                    <span className="text-xs text-muted-foreground">
                      {townReport.readingTime}
                    </span>
                  </div>
                  <h3 className="mb-2 font-bold text-foreground group-hover:text-gold-dark transition-colors">
                    {townReport.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {townReport.excerpt}
                  </p>
                </Link>
              )}
              {countyReport && (
                <Link
                  href={`/market-reports/${countyReport.slug}`}
                  className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/30"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gold-dark" />
                    <span className="text-xs text-muted-foreground">
                      {countyReport.readingTime}
                    </span>
                  </div>
                  <h3 className="mb-2 font-bold text-foreground group-hover:text-gold-dark transition-colors">
                    {countyReport.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {countyReport.excerpt}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Local Case Studies */}
      <LocalCaseStudies caseStudies={localCaseStudies} locationName={`${townName}, ${countyName}`} />

      {/* CTA Section */}
      <LocationCTA townName={townName} serviceName={serviceName} />

      {/* Location Map */}
      <LocationMap locationName={townName} countyName={countyName} />

      {/* Related Services */}
      <RelatedServices
        services={SERVICES}
        countySlug={county}
        townSlug={town}
        currentServiceSlug={service}
        townName={townName}
      />

      {/* Related Towns */}
      <RelatedTowns
        towns={relatedTowns}
        serviceSlug={service}
        currentTown={townName}
      />
    </>
  );
}
