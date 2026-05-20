"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
  Line,
  LineChart,
  ComposedChart,
} from "recharts";

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});
const fmtCount = (n: number) => new Intl.NumberFormat("en-GB").format(n);
const fmtCompact = (n: number) =>
  n >= 1_000_000 ? `£${(n / 1_000_000).toFixed(1)}m` : `£${Math.round(n / 1000)}k`;

// ─── Property Type Bars ─────────────────────────────────────────────────────

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  flat: "Flat",
  terraced: "Terraced",
  semi_detached: "Semi-detached",
  semi: "Semi-detached",
  detached: "Detached",
  other: "Other",
};

export function PropertyTypeBars({
  data,
}: {
  data: Record<string, number>;
}) {
  const entries = Object.entries(data || {})
    .filter(([, v]) => v > 0)
    .map(([type, value]) => ({
      type: PROPERTY_TYPE_LABELS[type] ?? type,
      value,
    }))
    .sort((a, b) => a.value - b.value);

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
        Type breakdown not available for this market.
      </div>
    );
  }

  const max = Math.max(...entries.map((e) => e.value));

  return (
    <div className="space-y-3">
      {entries.map((e) => {
        const widthPct = Math.max(8, (e.value / max) * 100);
        return (
          <div key={e.type} className="grid grid-cols-[120px_1fr_90px] items-center gap-3">
            <span className="text-sm text-stone-600">{e.type}</span>
            <div className="relative h-9 overflow-hidden rounded bg-stone-100">
              <div
                className="absolute inset-y-0 left-0 flex items-center justify-end pr-3"
                style={{
                  width: `${widthPct}%`,
                  background:
                    "linear-gradient(90deg, var(--navy) 0%, var(--navy-dark) 100%)",
                }}
              >
                <span className="font-heading text-xs font-medium text-white">
                  {fmtCompact(e.value)}
                </span>
              </div>
            </div>
            <span className="text-right font-heading text-sm font-medium text-navy-dark">
              {GBP.format(e.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Approval Rate Ring ─────────────────────────────────────────────────────

export function ApprovalRing({
  rate,
  decided,
}: {
  rate: number;
  decided?: number;
}) {
  const data = [
    { name: "approved", value: rate },
    { name: "refused", value: Math.max(0, 100 - rate) },
  ];
  return (
    <div className="relative flex flex-col items-center">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="var(--gold)" />
            <Cell fill="rgb(229, 231, 235)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-4xl font-medium text-navy-dark">{rate}%</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
          approved
        </span>
      </div>
      {decided !== undefined && decided > 0 && (
        <span className="mt-2 text-xs text-stone-500">
          of {fmtCount(decided)} decided applications
        </span>
      )}
    </div>
  );
}

// ─── New Build vs Existing ──────────────────────────────────────────────────

export function NewBuildPremium({
  newBuildCount,
  existingCount,
  premium,
  medianNewBuild,
  medianExisting,
}: {
  newBuildCount: number;
  existingCount: number;
  premium: number | null;
  medianNewBuild?: number | null;
  medianExisting?: number | null;
}) {
  const total = newBuildCount + existingCount;
  const newBuildPct = total > 0 ? (newBuildCount / total) * 100 : 0;

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h4 className="text-xs uppercase tracking-[0.2em] text-stone-500">
          New build mix
        </h4>
        {premium !== null && (
          <span
            className={`font-heading text-2xl font-medium ${
              premium > 0 ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {premium > 0 ? "+" : ""}
            {premium}% premium
          </span>
        )}
      </div>

      <div className="mb-3 flex h-10 overflow-hidden rounded">
        <div
          className="flex items-center justify-center bg-[color:var(--navy)] text-xs font-medium text-white"
          style={{ width: `${Math.max(8, newBuildPct)}%` }}
        >
          {fmtCount(newBuildCount)}
        </div>
        <div
          className="flex items-center justify-center bg-stone-200 text-xs font-medium text-stone-700"
          style={{ width: `${100 - newBuildPct}%` }}
        >
          {fmtCount(existingCount)}
        </div>
      </div>
      <div className="flex justify-between text-xs text-stone-600">
        <span>New build · {newBuildPct.toFixed(1)}%</span>
        <span>Existing stock</span>
      </div>

      {(medianNewBuild || medianExisting) && (
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-stone-100 pt-4">
          {medianNewBuild ? (
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                New build median
              </div>
              <div className="font-heading text-lg text-navy-dark">
                {GBP.format(medianNewBuild)}
              </div>
            </div>
          ) : (
            <div />
          )}
          {medianExisting ? (
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                Existing median
              </div>
              <div className="font-heading text-lg text-navy-dark">
                {GBP.format(medianExisting)}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ─── Pipeline Top Schemes Bar Chart ─────────────────────────────────────────

export function PipelineTopSchemes({
  schemes,
}: {
  schemes: Array<{ label: string; gdv: number; units: number | null }>;
}) {
  if (schemes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
        No major schemes in the current pipeline.
      </div>
    );
  }

  const data = schemes.slice(0, 6).map((s) => ({
    label: s.label.length > 40 ? s.label.slice(0, 38) + "…" : s.label,
    fullLabel: s.label,
    gdv: s.gdv,
    units: s.units,
  }));

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 42)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 80, bottom: 8, left: 8 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={180}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#475569" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            content={({ active, payload }) =>
              active && payload?.[0] ? (
                <div className="rounded border border-stone-200 bg-white p-3 text-xs shadow-sm">
                  <div className="mb-1 font-medium text-navy-dark">
                    {(payload[0].payload as any).fullLabel}
                  </div>
                  <div className="text-stone-600">
                    {fmtCompact((payload[0].payload as any).gdv)} GDV ·{" "}
                    {(payload[0].payload as any).units ?? "?"} units
                  </div>
                </div>
              ) : null
            }
          />
          <Bar dataKey="gdv" radius={[0, 4, 4, 0]} fill="var(--gold)">
            <LabelList
              dataKey="gdv"
              position="right"
              formatter={(v) => (typeof v === "number" ? fmtCompact(v) : "")}
              style={{ fontSize: 12, fill: "#0f172a", fontWeight: 500 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Comparison Panel (this town vs benchmarks) ─────────────────────────────

export interface ComparisonItem {
  label: string;
  median: number;
  yoy: number | null;
  txns?: number | null;
  isHighlight?: boolean;
}

export function MarketComparison({ items }: { items: ComparisonItem[] }) {
  const max = Math.max(...items.map((i) => i.median));

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="grid grid-cols-[1fr_120px_100px_100px] gap-3 bg-stone-50 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
        <div>Market</div>
        <div className="text-right">Median</div>
        <div className="text-right">YoY</div>
        <div className="text-right">12m txns</div>
      </div>
      {items.map((item, i) => {
        const widthPct = max > 0 ? (item.median / max) * 100 : 0;
        return (
          <div
            key={i}
            className={`relative grid grid-cols-[1fr_120px_100px_100px] gap-3 border-t border-stone-100 px-4 py-3 ${
              item.isHighlight ? "bg-[color:var(--gold)]/10" : ""
            }`}
          >
            <div
              aria-hidden
              className="absolute inset-y-0 left-0"
              style={{
                width: `${widthPct}%`,
                background: item.isHighlight
                  ? "linear-gradient(90deg, oklch(0.92 0.07 85 / 0.6), transparent)"
                  : "linear-gradient(90deg, oklch(0.94 0.01 250 / 0.6), transparent)",
              }}
            />
            <div className="relative font-medium text-navy-dark">{item.label}</div>
            <div className="relative text-right font-heading text-navy-dark">
              {GBP.format(item.median)}
            </div>
            <div
              className={`relative text-right text-sm font-medium ${
                item.yoy === null
                  ? "text-stone-400"
                  : item.yoy > 0
                  ? "text-emerald-700"
                  : item.yoy < 0
                  ? "text-rose-700"
                  : "text-stone-600"
              }`}
            >
              {item.yoy === null ? "—" : `${item.yoy > 0 ? "+" : ""}${item.yoy}%`}
            </div>
            <div className="relative text-right text-sm text-stone-600">
              {item.txns ? fmtCount(item.txns) : "—"}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Price Trend Chart (medians over time) ──────────────────────────────────

export interface TrendPoint {
  period: string;
  medianPrice: number;
  transactions: number;
}

export function PriceTrendChart({
  data,
  height = 280,
}: {
  data: TrendPoint[];
  height?: number;
}) {
  if (data.length < 2) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
        Historical price series will appear here after the next data refresh.
      </div>
    );
  }

  // Format ticks compactly
  const data2 = data.map((d) => ({
    ...d,
    label: d.period.replace(/^\d{4}-/, ""),
  }));

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data2} margin={{ top: 20, right: 12, bottom: 8, left: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--navy)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--navy)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#64748b" }}
            interval={Math.max(0, Math.floor(data.length / 8) - 1)}
            tickFormatter={(p: string) => {
              if (p.includes("Q")) return p.slice(2); // 2026-Q1 → Q1
              const m = p.split("-")[1];
              return m
                ? ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m, 10) - 1]
                : p;
            }}
          />
          <YAxis
            yAxisId="price"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#64748b" }}
            tickFormatter={(v) => (v >= 1000 ? `£${Math.round(v / 1000)}k` : `£${v}`)}
            width={48}
          />
          <YAxis
            yAxisId="txns"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            width={32}
          />
          <Tooltip
            cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "3 3" }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="rounded-md border border-stone-200 bg-white p-3 text-xs shadow-sm">
                  <div className="mb-1 text-stone-500">{label}</div>
                  <div className="mb-1 font-medium text-navy-dark">
                    {GBP.format((payload[0]?.payload as TrendPoint).medianPrice)}
                  </div>
                  <div className="text-stone-600">
                    {fmtCount((payload[0]?.payload as TrendPoint).transactions)} sales
                  </div>
                </div>
              ) : null
            }
          />
          <Bar
            yAxisId="txns"
            dataKey="transactions"
            fill="#e5e7eb"
            radius={[2, 2, 0, 0]}
            maxBarSize={28}
          />
          <Area
            yAxisId="price"
            type="monotone"
            dataKey="medianPrice"
            stroke="var(--navy-dark)"
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={{ r: 2.5, fill: "var(--gold)", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "var(--gold)", strokeWidth: 2, stroke: "white" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-stone-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-3 bg-[color:var(--navy-dark)]" />
          Median sale price
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 bg-stone-300" />
          Transactions
        </span>
      </div>
    </div>
  );
}

// ─── Sparkline (simple SVG line) ────────────────────────────────────────────

export function Sparkline({
  values,
  width = 140,
  height = 36,
  stroke = "var(--gold)",
}: {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="opacity-90"
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// ─── Big Stat Callout (mid-article pull moment) ─────────────────────────────

export function BigStatCallout({
  label,
  value,
  context,
  tone = "navy",
}: {
  label: string;
  value: string;
  context?: string;
  tone?: "navy" | "gold" | "paper";
}) {
  const bg =
    tone === "gold"
      ? "bg-[color:var(--gold)]/10"
      : tone === "paper"
      ? "bg-stone-50"
      : "bg-[color:var(--navy)]/5";
  return (
    <aside
      className={`my-12 grid grid-cols-1 items-center gap-6 rounded-lg border border-stone-200 ${bg} p-8 sm:grid-cols-[auto_1fr]`}
    >
      <div className="font-heading text-5xl font-medium leading-none text-navy-dark sm:text-6xl">
        {value}
      </div>
      <div>
        <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-stone-500">
          {label}
        </div>
        {context && <p className="text-base leading-relaxed text-stone-700">{context}</p>}
      </div>
    </aside>
  );
}

// ─── Pipeline Pending Card (richer) ─────────────────────────────────────────

export function PipelineCard({
  reference,
  proposal,
  address,
  units,
  estimatedGdv,
  status,
  receivedDate,
  decision,
}: {
  reference: string;
  proposal: string;
  address: string;
  units: number | null;
  estimatedGdv: number | null;
  status: string;
  receivedDate: string;
  decision: string;
}) {
  const statusUpper = (status || "").toUpperCase();
  const decisionUpper = (decision || "").toUpperCase();
  const isApproved =
    statusUpper.includes("APPROV") ||
    statusUpper.includes("GRANTED") ||
    statusUpper.includes("PERMIT") ||
    decisionUpper.includes("APPROVE");

  const isRefused =
    statusUpper.includes("REFUS") || decisionUpper.includes("REFUS");

  const badge = isApproved
    ? { label: "Approved", colour: "bg-emerald-600", ring: "border-l-emerald-500" }
    : isRefused
    ? { label: "Refused", colour: "bg-rose-600", ring: "border-l-rose-500" }
    : { label: "Pending", colour: "bg-amber-500", ring: "border-l-amber-400" };

  // Try to parse the received date for "X days ago" sense check
  let receivedLabel: string | null = null;
  if (receivedDate) {
    // dates often DD/MM/YYYY in UK feeds; handle both
    let d: Date | null = null;
    if (/^\d{4}-\d{2}-\d{2}/.test(receivedDate)) {
      d = new Date(receivedDate);
    } else if (/^\d{2}\/\d{2}\/\d{4}/.test(receivedDate)) {
      const [dd, mm, yyyy] = receivedDate.split("/");
      d = new Date(`${yyyy}-${mm}-${dd}`);
    }
    if (d && !isNaN(d.getTime())) {
      receivedLabel = d.toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      });
    }
  }

  return (
    <article
      className={`group flex flex-col gap-3 border-l-4 ${badge.ring} bg-white p-5 transition-all hover:shadow-md`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full ${badge.colour} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white`}
          >
            {badge.label}
          </span>
          <span className="text-[11px] font-mono text-stone-400">{reference}</span>
        </div>
        {units !== null && (
          <div className="text-right">
            <div className="font-heading text-2xl font-medium leading-none text-navy-dark">
              {units}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-stone-500">
              {units === 1 ? "unit" : "units"}
            </div>
          </div>
        )}
      </header>

      <p className="line-clamp-3 text-sm leading-snug text-navy-dark">{proposal}</p>

      <footer className="mt-auto flex items-end justify-between gap-3 border-t border-stone-100 pt-3 text-xs">
        <div className="min-w-0 flex-1 truncate text-stone-600" title={address}>
          {address || "Address not disclosed"}
        </div>
        <div className="flex-shrink-0 text-right">
          {estimatedGdv !== null && estimatedGdv > 0 && (
            <div className="font-heading text-sm font-medium text-navy-dark">
              {fmtCompact(estimatedGdv)}
            </div>
          )}
          {receivedLabel && (
            <div className="text-[10px] uppercase tracking-wider text-stone-400">
              Filed {receivedLabel}
            </div>
          )}
        </div>
      </footer>
    </article>
  );
}
