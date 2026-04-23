import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import {
  CTAButton,
  EditorialSection,
  PageHero,
  RelatedGrid,
  SectionHeader,
} from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
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
  if (!term) return { title: "Term Not Found" };

  const title = `${term.term}: Definition & Meaning | ${SITE_NAME}`;
  const description =
    term.definition.split(". ").slice(0, 2).join(". ") + ".";

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/glossary/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/glossary/${slug}`,
      type: "article",
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { term: slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) notFound();

  const relatedTerms = term.relatedTerms
    .map((s) => getTermBySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getTermBySlug>>[];

  const relatedGuides = term.relatedGuides
    .map((s) => GUIDES.find((g) => g.slug === s || g.category === s))
    .filter(Boolean) as NonNullable<(typeof GUIDES)[number]>[];

  const relatedServices = term.relatedServices
    .map((s) => SERVICES.find((svc) => svc.slug === s))
    .filter(Boolean) as NonNullable<(typeof SERVICES)[number]>[];

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
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Glossary",
        item: `${SITE_URL}/glossary`,
      },
      { "@type": "ListItem", position: 3, name: term.term },
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

      <PageHero
        tone="paper"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Glossary", href: "/glossary" },
          { label: term.term },
        ]}
        eyebrow="Glossary definition"
        title={term.term}
        deck={term.definition.split(". ").slice(0, 2).join(". ") + "."}
      />

      {/* Full definition — editorial prose */}
      <EditorialSection tone="paper">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.3em]"
              style={{ color: "oklch(0.50 0.02 255)" }}
            >
              Definition
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p
              className="text-[19px] leading-[1.7]"
              style={{ color: "oklch(0.28 0.04 255)" }}
            >
              {term.definition}
            </p>
            {term.relatedServices.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t pt-6"
                   style={{ borderColor: "var(--stone-dark)" }}>
                <span
                  className="text-[10px] font-medium uppercase tracking-[0.28em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  Appears in
                </span>
                {term.relatedServices.map((svc) => {
                  const service = SERVICES.find((s) => s.slug === svc);
                  return (
                    <Link
                      key={svc}
                      href={`/services/${svc}`}
                      className="editorial-link text-[13px]"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {service?.name ?? svc}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </EditorialSection>

      {/* Related terms */}
      {relatedTerms.length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="See also"
            title="Closely related terms."
          />
          <ul
            className="mt-12 grid grid-cols-1 gap-px border-y sm:grid-cols-2"
            style={{
              borderColor: "var(--stone-dark)",
              backgroundColor: "var(--stone-dark)",
            }}
          >
            {relatedTerms.map((related) => (
              <li key={related.slug}>
                <Link
                  href={`/glossary/${related.slug}`}
                  className="group flex h-full flex-col gap-2 p-6"
                  style={{ background: "var(--stone)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className="font-heading text-lg font-medium leading-tight tracking-tight"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {related.term}
                    </h3>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: "var(--gold-dark)" }}
                    />
                  </div>
                  <p
                    className="text-[14px] leading-[1.55]"
                    style={{ color: "oklch(0.42 0.03 255)" }}
                  >
                    {related.definition.split(". ")[0]}.
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </EditorialSection>
      )}

      {/* Related guides */}
      {relatedGuides.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="Further reading"
            title="Guides that touch this term."
          />
          <div className="mt-12">
            <RelatedGrid
              tone="paper"
              items={relatedGuides.map((guide) => ({
                href: `/guides/${guide.slug}`,
                eyebrow: "Guide",
                title: guide.title,
                body: guide.excerpt,
                meta: `${guide.readingTime} read`,
              }))}
            />
          </div>
        </EditorialSection>
      )}

      {/* Related services */}
      {relatedServices.length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="Where it shows up"
            title="Finance products using this term."
          />
          <div className="mt-12">
            <RelatedGrid
              tone="stone"
              items={relatedServices.map((service) => ({
                href: `/services/${service.slug}`,
                eyebrow: "Service",
                title: service.name,
                body: service.shortDesc,
                meta: `${service.typicalRate} · ${service.typicalLtv}`,
              }))}
            />
          </div>
        </EditorialSection>
      )}

      {/* Prev / Next */}
      <section
        className="border-y"
        style={{
          borderColor: "var(--stone-dark)",
          background: "var(--paper)",
        }}
      >
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-6 py-6 sm:px-10">
          {prevTerm ? (
            <Link
              href={`/glossary/${prevTerm.slug}`}
              className="group flex items-center gap-3 text-sm"
              style={{ color: "oklch(0.35 0.04 255)" }}
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                style={{ color: "var(--gold-dark)" }}
              />
              <span>
                <span
                  className="block text-[10px] font-medium uppercase tracking-[0.26em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  Previous
                </span>
                <span
                  className="font-heading text-base"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {prevTerm.term}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/glossary"
            className="editorial-link text-[12px] font-medium uppercase tracking-[0.22em]"
            style={{ color: "var(--navy-dark)" }}
          >
            All terms
          </Link>
          {nextTerm ? (
            <Link
              href={`/glossary/${nextTerm.slug}`}
              className="group flex items-center gap-3 text-right text-sm"
              style={{ color: "oklch(0.35 0.04 255)" }}
            >
              <span>
                <span
                  className="block text-[10px] font-medium uppercase tracking-[0.26em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  Next
                </span>
                <span
                  className="font-heading text-base"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {nextTerm.term}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                style={{ color: "var(--gold-dark)" }}
              />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </section>

      {/* CTA */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Ready to apply"
          title={
            <>
              Knowing the term is one thing.
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                Getting it on your term sheet is ours.
              </span>
            </>
          }
          body="Send us the outline. We come back with indicative pricing from the right lenders inside a working day."
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
