import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp, Percent, CalendarDays, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/locations/breadcrumbs";
import { RelatedServices } from "@/components/locations/related-services";
import { RelatedTowns } from "@/components/locations/related-towns";
import { LocationCTA } from "@/components/locations/location-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { SERVICES, type Service } from "@/lib/services";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  getMarketCommentary,
  getFaqs,
  getDealExample,
  getArrangementFee,
} from "@/lib/location-content";
import {
  UK_COUNTIES,
  getTownInCounty,
  getRelatedTowns as getRealRelatedTowns,
  getCountyBySlug,
} from "@/lib/uk-locations-data";

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

// Varied title patterns per service — avoids near-duplicate title tags across thousands of pages
const SERVICE_TITLE_PATTERNS: Record<string, (town: string, county: string) => { title: string; h1: [string, string] }> = {
  "development-finance": (town, county) => ({
    title: `Development Finance in ${town}, ${county} — Rates from 6.5%`,
    h1: ["Development Finance", `in ${town}`],
  }),
  "mezzanine-finance": (town, county) => ({
    title: `Mezzanine Finance ${town} — Stretch to 90% LTGDV | ${county}`,
    h1: ["Mezzanine Finance", `for ${town} Developers`],
  }),
  "bridging-loans": (town, county) => ({
    title: `Bridging Loans in ${town} — Complete in 7 Days | ${county}`,
    h1: ["Bridging Loans", `in ${town}`],
  }),
  "equity-jv": (town, county) => ({
    title: `Equity & JV Partners for ${town} Developments | ${county}`,
    h1: ["Equity & Joint Ventures", `in ${town}`],
  }),
  "refurbishment-finance": (town, county) => ({
    title: `Refurbishment Finance ${town} — Light & Heavy Refurb | ${county}`,
    h1: ["Refurbishment Finance", `in ${town}`],
  }),
  "commercial-mortgages": (town, county) => ({
    title: `Commercial Mortgages in ${town} — Rates from 5.5% | ${county}`,
    h1: ["Commercial Mortgages", `in ${town}`],
  }),
  "development-exit-finance": (town, county) => ({
    title: `Development Exit Finance in ${town} — From 0.55% p.m. | ${county}`,
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
    : `${serviceName} in ${townName} | ${SITE_NAME}`;
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

export async function generateStaticParams(): Promise<
  { county: string; town: string; service: string }[]
> {
  return UK_COUNTIES.flatMap((county) =>
    county.towns.flatMap((town) =>
      SERVICES.map((svc) => ({
        county: county.slug,
        town: town.slug,
        service: svc.slug,
      }))
    )
  );
}



export default async function ServicePage({ params }: PageProps) {
  const { county, town, service } = await params;
  const countyData = getCountyBySlug(county);
  const countyName = countyData?.name ?? deslugify(county);
  const townData = getTownInCounty(county, town);
  const townName = townData?.name ?? deslugify(town);
  const serviceData = findService(service);
  const serviceName = serviceData?.name || deslugify(service);

  const realRelated = getRealRelatedTowns(county, town, 6);
  const relatedTowns = realRelated.map((t) => ({
    name: t.name,
    slug: t.slug,
    countySlug: county,
  }));
  const faqs = getFaqs(service, townName, countyName);
  const dealExample = getDealExample(service, townName);
  const marketCommentary = getMarketCommentary(service, county, townName, countyName);
  const arrangementFee = getArrangementFee(service);

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
                id="service-hero-grid"
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
            <rect width="100%" height="100%" fill="url(#service-hero-grid)" />
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
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {/* Gold rule */}
          <div
            className="mb-8 h-[2px] w-20"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />

          <p
            className="mb-5 text-xs font-bold uppercase tracking-[0.35em] sm:text-sm"
            style={{ color: "var(--gold)" }}
          >
            {townName}, {countyName}
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            <span className="gold-gradient-text italic">{h1Parts[0]}</span>
            <br />
            {h1Parts[1]}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            {serviceData?.longDesc ||
              `Expert ${serviceName.toLowerCase()} for property developers in ${townName}. We connect you with competitive funding from our panel of 100+ lenders.`}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="cta-shimmer h-14 bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
            >
              <Link href="/deal-room">
                Get {serviceName} Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <span className="text-sm text-white/40">
              Indicative terms within 24 hours
            </span>
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

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border-border"
                >
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <LocationCTA townName={townName} serviceName={serviceName} />

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
