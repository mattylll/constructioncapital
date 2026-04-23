"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, TrendingUp, BarChart3, Home } from "lucide-react";
import type { MarketReport, ReportCategory } from "@/lib/market-reports/types";

const categoryLabels: Record<ReportCategory, string> = {
  county: "County Reports",
  regional: "Regional Overviews",
  thematic: "Thematic Analysis",
  town: "Town Reports",
};

const categoryIcons: Record<ReportCategory, typeof MapPin> = {
  county: MapPin,
  regional: BarChart3,
  thematic: TrendingUp,
  town: Home,
};

export function ReportsGrid({ reports }: { reports: MarketReport[] }) {
  const [activeCategory, setActiveCategory] = useState<ReportCategory | "all">(
    "all"
  );
  const [activeRegion, setActiveRegion] = useState<string | "all">("all");

  const regions = Array.from(
    new Set(reports.map((r) => r.region).filter(Boolean) as string[])
  ).sort();

  const filtered = reports.filter((r) => {
    if (activeCategory !== "all" && r.category !== activeCategory) return false;
    if (activeRegion !== "all" && r.region !== activeRegion) return false;
    
return true;
  });

  return (
    <>
      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setActiveCategory("all");
            setActiveRegion("all");
          }}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeCategory === "all"
              ? "bg-gold text-navy-dark"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All ({reports.length})
        </button>
        {(["county", "town", "regional", "thematic"] as ReportCategory[]).map((cat) => {
          const count = reports.filter((r) => r.category === cat).length;
          
return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                if (cat !== "county" && cat !== "town") setActiveRegion("all");
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-gold text-navy-dark"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {categoryLabels[cat]} ({count})
            </button>
          );
        })}
      </div>

      {/* Region filter - shown for county reports */}
      {(activeCategory === "all" || activeCategory === "county" || activeCategory === "town") && (
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveRegion("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeRegion === "all"
                ? "bg-foreground/10 text-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Regions
          </button>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeRegion === region
                  ? "bg-foreground/10 text-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((report) => {
          const Icon = categoryIcons[report.category];
          
return (
            <Link
              key={report.slug}
              href={`/market-reports/${report.slug}`}
              className="glass-card group relative overflow-hidden rounded-2xl p-7 transition-all duration-300 hover:translate-y-[-2px]"
            >
              <div
                className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 10%, var(--gold) 50%, transparent 90%)",
                }}
              />

              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                    style={{
                      backgroundColor: "oklch(0.75 0.12 85 / 0.1)",
                      color: "var(--gold-dark)",
                    }}
                  >
                    <Icon className="h-3 w-3" />
                    {categoryLabels[report.category]}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {report.readingTime}
                  </span>
                </div>

                <h2 className="mb-3 text-lg font-bold leading-snug tracking-tight text-foreground">
                  {report.title}
                </h2>

                <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {report.excerpt}
                </p>

                {report.region && (
                  <p className="mb-4 text-xs text-muted-foreground/60">
                    {report.region}
                  </p>
                )}

                <span className="inline-flex items-center text-sm font-bold text-gold-dark transition-all duration-300 group-hover:text-gold group-hover:tracking-wide">
                  Read Report
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No reports match this filter.
        </p>
      )}
    </>
  );
}
