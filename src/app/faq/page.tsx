import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { FAQSearch } from "@/components/faq/faq-search";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
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

  // Service page FAQs
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

  // Guide FAQs — grouped by category
  const guidesByCategory = new Map<string, typeof GUIDES>();
  for (const guide of GUIDES) {
    if (!guide.faqs?.length) continue;
    const existing = guidesByCategory.get("guides") ?? [];
    existing.push(guide);
    guidesByCategory.set("guides", existing);
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

  // Build FAQPage schema with all questions
  const allFaqs = categories.flatMap((cat) => cat.faqs);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

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
        name: "FAQ",
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero */}
      <section className="hero-gradient noise-overlay relative overflow-hidden py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="faq-hero-grid"
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
            <rect width="100%" height="100%" fill="url(#faq-hero-grid)" />
          </svg>
        </div>

        <div
          className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2"
          style={{
            width: "600px",
            height: "500px",
            background:
              "radial-gradient(ellipse, oklch(0.75 0.12 85 / 0.08) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-white/40">
              <li>
                <Link href="/" className="hover:text-white/70">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-white/60">FAQ</li>
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
            Knowledge Base
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Frequently Asked{" "}
            <span className="gold-gradient-text italic">Questions</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            {totalFAQs} answers to the most common questions about property
            development finance, bridging loans, mezzanine, equity, and more.
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

      {/* Searchable FAQ list (client component) */}
      <FAQSearch categories={categories} />

      {/* CTA */}
      <section
        className="noise-overlay relative overflow-hidden py-16 sm:py-20"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.16 0.05 255) 0%, oklch(0.20 0.06 255) 50%, oklch(0.16 0.05 255) 100%)",
        }}
      >
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Still Have Questions?
          </h2>
          <p className="mt-3 text-white/50">
            Every property project is different. Tell us about yours and
            we&apos;ll give you specific answers — plus indicative terms from
            100+ lenders within 24 hours.
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
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
