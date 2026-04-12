import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Scale,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  PRODUCT_COMPARISONS,
  getComparisonBySlug,
} from "@/lib/product-comparisons";
import { SERVICES } from "@/lib/services";
import { getGuideBySlug } from "@/lib/guides";
import { SITE_IMAGES, unsplashUrl } from "@/lib/location-images";

export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    return { title: "Comparison Not Found" };
  }

  return {
    title: comparison.metaTitle,
    description: comparison.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/compare/${slug}`,
    },
    openGraph: {
      title: comparison.metaTitle,
      description: comparison.metaDescription,
      url: `${SITE_URL}/compare/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.metaTitle,
      description: comparison.metaDescription,
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return PRODUCT_COMPARISONS.map((c) => ({ slug: c.slug }));
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

  const relatedGuides = comparison.relatedGuides
    .map((s) => getGuideBySlug(s))
    .filter(Boolean);

  const relatedServices = comparison.relatedServices
    .map((s) => SERVICES.find((svc) => svc.slug === s))
    .filter(Boolean);

  // JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: comparison.title,
    description: comparison.metaDescription,
    url: `${SITE_URL}/compare/${slug}`,
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
      "@id": `${SITE_URL}/compare/${slug}`,
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
        name: "Compare",
        item: `${SITE_URL}/compare`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: comparison.title,
      },
    ],
  };

  const faqJsonLd =
    comparison.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: comparison.faqs.map((faq) => ({
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

      {/* Hero Section */}
      <section className="noise-overlay relative overflow-hidden py-20 text-white sm:py-28">
        <Image
          src={unsplashUrl(
            (SITE_IMAGES["guide-comparison"] ?? SITE_IMAGES["guides-hero"]).id,
            1920,
            75
          )}
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.05 255 / 0.90) 0%, oklch(0.22 0.06 255 / 0.85) 50%, oklch(0.14 0.05 260 / 0.92) 100%)",
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
                <Link href="/guides" className="hover:text-white/70">
                  Guides
                </Link>
              </li>
              <li>/</li>
              <li className="text-white/60">Compare</li>
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
            <span className="flex items-center gap-1.5 text-xs font-bold text-white/50">
              <Scale className="h-3.5 w-3.5" />
              Side-by-Side Comparison
            </span>
          </div>

          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {comparison.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            {comparison.excerpt}
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

      {/* Quick Summary Cards */}
      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {[comparison.optionA, comparison.optionB].map((option, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-6 sm:p-8"
              >
                <p
                  className="mb-3 text-xs font-bold uppercase tracking-[0.25em]"
                  style={{ color: "var(--gold-dark)" }}
                >
                  Option {i === 0 ? "A" : "B"}
                </p>
                <h2 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl">
                  {option.name}
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {option.description}
                </p>

                {/* Key stats */}
                <div className="mb-6 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-[11px] text-muted-foreground">Rate</p>
                    <p className="text-sm font-bold">{option.typicalRate}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-[11px] text-muted-foreground">
                      Leverage
                    </p>
                    <p className="text-sm font-bold">{option.typicalLtv}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-[11px] text-muted-foreground">Term</p>
                    <p className="text-sm font-bold">{option.typicalTerm}</p>
                  </div>
                </div>

                {/* Pros */}
                <div className="mb-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-600">
                    Advantages
                  </p>
                  <ul className="space-y-1.5">
                    {option.pros.map((pro, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="mb-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-red-600">
                    Disadvantages
                  </p>
                  <ul className="space-y-1.5">
                    {option.cons.map((con, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best for */}
                <div className="rounded-lg border border-gold/20 bg-gold/5 p-4">
                  <p className="text-xs font-bold text-gold-dark">Best For</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {option.bestFor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-muted/20 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div
              className="mb-5 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
              Feature-by-Feature Comparison
            </h2>

            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold sm:px-6">
                      Feature
                    </th>
                    <th className="px-4 py-3 text-left font-semibold sm:px-6">
                      {comparison.optionA.name}
                    </th>
                    <th className="px-4 py-3 text-left font-semibold sm:px-6">
                      {comparison.optionB.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.features.map((feature, i) => (
                    <tr
                      key={i}
                      className="border-b last:border-0 even:bg-muted/20"
                    >
                      <td className="px-4 py-3 font-medium sm:px-6">
                        {feature.feature}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground sm:px-6">
                        {feature.optionA}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground sm:px-6">
                        {feature.optionB}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Verdict */}
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
              Our Verdict
            </p>
            <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
              Which Should You Choose?
            </h2>

            <div className="space-y-5">
              {comparison.verdict.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="bg-muted/30 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h3 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
                Explore These Products
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
                    <span className="flex items-center gap-1 text-xs font-bold text-gold-dark">
                      Learn more
                      <ChevronRight className="h-3 w-3" />
                    </span>
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
              <h3 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
                Further Reading
              </h3>
              <div className="space-y-4">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide!.slug}
                    href={`/guides/${guide!.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30"
                  >
                    <div>
                      <h4 className="mb-1 font-bold text-foreground">
                        {guide!.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {guide!.readingTime}
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
      {comparison.faqs.length > 0 && (
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
                {comparison.faqs.map((faq, i) => (
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
            Not Sure Which Product You Need?
          </h2>
          <p className="mt-3 text-white/50">
            Tell us about your project and we&apos;ll recommend the right
            finance structure. Indicative terms from 100+ lenders within 24
            hours.
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
              <Link href="/guides">
                <ArrowLeft className="mr-2 h-5 w-5" />
                All Guides
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
