import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Calculator } from "lucide-react";
import * as LucideIcons from "lucide-react";

import { JsonLd } from "@/components/ui/json-ld";
import { Button } from "@/components/ui/button";
import {
  CTAButton,
  EditorialSection,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
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

      <PageHero
        tone="paper"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: calc.name.replace(" Calculator", "") },
        ]}
        eyebrow={calc.category.charAt(0).toUpperCase() + calc.category.slice(1).replace("-", " ")}
        title={calc.h1}
        deck={calc.heroSubtitle}
      />

      {/* Calculator */}
      <EditorialSection tone="paper">
        {CalculatorComponent ? (
          <CalculatorComponent />
        ) : (
          <div
            className="border p-12 text-center"
            style={{ borderColor: "var(--stone-dark)", background: "var(--stone)" }}
          >
            <Calculator
              className="mx-auto h-10 w-10"
              style={{ color: "var(--gold-dark)" }}
            />
            <h2
              className="font-heading mt-6 text-[1.75rem] font-medium leading-tight tracking-tight"
              style={{ color: "var(--navy-dark)" }}
            >
              Coming soon
            </h2>
            <p
              className="mx-auto mt-3 max-w-lg text-[16px] leading-[1.6]"
              style={{ color: "oklch(0.35 0.04 255)" }}
            >
              This calculator is under development. In the meantime, submit
              your deal for a bespoke appraisal.
            </p>
            <div className="mt-8 flex justify-center">
              <CTAButton href="/deal-room" variant="navy">
                Enter the Deal Room
              </CTAButton>
            </div>
          </div>
        )}
      </EditorialSection>

      {/* How it works */}
      {seoContent?.howItWorks && (
        <EditorialSection tone="stone">
          <div className="mx-auto max-w-3xl">
            <SectionHeader
              tone="stone"
              align="stacked"
              eyebrow="How it works"
              title={seoContent.howItWorks.title}
            />
            <div
              className="mt-10 space-y-5 text-[17px] leading-[1.7]"
              style={{ color: "oklch(0.32 0.04 255)" }}
            >
              {seoContent.howItWorks.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </EditorialSection>
      )}

      {/* Expert guide */}
      {seoContent?.guide && (
        <EditorialSection tone="paper">
          <div className="mx-auto max-w-3xl">
            <SectionHeader
              tone="paper"
              align="stacked"
              eyebrow="Expert guide"
              title={seoContent.guide.title}
            />

            <div className="mt-14 space-y-14">
              {seoContent.guide.sections.map((section, i) => (
                <div key={i}>
                  <h3
                    className="font-heading mb-5 text-[1.5rem] font-medium leading-[1.15] tracking-tight"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {section.heading}
                  </h3>
                  <div
                    className="space-y-4 text-[17px] leading-[1.7]"
                    style={{ color: "oklch(0.32 0.04 255)" }}
                  >
                    {section.paragraphs.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {section.bullets.map((bullet, k) => (
                        <li key={k} className="flex items-start gap-3 text-[17px] leading-[1.65]" style={{ color: "oklch(0.32 0.04 255)" }}>
                          <span
                            aria-hidden
                            className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full"
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
        </EditorialSection>
      )}

      {/* FAQ */}
      <EditorialSection tone="stone">
        <SectionHeader
          tone="stone"
          eyebrow="Common questions"
          title={
            <>
              {calc.name.replace(" Calculator", "")}
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                — answered.
              </span>
            </>
          }
        />
        <div className="mt-16 mx-auto max-w-3xl space-y-3">
          {calc.faqs.map((faq, index) => (
            <details
              key={index}
              className="group border-b"
              style={{ borderColor: "var(--stone-dark)" }}
            >
              <summary
                className="flex cursor-pointer items-center justify-between py-5 font-heading text-[18px] font-medium leading-snug tracking-tight [&::-webkit-details-marker]:hidden"
                style={{ color: "var(--navy-dark)" }}
              >
                {faq.question}
                <svg
                  className="ml-3 h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                  style={{ color: "var(--gold-dark)" }}
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
              <p
                className="pb-6 text-[16px] leading-[1.65]"
                style={{ color: "oklch(0.35 0.04 255)" }}
              >
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </EditorialSection>

      {/* Related calculators */}
      {relatedCalcs.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="More tools"
            title={
              <>
                Related
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  calculators.
                </span>
              </>
            }
          />
          <div
            className="mt-16 grid gap-px border-y sm:grid-cols-2 lg:grid-cols-3"
            style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
          >
            {relatedCalcs.map((related) => {
              if (!related) return null;
              const RelatedIcon = iconMap[related.icon] || Calculator;
              return (
                <Link
                  key={related.slug}
                  href={`/calculators/${related.slug}`}
                  className="group flex flex-col gap-4 px-7 py-8 transition-colors"
                  style={{ background: "var(--paper)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <RelatedIcon
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
                    {related.name}
                  </h3>
                  <p
                    className="flex-1 text-[14px] leading-[1.55]"
                    style={{ color: "oklch(0.35 0.04 255)" }}
                  >
                    {related.shortDesc}
                  </p>
                </Link>
              );
            })}
          </div>
        </EditorialSection>
      )}

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
          body="This calculator gives indicative figures. For a precise structure tailored to your project, submit your deal for a partner-led review."
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
