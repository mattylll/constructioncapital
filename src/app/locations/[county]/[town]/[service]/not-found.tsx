import Link from "next/link";
import { MapPin, ArrowLeft, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ServiceNotFound() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient noise-overlay relative overflow-hidden py-24 text-white sm:py-32">
        {/* Architectural grid background */}
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="not-found-grid"
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
            <rect width="100%" height="100%" fill="url(#not-found-grid)" />
          </svg>
        </div>

        {/* Radial glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "600px",
            height: "500px",
            background:
              "radial-gradient(ellipse, oklch(0.75 0.12 85 / 0.06) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          {/* Icon */}
          <div
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
              border: "1px solid oklch(0.75 0.12 85 / 0.2)",
            }}
          >
            <MapPin className="h-10 w-10" style={{ color: "var(--gold)" }} />
          </div>

          {/* Gold rule */}
          <div
            className="mx-auto mb-8 h-[2px] w-20"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            We Don&rsquo;t Cover
            <br />
            <span className="gold-gradient-text italic">This Area Yet</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60 sm:text-xl">
            We&rsquo;re constantly expanding our coverage across the UK.
            Although we don&rsquo;t have dedicated content for this location
            yet, we can still help with your development finance needs
            nationwide.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Button
              asChild
              size="lg"
              className="cta-shimmer h-14 bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
            >
              <Link href="/deal-room">
                <Building2 className="mr-2 h-5 w-5" />
                Submit Your Deal Anyway
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 border-white/15 bg-white/[0.04] px-8 text-base font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
            >
              <Link href="/locations">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Browse All Locations
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom gold edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--gold) 20%, var(--gold) 80%, transparent 100%)",
            opacity: 0.35,
          }}
        />
      </section>

      {/* Alternative Options */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="mx-auto mb-5 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
              What You Can Do
            </h2>
            <p className="mb-12 text-muted-foreground">
              Even though we don&rsquo;t have a dedicated page for this
              location, here are your options:
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card/70 p-6 text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                  border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                }}
              >
                <Building2 className="h-6 w-6" style={{ color: "var(--gold)" }} />
              </div>
              <h3 className="mb-2 font-bold text-foreground">Submit a Deal</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                We arrange finance nationwide, regardless of location pages.
              </p>
              <Link
                href="/deal-room"
                className="text-sm font-semibold text-gold-dark hover:text-gold"
              >
                Start Your Deal &rarr;
              </Link>
            </div>

            <div className="rounded-xl border border-border bg-card/70 p-6 text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.25 0.06 255 / 0.1), oklch(0.25 0.06 255 / 0.05))",
                  border: "1px solid oklch(0.25 0.06 255 / 0.1)",
                }}
              >
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-bold text-foreground">Browse Locations</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Explore our coverage across all UK regions.
              </p>
              <Link
                href="/locations"
                className="text-sm font-semibold text-gold-dark hover:text-gold"
              >
                View Locations &rarr;
              </Link>
            </div>

            <div className="rounded-xl border border-border bg-card/70 p-6 text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.25 0.06 255 / 0.1), oklch(0.25 0.06 255 / 0.05))",
                  border: "1px solid oklch(0.25 0.06 255 / 0.1)",
                }}
              >
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-bold text-foreground">Contact Us</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Speak directly to our team about your project.
              </p>
              <Link
                href="/contact"
                className="text-sm font-semibold text-gold-dark hover:text-gold"
              >
                Get in Touch &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        {/* Rich gold gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.70 0.14 80) 0%, oklch(0.76 0.13 85) 35%, oklch(0.80 0.11 90) 65%, oklch(0.72 0.13 82) 100%)",
          }}
        />

        {/* Noise texture */}
        <div className="noise-overlay absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            style={{ color: "var(--navy-dark)" }}
          >
            We Cover All of the UK
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-base sm:text-lg"
            style={{ color: "var(--navy)", opacity: 0.6 }}
          >
            Our lender panel funds projects nationwide. Submit your deal and
            we&rsquo;ll find the right funding, wherever your development is
            located.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="h-14 bg-navy px-12 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-navy-dark hover:shadow-[0_20px_60px_oklch(0.25_0.06_255/0.4)]"
            >
              <Link href="/deal-room">Enter the Deal Room</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
