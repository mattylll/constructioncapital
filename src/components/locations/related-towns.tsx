import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  EditorialSection,
  SectionHeader,
} from "@/components/editorial/primitives";

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
    <EditorialSection tone="paper">
      <SectionHeader
        tone="paper"
        eyebrow="Nearby markets"
        title={
          <>
            Adjacent towns
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              we also fund.
            </span>
          </>
        }
      />
      <div
        className="mt-16 grid grid-cols-1 gap-px border-y sm:grid-cols-2 lg:grid-cols-3"
        style={{
          borderColor: "var(--stone-dark)",
          background: "var(--stone-dark)",
        }}
      >
        {filteredTowns.map((town) => {
          const href = serviceSlug
            ? `/locations/${town.countySlug}/${town.slug}/${serviceSlug}`
            : `/locations/${town.countySlug}/${town.slug}`;

          return (
            <Link
              key={`${town.countySlug}-${town.slug}`}
              href={href}
              className="group relative flex flex-col gap-3 px-6 py-7 transition-colors"
              style={{ background: "var(--paper)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <h3
                  className="font-heading text-[20px] font-medium leading-tight tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {town.name}
                </h3>
                <ArrowUpRight
                  className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  style={{ color: "var(--gold-dark)" }}
                />
              </div>
              {town.medianPrice && (
                <p
                  className="numeral-tabular text-[11px] font-medium uppercase tracking-[0.22em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  Median · {formatPrice(town.medianPrice)}
                </p>
              )}
              {town.context && (
                <p
                  className="line-clamp-2 text-[14px] leading-[1.55]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  {town.context}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </EditorialSection>
  );
}
