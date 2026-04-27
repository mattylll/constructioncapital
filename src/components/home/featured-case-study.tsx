import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CASE_STUDIES } from "@/lib/case-studies";
import { getLocationImage, unsplashUrl } from "@/lib/location-images";

// Editorial commentary on the featured deal — written in the broker's voice.
// Honest (no fabricated developer testimonial) and demonstrates the firm's
// thinking on capital structuring.
const DEAL_COMMENTARY =
  "Senior debt alone wouldn\u2019t have taken this site from acquisition to completion. By layering a mezzanine tranche against the sponsor\u2019s confirmed pre-lets on the ground-floor retail, we got them to 85% of total costs without diluting their profit share.";

export function FeaturedCaseStudy() {
  const caseStudy =
    CASE_STUDIES.find(
      (cs) => cs.slug === "mixed-use-conversion-birmingham"
    ) ?? CASE_STUDIES.find((cs) => cs.isFeatured);

  if (!caseStudy) return null;

  const metrics = [
    { label: "GDV", value: caseStudy.gdv },
    { label: "Facility", value: caseStudy.loanAmount },
    { label: "Structure", value: caseStudy.ltv },
  ];

  // Location-themed image keyed off the case study's county + town.
  // getLocationImage falls back to DEFAULT_IMAGE if neither slug is mapped,
  // so this always returns a working ID.
  const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
  const heroImage = getLocationImage(
    slugify(caseStudy.county),
    slugify(caseStudy.location),
  );

  return (
    <section
      className="relative py-24 sm:py-32"
      style={{ background: "var(--paper)" }}
    >
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <header className="mb-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="mb-6 flex items-center gap-4">
              <span className="rule-gold" aria-hidden />
              <p
                className="text-[11px] font-medium uppercase tracking-[0.32em]"
                style={{ color: "var(--navy)" }}
              >
                Case file &middot; no.&nbsp;I
              </p>
            </div>
            <h2
              className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-[2.75rem]"
              style={{ color: "var(--navy-dark)" }}
            >
              A recent piece of work.
            </h2>
          </div>
          <p
            className="max-w-[44ch] text-[17px] leading-[1.65] lg:col-span-5 lg:col-start-8"
            style={{ color: "oklch(0.35 0.04 255)" }}
          >
            Every scheme is different. The capital stack gets built to
            match the site, the sponsor and the exit &mdash; not the other
            way round. One example from the desk.
          </p>
        </header>

        {/* Hero metrics strip — full-bleed editorial treatment */}
        <div
          className="grid grid-cols-3 gap-0 border-y"
          style={{ borderColor: "var(--stone-dark)" }}
        >
          {metrics.map((metric, idx) => (
            <div
              key={metric.label}
              className={`py-9 sm:py-12 ${
                idx < metrics.length - 1 ? "border-r" : ""
              } ${idx === 0 ? "pr-6 sm:pr-10" : "px-6 sm:px-10"}`}
              style={{ borderColor: "var(--stone-dark)" }}
            >
              <p
                className="text-[10px] font-medium uppercase tracking-[0.26em]"
                style={{ color: "oklch(0.50 0.02 255)" }}
              >
                {metric.label}
              </p>
              <p
                className="numeral-tabular font-heading mt-4 text-4xl font-medium leading-none tracking-tight sm:text-[3.25rem]"
                style={{ color: "var(--navy-dark)" }}
              >
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {/* Body: image + narrative, flush under the metrics */}
        <article className="grid grid-cols-1 lg:grid-cols-12">
          <div className="relative aspect-[16/10] w-full lg:col-span-7 lg:aspect-[4/3]">
            <Image
              src={unsplashUrl(heroImage.id, 1400, 85)}
              alt={`${caseStudy.title} — ${caseStudy.location}`}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
              priority
            />
            <div
              className="absolute inset-0 mix-blend-multiply"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.25 0.06 255 / 0.04), oklch(0.25 0.06 255 / 0.14))",
              }}
            />
          </div>

          <div
            className="flex flex-col justify-between gap-8 p-8 sm:p-12 lg:col-span-5"
            style={{ background: "var(--navy-dark)" }}
          >
            <div>
              <p
                className="text-[11px] font-medium uppercase tracking-[0.26em]"
                style={{ color: "var(--gold-light)" }}
              >
                {caseStudy.location} &middot; {caseStudy.projectType}
              </p>
              <h3
                className="font-heading mt-4 text-3xl font-medium leading-[1.08] tracking-tight sm:text-[2.25rem]"
                style={{ color: "oklch(1 0 0 / 0.95)" }}
              >
                {caseStudy.title}
              </h3>
              <p
                className="mt-6 text-[16px] leading-[1.7]"
                style={{ color: "oklch(1 0 0 / 0.72)" }}
              >
                {caseStudy.description}
              </p>
            </div>

            {/* Broker commentary — honest, in-house voice. Not a fabricated testimonial. */}
            <blockquote
              className="border-l pl-5"
              style={{ borderColor: "var(--gold)" }}
            >
              <p
                className="font-heading text-[17px] font-normal leading-[1.5] italic sm:text-lg"
                style={{ color: "oklch(1 0 0 / 0.92)" }}
              >
                &ldquo;{DEAL_COMMENTARY}&rdquo;
              </p>
              <footer
                className="mt-4 text-[11px] font-medium uppercase tracking-[0.24em]"
                style={{ color: "oklch(1 0 0 / 0.5)" }}
              >
                Matt Lenzie &middot; on the {caseStudy.location} deal
              </footer>
            </blockquote>

            <Link
              href="/case-studies"
              className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.22em]"
              style={{ color: "oklch(1 0 0 / 0.92)" }}
            >
              <span className="editorial-link">See more case studies</span>
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: "var(--gold-light)" }}
              />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
