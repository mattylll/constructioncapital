"use client";

import { useState, useMemo } from "react";
import { Church } from "lucide-react";

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

type ListedGrade = "none" | "grade-2" | "grade-2-star" | "grade-1";
type Condition = "good" | "fair" | "poor";

const LISTED_OPTIONS: { value: ListedGrade; label: string }[] = [
  { value: "none", label: "Not Listed" },
  { value: "grade-2", label: "Grade II" },
  { value: "grade-2-star", label: "Grade II*" },
  { value: "grade-1", label: "Grade I" },
];

const CONDITION_OPTIONS: { value: Condition; label: string }[] = [
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

const LISTED_COST_MULTIPLIER: Record<ListedGrade, number> = {
  none: 1.0,
  "grade-2": 1.3,
  "grade-2-star": 1.5,
  "grade-1": 1.8,
};

const CONDITION_MULTIPLIER: Record<Condition, number> = {
  good: 1.0,
  fair: 1.15,
  poor: 1.35,
};

/** Additional costs by listing status */
function getAdditionalCosts(grade: ListedGrade): {
  surveys: number;
  heritage: number;
  batSurvey: number;
  total: number;
} {
  const batSurvey = 3000;
  switch (grade) {
    case "grade-1":
      return {
        surveys: 15000,
        heritage: 10000,
        batSurvey,
        total: 15000 + 10000 + batSurvey,
      };
    case "grade-2-star":
      return {
        surveys: 12000,
        heritage: 8000,
        batSurvey,
        total: 12000 + 8000 + batSurvey,
      };
    case "grade-2":
      return {
        surveys: 8000,
        heritage: 5000,
        batSurvey,
        total: 8000 + 5000 + batSurvey,
      };
    default:
      return {
        surveys: 5000,
        heritage: 0,
        batSurvey,
        total: 5000 + batSurvey,
      };
  }
}

interface Inputs {
  purchasePrice: string;
  floorAreaSqft: string;
  proposedUnits: string;
  listedGrade: ListedGrade;
  condition: Condition;
  costPerSqft: string;
  salePricePerUnit: string;
}

export function ChurchConversionCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    purchasePrice: "350,000",
    floorAreaSqft: "4,000",
    proposedUnits: "3",
    listedGrade: "none",
    condition: "good",
    costPerSqft: "250",
    salePricePerUnit: "425,000",
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
    const floorArea = parseCurrency(inputs.floorAreaSqft);
    const units = parseInt(inputs.proposedUnits, 10) || 0;
    const baseCostPerSqft = parseCurrency(inputs.costPerSqft);
    const salePrice = parseCurrency(inputs.salePricePerUnit);

    const listedMultiplier = LISTED_COST_MULTIPLIER[inputs.listedGrade];
    const conditionMultiplier = CONDITION_MULTIPLIER[inputs.condition];
    const adjustedCostPerSqft = Math.round(
      baseCostPerSqft * listedMultiplier * conditionMultiplier
    );

    const buildCost = floorArea * adjustedCostPerSqft;
    const additional = getAdditionalCosts(inputs.listedGrade);
    const totalCost = purchasePrice + buildCost + additional.total;

    const gdv = units * salePrice;
    const profit = gdv - totalCost;
    const profitOnCost = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    const profitOnGdv = gdv > 0 ? (profit / gdv) * 100 : 0;

    // Heritage premium: how much the listing adds to cost vs unlisted
    const unlistedBuildCost =
      floorArea * Math.round(baseCostPerSqft * conditionMultiplier);
    const unlistedAdditional = getAdditionalCosts("none");
    const unlistedTotal =
      purchasePrice + unlistedBuildCost + unlistedAdditional.total;
    const heritagePremium =
      unlistedTotal > 0
        ? ((totalCost - unlistedTotal) / unlistedTotal) * 100
        : 0;

    return {
      purchasePrice,
      floorArea,
      units,
      salePrice,
      baseCostPerSqft,
      adjustedCostPerSqft,
      listedMultiplier,
      conditionMultiplier,
      buildCost,
      additional,
      totalCost,
      gdv,
      profit,
      profitOnCost,
      profitOnGdv,
      heritagePremium,
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
              <Label htmlFor="ch-purchase" className="text-sm font-semibold">
                Purchase Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="ch-purchase"
                  value={inputs.purchasePrice}
                  onChange={(e) =>
                    updateCurrencyField("purchasePrice", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="ch-floor-area"
                  className="text-sm font-semibold"
                >
                  Internal Floor Area
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="ch-floor-area"
                    value={inputs.floorAreaSqft}
                    onChange={(e) =>
                      updateCurrencyField("floorAreaSqft", e.target.value)
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
                <Label htmlFor="ch-units" className="text-sm font-semibold">
                  Proposed Units
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="ch-units"
                    value={inputs.proposedUnits}
                    onChange={(e) =>
                      updateNumericField("proposedUnits", e.target.value)
                    }
                    className="h-11"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ch-listed" className="text-sm font-semibold">
                  Listed Grade
                </Label>
                <div className="mt-1.5">
                  <select
                    id="ch-listed"
                    value={inputs.listedGrade}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        listedGrade: e.target.value as ListedGrade,
                      }))
                    }
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {LISTED_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="ch-condition"
                  className="text-sm font-semibold"
                >
                  Structural Condition
                </Label>
                <div className="mt-1.5">
                  <select
                    id="ch-condition"
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
            </div>
          </div>
        </div>

        {/* Card 2: Costs & Sales */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Costs & Sales</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="ch-cost-sqft" className="text-sm font-semibold">
                Base Conversion Cost Per Sqft
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="ch-cost-sqft"
                  value={inputs.costPerSqft}
                  onChange={(e) =>
                    updateCurrencyField("costPerSqft", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="ch-sale-price"
                className="text-sm font-semibold"
              >
                Sale Price Per Unit
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="ch-sale-price"
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
              <Church
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Church Conversion Appraisal</h2>
          </div>

          <div className="space-y-3">
            {/* Heritage premium callout */}
            {inputs.listedGrade !== "none" && (
              <div
                className="mb-4 rounded-lg px-4 py-3"
                style={{
                  background: "oklch(0.75 0.12 85 / 0.08)",
                  border: "1px solid oklch(0.75 0.12 85 / 0.15)",
                }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--gold)" }}
                  >
                    Heritage Premium
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: "var(--gold)" }}
                  >
                    +{formatPercent(results.heritagePremium)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  Additional cost vs unlisted conversion due to heritage
                  requirements
                </p>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Base Cost/sqft</span>
              <span className="font-semibold">
                {formatGBP(results.baseCostPerSqft)}
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
                {LISTED_OPTIONS.find((o) => o.value === inputs.listedGrade)
                  ?.label ?? "None"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Condition Multiplier{" "}
                <span className="text-white/40">
                  (x{results.conditionMultiplier})
                </span>
              </span>
              <span className="text-white/80">{inputs.condition}</span>
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
                  ({results.floorArea.toLocaleString()} sqft x{" "}
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
                  (surveys + bat survey
                  {inputs.listedGrade !== "none" ? " + heritage" : ""})
                </span>
              </span>
              <span className="text-white/80">
                {formatGBP(results.additional.total)}
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
                  ({results.units} units x {formatGBP(results.salePrice)} each)
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
                  amount={results.additional.total}
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
            source: "church-conversion-calculator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
}
