import Link from "next/link";
import {
  Home,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Building2,
  PoundSterling,
  CheckCircle2,
  HardHat,
} from "lucide-react";
import type { GuideMarketData } from "@/lib/local-market-data";

function formatGBP(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `£${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `£${(amount / 1_000_000).toFixed(1)}M`;
  }
  
return `£${amount.toLocaleString("en-GB")}`;
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  D: "Detached",
  S: "Semi-Detached",
  T: "Terraced",
  F: "Flat / Apartment",
};

const CATEGORY_LABELS: Record<string, string> = {
  new_build: "New Build",
  conversion: "Conversion",
  change_of_use: "Change of Use",
  prior_approval: "Prior Approval",
  demolition_rebuild: "Demolition & Rebuild",
  mixed_use: "Mixed Use",
  other_relevant: "Other",
};

interface GuideMarketEvidenceProps {
  data: GuideMarketData;
}

export function GuideMarketEvidence({ data }: GuideMarketEvidenceProps) {
  const yoyPositive = data.avgYoyChange >= 0;
  const hasPriceByType = Object.keys(data.medianByType).length > 0;
  const planning = data.planning;

  return (
    <section className="bg-muted/20 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div
            className="mb-5 h-[2px] w-14"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />
          <p
            className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
            style={{ color: "var(--gold-dark)" }}
          >
            Live Market Data
          </p>
          <h3 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">
            Regional Market Evidence
          </h3>
          <p className="mb-8 text-sm text-muted-foreground">
            Aggregated from {data.townCount.toLocaleString("en-GB")} towns
            across {data.countyCount} {data.countyCount === 1 ? "county" : "counties"} relevant
            to this guide.
          </p>

          {/* ── Stat Cards ── */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <Home className="mb-2 h-5 w-5 text-gold" />
              <p className="text-xs text-muted-foreground">Median Price</p>
              <p className="text-lg font-bold">
                {formatGBP(data.medianPrice)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <BarChart3 className="mb-2 h-5 w-5 text-gold" />
              <p className="text-xs text-muted-foreground">Transactions (12m)</p>
              <p className="text-lg font-bold">
                {data.totalTransactions.toLocaleString("en-GB")}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              {yoyPositive ? (
                <TrendingUp className="mb-2 h-5 w-5 text-emerald-500" />
              ) : (
                <TrendingDown className="mb-2 h-5 w-5 text-red-500" />
              )}
              <p className="text-xs text-muted-foreground">Avg YoY Change</p>
              <p
                className={`text-lg font-bold ${yoyPositive ? "text-emerald-600" : "text-red-600"}`}
              >
                {yoyPositive ? "+" : ""}
                {data.avgYoyChange}%
              </p>
            </div>

            {data.newBuildPremium !== 0 && (
              <div className="rounded-xl border border-border bg-card p-4">
                <HardHat className="mb-2 h-5 w-5 text-gold" />
                <p className="text-xs text-muted-foreground">
                  New Build Premium
                </p>
                <p className="text-lg font-bold">
                  {data.newBuildPremium > 0 ? "+" : ""}
                  {data.newBuildPremium}%
                </p>
              </div>
            )}

            {planning && planning.pipelineUnits > 0 && (
              <div className="rounded-xl border border-border bg-card p-4">
                <Building2 className="mb-2 h-5 w-5 text-gold" />
                <p className="text-xs text-muted-foreground">Pipeline Units</p>
                <p className="text-lg font-bold">
                  {planning.pipelineUnits.toLocaleString("en-GB")}
                </p>
              </div>
            )}

            {planning && planning.pipelineGdv > 0 && (
              <div className="rounded-xl border border-border bg-card p-4">
                <PoundSterling className="mb-2 h-5 w-5 text-gold" />
                <p className="text-xs text-muted-foreground">Pipeline GDV</p>
                <p className="text-lg font-bold">
                  {formatGBP(planning.pipelineGdv)}
                </p>
              </div>
            )}
          </div>

          {/* ── Price by Property Type ── */}
          {hasPriceByType && (
            <div className="mb-8">
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Median Price by Property Type
              </h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(data.medianByType).map(([type, price]) => (
                  <div
                    key={type}
                    className="rounded-xl border border-border bg-card p-4 text-center"
                  >
                    <p className="text-xs text-muted-foreground">
                      {PROPERTY_TYPE_LABELS[type] || type}
                    </p>
                    <p className="mt-1 text-lg font-bold">
                      {formatGBP(price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Most Active Markets ── */}
          {data.topTowns.length > 0 && (
            <div className="mb-8">
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Most Active Markets
              </h4>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">
                        Town
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Median Price
                      </th>
                      <th className="hidden px-4 py-3 text-right font-semibold sm:table-cell">
                        Sales (12m)
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        YoY
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topTowns.map((town) => {
                      const townYoyPositive = town.yoyChange >= 0;
                      
return (
                        <tr
                          key={`${town.countySlug}/${town.slug}`}
                          className="border-b last:border-0"
                        >
                          <td className="px-4 py-3">
                            <Link
                              href={`/locations/${town.countySlug}/${town.slug}`}
                              className="font-medium text-foreground hover:text-gold-dark"
                            >
                              {town.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatGBP(town.medianPrice)}
                          </td>
                          <td className="hidden px-4 py-3 text-right sm:table-cell">
                            {town.transactionCount12m.toLocaleString("en-GB")}
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-medium ${townYoyPositive ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {townYoyPositive ? "+" : ""}
                            {town.yoyChange}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Planning Pipeline ── */}
          {planning &&
            (planning.totalApproved > 0 || planning.totalPending > 0) && (
              <div className="mb-4">
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Development Pipeline
                </h4>
                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <CheckCircle2 className="mb-2 h-5 w-5 text-emerald-500" />
                    <p className="text-xs text-muted-foreground">Approved</p>
                    <p className="text-lg font-bold">
                      {planning.totalApproved.toLocaleString("en-GB")}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <Building2 className="mb-2 h-5 w-5 text-amber-500" />
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-lg font-bold">
                      {planning.totalPending.toLocaleString("en-GB")}
                    </p>
                  </div>
                  {planning.avgApprovalRate > 0 && (
                    <div className="rounded-xl border border-border bg-card p-4">
                      <BarChart3 className="mb-2 h-5 w-5 text-gold" />
                      <p className="text-xs text-muted-foreground">
                        Approval Rate
                      </p>
                      <p className="text-lg font-bold">
                        {planning.avgApprovalRate}%
                      </p>
                    </div>
                  )}
                  {planning.pipelineGdv > 0 && (
                    <div className="rounded-xl border border-border bg-card p-4">
                      <PoundSterling className="mb-2 h-5 w-5 text-gold" />
                      <p className="text-xs text-muted-foreground">
                        Total Est. GDV
                      </p>
                      <p className="text-lg font-bold">
                        {formatGBP(planning.pipelineGdv)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Category breakdown */}
                {Object.keys(planning.categories).length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(planning.categories)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 6)
                      .map(([cat, count]) => (
                        <span
                          key={cat}
                          className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                        >
                          {CATEGORY_LABELS[cat] || cat}{" "}
                          <span className="font-semibold text-foreground">
                            {count}
                          </span>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
