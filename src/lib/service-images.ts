/**
 * Service Image Mapping
 *
 * Hero imagery for each service on /services and /services/[slug].
 * Reuses Unsplash IDs already proven to load in this project via
 * `location-images.ts` so we know the CDN renders them.
 */

import { unsplashUrl } from "@/lib/location-images";

export interface ServiceImage {
  id: string;
  alt: string;
}

const SERVICE_IMAGES: Record<string, ServiceImage> = {
  "development-finance": {
    id: "1513635269975-59663e0ac1ad",
    alt: "London skyline at dusk with cranes and active development sites",
  },
  "mezzanine-finance": {
    id: "1515586838455-8f8f940d6853",
    alt: "Manchester city centre aerial showing stacked residential developments",
  },
  "bridging-loans": {
    id: "1683459269288-63ce626a67f2",
    alt: "Leeds clock tower rising above the city centre",
  },
  "equity-jv": {
    id: "1595275842222-bb71d4209726",
    alt: "Edinburgh city skyline with a mix of historic and modern buildings",
  },
  "refurbishment-finance": {
    id: "1612436410902-e7123c3101d2",
    alt: "Colourful terraced houses on the Bristol harbourside",
  },
  "commercial-mortgages": {
    id: "1499958060387-dbdb8d0994fb",
    alt: "Birmingham city centre commercial buildings under grey sky",
  },
  "development-exit-finance": {
    id: "1630188397757-15ddada2772b",
    alt: "Newly completed residential development with finished units",
  },
};

export function getServiceImage(slug: string): ServiceImage | null {
  return SERVICE_IMAGES[slug] ?? null;
}

export function serviceImageUrl(slug: string, width = 1600): string | null {
  const img = SERVICE_IMAGES[slug];
  if (!img) return null;
  return unsplashUrl(img.id, width);
}
