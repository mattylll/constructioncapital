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
import {
  CTAButton,
  EditorialSection,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
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

      {/* Calculators by category */}
      <EditorialSection tone="paper">
        {/* Category quick nav — editorial pill row */}
        <div
          className="mb-20 flex flex-wrap gap-2 border-y py-5"
          style={{ borderColor: "var(--stone-dark)" }}
        >
          {CALCULATOR_CATEGORIES.map((cat) => {
            const CatIcon = categoryIconMap[cat.icon] || Calculator;
            const count = getCalculatorsByCategory(cat.slug).length;
            return (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="group inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors"
                style={{
                  borderColor: "var(--stone-dark)",
                  color: "var(--navy-dark)",
                }}
              >
                <CatIcon className="h-3.5 w-3.5" style={{ color: "var(--gold-dark)" }} />
                {cat.label}
                <span
                  className="numeral-tabular"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  {String(count).padStart(2, "0")}
                </span>
              </a>
            );
          })}
        </div>

        <div className="space-y-24">
          {CALCULATOR_CATEGORIES.map((cat, idx) => {
            const calcs = getCalculatorsByCategory(cat.slug);
            return (
              <div key={cat.slug} id={cat.slug} className="scroll-mt-24">
                <div className="flex items-start gap-6">
                  <p
                    className="font-heading numeral-tabular shrink-0 text-[1.75rem] font-medium tracking-tight"
                    style={{ color: "var(--gold-dark)" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </p>
                  <div className="flex-1">
                    <p
                      className="text-[11px] font-medium uppercase tracking-[0.28em]"
                      style={{ color: "var(--gold-dark)" }}
                    >
                      Category
                    </p>
                    <h2
                      className="font-heading mt-2 text-[2rem] font-medium leading-[1.1] tracking-[-0.015em] sm:text-[2.25rem]"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {cat.label}
                    </h2>
                    <p
                      className="mt-3 max-w-2xl text-[16px] leading-[1.6]"
                      style={{ color: "oklch(0.35 0.04 255)" }}
                    >
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-10 grid gap-px border-y sm:grid-cols-2 lg:grid-cols-3"
                  style={{
                    borderColor: "var(--stone-dark)",
                    background: "var(--stone-dark)",
                  }}
                >
                  {calcs.map((calc) => {
                    const CalcIcon = iconMap[calc.icon] || Calculator;
                    return (
                      <Link
                        key={calc.slug}
                        href={`/calculators/${calc.slug}`}
                        className="group flex flex-col gap-4 px-7 py-7 transition-colors"
                        style={{ background: "var(--paper)" }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <CalcIcon
                            className="h-4 w-4"
                            style={{ color: "var(--gold-dark)" }}
                          />
                          <ArrowRight
                            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                            style={{ color: "var(--gold-dark)" }}
                          />
                        </div>
                        <h3
                          className="font-heading text-[20px] font-medium leading-[1.2] tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                          style={{ color: "var(--navy-dark)" }}
                        >
                          {calc.name}
                        </h3>
                        <p
                          className="flex-1 text-[14px] leading-[1.55]"
                          style={{ color: "oklch(0.35 0.04 255)" }}
                        >
                          {calc.shortDesc}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </EditorialSection>

      {/* CTA */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Want the precise answer?"
          title={
            <>
              Need a
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                bespoke appraisal?
              </span>
            </>
          }
          body="These calculators give indicative figures. For a precise capital stack and a real quote, submit your scheme for a partner-led review."
        />
        <div className="mt-12 flex flex-wrap items-center gap-5">
          <CTAButton href="/deal-room" variant="gold" size="lg">
            Enter the Deal Room
          </CTAButton>
          <a
            href={`tel:${CONTACT.phoneRaw}`}
            className="numeral-tabular editorial-link inline-flex h-14 items-center text-lg font-medium tracking-tight"
            style={{ color: "oklch(1 0 0 / 0.95)" }}
          >
            Or call {CONTACT.phone}
          </a>
        </div>
      </EditorialSection>
    </>
  );
}
