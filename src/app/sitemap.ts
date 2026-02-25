import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { GUIDES } from "@/lib/guides";
import { SERVICES } from "@/lib/services";
import { UK_COUNTIES } from "@/lib/uk-locations-data";

// Static case study slugs — will be replaced with Convex data
const CASE_STUDY_SLUGS = [
  "residential-scheme-manchester",
  "mixed-use-conversion-birmingham",
  "auction-purchase-london",
  "jv-residential-bristol",
  "hmo-conversion-leeds",
  "commercial-acquisition-edinburgh",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
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
  ];

  // Case study pages
  const caseStudyPages: MetadataRoute.Sitemap = CASE_STUDY_SLUGS.map(
    (slug) => ({
      url: `${SITE_URL}/case-studies/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  // Dynamic location pages — all counties, towns, and town/service combinations
  const locationPages: MetadataRoute.Sitemap = [];

  for (const county of UK_COUNTIES) {
    // County page
    locationPages.push({
      url: `${SITE_URL}/locations/${county.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    for (const town of county.towns) {
      // Town page
      locationPages.push({
        url: `${SITE_URL}/locations/${county.slug}/${town.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });

      // Service pages for this town
      for (const service of SERVICES) {
        locationPages.push({
          url: `${SITE_URL}/locations/${county.slug}/${town.slug}/${service.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  // Guide pages
  const guidePages: MetadataRoute.Sitemap = [
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

  return [...staticPages, ...caseStudyPages, ...guidePages, ...locationPages];
}
