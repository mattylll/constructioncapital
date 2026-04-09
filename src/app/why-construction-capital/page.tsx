import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Zap,
  Shield,
  Building2,
  Clock,
  MapPin,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import {
  SITE_NAME,
  SITE_URL,
  CONTACT,
  STATS,
} from "@/lib/constants";
import {
  FUNDING_ROUTES,
  COMPARISON_FEATURES,
} from "@/lib/comparisons";

export const metadata: Metadata = {
  title: "Why Choose Construction Capital | UK Development Finance Broker",
  description:
    "100+ lenders, 24hr indicative terms, expert deal structuring. Discover why UK property developers choose Construction Capital over going direct, high street banks, and online platforms.",
  alternates: { canonical: `${SITE_URL}/why-construction-capital` },
  openGraph: {
    title: "Why Choose Construction Capital | UK Development Finance Broker",
    description:
      "100+ lenders, 24hr indicative terms, expert deal structuring. Discover why UK property developers choose Construction Capital.",
    url: `${SITE_URL}/why-construction-capital`,
    siteName: SITE_NAME,
    type: "website",
  },
};

const valueProps = [
  {
    icon: Users,
    title: "100+ Lender Panel",
    description:
      "We maintain relationships with over 100 specialist development finance lenders. One application from you triggers competition across the whole market — surfacing terms you would never find alone.",
  },
  {
    icon: Zap,
    title: "24hr Indicative Terms",
    description:
      "Submit your deal and receive indicative terms within 24 hours. No weeks of waiting, no chasing relationship managers. We know which lenders have appetite for your project right now.",
  },
  {
    icon: Building2,
    title: "Specialist Deal Structuring",
    description:
      "Senior debt, mezzanine, equity, bridging — we structure the optimal capital stack for every project. Most developers leave money on the table by not exploring the full range of options.",
  },
  {
    icon: Shield,
    title: "No Upfront Fees",
    description:
      "We do not charge a penny until your facility completes. Our interests are fully aligned with yours — we only succeed when you get funded on terms that work.",
  },
  {
    icon: Clock,
    title: "25+ Years Experience",
    description:
      "Our team has structured over half a billion pounds of development finance. We have seen every deal type, every lender quirk, and every pitfall — so you do not have to learn the hard way.",
  },
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    description:
      "From Central London to rural Scotland, we fund projects across every region of the UK. Our lender relationships span national banks, regional funds, and international capital sources.",
  },
];

const faqs = [
  {
    question: "Do I need a broker for development finance?",
    answer:
      "Strictly speaking, no — you can approach lenders directly. But without a broker, you are limited to one lender's terms with no market comparison. A specialist broker like Construction Capital competes 100+ lenders against each other, typically saving developers significantly more than the broker fee through better rates, higher leverage, and optimised deal structures.",
  },
  {
    question: "How much does a development finance broker cost?",
    answer:
      "Most specialist brokers charge an arrangement fee of 1-2% of the facility, payable only on completion. At Construction Capital, we charge no upfront fees whatsoever. The arrangement fee is typically deducted from the facility at drawdown, meaning you pay nothing out of pocket. The savings we achieve through lender competition almost always exceed the fee.",
  },
  {
    question: "Can't I just go direct to a lender and save the broker fee?",
    answer:
      "You can, but you will likely end up paying more overall. Lenders do not reduce their rates or fees because you approach them directly — they simply keep the margin a broker would have negotiated away. Brokers with volume relationships and panel leverage consistently secure better terms than individual developers approaching lenders cold.",
  },
  {
    question: "How quickly will I receive terms?",
    answer:
      "We provide indicative terms within 24 hours of receiving your project details. Formal heads of terms typically follow within 3-5 working days. Full completion — including valuation, legals, and due diligence — usually takes 2-4 weeks for standard deals, though we have completed urgent facilities in under 7 days.",
  },
  {
    question: "What if my project is complex or unusual?",
    answer:
      "Complex projects are where a specialist broker adds the most value. Whether it is a planning-contingent facility, a mixed-use scheme, a barn conversion, or a deal requiring mezzanine and equity alongside senior debt — we have structured it before. Our lender panel includes niche funds and alternative capital sources that most developers do not know exist.",
  },
];

const ratingColour: Record<string, string> = {
  excellent: "bg-emerald-500/20 text-emerald-400",
  good: "bg-blue-500/20 text-blue-400",
  average: "bg-amber-500/20 text-amber-400",
  poor: "bg-red-500/20 text-red-400",
  "n/a": "bg-white/5 text-white/25",
};

const ratingLabel: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  average: "Average",
  poor: "Poor",
  "n/a": "N/A",
};

const routeShortNames: Record<string, string> = {
  "specialist-broker": "Specialist Broker",
  "direct-to-lender": "Direct to Lender",
  "high-street-bank": "High Street Bank",
  "online-platform": "Online Platform",
  "mortgage-broker": "Mortgage Broker",
};

const testimonials = [
  {
    quote:
      "Structured our \u00a312M development facility in under two weeks. Direct access to credit committees made the difference.",
    name: "JAMES WHITFIELD",
    role: "Whitfield Developments",
  },
  {
    quote:
      "They engineered a mezzanine structure that reduced our equity requirement by 40%. Nobody else even suggested it.",
    name: "SARAH CHEN",
    role: "Apex Property Group",
  },
];

export default function WhyConstructionCapitalPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Why Construction Capital",
        item: `${SITE_URL}/why-construction-capital`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* ━━━ HERO ━━━ */}
      <section className="hero-gradient noise-overlay relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden py-32 text-center text-white">
        <div className="relative z-10 mx-auto max-w-[900px] px-5 sm:px-8">
          <div
            className="mx-auto mb-6 h-[2px] w-14"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />
          <p
            className="mb-6 text-[12px] font-bold tracking-[0.4em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            Why Choose Us
          </p>
          <h1 className="font-playfair text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            The Broker{" "}
            <span style={{ color: "var(--gold)" }}>Advantage</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[600px] text-lg leading-relaxed text-white/50">
            Why the UK&apos;s most ambitious property developers use a specialist
            broker — and why they choose {SITE_NAME}.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="cta-shimmer bg-gold text-navy-dark hover:bg-gold-dark h-14 rounded-none px-10 text-sm font-bold uppercase tracking-[0.2em]"
            >
              <Link href="/deal-room">Start Your Deal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ━━━ THE PROBLEM ━━━ */}
      <section
        className="py-24 sm:py-32"
        style={{ background: "oklch(0.12 0.045 255)" }}
      >
        <div className="mx-auto max-w-[800px] px-5 sm:px-8">
          <p
            className="mb-4 text-[12px] font-bold tracking-[0.4em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            The Problem
          </p>
          <h2 className="mb-10 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
            DEVELOPMENT FINANCE<br />IS BROKEN<span style={{ color: "var(--gold)" }}>.</span>
          </h2>

          <div className="space-y-6 text-base leading-relaxed text-white/45">
            <p>
              The UK development finance market is fragmented across hundreds of
              lenders — from challenger banks and specialist funds to family
              offices and international capital sources. Each has different
              appetites, criteria, and pricing. No single lender covers the whole
              market, and no developer has time to approach them all.
            </p>
            <p>
              Lender opacity makes the problem worse. Rates, fees, and criteria
              are rarely published. Two identical projects can receive wildly
              different terms from the same lender depending on timing, appetite,
              and how the deal is presented. Without insider knowledge of credit
              committee preferences, developers are negotiating blind.
            </p>
            <p>
              Then there is structuring. Most developments need more than simple
              senior debt. Mezzanine finance, equity partnerships, phased
              drawdowns, planning-contingent facilities — the optimal capital
              stack can save hundreds of thousands of pounds over the life of a
              project. But structuring it correctly requires specialist
              knowledge that most developers, and most generalist brokers,
              simply do not have.
            </p>
            <p>
              The result? Developers overpay for finance, accept suboptimal
              leverage, or worse — lose deals entirely because they could not
              move fast enough. That is the problem we solve.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ HOW WE'RE DIFFERENT ━━━ */}
      <section
        className="py-24 sm:py-32"
        style={{ background: "oklch(0.10 0.04 255)" }}
      >
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <p
            className="mb-4 text-[12px] font-bold tracking-[0.4em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            How We&apos;re Different
          </p>
          <h2 className="mb-5 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
            THE CONSTRUCTION CAPITAL<br />DIFFERENCE<span style={{ color: "var(--gold)" }}>.</span>
          </h2>
          <p className="mb-16 max-w-[500px] text-base leading-relaxed text-white/35">
            Six reasons why developers choose us over every other route to
            funding.
          </p>

          <div className="grid gap-[2px] sm:grid-cols-2 lg:grid-cols-3">
            {valueProps.map((vp) => {
              const Icon = vp.icon;
              return (
                <div
                  key={vp.title}
                  className="p-8 transition-all duration-300 hover:bg-[oklch(0.75_0.12_85/0.03)]"
                  style={{
                    background: "oklch(1 0 0 / 0.02)",
                    border: "1px solid oklch(1 0 0 / 0.04)",
                  }}
                >
                  <Icon
                    className="mb-4 h-7 w-7"
                    style={{ color: "var(--gold)" }}
                  />
                  <h3 className="mb-3 text-lg font-black tracking-[-0.01em] text-white">
                    {vp.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/35">
                    {vp.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ COMPARISON TABLE ━━━ */}
      <section
        className="py-24 sm:py-32"
        style={{ background: "oklch(0.12 0.045 255)" }}
      >
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <p
            className="mb-4 text-[12px] font-bold tracking-[0.4em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            Compare Your Options
          </p>
          <h2 className="mb-5 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
            HOW WE<br />STACK UP<span style={{ color: "var(--gold)" }}>.</span>
          </h2>
          <p className="mb-16 max-w-[500px] text-base leading-relaxed text-white/35">
            An honest comparison of every route to development finance.
          </p>

          {/* Desktop comparison grid */}
          <div className="hidden lg:block">
            {/* Header row */}
            <div
              className="mb-[2px] grid grid-cols-6 gap-[2px]"
            >
              <div
                className="p-4"
                style={{ background: "oklch(1 0 0 / 0.02)" }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/30">
                  Feature
                </p>
              </div>
              {FUNDING_ROUTES.map((route) => (
                <div
                  key={route.slug}
                  className="p-4"
                  style={{
                    background:
                      route.slug === "specialist-broker"
                        ? "oklch(0.75 0.12 85 / 0.08)"
                        : "oklch(1 0 0 / 0.02)",
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-[0.1em]"
                    style={{
                      color:
                        route.slug === "specialist-broker"
                          ? "var(--gold)"
                          : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {routeShortNames[route.slug]}
                  </p>
                </div>
              ))}
            </div>

            {/* Feature rows */}
            {COMPARISON_FEATURES.map((feature) => (
              <div
                key={feature.feature}
                className="mb-[2px] grid grid-cols-6 gap-[2px]"
              >
                <div
                  className="flex flex-col justify-center p-4"
                  style={{ background: "oklch(1 0 0 / 0.02)" }}
                >
                  <p className="text-sm font-bold text-white">
                    {feature.feature}
                  </p>
                  <p className="mt-0.5 text-xs text-white/25">
                    {feature.description}
                  </p>
                </div>
                {FUNDING_ROUTES.map((route) => {
                  const rating = feature.ratings[route.slug];
                  return (
                    <div
                      key={route.slug}
                      className="flex items-center justify-center p-4"
                      style={{
                        background:
                          route.slug === "specialist-broker"
                            ? "oklch(0.75 0.12 85 / 0.04)"
                            : "oklch(1 0 0 / 0.015)",
                      }}
                    >
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${ratingColour[rating]}`}
                      >
                        {ratingLabel[rating]}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Mobile comparison — stacked cards */}
          <div className="lg:hidden">
            {COMPARISON_FEATURES.map((feature) => (
              <div
                key={feature.feature}
                className="mb-3 p-5"
                style={{
                  background: "oklch(1 0 0 / 0.02)",
                  border: "1px solid oklch(1 0 0 / 0.04)",
                }}
              >
                <p className="mb-1 text-sm font-bold text-white">
                  {feature.feature}
                </p>
                <p className="mb-4 text-xs text-white/25">
                  {feature.description}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {FUNDING_ROUTES.map((route) => {
                    const rating = feature.ratings[route.slug];
                    return (
                      <div key={route.slug} className="flex flex-col gap-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/30">
                          {routeShortNames[route.slug]}
                        </p>
                        <span
                          className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${ratingColour[rating]}`}
                        >
                          {ratingLabel[rating]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FUNDING ROUTE DETAILS ━━━ */}
      <section
        className="py-24 sm:py-32"
        style={{ background: "oklch(0.10 0.04 255)" }}
      >
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <p
            className="mb-4 text-[12px] font-bold tracking-[0.4em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            Your Options
          </p>
          <h2 className="mb-16 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
            EVERY ROUTE TO<br />FUNDING<span style={{ color: "var(--gold)" }}>.</span>
          </h2>

          <div className="grid gap-4 lg:grid-cols-2">
            {FUNDING_ROUTES.map((route) => (
              <div
                key={route.slug}
                className="rounded-xl border border-border bg-card p-6"
                style={
                  route.slug === "specialist-broker"
                    ? {
                        borderColor: "oklch(0.75 0.12 85 / 0.3)",
                        background: "oklch(0.75 0.12 85 / 0.04)",
                      }
                    : undefined
                }
              >
                {route.slug === "specialist-broker" && (
                  <span
                    className="mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em]"
                    style={{
                      background: "oklch(0.75 0.12 85 / 0.15)",
                      color: "var(--gold)",
                    }}
                  >
                    Recommended
                  </span>
                )}
                <h3 className="mb-2 text-xl font-black text-foreground">
                  {route.name}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {route.description}
                </p>

                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-500">
                      Pros
                    </p>
                    <ul className="space-y-1.5">
                      {route.pros.map((pro) => (
                        <li
                          key={pro}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-red-400">
                      Cons
                    </p>
                    <ul className="space-y-1.5">
                      {route.cons.map((con) => (
                        <li
                          key={con}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">
                      Best For
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {route.bestFor}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">
                      Timeline
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {route.typicalTimeline}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">
                      Cost
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {route.typicalCost}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ THE NUMBERS ━━━ */}
      <section
        className="relative overflow-hidden py-24 text-center sm:py-32"
        style={{ background: "oklch(0.12 0.045 255)" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.75 0.12 85 / 0.05) 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1000px] px-5 sm:px-8">
          <p
            className="mb-4 text-[12px] font-bold tracking-[0.4em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            The Numbers
          </p>
          <h2 className="mb-16 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
            BUILT ON RESULTS<span style={{ color: "var(--gold)" }}>.</span>
          </h2>

          <div className="mx-auto grid max-w-[800px] grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: `\u00a3${STATS.fundsArranged}`, label: "FUNDS ARRANGED" },
              { value: STATS.lenderPanel, label: "LENDERS" },
              { value: "24hr", label: "INDICATIVE TERMS" },
              { value: `${STATS.yearsExperience} yrs`, label: "EXPERIENCE" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-[clamp(2.5rem,5vw,3.5rem)] font-black tracking-[-0.03em]"
                  style={{ color: "var(--gold)" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] font-bold tracking-[0.2em] text-white/30">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section
        className="py-24 sm:py-32"
        style={{ background: "oklch(0.10 0.04 255)" }}
      >
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8">
          <p
            className="mb-4 text-[12px] font-bold tracking-[0.4em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            Client Results
          </p>
          <h2 className="mb-16 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
            DON&apos;T TAKE<br />OUR WORD<span style={{ color: "var(--gold)" }}>.</span>
          </h2>

          <div className="grid gap-[2px] sm:grid-cols-2">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-10"
                style={{
                  background: "oklch(1 0 0 / 0.015)",
                  border: "1px solid oklch(1 0 0 / 0.03)",
                }}
              >
                <p
                  className="mb-3 text-sm tracking-[0.15em]"
                  style={{ color: "var(--gold)" }}
                >
                  *****
                </p>
                <blockquote className="mb-6 text-lg leading-relaxed text-white/50 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="text-sm font-black tracking-wide text-white">
                  {t.name}
                </p>
                <p className="mt-1 text-xs text-white/25">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FAQs ━━━ */}
      <section
        className="py-24 sm:py-32"
        style={{ background: "oklch(0.12 0.045 255)" }}
      >
        <div className="mx-auto max-w-[800px] px-5 sm:px-8">
          <p
            className="mb-4 text-[12px] font-bold tracking-[0.4em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            Common Questions
          </p>
          <h2 className="mb-16 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
            FAQs<span style={{ color: "var(--gold)" }}>.</span>
          </h2>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="p-6"
                style={{
                  background: "oklch(1 0 0 / 0.02)",
                  border: "1px solid oklch(1 0 0 / 0.04)",
                }}
              >
                <h3 className="mb-3 text-lg font-bold text-white">
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed text-white/40">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section
        className="relative overflow-hidden py-36 text-center sm:py-44"
        style={{ background: "oklch(0.10 0.04 255)" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.75 0.12 85 / 0.06) 0%, transparent 40%)",
          }}
        />
        <div className="relative px-5 sm:px-8">
          <div
            className="mx-auto mb-8 h-[2px] w-14"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />
          <h2 className="text-[clamp(2rem,6vw,4rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
            READY TO SEE THE<br />
            <span
              style={{
                color: "var(--gold)",
                textShadow: "0 0 60px oklch(0.75 0.12 85 / 0.25)",
              }}
            >
              DIFFERENCE
            </span>
            <span style={{ color: "var(--gold)" }}>?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[500px] text-base text-white/35">
            Submit your deal. Receive indicative terms from 100+ lenders within
            24 hours. No upfront fees. No obligation.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="cta-shimmer bg-gold text-navy-dark hover:bg-gold-dark h-16 rounded-none px-14 text-base font-black uppercase tracking-[0.25em]"
            >
              <Link href="/deal-room">Enter the Deal Room</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-16 rounded-none border-white/10 px-10 text-sm font-bold uppercase tracking-[0.2em] text-white/50 transition-all hover:border-gold/30 hover:bg-transparent hover:text-gold"
            >
              <Link href={`tel:${CONTACT.phoneRaw}`}>
                Call {CONTACT.phone}
              </Link>
            </Button>
          </div>
          <p className="mt-5 text-xs tracking-wide text-white/20">
            constructioncapital.co.uk
          </p>
        </div>
      </section>
    </>
  );
}
