import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  GLOSSARY_TERMS,
  getTermBySlug,
  getTermsByLetter,
} from "@/lib/glossary";
import { SERVICES } from "@/lib/services";
import { GUIDES } from "@/lib/guides";

export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ term: string }>;
}

export async function generateStaticParams(): Promise<{ term: string }[]> {
  return GLOSSARY_TERMS.map((t) => ({ term: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { term: slug } = await params;
  const term = getTermBySlug(slug);

  if (!term) {
    return { title: "Term Not Found" };
  }

  const title = `${term.term}: Definition & Meaning | ${SITE_NAME}`;
  const description = term.definition.split(". ").slice(0, 2).join(". ") + ".";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/glossary/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/glossary/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { term: slug } = await params;
  const term = getTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const relatedTerms = term.relatedTerms
    .map((s) => getTermBySlug(s))
    .filter(Boolean);

  const relatedGuides = term.relatedGuides
    .map((s) => GUIDES.find((g) => g.slug === s || g.category === s))
    .filter(Boolean);

  const relatedServices = term.relatedServices
    .map((s) => SERVICES.find((svc) => svc.slug === s))
    .filter(Boolean);

  // Find neighbour terms for prev/next navigation
  const termsByLetter = getTermsByLetter();
  const allTermsSorted = Array.from(termsByLetter.values()).flat();
  const currentIndex = allTermsSorted.findIndex((t) => t.slug === slug);
  const prevTerm = currentIndex > 0 ? allTermsSorted[currentIndex - 1] : null;
  const nextTerm =
    currentIndex < allTermsSorted.length - 1
      ? allTermsSorted[currentIndex + 1]
      : null;

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
        item: `${SITE_URL}/glossary`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: term.term,
      },
    ],
  };

  const definedTermJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    url: `${SITE_URL}/glossary/${slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Property Development Finance Glossary",
      url: `${SITE_URL}/glossary`,
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={definedTermJsonLd} />

      {/* Hero Section */}
      <section
        className="noise-overlay relative overflow-hidden py-20 text-white sm:py-28"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.05 255) 0%, oklch(0.22 0.06 255) 50%, oklch(0.14 0.05 260) 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="term-hero-grid"
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
            <rect width="100%" height="100%" fill="url(#term-hero-grid)" />
          </svg>
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "800px",
            height: "600px",
            background:
              "radial-gradient(ellipse, oklch(0.75 0.12 85 / 0.06) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-white/40">
              <li>
                <Link href="/" className="hover:text-white/70">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/glossary" className="hover:text-white/70">
                  Glossary
                </Link>
              </li>
              <li>/</li>
              <li className="text-white/60">{term.term}</li>
            </ol>
          </nav>

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
            Glossary Definition
          </p>

          <h1 className="font-heading max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {term.term}
          </h1>

          {term.relatedServices.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {term.relatedServices.map((svc) => {
                const service = SERVICES.find((s) => s.slug === svc);
                return (
                  <span
                    key={svc}
                    className="rounded-full px-3 py-1 text-xs font-medium text-white/80"
                    style={{
                      background: "oklch(0.75 0.12 85 / 0.15)",
                      border: "1px solid oklch(0.75 0.12 85 / 0.2)",
                    }}
                  >
                    {service?.name ?? svc}
                  </span>
                );
              })}
            </div>
          )}
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

      {/* Definition */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div
              className="mb-4 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <h2 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
              Definition
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {term.definition}
            </p>
          </div>
        </div>
      </section>

      {/* Related Terms */}
      {relatedTerms.length > 0 && (
        <section className="bg-muted/30 py-12 sm:py-16">
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
                Related Terms
              </p>
              <h3 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
                See Also
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {relatedTerms.map((related) => (
                  <Link
                    key={related!.slug}
                    href={`/glossary/${related!.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-gold/30"
                  >
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-gold-dark">
                        {related!.term}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {related!.definition.split(". ")[0]}.
                      </p>
                    </div>
                    <ArrowRight className="ml-3 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <section className="bg-background py-12 sm:py-16">
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
                Further Reading
              </p>
              <h3 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
                Related Guides
              </h3>

              <div className="space-y-3">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide!.slug}
                    href={`/guides/${guide!.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30"
                  >
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-gold-dark">
                        {guide!.title}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {guide!.excerpt}
                      </p>
                    </div>
                    <ArrowRight className="ml-3 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="bg-muted/30 py-12 sm:py-16">
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
                Our Services
              </p>
              <h3 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
                Related Finance Products
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {relatedServices.map((service) => (
                  <Link
                    key={service!.slug}
                    href={`/services/${service!.slug}`}
                    className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30"
                  >
                    <h4 className="mb-1 font-bold text-foreground group-hover:text-gold-dark">
                      {service!.name}
                    </h4>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {service!.shortDesc}
                    </p>
                    <span className="text-xs font-bold text-gold-dark">
                      {service!.typicalRate} &middot; {service!.typicalLtv}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Prev / Next Navigation */}
      <section className="border-t border-border bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            {prevTerm ? (
              <Link
                href={`/glossary/${prevTerm.slug}`}
                className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>{prevTerm.term}</span>
              </Link>
            ) : (
              <div />
            )}
            <Link
              href="/glossary"
              className="text-sm font-medium text-gold-dark hover:underline"
            >
              All Terms
            </Link>
            {nextTerm ? (
              <Link
                href={`/glossary/${nextTerm.slug}`}
                className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <span>{nextTerm.term}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="noise-overlay relative overflow-hidden py-16 sm:py-20"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.16 0.05 255) 0%, oklch(0.20 0.06 255) 50%, oklch(0.16 0.05 255) 100%)",
        }}
      >
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <BookOpen
            className="mx-auto mb-4 h-10 w-10"
            style={{ color: "var(--gold)" }}
          />
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Ready to Apply?
          </h2>
          <p className="mt-3 text-white/50">
            Tell us about your project and we&apos;ll source the best terms from
            our panel of 100+ lenders. Indicative terms within 24 hours.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 border-white/20 px-8 text-base text-white hover:bg-white/10"
            >
              <Link href="/glossary">
                <ArrowLeft className="mr-2 h-5 w-5" />
                All Terms
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
