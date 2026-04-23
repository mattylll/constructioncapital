import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Service } from "@/lib/services";
import {
  EditorialSection,
  SectionHeader,
} from "@/components/editorial/primitives";

interface RelatedServicesProps {
  services: readonly Service[];
  countySlug: string;
  townSlug: string;
  currentServiceSlug: string;
  townName: string;
}

export function RelatedServices({
  services,
  countySlug,
  townSlug,
  currentServiceSlug,
  townName,
}: RelatedServicesProps) {
  const otherServices = services.filter(
    (service) => service.slug !== currentServiceSlug,
  );

  if (otherServices.length === 0) {
    return null;
  }

  return (
    <EditorialSection tone="paper">
      <SectionHeader
        tone="paper"
        eyebrow="Adjacent products"
        title={
          <>
            Other services
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              in {townName}.
            </span>
          </>
        }
      />

      <div
        className="mt-16 grid gap-px border-y sm:grid-cols-2 lg:grid-cols-3"
        style={{
          borderColor: "var(--stone-dark)",
          background: "var(--stone-dark)",
        }}
      >
        {otherServices.map((service) => (
          <Link
            key={service.slug}
            href={`/locations/${countySlug}/${townSlug}/${service.slug}`}
            className="group relative flex flex-col gap-4 px-7 py-8 transition-colors"
            style={{ background: "var(--paper)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <h3
                className="font-heading text-[20px] font-medium leading-[1.2] tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                style={{ color: "var(--navy-dark)" }}
              >
                {service.name}
              </h3>
              <ArrowUpRight
                className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                style={{ color: "var(--gold-dark)" }}
              />
            </div>
            <p
              className="numeral-tabular text-[11px] font-medium uppercase tracking-[0.22em]"
              style={{ color: "oklch(0.50 0.02 255)" }}
            >
              {service.typicalRate} · {service.typicalLtv}
            </p>
          </Link>
        ))}
      </div>
    </EditorialSection>
  );
}
