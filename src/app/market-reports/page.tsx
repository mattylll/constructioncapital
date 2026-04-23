import type { Metadata } from "next";

import {
  CTAButton,
  EditorialSection,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
import { MARKET_REPORTS } from "@/lib/market-reports";
import { ReportsGrid } from "./reports-grid";

export const metadata: Metadata = {
  title: "UK Property Market Reports 2026",
  description:
    "Data-driven property market reports for every UK county and region. House prices, transaction volumes, new build analysis, and development finance insights.",
  alternates: {
    canonical: `${SITE_URL}/market-reports`,
  },
  openGraph: {
    title: `UK Property Market Reports 2026 | ${SITE_NAME}`,
    description:
      "In-depth property market analysis across 48 counties, 7 regions, and 5 thematic reports.",
    url: `${SITE_URL}/market-reports`,
    type: "website",
  },
};

export default function MarketReportsPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Market Reports" },
    ],
  };

  const countyCount = MARKET_REPORTS.filter((r) => r.category === "county").length;
  const regionalCount = MARKET_REPORTS.filter((r) => r.category === "regional").length;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <PageHero
        tone="paper"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Market Reports" },
        ]}
        eyebrow="Market intelligence"
        title={
          <>
            Property market,
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              read from the data.
            </span>
          </>
        }
        deck={
          <>
            Live Land Registry readings, town-by-town comparisons and
            development-finance implications for every county we cover. We
            use these reports to price deals and pick lenders &mdash; and
            we publish them in full.
          </>
        }
        stats={[
          { label: "Reports", value: MARKET_REPORTS.length },
          { label: "Counties", value: countyCount },
          { label: "Regional", value: regionalCount },
        ]}
      />

      <EditorialSection tone="paper">
        <ReportsGrid reports={MARKET_REPORTS} />
      </EditorialSection>

      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="From the reports to your deal"
          title={
            <>
              Data informs the price.
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                We negotiate it.
              </span>
            </>
          }
          body="Our reports are the same read we use when structuring live deals. Send us the outline and we come back with indicative terms from the right lenders."
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
