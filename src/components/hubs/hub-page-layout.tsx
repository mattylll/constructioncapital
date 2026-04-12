import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  BookOpen,
  Scale,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Hub } from "@/lib/hubs";
import { GUIDES } from "@/lib/guides";
import { CALCULATORS } from "@/lib/calculators";
import { SERVICES } from "@/lib/services";
import { PRODUCT_COMPARISONS } from "@/lib/product-comparisons";
import { SITE_IMAGES, unsplashUrl } from "@/lib/location-images";

interface HubPageLayoutProps {
  hub: Hub;
}

export function HubPageLayout({ hub }: HubPageLayoutProps) {
  // Gather guides by category + specific slugs
  const guides = GUIDES.filter(
    (g) =>
      hub.guideCategories.includes(g.category) ||
      hub.guideSlugs.includes(g.slug)
  );

  const calculators = CALCULATORS.filter((c) =>
    hub.calculatorSlugs.includes(c.slug)
  );

  const services = SERVICES.filter((s) => hub.serviceSlugs.includes(s.slug));

  const comparisons = PRODUCT_COMPARISONS.filter((c) =>
    hub.comparisonSlugs.includes(c.slug)
  );

  const heroImage = SITE_IMAGES[hub.heroImageKey] ?? SITE_IMAGES["guides-hero"];

  // JSON-LD
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.title,
    description: hub.metaDescription,
    url: `${SITE_URL}/${hub.slug}`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
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
        name: hub.title,
      },
    ],
  };

  return (
    <>
      <JsonLd data={webPageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero */}
      <section className="noise-overlay relative overflow-hidden py-20 text-white sm:py-28">
        <Image
          src={unsplashUrl(heroImage.id, 1920, 75)}
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
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-white/40">
              <li>
                <Link href="/" className="hover:text-white/70">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-white/60">{hub.title.split(":")[0]}</li>
            </ol>
          </nav>

          <div
            className="mb-8 h-[2px] w-20"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />

          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {hub.title}
          </h1>

          <div className="mt-6 max-w-2xl space-y-4">
            {hub.intro.map((p, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-white/60 sm:text-lg"
              >
                {p}
              </p>
            ))}
          </div>

          {/* Quick stats */}
          <div className="mt-8 flex flex-wrap gap-4">
            {guides.length > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <BookOpen className="h-4 w-4 text-gold" />
                <span className="text-sm text-white/70">
                  {guides.length} Guides
                </span>
              </div>
            )}
            {calculators.length > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <Calculator className="h-4 w-4 text-gold" />
                <span className="text-sm text-white/70">
                  {calculators.length} Calculators
                </span>
              </div>
            )}
            {comparisons.length > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <Scale className="h-4 w-4 text-gold" />
                <span className="text-sm text-white/70">
                  {comparisons.length} Comparisons
                </span>
              </div>
            )}
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

      {/* Guides Grid */}
      {guides.length > 0 && (
        <section className="bg-background py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              In-Depth Guides
            </p>
            <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
              Read Our Expert Guides
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30"
                >
                  <h3 className="mb-2 font-bold text-foreground group-hover:text-gold-dark">
                    {guide.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {guide.excerpt}
                  </p>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    {guide.readingTime}
                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Calculators Grid */}
      {calculators.length > 0 && (
        <section className="bg-muted/20 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              Financial Calculators
            </p>
            <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
              Model Your Numbers
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {calculators.map((calc) => (
                <Link
                  key={calc.slug}
                  href={`/calculators/${calc.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30"
                >
                  <Calculator className="mb-3 h-5 w-5 text-gold" />
                  <h3 className="mb-1 font-bold text-foreground group-hover:text-gold-dark">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {calc.shortDesc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comparisons */}
      {comparisons.length > 0 && (
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
                Side-by-Side Comparisons
              </p>
              <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
                Compare Your Options
              </h2>

              <div className="space-y-4">
                {comparisons.map((comp) => (
                  <Link
                    key={comp.slug}
                    href={`/compare/${comp.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30"
                  >
                    <div>
                      <h3 className="mb-1 font-bold text-foreground">
                        {comp.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {comp.excerpt}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {services.length > 0 && (
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
                Our Services
              </p>
              <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
                Finance Products
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services#${service.slug}`}
                    className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30"
                  >
                    <h3 className="mb-1 font-bold text-foreground">
                      {service.name}
                    </h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {service.shortDesc}
                    </p>
                    <span className="text-xs font-bold text-gold-dark">
                      {service.typicalRate} &middot; {service.typicalLtv}
                    </span>
                  </Link>
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
            Ready to Get Started?
          </h2>
          <p className="mt-3 text-white/50">
            Tell us about your project and we&apos;ll source the best terms from
            our panel of 100+ lenders. Indicative terms within 24 hours.
          </p>
          <div className="mt-8">
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
          </div>
        </div>
      </section>
    </>
  );
}
