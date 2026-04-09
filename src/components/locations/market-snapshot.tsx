import {
  Home,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Building2,
  PoundSterling,
} from "lucide-react";

interface MarketSnapshotProps {
  stats: {
    medianPrice: number;
    transactionCount12m: number;
    yoyPriceChange: number;
    approvedApps12m: number;
    pipelineUnits: number;
    pipelineGdv: number;
    approvalRate: number;
  };
  townName: string;
}

function formatGBP(amount: number): string {
  if (amount >= 1_000_000) {
    return `£${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `£${amount.toLocaleString("en-GB")}`;
}

export function MarketSnapshot({ stats, townName }: MarketSnapshotProps) {
  const yoyPositive = stats.yoyPriceChange >= 0;
  const hasPlanningData =
    stats.approvedApps12m > 0 ||
    stats.pipelineUnits > 0 ||
    stats.pipelineGdv > 0;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
        <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
          {townName} Market Snapshot
        </h2>

        <div
          className={`grid grid-cols-2 gap-4 sm:grid-cols-3 ${hasPlanningData ? "lg:grid-cols-6" : "lg:grid-cols-3"}`}
        >
          <div className="rounded-xl border border-border bg-card p-4">
            <Home className="mb-2 h-5 w-5 text-gold" />
            <p className="text-xs text-muted-foreground">Median Price</p>
            <p className="text-lg font-bold">{formatGBP(stats.medianPrice)}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <BarChart3 className="mb-2 h-5 w-5 text-gold" />
            <p className="text-xs text-muted-foreground">Sales (12m)</p>
            <p className="text-lg font-bold">
              {stats.transactionCount12m.toLocaleString("en-GB")}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            {yoyPositive ? (
              <TrendingUp className="mb-2 h-5 w-5 text-emerald-500" />
            ) : (
              <TrendingDown className="mb-2 h-5 w-5 text-red-500" />
            )}
            <p className="text-xs text-muted-foreground">YoY Change</p>
            <p
              className={`text-lg font-bold ${yoyPositive ? "text-emerald-600" : "text-red-600"}`}
            >
              {yoyPositive ? "+" : ""}
              {stats.yoyPriceChange}%
            </p>
          </div>

          {hasPlanningData && (
            <>
              <div className="rounded-xl border border-border bg-card p-4">
                <CheckCircle2 className="mb-2 h-5 w-5 text-gold" />
                <p className="text-xs text-muted-foreground">Approved (12m)</p>
                <p className="text-lg font-bold">{stats.approvedApps12m}</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <Building2 className="mb-2 h-5 w-5 text-gold" />
                <p className="text-xs text-muted-foreground">Pipeline Units</p>
                <p className="text-lg font-bold">
                  {stats.pipelineUnits.toLocaleString("en-GB")}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <PoundSterling className="mb-2 h-5 w-5 text-gold" />
                <p className="text-xs text-muted-foreground">Pipeline GDV</p>
                <p className="text-lg font-bold">
                  {formatGBP(stats.pipelineGdv)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
