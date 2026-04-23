import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  CTAButton,
  EditorialSection,
  Eyebrow,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { SERVICES } from "@/lib/services";
import { SERVICE_POPULAR_LOCATIONS } from "@/lib/location-content";
import { getServiceImage, serviceImageUrl } from "@/lib/service-images";
import { CONTACT, STATS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Development finance, mezzanine, bridging loans, equity & JV, refurbishment finance, commercial mortgages, and development exit finance. The full capital stack for UK property developers.",
};

const useCases: Record<string, string[]> = {
  "development-finance": [
    "Ground-up residential developments",
    "Commercial new builds",
    "Land acquisition with planning",
    "Phased construction projects",
  ],
  "mezzanine-finance": [
    "Reducing equity contribution",
    "Stretching the capital stack",
    "Unlocking additional projects",
    "Maximising leverage",
  ],
  "bridging-loans": [
    "Auction purchases (28-day completion)",
    "Chain breaks",
    "Pre-planning acquisitions",
    "Refurbishment bridge-to-let",
  ],
  "equity-jv": [
    "First-time developer schemes",
    "Capital-light structures",
    "Large-scale residential projects",
    "Strategic land acquisitions",
  ],
  "refurbishment-finance": [
    "Light refurbishment projects",
    "Heavy refurbishment & conversions",
    "HMO conversions",
    "Commercial-to-residential (PDR)",
  ],
  "commercial-mortgages": [
    "Office acquisitions",
    "Retail unit purchases",
    "Industrial & warehouse facilities",
    "Mixed-use investment refinancing",
  ],
  "development-exit-finance": [
    "Completed schemes with unsold units",
    "Replacing maturing development facilities",
    "Sales period bridge funding",
    "Phased unit disposal strategies",
  ],
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        eyebrow="The full capital stack"
        title={
          <>
            Seven funding routes.
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              One broker.
            </span>
          </>
        }
        deck={
          <>
            Senior debt, mezzanine, bridging, equity, refurbishment, commercial
            mortgages and exit finance &mdash; arranged for UK property
            developers. Over {STATS.lenderPanel} lenders, structured on the
            deal, not the product sheet.
          </>
        }
        stats={[
          { label: "Arranged", value: `£${STATS.fundsArranged}` },
          { label: "Lender panel", value: STATS.lenderPanel },
          { label: "Years", value: STATS.yearsExperience },
        ]}
        actions={
          <div className="flex flex-wrap gap-4">
            <CTAButton href="/deal-room" variant="navy" size="lg">
              Start a deal
            </CTAButton>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="numeral-tabular editorial-link inline-flex h-14 items-center text-lg font-medium tracking-tight"
              style={{ color: "var(--navy-dark)" }}
            >
              Or call {CONTACT.phone}
            </a>
          </div>
        }
      />

      {/* ━━━ Services list — editorial alternating rhythm ━━━ */}
      {SERVICES.map((service, i) => {
        const cases = useCases[service.slug] ?? [];
        const popular = SERVICE_POPULAR_LOCATIONS[service.slug] ?? [];
        const tone = i % 2 === 0 ? "paper" : "stone";
        const image = getServiceImage(service.slug);
        const imageSrc = serviceImageUrl(service.slug, 1800);

        return (
          <EditorialSection
            key={service.slug}
            tone={tone}
            id={service.slug}
            className="scroll-mt-24"
          >
            {image && imageSrc && (
              <figure
                className="relative mb-12 overflow-hidden border lg:mb-16"
                style={{ borderColor: "var(--stone-dark)" }}
              >
                <div className="relative aspect-[21/9] w-full">
                  <Image
                    src={imageSrc}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1280px"
                    className="object-cover"
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, oklch(0.18 0.05 255 / 0) 45%, oklch(0.18 0.05 255 / 0.55) 100%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-24"
                    style={{ background: "var(--gold)" }}
                  />
                  <figcaption
                    className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-6"
                  >
                    <span
                      className="font-heading text-xl font-medium italic tracking-tight sm:text-2xl"
                      style={{ color: "oklch(1 0 0 / 0.96)" }}
                    >
                      {service.name}
                    </span>
                    <span
                      className="hidden text-[10px] font-medium uppercase tracking-[0.28em] sm:inline"
                      style={{ color: "oklch(1 0 0 / 0.78)" }}
                    >
                      {String(i + 1).padStart(2, "0")} / {SERVICES.length.toString().padStart(2, "0")}
                    </span>
                  </figcaption>
                </div>
              </figure>
            )}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left: name + description + metrics */}
              <div className="lg:col-span-7">
                <Eyebrow tone={tone} className="mb-5">
                  {String(i + 1).padStart(2, "0")} &middot; {service.name}
                </Eyebrow>
                <h2
                  className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-[3rem]"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {service.name}
                </h2>
                <p
                  className="mt-6 max-w-[48ch] text-[17px] leading-[1.65]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  {service.longDesc}
                </p>

                <dl
                  className="mt-10 grid grid-cols-3 gap-6 border-y py-7"
                  style={{ borderColor: "var(--stone-dark)" }}
                >
                  <div>
                    <dt
                      className="text-[10px] font-medium uppercase tracking-[0.24em]"
                      style={{ color: "oklch(0.50 0.02 255)" }}
                    >
                      Rate
                    </dt>
                    <dd
                      className="numeral-tabular font-heading mt-2 text-xl font-medium tracking-tight"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {service.typicalRate}
                    </dd>
                  </div>
                  <div>
                    <dt
                      className="text-[10px] font-medium uppercase tracking-[0.24em]"
                      style={{ color: "oklch(0.50 0.02 255)" }}
                    >
                      Leverage
                    </dt>
                    <dd
                      className="numeral-tabular font-heading mt-2 text-xl font-medium tracking-tight"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {service.typicalLtv}
                    </dd>
                  </div>
                  <div>
                    <dt
                      className="text-[10px] font-medium uppercase tracking-[0.24em]"
                      style={{ color: "oklch(0.50 0.02 255)" }}
                    >
                      Term
                    </dt>
                    <dd
                      className="numeral-tabular font-heading mt-2 text-xl font-medium tracking-tight"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {service.typicalTerm}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-wrap gap-3">
                  <CTAButton
                    href={`/services/${service.slug}`}
                    variant="outline-light"
                  >
                    Read more
                  </CTAButton>
                  <CTAButton href="/deal-room" variant="navy">
                    Start a deal
                  </CTAButton>
                </div>

                {popular.length > 0 && (
                  <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span
                      className="text-[10px] font-medium uppercase tracking-[0.26em]"
                      style={{ color: "oklch(0.50 0.02 255)" }}
                    >
                      Active markets
                    </span>
                    {popular.map((loc, idx) => (
                      <span
                        key={loc.town}
                        className="flex items-center gap-2 text-[13px]"
                        style={{ color: "oklch(0.32 0.04 255)" }}
                      >
                        <Link
                          href={`/locations/${loc.county}/${loc.town}/${service.slug}`}
                          className="editorial-link"
                        >
                          {loc.label}
                        </Link>
                        {idx < popular.length - 1 && (
                          <span style={{ color: "oklch(0.70 0.02 255)" }}>
                            &middot;
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: use cases */}
              <aside className="lg:col-span-4 lg:col-start-9">
                <p
                  className="text-[10px] font-medium uppercase tracking-[0.28em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  Typical use cases
                </p>
                <ul
                  className="mt-6 divide-y"
                  style={{ borderColor: "var(--stone-dark)" }}
                >
                  {cases.map((useCase) => (
                    <li
                      key={useCase}
                      className="flex items-start gap-3 border-t py-4 first:border-t-0 first:pt-0"
                      style={{ borderColor: "var(--stone-dark)" }}
                    >
                      <span
                        aria-hidden
                        className="mt-[0.55rem] block h-1 w-1 flex-shrink-0 rounded-full"
                        style={{ background: "var(--gold)" }}
                      />
                      <span
                        className="text-[15px] leading-[1.5]"
                        style={{ color: "oklch(0.32 0.04 255)" }}
                      >
                        {useCase}
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </EditorialSection>
        );
      })}

      {/* ━━━ Close: not sure which product fits? ━━━ */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Not sure which product fits?"
          title={
            <>
              Tell us the deal.
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                We&rsquo;ll recommend the structure.
              </span>
            </>
          }
          body={
            <>
              Most schemes use a combination of products to optimise leverage
              and cost. A two-minute conversation usually tells us which layers
              belong in the stack and which lenders should see the deal first.
            </>
          }
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
