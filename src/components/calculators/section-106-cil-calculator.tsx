"use client";

import { useState, useMemo } from "react";
import { Landmark } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
} from "@/components/calculators/shared";
import { StackBar } from "@/components/calculators/shared";
import { DealRoomCta } from "@/components/calculators/shared";
import { Disclaimer } from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Inputs {
  numberOfUnits: string;
  totalFloorspace: string;
  cilRate: string;
  affordableHousingPct: string;
  s106PerUnit: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Section106CilCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    numberOfUnits: "10",
    totalFloorspace: "800",
    cilRate: "150",
    affordableHousingPct: "30",
    s106PerUnit: "8,000",
  });

  function updateCurrency(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const units = parseInt(inputs.numberOfUnits, 10) || 0;
    const floorspace = parseFloat(inputs.totalFloorspace) || 0;
    const cilRate = parseCurrency(inputs.cilRate);
    const affordPct = parseFloat(inputs.affordableHousingPct) || 0;
    const s106PerUnit = parseCurrency(inputs.s106PerUnit);

    const cilLiability = Math.round(floorspace * cilRate);
    const s106Total = Math.round(units * s106PerUnit);
    const affordableUnits = Math.ceil(units * affordPct / 100);
    const marketUnits = units - affordableUnits;
    const totalPlanningObligations = cilLiability + s106Total;
    const costPerUnit = units > 0 ? Math.round(totalPlanningObligations / units) : 0;
    const costPerSqm = floorspace > 0 ? Math.round(totalPlanningObligations / floorspace) : 0;

    return {
      units,
      floorspace,
      cilLiability,
      s106Total,
      affordableUnits,
      marketUnits,
      totalPlanningObligations,
      costPerUnit,
      costPerSqm,
      affordPct,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Development Details</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cil-units" className="text-sm font-semibold">
                  Number of Units
                </Label>
                <Input
                  id="cil-units"
                  value={inputs.numberOfUnits}
                  onChange={(e) =>
                    updateField("numberOfUnits", e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="mt-1.5 h-11"
                  inputMode="numeric"
                />
              </div>

              <div>
                <Label htmlFor="cil-floor" className="text-sm font-semibold">
                  Total Floorspace
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="cil-floor"
                    value={inputs.totalFloorspace}
                    onChange={(e) =>
                      updateField("totalFloorspace", e.target.value.replace(/[^0-9.]/g, ""))
                    }
                    className="h-11 pr-12"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    sqm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Planning Obligations</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cil-rate" className="text-sm font-semibold">
                CIL Rate (per sqm)
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="cil-rate"
                  value={inputs.cilRate}
                  onChange={(e) => updateCurrency("cilRate", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cil-afford" className="text-sm font-semibold">
                Affordable Housing Required
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="cil-afford"
                  value={inputs.affordableHousingPct}
                  onChange={(e) => updateField("affordableHousingPct", e.target.value)}
                  className="h-11 pr-7"
                  inputMode="decimal"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="cil-s106" className="text-sm font-semibold">
                Estimated S106 Per Unit
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="cil-s106"
                  value={inputs.s106PerUnit}
                  onChange={(e) => updateCurrency("s106PerUnit", e.target.value)}
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
              <Landmark
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Planning Obligations</h2>
          </div>

          {/* Headline */}
          <div className="mb-2 text-sm text-white/60">Total Planning Obligations</div>
          <div
            className="mb-6 text-3xl font-bold tracking-tight"
            style={{ color: "var(--gold)" }}
          >
            {formatGBP(results.totalPlanningObligations)}
          </div>

          <div className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              CIL (Community Infrastructure Levy)
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                {results.floorspace.toLocaleString()} sqm x £{parseCurrency(inputs.cilRate).toLocaleString()}/sqm
              </span>
              <span className="font-semibold">{formatGBP(results.cilLiability)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Section 106 Contributions
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                {results.units} units x {formatGBP(parseCurrency(inputs.s106PerUnit))}/unit
              </span>
              <span className="font-semibold">{formatGBP(results.s106Total)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Housing Mix
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Affordable Units ({formatPercent(results.affordPct)})
              </span>
              <span className="font-semibold">{results.affordableUnits}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Market Units</span>
              <span className="font-semibold">{results.marketUnits}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Per-Unit Metrics
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Obligations Per Unit</span>
              <span className="font-semibold">{formatGBP(results.costPerUnit)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Obligations Per sqm</span>
              <span className="font-semibold">{formatGBP(results.costPerSqm)}</span>
            </div>
          </div>
        </div>

        {/* Obligation breakdown */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Obligation Breakdown
          </h3>
          <div className="space-y-2">
            {results.totalPlanningObligations > 0 && (
              <>
                <StackBar
                  label="CIL"
                  amount={results.cilLiability}
                  total={results.totalPlanningObligations}
                  color="oklch(0.75 0.12 85)"
                />
                <StackBar
                  label="Section 106"
                  amount={results.s106Total}
                  total={results.totalPlanningObligations}
                  color="oklch(0.35 0.05 255)"
                />
              </>
            )}
          </div>
        </div>

        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            source: "section-106-cil-calculator",
          }}
          label="Discuss Your Project"
        />

        <Disclaimer text="CIL rates and S106 obligations vary by local authority and are subject to change. Affordable housing requirements depend on local plan policy. Consult your planning consultant for site-specific figures." />
      </div>
    </div>
  );
}
