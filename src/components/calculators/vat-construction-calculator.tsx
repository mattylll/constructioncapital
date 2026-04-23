"use client";

import { useState, useMemo } from "react";
import { BadgePercent } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
 DealRoomCta , Disclaimer } from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type BuildType = "new-build-residential" | "conversion" | "refurbishment" | "commercial";

interface Inputs {
  buildType: BuildType;
  buildCost: string;
  professionalFees: string;
  vatRegistered: boolean;
}

/* ------------------------------------------------------------------ */
/*  VAT rate lookup                                                    */
/* ------------------------------------------------------------------ */

const VAT_RATES: Record<BuildType, { build: number; label: string }> = {
  "new-build-residential": { build: 0, label: "0% (Zero-rated)" },
  conversion: { build: 5, label: "5% (Reduced rate)" },
  refurbishment: { build: 20, label: "20% (Standard rate)" },
  commercial: { build: 20, label: "20% (Standard rate)" },
};

const BUILD_TYPE_LABELS: Record<BuildType, string> = {
  "new-build-residential": "New Build Residential",
  conversion: "Conversion",
  refurbishment: "Refurbishment",
  commercial: "Commercial",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function VatConstructionCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    buildType: "new-build-residential",
    buildCost: "800,000",
    professionalFees: "80,000",
    vatRegistered: false,
  });

  function updateCurrency(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string | boolean) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const buildCost = parseCurrency(inputs.buildCost);
    const profFees = parseCurrency(inputs.professionalFees);

    const buildVATRate = VAT_RATES[inputs.buildType].build;
    const profFeesVATRate = 20;

    const buildVAT = Math.round(buildCost * (buildVATRate / 100));
    const profFeesVAT = Math.round(profFees * (profFeesVATRate / 100));
    const totalVAT = buildVAT + profFeesVAT;

    // Reclaimable logic
    let reclaimable = 0;
    if (inputs.vatRegistered) {
      reclaimable = totalVAT;
    } else if (inputs.buildType === "new-build-residential") {
      // DIY Housebuilder scheme - can reclaim VAT on prof fees for new builds
      reclaimable = profFeesVAT;
    }

    const netVATLiability = totalVAT - reclaimable;

    const totalProjectCost = buildCost + profFees;
    const totalWithVAT = totalProjectCost + netVATLiability;
    const vatAsPctOfCost = totalProjectCost > 0
      ? (netVATLiability / totalProjectCost) * 100
      : 0;

    return {
      buildCost,
      profFees,
      buildVATRate,
      profFeesVATRate,
      buildVAT,
      profFeesVAT,
      totalVAT,
      reclaimable,
      netVATLiability,
      totalProjectCost,
      totalWithVAT,
      vatAsPctOfCost,
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
              <Label htmlFor="vat-type" className="text-sm font-semibold">
                Build Type
              </Label>
              <select
                id="vat-type"
                value={inputs.buildType}
                onChange={(e) => updateField("buildType", e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="new-build-residential">New Build Residential</option>
                <option value="conversion">Conversion</option>
                <option value="refurbishment">Refurbishment</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <Label htmlFor="vat-build" className="text-sm font-semibold">
                Total Build Cost
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="vat-build"
                  value={inputs.buildCost}
                  onChange={(e) => updateCurrency("buildCost", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="vat-fees" className="text-sm font-semibold">
                Professional Fees
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="vat-fees"
                  value={inputs.professionalFees}
                  onChange={(e) => updateCurrency("professionalFees", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* VAT registered toggle */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">VAT Registered</Label>
              <button
                type="button"
                role="switch"
                aria-checked={inputs.vatRegistered}
                onClick={() => updateField("vatRegistered", !inputs.vatRegistered)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  inputs.vatRegistered ? "bg-gold" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 ${
                    inputs.vatRegistered ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
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
              <BadgePercent
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">VAT Summary</h2>
          </div>

          {/* VAT rate headline */}
          <div className="mb-6 rounded-lg p-4" style={{ background: "oklch(1 0 0 / 0.05)" }}>
            <div className="text-sm text-white/60">Build VAT Rate</div>
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--gold)" }}
            >
              {VAT_RATES[inputs.buildType].label}
            </div>
            <div className="mt-1 text-xs text-white/40">
              {BUILD_TYPE_LABELS[inputs.buildType]}
            </div>
          </div>

          <div className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              VAT Breakdown
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                VAT on Build ({results.buildVATRate}%)
              </span>
              <span className="font-semibold">{formatGBP(results.buildVAT)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                VAT on Professional Fees (20%)
              </span>
              <span className="font-semibold">{formatGBP(results.profFeesVAT)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total VAT</span>
              <span className="font-semibold">{formatGBP(results.totalVAT)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Reclaimable</span>
              <span className="font-semibold text-green-400">
                -{formatGBP(results.reclaimable)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Net VAT Liability
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.netVATLiability)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">VAT as % of Project Cost</span>
              <span className="text-white/80">
                {formatPercent(results.vatAsPctOfCost)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Project Cost (ex. VAT)</span>
              <span className="font-semibold">{formatGBP(results.totalProjectCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total with Net VAT</span>
              <span className="font-semibold">{formatGBP(results.totalWithVAT)}</span>
            </div>
          </div>
        </div>

        {/* VAT rates reference */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Construction VAT Rates
          </h3>
          <div className="space-y-3">
            {(Object.entries(VAT_RATES) as [BuildType, { build: number; label: string }][]).map(
              ([type, data]) => (
                <div
                  key={type}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                    type === inputs.buildType
                      ? "border-gold/40 bg-gold/5"
                      : "border-border"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {BUILD_TYPE_LABELS[type]}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      data.build === 0
                        ? "text-green-600 dark:text-green-400"
                        : data.build === 5
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {data.build}%
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            total_cost: String(results.totalWithVAT),
            source: "vat-construction-calculator",
          }}
          label="Discuss Your Project"
        />

        <Disclaimer text="VAT treatment depends on project specifics and HMRC interpretation. Always consult a qualified tax adviser for your particular circumstances." />
      </div>
    </div>
  );
}
