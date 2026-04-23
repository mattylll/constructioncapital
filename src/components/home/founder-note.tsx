import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CONTACT } from "@/lib/constants";

export function FounderNote() {
  return (
    <section
      className="relative py-20 sm:py-28"
      style={{ background: "var(--navy-dark)" }}
    >
      {/* Gold radial — warms the navy slightly */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 80% 100%, oklch(0.75 0.12 85 / 0.07) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Founder headshot */}
          <figure className="lg:col-span-3">
            <div
              className="relative aspect-[3/4] w-full max-w-[260px] overflow-hidden"
              style={{ border: "1px solid oklch(0.75 0.12 85 / 0.28)" }}
            >
              <Image
                src="/images/matt-lenzie.png"
                alt="Matt Lenzie, founder of Construction Capital"
                fill
                sizes="(min-width: 1024px) 260px, 50vw"
                className="object-cover object-top"
              />
              <span
                aria-hidden
                className="absolute -bottom-[1px] left-0 h-8 w-[2px]"
                style={{ background: "var(--gold)" }}
              />
            </div>
            <figcaption
              className="mt-4 text-[10px] font-medium uppercase tracking-[0.28em]"
              style={{ color: "oklch(1 0 0 / 0.5)" }}
            >
              Matt Lenzie &middot; Founder
            </figcaption>
          </figure>

          {/* Quote column */}
          <div className="lg:col-span-9">
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
                A note from the founder
              </p>
            </div>

            <blockquote
              className="font-heading text-2xl font-normal leading-[1.4] tracking-[-0.005em] sm:text-[1.85rem]"
              style={{ color: "oklch(1 0 0 / 0.95)" }}
            >
              <span
                aria-hidden
                className="font-heading mr-1 align-top text-5xl leading-none"
                style={{ color: "var(--gold)" }}
              >
                &ldquo;
              </span>
              Construction Capital is the vehicle for something I&rsquo;ve
              been doing for over 25 years: arranging development finance
              that actually fits the scheme. Every deal still comes
              through me personally &mdash; structuring, packaging, credit
              conversations, legals, drawdown. Clients don&rsquo;t get
              handed off. They get answers.
            </blockquote>

            <div
              className="mt-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t pt-6"
              style={{ borderColor: "oklch(1 0 0 / 0.12)" }}
            >
              <div>
                <p
                  className="font-heading text-lg font-medium italic"
                  style={{ color: "oklch(1 0 0 / 0.9)" }}
                >
                  Matt Lenzie
                </p>
                <p
                  className="mt-1 text-[11px] font-medium uppercase tracking-[0.24em]"
                  style={{ color: "oklch(1 0 0 / 0.5)" }}
                >
                  Founder &amp; Principal Broker
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-sm">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-1.5"
                  style={{ color: "oklch(1 0 0 / 0.9)" }}
                >
                  <span className="editorial-link">Read the full bio</span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: "var(--gold)" }}
                  />
                </Link>
                <span style={{ color: "oklch(1 0 0 / 0.25)" }}>&middot;</span>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="editorial-link"
                  style={{ color: "oklch(1 0 0 / 0.9)" }}
                >
                  Email Matt directly
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
