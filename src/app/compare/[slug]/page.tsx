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

import { JsonLd } from "@/components/ui/json-ld";
import {
  CTAButton,
  EditorialSection,
  SectionHeader,
} from "@/components/editorial/primitives";
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

      {/* Summary cards — the two options */}
      <EditorialSection tone="paper">
        <div
          className="grid gap-px border-y md:grid-cols-2"
          style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
        >
          {[comparison.optionA, comparison.optionB].map((option, i) => (
            <div
              key={i}
              className="flex flex-col gap-6 px-8 py-10"
              style={{ background: "var(--paper)" }}
            >
              <p
                className="text-[10px] font-medium uppercase tracking-[0.28em]"
                style={{ color: "var(--gold-dark)" }}
              >
                Option {i === 0 ? "A" : "B"}
              </p>
              <h2
                className="font-heading text-[1.75rem] font-medium leading-[1.15] tracking-tight sm:text-[2rem]"
                style={{ color: "var(--navy-dark)" }}
              >
                {option.name}
              </h2>
              <p
                className="text-[16px] leading-[1.6]"
                style={{ color: "oklch(0.35 0.04 255)" }}
              >
                {option.description}
              </p>

              <dl
                className="grid grid-cols-3 gap-4 border-y py-5"
                style={{ borderColor: "var(--stone-dark)" }}
              >
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.22em]" style={{ color: "oklch(0.50 0.02 255)" }}>Rate</dt>
                  <dd className="numeral-tabular font-heading mt-1 text-[18px] font-medium tracking-tight" style={{ color: "var(--navy-dark)" }}>{option.typicalRate}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.22em]" style={{ color: "oklch(0.50 0.02 255)" }}>Leverage</dt>
                  <dd className="numeral-tabular font-heading mt-1 text-[18px] font-medium tracking-tight" style={{ color: "var(--navy-dark)" }}>{option.typicalLtv}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.22em]" style={{ color: "oklch(0.50 0.02 255)" }}>Term</dt>
                  <dd className="numeral-tabular font-heading mt-1 text-[18px] font-medium tracking-tight" style={{ color: "var(--navy-dark)" }}>{option.typicalTerm}</dd>
                </div>
              </dl>

              <div>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.26em]" style={{ color: "oklch(0.55 0.15 160)" }}>Advantages</p>
                <ul className="space-y-2">
                  {option.pros.map((pro, j) => (
                    <li key={j} className="flex items-start gap-3 text-[15px] leading-[1.55]" style={{ color: "var(--navy-dark)" }}>
                      <Check className="mt-[0.2em] h-4 w-4 shrink-0" style={{ color: "oklch(0.55 0.15 160)" }} />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.26em]" style={{ color: "oklch(0.55 0.2 25)" }}>Disadvantages</p>
                <ul className="space-y-2">
                  {option.cons.map((con, j) => (
                    <li key={j} className="flex items-start gap-3 text-[15px] leading-[1.55]" style={{ color: "var(--navy-dark)" }}>
                      <X className="mt-[0.2em] h-4 w-4 shrink-0" style={{ color: "oklch(0.55 0.2 25)" }} />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="mt-auto border-l-2 pl-4 py-1"
                style={{ borderColor: "var(--gold)" }}
              >
                <p
                  className="text-[10px] font-medium uppercase tracking-[0.26em]"
                  style={{ color: "var(--gold-dark)" }}
                >
                  Best for
                </p>
                <p
                  className="mt-1 text-[15px] leading-[1.55]"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {option.bestFor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </EditorialSection>

      {/* Feature comparison table */}
      <EditorialSection tone="stone">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            tone="stone"
            align="stacked"
            eyebrow="Side by side"
            title={
              <>
                Feature-by-feature
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  comparison.
                </span>
              </>
            }
          />
          <div
            className="mt-12 overflow-x-auto border"
            style={{ borderColor: "var(--stone-dark)" }}
          >
            <table className="w-full text-[15px]">
              <thead>
                <tr style={{ background: "var(--stone-dark)" }}>
                  <th className="px-5 py-4 text-left font-heading text-[14px] font-medium tracking-tight sm:px-6" style={{ color: "var(--navy-dark)" }}>Feature</th>
                  <th className="px-5 py-4 text-left font-heading text-[14px] font-medium tracking-tight sm:px-6" style={{ color: "var(--navy-dark)" }}>{comparison.optionA.name}</th>
                  <th className="px-5 py-4 text-left font-heading text-[14px] font-medium tracking-tight sm:px-6" style={{ color: "var(--navy-dark)" }}>{comparison.optionB.name}</th>
                </tr>
              </thead>
              <tbody>
                {comparison.features.map((feature, i) => (
                  <tr
                    key={i}
                    className="border-t"
                    style={{ borderColor: "var(--stone-dark)", background: i % 2 === 0 ? "var(--stone)" : "oklch(0.97 0.005 250)" }}
                  >
                    <td className="px-5 py-4 font-medium sm:px-6" style={{ color: "var(--navy-dark)" }}>{feature.feature}</td>
                    <td className="px-5 py-4 sm:px-6" style={{ color: "oklch(0.35 0.04 255)" }}>{feature.optionA}</td>
                    <td className="px-5 py-4 sm:px-6" style={{ color: "oklch(0.35 0.04 255)" }}>{feature.optionB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </EditorialSection>

      {/* Verdict */}
      <EditorialSection tone="paper">
        <div className="mx-auto max-w-3xl">
          <SectionHeader
            tone="paper"
            align="stacked"
            eyebrow="Our verdict"
            title={
              <>
                Which should
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  you choose?
                </span>
              </>
            }
          />
          <div
            className="mt-10 space-y-5 text-[17px] leading-[1.7]"
            style={{ color: "oklch(0.32 0.04 255)" }}
          >
            {comparison.verdict.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </EditorialSection>

      {/* Related services */}
      {relatedServices.length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="The two products"
            title={
              <>
                Explore
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  each product.
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
                  <ChevronRight
                    className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                    style={{ color: "var(--gold-dark)" }}
                  />
                </div>
                <p
                  className="text-[15px] leading-[1.55]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  {service!.shortDesc}
                </p>
              </Link>
            ))}
          </div>
        </EditorialSection>
      )}

      {/* Related guides */}
      {relatedGuides.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="Further reading"
            title={
              <>
                Go deeper
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  on the detail.
                </span>
              </>
            }
          />
          <div
            className="mt-16 grid gap-px border-y sm:grid-cols-2"
            style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
          >
            {relatedGuides.map((guide) => (
              <Link
                key={guide!.slug}
                href={`/guides/${guide!.slug}`}
                className="group flex items-start justify-between gap-6 px-7 py-7 transition-colors"
                style={{ background: "var(--paper)" }}
              >
                <div>
                  <h3
                    className="font-heading text-[20px] font-medium leading-[1.2] tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {guide!.title}
                  </h3>
                  <span
                    className="mt-3 inline-block text-[11px] font-medium uppercase tracking-[0.22em]"
                    style={{ color: "oklch(0.50 0.02 255)" }}
                  >
                    {guide!.readingTime}
                  </span>
                </div>
                <ArrowRight
                  className="mt-1 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "var(--gold-dark)" }}
                />
              </Link>
            ))}
          </div>
        </EditorialSection>
      )}

      {/* FAQs */}
      {comparison.faqs.length > 0 && (
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
            {comparison.faqs.map((faq, i) => (
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
                  <svg className="ml-3 h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" style={{ color: "var(--gold-dark)" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
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
              Not sure which
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                product you need?
              </span>
            </>
          }
          body="Tell us about your scheme and we'll recommend the right finance structure. Indicative terms from the panel within one working day."
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
