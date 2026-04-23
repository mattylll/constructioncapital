import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Clock,
  Layers,
  Calculator,
  ArrowLeftRight,
  TrendingUp,
  Receipt,
  BarChart3,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

import { JsonLd } from "@/components/ui/json-ld";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/editorial/primitives";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  CALCULATORS,
  CALCULATOR_CATEGORIES,
  getCalculatorsByCategory,
} from "@/lib/calculators";

const categoryIconMap: Record<string, React.ElementType> = {
  Building2,
  ArrowLeftRight,
  TrendingUp,
  Clock,
  Layers,
  Receipt,
  BarChart3,
};

export const metadata: Metadata = {
  title: `${CALCULATORS.length} Free Property Finance Calculators | ${SITE_NAME}`,
  description: `${CALCULATORS.length} free property finance calculators for development finance, bridging loans, conversions, investment returns, stamp duty and more. Model your deal before you apply.`,
  alternates: {
    canonical: `${SITE_URL}/calculators`,
  },
  openGraph: {
    title: `${CALCULATORS.length} Free Property Finance Calculators | ${SITE_NAME}`,
    description: `${CALCULATORS.length} free property finance calculators. Model costs, profit, yields and finance for any property project.`,
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

  const iconMap = LucideIcons as unknown as Record<string, React.ElementType>;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <PageHero
        tone="paper"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Calculators" },
        ]}
        eyebrow="Deal tools"
        title={
          <>
            Model the scheme
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              before you apply.
            </span>
          </>
        }
        deck={
          <>
            {CALCULATORS.length} calculators covering development, conversions,
            investment, bridging, mezzanine, costs and valuation. Built from
            the same assumptions we use when pricing live deals.
          </>
        }
        stats={[
          { label: "Calculators", value: CALCULATORS.length },
          { label: "Categories", value: CALCULATOR_CATEGORIES.length },
          { label: "Always free", value: "—" },
        ]}
      />

      {/* ━━━ CALCULATORS BY CATEGORY ━━━ */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Quick Nav */}
          <div className="mb-16 flex flex-wrap gap-3">
            {CALCULATOR_CATEGORIES.map((cat) => {
              const CatIcon = categoryIconMap[cat.icon] || Calculator;
              const count = getCalculatorsByCategory(cat.slug).length;
              
return (
                <a
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-all hover:border-gold/20 hover:bg-gold/5"
                >
                  <CatIcon
                    className="h-4 w-4"
                    style={{ color: "var(--gold-dark)" }}
                  />
                  {cat.label}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {count}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Categories */}
          <div className="space-y-20">
            {CALCULATOR_CATEGORIES.map((cat) => {
              const calcs = getCalculatorsByCategory(cat.slug);
              const CatIcon = categoryIconMap[cat.icon] || Calculator;

              return (
                <div key={cat.slug} id={cat.slug}>
                  <div className="mb-8 flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.12), oklch(0.75 0.12 85 / 0.04))",
                        border: "1px solid oklch(0.75 0.12 85 / 0.1)",
                      }}
                    >
                      <CatIcon
                        className="h-6 w-6"
                        style={{ color: "var(--gold-dark)" }}
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">
                        {cat.label}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {calcs.map((calc) => {
                      const CalcIcon = iconMap[calc.icon] || Calculator;
                      
return (
                        <Link
                          key={calc.slug}
                          href={`/calculators/${calc.slug}`}
                          className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/20 hover:shadow-lg"
                        >
                          <div
                            className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{
                              background:
                                "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.12), oklch(0.75 0.12 85 / 0.04))",
                              border: "1px solid oklch(0.75 0.12 85 / 0.1)",
                            }}
                          >
                            <CalcIcon
                              className="h-5 w-5"
                              style={{ color: "var(--gold-dark)" }}
                            />
                          </div>

                          <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-gold-dark">
                            {calc.name}
                          </h3>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                            {calc.shortDesc}
                          </p>

                          <div className="mt-4">
                            <span
                              className="inline-flex items-center text-sm font-semibold"
                              style={{ color: "var(--gold-dark)" }}
                            >
                              Use Calculator
                              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
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
