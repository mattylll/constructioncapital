"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocalGdvCalculatorProps {
  defaultGdv: number;
  defaultLandCost: number;
  townName: string;
}

function parseCurrency(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
}

function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function StackBar({
  label,
  amount,
  pct,
  color,
}: {
  label: string;
  amount: number;
  pct: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-white/70">{label}</span>
        <span className="font-medium text-white">{formatGBP(amount)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function LocalGdvCalculator({
  defaultGdv,
  defaultLandCost,
  townName,
}: LocalGdvCalculatorProps) {
  const [inputs, setInputs] = useState({
    landCost: defaultLandCost.toLocaleString("en-GB"),
    buildCosts: Math.round(defaultGdv * 0.4).toLocaleString("en-GB"),
    gdv: defaultGdv.toLocaleString("en-GB"),
    interestRate: "7.5",
  });

  function updateCurrencyField(field: string, raw: string) {
    const digits = raw.replace(/[^0-9]/g, "");
    const formatted = digits
      ? parseInt(digits, 10).toLocaleString("en-GB")
      : "";
    setInputs((prev) => ({ ...prev, [field]: formatted }));
  }

  const results = useMemo(() => {
    const land = parseCurrency(inputs.landCost);
    const build = parseCurrency(inputs.buildCosts);
    const gdv = parseCurrency(inputs.gdv);
    const rate = parseFloat(inputs.interestRate) || 0;

    const fees = Math.round(build * 0.1);
    const contingency = Math.round(build * 0.1);
    const totalCost = land + build + fees + contingency;
    const seniorDebt = Math.round(gdv * 0.65);
    const equity = Math.max(0, totalCost - seniorDebt);
    const interest = Math.round(seniorDebt * (rate / 100) * 1.5);
    const profit = gdv - totalCost - interest;
    const profitOnCost =
      totalCost + interest > 0
        ? (profit / (totalCost + interest)) * 100
        : 0;

    return {
      totalCost,
      fees,
      contingency,
      seniorDebt,
      equity,
      interest,
      profit,
      profitOnCost,
      gdv,
    };
  }, [inputs]);

  const dealRoomParams = new URLSearchParams({
    loan_type: "Development Finance",
    gdv: String(results.gdv),
    total_cost: String(results.totalCost),
    loan_amount: String(results.seniorDebt),
    town: townName,
    source: "local-gdv-calculator",
  });

  return (
    <section className="bg-muted/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="mb-5 h-[2px] w-14"
          style={{
            background:
              "linear-gradient(90deg, var(--gold), var(--gold-light))",
          }}
        />
        <p
          className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
          style={{ color: "var(--gold-dark)" }}
        >
          {townName} Development Appraisal
        </p>
        <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
          Local GDV Calculator
        </h2>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Inputs */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-1 text-lg font-bold">Scheme Inputs</h3>
            <p className="mb-6 text-xs text-muted-foreground">
              Pre-populated with {townName} median prices. Adjust to match your
              scheme.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="lgdv-land" className="text-sm font-semibold">
                  Land Cost
                </Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="lgdv-land"
                    value={inputs.landCost}
                    onChange={(e) =>
                      updateCurrencyField("landCost", e.target.value)
                    }
                    className="h-11 pl-7"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="lgdv-build" className="text-sm font-semibold">
                  Build Costs
                </Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="lgdv-build"
                    value={inputs.buildCosts}
                    onChange={(e) =>
                      updateCurrencyField("buildCosts", e.target.value)
                    }
                    className="h-11 pl-7"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lgdv-gdv" className="text-sm font-semibold">
                    GDV
                  </Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      £
                    </span>
                    <Input
                      id="lgdv-gdv"
                      value={inputs.gdv}
                      onChange={(e) =>
                        updateCurrencyField("gdv", e.target.value)
                      }
                      className="h-11 pl-7"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lgdv-rate" className="text-sm font-semibold">
                    Rate (p.a.)
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="lgdv-rate"
                      value={inputs.interestRate}
                      onChange={(e) =>
                        setInputs((prev) => ({
                          ...prev,
                          interestRate: e.target.value,
                        }))
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

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Assumes 10% professional fees, 10% contingency, 65% LTGDV senior
                debt, 18-month term.{" "}
                <Link
                  href="/calculators/development-finance"
                  className="text-gold-dark hover:text-gold"
                >
                  Full calculator →
                </Link>
              </p>
            </div>
          </div>

          {/* Results */}
          <div
            className="flex flex-col justify-between rounded-xl p-6 text-white"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.06 255), oklch(0.18 0.05 255))",
            }}
          >
            <div>
              <div className="mb-6 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gold" />
                <h3 className="text-lg font-bold">Capital Structure</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/70">Total Cost</span>
                  <span className="font-semibold">
                    {formatGBP(results.totalCost)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/70">
                    Senior Debt (65% LTGDV)
                  </span>
                  <span className="font-semibold">
                    {formatGBP(results.seniorDebt)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/70">Equity Required</span>
                  <span className="font-semibold">
                    {formatGBP(results.equity)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/70">
                    Interest (18m)
                  </span>
                  <span className="font-semibold">
                    {formatGBP(results.interest)}
                  </span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-sm font-medium text-gold">
                    Profit on Cost
                  </span>
                  <span className="text-lg font-bold text-gold">
                    {formatPercent(results.profitOnCost)}
                  </span>
                </div>
              </div>

              {/* Capital stack bars */}
              <div className="mt-6 space-y-3">
                <StackBar
                  label="Senior Debt"
                  amount={results.seniorDebt}
                  pct={
                    results.totalCost > 0
                      ? (results.seniorDebt / results.totalCost) * 100
                      : 0
                  }
                  color="oklch(0.75 0.12 85)"
                />
                <StackBar
                  label="Equity"
                  amount={results.equity}
                  pct={
                    results.totalCost > 0
                      ? (results.equity / results.totalCost) * 100
                      : 0
                  }
                  color="oklch(0.55 0.08 255)"
                />
              </div>
            </div>

            <div className="mt-6">
              <Button
                asChild
                size="lg"
                className="w-full bg-gold text-navy-dark hover:bg-gold-dark"
              >
                <Link href={`/deal-room?${dealRoomParams.toString()}`}>
                  Get Terms for This Scheme
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
