import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, Database, FileText, Mail } from "lucide-react";

import { PageHero } from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
import { MARKET_REPORTS } from "@/lib/market-reports";

export const metadata: Metadata = {
  title: "Press & Data Desk | Development Lending Monitor",
  description:
    "Press resources for journalists covering UK development finance: the quarterly Development Lending Monitor, open data, methodology, reproducible charts and a data desk for custom aggregate cuts.",
  alternates: { canonical: `${SITE_URL}/press` },
};

export default function PressPage() {
  const lending = MARKET_REPORTS.filter((r) => r.category === "lending").slice(0, 6);
  const latestFlagship = MARKET_REPORTS.find((r) =>
    r.slug.startsWith("development-lending-monitor-h")
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Press" },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Press" }]}
        eyebrow="Press & data desk"
        title={
          <>
            Data journalists
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              can actually use.
            </span>
          </>
        }
        deck="Construction Capital publishes the Development Lending Monitor, a quarterly data series on UK development finance built from Companies House charge registrations. Everything on this page is designed for use on deadline: reproducible numbers, stated methodology, open data, attribution sorted."
      />

      <section className="py-16" style={{ background: "var(--paper)" }}>
        <div className="mx-auto max-w-[1080px] px-6 sm:px-10">
          <div className="mb-14 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border p-6" style={{ borderColor: "var(--stone-dark)", background: "white" }}>
              <FileText className="mb-3 h-6 w-6" style={{ color: "var(--gold-dark)" }} />
              <h2 className="font-heading mb-2 text-xl font-medium" style={{ color: "var(--navy-dark)" }}>
                The current Monitor
              </h2>
              <p className="mb-4 text-[14px] leading-relaxed" style={{ color: "oklch(0.40 0.03 255)" }}>
                {latestFlagship?.excerpt ?? "Quarterly analysis of UK development lending activity."}
              </p>
              <Link
                href={`/market-reports/${latestFlagship?.slug ?? ""}`}
                className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em]"
                style={{ color: "var(--navy-dark)" }}
              >
                Read the flagship <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-lg border p-6" style={{ borderColor: "var(--stone-dark)", background: "white" }}>
              <Database className="mb-3 h-6 w-6" style={{ color: "var(--gold-dark)" }} />
              <h2 className="font-heading mb-2 text-xl font-medium" style={{ color: "var(--navy-dark)" }}>
                Open data & methodology
              </h2>
              <p className="mb-4 text-[14px] leading-relaxed" style={{ color: "oklch(0.40 0.03 255)" }}>
                Every aggregate behind the Monitor, CC BY 4.0. Fact-check any number against the
                versioned methodology; suppressed cuts are listed, not hidden.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/data/lending-monitor-stats-h1-2026.json"
                  className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: "var(--navy-dark)" }}
                >
                  Dataset (JSON) <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <Link
                  href="/lending-trends/methodology"
                  className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: "var(--navy-dark)" }}
                >
                  Methodology <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <h2 className="font-heading mb-6 text-2xl font-medium tracking-tight" style={{ color: "var(--navy-dark)" }}>
            Current editions
          </h2>
          <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lending.map((r) => (
              <Link
                key={r.slug}
                href={`/market-reports/${r.slug}`}
                className="group rounded-lg border p-5 transition-shadow hover:shadow-md"
                style={{ borderColor: "var(--stone-dark)", background: "white" }}
              >
                <BarChart3 className="mb-2 h-4 w-4" style={{ color: "var(--gold-dark)" }} />
                <h3 className="mb-1 font-heading text-[15px] font-medium leading-snug" style={{ color: "var(--navy-dark)" }}>
                  {r.title}
                </h3>
                <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "oklch(0.50 0.02 255)" }}>
                  {r.readingTime}
                </span>
              </Link>
            ))}
          </div>

          <div
            className="rounded-lg border p-8"
            style={{ borderColor: "var(--stone-dark)", background: "white" }}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-[60ch]">
                <Mail className="mb-3 h-6 w-6" style={{ color: "var(--gold-dark)" }} />
                <h2 className="font-heading mb-2 text-xl font-medium" style={{ color: "var(--navy-dark)" }}>
                  The data desk
                </h2>
                <ul className="space-y-2 text-[14px] leading-relaxed" style={{ color: "oklch(0.40 0.03 255)" }}>
                  <li>
                    <strong style={{ color: "var(--navy-dark)" }}>Custom cuts:</strong> regional, sector or
                    time-series aggregates on request. We never provide lender-level figures.
                  </li>
                  <li>
                    <strong style={{ color: "var(--navy-dark)" }}>Comment:</strong> quotes from Matt Lenzie
                    (founder, 25+ years in development finance) on lending-market data, usually same day.
                  </li>
                  <li>
                    <strong style={{ color: "var(--navy-dark)" }}>Embargoed briefings:</strong> each quarterly
                    edition is available under embargo ahead of publication to trade press.
                  </li>
                  <li>
                    <strong style={{ color: "var(--navy-dark)" }}>Attribution:</strong> reproduce any chart or
                    statistic with credit to Construction Capital and a link to the Monitor.
                  </li>
                </ul>
              </div>
              <div className="shrink-0 rounded-lg p-6 text-center" style={{ background: "var(--paper)" }}>
                <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.22em]" style={{ color: "oklch(0.50 0.02 255)" }}>
                  Contact
                </p>
                <a href={`mailto:${CONTACT.email}`} className="font-medium underline" style={{ color: "var(--navy-dark)" }}>
                  {CONTACT.email}
                </a>
                <p className="mt-2 text-[13px]" style={{ color: "oklch(0.42 0.03 255)" }}>
                  {CONTACT.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
