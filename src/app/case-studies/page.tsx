import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  MapPin,
  PoundSterling,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real development finance deals we've structured for UK property developers. See how we source funding across the capital stack.",
};

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
    isFeatured: true,
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
    isFeatured: true,
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
    isFeatured: false,
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
    isFeatured: true,
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
    isFeatured: false,
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
    isFeatured: false,
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      {/* ━━━ HERO ━━━ */}
      <section
        className="noise-overlay relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.05 255) 0%, oklch(0.22 0.06 255) 50%, oklch(0.18 0.05 260) 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="cs-grid"
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
            <rect width="100%" height="100%" fill="url(#cs-grid)" />
          </svg>
        </div>

        <div
          className="pointer-events-none absolute -right-20 top-0 h-[150%] w-px origin-top-right rotate-[20deg]"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--gold), transparent)",
            opacity: 0.1,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            <div
              className="animate-fade-in mb-8 h-[2px] w-20"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <p
              className="animate-fade-up mb-5 text-xs font-bold uppercase tracking-[0.3em] sm:text-sm"
              style={{ color: "var(--gold)" }}
            >
              Case Studies
            </p>
            <h1 className="animate-fade-up delay-100 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Real Deals,
              <br />
              Real{" "}
              <span className="gold-gradient-text italic">Results</span>
            </h1>
            <p className="animate-fade-up delay-200 mt-7 max-w-xl text-lg leading-relaxed text-white/60">
              A selection of deals we&rsquo;ve structured across the UK.
              Different locations, different structures, same result —
              competitive terms delivered on time.
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

      {/* ━━━ CASE STUDIES GRID ━━━ */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
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

                {/* Featured badge */}
                {cs.isFeatured && (
                  <div
                    className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: "oklch(0.75 0.12 85 / 0.12)",
                      color: "var(--gold-dark)",
                      border: "1px solid oklch(0.75 0.12 85 / 0.15)",
                    }}
                  >
                    Featured
                  </div>
                )}

                <div className="p-7">
                  {/* Location */}
                  <div className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {cs.location}, {cs.county}
                  </div>

                  <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground">
                    {cs.title}
                  </h3>

                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {cs.description}
                  </p>

                  {/* Deal metrics */}
                  <div
                    className="mb-6 grid grid-cols-2 gap-3 rounded-xl p-4"
                    style={{
                      background: "oklch(0.25 0.06 255 / 0.04)",
                      border: "1px solid oklch(0.25 0.06 255 / 0.06)",
                    }}
                  >
                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--gold-dark)" }}
                      >
                        GDV
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-foreground">
                        {cs.gdv}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--gold-dark)" }}
                      >
                        Loan
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-foreground">
                        {cs.loanAmount}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--gold-dark)" }}
                      >
                        Product
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-foreground">
                        {cs.loanType}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--gold-dark)" }}
                      >
                        LTV
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-foreground">
                        {cs.ltv}
                      </p>
                    </div>
                  </div>

                  {/* Type badge + arrow */}
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: "oklch(0.75 0.12 85 / 0.1)",
                        color: "var(--gold-dark)",
                      }}
                    >
                      {cs.projectType}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold-dark" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="relative overflow-hidden py-24 sm:py-32">
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
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "var(--navy-dark)" }}
          >
            Your Deal Could
            <br />
            Be Next
          </h2>
          <p
            className="mx-auto mt-5 max-w-xl text-lg"
            style={{ color: "var(--navy)", opacity: 0.6 }}
          >
            Submit your project details and we&rsquo;ll show you what terms we
            can achieve. No obligation, no charge for the initial assessment.
          </p>
          <div className="mt-10">
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
