import Link from "next/link";

import { EditorialHero } from "@/components/home/editorial-hero";
import { ServiceIndex } from "@/components/home/service-index";
import { HowItWorksTimeline } from "@/components/home/how-it-works-timeline";
import { FeaturedCaseStudy } from "@/components/home/featured-case-study";
import { LenderPanel } from "@/components/home/lender-panel";
import { MarketStrip } from "@/components/home/market-strip";
import { FounderNote } from "@/components/home/founder-note";
import { HomepageEnquiryForm } from "@/components/home/homepage-enquiry-form";
import { CONTACT } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <EditorialHero />

      {/* ━━━ Positioning line ━━━ */}
      <section
        className="relative"
        style={{ background: "var(--stone)" }}
      >
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
          <div
            className="grid grid-cols-1 items-start gap-8 py-16 sm:py-20 lg:grid-cols-12 lg:gap-16"
          >
            <div className="lg:col-span-5">
              <div className="mb-5 flex items-center gap-4">
                <span className="rule-gold" aria-hidden />
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.32em]"
                  style={{ color: "var(--navy)" }}
                >
                  Positioning
                </p>
              </div>
              <p
                className="font-heading text-3xl font-medium leading-[1.15] tracking-[-0.01em] sm:text-[2.1rem]"
                style={{ color: "var(--navy-dark)" }}
              >
                Independent. Privately owned.
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  Built on repeat developers.
                </span>
              </p>
            </div>
            <p
              className="max-w-[46ch] text-[17px] leading-[1.65] lg:col-span-6 lg:col-start-7"
              style={{ color: "oklch(0.35 0.04 255)" }}
            >
              We are not a contact centre, an aggregator or a fintech
              platform. Construction Capital is a London brokerage set up
              by Matt Lenzie, who has spent 25+ years arranging property
              development finance. Every scheme is structured by the
              principal &mdash; most of Matt&rsquo;s deal flow still comes
              from developers on their second, third or fifteenth project
              with him.
            </p>
          </div>
        </div>
      </section>

      <ServiceIndex />

      <HowItWorksTimeline />

      <FeaturedCaseStudy />

      <LenderPanel />

      <MarketStrip />

      <FounderNote />

      {/* ━━━ Start a deal ━━━ */}
      <section
        className="relative py-24 sm:py-32"
        style={{ background: "oklch(0.12 0.045 255)" }}
      >
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="mb-6 flex items-center gap-4">
                <span
                  className="block h-px w-10"
                  style={{ background: "var(--gold)" }}
                  aria-hidden
                />
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.32em]"
                  style={{ color: "var(--gold)" }}
                >
                  Start a deal
                </p>
              </div>
              <h2
                className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-[2.75rem]"
                style={{ color: "oklch(1 0 0 / 0.95)" }}
              >
                Two minutes now.
                <br />
                <span className="italic" style={{ color: "var(--gold-light)" }}>
                  Terms by tomorrow.
                </span>
              </h2>
              <p
                className="mt-7 max-w-[42ch] text-[17px] leading-[1.65]"
                style={{ color: "oklch(1 0 0 / 0.6)" }}
              >
                Send us the outline of your deal &mdash; site, scheme,
                sponsor, what you need. We&rsquo;ll come back with
                indicative terms from the right lenders within one working
                day. No commitment, no hard credit search.
              </p>

              <dl
                className="mt-10 space-y-5 border-t pt-8"
                style={{ borderColor: "oklch(1 0 0 / 0.08)" }}
              >
                <div>
                  <dt
                    className="text-[10px] font-medium uppercase tracking-[0.24em]"
                    style={{ color: "oklch(1 0 0 / 0.5)" }}
                  >
                    Direct line
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${CONTACT.phoneRaw}`}
                      className="numeral-tabular editorial-link font-heading text-2xl font-medium tracking-tight"
                      style={{ color: "oklch(1 0 0 / 0.95)" }}
                    >
                      {CONTACT.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt
                    className="text-[10px] font-medium uppercase tracking-[0.24em]"
                    style={{ color: "oklch(1 0 0 / 0.5)" }}
                  >
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="editorial-link text-base"
                      style={{ color: "oklch(1 0 0 / 0.9)" }}
                    >
                      {CONTACT.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7">
              <div
                className="p-8 sm:p-10"
                style={{
                  background: "oklch(1 0 0 / 0.03)",
                  border: "1px solid oklch(1 0 0 / 0.07)",
                }}
              >
                <HomepageEnquiryForm />
                <p
                  className="mt-6 text-[11px] leading-[1.5]"
                  style={{ color: "oklch(1 0 0 / 0.4)" }}
                >
                  By submitting this form you agree to be contacted regarding
                  your enquiry. Your details are never shared with third
                  parties without your consent.{" "}
                  <Link
                    href="/privacy"
                    className="editorial-link"
                    style={{ color: "oklch(1 0 0 / 0.65)" }}
                  >
                    Privacy policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
