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
  // ── County-level images ──────────────────────────────────
  "greater-london": {
    id: "1513635269975-59663e0ac1ad",
    alt: "Aerial photography of London skyline during daytime",
  },
  "greater-manchester": {
    id: "1515586838455-8f8f940d6853",
    alt: "Manchester city centre aerial view at daytime",
  },
  "west-midlands": {
    id: "1499958060387-dbdb8d0994fb",
    alt: "Birmingham city centre buildings under grey sky",
  },
  "west-yorkshire": {
    id: "1683459269288-63ce626a67f2",
    alt: "Leeds city centre with clock tower building",
  },
  bristol: {
    id: "1612436410902-e7123c3101d2",
    alt: "Bristol harbourside with colourful houses",
  },
  edinburgh: {
    id: "1595275842222-bb71d4209726",
    alt: "Edinburgh city skyline with high rise buildings",
  },
  kent: {
    id: "1663742587534-d2392e261e41",
    alt: "Canterbury Cathedral against a cloudy sky",
  },
  surrey: {
    id: "1750872310281-4d362950b14a",
    alt: "Aerial view of Guildford town with greenery",
  },
  hampshire: {
    id: "1682976967209-91219ab68a68",
    alt: "Southampton waterfront with boats",
  },
  essex: {
    id: "1639248195012-cb247145fc8e",
    alt: "Southend-on-Sea historic clock tower building",
  },
  merseyside: {
    id: "1748125696655-5b25da4364a9",
    alt: "Liverpool waterfront scene",
  },
  lancashire: {
    id: "1576154048132-c407eab9007e",
    alt: "Red building beside body of water in Lancashire",
  },
  devon: {
    id: "1561911023-ee4e7211fc4c",
    alt: "Devon sandy beach coastline",
  },
  cornwall: {
    id: "1623849778405-d4df0a84c16",
    alt: "Aerial view of Cornish beach and coastline",
  },
  somerset: {
    id: "1660404869698-82ff165782a1",
    alt: "Royal Crescent in Bath with green lawn",
  },
  norfolk: {
    id: "1588880225876-9328e1e47f54",
    alt: "Historic Norwich building under blue sky",
  },
  cambridgeshire: {
    id: "1593065836146-aaa6a55c7c89",
    alt: "Cambridge University college and grounds",
  },
  "south-yorkshire": {
    id: "1678486974989-70f082776cb2",
    alt: "Sheffield church with clock tower",
  },
  cardiff: {
    id: "1595274783963-b0c1dae2e911",
    alt: "Cardiff city skyline under blue sky",
  },
  swansea: {
    id: "1517348678194-ca7addd87931",
    alt: "Swansea Bay coastline with cliffs",
  },
  glasgow: {
    id: "1641379413799-720f9f6e9770",
    alt: "Glasgow skyline with modern architecture",
  },
  "tyne-and-wear": {
    id: "1694475201512-8348865954c4",
    alt: "Newcastle upon Tyne cityscape",
  },
  dorset: {
    id: "1683925482919-132f72778175",
    alt: "Durdle Door rock arch on Dorset coast",
  },
  oxfordshire: {
    id: "1553545699-ef565f4bd9f2",
    alt: "Oxford historic buildings and spires",
  },
  berkshire: {
    id: "1630188397757-15ddada2772b",
    alt: "Windsor Castle grounds",
  },
  buckinghamshire: {
    id: "1730476072617-59a9bef76768",
    alt: "Chiltern Hills countryside with houses in the distance",
  },
  nottinghamshire: {
    id: "1685828061654-e6ecfd1b5a93",
    alt: "Nottingham waterfront building reflections",
  },
  leicestershire: {
    id: "1618660873189-188474bd1c0a",
    alt: "Leicester historic buildings near body of water",
  },
  "county-durham": {
    id: "1699465923947-86659dff319e",
    alt: "Durham Cathedral overlooking the city",
  },
  "north-yorkshire": {
    id: "1757409434063-34027012b80c",
    alt: "York Minster gothic cathedral in warm sunlight",
  },

  // ── Town-level images ────────────────────────────────────
  "greater-london/croydon": {
    id: "1513635269975-59663e0ac1ad",
    alt: "Aerial view of London skyline",
  },
  "greater-manchester/manchester": {
    id: "1515586838455-8f8f940d6853",
    alt: "Manchester skyline with modern developments",
  },
  "greater-manchester/salford": {
    id: "1515586838455-8f8f940d6853",
    alt: "Salford and Manchester city skyline",
  },
  "west-midlands/birmingham": {
    id: "1499958060387-dbdb8d0994fb",
    alt: "Birmingham city centre and canal quarter",
  },
  "west-yorkshire/leeds": {
    id: "1683459269288-63ce626a67f2",
    alt: "Leeds city skyline with modern buildings",
  },
  "bristol/bristol-city-centre": {
    id: "1612436410902-e7123c3101d2",
    alt: "Bristol harbourside and waterfront",
  },
  "edinburgh/edinburgh": {
    id: "1595275842222-bb71d4209726",
    alt: "Edinburgh castle and Old Town skyline",
  },
  "hertfordshire/st-albans": {
    id: "1554316783-385f1d58789c",
    alt: "St Albans Cathedral and historic cityscape",
  },
  "merseyside/liverpool": {
    id: "1748125696655-5b25da4364a9",
    alt: "Liverpool waterfront and skyline",
  },
  "tyne-and-wear/newcastle": {
    id: "1694475201512-8348865954c4",
    alt: "Newcastle upon Tyne cityscape",
  },
  "south-yorkshire/sheffield": {
    id: "1678486974989-70f082776cb2",
    alt: "Sheffield city centre with historic buildings",
  },
  "nottinghamshire/nottingham": {
    id: "1685828061654-e6ecfd1b5a93",
    alt: "Nottingham waterfront and canal area",
  },
  "cardiff/cardiff-city-centre": {
    id: "1595274783963-b0c1dae2e911",
    alt: "Cardiff city skyline",
  },
  "cambridgeshire/cambridge": {
    id: "1593065836146-aaa6a55c7c89",
    alt: "Cambridge University college buildings",
  },
  "oxfordshire/oxford": {
    id: "1553545699-ef565f4bd9f2",
    alt: "Oxford dreaming spires and historic colleges",
  },
  "somerset/bath": {
    id: "1660404869698-82ff165782a1",
    alt: "Bath Royal Crescent",
  },
  "north-yorkshire/york": {
    id: "1757409434063-34027012b80c",
    alt: "York Minster cathedral",
  },
  "county-durham/durham": {
    id: "1699465923947-86659dff319e",
    alt: "Durham Cathedral and riverside",
  },
  "kent/canterbury": {
    id: "1663742587534-d2392e261e41",
    alt: "Canterbury Cathedral",
  },
  "norfolk/norwich": {
    id: "1588880225876-9328e1e47f54",
    alt: "Historic Norwich city centre",
  },
  "glasgow/glasgow": {
    id: "1641379413799-720f9f6e9770",
    alt: "Glasgow city skyline",
  },
  "sussex/brighton": {
    id: "1603776032023-ec5e5201c36e",
    alt: "Brighton Pier entrance with Union Jack flags at dusk",
  },
};

/** Default fallback image for locations without a specific photo */
const DEFAULT_IMAGE: LocationImage = {
  id: "1742457730978-f14425b8b428",
  alt: "Residential houses on a Georgian crescent in the UK",
};

/**
 * Site-wide hero/feature images for non-location pages.
 * Keyed by page or section identifier.
 */
export const SITE_IMAGES: Record<string, LocationImage> = {
  "homepage-hero": {
    id: "1639953803381-e9c3f3a38253",
    alt: "Modern residential property development under construction",
  },
  "homepage-process": {
    id: "1772442198624-4fc4d7281e89",
    alt: "Man reviews blueprints at construction site",
  },
  "case-studies-hero": {
    id: "1764722870631-877f5c694b76",
    alt: "Modern apartment building with balconies and large windows",
  },
  // Service page heroes
  "service-development-finance": {
    id: "1587582423116-ec07293f0395",
    alt: "Construction worker on a residential building site",
  },
  "service-mezzanine-finance": {
    id: "1518280651110-3e80e7c84a84",
    alt: "High-rise building under construction",
  },
  "service-bridging-loans": {
    id: "1774599730788-a74cd9253b56",
    alt: "People gathered around blueprints outdoors",
  },
  "service-equity-jv": {
    id: "1774600166818-e554a4d4c376",
    alt: "Two women in hard hats review blueprints indoors",
  },
  "service-refurbishment-finance": {
    id: "1768321901705-e7879c7b9542",
    alt: "Interior hallway under construction with exposed framing",
  },
  "service-commercial-mortgages": {
    id: "1615469309529-733e81176c42",
    alt: "Modern commercial glass window building",
  },
  "service-development-exit-finance": {
    id: "1773348287090-ac74100f3bd4",
    alt: "Modern building with brick and dark facade",
  },
  // About page
  "about-hero": {
    id: "1695886517886-da9d200f32f4",
    alt: "Papers and plans on a table",
  },
  // Guides
  "guides-hero": {
    id: "1556156657-b2925b706f19",
    alt: "Wooden building frame under construction",
  },
  // Guide category images
  "guide-development-finance": {
    id: "1541888946425-d81bb19240f5",
    alt: "Modern residential development under construction",
  },
  "guide-bridging": {
    id: "1560518883-ce09059eeffa",
    alt: "Property keys and contract documents",
  },
  "guide-mezzanine": {
    id: "1486406146926-c627a92ad1ab",
    alt: "High-rise construction with crane",
  },
  "guide-equity": {
    id: "1554469384-e58fac16e23a",
    alt: "Handshake over business documents",
  },
  "guide-refurbishment": {
    id: "1504307651254-35680f356dfd",
    alt: "Property renovation interior works",
  },
  "guide-commercial": {
    id: "1486325212027-8a9603917dc8",
    alt: "Commercial office building exterior",
  },
  "guide-general": {
    id: "1560520653-9e0e4c89eb11",
    alt: "Architectural blueprints on desk",
  },
  "guide-hidden-fees": {
    id: "1554224155-6726b3ff858f",
    alt: "Financial documents and calculator",
  },
  "guide-defaults": {
    id: "1450101499-f7e1f2b8a4e7",
    alt: "Distressed property exterior",
  },
  "guide-valuations": {
    id: "1560520031-3b0c48c048b3",
    alt: "Surveyor assessing property value",
  },
  "guide-legal": {
    id: "1589829545856-d10d557cf95f",
    alt: "Legal documents and contract signing",
  },
  "guide-application": {
    id: "1554469384-e58fac16e23a",
    alt: "Application paperwork on desk",
  },
  "guide-structuring": {
    id: "1560179707-f14e90ef3623",
    alt: "Architect reviewing development plans",
  },
  "guide-market": {
    id: "1560518883-ce09059eeffa",
    alt: "UK property market aerial view",
  },
  "guide-comparison": {
    id: "1454165804-1bbd613a7217",
    alt: "Side by side property comparison",
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
