export type { Guide, GuideSection, GuideCategory } from "./types";

import { EXISTING_GUIDES } from "./existing-guides";
import { HIDDEN_FEES_GUIDES } from "./hidden-fees";
import { DEFAULTS_GUIDES } from "./defaults";
import { VALUATIONS_GUIDES } from "./valuations";
import { LEGAL_GUIDES } from "./legal";
import { APPLICATION_GUIDES } from "./application";
import { STRUCTURING_GUIDES } from "./structuring";
import { MARKET_GUIDES } from "./market";

export const GUIDES = [
  ...EXISTING_GUIDES,
  ...HIDDEN_FEES_GUIDES,
  ...DEFAULTS_GUIDES,
  ...VALUATIONS_GUIDES,
  ...LEGAL_GUIDES,
  ...APPLICATION_GUIDES,
  ...STRUCTURING_GUIDES,
  ...MARKET_GUIDES,
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
