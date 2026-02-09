import type { Metadata } from "next";
import { Shield, Clock, FileCheck } from "lucide-react";

import { DealRoomFormLoader } from "@/components/deal-room/deal-room-form-loader";

export const metadata: Metadata = {
  title: "Deal Room",
  description:
    "Submit your development finance deal. Get indicative terms within 24 hours from our panel of 100+ lenders across the UK.",
};

const guarantees = [
  {
    icon: Clock,
    text: "Indicative terms within 24 hours",
  },
  {
    icon: Shield,
    text: "Your data is confidential & secure",
  },
  {
    icon: FileCheck,
    text: "No obligation, no upfront fees",
  },
];

export default function DealRoomPage() {
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
                id="dr-grid"
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
            <rect width="100%" height="100%" fill="url(#dr-grid)" />
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

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div
              className="animate-fade-in mx-auto mb-8 h-[2px] w-20"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <p
              className="animate-fade-up mb-5 text-xs font-bold uppercase tracking-[0.3em] sm:text-sm"
              style={{ color: "var(--gold)" }}
            >
              Deal Room
            </p>
            <h1 className="animate-fade-up delay-100 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Submit Your{" "}
              <span className="gold-gradient-text italic">Deal</span>
            </h1>
            <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
              Three simple steps. Give us the details and we&rsquo;ll find the
              best terms from our panel of 100+ lenders, family offices, and
              equity partners.
            </p>

            {/* Guarantee pills */}
            <div className="animate-fade-up delay-300 mt-10 flex flex-wrap items-center justify-center gap-4">
              {guarantees.map((g) => (
                <div
                  key={g.text}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white/60"
                  style={{
                    background: "oklch(1 0 0 / 0.04)",
                    border: "1px solid oklch(1 0 0 / 0.08)",
                  }}
                >
                  <g.icon
                    className="h-3.5 w-3.5"
                    style={{ color: "var(--gold)" }}
                  />
                  {g.text}
                </div>
              ))}
            </div>
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

      {/* ━━━ FORM ━━━ */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DealRoomFormLoader />
        </div>
      </section>
    </>
  );
}
