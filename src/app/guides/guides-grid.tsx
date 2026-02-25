"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Guide, GuideCategory } from "@/lib/guides";

const categoryLabels: Record<GuideCategory, string> = {
  "development-finance": "Development Finance",
  bridging: "Bridging Loans",
  mezzanine: "Mezzanine & Equity",
  equity: "Equity & JV",
  refurbishment: "Refurbishment",
  commercial: "Commercial Mortgages",
  general: "General",
  "hidden-fees": "Hidden Fees",
  defaults: "Defaults & Recovery",
  valuations: "Valuations & GDV",
  legal: "Legal & Compliance",
  application: "Applications",
  structuring: "Deal Structuring",
  market: "Market Insights",
};

export function GuidesGrid({ guides }: { guides: Guide[] }) {
  const [active, setActive] = useState<GuideCategory | "all">("all");

  // Only show categories that have guides
  const activeCategories = Array.from(
    new Set(guides.map((g) => g.category))
  ) as GuideCategory[];

  const filtered =
    active === "all" ? guides : guides.filter((g) => g.category === active);

  return (
    <>
      {/* Category tabs */}
      <div className="mb-10 flex flex-wrap gap-2">
        <button
          onClick={() => setActive("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            active === "all"
              ? "bg-gold text-navy-dark"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All ({guides.length})
        </button>
        {activeCategories.map((cat) => {
          const count = guides.filter((g) => g.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? "bg-gold text-navy-dark"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {categoryLabels[cat]} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="glass-card group relative overflow-hidden rounded-2xl p-7 transition-all duration-300 hover:translate-y-[-2px]"
          >
            {/* Top accent line on hover */}
            <div
              className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(90deg, transparent 10%, var(--gold) 50%, transparent 90%)",
              }}
            />

            <div className="relative">
              {/* Category + reading time */}
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: "oklch(0.75 0.12 85 / 0.1)",
                    color: "var(--gold-dark)",
                  }}
                >
                  {categoryLabels[guide.category] || guide.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {guide.readingTime}
                </span>
              </div>

              {/* Title */}
              <h2 className="mb-3 text-lg font-bold leading-snug tracking-tight text-foreground">
                {guide.title}
              </h2>

              {/* Excerpt */}
              <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {guide.excerpt}
              </p>

              {/* Read link */}
              <span className="inline-flex items-center text-sm font-bold text-gold-dark transition-all duration-300 group-hover:text-gold group-hover:tracking-wide">
                Read Guide
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No guides in this category yet.
        </p>
      )}
    </>
  );
}
