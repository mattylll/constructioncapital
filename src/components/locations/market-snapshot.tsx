import {
  Home,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Building2,
  PoundSterling,
} from "lucide-react";

import {
  EditorialSection,
  SectionHeader,
} from "@/components/editorial/primitives";

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

  const cells: { icon: React.ElementType; label: string; value: string; accent?: string }[] = [
    { icon: Home, label: "Median price", value: formatGBP(stats.medianPrice) },
    { icon: BarChart3, label: "Sales (12m)", value: stats.transactionCount12m.toLocaleString("en-GB") },
    {
      icon: yoyPositive ? TrendingUp : TrendingDown,
      label: "YoY change",
      value: `${yoyPositive ? "+" : ""}${stats.yoyPriceChange}%`,
      accent: yoyPositive ? "oklch(0.55 0.15 160)" : "oklch(0.55 0.2 25)",
    },
  ];
  if (hasPlanningData) {
    cells.push(
      { icon: CheckCircle2, label: "Approved (12m)", value: stats.approvedApps12m.toLocaleString("en-GB") },
      { icon: Building2, label: "Pipeline units", value: stats.pipelineUnits.toLocaleString("en-GB") },
      { icon: PoundSterling, label: "Pipeline GDV", value: formatGBP(stats.pipelineGdv) },
    );
  }

  return (
    <EditorialSection tone="paper">
      <SectionHeader
        tone="paper"
        eyebrow="Live market data"
        title={
          <>
            {townName}
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              market snapshot.
            </span>
          </>
        }
        body={`HM Land Registry sold-price data for ${townName} over the last twelve months, cross-referenced with local planning pipeline. Updated weekly.`}
      />

      <dl
        className={`mt-16 grid grid-cols-2 gap-px border-y sm:grid-cols-3 ${hasPlanningData ? "lg:grid-cols-6" : "lg:grid-cols-3"}`}
        style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
      >
        {cells.map((cell) => {
          const Icon = cell.icon;
          return (
            <div
              key={cell.label}
              className="flex flex-col gap-4 px-6 py-7"
              style={{ background: "var(--paper)" }}
            >
              <Icon
                className="h-4 w-4"
                style={{ color: cell.accent ?? "var(--gold-dark)" }}
              />
              <div>
                <dt
                  className="text-[10px] font-medium uppercase tracking-[0.24em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  {cell.label}
                </dt>
                <dd
                  className="numeral-tabular font-heading mt-2 text-[1.75rem] font-medium leading-none tracking-tight"
                  style={{ color: cell.accent ?? "var(--navy-dark)" }}
                >
                  {cell.value}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </EditorialSection>
  );
}
