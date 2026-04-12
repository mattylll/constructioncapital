import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Calculator } from "lucide-react";
import * as LucideIcons from "lucide-react";

import { JsonLd } from "@/components/ui/json-ld";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL, CONTACT } from "@/lib/constants";
import { CALCULATORS, getCalculatorBySlug } from "@/lib/calculators";
import type { CalculatorContent } from "@/lib/calculator-content/types";
import { notFound } from "next/navigation";

// Map of calculator slugs to their component imports
const calculatorComponents: Record<
  string,
  ReturnType<typeof dynamic>
> = {
  "development-finance": dynamic(() =>
    import("@/components/calculators/development-finance-calculator").then(
      (m) => m.DevelopmentFinanceCalculator
    )
  ),
  "bridging-loans": dynamic(() =>
    import("@/components/calculators/bridging-loan-calculator").then(
      (m) => m.BridgingLoanCalculator
    )
  ),
  "mezzanine-finance": dynamic(() =>
    import("@/components/calculators/mezzanine-finance-calculator").then(
      (m) => m.MezzanineFinanceCalculator
    )
  ),
  "stamp-duty-sdlt": dynamic(() =>
    import("@/components/calculators/stamp-duty-calculator").then(
      (m) => m.StampDutyCalculator
    )
  ),
  "rental-yield": dynamic(() =>
    import("@/components/calculators/rental-yield-calculator").then(
      (m) => m.RentalYieldCalculator
    )
  ),
  "gdv-calculator": dynamic(() =>
    import("@/components/calculators/gdv-calculator").then(
      (m) => m.GdvCalculator
    )
  ),
  "office-to-residential": dynamic(() =>
    import("@/components/calculators/office-to-resi-calculator").then(
      (m) => m.OfficeToResiCalculator
    )
  ),
  "build-cost-estimator": dynamic(() =>
    import("@/components/calculators/build-cost-estimator").then(
      (m) => m.BuildCostEstimator
    )
  ),
  "residual-land-value": dynamic(() =>
    import("@/components/calculators/residual-land-value-calculator").then(
      (m) => m.ResidualLandValueCalculator
    )
  ),
  "permitted-development": dynamic(() =>
    import("@/components/calculators/permitted-development-calculator").then(
      (m) => m.PermittedDevelopmentCalculator
    )
  ),
  "buy-to-let-mortgage": dynamic(() =>
    import("@/components/calculators/btl-mortgage-calculator").then(
      (m) => m.BtlMortgageCalculator
    )
  ),
  "development-appraisal": dynamic(() =>
    import("@/components/calculators/development-appraisal-calculator").then(
      (m) => m.DevelopmentAppraisalCalculator
    )
  ),
  "refurbishment-finance": dynamic(() =>
    import("@/components/calculators/refurbishment-finance-calculator").then(
      (m) => m.RefurbishmentFinanceCalculator
    )
  ),
  "development-profit": dynamic(() =>
    import("@/components/calculators/development-profit-calculator").then(
      (m) => m.DevelopmentProfitCalculator
    )
  ),
  "section-106-cil": dynamic(() =>
    import("@/components/calculators/section-106-cil-calculator").then(
      (m) => m.Section106CilCalculator
    )
  ),
  "construction-timeline": dynamic(() =>
    import("@/components/calculators/construction-timeline-calculator").then(
      (m) => m.ConstructionTimelineCalculator
    )
  ),
  "commercial-to-residential": dynamic(() =>
    import("@/components/calculators/commercial-to-resi-calculator").then(
      (m) => m.CommercialToResiCalculator
    )
  ),
  "barn-conversion": dynamic(() =>
    import("@/components/calculators/barn-conversion-calculator").then(
      (m) => m.BarnConversionCalculator
    )
  ),
  "hmo-conversion": dynamic(() =>
    import("@/components/calculators/hmo-conversion-calculator").then(
      (m) => m.HmoConversionCalculator
    )
  ),
  "church-conversion": dynamic(() =>
    import("@/components/calculators/church-conversion-calculator").then(
      (m) => m.ChurchConversionCalculator
    )
  ),
  "roi-calculator": dynamic(() =>
    import("@/components/calculators/roi-calculator").then(
      (m) => m.RoiCalculator
    )
  ),
  "portfolio-leverage": dynamic(() =>
    import("@/components/calculators/portfolio-leverage-calculator").then(
      (m) => m.PortfolioLeverageCalculator
    )
  ),
  "cash-on-cash-return": dynamic(() =>
    import("@/components/calculators/cash-on-cash-calculator").then(
      (m) => m.CashOnCashCalculator
    )
  ),
  "auction-finance": dynamic(() =>
    import("@/components/calculators/auction-finance-calculator").then(
      (m) => m.AuctionFinanceCalculator
    )
  ),
  "development-exit": dynamic(() =>
    import("@/components/calculators/development-exit-calculator").then(
      (m) => m.DevelopmentExitCalculator
    )
  ),
  "chain-break": dynamic(() =>
    import("@/components/calculators/chain-break-calculator").then(
      (m) => m.ChainBreakCalculator
    )
  ),
  "equity-required": dynamic(() =>
    import("@/components/calculators/equity-required-calculator").then(
      (m) => m.EquityRequiredCalculator
    )
  ),
  "profit-share-jv": dynamic(() =>
    import("@/components/calculators/profit-share-jv-calculator").then(
      (m) => m.ProfitShareJvCalculator
    )
  ),
  "blended-finance-cost": dynamic(() =>
    import("@/components/calculators/blended-finance-calculator").then(
      (m) => m.BlendedFinanceCalculator
    )
  ),
  "arrangement-fees": dynamic(() =>
    import("@/components/calculators/arrangement-fee-calculator").then(
      (m) => m.ArrangementFeeCalculator
    )
  ),
  "legal-costs": dynamic(() =>
    import("@/components/calculators/legal-costs-calculator").then(
      (m) => m.LegalCostsCalculator
    )
  ),
  "vat-construction": dynamic(() =>
    import("@/components/calculators/vat-construction-calculator").then(
      (m) => m.VatConstructionCalculator
    )
  ),
  "professional-fees": dynamic(() =>
    import("@/components/calculators/professional-fees-calculator").then(
      (m) => m.ProfessionalFeesCalculator
    )
  ),
};

// Map of calculator slugs to their content imports
const contentModules: Record<string, () => Promise<{ content: CalculatorContent }>> = {
  "development-finance": () => import("@/lib/calculator-content/development-finance"),
  "development-profit": () => import("@/lib/calculator-content/development-profit"),
  "build-cost-estimator": () => import("@/lib/calculator-content/build-cost-estimator"),
  "development-appraisal": () => import("@/lib/calculator-content/development-appraisal"),
  "section-106-cil": () => import("@/lib/calculator-content/section-106-cil"),
  "construction-timeline": () => import("@/lib/calculator-content/construction-timeline"),
  "permitted-development": () => import("@/lib/calculator-content/permitted-development"),
  "office-to-residential": () => import("@/lib/calculator-content/office-to-residential"),
  "commercial-to-residential": () => import("@/lib/calculator-content/commercial-to-residential"),
  "barn-conversion": () => import("@/lib/calculator-content/barn-conversion"),
  "hmo-conversion": () => import("@/lib/calculator-content/hmo-conversion"),
  "church-conversion": () => import("@/lib/calculator-content/church-conversion"),
  "rental-yield": () => import("@/lib/calculator-content/rental-yield"),
  "roi-calculator": () => import("@/lib/calculator-content/roi-calculator"),
  "buy-to-let-mortgage": () => import("@/lib/calculator-content/buy-to-let-mortgage"),
  "portfolio-leverage": () => import("@/lib/calculator-content/portfolio-leverage"),
  "cash-on-cash-return": () => import("@/lib/calculator-content/cash-on-cash-return"),
  "bridging-loans": () => import("@/lib/calculator-content/bridging-loans"),
  "auction-finance": () => import("@/lib/calculator-content/auction-finance"),
  "refurbishment-finance": () => import("@/lib/calculator-content/refurbishment-finance"),
  "development-exit": () => import("@/lib/calculator-content/development-exit"),
  "chain-break": () => import("@/lib/calculator-content/chain-break"),
  "mezzanine-finance": () => import("@/lib/calculator-content/mezzanine-finance"),
  "equity-required": () => import("@/lib/calculator-content/equity-required"),
  "profit-share-jv": () => import("@/lib/calculator-content/profit-share-jv"),
  "blended-finance-cost": () => import("@/lib/calculator-content/blended-finance-cost"),
  "stamp-duty-sdlt": () => import("@/lib/calculator-content/stamp-duty-sdlt"),
  "arrangement-fees": () => import("@/lib/calculator-content/arrangement-fees"),
  "legal-costs": () => import("@/lib/calculator-content/legal-costs"),
  "vat-construction": () => import("@/lib/calculator-content/vat-construction"),
  "professional-fees": () => import("@/lib/calculator-content/professional-fees"),
  "gdv-calculator": () => import("@/lib/calculator-content/gdv-calculator"),
  "residual-land-value": () => import("@/lib/calculator-content/residual-land-value"),
};

export function generateStaticParams() {
  return CALCULATORS.map((calc) => ({ slug: calc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  if (!calc) return {};

  return {
    title: calc.metaTitle,
    description: calc.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/calculators/${calc.slug}`,
    },
    openGraph: {
      title: calc.metaTitle,
      description: calc.metaDescription,
      url: `${SITE_URL}/calculators/${calc.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: calc.metaTitle,
      description: calc.metaDescription,
    },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  if (!calc) notFound();

  const CalculatorComponent = calculatorComponents[slug];
  const iconMap = LucideIcons as unknown as Record<string, React.ElementType>;
  const Icon = iconMap[calc.icon] || Calculator;

  // Load SEO content if available
  let seoContent: CalculatorContent | null = null;
  try {
    if (contentModules[slug]) {
      const mod = await contentModules[slug]();
      seoContent = mod.content;
    }
  } catch {
    // Content not yet written - render page without it
  }

  const relatedCalcs = calc.relatedCalculators
    .map((s) => getCalculatorBySlug(s))
    .filter(Boolean);

  const financialServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `${calc.name} - ${SITE_NAME}`,
    description: calc.metaDescription,
    url: `${SITE_URL}/calculators/${calc.slug}`,
    provider: {
      "@type": "FinancialService",
      name: SITE_NAME,
      url: SITE_URL,
      telephone: CONTACT.phoneRaw,
      email: CONTACT.email,
      areaServed: { "@type": "Country", name: "United Kingdom" },
    },
    serviceType: calc.dealRoomLoanType,
    areaServed: { "@type": "Country", name: "United Kingdom" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: calc.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculators",
        item: `${SITE_URL}/calculators`,
      },
      { "@type": "ListItem", position: 3, name: calc.name },
    ],
  };

  return (
    <>
      <JsonLd data={financialServiceJsonLd} />
      <JsonLd data={faqJsonLd} />
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
                id={`calc-grid-${slug}`}
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
            <rect
              width="100%"
              height="100%"
              fill={`url(#calc-grid-${slug})`}
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-sm text-white/40">
            <Link href="/" className="transition-colors hover:text-white/60">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/calculators"
              className="transition-colors hover:text-white/60"
            >
              Calculators
            </Link>
            <span>/</span>
            <span className="text-white/70">{calc.name.replace(" Calculator", "")}</span>
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
            <Icon className="h-6 w-6" style={{ color: "var(--gold)" }} />
          </div>

          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {calc.h1}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/60">
            {calc.heroSubtitle}
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

      {/* ━━━ CALCULATOR ━━━ */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {CalculatorComponent ? (
            <CalculatorComponent />
          ) : (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <Calculator className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-bold">Coming Soon</h2>
              <p className="mt-2 text-muted-foreground">
                This calculator is under development. In the meantime, submit
                your deal for a bespoke appraisal.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 bg-gold text-navy-dark hover:bg-gold-dark"
              >
                <Link href="/deal-room">
                  Enter the Deal Room
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      {seoContent?.howItWorks && (
        <section className="bg-muted/30 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div
                className="mb-5 h-[2px] w-14"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gold), var(--gold-light))",
                }}
              />
              <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
                {seoContent.howItWorks.title}
              </h2>
              <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
                {seoContent.howItWorks.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ━━━ EXPERT GUIDE ━━━ */}
      {seoContent?.guide && (
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
              <p
                className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
                style={{ color: "var(--gold-dark)" }}
              >
                Expert Guide
              </p>
              <h2 className="mb-12 text-2xl font-bold tracking-tight sm:text-3xl">
                {seoContent.guide.title}
              </h2>

              <div className="space-y-12">
                {seoContent.guide.sections.map((section, i) => (
                  <div key={i}>
                    <h3 className="mb-4 text-xl font-bold tracking-tight">
                      {section.heading}
                    </h3>
                    <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                      {section.paragraphs.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="mt-4 space-y-2 text-base text-muted-foreground">
                        {section.bullets.map((bullet, k) => (
                          <li key={k} className="flex items-start gap-3">
                            <span
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ background: "var(--gold)" }}
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ━━━ FAQ ━━━ */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
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
              {calc.name.replace(" Calculator", "")} FAQ
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-0">
            {calc.faqs.map((faq, index) => (
              <details key={index} className="group border-b border-border">
                <summary className="flex cursor-pointer items-center justify-between py-4 text-left text-base font-semibold transition-colors hover:text-foreground/80 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <svg
                    className="ml-2 h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <div className="pb-4 text-muted-foreground">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ RELATED CALCULATORS ━━━ */}
      {relatedCalcs.length > 0 && (
        <section className="bg-background py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div
                className="mb-5 h-[2px] w-14"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gold), var(--gold-light))",
                }}
              />
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Related Calculators
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCalcs.map((related) => {
                if (!related) return null;
                const RelatedIcon = iconMap[related.icon] || Calculator;
                return (
                  <Link
                    key={related.slug}
                    href={`/calculators/${related.slug}`}
                    className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/20 hover:shadow-md"
                  >
                    <div
                      className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.12), oklch(0.75 0.12 85 / 0.04))",
                        border: "1px solid oklch(0.75 0.12 85 / 0.1)",
                      }}
                    >
                      <RelatedIcon
                        className="h-5 w-5"
                        style={{ color: "var(--gold-dark)" }}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-gold-dark">
                      {related.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {related.shortDesc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
            This calculator gives indicative figures. For a precise structure
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
