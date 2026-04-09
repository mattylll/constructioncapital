"use client";

import { useState, useMemo } from "react";
import { FileSpreadsheet } from "lucide-react";

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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Inputs {
  landCost: string;
  buildCosts: string;
  profFeesPct: string;
  contingencyPct: string;
  s106Cil: string;
  sellingCostsPct: string;
  financeRate: string;
  termMonths: string;
  gdv: string;
  targetProfitPct: string;
}

/* ------------------------------------------------------------------ */
/*  Sensitivity multipliers                                            */
/* ------------------------------------------------------------------ */

const SENSITIVITY_STEPS = [
  { label: "-10%", mult: 0.9 },
  { label: "-5%", mult: 0.95 },
  { label: "Base", mult: 1 },
  { label: "+5%", mult: 1.05 },
  { label: "+10%", mult: 1.1 },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DevelopmentAppraisalCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    landCost: "500,000",
    buildCosts: "1,200,000",
    profFeesPct: "10",
    contingencyPct: "10",
    s106Cil: "30,000",
    sellingCostsPct: "3",
    financeRate: "7",
    termMonths: "18",
    gdv: "3,200,000",
    targetProfitPct: "20",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    const formatted = formatCurrencyInput(raw);
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  /* ---- computed results ---- */

  const results = useMemo(() => {
    const landCost = parseCurrency(inputs.landCost);
    const buildCosts = parseCurrency(inputs.buildCosts);
    const profFeesPct = parseFloat(inputs.profFeesPct) || 0;
    const contingencyPct = parseFloat(inputs.contingencyPct) || 0;
    const s106Cil = parseCurrency(inputs.s106Cil);
    const sellingCostsPct = parseFloat(inputs.sellingCostsPct) || 0;
    const financeRate = parseFloat(inputs.financeRate) || 0;
    const termMonths = parseInt(inputs.termMonths, 10) || 0;
    const gdv = parseCurrency(inputs.gdv);
    const targetProfitPct = parseFloat(inputs.targetProfitPct) || 0;

    const profFees = Math.round(buildCosts * (profFeesPct / 100));
    const contingency = Math.round(buildCosts * (contingencyPct / 100));
    const totalBuildCosts = buildCosts + profFees + contingency;
    const totalProjectCost = landCost + totalBuildCosts + s106Cil;

    const sellingCosts = Math.round(gdv * (sellingCostsPct / 100));
    // Finance on 60% average drawdown
    const financeCosts = Math.round(
      totalProjectCost * 0.6 * (financeRate / 100) * (termMonths / 12)
    );
    const totalCosts = totalProjectCost + sellingCosts + financeCosts;

    const targetProfitAmount = Math.round(gdv * (targetProfitPct / 100));
    const actualProfit = gdv - totalCosts;
    const profitOnCost = totalCosts > 0 ? (actualProfit / totalCosts) * 100 : 0;
    const profitOnGdv = gdv > 0 ? (actualProfit / gdv) * 100 : 0;

    const maxLandBid =
      gdv -
      totalBuildCosts -
      s106Cil -
      sellingCosts -
      financeCosts -
      targetProfitAmount;

    return {
      landCost,
      buildCosts,
      profFees,
      contingency,
      totalBuildCosts,
      totalProjectCost,
      s106Cil,
      sellingCosts,
      financeCosts,
      totalCosts,
      gdv,
      targetProfitPct,
      targetProfitAmount,
      actualProfit,
      profitOnCost,
      profitOnGdv,
      maxLandBid,
    };
  }, [inputs]);

  /* ---- sensitivity rows ---- */

  const sensitivityRows = useMemo(() => {
    return SENSITIVITY_STEPS.map((step) => {
      const adjustedGdv = Math.round(results.gdv * step.mult);
      const adjustedSellingCosts = Math.round(
        adjustedGdv * (parseFloat(inputs.sellingCostsPct) / 100)
      );
      const adjustedTotalCosts =
        results.totalProjectCost + adjustedSellingCosts + results.financeCosts;
      const profit = adjustedGdv - adjustedTotalCosts;
      const profitOnCost =
        adjustedTotalCosts > 0 ? (profit / adjustedTotalCosts) * 100 : 0;
      const profitOnGdv =
        adjustedGdv > 0 ? (profit / adjustedGdv) * 100 : 0;

      return {
        label: step.label,
        gdv: adjustedGdv,
        profit,
        profitOnCost,
        profitOnGdv,
        isBase: step.mult === 1,
      };
    });
  }, [results, inputs.sellingCostsPct]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ LEFT: INPUTS ━━━ */}
      <div className="space-y-6">
        {/* Card 1: Project Costs */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Project Costs</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="da-land" className="text-sm font-semibold">
                Land Cost
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="da-land"
                  value={inputs.landCost}
                  onChange={(e) =>
                    updateCurrencyField("landCost", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="da-build" className="text-sm font-semibold">
                Build Costs
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="da-build"
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
                <Label htmlFor="da-fees" className="text-sm font-semibold">
                  Professional Fees
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="da-fees"
                    value={inputs.profFeesPct}
                    onChange={(e) =>
                      updateField("profFeesPct", e.target.value)
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
                  htmlFor="da-contingency"
                  className="text-sm font-semibold"
                >
                  Contingency
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="da-contingency"
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
              <Label htmlFor="da-s106" className="text-sm font-semibold">
                S106 / CIL
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="da-s106"
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

        {/* Card 2: Revenue & Finance */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Revenue & Finance</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="da-gdv" className="text-sm font-semibold">
                GDV (Gross Development Value)
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="da-gdv"
                  value={inputs.gdv}
                  onChange={(e) =>
                    updateCurrencyField("gdv", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="da-selling"
                  className="text-sm font-semibold"
                >
                  Selling Costs
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="da-selling"
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
                  htmlFor="da-finance-rate"
                  className="text-sm font-semibold"
                >
                  Finance Rate p.a.
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="da-finance-rate"
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="da-term" className="text-sm font-semibold">
                  Finance Term
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="da-term"
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
                <Label
                  htmlFor="da-target-profit"
                  className="text-sm font-semibold"
                >
                  Target Profit
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="da-target-profit"
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

      {/* ━━━ RIGHT: RESULTS ━━━ */}
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
              <FileSpreadsheet
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Development Appraisal</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Land Cost</span>
              <span className="font-semibold">
                {formatGBP(results.landCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Build Costs{" "}
                <span className="text-white/40">(inc fees & contingency)</span>
              </span>
              <span className="font-semibold">
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
              <span className="text-white/60">
                Finance Costs{" "}
                <span className="text-white/40">
                  ({inputs.financeRate}% x {inputs.termMonths}mo)
                </span>
              </span>
              <span className="text-white/80">
                {formatGBP(results.financeCosts)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="font-semibold text-white/80">Total Costs</span>
              <span className="font-semibold">
                {formatGBP(results.totalCosts)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">GDV</span>
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
                {formatGBP(results.actualProfit)}
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

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Max Land Bid
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.maxLandBid)}
              </span>
            </div>
            <div className="text-xs text-white/40">
              At {inputs.targetProfitPct}% target profit on GDV
            </div>
          </div>
        </div>

        {/* Sensitivity table */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            GDV Sensitivity Analysis
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-semibold text-muted-foreground">
                    GDV
                  </th>
                  <th className="pb-3 text-right font-semibold text-muted-foreground">
                    Profit
                  </th>
                  <th className="pb-3 text-right font-semibold text-muted-foreground">
                    on Cost
                  </th>
                  <th className="pb-3 text-right font-semibold text-muted-foreground">
                    on GDV
                  </th>
                </tr>
              </thead>
              <tbody>
                {sensitivityRows.map((row) => (
                  <tr
                    key={row.label}
                    className={
                      row.isBase
                        ? "font-semibold"
                        : "text-muted-foreground"
                    }
                  >
                    <td className="py-2 text-left">
                      <span className="mr-1 text-xs text-muted-foreground">
                        {row.label}
                      </span>
                      {formatGBP(row.gdv)}
                    </td>
                    <td
                      className="py-2 text-right"
                      style={
                        row.profit < 0
                          ? { color: "oklch(0.55 0.22 25)" }
                          : undefined
                      }
                    >
                      {formatGBP(row.profit)}
                    </td>
                    <td
                      className="py-2 text-right"
                      style={
                        row.profitOnCost < 0
                          ? { color: "oklch(0.55 0.22 25)" }
                          : undefined
                      }
                    >
                      {formatPercent(row.profitOnCost)}
                    </td>
                    <td
                      className="py-2 text-right"
                      style={
                        row.profitOnGdv < 0
                          ? { color: "oklch(0.55 0.22 25)" }
                          : undefined
                      }
                    >
                      {formatPercent(row.profitOnGdv)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            gdv: String(results.gdv),
            total_cost: String(results.totalProjectCost),
            loan_amount: String(Math.round(results.gdv * 0.65)),
            source: "development-appraisal-calculator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
}
