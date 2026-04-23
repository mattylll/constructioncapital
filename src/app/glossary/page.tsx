import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  CTAButton,
  EditorialSection,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
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
      "Clear definitions of 50+ UK property development finance terms.",
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
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Glossary" },
    ],
  };

  const definedTermSetJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Property Development Finance Glossary",
    description:
      "A comprehensive glossary of UK property development finance terminology.",
    url: `${SITE_URL}/glossary`,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
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

      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Glossary" }]}
        eyebrow="Reference"
        title={
          <>
            Every term you&rsquo;ll meet,
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              defined plainly.
            </span>
          </>
        }
        deck={
          <>
            Development finance uses its own vocabulary &mdash; LTGDV, WAULT,
            CIL, preferred equity, monitoring surveyor. This is the plain-
            English definition of every term you&rsquo;ll see on a term
            sheet or valuation report.
          </>
        }
        stats={[
          { label: "Terms defined", value: GLOSSARY_TERMS.length },
          { label: "Letters in use", value: letters.length },
          { label: "Jargon allowed", value: "None" },
        ]}
      />

      {/* Alphabet nav — sticky band */}
      <section
        className="sticky top-16 z-30 border-y backdrop-blur-sm"
        style={{
          borderColor: "var(--stone-dark)",
          background: "oklch(0.985 0.002 250 / 0.9)",
        }}
      >
        <div className="mx-auto max-w-[1360px] px-6 sm:px-10">
          <nav
            className="flex flex-wrap items-center gap-1 py-3"
            aria-label="Alphabet navigation"
          >
            <p
              className="mr-4 text-[10px] font-medium uppercase tracking-[0.28em]"
              style={{ color: "oklch(0.50 0.02 255)" }}
            >
              Jump to
            </p>
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
              const hasTerms = termsByLetter.has(letter);
              return hasTerms ? (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="font-heading flex h-8 w-8 items-center justify-center text-[15px] font-medium transition-colors hover:bg-[oklch(0.75_0.12_85/0.08)]"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {letter}
                </a>
              ) : (
                <span
                  key={letter}
                  aria-hidden
                  className="font-heading flex h-8 w-8 items-center justify-center text-[15px]"
                  style={{ color: "oklch(0.80 0.01 250)" }}
                >
                  {letter}
                </span>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Terms by Letter */}
      <EditorialSection tone="paper">
        <div className="space-y-16">
          {letters.map((letter) => {
            const terms = termsByLetter.get(letter)!;
            return (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-28">
                <div className="mb-8 flex items-baseline gap-6">
                  <p
                    className="font-heading numeral-tabular text-5xl font-medium leading-none tracking-tight sm:text-6xl"
                    style={{ color: "var(--gold-dark)" }}
                  >
                    {letter}
                  </p>
                  <span
                    aria-hidden
                    className="h-px flex-1"
                    style={{ background: "var(--stone-dark)" }}
                  />
                  <span
                    className="text-[11px] font-medium uppercase tracking-[0.24em]"
                    style={{ color: "oklch(0.50 0.02 255)" }}
                  >
                    {terms.length} {terms.length === 1 ? "term" : "terms"}
                  </span>
                </div>

                <ul
                  className="grid grid-cols-1 gap-px border-y sm:grid-cols-2 lg:grid-cols-3"
                  style={{
                    borderColor: "var(--stone-dark)",
                    backgroundColor: "var(--stone-dark)",
                  }}
                >
                  {terms.map((term) => (
                    <li key={term.slug}>
                      <Link
                        href={`/glossary/${term.slug}`}
                        className="group relative flex h-full flex-col gap-3 p-6"
                        style={{ background: "var(--paper)" }}
                      >
                        <h3
                          className="font-heading pr-6 text-lg font-medium leading-tight tracking-tight"
                          style={{ color: "var(--navy-dark)" }}
                        >
                          {term.term}
                        </h3>
                        <p
                          className="text-[14px] leading-[1.55]"
                          style={{ color: "oklch(0.42 0.03 255)" }}
                        >
                          {firstSentence(term.definition)}
                        </p>
                        {term.relatedServices.length > 0 && (
                          <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-2">
                            {term.relatedServices.slice(0, 3).map((svc) => (
                              <span
                                key={svc}
                                className="text-[10px] font-medium uppercase tracking-[0.22em]"
                                style={{ color: "var(--gold-dark)" }}
                              >
                                {SERVICE_LABELS[svc] ?? svc}
                              </span>
                            ))}
                          </div>
                        )}
                        <ArrowUpRight
                          className="absolute right-4 top-4 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          style={{ color: "var(--gold-dark)" }}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </EditorialSection>

      {/* CTA */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="From language to leverage"
          title={
            <>
              Understanding the terms is the start.
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                Getting the right ones on your term sheet is our job.
              </span>
            </>
          }
          body="Knowing LTGDV from LTC matters. Knowing which lenders will stretch them matters more. Send us the outline and we come back with indicative pricing inside a working day."
        />
        <div className="mt-12 flex flex-wrap items-center gap-5">
          <CTAButton href="/deal-room" variant="gold" size="lg">
            Start a deal
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
