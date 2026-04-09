import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { MARKET_REPORTS } from "@/lib/market-reports";
import { ReportsGrid } from "./reports-grid";

export const metadata: Metadata = {
  title: "UK Property Market Reports 2026",
  description:
    "Data-driven property market reports for every UK county and region. House prices, transaction volumes, new build analysis, and development finance insights.",
  alternates: {
    canonical: `${SITE_URL}/market-reports`,
  },
  openGraph: {
    title: `UK Property Market Reports 2026 | ${SITE_NAME}`,
    description:
      "In-depth property market analysis across 48 counties, 7 regions, and 5 thematic reports.",
    url: `${SITE_URL}/market-reports`,
    type: "website",
  },
};

export default function MarketReportsPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Market Reports",
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero */}
      <section className="hero-gradient noise-overlay relative overflow-hidden py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="mr-hero-grid"
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
            <rect width="100%" height="100%" fill="url(#mr-hero-grid)" />
          </svg>
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "800px",
            height: "600px",
            background:
              "radial-gradient(ellipse, oklch(0.75 0.12 85 / 0.08) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            Market Intelligence
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Property Market{" "}
            <span className="gold-gradient-text italic">Reports</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            Data-driven analysis of UK property markets. Real Land Registry data,
            town-by-town comparisons, and development finance insights for every
            county and region.
          </p>

          <p className="mt-3 text-sm text-white/40">
            {MARKET_REPORTS.length} reports covering{" "}
            {MARKET_REPORTS.filter((r) => r.category === "county").length} counties
            and{" "}
            {MARKET_REPORTS.filter((r) => r.category === "regional").length}{" "}
            regions
          </p>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--gold) 20%, var(--gold) 80%, transparent 100%)",
            opacity: 0.35,
          }}
        />
      </section>

      {/* Reports Grid */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ReportsGrid reports={MARKET_REPORTS} />
        </div>
      </section>

      {/* CTA */}
      <section
        className="noise-overlay relative overflow-hidden py-16 sm:py-20"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.08) 0%, oklch(0.75 0.12 85 / 0.04) 100%)",
        }}
      >
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <BarChart3
            className="mx-auto mb-4 h-10 w-10"
            style={{ color: "var(--gold)" }}
          />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to Develop?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Our reports provide the market intelligence. Our brokers source the
            funding. Tell us about your deal and we&apos;ll find the best terms
            from 100+ lenders.
          </p>
          <div className="mt-8">
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
          </div>
        </div>
      </section>
    </>
  );
}
