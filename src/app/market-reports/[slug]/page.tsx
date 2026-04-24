import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";

import { JsonLd } from "@/components/ui/json-ld";
import {
  CTAButton,
  EditorialSection,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  MARKET_REPORTS,
  getReportBySlug,
  getRelatedReports,
} from "@/lib/market-reports";
import { SERVICES } from "@/lib/services";
import {
  PriceByTypeChart,
  TownPricesChart,
  YoyChangeChart,
} from "@/components/market-reports/report-charts";

export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const report = getReportBySlug(slug);

  if (!report) return { title: "Report Not Found" };

  return {
    title: report.metaTitle,
    description: report.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/market-reports/${slug}`,
    },
    openGraph: {
      title: report.metaTitle,
      description: report.metaDescription,
      url: `${SITE_URL}/market-reports/${slug}`,
      type: "article",
      publishedTime: report.datePublished,
      modifiedTime: report.dateModified,
    },
    twitter: {
      card: "summary_large_image",
      title: report.metaTitle,
      description: report.metaDescription,
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return MARKET_REPORTS.map((r) => ({ slug: r.slug }));
}

function deslugify(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function MarketReportPage({ params }: PageProps) {
  const { slug } = await params;
  const report = getReportBySlug(slug);

  if (!report) notFound();

  const relatedReports = getRelatedReports(slug);
  const relatedServices = report.relatedServiceSlugs
    .map((s) => SERVICES.find((svc) => svc.slug === s))
    .filter(Boolean);

  // JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: report.title,
    description: report.metaDescription,
    datePublished: report.datePublished,
    dateModified: report.dateModified,
    url: `${SITE_URL}/market-reports/${slug}`,
    author: {
      "@type": "Person",
      name: "Matt Lenzie",
      jobTitle: "Founder",
      worksFor: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/market-reports/${slug}`,
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
        name: "Market Reports",
        item: `${SITE_URL}/market-reports`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: report.title,
      },
    ],
  };

  const faqJsonLd =
    report.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: report.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <PageHero
        tone="paper"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Market Reports", href: "/market-reports" },
          { label: report.title.split(":")[0] },
        ]}
        eyebrow={
          <>
            {report.category.charAt(0).toUpperCase() + report.category.slice(1)} report &middot;{" "}
            {report.readingTime} read &middot; Updated{" "}
            {new Date(report.dateModified).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </>
        }
        title={report.title}
        deck={report.excerpt}
      />

      {/* Article Content */}
      <EditorialSection tone="paper">
        <div className="mx-auto max-w-3xl">
          {/* Table of contents */}
          <nav
            className="mb-16 border-y py-6"
            style={{ borderColor: "var(--stone-dark)" }}
          >
            <p
              className="mb-5 text-[10px] font-medium uppercase tracking-[0.28em]"
              style={{ color: "var(--gold-dark)" }}
            >
              In this report
            </p>
            <ol className="numeral-tabular flex flex-col gap-2.5">
              {report.sections.map((section, i) => (
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

          {/* Sections with inline charts */}
          {report.sections.map((section, i) => {
            const heading = section.heading.toLowerCase();
            const showPriceByType = !!(report.charts?.priceByType?.length) && (
              heading.includes("property type") || heading.includes("house prices by")
            );
            const showTownPrices = !!(report.charts?.townPrices?.length) && (
              heading.includes("town-by-town") || heading.includes("compared to nearby")
            );
            const showYoyChange = !!(report.charts?.townYoyChange?.length) && (
              heading.includes("outlook") || heading.includes("year-on-year")
            );

            return (
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
                  className="space-y-5 text-[17px] leading-[1.7] [&_a]:font-medium [&_a]:text-[color:var(--navy-dark)] [&_a]:underline [&_a]:decoration-[color:var(--gold)]/40 [&_a]:underline-offset-2 hover:[&_a]:decoration-[color:var(--gold)] [&_strong]:font-semibold [&_strong]:text-[color:var(--navy-dark)] [&_table]:my-8 [&_table]:w-full [&_table]:text-sm [&_td]:border [&_td]:border-[color:var(--stone-dark)] [&_td]:px-4 [&_td]:py-3 [&_th]:border [&_th]:border-[color:var(--stone-dark)] [&_th]:bg-[color:var(--stone)] [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_th]:text-[color:var(--navy-dark)] [&_ul]:my-5 [&_ul]:space-y-2 [&_ul]:pl-0 [&_li]:flex [&_li]:gap-3 [&_li]:pl-0 [&_li]:before:mt-[0.75em] [&_li]:before:h-1 [&_li]:before:w-1 [&_li]:before:shrink-0 [&_li]:before:rounded-full [&_li]:before:bg-[color:var(--gold)] [&_li]:before:content-['']"
                  style={{ color: "oklch(0.32 0.04 255)" }}
                >
                  {section.content.map((paragraph, j) => {
                    const isBlock = paragraph.startsWith("<table") || paragraph.startsWith("<ul") || paragraph.startsWith("<ol");
                    return isBlock ? (
                      <div
                        key={j}
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: paragraph }}
                      />
                    ) : (
                      <p
                        key={j}
                        dangerouslySetInnerHTML={{ __html: paragraph }}
                      />
                    );
                  })}
                </div>
                {showPriceByType && <PriceByTypeChart data={report.charts!.priceByType!} />}
                {showTownPrices && <TownPricesChart data={report.charts!.townPrices!} />}
                {showYoyChange && <YoyChangeChart data={report.charts!.townYoyChange!} />}
              </div>
            );
          })}
        </div>
      </EditorialSection>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="Finance solutions"
            title={
              <>
                Related
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
          {report.countySlug && (
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span
                className="text-[10px] font-medium uppercase tracking-[0.26em]"
                style={{ color: "oklch(0.50 0.02 255)" }}
              >
                Explore locations
              </span>
              <Link
                href={`/locations/${report.countySlug}`}
                className="editorial-link text-[14px] font-medium"
                style={{ color: "var(--navy-dark)" }}
              >
                {deslugify(report.countySlug)}
              </Link>
              {report.relatedTownSlugs.slice(0, 6).map((ts) => {
                const [, town] = ts.split("/");
                return (
                  <Link
                    key={ts}
                    href={`/locations/${ts}`}
                    className="editorial-link text-[14px] font-medium"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {deslugify(town)}
                  </Link>
                );
              })}
            </div>
          )}
        </EditorialSection>
      )}

      {/* Related Reports */}
      {relatedReports.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="More intelligence"
            title={
              <>
                Related
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  market reports.
                </span>
              </>
            }
          />
          <div
            className="mt-16 grid gap-px border-y sm:grid-cols-2"
            style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
          >
            {relatedReports.map((related) => (
              <Link
                key={related.slug}
                href={`/market-reports/${related.slug}`}
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
      {report.faqs.length > 0 && (
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
            {report.faqs.map((faq, i) => (
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
              Ready to develop?
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                Tell us the deal.
              </span>
            </>
          }
          body="We will source competitive terms from our panel of 100+ lenders and come back with an initial structure within one working day."
        />
        <div className="mt-12 flex flex-wrap items-center gap-5">
          <CTAButton href="/deal-room" variant="gold" size="lg">
            Start your deal
          </CTAButton>
          <CTAButton href="/market-reports" variant="outline-dark" size="lg">
            All reports
          </CTAButton>
        </div>
      </EditorialSection>
    </>
  );
}
