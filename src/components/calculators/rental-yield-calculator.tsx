"use client";

import { useState, useMemo } from "react";
import { Percent } from "lucide-react";

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
  propertyPrice: string;
  monthlyRent: string;
  annualCosts: string;
  voidWeeks: string;
}

export function RentalYieldCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    propertyPrice: "350,000",
    monthlyRent: "1,500",
    annualCosts: "3,000",
    voidWeeks: "2",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    const formatted = formatCurrencyInput(raw);
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const propertyPrice = parseCurrency(inputs.propertyPrice);
    const monthlyRent = parseCurrency(inputs.monthlyRent);
    const annualCosts = parseCurrency(inputs.annualCosts);
    const voidWeeks = parseFloat(inputs.voidWeeks) || 0;

    const annualGrossIncome = monthlyRent * 12;
    const voidCost = Math.round((monthlyRent * voidWeeks * 12) / 52);
    const annualNetIncome = annualGrossIncome - annualCosts - voidCost;
    const monthlyCashFlow = Math.round(annualNetIncome / 12);

    const grossYield =
      propertyPrice > 0 ? (annualGrossIncome / propertyPrice) * 100 : 0;
    const netYield =
      propertyPrice > 0 ? (annualNetIncome / propertyPrice) * 100 : 0;

    return {
      propertyPrice,
      monthlyRent,
      annualCosts,
      voidWeeks,
      annualGrossIncome,
      voidCost,
      annualNetIncome,
      monthlyCashFlow,
      grossYield,
      netYield,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Property Details</h2>

          <div className="space-y-4">
            {/* Property Price */}
            <div>
              <Label htmlFor="ry-price" className="text-sm font-semibold">
                Property Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="ry-price"
                  value={inputs.propertyPrice}
                  onChange={(e) =>
                    updateCurrencyField("propertyPrice", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* Monthly Rent */}
            <div>
              <Label htmlFor="ry-rent" className="text-sm font-semibold">
                Monthly Rent
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="ry-rent"
                  value={inputs.monthlyRent}
                  onChange={(e) =>
                    updateCurrencyField("monthlyRent", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* Annual Running Costs */}
            <div>
              <Label htmlFor="ry-costs" className="text-sm font-semibold">
                Annual Running Costs
              </Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Service charge, insurance, maintenance, management
              </p>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="ry-costs"
                  value={inputs.annualCosts}
                  onChange={(e) =>
                    updateCurrencyField("annualCosts", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* Void Period */}
            <div>
              <Label htmlFor="ry-void" className="text-sm font-semibold">
                Void Period
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="ry-void"
                  value={inputs.voidWeeks}
                  onChange={(e) => updateField("voidWeeks", e.target.value)}
                  className="h-11 pr-16"
                  inputMode="numeric"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  wks/yr
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
              <Percent className="h-5 w-5" style={{ color: "var(--gold)" }} />
            </div>
            <h2 className="text-lg font-bold">Rental Yield Breakdown</h2>
          </div>

          <div className="space-y-3">
            {/* Gross Yield */}
            <div className="flex items-baseline justify-between">
              <span className="text-white/60">Gross Yield</span>
              <span
                className="text-3xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatPercent(results.grossYield)}
              </span>
            </div>

            {/* Net Yield */}
            <div className="flex items-baseline justify-between">
              <span className="text-white/60">Net Yield</span>
              <span className="text-xl font-semibold">
                {formatPercent(results.netYield)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Income breakdown */}
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Income Breakdown
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Annual Gross Income</span>
              <span className="font-semibold">
                {formatGBP(results.annualGrossIncome)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Annual Running Costs</span>
              <span className="text-white/80">
                -{formatGBP(results.annualCosts)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Void Cost ({results.voidWeeks} weeks)
              </span>
              <span className="text-white/80">
                -{formatGBP(results.voidCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Annual Net Income</span>
              <span className="font-semibold">
                {formatGBP(results.annualNetIncome)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Monthly Cash Flow */}
            <div className="flex items-baseline justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Monthly Cash Flow
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.monthlyCashFlow)}
              </span>
            </div>
          </div>
        </div>

        {/* Yield Comparison Bar */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Gross vs Net Yield
          </h3>
          <div className="space-y-3">
            <YieldBar
              label="Gross Yield"
              value={results.grossYield}
              maxValue={Math.max(results.grossYield, 10)}
              color="oklch(0.75 0.12 85)"
            />
            <YieldBar
              label="Net Yield"
              value={results.netYield}
              maxValue={Math.max(results.grossYield, 10)}
              color="oklch(0.65 0.13 85)"
            />
          </div>
        </div>

        {/* CTA */}
        <DealRoomCta
          params={{
            loan_type: "Commercial Mortgage",
            total_cost: String(results.propertyPrice),
            source: "rental-yield-calculator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer text="Indicative figures only. Actual yields depend on location, property condition, tenant quality and market conditions." />
      </div>
    </div>
  );
}

/* ━━━ Yield comparison bar ━━━ */

function YieldBar({
  label,
  value,
  maxValue,
  color,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}) {
  const pct = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{formatPercent(value)}</span>
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
