import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ChevronRight, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/locations/breadcrumbs";
import { LocationCTA } from "@/components/locations/location-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getCountyOverview } from "@/lib/location-content";
import { UK_COUNTIES, getCountyBySlug, type TownData } from "@/lib/uk-locations-data";

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

interface PageProps {
  params: Promise<{ county: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county } = await params;
  const countyName = deslugify(county);

  return {
    title: `Development Finance in ${countyName} | ${SITE_NAME}`,
    description: `Find development finance, bridging loans, mezzanine finance and commercial mortgages in ${countyName}. Expert property finance brokers with local knowledge and nationwide lender access.`,
    alternates: {
      canonical: `${SITE_URL}/locations/${county}`,
    },
    openGraph: {
      title: `Development Finance in ${countyName} | ${SITE_NAME}`,
      description: `Find development finance, bridging loans, mezzanine finance and commercial mortgages in ${countyName}. Expert property finance brokers.`,
      url: `${SITE_URL}/locations/${county}`,
      type: "website",
    },
  };
}

export async function generateStaticParams(): Promise<{ county: string }[]> {
  return UK_COUNTIES.map((county) => ({ county: county.slug }));
}


export default async function CountyPage({ params }: PageProps) {
  const { county } = await params;
  const countyData = getCountyBySlug(county);
  const countyName = countyData?.name ?? deslugify(county);
  const towns: TownData[] = countyData?.towns ?? [];
  const countyOverview = countyData
    ? [countyData.overview]
    : getCountyOverview(county, countyName);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: countyName },
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
    name: `${SITE_NAME} — ${countyName}`,
    description: `Development finance, bridging loans, mezzanine finance and commercial mortgages in ${countyName}. Expert property finance brokers with local knowledge.`,
    url: `${SITE_URL}/locations/${county}`,
    areaServed: {
      "@type": "AdministrativeArea",
      name: countyName,
      containedInPlace: {
        "@type": "Country",
        name: "United Kingdom",
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
      "Development Exit Finance",
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={localBusinessJsonLd} />

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
                id="county-hero-grid"
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
            <rect width="100%" height="100%" fill="url(#county-hero-grid)" />
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
            {countyName}
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Development Finance
            <br />
            in <span className="gold-gradient-text italic">{countyName}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            Expert property development finance across {countyName}. We connect
            developers with competitive funding from our panel of 100+ lenders
            who understand your local market.
          </p>

          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="cta-shimmer h-14 bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
            >
              <Link href="/deal-room">
                Start Your {countyName} Deal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
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

      {/* County Overview */}
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
              Property Development in {countyName}
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              {countyOverview.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* County-specific development drivers */}
            {countyData?.drivers && countyData.drivers.length > 0 && (
              <div className="mt-8">
                <p
                  className="mb-4 text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: "var(--gold-dark)" }}
                >
                  Key Development Drivers
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {countyData.drivers.map((driver) => (
                    <div
                      key={driver}
                      className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-4"
                    >
                      <div
                        className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--gold)" }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {driver}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Towns Grid */}
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
              Locations in {countyName}
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Find Your Town
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Select your town to explore available property finance services
              and local market information.
            </p>
          </div>

          {/* Towns grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {towns.map((town) => (
              <Link
                key={town.slug}
                href={`/locations/${county}/${town.slug}`}
                className="glass-card group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:translate-y-[-2px]"
              >
                {/* Top accent line on hover */}
                <div
                  className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 10%, var(--gold) 50%, transparent 90%)",
                  }}
                />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.25 0.06 255 / 0.08), oklch(0.25 0.06 255 / 0.03))",
                        border: "1px solid oklch(0.25 0.06 255 / 0.06)",
                      }}
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{town.name}</h3>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {town.context ?? "6 services available"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Available */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div
              className="mx-auto mb-5 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Services Available in {countyName}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              We arrange the full spectrum of property development finance
              across {countyName}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Development Finance",
                desc: "Senior debt for ground-up developments",
                rate: "From 6.5% p.a.",
              },
              {
                name: "Mezzanine Finance",
                desc: "Stretch your capital stack to 85-90% LTGDV",
                rate: "From 12% p.a.",
              },
              {
                name: "Bridging Loans",
                desc: "Fast funding for acquisitions and auctions",
                rate: "From 0.55% p.m.",
              },
              {
                name: "Equity & Joint Ventures",
                desc: "Capital partnerships for larger projects",
                rate: "Profit share from 40%",
              },
              {
                name: "Refurbishment Finance",
                desc: "Funding for renovations and conversions",
                rate: "From 0.65% p.m.",
              },
              {
                name: "Commercial Mortgages",
                desc: "Long-term finance for commercial property",
                rate: "From 5.5% p.a.",
              },
              {
                name: "Development Exit Finance",
                desc: "Sell completed units without time pressure",
                rate: "From 0.55% p.m.",
              },
            ].map((service) => (
              <div
                key={service.name}
                className="rounded-xl border border-border bg-card/70 p-6"
              >
                <h3 className="mb-2 font-bold text-foreground">
                  {service.name}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {service.desc}
                </p>
                <span
                  className="inline-flex rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: "oklch(0.75 0.12 85 / 0.1)",
                    color: "var(--gold-dark)",
                  }}
                >
                  {service.rate}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <LocationCTA townName={countyName} />
    </>
  );
}
