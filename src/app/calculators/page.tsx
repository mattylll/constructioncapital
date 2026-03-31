import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Clock, Layers, Calculator } from "lucide-react";

import { JsonLd } from "@/components/ui/json-ld";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { CALCULATORS } from "@/lib/calculators";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Clock,
  Layers,
};

export const metadata: Metadata = {
  title: `Property Finance Calculators | ${SITE_NAME}`,
  description:
    "Free property finance calculators for development finance, bridging loans and mezzanine finance. Estimate costs, interest, equity and profit for your project.",
  alternates: {
    canonical: `${SITE_URL}/calculators`,
  },
  openGraph: {
    title: `Property Finance Calculators | ${SITE_NAME}`,
    description:
      "Free property finance calculators for development finance, bridging loans and mezzanine finance.",
    url: `${SITE_URL}/calculators`,
    type: "website",
  },
};

export default function CalculatorsPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Calculators" },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      {/* ━━━ HERO ━━━ */}
      <section
        className="noise-overlay relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.05 255) 0%, oklch(0.22 0.06 255) 50%, oklch(0.18 0.05 260) 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="calc-index-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#calc-index-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-sm text-white/40">
            <Link href="/" className="transition-colors hover:text-white/60">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/70">Calculators</span>
          </nav>

          <div
            className="mb-6 h-[2px] w-20"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />

          <div
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
              border: "1px solid oklch(0.75 0.12 85 / 0.1)",
            }}
          >
            <Calculator className="h-6 w-6" style={{ color: "var(--gold)" }} />
          </div>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Property Finance Calculators
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/60">
            Model your deal before you apply. Our free calculators help you
            estimate costs, interest and profit across the main property
            finance products.
          </p>
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

      {/* ━━━ CALCULATOR CARDS ━━━ */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {CALCULATORS.map((calc) => {
              const Icon = iconMap[calc.icon] || Calculator;
              return (
                <Link
                  key={calc.slug}
                  href={`/calculators/${calc.slug}`}
                  className="group flex flex-col rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-gold/20 hover:shadow-lg"
                >
                  <div
                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                      border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                    }}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{ color: "var(--gold-dark)" }}
                    />
                  </div>

                  <h2 className="text-xl font-bold text-foreground group-hover:text-gold-dark transition-colors">
                    {calc.name}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {calc.shortDesc}
                  </p>

                  <div className="mt-6">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold"
                      style={{ color: "var(--gold-dark)" }}
                    >
                      Use Calculator
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="relative overflow-hidden py-20 sm:py-28">
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
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--navy-dark)" }}
          >
            Need a Bespoke Appraisal?
          </h2>
          <p
            className="mx-auto mt-5 max-w-xl text-lg"
            style={{ color: "var(--navy)", opacity: 0.6 }}
          >
            These calculators give indicative figures. For a precise structure
            tailored to your project, submit your deal for a free review.
          </p>
          <div className="mt-10">
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
          </div>
        </div>
      </section>
    </>
  );
}
