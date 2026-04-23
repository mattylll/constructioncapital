"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, PoundSterling, TrendingUp, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Lender, type LenderType, LENDER_TYPES } from "@/lib/lenders";
import { SERVICES } from "@/lib/services";

const TYPE_COLORS: Record<LenderType, string> = {
  "high-street-bank": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "specialist-lender": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "challenger-bank": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "family-office": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "institutional": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  "bridging-specialist": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "development-specialist": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

function getTypeLabel(type: LenderType): string {
  return LENDER_TYPES.find((t) => t.slug === type)?.label ?? type;
}

function getServiceLabel(slug: string): string {
  return SERVICES.find((s) => s.slug === slug)?.name ?? slug;
}

interface LenderGridProps {
  lenders: Lender[];
}

export function LenderGrid({ lenders }: LenderGridProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return lenders.filter((lender) => {
      if (typeFilter !== "all" && lender.type !== typeFilter) return false;
      if (serviceFilter !== "all" && !lender.services.includes(serviceFilter))
        return false;
      if (
        search &&
        !lender.name.toLowerCase().includes(search.toLowerCase()) &&
        !lender.description.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      
return true;
    });
  }, [lenders, search, typeFilter, serviceFilter]);

  return (
    <div>
      {/* Filter Bar */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search lenders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {LENDER_TYPES.map((type) => (
              <SelectItem key={type.slug} value={type.slug}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="All services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {SERVICES.map((service) => (
              <SelectItem key={service.slug} value={service.slug}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="mb-6 text-sm text-muted-foreground">
        Showing {filtered.length} of {lenders.length} lenders
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-lg font-semibold text-foreground">
            No lenders match your filters
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lender) => (
            <Link
              key={lender.slug}
              href={`/lender-panel/${lender.slug}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/30 hover:shadow-md"
            >
              {/* Header */}
              <div className="mb-4">
                <Badge
                  className={`mb-3 rounded-md text-[11px] font-semibold ${TYPE_COLORS[lender.type]}`}
                >
                  {getTypeLabel(lender.type)}
                </Badge>
                <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-gold-dark">
                  {lender.name}
                </h3>
              </div>

              {/* Description */}
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {lender.description}
              </p>

              {/* Key metrics */}
              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <PoundSterling
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: "var(--gold-dark)" }}
                  />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Loan Range
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      {lender.minLoan} - {lender.maxLoan}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: "var(--gold-dark)" }}
                  />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Rate
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      {lender.typicalRate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: "var(--gold-dark)" }}
                  />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Max LTV
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      {lender.maxLtv}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: "var(--gold-dark)" }}
                  />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Turnaround
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      {lender.turnaround}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <ul className="space-y-1.5">
                {lender.strengths.slice(0, 2).map((strength, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <span
                      className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--gold)" }}
                    />
                    <span className="line-clamp-1">{strength}</span>
                  </li>
                ))}
              </ul>

              {/* Services */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {lender.services.slice(0, 3).map((service) => (
                  <span
                    key={service}
                    className="rounded-md border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {getServiceLabel(service)}
                  </span>
                ))}
                {lender.services.length > 3 && (
                  <span className="rounded-md border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    +{lender.services.length - 3} more
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
