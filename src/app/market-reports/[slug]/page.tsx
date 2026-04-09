import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, Clock, BarChart3, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
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

      {/* Hero */}
      <section
        className="noise-overlay relative overflow-hidden py-20 text-white sm:py-28"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.05 255) 0%, oklch(0.22 0.06 255) 50%, oklch(0.14 0.05 260) 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="mr-grid"
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
            <rect width="100%" height="100%" fill="url(#mr-grid)" />
          </svg>
        </div>

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
                <Link href="/market-reports" className="hover:text-white/70">
                  Market Reports
                </Link>
              </li>
              <li>/</li>
              <li className="text-white/60">{report.title.split(":")[0]}</li>
            </ol>
          </nav>

          <div
            className="mb-8 h-[2px] w-20"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />

          <div className="mb-5 flex items-center gap-3">
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
              style={{
                backgroundColor: "oklch(1 0 0 / 0.08)",
                color: "var(--gold)",
              }}
            >
              {report.category === "county" && (
                <MapPin className="h-3 w-3" />
              )}
              {report.category === "regional" && (
                <BarChart3 className="h-3 w-3" />
              )}
              {report.category.charAt(0).toUpperCase() +
                report.category.slice(1)}{" "}
              Report
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-white/50">
              <Clock className="h-3.5 w-3.5" />
              {report.readingTime}
            </span>
            <span className="text-xs text-white/30">
              Updated{" "}
              {new Date(report.dateModified).toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {report.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            {report.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                ML
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80">
                  Matt Lenzie
                </p>
                <p className="text-xs text-white/40">
                  Founder, Construction Capital
                </p>
              </div>
            </div>
            <span className="hidden h-4 w-px bg-white/20 sm:block" />
            <p className="text-xs text-white/40">
              Published{" "}
              {new Date(report.datePublished).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
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

      {/* Article Content */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Table of contents */}
            <nav className="mb-12 rounded-xl border border-border bg-muted/30 p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                In this report
              </p>
              <ol className="space-y-2">
                {report.sections.map((section, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="text-sm font-medium text-foreground hover:text-gold-dark"
                    >
                      {i + 1}. {section.heading}
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
                <div key={i}>
                  <div id={`section-${i}`} className="mb-12">
                    <h2 className="mb-5 text-2xl font-bold tracking-tight sm:text-3xl">
                      {section.heading}
                    </h2>
                    <div className="space-y-4 text-base leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-gold-dark [&_a]:no-underline hover:[&_a]:text-gold [&_strong]:font-semibold [&_strong]:text-foreground [&_table]:my-6 [&_table]:w-full [&_table]:text-sm [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground [&_ul]:my-4 [&_ul]:space-y-2 [&_ul]:pl-0 [&_li]:pl-0 [&_li]:text-muted-foreground">
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

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
                Finance Solutions
              </p>
              <h3 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
                Related Finance Products
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {relatedServices.map((service) => (
                  <Link
                    key={service!.slug}
                    href={`/services#${service!.slug}`}
                    className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30"
                  >
                    <h4 className="mb-1 font-bold text-foreground">
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

              {/* Location links */}
              {report.countySlug && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Explore locations:
                  </span>
                  <Link
                    href={`/locations/${report.countySlug}`}
                    className="text-xs font-medium text-gold-dark hover:underline"
                  >
                    {deslugify(report.countySlug)}
                  </Link>
                  {report.relatedTownSlugs.slice(0, 6).map((ts) => {
                    const [, town] = ts.split("/");
                    return (
                      <Link
                        key={ts}
                        href={`/locations/${ts}`}
                        className="text-xs font-medium text-gold-dark hover:underline"
                      >
                        {deslugify(town)}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related Reports */}
      {relatedReports.length > 0 && (
        <section className="bg-background py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h3 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
                Related Reports
              </h3>

              <div className="space-y-4">
                {relatedReports.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/market-reports/${related.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30"
                  >
                    <div>
                      <h4 className="mb-1 font-bold text-foreground">
                        {related.title}
                      </h4>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {related.readingTime}
                      </span>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {report.faqs.length > 0 && (
        <section className="bg-muted/20 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div
                className="mb-5 h-[2px] w-14"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gold), var(--gold-light))",
                }}
              />
              <h3 className="mb-8 text-xl font-bold tracking-tight sm:text-2xl">
                Frequently Asked Questions
              </h3>

              <div className="space-y-6">
                {report.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-card p-6"
                  >
                    <h4 className="mb-3 font-bold text-foreground">
                      {faq.question}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
            Ready to Develop?
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
              <Link href="/market-reports">
                <ArrowLeft className="mr-2 h-5 w-5" />
                All Reports
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
