import { Home } from "lucide-react";
import type { SoldTransaction } from "@/lib/local-market-data";

interface RecentSoldPricesProps {
  transactions: SoldTransaction[];
  stats: {
    medianPrice: number;
    medianByType: Record<string, number>;
    transactionCount12m: number;
    yoyChange: number;
    newBuildCount: number;
    newBuildPremium: number;
  };
  townName: string;
}

const TYPE_LABELS: Record<string, string> = {
  D: "Detached",
  S: "Semi-Detached",
  T: "Terraced",
  F: "Flat",
  O: "Other",
};

const TYPE_COLORS: Record<string, string> = {
  D: "bg-blue-100 text-blue-700",
  S: "bg-emerald-100 text-emerald-700",
  T: "bg-amber-100 text-amber-700",
  F: "bg-purple-100 text-purple-700",
  O: "bg-gray-100 text-gray-700",
};

const TENURE_LABELS: Record<string, string> = {
  F: "Freehold",
  L: "Leasehold",
};

function formatGBP(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function RecentSoldPrices({
  transactions,
  stats,
  townName,
}: RecentSoldPricesProps) {
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
          Land Registry Data
        </p>
        <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Recent Property Sales in {townName}
        </h2>
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {stats.transactionCount12m.toLocaleString("en-GB")} residential
          transactions recorded in the last 12 months. Median sold price{" "}
          {formatGBP(stats.medianPrice)}
          {stats.yoyChange !== 0 && (
            <>
              {" "}
              ({stats.yoyChange > 0 ? "+" : ""}
              {stats.yoyChange}% year-on-year)
            </>
          )}
          .{" "}
          {stats.newBuildCount > 0 && (
            <>
              {stats.newBuildCount} new-build transactions with a{" "}
              {stats.newBuildPremium > 0 ? "+" : ""}
              {stats.newBuildPremium}% premium over existing stock.
            </>
          )}
        </p>

        {/* Price by type badges */}
        <div className="mb-8 flex flex-wrap gap-3">
          {Object.entries(stats.medianByType).map(([type, price]) => (
            <div
              key={type}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5"
            >
              <Home className="h-4 w-4 text-gold" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {TYPE_LABELS[type] || type}
                </p>
                <p className="text-sm font-bold">{formatGBP(price)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Transactions table */}
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Address</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-right font-semibold">Price</th>
                <th className="hidden px-4 py-3 text-left font-semibold sm:table-cell">
                  Tenure
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((t, i) => (
                <tr
                  key={i}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {formatDate(t.date)}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 sm:max-w-[300px]">
                    {t.address}
                    {t.postcode && (
                      <span className="ml-1 text-muted-foreground">
                        {t.postcode}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[t.propertyType] || TYPE_COLORS.O}`}
                    >
                      {TYPE_LABELS[t.propertyType] || t.propertyType}
                    </span>
                    {t.newBuild && (
                      <span className="ml-1 inline-flex rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold-dark">
                        New
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                    {formatGBP(t.price)}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-muted-foreground sm:table-cell">
                    {TENURE_LABELS[t.tenure] || t.tenure}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
