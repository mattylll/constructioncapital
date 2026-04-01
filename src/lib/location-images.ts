/**
 * Location Image Data
 *
 * Curated Unsplash images for location pages. Unsplash licence permits
 * free commercial use without attribution (though attribution is appreciated).
 *
 * Images are served from Unsplash's CDN with automatic format/size optimization
 * via the `w` and `q` URL parameters.
 *
 * To add a new location image:
 * 1. Find a relevant city/town photo on unsplash.com
 * 2. Copy the photo ID from the URL (e.g. unsplash.com/photos/PHOTO_ID)
 * 3. Add it to LOCATION_IMAGES below keyed by countySlug/townSlug or countySlug
 */

export interface LocationImage {
  /** Unsplash photo ID */
  id: string;
  /** Short description for alt text */
  alt: string;
  /** Photographer credit (optional but appreciated) */
  credit?: string;
}

/**
 * Town-level images keyed by `countySlug/townSlug`.
 * County-level images keyed by `countySlug`.
 */
const LOCATION_IMAGES: Record<string, LocationImage> = {
  // County-level
  "greater-london": {
    id: "JP1UrAVcps0",
    alt: "London skyline with the City of London financial district",
    credit: "Benjamin Davies",
  },
  "greater-manchester": {
    id: "vOJhyGnCPqE",
    alt: "Manchester city centre skyline",
    credit: "William McCue",
  },
  "west-midlands": {
    id: "j6kQFfcxMjY",
    alt: "Birmingham city centre and canal network",
    credit: "Sander Crombach",
  },
  "west-yorkshire": {
    id: "ZAK7CDlCglw",
    alt: "Leeds city centre with modern architecture",
    credit: "Michael D Beckwith",
  },
  bristol: {
    id: "8g2RO3HjGLs",
    alt: "Bristol harbourside with colourful houses",
    credit: "Jack B",
  },
  edinburgh: {
    id: "9CPAi0MhLhU",
    alt: "Edinburgh Old Town skyline and castle",
    credit: "Adam Wilson",
  },
  // Town-level (top towns with market data)
  "greater-london/croydon": {
    id: "JP1UrAVcps0",
    alt: "Aerial view of South London and Croydon",
    credit: "Benjamin Davies",
  },
  "greater-london/guildford": {
    id: "gJJHG_md-Lw",
    alt: "Surrey countryside near Guildford",
    credit: "Simon Berger",
  },
  "greater-manchester/manchester": {
    id: "vOJhyGnCPqE",
    alt: "Manchester skyline with modern developments",
    credit: "William McCue",
  },
  "greater-manchester/salford": {
    id: "vOJhyGnCPqE",
    alt: "Salford Quays and MediaCityUK",
    credit: "William McCue",
  },
  "west-midlands/birmingham": {
    id: "j6kQFfcxMjY",
    alt: "Birmingham city centre and canal quarter",
    credit: "Sander Crombach",
  },
  "west-yorkshire/leeds": {
    id: "ZAK7CDlCglw",
    alt: "Leeds city skyline with modern buildings",
    credit: "Michael D Beckwith",
  },
  "bristol/bristol": {
    id: "8g2RO3HjGLs",
    alt: "Bristol harbourside and Clifton suspension bridge",
    credit: "Jack B",
  },
  "edinburgh/edinburgh": {
    id: "9CPAi0MhLhU",
    alt: "Edinburgh castle and Old Town from Calton Hill",
    credit: "Adam Wilson",
  },
};

/** Default fallback image for locations without a specific photo */
const DEFAULT_IMAGE: LocationImage = {
  id: "7BO76GRSLEQ",
  alt: "UK property development and construction site",
  credit: "Daniel McCullough",
};

/**
 * Site-wide hero/feature images for non-location pages.
 * Keyed by page or section identifier.
 */
export const SITE_IMAGES: Record<string, LocationImage> = {
  "homepage-hero": {
    id: "rxpThOwuVgE",
    alt: "Modern residential property development under construction",
    credit: "Daniel McCullough",
  },
  "homepage-process": {
    id: "yoSKuivF87s",
    alt: "Architect reviewing construction blueprints on site",
    credit: "Scott Blake",
  },
  "case-studies-hero": {
    id: "wTPp323zAEw",
    alt: "Completed residential development project at dusk",
    credit: "Avel Chuklanov",
  },
  // Service page heroes
  "service-development-finance": {
    id: "IoYJSGZ46Yk",
    alt: "Construction workers on a residential building site",
    credit: "Jeriden Villegas",
  },
  "service-mezzanine-finance": {
    id: "7nrsVjvALnA",
    alt: "High-rise residential development under construction",
    credit: "Danist Soh",
  },
  "service-bridging-loans": {
    id: "TkEPQPWr2sY",
    alt: "Property developer reviewing plans at a building site",
    credit: "Scott Blake",
  },
  "service-equity-jv": {
    id: "5QgIuuBxKwM",
    alt: "Business professionals shaking hands on a property deal",
    credit: "Sebastian Herrmann",
  },
  "service-refurbishment-finance": {
    id: "OQMZwNd3ThU",
    alt: "Workers renovating a period property interior",
    credit: "Milivoj Kuhar",
  },
  "service-commercial-mortgages": {
    id: "yEd2v3AQNKE",
    alt: "Modern commercial office building with glass facade",
    credit: "Sean Pollock",
  },
  "service-development-exit-finance": {
    id: "MP0bgaS_d1c",
    alt: "Completed new-build homes ready for sale",
    credit: "Avel Chuklanov",
  },
  // About page
  "about-hero": {
    id: "qCi_MzVODoU",
    alt: "Professional meeting in a modern office with city views",
    credit: "Austin Distel",
  },
  // Guides
  "guides-hero": {
    id: "376KN_ISplE",
    alt: "Person working at a desk with financial documents and laptop",
    credit: "Scott Graham",
  },
};

/**
 * Get the image for a location. Tries town-specific first, then county, then default.
 */
export function getLocationImage(
  countySlug: string,
  townSlug?: string
): LocationImage {
  if (townSlug) {
    const townKey = `${countySlug}/${townSlug}`;
    if (LOCATION_IMAGES[townKey]) return LOCATION_IMAGES[townKey];
  }
  if (LOCATION_IMAGES[countySlug]) return LOCATION_IMAGES[countySlug];
  return DEFAULT_IMAGE;
}

/**
 * Build the Unsplash CDN URL for an image.
 * Width defaults to 1200px, quality to 80.
 */
export function unsplashUrl(
  photoId: string,
  width = 1200,
  quality = 80
): string {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&q=${quality}&auto=format&fit=crop`;
}
