export type { Guide, GuideSection, GuideCategory, GuideFAQ } from "./types";

import { COMPARISON_GUIDES } from "./comparison";
import { EXISTING_GUIDES } from "./existing-guides";
import { HIDDEN_FEES_GUIDES } from "./hidden-fees";
import { DEFAULTS_GUIDES } from "./defaults";
import { VALUATIONS_GUIDES } from "./valuations";
import { LEGAL_GUIDES } from "./legal";
import { APPLICATION_GUIDES } from "./application";
import { STRUCTURING_GUIDES } from "./structuring";
import { MARKET_GUIDES } from "./market";
import { SEGMENTS_GUIDES } from "./segments";

import { CONTENT_GAP_WAVE_1_GUIDES } from "./content-gap-wave-1";

export const GUIDES = [
  ...COMPARISON_GUIDES,
  ...EXISTING_GUIDES,
  ...HIDDEN_FEES_GUIDES,
  ...DEFAULTS_GUIDES,
  ...VALUATIONS_GUIDES,
  ...LEGAL_GUIDES,
  ...APPLICATION_GUIDES,
  ...STRUCTURING_GUIDES,
  ...MARKET_GUIDES,
  ...SEGMENTS_GUIDES,
  ...CONTENT_GAP_WAVE_1_GUIDES,
];

export function getGuideBySlug(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}

export function getRelatedGuides(currentSlug: string) {
  const current = getGuideBySlug(currentSlug);
  if (!current) return [];
  
return current.relatedSlugs
    .map((s) => getGuideBySlug(s))
    .filter((g): g is NonNullable<typeof g> => g !== undefined);
}

/** Get guides that list a specific service in their relatedServices */
export function getGuidesByService(serviceSlug: string, limit = 5) {
  return GUIDES.filter((g) => g.relatedServices.includes(serviceSlug)).slice(
    0,
    limit
  );
}

/** Get guides that list a specific county slug in their relatedLocations */
export function getGuidesByLocation(countySlug: string, limit = 4) {
  return GUIDES.filter((g) => g.relatedLocations.includes(countySlug)).slice(
    0,
    limit
  );
}
