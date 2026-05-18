/**
 * Neighbourhood Areas — Bradley Benner methodology
 *
 * Surfaces the official Wikipedia-sourced neighbourhood list for a town as
 * H3 entries beneath a single H2. Per Benner's sub-page decision rule, we
 * reference every neighbourhood as an H3 on the parent location page first;
 * a dedicated sub-page is only created if the parent page fails to rank for
 * `[service] [neighbourhood]` queries after indexing.
 */

import type { TownEntity } from "@/lib/location-entities";

interface NeighbourhoodAreasProps {
  entity: TownEntity;
  /** Service variant for the H2 (e.g. "Commercial Property Finance") */
  serviceH2Variant: string;
  /** Body copy variant (e.g. "commercial property lending") */
  serviceBodyVariant: string;
}

export function NeighbourhoodAreas({
  entity,
  serviceH2Variant,
  serviceBodyVariant,
}: NeighbourhoodAreasProps) {
  if (entity.neighbourhoods.length === 0) return null;

  return (
    <section
      className="border-t border-border bg-card"
      aria-labelledby="neighbourhood-areas-heading"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p
            className="mb-4 text-xs font-medium uppercase tracking-[0.15em]"
            style={{ color: "var(--gold-dark)" }}
          >
            Areas we cover
          </p>
          <h2
            id="neighbourhood-areas-heading"
            className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--navy-dark)" }}
          >
            {serviceH2Variant} across {entity.primary}&apos;s neighbourhoods.
          </h2>
          <p
            className="mt-5 text-base leading-[1.7]"
            style={{ color: "oklch(0.35 0.04 255)" }}
          >
            We arrange {serviceBodyVariant} for developers and investors right
            across {entity.primary} and the surrounding parts of{" "}
            {entity.county}. Whether your site sits in the historic core, the
            outer estates, or the commuter villages on the edge of the
            {entity.district ? ` ${entity.district}` : ` ${entity.primary} area`}
            , the same lender panel applies.
          </p>
        </div>

        <ul className="mt-12 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {entity.neighbourhoods.map((n) => (
            <li key={n}>
              <h3
                className="text-base font-medium tracking-tight"
                style={{ color: "var(--navy-dark)" }}
              >
                {n}
              </h3>
            </li>
          ))}
        </ul>

        <p
          className="mt-12 max-w-3xl text-sm leading-[1.7]"
          style={{ color: "oklch(0.50 0.02 255)" }}
        >
          Local landmarks for orientation: {entity.landmarks.slice(0, 3).join(", ")}
          {entity.landmarks.length > 3 ? `, and ${entity.landmarks[3]}.` : "."}
          {" "}If you are working a deal in any of the areas listed, we can have
          indicative terms back to you within one working day.
        </p>
      </div>
    </section>
  );
}
