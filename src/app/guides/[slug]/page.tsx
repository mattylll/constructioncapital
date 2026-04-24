import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock } from "lucide-react";

import { GuideMarketEvidence } from "@/components/guides/guide-market-evidence";
import { JsonLd } from "@/components/ui/json-ld";
import {
  CTAButton,
  EditorialSection,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { GUIDES, getGuideBySlug, getRelatedGuides } from "@/lib/guides";
import { getGuideMarketData } from "@/lib/local-market-data";
import { SERVICES } from "@/lib/services";
import { SITE_IMAGES, unsplashUrl } from "@/lib/location-images";
import { getTownsForCounty } from "@/lib/uk-locations-data";

export const dynamicParams = true;
export const revalidate = 86400;

function deslugify(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide Not Found" };
  }

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/guides/${slug}`,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `${SITE_URL}/guides/${slug}`,
      type: "article",
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedGuides = getRelatedGuides(slug);
  const relatedServices = guide.relatedServices
    .map((s) => SERVICES.find((svc) => svc.slug === s))
    .filter(Boolean);

  // Load regional market data based on guide's related locations
  const marketData = guide.relatedLocations.length > 0
    ? getGuideMarketData(guide.relatedLocations, getTownsForCounty)
    : null;

  // JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    url: `${SITE_URL}/guides/${slug}`,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/guides/${slug}`,
    },
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
        name: "Guides",
        item: `${SITE_URL}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
      },
    ],
  };

  const faqJsonLd =
    guide.faqs && guide.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  // VideoObject schema — emitted only when a video is wired up. Duration in
  // ISO-8601 format (PT{N}S). thumbnailUrl falls back to the page hero image.
  const videoJsonLd = guide.videoUrl
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: guide.title,
        description: guide.excerpt,
        thumbnailUrl: guide.videoThumbnailUrl
          ?? unsplashUrl((SITE_IMAGES[`guide-${guide.category}`] ?? SITE_IMAGES["guides-hero"]).id, 1280, 80),
        uploadDate: guide.datePublished,
        contentUrl: guide.videoUrl,
        duration: guide.videoDurationSeconds
          ? `PT${Math.round(guide.videoDurationSeconds)}S`
          : undefined,
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      }
    : null;

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      {videoJsonLd && <JsonLd data={videoJsonLd} />}

      <PageHero
        tone="paper"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: guide.title.split(":")[0] },
        ]}
        eyebrow={
          <>
            {guide.readingTime} read &middot; Updated{" "}
            {new Date(guide.dateModified).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </>
        }
        title={guide.title}
        deck={guide.excerpt}
      />

      {/* Article Content */}
      <EditorialSection tone="paper">
        <div className="mx-auto max-w-3xl">
          {/* Explainer video — lazy-loaded above the article body */}
          {guide.videoUrl && (
            <div
              className="mb-16 overflow-hidden border"
              style={{ borderColor: "var(--stone-dark)", background: "oklch(0.12 0.045 255)" }}
            >
              <video
                src={guide.videoUrl}
                controls
                preload="none"
                poster={
                  guide.videoThumbnailUrl
                  ?? unsplashUrl((SITE_IMAGES[`guide-${guide.category}`] ?? SITE_IMAGES["guides-hero"]).id, 1280, 80)
                }
                className="aspect-video w-full"
              >
                <track kind="captions" />
              </video>
            </div>
          )}

          {/* Table of contents */}
          <nav
            className="mb-16 border-y py-6"
            style={{ borderColor: "var(--stone-dark)" }}
          >
            <p
              className="mb-5 text-[10px] font-medium uppercase tracking-[0.28em]"
              style={{ color: "var(--gold-dark)" }}
            >
              In this guide
            </p>
            <ol className="numeral-tabular flex flex-col gap-2.5">
              {guide.sections.map((section, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="shrink-0 text-[12px] font-medium"
                    style={{ color: "oklch(0.50 0.02 255)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#section-${i}`}
                    className="editorial-link text-[15px] font-medium leading-snug"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sections */}
          {guide.sections.map((section, i) => (
            <div key={i} id={`section-${i}`} className="mb-16 scroll-mt-24">
              <p
                className="mb-3 text-[11px] font-medium uppercase tracking-[0.26em]"
                style={{ color: "var(--gold-dark)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2
                className="font-heading mb-8 text-[2rem] font-medium leading-[1.1] tracking-[-0.015em] sm:text-[2.25rem]"
                style={{ color: "var(--navy-dark)" }}
              >
                {section.heading}
              </h2>
              <div
                className="guide-content space-y-5 text-[17px] leading-[1.7] [&_a]:font-medium [&_a]:text-[color:var(--navy-dark)] [&_a]:underline [&_a]:decoration-[color:var(--gold)]/40 [&_a]:underline-offset-2 hover:[&_a]:decoration-[color:var(--gold)] [&_strong]:font-semibold [&_strong]:text-[color:var(--navy-dark)]"
                style={{ color: "oklch(0.32 0.04 255)" }}
              >
                {section.content.map((paragraph, j) => {
                  const isBlock = paragraph.trimStart().startsWith("<table") || paragraph.trimStart().startsWith("<div");
                  return isBlock ? (
                    <div key={j} className="my-8 overflow-x-auto" dangerouslySetInnerHTML={{ __html: paragraph }} />
                  ) : (
                    <p key={j} dangerouslySetInnerHTML={{ __html: paragraph }} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </EditorialSection>

      {/* Regional Market Evidence */}
      {marketData && <GuideMarketEvidence data={marketData} />}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="Related services"
            title={
              <>
                Explore our
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  finance products.
                </span>
              </>
            }
          />
          <div
            className="mt-16 grid gap-px border-y sm:grid-cols-2"
            style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
          >
            {relatedServices.map((service) => (
              <Link
                key={service!.slug}
                href={`/services/${service!.slug}`}
                className="group flex flex-col gap-4 px-7 py-8 transition-colors"
                style={{ background: "var(--stone)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="font-heading text-[22px] font-medium leading-[1.2] tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {service!.name}
                  </h3>
                  <ArrowUpRight
                    className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    style={{ color: "var(--gold-dark)" }}
                  />
                </div>
                <p
                  className="text-[15px] leading-[1.55]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  {service!.shortDesc}
                </p>
                <span
                  className="numeral-tabular text-[11px] font-medium uppercase tracking-[0.22em]"
                  style={{ color: "var(--gold-dark)" }}
                >
                  {service!.typicalRate} · {service!.typicalLtv}
                </span>
              </Link>
            ))}
          </div>

          {/* Location links */}
          {guide.relatedLocations.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span
                className="text-[10px] font-medium uppercase tracking-[0.26em]"
                style={{ color: "oklch(0.50 0.02 255)" }}
              >
                Find this service in
              </span>
              {guide.relatedLocations.map((loc) => (
                <Link
                  key={loc}
                  href={`/locations/${loc}`}
                  className="editorial-link text-[14px] font-medium"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {deslugify(loc)}
                </Link>
              ))}
            </div>
          )}
        </EditorialSection>
      )}

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="Continue reading"
            title={
              <>
                More
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  expert guides.
                </span>
              </>
            }
          />
          <div
            className="mt-16 grid gap-px border-y sm:grid-cols-2"
            style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
          >
            {relatedGuides.map((related) => (
              <Link
                key={related.slug}
                href={`/guides/${related.slug}`}
                className="group flex items-start justify-between gap-6 px-7 py-7 transition-colors"
                style={{ background: "var(--paper)" }}
              >
                <div>
                  <h3
                    className="font-heading text-[20px] font-medium leading-[1.2] tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {related.title}
                  </h3>
                  <span
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.22em]"
                    style={{ color: "oklch(0.50 0.02 255)" }}
                  >
                    <Clock className="h-3 w-3" />
                    {related.readingTime}
                  </span>
                </div>
                <ArrowUpRight
                  className="mt-1 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  style={{ color: "var(--gold-dark)" }}
                />
              </Link>
            ))}
          </div>
        </EditorialSection>
      )}

      {/* FAQs */}
      {guide.faqs && guide.faqs.length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="Common questions"
            title={
              <>
                Frequently asked
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  questions.
                </span>
              </>
            }
          />
          <div className="mt-16 mx-auto max-w-3xl space-y-3">
            {guide.faqs.map((faq, i) => (
              <details
                key={i}
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
      )}

      {/* CTA */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Ready when you are"
          title={
            <>
              Ready to apply?
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                Tell us the deal.
              </span>
            </>
          }
          body="Submit your scheme and a partner will come back with an initial structure and indicative terms within one working day."
        />
        <div className="mt-12 flex flex-wrap items-center gap-5">
          <CTAButton href="/deal-room" variant="gold" size="lg">
            Start your deal
          </CTAButton>
          <CTAButton href="/guides" variant="outline-dark" size="lg">
            All guides
          </CTAButton>
        </div>
      </EditorialSection>
    </>
  );
}
