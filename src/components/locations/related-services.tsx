import Link from "next/link";
import type { Service } from "@/lib/services";

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
    (service) => service.slug !== currentServiceSlug
  );

  if (otherServices.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading with gold rule */}
        <div className="mb-10">
          <div
            className="mb-4 h-[2px] w-12"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Other Services in {townName}
          </h2>
        </div>

        {/* Services grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherServices.map((service) => (
            <Link
              key={service.slug}
              href={`/locations/${countySlug}/${townSlug}/${service.slug}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-card/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg"
            >
              {/* Top accent line - reveals on hover */}
              <div
                className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 10%, var(--gold) 50%, transparent 90%)",
                }}
              />

              <div className="relative">
                {/* Service name */}
                <h3 className="mb-2 text-base font-bold tracking-tight text-foreground">
                  {service.name}
                </h3>

                {/* Rate badge */}
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: "oklch(0.75 0.12 85 / 0.1)",
                    color: "var(--gold-dark)",
                  }}
                >
                  {service.typicalRate}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
