import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  CTAButton,
  EditorialSection,
  Eyebrow,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { CASE_STUDIES } from "@/lib/case-studies";
import { SERVICES } from "@/lib/services";
import { CONTACT, STATS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real development finance deals we've structured for UK property developers. See how we source funding across the capital stack.",
};

export default function CaseStudiesPage() {
  const featured = CASE_STUDIES.filter((cs) => cs.isFeatured);
  const rest = CASE_STUDIES.filter((cs) => !cs.isFeatured);

  return (
    <>
      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Case Studies" }]}
        eyebrow="Case book"
        title={
          <>
            Real deals.
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              Real numbers.
            </span>
          </>
        }
        deck={
          <>
            A selection of transactions from our desk. Different locations,
            different capital structures &mdash; the common thread is a
            broker who worked the file personally.
          </>
        }
        stats={[
          { label: "Case book", value: `${CASE_STUDIES.length} deals` },
          { label: "Total GDV", value: "£24M+" },
          { label: "Arranged (firm)", value: `£${STATS.fundsArranged}` },
        ]}
        actions={
          <CTAButton href="/deal-room" variant="navy" size="lg">
            Start a deal
          </CTAButton>
        }
      />

      {/* ━━━ Featured — full-width editorial treatment ━━━ */}
      {featured.map((cs, idx) => (
        <EditorialSection
          key={cs.slug}
          tone={idx % 2 === 0 ? "stone" : "paper"}
        >
          <article className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow tone={idx % 2 === 0 ? "stone" : "paper"} className="mb-5">
                {String(idx + 1).padStart(2, "0")} &middot; {cs.projectType}
              </Eyebrow>
              <h2
                className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-[3rem]"
                style={{ color: "var(--navy-dark)" }}
              >
                {cs.title}
              </h2>
              <p
                className="mt-4 text-[13px] font-medium uppercase tracking-[0.22em]"
                style={{ color: "oklch(0.50 0.02 255)" }}
              >
                {cs.location} &middot; {cs.county}
              </p>
              <p
                className="mt-8 max-w-[52ch] text-[17px] leading-[1.7]"
                style={{ color: "oklch(0.35 0.04 255)" }}
              >
                {cs.description}
              </p>
              <div className="mt-10">
                <Link
                  href={`/case-studies/${cs.slug}`}
                  className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "var(--navy-dark)" }}
                >
                  <span className="editorial-link">Read the full case file</span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: "var(--gold-dark)" }}
                  />
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <dl className="space-y-6 border-t border-b py-6" style={{ borderColor: "var(--stone-dark)" }}>
                {[
                  { label: "GDV", value: cs.gdv },
                  { label: "Facility", value: cs.loanAmount },
                  { label: "Product", value: cs.loanType },
                  { label: "Structure", value: cs.ltv },
                ].map((metric) => (
                  <div key={metric.label} className="flex items-baseline justify-between gap-6">
                    <dt
                      className="text-[11px] font-medium uppercase tracking-[0.24em]"
                      style={{ color: "oklch(0.50 0.02 255)" }}
                    >
                      {metric.label}
                    </dt>
                    <dd
                      className="numeral-tabular font-heading text-xl font-medium tracking-tight"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </article>
        </EditorialSection>
      ))}

      {/* ━━━ Rest of case book — tighter editorial list ━━━ */}
      {rest.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="Further examples"
            title="The rest of the case book."
            body="A shorter read on each &mdash; same structuring discipline, different deal shapes."
          />
          <ul
            className="mt-14 border-t"
            style={{ borderColor: "var(--stone-dark)" }}
          >
            {rest.map((cs) => (
              <li
                key={cs.slug}
                className="border-b"
                style={{ borderColor: "var(--stone-dark)" }}
              >
                <Link
                  href={`/case-studies/${cs.slug}`}
                  className="group grid grid-cols-12 items-baseline gap-4 py-8 transition-colors hover:bg-[oklch(0.75_0.12_85/0.04)] sm:gap-8"
                >
                  <div className="col-span-12 sm:col-span-5">
                    <p
                      className="text-[11px] font-medium uppercase tracking-[0.24em]"
                      style={{ color: "oklch(0.50 0.02 255)" }}
                    >
                      {cs.location} &middot; {cs.projectType}
                    </p>
                    <h3
                      className="font-heading mt-2 text-2xl font-medium tracking-tight"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {cs.title}
                    </h3>
                  </div>
                  <p
                    className="col-span-12 text-[15px] leading-relaxed sm:col-span-4"
                    style={{ color: "oklch(0.40 0.03 255)" }}
                  >
                    {cs.description}
                  </p>
                  <div className="col-span-12 flex items-baseline justify-between gap-4 sm:col-span-3 sm:justify-end sm:text-right">
                    <div>
                      <p
                        className="numeral-tabular font-heading text-lg font-medium tracking-tight"
                        style={{ color: "var(--navy-dark)" }}
                      >
                        {cs.gdv}
                      </p>
                      <p
                        className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em]"
                        style={{ color: "oklch(0.50 0.02 255)" }}
                      >
                        {cs.ltv}
                      </p>
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: "var(--gold-dark)" }}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </EditorialSection>
      )}

      {/* ━━━ Related services strip ━━━ */}
      <EditorialSection tone="stone">
        <SectionHeader
          tone="stone"
          eyebrow="Products used across these deals"
          title="Explore the full capital stack."
          body="Every scheme uses a different combination of products. The full range of facilities we structure is set out below."
        />
        <div
          className="mt-14 grid grid-cols-1 gap-px border-y sm:grid-cols-2 lg:grid-cols-4"
          style={{
            borderColor: "var(--stone-dark)",
            backgroundColor: "var(--stone-dark)",
          }}
        >
          {SERVICES.slice(0, 4).map((svc) => (
            <Link
              key={svc.slug}
              href={`/services/${svc.slug}`}
              className="group flex flex-col gap-3 p-8 transition-colors hover:bg-[oklch(0.75_0.12_85/0.05)]"
              style={{ background: "var(--stone)" }}
            >
              <h3
                className="font-heading text-lg font-medium leading-tight tracking-tight"
                style={{ color: "var(--navy-dark)" }}
              >
                {svc.name}
              </h3>
              <p
                className="text-[14px] leading-[1.55]"
                style={{ color: "oklch(0.42 0.03 255)" }}
              >
                {svc.shortDesc}
              </p>
              <p
                className="numeral-tabular mt-auto text-[13px] font-medium"
                style={{ color: "var(--gold-dark)" }}
              >
                {svc.typicalRate} &middot; {svc.typicalLtv}
              </p>
            </Link>
          ))}
        </div>
      </EditorialSection>

      {/* ━━━ CTA ━━━ */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Start a deal"
          title={
            <>
              Your deal could be
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                case no. {CASE_STUDIES.length + 1}.
              </span>
            </>
          }
          body="Submit the outline and we'll come back with indicative terms from the right lenders inside a day. No commitment, no hard credit search."
        />
        <div className="mt-12 flex flex-wrap items-center gap-5">
          <CTAButton href="/deal-room" variant="gold" size="lg">
            Start a deal
          </CTAButton>
          <a
            href={`tel:${CONTACT.phoneRaw}`}
            className="numeral-tabular editorial-link inline-flex h-14 items-center text-lg font-medium tracking-tight"
            style={{ color: "oklch(1 0 0 / 0.95)" }}
          >
            Or call {CONTACT.phone}
          </a>
        </div>
      </EditorialSection>
    </>
  );
}
