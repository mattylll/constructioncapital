"use client";

import { useState, useMemo } from "react";
import { Warehouse } from "lucide-react";

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

type BarnType = "traditional-stone" | "steel-frame" | "dutch-barn";
type SpecLevel = "standard" | "high" | "luxury";
type Condition = "good" | "fair" | "poor";

const BARN_TYPE_OPTIONS: { value: BarnType; label: string }[] = [
  { value: "traditional-stone", label: "Traditional Stone Barn" },
  { value: "steel-frame", label: "Steel Frame Barn" },
  { value: "dutch-barn", label: "Dutch Barn" },
];

const SPEC_OPTIONS: { value: SpecLevel; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "high", label: "High" },
  { value: "luxury", label: "Luxury" },
];

const CONDITION_OPTIONS: { value: Condition; label: string }[] = [
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

const BASE_COST_DATA: Record<BarnType, Record<SpecLevel, number>> = {
  "traditional-stone": { standard: 200, high: 280, luxury: 380 },
  "steel-frame": { standard: 160, high: 220, luxury: 310 },
  "dutch-barn": { standard: 180, high: 250, luxury: 340 },
};

const CONDITION_MULTIPLIER: Record<Condition, number> = {
  good: 1.0,
  fair: 1.15,
  poor: 1.35,
};

const ECOLOGY_SURVEY_COST = 5000;

interface Inputs {
  barnType: BarnType;
  footprintSqft: string;
  proposedDwellings: string;
  condition: Condition;
  specLevel: SpecLevel;
  listed: "yes" | "no";
  purchasePrice: string;
  salePricePerDwelling: string;
}

export function BarnConversionCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    barnType: "traditional-stone",
    footprintSqft: "2,500",
    proposedDwellings: "2",
    condition: "good",
    specLevel: "standard",
    listed: "no",
    purchasePrice: "250,000",
    salePricePerDwelling: "550,000",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    const formatted = formatCurrencyInput(raw);
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  function updateNumericField(field: keyof Inputs, raw: string) {
    const digits = raw.replace(/[^0-9]/g, "");
    setInputs((prev) => ({ ...prev, [field]: digits }));
  }

  const results = useMemo(() => {
    const purchasePrice = parseCurrency(inputs.purchasePrice);
    const footprint = parseCurrency(inputs.footprintSqft);
    const dwellings = parseInt(inputs.proposedDwellings, 10) || 0;
    const salePricePerDwelling = parseCurrency(inputs.salePricePerDwelling);

    const baseCost = BASE_COST_DATA[inputs.barnType][inputs.specLevel];
    const conditionMultiplier = CONDITION_MULTIPLIER[inputs.condition];
    const listedMultiplier = inputs.listed === "yes" ? 1.4 : 1.0;
    const adjustedCostPerSqft = Math.round(
      baseCost * conditionMultiplier * listedMultiplier
    );

    const buildCost = footprint * adjustedCostPerSqft;
    const heritageStatementCost = inputs.listed === "yes" ? 8000 : 0;
    const additionalCosts = ECOLOGY_SURVEY_COST + heritageStatementCost;
    const totalCost = purchasePrice + buildCost + additionalCosts;

    const gdv = dwellings * salePricePerDwelling;
    const profit = gdv - totalCost;
    const profitOnCost = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    const profitOnGdv = gdv > 0 ? (profit / gdv) * 100 : 0;

    return {
      purchasePrice,
      footprint,
      dwellings,
      salePricePerDwelling,
      baseCost,
      adjustedCostPerSqft,
      buildCost,
      additionalCosts,
      totalCost,
      gdv,
      profit,
      profitOnCost,
      profitOnGdv,
      conditionMultiplier,
      listedMultiplier,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        {/* Card 1: Barn Details */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Barn Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="bc-type" className="text-sm font-semibold">
                Barn Type
              </Label>
              <div className="mt-1.5">
                <select
                  id="bc-type"
                  value={inputs.barnType}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      barnType: e.target.value as BarnType,
                    }))
                  }
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {BARN_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="bc-footprint"
                  className="text-sm font-semibold"
                >
                  Footprint
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="bc-footprint"
                    value={inputs.footprintSqft}
                    onChange={(e) =>
                      updateCurrencyField("footprintSqft", e.target.value)
                    }
                    className="h-11 pr-12"
                    inputMode="numeric"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    sqft
                  </span>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="bc-dwellings"
                  className="text-sm font-semibold"
                >
                  Proposed Dwellings
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="bc-dwellings"
                    value={inputs.proposedDwellings}
                    onChange={(e) =>
                      updateNumericField("proposedDwellings", e.target.value)
                    }
                    className="h-11"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="bc-condition"
                  className="text-sm font-semibold"
                >
                  Structural Condition
                </Label>
                <div className="mt-1.5">
                  <select
                    id="bc-condition"
                    value={inputs.condition}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        condition: e.target.value as Condition,
                      }))
                    }
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {CONDITION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="bc-spec" className="text-sm font-semibold">
                  Spec Level
                </Label>
                <div className="mt-1.5">
                  <select
                    id="bc-spec"
                    value={inputs.specLevel}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        specLevel: e.target.value as SpecLevel,
                      }))
                    }
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {SPEC_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="bc-listed" className="text-sm font-semibold">
                Listed Building
              </Label>
              <div className="mt-1.5">
                <select
                  id="bc-listed"
                  value={inputs.listed}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      listed: e.target.value as "yes" | "no",
                    }))
                  }
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Financials */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Financials</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="bc-purchase" className="text-sm font-semibold">
                Purchase Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="bc-purchase"
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
              <Label
                htmlFor="bc-sale-price"
                className="text-sm font-semibold"
              >
                Sale Price Per Dwelling
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="bc-sale-price"
                  value={inputs.salePricePerDwelling}
                  onChange={(e) =>
                    updateCurrencyField("salePricePerDwelling", e.target.value)
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
              <Warehouse
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Barn Conversion Appraisal</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Base Cost/sqft</span>
              <span className="font-semibold">
                {formatGBP(results.baseCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Condition Multiplier{" "}
                <span className="text-white/40">
                  (x{results.conditionMultiplier})
                </span>
              </span>
              <span className="text-white/80">
                {inputs.condition}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Listed Multiplier{" "}
                <span className="text-white/40">
                  (x{results.listedMultiplier})
                </span>
              </span>
              <span className="text-white/80">
                {inputs.listed === "yes" ? "Yes (+40%)" : "No"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Adjusted Cost/sqft</span>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>
                {formatGBP(results.adjustedCostPerSqft)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

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
                  ({results.footprint.toLocaleString()} sqft x{" "}
                  {formatGBP(results.adjustedCostPerSqft)})
                </span>
              </span>
              <span className="font-semibold">
                {formatGBP(results.buildCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Additional Costs{" "}
                <span className="text-white/40">
                  (ecology{inputs.listed === "yes" ? " + heritage" : ""})
                </span>
              </span>
              <span className="text-white/80">
                {formatGBP(results.additionalCosts)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Development Cost</span>
              <span className="font-semibold">
                {formatGBP(results.totalCost)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                GDV{" "}
                <span className="text-white/40">
                  ({results.dwellings} dwellings x{" "}
                  {formatGBP(results.salePricePerDwelling)} each)
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
            {results.totalCost > 0 && (
              <>
                <StackBar
                  label="Build Cost"
                  amount={results.buildCost}
                  total={results.totalCost}
                  color="oklch(0.75 0.12 85)"
                />
                <StackBar
                  label="Purchase Price"
                  amount={results.purchasePrice}
                  total={results.totalCost}
                  color="oklch(0.35 0.05 255)"
                />
                <StackBar
                  label="Additional Costs"
                  amount={results.additionalCosts}
                  total={results.totalCost}
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
            total_cost: String(results.totalCost),
            loan_amount: String(Math.round(results.gdv * 0.65)),
            source: "barn-conversion-calculator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
}
