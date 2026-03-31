import type { Metadata } from "next";
import Link from "next/link";
import { Layers } from "lucide-react";

import { JsonLd } from "@/components/ui/json-ld";
import { MezzanineFinanceCalculator } from "@/components/calculators/mezzanine-finance-calculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SITE_NAME, SITE_URL, CONTACT } from "@/lib/constants";
import { getCalculatorBySlug } from "@/lib/calculators";

const calc = getCalculatorBySlug("mezzanine-finance")!;

export const metadata: Metadata = {
  title: calc.metaTitle,
  description: calc.metaDescription,
  alternates: {
    canonical: `${SITE_URL}/calculators/mezzanine-finance`,
  },
  openGraph: {
    title: calc.metaTitle,
    description: calc.metaDescription,
    url: `${SITE_URL}/calculators/mezzanine-finance`,
    type: "website",
  },
};

export default function MezzanineFinanceCalculatorPage() {
  const financialServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `${calc.name} — ${SITE_NAME}`,
    description: calc.metaDescription,
    url: `${SITE_URL}/calculators/mezzanine-finance`,
    provider: {
      "@type": "FinancialService",
      name: SITE_NAME,
      url: SITE_URL,
      telephone: CONTACT.phoneRaw,
      email: CONTACT.email,
      areaServed: { "@type": "Country", name: "United Kingdom" },
    },
    serviceType: "Mezzanine Finance",
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
                id="calc-grid"
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
            <rect width="100%" height="100%" fill="url(#calc-grid)" />
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
            <span className="text-white/70">Mezzanine Finance</span>
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
            <Layers className="h-6 w-6" style={{ color: "var(--gold)" }} />
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
          <MezzanineFinanceCalculator />
        </div>
      </section>

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
              Mezzanine Finance FAQ
            </h2>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {calc.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border-border"
                >
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ━━━ CROSS-LINKS ━━━ */}
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
              More Calculators
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/calculators/development-finance"
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/20 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-foreground group-hover:text-gold-dark transition-colors">
                Development Finance Calculator
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Calculate senior debt, equity, interest and profit for your
                development.
              </p>
            </Link>
            <Link
              href="/calculators/bridging-loans"
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/20 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-foreground group-hover:text-gold-dark transition-colors">
                Bridging Loan Calculator
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Calculate monthly interest, total cost and LTV for bridging
                finance.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
