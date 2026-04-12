/**
 * Guides - re-exports from guides/ directory barrel.
 *
 * All guide data lives in src/lib/guides/ subdirectory files.
 * This file exists so imports like `@/lib/guides` resolve correctly.
 */

export {
  GUIDES,
  getGuideBySlug,
  getRelatedGuides,
  getGuidesByService,
  getGuidesByLocation,
} from "./guides/index";

export type {
  Guide,
  GuideSection,
  GuideCategory,
  GuideFAQ,
} from "./guides/types";
