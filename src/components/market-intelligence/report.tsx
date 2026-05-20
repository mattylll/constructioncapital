import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgePoundSterling,
  Building2,
  CalendarClock,
  ChevronRight,
  Landmark,
  Layers,
  MapPin,
  ScrollText,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  CTAButton,
  EditorialSection,
  ProseSection,
  PullQuote,
  SectionHeader,
} from "@/components/editorial/primitives";
import {
  ApprovalRing,
  BigStatCallout,
  MarketComparison,
  NewBuildPremium,
  PipelineCard,
  PipelineTopSchemes,
  PriceTrendChart,
  PropertyTypeBars,
  Sparkline,
} from "@/components/market-intelligence/charts";
import type { MarketIntelligenceReport } from "@/lib/market-intelligence-data";
import { getLocationImage, unsplashUrl } from "@/lib/location-images";
import { getRegionalBenchmark, UK_BENCHMARKS } from "@/lib/uk-market-benchmarks";

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});
const fmtCount = (n: number) => new Intl.NumberFormat("en-GB").format(n);
const fmtCompact = (n: number) =>
  n >= 1_000_000 ? `£${(n / 1_000_000).toFixed(1)}m` : `£${Math.round(n / 1000)}k`;
const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// Derive monthly transaction counts from the most-recent sales we have.
function monthlyVolume(transactions: Array<{ date: string }>): number[] {
  if (!transactions.length) return [];
  const buckets = new Map<string, number>();
  for (const t of transactions) {
    const m = t.date?.slice(0, 7); // YYYY-MM
    if (m) buckets.set(m, (buckets.get(m) || 0) + 1);
  }
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);
}

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
  const approvalRate = planning?.summary?.approvalRate ?? 0;
  const approved12m = planning?.summary?.approved ?? 0;
  const refused = planning?.summary?.refused ?? 0;
  const decided = approved12m + refused;

  const topPending = (planning?.pendingApplications ?? [])
    .filter((a) => a.estimatedGdv !== null || a.units !== null)
    .sort((a, b) => (b.estimatedGdv ?? 0) - (a.estimatedGdv ?? 0))
    .slice(0, 6);

  const topSchemeData = topPending.slice(0, 5).map((a) => ({
    label: a.proposal?.slice(0, 60) || a.reference,
    gdv: a.estimatedGdv ?? 0,
    units: a.units,
  }));

  const recentSales = (sold?.recentTransactions ?? []).slice(0, 8);

  // Build sparkline from monthlyHistory if present (last 18 months for trend feel)
  const monthlyHist = sold?.monthlyHistory ?? [];
  const priceSparkline = monthlyHist.slice(-18).map((p) => p.medianPrice);
  const txnSparkline = monthlyHist.length
    ? monthlyHist.slice(-18).map((p) => p.transactions)
    : monthlyVolume(sold?.recentTransactions ?? []);

  // Use quarterly when we have it (more readable chart), else monthly
  const trendData = sold?.quarterlyHistory?.length
    ? sold.quarterlyHistory.map((q) => ({
        period: q.quarter,
        medianPrice: q.medianPrice,
        transactions: q.transactions,
      }))
    : monthlyHist.map((m) => ({
        period: m.month,
        medianPrice: m.medianPrice,
        transactions: m.transactions,
      }));

  // Hero image
  const heroImage = getLocationImage(location.countySlug, location.townSlug);
  const heroImageUrl = unsplashUrl(heroImage.id, 1920, 75);

  // Comparison panel
  const regional = getRegionalBenchmark(location.region);
  const comparisonItems = [
    { label: location.name, median, yoy, txns, isHighlight: true },
    { label: regional.label, median: regional.median, yoy: regional.yoy },
    { label: "UK average", median: UK_BENCHMARKS.ukMedianPrice, yoy: UK_BENCHMARKS.ukYoyChange },
  ];

  const yoyIcon =
    yoy === null
      ? null
      : yoy > 0
      ? <TrendingUp className="inline h-4 w-4 text-emerald-400" />
      : <TrendingDown className="inline h-4 w-4 text-rose-400" />;

  return (
    <>
      {/* ─── Hero with photographic image ─── */}
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src={heroImageUrl}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--navy-dark)]/70 via-[color:var(--navy-dark)]/60 to-[color:var(--navy-dark)]/95" />
        </div>

        <div className="mx-auto max-w-[1360px] px-6 pb-20 pt-28 sm:px-10 sm:pb-28 sm:pt-32 lg:pb-32 lg:pt-36">
          <ol className="mb-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
            <li>
              <Link href="/" className="transition-colors hover:text-[color:var(--gold)]">
                Home
              </Link>
            </li>
            <li className="text-white/40">/</li>
            <li>
              <Link
                href="/market-intelligence"
                className="transition-colors hover:text-[color:var(--gold)]"
              >
                Market Intelligence
              </Link>
            </li>
            <li className="text-white/40">/</li>
            <li>{location.name}</li>
          </ol>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur">
                <MapPin className="h-3 w-3" />
                <span>
                  {location.county} · {editorial.reportPeriod}
                </span>
              </div>

              <h1 className="font-heading text-[clamp(2.5rem,6vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.02em] text-white">
                {editorial.headline}
              </h1>

              <p className="mt-8 max-w-[46rem] text-[17px] leading-[1.65] text-white/85 sm:text-[18px]">
                {editorial.subhead}
              </p>
            </div>
          </div>

          {/* Hero stats grid */}
          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-4">
            <div className="flex flex-col gap-2 bg-[color:var(--navy-dark)]/40 p-6 backdrop-blur-sm">
              <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
                Median sale price
              </dt>
              <dd className="font-heading text-3xl font-medium text-white sm:text-4xl">
                {median > 0 ? GBP.format(median) : "—"}
              </dd>
              {yoy !== null && (
                <div
                  className={`flex items-center gap-1.5 text-sm ${
                    yoy > 0 ? "text-emerald-300" : yoy < 0 ? "text-rose-300" : "text-white/70"
                  }`}
                >
                  {yoyIcon}
                  <span>
                    {yoy > 0 ? "+" : ""}
                    {yoy}% YoY
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 bg-[color:var(--navy-dark)]/40 p-6 backdrop-blur-sm">
              <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
                Median price trend
              </dt>
              <dd className="font-heading text-3xl font-medium text-white sm:text-4xl">
                {median > 0 ? fmtCompact(median) : "—"}
              </dd>
              {priceSparkline.length >= 2 ? (
                <div className="mt-1">
                  <Sparkline values={priceSparkline} stroke="var(--gold)" width={140} height={32} />
                </div>
              ) : (
                <div className="text-sm text-white/70">
                  {txns > 0 ? `${fmtCount(txns)} sales (12m)` : ""}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 bg-[color:var(--navy-dark)]/40 p-6 backdrop-blur-sm">
              <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
                Pending dev applications
              </dt>
              <dd className="font-heading text-3xl font-medium text-white sm:text-4xl">
                {pipelinePending > 0 ? fmtCount(pipelinePending) : "—"}
              </dd>
              <div className="text-sm text-white/70">
                {pipelineUnits > 0 ? `${fmtCount(pipelineUnits)} units` : "Pipeline data updating"}
              </div>
            </div>

            <div className="flex flex-col gap-2 bg-[color:var(--navy-dark)]/40 p-6 backdrop-blur-sm">
              <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
                Pipeline value (GDV)
              </dt>
              <dd className="font-heading text-3xl font-medium text-white sm:text-4xl">
                {pipelineGdv > 0 ? fmtCompact(pipelineGdv) : "—"}
              </dd>
              <div className="text-sm text-white/70">
                {decided > 0 ? `${approvalRate}% approval rate (12m)` : ""}
              </div>
            </div>
          </dl>
        </div>
      </section>

      {/* ─── Lead + Market Context ─── */}
      <EditorialSection tone="paper">
        <div className="mx-auto max-w-3xl">
          <p className="font-heading mb-14 text-2xl leading-relaxed text-navy-dark sm:text-3xl">
            {editorial.lead}
          </p>
        </div>

        <ProseSection title={`What's driving the ${location.name} market`}>
          {editorial.marketCommentary}
        </ProseSection>

        {pipelineUnits > 0 && (
          <BigStatCallout
            label="Live development pipeline"
            value={fmtCompact(pipelineGdv)}
            context={`${fmtCount(pipelineUnits)} pending residential units across ${pipelinePending} ${location.name} applications. Track these in our weekly refresh of ${planning?.localAuthority ?? "council"} planning data.`}
            tone="gold"
          />
        )}
      </EditorialSection>

      {/* ─── Market data at a glance ─── */}
      <EditorialSection tone="stone">
        <SectionHeader
          eyebrow="Market data at a glance"
          title={`The ${location.name} numbers, visualised`}
          align="asymmetric"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Property type breakdown */}
          <div className="rounded-lg border border-stone-200 bg-white p-8">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
              <BadgePoundSterling className="h-3.5 w-3.5" />
              <span>Median sale price by property type</span>
            </div>
            <h3 className="font-heading mb-6 text-2xl text-navy-dark">
              {fmtCount(txns)} sales clearing across the type-mix
            </h3>
            <PropertyTypeBars data={sold?.stats?.medianByType ?? {}} />
            <p className="mt-6 text-xs text-stone-500">
              Source: HM Land Registry Price Paid, rolling 12 months.
            </p>
          </div>

          {/* New-build vs existing */}
          <div className="flex flex-col gap-6">
            <NewBuildPremium
              newBuildCount={sold?.stats?.newBuildCount ?? 0}
              existingCount={sold?.stats?.existingCount ?? 0}
              premium={sold?.stats?.newBuildPremium ?? null}
              medianNewBuild={sold?.stats?.medianByType?.new_build}
              medianExisting={sold?.stats?.medianByType?.existing}
            />

            {/* Approval ring */}
            {decided > 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-stone-200 bg-white p-6">
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-stone-500">
                  Planning approval rate
                </div>
                <ApprovalRing rate={approvalRate} decided={decided} />
              </div>
            )}
            {decided === 0 && (
              <div className="flex flex-col gap-3 rounded-lg border border-dashed border-stone-300 bg-white/50 p-6">
                <div className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Planning decisions data
                </div>
                <p className="text-sm text-stone-600">
                  Approval-rate breakdown for {location.name} is still indexing. National 12-month
                  average sits at ~83% for major residential schemes.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Price trend chart */}
        {trendData.length >= 2 && (
          <div className="mt-10">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>
                {sold?.quarterlyHistory?.length
                  ? `${location.name} quarterly median price & volume`
                  : `${location.name} monthly median price & volume`}
              </span>
            </div>
            <PriceTrendChart data={trendData} />
            <p className="mt-3 text-xs text-stone-500">
              Source: HM Land Registry Price Paid Data. Median computed across all registered
              transactions per period.
            </p>
          </div>
        )}

        {/* Comparison panel */}
        <div className="mt-10">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
            <Landmark className="h-3.5 w-3.5" />
            <span>How {location.name} compares</span>
          </div>
          <MarketComparison items={comparisonItems} />
        </div>
      </EditorialSection>

      {/* ─── Pipeline analysis ─── */}
      <EditorialSection tone="paper">
        <SectionHeader
          eyebrow="Development pipeline"
          title={`Live planning activity in ${location.name}`}
          align="asymmetric"
        />

        <div className="mt-12">
          <ProseSection>{editorial.pipelineCommentary}</ProseSection>
        </div>

        {topSchemeData.length > 0 && (
          <div className="mt-16">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
              <Building2 className="h-3.5 w-3.5" />
              <span>Top schemes by GDV in the pipeline</span>
            </div>
            <PipelineTopSchemes schemes={topSchemeData} />
          </div>
        )}

        {topPending.length > 0 && (
          <div className="mt-16">
            <h3 className="font-heading mb-6 text-2xl text-navy-dark">
              Notable pending applications
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {topPending.map((app) => (
                <PipelineCard
                  key={app.reference}
                  reference={app.reference}
                  proposal={app.proposal}
                  address={app.address}
                  units={app.units}
                  estimatedGdv={app.estimatedGdv}
                  status={app.status}
                  receivedDate={app.receivedDate}
                  decision={app.decision}
                />
              ))}
            </div>
            <p className="mt-6 text-xs text-stone-500">
              Source: {planning?.localAuthority ?? "Local planning authority"} portal. GDV
              estimates use local sales medians by property type.
            </p>
          </div>
        )}
      </EditorialSection>

      {/* ─── Sold data section ─── */}
      <EditorialSection tone="stone">
        <SectionHeader
          eyebrow="Sales activity"
          title={`Recent ${location.name} sold prices`}
          align="asymmetric"
        />

        <div className="mt-12">
          <ProseSection>{editorial.soldDataCommentary}</ProseSection>
        </div>

        {recentSales.length > 0 && (
          <div className="mt-16 overflow-hidden rounded-lg border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <h3 className="font-heading text-xl text-navy-dark">
                Latest registered sales
              </h3>
              <span className="text-xs uppercase tracking-wider text-stone-500">
                Land Registry · {sold?.updatedAt ? formatDate(sold.updatedAt) : "monthly"}
              </span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-stone-50/60 text-stone-600">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                  <th className="px-5 py-3 text-left font-medium">Address</th>
                  <th className="px-5 py-3 text-left font-medium">Type</th>
                  <th className="px-5 py-3 text-left font-medium">Tenure</th>
                  <th className="px-5 py-3 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentSales.map((t, i) => (
                  <tr key={i} className="hover:bg-stone-50/60">
                    <td className="whitespace-nowrap px-5 py-3 text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <CalendarClock className="h-3 w-3 text-stone-400" />
                        {formatDate(t.date)}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-navy-dark">{t.address || "—"}</td>
                    <td className="px-5 py-3 capitalize text-stone-600">{t.propertyType || "—"}</td>
                    <td className="px-5 py-3 capitalize text-stone-500">
                      {t.tenure || "—"}
                      {t.newBuild && (
                        <span className="ml-2 inline-flex rounded bg-[color:var(--gold)]/15 px-1.5 py-0.5 text-[10px] font-medium uppercase text-[color:var(--gold-dark)]">
                          New build
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right font-heading font-medium text-navy-dark">
                      {GBP.format(t.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </EditorialSection>

      {/* ─── Pull quote ─── */}
      {editorial.pullQuote && (
        <EditorialSection tone="navy">
          <div className="mx-auto max-w-3xl">
            <PullQuote tone="navy">{editorial.pullQuote}</PullQuote>
          </div>
        </EditorialSection>
      )}

      {/* ─── Developer implications ─── */}
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
            className="group relative block overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-6 transition-all hover:border-[color:var(--gold)] hover:shadow-lg"
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[color:var(--gold)]/10 transition-all group-hover:scale-150" />
            <Layers className="relative mb-3 h-5 w-5 text-[color:var(--gold-dark)]" />
            <h3 className="relative font-heading mb-2 text-lg text-navy-dark">
              {location.name} development finance
            </h3>
            <p className="relative mb-4 text-sm text-stone-600">
              Term sheets for ground-up schemes — 65-70% LTGDV typical for {location.name}.
            </p>
            <span className="relative inline-flex items-center text-sm font-medium text-navy-dark transition-colors group-hover:text-[color:var(--gold-dark)]">
              View terms <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href={bridgingPagePath}
            className="group relative block overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-6 transition-all hover:border-[color:var(--gold)] hover:shadow-lg"
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[color:var(--gold)]/10 transition-all group-hover:scale-150" />
            <BadgePoundSterling className="relative mb-3 h-5 w-5 text-[color:var(--gold-dark)]" />
            <h3 className="relative font-heading mb-2 text-lg text-navy-dark">
              {location.name} bridging finance
            </h3>
            <p className="relative mb-4 text-sm text-stone-600">
              Auction, refurb and pre-planning bridge for {location.name} sites.
            </p>
            <span className="relative inline-flex items-center text-sm font-medium text-navy-dark transition-colors group-hover:text-[color:var(--gold-dark)]">
              See rates <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href={locationPagePath}
            className="group relative block overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-6 transition-all hover:border-[color:var(--gold)] hover:shadow-lg"
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[color:var(--gold)]/10 transition-all group-hover:scale-150" />
            <Landmark className="relative mb-3 h-5 w-5 text-[color:var(--gold-dark)]" />
            <h3 className="relative font-heading mb-2 text-lg text-navy-dark">
              {location.name} market hub
            </h3>
            <p className="relative mb-4 text-sm text-stone-600">
              Full {location.name} location profile — services, sold data, and contacts.
            </p>
            <span className="relative inline-flex items-center text-sm font-medium text-navy-dark transition-colors group-hover:text-[color:var(--gold-dark)]">
              Visit hub <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </EditorialSection>

      {/* ─── Map ─── */}
      <EditorialSection tone="paper">
        <div className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
          <MapPin className="h-3.5 w-3.5" />
          <span>Where we fund in {location.name}</span>
        </div>
        <div className="overflow-hidden rounded-lg border border-stone-200">
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${location.name}, ${location.county}, UK`)}&output=embed`}
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${location.name}, ${location.county}`}
          />
        </div>
      </EditorialSection>

      {/* ─── Outlook ─── */}
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

      {/* ─── CTA ─── */}
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

      {/* ─── Sources ─── */}
      <EditorialSection tone="paper">
        <div className="mx-auto max-w-3xl text-sm text-stone-600">
          <div className="mb-3 flex items-start gap-2">
            <ScrollText className="mt-0.5 h-4 w-4 flex-shrink-0 text-stone-400" />
            <span>
              <strong>Sources:</strong> HM Land Registry Price Paid Data (sold prices);{" "}
              {planning?.localAuthority
                ? `${planning.localAuthority} planning portal`
                : "local planning authorities"}{" "}
              (planning applications); ONS House Price Index (regional benchmarks). Report
              generated {formatDate(editorial.generatedAt)} by Construction Capital&apos;s market
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
