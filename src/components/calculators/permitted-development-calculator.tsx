"use client";

import { useState, useMemo } from "react";
import { ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

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

type UseClass =
  | "E-office"
  | "E-light-industrial"
  | "E-retail"
  | "E-restaurant"
  | "E-gym"
  | "E-medical"
  | "B2"
  | "B8"
  | "sui-generis";

const USE_CLASS_OPTIONS: { value: UseClass; label: string }[] = [
  { value: "E-office", label: "Office - Class E(g)(i)" },
  { value: "E-light-industrial", label: "Light Industrial - Class E(g)(iii)" },
  { value: "E-retail", label: "Retail - Class E(a)" },
  { value: "E-restaurant", label: "Restaurant/Cafe - Class E(b)" },
  { value: "E-gym", label: "Gym/Indoor Sport - Class E(d)" },
  { value: "E-medical", label: "Medical/Health - Class E(e)" },
  { value: "B2", label: "General Industrial - B2" },
  { value: "B8", label: "Storage/Warehouse - B8" },
  { value: "sui-generis", label: "Pub/Drinking - Sui Generis" },
];

const NDSS_MIN_SQM = 37;
const SQM_TO_SQFT = 10.764;

interface Inputs {
  useClass: UseClass;
  floorspaceSqm: string;
  proposedUnits: string;
  purchasePrice: string;
  conversionCostPerSqft: string;
  salePricePerUnit: string;
}

export function PermittedDevelopmentCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    useClass: "E-office",
    floorspaceSqm: "500",
    proposedUnits: "6",
    purchasePrice: "600,000",
    conversionCostPerSqft: "130",
    salePricePerUnit: "275,000",
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
    const floorspaceSqm = parseInt(inputs.floorspaceSqm, 10) || 0;
    const proposedUnits = parseInt(inputs.proposedUnits, 10) || 0;
    const purchasePrice = parseCurrency(inputs.purchasePrice);
    const conversionCostPerSqft = parseCurrency(inputs.conversionCostPerSqft);
    const salePricePerUnit = parseCurrency(inputs.salePricePerUnit);

    const floorspaceSqft = Math.round(floorspaceSqm * SQM_TO_SQFT);
    const avgUnitSizeSqm =
      proposedUnits > 0 ? floorspaceSqm / proposedUnits : 0;
    const avgUnitSizeSqft =
      proposedUnits > 0 ? floorspaceSqft / proposedUnits : 0;

    // PD eligibility: Class E uses are eligible for Class MA
    const isClassE = inputs.useClass.startsWith("E-");
    const isEligible = isClassE;
    const unitSizeWarning =
      proposedUnits > 0 && avgUnitSizeSqm < NDSS_MIN_SQM;

    // Financial calculations
    const buildCost = floorspaceSqft * conversionCostPerSqft;
    const totalCost = purchasePrice + buildCost;
    const gdv = proposedUnits * salePricePerUnit;
    const profit = gdv - totalCost;
    const profitOnCost = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    const profitOnGdv = gdv > 0 ? (profit / gdv) * 100 : 0;

    return {
      floorspaceSqm,
      floorspaceSqft,
      avgUnitSizeSqm,
      avgUnitSizeSqft,
      proposedUnits,
      purchasePrice,
      buildCost,
      totalCost,
      gdv,
      profit,
      profitOnCost,
      profitOnGdv,
      salePricePerUnit,
      isEligible,
      unitSizeWarning,
    };
  }, [inputs]);

  /** Reason text when PD is not available */
  function getIneligibleReason(): string {
    switch (inputs.useClass) {
      case "B2":
        return "General Industrial (B2) premises are not eligible for Class MA permitted development rights. A full planning application for change of use is required.";
      case "B8":
        return "Storage/Warehouse (B8) premises are not eligible for Class MA permitted development rights. A full planning application for change of use is required.";
      case "sui-generis":
        return "Pubs and drinking establishments (Sui Generis) are not eligible for Class MA permitted development rights. A full planning application is required, and Article 4 Directions may also apply.";
      default:
        return "This use class is not eligible for permitted development.";
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        {/* Card 1: Building Details */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Building Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="pd-use-class" className="text-sm font-semibold">
                Current Use Class
              </Label>
              <div className="mt-1.5">
                <select
                  id="pd-use-class"
                  value={inputs.useClass}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      useClass: e.target.value as UseClass,
                    }))
                  }
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {USE_CLASS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label
                htmlFor="pd-floorspace"
                className="text-sm font-semibold"
              >
                Building Floorspace
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="pd-floorspace"
                  value={inputs.floorspaceSqm}
                  onChange={(e) =>
                    updateNumericField("floorspaceSqm", e.target.value)
                  }
                  className="h-11 pr-12"
                  inputMode="numeric"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  sqm
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="pd-units" className="text-sm font-semibold">
                Proposed Number of Units
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="pd-units"
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
        </div>

        {/* Card 2: Financials */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Financials</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="pd-purchase" className="text-sm font-semibold">
                Purchase Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="pd-purchase"
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
              <Label htmlFor="pd-cost-sqft" className="text-sm font-semibold">
                Conversion Cost Per Sqft
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="pd-cost-sqft"
                  value={inputs.conversionCostPerSqft}
                  onChange={(e) =>
                    updateCurrencyField(
                      "conversionCostPerSqft",
                      e.target.value
                    )
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="pd-sale-price"
                className="text-sm font-semibold"
              >
                Estimated Sale Price Per Unit
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="pd-sale-price"
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

        {/* Eligibility Status Panel */}
        <div
          className="rounded-xl p-6"
          style={
            results.isEligible
              ? {
                  border: "1px solid oklch(0.6 0.15 145 / 0.3)",
                  background: "oklch(0.6 0.15 145 / 0.05)",
                }
              : {
                  border: "1px solid oklch(0.7 0.15 60 / 0.3)",
                  background: "oklch(0.7 0.15 60 / 0.05)",
                }
          }
        >
          {results.isEligible ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="h-5 w-5 shrink-0"
                  style={{ color: "oklch(0.6 0.18 145)" }}
                />
                <span
                  className="text-sm font-bold"
                  style={{ color: "oklch(0.45 0.12 145)" }}
                >
                  Eligible for Permitted Development (Class MA)
                </span>
              </div>
              <ul
                className="space-y-1.5 pl-7 text-xs"
                style={{ color: "oklch(0.45 0.1 145)" }}
              >
                <li>
                  Prior approval application required (56-day determination)
                </li>
                <li>Building must have been in commercial use for 2+ years</li>
                <li>No floorspace limit since 2024 GPDO amendment</li>
                <li>
                  Conditions include transport, flooding, contamination,
                  and natural light assessments
                </li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className="h-5 w-5 shrink-0"
                  style={{ color: "oklch(0.7 0.15 60)" }}
                />
                <span
                  className="text-sm font-bold"
                  style={{ color: "oklch(0.5 0.12 60)" }}
                >
                  Full Planning Permission Required
                </span>
              </div>
              <p
                className="pl-7 text-xs"
                style={{ color: "oklch(0.5 0.1 60)" }}
              >
                {getIneligibleReason()}
              </p>
            </div>
          )}

          {/* Unit size warning - shown alongside either status */}
          {results.unitSizeWarning && (
            <div
              className="mt-4 flex items-start gap-2 rounded-lg p-3"
              style={{
                border: "1px solid oklch(0.7 0.15 60 / 0.3)",
                background: "oklch(0.7 0.15 60 / 0.08)",
              }}
            >
              <AlertTriangle
                className="h-4 w-4 shrink-0 mt-0.5"
                style={{ color: "oklch(0.7 0.15 60)" }}
              />
              <p
                className="text-xs"
                style={{ color: "oklch(0.5 0.12 60)" }}
              >
                Average unit size is{" "}
                {Math.round(results.avgUnitSizeSqm)} sqm — below the
                37 sqm NDSS minimum. Reduce the number of units or
                increase floorspace to meet minimum space standards.
              </p>
            </div>
          )}
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
              <ShieldCheck
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">PD Conversion Appraisal</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Planning Route</span>
              <span
                className="font-semibold"
                style={{
                  color: results.isEligible
                    ? "oklch(0.75 0.15 145)"
                    : "oklch(0.8 0.15 60)",
                }}
              >
                {results.isEligible
                  ? "Permitted Development (Class MA)"
                  : "Full Planning Required"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Building Floorspace</span>
              <span className="font-semibold">
                {results.floorspaceSqm.toLocaleString()} sqm /{" "}
                {results.floorspaceSqft.toLocaleString()} sqft
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Avg Unit Size</span>
              <span className="font-semibold">
                {Math.round(results.avgUnitSizeSqm)} sqm
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
              <span className="text-white/60">Build Cost</span>
              <span className="font-semibold">
                {formatGBP(results.buildCost)}
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
                  ({results.proposedUnits} units x{" "}
                  {formatGBP(results.salePricePerUnit)} each)
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
            source: "permitted-development-calculator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
}
