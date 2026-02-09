import Link from "next/link";

interface Town {
  name: string;
  slug: string;
  countySlug: string;
}

interface RelatedTownsProps {
  towns: Town[];
  serviceSlug?: string;
  currentTown: string;
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
            Related Towns
          </h2>
        </div>

        {/* Towns grid as pill links */}
        <div className="flex flex-wrap gap-3">
          {filteredTowns.map((town) => {
            const href = serviceSlug
              ? `/locations/${town.countySlug}/${town.slug}/${serviceSlug}`
              : `/locations/${town.countySlug}/${town.slug}`;

            return (
              <Link
                key={`${town.countySlug}-${town.slug}`}
                href={href}
                className="inline-flex items-center rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold-dark"
              >
                {town.name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
