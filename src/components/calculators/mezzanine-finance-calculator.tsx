"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Layers, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function parseCurrency(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
}

function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

interface Inputs {
  totalProjectCost: string;
  seniorDebt: string;
  seniorRate: string;
  gdv: string;
  mezzRate: string;
  termMonths: string;
}

export function MezzanineFinanceCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    totalProjectCost: "2,000,000",
    seniorDebt: "1,400,000",
    seniorRate: "6.5",
    gdv: "3,200,000",
    mezzRate: "12",
    termMonths: "18",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    const digits = raw.replace(/[^0-9]/g, "");
    const formatted = digits
      ? parseInt(digits, 10).toLocaleString("en-GB")
      : "";
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const totalCost = parseCurrency(inputs.totalProjectCost);
    const seniorDebt = parseCurrency(inputs.seniorDebt);
    const seniorRate = parseFloat(inputs.seniorRate) || 0;
    const gdv = parseCurrency(inputs.gdv);
    const mezzRate = parseFloat(inputs.mezzRate) || 0;
    const termMonths = parseInt(inputs.termMonths, 10) || 0;

    const mezzAmount = Math.max(0, totalCost - seniorDebt);
    const equity = 0; // With mezz covering the gap, equity is minimal
    const equityRequired = Math.max(0, totalCost - seniorDebt - mezzAmount);

    const seniorInterest = Math.round(
      seniorDebt * (seniorRate / 100) * (termMonths / 12)
    );
    const mezzInterest = Math.round(
      mezzAmount * (mezzRate / 100) * (termMonths / 12)
    );
    const totalInterest = seniorInterest + mezzInterest;

    const totalDebt = seniorDebt + mezzAmount;
    const blendedRate =
      totalDebt > 0
        ? (seniorDebt * seniorRate + mezzAmount * mezzRate) / totalDebt
        : 0;

    const seniorLtgdv = gdv > 0 ? (seniorDebt / gdv) * 100 : 0;
    const totalLtgdv = gdv > 0 ? (totalDebt / gdv) * 100 : 0;

    const profit = gdv - totalCost - totalInterest;
    const profitOnCost =
      totalCost + totalInterest > 0
        ? (profit / (totalCost + totalInterest)) * 100
        : 0;

    // Without mezzanine comparison
    const equityWithoutMezz = Math.max(0, totalCost - seniorDebt);
    const interestWithoutMezz = Math.round(
      seniorDebt * (seniorRate / 100) * (termMonths / 12)
    );
    const equitySaved = equityWithoutMezz - equityRequired;

    return {
      totalCost,
      seniorDebt,
      mezzAmount,
      equityRequired,
      seniorInterest,
      mezzInterest,
      totalInterest,
      totalDebt,
      blendedRate,
      seniorLtgdv,
      totalLtgdv,
      profit,
      profitOnCost,
      gdv,
      termMonths,
      equityWithoutMezz,
      interestWithoutMezz,
      equitySaved,
    };
  }, [inputs]);

  const dealRoomParams = new URLSearchParams({
    loan_type: "Mezzanine Finance",
    gdv: String(results.gdv),
    total_cost: String(results.totalCost),
    loan_amount: String(results.mezzAmount),
    source: "mezzanine-finance-calculator",
  });

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Project Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="mf-cost" className="text-sm font-semibold">
                Total Project Cost
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="mf-cost"
                  value={inputs.totalProjectCost}
                  onChange={(e) =>
                    updateCurrencyField("totalProjectCost", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mf-gdv" className="text-sm font-semibold">
                Gross Development Value (GDV)
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="mf-gdv"
                  value={inputs.gdv}
                  onChange={(e) => updateCurrencyField("gdv", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mf-term" className="text-sm font-semibold">
                Term (months)
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="mf-term"
                  value={inputs.termMonths}
                  onChange={(e) => updateField("termMonths", e.target.value)}
                  className="h-11 pr-12"
                  inputMode="numeric"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  mo
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Funding</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="mf-senior" className="text-sm font-semibold">
                Senior Debt
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="mf-senior"
                  value={inputs.seniorDebt}
                  onChange={(e) =>
                    updateCurrencyField("seniorDebt", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="mf-senior-rate"
                  className="text-sm font-semibold"
                >
                  Senior Rate (p.a.)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="mf-senior-rate"
                    value={inputs.seniorRate}
                    onChange={(e) => updateField("seniorRate", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="mf-mezz-rate"
                  className="text-sm font-semibold"
                >
                  Mezz Rate (p.a.)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="mf-mezz-rate"
                    value={inputs.mezzRate}
                    onChange={(e) => updateField("mezzRate", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equity Saved Highlight */}
        {results.equitySaved > 0 && (
          <div
            className="rounded-xl p-6"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.08), oklch(0.75 0.12 85 / 0.03))",
              border: "1px solid oklch(0.75 0.12 85 / 0.15)",
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold-dark)" }}
            >
              Equity Saving with Mezzanine
            </p>
            <p className="mt-2 text-3xl font-bold" style={{ color: "var(--gold-dark)" }}>
              {formatGBP(results.equitySaved)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Less equity required compared to senior debt alone
            </p>
          </div>
        )}
      </div>

      {/* ━━━ RESULTS ━━━ */}
      <div className="space-y-6">
        <div
          className="rounded-xl p-6 text-white"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.05 255) 0%, oklch(0.22 0.06 255) 50%, oklch(0.18 0.05 260) 100%)",
          }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                border: "1px solid oklch(0.75 0.12 85 / 0.1)",
              }}
            >
              <Layers className="h-5 w-5" style={{ color: "var(--gold)" }} />
            </div>
            <h2 className="text-lg font-bold">Capital Stack Analysis</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Project Cost</span>
              <span className="font-semibold">
                {formatGBP(results.totalCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">GDV</span>
              <span className="font-semibold">{formatGBP(results.gdv)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Funding Layers
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Senior Debt ({formatPercent(results.seniorLtgdv)} LTGDV)
              </span>
              <span className="font-semibold">
                {formatGBP(results.seniorDebt)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Senior Interest ({inputs.seniorRate}%)
              </span>
              <span className="text-white/80">
                {formatGBP(results.seniorInterest)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Mezzanine Layer</span>
              <span className="font-semibold">
                {formatGBP(results.mezzAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Mezz Interest ({inputs.mezzRate}%)
              </span>
              <span className="text-white/80">
                {formatGBP(results.mezzInterest)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Total LTGDV
              </span>
              <span className="font-semibold">
                {formatPercent(results.totalLtgdv)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Blended Rate</span>
              <span className="font-semibold">
                {formatPercent(results.blendedRate)} p.a.
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Interest</span>
              <span className="text-white/80">
                {formatGBP(results.totalInterest)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Equity Required</span>
              <span className="font-semibold">
                {formatGBP(results.equityRequired)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Developer Profit
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.profit)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Profit on Cost</span>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>
                {formatPercent(results.profitOnCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Capital Stack Visual */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Capital Stack
          </h3>
          <div className="space-y-2">
            {results.gdv > 0 && (
              <>
                <StackBar
                  label="Senior Debt"
                  amount={results.seniorDebt}
                  total={results.gdv}
                  color="oklch(0.75 0.12 85)"
                />
                <StackBar
                  label="Mezzanine"
                  amount={results.mezzAmount}
                  total={results.gdv}
                  color="oklch(0.65 0.13 85)"
                />
                <StackBar
                  label="Equity"
                  amount={results.equityRequired}
                  total={results.gdv}
                  color="oklch(0.35 0.05 255)"
                />
              </>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Indicative figures only. Mezzanine terms depend on the project,
            senior lender requirements and inter-creditor arrangements. Contact
            us for a bespoke structure.
          </p>
        </div>

        {/* CTA */}
        <Button
          asChild
          size="lg"
          className="cta-shimmer h-14 w-full bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
        >
          <Link href={`/deal-room?${dealRoomParams.toString()}`}>
            Discuss Your Capital Stack
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function StackBar({
  label,
  amount,
  total,
  color,
}: {
  label: string;
  amount: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.min(100, (amount / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {formatGBP(amount)} ({pct.toFixed(0)}%)
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
