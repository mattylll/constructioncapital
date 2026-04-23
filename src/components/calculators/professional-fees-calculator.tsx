"use client";

import { useState, useMemo } from "react";
import { Briefcase } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
 StackBar , DealRoomCta , Disclaimer } from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ProjectType = "new-build" | "conversion" | "refurbishment";

interface FeeItem {
  key: string;
  label: string;
  enabled: boolean;
  type: "percentage" | "fixed";
  value: number; // percentage or fixed amount
}

interface Inputs {
  projectType: ProjectType;
  buildCost: string;
  numberOfUnits: string;
  fees: FeeItem[];
}

/* ------------------------------------------------------------------ */
/*  Default fee items                                                  */
/* ------------------------------------------------------------------ */

const DEFAULT_FEES: FeeItem[] = [
  { key: "architect", label: "Architect", enabled: true, type: "percentage", value: 7 },
  { key: "structural", label: "Structural Engineer", enabled: true, type: "fixed", value: 5000 },
  { key: "planning", label: "Planning Consultant", enabled: true, type: "fixed", value: 4000 },
  { key: "qs", label: "Quantity Surveyor", enabled: true, type: "percentage", value: 2 },
  { key: "pm", label: "Project Manager", enabled: false, type: "percentage", value: 3 },
  { key: "building-control", label: "Building Control", enabled: true, type: "fixed", value: 2500 },
  { key: "cdm", label: "CDM Coordinator", enabled: false, type: "fixed", value: 3000 },
  { key: "ecology", label: "Ecology Survey", enabled: false, type: "fixed", value: 3500 },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ProfessionalFeesCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    projectType: "new-build",
    buildCost: "1,000,000",
    numberOfUnits: "6",
    fees: DEFAULT_FEES.map((f) => ({ ...f })),
  });

  function updateCurrency(field: "buildCost", raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  function toggleFee(key: string) {
    setInputs((prev) => ({
      ...prev,
      fees: prev.fees.map((f) =>
        f.key === key ? { ...f, enabled: !f.enabled } : f
      ),
    }));
  }

  function updateFeeValue(key: string, value: string) {
    const numValue = parseFloat(value) || 0;
    setInputs((prev) => ({
      ...prev,
      fees: prev.fees.map((f) =>
        f.key === key ? { ...f, value: numValue } : f
      ),
    }));
  }

  const results = useMemo(() => {
    const buildCost = parseCurrency(inputs.buildCost);
    const units = parseInt(inputs.numberOfUnits, 10) || 1;

    const feeBreakdown = inputs.fees.map((fee) => {
      if (!fee.enabled) return { ...fee, amount: 0 };
      const amount =
        fee.type === "percentage"
          ? Math.round(buildCost * (fee.value / 100))
          : fee.value;
      
return { ...fee, amount };
    });

    const totalFees = feeBreakdown
      .filter((f) => f.enabled)
      .reduce((sum, f) => sum + f.amount, 0);

    const feesPctOfBuild = buildCost > 0 ? (totalFees / buildCost) * 100 : 0;
    const feesPerUnit = units > 0 ? Math.round(totalFees / units) : 0;

    return {
      buildCost,
      units,
      feeBreakdown,
      totalFees,
      feesPctOfBuild,
      feesPerUnit,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Project Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="pf-type" className="text-sm font-semibold">
                Project Type
              </Label>
              <select
                id="pf-type"
                value={inputs.projectType}
                onChange={(e) => updateField("projectType", e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="new-build">New Build</option>
                <option value="conversion">Conversion</option>
                <option value="refurbishment">Refurbishment</option>
              </select>
            </div>

            <div>
              <Label htmlFor="pf-build" className="text-sm font-semibold">
                Build Cost
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="pf-build"
                  value={inputs.buildCost}
                  onChange={(e) => updateCurrency("buildCost", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pf-units" className="text-sm font-semibold">
                Number of Units
              </Label>
              <Input
                id="pf-units"
                value={inputs.numberOfUnits}
                onChange={(e) =>
                  updateField("numberOfUnits", e.target.value.replace(/[^0-9]/g, ""))
                }
                className="mt-1.5 h-11"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Professional Appointments</h2>

          <div className="space-y-3">
            {inputs.fees.map((fee) => (
              <div
                key={fee.key}
                className={`rounded-lg border p-3 transition-colors ${
                  fee.enabled ? "border-gold/30 bg-gold/5" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={fee.enabled}
                      onClick={() => toggleFee(fee.key)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                        fee.enabled ? "bg-gold" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transition-transform duration-200 ${
                          fee.enabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className={`text-sm font-medium ${fee.enabled ? "" : "text-muted-foreground"}`}>
                      {fee.label}
                    </span>
                  </div>

                  {fee.enabled && (
                    <div className="flex items-center gap-2">
                      {fee.type === "percentage" ? (
                        <div className="relative">
                          <Input
                            value={String(fee.value)}
                            onChange={(e) => updateFeeValue(fee.key, e.target.value)}
                            className="h-8 w-16 pr-5 text-right text-sm"
                            inputMode="decimal"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            %
                          </span>
                        </div>
                      ) : (
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            £
                          </span>
                          <Input
                            value={formatCurrencyInput(String(fee.value))}
                            onChange={(e) =>
                              updateFeeValue(fee.key, String(parseCurrency(e.target.value)))
                            }
                            className="h-8 w-24 pl-5 text-right text-sm"
                            inputMode="numeric"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {fee.enabled && (
                  <div className="mt-1 text-right text-xs text-muted-foreground">
                    {formatGBP(
                      results.feeBreakdown.find((f) => f.key === fee.key)?.amount ?? 0
                    )}
                  </div>
                )}
              </div>
            ))}
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
              <Briefcase
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Professional Fees Summary</h2>
          </div>

          {/* Headline */}
          <div className="mb-2 text-sm text-white/60">Total Professional Fees</div>
          <div
            className="mb-6 text-3xl font-bold tracking-tight"
            style={{ color: "var(--gold)" }}
          >
            {formatGBP(results.totalFees)}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">As % of Build Cost</span>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>
                {formatPercent(results.feesPctOfBuild)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Per Unit</span>
              <span className="font-semibold">{formatGBP(results.feesPerUnit)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Fee Breakdown
            </h3>

            {results.feeBreakdown
              .filter((f) => f.enabled && f.amount > 0)
              .map((fee) => (
                <div key={fee.key} className="flex justify-between text-sm">
                  <span className="text-white/60">
                    {fee.label}{" "}
                    <span className="text-white/30">
                      ({fee.type === "percentage" ? `${fee.value}%` : "fixed"})
                    </span>
                  </span>
                  <span className="font-semibold">{formatGBP(fee.amount)}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Fee composition chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Fee Composition
          </h3>
          <div className="space-y-2">
            {results.feeBreakdown
              .filter((f) => f.enabled && f.amount > 0)
              .map((fee, i) => (
                <StackBar
                  key={fee.key}
                  label={fee.label}
                  amount={fee.amount}
                  total={results.totalFees}
                  color={feeColors[i % feeColors.length]}
                />
              ))}
          </div>
        </div>

        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            total_cost: String(results.buildCost + results.totalFees),
            source: "professional-fees-calculator",
          }}
          label="Discuss Your Project"
        />

        <Disclaimer text="Professional fees are indicative estimates and vary by location, project complexity and individual firm pricing. Obtain quotes for your specific project." />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Palette                                                            */
/* ------------------------------------------------------------------ */

const feeColors = [
  "oklch(0.75 0.12 85)",
  "oklch(0.65 0.13 85)",
  "oklch(0.55 0.10 85)",
  "oklch(0.45 0.08 255)",
  "oklch(0.35 0.06 255)",
  "oklch(0.60 0.08 180)",
  "oklch(0.50 0.10 140)",
  "oklch(0.70 0.08 30)",
];
