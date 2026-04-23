"use client";

import { useState, useMemo } from "react";
import { MapPin } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
  DealRoomCta,
  Disclaimer,
} from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Inputs {
  gdv: string;
  buildCosts: string;
  profFeesPct: string;
  contingencyPct: string;
  s106Cil: string;
  financeRate: string;
  financeTermMonths: string;
  sellingCostsPct: string;
  targetProfitPct: string;
}

/* ------------------------------------------------------------------ */
/*  SDLT helper (simplified residential rates)                         */
/* ------------------------------------------------------------------ */

function estimateSDLT(price: number): number {
  if (price <= 0) return 0;

  const bands: { from: number; to: number | null; rate: number }[] = [
    { from: 0, to: 125_000, rate: 0 },
    { from: 125_000, to: 250_000, rate: 0.02 },
    { from: 250_000, to: 925_000, rate: 0.05 },
    { from: 925_000, to: 1_500_000, rate: 0.1 },
    { from: 1_500_000, to: null, rate: 0.12 },
  ];

  let tax = 0;
  for (const band of bands) {
    const upper = band.to ?? Infinity;
    if (price <= band.from) break;
    const taxable = Math.min(price, upper) - band.from;
    tax += taxable * band.rate;
  }
  
return Math.round(tax);
}

/* ------------------------------------------------------------------ */
/*  RLV calculation helper (reused for sensitivity table)              */
/* ------------------------------------------------------------------ */

function calculateRLV(
  gdv: number,
  buildCosts: number,
  profFeesPct: number,
  contingencyPct: number,
  s106Cil: number,
  financeRate: number,
  financeTermMonths: number,
  sellingCostsPct: number,
  targetProfitPct: number
): number {
  const professionalFees = Math.round(buildCosts * (profFeesPct / 100));
  const contingencyAmount = Math.round(buildCosts * (contingencyPct / 100));
  const totalBuildCosts = buildCosts + professionalFees + contingencyAmount;
  const sellingCosts = Math.round(gdv * (sellingCostsPct / 100));
  const targetProfitAmount = Math.round(gdv * (targetProfitPct / 100));
  // Assume ~60% average drawdown over the build period
  const estimatedFinanceCost = Math.round(
    totalBuildCosts * 0.6 * (financeRate / 100) * (financeTermMonths / 12)
  );
  const totalDeductions =
    totalBuildCosts +
    s106Cil +
    sellingCosts +
    estimatedFinanceCost +
    targetProfitAmount;

  return gdv - totalDeductions;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ResidualLandValueCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    gdv: "3,200,000",
    buildCosts: "1,200,000",
    profFeesPct: "10",
    contingencyPct: "10",
    s106Cil: "50,000",
    financeRate: "7",
    financeTermMonths: "18",
    sellingCostsPct: "3",
    targetProfitPct: "20",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  /* ---- Derived values ---- */

  const results = useMemo(() => {
    const gdv = parseCurrency(inputs.gdv);
    const buildCosts = parseCurrency(inputs.buildCosts);
    const profFeesPct = parseFloat(inputs.profFeesPct) || 0;
    const contingencyPct = parseFloat(inputs.contingencyPct) || 0;
    const s106Cil = parseCurrency(inputs.s106Cil);
    const financeRate = parseFloat(inputs.financeRate) || 0;
    const financeTermMonths = parseInt(inputs.financeTermMonths, 10) || 0;
    const sellingCostsPct = parseFloat(inputs.sellingCostsPct) || 0;
    const targetProfitPct = parseFloat(inputs.targetProfitPct) || 0;

    const professionalFees = Math.round(buildCosts * (profFeesPct / 100));
    const contingencyAmount = Math.round(buildCosts * (contingencyPct / 100));
    const totalBuildCosts = buildCosts + professionalFees + contingencyAmount;
    const sellingCosts = Math.round(gdv * (sellingCostsPct / 100));
    const targetProfitAmount = Math.round(gdv * (targetProfitPct / 100));
    const estimatedFinanceCost = Math.round(
      totalBuildCosts * 0.6 * (financeRate / 100) * (financeTermMonths / 12)
    );
    const totalDeductions =
      totalBuildCosts +
      s106Cil +
      sellingCosts +
      estimatedFinanceCost +
      targetProfitAmount;
    const residualLandValue = gdv - totalDeductions;
    const stampDutyOnLand = estimateSDLT(Math.max(0, residualLandValue));

    return {
      gdv,
      buildCosts,
      profFeesPct,
      contingencyPct,
      s106Cil,
      financeRate,
      financeTermMonths,
      sellingCostsPct,
      targetProfitPct,
      professionalFees,
      contingencyAmount,
      totalBuildCosts,
      sellingCosts,
      targetProfitAmount,
      estimatedFinanceCost,
      totalDeductions,
      residualLandValue,
      stampDutyOnLand,
    };
  }, [inputs]);

  /* ---- Sensitivity matrix ---- */

  const sensitivityData = useMemo(() => {
    const profitMargins = [15, 17.5, 20, 22.5, 25];
    const gdvMultipliers = [
      { label: "-10%", factor: 0.9 },
      { label: "-5%", factor: 0.95 },
      { label: "Base", factor: 1.0 },
      { label: "+5%", factor: 1.05 },
      { label: "+10%", factor: 1.1 },
    ];

    const rows = profitMargins.map((margin) => ({
      margin,
      cells: gdvMultipliers.map((scenario) => {
        const adjustedGdv = Math.round(results.gdv * scenario.factor);
        
return calculateRLV(
          adjustedGdv,
          results.buildCosts,
          results.profFeesPct,
          results.contingencyPct,
          results.s106Cil,
          results.financeRate,
          results.financeTermMonths,
          results.sellingCostsPct,
          margin
        );
      }),
    }));

    return { profitMargins, gdvMultipliers, rows };
  }, [results]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        {/* Card 1: Revenue & Costs */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Revenue &amp; Costs</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rlv-gdv" className="text-sm font-semibold">
                Gross Development Value (GDV)
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="rlv-gdv"
                  value={inputs.gdv}
                  onChange={(e) => updateCurrencyField("gdv", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="rlv-build" className="text-sm font-semibold">
                Build Costs
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="rlv-build"
                  value={inputs.buildCosts}
                  onChange={(e) =>
                    updateCurrencyField("buildCosts", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="rlv-prof-fees"
                  className="text-sm font-semibold"
                >
                  Professional Fees
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="rlv-prof-fees"
                    value={inputs.profFeesPct}
                    onChange={(e) => updateField("profFeesPct", e.target.value)}
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
                  htmlFor="rlv-contingency"
                  className="text-sm font-semibold"
                >
                  Contingency
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="rlv-contingency"
                    value={inputs.contingencyPct}
                    onChange={(e) =>
                      updateField("contingencyPct", e.target.value)
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

            <div>
              <Label htmlFor="rlv-s106" className="text-sm font-semibold">
                S106 / CIL
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="rlv-s106"
                  value={inputs.s106Cil}
                  onChange={(e) =>
                    updateCurrencyField("s106Cil", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Finance & Profit */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Finance &amp; Profit</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="rlv-finance-rate"
                  className="text-sm font-semibold"
                >
                  Finance Rate (p.a.)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="rlv-finance-rate"
                    value={inputs.financeRate}
                    onChange={(e) =>
                      updateField("financeRate", e.target.value)
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
                  htmlFor="rlv-finance-term"
                  className="text-sm font-semibold"
                >
                  Finance Term
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="rlv-finance-term"
                    value={inputs.financeTermMonths}
                    onChange={(e) =>
                      updateField("financeTermMonths", e.target.value)
                    }
                    className="h-11 pr-12"
                    inputMode="numeric"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    mo
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="rlv-selling-costs"
                  className="text-sm font-semibold"
                >
                  Selling Costs
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="rlv-selling-costs"
                    value={inputs.sellingCostsPct}
                    onChange={(e) =>
                      updateField("sellingCostsPct", e.target.value)
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
                  htmlFor="rlv-target-profit"
                  className="text-sm font-semibold"
                >
                  Target Profit
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="rlv-target-profit"
                    value={inputs.targetProfitPct}
                    onChange={(e) =>
                      updateField("targetProfitPct", e.target.value)
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
              <MapPin
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Residual Land Valuation</h2>
          </div>

          <div className="space-y-3">
            {/* GDV */}
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Gross Development Value</span>
              <span className="font-semibold">{formatGBP(results.gdv)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Deductions header */}
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Deductions
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Build Costs (inc. fees &amp; contingency)
              </span>
              <span className="text-white/80">
                {formatGBP(results.totalBuildCosts)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">S106 / CIL</span>
              <span className="text-white/80">
                {formatGBP(results.s106Cil)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Selling Costs ({inputs.sellingCostsPct}%)
              </span>
              <span className="text-white/80">
                {formatGBP(results.sellingCosts)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Finance Costs (estimated)</span>
              <span className="text-white/80">
                {formatGBP(results.estimatedFinanceCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Target Profit ({inputs.targetProfitPct}%)
              </span>
              <span className="text-white/80">
                {formatGBP(results.targetProfitAmount)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Deductions</span>
              <span className="font-semibold">
                {formatGBP(results.totalDeductions)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Residual Land Value - large, gold, prominent */}
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Residual Land Value
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.residualLandValue)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Estimated SDLT on Land</span>
              <span className="text-white/80">
                {formatGBP(results.stampDutyOnLand)}
              </span>
            </div>
          </div>
        </div>

        {/* Sensitivity matrix */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Sensitivity Analysis
          </h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Residual land value at different profit margins and GDV scenarios.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="pb-2 pr-2 text-left font-semibold text-muted-foreground">
                    Profit %
                  </th>
                  {sensitivityData.gdvMultipliers.map((scenario) => (
                    <th
                      key={scenario.label}
                      className="pb-2 px-2 text-right font-semibold text-muted-foreground"
                    >
                      {scenario.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sensitivityData.rows.map((row) => (
                  <tr key={row.margin} className="border-t border-border">
                    <td className="py-2 pr-2 font-semibold">
                      {formatPercent(row.margin)}
                    </td>
                    {row.cells.map((rlv, colIndex) => {
                      const isBaseCase =
                        row.margin === 20 &&
                        sensitivityData.gdvMultipliers[colIndex].factor === 1.0;
                      const isNegative = rlv < 0;

                      return (
                        <td
                          key={colIndex}
                          className="py-2 px-2 text-right font-medium"
                          style={{
                            ...(isBaseCase
                              ? {
                                  background: "oklch(0.75 0.12 85 / 0.15)",
                                  borderRadius: "4px",
                                  fontWeight: 700,
                                }
                              : {}),
                            ...(isNegative
                              ? { color: "oklch(0.55 0.22 25)" }
                              : {}),
                          }}
                        >
                          {formatGBP(rlv)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deal Room CTA */}
        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            gdv: String(results.gdv),
            total_cost: String(
              results.totalBuildCosts + results.residualLandValue
            ),
            source: "residual-land-value-calculator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
}
