import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getNationalMarketSummary } from "@/lib/national-market-data";

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const INT = new Intl.NumberFormat("en-GB");

function quarterLabel(iso: string | undefined): string {
  if (!iso) return "Current snapshot";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Current snapshot";
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q} ${d.getFullYear()} snapshot`;
}

function asOfLabel(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function MarketStrip() {
  const summary = getNationalMarketSummary();

  // Fail safely — don't render a broken strip if the pipeline hasn't run.
  if (summary.townsTracked === 0 || summary.transactions12m === 0) return null;

  const dataPoints = [
    {
      label: "UK towns tracked",
      value: INT.format(summary.townsTracked),
      foot: "Land Registry + planning data kept current.",
    },
    {
      label: "Transactions observed",
      value: INT.format(summary.transactions12m),
      foot: "Rolling 12-month Land Registry count across the panel.",
    },
    {
      label: "Median sale price",
      value: GBP.format(summary.medianOfMedianPrices),
      foot: `${summary.townsWithPositiveYoy} of ${summary.townsTracked} towns posting positive YoY movement.`,
    },
  ];

  return (
    <section
      className="relative py-24 sm:py-32"
      style={{ background: "var(--paper)" }}
    >
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <header className="mb-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="mb-6 flex items-center gap-4">
              <span className="rule-gold" aria-hidden />
              <p
                className="text-[11px] font-medium uppercase tracking-[0.32em]"
                style={{ color: "var(--navy)" }}
              >
                {quarterLabel(summary.dataAsOf)}
              </p>
            </div>
            <h2
              className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-[2.75rem]"
              style={{ color: "var(--navy-dark)" }}
            >
              What we&rsquo;re seeing
              <br />
              in the market.
            </h2>
          </div>
          <p
            className="max-w-[44ch] text-[17px] leading-[1.65] lg:col-span-5 lg:col-start-8"
            style={{ color: "oklch(0.35 0.04 255)" }}
          >
            A live read across the UK towns we monitor. We use this data to
            price deals, stress-test schemes and decide which lenders fit
            best &mdash; and we publish the full reports for every county
            and town.
          </p>
        </header>

        <dl
          className="grid grid-cols-1 border-y sm:grid-cols-3"
          style={{ borderColor: "var(--stone-dark)" }}
        >
          {dataPoints.map((point, idx) => (
            <div
              key={point.label}
              className={`flex flex-col gap-5 py-10 sm:py-14 ${
                idx > 0 ? "sm:border-l" : ""
              } ${idx === 0 ? "sm:pr-8" : "sm:px-8"}`}
              style={{ borderColor: "var(--stone-dark)" }}
            >
              <dt
                className="text-[11px] font-medium uppercase tracking-[0.28em]"
                style={{ color: "oklch(0.50 0.02 255)" }}
              >
                {point.label}
              </dt>
              <dd
                className="numeral-tabular font-heading text-4xl font-medium leading-none tracking-tight sm:text-[3rem]"
                style={{ color: "var(--navy-dark)" }}
              >
                {point.value}
              </dd>
              <p
                className="max-w-[30ch] text-[14px] leading-[1.55]"
                style={{ color: "oklch(0.42 0.03 255)" }}
              >
                {point.foot}
              </p>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.24em]"
            style={{ color: "oklch(0.50 0.02 255)" }}
          >
            Data as of {asOfLabel(summary.dataAsOf) || "latest pipeline run"}
            . Sources: HM Land Registry, local planning authorities.
          </p>
          <Link
            href="/market-reports"
            className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.22em]"
            style={{ color: "var(--navy-dark)" }}
          >
            <span className="editorial-link">Read the full reports</span>
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: "var(--gold-dark)" }}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
