"use client";

import { useState, useMemo } from "react";
import { Wrench } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
 StackBar , DealRoomCta , Disclaimer } from "@/components/calculators/shared";

interface Inputs {
  purchasePrice: string;
  refurbBudget: string;
  refurbScope: "light" | "heavy";
  postWorksValue: string;
  purchaseLTV: string;
  monthlyRate: string;
  termMonths: string;
  arrangementFee: string;
}

export function RefurbishmentFinanceCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    purchasePrice: "350,000",
    refurbBudget: "80,000",
    refurbScope: "light",
    postWorksValue: "500,000",
    purchaseLTV: "75",
    monthlyRate: "0.65",
    termMonths: "12",
    arrangementFee: "2",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    const formatted = formatCurrencyInput(raw);
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const purchasePrice = parseCurrency(inputs.purchasePrice);
    const refurbBudget = parseCurrency(inputs.refurbBudget);
    const postWorksValue = parseCurrency(inputs.postWorksValue);
    const purchaseLTV = parseFloat(inputs.purchaseLTV) || 0;
    const monthlyRate = parseFloat(inputs.monthlyRate) || 0;
    const termMonths = parseInt(inputs.termMonths, 10) || 0;
    const arrangementFeePct = parseFloat(inputs.arrangementFee) || 0;

    const day1Loan = Math.round(purchasePrice * (purchaseLTV / 100));
    const refurbFunded = refurbBudget; // 100% of refurb costs funded
    const totalFacility = day1Loan + refurbFunded;

    const postWorksLTV =
      postWorksValue > 0 ? (totalFacility / postWorksValue) * 100 : 0;

    // Simplified: interest on full facility
    const monthlyInterestAmount = Math.round(
      totalFacility * (monthlyRate / 100)
    );
    const totalInterest = monthlyInterestAmount * termMonths;
    const arrangementFeeAmount = Math.round(
      totalFacility * (arrangementFeePct / 100)
    );
    const totalBorrowingCost = totalInterest + arrangementFeeAmount;
    const totalRepayment = totalFacility + totalBorrowingCost;

    const depositRequired = purchasePrice - day1Loan;
    const valueUplift = postWorksValue - purchasePrice;
    const valueUpliftPct =
      purchasePrice > 0 ? (valueUplift / purchasePrice) * 100 : 0;
    const equityAfterRefurb = postWorksValue - totalFacility;
    const profitIfSold =
      postWorksValue - purchasePrice - refurbBudget - totalBorrowingCost;

    return {
      purchasePrice,
      refurbBudget,
      postWorksValue,
      purchaseLTV,
      day1Loan,
      refurbFunded,
      totalFacility,
      postWorksLTV,
      monthlyInterestAmount,
      totalInterest,
      arrangementFeeAmount,
      totalBorrowingCost,
      totalRepayment,
      depositRequired,
      valueUplift,
      valueUpliftPct,
      equityAfterRefurb,
      profitIfSold,
      termMonths,
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
              <Label htmlFor="rf-price" className="text-sm font-semibold">
                Purchase Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="rf-price"
                  value={inputs.purchasePrice}
                  onChange={(e) =>
                    updateCurrencyField("purchasePrice", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="rf-refurb" className="text-sm font-semibold">
                Refurbishment Budget
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="rf-refurb"
                  value={inputs.refurbBudget}
                  onChange={(e) =>
                    updateCurrencyField("refurbBudget", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="rf-scope" className="text-sm font-semibold">
                Refurb Scope
              </Label>
              <div className="mt-1.5">
                <select
                  id="rf-scope"
                  value={inputs.refurbScope}
                  onChange={(e) =>
                    updateField(
                      "refurbScope",
                      e.target.value as "light" | "heavy"
                    )
                  }
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="light">Light Refurb</option>
                  <option value="heavy">Heavy Refurb</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="rf-gdv" className="text-sm font-semibold">
                Post-Works Value (GDV)
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="rf-gdv"
                  value={inputs.postWorksValue}
                  onChange={(e) =>
                    updateCurrencyField("postWorksValue", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Finance Terms</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rf-ltv" className="text-sm font-semibold">
                  LTV on Purchase
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="rf-ltv"
                    value={inputs.purchaseLTV}
                    onChange={(e) => updateField("purchaseLTV", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="rf-rate" className="text-sm font-semibold">
                  Monthly Rate
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="rf-rate"
                    value={inputs.monthlyRate}
                    onChange={(e) => updateField("monthlyRate", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rf-term" className="text-sm font-semibold">
                  Term
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="rf-term"
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
                <Label htmlFor="rf-fee" className="text-sm font-semibold">
                  Arrangement Fee
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="rf-fee"
                    value={inputs.arrangementFee}
                    onChange={(e) =>
                      updateField("arrangementFee", e.target.value)
                    }
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

        {/* Value Uplift Highlight */}
        {results.valueUplift > 0 && (
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
              Value Uplift
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-sm text-muted-foreground">
                {formatGBP(results.purchasePrice)}
              </span>
              <span className="text-muted-foreground">&rarr;</span>
              <span
                className="text-3xl font-bold"
                style={{ color: "var(--gold-dark)" }}
              >
                {formatGBP(results.postWorksValue)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatGBP(results.valueUplift)} uplift (
              {results.valueUpliftPct.toFixed(0)}%)
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
              <Wrench className="h-5 w-5" style={{ color: "var(--gold)" }} />
            </div>
            <h2 className="text-lg font-bold">
              Refurbishment Finance Breakdown
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Day-1 Advance ({formatPercent(results.purchaseLTV)} LTV)
              </span>
              <span className="font-semibold">
                {formatGBP(results.day1Loan)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Refurb Facility (100% funded)
              </span>
              <span className="font-semibold">
                {formatGBP(results.refurbFunded)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Facility</span>
              <span className="font-semibold">
                {formatGBP(results.totalFacility)}
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
              Costs
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Monthly Interest</span>
              <span className="font-semibold">
                {formatGBP(results.monthlyInterestAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Total Interest ({results.termMonths} months)
              </span>
              <span className="text-white/80">
                {formatGBP(results.totalInterest)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Arrangement Fee ({inputs.arrangementFee}%)
              </span>
              <span className="text-white/80">
                {formatGBP(results.arrangementFeeAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Borrowing Cost</span>
              <span className="font-semibold">
                {formatGBP(results.totalBorrowingCost)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Deposit Required
              </span>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>
                {formatGBP(results.depositRequired)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Post-Works LTV</span>
              <span className="font-semibold">
                {formatPercent(results.postWorksLTV)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Equity After Refurb</span>
              <span className="font-semibold">
                {formatGBP(results.equityAfterRefurb)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Profit if Sold
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.profitIfSold)}
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
            {results.purchasePrice + results.refurbBudget > 0 && (
              <>
                <StackBar
                  label="Day-1 Loan"
                  amount={results.day1Loan}
                  total={results.purchasePrice + results.refurbBudget}
                  color="oklch(0.75 0.12 85)"
                />
                <StackBar
                  label="Refurb Drawdown"
                  amount={results.refurbFunded}
                  total={results.purchasePrice + results.refurbBudget}
                  color="oklch(0.65 0.13 85)"
                />
                <StackBar
                  label="Deposit"
                  amount={results.depositRequired}
                  total={results.purchasePrice + results.refurbBudget}
                  color="oklch(0.35 0.05 255)"
                />
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        <DealRoomCta
          params={{
            loan_type: "Refurbishment Finance",
            gdv: String(results.postWorksValue),
            total_cost: String(results.purchasePrice + results.refurbBudget),
            loan_amount: String(results.totalFacility),
            source: "refurbishment-finance-calculator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer text="Indicative figures based on full facility drawdown. In practice, interest accrues on drawn amounts only as refurb works progress." />
      </div>
    </div>
  );
}
