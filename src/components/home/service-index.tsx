import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    slug: "development-finance",
    name: "Development Finance",
    description:
      "Senior debt for ground-up residential and commercial schemes.",
    headline: "From 6.5% p.a.",
    meta: "Up to 65–70% LTGDV",
  },
  {
    slug: "mezzanine-finance",
    name: "Mezzanine Finance",
    description:
      "Stretch your capital stack beyond senior debt without giving up control.",
    headline: "From 12% p.a.",
    meta: "Up to 85–90% LTGDV",
  },
  {
    slug: "bridging-loans",
    name: "Bridging Loans",
    description:
      "Short-term finance for acquisitions, auctions, and chain breaks.",
    headline: "From 0.55% p.m.",
    meta: "Up to 75% LTV",
  },
  {
    slug: "equity-jv",
    name: "Equity & Joint Ventures",
    description:
      "Equity partners and JV structures for up to 100% of project costs.",
    headline: "Profit share from 40%",
    meta: "Land-only contributions considered",
  },
  {
    slug: "refurbishment-finance",
    name: "Refurbishment Finance",
    description:
      "Light and heavy refurbishment funding with staged drawdowns.",
    headline: "From 0.65% p.m.",
    meta: "Up to 75% LTV",
  },
  {
    slug: "development-exit-finance",
    name: "Development Exit",
    description:
      "Refinance development debt while units sell — release equity faster.",
    headline: "From 0.55% p.m.",
    meta: "Title restrictions released on drawdown",
  },
];

export function ServiceIndex() {
  return (
    <section
      className="relative py-24 sm:py-32"
      style={{ background: "var(--navy-dark)" }}
    >
      {/* Subtle gold glow — just enough to break flat navy */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, oklch(0.75 0.12 85 / 0.05) 0%, transparent 45%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 sm:px-10">
        <header className="mb-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
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
                What we arrange
              </p>
            </div>
            <h2
              className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-[2.75rem]"
              style={{ color: "oklch(1 0 0 / 0.95)" }}
            >
              The full capital stack,
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                one broker.
              </span>
            </h2>
          </div>
          <p
            className="max-w-[40ch] text-[17px] leading-[1.65] lg:col-span-6 lg:col-start-7"
            style={{ color: "oklch(1 0 0 / 0.7)" }}
          >
            Every layer a UK developer needs &mdash; senior debt, stretch
            senior, mezzanine, bridging, equity and exit. We structure the
            stack, run the process, and take calls from credit committees
            ourselves. You build.
          </p>
        </header>

        <ul
          className="border-t"
          style={{ borderColor: "oklch(1 0 0 / 0.12)" }}
        >
          {services.map((service) => (
            <li
              key={service.slug}
              className="border-b"
              style={{ borderColor: "oklch(1 0 0 / 0.08)" }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group grid grid-cols-12 items-baseline gap-4 py-7 transition-colors hover:bg-[oklch(1_0_0_/_0.03)] sm:gap-8 sm:py-9"
              >
                <h3
                  className="font-heading col-span-12 text-2xl font-medium tracking-tight sm:col-span-5 sm:text-[1.8rem]"
                  style={{ color: "oklch(1 0 0 / 0.95)" }}
                >
                  {service.name}
                </h3>
                <p
                  className="col-span-12 text-base leading-relaxed sm:col-span-4 sm:text-[15px]"
                  style={{ color: "oklch(1 0 0 / 0.6)" }}
                >
                  {service.description}
                </p>
                <div className="col-span-12 flex items-baseline justify-between gap-4 sm:col-span-3 sm:justify-end sm:text-right">
                  <div>
                    <p
                      className="numeral-tabular font-heading text-lg font-medium tracking-tight"
                      style={{ color: "var(--gold-light)" }}
                    >
                      {service.headline}
                    </p>
                    <p
                      className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em]"
                      style={{ color: "oklch(1 0 0 / 0.45)" }}
                    >
                      {service.meta}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: "var(--gold)" }}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
