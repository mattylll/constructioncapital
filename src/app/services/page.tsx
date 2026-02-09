import type { Metadata } from "next";
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
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/services";
import { SERVICE_POPULAR_LOCATIONS } from "@/lib/location-content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Development finance, mezzanine, bridging loans, equity & JV, refurbishment finance, commercial mortgages, and development exit finance. The full capital stack for UK property developers.",
};

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Layers,
  Clock,
  Handshake,
  Wrench,
  Landmark,
  LogOut,
};

const useCases: Record<string, string[]> = {
  "development-finance": [
    "Ground-up residential developments",
    "Commercial new builds",
    "Land acquisition with planning",
    "Phased construction projects",
  ],
  "mezzanine-finance": [
    "Reducing equity contribution",
    "Stretching the capital stack",
    "Unlocking additional projects",
    "Maximising leverage",
  ],
  "bridging-loans": [
    "Auction purchases (28-day completion)",
    "Chain breaks",
    "Pre-planning acquisitions",
    "Refurbishment bridge-to-let",
  ],
  "equity-jv": [
    "First-time developer schemes",
    "Capital-light structures",
    "Large-scale residential projects",
    "Strategic land acquisitions",
  ],
  "refurbishment-finance": [
    "Light refurbishment projects",
    "Heavy refurbishment & conversions",
    "HMO conversions",
    "Commercial-to-residential (PDR)",
  ],
  "commercial-mortgages": [
    "Office acquisitions",
    "Retail unit purchases",
    "Industrial & warehouse facilities",
    "Mixed-use investment refinancing",
  ],
  "development-exit-finance": [
    "Completed schemes with unsold units",
    "Replacing maturing development facilities",
    "Sales period bridge funding",
    "Phased unit disposal strategies",
  ],
};

export default function ServicesPage() {
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
                id="svc-grid"
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
            <rect width="100%" height="100%" fill="url(#svc-grid)" />
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

        {/* Hero image — right side accent */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <Image
            src="/images/services-hero.png"
            alt="Modern UK construction development at golden hour"
            width={960}
            height={540}
            className="h-full w-full object-cover opacity-20"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.14 0.05 255) 0%, transparent 100%)",
            }}
          />
        </div>

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
              Our Services
            </p>
            <h1 className="animate-fade-up delay-100 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              The Full
              <br />
              Capital{" "}
              <span className="gold-gradient-text italic">Stack</span>
            </h1>
            <p className="animate-fade-up delay-200 mt-7 max-w-xl text-lg leading-relaxed text-white/60">
              Seven core funding solutions covering every stage of property
              development. From land acquisition to long-term refinancing, we
              structure the optimal capital solution for your project.
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

      {/* ━━━ SERVICES DETAIL ━━━ */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {SERVICES.map((service, i) => {
              const Icon = iconMap[service.icon] || Building2;
              const cases = useCases[service.slug] || [];
              const isEven = i % 2 === 0;

              return (
                <div
                  key={service.slug}
                  id={service.slug}
                  className="scroll-mt-24"
                >
                  <div
                    className={`grid items-start gap-12 lg:grid-cols-2 ${!isEven ? "lg:[&>*:first-child]:order-2" : ""}`}
                  >
                    {/* Info card */}
                    <div
                      className="overflow-hidden rounded-2xl"
                      style={{
                        background: isEven
                          ? "linear-gradient(135deg, oklch(0.16 0.05 255), oklch(0.22 0.06 255))"
                          : "linear-gradient(135deg, oklch(0.96 0.005 250), oklch(0.98 0.002 250))",
                        border: isEven
                          ? "none"
                          : "1px solid oklch(0.90 0.01 250)",
                      }}
                    >
                      <div className="p-8 sm:p-10">
                        <div
                          className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
                          style={{
                            background: isEven
                              ? "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))"
                              : "linear-gradient(135deg, oklch(0.25 0.06 255 / 0.08), oklch(0.25 0.06 255 / 0.03))",
                            border: isEven
                              ? "1px solid oklch(0.75 0.12 85 / 0.1)"
                              : "1px solid oklch(0.25 0.06 255 / 0.06)",
                          }}
                        >
                          <Icon
                            className="h-6 w-6"
                            style={{
                              color: isEven ? "var(--gold)" : "var(--navy)",
                            }}
                          />
                        </div>

                        <h2
                          className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
                          style={{
                            color: isEven ? "white" : "var(--foreground)",
                          }}
                        >
                          {service.name}
                        </h2>

                        <p
                          className="mb-8 text-base leading-relaxed"
                          style={{
                            color: isEven
                              ? "oklch(1 0 0 / 0.55)"
                              : "var(--muted-foreground)",
                          }}
                        >
                          {service.longDesc}
                        </p>

                        {/* Key metrics */}
                        <div
                          className="grid grid-cols-3 gap-4 rounded-xl p-5"
                          style={{
                            background: isEven
                              ? "oklch(1 0 0 / 0.04)"
                              : "oklch(0.25 0.06 255 / 0.04)",
                            border: isEven
                              ? "1px solid oklch(1 0 0 / 0.06)"
                              : "1px solid oklch(0.25 0.06 255 / 0.06)",
                          }}
                        >
                          <div>
                            <p
                              className="text-xs font-bold uppercase tracking-wider"
                              style={{
                                color: isEven
                                  ? "var(--gold)"
                                  : "var(--gold-dark)",
                              }}
                            >
                              Rate
                            </p>
                            <p
                              className="mt-1 text-sm font-bold"
                              style={{
                                color: isEven ? "white" : "var(--foreground)",
                              }}
                            >
                              {service.typicalRate}
                            </p>
                          </div>
                          <div>
                            <p
                              className="text-xs font-bold uppercase tracking-wider"
                              style={{
                                color: isEven
                                  ? "var(--gold)"
                                  : "var(--gold-dark)",
                              }}
                            >
                              LTV
                            </p>
                            <p
                              className="mt-1 text-sm font-bold"
                              style={{
                                color: isEven ? "white" : "var(--foreground)",
                              }}
                            >
                              {service.typicalLtv}
                            </p>
                          </div>
                          <div>
                            <p
                              className="text-xs font-bold uppercase tracking-wider"
                              style={{
                                color: isEven
                                  ? "var(--gold)"
                                  : "var(--gold-dark)",
                              }}
                            >
                              Term
                            </p>
                            <p
                              className="mt-1 text-sm font-bold"
                              style={{
                                color: isEven ? "white" : "var(--foreground)",
                              }}
                            >
                              {service.typicalTerm}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Use cases */}
                    <div className="lg:pt-4">
                      <p
                        className="mb-6 text-xs font-bold uppercase tracking-[0.2em]"
                        style={{ color: "var(--gold-dark)" }}
                      >
                        Typical Use Cases
                      </p>

                      <div className="space-y-4">
                        {cases.map((useCase) => (
                          <div
                            key={useCase}
                            className="flex items-start gap-4 rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-gold/20 hover:shadow-sm"
                          >
                            <div
                              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                              style={{
                                background:
                                  "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                              }}
                            >
                              <Check
                                className="h-3.5 w-3.5"
                                style={{ color: "var(--gold-dark)" }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {useCase}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8">
                        <Button
                          asChild
                          variant="outline"
                          className="border-gold/30 text-gold-dark hover:bg-gold/5 hover:text-gold-dark font-semibold"
                        >
                          <Link href="/deal-room">
                            Apply for {service.name}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>

                      {/* Location cross-links */}
                      {SERVICE_POPULAR_LOCATIONS[service.slug] && (
                        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Popular:
                          </span>
                          {SERVICE_POPULAR_LOCATIONS[service.slug].map(
                            (loc) => (
                              <Link
                                key={loc.town}
                                href={`/locations/${loc.county}/${loc.town}/${service.slug}`}
                                className="text-xs font-medium transition-colors duration-200"
                                style={{ color: "var(--gold-dark)" }}
                              >
                                {loc.label}
                              </Link>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
            Not Sure Which
            <br />
            Product Fits?
          </h2>
          <p
            className="mx-auto mt-5 max-w-xl text-lg"
            style={{ color: "var(--navy)", opacity: 0.6 }}
          >
            Tell us about your deal and we&rsquo;ll recommend the right
            structure. Most deals use a combination of products to optimise
            leverage and cost.
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
