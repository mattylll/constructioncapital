"use client";

import { useState, useMemo } from "react";
import { LogOut } from "lucide-react";

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
  outstandingDevLoan: string;
  devLoanRate: string;
  remainingUnits: string;
  avgUnitPrice: string;
  salesRate: string;
  exitLTV: string;
  exitMonthlyRate: string;
  arrangementFee: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DevelopmentExitCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    outstandingDevLoan: "2,000,000",
    devLoanRate: "8",
    remainingUnits: "4",
    avgUnitPrice: "450,000",
    salesRate: "1",
    exitLTV: "75",
    exitMonthlyRate: "0.50",
    arrangementFee: "1.5",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const devLoan = parseCurrency(inputs.outstandingDevLoan);
    const devRate = parseFloat(inputs.devLoanRate) || 0;
    const remainingUnits = parseInt(inputs.remainingUnits, 10) || 0;
    const avgPrice = parseCurrency(inputs.avgUnitPrice);
    const salesRate = parseFloat(inputs.salesRate) || 1;
    const exitLTV = parseFloat(inputs.exitLTV) || 0;
    const exitRate = parseFloat(inputs.exitMonthlyRate) || 0;
    const arrFeePct = parseFloat(inputs.arrangementFee) || 0;

    const currentMonthlyInterest = Math.round((devLoan * devRate) / 100 / 12);
    const salesPeriod = Math.ceil(remainingUnits / salesRate);

    const totalGDV = remainingUnits * avgPrice;
    const exitLoanAmount = Math.min(
      devLoan,
      Math.round(totalGDV * (exitLTV / 100))
    );
    const exitMonthlyInterest = Math.round(
      exitLoanAmount * (exitRate / 100)
    );
    const exitTotalInterest = exitMonthlyInterest * salesPeriod;
    const exitArrFee = Math.round(exitLoanAmount * (arrFeePct / 100));

    const devLoanInterestOverPeriod = currentMonthlyInterest * salesPeriod;
    const savingsVsDevLoan =
      devLoanInterestOverPeriod - exitTotalInterest - exitArrFee;

    // Net proceeds timeline (cumulative)
    const timeline: { month: number; proceeds: number; loanBalance: number }[] =
      [];
    let loanBalance = exitLoanAmount;
    let cumulativeProceeds = 0;
    for (let m = 1; m <= salesPeriod; m++) {
      const unitsSoldThisMonth = Math.min(
        salesRate,
        remainingUnits - Math.floor((m - 1) * salesRate)
      );
      const saleProceeds = Math.round(unitsSoldThisMonth * avgPrice);
      cumulativeProceeds += saleProceeds;
      loanBalance = Math.max(0, loanBalance - saleProceeds);
      timeline.push({
        month: m,
        proceeds: cumulativeProceeds,
        loanBalance,
      });
    }

    return {
      devLoan,
      currentMonthlyInterest,
      salesPeriod,
      totalGDV,
      exitLoanAmount,
      exitMonthlyInterest,
      exitTotalInterest,
      exitArrFee,
      devLoanInterestOverPeriod,
      savingsVsDevLoan,
      timeline,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Development Loan</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="de-loan" className="text-sm font-semibold">
                Outstanding Dev Loan
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="de-loan"
                  value={inputs.outstandingDevLoan}
                  onChange={(e) =>
                    updateCurrencyField("outstandingDevLoan", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="de-devrate" className="text-sm font-semibold">
                Dev Loan Rate (p.a.)
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="de-devrate"
                  value={inputs.devLoanRate}
                  onChange={(e) => updateField("devLoanRate", e.target.value)}
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

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Sales &amp; Exit</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="de-units" className="text-sm font-semibold">
                  Remaining Units
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="de-units"
                    value={inputs.remainingUnits}
                    onChange={(e) =>
                      updateField("remainingUnits", e.target.value)
                    }
                    className="h-11"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="de-salesrate" className="text-sm font-semibold">
                  Sales Rate
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="de-salesrate"
                    value={inputs.salesRate}
                    onChange={(e) => updateField("salesRate", e.target.value)}
                    className="h-11 pr-16"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    /month
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="de-avgprice" className="text-sm font-semibold">
                Avg Unit Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="de-avgprice"
                  value={inputs.avgUnitPrice}
                  onChange={(e) =>
                    updateCurrencyField("avgUnitPrice", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="de-exitltv" className="text-sm font-semibold">
                  Exit LTV
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="de-exitltv"
                    value={inputs.exitLTV}
                    onChange={(e) => updateField("exitLTV", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="de-exitrate" className="text-sm font-semibold">
                  Rate (p.m.)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="de-exitrate"
                    value={inputs.exitMonthlyRate}
                    onChange={(e) =>
                      updateField("exitMonthlyRate", e.target.value)
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
                <Label htmlFor="de-arrfee" className="text-sm font-semibold">
                  Arr. Fee
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="de-arrfee"
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
              <LogOut
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Exit Finance Analysis</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Exit Loan Amount</span>
              <span className="font-semibold">
                {formatGBP(results.exitLoanAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Sales Period</span>
              <span className="font-semibold">
                {results.salesPeriod} months
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
              Monthly Interest Comparison
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Dev Loan Interest (p.m.)</span>
              <span className="text-white/80">
                {formatGBP(results.currentMonthlyInterest)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Exit Loan Interest (p.m.)</span>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>
                {formatGBP(results.exitMonthlyInterest)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Monthly Saving</span>
              <span
                className="font-semibold"
                style={{
                  color:
                    results.currentMonthlyInterest > results.exitMonthlyInterest
                      ? "oklch(0.7 0.15 145)"
                      : "oklch(0.55 0.22 25)",
                }}
              >
                {formatGBP(
                  results.currentMonthlyInterest - results.exitMonthlyInterest
                )}
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
              Total Cost Over Sales Period
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Dev Loan Cost ({results.salesPeriod} mo)
              </span>
              <span className="text-white/80">
                {formatGBP(results.devLoanInterestOverPeriod)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Exit Loan Interest</span>
              <span className="text-white/80">
                {formatGBP(results.exitTotalInterest)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Exit Arrangement Fee</span>
              <span className="text-white/80">
                {formatGBP(results.exitArrFee)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                {results.savingsVsDevLoan >= 0
                  ? "Net Savings"
                  : "Additional Cost"}
              </span>
              <span
                className="text-xl font-bold"
                style={{
                  color:
                    results.savingsVsDevLoan >= 0
                      ? "var(--gold)"
                      : "oklch(0.55 0.22 25)",
                }}
              >
                {formatGBP(Math.abs(results.savingsVsDevLoan))}
              </span>
            </div>
          </div>
        </div>

        {/* Net proceeds timeline */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Net Proceeds Timeline
          </h3>
          <div className="space-y-2">
            {results.timeline.map((row) => (
              <div key={row.month} className="flex items-center gap-3 text-sm">
                <span className="w-16 shrink-0 text-muted-foreground">
                  Month {row.month}
                </span>
                <div className="flex-1">
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          results.totalGDV > 0
                            ? (row.proceeds / results.totalGDV) * 100
                            : 0
                        }%`,
                        background: "oklch(0.75 0.12 85)",
                      }}
                    />
                  </div>
                </div>
                <span className="w-24 shrink-0 text-right font-medium">
                  {formatGBP(row.proceeds)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Disclaimer text="Exit finance replaces your development loan during the sales period, typically at a lower rate. Actual terms depend on the scheme, sales evidence, and lender appetite." />

        <DealRoomCta
          params={{
            loan_type: "Development Exit Finance",
            gdv: String(results.totalGDV),
            loan_amount: String(results.exitLoanAmount),
            source: "development-exit-calculator",
          }}
          label="Get Exit Finance Terms"
        />
      </div>
    </div>
  );
}
