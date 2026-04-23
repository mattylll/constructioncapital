import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CONTACT, STATS } from "@/lib/constants";
import { SITE_IMAGES, unsplashUrl } from "@/lib/location-images";

const anchorServices = [
  { slug: "development-finance", label: "Development Finance" },
  { slug: "mezzanine-finance", label: "Mezzanine" },
  { slug: "bridging-loans", label: "Bridging" },
  { slug: "equity-jv", label: "Equity & JV" },
  { slug: "refurbishment-finance", label: "Refurbishment" },
  { slug: "development-exit-finance", label: "Development Exit" },
];

export function EditorialHero() {
  return (
    <>
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-12 px-6 pb-20 pt-24 sm:px-10 sm:pb-28 sm:pt-32 lg:grid-cols-12 lg:gap-20 lg:pb-32 lg:pt-40">
          {/* Left column — text */}
          <div className="lg:col-span-7">
            <div className="animate-fade-up">
              <div className="mb-8 flex items-center gap-4">
                <span className="rule-gold" aria-hidden />
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.32em]"
                  style={{ color: "var(--navy)" }}
                >
                  Independent development finance &middot; London
                </p>
              </div>

              <h1
                className="font-heading text-[clamp(3.25rem,8vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.025em]"
                style={{ color: "var(--navy-dark)" }}
              >
                Development finance,
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  quietly arranged.
                </span>
              </h1>

              <p
                className="mt-10 max-w-[38rem] text-[18px] leading-[1.6] sm:text-[19px]"
                style={{ color: "oklch(0.35 0.04 255)" }}
              >
                Senior debt, mezzanine and equity for UK property
                developers. One call, a panel of {STATS.lenderPanel}{" "}
                lenders, indicative terms inside a day. No scripts, no
                decks &mdash; just a broker who&rsquo;s done this for{" "}
                {STATS.yearsExperience} years.
              </p>

              <div className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
                <Link
                  href="/deal-room"
                  className="group inline-flex h-14 items-center gap-2 px-8 text-[13px] font-semibold uppercase tracking-[0.22em] transition-colors"
                  style={{
                    background: "var(--navy-dark)",
                    color: "var(--background)",
                  }}
                >
                  Start a deal
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <div className="flex flex-col">
                  <span
                    className="text-[11px] font-medium uppercase tracking-[0.24em]"
                    style={{ color: "oklch(0.45 0.03 255)" }}
                  >
                    Or call
                  </span>
                  <a
                    href={`tel:${CONTACT.phoneRaw}`}
                    className="numeral-tabular editorial-link mt-1 text-xl font-medium tracking-tight"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {CONTACT.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Stat line */}
            <dl
              className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t pt-8"
              style={{ borderColor: "oklch(0.85 0.01 250)" }}
            >
              {[
                { term: "Arranged", value: `£${STATS.fundsArranged}` },
                { term: "Lender panel", value: STATS.lenderPanel },
                { term: "Terms", value: "24hr" },
              ].map((item) => (
                <div key={item.term}>
                  <dt
                    className="text-[10px] font-medium uppercase tracking-[0.24em]"
                    style={{ color: "oklch(0.50 0.02 255)" }}
                  >
                    {item.term}
                  </dt>
                  <dd
                    className="numeral-tabular font-heading mt-2 text-3xl font-medium tracking-tight sm:text-[2rem]"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right column — image. Larger than iteration 2, in a 3/4 portrait frame. */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src={unsplashUrl(SITE_IMAGES["case-studies-hero"].id, 1400, 85)}
                alt="Completed UK residential development scheme"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 mix-blend-multiply"
                style={{
                  background:
                    "linear-gradient(180deg, oklch(0.25 0.06 255 / 0.06) 0%, oklch(0.25 0.06 255 / 0.22) 100%)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 h-12 w-[2px]"
                style={{ background: "var(--gold)" }}
                aria-hidden
              />
            </div>
            <p
              className="mt-4 text-[11px] font-medium uppercase tracking-[0.24em]"
              style={{ color: "oklch(0.50 0.02 255)" }}
            >
              Deals arranged nationwide &mdash; London to the North West
            </p>
          </div>
        </div>
      </section>

      {/* Service anchor strip — magazine-style jump nav between hero and positioning. */}
      <nav
        aria-label="Services"
        className="relative border-y"
        style={{
          borderColor: "oklch(0.85 0.01 250)",
          background: "var(--paper)",
        }}
      >
        <div className="mx-auto max-w-[1360px] px-6 sm:px-10">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 py-5 sm:gap-x-10">
            <li
              className="text-[10px] font-medium uppercase tracking-[0.3em]"
              style={{ color: "var(--gold-dark)" }}
            >
              What we arrange
            </li>
            {anchorServices.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-[13px] font-medium tracking-tight transition-colors"
                  style={{ color: "oklch(0.32 0.04 255)" }}
                >
                  {service.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
