"use client";

import { useState, useMemo } from "react";
import { Gavel, CheckCircle2 } from "lucide-react";

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

type ExitStrategy = "sell" | "refinance";

interface Inputs {
  purchasePrice: string;
  postPurchaseValuation: string;
  ltv: string;
  monthlyRate: string;
  termMonths: string;
  refurbBudget: string;
  arrangementFee: string;
  exitStrategy: ExitStrategy;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AuctionFinanceCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    purchasePrice: "250,000",
    postPurchaseValuation: "300,000",
    ltv: "75",
    monthlyRate: "0.55",
    termMonths: "12",
    refurbBudget: "30,000",
    arrangementFee: "2",
    exitStrategy: "sell",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const purchasePrice = parseCurrency(inputs.purchasePrice);
    const valuation = parseCurrency(inputs.postPurchaseValuation);
    const ltv = parseFloat(inputs.ltv) || 0;
    const monthlyRate = parseFloat(inputs.monthlyRate) || 0;
    const termMonths = parseInt(inputs.termMonths, 10) || 0;
    const refurbBudget = parseCurrency(inputs.refurbBudget);
    const arrFeePct = parseFloat(inputs.arrangementFee) || 0;

    const maxLoan = Math.round(valuation * (ltv / 100));
    const arrangementFeeAmt = Math.round(maxLoan * (arrFeePct / 100));
    const netLoan = maxLoan - arrangementFeeAmt;

    // Auction deposit = 10% of purchase price on day of auction
    const depositOnDay = Math.round(purchasePrice * 0.1);
    const remainingToComplete = purchasePrice - depositOnDay - netLoan;

    const monthlyInterest = Math.round(maxLoan * (monthlyRate / 100));
    const totalInterest = monthlyInterest * termMonths;
    const totalFinanceCost = totalInterest + arrangementFeeAmt;

    const totalCashNeeded = depositOnDay + Math.max(0, remainingToComplete);

    return {
      purchasePrice,
      valuation,
      maxLoan,
      netLoan,
      depositOnDay,
      remainingToComplete,
      monthlyInterest,
      totalInterest,
      arrangementFeeAmt,
      totalFinanceCost,
      totalCashNeeded,
      refurbBudget,
      termMonths,
    };
  }, [inputs]);

  const timelineSteps = [
    { day: "Day 0", label: "Win at auction", detail: `Pay ${formatGBP(results.depositOnDay)} deposit (10%)` },
    { day: "Day 1-5", label: "Instruct solicitor", detail: "Legal pack review & searches" },
    { day: "Day 5-14", label: "Valuation & offer", detail: `Loan up to ${formatGBP(results.maxLoan)}` },
    { day: "Day 14-28", label: "Complete purchase", detail: `Cash needed: ${formatGBP(results.totalCashNeeded)}` },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Auction Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="af-price" className="text-sm font-semibold">
                Guide / Purchase Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="af-price"
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
              <Label htmlFor="af-val" className="text-sm font-semibold">
                Post-Purchase Valuation
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="af-val"
                  value={inputs.postPurchaseValuation}
                  onChange={(e) =>
                    updateCurrencyField(
                      "postPurchaseValuation",
                      e.target.value
                    )
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="af-ltv" className="text-sm font-semibold">
                  LTV
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="af-ltv"
                    value={inputs.ltv}
                    onChange={(e) => updateField("ltv", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="af-rate" className="text-sm font-semibold">
                  Rate (p.m.)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="af-rate"
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
              <div>
                <Label htmlFor="af-term" className="text-sm font-semibold">
                  Term
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="af-term"
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

            <div>
              <Label htmlFor="af-refurb" className="text-sm font-semibold">
                Refurb Budget (optional)
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="af-refurb"
                  value={inputs.refurbBudget}
                  onChange={(e) =>
                    updateCurrencyField("refurbBudget", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="af-arr" className="text-sm font-semibold">
                  Arrangement Fee
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="af-arr"
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
              <div>
                <Label htmlFor="af-exit" className="text-sm font-semibold">
                  Exit Strategy
                </Label>
                <select
                  id="af-exit"
                  value={inputs.exitStrategy}
                  onChange={(e) => updateField("exitStrategy", e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="sell">Sell</option>
                  <option value="refinance">Refinance</option>
                </select>
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
              <Gavel
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Auction Finance Breakdown</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Max Loan ({inputs.ltv}% LTV)</span>
              <span className="font-semibold">
                {formatGBP(results.maxLoan)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Arrangement Fee</span>
              <span className="text-white/80">
                -{formatGBP(results.arrangementFeeAmt)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Net Loan Proceeds</span>
              <span className="font-semibold">
                {formatGBP(results.netLoan)}
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
              Cash Required
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Auction Deposit (10%)</span>
              <span className="font-semibold">
                {formatGBP(results.depositOnDay)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Remaining to Complete</span>
              <span className="font-semibold">
                {results.remainingToComplete > 0
                  ? formatGBP(results.remainingToComplete)
                  : `Surplus: ${formatGBP(Math.abs(results.remainingToComplete))}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Total Cash Needed
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.totalCashNeeded)}
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
              Finance Cost
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Monthly Interest</span>
              <span className="text-white/80">
                {formatGBP(results.monthlyInterest)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Total Interest ({results.termMonths} mo)
              </span>
              <span className="text-white/80">
                {formatGBP(results.totalInterest)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Arrangement Fee</span>
              <span className="text-white/80">
                {formatGBP(results.arrangementFeeAmt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-white/80">
                Total Finance Cost
              </span>
              <span className="font-bold">
                {formatGBP(results.totalFinanceCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Cost breakdown bars */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Cost Summary
          </h3>
          <div className="space-y-2">
            <StackBar
              label="Interest"
              amount={results.totalInterest}
              total={results.totalFinanceCost}
              color="oklch(0.75 0.12 85)"
            />
            <StackBar
              label="Arrangement Fee"
              amount={results.arrangementFeeAmt}
              total={results.totalFinanceCost}
              color="oklch(0.65 0.13 85)"
            />
          </div>
        </div>

        {/* 28-day timeline */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            28-Day Completion Timeline
          </h3>
          <div className="space-y-3">
            {timelineSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "var(--gold)" }}
                />
                <div>
                  <p className="text-sm font-semibold">
                    {step.day}{" "}
                    <span className="font-normal text-muted-foreground">
                      - {step.label}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Disclaimer text="Auction finance requires completion within 28 days. Rates shown are indicative. Actual terms depend on property type, condition, and exit strategy. Refurb funds may be released in stages." />

        <DealRoomCta
          params={{
            loan_type: "Auction Finance",
            gdv: String(results.valuation),
            loan_amount: String(results.maxLoan),
            source: "auction-finance-calculator",
          }}
          label="Get Auction Finance"
        />
      </div>
    </div>
  );
}
