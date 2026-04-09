"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
} from "@/components/calculators/shared";
import { StackBar } from "@/components/calculators/shared";
import { DealRoomCta } from "@/components/calculators/shared";
import { Disclaimer } from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Inputs {
  seniorDebt: string;
  seniorRate: string;
  mezzAmount: string;
  mezzRate: string;
  seniorArrFee: string;
  mezzArrFee: string;
  termMonths: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function BlendedFinanceCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    seniorDebt: "1,500,000",
    seniorRate: "7",
    mezzAmount: "400,000",
    mezzRate: "14",
    seniorArrFee: "2",
    mezzArrFee: "2.5",
    termMonths: "18",
  });

  function updateCurrency(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const senior = parseCurrency(inputs.seniorDebt);
    const sRate = parseFloat(inputs.seniorRate) || 0;
    const mezz = parseCurrency(inputs.mezzAmount);
    const mRate = parseFloat(inputs.mezzRate) || 0;
    const sFeePct = parseFloat(inputs.seniorArrFee) || 0;
    const mFeePct = parseFloat(inputs.mezzArrFee) || 0;
    const term = parseInt(inputs.termMonths, 10) || 0;

    const seniorInterest = Math.round(senior * (sRate / 100) * (term / 12));
    const mezzInterest = Math.round(mezz * (mRate / 100) * (term / 12));
    const seniorFee = Math.round(senior * (sFeePct / 100));
    const mezzFee = Math.round(mezz * (mFeePct / 100));

    const totalDebt = senior + mezz;
    const blendedRate = totalDebt > 0
      ? (senior * sRate + mezz * mRate) / totalDebt
      : 0;
    const totalInterest = seniorInterest + mezzInterest;
    const totalFees = seniorFee + mezzFee;
    const totalFinanceCost = totalInterest + totalFees;
    const monthlyFinanceCost = term > 0 ? Math.round(totalFinanceCost / term) : 0;

    const seniorTotalCost = seniorInterest + seniorFee;
    const mezzTotalCost = mezzInterest + mezzFee;

    return {
      senior,
      mezz,
      seniorInterest,
      mezzInterest,
      seniorFee,
      mezzFee,
      seniorTotalCost,
      mezzTotalCost,
      totalDebt,
      blendedRate,
      totalInterest,
      totalFees,
      totalFinanceCost,
      monthlyFinanceCost,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Senior Debt</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="bf-senior" className="text-sm font-semibold">
                Senior Debt Amount
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="bf-senior"
                  value={inputs.seniorDebt}
                  onChange={(e) => updateCurrency("seniorDebt", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bf-sr" className="text-sm font-semibold">
                  Interest Rate (p.a.)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="bf-sr"
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
                <Label htmlFor="bf-saf" className="text-sm font-semibold">
                  Arrangement Fee
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="bf-saf"
                    value={inputs.seniorArrFee}
                    onChange={(e) => updateField("seniorArrFee", e.target.value)}
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

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Mezzanine Debt</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="bf-mezz" className="text-sm font-semibold">
                Mezzanine Amount
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="bf-mezz"
                  value={inputs.mezzAmount}
                  onChange={(e) => updateCurrency("mezzAmount", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bf-mr" className="text-sm font-semibold">
                  Interest Rate (p.a.)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="bf-mr"
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

              <div>
                <Label htmlFor="bf-maf" className="text-sm font-semibold">
                  Arrangement Fee
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="bf-maf"
                    value={inputs.mezzArrFee}
                    onChange={(e) => updateField("mezzArrFee", e.target.value)}
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

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Term</h2>
          <div>
            <Label htmlFor="bf-term" className="text-sm font-semibold">
              Loan Term
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="bf-term"
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
              <Calculator
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Blended Finance Summary</h2>
          </div>

          {/* Headline */}
          <div className="mb-2 text-sm text-white/60">Blended Rate</div>
          <div
            className="mb-6 text-3xl font-bold tracking-tight"
            style={{ color: "var(--gold)" }}
          >
            {formatPercent(results.blendedRate)} p.a.
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Borrowing</span>
              <span className="font-semibold">{formatGBP(results.totalDebt)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Senior breakdown */}
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Senior Tranche
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Debt</span>
              <span className="font-semibold">{formatGBP(results.senior)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Interest ({inputs.seniorRate}% x {inputs.termMonths}mo)</span>
              <span className="text-white/80">{formatGBP(results.seniorInterest)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Arrangement Fee ({inputs.seniorArrFee}%)</span>
              <span className="text-white/80">{formatGBP(results.seniorFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Senior Cost</span>
              <span className="font-semibold">{formatGBP(results.seniorTotalCost)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Mezz breakdown */}
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Mezzanine Tranche
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Debt</span>
              <span className="font-semibold">{formatGBP(results.mezz)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Interest ({inputs.mezzRate}% x {inputs.termMonths}mo)</span>
              <span className="text-white/80">{formatGBP(results.mezzInterest)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Arrangement Fee ({inputs.mezzArrFee}%)</span>
              <span className="text-white/80">{formatGBP(results.mezzFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Mezz Cost</span>
              <span className="font-semibold">{formatGBP(results.mezzTotalCost)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Totals */}
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Interest</span>
              <span className="font-semibold">{formatGBP(results.totalInterest)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Fees</span>
              <span className="font-semibold">{formatGBP(results.totalFees)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Total Finance Cost
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.totalFinanceCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Monthly Finance Cost</span>
              <span className="font-semibold">{formatGBP(results.monthlyFinanceCost)}</span>
            </div>
          </div>
        </div>

        {/* Debt composition */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Debt Composition
          </h3>
          <div className="space-y-2">
            {results.totalDebt > 0 && (
              <>
                <StackBar
                  label="Senior Debt"
                  amount={results.senior}
                  total={results.totalDebt}
                  color="oklch(0.75 0.12 85)"
                />
                <StackBar
                  label="Mezzanine"
                  amount={results.mezz}
                  total={results.totalDebt}
                  color="oklch(0.65 0.13 85)"
                />
              </>
            )}
          </div>
        </div>

        <DealRoomCta
          params={{
            loan_type: "Blended Finance",
            loan_amount: String(results.totalDebt),
            source: "blended-finance-calculator",
          }}
        />

        <Disclaimer />
      </div>
    </div>
  );
}
