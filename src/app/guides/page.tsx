import type { Metadata } from "next";

import {
  CTAButton,
  EditorialSection,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
import { GUIDES } from "@/lib/guides";
import type { GuideCategory } from "@/lib/guides";
import { SITE_IMAGES, unsplashUrl } from "@/lib/location-images";
import { GuidesGrid } from "./guides-grid";

// Build category→image URL map for the client grid
const categoryImageUrls: Partial<Record<GuideCategory, string>> = {};
for (const cat of new Set(GUIDES.map((g) => g.category))) {
  const img = SITE_IMAGES[`guide-${cat}`];
  if (img) categoryImageUrls[cat] = unsplashUrl(img.id, 640, 60);
}

export const metadata: Metadata = {
  title: "Property Development Finance Guides",
  description:
    "In-depth guides to UK property development finance. Learn about development finance, bridging loans, mezzanine, GDV calculations, and how to fund your next project.",
  alternates: {
    canonical: `${SITE_URL}/guides`,
  },
  openGraph: {
    title: `Property Development Finance Guides | ${SITE_NAME}`,
    description:
      "In-depth guides to UK property development finance covering every funding type.",
    url: `${SITE_URL}/guides`,
    type: "website",
  },
};

export default function GuidesPage() {
  const categoryCount = new Set(GUIDES.map((g) => g.category)).size;

  return (
    <>
      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Guides" }]}
        eyebrow="Knowledge base"
        title={
          <>
            Development finance,
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              written by practitioners.
            </span>
          </>
        }
        deck={
          <>
            In-depth coverage of every aspect of UK property development
            finance &mdash; application, structuring, fees, valuations,
            exits and everything in between. No fluff, no generic copy.
          </>
        }
        stats={[
          { label: "Articles", value: GUIDES.length },
          { label: "Topics", value: categoryCount },
          { label: "Panel", value: "100+ lenders" },
        ]}
      />

      <EditorialSection tone="paper">
        <GuidesGrid guides={GUIDES} categoryImages={categoryImageUrls} />
      </EditorialSection>

      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="From reading to doing"
          title={
            <>
              The guides give you knowledge.
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                We give you the funding.
              </span>
            </>
          }
          body="Tell us the outline of your deal and we come back with indicative terms from the right lenders inside a working day."
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
