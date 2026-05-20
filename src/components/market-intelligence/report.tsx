import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  PoundSterling,
  Landmark,
  Layers,
  ScrollText,
} from "lucide-react";

import {
  CTAButton,
  EditorialSection,
  PageHero,
  ProseSection,
  PullQuote,
  SectionHeader,
  StatStrip,
} from "@/components/editorial/primitives";
import type { MarketIntelligenceReport } from "@/lib/market-intelligence-data";

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});
const fmtCount = (n: number) => new Intl.NumberFormat("en-GB").format(n);
const fmtGdv = (n: number) =>
  n >= 1_000_000 ? `£${(n / 1_000_000).toFixed(1)}m` : GBP.format(n);
const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export function MarketIntelligenceReportView({ report }: { report: MarketIntelligenceReport }) {
  const { editorial, location, planning, sold, stats } = report;
  const locationPagePath = `/locations/${location.countySlug}/${location.townSlug}`;
  const devFinancePagePath = `${locationPagePath}/development-finance`;
  const bridgingPagePath = `${locationPagePath}/bridging-finance`;

  const median = stats?.marketSnapshot?.medianPrice ?? sold?.stats?.medianPrice ?? 0;
  const txns = stats?.marketSnapshot?.transactionCount12m ?? sold?.stats?.transactionCount12m ?? 0;
  const yoy = stats?.marketSnapshot?.yoyPriceChange ?? sold?.stats?.yoyChange ?? null;
  const pipelinePending = planning?.summary?.pending ?? 0;
  const pipelineUnits = planning?.summary?.pendingUnits ?? 0;
  const pipelineGdv = planning?.summary?.pendingGdv ?? 0;

  const topPending = (planning?.pendingApplications ?? [])
    .filter((a) => a.estimatedGdv !== null || a.units !== null)
    .sort((a, b) => (b.estimatedGdv ?? 0) - (a.estimatedGdv ?? 0))
    .slice(0, 6);

  const recentSales = (sold?.recentTransactions ?? []).slice(0, 8);

  const heroStats: { label: string; value: string }[] = [
    {
      label: "Median sale price",
      value: median > 0
        ? `${GBP.format(median)}${yoy !== null ? `  (${yoy > 0 ? "+" : ""}${yoy}% YoY)` : ""}`
        : "—",
    },
    {
      label: "Pending dev applications",
      value: pipelinePending > 0
        ? `${fmtCount(pipelinePending)}${pipelineGdv > 0 ? `  ·  ${fmtGdv(pipelineGdv)} GDV` : ""}`
        : "Pipeline data updating",
    },
    {
      label: "Pipeline units",
      value: pipelineUnits > 0 ? fmtCount(pipelineUnits) : "—",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={`${location.county} · ${editorial.reportPeriod}`}
        title={editorial.headline}
        deck={editorial.subhead}
        tone="navy"
        breadcrumbs={[
          { label: "Market Intelligence", href: "/market-intelligence" },
          { label: location.region.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) },
          { label: location.name },
        ]}
        stats={heroStats}
      />

      {/* Lead + commentary */}
      <EditorialSection tone="paper">
        <div className="mx-auto max-w-3xl">
          <p className="font-heading mb-12 text-2xl leading-relaxed text-navy-dark sm:text-3xl">
            {editorial.lead}
          </p>
        </div>
        <ProseSection title="What's driving the market">
          {editorial.marketCommentary}
        </ProseSection>
      </EditorialSection>

      {/* Planning pipeline */}
      <EditorialSection tone="stone">
        <SectionHeader
          eyebrow="Development pipeline"
          title={`Live planning activity in ${location.name}`}
          align="asymmetric"
        />

        <div className="mt-12">
          <ProseSection>{editorial.pipelineCommentary}</ProseSection>
        </div>

        {topPending.length > 0 && (
          <div className="mt-16">
            <h3 className="font-heading mb-8 text-2xl text-navy-dark">
              Notable pending applications
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {topPending.map((app) => (
                <article
                  key={app.reference}
                  className="rounded-lg border border-stone-200 bg-white p-5 transition-colors hover:border-[color:var(--gold)]"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{app.reference}</span>
                    </div>
                    {app.units && (
                      <span className="rounded bg-[color:var(--navy)]/10 px-2 py-0.5 text-xs font-medium text-navy-dark">
                        {app.units} {app.units === 1 ? "unit" : "units"}
                      </span>
                    )}
                  </div>
                  <p className="mb-3 line-clamp-3 text-sm leading-snug text-navy-dark">
                    {app.proposal}
                  </p>
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span className="truncate">{app.address?.slice(0, 60)}</span>
                    {app.estimatedGdv && (
                      <span className="font-medium text-navy-dark">
                        Est. {fmtGdv(app.estimatedGdv)}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-6 text-xs text-stone-500">
              Source: {planning?.localAuthority ?? "Local planning authority"} portal. GDV
              estimates use local sales medians by property type.
            </p>
          </div>
        )}
      </EditorialSection>

      {/* Sold data */}
      <EditorialSection tone="paper">
        <SectionHeader
          eyebrow="Sales activity"
          title={`Recent ${location.name} sold prices`}
          align="asymmetric"
        />

        <div className="mt-12">
          <ProseSection>{editorial.soldDataCommentary}</ProseSection>
        </div>

        {recentSales.length > 0 && (
          <div className="mt-16 overflow-hidden rounded-lg border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Address</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentSales.map((t, i) => (
                  <tr key={i} className="hover:bg-stone-50/50">
                    <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-4 py-3 text-navy-dark">{t.address || "—"}</td>
                    <td className="px-4 py-3 capitalize text-stone-600">
                      {t.propertyType || "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-navy-dark">
                      {GBP.format(t.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="bg-stone-50 p-4 text-xs text-stone-500">
              Source: HM Land Registry Price Paid Data. Updated{" "}
              {sold?.updatedAt ? formatDate(sold.updatedAt) : "monthly"}.
            </p>
          </div>
        )}
      </EditorialSection>

      {/* Pull quote (optional) */}
      {editorial.pullQuote && (
        <EditorialSection tone="navy">
          <div className="mx-auto max-w-3xl">
            <PullQuote tone="navy">{editorial.pullQuote}</PullQuote>
          </div>
        </EditorialSection>
      )}

      {/* Developer implications */}
      <EditorialSection tone="paper">
        <SectionHeader
          eyebrow="For developers"
          title={`What this means for ${location.name} schemes`}
          align="asymmetric"
        />

        <div className="mt-12">
          <ProseSection>{editorial.developerImplications}</ProseSection>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href={devFinancePagePath}
            className="group block rounded-lg border border-stone-200 bg-stone-50 p-6 transition-colors hover:border-[color:var(--gold)]"
          >
            <Layers className="mb-3 h-5 w-5 text-[color:var(--gold-dark)]" />
            <h3 className="font-heading mb-2 text-lg text-navy-dark">
              {location.name} development finance
            </h3>
            <p className="mb-4 text-sm text-stone-600">
              Term sheets for ground-up schemes — 65-70% LTGDV typical for {location.name}.
            </p>
            <span className="inline-flex items-center text-sm font-medium text-navy-dark transition-colors group-hover:text-[color:var(--gold-dark)]">
              View terms <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
          <Link
            href={bridgingPagePath}
            className="group block rounded-lg border border-stone-200 bg-stone-50 p-6 transition-colors hover:border-[color:var(--gold)]"
          >
            <PoundSterling className="mb-3 h-5 w-5 text-[color:var(--gold-dark)]" />
            <h3 className="font-heading mb-2 text-lg text-navy-dark">
              {location.name} bridging finance
            </h3>
            <p className="mb-4 text-sm text-stone-600">
              Auction, refurb and pre-planning bridge for {location.name} sites.
            </p>
            <span className="inline-flex items-center text-sm font-medium text-navy-dark transition-colors group-hover:text-[color:var(--gold-dark)]">
              See rates <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
          <Link
            href={locationPagePath}
            className="group block rounded-lg border border-stone-200 bg-stone-50 p-6 transition-colors hover:border-[color:var(--gold)]"
          >
            <Landmark className="mb-3 h-5 w-5 text-[color:var(--gold-dark)]" />
            <h3 className="font-heading mb-2 text-lg text-navy-dark">
              {location.name} market hub
            </h3>
            <p className="mb-4 text-sm text-stone-600">
              Full {location.name} location profile — services, sold data, and contacts.
            </p>
            <span className="inline-flex items-center text-sm font-medium text-navy-dark transition-colors group-hover:text-[color:var(--gold-dark)]">
              Visit hub <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
        </div>
      </EditorialSection>

      {/* Outlook */}
      <EditorialSection tone="stone">
        <SectionHeader
          eyebrow="Outlook"
          title={`The next 12 months in ${location.name}`}
          align="asymmetric"
        />
        <div className="mt-12">
          <ProseSection>{editorial.outlook}</ProseSection>
        </div>
      </EditorialSection>

      {/* CTA */}
      <EditorialSection tone="navy-dark">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading mb-4 text-3xl text-white md:text-4xl">
            Planning a {location.name} scheme?
          </h2>
          <p className="mb-8 text-lg text-white/80">
            We arrange senior debt, mezzanine and equity for development schemes from £500k to
            £50m. No upfront fees, indicative terms in 48 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CTAButton href="/deal-room" variant="gold">
              Submit your scheme
            </CTAButton>
            <CTAButton href={locationPagePath} variant="outline-dark">
              More on {location.name}
            </CTAButton>
          </div>
        </div>
      </EditorialSection>

      {/* Sources */}
      <EditorialSection tone="paper">
        <div className="mx-auto max-w-3xl text-sm text-stone-600">
          <div className="mb-3 flex items-start gap-2">
            <ScrollText className="mt-0.5 h-4 w-4 flex-shrink-0 text-stone-400" />
            <span>
              <strong>Sources:</strong> HM Land Registry Price Paid Data (sold prices);{" "}
              {planning?.localAuthority
                ? `${planning.localAuthority} planning portal`
                : "local planning authorities"}{" "}
              (planning applications). Report generated{" "}
              {formatDate(editorial.generatedAt)} by Construction Capital&apos;s market
              intelligence team.
            </span>
          </div>
          <p className="text-xs leading-relaxed text-stone-500">
            <strong>Methodology:</strong> Pending GDV is estimated by multiplying declared unit
            counts by local sales medians for the corresponding property type. Approval rate is
            the share of decided applications (last 12 months) granted permission. Sold-price
            changes are year-on-year comparisons of the median sale price. Pipeline activity
            refers to residential development applications only — household extensions,
            conditions variations, and other non-development applications are excluded.
            Construction Capital is a trading name of Lenzie Consulting Ltd. (08174104).
          </p>
        </div>
      </EditorialSection>
    </>
  );
}
