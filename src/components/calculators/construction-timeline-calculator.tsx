"use client";

import { useState, useMemo } from "react";
import { CalendarDays } from "lucide-react";

import { Label } from "@/components/ui/label";

import {
  formatPercent,
} from "@/components/calculators/shared";
import { DealRoomCta } from "@/components/calculators/shared";
import { Disclaimer } from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ProjectType = "new-build" | "conversion" | "refurbishment";
type ConstructionMethod = "traditional" | "timber-frame" | "sips" | "modular";

interface Inputs {
  projectType: ProjectType;
  numberOfUnits: string;
  constructionMethod: ConstructionMethod;
}

/* ------------------------------------------------------------------ */
/*  Timeline data                                                      */
/* ------------------------------------------------------------------ */

const SUPERSTRUCTURE_BY_METHOD: Record<ConstructionMethod, number> = {
  traditional: 4,
  "timber-frame": 3,
  sips: 2,
  modular: 1,
};

const METHOD_LABELS: Record<ConstructionMethod, string> = {
  traditional: "Traditional Build",
  "timber-frame": "Timber Frame",
  sips: "SIPs (Structural Insulated Panels)",
  modular: "Modular / Off-site",
};

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  "new-build": "New Build",
  conversion: "Conversion",
  refurbishment: "Refurbishment",
};

const PHASE_COLORS = [
  "oklch(0.75 0.12 85)",      // gold
  "oklch(0.55 0.10 85)",      // darker gold
  "oklch(0.65 0.08 255)",     // blue
  "oklch(0.45 0.06 255)",     // darker blue
  "oklch(0.60 0.08 180)",     // teal
  "oklch(0.50 0.10 140)",     // green
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ConstructionTimelineCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    projectType: "new-build",
    numberOfUnits: "6",
    constructionMethod: "traditional",
  });

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const units = parseInt(inputs.numberOfUnits, 10) || 1;
    const unitAdjustment = units > 4 ? (units - 4) * 0.5 : 0;

    // Planning + pre-commencement
    const planning = 3;

    // Groundworks
    let groundworks = 0;
    if (inputs.projectType === "new-build") groundworks = 2;
    else if (inputs.projectType === "conversion") groundworks = 1;
    // refurbishment = 0

    // Superstructure
    let superstructure = 0;
    if (inputs.projectType === "new-build") {
      superstructure = SUPERSTRUCTURE_BY_METHOD[inputs.constructionMethod];
    } else if (inputs.projectType === "conversion") {
      superstructure = 2;
    } else {
      superstructure = 1;
    }
    superstructure += unitAdjustment;

    // Internal fit-out
    let fitOut = Math.min(6, 1 + units * 0.5);
    fitOut += unitAdjustment;

    // External works
    const externalWorks = 1;

    // Sales period
    const salesPeriod = 3;

    const phases = [
      { label: "Planning & Pre-commencement", months: planning },
      { label: "Groundworks", months: groundworks },
      { label: "Superstructure", months: superstructure },
      { label: "Internal Fit-out", months: fitOut },
      { label: "External Works", months: externalWorks },
      { label: "Sales Period", months: salesPeriod },
    ].filter((p) => p.months > 0);

    const totalDuration = phases.reduce((sum, p) => sum + p.months, 0);
    const recommendedFinanceTerm = Math.ceil(totalDuration) + 2;

    // Build cumulative start months for Gantt display
    let cumulativeStart = 0;
    const phasesWithStart = phases.map((p) => {
      const start = cumulativeStart;
      cumulativeStart += p.months;
      return { ...p, start };
    });

    return {
      phases: phasesWithStart,
      totalDuration,
      recommendedFinanceTerm,
      units,
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
              <Label htmlFor="ct-type" className="text-sm font-semibold">
                Project Type
              </Label>
              <select
                id="ct-type"
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
              <Label htmlFor="ct-units" className="text-sm font-semibold">
                Number of Units
              </Label>
              <select
                id="ct-units"
                value={inputs.numberOfUnits}
                onChange={(e) => updateField("numberOfUnits", e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={String(n)}>
                    {n} {n === 1 ? "unit" : "units"}
                  </option>
                ))}
              </select>
            </div>

            {inputs.projectType === "new-build" && (
              <div>
                <Label htmlFor="ct-method" className="text-sm font-semibold">
                  Construction Method
                </Label>
                <select
                  id="ct-method"
                  value={inputs.constructionMethod}
                  onChange={(e) => updateField("constructionMethod", e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="traditional">Traditional Build</option>
                  <option value="timber-frame">Timber Frame</option>
                  <option value="sips">SIPs</option>
                  <option value="modular">Modular / Off-site</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Method comparison (for new build) */}
        {inputs.projectType === "new-build" && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Superstructure by Method
            </h3>
            <div className="space-y-2">
              {(Object.entries(SUPERSTRUCTURE_BY_METHOD) as [ConstructionMethod, number][]).map(
                ([method, months]) => (
                  <div
                    key={method}
                    className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                      method === inputs.constructionMethod
                        ? "border-gold/40 bg-gold/5"
                        : "border-border"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {METHOD_LABELS[method]}
                    </span>
                    <span className="text-sm font-bold text-muted-foreground">
                      {months} {months === 1 ? "month" : "months"}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
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
              <CalendarDays
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Construction Timeline</h2>
          </div>

          {/* Headline */}
          <div className="mb-2 text-sm text-white/60">Total Duration</div>
          <div
            className="mb-2 text-3xl font-bold tracking-tight"
            style={{ color: "var(--gold)" }}
          >
            {results.totalDuration.toFixed(1)} months
          </div>
          <div className="mb-6 text-sm text-white/40">
            {PROJECT_TYPE_LABELS[inputs.projectType]} &middot; {results.units}{" "}
            {results.units === 1 ? "unit" : "units"}
            {inputs.projectType === "new-build" && (
              <> &middot; {METHOD_LABELS[inputs.constructionMethod]}</>
            )}
          </div>

          {/* Phase breakdown */}
          <div className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Phase Breakdown
            </h3>

            {results.phases.map((phase, i) => (
              <div key={phase.label} className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-white/60">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: PHASE_COLORS[i % PHASE_COLORS.length] }}
                  />
                  {phase.label}
                </span>
                <span className="font-semibold">
                  {phase.months % 1 === 0
                    ? `${phase.months} mo`
                    : `${phase.months.toFixed(1)} mo`}
                </span>
              </div>
            ))}

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Recommended Finance Term
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {results.recommendedFinanceTerm} months
              </span>
            </div>
            <div className="text-xs text-white/40">
              Includes 2 months buffer for contingency
            </div>
          </div>
        </div>

        {/* Gantt chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Gantt Timeline
          </h3>
          <div className="space-y-2">
            {results.phases.map((phase, i) => {
              const leftPct =
                results.totalDuration > 0
                  ? (phase.start / results.totalDuration) * 100
                  : 0;
              const widthPct =
                results.totalDuration > 0
                  ? (phase.months / results.totalDuration) * 100
                  : 0;

              return (
                <div key={phase.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium">{phase.label}</span>
                    <span className="text-muted-foreground">
                      {phase.months % 1 === 0
                        ? `${phase.months} mo`
                        : `${phase.months.toFixed(1)} mo`}{" "}
                      ({formatPercent(widthPct)})
                    </span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        marginLeft: `${leftPct}%`,
                        width: `${widthPct}%`,
                        background: PHASE_COLORS[i % PHASE_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Month markers */}
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>Month 0</span>
              <span>Month {Math.ceil(results.totalDuration / 2)}</span>
              <span>Month {Math.ceil(results.totalDuration)}</span>
            </div>
          </div>
        </div>

        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            source: "construction-timeline-calculator",
          }}
          label="Discuss Your Timeline"
        />

        <Disclaimer text="Timeline estimates are indicative and depend on site conditions, planning requirements, contractor availability and weather. Always consult your project team for a detailed programme." />
      </div>
    </div>
  );
}
