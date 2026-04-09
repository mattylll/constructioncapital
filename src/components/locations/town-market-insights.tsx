import { TrendingUp, MapPin, Users, Home, Briefcase } from "lucide-react";
import type { TownMarketData } from "@/lib/town-market-data";

interface TownMarketInsightsProps {
  data: TownMarketData;
  townName: string;
}

export function TownMarketInsights({ data, townName }: TownMarketInsightsProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="mb-5 h-[2px] w-14"
          style={{
            background:
              "linear-gradient(90deg, var(--gold), var(--gold-light))",
          }}
        />
        <p
          className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
          style={{ color: "var(--gold-dark)" }}
        >
          Local Market Data
        </p>
        <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
          {townName} Property Development Market
        </h2>

        {/* Key stats grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <Home className="mb-2 h-5 w-5 text-gold" />
            <p className="text-xs text-muted-foreground">Avg. Property Price</p>
            <p className="text-lg font-bold">{data.avgPropertyPrice}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <Users className="mb-2 h-5 w-5 text-gold" />
            <p className="text-xs text-muted-foreground">Population</p>
            <p className="text-lg font-bold">{data.population}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <TrendingUp className="mb-2 h-5 w-5 text-gold" />
            <p className="text-xs text-muted-foreground">Rental Yield Range</p>
            <p className="text-lg font-bold">{data.rentalYieldRange}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <Briefcase className="mb-2 h-5 w-5 text-gold" />
            <p className="text-xs text-muted-foreground">Planning Authority</p>
            <p className="text-sm font-bold leading-tight">
              {data.planningAuthority}
            </p>
          </div>
        </div>

        {/* Market insight */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-3 text-lg font-bold">Market Overview</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {data.marketInsight}
          </p>
        </div>

        {/* Two-column: Development hotspots + Demand drivers */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-bold">Development Hotspots</h3>
            </div>
            <ul className="space-y-2">
              {data.developmentHotspots.map((spot, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {spot}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-bold">Demand Drivers</h3>
            </div>
            <ul className="space-y-2">
              {data.demandDrivers.map((driver, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {driver}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
