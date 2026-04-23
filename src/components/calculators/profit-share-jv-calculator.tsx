"use client";

import { useState, useMemo } from "react";
import { Handshake } from "lucide-react";

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
  devEquity: string;
  jvEquity: string;
  devProfitShare: string;
  mgmtFee: string;
  financeCosts: string;
  duration: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ProfitShareJvCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    totalCost: "2,500,000",
    gdv: "3,800,000",
    devEquity: "200,000",
    jvEquity: "600,000",
    devProfitShare: "50",
    mgmtFee: "50,000",
    financeCosts: "250,000",
    duration: "18",
  });

  function updateCurrency(field: keyof Inputs, raw: string) {
    setInputs((prev) => ({ ...prev, [field]: formatCurrencyInput(raw) }));
  }

  function updateField(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const results = useMemo(() => {
    const totalCost = parseCurrency(inputs.totalCost);
    const gdv = parseCurrency(inputs.gdv);
    const devEquity = parseCurrency(inputs.devEquity);
    const jvEquity = parseCurrency(inputs.jvEquity);
    const devPct = parseFloat(inputs.devProfitShare) || 0;
    const mgmtFee = parseCurrency(inputs.mgmtFee);
    const financeCosts = parseCurrency(inputs.financeCosts);
    const duration = parseInt(inputs.duration, 10) || 0;

    const totalProfit = gdv - totalCost - financeCosts;
    const profitAfterMgmtFee = totalProfit - mgmtFee;
    const devShare = Math.round(profitAfterMgmtFee * devPct / 100) + mgmtFee;
    const jvShare = Math.round(profitAfterMgmtFee * (100 - devPct) / 100);

    const devROE = devEquity > 0 ? (devShare / devEquity) * 100 : 0;
    const jvROE = jvEquity > 0 ? (jvShare / jvEquity) * 100 : 0;
    const durationYears = duration / 12;
    const devAnnualisedROE = durationYears > 0 ? devROE / durationYears : 0;
    const jvAnnualisedROE = durationYears > 0 ? jvROE / durationYears : 0;

    const totalEquity = devEquity + jvEquity;
    const devEquityPct = totalEquity > 0 ? (devEquity / totalEquity) * 100 : 0;
    const jvEquityPct = totalEquity > 0 ? (jvEquity / totalEquity) * 100 : 0;

    return {
      totalCost,
      gdv,
      totalProfit,
      devShare,
      jvShare,
      devROE,
      jvROE,
      devAnnualisedROE,
      jvAnnualisedROE,
      devEquity,
      jvEquity,
      devEquityPct,
      jvEquityPct,
      mgmtFee,
      financeCosts,
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
              <Label htmlFor="jv-cost" className="text-sm font-semibold">
                Total Project Cost
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="jv-cost"
                  value={inputs.totalCost}
                  onChange={(e) => updateCurrency("totalCost", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="jv-gdv" className="text-sm font-semibold">
                Gross Development Value (GDV)
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="jv-gdv"
                  value={inputs.gdv}
                  onChange={(e) => updateCurrency("gdv", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="jv-fc" className="text-sm font-semibold">
                Finance Costs
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  £
                </span>
                <Input
                  id="jv-fc"
                  value={inputs.financeCosts}
                  onChange={(e) => updateCurrency("financeCosts", e.target.value)}
                  className="h-11 pl-7"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="jv-dur" className="text-sm font-semibold">
                Duration
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="jv-dur"
                  value={inputs.duration}
                  onChange={(e) => updateField("duration", e.target.value)}
                  className="h-11 pr-12"
                  inputMode="numeric"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  mo
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-bold">JV Structure</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jv-dev-eq" className="text-sm font-semibold">
                  Developer Equity
                </Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="jv-dev-eq"
                    value={inputs.devEquity}
                    onChange={(e) => updateCurrency("devEquity", e.target.value)}
                    className="h-11 pl-7"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="jv-jv-eq" className="text-sm font-semibold">
                  JV Partner Equity
                </Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="jv-jv-eq"
                    value={inputs.jvEquity}
                    onChange={(e) => updateCurrency("jvEquity", e.target.value)}
                    className="h-11 pl-7"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jv-ps" className="text-sm font-semibold">
                  Developer Profit Share
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="jv-ps"
                    value={inputs.devProfitShare}
                    onChange={(e) => updateField("devProfitShare", e.target.value)}
                    className="h-11 pr-7"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="jv-mf" className="text-sm font-semibold">
                  Management Fee
                </Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="jv-mf"
                    value={inputs.mgmtFee}
                    onChange={(e) => updateCurrency("mgmtFee", e.target.value)}
                    className="h-11 pl-7"
                    inputMode="numeric"
                  />
                </div>
              </div>
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
              <Handshake
                className="h-5 w-5"
                style={{ color: "var(--gold)" }}
              />
            </div>
            <h2 className="text-lg font-bold">JV Profit Split</h2>
          </div>

          {/* Headline */}
          <div className="mb-2 text-sm text-white/60">Total Project Profit</div>
          <div
            className="mb-6 text-3xl font-bold tracking-tight"
            style={{ color: "var(--gold)" }}
          >
            {formatGBP(results.totalProfit)}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Finance Costs</span>
              <span className="text-white/80">{formatGBP(results.financeCosts)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Management Fee</span>
              <span className="text-white/80">{formatGBP(results.mgmtFee)}</span>
            </div>

            <div
              className="my-4 h-px"
              style={{ background: "oklch(1 0 0 / 0.1)" }}
            />

            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--gold)" }}
            >
              Developer
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Profit Share ({inputs.devProfitShare}% + mgmt fee)
              </span>
              <span className="font-semibold">{formatGBP(results.devShare)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Equity ({formatPercent(results.devEquityPct)})
              </span>
              <span className="text-white/80">{formatGBP(results.devEquity)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">ROE</span>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>
                {formatPercent(results.devROE)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Annualised ROE</span>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>
                {formatPercent(results.devAnnualisedROE)}
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
              JV Partner
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Profit Share ({100 - (parseFloat(inputs.devProfitShare) || 0)}%)
              </span>
              <span className="font-semibold">{formatGBP(results.jvShare)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Equity ({formatPercent(results.jvEquityPct)})
              </span>
              <span className="text-white/80">{formatGBP(results.jvEquity)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">ROE</span>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>
                {formatPercent(results.jvROE)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Annualised ROE</span>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>
                {formatPercent(results.jvAnnualisedROE)}
              </span>
            </div>
          </div>
        </div>

        {/* Profit Split Visual */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Profit Split
          </h3>
          <div className="space-y-2">
            {results.totalProfit > 0 && (
              <>
                <StackBar
                  label="Developer"
                  amount={results.devShare}
                  total={results.totalProfit}
                  color="oklch(0.75 0.12 85)"
                />
                <StackBar
                  label="JV Partner"
                  amount={results.jvShare}
                  total={results.totalProfit}
                  color="oklch(0.35 0.05 255)"
                />
              </>
            )}
          </div>
        </div>

        <DealRoomCta
          params={{
            loan_type: "Joint Venture",
            gdv: String(results.gdv),
            total_cost: String(results.totalCost),
            source: "profit-share-jv-calculator",
          }}
        />

        <Disclaimer />
      </div>
    </div>
  );
}
