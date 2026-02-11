import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  MapPin,
  PoundSterling,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { Breadcrumbs } from "@/components/locations/breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { countyNameToSlug, loanTypeToServiceSlug } from "@/lib/location-content";

// Static placeholder case studies — will be replaced with Convex data
const caseStudies = [
  {
    slug: "residential-scheme-manchester",
    title: "12-Unit Residential Scheme",
    location: "Manchester",
    county: "Greater Manchester",
    projectType: "Ground-Up Development",
    gdv: "£3.2M",
    loanAmount: "£2.1M",
    loanType: "Development Finance",
    ltv: "65% LTGDV",
    description:
      "Structured senior debt for a ground-up residential scheme in South Manchester. Planning secured for 12 apartments across two blocks.",
    challenge:
      "The developer had full planning permission for 12 apartments across two blocks in South Manchester but faced difficulties securing funding at competitive rates. Several high-street lenders had declined due to the developer's limited track record with schemes of this scale, despite having successfully completed smaller projects. The tight timeline — with planning permission due to lapse within 18 months — added urgency to the funding requirement.",
    solution:
      "We approached our specialist development finance panel, presenting the scheme's strong fundamentals: excellent location near transport links, competitive build costs from a reputable contractor, and strong comparable evidence supporting the GDV. By structuring the facility with a phased drawdown aligned to build milestones, we secured terms from a specialist lender comfortable with the developer's experience level. The facility included a day-one land drawdown of 60% LTV against the site value.",
    outcome:
      "Funding was secured within 3 weeks of initial enquiry. The developer drew down the full facility over 14 months, completing the scheme on time and within budget. All 12 units were sold off-plan prior to completion, achieving a blended GDV 8% above initial appraisal. The developer has since returned for funding on two further schemes.",
    isFeatured: true,
    publishedAt: "2024-08-15",
  },
  {
    slug: "mixed-use-conversion-birmingham",
    title: "Mixed-Use Conversion",
    location: "Birmingham",
    county: "West Midlands",
    projectType: "Heavy Refurbishment",
    gdv: "£5.8M",
    loanAmount: "£4.2M",
    loanType: "Development + Mezzanine",
    ltv: "85% of Costs",
    description:
      "Combined senior and mezzanine structure for a commercial-to-residential conversion in Birmingham city centre. 24 apartments over ground-floor retail.",
    challenge:
      "An experienced developer identified a former office building in Birmingham's Jewellery Quarter with permitted development rights for conversion to 24 residential units, retaining the ground floor for commercial use. The total project cost of £4.9M required leverage beyond what a single senior lender would provide. The developer had equity of approximately £750K — enough for a 65% LTC senior facility but insufficient to cover the full costs without additional funding.",
    solution:
      "We structured a dual-tranche capital stack: a senior development facility at 65% of costs from a mainstream specialist lender, topped up with a mezzanine facility from a separate provider to bring total leverage to 85% of costs. The mezzanine was structured as a profit-share arrangement, aligning the funder's interests with the developer. Both facilities were co-ordinated with a single monitoring surveyor to minimise friction during the build phase.",
    outcome:
      "The combined facility of £4.2M was drawn down over 16 months. The conversion was completed to a high specification, with the 24 apartments achieving rents 12% above initial projections. The developer retained the asset, refinancing onto a long-term BTL portfolio facility, repaying both the senior and mezzanine lenders in full. Net developer profit after all finance costs exceeded £800K.",
    isFeatured: true,
    publishedAt: "2024-06-20",
  },
  {
    slug: "auction-purchase-london",
    title: "Auction Purchase & Refurb",
    location: "London",
    county: "Greater London",
    projectType: "Bridging + Refurbishment",
    gdv: "£1.8M",
    loanAmount: "£1.1M",
    loanType: "Bridging Loan",
    ltv: "70% LTV",
    description:
      "Rapid bridging finance for an auction purchase in Hackney. Funds drawn within 14 days to meet auction completion deadline, then refinanced into refurbishment facility.",
    challenge:
      "The borrower won a property at auction in Hackney, East London, for £850K — significantly below the estimated market value of £1.1M. However, the property required substantial refurbishment (estimated £350K) before it could be sold or refinanced. The 28-day auction completion deadline meant traditional lender timelines were not feasible. The borrower needed certainty of completion to avoid losing the deposit.",
    solution:
      "We arranged a bridging loan within 14 days, funding 70% of the purchase price on day one. The valuer confirmed the open market value at £1.05M, supporting the LTV at completion. We pre-arranged a refurbishment exit facility with a separate lender, ensuring the borrower had a clear path from acquisition through to the completed, refinanced asset. Both facilities were documented in parallel to minimise dead time between drawdowns.",
    outcome:
      "The auction purchase completed on day 12 — well within the deadline. The refurbishment facility was drawn down 4 weeks later, with works completed in 5 months. The finished property was valued at £1.8M, and the borrower refinanced onto a long-term residential mortgage at 60% LTV. Total profit after all costs and finance charges: approximately £420K.",
    isFeatured: false,
    publishedAt: "2024-04-10",
  },
  {
    slug: "jv-residential-bristol",
    title: "JV Equity Partnership",
    location: "Bristol",
    county: "Bristol",
    projectType: "Equity & Joint Venture",
    gdv: "£8.5M",
    loanAmount: "£6.8M",
    loanType: "Equity JV + Senior Debt",
    ltv: "100% of Costs",
    description:
      "Introduced a family office equity partner to fund 100% of project costs for a 30-unit scheme. Developer contributed land only, retaining 60% of profits.",
    challenge:
      "A developer with an excellent track record owned a prime site in Bristol with full planning for 30 residential units. The GDV was appraised at £8.5M with total development costs of £6.8M. However, the developer's capital was tied up in two existing projects and they had no available equity to contribute beyond the land value. No senior lender would fund 100% of costs without the developer putting in cash equity alongside.",
    solution:
      "We introduced a family office from our equity partner network willing to provide 100% of the development costs as a JV equity investment, with the developer contributing the land (valued at £1.7M) as their equity stake. The structure gave the developer 60% of net profits in exchange for managing the project, with the family office receiving 40% plus a preferred return of 8% per annum. We also sourced a senior debt facility at 55% LTGDV to gear the JV, reducing the family office's cash outlay.",
    outcome:
      "The 30-unit scheme was completed in 22 months. Sales achieved a blended GDV of £9.1M — 7% above the original appraisal. After repaying the senior lender and the family office (including preferred return), the developer's net profit share exceeded £1.2M on a project where they contributed no cash. The family office has since committed to a further two projects with the same developer.",
    isFeatured: true,
    publishedAt: "2024-02-28",
  },
  {
    slug: "hmo-conversion-leeds",
    title: "HMO Conversion Project",
    location: "Leeds",
    county: "West Yorkshire",
    projectType: "Refurbishment",
    gdv: "£950K",
    loanAmount: "£620K",
    loanType: "Refurbishment Finance",
    ltv: "75% LTV",
    description:
      "Refurbishment finance for converting a large Victorian property into a licensed 8-bed HMO near Leeds University. Completed in 5 months.",
    challenge:
      "An investor purchased a large Victorian property near Leeds University for £480K, planning to convert it into a licensed 8-bed HMO. The refurbishment budget was £140K, covering structural works, fire safety compliance, ensuite bathrooms, and a commercial kitchen. Several lenders declined due to the HMO licensing requirements and the complexity of achieving the mandatory Article 4 direction compliance in the local authority area.",
    solution:
      "We identified a specialist HMO lender from our panel who understood the Leeds student market and Article 4 requirements. The facility was structured as a light refurbishment bridge at 75% of purchase price, with the refurbishment costs rolled into the facility and drawn against surveyor-verified stage completions. We also pre-arranged a long-term HMO mortgage for the exit, ensuring the investor had rate certainty from day one.",
    outcome:
      "The refurbishment was completed in 5 months, on budget. The property was valued at £950K on completion as a fully licensed 8-bed HMO, achieving a gross annual rental income of £62K. The investor refinanced onto the pre-arranged HMO mortgage at 75% LTV, releasing their initial equity plus an additional £90K in capital to fund their next project.",
    isFeatured: false,
    publishedAt: "2024-01-15",
  },
  {
    slug: "commercial-acquisition-edinburgh",
    title: "Office Block Acquisition",
    location: "Edinburgh",
    county: "Edinburgh",
    projectType: "Commercial Mortgage",
    gdv: "£4.2M",
    loanAmount: "£2.9M",
    loanType: "Commercial Mortgage",
    ltv: "70% LTV",
    description:
      "Long-term commercial mortgage for acquiring a multi-tenanted office building in Edinburgh's financial district. 15-year fixed rate secured.",
    challenge:
      "A property company sought to acquire a multi-tenanted office building in Edinburgh's financial district for £4.2M. The building had 6 tenants on various lease lengths (2–8 years remaining), with a WAULT of 4.3 years. The occupancy rate was 85%, with one floor vacant. High-street banks were cautious due to the mixed lease profile and the vacancy void, offering terms at higher margins than the borrower's target.",
    solution:
      "We approached specialist commercial mortgage lenders who took a more nuanced view of the tenancy schedule. By presenting a detailed income analysis — including the reversionary potential of the vacant floor and strong comparable evidence for office rents in the area — we secured a 15-year fixed-rate facility at 70% LTV. The lender allowed the vacant floor to be excluded from the income covenant calculation for the first 12 months, giving the borrower time to let the space.",
    outcome:
      "The acquisition completed within 6 weeks. The borrower let the vacant floor within 4 months of completion at a rent 15% above the assumed ERV, bringing the building to full occupancy. The 15-year fixed rate of 5.2% gave the borrower long-term certainty, and the asset's net yield post-finance exceeded 7.8%. The borrower is now exploring further acquisitions in the Edinburgh market.",
    isFeatured: false,
    publishedAt: "2023-11-20",
  },
];

function getCaseStudy(slug: string) {
  return caseStudies.find((cs) => cs.slug === slug) ?? null;
}

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return { title: "Case Study Not Found" };

  return {
    title: `${cs.title} — ${cs.location} | ${SITE_NAME}`,
    description: cs.description,
    openGraph: {
      title: `${cs.title} — ${cs.location}`,
      description: cs.description,
      url: `${SITE_URL}/case-studies/${cs.slug}`,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const relatedStudies = caseStudies
    .filter((s) => s.slug !== cs.slug)
    .slice(0, 3);

  const countySlug = countyNameToSlug(cs.county);
  const locationSlug = cs.location.toLowerCase().replace(/\s+/g, "-");
  const serviceSlug = loanTypeToServiceSlug(cs.loanType);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Case Studies", href: "/case-studies" },
    { label: cs.title },
  ];

  return (
    <>
      {/* JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: cs.title,
          description: cs.description,
          datePublished: cs.publishedAt,
          author: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbItems.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: item.href
              ? `${SITE_URL}${item.href}`
              : `${SITE_URL}/case-studies/${cs.slug}`,
          })),
        }}
      />

      {/* ━━━ HERO ━━━ */}
      <section
        className="noise-overlay relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.05 255) 0%, oklch(0.20 0.06 255) 40%, oklch(0.16 0.05 258) 100%)",
        }}
      >
        {/* Grid pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="csd-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#csd-grid)" />
          </svg>
        </div>

        {/* Diagonal gold beam */}
        <div
          className="pointer-events-none absolute -right-20 top-0 h-[150%] w-px origin-top-right rotate-[20deg]"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--gold), transparent)",
            opacity: 0.1,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl">
            {/* Breadcrumbs */}
            <div className="mb-8 [&_a]:text-white/50 [&_a]:hover:text-white/80 [&_span[aria-current]]:text-white [&_span]:text-white/40 [&_svg]:text-white/30">
              <Breadcrumbs items={breadcrumbItems} />
            </div>

            {/* Tags */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "oklch(0.75 0.12 85 / 0.12)",
                  color: "var(--gold)",
                  border: "1px solid oklch(0.75 0.12 85 / 0.15)",
                }}
              >
                <Building2 className="h-3 w-3" />
                {cs.projectType}
              </span>
              <Link
                href={`/locations/${countySlug}`}
                className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
              >
                <MapPin className="h-3.5 w-3.5" />
                {cs.location}, {cs.county}
              </Link>
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {cs.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
              {cs.description}
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
            opacity: 0.3,
          }}
        />
      </section>

      {/* ━━━ DEAL METRICS BAR ━━━ */}
      <section
        className="border-b"
        style={{
          background: "oklch(0.97 0.005 255)",
          borderColor: "oklch(0.90 0.02 255 / 0.3)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              {
                label: "Gross Development Value",
                value: cs.gdv,
                icon: TrendingUp,
              },
              {
                label: "Loan Amount",
                value: cs.loanAmount,
                icon: PoundSterling,
              },
              { label: "Product", value: cs.loanType, icon: Building2 },
              { label: "Leverage", value: cs.ltv, icon: Target },
            ].map((metric) => (
              <div key={metric.label} className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: "oklch(0.75 0.12 85 / 0.08)",
                    border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                  }}
                >
                  <metric.icon
                    className="h-4.5 w-4.5"
                    style={{ color: "var(--gold-dark)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "var(--gold-dark)" }}
                  >
                    {metric.label}
                  </p>
                  <p className="mt-0.5 text-base font-bold text-foreground">
                    {metric.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CONTENT ━━━ */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Challenge */}
            <div className="mb-16">
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.20 0.06 255), oklch(0.28 0.07 255))",
                  }}
                >
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  The Challenge
                </h2>
              </div>
              <div
                className="rounded-2xl p-8"
                style={{
                  background: "oklch(0.25 0.06 255 / 0.03)",
                  border: "1px solid oklch(0.25 0.06 255 / 0.06)",
                }}
              >
                <p className="text-base leading-[1.85] text-muted-foreground">
                  {cs.challenge}
                </p>
              </div>
            </div>

            {/* Solution */}
            <div className="mb-16">
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--gold-dark), var(--gold))",
                  }}
                >
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Our Solution
                </h2>
              </div>
              <div
                className="rounded-2xl p-8"
                style={{
                  background: "oklch(0.75 0.12 85 / 0.04)",
                  border: "1px solid oklch(0.75 0.12 85 / 0.08)",
                }}
              >
                <p className="text-base leading-[1.85] text-muted-foreground">
                  {cs.solution}
                </p>
              </div>
            </div>

            {/* Outcome */}
            <div className="mb-16">
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.45 0.15 150), oklch(0.55 0.18 150))",
                  }}
                >
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  The Outcome
                </h2>
              </div>
              <div
                className="rounded-2xl p-8"
                style={{
                  background: "oklch(0.45 0.15 150 / 0.04)",
                  border: "1px solid oklch(0.45 0.15 150 / 0.08)",
                }}
              >
                <p className="text-base leading-[1.85] text-muted-foreground">
                  {cs.outcome}
                </p>
              </div>
            </div>

            {/* Cross-links to location & service pages */}
            <div
              className="rounded-2xl p-8"
              style={{
                background: "oklch(0.75 0.12 85 / 0.04)",
                border: "1px solid oklch(0.75 0.12 85 / 0.08)",
              }}
            >
              <p
                className="mb-4 text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--gold-dark)" }}
              >
                Explore More
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/locations/${countySlug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  style={{ borderColor: "oklch(0.75 0.12 85 / 0.2)" }}
                >
                  <MapPin className="h-3.5 w-3.5" style={{ color: "var(--gold-dark)" }} />
                  Development finance in {cs.county}
                </Link>
                {serviceSlug && (
                  <Link
                    href={`/locations/${countySlug}/${locationSlug}/${serviceSlug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    style={{ borderColor: "oklch(0.75 0.12 85 / 0.2)" }}
                  >
                    <Building2 className="h-3.5 w-3.5" style={{ color: "var(--gold-dark)" }} />
                    {cs.loanType} in {cs.location}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ RELATED CASE STUDIES ━━━ */}
      <section
        className="border-t py-20 sm:py-28"
        style={{ borderColor: "oklch(0 0 0 / 0.06)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: "var(--gold-dark)" }}
            >
              More Deals
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Related Case Studies
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {relatedStudies.map((related) => (
              <Link
                key={related.slug}
                href={`/case-studies/${related.slug}`}
                className="glass-card group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Top accent */}
                <div
                  className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 10%, var(--gold) 50%, transparent 90%)",
                  }}
                />

                <div className="p-7">
                  <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {related.location}
                  </div>

                  <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground">
                    {related.title}
                  </h3>

                  <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {related.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div>
                        <p
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: "var(--gold-dark)" }}
                        >
                          GDV
                        </p>
                        <p className="text-sm font-bold">{related.gdv}</p>
                      </div>
                      <div>
                        <p
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: "var(--gold-dark)" }}
                        >
                          Loan
                        </p>
                        <p className="text-sm font-bold">
                          {related.loanAmount}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold-dark"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8"
            >
              <Link href="/case-studies">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Case Studies
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.70 0.14 80) 0%, oklch(0.78 0.12 88) 50%, oklch(0.72 0.13 82) 100%)",
          }}
        />
        <div className="noise-overlay absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--navy-dark)" }}
          >
            Your Deal Could Be Next
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-lg"
            style={{ color: "var(--navy)", opacity: 0.6 }}
          >
            Submit your project details and we&rsquo;ll find the best terms from
            our panel of 100+ lenders. No obligation, no upfront fees.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-navy text-white hover:bg-navy-dark h-14 px-12 text-base font-bold shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <Link href="/deal-room">
                Enter the Deal Room
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
