"use client";

import { useState, useMemo } from "react";
import { Home } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
} from "@/components/calculators/shared";
import { DealRoomCta } from "@/components/calculators/shared";
import { Disclaimer } from "@/components/calculators/shared";

interface Inputs {
  propertyValue: string;
  deposit: string;
  interestRate: string;
  mortgageType: "interest-only" | "repayment";
  term: string;
  monthlyRent: string;
  stressTestRate: string;
}

export function BtlMortgageCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    propertyValue: "350,000",
    deposit: "25",
    interestRate: "4.5",
    mortgageType: "interest-only",
    term: "25",
    monthlyRent: "1,500",
    stressTestRate: "5.5",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    const formatted = formatCurrencyInput(raw);
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const propertyValue = parseCurrency(inputs.propertyValue);
    const depositPct = parseFloat(inputs.deposit) || 0;
    const interestRate = parseFloat(inputs.interestRate) || 0;
    const term = parseInt(inputs.term, 10) || 0;
    const monthlyRent = parseCurrency(inputs.monthlyRent);
    const stressTestRate = parseFloat(inputs.stressTestRate) || 0;

    const loanAmount = Math.round(propertyValue * (1 - depositPct / 100));
    const depositAmount = propertyValue - loanAmount;
    const ltv = propertyValue > 0 ? (loanAmount / propertyValue) * 100 : 0;

    // Monthly payment calculation
    let monthlyPayment = 0;
    if (inputs.mortgageType === "interest-only") {
      monthlyPayment = Math.round(loanAmount * (interestRate / 100 / 12));
    } else {
      // Repayment (standard amortization)
      const r = interestRate / 100 / 12;
      const n = term * 12;
      if (r > 0 && n > 0) {
        monthlyPayment = Math.round(
          loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        );
      }
    }

    const annualMortgageCost = monthlyPayment * 12;
    const annualRent = monthlyRent * 12;

    // ICR calculations
    const annualInterest = loanAmount * (interestRate / 100);
    const icr = annualInterest > 0 ? (annualRent / annualInterest) * 100 : 0;

    const stressTestedMonthlyInterest = loanAmount * (stressTestRate / 100 / 12);
    const stressTestedICR =
      stressTestedMonthlyInterest > 0
        ? (monthlyRent / stressTestedMonthlyInterest) * 100
        : 0;

    // Profit calculations
    const monthlyProfit = monthlyRent - monthlyPayment;
    const annualProfit = monthlyProfit * 12;
    const effectiveYield =
      depositAmount > 0 ? (annualProfit / depositAmount) * 100 : 0;

    // Max borrowing at standard ICR (125%) using stress test rate
    const maxBorrowing =
      stressTestRate > 0
        ? Math.round(monthlyRent / 1.25 / (stressTestRate / 100 / 12))
        : 0;

    return {
      propertyValue,
      depositPct,
      loanAmount,
      depositAmount,
      ltv,
      interestRate,
      monthlyPayment,
      annualMortgageCost,
      monthlyRent,
      annualRent,
      icr,
      stressTestedICR,
      monthlyProfit,
      annualProfit,
      effectiveYield,
      maxBorrowing,
      stressTestRate,
    };
  }, [inputs]);

  // ICR status
  const icrStatus = useMemo(() => {
    if (results.stressTestedICR >= 145) {
      return {
        label: "Passes most lender criteria",
        border: "1px solid oklch(0.6 0.15 145 / 0.3)",
        bg: "oklch(0.6 0.15 145 / 0.05)",
        color: "oklch(0.6 0.15 145)",
      };
    }
    if (results.stressTestedICR >= 125) {
      return {
        label: "Passes minimum criteria",
        border: "1px solid oklch(0.7 0.15 60 / 0.3)",
        bg: "oklch(0.7 0.15 60 / 0.05)",
        color: "oklch(0.7 0.15 60)",
      };
    }
    return {
      label: "Below minimum threshold",
      border: "1px solid oklch(0.55 0.22 25 / 0.3)",
      bg: "oklch(0.55 0.22 25 / 0.05)",
      color: "oklch(0.55 0.22 25)",
    };
  }, [results.stressTestedICR]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        {/* Card 1: Property & Mortgage */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Property &amp; Mortgage</h2>

          <div className="space-y-4">
            {/* Property Value */}
            <div>
              <Label htmlFor="btl-value" className="text-sm font-semibold">
                Property Value
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="btl-value"
                  value={inputs.propertyValue}
                  onChange={(e) =>
                    updateCurrencyField("propertyValue", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* Deposit % */}
            <div>
              <Label htmlFor="btl-deposit" className="text-sm font-semibold">
                Deposit
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="btl-deposit"
                  value={inputs.deposit}
                  onChange={(e) => updateField("deposit", e.target.value)}
                  className="h-11 pr-7"
                  inputMode="decimal"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <Label htmlFor="btl-rate" className="text-sm font-semibold">
                Interest Rate (p.a.)
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="btl-rate"
                  value={inputs.interestRate}
                  onChange={(e) => updateField("interestRate", e.target.value)}
                  className="h-11 pr-7"
                  inputMode="decimal"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            {/* Mortgage Type */}
            <div>
              <Label htmlFor="btl-type" className="text-sm font-semibold">
                Mortgage Type
              </Label>
              <div className="mt-1.5">
                <select
                  id="btl-type"
                  value={inputs.mortgageType}
                  onChange={(e) =>
                    updateField(
                      "mortgageType",
                      e.target.value as "interest-only" | "repayment"
                    )
                  }
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="interest-only">Interest Only</option>
                  <option value="repayment">Repayment</option>
                </select>
              </div>
            </div>

            {/* Term */}
            <div>
              <Label htmlFor="btl-term" className="text-sm font-semibold">
                Term
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="btl-term"
                  value={inputs.term}
                  onChange={(e) => updateField("term", e.target.value)}
                  className="h-11 pr-14"
                  inputMode="numeric"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  years
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Rental Income */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Rental Income</h2>

          <div className="space-y-4">
            {/* Monthly Rent */}
            <div>
              <Label htmlFor="btl-rent" className="text-sm font-semibold">
                Monthly Rent
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="btl-rent"
                  value={inputs.monthlyRent}
                  onChange={(e) =>
                    updateCurrencyField("monthlyRent", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* Stress Test Rate */}
            <div>
              <Label htmlFor="btl-stress" className="text-sm font-semibold">
                Stress Test Rate
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="btl-stress"
                  value={inputs.stressTestRate}
                  onChange={(e) =>
                    updateField("stressTestRate", e.target.value)
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

        {/* ICR Status Panel */}
        <div
          className="rounded-xl p-6"
          style={{
            border: icrStatus.border,
            background: icrStatus.bg,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ background: icrStatus.color }}
            />
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Interest Cover Ratio
            </h3>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p
                className="text-4xl font-bold"
                style={{ color: icrStatus.color }}
              >
                {formatPercent(results.icr)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                ICR at {formatPercent(results.interestRate)}
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-xl font-bold"
                style={{ color: icrStatus.color }}
              >
                {formatPercent(results.stressTestedICR)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Stress-tested at {formatPercent(results.stressTestRate)}
              </p>
            </div>
          </div>
          <p
            className="mt-4 text-sm font-semibold"
            style={{ color: icrStatus.color }}
          >
            {icrStatus.label}
          </p>
        </div>
      </div>

      {/* ━━━ RESULTS ━━━ */}
      <div className="space-y-6">
        {/* Navy gradient results card */}
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
              <Home className="h-5 w-5" style={{ color: "var(--gold)" }} />
            </div>
            <h2 className="text-lg font-bold">BTL Mortgage Analysis</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Property Value</span>
              <span className="font-semibold">
                {formatGBP(results.propertyValue)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Loan Amount (LTV {formatPercent(results.ltv)})</span>
              <span className="font-semibold">
                {formatGBP(results.loanAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Deposit Required</span>
              <span className="text-white/80">
                {formatGBP(results.depositAmount)}
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
              Monthly Breakdown
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Monthly Mortgage Payment</span>
              <span className="font-semibold">
                {formatGBP(results.monthlyPayment)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Monthly Rent</span>
              <span className="text-white/80">
                {formatGBP(results.monthlyRent)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Monthly {results.monthlyProfit >= 0 ? "Profit" : "Loss"}
              </span>
              <span
                className="font-semibold"
                style={{
                  color:
                    results.monthlyProfit >= 0
                      ? "oklch(0.6 0.15 145)"
                      : "oklch(0.55 0.22 25)",
                }}
              >
                {results.monthlyProfit >= 0 ? "" : "-"}
                {formatGBP(Math.abs(results.monthlyProfit))}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Annual Rent</span>
              <span className="font-semibold">
                {formatGBP(results.annualRent)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Annual Mortgage Cost</span>
              <span className="text-white/80">
                {formatGBP(results.annualMortgageCost)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Annual {results.annualProfit >= 0 ? "Profit" : "Loss"}
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {results.annualProfit >= 0 ? "" : "-"}
                {formatGBP(Math.abs(results.annualProfit))}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                ICR ({formatPercent(results.interestRate)})
              </span>
              <span className="font-semibold">
                {formatPercent(results.icr)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                ICR (stress-tested {formatPercent(results.stressTestRate)})
              </span>
              <span className="font-semibold">
                {formatPercent(results.stressTestedICR)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Return on Cash Invested</span>
              <span className="font-semibold">
                {formatPercent(results.effectiveYield)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Max Borrowing (at stress test)</span>
              <span className="font-semibold">
                {formatGBP(results.maxBorrowing)}
              </span>
            </div>
          </div>
        </div>

        {/* LTV Visual Bar */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Loan-to-Value
          </h3>
          <div className="flex items-end justify-between">
            <div>
              <p
                className="text-4xl font-bold"
                style={{
                  color:
                    results.ltv > 75
                      ? "oklch(0.55 0.22 25)"
                      : "var(--gold-dark)",
                }}
              >
                {formatPercent(results.ltv)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {results.ltv > 75
                  ? "Exceeds typical 75% LTV limit"
                  : "Within standard lending criteria"}
              </p>
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, results.ltv)}%`,
                background:
                  results.ltv > 75
                    ? "oklch(0.55 0.22 25)"
                    : "oklch(0.75 0.12 85)",
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <DealRoomCta
          params={{
            loan_type: "Commercial Mortgage",
            total_cost: String(results.propertyValue),
            loan_amount: String(results.loanAmount),
            source: "btl-mortgage-calculator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer text="Indicative figures only. Actual rates, affordability and ICR requirements vary by lender. Contact us for a precise quote from our lender panel." />
      </div>
    </div>
  );
}
