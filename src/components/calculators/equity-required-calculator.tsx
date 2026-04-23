"use client";

import { useState, useMemo } from "react";
import { Wallet } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  parseCurrency,
  formatGBP,
  formatPercent,
  formatCurrencyInput,
 StackBar , DealRoomCta , Disclaimer } from "@/components/calculators/shared";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Inputs {
  totalCost: string;
  gdv: string;
  seniorLTV: string;
  useMezz: boolean;
  mezzStretch: string;
  seniorRate: string;
  mezzRate: string;
  termMonths: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function EquityRequiredCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    totalCost: "2,000,000",
    gdv: "3,200,000",
    seniorLTV: "65",
    useMezz: false,
    mezzStretch: "85",
    seniorRate: "7",
    mezzRate: "14",
    termMonths: "18",
  });

  function updateCurrency(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string | boolean) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const totalCost = parseCurrency(inputs.totalCost);
    const gdv = parseCurrency(inputs.gdv);
    const seniorLTV = parseFloat(inputs.seniorLTV) || 0;
    const mezzLTV = parseFloat(inputs.mezzStretch) || 0;
    const seniorRateVal = parseFloat(inputs.seniorRate) || 0;
    const mezzRateVal = parseFloat(inputs.mezzRate) || 0;
    const term = parseInt(inputs.termMonths, 10) || 0;

    const seniorDebt = Math.round(gdv * seniorLTV / 100);
    const mezzAmount = inputs.useMezz
      ? Math.max(0, Math.round(gdv * mezzLTV / 100) - seniorDebt)
      : 0;

    const equityWithMezz = Math.max(0, totalCost - seniorDebt - mezzAmount);
    const equityWithoutMezz = Math.max(0, totalCost - seniorDebt);
    const equitySaved = equityWithoutMezz - equityWithMezz;

    const seniorInterest = Math.round(seniorDebt * (seniorRateVal / 100) * (term / 12));
    const mezzInterest = Math.round(mezzAmount * (mezzRateVal / 100) * (term / 12));
    const totalFinanceCost = seniorInterest + mezzInterest;

    const equityPctWithMezz = totalCost > 0 ? (equityWithMezz / totalCost) * 100 : 0;
    const equityPctWithoutMezz = totalCost > 0 ? (equityWithoutMezz / totalCost) * 100 : 0;

    return {
      totalCost,
      gdv,
      seniorDebt,
      mezzAmount,
      equityWithMezz,
      equityWithoutMezz,
      equitySaved,
      seniorInterest,
      mezzInterest,
      totalFinanceCost,
      equityPctWithMezz,
      equityPctWithoutMezz,
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
              <Label htmlFor="eq-cost" className="text-sm font-semibold">
                Total Project Cost
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="eq-cost"
                  value={inputs.totalCost}
                  onChange={(e) => updateCurrency("totalCost", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="eq-gdv" className="text-sm font-semibold">
                Gross Development Value (GDV)
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="eq-gdv"
                  value={inputs.gdv}
                  onChange={(e) => updateCurrency("gdv", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eq-sltv" className="text-sm font-semibold">
                  Senior LTV (% of GDV)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="eq-sltv"
                    value={inputs.seniorLTV}
                    onChange={(e) => updateField("seniorLTV", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="eq-term" className="text-sm font-semibold">
                  Term
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="eq-term"
                    value={inputs.termMonths}
                    onChange={(e) => updateField("termMonths", e.target.value)}
                    className="h-11 pr-12"
                    inputMode="numeric"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    mo
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eq-sr" className="text-sm font-semibold">
                  Senior Rate (p.a.)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="eq-sr"
                    value={inputs.seniorRate}
                    onChange={(e) => updateField("seniorRate", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="eq-mr" className="text-sm font-semibold">
                  Mezz Rate (p.a.)
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="eq-mr"
                    value={inputs.mezzRate}
                    onChange={(e) => updateField("mezzRate", e.target.value)}
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

        {/* Mezzanine toggle */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Mezzanine Finance</h2>
            <button
              type="button"
              role="switch"
              aria-checked={inputs.useMezz}
              onClick={() => updateField("useMezz", !inputs.useMezz)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                inputs.useMezz ? "bg-gold" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 ${
                  inputs.useMezz ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {inputs.useMezz && (
            <div className="mt-6">
              <Label htmlFor="eq-mstretch" className="text-sm font-semibold">
                Mezz Stretch (% of GDV)
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="eq-mstretch"
                  value={inputs.mezzStretch}
                  onChange={(e) => updateField("mezzStretch", e.target.value)}
                  className="h-11 pr-7"
                  inputMode="decimal"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>
          )}
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
              <Wallet
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">Equity Analysis</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Project Cost</span>
              <span className="font-semibold">{formatGBP(results.totalCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">GDV</span>
              <span className="font-semibold">{formatGBP(results.gdv)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Funding Structure
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Senior Debt ({inputs.seniorLTV}% LTGDV)
              </span>
              <span className="font-semibold">{formatGBP(results.seniorDebt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Senior Interest</span>
              <span className="text-white/80">{formatGBP(results.seniorInterest)}</span>
            </div>

            {inputs.useMezz && results.mezzAmount > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">
                    Mezzanine ({inputs.mezzStretch}% stretch)
                  </span>
                  <span className="font-semibold">{formatGBP(results.mezzAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Mezz Interest</span>
                  <span className="text-white/80">{formatGBP(results.mezzInterest)}</span>
                </div>
              </>
            )}

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Finance Cost</span>
              <span className="font-semibold">{formatGBP(results.totalFinanceCost)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Equity Comparison
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">Equity Without Mezz</span>
              <span className="font-semibold">
                {formatGBP(results.equityWithoutMezz)}{" "}
                <span className="text-white/40">
                  ({formatPercent(results.equityPctWithoutMezz)})
                </span>
              </span>
            </div>

            {inputs.useMezz && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Equity With Mezz</span>
                <span className="font-semibold">
                  {formatGBP(results.equityWithMezz)}{" "}
                  <span className="text-white/40">
                    ({formatPercent(results.equityPctWithMezz)})
                  </span>
                </span>
              </div>
            )}

            {inputs.useMezz && results.equitySaved > 0 && (
              <>
                <div
                  className="my-4 h-px"
                  style={{ background: "oklch(1 0 0 / 0.1)" }}
                />
                <div className="flex justify-between">
                  <span className="font-bold" style={{ color: "var(--gold)" }}>
                    Equity Saved
                  </span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: "var(--gold)" }}
                  >
                    {formatGBP(results.equitySaved)}
                  </span>
                </div>
              </>
            )}
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
                  label="Senior Debt"
                  amount={results.seniorDebt}
                  total={results.totalCost}
                  color="oklch(0.75 0.12 85)"
                />
                {inputs.useMezz && results.mezzAmount > 0 && (
                  <StackBar
                    label="Mezzanine"
                    amount={results.mezzAmount}
                    total={results.totalCost}
                    color="oklch(0.65 0.13 85)"
                  />
                )}
                <StackBar
                  label={inputs.useMezz ? "Equity (with Mezz)" : "Equity"}
                  amount={inputs.useMezz ? results.equityWithMezz : results.equityWithoutMezz}
                  total={results.totalCost}
                  color="oklch(0.35 0.05 255)"
                />
              </>
            )}
          </div>
        </div>

        <DealRoomCta
          params={{
            loan_type: "Mezzanine Finance",
            gdv: String(results.gdv),
            total_cost: String(results.totalCost),
            loan_amount: String(results.seniorDebt + results.mezzAmount),
            source: "equity-required-calculator",
          }}
        />

        <Disclaimer />
      </div>
    </div>
  );
}
