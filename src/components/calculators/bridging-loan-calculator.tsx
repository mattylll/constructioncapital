"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  propertyValue: string;
  loanAmount: string;
  termMonths: string;
  monthlyRate: string;
  arrangementFee: string;
}

export function BridgingLoanCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    propertyValue: "750,000",
    loanAmount: "500,000",
    termMonths: "12",
    monthlyRate: "0.55",
    arrangementFee: "2",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    const digits = raw.replace(/[^0-9]/g, "");
    const formatted = digits
      ? parseInt(digits, 10).toLocaleString("en-GB")
      : "";
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const propertyValue = parseCurrency(inputs.propertyValue);
    const loanAmount = parseCurrency(inputs.loanAmount);
    const termMonths = parseInt(inputs.termMonths, 10) || 0;
    const monthlyRate = parseFloat(inputs.monthlyRate) || 0;
    const arrangementFeePct = parseFloat(inputs.arrangementFee) || 0;

    const ltv = propertyValue > 0 ? (loanAmount / propertyValue) * 100 : 0;
    const monthlyInterest = Math.round(loanAmount * (monthlyRate / 100));
    const totalInterest = monthlyInterest * termMonths;
    const arrangementFee = Math.round(loanAmount * (arrangementFeePct / 100));
    const totalCost = totalInterest + arrangementFee;
    const totalRepayment = loanAmount + totalCost;
    const annualRate = monthlyRate * 12;

    return {
      propertyValue,
      loanAmount,
      termMonths,
      ltv,
      monthlyInterest,
      totalInterest,
      arrangementFee,
      totalCost,
      totalRepayment,
      annualRate,
    };
  }, [inputs]);

  const dealRoomParams = new URLSearchParams({
    loan_type: "Bridging Loan",
    gdv: String(results.propertyValue),
    loan_amount: String(results.loanAmount),
    source: "bridging-loan-calculator",
  });

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Loan Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="bl-value" className="text-sm font-semibold">
                Property Value
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="bl-value"
                  value={inputs.propertyValue}
                  onChange={(e) =>
                    updateCurrencyField("propertyValue", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bl-loan" className="text-sm font-semibold">
                Loan Amount
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="bl-loan"
                  value={inputs.loanAmount}
                  onChange={(e) =>
                    updateCurrencyField("loanAmount", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bl-term" className="text-sm font-semibold">
                  Term
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="bl-term"
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
                <Label htmlFor="bl-rate" className="text-sm font-semibold">
                  Rate (p.m.)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="bl-rate"
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
                <Label htmlFor="bl-fee" className="text-sm font-semibold">
                  Arr. Fee
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="bl-fee"
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

        {/* Quick LTV indicator */}
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
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Annualised Rate</p>
              <p className="text-lg font-bold">
                {formatPercent(results.annualRate)} p.a.
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
              <Clock className="h-5 w-5" style={{ color: "var(--gold)" }} />
            </div>
            <h2 className="text-lg font-bold">Bridging Loan Breakdown</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Loan Amount</span>
              <span className="font-semibold">
                {formatGBP(results.loanAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Property Value</span>
              <span className="text-white/80">
                {formatGBP(results.propertyValue)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">LTV</span>
              <span className="font-semibold">
                {formatPercent(results.ltv)}
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
              Cost Breakdown
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Monthly Interest</span>
              <span className="font-semibold">
                {formatGBP(results.monthlyInterest)}
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
                {formatGBP(results.arrangementFee)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Total Borrowing Cost
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.totalCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Repayment</span>
              <span className="font-semibold">
                {formatGBP(results.totalRepayment)}
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Payment Timeline */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Cost Summary
          </h3>
          <div className="space-y-2">
            <CostBar
              label="Interest"
              amount={results.totalInterest}
              total={results.totalCost}
              color="oklch(0.75 0.12 85)"
            />
            <CostBar
              label="Arrangement Fee"
              amount={results.arrangementFee}
              total={results.totalCost}
              color="oklch(0.65 0.13 85)"
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Indicative figures based on rolled-up interest. Actual rates and fees
            vary by lender, property type and exit strategy. Contact us for an
            accurate quote.
          </p>
        </div>

        {/* CTA */}
        <Button
          asChild
          size="lg"
          className="cta-shimmer h-14 w-full bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
        >
          <Link href={`/deal-room?${dealRoomParams.toString()}`}>
            Get a Bridging Loan Quote
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function CostBar({
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
