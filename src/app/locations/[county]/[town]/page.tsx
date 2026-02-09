import type { Metadata } from "next";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/locations/breadcrumbs";
import { RelatedTowns } from "@/components/locations/related-towns";
import { LocationCTA } from "@/components/locations/location-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { SERVICES } from "@/lib/services";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getTownOverview } from "@/lib/location-content";
import {
  UK_COUNTIES,
  getTownInCounty,
  getRelatedTowns as getRealRelatedTowns,
  getCountyBySlug,
} from "@/lib/uk-locations-data";

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
  params: Promise<{ county: string; town: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county, town } = await params;
  const countyName = deslugify(county);
  const townName = deslugify(town);

  return {
    title: `Property Finance in ${townName}, ${countyName} | ${SITE_NAME}`,
    description: `Development finance, bridging loans, mezzanine finance and commercial mortgages in ${townName}, ${countyName}. Expert property finance brokers with local knowledge.`,
    alternates: {
      canonical: `${SITE_URL}/locations/${county}/${town}`,
    },
    openGraph: {
      title: `Property Finance in ${townName}, ${countyName} | ${SITE_NAME}`,
      description: `Development finance, bridging loans, mezzanine finance and commercial mortgages in ${townName}, ${countyName}.`,
      url: `${SITE_URL}/locations/${county}/${town}`,
      type: "website",
    },
  };
}

export async function generateStaticParams(): Promise<{ county: string; town: string }[]> {
  return UK_COUNTIES.flatMap((county) =>
    county.towns.map((town) => ({ county: county.slug, town: town.slug }))
  );
}


export default async function TownPage({ params }: PageProps) {
  const { county, town } = await params;
  const countyData = getCountyBySlug(county);
  const countyName = countyData?.name ?? deslugify(county);
  const townData = getTownInCounty(county, town);
  const townName = townData?.name ?? deslugify(town);

  const realRelated = getRealRelatedTowns(county, town, 6);
  const relatedTowns = realRelated.map((t) => ({
    name: t.name,
    slug: t.slug,
    countySlug: county,
  }));

  // Use town-specific context if available, otherwise fall back to regional content
  const townOverview = townData?.context
    ? [townData.context, ...getTownOverview(townName, countyName, county)]
    : getTownOverview(townName, countyName, county);

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
            Property Finance
            <br />
            in <span className="gold-gradient-text italic">{townName}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            Access the full range of property development finance in {townName},{" "}
            {countyName}. From senior debt to equity partnerships, we connect
            you with lenders who understand your local market.
          </p>

          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="cta-shimmer h-14 bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
            >
              <Link href="/deal-room">
                Start Your {townName} Deal
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

      {/* Town Overview */}
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
              Development Finance in {townName}
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              {townOverview.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
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

      {/* Related Towns */}
      <RelatedTowns towns={relatedTowns} currentTown={townName} />

      {/* CTA */}
      <LocationCTA townName={townName} />
    </>
  );
}
