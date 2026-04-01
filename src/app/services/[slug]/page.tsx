import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  Building2,
  Layers,
  Clock,
  Handshake,
  Wrench,
  Landmark,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { SERVICES, type Service } from "@/lib/services";
import { SITE_NAME, SITE_URL, CONTACT } from "@/lib/constants";
import { SERVICE_POPULAR_LOCATIONS } from "@/lib/location-content";
import { SERVICE_PAGE_CONTENT } from "@/lib/service-page-content";
import { SITE_IMAGES, unsplashUrl } from "@/lib/location-images";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Layers,
  Clock,
  Handshake,
  Wrench,
  Landmark,
  LogOut,
};

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
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = findService(slug);
  const content = SERVICE_PAGE_CONTENT[slug];

  if (!service || !content) {
    notFound();
  }

  const Icon = iconMap[service.icon] || Building2;
  const relatedServices = content.relatedSlugs
    .map((s) => SERVICES.find((svc) => svc.slug === s))
    .filter(Boolean) as Service[];
  const popularLocations = SERVICE_POPULAR_LOCATIONS[slug] || [];

  // JSON-LD: FinancialService
  const financialServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `${service.name} — ${SITE_NAME}`,
    description: content.metaDescription,
    url: `${SITE_URL}/services/${slug}`,
    provider: {
      "@type": "FinancialService",
      name: SITE_NAME,
      url: SITE_URL,
      telephone: CONTACT.phoneRaw,
      email: CONTACT.email,
      areaServed: {
        "@type": "Country",
        name: "United Kingdom",
      },
    },
    serviceType: service.name,
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
  };

  // JSON-LD: FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // JSON-LD: BreadcrumbList
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
        name: "Services",
        item: `${SITE_URL}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.name,
      },
    ],
  };

  return (
    <>
      <JsonLd data={financialServiceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* ━━━ HERO ━━━ */}
      <section
        className="noise-overlay relative overflow-hidden text-white"
      >
        {/* Background photo */}
        {SITE_IMAGES[`service-${slug}`] && (
          <Image
            src={unsplashUrl(SITE_IMAGES[`service-${slug}`].id, 1920, 75)}
            alt=""
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.05 255 / 0.88) 0%, oklch(0.22 0.06 255 / 0.85) 50%, oklch(0.14 0.05 260 / 0.92) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-white/40">
              <Link href="/" className="transition-colors hover:text-white/60">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/services"
                className="transition-colors hover:text-white/60"
              >
                Services
              </Link>
              <span>/</span>
              <span className="text-white/70">{service.name}</span>
            </nav>

            <div
              className="mb-8 h-[2px] w-20"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />

            <div
              className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                border: "1px solid oklch(0.75 0.12 85 / 0.1)",
              }}
            >
              <Icon className="h-6 w-6" style={{ color: "var(--gold)" }} />
            </div>

            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {content.h1}
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/60">
              {content.heroSubtitle}
            </p>

            {/* Key metrics */}
            <div className="mt-10 flex flex-wrap gap-6">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--gold)" }}
                >
                  Rate
                </p>
                <p className="mt-1 text-lg font-bold">{service.typicalRate}</p>
              </div>
              <div
                className="w-px"
                style={{ background: "oklch(1 0 0 / 0.1)" }}
              />
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--gold)" }}
                >
                  LTV
                </p>
                <p className="mt-1 text-lg font-bold">{service.typicalLtv}</p>
              </div>
              <div
                className="w-px"
                style={{ background: "oklch(1 0 0 / 0.1)" }}
              />
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--gold)" }}
                >
                  Term
                </p>
                <p className="mt-1 text-lg font-bold">{service.typicalTerm}</p>
              </div>
            </div>

            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="cta-shimmer h-14 bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
              >
                <Link href="/deal-room">
                  Get a {service.name} Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
            opacity: 0.3,
          }}
        />
      </section>

      {/* ━━━ CONTENT SECTIONS ━━━ */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-16">
            {content.sections.map((section) => (
              <div key={section.title}>
                <div
                  className="mb-5 h-[2px] w-14"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--gold), var(--gold-light))",
                  }}
                />
                <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-muted-foreground"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ USE CASES ━━━ */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
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
              Typical Use Cases
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              When to Use {service.name}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {content.useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="flex items-start gap-4 rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-gold/20 hover:shadow-sm"
              >
                <div
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                  }}
                >
                  <Check
                    className="h-4 w-4"
                    style={{ color: "var(--gold-dark)" }}
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {useCase.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ PROCESS ━━━ */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
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
              How It Works
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              The {service.name} Process
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.processSteps.map((step, i) => (
              <div key={step.title} className="relative">
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                    border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                    color: "var(--gold-dark)",
                  }}
                >
                  {i + 1}
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FAQ ━━━ */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
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
              Common Questions
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {service.name} FAQ
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-0">
              {content.faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group border-b border-border"
                >
                  <summary className="flex cursor-pointer items-center justify-between py-4 text-left text-base font-semibold transition-colors hover:text-foreground/80 [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <svg className="ml-2 h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </summary>
                  <div className="pb-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                </details>
              ))}
          </div>
        </div>
      </section>

      {/* ━━━ LOCATION CROSS-LINKS ━━━ */}
      {popularLocations.length > 0 && (
        <section className="bg-background py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div
                className="mb-5 h-[2px] w-14"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gold), var(--gold-light))",
                }}
              />
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {service.name} by Location
              </h2>
              <p className="mt-3 text-muted-foreground">
                We arrange {service.name.toLowerCase()} for projects across the
                UK. Here are some of our most active areas.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {popularLocations.map((loc) => (
                <Link
                  key={loc.town}
                  href={`/locations/${loc.county}/${loc.town}/${slug}`}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:border-gold/30 hover:shadow-sm"
                >
                  {service.name} in {loc.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━ RELATED SERVICES ━━━ */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div
              className="mb-5 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Related Services
            </h2>
            <p className="mt-3 text-muted-foreground">
              Most deals use a combination of products. These services are
              commonly used alongside {service.name.toLowerCase()}.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {relatedServices.map((related) => {
              const RelatedIcon = iconMap[related.icon] || Building2;
              return (
                <Link
                  key={related.slug}
                  href={`/services/${related.slug}`}
                  className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/20 hover:shadow-md"
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                      border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                    }}
                  >
                    <RelatedIcon
                      className="h-5 w-5"
                      style={{ color: "var(--gold-dark)" }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-gold-dark transition-colors">
                    {related.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {related.shortDesc}
                  </p>
                  <p
                    className="mt-3 text-sm font-semibold"
                    style={{ color: "var(--gold-dark)" }}
                  >
                    {related.typicalRate} · {related.typicalLtv}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.70 0.14 80) 0%, oklch(0.78 0.12 88) 50%, oklch(0.72 0.13 82) 100%)",
          }}
        />
        <div className="noise-overlay absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "var(--navy-dark)" }}
          >
            Ready to Discuss
            <br />
            Your Project?
          </h2>
          <p
            className="mx-auto mt-5 max-w-xl text-lg"
            style={{ color: "var(--navy)", opacity: 0.6 }}
          >
            Submit your deal and receive indicative {service.name.toLowerCase()}{" "}
            terms within 24 hours. No obligation, no fees until we deliver.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="bg-navy text-white hover:bg-navy-dark h-14 px-12 text-base font-bold shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <Link href="/deal-room">
                Enter the Deal Room
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
