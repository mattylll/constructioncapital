import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { LenderGrid } from "@/components/lender-panel/lender-grid";
import { LENDERS, LENDER_TYPES } from "@/lib/lenders";
import { SERVICES } from "@/lib/services";
import { SITE_NAME, SITE_URL, CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Our Lender Panel | ${SITE_NAME}`,
  description:
    "Access to 100+ lenders across the UK development finance market. Senior debt, mezzanine, bridging, equity and commercial mortgage lenders - all vetted and relationship-managed.",
  alternates: {
    canonical: `${SITE_URL}/lender-panel`,
  },
  openGraph: {
    title: `Our Lender Panel | ${SITE_NAME}`,
    description:
      "Access to 100+ lenders across the UK development finance market. Senior debt, mezzanine, bridging, equity and commercial mortgage lenders.",
    url: `${SITE_URL}/lender-panel`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Our Lender Panel | ${SITE_NAME}`,
    description:
      "Access to 100+ lenders across the UK development finance market.",
  },
};

// Unique services across all lenders
const uniqueServices = [
  ...new Set(LENDERS.flatMap((l) => l.services)),
];
const serviceNames = uniqueServices
  .map((slug) => SERVICES.find((s) => s.slug === slug)?.name)
  .filter(Boolean);

export default function LenderPanelPage() {
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
        name: "Our Lender Panel",
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "UK Development Finance Lender Panel",
    description:
      "A curated panel of UK development finance lenders covering senior debt, mezzanine, bridging, equity and commercial mortgages.",
    numberOfItems: LENDERS.length,
    itemListElement: LENDERS.map((lender, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: lender.name,
      url: `${SITE_URL}/lender-panel/${lender.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />

      {/* ━━━ HERO ━━━ */}
      <section className="hero-gradient noise-overlay relative overflow-hidden text-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.05 255 / 0.95) 0%, oklch(0.22 0.06 255 / 0.90) 50%, oklch(0.14 0.05 260 / 0.95) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-white/40">
              <Link href="/" className="transition-colors hover:text-white/60">
                Home
              </Link>
              <span>/</span>
              <span className="text-white/70">Our Lender Panel</span>
            </nav>

            <div
              className="mb-4 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />

            <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Our Lender Panel
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
              Access to 100+ lenders across the UK development finance market.
              Every lender is relationship-managed, giving you direct access to
              credit committees and decision-makers.
            </p>

            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="cta-shimmer h-14 bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
              >
                <Link href="/deal-room">
                  Submit Your Deal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
            opacity: 0.3,
          }}
        />
      </section>

      {/* ━━━ STATS BAR ━━━ */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 py-6 sm:gap-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p
              className="text-2xl font-bold sm:text-3xl"
              style={{ color: "var(--gold-dark)" }}
            >
              {LENDERS.length}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Lenders Shown
            </p>
          </div>
          <div
            className="hidden h-8 w-px sm:block"
            style={{ background: "var(--border)" }}
          />
          <div className="text-center">
            <p
              className="text-2xl font-bold sm:text-3xl"
              style={{ color: "var(--gold-dark)" }}
            >
              {LENDER_TYPES.length}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Lender Types
            </p>
          </div>
          <div
            className="hidden h-8 w-px sm:block"
            style={{ background: "var(--border)" }}
          />
          <div className="text-center">
            <p
              className="text-2xl font-bold sm:text-3xl"
              style={{ color: "var(--gold-dark)" }}
            >
              {serviceNames.length}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Services Covered
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ LENDER GRID ━━━ */}
      <section className="bg-background py-16 sm:py-24">
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
              Browse Our Panel
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured Lenders
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              A selection of the lenders we work with regularly. Our full panel
              includes over 100 active lending relationships across every
              property finance product.
            </p>
          </div>

          <LenderGrid lenders={LENDERS} />
        </div>
      </section>

      {/* ━━━ LENDER TYPES ━━━ */}
      <section className="bg-muted/30 py-16 sm:py-24">
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
              Lender Categories
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Types of Lender We Work With
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LENDER_TYPES.map((type) => {
              const count = LENDERS.filter((l) => l.type === type.slug).length;
              return (
                <div
                  key={type.slug}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <h3 className="text-lg font-bold text-foreground">
                    {type.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {type.description}
                  </p>
                  <p
                    className="mt-3 text-sm font-semibold"
                    style={{ color: "var(--gold-dark)" }}
                  >
                    {count} lender{count !== 1 ? "s" : ""} on panel
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="bg-background py-16 sm:py-24">
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
              The Broker Advantage
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Why Use a Broker?
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "Wider Access",
                desc: "One application gives you access to 100+ lenders. We know which lenders are active, which have appetite, and which will move fastest for your scheme.",
              },
              {
                num: "02",
                title: "Better Terms",
                desc: "Lenders compete for your deal. We leverage our volume and relationships to negotiate preferential rates, fees, and covenant packages.",
              },
              {
                num: "03",
                title: "Speed",
                desc: "Direct relationships with credit committees mean faster decisions. We know exactly what each lender needs to see, eliminating back-and-forth.",
              },
              {
                num: "04",
                title: "Structuring",
                desc: "Complex deals need creative structures. We engineer capital stacks combining senior, mezzanine, and equity from multiple lenders.",
              },
            ].map((step) => (
              <div key={step.num}>
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                    border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                    color: "var(--gold-dark)",
                  }}
                >
                  {step.num}
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.70 0.14 80) 0%, oklch(0.78 0.12 88) 50%, oklch(0.72 0.13 82) 100%)",
          }}
        />
        <div className="noise-overlay absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "var(--navy-dark)" }}
          >
            Ready to Access
            <br />
            Our Lender Panel?
          </h2>
          <p
            className="mx-auto mt-5 max-w-xl text-lg"
            style={{ color: "var(--navy)", opacity: 0.6 }}
          >
            Submit your deal and we will match you with the best lenders for
            your project. Indicative terms within 24 hours.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-navy text-white hover:bg-navy-dark h-14 px-12 text-base font-bold shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <Link href="/deal-room">
                Enter the Deal Room
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 border-navy/20 px-10 text-base font-bold text-navy hover:bg-navy/5"
            >
              <Link href={`tel:${CONTACT.phoneRaw}`}>
                Call {CONTACT.phone}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
