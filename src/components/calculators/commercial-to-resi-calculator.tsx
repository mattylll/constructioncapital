"use client";

import { useState, useMemo } from "react";
import { Store } from "lucide-react";

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

type CommercialType = "retail" | "pub" | "warehouse" | "industrial";

const COMMERCIAL_OPTIONS: { value: CommercialType; label: string }[] = [
  { value: "retail", label: "Retail (Class E)" },
  { value: "pub", label: "Pub / Drinking Establishment" },
  { value: "warehouse", label: "Warehouse (B8)" },
  { value: "industrial", label: "Industrial (B2)" },
];

interface Inputs {
  commercialType: CommercialType;
  purchasePrice: string;
  footprintSqft: string;
  storeys: string;
  proposedUnits: string;
  costPerSqft: string;
  salePricePerUnit: string;
}

export function CommercialToResiCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    commercialType: "retail",
    purchasePrice: "500,000",
    footprintSqft: "3,000",
    storeys: "2",
    proposedUnits: "4",
    costPerSqft: "140",
    salePricePerUnit: "300,000",
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
    const footprint = parseCurrency(inputs.footprintSqft);
    const storeys = parseInt(inputs.storeys, 10) || 0;
    const units = parseInt(inputs.proposedUnits, 10) || 0;
    const costPerSqft = parseCurrency(inputs.costPerSqft);
    const salePrice = parseCurrency(inputs.salePricePerUnit);

    const totalSqft = footprint * storeys;
    const buildCost = totalSqft * costPerSqft;
    const totalCost = purchasePrice + buildCost;
    const gdv = units * salePrice;
    const profit = gdv - totalCost;
    const profitOnCost = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    const profitOnGdv = gdv > 0 ? (profit / gdv) * 100 : 0;

    const planningRoute =
      inputs.commercialType === "retail"
        ? "Permitted Development (Class MA)"
        : "Full Planning Required";

    return {
      purchasePrice,
      totalSqft,
      buildCost,
      totalCost,
      gdv,
      profit,
      profitOnCost,
      profitOnGdv,
      planningRoute,
      units,
      salePrice,
      costPerSqft,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        {/* Card 1: Property Details */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Property Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="ctr-type" className="text-sm font-semibold">
                Commercial Type
              </Label>
              <div className="mt-1.5">
                <select
                  id="ctr-type"
                  value={inputs.commercialType}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      commercialType: e.target.value as CommercialType,
                    }))
                  }
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {COMMERCIAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="ctr-purchase" className="text-sm font-semibold">
                Purchase Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="ctr-purchase"
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
                  htmlFor="ctr-footprint"
                  className="text-sm font-semibold"
                >
                  Building Footprint
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="ctr-footprint"
                    value={inputs.footprintSqft}
                    onChange={(e) =>
                      updateCurrencyField("footprintSqft", e.target.value)
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
                <Label htmlFor="ctr-storeys" className="text-sm font-semibold">
                  Number of Storeys
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="ctr-storeys"
                    value={inputs.storeys}
                    onChange={(e) =>
                      updateNumericField("storeys", e.target.value)
                    }
                    className="h-11"
                    inputMode="numeric"
                  />
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
              <Label htmlFor="ctr-units" className="text-sm font-semibold">
                Proposed Units
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="ctr-units"
                  value={inputs.proposedUnits}
                  onChange={(e) =>
                    updateNumericField("proposedUnits", e.target.value)
                  }
                  className="h-11"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="ctr-cost-sqft" className="text-sm font-semibold">
                Conversion Cost Per Sqft
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="ctr-cost-sqft"
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
                htmlFor="ctr-sale-price"
                className="text-sm font-semibold"
              >
                Sale Price Per Unit
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="ctr-sale-price"
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
              <Store
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Conversion Appraisal</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Planning Route</span>
              <span
                className="font-semibold"
                style={{
                  color:
                    results.planningRoute.includes("Permitted")
                      ? "oklch(0.75 0.15 145)"
                      : "oklch(0.8 0.15 60)",
                }}
              >
                {results.planningRoute}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Floor Area</span>
              <span className="font-semibold">
                {results.totalSqft.toLocaleString()} sqft
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
                  ({formatGBP(results.costPerSqft)}/sqft)
                </span>
              </span>
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
            source: "commercial-to-resi-calculator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
}
