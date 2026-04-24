import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calculator, BookOpen, Scale } from "lucide-react";

import { JsonLd } from "@/components/ui/json-ld";
import {
  CTAButton,
  EditorialSection,
  SectionHeader,
} from "@/components/editorial/primitives";
import { SITE_NAME, SITE_URL, CONTACT } from "@/lib/constants";
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
  const guides = GUIDES.filter(
    (g) =>
      hub.guideCategories.includes(g.category) ||
      hub.guideSlugs.includes(g.slug),
  );

  const calculators = CALCULATORS.filter((c) =>
    hub.calculatorSlugs.includes(c.slug),
  );

  const services = SERVICES.filter((s) => hub.serviceSlugs.includes(s.slug));

  const comparisons = PRODUCT_COMPARISONS.filter((c) =>
    hub.comparisonSlugs.includes(c.slug),
  );

  const heroImage = SITE_IMAGES[hub.heroImageKey] ?? SITE_IMAGES["guides-hero"];

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

  const stats: { label: string; value: number; icon: typeof BookOpen }[] = [];
  if (guides.length > 0) stats.push({ label: "Guides", value: guides.length, icon: BookOpen });
  if (calculators.length > 0) stats.push({ label: "Calculators", value: calculators.length, icon: Calculator });
  if (comparisons.length > 0) stats.push({ label: "Comparisons", value: comparisons.length, icon: Scale });

  return (
    <>
      <JsonLd data={webPageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero — image-backed editorial */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--navy-dark)" }}
      >
        <Image
          src={unsplashUrl(heroImage.id, 1920, 75)}
          alt=""
          fill
          className="object-cover opacity-45"
          priority
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.12 0.05 255 / 0.40) 0%, oklch(0.12 0.05 255 / 0.85) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-[1360px] px-6 py-24 sm:py-32 sm:px-10">
          <nav className="mb-10">
            <ol className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em]" style={{ color: "oklch(1 0 0 / 0.55)" }}>
              <li>
                <Link href="/" className="transition-colors hover:text-[color:var(--gold-light)]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li style={{ color: "oklch(1 0 0 / 0.9)" }}>{hub.title.split(":")[0]}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-4">
            <span aria-hidden className="block h-px w-10" style={{ background: "var(--gold)" }} />
            <p
              className="text-[11px] font-medium uppercase tracking-[0.32em]"
              style={{ color: "var(--gold-light)" }}
            >
              Topic hub
            </p>
          </div>

          <h1
            className="font-heading mt-8 max-w-4xl text-[2.75rem] font-medium leading-[1.04] tracking-[-0.015em] sm:text-[3.75rem] md:text-[4.25rem]"
            style={{ color: "oklch(1 0 0 / 0.96)" }}
          >
            {hub.title}
          </h1>

          <div
            className="mt-8 max-w-2xl space-y-4 text-[17px] leading-[1.7]"
            style={{ color: "oklch(1 0 0 / 0.72)" }}
          >
            {hub.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {stats.length > 0 && (
            <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t pt-8" style={{ borderColor: "oklch(1 0 0 / 0.14)" }}>
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <Icon className="h-4 w-4" style={{ color: "var(--gold-light)" }} />
                    <div>
                      <dt
                        className="text-[10px] font-medium uppercase tracking-[0.24em]"
                        style={{ color: "oklch(1 0 0 / 0.55)" }}
                      >
                        {stat.label}
                      </dt>
                      <dd
                        className="numeral-tabular font-heading mt-1 text-[1.5rem] font-medium tracking-tight"
                        style={{ color: "oklch(1 0 0 / 0.95)" }}
                      >
                        {stat.value}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          )}
        </div>

        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-[2px] w-32"
          style={{ background: "var(--gold)" }}
        />
      </section>

      {/* Guides Grid */}
      {guides.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="In-depth guides"
            title={
              <>
                Read the
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  expert guides.
                </span>
              </>
            }
          />
          <div
            className="mt-16 grid gap-px border-y sm:grid-cols-2 lg:grid-cols-3"
            style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
          >
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group flex flex-col gap-4 px-7 py-8 transition-colors"
                style={{ background: "var(--paper)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="font-heading text-[20px] font-medium leading-[1.2] tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {guide.title}
                  </h3>
                  <ArrowUpRight
                    className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    style={{ color: "var(--gold-dark)" }}
                  />
                </div>
                <p
                  className="line-clamp-2 text-[15px] leading-[1.55]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  {guide.excerpt}
                </p>
                <span
                  className="mt-auto text-[10px] font-medium uppercase tracking-[0.22em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  {guide.readingTime}
                </span>
              </Link>
            ))}
          </div>
        </EditorialSection>
      )}

      {/* Calculators Grid */}
      {calculators.length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="Financial calculators"
            title={
              <>
                Model the numbers
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  for your scheme.
                </span>
              </>
            }
          />
          <div
            className="mt-16 grid gap-px border-y sm:grid-cols-2 lg:grid-cols-3"
            style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
          >
            {calculators.map((calc) => (
              <Link
                key={calc.slug}
                href={`/calculators/${calc.slug}`}
                className="group flex flex-col gap-4 px-7 py-8 transition-colors"
                style={{ background: "var(--stone)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <Calculator
                    className="h-4 w-4"
                    style={{ color: "var(--gold-dark)" }}
                  />
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    style={{ color: "var(--gold-dark)" }}
                  />
                </div>
                <h3
                  className="font-heading text-[20px] font-medium leading-[1.2] tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {calc.name}
                </h3>
                <p
                  className="text-[15px] leading-[1.55]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  {calc.shortDesc}
                </p>
              </Link>
            ))}
          </div>
        </EditorialSection>
      )}

      {/* Comparisons */}
      {comparisons.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="Side by side"
            title={
              <>
                Compare
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  your options.
                </span>
              </>
            }
          />
          <div
            className="mt-16 grid gap-px border-y sm:grid-cols-2"
            style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
          >
            {comparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="group flex items-start justify-between gap-6 px-7 py-7 transition-colors"
                style={{ background: "var(--paper)" }}
              >
                <div>
                  <h3
                    className="font-heading text-[20px] font-medium leading-[1.2] tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {comp.title}
                  </h3>
                  <p
                    className="mt-3 line-clamp-2 text-[14px] leading-[1.55]"
                    style={{ color: "oklch(0.35 0.04 255)" }}
                  >
                    {comp.excerpt}
                  </p>
                </div>
                <ArrowUpRight
                  className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  style={{ color: "var(--gold-dark)" }}
                />
              </Link>
            ))}
          </div>
        </EditorialSection>
      )}

      {/* Related Services */}
      {services.length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="Our services"
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
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col gap-4 px-7 py-8 transition-colors"
                style={{ background: "var(--stone)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="font-heading text-[22px] font-medium leading-[1.2] tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {service.name}
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
                  {service.shortDesc}
                </p>
                <span
                  className="numeral-tabular text-[11px] font-medium uppercase tracking-[0.22em]"
                  style={{ color: "var(--gold-dark)" }}
                >
                  {service.typicalRate} · {service.typicalLtv}
                </span>
              </Link>
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
              Ready to get started?
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
