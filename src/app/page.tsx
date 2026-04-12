import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Layers,
  Clock,
  Handshake,
  Wrench,
  Landmark,
  LogOut,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/home/animated-counter";
import { Reveal } from "@/components/home/reveal";
import { Typewriter } from "@/components/home/typewriter";
import { HomepageEnquiryForm } from "@/components/home/homepage-enquiry-form";
import { SITE_IMAGES, unsplashUrl } from "@/lib/location-images";
import { GUIDES } from "@/lib/guides";

const services = [
  {
    slug: "development-finance",
    name: "Development Finance",
    rate: "6.5%",
    rateLabel: "FROM P.A.",
    desc: "Senior debt for ground-up residential and commercial developments. Up to 65-70% LTGDV.",
    tag: "MOST POPULAR",
    icon: Building2,
  },
  {
    slug: "mezzanine-finance",
    name: "Mezzanine Finance",
    rate: "12%",
    rateLabel: "FROM P.A.",
    desc: "Stretch your capital stack beyond senior debt. Up to 85-90% LTGDV.",
    tag: "HIGH LEVERAGE",
    icon: Layers,
  },
  {
    slug: "bridging-loans",
    name: "Bridging Loans",
    rate: "0.55%",
    rateLabel: "FROM P.M.",
    desc: "Short-term finance for acquisitions, auction purchases, chain breaks. Up to 75% LTV.",
    tag: "7 DAY COMPLETION",
    icon: Clock,
  },
  {
    slug: "equity-jv",
    name: "Equity & JV",
    rate: "40%",
    rateLabel: "PROFIT SHARE FROM",
    desc: "Equity partnerships and JV structures. Up to 100% of project costs funded.",
    tag: "ZERO DEPOSIT",
    icon: Handshake,
  },
  {
    slug: "refurbishment-finance",
    name: "Refurbishment",
    rate: "0.65%",
    rateLabel: "FROM P.M.",
    desc: "Light and heavy refurb funding. Up to 75% LTV with staged drawdowns.",
    tag: "LIGHT & HEAVY",
    icon: Wrench,
  },
  {
    slug: "development-exit-finance",
    name: "Development Exit",
    rate: "0.55%",
    rateLabel: "FROM P.M.",
    desc: "Repay development finance while selling units. Release equity faster.",
    tag: "EXIT STRATEGY",
    icon: LogOut,
  },
];

const steps = [
  {
    num: "01",
    title: "TELL US YOUR DEAL",
    desc: "Submit your project details. Takes 2 minutes. We'll understand the full picture.",
  },
  {
    num: "02",
    title: "WE SOURCE TERMS",
    desc: "100+ lenders competed against each other. Best terms surface in 24 hours.",
  },
  {
    num: "03",
    title: "GET FUNDED",
    desc: "Due diligence, legals, completion. We manage it all. You build.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ━━━ HERO - Centered billboard ━━━ */}
      <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden text-center text-white">
        {/* Background construction image */}
        <Image
          src={unsplashUrl(SITE_IMAGES["homepage-hero"].id, 1920, 75)}
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, oklch(0.10 0.04 255 / 0.88) 0%, oklch(0.14 0.05 255 / 0.82) 50%, oklch(0.10 0.04 255 / 0.92) 100%)",
          }}
        />

        {/* Radial gold glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, oklch(0.75 0.12 85 / 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, oklch(0.75 0.12 85 / 0.03) 0%, transparent 40%)",
          }}
        />

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[200px]"
          style={{
            background: "linear-gradient(to bottom, transparent, oklch(0.10 0.04 255))",
          }}
        />

        <div className="relative z-10 px-5 pb-20 pt-32 sm:px-8 lg:pb-24">
          {/* Eyebrow */}
          <p className="animate-fade-up mb-6 text-[13px] font-bold tracking-[0.5em] uppercase text-white/30 sm:text-sm">
            Development Finance Brokers
          </p>

          {/* Main title - typewriter effect */}
          <h1>
            <Typewriter
              lines={["WE GET YOU", "FUNDED"]}
              lineClassName="text-[clamp(3.5rem,12vw,10rem)] font-black leading-[0.85] tracking-[-0.04em]"
              goldDot
              speed={70}
              lineDelay={250}
            />
          </h1>

          {/* Sub-headline - dimmed but readable */}
          <p className="animate-fade-up delay-200 mt-3 text-[clamp(2.5rem,8vw,6.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white/30">
            FAST.
          </p>

          {/* Gold line */}
          <div
            className="animate-fade-in delay-300 mx-auto mt-10 h-[6px] w-20"
            style={{
              background: "var(--gold)",
              boxShadow: "0 0 20px oklch(0.75 0.12 85 / 0.2)",
            }}
          />

          {/* Tagline */}
          <p className="animate-fade-up delay-300 mx-auto mt-10 max-w-[500px] text-base leading-relaxed text-white/40 sm:text-lg">
            Senior debt, mezzanine, equity & bridging for UK property developers. 25+ years. 100+ lenders. One call.
          </p>

          {/* Stats row */}
          <div className="animate-fade-up delay-400 mx-auto mt-12 flex flex-col items-center gap-10 sm:flex-row sm:gap-16">
            {[
              { value: "500", prefix: "£", suffix: "M+", label: "ARRANGED" },
              { value: "100", prefix: "", suffix: "+", label: "LENDERS" },
              { value: "24", prefix: "", suffix: "HR", label: "TERMS" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="stat-value text-5xl font-black tracking-tighter" style={{ color: "var(--gold)" }}>
                  {stat.prefix}
                  <AnimatedCounter value={stat.value} prefix="" suffix="" />
                  {stat.suffix}
                </p>
                <p className="mt-1 text-[11px] font-bold tracking-[0.2em] text-white/30">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="animate-fade-up delay-500 mt-12">
            <Button
              asChild
              size="lg"
              className="cta-shimmer bg-gold text-navy-dark hover:bg-gold-dark h-16 rounded-none px-12 text-base font-black uppercase tracking-[0.25em] shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-[0_0_50px_oklch(0.75_0.12_85/0.3)]"
            >
              <Link href="/deal-room">
                Start Your Deal
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in delay-700 absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 lg:block">
          <div
            className="mx-auto h-10 w-[2px] animate-pulse"
            style={{ background: "linear-gradient(180deg, var(--gold), transparent)" }}
          />
        </div>
      </section>

      {/* ━━━ SPEED - "COMPLETE IN DAYS / NOT MONTHS" ━━━ */}
      <section
        className="relative overflow-hidden py-32 text-center sm:py-44"
      >
        {/* Background image */}
        <Image
          src={unsplashUrl(SITE_IMAGES["homepage-process"].id, 1920, 75)}
          alt=""
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "oklch(0.10 0.04 255 / 0.90)",
          }}
        />

        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, oklch(0.75 0.12 85 / 0.04) 0%, transparent 50%)",
          }}
        />

        <div className="relative">
          <Reveal>
            <p className="text-[clamp(3rem,10vw,9rem)] font-black leading-[0.85] tracking-[-0.04em] text-white">
              COMPLETE IN<br />
              <span style={{ color: "var(--gold)", textShadow: "0 0 60px oklch(0.75 0.12 85 / 0.3)" }}>
                DAYS
              </span>
            </p>
            <p className="mt-2 text-[clamp(3rem,10vw,9rem)] font-black leading-[0.85] tracking-[-0.04em] text-white/[0.08]">
              <span
                className="line-through"
                style={{ textDecorationColor: "var(--red)", textDecorationThickness: "4px" }}
              >
                NOT MONTHS
              </span>
            </p>
            <p className="mx-auto mt-8 max-w-md text-base text-white/30 tracking-wide">
              Indicative terms within 24 hours. Heads of terms within days. Not weeks.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ━━━ SERVICES - Grid with big rate numbers ━━━ */}
      <section
        className="relative py-24 sm:py-32"
        style={{ background: "oklch(0.12 0.045 255)" }}
      >
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <Reveal>
            <p
              className="mb-4 text-[12px] font-bold tracking-[0.4em] uppercase"
              style={{ color: "var(--gold)" }}
            >
              What We Do
            </p>
            <h2 className="mb-5 text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
              THE FULL<br />CAPITAL STACK<span style={{ color: "var(--gold)" }}>.</span>
            </h2>
            <p className="mb-16 max-w-[500px] text-base leading-relaxed text-white/35">
              Every layer of funding your development needs. Structured, sourced, secured.
            </p>
          </Reveal>

          <div className="grid gap-[2px] sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 80}>
                <Link
                  href={`/services#${s.slug}`}
                  className="service-bar group relative block overflow-hidden p-10 transition-all duration-300 hover:bg-[oklch(0.75_0.12_85/0.03)]"
                  style={{
                    background: "oklch(1 0 0 / 0.02)",
                    border: "1px solid oklch(1 0 0 / 0.04)",
                  }}
                >
                  {/* Left bar on hover via CSS class */}
                  <h3 className="mb-3 text-[1.65rem] font-black leading-none tracking-[-0.02em] text-white">
                    {s.name}
                  </h3>
                  <p
                    className="text-4xl font-black tracking-[-0.02em]"
                    style={{ color: "var(--gold)" }}
                  >
                    {s.rate}
                  </p>
                  <p className="mt-1 text-[11px] font-bold tracking-[0.2em] text-white/25">
                    {s.rateLabel}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-white/30">
                    {s.desc}
                  </p>
                  <span
                    className="mt-5 inline-block rounded-none px-3.5 py-1.5 text-[11px] font-bold tracking-[0.15em]"
                    style={{
                      border: "1px solid oklch(0.75 0.12 85 / 0.2)",
                      color: "var(--gold)",
                    }}
                  >
                    {s.tag}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ URGENCY - Red-tinted statement ━━━ */}
      <section
        className="relative overflow-hidden py-24 text-center sm:py-32"
        style={{ background: "oklch(0.10 0.04 255)" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.22 25 / 0.06) 0%, transparent 50%, oklch(0.75 0.12 85 / 0.04) 100%)",
          }}
        />

        <div className="relative px-5 sm:px-8">
          <Reveal>
            <p className="text-[clamp(1.5rem,4vw,3rem)] font-black leading-[1.15] tracking-[-0.02em] text-white/[0.15]">
              MOST DEVELOPERS{" "}
              <span style={{ color: "var(--red)" }}>LOSE DEALS</span>
            </p>
            <p className="text-[clamp(1.5rem,4vw,3rem)] font-black leading-[1.15] tracking-[-0.02em] text-white/[0.08]">
              WAITING ON SLOW LENDERS
            </p>
            <p className="mt-6 text-[clamp(1.5rem,4vw,3rem)] font-black leading-[1.15] tracking-[-0.02em] text-white">
              DON&apos;T BE ONE OF THEM.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ━━━ PROCESS - Three columns ━━━ */}
      <section
        className="relative py-24 sm:py-32"
        style={{ background: "oklch(0.10 0.04 255)" }}
      >
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <Reveal>
            <p
              className="mb-4 text-[12px] font-bold tracking-[0.4em] uppercase"
              style={{ color: "var(--gold)" }}
            >
              How It Works
            </p>
            <h2 className="mb-5 text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
              THREE STEPS<span style={{ color: "var(--gold)" }}>.</span>
            </h2>
            <p className="mb-16 max-w-[500px] text-base leading-relaxed text-white/35">
              No jargon. No delays. Just funding.
            </p>
          </Reveal>

          <div className="grid gap-0 border-t border-white/[0.04] lg:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 100}>
                <div className="border-b border-white/[0.04] p-10 lg:border-b-0 lg:border-r last:lg:border-r-0">
                  <p
                    className="text-[6.5rem] font-black leading-[0.8] tracking-[-0.06em]"
                    style={{ color: "oklch(0.75 0.12 85 / 0.25)" }}
                  >
                    {step.num}
                  </p>
                  <h3 className="mt-6 text-[1.35rem] font-black tracking-[-0.01em] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/30">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ ENQUIRY FORM - Inline lead capture ━━━ */}
      <section
        className="relative py-24 sm:py-32"
        style={{ background: "oklch(0.12 0.045 255)" }}
      >
        {/* Subtle gold glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, oklch(0.75 0.12 85 / 0.04) 0%, transparent 50%)",
          }}
        />

        <div className="relative mx-auto max-w-[900px] px-5 sm:px-8">
          <Reveal>
            <div className="mb-10">
              <p
                className="mb-4 text-[12px] font-bold tracking-[0.4em] uppercase"
                style={{ color: "var(--gold)" }}
              >
                Get Started
              </p>
              <h2 className="mb-5 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
                GET INDICATIVE TERMS<br />
                IN 24 HOURS<span style={{ color: "var(--gold)" }}>.</span>
              </h2>
              <p className="max-w-[500px] text-base leading-relaxed text-white/35">
                Tell us about your deal. No commitment, no paperwork. Just fast, competitive terms from 100+ lenders.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div
              className="p-8 sm:p-10"
              style={{
                background: "oklch(1 0 0 / 0.02)",
                border: "1px solid oklch(1 0 0 / 0.06)",
              }}
            >
              <HomepageEnquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ SOCIAL PROOF - Two-column grid ━━━ */}
      <section
        className="relative py-24 sm:py-32"
        style={{ background: "oklch(0.12 0.045 255)" }}
      >
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8">
          <Reveal>
            <p
              className="mb-4 text-[12px] font-bold tracking-[0.4em] uppercase"
              style={{ color: "var(--gold)" }}
            >
              Results
            </p>
            <h2 className="mb-5 text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
              DON&apos;T TAKE<br />OUR WORD<span style={{ color: "var(--gold)" }}>.</span>
            </h2>
            <p className="mb-16 max-w-[500px] text-base leading-relaxed text-white/35">
              Developers who stopped waiting and started building.
            </p>
          </Reveal>

          <div className="grid gap-[2px] sm:grid-cols-2">
            {[
              {
                quote:
                  "Structured our £12M development facility in under two weeks. Direct access to credit committees made the difference.",
                name: "JAMES WHITFIELD",
                role: "Whitfield Developments",
              },
              {
                quote:
                  "They engineered a mezzanine structure that reduced our equity requirement by 40%. Nobody else even suggested it.",
                name: "SARAH CHEN",
                role: "Apex Property Group",
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div
                  className="p-10"
                  style={{
                    background: "oklch(1 0 0 / 0.015)",
                    border: "1px solid oklch(1 0 0 / 0.03)",
                  }}
                >
                  <p className="mb-3 text-sm tracking-[0.15em]" style={{ color: "var(--gold)" }}>
                    ★★★★★
                  </p>
                  <blockquote className="mb-6 text-lg leading-relaxed text-white/50 italic">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <p className="text-sm font-black tracking-wide text-white">
                    {t.name}
                  </p>
                  <p className="mt-1 text-xs text-white/25">
                    {t.role}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ MARKET INTELLIGENCE - Report teasers ━━━ */}
      <section
        className="relative py-24 sm:py-32"
        style={{ background: "oklch(0.10 0.04 255)" }}
      >
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <Reveal>
            <p
              className="mb-4 text-[12px] font-bold tracking-[0.4em] uppercase"
              style={{ color: "var(--gold)" }}
            >
              Market Intelligence
            </p>
            <h2 className="mb-5 text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
              DATA-DRIVEN<br />MARKET REPORTS<span style={{ color: "var(--gold)" }}>.</span>
            </h2>
            <p className="mb-16 max-w-[500px] text-base leading-relaxed text-white/35">
              Real Land Registry data across 48 counties. Town-by-town analysis, new build premiums, and development finance insights.
            </p>
          </Reveal>

          <div className="grid gap-[2px] sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Town Reports",
                stat: "360",
                label: "TOWNS",
                desc: "Local market data for every town - prices, sales, trends, and development finance opportunities.",
                href: "/market-reports?category=town",
              },
              {
                title: "County Reports",
                stat: "48",
                label: "COUNTIES",
                desc: "In-depth analysis of every county - price trends, town comparisons, and finance implications.",
                href: "/market-reports?category=county",
              },
              {
                title: "Thematic & Regional",
                stat: "12",
                label: "REPORTS",
                desc: "Regional overviews, new build premiums, most active markets, and developer opportunity rankings.",
                href: "/market-reports?category=regional",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 80}>
                <Link
                  href={card.href}
                  className="service-bar group relative block overflow-hidden p-10 transition-all duration-300 hover:bg-[oklch(0.75_0.12_85/0.03)]"
                  style={{
                    background: "oklch(1 0 0 / 0.02)",
                    border: "1px solid oklch(1 0 0 / 0.04)",
                  }}
                >
                  <h3 className="mb-3 text-[1.65rem] font-black leading-none tracking-[-0.02em] text-white">
                    {card.title}
                  </h3>
                  <p
                    className="text-4xl font-black tracking-[-0.02em]"
                    style={{ color: "var(--gold)" }}
                  >
                    {card.stat}
                  </p>
                  <p className="mt-1 text-[11px] font-bold tracking-[0.2em] text-white/25">
                    {card.label}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-white/30">
                    {card.desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em]" style={{ color: "var(--gold)" }}>
                    EXPLORE
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <div className="mt-10 text-center">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 rounded-none border-white/10 px-10 text-sm font-bold uppercase tracking-[0.2em] text-white/50 transition-all hover:border-gold/30 hover:bg-transparent hover:text-gold"
              >
                <Link href="/market-reports">
                  View All 420 Reports
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ GUIDES SECTION ━━━ */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-12 text-center">
              <p
                className="mb-3 text-xs font-bold uppercase tracking-[0.3em] sm:text-sm"
                style={{ color: "var(--gold-dark)" }}
              >
                Expert Knowledge
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Development Finance Guides
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {GUIDES.length} in-depth guides covering every aspect of property development finance - from first application to exit.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GUIDES.slice(0, 6).map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/30 hover:shadow-sm"
                >
                  <h3 className="mb-2 font-bold text-foreground group-hover:text-gold-dark transition-colors">
                    {guide.title}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {guide.excerpt}
                  </p>
                  <span className="text-xs font-medium text-gold-dark">
                    {guide.readingTime} read
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/guides">
                  View All {GUIDES.length} Guides
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ FINAL CTA - Full takeover ━━━ */}
      <section
        className="relative overflow-hidden py-36 text-center sm:py-44"
        style={{ background: "oklch(0.10 0.04 255)" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, oklch(0.75 0.12 85 / 0.06) 0%, transparent 40%)",
          }}
        />

        <div className="relative px-5 sm:px-8">
          <Reveal>
            <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-black leading-[0.85] tracking-[-0.04em] text-white">
              CONSTRUCTION<br />
              <span style={{ color: "var(--gold)", textShadow: "0 0 80px oklch(0.75 0.12 85 / 0.25)" }}>
                CAPITAL
              </span>
              <span style={{ color: "var(--gold)" }}>.</span>
            </h2>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-white/30">
              Indicative Terms Within 24 Hours
            </p>
            <div className="mt-12">
              <Button
                asChild
                size="lg"
                className="cta-shimmer bg-gold text-navy-dark hover:bg-gold-dark h-16 rounded-none px-16 text-lg font-black uppercase tracking-[0.25em] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_60px_oklch(0.75_0.12_85/0.3),0_0_120px_oklch(0.75_0.12_85/0.1)]"
              >
                <Link href="/deal-room">
                  Enter the Deal Room
                </Link>
              </Button>
            </div>
            <p className="mt-5 text-xs text-white/20 tracking-wide">
              constructioncapital.co.uk
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
