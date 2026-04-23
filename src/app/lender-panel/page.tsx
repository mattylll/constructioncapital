import type { Metadata } from "next";

import {
  CTAButton,
  EditorialSection,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { LenderGrid } from "@/components/lender-panel/lender-grid";
import { LENDERS, LENDER_TYPES } from "@/lib/lenders";
import { SERVICES } from "@/lib/services";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Our Lender Panel | ${SITE_NAME}`,
  description:
    "Access to 100+ lenders across the UK development finance market. Senior debt, mezzanine, bridging, equity and commercial mortgage lenders - all vetted and relationship-managed.",
  alternates: {
    canonical: `${SITE_URL}/lender-panel`,
  },
  openGraph: {
    title: `Our Lender Panel | ${SITE_NAME}`,
    description:
      "Access to 100+ lenders across the UK development finance market.",
    url: `${SITE_URL}/lender-panel`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Our Lender Panel | ${SITE_NAME}`,
    description:
      "Access to 100+ lenders across the UK development finance market.",
  },
};

const brokerAdvantage = [
  {
    title: "Wider access",
    body:
      "One application reaches 100+ lenders. We know which are active, which have appetite, and which will move fastest for your scheme.",
  },
  {
    title: "Better terms",
    body:
      "Lenders compete for your deal. We use volume and relationships to negotiate rates, fees and covenant packages.",
  },
  {
    title: "Faster decisions",
    body:
      "Direct relationships with credit committees mean fewer rounds. We know exactly what each lender needs to see.",
  },
  {
    title: "Structuring",
    body:
      "Complex deals need creative stacks. We combine senior, mezzanine and equity from multiple lenders into one coherent facility.",
  },
];

export default function LenderPanelPage() {
  const uniqueServices = [...new Set(LENDERS.flatMap((l) => l.services))];
  const serviceNames = uniqueServices
    .map((slug) => SERVICES.find((s) => s.slug === slug)?.name)
    .filter(Boolean);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Our Lender Panel" },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "UK Development Finance Lender Panel",
    description:
      "A curated panel of UK development finance lenders covering senior debt, mezzanine, bridging, equity and commercial mortgages.",
    numberOfItems: LENDERS.length,
    itemListElement: LENDERS.map((lender, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: lender.name,
      url: `${SITE_URL}/lender-panel/${lender.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />

      <PageHero
        tone="paper"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Lender Panel" },
        ]}
        eyebrow="The panel"
        title={
          <>
            Over 100 lenders.
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              One directory.
            </span>
          </>
        }
        deck={
          <>
            Every lender on the panel is relationship-managed &mdash;
            meaning direct access to the credit committee, not a call
            centre. From high-street banks to family offices to
            institutional debt, the full capital stack is covered.
          </>
        }
        stats={[
          { label: "Lenders on file", value: LENDERS.length },
          { label: "Lender types", value: LENDER_TYPES.length },
          { label: "Products covered", value: serviceNames.length },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-4">
            <CTAButton href="/deal-room" variant="navy" size="lg">
              Submit your deal
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

      {/* ━━━ Lender grid ━━━ */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow="Browse the panel"
          title="A selection of the lenders we work with."
          body="Illustrative of the panel&rsquo;s breadth. Matt maintains the working relationships, including lenders not listed publicly."
        />
        <div className="mt-14">
          <LenderGrid lenders={LENDERS} />
        </div>
      </EditorialSection>

      {/* ━━━ Lender types ━━━ */}
      <EditorialSection tone="stone">
        <SectionHeader
          tone="stone"
          eyebrow="Lender categories"
          title="Who actually funds these deals."
          body="We group the panel by the type of capital on offer. Different schemes need different lenders &mdash; and the right match usually sets the price."
        />
        <ul
          className="mt-14 grid grid-cols-1 gap-px border-y sm:grid-cols-2 lg:grid-cols-3"
          style={{
            borderColor: "var(--stone-dark)",
            backgroundColor: "var(--stone-dark)",
          }}
        >
          {LENDER_TYPES.map((type) => {
            const count = LENDERS.filter((l) => l.type === type.slug).length;
            return (
              <li
                key={type.slug}
                className="flex flex-col gap-3 p-7"
                style={{ background: "var(--stone)" }}
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-[0.55rem] block h-1 w-1 flex-shrink-0 rounded-full"
                    style={{ background: "var(--gold)" }}
                  />
                  <h3
                    className="font-heading text-lg font-medium leading-tight tracking-tight"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {type.label}
                  </h3>
                </div>
                <p
                  className="pl-4 text-[14px] leading-[1.55]"
                  style={{ color: "oklch(0.42 0.03 255)" }}
                >
                  {type.description}
                </p>
                <p
                  className="numeral-tabular mt-auto pl-4 text-[12px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: "var(--gold-dark)" }}
                >
                  {count} lender{count !== 1 ? "s" : ""} on file
                </p>
              </li>
            );
          })}
        </ul>
      </EditorialSection>

      {/* ━━━ Why use a broker ━━━ */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow="The broker advantage"
          title="Four things a panel does that a price-comparison sheet can&rsquo;t."
        />
        <ol
          className="mt-14 grid grid-cols-1 gap-px border-y sm:grid-cols-2 lg:grid-cols-4"
          style={{
            borderColor: "var(--stone-dark)",
            backgroundColor: "var(--stone-dark)",
          }}
        >
          {brokerAdvantage.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-4 p-8"
              style={{ background: "var(--paper)" }}
            >
              <p
                className="numeral-tabular font-heading text-4xl font-medium tracking-tight"
                style={{ color: "var(--gold-dark)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3
                className="font-heading text-xl font-medium leading-tight tracking-tight"
                style={{ color: "var(--navy-dark)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-[14px] leading-[1.6]"
                style={{ color: "oklch(0.42 0.03 255)" }}
              >
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </EditorialSection>

      {/* ━━━ CTA ━━━ */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Use the panel"
          title={
            <>
              One call reaches the
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                right lender for your deal.
              </span>
            </>
          }
          body="Send us the outline and we come back with indicative terms from the best-fit lenders inside a working day."
        />
        <div className="mt-12 flex flex-wrap items-center gap-5">
          <CTAButton href="/deal-room" variant="gold" size="lg">
            Submit your deal
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
