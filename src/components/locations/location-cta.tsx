import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationCTAProps {
  townName?: string;
  serviceName?: string;
}

export function LocationCTA({ townName, serviceName }: LocationCTAProps) {
  const hasContext = townName || serviceName;

  const heading = hasContext
    ? `Ready for ${serviceName || "Development Finance"}${townName ? ` in ${townName}` : ""}?`
    : "Ready to Fund Your Development?";

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Rich multi-stop gold gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.70 0.14 80) 0%, oklch(0.76 0.13 85) 35%, oklch(0.80 0.11 90) 65%, oklch(0.72 0.13 82) 100%)",
        }}
      />

      {/* Noise texture */}
      <div className="noise-overlay absolute inset-0" />

      {/* Decorative dot pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="location-cta-dots"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#location-cta-dots)" />
        </svg>
      </div>

      {/* Diagonal navy accent lines */}
      <div
        className="pointer-events-none absolute -left-20 top-0 h-[130%] w-px origin-top-left rotate-[18deg]"
        style={{ backgroundColor: "var(--navy-dark)", opacity: 0.1 }}
      />
      <div
        className="pointer-events-none absolute left-1/3 top-0 h-[130%] w-px origin-top-left rotate-[18deg]"
        style={{ backgroundColor: "var(--navy-dark)", opacity: 0.05 }}
      />
      <div
        className="pointer-events-none absolute right-1/4 top-0 h-[130%] w-px origin-top-right -rotate-[18deg]"
        style={{ backgroundColor: "var(--navy-dark)", opacity: 0.05 }}
      />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          style={{ color: "var(--navy-dark)" }}
        >
          {heading}
        </h2>
        <p
          className="mx-auto mt-5 max-w-xl text-lg"
          style={{ color: "var(--navy)", opacity: 0.6 }}
        >
          Submit your deal in minutes. Our team will come back to you with
          indicative terms within 24 hours.
        </p>
        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="h-14 bg-navy px-12 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-navy-dark hover:shadow-[0_20px_60px_oklch(0.25_0.06_255/0.4)]"
          >
            <Link href="/deal-room">
              Enter the Deal Room
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
