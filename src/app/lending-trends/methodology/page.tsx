import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Development Lending Monitor Methodology v1.0",
  description:
    "How the Development Lending Monitor is built: Companies House charge data, the three-tier lender set, SPV resolution, property-level regional attribution, censoring-safe redemption cohorts, sample floors and the revision policy.",
  alternates: { canonical: `${SITE_URL}/lending-trends/methodology` },
};

interface StatsPack {
  meta: {
    period: string;
    methodologyVersion: string;
    minSampleFloor: number;
    dataVintage: { chargesMax: string; satisfiedMax: string; landRegistryMax: string | null };
  };
  regional: { ecosystem: { coveragePct: number; suppressed: string[] } };
  suppressedCuts: string[];
}

function latestPack(): StatsPack | null {
  try {
    const dir = path.join(process.cwd(), "data", "lending-monitor", "stats");
    const files = fs.readdirSync(dir).filter((f) => f.startsWith("stats-")).sort();
    if (!files.length) return null;
    return JSON.parse(fs.readFileSync(path.join(dir, files[files.length - 1]), "utf-8"));
  } catch {
    return null;
  }
}

const SECTIONS: { heading: string; paras: string[] }[] = [
  {
    heading: "What the Monitor measures",
    paras: [
      "The Development Lending Monitor measures secured lending activity by development-active lenders in the United Kingdom. Its primary source is the register of mortgages and charges at Companies House: every time a lender takes security over a company's assets, a charge is registered, with the lender named as the person entitled, dated on creation and again on satisfaction.",
      "Companies House has not recorded the amount secured since the 2013 charge-registration reform, so the Monitor never publishes loan values or market-size estimates in pounds. Activity is measured in counts: facilities registered, distinct borrowers, redemptions, refinance events. Counts are verifiable against the public register by anyone; estimated volumes are not.",
    ],
  },
  {
    heading: "The lender set",
    paras: [
      "A charge is attributed to the development lending market when the person entitled resolves to a curated set of development-active lenders, maintained in three tiers. Tier one: pure-play development lenders, whose whole book is development finance. Tier two: banks and bridging lenders with substantial development arms; these define the wider short-term property funding ecosystem that headline figures describe. Tier three: institutional real estate credit funds, reported separately.",
      "Lenders commonly lend through numbered funding vehicles, security trustees and designated activity companies rather than their trading name. The Monitor resolves these to the economic lender: each vehicle is verified against the company register (shared registered offices, incorporation patterns and filing history) before being linked. Vehicles that cannot be verified are left unattributed rather than guessed.",
      "No individual lender is named, ranked or identified in any Monitor publication. Concentration is reported only in aggregate: the share of activity accounted for by the five and ten most active lenders, and a Herfindahl-Hirschman index.",
    ],
  },
  {
    heading: "Regional attribution",
    paras: [
      "Development SPVs are usually registered at an accountant's or solicitor's address, most often in London, so a borrower's registered office is a poor guide to where a scheme is. In our testing the registered office sat in a different postcode area from the charged property in 62% of development-lender charges.",
      "The Monitor instead extracts the charged property's postcode from the legal particulars of each filing and maps it to region through a postcode-district bridge built from HM Land Registry price-paid records. Regional figures therefore describe where the security is, not where the borrower's accountant is. Coverage of property postcodes is stated in every edition; charges whose particulars carry no usable postcode are excluded from regional cuts rather than guessed. Coverage is England and Wales, matching the underlying land registration data.",
    ],
  },
  {
    heading: "Redemption cohorts and censoring",
    paras: [
      "Redemption speed is reported as a fixed-window rate: the share of facilities originated in a calendar year that were fully satisfied within 18 months. A cohort is only reported once every loan in it has had the complete 18-month window to run. Without this rule, recent cohorts mechanically look faster simply because their slower loans have not had time to redeem; several published analyses of this data make exactly that error.",
    ],
  },
  {
    heading: "Refinance and junior-debt identification",
    paras: [
      "Where two charges are registered against the same property title by unrelated lenders, the sequencing identifies the product. A senior charge satisfied at or near the registration of a successor is counted as a refinance event. A junior charge registered while an unrelated senior remains outstanding is counted as third-party junior debt, the signature of mezzanine and second-charge lending. Structures within the same lender group, including a lender's own security trustee, are excluded from both counts.",
    ],
  },
  {
    heading: "Suppression, revision and corrections",
    paras: [
      "Any cut with fewer observations than the minimum sample floor is suppressed and listed as suppressed, never published as a small-number statistic and never silently dropped.",
      "Each edition states the true extent of its underlying data: the most recent charge creation, satisfaction filing and land-registration dates, which lag real time. Editions are not revised after publication except to correct errors; corrections are noted on the affected page with the date and the nature of the change. The methodology itself is versioned, and changes that would break comparability across editions trigger a new version number with the change described here.",
    ],
  },
];

export default function MethodologyPage() {
  const pack = latestPack();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Development Lending Monitor", item: `${SITE_URL}/lending-trends` },
      { "@type": "ListItem", position: 3, name: "Methodology" },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        tone="paper"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Lending Monitor", href: "/lending-trends" },
          { label: "Methodology" },
        ]}
        eyebrow={`Methodology v${pack?.meta.methodologyVersion ?? "1.0"}`}
        title={
          <>
            How the Monitor
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              is built.
            </span>
          </>
        }
        deck="Sources, definitions, known limitations and the revision policy. If you are fact-checking a Monitor statistic, this page and the open-data files are what you need."
      />

      <section className="py-16" style={{ background: "var(--paper)" }}>
        <div className="mx-auto max-w-[820px] px-6 sm:px-10">
          {SECTIONS.map((s, i) => (
            <div key={i} className="mb-12">
              <h2
                className="font-heading mb-4 text-[1.6rem] font-medium tracking-tight"
                style={{ color: "var(--navy-dark)" }}
              >
                {s.heading}
              </h2>
              {s.paras.map((p, j) => (
                <p key={j} className="mb-4 text-[16px] leading-[1.7]" style={{ color: "oklch(0.32 0.04 255)" }}>
                  {p}
                </p>
              ))}
            </div>
          ))}

          {pack && (
            <div
              className="mb-12 rounded-lg border p-6 text-[14px] leading-relaxed"
              style={{ borderColor: "var(--stone-dark)", background: "white", color: "oklch(0.35 0.04 255)" }}
            >
              <h2 className="font-heading mb-3 text-lg font-medium" style={{ color: "var(--navy-dark)" }}>
                Current edition: {pack.meta.period}
              </h2>
              <ul className="space-y-1">
                <li>Charge data to {pack.meta.dataVintage.chargesMax}; satisfaction filings to {pack.meta.dataVintage.satisfiedMax}.</li>
                <li>Property-postcode coverage for regional cuts: {pack.regional.ecosystem.coveragePct}% of ecosystem charges.</li>
                <li>Minimum sample floor: {pack.meta.minSampleFloor} observations.</li>
                <li>
                  Suppressed cuts this edition:{" "}
                  {pack.suppressedCuts.length === 0 && pack.regional.ecosystem.suppressed.length === 0
                    ? "none"
                    : [...pack.suppressedCuts, ...pack.regional.ecosystem.suppressed].join("; ")}
                </li>
                <li>
                  Open data:{" "}
                  <a className="underline" href="/data/lending-monitor-stats-h1-2026.json">
                    lending-monitor-stats-h1-2026.json
                  </a>
                </li>
              </ul>
            </div>
          )}

          <div className="mb-12">
            <h2 className="font-heading mb-4 text-[1.6rem] font-medium tracking-tight" style={{ color: "var(--navy-dark)" }}>
              Citing the Monitor
            </h2>
            <p className="mb-4 text-[16px] leading-[1.7]" style={{ color: "oklch(0.32 0.04 255)" }}>
              Statistics and charts may be reproduced with attribution. Suggested citation:
            </p>
            <p
              className="rounded-lg border p-4 font-mono text-[13px]"
              style={{ borderColor: "var(--stone-dark)", background: "white", color: "oklch(0.35 0.04 255)" }}
            >
              Construction Capital, Development Lending Monitor {pack?.meta.period ?? ""},
              constructioncapital.co.uk/lending-trends
            </p>
            <p className="mt-4 text-[14px]" style={{ color: "oklch(0.42 0.03 255)" }}>
              Data desk: custom aggregate cuts for journalists and lenders on request (no lender-level
              figures) via the <Link href="/contact" className="underline">contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
