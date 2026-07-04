import { ArrowUpRight } from "lucide-react";

import {
  EditorialSection,
  SectionHeader,
} from "@/components/editorial/primitives";
import type { LocalFinancePartner } from "@/data/local-finance-network";

interface LocalFinanceNetworkProps {
  partners: LocalFinancePartner[];
  townName: string;
}

export function LocalFinanceNetwork({
  partners,
  townName,
}: LocalFinanceNetworkProps) {
  if (partners.length === 0) {
    return null;
  }

  return (
    <EditorialSection tone="paper">
      <SectionHeader
        tone="paper"
        eyebrow="Finance network"
        title={
          <>
            Specialist finance partners
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              across {townName}.
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
        {partners.map((partner) => (
          <a
            key={partner.href}
            href={partner.href}
            rel="dofollow"
            className="group relative flex flex-col gap-3 px-6 py-7 transition-colors"
            style={{ background: "var(--paper)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <h3
                className="font-heading text-[20px] font-medium leading-tight tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                style={{ color: "var(--navy-dark)" }}
              >
                {partner.label}
              </h3>
              <ArrowUpRight
                className="h-5 w-5 flex-shrink-0 transition-colors"
                style={{ color: "var(--navy)" }}
              />
            </div>
            <p
              className="text-[14px] leading-relaxed"
              style={{ color: "var(--navy-dark)" }}
            >
              {partner.description}
            </p>
          </a>
        ))}
      </div>
    </EditorialSection>
  );
}
