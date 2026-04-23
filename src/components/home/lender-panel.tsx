import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const lenderCategories = [
  {
    label: "High-street banks",
    note: "Competitive pricing for established sponsors.",
  },
  {
    label: "Challenger banks",
    note: "Faster credit cycles, digital drawdown tracking.",
  },
  {
    label: "Specialist development lenders",
    note: "Sector expertise, flexibility on complex sites.",
  },
  {
    label: "Mezzanine & stretch senior",
    note: "Higher leverage without full equity dilution.",
  },
  {
    label: "Family offices",
    note: "Bespoke structures, rapid decisions, equity co-invest.",
  },
  {
    label: "Institutional debt funds",
    note: "Scale capital for £15M+ schemes.",
  },
  {
    label: "Bridging specialists",
    note: "Completion in days for time-critical acquisitions.",
  },
];

export function LenderPanel() {
  return (
    <section
      className="relative py-24 sm:py-32"
      style={{ background: "var(--stone)" }}
    >
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <header className="mb-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-4">
              <span className="rule-gold" aria-hidden />
              <p
                className="text-[11px] font-medium uppercase tracking-[0.32em]"
                style={{ color: "var(--navy)" }}
              >
                Who we work with
              </p>
            </div>
            <h2
              className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-[2.75rem]"
              style={{ color: "var(--navy-dark)" }}
            >
              Over 100 lenders. One directory.
            </h2>
          </div>
          <p
            className="max-w-[40ch] text-[17px] leading-[1.65] lg:col-span-6 lg:col-start-7"
            style={{ color: "oklch(0.35 0.04 255)" }}
          >
            Over 100 active lenders across the full capital stack. We
            don&rsquo;t work off a price-comparison sheet &mdash; we know
            which credit committees take which deals, and we speak to them
            directly.
          </p>
        </header>

        <ul
          className="grid grid-cols-1 gap-px border-y sm:grid-cols-2 lg:grid-cols-4"
          style={{
            borderColor: "var(--stone-dark)",
            backgroundColor: "var(--stone-dark)",
          }}
        >
          {lenderCategories.map((category) => (
            <li
              key={category.label}
              className="flex flex-col gap-3 p-7"
              style={{ background: "var(--stone)" }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-[0.55rem] block h-1 w-1 flex-shrink-0 rounded-full"
                  style={{ background: "var(--gold)" }}
                  aria-hidden
                />
                <p
                  className="font-heading text-lg font-medium leading-tight tracking-tight"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {category.label}
                </p>
              </div>
              <p
                className="pl-4 text-[14px] leading-[1.55]"
                style={{ color: "oklch(0.42 0.03 255)" }}
              >
                {category.note}
              </p>
            </li>
          ))}

          {/* CTA card completing the 4×2 grid */}
          <li
            className="flex flex-col justify-between gap-4 p-7"
            style={{ background: "var(--navy-dark)" }}
          >
            <p
              className="font-heading text-lg font-medium leading-tight tracking-tight"
              style={{ color: "oklch(1 0 0 / 0.95)" }}
            >
              See the full panel &amp; lender directory.
            </p>
            <Link
              href="/lender-panel"
              className="group inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.22em]"
              style={{ color: "var(--gold-light)" }}
            >
              <span className="editorial-link">Explore all 100+ lenders</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: "var(--gold)" }}
              />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
