import Link from "next/link";
import {
  PoundSterling,
  TrendingUp,
  Calculator,
  Layers,
  ArrowRight,
} from "lucide-react";
import type { PlanningApp } from "@/lib/local-market-data";
import {
  appraiseScheme,
  detectUnitType,
  type AppraisalResult,
} from "@/lib/development-appraisal";
import {
  EditorialSection,
  SectionHeader,
} from "@/components/editorial/primitives";

interface PlanningDealAnalysisProps {
  applications: PlanningApp[];
  townName: string;
  countyName: string;
  countySlug: string;
  townSlug: string;
  currentServiceSlug: string;
  medianPrice?: number;
  medianByType?: Record<string, number>;
  newBuildPremium?: number | null;
}

function formatGBP(amount: number): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    
return `£${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `£${Math.round(amount / 1_000)}k`;
  }
  
return `£${amount.toLocaleString("en-GB")}`;
}

function formatGBPFull(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}

/** Matches the approved-status heuristics used by PlanningApplicationsTable */
function isApprovedApp(app: PlanningApp): boolean {
  const decision = app.decision.toLowerCase();
  
return (
    app.status === "Approved" ||
    app.status.toUpperCase().includes("APPROV") ||
    decision.includes("approved") ||
    decision.includes("conditional permission") ||
    decision.includes("consent")
  );
}

/** Classify scheme type for narrative */
function classifyScheme(app: PlanningApp): {
  type: string;
  label: string;
  financeProduct: string;
  financeSlug: string;
} {
  const proposal = app.proposal.toLowerCase();
  if (app.category === "prior_approval" || proposal.includes("prior approval")) {
    if (proposal.includes("office")) {
      return {
        type: "office-conversion",
        label: "Office to Residential Conversion",
        financeProduct: "Refurbishment Finance",
        financeSlug: "refurbishment-finance",
      };
    }
    
return {
      type: "pd-conversion",
      label: "Permitted Development Conversion",
      financeProduct: "Refurbishment Finance",
      financeSlug: "refurbishment-finance",
    };
  }
  if (proposal.includes("demolition") && proposal.includes("erection")) {
    return {
      type: "demolish-rebuild",
      label: "Demolition & New Build",
      financeProduct: "Development Finance",
      financeSlug: "development-finance",
    };
  }
  if (app.units && app.units >= 50) {
    return {
      type: "major-residential",
      label: "Major Residential Development",
      financeProduct: "Development Finance",
      financeSlug: "development-finance",
    };
  }
  if (app.units && app.units >= 10) {
    return {
      type: "medium-residential",
      label: "Residential Development",
      financeProduct: "Development Finance",
      financeSlug: "development-finance",
    };
  }
  
return {
    type: "small-residential",
    label: "Small-Scale Development",
    financeProduct: "Development Finance",
    financeSlug: "development-finance",
  };
}

interface CapitalStackItem {
  label: string;
  percentage: number;
  amount: number;
  color: string;
  serviceSlug: string;
}

function buildCapitalStack(gdv: number, isConversion: boolean): CapitalStackItem[] {
  if (isConversion) {
    // Conversions: lighter capital structure
    return [
      {
        label: "Senior Debt",
        percentage: 70,
        amount: Math.round(gdv * 0.70),
        color: "bg-navy",
        serviceSlug: "bridging-loans",
      },
      {
        label: "Mezzanine",
        percentage: 15,
        amount: Math.round(gdv * 0.15),
        color: "bg-gold",
        serviceSlug: "mezzanine-finance",
      },
      {
        label: "Developer Equity",
        percentage: 15,
        amount: Math.round(gdv * 0.15),
        color: "bg-muted-foreground/30",
        serviceSlug: "equity-jv",
      },
    ];
  }

  // Ground-up: standard structure
  return [
    {
      label: "Senior Debt",
      percentage: 60,
      amount: Math.round(gdv * 0.60),
      color: "bg-navy",
      serviceSlug: "development-finance",
    },
    {
      label: "Mezzanine",
      percentage: 20,
      amount: Math.round(gdv * 0.20),
      color: "bg-gold",
      serviceSlug: "mezzanine-finance",
    },
    {
      label: "Developer Equity",
      percentage: 20,
      amount: Math.round(gdv * 0.20),
      color: "bg-muted-foreground/30",
      serviceSlug: "equity-jv",
    },
  ];
}

function SchemeAnalysisCard({
  app,
  appraisal,
  townName,
  countySlug,
  townSlug,
  index,
}: {
  app: PlanningApp;
  appraisal: AppraisalResult;
  townName: string;
  countySlug: string;
  townSlug: string;
  index: number;
}) {
  const gdv = appraisal.gdv;
  const units = app.units!;
  const scheme = classifyScheme(app);
  const stack = buildCapitalStack(gdv, appraisal.isConversion);
  const approved = isApprovedApp(app);

  // Pre-fill deal room with this scheme's appraisal
  const seniorDebt = stack.find((s) => s.label === "Senior Debt");
  const dealRoomParams = new URLSearchParams({
    gdv: String(gdv),
    total_cost: String(appraisal.totalCostsExLand),
    loan_amount: String(seniorDebt?.amount ?? Math.round(gdv * 0.6)),
    loan_type: scheme.financeProduct,
    town: townName,
    source: `planning-${app.reference}`,
  });

  // Determine which calculator is most relevant
  const calculatorSlug =
    scheme.type === "office-conversion"
      ? "office-to-residential"
      : scheme.type === "pd-conversion"
        ? "permitted-development"
        : "development-appraisal";

  const applicantDisplay =
    app.applicantCompany && app.applicantCompany !== app.applicantName
      ? app.applicantCompany
      : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Header */}
      <div
        className="px-6 py-5"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.05 255) 0%, oklch(0.23 0.06 255) 100%)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: "oklch(0.75 0.12 85 / 0.15)",
                color: "var(--gold-light)",
              }}
            >
              {scheme.label}
            </span>{" "}
            <span
              className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={
                approved
                  ? {
                      backgroundColor: "oklch(0.55 0.15 160 / 0.2)",
                      color: "oklch(0.8 0.12 160)",
                    }
                  : {
                      backgroundColor: "oklch(0.7 0.05 255 / 0.15)",
                      color: "oklch(0.85 0.02 255)",
                    }
              }
            >
              {approved ? "Approved" : "Awaiting decision"}
            </span>
            <h4 className="mt-2 text-lg font-bold text-white">
              {app.address.split(",").slice(0, 2).join(",")}
            </h4>
            {applicantDisplay && (
              <p className="mt-1 text-sm text-white/50">
                Applicant: {applicantDisplay}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gold">{formatGBP(gdv)}</p>
            <p className="text-xs text-white/40">Estimated GDV</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key metrics grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Units
            </p>
            <p className="mt-0.5 text-lg font-bold">{units}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              GDV / Unit
            </p>
            <p className="mt-0.5 text-lg font-bold">
              {formatGBP(appraisal.gdvPerUnit)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Build Cost (Range)
            </p>
            <p className="mt-0.5 text-lg font-bold">
              {formatGBP(appraisal.buildCostRange.low)}–
              {formatGBP(appraisal.buildCostRange.high)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Residual Land Value
            </p>
            <p className="mt-0.5 text-lg font-bold">
              {appraisal.marginalViability
                ? "Tight"
                : formatGBP(appraisal.residualLandValue)}
            </p>
          </div>
        </div>

        <p className="mb-6 text-sm text-muted-foreground">
          GDV estimated from the {appraisal.gdvBasis}.{" "}
          {appraisal.marginalViability ? (
            <>
              At benchmark build costs and a {appraisal.targetProfitPct}%
              profit target, viability is tight - land would need to be
              secured well below prevailing values for this scheme to appraise.
            </>
          ) : (
            <>
              At benchmark build costs, the implied residual land value is{" "}
              {formatGBPFull(appraisal.residualLandValue)} (
              {formatGBP(appraisal.residualPerUnit)}/unit) after a{" "}
              {appraisal.targetProfitPct}% developer profit target.
            </>
          )}{" "}
          <Link
            href={`/calculators/gdv-calculator`}
            className="font-semibold text-gold-dark hover:underline"
          >
            Calculate GDV
          </Link>
        </p>

        {/* Indicative appraisal table */}
        <div className="mb-6 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/60 bg-muted/40">
                <td className="px-4 py-2 font-semibold">Gross Development Value</td>
                <td className="px-4 py-2 text-right font-semibold">{formatGBP(gdv)}</td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="px-4 py-2 text-muted-foreground">
                  Construction ({appraisal.totalAreaSqm.toLocaleString("en-GB")} sqm @ £
                  {appraisal.buildCostPerSqm.mid.toLocaleString("en-GB")}/sqm mid)
                </td>
                <td className="px-4 py-2 text-right">−{formatGBP(appraisal.buildCost)}</td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="px-4 py-2 text-muted-foreground">
                  Externals, fees &amp; contingency
                </td>
                <td className="px-4 py-2 text-right">
                  −{formatGBP(appraisal.externals + appraisal.professionalFees + appraisal.contingency)}
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="px-4 py-2 text-muted-foreground">
                  Finance ({appraisal.finance.ltgdvPct}% LTGDV, {appraisal.finance.termMonths}m) &amp; sales costs
                </td>
                <td className="px-4 py-2 text-right">
                  −{formatGBP(appraisal.finance.interest + appraisal.finance.fees + appraisal.salesCosts)}
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="px-4 py-2 text-muted-foreground">
                  Developer profit target ({appraisal.targetProfitPct}% on GDV)
                </td>
                <td className="px-4 py-2 text-right">−{formatGBP(appraisal.targetProfit)}</td>
              </tr>
              <tr className="bg-muted/40">
                <td className="px-4 py-2 font-semibold">Implied residual land value</td>
                <td className="px-4 py-2 text-right font-semibold">
                  {appraisal.marginalViability
                    ? "Marginal"
                    : formatGBP(appraisal.residualLandValue)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Capital stack visualisation */}
        <div className="mb-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Indicative Capital Stack
          </p>
          <div className="mb-3 flex h-4 overflow-hidden rounded-full">
            {stack.map((layer) => (
              <div
                key={layer.label}
                className={`${layer.color} transition-all`}
                style={{ width: `${layer.percentage}%` }}
                title={`${layer.label}: ${layer.percentage}% (${formatGBP(layer.amount)})`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {stack.map((layer) => (
              <Link
                key={layer.label}
                href={`/services/${layer.serviceSlug}`}
                className="flex items-center gap-1.5 text-xs hover:text-gold-dark"
              >
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${layer.color}`}
                />
                <span className="font-medium">{layer.label}</span>
                <span className="text-muted-foreground">
                  {layer.percentage}% ({formatGBP(layer.amount)})
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Finance structuring note */}
        <div
          className="mt-5 rounded-lg p-4"
          style={{
            background: "oklch(0.75 0.12 85 / 0.06)",
            border: "1px solid oklch(0.75 0.12 85 / 0.12)",
          }}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Broker insight:</strong>{" "}
            {units >= 50 ? (
              <>
                A scheme of this scale would typically attract competitive{" "}
                <Link
                  href={`/services/development-finance`}
                  className="font-semibold text-gold-dark hover:underline"
                >
                  senior development finance
                </Link>{" "}
                at 60-65% LTGDV with{" "}
                <Link
                  href={`/services/mezzanine-finance`}
                  className="font-semibold text-gold-dark hover:underline"
                >
                  mezzanine
                </Link>{" "}
                stretching to 85% LTGDV. Phased drawdowns reduce interest costs.
                Consider{" "}
                <Link
                  href={`/services/development-exit-finance`}
                  className="font-semibold text-gold-dark hover:underline"
                >
                  development exit finance
                </Link>{" "}
                to manage sales at your pace.
              </>
            ) : scheme.type.includes("conversion") ? (
              <>
                Conversion schemes under{" "}
                <Link
                  href={`/calculators/permitted-development`}
                  className="font-semibold text-gold-dark hover:underline"
                >
                  Permitted Development
                </Link>{" "}
                rights can complete faster with{" "}
                <Link
                  href={`/services/refurbishment-finance`}
                  className="font-semibold text-gold-dark hover:underline"
                >
                  refurbishment finance
                </Link>{" "}
                at up to 70% LTV.{" "}
                <Link
                  href={`/services/bridging-loans`}
                  className="font-semibold text-gold-dark hover:underline"
                >
                  Bridging loans
                </Link>{" "}
                can secure the acquisition in 7-14 days while the full facility
                is arranged.
              </>
            ) : (
              <>
                For a {units}-unit scheme in {townName}, we would typically
                structure{" "}
                <Link
                  href={`/services/development-finance`}
                  className="font-semibold text-gold-dark hover:underline"
                >
                  senior debt
                </Link>{" "}
                at 60-65% LTGDV with{" "}
                <Link
                  href={`/services/mezzanine-finance`}
                  className="font-semibold text-gold-dark hover:underline"
                >
                  mezzanine
                </Link>{" "}
                available to reduce equity to as little as 10%.{" "}
                <Link
                  href={`/calculators/${calculatorSlug}`}
                  className="font-semibold text-gold-dark hover:underline"
                >
                  Run an appraisal
                </Link>{" "}
                to model your returns.
              </>
            )}
          </p>
        </div>

        {/* Primary CTA - straight to deal room with financials pre-filled */}
        <div className="mt-5">
          <Link
            href={`/deal-room?${dealRoomParams.toString()}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-navy-dark shadow-md transition-all hover:bg-gold-dark hover:scale-[1.02]"
          >
            Get Terms for This Scheme
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Calculator links */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/calculators/${calculatorSlug}?gdv=${gdv}&buildCosts=${appraisal.buildCost}`}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-gold/10 hover:text-gold-dark transition-colors"
          >
            <Calculator className="h-3 w-3" />
            Appraise this deal
          </Link>
          <Link
            href="/calculators/stamp-duty-sdlt"
            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-gold/10 hover:text-gold-dark transition-colors"
          >
            <PoundSterling className="h-3 w-3" />
            SDLT Calculator
          </Link>
          <Link
            href="/calculators/section-106-cil"
            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-gold/10 hover:text-gold-dark transition-colors"
          >
            <Layers className="h-3 w-3" />
            S106 / CIL
          </Link>
          <Link
            href={`/calculators/blended-finance-cost`}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-gold/10 hover:text-gold-dark transition-colors"
          >
            <TrendingUp className="h-3 w-3" />
            Blended Cost
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PlanningDealAnalysis({
  applications,
  townName,
  countyName,
  countySlug,
  townSlug,
  currentServiceSlug,
  medianPrice,
  medianByType,
  newBuildPremium,
}: PlanningDealAnalysisProps) {
  // Dedupe: portals sometimes list the same scheme under multiple references
  const seenRef = new Set<string>();
  const seenScheme = new Set<string>();
  const deduped = applications.filter((a) => {
    if (seenRef.has(a.reference)) return false;
    seenRef.add(a.reference);
    const schemeKey = `${a.address.toLowerCase().trim()}|${a.units ?? ""}`;
    if (a.units && seenScheme.has(schemeKey)) return false;
    seenScheme.add(schemeKey);
    
return true;
  });

  // Select top schemes: must have GDV and units, sorted by GDV descending,
  // and must produce a valid benchmark appraisal
  const significantApps = deduped
    .filter((a) => a.estimatedGdv && a.units && a.estimatedGdv >= 1_000_000)
    .sort((a, b) => (b.estimatedGdv || 0) - (a.estimatedGdv || 0))
    .map((app) => ({
      app,
      appraisal: appraiseScheme({
        units: app.units!,
        unitType: detectUnitType(app.proposal),
        category: app.category,
        proposal: app.proposal,
        countySlug,
        blendedMedian: medianPrice,
        medianByType,
        newBuildPremium,
        storedEstimatedGdv: app.estimatedGdv,
      }),
    }))
    .filter((x): x is { app: PlanningApp; appraisal: AppraisalResult } =>
      Boolean(x.appraisal)
    )
    .slice(0, 3);

  if (significantApps.length === 0) return null;

  const totalPipelineGdv = significantApps.reduce(
    (sum, x) => sum + x.appraisal.gdv,
    0
  );
  const totalPipelineUnits = significantApps.reduce(
    (sum, x) => sum + (x.app.units || 0),
    0
  );
  const anyApproved = significantApps.some((x) => isApprovedApp(x.app));

  return (
    <EditorialSection tone="stone">
      <SectionHeader
        tone="stone"
        eyebrow="Deal intelligence"
        title={
          <>
            Key schemes
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              in {townName}.
            </span>
          </>
        }
        body={
          <>
            Indicative appraisals of the largest residential schemes in the{" "}
            {townName} planning pipeline
            {anyApproved ? "" : " (all currently awaiting decision)"}. These{" "}
            <strong>{significantApps.length}</strong> schemes represent an
            estimated <strong>{formatGBP(totalPipelineGdv)}</strong> in
            combined GDV across{" "}
            <strong>
              {totalPipelineUnits.toLocaleString("en-GB")}
            </strong>{" "}
            units, with indicative capital stacks for each.
          </>
        }
      />
      <div className="mt-16">
        <div className="space-y-6">
          {significantApps.map(({ app, appraisal }, i) => (
            <SchemeAnalysisCard
              key={app.reference}
              app={app}
              appraisal={appraisal}
              townName={townName}
              countySlug={countySlug}
              townSlug={townSlug}
              index={i}
            />
          ))}
        </div>

        {/* Assumptions footnote — one per section, from the first appraisal */}
        <div className="mt-8 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Appraisal assumptions
          </p>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-muted-foreground">
            {significantApps[0].appraisal.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/deal-room"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-navy-dark shadow-lg transition-all hover:bg-gold-dark hover:scale-[1.02]"
          >
            Submit Your Scheme
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/locations/${countySlug}/${townSlug}`}
            className="text-sm font-semibold text-gold-dark hover:underline"
          >
            View full {townName} market data
          </Link>
          <Link
            href={`/market-reports/${countySlug}-property-market`}
            className="text-sm font-semibold text-gold-dark hover:underline"
          >
            {countyName} market report
          </Link>
        </div>
      </div>
    </EditorialSection>
  );
}
