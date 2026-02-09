import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Layers,
  Clock,
  Handshake,
  Wrench,
  Landmark,
  LogOut,
  ArrowRight,
  Send,
  Search,
  CheckCircle2,
  PoundSterling,
  CalendarClock,
  Users,
  MapPin,
  Shield,
  TrendingUp,
  ChevronRight,
  Quote,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/home/animated-counter";
import { SERVICES } from "@/lib/services";
import { STATS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Layers,
  Clock,
  Handshake,
  Wrench,
  Landmark,
  LogOut,
};

const trustStats = [
  {
    value: STATS.fundsArranged,
    prefix: "£",
    label: "Funds Arranged",
    icon: PoundSterling,
  },
  {
    value: `${STATS.yearsExperience}`,
    prefix: "",
    label: "Years Experience",
    icon: CalendarClock,
  },
  {
    value: `${STATS.lenderPanel}`,
    prefix: "",
    label: "Lender Panel",
    icon: Users,
  },
  {
    value: STATS.coverage,
    prefix: "",
    label: "UK Coverage",
    icon: MapPin,
  },
];

const steps = [
  {
    number: "01",
    title: "Tell Us About Your Deal",
    description:
      "Submit your project details through our Deal Room. Location, financials, and timeline — everything we need to get started.",
    icon: Send,
  },
  {
    number: "02",
    title: "We Source The Best Terms",
    description:
      "We approach our panel of 100+ lenders, family offices, and equity partners to secure the most competitive terms for your project.",
    icon: Search,
  },
  {
    number: "03",
    title: "Funding Secured",
    description:
      "Receive your term sheet, complete due diligence, and draw down funds. We manage the process from application to completion.",
    icon: CheckCircle2,
  },
];

const differentiators = [
  {
    icon: Shield,
    title: "Principal-Level Access",
    description:
      "Direct relationships with credit committees, not call centres. Your deal is presented by someone lenders know and trust.",
  },
  {
    icon: TrendingUp,
    title: "Optimised Structures",
    description:
      "We don't just find a lender — we engineer the optimal capital stack to maximise your returns and minimise equity.",
  },
  {
    icon: Clock,
    title: "Speed to Completion",
    description:
      "Indicative terms within 24 hours. Heads of terms within days. We move at the speed your deals demand.",
  },
];

const testimonials = [
  {
    quote:
      "Construction Capital structured our £12M development facility in under two weeks. Their direct access to credit committees made the difference — we'd still be waiting with anyone else.",
    name: "James Whitfield",
    title: "Director, Whitfield Developments",
    image: "/images/testimonial-developer.png",
    rating: 5,
    project: "42-unit residential scheme, Battersea",
  },
  {
    quote:
      "The team didn't just find us a lender — they engineered a mezzanine structure that reduced our equity requirement by 40%. Genuinely expert advice from people who understand the numbers.",
    name: "Sarah Chen",
    title: "Managing Partner, Apex Property Group",
    image: "/images/testimonial-architect.png",
    rating: 5,
    project: "Mixed-use conversion, Manchester",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ━━━ HERO — Full-viewport dramatic dark section ━━━ */}
      <section className="hero-gradient noise-overlay relative min-h-[92vh] overflow-hidden text-white">
        {/* Multi-layer background effects */}
        <div className="pointer-events-none absolute inset-0">
          {/* Architectural blueprint grid */}
          <svg
            className="h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="hero-grid"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* Dramatic diagonal gold beams */}
        <div
          className="pointer-events-none absolute -right-40 top-0 h-[160%] w-[2px] origin-top-right rotate-[22deg]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--gold) 30%, var(--gold) 50%, transparent 100%)",
            opacity: 0.15,
          }}
        />
        <div
          className="pointer-events-none absolute right-16 top-0 h-[160%] w-px origin-top-right rotate-[22deg]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--gold) 40%, transparent 100%)",
            opacity: 0.08,
          }}
        />
        <div
          className="pointer-events-none absolute right-60 top-0 h-[160%] w-px origin-top-right rotate-[22deg]"
          style={{
            background:
              "linear-gradient(180deg, transparent 20%, var(--gold) 50%, transparent 80%)",
            opacity: 0.05,
          }}
        />

        {/* Large radial glow — hero spotlight */}
        <div
          className="pointer-events-none absolute left-[15%] top-1/2 -translate-y-1/2"
          style={{
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(ellipse, oklch(0.75 0.12 85 / 0.08) 0%, oklch(0.35 0.06 255 / 0.03) 40%, transparent 70%)",
          }}
        />

        {/* Bottom-right corner glow */}
        <div
          className="pointer-events-none absolute -bottom-20 -right-20"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, oklch(0.75 0.12 85 / 0.05) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-4 py-28 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left column — copy */}
            <div className="max-w-2xl">
              {/* Gold rule — animated draw */}
              <div
                className="animate-fade-in mb-8 h-[2px] w-24"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gold), var(--gold-light))",
                }}
              />

              <p
                className="animate-fade-up mb-6 text-xs font-bold uppercase tracking-[0.35em] sm:text-sm"
                style={{ color: "var(--gold)" }}
              >
                Est. London &middot; Development Finance Brokers
              </p>

              <h1 className="animate-fade-up delay-100 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
                Expert
                <br />
                Development
                <br />
                Finance,{" "}
                <span className="gold-gradient-text italic">Nationwide</span>
              </h1>

              <p className="animate-fade-up delay-200 mt-8 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg lg:text-xl">
                Over 25 years arranging senior debt, mezzanine, and equity for UK
                property developers. From land acquisition to project completion —
                we source the capital, you build the vision.
              </p>

              <div className="animate-fade-up delay-300 mt-12 flex flex-col gap-4 sm:flex-row sm:gap-5">
                <Button
                  asChild
                  size="lg"
                  className="cta-shimmer animate-pulse-glow bg-gold text-navy-dark hover:bg-gold-dark h-14 px-10 text-base font-bold shadow-lg transition-all duration-300"
                >
                  <Link href="/deal-room">
                    Start Your Deal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 border-white/15 bg-white/[0.04] px-10 text-base font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
                >
                  <Link href="/locations">Explore Locations</Link>
                </Button>
              </div>

              {/* Inline micro-trust line */}
              <div className="animate-fade-up delay-500 mt-14 flex items-center gap-6 text-xs font-medium uppercase tracking-wider text-white/35">
                <span>£500M+ Arranged</span>
                <span className="h-3 w-px bg-white/15" />
                <span>100+ Lenders</span>
                <span className="h-3 w-px bg-white/15" />
                <span>Nationwide</span>
              </div>
            </div>

            {/* Right column — hero image */}
            <div className="animate-fade-up delay-400 relative hidden lg:block">
              <div className="relative overflow-hidden rounded-2xl">
                {/* Gold border glow */}
                <div
                  className="absolute -inset-px rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.3), transparent 50%, oklch(0.75 0.12 85 / 0.15))",
                  }}
                />
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/images/hero-woman-site.png"
                    alt="Professional development finance broker at a construction site"
                    width={640}
                    height={480}
                    className="h-auto w-full object-cover"
                    priority
                  />
                  {/* Gradient overlay at bottom */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/3"
                    style={{
                      background:
                        "linear-gradient(to top, oklch(0.18 0.05 255 / 0.8), transparent)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom edge — gold gradient separator */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--gold) 20%, var(--gold) 80%, transparent 100%)",
            opacity: 0.35,
          }}
        />
      </section>

      {/* ━━━ TRUST BAR — Dark contrast strip ━━━ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.18 0.05 255) 0%, oklch(0.22 0.06 255) 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 lg:grid-cols-4 lg:gap-x-12">
            {trustStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4"
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                    border: "1px solid oklch(0.75 0.12 85 / 0.15)",
                  }}
                >
                  <stat.icon className="h-6 w-6" style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <p className="stat-value text-3xl font-bold tracking-tight text-white">
                    {stat.value === "Nationwide" ? (
                      stat.value
                    ) : (
                      <AnimatedCounter
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={
                          stat.value.includes("+")
                            ? "+"
                            : stat.label === "Years Experience"
                              ? " Yrs"
                              : stat.label === "Funds Arranged"
                                ? "M+"
                                : "+"
                        }
                      />
                    )}
                  </p>
                  <p className="text-sm font-medium text-white/45">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SERVICES — Glass cards on clean background ━━━ */}
      <section className="relative bg-background py-28 sm:py-36">
        {/* Subtle background accent blobs */}
        <div
          className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full opacity-[0.03]"
          style={{ backgroundColor: "var(--gold)" }}
        />
        <div
          className="pointer-events-none absolute -left-20 bottom-40 h-64 w-64 rounded-full opacity-[0.02]"
          style={{ backgroundColor: "var(--navy)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
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
              Our Services
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              The Full
              <br />
              Capital Stack
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              From senior debt to equity, we structure the optimal funding
              solution for every stage of your development.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = iconMap[service.icon] || Building2;
              return (
                <Link
                  key={service.slug}
                  href={`/services#${service.slug}`}
                  className="glass-card group relative overflow-hidden rounded-2xl p-7"
                >
                  {/* Top accent line — reveals on hover */}
                  <div
                    className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 10%, var(--gold) 50%, transparent 90%)",
                    }}
                  />

                  {/* Corner glow on hover */}
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle, oklch(0.75 0.12 85 / 0.08), transparent 70%)",
                    }}
                  />

                  <div
                    className="mb-5 flex h-13 w-13 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.25 0.06 255 / 0.08), oklch(0.25 0.06 255 / 0.03))",
                      border: "1px solid oklch(0.25 0.06 255 / 0.06)",
                    }}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground">
                    {service.name}
                  </h3>

                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    {service.shortDesc}
                  </p>

                  <div className="mb-5 flex items-center gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        backgroundColor: "oklch(0.75 0.12 85 / 0.1)",
                        color: "var(--gold-dark)",
                      }}
                    >
                      {service.typicalRate}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {service.typicalLtv}
                    </span>
                  </div>

                  <span className="inline-flex items-center text-sm font-bold text-gold-dark transition-all duration-300 group-hover:text-gold group-hover:tracking-wide">
                    Learn More
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ WHY US — Dark section for contrast rhythm ━━━ */}
      <section
        className="noise-overlay relative overflow-hidden py-28 sm:py-36"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.16 0.05 255) 0%, oklch(0.20 0.06 255) 50%, oklch(0.16 0.05 255) 100%)",
        }}
      >
        {/* Accent glow */}
        <div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, oklch(0.75 0.12 85 / 0.06), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.3em] sm:text-sm"
              style={{ color: "var(--gold)" }}
            >
              The Difference
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Why Developers
              <br />
              Choose Us
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/50">
              We operate differently to volume brokers. Every deal receives
              senior-level attention from someone who speaks the lenders&rsquo;
              language.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {differentiators.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:translate-y-[-4px]"
                style={{
                  background: "oklch(1 0 0 / 0.04)",
                  border: "1px solid oklch(1 0 0 / 0.06)",
                }}
              >
                {/* Hover border glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    border: "1px solid oklch(0.75 0.12 85 / 0.25)",
                    boxShadow:
                      "inset 0 1px 0 oklch(0.75 0.12 85 / 0.1), 0 0 30px oklch(0.75 0.12 85 / 0.05)",
                  }}
                />

                <div
                  className="relative mb-7 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                    border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                  }}
                >
                  <item.icon
                    className="h-7 w-7"
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

      {/* ━━━ TESTIMONIALS — Social proof ━━━ */}
      <section className="relative bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
              style={{ color: "var(--gold-dark)" }}
            >
              Client Results
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Trusted by Leading
              <br />
              UK Developers
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 sm:p-10"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.97 0.003 250), oklch(0.99 0.001 85))",
                  border: "1px solid oklch(0.90 0.02 85 / 0.5)",
                }}
              >
                {/* Subtle corner accent */}
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.75 0.12 85 / 0.06), transparent 70%)",
                  }}
                />

                {/* Star rating */}
                <div className="mb-6 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-current"
                      style={{ color: "var(--gold)" }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <Quote
                  className="mb-4 h-8 w-8 opacity-15"
                  style={{ color: "var(--gold-dark)" }}
                />
                <blockquote className="mb-8 text-lg leading-relaxed text-foreground/80 sm:text-xl">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    <div
                      className="absolute -inset-px rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--gold), var(--gold-light))",
                      }}
                    />
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={56}
                      height={56}
                      className="relative rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.title}
                    </p>
                    <p
                      className="mt-0.5 text-xs font-medium"
                      style={{ color: "var(--gold-dark)" }}
                    >
                      {testimonial.project}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS — Dark editorial timeline ━━━ */}
      <section
        className="noise-overlay relative overflow-hidden py-28 sm:py-36"
        style={{
          background:
            "linear-gradient(170deg, oklch(0.14 0.04 255) 0%, oklch(0.19 0.06 255) 50%, oklch(0.15 0.05 260) 100%)",
        }}
      >
        {/* Architectural grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="process-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#process-grid)" />
          </svg>
        </div>

        {/* Dramatic gold glow — off-center */}
        <div
          className="pointer-events-none absolute -left-32 top-1/3"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(ellipse, oklch(0.75 0.12 85 / 0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header — right-aligned to break the pattern */}
          <div className="mb-20 flex flex-col items-end text-right">
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.3em] sm:text-sm"
              style={{ color: "var(--gold)" }}
            >
              The Process
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Three Steps to
              <br />
              <span className="gold-gradient-text italic">Funding</span>
            </h2>
            <div
              className="mt-6 h-[2px] w-20"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold-light), var(--gold))",
              }}
            />
          </div>

          {/* Steps — staggered editorial layout */}
          <div className="relative">
            {/* Vertical connecting line — left edge on desktop */}
            <div
              className="pointer-events-none absolute bottom-0 left-[2.25rem] top-0 hidden w-px lg:block"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, oklch(0.75 0.12 85 / 0.3) 15%, oklch(0.75 0.12 85 / 0.3) 85%, transparent 100%)",
              }}
            />

            <div className="space-y-6 lg:space-y-0">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="group relative lg:flex lg:items-start lg:gap-12"
                  style={{
                    paddingLeft: "0",
                  }}
                >
                  {/* Large watermark number — decorative */}
                  <div
                    className="pointer-events-none absolute -top-4 right-0 select-none text-[8rem] font-bold leading-none tracking-tighter opacity-[0.04] sm:text-[10rem] lg:-top-8"
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      color: "var(--gold)",
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Left column — number node + icon */}
                  <div className="relative mb-6 flex items-center gap-5 lg:mb-0 lg:w-[4.5rem] lg:shrink-0 lg:flex-col lg:items-center lg:gap-4">
                    {/* Gold node on the timeline */}
                    <div
                      className="relative z-10 flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.2), oklch(0.75 0.12 85 / 0.08))",
                        border: "1px solid oklch(0.75 0.12 85 / 0.25)",
                        boxShadow:
                          "0 0 30px oklch(0.75 0.12 85 / 0.08), inset 0 1px 0 oklch(0.75 0.12 85 / 0.15)",
                      }}
                    >
                      <span
                        className="text-2xl font-bold"
                        style={{ color: "var(--gold)" }}
                      >
                        {step.number}
                      </span>
                    </div>
                    <step.icon
                      className="h-5 w-5 lg:mt-1"
                      style={{ color: "oklch(0.75 0.12 85 / 0.4)" }}
                    />
                  </div>

                  {/* Right column — content card with stagger */}
                  <div
                    className="relative flex-1 overflow-hidden rounded-2xl p-7 transition-all duration-500 group-hover:translate-y-[-2px] sm:p-9"
                    style={{
                      background: "oklch(1 0 0 / 0.03)",
                      border: "1px solid oklch(1 0 0 / 0.06)",
                      marginBottom: index < steps.length - 1 ? "0" : undefined,
                    }}
                  >
                    {/* Hover accent */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        border: "1px solid oklch(0.75 0.12 85 / 0.2)",
                        boxShadow: "0 0 40px oklch(0.75 0.12 85 / 0.04)",
                      }}
                    />

                    <h3 className="relative mb-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="relative max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ LOCATIONS — Dark region cards with architectural presence ━━━ */}
      <section className="relative bg-background py-24 sm:py-32">
        {/* Decorative top accent */}
        <div
          className="pointer-events-none absolute -right-60 top-0 h-[600px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.75 0.12 85 / 0.03) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header — centered with different cadence */}
          <div className="mb-16 text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <div
                className="h-px w-12"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, var(--gold))",
                }}
              />
              <p
                className="text-xs font-bold uppercase tracking-[0.3em] sm:text-sm"
                style={{ color: "var(--gold-dark)" }}
              >
                Nationwide Coverage
              </p>
              <div
                className="h-px w-12"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gold), transparent)",
                }}
              />
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Finance in
              <br />
              <span className="gold-gradient-text italic">Every Region</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                region: "London & South East",
                count: 6,
                links: [
                  { href: "/locations/greater-london", label: "London" },
                  { href: "/locations/kent", label: "Kent" },
                  { href: "/locations/surrey", label: "Surrey" },
                  { href: "/locations/essex", label: "Essex" },
                  { href: "/locations/hampshire", label: "Hampshire" },
                  { href: "/locations/hertfordshire", label: "Hertfordshire" },
                ],
              },
              {
                region: "Midlands & North",
                count: 6,
                links: [
                  { href: "/locations/west-midlands", label: "West Midlands" },
                  { href: "/locations/greater-manchester", label: "Manchester" },
                  { href: "/locations/west-yorkshire", label: "West Yorkshire" },
                  { href: "/locations/lancashire", label: "Lancashire" },
                  { href: "/locations/nottinghamshire", label: "Nottinghamshire" },
                  { href: "/locations/derbyshire", label: "Derbyshire" },
                ],
              },
              {
                region: "South & East",
                count: 6,
                links: [
                  { href: "/locations/city-of-bristol", label: "Bristol" },
                  { href: "/locations/devon", label: "Devon" },
                  { href: "/locations/oxfordshire", label: "Oxfordshire" },
                  { href: "/locations/cambridgeshire", label: "Cambridgeshire" },
                  { href: "/locations/norfolk", label: "Norfolk" },
                  { href: "/locations/dorset", label: "Dorset" },
                ],
              },
              {
                region: "Scotland & Wales",
                count: 6,
                links: [
                  { href: "/locations/edinburgh", label: "Edinburgh" },
                  { href: "/locations/glasgow", label: "Glasgow" },
                  { href: "/locations/cardiff", label: "Cardiff" },
                  { href: "/locations/aberdeen", label: "Aberdeen" },
                  { href: "/locations/swansea", label: "Swansea" },
                  { href: "/locations/fife", label: "Fife" },
                ],
              },
            ].map((group) => (
              <div
                key={group.region}
                className="group relative overflow-hidden rounded-2xl p-7 transition-all duration-500 hover:translate-y-[-3px] sm:p-8"
                style={{
                  background:
                    "linear-gradient(145deg, oklch(0.16 0.05 255), oklch(0.21 0.06 255))",
                  border: "1px solid oklch(1 0 0 / 0.06)",
                }}
              >
                {/* Top gold accent line */}
                <div
                  className="absolute inset-x-0 top-0 h-[2px] transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 5%, var(--gold) 30%, var(--gold) 70%, transparent 95%)",
                    opacity: 0.4,
                  }}
                />

                {/* Architectural grid pattern — subtle */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
                  <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern
                        id={`loc-grid-${group.region.replace(/\s+/g, "")}`}
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                          stroke="white"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill={`url(#loc-grid-${group.region.replace(/\s+/g, "")})`}
                    />
                  </svg>
                </div>

                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.75 0.12 85 / 0.1), transparent 70%)",
                  }}
                />

                {/* Hover border upgrade */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    border: "1px solid oklch(0.75 0.12 85 / 0.2)",
                    boxShadow:
                      "0 20px 60px oklch(0 0 0 / 0.3), 0 0 30px oklch(0.75 0.12 85 / 0.05)",
                  }}
                />

                {/* Region header */}
                <div className="relative mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.2), oklch(0.75 0.12 85 / 0.08))",
                        border: "1px solid oklch(0.75 0.12 85 / 0.15)",
                      }}
                    >
                      <MapPin
                        className="h-5 w-5"
                        style={{ color: "var(--gold)" }}
                      />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-white">
                      {group.region}
                    </h3>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold"
                    style={{
                      background: "oklch(0.75 0.12 85 / 0.12)",
                      color: "var(--gold)",
                      border: "1px solid oklch(0.75 0.12 85 / 0.15)",
                    }}
                  >
                    {group.count} areas
                  </span>
                </div>

                {/* Links as styled list */}
                <div className="relative grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group/link flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
                    >
                      <ChevronRight
                        className="h-3.5 w-3.5 transition-all duration-300 group-hover/link:translate-x-0.5"
                        style={{ color: "oklch(0.75 0.12 85 / 0.4)" }}
                      />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-border/60 px-8 text-sm font-semibold transition-all duration-300 hover:border-gold/40 hover:text-gold-dark"
            >
              <Link href="/locations">
                View All Locations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ━━━ CTA BANNER — Full gold impact ━━━ */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        {/* Rich multi-stop gold gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.70 0.14 80) 0%, oklch(0.76 0.13 85) 35%, oklch(0.80 0.11 90) 65%, oklch(0.72 0.13 82) 100%)",
          }}
        />

        {/* Noise texture */}
        <div className="noise-overlay absolute inset-0" />

        {/* Decorative pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="cta-dots"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-dots)" />
          </svg>
        </div>

        {/* Diagonal navy accent lines */}
        <div
          className="pointer-events-none absolute -left-20 top-0 h-[130%] w-px origin-top-left rotate-[18deg]"
          style={{ backgroundColor: "var(--navy-dark)", opacity: 0.1 }}
        />
        <div
          className="pointer-events-none absolute left-1/3 top-0 h-[130%] w-px origin-top-left rotate-[18deg]"
          style={{ backgroundColor: "var(--navy-dark)", opacity: 0.05 }}
        />
        <div
          className="pointer-events-none absolute right-1/4 top-0 h-[130%] w-px origin-top-right -rotate-[18deg]"
          style={{ backgroundColor: "var(--navy-dark)", opacity: 0.05 }}
        />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: "var(--navy-dark)" }}
          >
            Ready to Fund
            <br />
            Your Development?
          </h2>
          <p
            className="mx-auto mt-5 max-w-xl text-lg"
            style={{ color: "var(--navy)", opacity: 0.6 }}
          >
            Submit your deal in minutes. Our team will come back to you with
            indicative terms within 24 hours.
          </p>
          <div className="mt-12">
            <Button
              asChild
              size="lg"
              className="bg-navy text-white hover:bg-navy-dark h-14 px-12 text-base font-bold shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_oklch(0.25_0.06_255/0.4)]"
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
