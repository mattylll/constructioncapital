"use client";

import { useState, useMemo } from "react";
import { Users } from "lucide-react";

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

interface Inputs {
  purchasePrice: string;
  lettableRooms: string;
  avgRoomRent: string;
  conversionCostPerRoom: string;
  hmoLicenceCost: string;
  managementFeePct: string;
  voidRatePct: string;
}

export function HmoConversionCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    purchasePrice: "280,000",
    lettableRooms: "6",
    avgRoomRent: "650",
    conversionCostPerRoom: "12,000",
    hmoLicenceCost: "1,200",
    managementFeePct: "12",
    voidRatePct: "5",
  });

  function updateCurrencyField(field: keyof Inputs, raw: string) {
    const formatted = formatCurrencyInput(raw);
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  function updateNumericField(field: keyof Inputs, raw: string) {
    const digits = raw.replace(/[^0-9]/g, "");
    setInputs((prev) => ({ ...prev, [field]: digits }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const purchasePrice = parseCurrency(inputs.purchasePrice);
    const rooms = parseInt(inputs.lettableRooms, 10) || 0;
    const roomRent = parseCurrency(inputs.avgRoomRent);
    const costPerRoom = parseCurrency(inputs.conversionCostPerRoom);
    const licenceCost = parseCurrency(inputs.hmoLicenceCost);
    const mgmtPct = parseFloat(inputs.managementFeePct) || 0;
    const voidPct = parseFloat(inputs.voidRatePct) || 0;

    const conversionCost = rooms * costPerRoom;
    const totalInvestment = purchasePrice + conversionCost + licenceCost;

    const grossAnnualRent = rooms * roomRent * 12;
    const managementCost = Math.round(grossAnnualRent * (mgmtPct / 100));
    const voidCost = Math.round(grossAnnualRent * (voidPct / 100));
    const netAnnualRent = grossAnnualRent - managementCost - voidCost;

    const grossYield =
      totalInvestment > 0 ? (grossAnnualRent / totalInvestment) * 100 : 0;
    const netYield =
      totalInvestment > 0 ? (netAnnualRent / totalInvestment) * 100 : 0;
    const monthlyCashFlow = Math.round(netAnnualRent / 12);
    const paybackYears =
      netAnnualRent > 0 ? totalInvestment / netAnnualRent : 0;

    return {
      purchasePrice,
      rooms,
      roomRent,
      conversionCost,
      licenceCost,
      totalInvestment,
      grossAnnualRent,
      managementCost,
      voidCost,
      netAnnualRent,
      grossYield,
      netYield,
      monthlyCashFlow,
      paybackYears,
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
              <Label htmlFor="hmo-purchase" className="text-sm font-semibold">
                Purchase Price
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="hmo-purchase"
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
                <Label htmlFor="hmo-rooms" className="text-sm font-semibold">
                  Lettable Rooms
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="hmo-rooms"
                    value={inputs.lettableRooms}
                    onChange={(e) =>
                      updateNumericField("lettableRooms", e.target.value)
                    }
                    className="h-11"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="hmo-room-rent"
                  className="text-sm font-semibold"
                >
                  Avg Room Rent / Month
                </Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="hmo-room-rent"
                    value={inputs.avgRoomRent}
                    onChange={(e) =>
                      updateCurrencyField("avgRoomRent", e.target.value)
                    }
                    className="h-11 pl-7"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Costs */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">Conversion Costs</h2>

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="hmo-cost-room"
                className="text-sm font-semibold"
              >
                Conversion Cost Per Room
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="hmo-cost-room"
                  value={inputs.conversionCostPerRoom}
                  onChange={(e) =>
                    updateCurrencyField("conversionCostPerRoom", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="hmo-licence"
                className="text-sm font-semibold"
              >
                HMO Licence Cost
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="hmo-licence"
                  value={inputs.hmoLicenceCost}
                  onChange={(e) =>
                    updateCurrencyField("hmoLicenceCost", e.target.value)
                  }
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hmo-mgmt" className="text-sm font-semibold">
                  Management Fee
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="hmo-mgmt"
                    value={inputs.managementFeePct}
                    onChange={(e) =>
                      updateField("managementFeePct", e.target.value)
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
                <Label htmlFor="hmo-void" className="text-sm font-semibold">
                  Void Rate
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="hmo-void"
                    value={inputs.voidRatePct}
                    onChange={(e) =>
                      updateField("voidRatePct", e.target.value)
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
              <Users
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">HMO Investment Appraisal</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Purchase Price</span>
              <span className="font-semibold">
                {formatGBP(results.purchasePrice)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Conversion Cost{" "}
                <span className="text-white/40">
                  ({results.rooms} rooms x {formatGBP(results.conversionCost / (results.rooms || 1))})
                </span>
              </span>
              <span className="font-semibold">
                {formatGBP(results.conversionCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">HMO Licence</span>
              <span className="text-white/80">
                {formatGBP(results.licenceCost)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Investment</span>
              <span className="font-semibold">
                {formatGBP(results.totalInvestment)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Gross Annual Rent</span>
              <span className="font-semibold">
                {formatGBP(results.grossAnnualRent)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Management ({inputs.managementFeePct}%)
              </span>
              <span className="text-white/80">
                -{formatGBP(results.managementCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Voids ({inputs.voidRatePct}%)
              </span>
              <span className="text-white/80">
                -{formatGBP(results.voidCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Net Annual Income</span>
              <span className="font-semibold">
                {formatGBP(results.netAnnualRent)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Gross Yield
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatPercent(results.grossYield)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "var(--gold)" }}>
                Net Yield
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--gold)" }}
              >
                {formatPercent(results.netYield)}
              </span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Monthly Cash Flow</span>
              <span
                className="font-semibold"
                style={{ color: "var(--gold)" }}
              >
                {formatGBP(results.monthlyCashFlow)}/mo
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Payback Period</span>
              <span
                className="font-semibold"
                style={{ color: "var(--gold)" }}
              >
                {results.paybackYears > 0
                  ? `${results.paybackYears.toFixed(1)} years`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Capital Stack */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Investment Breakdown
          </h3>
          <div className="space-y-2">
            {results.totalInvestment > 0 && (
              <>
                <StackBar
                  label="Purchase Price"
                  amount={results.purchasePrice}
                  total={results.totalInvestment}
                  color="oklch(0.35 0.05 255)"
                />
                <StackBar
                  label="Conversion Cost"
                  amount={results.conversionCost}
                  total={results.totalInvestment}
                  color="oklch(0.75 0.12 85)"
                />
                <StackBar
                  label="HMO Licence"
                  amount={results.licenceCost}
                  total={results.totalInvestment}
                  color="oklch(0.65 0.13 85)"
                />
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        <DealRoomCta
          params={{
            loan_type: "Development Finance",
            total_cost: String(results.totalInvestment),
            loan_amount: String(
              Math.round(results.totalInvestment * 0.75)
            ),
            source: "hmo-conversion-calculator",
          }}
        />

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
}
