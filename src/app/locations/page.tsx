import type { Metadata } from "next";

import {
  CTAButton,
  EditorialSection,
  Eyebrow,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { CountyCard } from "@/components/locations/county-card";
import { LocationCTA } from "@/components/locations/location-cta";
import { CONTACT, SITE_NAME, SITE_URL, STATS } from "@/lib/constants";
import { getCountyBySlug } from "@/lib/uk-locations-data";

export const metadata: Metadata = {
  title: "Development Finance Across the UK",
  description:
    "Find development finance, bridging loans, mezzanine finance and commercial mortgages across the UK. Expert property finance brokers covering every region from London to Scotland.",
  alternates: {
    canonical: `${SITE_URL}/locations`,
  },
  openGraph: {
    title: `Development Finance Across the UK | ${SITE_NAME}`,
    description:
      "Find development finance, bridging loans, mezzanine finance and commercial mortgages across the UK. Expert property finance brokers covering every region.",
    url: `${SITE_URL}/locations`,
    type: "website",
  },
};

const regions = [
  {
    name: "London & South East",
    counties: [
      "Greater London",
      "Kent",
      "Surrey",
      "Sussex",
      "Hampshire",
      "Berkshire",
      "Buckinghamshire",
      "Oxfordshire",
      "Hertfordshire",
      "Essex",
    ],
  },
  {
    name: "South West",
    counties: ["Bristol", "Somerset", "Devon", "Cornwall", "Dorset", "Wiltshire", "Gloucestershire"],
  },
  {
    name: "Midlands",
    counties: [
      "West Midlands",
      "Warwickshire",
      "Staffordshire",
      "Worcestershire",
      "Shropshire",
      "Derbyshire",
      "Nottinghamshire",
      "Leicestershire",
      "Northamptonshire",
      "Lincolnshire",
    ],
  },
  {
    name: "North West",
    counties: ["Greater Manchester", "Lancashire", "Merseyside", "Cheshire", "Cumbria"],
  },
  {
    name: "North East & Yorkshire",
    counties: [
      "West Yorkshire",
      "South Yorkshire",
      "North Yorkshire",
      "Tyne and Wear",
      "County Durham",
      "Northumberland",
      "East Riding of Yorkshire",
    ],
  },
  {
    name: "East of England",
    counties: ["Norfolk", "Suffolk", "Cambridgeshire", "Bedfordshire"],
  },
  {
    name: "Scotland",
    counties: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Highland", "Fife"],
  },
  {
    name: "Wales",
    counties: ["Cardiff", "Swansea", "Newport", "Powys", "Gwynedd"],
  },
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function getTownCount(countyName: string): number {
  const county = getCountyBySlug(slugify(countyName));
  return county?.towns.length ?? 0;
}

export default function LocationsPage() {
  const totalCounties = regions.reduce((sum, r) => sum + r.counties.length, 0);
  const totalTowns = regions.reduce(
    (sum, r) =>
      sum + r.counties.reduce((s, c) => s + getTownCount(c), 0),
    0
  );

  return (
    <>
      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Locations" }]}
        eyebrow="Nationwide coverage"
        title={
          <>
            Development finance,
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              everywhere we&rsquo;re needed.
            </span>
          </>
        }
        deck={
          <>
            From London to Edinburgh, Bristol to Newcastle &mdash; we arrange
            property development finance in every corner of the United
            Kingdom. Choose a region below, or start a deal directly.
          </>
        }
        stats={[
          { label: "Counties covered", value: totalCounties },
          { label: "Towns tracked", value: totalTowns },
          { label: "Lender panel", value: STATS.lenderPanel },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-4">
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

      {/* ━━━ Regions ━━━ */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow="Find your area"
          title="Explore by region."
          body="Every region of the UK is covered by our lender panel. Select a county to see local market data, planning activity, recent transactions and the services we arrange there."
        />
        <div className="mt-16 space-y-16">
          {regions.map((region) => (
            <div key={region.name}>
              <div className="mb-8 flex items-baseline gap-6">
                <Eyebrow tone="paper">{region.name}</Eyebrow>
                <span
                  aria-hidden
                  className="h-px flex-1"
                  style={{ background: "var(--stone-dark)" }}
                />
                <span
                  className="text-[11px] font-medium uppercase tracking-[0.24em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  {region.counties.length} counties
                </span>
              </div>

              <div
                className="grid grid-cols-1 gap-px border-y sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                style={{
                  borderColor: "var(--stone-dark)",
                  backgroundColor: "var(--stone-dark)",
                }}
              >
                {region.counties.map((county) => (
                  <CountyCard
                    key={county}
                    name={county}
                    slug={slugify(county)}
                    townCount={getTownCount(county)}
                    region={region.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </EditorialSection>

      {/* ━━━ Why local ━━━ */}
      <EditorialSection tone="navy">
        <SectionHeader
          tone="navy"
          eyebrow="Local expertise"
          title={
            <>
              Property development
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                is inherently local.
              </span>
            </>
          }
          body="Planning authorities, land values, build costs and buyer demand all vary by market. Our lender relationships span the whole UK, but we know a Home Counties scheme needs a different funder to a North West regeneration site."
        />
      </EditorialSection>

      {/* ━━━ CTA strip (existing component, kept as-is for now) ━━━ */}
      <LocationCTA />
    </>
  );
}
