import Image from "next/image";
import { getLocationImage, unsplashUrl } from "@/lib/location-images";

interface LocationHeroImageProps {
  countySlug: string;
  townSlug?: string;
  locationName: string;
}

export function LocationHeroImage({
  countySlug,
  townSlug,
  locationName,
}: LocationHeroImageProps) {
  const image = getLocationImage(countySlug, townSlug);
  const src = unsplashUrl(image.id, 1200, 80);

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 overflow-hidden rounded-xl shadow-lg sm:-mt-16">
          <Image
            src={src}
            alt={image.alt}
            width={1200}
            height={400}
            className="h-[250px] w-full object-cover sm:h-[350px]"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* Location name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="text-lg font-bold text-white sm:text-xl">
              {locationName}
            </p>
            {image.credit && (
              <p className="mt-1 text-xs text-white/50">
                Photo by {image.credit} on Unsplash
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
