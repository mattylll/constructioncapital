import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { GLOSSARY_TERMS, getTermsByLetter } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Property Development Finance Glossary",
  description:
    "A comprehensive glossary of UK property development finance terms. Clear definitions of LTV, LTGDV, GDV, mezzanine finance, bridging loans, S106, CIL, and 50+ other key terms.",
  alternates: {
    canonical: `${SITE_URL}/glossary`,
  },
  openGraph: {
    title: `Property Development Finance Glossary | ${SITE_NAME}`,
    description:
      "Clear definitions of 50+ UK property development finance terms. From arrangement fees to yields, understand every term in your loan offer.",
    url: `${SITE_URL}/glossary`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Property Development Finance Glossary | ${SITE_NAME}`,
    description:
      "Clear definitions of 50+ UK property development finance terms.",
  },
};

const SERVICE_LABELS: Record<string, string> = {
  "development-finance": "Development Finance",
  "mezzanine-finance": "Mezzanine Finance",
  "bridging-loans": "Bridging Loans",
  "equity-jv": "Equity & JV",
  "refurbishment-finance": "Refurbishment Finance",
  "commercial-mortgages": "Commercial Mortgages",
  "development-exit-finance": "Development Exit",
};

function firstSentence(text: string): string {
  const match = text.match(/^[^.]+\./);
  return match ? match[0] : text;
}

export default function GlossaryPage() {
  const termsByLetter = getTermsByLetter();
  const letters = Array.from(termsByLetter.keys()).sort();

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
        name: "Glossary",
      },
    ],
  };

  const definedTermSetJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Property Development Finance Glossary",
    description:
      "A comprehensive glossary of UK property development finance terminology.",
    url: `${SITE_URL}/glossary`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    hasDefinedTerm: GLOSSARY_TERMS.map((term) => ({
      "@type": "DefinedTerm",
      name: term.term,
      description: term.definition,
      url: `${SITE_URL}/glossary/${term.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={definedTermSetJsonLd} />

      {/* Hero Section */}
      <section className="hero-gradient noise-overlay relative overflow-hidden py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="glossary-hero-grid"
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
            <rect width="100%" height="100%" fill="url(#glossary-hero-grid)" />
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
            Reference
          </p>

          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Financial{" "}
            <span className="gold-gradient-text italic">Glossary</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            Clear, jargon-free definitions of every term you will encounter in
            property development finance. From arrangement fees to yields.
          </p>

          <p className="mt-3 text-sm text-white/40">
            {GLOSSARY_TERMS.length} terms across {letters.length} letters
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

      {/* Alphabet Navigation */}
      <section className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className="flex flex-wrap items-center gap-1 py-3"
            aria-label="Alphabet navigation"
          >
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
              const hasTerms = termsByLetter.has(letter);
              return hasTerms ? (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-colors hover:bg-gold/10 hover:text-gold-dark"
                >
                  {letter}
                </a>
              ) : (
                <span
                  key={letter}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-muted-foreground/30"
                >
                  {letter}
                </span>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Terms by Letter */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {letters.map((letter) => {
              const terms = termsByLetter.get(letter)!;
              return (
                <div key={letter} id={`letter-${letter}`}>
                  <div className="mb-6 flex items-center gap-4">
                    <span
                      className="font-heading flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.20 0.06 255), oklch(0.28 0.06 255))",
                      }}
                    >
                      {letter}
                    </span>
                    <div
                      className="h-[1px] flex-1"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--gold) 0%, transparent 100%)",
                        opacity: 0.25,
                      }}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {terms.map((term) => (
                      <Link
                        key={term.slug}
                        href={`/glossary/${term.slug}`}
                        className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30 hover:shadow-sm"
                      >
                        <h3 className="mb-2 font-bold text-foreground group-hover:text-gold-dark">
                          {term.term}
                        </h3>
                        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                          {firstSentence(term.definition)}
                        </p>
                        {term.relatedServices.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {term.relatedServices.slice(0, 3).map((svc) => (
                              <span
                                key={svc}
                                className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                                style={{
                                  background: "oklch(0.75 0.12 85 / 0.1)",
                                  color: "var(--gold-dark)",
                                }}
                              >
                                {SERVICE_LABELS[svc] ?? svc}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
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
          <BookOpen
            className="mx-auto mb-4 h-10 w-10"
            style={{ color: "var(--gold)" }}
          />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Need Help With Your Deal?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Understanding the terminology is the first step. The next is finding
            the right funding structure for your project. Tell us about your deal
            and we&apos;ll source the best terms from 100+ lenders.
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
