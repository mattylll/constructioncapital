"use client";

import { useState, useMemo } from "react";
import { PieChart } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
  DealRoomCta,
  Disclaimer,
} from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Inputs {
  numProperties: string;
  portfolioValue: string;
  outstandingDebt: string;
  monthlyRent: string;
  avgInterestRate: string;
  targetLTV: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PortfolioLeverageCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    numProperties: "6",
    portfolioValue: "2,400,000",
    outstandingDebt: "1,500,000",
    monthlyRent: "9,000",
    avgInterestRate: "4.5",
    targetLTV: "75",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const numProperties = parseInt(inputs.numProperties, 10) || 0;
    const portfolioValue = parseCurrency(inputs.portfolioValue);
    const outstandingDebt = parseCurrency(inputs.outstandingDebt);
    const monthlyRent = parseCurrency(inputs.monthlyRent);
    const avgInterestRate = parseFloat(inputs.avgInterestRate) || 0;
    const targetLTV = parseFloat(inputs.targetLTV) || 0;

    const currentLTV =
      portfolioValue > 0 ? (outstandingDebt / portfolioValue) * 100 : 0;
    const equity = portfolioValue - outstandingDebt;
    const equityAvailable =
      portfolioValue * (targetLTV / 100) - outstandingDebt;
    const borrowingCapacity = Math.max(0, Math.round(equityAvailable));

    const annualRent = monthlyRent * 12;
    const annualDebtService = Math.round(
      outstandingDebt * (avgInterestRate / 100)
    );
    const dscr = annualDebtService > 0 ? annualRent / annualDebtService : 0;

    const portfolioYield =
      portfolioValue > 0 ? (annualRent / portfolioValue) * 100 : 0;
    const yieldOnEquity = equity > 0 ? (annualRent / equity) * 100 : 0;

    const avgPropertyValue =
      numProperties > 0 ? Math.round(portfolioValue / numProperties) : 0;
    const avgRentPerProperty =
      numProperties > 0 ? Math.round(monthlyRent / numProperties) : 0;

    return {
      numProperties,
      portfolioValue,
      outstandingDebt,
      equity,
      currentLTV,
      borrowingCapacity,
      annualRent,
      annualDebtService,
      dscr,
      portfolioYield,
      yieldOnEquity,
      avgPropertyValue,
      avgRentPerProperty,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Portfolio Overview</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="pl-props" className="text-sm font-semibold">
                Number of Properties
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="pl-props"
                  value={inputs.numProperties}
                  onChange={(e) => updateField("numProperties", e.target.value)}
                  className="h-11"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pl-value" className="text-sm font-semibold">
                Total Portfolio Value
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="pl-value"
                  value={inputs.portfolioValue}
                  onChange={(e) =>
                    updateCurrencyField("portfolioValue", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pl-debt" className="text-sm font-semibold">
                Total Outstanding Debt
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="pl-debt"
                  value={inputs.outstandingDebt}
                  onChange={(e) =>
                    updateCurrencyField("outstandingDebt", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pl-rent" className="text-sm font-semibold">
                Total Monthly Rent
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="pl-rent"
                  value={inputs.monthlyRent}
                  onChange={(e) =>
                    updateCurrencyField("monthlyRent", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pl-rate" className="text-sm font-semibold">
                  Avg Interest Rate
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="pl-rate"
                    value={inputs.avgInterestRate}
                    onChange={(e) =>
                      updateField("avgInterestRate", e.target.value)
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
                <Label htmlFor="pl-target" className="text-sm font-semibold">
                  Target Refi LTV
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="pl-target"
                    value={inputs.targetLTV}
                    onChange={(e) => updateField("targetLTV", e.target.value)}
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

        {/* LTV gauge */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Current Loan-to-Value
          </h3>
          <div className="flex items-end justify-between">
            <div>
              <p
                className="text-4xl font-bold"
                style={{
                  color:
                    results.currentLTV > 75
                      ? "oklch(0.55 0.22 25)"
                      : "var(--gold-dark)",
                }}
              >
                {formatPercent(results.currentLTV)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {results.currentLTV > 75
                  ? "Over-leveraged - refinance options limited"
                  : "Within standard lending criteria"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">DSCR</p>
              <p
                className="text-lg font-bold"
                style={{
                  color:
                    results.dscr >= 1.25
                      ? "var(--gold-dark)"
                      : "oklch(0.55 0.22 25)",
                }}
              >
                {results.dscr.toFixed(2)}x
              </p>
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, results.currentLTV)}%`,
                background:
                  results.currentLTV > 75
                    ? "oklch(0.55 0.22 25)"
                    : "oklch(0.75 0.12 85)",
              }}
            />
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
              <PieChart
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Portfolio Analysis</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Equity</span>
              <span className="font-semibold">{formatGBP(results.equity)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Current LTV</span>
              <span className="font-semibold">
                {formatPercent(results.currentLTV)}
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
              Refinance Capacity
            </h3>

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Available to Draw
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.borrowingCapacity)}
              </span>
            </div>
            <p className="text-xs text-white/40">
              At {inputs.targetLTV}% LTV across the portfolio
            </p>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Yield Metrics
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Portfolio Yield (Gross)</span>
              <span className="font-semibold">
                {formatPercent(results.portfolioYield)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Yield on Equity</span>
              <span
                className="text-lg font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatPercent(results.yieldOnEquity)}
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
              Debt Service
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Annual Rent</span>
              <span className="text-white/80">
                {formatGBP(results.annualRent)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Annual Debt Service</span>
              <span className="text-white/80">
                {formatGBP(results.annualDebtService)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">DSCR</span>
              <span
                className="font-semibold"
                style={{
                  color:
                    results.dscr >= 1.25
                      ? "var(--gold)"
                      : "oklch(0.55 0.22 25)",
                }}
              >
                {results.dscr.toFixed(2)}x
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
              Per Property Averages
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Avg Value</span>
              <span className="text-white/80">
                {formatGBP(results.avgPropertyValue)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Avg Monthly Rent</span>
              <span className="text-white/80">
                {formatGBP(results.avgRentPerProperty)}
              </span>
            </div>
          </div>
        </div>

        <Disclaimer text="Portfolio analysis is based on aggregate figures. Individual property valuations, rental voids, and lender stress tests will affect actual refinance capacity. DSCR above 1.25x is typically required." />

        <DealRoomCta
          params={{
            loan_type: "Portfolio Refinance",
            gdv: String(results.portfolioValue),
            loan_amount: String(results.borrowingCapacity),
            source: "portfolio-leverage-calculator",
          }}
          label="Discuss Portfolio Refinance"
        />
      </div>
    </div>
  );
}
