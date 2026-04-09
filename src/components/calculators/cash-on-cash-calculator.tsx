"use client";

import { useState, useMemo } from "react";
import { Banknote } from "lucide-react";

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
  propertyPrice: string;
  cashInvested: string;
  monthlyRent: string;
  monthlyExpenses: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CashOnCashCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    propertyPrice: "300,000",
    cashInvested: "90,000",
    monthlyRent: "1,200",
    monthlyExpenses: "750",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  const results = useMemo(() => {
    const propertyPrice = parseCurrency(inputs.propertyPrice);
    const cashInvested = parseCurrency(inputs.cashInvested);
    const monthlyRent = parseCurrency(inputs.monthlyRent);
    const monthlyExpenses = parseCurrency(inputs.monthlyExpenses);

    const monthlyCashFlow = monthlyRent - monthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCash =
      cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : 0;
    const paybackYears =
      annualCashFlow > 0 ? cashInvested / annualCashFlow : Infinity;

    return {
      propertyPrice,
      cashInvested,
      monthlyRent,
      monthlyExpenses,
      monthlyCashFlow,
      annualCashFlow,
      cashOnCash,
      paybackYears,
    };
  }, [inputs]);

  const cocRating =
    results.cashOnCash >= 10
      ? "Excellent"
      : results.cashOnCash >= 7
        ? "Good"
        : results.cashOnCash >= 4
          ? "Average"
          : "Below average";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Investment Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="coc-price" className="text-sm font-semibold">
                Property Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="coc-price"
                  value={inputs.propertyPrice}
                  onChange={(e) =>
                    updateCurrencyField("propertyPrice", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="coc-cash" className="text-sm font-semibold">
                Total Cash Invested
              </Label>
              <p className="text-xs text-muted-foreground">
                Deposit + fees + refurbishment
              </p>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="coc-cash"
                  value={inputs.cashInvested}
                  onChange={(e) =>
                    updateCurrencyField("cashInvested", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="coc-rent" className="text-sm font-semibold">
                Monthly Rent
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="coc-rent"
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
              <Label htmlFor="coc-expenses" className="text-sm font-semibold">
                Monthly Expenses
              </Label>
              <p className="text-xs text-muted-foreground">
                Mortgage + management + insurance
              </p>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="coc-expenses"
                  value={inputs.monthlyExpenses}
                  onChange={(e) =>
                    updateCurrencyField("monthlyExpenses", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
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
              <Banknote
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Cash-on-Cash Return</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                CoC Return
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatPercent(results.cashOnCash)}
              </span>
            </div>
            <p className="text-xs text-white/40">{cocRating}</p>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Cash Flow
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Monthly Cash Flow</span>
              <span
                className="font-semibold"
                style={{
                  color:
                    results.monthlyCashFlow >= 0
                      ? "var(--gold)"
                      : "oklch(0.55 0.22 25)",
                }}
              >
                {formatGBP(results.monthlyCashFlow)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Annual Cash Flow</span>
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

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Payback Period
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Years to Recoup Investment</span>
              <span className="font-semibold">
                {results.paybackYears === Infinity
                  ? "N/A"
                  : `${results.paybackYears.toFixed(1)} years`}
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
              Benchmark Comparison
            </h3>

            <div className="mt-3 space-y-2">
              {[
                { label: "Your CoC Return", value: results.cashOnCash, highlight: true },
                { label: "Cash Savings (~4%)", value: 4, highlight: false },
                { label: "Stock Market (~8%)", value: 8, highlight: false },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span
                      className={item.highlight ? "font-semibold" : "text-white/60"}
                    >
                      {item.label}
                    </span>
                    <span
                      className={item.highlight ? "font-semibold" : "text-white/60"}
                      style={item.highlight ? { color: "var(--gold)" } : undefined}
                    >
                      {formatPercent(item.value)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (item.value / Math.max(results.cashOnCash, 10)) * 100)}%`,
                        background: item.highlight
                          ? "oklch(0.75 0.12 85)"
                          : "oklch(1 0 0 / 0.25)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Disclaimer text="Cash-on-cash return measures pre-tax annual cash flow against total cash invested. Does not account for capital appreciation, tax relief, or void periods." />

        <DealRoomCta
          params={{
            loan_type: "Buy-to-Let Mortgage",
            gdv: String(results.propertyPrice),
            loan_amount: String(results.propertyPrice - results.cashInvested),
            source: "cash-on-cash-calculator",
          }}
          label="Optimise Your Returns"
        />
      </div>
    </div>
  );
}
