"use client";

import { useState, useMemo } from "react";
import { Hammer } from "lucide-react";

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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type BuildType =
  | "new-build-house"
  | "new-build-flat"
  | "conversion"
  | "heavy-refurb"
  | "light-refurb";

type Region =
  | "london"
  | "south-east"
  | "south-west"
  | "midlands"
  | "north-west"
  | "north-east"
  | "east"
  | "wales"
  | "scotland";

type SpecLevel = "basic" | "standard" | "high" | "luxury";

interface Inputs {
  buildType: BuildType;
  numberOfUnits: string;
  totalGIA: string;
  region: Region;
  specLevel: SpecLevel;
}

/* ------------------------------------------------------------------ */
/*  Cost data & regional adjustments                                   */
/* ------------------------------------------------------------------ */

const COST_PER_SQFT: Record<BuildType, Record<SpecLevel, number>> = {
  "new-build-house": { basic: 135, standard: 175, high: 235, luxury: 320 },
  "new-build-flat": { basic: 145, standard: 190, high: 260, luxury: 350 },
  conversion: { basic: 100, standard: 140, high: 195, luxury: 270 },
  "heavy-refurb": { basic: 85, standard: 120, high: 170, luxury: 240 },
  "light-refurb": { basic: 45, standard: 70, high: 100, luxury: 145 },
};

const REGIONAL_MULTIPLIER: Record<Region, number> = {
  london: 1.2,
  "south-east": 1.1,
  east: 1.05,
  "south-west": 1.0,
  midlands: 0.95,
  scotland: 0.95,
  "north-west": 0.9,
  wales: 0.9,
  "north-east": 0.85,
};

const REGION_LABELS: Record<Region, string> = {
  london: "London +20%",
  "south-east": "South East +10%",
  east: "East of England +5%",
  "south-west": "South West",
  midlands: "Midlands -5%",
  scotland: "Scotland -5%",
  "north-west": "North West -10%",
  wales: "Wales -10%",
  "north-east": "North East & Yorkshire -15%",
};

const BUILD_TYPE_LABELS: Record<BuildType, string> = {
  "new-build-house": "New-Build Houses",
  "new-build-flat": "New-Build Flats",
  conversion: "Conversion",
  "heavy-refurb": "Heavy Refurbishment",
  "light-refurb": "Light Refurbishment",
};

const SPEC_LABELS: Record<SpecLevel, string> = {
  basic: "Basic",
  standard: "Standard",
  high: "High",
  luxury: "Luxury",
};

/* Element breakdown percentages */
const ELEMENT_BREAKDOWN = [
  { label: "Substructure", pct: 0.12, color: "oklch(0.75 0.12 85)" },
  { label: "Superstructure", pct: 0.3, color: "oklch(0.65 0.13 85)" },
  { label: "Internal Finishes", pct: 0.18, color: "oklch(0.55 0.1 85)" },
  { label: "M&E Services", pct: 0.22, color: "oklch(0.50 0.12 255)" },
  { label: "External Works", pct: 0.1, color: "oklch(0.45 0.10 255)" },
  { label: "Preliminaries", pct: 0.08, color: "oklch(0.40 0.08 255)" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function BuildCostEstimator() {
  const [inputs, setInputs] = useState<Inputs>({
    buildType: "new-build-house",
    numberOfUnits: "4",
    totalGIA: "4,800",
    region: "south-east",
    specLevel: "standard",
  });

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  function updateNumericField(field: keyof Inputs, raw: string) {
    const digits = raw.replace(/[^0-9]/g, "");
    const formatted = digits
      ? parseInt(digits, 10).toLocaleString("en-GB")
      : "";
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  const results = useMemo(() => {
    const totalGIA = parseCurrency(inputs.totalGIA);
    const numberOfUnits = parseInt(inputs.numberOfUnits, 10) || 1;
    const multiplier = REGIONAL_MULTIPLIER[inputs.region];
    const baseCostPerSqft = COST_PER_SQFT[inputs.buildType][inputs.specLevel];
    const adjustedCostPerSqft = Math.round(baseCostPerSqft * multiplier);
    const totalBuildCost = adjustedCostPerSqft * totalGIA;
    const costPerUnit = Math.round(totalBuildCost / numberOfUnits);

    const isRefurbOrConversion =
      inputs.buildType === "heavy-refurb" ||
      inputs.buildType === "light-refurb" ||
      inputs.buildType === "conversion";

    const recommendedContingency = isRefurbOrConversion
      ? "10-15%"
      : "5-10%";

    const contingencyLow = totalBuildCost * (isRefurbOrConversion ? 0.1 : 0.05);
    const contingencyHigh =
      totalBuildCost * (isRefurbOrConversion ? 0.15 : 0.1);

    return {
      totalGIA,
      numberOfUnits,
      baseCostPerSqft,
      adjustedCostPerSqft,
      totalBuildCost,
      costPerUnit,
      recommendedContingency,
      contingencyLow,
      contingencyHigh,
      multiplier,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Project Details</h2>

          <div className="space-y-4">
            {/* Build Type */}
            <div>
              <Label htmlFor="bce-build-type" className="text-sm font-semibold">
                Build Type
              </Label>
              <select
                id="bce-build-type"
                value={inputs.buildType}
                onChange={(e) => updateField("buildType", e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="new-build-house">New-Build Houses</option>
                <option value="new-build-flat">New-Build Flats</option>
                <option value="conversion">Conversion</option>
                <option value="heavy-refurb">Heavy Refurbishment</option>
                <option value="light-refurb">Light Refurbishment</option>
              </select>
            </div>

            {/* Number of Units */}
            <div>
              <Label
                htmlFor="bce-units"
                className="text-sm font-semibold"
              >
                Number of Units
              </Label>
              <Input
                id="bce-units"
                value={inputs.numberOfUnits}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, "");
                  updateField("numberOfUnits", digits);
                }}
                className="mt-1.5 h-11"
                inputMode="numeric"
              />
            </div>

            {/* Total GIA */}
            <div>
              <Label htmlFor="bce-gia" className="text-sm font-semibold">
                Total Gross Internal Area (sq ft)
              </Label>
              <Input
                id="bce-gia"
                value={inputs.totalGIA}
                onChange={(e) =>
                  updateNumericField("totalGIA", e.target.value)
                }
                className="mt-1.5 h-11"
                inputMode="numeric"
              />
            </div>

            {/* Region */}
            <div>
              <Label htmlFor="bce-region" className="text-sm font-semibold">
                Region
              </Label>
              <select
                id="bce-region"
                value={inputs.region}
                onChange={(e) => updateField("region", e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="london">London +20%</option>
                <option value="south-east">South East +10%</option>
                <option value="east">East of England +5%</option>
                <option value="south-west">South West</option>
                <option value="midlands">Midlands -5%</option>
                <option value="scotland">Scotland -5%</option>
                <option value="north-west">North West -10%</option>
                <option value="wales">Wales -10%</option>
                <option value="north-east">North East &amp; Yorkshire -15%</option>
              </select>
            </div>

            {/* Specification Level */}
            <div>
              <Label htmlFor="bce-spec" className="text-sm font-semibold">
                Specification Level
              </Label>
              <select
                id="bce-spec"
                value={inputs.specLevel}
                onChange={(e) => updateField("specLevel", e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="luxury">Luxury</option>
              </select>
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
              <Hammer
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Build Cost Estimate</h2>
          </div>

          <div className="space-y-3">
            {/* Project summary */}
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Build Type</span>
              <span className="font-semibold">
                {BUILD_TYPE_LABELS[inputs.buildType]}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Specification</span>
              <span className="font-semibold">
                {SPEC_LABELS[inputs.specLevel]}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Region</span>
              <span className="font-semibold">
                {REGION_LABELS[inputs.region]}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Cost breakdown */}
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Cost Breakdown
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Cost Per Sq Ft (adjusted)</span>
              <span className="font-semibold">
                {formatGBP(results.adjustedCostPerSqft)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total GIA</span>
              <span className="font-semibold">
                {results.totalGIA.toLocaleString("en-GB")} sq ft
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Total Build Cost
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.totalBuildCost)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Cost Per Unit</span>
              <span className="font-semibold">
                {formatGBP(results.costPerUnit)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Contingency */}
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Recommended Contingency</span>
              <span className="font-semibold">
                {results.recommendedContingency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Contingency Range</span>
              <span className="font-semibold">
                {formatGBP(results.contingencyLow)} &ndash;{" "}
                {formatGBP(results.contingencyHigh)}
              </span>
            </div>
          </div>
        </div>

        {/* Element breakdown card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold">
            Approximate Element Breakdown
          </h3>
          <div className="space-y-3">
            {ELEMENT_BREAKDOWN.map((el) => (
              <StackBar
                key={el.label}
                label={el.label}
                amount={Math.round(results.totalBuildCost * el.pct)}
                total={results.totalBuildCost}
                color={el.color}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            total_cost: String(results.totalBuildCost),
            source: "build-cost-estimator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer text="Based on BCIS benchmark data with regional adjustments. Actual costs depend on site conditions, ground conditions, access and specification details. Obtain a Quantity Surveyor's cost plan for funding purposes." />
      </div>
    </div>
  );
}
