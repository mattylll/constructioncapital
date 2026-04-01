import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building2,
  Briefcase,
  CheckCircle2,
  Handshake,
  MapPin,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL, CONTACT, STATS } from "@/lib/constants";
import { SITE_IMAGES, unsplashUrl } from "@/lib/location-images";

export const metadata: Metadata = {
  title: "About Matt Lenzie — Founder & Principal Broker",
  description:
    "Matt Lenzie has arranged over £500M in property development finance across 25+ years. Specialist in development finance, bridging loans, mezzanine finance and equity structuring for UK property developers.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

const specialisms = [
  {
    icon: Building2,
    title: "Residential Development",
    detail: "New-build schemes from 4 to 200+ units, including affordable housing and Section 106 negotiations with planning authorities.",
  },
  {
    icon: TrendingUp,
    title: "Refurbishment & Conversion",
    detail: "Light and heavy refurbishment, HMO conversions, commercial-to-residential (Class MA/PDR), and listed building projects.",
  },
  {
    icon: Briefcase,
    title: "Capital Stack Structuring",
    detail: "Senior debt, stretch senior, mezzanine, preferred equity, and JV equity — structured as single or layered facilities to maximise developer returns.",
  },
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    detail: "Active across all UK regions with particular depth in London, the South East, the Midlands, and the North West. Relationships with regional and national lenders.",
  },
];

const values = [
  {
    icon: Target,
    title: "Deal-First Mentality",
    description:
      "We don't waste time with generic advice. Every conversation starts with your specific deal, and we don't stop until we've found the right capital solution.",
  },
  {
    icon: Handshake,
    title: "Lender Relationships",
    description:
      "25 years building genuine relationships with credit committees, not just submitting applications. Our lenders take our calls because we bring quality deals.",
  },
  {
    icon: Zap,
    title: "Speed & Precision",
    description:
      "Indicative terms within 24 hours. We know which lenders want what, so we don't waste weeks chasing the wrong fit. Precision saves you time and money.",
  },
  {
    icon: Shield,
    title: "Transparent Process",
    description:
      "No hidden fees, no surprises. You know exactly what the costs are upfront. We earn our fee by delivering results, not by obscuring the process.",
  },
];

const milestones = [
  { year: "2000", event: "Founded in London" },
  { year: "2008", event: "Navigated the financial crisis — zero defaults" },
  { year: "2015", event: "£250M in total funds arranged" },
  { year: "2020", event: "Expanded to nationwide coverage" },
  { year: "2024", event: "£500M+ arranged, 100+ lender panel" },
];

export default function AboutPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Matt Lenzie",
    jobTitle: "Founder & Principal Broker",
    url: `${SITE_URL}/about`,
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    knowsAbout: [
      "Development Finance",
      "Bridging Loans",
      "Mezzanine Finance",
      "Property Development",
      "Commercial Mortgages",
      "Capital Stack Structuring",
      "Equity & Joint Ventures",
    ],
    description:
      "Property finance broker with over 25 years of experience arranging more than £500 million of development funding across the UK.",
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: SITE_NAME,
    url: SITE_URL,
    description: `Expert development finance brokerage with ${STATS.yearsExperience} years experience. Access senior debt, mezzanine, bridging loans and equity for property developments across the UK.`,
    founder: {
      "@type": "Person",
      name: "Matt Lenzie",
    },
    foundingDate: "2000",
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressCountry: "GB",
    },
    knowsAbout: [
      "Development Finance",
      "Bridging Loans",
      "Mezzanine Finance",
      "Equity & Joint Ventures",
      "Refurbishment Finance",
      "Commercial Mortgages",
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "About Matt Lenzie" },
    ],
  };

  return (
    <>
      <JsonLd data={personJsonLd} />
      <JsonLd data={orgJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* ━━━ HERO ━━━ */}
      <section
        className="noise-overlay relative overflow-hidden text-white"
      >
        {/* Background photo */}
        <Image
          src={unsplashUrl(SITE_IMAGES["about-hero"].id, 1920, 75)}
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.05 255 / 0.88) 0%, oklch(0.22 0.06 255 / 0.85) 50%, oklch(0.14 0.05 260 / 0.92) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            <div
              className="animate-fade-in mb-8 h-[2px] w-20"
              style={{
                background: "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <p
              className="animate-fade-up mb-5 text-xs font-bold uppercase tracking-[0.3em] sm:text-sm"
              style={{ color: "var(--gold)" }}
            >
              About Us
            </p>
            <h1 className="animate-fade-up delay-100 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Built on Deals,
              <br />
              Not{" "}
              <span className="gold-gradient-text italic">Promises</span>
            </h1>
            <p className="animate-fade-up delay-200 mt-7 max-w-xl text-lg leading-relaxed text-white/60">
              Construction Capital was founded on a simple principle: property
              developers deserve a broker who understands their business, speaks
              their language, and delivers results — not excuses.
            </p>
          </div>
        </div>

        {/* Bottom separator */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
            opacity: 0.3,
          }}
        />
      </section>

      {/* ━━━ FOUNDER SECTION ━━━ */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            {/* Photo placeholder */}
            <div className="relative">
              <div
                className="aspect-[4/5] overflow-hidden rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.20 0.06 255), oklch(0.28 0.06 250))",
                }}
              >
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Building2 className="mb-4 h-16 w-16 text-white/10" />
                  <p className="text-sm font-medium text-white/20">
                    Photo placeholder
                  </p>
                </div>
              </div>
              {/* Decorative gold corner accent */}
              <div
                className="absolute -bottom-4 -right-4 h-32 w-32 rounded-br-2xl"
                style={{
                  border: "2px solid var(--gold)",
                  borderLeft: "none",
                  borderTop: "none",
                  opacity: 0.2,
                }}
              />
            </div>

            {/* Bio content */}
            <div className="lg:pt-8">
              <div
                className="mb-5 h-[2px] w-14"
                style={{
                  background: "linear-gradient(90deg, var(--gold), var(--gold-light))",
                }}
              />
              <p
                className="mb-3 text-xs font-bold uppercase tracking-[0.25em]"
                style={{ color: "var(--gold-dark)" }}
              >
                The Founder
              </p>
              <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Matt Lenzie
              </h2>
              <p
                className="mb-8 text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--gold-dark)" }}
              >
                Founder & Principal Broker
              </p>

              <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  With over 25 years in property finance, Matt has arranged more
                  than £500 million of development funding across the UK. His
                  track record spans the full spectrum — from £200k light
                  refurbishments and HMO conversions to £50M+ multi-phase
                  residential schemes — and the full capital stack from senior
                  debt through mezzanine, preferred equity, and JV structures.
                </p>
                <p>
                  Before founding Construction Capital in 2000, Matt spent over
                  a decade at leading property finance institutions where he
                  built direct relationships with credit committees at
                  challenger banks, specialist lenders, family offices, and
                  institutional debt funds. These relationships — maintained
                  through consistent deal flow and transparent packaging — mean
                  faster credit decisions and more competitive terms for clients.
                </p>
                <p>
                  Matt personally manages every deal that enters the firm. His
                  approach is to understand the borrower&rsquo;s business plan,
                  model the capital structure, and present the opportunity to the
                  right lenders on day one — not after weeks of speculative
                  enquiries. This precision is why repeat clients account for
                  over 60% of Construction Capital&rsquo;s origination.
                </p>
                <p>
                  He has navigated every UK property cycle since the early 2000s,
                  including structuring exits during the 2008 financial crisis
                  with zero client defaults — a track record that informs the
                  conservative risk approach he applies to every deal today.
                </p>
              </div>

              {/* Stats row */}
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/50 pt-10">
                <div>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "var(--navy)" }}
                  >
                    £{STATS.fundsArranged}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Funds Arranged
                  </p>
                </div>
                <div>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "var(--navy)" }}
                  >
                    {STATS.yearsExperience}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Years Experience
                  </p>
                </div>
                <div>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "var(--navy)" }}
                  >
                    {STATS.lenderPanel}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Lender Panel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ SPECIALIST EXPERTISE ━━━ */}
      <section className="border-t bg-muted/20 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.25em]"
              style={{ color: "var(--gold-dark)" }}
            >
              Areas of Expertise
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What We Specialise In
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              25 years of deal structuring across every property asset class and
              financing method available in the UK market.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {specialisms.map((item) => (
              <div
                key={item.title}
                className="glass-card rounded-2xl p-7"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                      border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                    }}
                  >
                    <item.icon
                      className="h-5 w-5"
                      style={{ color: "var(--gold)" }}
                    />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ VALUES — Dark section ━━━ */}
      <section
        className="noise-overlay relative overflow-hidden py-24 sm:py-32"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.16 0.05 255), oklch(0.20 0.06 255), oklch(0.16 0.05 255))",
        }}
      >
        <div
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, oklch(0.75 0.12 85 / 0.05), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: "var(--gold)" }}
            >
              Our Approach
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              How We Operate
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/50">
              Every principle below was forged in real deals, real negotiations,
              and real outcomes for our clients.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:translate-y-[-2px]"
                style={{
                  background: "oklch(1 0 0 / 0.04)",
                  border: "1px solid oklch(1 0 0 / 0.06)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    border: "1px solid oklch(0.75 0.12 85 / 0.2)",
                  }}
                />

                <div
                  className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                    border: "1px solid oklch(0.75 0.12 85 / 0.1)",
                  }}
                >
                  <item.icon
                    className="h-6 w-6"
                    style={{ color: "var(--gold)" }}
                  />
                </div>
                <h3 className="relative mb-3 text-xl font-bold tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-white/50">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TIMELINE ━━━ */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.25em]"
              style={{ color: "var(--gold-dark)" }}
            >
              Our Journey
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Key Milestones
            </h2>
          </div>

          <div className="relative mx-auto max-w-2xl">
            {/* Vertical line */}
            <div
              className="absolute left-8 top-0 bottom-0 w-[2px] sm:left-1/2 sm:-translate-x-px"
              style={{
                background:
                  "linear-gradient(180deg, var(--gold) 0%, oklch(0.75 0.12 85 / 0.2) 100%)",
              }}
            />

            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <div
                  key={milestone.year}
                  className="relative flex items-center gap-8 pl-20 sm:pl-0"
                >
                  {/* Left side (even) or right side (odd) on desktop */}
                  <div
                    className={`hidden sm:block sm:w-1/2 ${i % 2 === 0 ? "text-right pr-12" : "sm:order-2 pl-12"}`}
                  >
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--gold-dark)" }}
                    >
                      {milestone.year}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {milestone.event}
                    </p>
                  </div>

                  {/* Center dot */}
                  <div
                    className="absolute left-[1.625rem] flex h-5 w-5 items-center justify-center rounded-full bg-background sm:static sm:order-1 sm:shrink-0"
                    style={{
                      boxShadow: "0 0 0 3px var(--gold)",
                    }}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: "var(--gold)" }}
                    />
                  </div>

                  {/* Spacer for desktop layout */}
                  <div
                    className={`hidden sm:block sm:w-1/2 ${i % 2 === 0 ? "sm:order-2" : ""}`}
                  />

                  {/* Mobile-only content */}
                  <div className="sm:hidden">
                    <p
                      className="text-xl font-bold"
                      style={{ color: "var(--gold-dark)" }}
                    >
                      {milestone.year}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {milestone.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ TRUST SIGNALS ━━━ */}
      <section className="border-t bg-muted/20 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.25em]"
              style={{ color: "var(--gold-dark)" }}
            >
              Why Us
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Track Record & Trust
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              25+ years of results across every market condition.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
            {[
              {
                icon: Award,
                title: "£500M+ Arranged",
                desc: "Over half a billion pounds in property finance structured across development, bridging, mezzanine, and equity — from £200k light refurbs to £50M+ multi-phase schemes.",
              },
              {
                icon: Users,
                title: "100+ Lender Panel",
                desc: "Direct relationships with challenger banks, specialist lenders, family offices, and institutional debt funds. We match the right lender to your deal, not the other way round.",
              },
              {
                icon: Shield,
                title: "60%+ Repeat Business",
                desc: "The majority of our deal flow comes from developers who return for their next project. Our track record through every market cycle — including zero client defaults in 2008 — speaks for itself.",
              },
            ].map((cred) => (
              <div
                key={cred.title}
                className="text-center"
              >
                <div
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.25 0.06 255 / 0.08), oklch(0.25 0.06 255 / 0.03))",
                    border: "1px solid oklch(0.25 0.06 255 / 0.06)",
                  }}
                >
                  <cred.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold tracking-tight">
                  {cred.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{cred.desc}</p>
              </div>
            ))}
          </div>

          {/* Process summary — demonstrates expertise */}
          <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-border bg-card p-8 sm:p-10">
            <h3 className="mb-6 text-center text-xl font-bold tracking-tight">
              Our Deal Process
            </h3>
            <div className="grid gap-6 sm:grid-cols-4">
              {[
                { step: "1", title: "Deal Review", desc: "We assess your scheme, borrower profile, and funding requirement within 24 hours." },
                { step: "2", title: "Lender Matching", desc: "We identify the 3-5 best-fit lenders from our 100+ panel based on deal specifics." },
                { step: "3", title: "Packaging", desc: "We prepare a lender-ready information memorandum that accelerates credit decisions." },
                { step: "4", title: "Completion", desc: "We manage the process through term sheet, valuation, legal, and drawdown." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div
                    className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
                      color: "var(--navy-dark)",
                    }}
                  >
                    {item.step}
                  </div>
                  <h4 className="mb-1 text-sm font-bold">{item.title}</h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
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
            Let&rsquo;s Talk About
            <br />
            Your Deal
          </h2>
          <p
            className="mx-auto mt-5 max-w-xl text-lg"
            style={{ color: "var(--navy)", opacity: 0.6 }}
          >
            Whether you&rsquo;re a first-time developer or an experienced
            operator, we structure funding solutions that work for your project.
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
