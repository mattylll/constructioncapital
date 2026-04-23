import Link from "next/link";
import { MapPin } from "lucide-react";

interface Town {
  name: string;
  slug: string;
  countySlug: string;
  context?: string;
  medianPrice?: number;
}

interface RelatedTownsProps {
  towns: Town[];
  serviceSlug?: string;
  currentTown: string;
}

function formatPrice(amount: number): string {
  if (amount >= 1_000_000) {
    return `£${(amount / 1_000_000).toFixed(1)}M`;
  }
  
return `£${amount.toLocaleString("en-GB")}`;
}

export function RelatedTowns({
  towns,
  serviceSlug,
  currentTown,
}: RelatedTownsProps) {
  const filteredTowns = towns.filter((town) => town.name !== currentTown);

  if (filteredTowns.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading with gold rule */}
        <div className="mb-8">
          <div
            className="mb-4 h-[2px] w-12"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Nearby Locations
          </h2>
        </div>

        {/* Towns grid as cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTowns.map((town) => {
            const href = serviceSlug
              ? `/locations/${town.countySlug}/${town.slug}/${serviceSlug}`
              : `/locations/${town.countySlug}/${town.slug}`;

            return (
              <Link
                key={`${town.countySlug}-${town.slug}`}
                href={href}
                className="group rounded-xl border border-border bg-card/70 p-5 transition-all duration-300 hover:border-gold/40 hover:bg-card hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-gold"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground transition-colors group-hover:text-gold-dark">
                      {town.name}
                    </p>
                    {town.medianPrice && (
                      <p className="mt-1 text-sm font-medium text-gold-dark">
                        Median: {formatPrice(town.medianPrice)}
                      </p>
                    )}
                    {town.context && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {town.context}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
