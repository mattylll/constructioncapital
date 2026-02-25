import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { GUIDES } from "@/lib/guides";
import { GuidesGrid } from "./guides-grid";

export const metadata: Metadata = {
  title: `Property Development Finance Guides | ${SITE_NAME}`,
  description:
    "In-depth guides to UK property development finance. Learn about development finance, bridging loans, mezzanine, GDV calculations, and how to fund your next project.",
  alternates: {
    canonical: `${SITE_URL}/guides`,
  },
  openGraph: {
    title: `Property Development Finance Guides | ${SITE_NAME}`,
    description:
      "In-depth guides to UK property development finance covering every funding type.",
    url: `${SITE_URL}/guides`,
    type: "website",
  },
};

export default function GuidesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient noise-overlay relative overflow-hidden py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="guides-hero-grid"
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
            <rect width="100%" height="100%" fill="url(#guides-hero-grid)" />
          </svg>
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "800px",
            height: "600px",
            background:
              "radial-gradient(ellipse, oklch(0.75 0.12 85 / 0.08) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="mb-8 h-[2px] w-20"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />

          <p
            className="mb-5 text-xs font-bold uppercase tracking-[0.35em] sm:text-sm"
            style={{ color: "var(--gold)" }}
          >
            Knowledge Base
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Development Finance{" "}
            <span className="gold-gradient-text italic">Guides</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            In-depth guides to every aspect of property development finance in
            the UK. Written by practitioners, not copywriters.
          </p>

          <p className="mt-3 text-sm text-white/40">
            {GUIDES.length} articles across {new Set(GUIDES.map(g => g.category)).size} topics
          </p>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--gold) 20%, var(--gold) 80%, transparent 100%)",
            opacity: 0.35,
          }}
        />
      </section>

      {/* Guides Grid with Category Filtering */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GuidesGrid guides={GUIDES} />
        </div>
      </section>

      {/* CTA */}
      <section
        className="noise-overlay relative overflow-hidden py-16 sm:py-20"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.08) 0%, oklch(0.75 0.12 85 / 0.04) 100%)",
        }}
      >
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <BookOpen
            className="mx-auto mb-4 h-10 w-10"
            style={{ color: "var(--gold)" }}
          />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to Start Your Project?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Our guides give you the knowledge. Our brokers give you the funding.
            Tell us about your deal and we&apos;ll source the best terms from
            100+ lenders.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="cta-shimmer h-14 bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
            >
              <Link href="/deal-room">
                Start Your Deal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
