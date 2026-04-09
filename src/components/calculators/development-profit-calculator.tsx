"use client";

import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";

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

type UnitType = "houses" | "flats" | "mixed";

interface Inputs {
  numUnits: string;
  unitType: UnitType;
  landCost: string;
  buildCostPerSqft: string;
  avgUnitSize: string;
  professionalFees: string;
  contingency: string;
  financeCost: string;
  agentFees: string;
  legalFeesPerUnit: string;
  salePricePerUnit: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DevelopmentProfitCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    numUnits: "6",
    unitType: "houses",
    landCost: "500,000",
    buildCostPerSqft: "175",
    avgUnitSize: "850",
    professionalFees: "10",
    contingency: "10",
    financeCost: "8",
    agentFees: "2",
    legalFeesPerUnit: "2,000",
    salePricePerUnit: "350,000",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const numUnits = parseInt(inputs.numUnits, 10) || 0;
    const landCost = parseCurrency(inputs.landCost);
    const buildCostPerSqft = parseFloat(inputs.buildCostPerSqft) || 0;
    const avgUnitSize = parseFloat(inputs.avgUnitSize) || 0;
    const profPct = parseFloat(inputs.professionalFees) || 0;
    const contPct = parseFloat(inputs.contingency) || 0;
    const finPct = parseFloat(inputs.financeCost) || 0;
    const agentPct = parseFloat(inputs.agentFees) || 0;
    const legalPerUnit = parseCurrency(inputs.legalFeesPerUnit);
    const salePrice = parseCurrency(inputs.salePricePerUnit);

    const totalSqft = numUnits * avgUnitSize;
    const buildCost = Math.round(totalSqft * buildCostPerSqft);
    const profFees = Math.round(buildCost * (profPct / 100));
    const contingency = Math.round(buildCost * (contPct / 100));
    const totalBuildCosts = buildCost + profFees + contingency;

    const totalProjectCost = landCost + totalBuildCosts;
    const financeCost = Math.round(totalProjectCost * (finPct / 100));

    const gdv = numUnits * salePrice;
    const agentFees = Math.round(gdv * (agentPct / 100));
    const legalFees = numUnits * legalPerUnit;
    const sellingCosts = agentFees + legalFees;

    const grossProfit = gdv - totalProjectCost - sellingCosts;
    const netProfit = grossProfit - financeCost;
    const totalCostIncFinance = totalProjectCost + financeCost;
    const profitOnCost =
      totalCostIncFinance > 0 ? (netProfit / totalCostIncFinance) * 100 : 0;
    const profitOnGdv = gdv > 0 ? (netProfit / gdv) * 100 : 0;
    const profitPerUnit = numUnits > 0 ? Math.round(netProfit / numUnits) : 0;

    return {
      numUnits,
      totalSqft,
      landCost,
      buildCost,
      profFees,
      contingency,
      totalBuildCosts,
      totalProjectCost,
      financeCost,
      gdv,
      agentFees,
      legalFees,
      sellingCosts,
      grossProfit,
      netProfit,
      profitOnCost,
      profitOnGdv,
      profitPerUnit,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Scheme Details</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dp-units" className="text-sm font-semibold">
                  Number of Units
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="dp-units"
                    value={inputs.numUnits}
                    onChange={(e) => updateField("numUnits", e.target.value)}
                    className="h-11"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="dp-type" className="text-sm font-semibold">
                  Unit Type
                </Label>
                <select
                  id="dp-type"
                  value={inputs.unitType}
                  onChange={(e) => updateField("unitType", e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="houses">Houses</option>
                  <option value="flats">Flats</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="dp-land" className="text-sm font-semibold">
                Land Cost
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="dp-land"
                  value={inputs.landCost}
                  onChange={(e) =>
                    updateCurrencyField("landCost", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dp-bcsqft" className="text-sm font-semibold">
                  Build Cost / sqft
                </Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="dp-bcsqft"
                    value={inputs.buildCostPerSqft}
                    onChange={(e) =>
                      updateField("buildCostPerSqft", e.target.value)
                    }
                    className="h-11 pl-7"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="dp-size" className="text-sm font-semibold">
                  Avg Unit Size
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="dp-size"
                    value={inputs.avgUnitSize}
                    onChange={(e) => updateField("avgUnitSize", e.target.value)}
                    className="h-11 pr-12"
                    inputMode="numeric"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    sqft
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dp-prof" className="text-sm font-semibold">
                  Professional Fees
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="dp-prof"
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
                <Label htmlFor="dp-cont" className="text-sm font-semibold">
                  Contingency
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="dp-cont"
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
              <Label htmlFor="dp-finance" className="text-sm font-semibold">
                Finance Cost (% of total)
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="dp-finance"
                  value={inputs.financeCost}
                  onChange={(e) => updateField("financeCost", e.target.value)}
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

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Sales</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="dp-saleprice" className="text-sm font-semibold">
                Sale Price per Unit
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="dp-saleprice"
                  value={inputs.salePricePerUnit}
                  onChange={(e) =>
                    updateCurrencyField("salePricePerUnit", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dp-agent" className="text-sm font-semibold">
                  Agent Fees (% GDV)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="dp-agent"
                    value={inputs.agentFees}
                    onChange={(e) => updateField("agentFees", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="dp-legal" className="text-sm font-semibold">
                  Legal per Unit
                </Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="dp-legal"
                    value={inputs.legalFeesPerUnit}
                    onChange={(e) =>
                      updateCurrencyField("legalFeesPerUnit", e.target.value)
                    }
                    className="h-11 pl-7"
                    inputMode="numeric"
                  />
                </div>
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
              <TrendingUp
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Development Appraisal</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                GDV
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.gdv)}
              </span>
            </div>
            <p className="text-xs text-white/40">
              {results.numUnits} units x {formatGBP(parseCurrency(inputs.salePricePerUnit))} |{" "}
              {results.totalSqft.toLocaleString("en-GB")} sqft total
            </p>

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
              <span className="text-white/60">Land Cost</span>
              <span className="text-white/80">
                {formatGBP(results.landCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Build Cost</span>
              <span className="text-white/80">
                {formatGBP(results.buildCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Professional Fees</span>
              <span className="text-white/80">
                {formatGBP(results.profFees)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Contingency</span>
              <span className="text-white/80">
                {formatGBP(results.contingency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Finance Cost</span>
              <span className="text-white/80">
                {formatGBP(results.financeCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Selling Costs</span>
              <span className="text-white/80">
                {formatGBP(results.sellingCosts)}
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
              Profit
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Gross Profit</span>
              <span className="font-semibold">
                {formatGBP(results.grossProfit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Net Profit
              </span>
              <span
                className="text-xl font-bold"
                style={{
                  color:
                    results.netProfit >= 0
                      ? "var(--gold)"
                      : "oklch(0.55 0.22 25)",
                }}
              >
                {formatGBP(results.netProfit)}
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
              Key Metrics
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Profit on Cost</span>
              <span
                className="text-lg font-bold"
                style={{
                  color:
                    results.profitOnCost >= 20
                      ? "var(--gold)"
                      : "oklch(0.55 0.22 25)",
                }}
              >
                {formatPercent(results.profitOnCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Profit on GDV</span>
              <span className="font-semibold">
                {formatPercent(results.profitOnGdv)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Profit per Unit</span>
              <span className="font-semibold">
                {formatGBP(results.profitPerUnit)}
              </span>
            </div>
          </div>
        </div>

        {/* Cost composition bars */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Cost Composition
          </h3>
          <div className="space-y-2">
            <StackBar
              label="Land"
              amount={results.landCost}
              total={results.totalProjectCost + results.financeCost + results.sellingCosts}
              color="oklch(0.75 0.12 85)"
            />
            <StackBar
              label="Build"
              amount={results.buildCost}
              total={results.totalProjectCost + results.financeCost + results.sellingCosts}
              color="oklch(0.70 0.12 85)"
            />
            <StackBar
              label="Prof Fees + Contingency"
              amount={results.profFees + results.contingency}
              total={results.totalProjectCost + results.financeCost + results.sellingCosts}
              color="oklch(0.65 0.13 85)"
            />
            <StackBar
              label="Finance"
              amount={results.financeCost}
              total={results.totalProjectCost + results.financeCost + results.sellingCosts}
              color="oklch(0.60 0.12 85)"
            />
            <StackBar
              label="Selling Costs"
              amount={results.sellingCosts}
              total={results.totalProjectCost + results.financeCost + results.sellingCosts}
              color="oklch(0.55 0.10 85)"
            />
          </div>
        </div>

        <Disclaimer text="Development appraisal is indicative only. Build costs vary by region, specification and ground conditions. Finance cost is estimated as a percentage of total project cost. Always obtain QS costings and professional valuations." />

        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            gdv: String(results.gdv),
            loan_amount: String(results.totalProjectCost),
            source: "development-profit-calculator",
          }}
          label="Fund Your Development"
        />
      </div>
    </div>
  );
}
