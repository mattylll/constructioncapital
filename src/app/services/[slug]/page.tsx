import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CTAButton,
  EditorialSection,
  Eyebrow,
  PageHero,
  ProseSection,
  RelatedGrid,
  SectionHeader,
} from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { SERVICES, type Service } from "@/lib/services";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
import { SERVICE_POPULAR_LOCATIONS } from "@/lib/location-content";
import { SERVICE_PAGE_CONTENT } from "@/lib/service-page-content";
import { getGuidesByService } from "@/lib/guides";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function findService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = SERVICE_PAGE_CONTENT[slug];
  if (!content) return {};

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/services/${slug}`,
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: `${SITE_URL}/services/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = findService(slug);
  const content = SERVICE_PAGE_CONTENT[slug];

  if (!service || !content) {
    notFound();
  }

  const relatedServices = content.relatedSlugs
    .map((s) => SERVICES.find((svc) => svc.slug === s))
    .filter(Boolean) as Service[];
  const popularLocations = SERVICE_POPULAR_LOCATIONS[slug] ?? [];
  const relatedGuides = getGuidesByService(slug);

  // JSON-LD: FinancialService
  const financialServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `${service.name} - ${SITE_NAME}`,
    description: content.metaDescription,
    url: `${SITE_URL}/services/${slug}`,
    provider: {
      "@type": "FinancialService",
      name: SITE_NAME,
      url: SITE_URL,
      telephone: CONTACT.phoneRaw,
      email: CONTACT.email,
      areaServed: { "@type": "Country", name: "United Kingdom" },
    },
    serviceType: service.name,
    areaServed: { "@type": "Country", name: "United Kingdom" },
  };

  const financialProductJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: service.name,
    description: service.longDesc,
    url: `${SITE_URL}/services/${slug}`,
    provider: {
      "@type": "FinancialService",
      name: SITE_NAME,
      url: SITE_URL,
      telephone: CONTACT.phoneRaw,
      email: CONTACT.email,
    },
    ...(service.typicalRate && { annualPercentageRate: service.typicalRate }),
    ...(service.typicalTerm && { loanTerm: service.typicalTerm }),
    areaServed: { "@type": "Country", name: "United Kingdom" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
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
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: service.name },
    ],
  };

  return (
    <>
      <JsonLd data={financialServiceJsonLd} />
      <JsonLd data={financialProductJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <PageHero
        tone="paper"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
        eyebrow={service.name}
        title={content.h1}
        deck={content.heroSubtitle}
        stats={[
          { label: "Typical rate", value: service.typicalRate },
          { label: "Leverage", value: service.typicalLtv },
          { label: "Term", value: service.typicalTerm },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-4">
            <CTAButton href="/deal-room" variant="navy" size="lg">
              Get terms
            </CTAButton>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="numeral-tabular editorial-link inline-flex h-14 items-center text-lg font-medium tracking-tight"
              style={{ color: "var(--navy-dark)" }}
            >
              Or call {CONTACT.phone}
            </a>
          </div>
        }
      />

      {/* ━━━ CONTENT SECTIONS (editorial prose) ━━━ */}
      <EditorialSection tone="paper">
        <div className="space-y-20">
          {content.sections.map((section) => (
            <ProseSection key={section.title} title={section.title}>
              {section.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="[&_a]:editorial-link [&_a]:font-medium"
                  style={{ color: "oklch(0.32 0.04 255)" }}
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              ))}
            </ProseSection>
          ))}
        </div>
      </EditorialSection>

      {/* ━━━ USE CASES ━━━ */}
      <EditorialSection tone="stone">
        <SectionHeader
          tone="stone"
          eyebrow="Typical use cases"
          title={`When ${service.name.toLowerCase()} fits.`}
        />
        <ul
          className="mt-14 grid grid-cols-1 gap-px border-y sm:grid-cols-2"
          style={{
            borderColor: "var(--stone-dark)",
            backgroundColor: "var(--stone-dark)",
          }}
        >
          {content.useCases.map((useCase) => (
            <li
              key={useCase.title}
              className="flex flex-col gap-3 p-8"
              style={{ background: "var(--stone)" }}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-[0.55rem] block h-1 w-1 flex-shrink-0 rounded-full"
                  style={{ background: "var(--gold)" }}
                />
                <h3
                  className="font-heading text-lg font-medium leading-tight tracking-tight"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {useCase.title}
                </h3>
              </div>
              <p
                className="pl-4 text-[14px] leading-[1.55]"
                style={{ color: "oklch(0.42 0.03 255)" }}
              >
                {useCase.description}
              </p>
            </li>
          ))}
        </ul>
      </EditorialSection>

      {/* ━━━ PROCESS ━━━ */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow="How it works"
          title={`The ${service.name.toLowerCase()} process.`}
        />
        <ol
          className="mt-14 grid grid-cols-1 gap-px border-y sm:grid-cols-2 lg:grid-cols-4"
          style={{
            borderColor: "var(--stone-dark)",
            backgroundColor: "var(--stone-dark)",
          }}
        >
          {content.processSteps.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-4 p-8"
              style={{ background: "var(--paper)" }}
            >
              <p
                className="numeral-tabular font-heading text-4xl font-medium tracking-tight"
                style={{ color: "var(--gold-dark)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3
                className="font-heading text-xl font-medium leading-tight tracking-tight"
                style={{ color: "var(--navy-dark)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-[14px] leading-[1.6]"
                style={{ color: "oklch(0.42 0.03 255)" }}
              >
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </EditorialSection>

      {/* ━━━ FAQ ━━━ */}
      <EditorialSection tone="stone">
        <SectionHeader
          tone="stone"
          eyebrow="Common questions"
          title={`${service.name} FAQ.`}
        />
        <div
          className="mt-14 border-t"
          style={{ borderColor: "var(--stone-dark)" }}
        >
          {content.faqs.map((faq, index) => (
            <details
              key={index}
              className="group border-b"
              style={{ borderColor: "var(--stone-dark)" }}
            >
              <summary
                className="flex cursor-pointer items-start justify-between gap-6 py-6 text-left transition-colors [&::-webkit-details-marker]:hidden"
              >
                <span
                  className="font-heading text-lg font-medium leading-snug tracking-tight"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {faq.question}
                </span>
                <svg
                  className="mt-1 h-4 w-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--gold-dark)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div
                className="pb-6 pr-10 text-[15px] leading-[1.7]"
                style={{ color: "oklch(0.42 0.03 255)" }}
              >
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </EditorialSection>

      {/* ━━━ LOCATIONS ━━━ */}
      {popularLocations.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="By location"
            title={`${service.name} across the UK.`}
            body={`We arrange ${service.name.toLowerCase()} for projects nationwide. A selection of our most active markets below.`}
          />
          <div className="mt-12 flex flex-wrap gap-3">
            {popularLocations.map((loc) => (
              <Link
                key={loc.town}
                href={`/locations/${loc.county}/${loc.town}/${slug}`}
                className="group inline-flex items-center gap-2 border px-5 py-2.5 text-[14px] transition-colors hover:bg-[oklch(0.75_0.12_85/0.06)]"
                style={{
                  borderColor: "oklch(0.82 0.01 250)",
                  color: "var(--navy-dark)",
                }}
              >
                {service.name} in {loc.label}
              </Link>
            ))}
          </div>
        </EditorialSection>
      )}

      {/* ━━━ RELATED GUIDES ━━━ */}
      {relatedGuides.length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="Further reading"
            title={`${service.name} guides.`}
            body={`In-depth coverage of ${service.name.toLowerCase()} — from application to completion.`}
          />
          <div className="mt-14">
            <RelatedGrid
              tone="stone"
              items={relatedGuides.slice(0, 6).map((guide) => ({
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

      {/* ━━━ RELATED SERVICES ━━━ */}
      {relatedServices.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="Related products"
            title="Often used alongside."
            body={`Most schemes use a combination of products. These sit well alongside ${service.name.toLowerCase()} in the capital stack.`}
          />
          <div className="mt-14">
            <RelatedGrid
              tone="paper"
              items={relatedServices.map((related) => ({
                href: `/services/${related.slug}`,
                eyebrow: "Service",
                title: related.name,
                body: related.shortDesc,
                meta: `${related.typicalRate} · ${related.typicalLtv}`,
              }))}
            />
          </div>
        </EditorialSection>
      )}

      {/* ━━━ CTA ━━━ */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Start a deal"
          title={
            <>
              Get {service.name.toLowerCase()}
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                terms inside a day.
              </span>
            </>
          }
          body={
            <>
              Two minutes on a call or form. We come back with indicative
              terms from the right lenders inside one working day &mdash; no
              commitment, no hard credit search.
            </>
          }
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
