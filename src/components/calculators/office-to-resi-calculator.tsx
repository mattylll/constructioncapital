"use client";

import { useState, useMemo } from "react";
import { Building, Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
  StackBar,
  DealRoomCta,
  Disclaimer,
} from "@/components/calculators/shared";

interface Inputs {
  purchasePrice: string;
  totalFloorspace: string;
  proposedUnits: string;
  avgUnitSize: string;
  conversionCostPerSqft: string;
  professionalFees: string;
  contingency: string;
  salePricePerUnit: string;
}

export function OfficeToResiCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    purchasePrice: "750,000",
    totalFloorspace: "5,000",
    proposedUnits: "6",
    avgUnitSize: "650",
    conversionCostPerSqft: "130",
    professionalFees: "10",
    contingency: "10",
    salePricePerUnit: "325,000",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    const formatted = formatCurrencyInput(raw);
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  function updateNumericField(field: keyof Inputs, raw: string) {
    const digits = raw.replace(/[^0-9]/g, "");
    setInputs((prev) => ({ ...prev, [field]: digits }));
  }

  const results = useMemo(() => {
    const purchasePrice = parseCurrency(inputs.purchasePrice);
    const proposedUnits = parseInt(inputs.proposedUnits, 10) || 0;
    const avgUnitSize = parseInt(inputs.avgUnitSize, 10) || 0;
    const conversionCostPerSqft = parseCurrency(inputs.conversionCostPerSqft);
    const profFeesPct = parseFloat(inputs.professionalFees) || 0;
    const contingencyPct = parseFloat(inputs.contingency) || 0;
    const salePricePerUnit = parseCurrency(inputs.salePricePerUnit);

    const totalFloorspace = proposedUnits * avgUnitSize;
    const buildCost = totalFloorspace * conversionCostPerSqft;
    const professionalFees = Math.round(buildCost * (profFeesPct / 100));
    const contingencyAmount = Math.round(buildCost * (contingencyPct / 100));
    const totalDevelopmentCost =
      purchasePrice + buildCost + professionalFees + contingencyAmount;

    const gdv = proposedUnits * salePricePerUnit;
    const profit = gdv - totalDevelopmentCost;
    const profitOnCost =
      totalDevelopmentCost > 0 ? (profit / totalDevelopmentCost) * 100 : 0;
    const profitOnGdv = gdv > 0 ? (profit / gdv) * 100 : 0;
    const costPerSqft = totalFloorspace > 0 ? buildCost / totalFloorspace : 0;

    return {
      purchasePrice,
      totalFloorspace,
      buildCost,
      professionalFees,
      contingencyAmount,
      totalDevelopmentCost,
      gdv,
      profit,
      profitOnCost,
      profitOnGdv,
      costPerSqft,
      proposedUnits,
      salePricePerUnit,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        {/* Card 1: Building Details */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Building Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="otr-purchase" className="text-sm font-semibold">
                Purchase Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="otr-purchase"
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
              <Label htmlFor="otr-floorspace" className="text-sm font-semibold">
                Total Office Floorspace
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="otr-floorspace"
                  value={inputs.totalFloorspace}
                  onChange={(e) =>
                    updateNumericField("totalFloorspace", e.target.value)
                  }
                  className="h-11 pr-12"
                  inputMode="numeric"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  sqft
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="otr-units" className="text-sm font-semibold">
                  Proposed Units
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="otr-units"
                    value={inputs.proposedUnits}
                    onChange={(e) =>
                      updateNumericField("proposedUnits", e.target.value)
                    }
                    className="h-11"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="otr-unit-size"
                  className="text-sm font-semibold"
                >
                  Average Unit Size
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="otr-unit-size"
                    value={inputs.avgUnitSize}
                    onChange={(e) =>
                      updateNumericField("avgUnitSize", e.target.value)
                    }
                    className="h-11 pr-12"
                    inputMode="numeric"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    sqft
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Costs & Sales */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Costs & Sales</h2>

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="otr-cost-sqft"
                className="text-sm font-semibold"
              >
                Conversion Cost Per Sqft
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="otr-cost-sqft"
                  value={inputs.conversionCostPerSqft}
                  onChange={(e) =>
                    updateCurrencyField("conversionCostPerSqft", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="otr-fees" className="text-sm font-semibold">
                  Professional Fees
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="otr-fees"
                    value={inputs.professionalFees}
                    onChange={(e) =>
                      updateField("professionalFees", e.target.value)
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
                <Label
                  htmlFor="otr-contingency"
                  className="text-sm font-semibold"
                >
                  Contingency
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="otr-contingency"
                    value={inputs.contingency}
                    onChange={(e) => updateField("contingency", e.target.value)}
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
              <Label
                htmlFor="otr-sale-price"
                className="text-sm font-semibold"
              >
                Estimated Sale Price Per Unit
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="otr-sale-price"
                  value={inputs.salePricePerUnit}
                  onChange={(e) =>
                    updateCurrencyField("salePricePerUnit", e.target.value)
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
              <Building
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Conversion Appraisal</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Purchase Price</span>
              <span className="font-semibold">
                {formatGBP(results.purchasePrice)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Build Cost{" "}
                <span className="text-white/40">
                  ({formatGBP(results.costPerSqft)}/sqft)
                </span>
              </span>
              <span className="font-semibold">
                {formatGBP(results.buildCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Professional Fees ({inputs.professionalFees}%)
              </span>
              <span className="text-white/80">
                {formatGBP(results.professionalFees)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Contingency ({inputs.contingency}%)
              </span>
              <span className="text-white/80">
                {formatGBP(results.contingencyAmount)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Development Cost</span>
              <span className="font-semibold">
                {formatGBP(results.totalDevelopmentCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                GDV{" "}
                <span className="text-white/40">
                  ({results.proposedUnits} units x{" "}
                  {formatGBP(results.salePricePerUnit)} each)
                </span>
              </span>
              <span className="font-semibold">{formatGBP(results.gdv)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Developer Profit
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.profit)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Profit on Cost</span>
              <span
                className="font-semibold"
                style={{ color: "var(--gold)" }}
              >
                {formatPercent(results.profitOnCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Profit on GDV</span>
              <span
                className="font-semibold"
                style={{ color: "var(--gold)" }}
              >
                {formatPercent(results.profitOnGdv)}
              </span>
            </div>
          </div>
        </div>

        {/* Capital Stack */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Capital Stack
          </h3>
          <div className="space-y-2">
            {results.totalDevelopmentCost > 0 && (
              <>
                <StackBar
                  label="Build Cost"
                  amount={results.buildCost}
                  total={results.totalDevelopmentCost}
                  color="oklch(0.75 0.12 85)"
                />
                <StackBar
                  label="Purchase Price"
                  amount={results.purchasePrice}
                  total={results.totalDevelopmentCost}
                  color="oklch(0.35 0.05 255)"
                />
                <StackBar
                  label="Fees & Contingency"
                  amount={
                    results.professionalFees + results.contingencyAmount
                  }
                  total={results.totalDevelopmentCost}
                  color="oklch(0.65 0.13 85)"
                />
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            gdv: String(results.gdv),
            total_cost: String(results.totalDevelopmentCost),
            loan_amount: String(Math.round(results.gdv * 0.65)),
            source: "office-to-resi-calculator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
}
