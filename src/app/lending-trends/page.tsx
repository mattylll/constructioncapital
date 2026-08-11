import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Landmark, ScrollText } from "lucide-react";

import { CTAButton, PageHero } from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { MARKET_REPORTS } from "@/lib/market-reports";

export const metadata: Metadata = {
  title: "Development Lending Monitor | UK Development Finance Data",
  description:
    "Quarterly analysis of UK development lending built from Companies House charge registrations: facility counts, lender breadth, redemption rates, refinance and mezzanine activity, regionally attributed to the property.",
  alternates: { canonical: `${SITE_URL}/lending-trends` },
  openGraph: {
    title: `Development Lending Monitor | ${SITE_NAME}`,
    description:
      "The quarterly data series on UK development finance activity. National, regional and product editions, published as open data.",
    url: `${SITE_URL}/lending-trends`,
    type: "website",
  },
};

export default function LendingTrendsPage() {
  const lending = MARKET_REPORTS.filter((r) => r.category === "lending");
  const national = lending.filter((r) => !r.region && r.slug.startsWith("development-lending-monitor"));
  const regional = lending.filter((r) => r.region);
  const product = lending.filter(
    (r) => !r.region && !r.slug.startsWith("development-lending-monitor")
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Development Lending Monitor" },
    ],
  };

  const groups: { label: string; icon: typeof Landmark; reports: typeof lending; blurb: string }[] = [
    {
      label: "National Monitor",
      icon: Landmark,
      reports: national,
      blurb: "The flagship quarterly read on UK development lending activity.",
    },
    {
      label: "Regional editions",
      icon: FileText,
      reports: regional,
      blurb: "Attributed to the charged property, not the borrower's registered office.",
    },
    {
      label: "Product monitors",
      icon: ScrollText,
      reports: product,
      blurb: "Development exit, refinance and mezzanine activity from title-level charge sequencing.",
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Development Lending Monitor" }]}
        eyebrow="Quarterly data series"
        title={
          <>
            The Development
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              Lending Monitor.
            </span>
          </>
        }
        deck="UK development finance activity measured from primary sources: every mortgage and charge registered at Companies House, resolved through lenders' funding vehicles, located by the charged property. Published quarterly, with the aggregates released as open data. No lender is named or ranked."
      />

      <section className="py-16 sm:py-20" style={{ background: "var(--paper)" }}>
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
          {groups.map((g) => (
            <div key={g.label} className="mb-14">
              <div className="mb-6 flex items-center gap-3">
                <g.icon className="h-5 w-5" style={{ color: "var(--gold-dark)" }} />
                <h2
                  className="font-heading text-2xl font-medium tracking-tight"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {g.label}
                </h2>
              </div>
              <p className="mb-6 max-w-[60ch] text-[15px]" style={{ color: "oklch(0.40 0.03 255)" }}>
                {g.blurb}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.reports.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/market-reports/${r.slug}`}
                    className="group rounded-lg border p-5 transition-shadow hover:shadow-md"
                    style={{ borderColor: "var(--stone-dark)", background: "white" }}
                  >
                    <h3
                      className="mb-2 font-heading text-[17px] font-medium leading-snug"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {r.title}
                    </h3>
                    <p className="mb-3 text-[13px] leading-relaxed" style={{ color: "oklch(0.42 0.03 255)" }}>
                      {r.excerpt}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 text-[12px] font-medium uppercase tracking-[0.18em]"
                      style={{ color: "var(--gold-dark)" }}
                    >
                      Read <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div
            className="mt-4 flex flex-col gap-4 rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: "var(--stone-dark)", background: "white" }}
          >
            <div>
              <h2 className="font-heading mb-1 text-xl font-medium" style={{ color: "var(--navy-dark)" }}>
                Methodology, definitions and open data
              </h2>
              <p className="max-w-[64ch] text-[14px]" style={{ color: "oklch(0.42 0.03 255)" }}>
                Sources, the lender-set inclusion rationale, coverage rates, known limitations and the
                revision policy, plus the machine-readable aggregates behind every edition.
              </p>
            </div>
            <CTAButton href="/lending-trends/methodology" variant="navy">
              Methodology v1.0
            </CTAButton>
          </div>

          <p className="mt-10 text-[13px]" style={{ color: "oklch(0.50 0.02 255)" }}>
            Journalists: every chart and statistic on these pages may be reproduced with attribution to
            Construction Capital and a link to the relevant Monitor page. For cuts of the data, embargoed
            briefings or comment, contact the data desk via the <Link href="/contact" className="underline">contact page</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
