import type { Metadata } from "next";

import {
  CTAButton,
  EditorialSection,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { FAQSearch } from "@/components/faq/faq-search";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
import { GUIDES } from "@/lib/guides";
import { SERVICES } from "@/lib/services";
import { SERVICE_PAGE_CONTENT } from "@/lib/service-page-content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions About Property Development Finance",
  description:
    "Answers to 100+ questions about development finance, bridging loans, mezzanine, equity, refurbishment finance, and commercial mortgages in the UK.",
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: `Property Development Finance FAQ | ${SITE_NAME}`,
    description:
      "Answers to 100+ questions about UK property development finance.",
    url: `${SITE_URL}/faq`,
    type: "website",
  },
};

interface FAQEntry {
  question: string;
  answer: string;
  source: string;
  sourceUrl: string;
}

interface FAQCategory {
  name: string;
  slug: string;
  description: string;
  faqs: FAQEntry[];
}

function buildFAQCategories(): FAQCategory[] {
  const categories: FAQCategory[] = [];

  for (const service of SERVICES) {
    const content = SERVICE_PAGE_CONTENT[service.slug];
    if (!content?.faqs?.length) continue;

    categories.push({
      name: service.name,
      slug: service.slug,
      description: service.shortDesc,
      faqs: content.faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
        source: service.name,
        sourceUrl: `/services/${service.slug}`,
      })),
    });
  }

  const guideFaqs: FAQEntry[] = [];
  for (const guide of GUIDES) {
    if (!guide.faqs?.length) continue;
    for (const faq of guide.faqs) {
      guideFaqs.push({
        question: faq.question,
        answer: faq.answer,
        source: guide.title.split(":")[0].trim(),
        sourceUrl: `/guides/${guide.slug}`,
      });
    }
  }

  if (guideFaqs.length > 0) {
    categories.push({
      name: "Guides & Comparisons",
      slug: "guides",
      description:
        "Questions answered across our in-depth guides and comparison articles.",
      faqs: guideFaqs,
    });
  }

  return categories;
}

export default function FAQPage() {
  const categories = buildFAQCategories();
  const totalFAQs = categories.reduce((sum, cat) => sum + cat.faqs.length, 0);

  const allFaqs = categories.flatMap((cat) => cat.faqs);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
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
      { "@type": "ListItem", position: 2, name: "FAQ" },
    ],
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        eyebrow="Questions, answered"
        title={
          <>
            Property finance,
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              demystified.
            </span>
          </>
        }
        deck={
          <>
            {totalFAQs} answers to the most common questions developers
            ask &mdash; drawn from live deals, not a general FAQ template.
            Use the search to find what you need.
          </>
        }
        stats={[
          { label: "Answers", value: totalFAQs },
          { label: "Topics", value: categories.length },
          { label: "Lender panel", value: "100+" },
        ]}
      />

      {/* Searchable list — preserve existing client component behaviour */}
      <EditorialSection tone="paper">
        <FAQSearch categories={categories} />
      </EditorialSection>

      {/* ━━━ CTA ━━━ */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Still have questions"
          title={
            <>
              Every deal is different.
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                Tell us about yours.
              </span>
            </>
          }
          body="A two-minute conversation usually gets more specific answers than any FAQ. You&rsquo;ll also come away with indicative terms from the right lenders."
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
