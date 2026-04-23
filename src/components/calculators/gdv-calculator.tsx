"use client";

import { useState, useMemo } from "react";
import { BarChart3, Plus, Trash2 } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
 StackBar , DealRoomCta , Disclaimer } from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

const UNIT_TYPE_OPTIONS = [
  "Studio Flat",
  "1-Bed Flat",
  "2-Bed Flat",
  "3-Bed Flat",
  "1-Bed House",
  "2-Bed House",
  "3-Bed House",
  "4-Bed House",
  "5-Bed House",
  "Commercial Unit",
] as const;

type UnitTypeName = (typeof UNIT_TYPE_OPTIONS)[number];

interface UnitRow {
  id: number;
  type: UnitTypeName;
  quantity: string;
  pricePerUnit: string;
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

let nextId = 3; // start after the two defaults

export function GdvCalculator() {
  const [units, setUnits] = useState<UnitRow[]>([
    { id: 1, type: "2-Bed Flat", quantity: "4", pricePerUnit: "325,000" },
    { id: 2, type: "3-Bed House", quantity: "2", pricePerUnit: "475,000" },
  ]);

  /* ---- row operations ---- */

  function addRow() {
    setUnits((prev) => [
      ...prev,
      { id: nextId++, type: "2-Bed Flat", quantity: "1", pricePerUnit: "" },
    ]);
  }

  function removeRow(id: number) {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  }

  function updateRow(id: number, field: keyof Omit<UnitRow, "id">, value: string) {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        if (field === "pricePerUnit") {
          return { ...u, pricePerUnit: formatCurrencyInput(value) };
        }
        if (field === "type") {
          return { ...u, type: value as UnitTypeName };
        }
        // quantity -- allow only digits
        return { ...u, [field]: value.replace(/[^0-9]/g, "") };
      }),
    );
  }

  /* ---- computed results ---- */

  const results = useMemo(() => {
    const breakdown = units.map((u) => {
      const qty = parseInt(u.quantity, 10) || 0;
      const price = parseCurrency(u.pricePerUnit);
      const subtotal = qty * price;
      
return { ...u, qty, price, subtotal };
    });

    const totalGDV = breakdown.reduce((sum, b) => sum + b.subtotal, 0);
    const totalUnits = breakdown.reduce((sum, b) => sum + b.qty, 0);
    const gdvPerUnit = totalUnits > 0 ? Math.round(totalGDV / totalUnits) : 0;

    const breakdownWithPct = breakdown.map((b) => ({
      ...b,
      pctOfGDV: totalGDV > 0 ? (b.subtotal / totalGDV) * 100 : 0,
    }));

    return { totalGDV, totalUnits, gdvPerUnit, breakdown: breakdownWithPct };
  }, [units]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ LEFT: UNIT MIX BUILDER ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Unit Mix</h2>

          <div className="space-y-4">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="grid grid-cols-[1fr_80px_1fr_40px] items-end gap-3"
              >
                {/* Type select */}
                <div>
                  <Label
                    htmlFor={`gdv-type-${unit.id}`}
                    className="text-sm font-semibold"
                  >
                    Unit Type
                  </Label>
                  <select
                    id={`gdv-type-${unit.id}`}
                    value={unit.type}
                    onChange={(e) => updateRow(unit.id, "type", e.target.value)}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {UNIT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <Label
                    htmlFor={`gdv-qty-${unit.id}`}
                    className="text-sm font-semibold"
                  >
                    Qty
                  </Label>
                  <Input
                    id={`gdv-qty-${unit.id}`}
                    value={unit.quantity}
                    onChange={(e) =>
                      updateRow(unit.id, "quantity", e.target.value)
                    }
                    className="h-11"
                    inputMode="numeric"
                  />
                </div>

                {/* Price per unit */}
                <div>
                  <Label
                    htmlFor={`gdv-price-${unit.id}`}
                    className="text-sm font-semibold"
                  >
                    Price Per Unit
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      £
                    </span>
                    <Input
                      id={`gdv-price-${unit.id}`}
                      value={unit.pricePerUnit}
                      onChange={(e) =>
                        updateRow(unit.id, "pricePerUnit", e.target.value)
                      }
                      className="h-11 pl-7"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                {/* Remove button */}
                <div>
                  {units.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-11 w-10 text-muted-foreground hover:text-destructive"
                      onClick={() => removeRow(unit.id)}
                      aria-label={`Remove ${unit.type}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="h-11 w-10" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add row button */}
          <Button
            type="button"
            variant="outline"
            className="mt-6 w-full"
            onClick={addRow}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Unit Type
          </Button>
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
              <BarChart3
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">GDV Summary</h2>
          </div>

          {/* Headline figure */}
          <div className="mb-2 text-sm text-white/60">Total GDV</div>
          <div
            className="mb-6 text-3xl font-bold tracking-tight"
            style={{ color: "var(--gold)" }}
          >
            {formatGBP(results.totalGDV)}
          </div>

          {/* Key metrics */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Units</span>
              <span className="font-semibold">{results.totalUnits}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Average GDV Per Unit</span>
              <span className="font-semibold">
                {formatGBP(results.gdvPerUnit)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Unit mix breakdown */}
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Unit Mix Breakdown
            </h3>

            {results.breakdown.map((row) => (
              <div key={row.id} className="space-y-0.5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">
                    {row.type}{" "}
                    <span className="text-white/40">
                      ({row.qty} x {formatGBP(row.price)})
                    </span>
                  </span>
                  <span className="font-semibold">
                    {formatGBP(row.subtotal)}
                  </span>
                </div>
                <div className="text-right text-xs text-white/40">
                  {formatPercent(row.pctOfGDV)} of GDV
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual stack */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            GDV Composition
          </h3>
          <div className="space-y-2">
            {results.breakdown
              .filter((b) => b.subtotal > 0)
              .map((row, i) => (
                <StackBar
                  key={row.id}
                  label={row.type}
                  amount={row.subtotal}
                  total={results.totalGDV}
                  color={stackColors[i % stackColors.length]}
                />
              ))}
          </div>
        </div>

        {/* Sensitivity analysis */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Sensitivity Analysis
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {SENSITIVITY_STEPS.map((step) => (
                    <th
                      key={step.label}
                      className={`pb-3 text-center font-semibold ${
                        step.label === "Base"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {SENSITIVITY_STEPS.map((step) => {
                    const adjusted = Math.round(results.totalGDV * step.mult);
                    
return (
                      <td
                        key={step.label}
                        className={`pt-3 text-center font-semibold ${
                          step.label === "Base"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatGBP(adjusted)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            gdv: String(results.totalGDV),
            source: "gdv-calculator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Palette for stack bars                                              */
/* ------------------------------------------------------------------ */

const stackColors = [
  "oklch(0.75 0.12 85)",
  "oklch(0.65 0.13 85)",
  "oklch(0.55 0.10 85)",
  "oklch(0.45 0.08 255)",
  "oklch(0.35 0.06 255)",
  "oklch(0.60 0.08 180)",
  "oklch(0.50 0.10 140)",
  "oklch(0.70 0.08 30)",
  "oklch(0.40 0.06 300)",
  "oklch(0.55 0.12 60)",
];
