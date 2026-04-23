import * as fs from "fs";
import * as path from "path";

import { SITE_URL } from "@/lib/constants";
import { CALCULATORS } from "@/lib/calculators";
import { CASE_STUDIES } from "@/lib/case-studies";
import { GUIDES } from "@/lib/guides";
import { MARKET_REPORTS } from "@/lib/market-reports";
import { SERVICES } from "@/lib/services";
import { UK_COUNTIES } from "@/lib/uk-locations-data";
import { GLOSSARY_TERMS } from "@/lib/glossary";
import { HUBS } from "@/lib/hubs";
import { LENDERS } from "@/lib/lenders";
import { PRODUCT_COMPARISONS } from "@/lib/product-comparisons";

interface SitemapUrl {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

const today = new Date().toISOString().split("T")[0];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrlsetXml(urls: SitemapUrl[]): string {
  const entries = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${escapeXml(u.url)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function buildSitemapIndexXml(
  sitemaps: { loc: string; lastmod: string }[]
): string {
  const entries = sitemaps
    .map(
      (s) =>
        `  <sitemap>\n    <loc>${escapeXml(s.loc)}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;
}

// --- Segment builders ---

function buildStatic(): SitemapUrl[] {
  return [
    { url: SITE_URL, lastmod: today, changefreq: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/about`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastmod: today,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/case-studies`,
      lastmod: today,
      changefreq: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/deal-room`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/locations`,
      lastmod: today,
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/why-construction-capital`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastmod: today,
      changefreq: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastmod: today,
      changefreq: "yearly",
      priority: 0.3,
    },
    // Case study detail pages
    ...CASE_STUDIES.map((cs) => ({
      url: `${SITE_URL}/case-studies/${cs.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: 0.6,
    })),
    // Hub pages
    ...HUBS.map((hub) => ({
      url: `${SITE_URL}/${hub.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: 0.9,
    })),
    // Comparison pages
    ...PRODUCT_COMPARISONS.map((comp) => ({
      url: `${SITE_URL}/compare/${comp.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

function buildServices(): SitemapUrl[] {
  return SERVICES.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastmod: today,
    changefreq: "monthly",
    priority: 0.9,
  }));
}

function buildCalculators(): SitemapUrl[] {
  return [
    {
      url: `${SITE_URL}/calculators`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.8,
    },
    ...CALCULATORS.map((calc) => ({
      url: `${SITE_URL}/calculators/${calc.slug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.8,
    })),
  ];
}

function buildGuides(): SitemapUrl[] {
  return [
    {
      url: `${SITE_URL}/guides`,
      lastmod: today,
      changefreq: "weekly",
      priority: 0.8,
    },
    ...GUIDES.map((guide) => ({
      url: `${SITE_URL}/guides/${guide.slug}`,
      lastmod: guide.dateModified ?? today,
      changefreq: "monthly",
      priority: 0.7,
    })),
  ];
}

function buildMarketReports(): SitemapUrl[] {
  return [
    {
      url: `${SITE_URL}/market-reports`,
      lastmod: today,
      changefreq: "weekly",
      priority: 0.9,
    },
    ...MARKET_REPORTS.map((report) => ({
      url: `${SITE_URL}/market-reports/${report.slug}`,
      lastmod: report.dateModified ?? today,
      changefreq: "monthly",
      priority: report.category === "town" ? 0.6 : 0.7,
    })),
  ];
}

function buildLocations(): SitemapUrl[] {
  const urls: SitemapUrl[] = [];

  for (const county of UK_COUNTIES) {
    urls.push({
      url: `${SITE_URL}/locations/${county.slug}`,
      lastmod: today,
      changefreq: "weekly",
      priority: 0.8,
    });

    for (const town of county.towns) {
      urls.push({
        url: `${SITE_URL}/locations/${county.slug}/${town.slug}`,
        lastmod: today,
        changefreq: "weekly",
        priority: 0.7,
      });

      for (const service of SERVICES) {
        urls.push({
          url: `${SITE_URL}/locations/${county.slug}/${town.slug}/${service.slug}`,
          lastmod: today,
          changefreq: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  return urls;
}

function buildGlossary(): SitemapUrl[] {
  return [
    {
      url: `${SITE_URL}/glossary`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.8,
    },
    ...GLOSSARY_TERMS.map((term) => ({
      url: `${SITE_URL}/glossary/${term.slug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.6,
    })),
  ];
}

function buildLenderPanel(): SitemapUrl[] {
  return [
    {
      url: `${SITE_URL}/lender-panel`,
      lastmod: today,
      changefreq: "weekly",
      priority: 0.8,
    },
    ...LENDERS.map((lender) => ({
      url: `${SITE_URL}/lender-panel/${lender.slug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.6,
    })),
  ];
}

function buildNews(): SitemapUrl[] {
  return [
    {
      url: `${SITE_URL}/news`,
      lastmod: today,
      changefreq: "daily",
      priority: 0.8,
    },
  ];
}

// --- Main ---

const segments: { name: string; builder: () => SitemapUrl[] }[] = [
  { name: "static", builder: buildStatic },
  { name: "services", builder: buildServices },
  { name: "calculators", builder: buildCalculators },
  { name: "guides", builder: buildGuides },
  { name: "market-reports", builder: buildMarketReports },
  { name: "locations", builder: buildLocations },
  { name: "glossary", builder: buildGlossary },
  { name: "lender-panel", builder: buildLenderPanel },
  { name: "news", builder: buildNews },
];

const outDir = path.resolve("public/sitemaps");
fs.mkdirSync(outDir, { recursive: true });

const indexEntries: { loc: string; lastmod: string }[] = [];
let totalUrls = 0;

console.log("\nGenerating sitemaps...\n");

for (const segment of segments) {
  const urls = segment.builder();
  const xml = buildUrlsetXml(urls);
  const filePath = path.join(outDir, `${segment.name}.xml`);
  fs.writeFileSync(filePath, xml, "utf-8");

  indexEntries.push({
    loc: `${SITE_URL}/sitemaps/${segment.name}.xml`,
    lastmod: today,
  });

  if (urls.length > 50000) {
    console.warn(
      `  WARNING: ${segment.name} has ${urls.length} URLs (exceeds 50,000 sitemap limit)`
    );
  }

  totalUrls += urls.length;
  const sizeKb = (Buffer.byteLength(xml, "utf-8") / 1024).toFixed(1);
  console.log(
    `  ${segment.name.padEnd(16)} ${String(urls.length).padStart(5)} URLs  ${sizeKb.padStart(7)} KB`
  );
}

// Write sitemap index
const indexXml = buildSitemapIndexXml(indexEntries);
const indexPath = path.resolve("public/sitemap.xml");
fs.writeFileSync(indexPath, indexXml, "utf-8");

console.log(`\n  Total: ${totalUrls} URLs across ${segments.length} sitemaps`);
console.log(`  Index: public/sitemap.xml`);
console.log(`  Files: public/sitemaps/*.xml\n`);
