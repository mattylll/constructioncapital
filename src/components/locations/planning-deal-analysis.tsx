import Link from "next/link";
import {
  Building2,
  PoundSterling,
  TrendingUp,
  Calculator,
  Layers,
  ArrowRight,
} from "lucide-react";
import type { PlanningApp } from "@/lib/local-market-data";

interface PlanningDealAnalysisProps {
  applications: PlanningApp[];
  townName: string;
  countyName: string;
  countySlug: string;
  townSlug: string;
  currentServiceSlug: string;
  medianPrice?: number;
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

/** Estimate build cost per unit based on scheme category */
function estimateBuildCostPerUnit(category: string, gdvPerUnit: number): number {
  // Conversion/PD rights: lower build cost ratio
  if (category === "prior_approval" || category === "conversion") {
    return Math.round(gdvPerUnit * 0.35);
  }
  // New build: higher build cost
  return Math.round(gdvPerUnit * 0.45);
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

function buildCapitalStack(gdv: number, category: string): CapitalStackItem[] {
  const isConversion = category === "prior_approval" || category === "conversion";

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
  townName,
  countySlug,
  townSlug,
  medianPrice,
  index,
}: {
  app: PlanningApp;
  townName: string;
  countySlug: string;
  townSlug: string;
  medianPrice?: number;
  index: number;
}) {
  const gdv = app.estimatedGdv!;
  const units = app.units!;
  const gdvPerUnit = Math.round(gdv / units);
  const scheme = classifyScheme(app);
  const stack = buildCapitalStack(gdv, app.category);
  const buildCostPerUnit = estimateBuildCostPerUnit(app.category, gdvPerUnit);
  const totalBuildCost = buildCostPerUnit * units;
  const estimatedProfit = gdv - totalBuildCost - Math.round(gdv * 0.08); // 8% finance + fees
  const profitOnGdv = ((estimatedProfit / gdv) * 100).toFixed(1);

  // Pre-fill deal room with this scheme's financials
  const seniorDebt = stack.find((s) => s.label === "Senior Debt");
  const dealRoomParams = new URLSearchParams({
    gdv: String(gdv),
    total_cost: String(totalBuildCost),
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
            <p className="mt-0.5 text-lg font-bold">{formatGBP(gdvPerUnit)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Est. Build Cost
            </p>
            <p className="mt-0.5 text-lg font-bold">{formatGBP(totalBuildCost)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Est. Profit on GDV
            </p>
            <p className="mt-0.5 text-lg font-bold">{profitOnGdv}%</p>
          </div>
        </div>

        {medianPrice && (
          <p className="mb-6 text-sm text-muted-foreground">
            At {formatGBP(gdvPerUnit)} per unit, this scheme prices{" "}
            {gdvPerUnit > medianPrice
              ? `${Math.round(((gdvPerUnit - medianPrice) / medianPrice) * 100)}% above`
              : `${Math.round(((medianPrice - gdvPerUnit) / medianPrice) * 100)}% below`}{" "}
            the {townName} median of {formatGBPFull(medianPrice)}.{" "}
            <Link
              href={`/calculators/gdv-calculator`}
              className="font-semibold text-gold-dark hover:underline"
            >
              Calculate GDV
            </Link>
          </p>
        )}

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
            href={`/calculators/${calculatorSlug}?gdv=${gdv}&buildCosts=${totalBuildCost}`}
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
}: PlanningDealAnalysisProps) {
  // Select top schemes: must have GDV and units, sorted by GDV descending
  const significantApps = applications
    .filter((a) => a.estimatedGdv && a.units && a.estimatedGdv >= 1_000_000)
    .sort((a, b) => (b.estimatedGdv || 0) - (a.estimatedGdv || 0))
    .slice(0, 3);

  if (significantApps.length === 0) return null;

  const totalPipelineGdv = significantApps.reduce(
    (sum, a) => sum + (a.estimatedGdv || 0),
    0
  );
  const totalPipelineUnits = significantApps.reduce(
    (sum, a) => sum + (a.units || 0),
    0
  );

  return (
    <section className="bg-muted/20 py-16 sm:py-20">
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
          Deal Intelligence
        </p>
        <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Key Schemes in {townName}
        </h2>
        <p className="mb-10 max-w-3xl text-muted-foreground">
          Financial analysis of the largest approved planning applications in{" "}
          {townName}, {countyName}. These {significantApps.length} schemes
          represent {formatGBP(totalPipelineGdv)} in combined GDV across{" "}
          {totalPipelineUnits.toLocaleString("en-GB")} units. Each includes an
          indicative capital stack showing how we would structure the funding.
        </p>

        <div className="space-y-6">
          {significantApps.map((app, i) => (
            <SchemeAnalysisCard
              key={app.reference}
              app={app}
              townName={townName}
              countySlug={countySlug}
              townSlug={townSlug}
              medianPrice={medianPrice}
              index={i}
            />
          ))}
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
    </section>
  );
}
