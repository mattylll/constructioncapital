"use client";

import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
  DealRoomCta,
  Disclaimer,
  StackBar,
} from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Inputs {
  purchasePrice: string;
  depositPct: string;
  mortgageRate: string;
  termYears: string;
  monthlyRent: string;
  annualCosts: string;
  growthRate: string;
  holdingPeriod: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function RoiCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    purchasePrice: "350,000",
    depositPct: "25",
    mortgageRate: "4.5",
    termYears: "25",
    monthlyRent: "1,500",
    annualCosts: "3,000",
    growthRate: "4",
    holdingPeriod: "5",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const purchasePrice = parseCurrency(inputs.purchasePrice);
    const depositPct = parseFloat(inputs.depositPct) || 0;
    const mortgageRate = parseFloat(inputs.mortgageRate) || 0;
    const termYears = parseInt(inputs.termYears, 10) || 1;
    const monthlyRent = parseCurrency(inputs.monthlyRent);
    const annualCosts = parseCurrency(inputs.annualCosts);
    const growthRate = parseFloat(inputs.growthRate) || 0;
    const holdingPeriod = parseInt(inputs.holdingPeriod, 10) || 1;

    const depositAmount = Math.round(purchasePrice * (depositPct / 100));
    const loanAmount = purchasePrice - depositAmount;

    // Interest-only monthly payment
    const monthlyPayment = Math.round(loanAmount * (mortgageRate / 100) / 12);
    const annualMortgage = monthlyPayment * 12;
    const annualRent = monthlyRent * 12;
    const annualCashFlow = annualRent - annualCosts - annualMortgage;
    const totalRentalIncome = annualCashFlow * holdingPeriod;

    // Capital growth (compound)
    const capitalGrowth = Math.round(
      purchasePrice * (Math.pow(1 + growthRate / 100, holdingPeriod) - 1)
    );

    const totalReturn = totalRentalIncome + capitalGrowth;
    const annualisedROI =
      depositAmount > 0
        ? (totalReturn / depositAmount / holdingPeriod) * 100
        : 0;
    const roiOnCash =
      depositAmount > 0 ? (totalReturn / depositAmount) * 100 : 0;

    return {
      purchasePrice,
      depositAmount,
      loanAmount,
      monthlyPayment,
      annualMortgage,
      annualRent,
      annualCosts,
      annualCashFlow,
      totalRentalIncome,
      capitalGrowth,
      totalReturn,
      annualisedROI,
      roiOnCash,
      holdingPeriod,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Property Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="roi-price" className="text-sm font-semibold">
                Purchase Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="roi-price"
                  value={inputs.purchasePrice}
                  onChange={(e) =>
                    updateCurrencyField("purchasePrice", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roi-deposit" className="text-sm font-semibold">
                  Deposit
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="roi-deposit"
                    value={inputs.depositPct}
                    onChange={(e) => updateField("depositPct", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="roi-rate" className="text-sm font-semibold">
                  Mortgage Rate
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="roi-rate"
                    value={inputs.mortgageRate}
                    onChange={(e) => updateField("mortgageRate", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="roi-term" className="text-sm font-semibold">
                Term (years)
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="roi-term"
                  value={inputs.termYears}
                  onChange={(e) => updateField("termYears", e.target.value)}
                  className="h-11 pr-12"
                  inputMode="numeric"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  yrs
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Income &amp; Growth</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="roi-rent" className="text-sm font-semibold">
                Monthly Rent
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="roi-rent"
                  value={inputs.monthlyRent}
                  onChange={(e) =>
                    updateCurrencyField("monthlyRent", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="roi-costs" className="text-sm font-semibold">
                Annual Costs
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="roi-costs"
                  value={inputs.annualCosts}
                  onChange={(e) =>
                    updateCurrencyField("annualCosts", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roi-growth" className="text-sm font-semibold">
                  Growth p.a.
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="roi-growth"
                    value={inputs.growthRate}
                    onChange={(e) => updateField("growthRate", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="roi-hold" className="text-sm font-semibold">
                  Holding Period
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="roi-hold"
                    value={inputs.holdingPeriod}
                    onChange={(e) =>
                      updateField("holdingPeriod", e.target.value)
                    }
                    className="h-11 pr-12"
                    inputMode="numeric"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    yrs
                  </span>
                </div>
              </div>
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
              <TrendingUp
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Investment Returns</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Total Return ({results.holdingPeriod} yrs)
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.totalReturn)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Return Breakdown
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Net Rental Income</span>
              <span className="font-semibold">
                {formatGBP(results.totalRentalIncome)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Capital Growth</span>
              <span className="font-semibold">
                {formatGBP(results.capitalGrowth)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              ROI Metrics
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Annualised ROI</span>
              <span
                className="text-lg font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatPercent(results.annualisedROI)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total ROI on Cash Invested</span>
              <span className="font-semibold">
                {formatPercent(results.roiOnCash)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Annual Cash Flow
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Gross Rent</span>
              <span className="text-white/80">
                {formatGBP(results.annualRent)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Mortgage (Interest Only)</span>
              <span className="text-white/80">
                -{formatGBP(results.annualMortgage)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Running Costs</span>
              <span className="text-white/80">
                -{formatGBP(results.annualCosts)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Net Cash Flow p.a.</span>
              <span
                className="font-semibold"
                style={{
                  color:
                    results.annualCashFlow >= 0
                      ? "var(--gold)"
                      : "oklch(0.55 0.22 25)",
                }}
              >
                {formatGBP(results.annualCashFlow)}
              </span>
            </div>
          </div>
        </div>

        {/* Return breakdown bar */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Return Composition
          </h3>
          <div className="space-y-2">
            <StackBar
              label="Net Rental Income"
              amount={Math.max(0, results.totalRentalIncome)}
              total={Math.max(1, Math.abs(results.totalRentalIncome) + results.capitalGrowth)}
              color="oklch(0.75 0.12 85)"
            />
            <StackBar
              label="Capital Growth"
              amount={results.capitalGrowth}
              total={Math.max(1, Math.abs(results.totalRentalIncome) + results.capitalGrowth)}
              color="oklch(0.65 0.13 85)"
            />
          </div>
        </div>

        <Disclaimer text="Assumes interest-only mortgage and constant rental income. Growth is compounded annually. Actual returns vary based on void periods, maintenance, tax position and market conditions." />

        <DealRoomCta
          params={{
            loan_type: "Buy-to-Let Mortgage",
            gdv: String(results.purchasePrice),
            loan_amount: String(results.loanAmount),
            source: "roi-calculator",
          }}
          label="Discuss Your Investment"
        />
      </div>
    </div>
  );
}
