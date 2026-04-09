"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Building2, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShareResults } from "@/components/calculators/share-results";

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
  landCost: string;
  buildCosts: string;
  professionalFees: string;
  contingency: string;
  gdv: string;
  interestRate: string;
  termMonths: string;
  ltgdv: string;
  useMezzanine: boolean;
  mezzLtgdv: string;
  mezzRate: string;
}

export function DevelopmentFinanceCalculator() {
  const searchParams = useSearchParams();

  const [inputs, setInputs] = useState<Inputs>({
    landCost: "500,000",
    buildCosts: "1,200,000",
    professionalFees: "120,000",
    contingency: "10",
    gdv: "2,800,000",
    interestRate: "6.5",
    termMonths: "18",
    ltgdv: "65",
    useMezzanine: false,
    mezzLtgdv: "85",
    mezzRate: "12",
  });

  // Pre-populate from shared URL params
  useEffect(() => {
    const fmt = (v: string) => parseInt(v, 10).toLocaleString("en-GB");
    const lc = searchParams.get("landCost");
    const bc = searchParams.get("buildCosts");
    const pf = searchParams.get("professionalFees");
    const ct = searchParams.get("contingency");
    const gv = searchParams.get("gdv");
    const ir = searchParams.get("interestRate");
    const tm = searchParams.get("termMonths");
    const lt = searchParams.get("ltgdv");
    if (lc || bc || gv) {
      setInputs((prev) => ({
        ...prev,
        ...(lc ? { landCost: fmt(lc) } : {}),
        ...(bc ? { buildCosts: fmt(bc) } : {}),
        ...(pf ? { professionalFees: fmt(pf) } : {}),
        ...(ct ? { contingency: ct } : {}),
        ...(gv ? { gdv: fmt(gv) } : {}),
        ...(ir ? { interestRate: ir } : {}),
        ...(tm ? { termMonths: tm } : {}),
        ...(lt ? { ltgdv: lt } : {}),
      }));
    }
  }, [searchParams]);

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    const digits = raw.replace(/[^0-9]/g, "");
    const formatted = digits
      ? parseInt(digits, 10).toLocaleString("en-GB")
      : "";
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  function updateField(field: keyof Inputs, value: string | boolean) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const land = parseCurrency(inputs.landCost);
    const build = parseCurrency(inputs.buildCosts);
    const fees = parseCurrency(inputs.professionalFees);
    const contingencyPct = parseFloat(inputs.contingency) || 0;
    const gdv = parseCurrency(inputs.gdv);
    const rate = parseFloat(inputs.interestRate) || 0;
    const termMonths = parseInt(inputs.termMonths, 10) || 0;
    const ltgdvPct = parseFloat(inputs.ltgdv) || 0;

    const contingencyAmount = Math.round(build * (contingencyPct / 100));
    const totalCost = land + build + fees + contingencyAmount;
    const seniorDebt = Math.round(gdv * (ltgdvPct / 100));
    const seniorInterest = Math.round(
      seniorDebt * (rate / 100) * (termMonths / 12)
    );

    let mezzAmount = 0;
    let mezzInterest = 0;
    let mezzLtgdvActual = 0;

    if (inputs.useMezzanine) {
      const mezzLtgdvPct = parseFloat(inputs.mezzLtgdv) || 0;
      const mezzRateVal = parseFloat(inputs.mezzRate) || 0;
      const totalDebtTarget = Math.round(gdv * (mezzLtgdvPct / 100));
      mezzAmount = Math.max(0, totalDebtTarget - seniorDebt);
      mezzInterest = Math.round(
        mezzAmount * (mezzRateVal / 100) * (termMonths / 12)
      );
      mezzLtgdvActual = mezzLtgdvPct;
    }

    const totalDebt = seniorDebt + mezzAmount;
    const totalInterest = seniorInterest + mezzInterest;
    const equity = Math.max(0, totalCost - totalDebt);
    const profit = gdv - totalCost - totalInterest;
    const profitOnCost =
      totalCost + totalInterest > 0
        ? (profit / (totalCost + totalInterest)) * 100
        : 0;
    const ltgdvActual = gdv > 0 ? (seniorDebt / gdv) * 100 : 0;

    // Blended rate
    const blendedRate =
      totalDebt > 0
        ? (seniorDebt * rate + mezzAmount * (parseFloat(inputs.mezzRate) || 0)) /
          totalDebt
        : rate;

    return {
      totalCost,
      contingencyAmount,
      seniorDebt,
      seniorInterest,
      mezzAmount,
      mezzInterest,
      mezzLtgdvActual,
      totalDebt,
      totalInterest,
      equity,
      profit,
      profitOnCost,
      ltgdvActual,
      blendedRate,
      gdv,
      termMonths,
    };
  }, [inputs]);

  const dealRoomParams = new URLSearchParams({
    loan_type: inputs.useMezzanine
      ? "Development Finance"
      : "Development Finance",
    gdv: String(results.gdv),
    total_cost: String(results.totalCost),
    loan_amount: String(results.totalDebt),
    source: "development-finance-calculator",
  });

  const shareParams = new URLSearchParams({
    landCost: inputs.landCost.replace(/,/g, ""),
    buildCosts: inputs.buildCosts.replace(/,/g, ""),
    professionalFees: inputs.professionalFees.replace(/,/g, ""),
    contingency: inputs.contingency,
    gdv: inputs.gdv.replace(/,/g, ""),
    interestRate: inputs.interestRate,
    termMonths: inputs.termMonths,
    ltgdv: inputs.ltgdv,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Project Costs</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="df-land" className="text-sm font-semibold">
                Land Cost
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="df-land"
                  value={inputs.landCost}
                  onChange={(e) =>
                    updateCurrencyField("landCost", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="df-build" className="text-sm font-semibold">
                Build Costs
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="df-build"
                  value={inputs.buildCosts}
                  onChange={(e) =>
                    updateCurrencyField("buildCosts", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="df-fees" className="text-sm font-semibold">
                Professional Fees
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="df-fees"
                  value={inputs.professionalFees}
                  onChange={(e) =>
                    updateCurrencyField("professionalFees", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="df-contingency"
                  className="text-sm font-semibold"
                >
                  Contingency
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="df-contingency"
                    value={inputs.contingency}
                    onChange={(e) => updateField("contingency", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="df-gdv" className="text-sm font-semibold">
                  GDV
                </Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="df-gdv"
                    value={inputs.gdv}
                    onChange={(e) =>
                      updateCurrencyField("gdv", e.target.value)
                    }
                    className="h-11 pl-7"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Senior Debt</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="df-rate" className="text-sm font-semibold">
                  Rate (p.a.)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="df-rate"
                    value={inputs.interestRate}
                    onChange={(e) =>
                      updateField("interestRate", e.target.value)
                    }
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="df-term" className="text-sm font-semibold">
                  Term
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="df-term"
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

              <div>
                <Label htmlFor="df-ltgdv" className="text-sm font-semibold">
                  LTGDV
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="df-ltgdv"
                    value={inputs.ltgdv}
                    onChange={(e) => updateField("ltgdv", e.target.value)}
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

        {/* Mezzanine Toggle */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Mezzanine Finance</h2>
            <button
              type="button"
              role="switch"
              aria-checked={inputs.useMezzanine}
              onClick={() => updateField("useMezzanine", !inputs.useMezzanine)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                inputs.useMezzanine ? "bg-gold" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 ${
                  inputs.useMezzanine ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {inputs.useMezzanine && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="df-mezz-ltgdv"
                    className="text-sm font-semibold"
                  >
                    Total LTGDV
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="df-mezz-ltgdv"
                      value={inputs.mezzLtgdv}
                      onChange={(e) =>
                        updateField("mezzLtgdv", e.target.value)
                      }
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
                    htmlFor="df-mezz-rate"
                    className="text-sm font-semibold"
                  >
                    Mezz Rate (p.a.)
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="df-mezz-rate"
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
          )}
        </div>
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
              <Building2
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Development Appraisal</h2>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Project Cost</span>
              <span className="font-semibold">
                {formatGBP(results.totalCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Contingency ({inputs.contingency}%)
              </span>
              <span className="text-white/80">
                {formatGBP(results.contingencyAmount)}
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

            {/* Funding Structure */}
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Funding Structure
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Senior Debt ({formatPercent(results.ltgdvActual)} LTGDV)
              </span>
              <span className="font-semibold">
                {formatGBP(results.seniorDebt)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Senior Interest ({inputs.interestRate}% x{" "}
                {results.termMonths}mo)
              </span>
              <span className="text-white/80">
                {formatGBP(results.seniorInterest)}
              </span>
            </div>

            {inputs.useMezzanine && results.mezzAmount > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">
                    Mezzanine ({formatPercent(results.mezzLtgdvActual - results.ltgdvActual)} stretch)
                  </span>
                  <span className="font-semibold">
                    {formatGBP(results.mezzAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">
                    Mezz Interest ({inputs.mezzRate}% x {results.termMonths}mo)
                  </span>
                  <span className="text-white/80">
                    {formatGBP(results.mezzInterest)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Blended Rate</span>
                  <span className="text-white/80">
                    {formatPercent(results.blendedRate)} p.a.
                  </span>
                </div>
              </>
            )}

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Borrowing</span>
              <span className="font-semibold">
                {formatGBP(results.totalDebt)}
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
                {formatGBP(results.equity)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Profit */}
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Developer Profit
              </span>
              <span className="text-xl font-bold" style={{ color: "var(--gold)" }}>
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

        {/* Visual Capital Stack */}
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
                {inputs.useMezzanine && results.mezzAmount > 0 && (
                  <StackBar
                    label="Mezzanine"
                    amount={results.mezzAmount}
                    total={results.gdv}
                    color="oklch(0.65 0.13 85)"
                  />
                )}
                <StackBar
                  label="Equity"
                  amount={results.equity}
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
            Indicative figures only. Actual terms depend on the project, your
            experience and lender criteria. Contact us for a bespoke appraisal.
          </p>
        </div>

        {/* CTA */}
        <Button
          asChild
          size="lg"
          className="cta-shimmer h-14 w-full bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
        >
          <Link href={`/deal-room?${dealRoomParams.toString()}`}>
            Get Indicative Terms
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>

        {/* Share / Copy link */}
        <div className="flex justify-center">
          <ShareResults
            params={shareParams.toString()}
            calculatorSlug="development-finance"
          />
        </div>
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
