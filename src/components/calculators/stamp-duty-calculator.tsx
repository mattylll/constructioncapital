"use client";

import { useState, useMemo } from "react";
import { Receipt } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  parseCurrency,
  formatGBP,
  formatPercent,
  DealRoomCta,
  Disclaimer,
} from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type BuyerType = "standard" | "first-time" | "additional" | "company";
type PropertyType = "residential" | "commercial";
type Location = "england" | "wales";

interface Inputs {
  purchasePrice: string;
  buyerType: BuyerType;
  propertyType: PropertyType;
  location: Location;
}

interface Band {
  from: number;
  to: number | null; // null = unlimited
  rate: number;
}

interface BandResult {
  from: number;
  to: number | null;
  rate: number;
  tax: number;
}

/* ------------------------------------------------------------------ */
/*  SDLT / LTT band definitions                                       */
/* ------------------------------------------------------------------ */

const ENGLAND_STANDARD: Band[] = [
  { from: 0, to: 125_000, rate: 0 },
  { from: 125_001, to: 250_000, rate: 2 },
  { from: 250_001, to: 925_000, rate: 5 },
  { from: 925_001, to: 1_500_000, rate: 10 },
  { from: 1_500_001, to: null, rate: 12 },
];

const ENGLAND_FIRST_TIME: Band[] = [
  { from: 0, to: 300_000, rate: 0 },
  { from: 300_001, to: 500_000, rate: 5 },
];

const WALES_RESIDENTIAL: Band[] = [
  { from: 0, to: 225_000, rate: 0 },
  { from: 225_001, to: 400_000, rate: 6 },
  { from: 400_001, to: 750_000, rate: 7.5 },
  { from: 750_001, to: 1_500_000, rate: 10 },
  { from: 1_500_001, to: null, rate: 12 },
];

const COMMERCIAL: Band[] = [
  { from: 0, to: 150_000, rate: 0 },
  { from: 150_001, to: 250_000, rate: 2 },
  { from: 250_001, to: null, rate: 5 },
];

const ADDITIONAL_SURCHARGE = 5;

/* ------------------------------------------------------------------ */
/*  Calculation helpers                                                */
/* ------------------------------------------------------------------ */

function getBands(
  price: number,
  buyerType: BuyerType,
  propertyType: PropertyType,
  location: Location
): Band[] {
  if (propertyType === "commercial") {
    return COMMERCIAL;
  }

  if (location === "wales") {
    return WALES_RESIDENTIAL;
  }

  // England & NI residential
  if (buyerType === "first-time" && price <= 500_000) {
    return ENGLAND_FIRST_TIME;
  }

  return ENGLAND_STANDARD;
}

function calculateSdlt(
  price: number,
  buyerType: BuyerType,
  propertyType: PropertyType,
  location: Location
): { bands: BandResult[]; totalTax: number; surcharge: number } {
  const baseBands = getBands(price, buyerType, propertyType, location);
  const hasSurcharge =
    propertyType === "residential" &&
    (buyerType === "additional" || buyerType === "company");

  const bands: BandResult[] = [];
  let totalTax = 0;

  for (const band of baseBands) {
    const lower = band.from;
    const upper = band.to ?? Infinity;

    if (price < lower) break;

    const taxableInBand = Math.min(price, upper) - lower + (lower === 0 ? 0 : 0);
    const taxableAmount = Math.max(0, Math.min(price, upper) - (lower === 0 ? 0 : lower - 1));

    const effectiveRate = hasSurcharge
      ? band.rate + ADDITIONAL_SURCHARGE
      : band.rate;

    const tax = Math.round(taxableAmount * (effectiveRate / 100));

    bands.push({
      from: band.from,
      to: band.to,
      rate: effectiveRate,
      tax,
    });

    totalTax += tax;
  }

  // Calculate the surcharge portion separately for display
  let surcharge = 0;
  if (hasSurcharge) {
    for (const band of baseBands) {
      const upper = band.to ?? Infinity;
      if (price < band.from) break;
      const taxableAmount = Math.max(
        0,
        Math.min(price, upper) - (band.from === 0 ? 0 : band.from - 1)
      );
      surcharge += Math.round(taxableAmount * (ADDITIONAL_SURCHARGE / 100));
    }
  }

  return { bands, totalTax, surcharge };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function StampDutyCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    purchasePrice: "500,000",
    buyerType: "standard",
    propertyType: "residential",
    location: "england",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    const digits = raw.replace(/[^0-9]/g, "");
    const formatted = digits
      ? parseInt(digits, 10).toLocaleString("en-GB")
      : "";
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const price = parseCurrency(inputs.purchasePrice);
    const { bands, totalTax, surcharge } = calculateSdlt(
      price,
      inputs.buyerType,
      inputs.propertyType,
      inputs.location
    );
    const effectiveRate = price > 0 ? (totalTax / price) * 100 : 0;

    return { price, bands, totalTax, surcharge, effectiveRate };
  }, [inputs]);

  const taxLabel =
    inputs.location === "wales" ? "Land Transaction Tax" : "Stamp Duty (SDLT)";

  const hasSurcharge =
    inputs.propertyType === "residential" &&
    (inputs.buyerType === "additional" || inputs.buyerType === "company");

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ━━━ INPUTS ━━━ */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Property Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="sd-price" className="text-sm font-semibold">
                Purchase Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="sd-price"
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
              <Label htmlFor="sd-buyer" className="text-sm font-semibold">
                Buyer Type
              </Label>
              <select
                id="sd-buyer"
                value={inputs.buyerType}
                onChange={(e) =>
                  updateField("buyerType", e.target.value)
                }
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="standard">Home Mover</option>
                <option value="first-time">First-Time Buyer</option>
                <option value="additional">Additional Property (+5%)</option>
                <option value="company">Company Purchase (+5%)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="sd-property" className="text-sm font-semibold">
                Property Type
              </Label>
              <select
                id="sd-property"
                value={inputs.propertyType}
                onChange={(e) =>
                  updateField("propertyType", e.target.value)
                }
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <Label htmlFor="sd-location" className="text-sm font-semibold">
                Location
              </Label>
              <select
                id="sd-location"
                value={inputs.location}
                onChange={(e) =>
                  updateField("location", e.target.value)
                }
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="england">England & Northern Ireland</option>
                <option value="wales">Wales (LTT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* First-time buyer info note */}
        {inputs.buyerType === "first-time" &&
          inputs.propertyType === "residential" &&
          inputs.location === "england" && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
              <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                First-time buyer relief applies to purchases up to{" "}
                {formatGBP(500_000)}. For properties above this threshold,
                standard SDLT rates apply.
              </p>
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
              <Receipt
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">{taxLabel}</h2>
          </div>

          {/* Headline figures */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Tax Payable
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.totalTax)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Effective Rate</span>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>
                {formatPercent(results.effectiveRate)}
              </span>
            </div>

            {hasSurcharge && results.surcharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60">
                  Incl. {ADDITIONAL_SURCHARGE}% Surcharge
                </span>
                <span className="text-white/80">
                  {formatGBP(results.surcharge)}
                </span>
              </div>
            )}

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Band breakdown */}
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Band Breakdown
            </h3>

            <div className="space-y-2">
              {/* Table header */}
              <div className="grid grid-cols-3 gap-2 text-xs text-white/40">
                <span>Band</span>
                <span className="text-center">Rate</span>
                <span className="text-right">Tax</span>
              </div>

              {results.bands.map((band, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-2 text-sm"
                >
                  <span className="text-white/60">
                    {formatGBP(band.from)}
                    {" - "}
                    {band.to ? formatGBP(band.to) : "+"}
                  </span>
                  <span className="text-center text-white/80">
                    {formatPercent(band.rate)}
                  </span>
                  <span className="text-right font-semibold">
                    {formatGBP(band.tax)}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            {/* Summary */}
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Purchase Price</span>
              <span className="font-semibold">
                {formatGBP(results.price)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Cost incl. Tax</span>
              <span className="font-semibold">
                {formatGBP(results.price + results.totalTax)}
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <Disclaimer
          text={`This calculator provides estimates based on current ${
            inputs.location === "wales" ? "LTT" : "SDLT"
          } rates. Actual tax may vary based on individual circumstances. Seek professional tax advice before completing a purchase.`}
        />

        {/* CTA */}
        <DealRoomCta
          params={{
            loan_type: "Bridging Loan",
            total_cost: String(results.price),
            source: "stamp-duty-calculator",
          }}
        />
      </div>
    </div>
  );
}
