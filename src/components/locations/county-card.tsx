import Link from "next/link";
import { MapPin } from "lucide-react";

interface CountyCardProps {
  name: string;
  slug: string;
  townCount: number;
  region: string;
}

export function CountyCard({ name, slug, townCount, region }: CountyCardProps) {
  return (
    <Link
      href={`/locations/${slug}`}
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
        {/* Region label */}
        <div className="mb-3 flex items-center gap-2">
          <MapPin
            className="h-3.5 w-3.5"
            style={{ color: "var(--gold-dark)" }}
          />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {region}
          </span>
        </div>

        {/* County name */}
        <h3 className="mb-4 text-xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-navy">
          {name}
        </h3>

        {/* Town count badge */}
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
            style={{
              backgroundColor: "oklch(0.75 0.12 85 / 0.1)",
              color: "var(--gold-dark)",
            }}
          >
            {townCount} {townCount === 1 ? "town" : "towns"}
          </span>

          <span
            className="text-sm font-semibold transition-all duration-300 group-hover:tracking-wide"
            style={{ color: "var(--gold-dark)" }}
          >
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
