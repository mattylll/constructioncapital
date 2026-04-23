"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { ReportCharts } from "@/lib/market-reports/types";

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1000) return `£${Math.round(n / 1000)}k`;
  
return `£${n}`;
}

function CustomTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  valueFormatter: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  
return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-muted-foreground">{valueFormatter(payload[0].value)}</p>
    </div>
  );
}

export function PriceByTypeChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="my-8 rounded-xl border border-border bg-card p-6">
      <h4 className="mb-4 text-sm font-semibold text-foreground">
        Median Price by Property Type
      </h4>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="oklch(0.5 0 0 / 0.1)"
            />
            <XAxis
              type="number"
              tickFormatter={formatPrice}
              tick={{ fontSize: 12, fill: "oklch(0.5 0 0 / 0.5)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 13, fill: "oklch(0.5 0 0 / 0.7)" }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip
              content={
                <CustomTooltip valueFormatter={formatPrice} />
              }
            />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              maxBarSize={32}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    i === 0
                      ? "oklch(0.75 0.12 85)"
                      : i === 1
                      ? "oklch(0.65 0.10 85)"
                      : i === 2
                      ? "oklch(0.55 0.08 85)"
                      : "oklch(0.45 0.06 85)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TownPricesChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="my-8 rounded-xl border border-border bg-card p-6">
      <h4 className="mb-4 text-sm font-semibold text-foreground">
        Town Median Prices
      </h4>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="oklch(0.5 0 0 / 0.1)"
            />
            <XAxis
              type="number"
              tickFormatter={formatPrice}
              tick={{ fontSize: 11, fill: "oklch(0.5 0 0 / 0.5)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: "oklch(0.5 0 0 / 0.7)" }}
              axisLine={false}
              tickLine={false}
              width={120}
            />
            <Tooltip
              content={
                <CustomTooltip valueFormatter={formatPrice} />
              }
            />
            <Bar dataKey="value" fill="oklch(0.55 0.08 255)" radius={[0, 4, 4, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function YoyChangeChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="my-8 rounded-xl border border-border bg-card p-6">
      <h4 className="mb-4 text-sm font-semibold text-foreground">
        Year-on-Year Price Change by Town
      </h4>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 10, right: 20, bottom: 40 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="oklch(0.5 0 0 / 0.1)"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "oklch(0.5 0 0 / 0.5)" }}
              axisLine={false}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12, fill: "oklch(0.5 0 0 / 0.5)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={
                <CustomTooltip
                  valueFormatter={(v: number) =>
                    `${v > 0 ? "+" : ""}${v}%`
                  }
                />
              }
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.value > 0
                      ? "oklch(0.65 0.15 145)"
                      : "oklch(0.60 0.15 25)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ReportChartsSection({ charts }: { charts: ReportCharts }) {
  if (!charts.priceByType?.length && !charts.townPrices?.length && !charts.townYoyChange?.length) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div
        className="mb-5 h-[2px] w-14"
        style={{
          background: "linear-gradient(90deg, var(--gold), var(--gold-light))",
        }}
      />
      <p
        className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
        style={{ color: "var(--gold-dark)" }}
      >
        Data Visualisation
      </p>
      <h3 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">
        Market Data at a Glance
      </h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Interactive charts based on Land Registry sold price data.
      </p>

      {charts.priceByType && charts.priceByType.length > 0 && (
        <PriceByTypeChart data={charts.priceByType} />
      )}
      {charts.townPrices && charts.townPrices.length > 0 && (
        <TownPricesChart data={charts.townPrices} />
      )}
      {charts.townYoyChange && charts.townYoyChange.length > 0 && (
        <YoyChangeChart data={charts.townYoyChange} />
      )}
    </div>
  );
}
