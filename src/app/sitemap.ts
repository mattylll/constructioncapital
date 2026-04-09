import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { CALCULATORS } from "@/lib/calculators";
import { CASE_STUDIES } from "@/lib/case-studies";
import { GUIDES } from "@/lib/guides";
import { MARKET_REPORTS } from "@/lib/market-reports";
import { SERVICES } from "@/lib/services";
import { UK_COUNTIES } from "@/lib/uk-locations-data";
import { GLOSSARY_TERMS } from "@/lib/glossary";
import { LENDERS } from "@/lib/lenders";

/**
 * Numeric IDs so Next.js generates a proper sitemap index at /sitemap.xml
 * pointing to /sitemap/0.xml, /sitemap/1.xml, etc.
 */
const SEGMENTS = [
  "static",
  "services",
  "calculators",
  "guides",
  "market-reports",
  "locations",
  "glossary",
  "lender-panel",
  "news",
] as const;

export async function generateSitemaps(): Promise<{ id: number }[]> {
  return SEGMENTS.map((_, i) => ({ id: i }));
}

export default function sitemap({
  id,
}: {
  id: number;
}): MetadataRoute.Sitemap {
  const now = new Date();
  const segment = SEGMENTS[id];

  switch (segment) {
    case "static":
      return [
        {
          url: SITE_URL,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 1,
        },
        {
          url: `${SITE_URL}/about`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.8,
        },
        {
          url: `${SITE_URL}/faq`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        },
        {
          url: `${SITE_URL}/services`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.9,
        },
        {
          url: `${SITE_URL}/case-studies`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        },
        {
          url: `${SITE_URL}/deal-room`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.9,
        },
        {
          url: `${SITE_URL}/locations`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.9,
        },
        {
          url: `${SITE_URL}/why-construction-capital`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.8,
        },
        // Case study detail pages
        ...CASE_STUDIES.map((cs) => ({
          url: `${SITE_URL}/case-studies/${cs.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
      ];

    case "services":
      return SERVICES.map((service) => ({
        url: `${SITE_URL}/services/${service.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      }));

    case "calculators":
      return [
        {
          url: `${SITE_URL}/calculators`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.8,
        },
        ...CALCULATORS.map((calc) => ({
          url: `${SITE_URL}/calculators/${calc.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        })),
      ];

    case "guides":
      return [
        {
          url: `${SITE_URL}/guides`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        },
        ...GUIDES.map((guide) => ({
          url: `${SITE_URL}/guides/${guide.slug}`,
          lastModified: new Date(guide.dateModified),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        })),
      ];

    case "market-reports":
      return [
        {
          url: `${SITE_URL}/market-reports`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.9,
        },
        ...MARKET_REPORTS.map((report) => ({
          url: `${SITE_URL}/market-reports/${report.slug}`,
          lastModified: new Date(report.dateModified),
          changeFrequency: "monthly" as const,
          priority: report.category === "town" ? 0.6 : 0.7,
        })),
      ];

    case "locations": {
      const pages: MetadataRoute.Sitemap = [];

      for (const county of UK_COUNTIES) {
        pages.push({
          url: `${SITE_URL}/locations/${county.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });

        for (const town of county.towns) {
          pages.push({
            url: `${SITE_URL}/locations/${county.slug}/${town.slug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
          });

          for (const service of SERVICES) {
            pages.push({
              url: `${SITE_URL}/locations/${county.slug}/${town.slug}/${service.slug}`,
              lastModified: now,
              changeFrequency: "monthly",
              priority: 0.6,
            });
          }
        }
      }

      return pages;
    }

    case "glossary":
      return [
        {
          url: `${SITE_URL}/glossary`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.8,
        },
        ...GLOSSARY_TERMS.map((term) => ({
          url: `${SITE_URL}/glossary/${term.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
      ];

    case "lender-panel":
      return [
        {
          url: `${SITE_URL}/lender-panel`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        },
        ...LENDERS.map((lender) => ({
          url: `${SITE_URL}/lender-panel/${lender.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
      ];

    case "news":
      // News index only — individual article URLs are added dynamically
      // when the SQLite DB is available (better-sqlite3 is a devDependency)
      return [
        {
          url: `${SITE_URL}/news`,
          lastModified: now,
          changeFrequency: "daily",
          priority: 0.8,
        },
      ];

    default:
      return [];
  }
}
