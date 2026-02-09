import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ServiceCardProps {
  serviceName: string;
  serviceSlug: string;
  countySlug: string;
  townSlug: string;
  townName: string;
  typicalRate: string;
}

export function ServiceCard({
  serviceName,
  serviceSlug,
  countySlug,
  townSlug,
  townName,
  typicalRate,
}: ServiceCardProps) {
  return (
    <Link
      href={`/locations/${countySlug}/${townSlug}/${serviceSlug}`}
      className="glass-card group relative overflow-hidden rounded-2xl p-6"
    >
      {/* Top accent line - reveals on hover */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, var(--gold) 50%, transparent 90%)",
        }}
      />

      {/* Corner glow on hover */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle, oklch(0.75 0.12 85 / 0.08), transparent 70%)",
        }}
      />

      <div className="relative">
        {/* Service name */}
        <h3 className="mb-3 text-lg font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-navy">
          {serviceName}
        </h3>

        {/* Context: service in town */}
        <p className="mb-4 text-sm text-muted-foreground">
          {serviceName} in {townName}
        </p>

        {/* Rate badge */}
        <div className="mb-5">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
            style={{
              backgroundColor: "oklch(0.75 0.12 85 / 0.1)",
              color: "var(--gold-dark)",
            }}
          >
            {typicalRate}
          </span>
        </div>

        {/* Learn more link */}
        <span className="inline-flex items-center text-sm font-bold text-gold-dark transition-all duration-300 group-hover:text-gold group-hover:tracking-wide">
          Learn More
          <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
