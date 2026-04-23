import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import type { CaseStudy } from "@/lib/case-studies";
import {
  EditorialSection,
  SectionHeader,
} from "@/components/editorial/primitives";

interface LocalCaseStudiesProps {
  caseStudies: CaseStudy[];
  locationName: string;
}

export function LocalCaseStudies({
  caseStudies,
  locationName,
}: LocalCaseStudiesProps) {
  if (caseStudies.length === 0) return null;

  return (
    <EditorialSection tone="paper">
      <SectionHeader
        tone="paper"
        eyebrow="Recent deals"
        title={
          <>
            Property finance deals
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              in {locationName}.
            </span>
          </>
        }
        body={`Real schemes we have structured for developers in ${locationName}. Sanitised for confidentiality, anchored in actual terms issued.`}
      />

      <div
        className="mt-16 grid grid-cols-1 gap-px border-y sm:grid-cols-2 lg:grid-cols-3"
        style={{
          borderColor: "var(--stone-dark)",
          background: "var(--stone-dark)",
        }}
      >
        {caseStudies.map((cs) => (
          <Link
            key={cs.slug}
            href={`/case-studies/${cs.slug}`}
            className="group relative flex flex-col gap-5 px-7 py-8 transition-colors"
            style={{ background: "var(--paper)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <p
                className="text-[10px] font-medium uppercase tracking-[0.26em]"
                style={{ color: "var(--gold-dark)" }}
              >
                {cs.projectType}
              </p>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                style={{ color: "var(--gold-dark)" }}
              />
            </div>
            <h3
              className="font-heading text-[22px] font-medium leading-[1.15] tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
              style={{ color: "var(--navy-dark)" }}
            >
              {cs.title}
            </h3>
            <p
              className="line-clamp-2 text-[15px] leading-[1.55]"
              style={{ color: "oklch(0.35 0.04 255)" }}
            >
              {cs.description}
            </p>
            <dl
              className="mt-auto flex flex-wrap gap-x-8 gap-y-3 border-t pt-5"
              style={{ borderColor: "var(--stone-dark)" }}
            >
              <div>
                <dt
                  className="text-[10px] font-medium uppercase tracking-[0.22em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  GDV
                </dt>
                <dd
                  className="numeral-tabular font-heading mt-1 text-[17px] font-medium tracking-tight"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {cs.gdv}
                </dd>
              </div>
              <div>
                <dt
                  className="text-[10px] font-medium uppercase tracking-[0.22em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  Leverage
                </dt>
                <dd
                  className="numeral-tabular font-heading mt-1 text-[17px] font-medium tracking-tight"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {cs.ltv}
                </dd>
              </div>
            </dl>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/case-studies"
          className="editorial-link inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em]"
          style={{ color: "var(--navy-dark)" }}
        >
          View all case studies
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </EditorialSection>
  );
}
