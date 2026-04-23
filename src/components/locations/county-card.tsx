import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getLocationImage, unsplashUrl } from "@/lib/location-images";

interface CountyCardProps {
  name: string;
  slug: string;
  townCount: number;
  region: string;
}

export function CountyCard({ name, slug, townCount }: CountyCardProps) {
  const image = getLocationImage(slug);
  const imageSrc = unsplashUrl(image.id, 800);

  return (
    <Link
      href={`/locations/${slug}`}
      className="group relative flex flex-col transition-colors"
      style={{ background: "var(--paper)" }}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.18 0.05 255 / 0) 50%, oklch(0.18 0.05 255 / 0.35) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-10 transition-all duration-500 group-hover:w-16"
          style={{ background: "var(--gold)" }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2 px-6 py-5">
        <h3
          className="font-heading text-xl font-medium leading-tight tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
          style={{ color: "var(--navy-dark)" }}
        >
          {name}
        </h3>
        <p
          className="numeral-tabular text-[11px] font-medium uppercase tracking-[0.22em]"
          style={{ color: "oklch(0.50 0.02 255)" }}
        >
          {townCount} {townCount === 1 ? "town" : "towns"}
        </p>
        <ArrowUpRight
          className="absolute right-4 top-4 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          style={{ color: "oklch(1 0 0 / 0.9)" }}
        />
      </div>
    </Link>
  );
}
