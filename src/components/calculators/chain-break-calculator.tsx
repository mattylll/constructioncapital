"use client";

import { useState, useMemo } from "react";
import { Unlink } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  parseCurrency,
  formatGBP,
  formatCurrencyInput,
  DealRoomCta,
  Disclaimer,
  StackBar,
} from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Inputs {
  propertyToBuy: string;
  propertyToSell: string;
  saleTimeline: string;
  bridgingAmount: string;
  monthlyRate: string;
  arrangementFee: string;
  existingMortgage: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChainBreakCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    propertyToBuy: "450,000",
    propertyToSell: "380,000",
    saleTimeline: "4",
    bridgingAmount: "350,000",
    monthlyRate: "0.55",
    arrangementFee: "2",
    existingMortgage: "200,000",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const propertyToBuy = parseCurrency(inputs.propertyToBuy);
    const saleValue = parseCurrency(inputs.propertyToSell);
    const saleTimeline = parseInt(inputs.saleTimeline, 10) || 1;
    const bridgingAmount = parseCurrency(inputs.bridgingAmount);
    const monthlyRate = parseFloat(inputs.monthlyRate) || 0;
    const arrFeePct = parseFloat(inputs.arrangementFee) || 0;
    const existingMortgage = parseCurrency(inputs.existingMortgage);

    const monthlyInterest = Math.round(bridgingAmount * (monthlyRate / 100));
    const totalInterest = monthlyInterest * saleTimeline;
    const arrFee = Math.round(bridgingAmount * (arrFeePct / 100));
    const totalBridgingCost = totalInterest + arrFee;

    const netSaleProceeds = saleValue - existingMortgage;
    const netPositionAfterBoth = netSaleProceeds - totalBridgingCost;

    // Max affordable period: months before costs exceed net sale proceeds
    // monthlyInterest * n + arrFee <= netSaleProceeds
    const maxAffordablePeriod =
      monthlyInterest > 0
        ? Math.floor((netSaleProceeds - arrFee) / monthlyInterest)
        : Infinity;

    // Breakeven sale price: minimum sale price to cover mortgage + bridging costs
    const breakevenSalePrice = existingMortgage + totalBridgingCost;

    return {
      propertyToBuy,
      saleValue,
      saleTimeline,
      bridgingAmount,
      monthlyInterest,
      totalInterest,
      arrFee,
      totalBridgingCost,
      netSaleProceeds,
      netPositionAfterBoth,
      maxAffordablePeriod,
      breakevenSalePrice,
      existingMortgage,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Purchase Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cb-buy" className="text-sm font-semibold">
                Property to Buy
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="cb-buy"
                  value={inputs.propertyToBuy}
                  onChange={(e) =>
                    updateCurrencyField("propertyToBuy", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cb-bridging" className="text-sm font-semibold">
                Bridging Loan Amount
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="cb-bridging"
                  value={inputs.bridgingAmount}
                  onChange={(e) =>
                    updateCurrencyField("bridgingAmount", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cb-rate" className="text-sm font-semibold">
                  Monthly Rate
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="cb-rate"
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
                <Label htmlFor="cb-arr" className="text-sm font-semibold">
                  Arrangement Fee
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="cb-arr"
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

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Property to Sell</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cb-sell" className="text-sm font-semibold">
                Expected Sale Value
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="cb-sell"
                  value={inputs.propertyToSell}
                  onChange={(e) =>
                    updateCurrencyField("propertyToSell", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cb-mortgage" className="text-sm font-semibold">
                Existing Mortgage
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="cb-mortgage"
                  value={inputs.existingMortgage}
                  onChange={(e) =>
                    updateCurrencyField("existingMortgage", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cb-timeline" className="text-sm font-semibold">
                Expected Sale Timeline
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="cb-timeline"
                  value={inputs.saleTimeline}
                  onChange={(e) => updateField("saleTimeline", e.target.value)}
                  className="h-11 pr-16"
                  inputMode="numeric"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  months
                </span>
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
              <Unlink
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Chain Break Analysis</h2>
          </div>

          <div className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Bridging Cost
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Monthly Interest</span>
              <span className="font-semibold">
                {formatGBP(results.monthlyInterest)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Total Interest ({results.saleTimeline} mo)
              </span>
              <span className="text-white/80">
                {formatGBP(results.totalInterest)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Arrangement Fee</span>
              <span className="text-white/80">
                {formatGBP(results.arrFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Total Bridging Cost
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.totalBridgingCost)}
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
              Net Position
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Sale Value</span>
              <span className="text-white/80">
                {formatGBP(results.saleValue)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Less Existing Mortgage</span>
              <span className="text-white/80">
                -{formatGBP(results.existingMortgage)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Net Sale Proceeds</span>
              <span className="font-semibold">
                {formatGBP(results.netSaleProceeds)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Less Bridging Cost</span>
              <span className="text-white/80">
                -{formatGBP(results.totalBridgingCost)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-white/80">
                Net After All Costs
              </span>
              <span
                className="font-bold"
                style={{
                  color:
                    results.netPositionAfterBoth >= 0
                      ? "var(--gold)"
                      : "oklch(0.55 0.22 25)",
                }}
              >
                {formatGBP(results.netPositionAfterBoth)}
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
              Risk Metrics
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Max Affordable Period</span>
              <span className="font-semibold">
                {results.maxAffordablePeriod === Infinity
                  ? "N/A"
                  : `${results.maxAffordablePeriod} months`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Breakeven Sale Price</span>
              <span className="font-semibold">
                {formatGBP(results.breakevenSalePrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Cost breakdown bars */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Cost Breakdown
          </h3>
          <div className="space-y-2">
            <StackBar
              label="Interest"
              amount={results.totalInterest}
              total={results.totalBridgingCost}
              color="oklch(0.75 0.12 85)"
            />
            <StackBar
              label="Arrangement Fee"
              amount={results.arrFee}
              total={results.totalBridgingCost}
              color="oklch(0.65 0.13 85)"
            />
          </div>
        </div>

        <Disclaimer text="Chain-break bridging loans are short-term. Ensure your property is realistically priced for the expected sale timeline. Actual rates depend on both properties and your financial position." />

        <DealRoomCta
          params={{
            loan_type: "Chain Break Bridging",
            gdv: String(results.saleValue),
            loan_amount: String(results.bridgingAmount),
            source: "chain-break-calculator",
          }}
          label="Get Chain Break Finance"
        />
      </div>
    </div>
  );
}
