import Link from "next/link";
import { ArrowRight, Building2, PoundSterling } from "lucide-react";

import type { CaseStudy } from "@/lib/case-studies";

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
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
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
            Recent Deals
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Property Finance Deals in {locationName}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Real deals we&apos;ve structured for developers in {locationName}.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="glass-card group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
            >
              <div
                className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 10%, var(--gold) 50%, transparent 90%)",
                }}
              />

              <p
                className="mb-2 text-xs font-bold uppercase tracking-[0.15em]"
                style={{ color: "var(--gold-dark)" }}
              >
                {cs.projectType}
              </p>
              <h3 className="mb-3 text-lg font-bold text-foreground">
                {cs.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {cs.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <PoundSterling className="h-3 w-3" />
                  {cs.gdv} GDV
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <Building2 className="h-3 w-3" />
                  {cs.ltv}
                </span>
              </div>

              <div className="mt-4 inline-flex items-center text-sm font-bold text-gold-dark transition-all duration-300 group-hover:text-gold">
                View Full Case Study
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center text-sm font-bold text-gold-dark transition-colors hover:text-gold"
          >
            View All Case Studies
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
