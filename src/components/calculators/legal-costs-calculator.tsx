"use client";

import { useState, useMemo } from "react";
import { Scale } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  parseCurrency,
  formatGBP,
  formatCurrencyInput,
} from "@/components/calculators/shared";
import { DealRoomCta } from "@/components/calculators/shared";
import { Disclaimer } from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TransactionType = "purchase" | "sale" | "remortgage" | "development";
type Complexity = "standard" | "complex";

interface Inputs {
  transactionType: TransactionType;
  propertyValue: string;
  numberOfUnits: string;
  complexity: Complexity;
  leasehold: boolean;
}

/* ------------------------------------------------------------------ */
/*  Fee tables                                                         */
/* ------------------------------------------------------------------ */

const BASE_FEES: Record<TransactionType, Record<Complexity, number>> = {
  purchase: { standard: 1200, complex: 2500 },
  sale: { standard: 1000, complex: 2000 },
  remortgage: { standard: 800, complex: 1500 },
  development: { standard: 3500, complex: 7500 },
};

const TRANSACTION_LABELS: Record<TransactionType, string> = {
  purchase: "Purchase",
  sale: "Sale",
  remortgage: "Remortgage",
  development: "Development",
};

/* ------------------------------------------------------------------ */
/*  Land Registry fee bands                                            */
/* ------------------------------------------------------------------ */

function getLandRegistryFee(value: number): number {
  if (value <= 80000) return 20;
  if (value <= 100000) return 40;
  if (value <= 200000) return 95;
  if (value <= 500000) return 135;
  if (value <= 1000000) return 270;
  return 455;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function LegalCostsCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    transactionType: "purchase",
    propertyValue: "500,000",
    numberOfUnits: "1",
    complexity: "standard",
    leasehold: false,
  });

  function updateCurrency(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string | boolean) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const value = parseCurrency(inputs.propertyValue);
    const units = parseInt(inputs.numberOfUnits, 10) || 1;

    // Base legal fee
    const baseFee = BASE_FEES[inputs.transactionType][inputs.complexity];

    // Per-unit surcharge for development (above 1 unit)
    const unitSurcharge =
      inputs.transactionType === "development" && units > 1
        ? (units - 1) * 500
        : 0;

    // Leasehold premium
    const leaseholdPremium = inputs.leasehold ? 350 : 0;

    const totalLegalFees = baseFee + unitSurcharge + leaseholdPremium;

    // Disbursements
    const localSearches = 300;
    const landRegistryFee = getLandRegistryFee(value);
    const environmentalSearch = 50;
    const bankruptcySearch = 2; // per name, assume 1
    const bankTransfers = 35 * 2;

    const totalDisbursements =
      localSearches + landRegistryFee + environmentalSearch + bankruptcySearch + bankTransfers;

    const vatOnFees = Math.round(totalLegalFees * 0.2);
    const totalWithVAT = totalLegalFees + vatOnFees + totalDisbursements;

    return {
      baseFee,
      unitSurcharge,
      leaseholdPremium,
      totalLegalFees,
      localSearches,
      landRegistryFee,
      environmentalSearch,
      bankruptcySearch,
      bankTransfers,
      totalDisbursements,
      vatOnFees,
      totalWithVAT,
      propertyValue: value,
    };
  }, [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Transaction Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="lc-type" className="text-sm font-semibold">
                Transaction Type
              </Label>
              <select
                id="lc-type"
                value={inputs.transactionType}
                onChange={(e) => updateField("transactionType", e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="purchase">Purchase</option>
                <option value="sale">Sale</option>
                <option value="remortgage">Remortgage</option>
                <option value="development">Development</option>
              </select>
            </div>

            <div>
              <Label htmlFor="lc-value" className="text-sm font-semibold">
                Property Value
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="lc-value"
                  value={inputs.propertyValue}
                  onChange={(e) => updateCurrency("propertyValue", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            {inputs.transactionType === "development" && (
              <div>
                <Label htmlFor="lc-units" className="text-sm font-semibold">
                  Number of Units
                </Label>
                <Input
                  id="lc-units"
                  value={inputs.numberOfUnits}
                  onChange={(e) =>
                    updateField("numberOfUnits", e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="mt-1.5 h-11"
                  inputMode="numeric"
                />
              </div>
            )}

            <div>
              <Label htmlFor="lc-complex" className="text-sm font-semibold">
                Complexity
              </Label>
              <select
                id="lc-complex"
                value={inputs.complexity}
                onChange={(e) => updateField("complexity", e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="standard">Standard</option>
                <option value="complex">Complex</option>
              </select>
            </div>

            {/* Leasehold toggle */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Leasehold</Label>
              <button
                type="button"
                role="switch"
                aria-checked={inputs.leasehold}
                onClick={() => updateField("leasehold", !inputs.leasehold)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  inputs.leasehold ? "bg-gold" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 ${
                    inputs.leasehold ? "translate-x-5" : "translate-x-0"
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
              <Scale
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">
              {TRANSACTION_LABELS[inputs.transactionType]} Legal Costs
            </h2>
          </div>

          <div className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Legal Fees
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Base Fee ({inputs.complexity})
              </span>
              <span className="font-semibold">{formatGBP(results.baseFee)}</span>
            </div>
            {results.unitSurcharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Unit Surcharge</span>
                <span className="text-white/80">{formatGBP(results.unitSurcharge)}</span>
              </div>
            )}
            {results.leaseholdPremium > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Leasehold Premium</span>
                <span className="text-white/80">{formatGBP(results.leaseholdPremium)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-white/60">VAT on Fees (20%)</span>
              <span className="text-white/80">{formatGBP(results.vatOnFees)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Subtotal (inc. VAT)</span>
              <span className="font-semibold">
                {formatGBP(results.totalLegalFees + results.vatOnFees)}
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
              Disbursements
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Local Searches</span>
              <span className="text-white/80">{formatGBP(results.localSearches)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Land Registry</span>
              <span className="text-white/80">{formatGBP(results.landRegistryFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Environmental Search</span>
              <span className="text-white/80">{formatGBP(results.environmentalSearch)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Bankruptcy Search</span>
              <span className="text-white/80">{formatGBP(results.bankruptcySearch)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Bank Transfers (x2)</span>
              <span className="text-white/80">{formatGBP(results.bankTransfers)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Subtotal</span>
              <span className="font-semibold">{formatGBP(results.totalDisbursements)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Total Estimated Cost
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.totalWithVAT)}
              </span>
            </div>
          </div>
        </div>

        {/* Fee comparison table */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Fee Reference by Transaction Type
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-semibold">Type</th>
                  <th className="pb-3 text-right font-semibold">Standard</th>
                  <th className="pb-3 text-right font-semibold">Complex</th>
                </tr>
              </thead>
              <tbody>
                {(Object.entries(BASE_FEES) as [TransactionType, Record<Complexity, number>][]).map(
                  ([type, fees]) => (
                    <tr
                      key={type}
                      className={`border-b border-border/50 ${
                        type === inputs.transactionType ? "bg-gold/5" : ""
                      }`}
                    >
                      <td className="py-2.5 font-medium">{TRANSACTION_LABELS[type]}</td>
                      <td className="py-2.5 text-right text-muted-foreground">
                        {formatGBP(fees.standard)}
                      </td>
                      <td className="py-2.5 text-right text-muted-foreground">
                        {formatGBP(fees.complex)}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            total_cost: String(results.propertyValue),
            source: "legal-costs-calculator",
          }}
          label="Discuss Your Project"
        />

        <Disclaimer text="Legal costs are indicative and vary by firm, location and transaction complexity. Disbursement costs may differ. Contact us for tailored advice." />
      </div>
    </div>
  );
}
