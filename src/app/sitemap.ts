import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { CALCULATORS } from "@/lib/calculators";
import { GUIDES } from "@/lib/guides";
import { MARKET_REPORTS } from "@/lib/market-reports";
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
  ];

  // Individual service pages
  const servicePages: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

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

  // Calculator pages
  const calculatorPages: MetadataRoute.Sitemap = [
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

  // Market report pages
  const marketReportPages: MetadataRoute.Sitemap = [
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

  return [...staticPages, ...servicePages, ...calculatorPages, ...caseStudyPages, ...guidePages, ...marketReportPages, ...locationPages];
}
