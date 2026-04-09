"use client";

import { useState, useMemo } from "react";
import { FileText } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
} from "@/components/calculators/shared";
import { DealRoomCta } from "@/components/calculators/shared";
import { Disclaimer } from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FeeStructure = "added-to-loan" | "deducted-from-advance" | "paid-separately";

interface Inputs {
  loanAmount: string;
  feePct: string;
  feeStructure: FeeStructure;
  interestRate: string;
  termMonths: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ArrangementFeeCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    loanAmount: "1,000,000",
    feePct: "2",
    feeStructure: "added-to-loan",
    interestRate: "7",
    termMonths: "12",
  });

  function updateCurrency(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const loan = parseCurrency(inputs.loanAmount);
    const feePct = parseFloat(inputs.feePct) || 0;
    const rate = parseFloat(inputs.interestRate) || 0;
    const term = parseInt(inputs.termMonths, 10) || 0;

    const feeAmount = Math.round(loan * feePct / 100);

    // Calculations for each structure
    const structures = {
      "added-to-loan": (() => {
        const totalBorrowing = loan + feeAmount;
        const interest = Math.round(totalBorrowing * (rate / 100) * (term / 12));
        const netAdvance = loan;
        const additionalInterest = Math.round(feeAmount * (rate / 100) * (term / 12));
        const totalCost = feeAmount + interest;
        const effectiveRate = totalBorrowing > 0 && term > 0
          ? (interest / totalBorrowing) * (12 / term) * 100
          : rate;
        return { netAdvance, additionalInterest, totalCost, interest, effectiveRate, totalBorrowing };
      })(),
      "deducted-from-advance": (() => {
        const netAdvance = loan - feeAmount;
        const interest = Math.round(loan * (rate / 100) * (term / 12));
        const additionalInterest = 0;
        const totalCost = feeAmount + interest;
        const effectiveRate = netAdvance > 0 && term > 0
          ? (interest / netAdvance) * (12 / term) * 100
          : rate;
        return { netAdvance, additionalInterest, totalCost, interest, effectiveRate, totalBorrowing: loan };
      })(),
      "paid-separately": (() => {
        const netAdvance = loan;
        const interest = Math.round(loan * (rate / 100) * (term / 12));
        const additionalInterest = 0;
        const totalCost = feeAmount + interest;
        const effectiveRate = rate;
        return { netAdvance, additionalInterest, totalCost, interest, effectiveRate, totalBorrowing: loan };
      })(),
    };

    const current = structures[inputs.feeStructure];

    return {
      loan,
      feeAmount,
      structures,
      current,
    };
  }, [inputs]);

  const structureLabels: Record<FeeStructure, string> = {
    "added-to-loan": "Added to Loan",
    "deducted-from-advance": "Deducted from Advance",
    "paid-separately": "Paid Separately",
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Loan Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="af-loan" className="text-sm font-semibold">
                Loan Amount
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="af-loan"
                  value={inputs.loanAmount}
                  onChange={(e) => updateCurrency("loanAmount", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="af-fee" className="text-sm font-semibold">
                  Arrangement Fee
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="af-fee"
                    value={inputs.feePct}
                    onChange={(e) => updateField("feePct", e.target.value)}
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
                  Interest Rate (p.a.)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="af-rate"
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
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Fee Structure</h2>
          <div>
            <Label htmlFor="af-structure" className="text-sm font-semibold">
              How is the fee handled?
            </Label>
            <select
              id="af-structure"
              value={inputs.feeStructure}
              onChange={(e) => updateField("feeStructure", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="added-to-loan">Added to Loan (rolled in)</option>
              <option value="deducted-from-advance">Deducted from Advance</option>
              <option value="paid-separately">Paid Separately</option>
            </select>
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
              <FileText
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Fee Analysis</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Loan Amount</span>
              <span className="font-semibold">{formatGBP(results.loan)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Arrangement Fee ({inputs.feePct}%)
              </span>
              <span className="font-semibold">{formatGBP(results.feeAmount)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              {structureLabels[inputs.feeStructure]}
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Net Advance (cash received)</span>
              <span className="font-semibold">{formatGBP(results.current.netAdvance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Interest</span>
              <span className="text-white/80">{formatGBP(results.current.interest)}</span>
            </div>
            {results.current.additionalInterest > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Additional Interest (on fee)</span>
                <span className="text-white/80">{formatGBP(results.current.additionalInterest)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Effective Rate</span>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>
                {formatPercent(results.current.effectiveRate)} p.a.
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Total Effective Cost
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.current.totalCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Structure comparison */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Structure Comparison
          </h3>
          <div className="space-y-4">
            {(Object.entries(results.structures) as [FeeStructure, typeof results.current][]).map(
              ([key, data]) => (
                <div
                  key={key}
                  className={`rounded-lg border p-4 transition-colors ${
                    key === inputs.feeStructure
                      ? "border-gold/40 bg-gold/5"
                      : "border-border"
                  }`}
                >
                  <div className="mb-2 text-sm font-semibold">
                    {structureLabels[key]}
                    {key === inputs.feeStructure && (
                      <span
                        className="ml-2 text-xs font-bold uppercase"
                        style={{ color: "var(--gold)" }}
                      >
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>
                      <div className="font-medium text-foreground">
                        {formatGBP(data.netAdvance)}
                      </div>
                      <div>Net Advance</div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {formatGBP(data.totalCost)}
                      </div>
                      <div>Total Cost</div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {formatPercent(data.effectiveRate)}
                      </div>
                      <div>Effective Rate</div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            loan_amount: String(results.loan),
            source: "arrangement-fee-calculator",
          }}
        />

        <Disclaimer />
      </div>
    </div>
  );
}
