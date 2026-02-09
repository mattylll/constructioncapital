import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CountyCard } from "@/components/locations/county-card";
import { LocationCTA } from "@/components/locations/location-cta";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getCountyBySlug } from "@/lib/uk-locations-data";

export const metadata: Metadata = {
  title: `Development Finance Across the UK | ${SITE_NAME}`,
  description:
    "Find development finance, bridging loans, mezzanine finance and commercial mortgages across the UK. Expert property finance brokers covering every region from London to Scotland.",
  alternates: {
    canonical: `${SITE_URL}/locations`,
  },
  openGraph: {
    title: `Development Finance Across the UK | ${SITE_NAME}`,
    description:
      "Find development finance, bridging loans, mezzanine finance and commercial mortgages across the UK. Expert property finance brokers covering every region.",
    url: `${SITE_URL}/locations`,
    type: "website",
  },
};

// Region and county groupings for UK coverage
const regions = [
  {
    name: "London & South East",
    counties: [
      "Greater London",
      "Kent",
      "Surrey",
      "Sussex",
      "Hampshire",
      "Berkshire",
      "Buckinghamshire",
      "Oxfordshire",
      "Hertfordshire",
      "Essex",
    ],
  },
  {
    name: "South West",
    counties: [
      "Bristol",
      "Somerset",
      "Devon",
      "Cornwall",
      "Dorset",
      "Wiltshire",
      "Gloucestershire",
    ],
  },
  {
    name: "Midlands",
    counties: [
      "West Midlands",
      "Warwickshire",
      "Staffordshire",
      "Worcestershire",
      "Shropshire",
      "Derbyshire",
      "Nottinghamshire",
      "Leicestershire",
      "Northamptonshire",
      "Lincolnshire",
    ],
  },
  {
    name: "North West",
    counties: [
      "Greater Manchester",
      "Lancashire",
      "Merseyside",
      "Cheshire",
      "Cumbria",
    ],
  },
  {
    name: "North East & Yorkshire",
    counties: [
      "West Yorkshire",
      "South Yorkshire",
      "North Yorkshire",
      "Tyne and Wear",
      "County Durham",
      "Northumberland",
      "East Riding of Yorkshire",
    ],
  },
  {
    name: "East of England",
    counties: ["Norfolk", "Suffolk", "Cambridgeshire", "Bedfordshire"],
  },
  {
    name: "Scotland",
    counties: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Highland", "Fife"],
  },
  {
    name: "Wales",
    counties: ["Cardiff", "Swansea", "Newport", "Powys", "Gwynedd"],
  },
];

// Helper to convert name to slug
function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// Get real town count from location data
function getTownCount(countyName: string): number {
  const county = getCountyBySlug(slugify(countyName));
  return county?.towns.length ?? 0;
}

export default function LocationsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient noise-overlay relative overflow-hidden py-24 text-white sm:py-32">
        {/* Architectural grid background */}
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="locations-hero-grid"
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
            <rect width="100%" height="100%" fill="url(#locations-hero-grid)" />
          </svg>
        </div>

        {/* Radial glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "800px",
            height: "600px",
            background:
              "radial-gradient(ellipse, oklch(0.75 0.12 85 / 0.08) 0%, transparent 60%)",
          }}
        />

        {/* Diagonal gold beams */}
        <div
          className="pointer-events-none absolute -right-40 top-0 h-[160%] w-[2px] origin-top-right rotate-[22deg]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--gold) 30%, var(--gold) 50%, transparent 100%)",
            opacity: 0.12,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            Nationwide Coverage
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Development Finance
            <br />
            Across the{" "}
            <span className="gold-gradient-text italic">UK</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            From London to Edinburgh, Bristol to Newcastle - we arrange property
            development finance in every corner of the United Kingdom. Find your
            local area below.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="cta-shimmer h-14 bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
            >
              <Link href="/deal-room">
                Start Your Deal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <span className="text-sm text-white/40">
              or explore locations below
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

      {/* Regions with Counties */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section intro */}
          <div className="mb-16 max-w-2xl">
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
              Find Your Area
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Explore by Region
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Select your region to find development finance specialists in your
              area. We have relationships with local lenders and understand
              regional market conditions.
            </p>
          </div>

          {/* Regions */}
          <div className="space-y-20">
            {regions.map((region) => (
              <div key={region.name}>
                {/* Region header */}
                <div className="mb-8 flex items-center gap-4">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {region.name}
                  </h3>
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {region.counties.length} counties
                  </span>
                </div>

                {/* County cards grid */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {region.counties.map((county) => (
                    <CountyCard
                      key={county}
                      name={county}
                      slug={slugify(county)}
                      townCount={getTownCount(county)}
                      region={region.name}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Local Matters */}
      <section
        className="noise-overlay relative overflow-hidden py-20 sm:py-28"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.16 0.05 255) 0%, oklch(0.20 0.06 255) 50%, oklch(0.16 0.05 255) 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, oklch(0.75 0.12 85 / 0.06), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.3em] sm:text-sm"
              style={{ color: "var(--gold)" }}
            >
              Local Expertise
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why Local Knowledge Matters
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/50">
              Property development is inherently local. Planning authorities,
              land values, build costs, and buyer demand all vary by location.
              Our lender relationships span the entire UK, but we understand
              that your project needs a funder who knows your market.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                {
                  stat: "100+",
                  label: "Lenders Nationwide",
                },
                {
                  stat: "Every",
                  label: "UK Region Covered",
                },
                {
                  stat: "25+",
                  label: "Years Experience",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-6"
                  style={{
                    background: "oklch(1 0 0 / 0.04)",
                    border: "1px solid oklch(1 0 0 / 0.06)",
                  }}
                >
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "var(--gold)" }}
                  >
                    {item.stat}
                  </p>
                  <p className="mt-1 text-sm text-white/50">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <LocationCTA />
    </>
  );
}
