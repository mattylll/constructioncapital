/**
 * audit-location-copy.ts — QA sweep of the programmatic location-page estate.
 *
 * Iterates every (county, town, service) combination, generates the actual
 * copy via the real content functions in src/lib/location-content.ts, and
 * flags the pSEO fingerprints that erode trust:
 *
 *   REGION_LEAK        copy mentions an anchor place name from a different
 *                      region (e.g. Teesside copy on a Leeds page)
 *   DEGENERATE_NUMBER  NaN/undefined/Infinity in output, "+0%" growth claims,
 *                      derived percentages identical across most pages
 *   UNREPLACED_TOKEN   template variables that never interpolated
 *   UNMAPPED_COUNTY    county missing from COUNTY_REGION_MAP (falls back to
 *                      uk-generic copy)
 *   BOILERPLATE_INDEX  (informational) template paragraphs shared across many
 *                      pages, measured after normalising town/county names
 *
 * Usage:  npx tsx scripts/audit-location-copy.ts
 * Output: data/generated/content-audit/report.json + report.md
 * Exit:   1 if any critical finding (leak, NaN, unmapped, unreplaced token)
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

import { UK_COUNTIES } from "../src/lib/uk-locations-data";
import { SERVICES } from "../src/lib/services";
import {
  getRegion,
  getCountyOverview,
  getTownOverview,
  getDataDrivenOverview,
  getEnrichedMarketCommentary,
  getServicePageSections,
  getServiceFaqsWithData,
  getTownFaqs,
  getDealExample,
  type Region,
} from "../src/lib/location-content";
import {
  getTownStats,
  getSoldData,
  getPlanningData,
} from "../src/lib/local-market-data";

// ─── Gazetteer ───────────────────────────────────────────────
// Anchor place names that should only appear in copy served to their own
// region. Patterns are applied with word boundaries; use lookaheads for known
// collisions (Newcastle-under-Lyme, Bradford-on-Avon). Deliberately excludes
// ambiguous or comparison-prone names (London, Oxford) that legitimately
// appear in other regions' copy.
const REGION_GAZETTEER: Record<Region, string[]> = {
  "london-se": ["Crossrail", "Central London", "Croydon", "Guildford"],
  "north-west": [
    "Manchester(?!\\s+Road)",
    "Liverpool(?!\\s+Street)",
    "Salford",
    "MediaCityUK",
    "Northern Quarter",
    "Baltic Triangle",
  ],
  "west-midlands": [
    "Birmingham",
    "Coventry",
    "Wolverhampton",
    "Black Country",
    "Jewellery Quarter",
    "Leamington",
    "Stratford-upon-Avon",
  ],
  "east-midlands": [
    "Nottingham",
    "Leicester",
    "Derby",
    "Loughborough",
    "Northampton",
    "East Midlands Freeport",
  ],
  "south-west": [
    "Bristol",
    "\\bBath\\b",
    "Exeter",
    "Plymouth",
    "Taunton",
    "Cheltenham",
    "Temple Quarter",
  ],
  yorkshire: [
    "Leeds",
    "Sheffield",
    "Bradford(?!-on-Avon)",
    "York(?!shire)",
    "Harrogate",
    "Huddersfield",
    "\\bHull\\b",
    "Wakefield",
    "Doncaster",
    "AMRC",
    "Heart of the City",
  ],
  "north-east": [
    "Newcastle(?!-under-Lyme)",
    "Gateshead",
    "Sunderland",
    "Teesside",
    "Teesworks",
    "Middlesbrough",
    "Darlington",
    "Wearside",
    "\\bTyne\\b",
  ],
  "east-of-england": [
    "Cambridge",
    "Norwich",
    "Ipswich",
    "Milton Keynes",
    "Peterborough",
  ],
  scotland: [
    "Edinburgh",
    "Glasgow",
    "Aberdeen",
    "Dundee",
    "Stirling",
    "Holyrood",
    "Standard Securities",
  ],
  wales: ["Cardiff", "Swansea", "Newport(?!\\s+Pagnell)", "Wrexham"],
  "uk-generic": [],
};

// ─── Types ───────────────────────────────────────────────────

type Severity = "critical" | "warning" | "info";

interface Finding {
  severity: Severity;
  type: string;
  county: string;
  town: string;
  service: string | null;
  url: string;
  detail: string;
}

// Legitimate cross-region mentions: hand-written town context that genuinely
// references a neighbouring region's city (economic-geography reality, not a
// template leak). Keyed "countySlug/townSlug" → allowed anchors.
const CROSS_REGION_ALLOWLIST: Record<string, string[]> = {
  "derbyshire/chesterfield": ["Sheffield"], // Sheffield commuter town
  "derbyshire/dronfield": ["Sheffield"],
  "cheshire/chester": ["Wrexham"], // Welsh-border economy
};

// ─── Helpers ─────────────────────────────────────────────────

function sha1(s: string): string {
  return crypto.createHash("sha1").update(s).digest("hex").slice(0, 12);
}

function flattenToText(value: unknown): string[] {
  if (value == null) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenToText);
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(
      flattenToText
    );
  }
  
return [String(value)];
}

/** Replace town/county names with tokens so shared templates hash equally. */
function normalise(paragraph: string, names: string[]): string {
  let out = paragraph;
  for (const name of names) {
    if (!name) continue;
    out = out.replace(
      new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
      "‹place›"
    );
  }
  // Collapse interpolated numbers so £235,000 vs £180,000 hash equally

  return out.replace(/£?[\d,.]+%?/g, "‹n›");
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  // getRegion warns on unmapped counties; we do our own check below.
  const realWarn = console.warn;
  console.warn = () => {};

  const findings: Finding[] = [];
  const serviceSlugs = SERVICES.map((s) => s.slug);

  // Paragraph frequency across pages (normalised) → boilerplate index
  const paraCount = new Map<string, { count: number; sample: string }>();
  // Percentage-token frequency across service pages → catches 47%-style constants
  const pctCount = new Map<string, number>();
  let servicePageCount = 0;
  // Per-page shared-paragraph tracking (second pass over stored hashes)
  const pageParas: { url: string; hashes: string[] }[] = [];

  const leakRegexes = new Map<Region, { anchor: string; re: RegExp }[]>();
  for (const [region, anchors] of Object.entries(REGION_GAZETTEER)) {
    leakRegexes.set(
      region as Region,
      anchors.map((a) => ({
        anchor: a.replace(/\\b|\(\?!.*?\)/g, ""),
        re: new RegExp(a.includes("\\b") ? a : `\\b${a}\\b`, "g"),
      }))
    );
  }

  for (const county of UK_COUNTIES) {
    const countyRegion = getRegion(county.slug);

    // UNMAPPED_COUNTY — no county should legitimately resolve to uk-generic
    if (countyRegion === "uk-generic") {
      findings.push({
        severity: "critical",
        type: "UNMAPPED_COUNTY",
        county: county.slug,
        town: "",
        service: null,
        url: `/locations/${county.slug}`,
        detail: `County "${county.slug}" has no COUNTY_REGION_MAP entry — serving uk-generic fallback copy`,
      });
    }

    const townNamesInCounty = county.towns.map((t) => t.name);

    // County page copy
    const countyCopy = flattenToText(
      getCountyOverview(county.slug, county.name)
    );
    checkCopy(countyCopy, county.slug, "", null, `/locations/${county.slug}`);

    for (const town of county.towns) {
      const townStats = getTownStats(county.slug, town.slug);
      const soldData = getSoldData(county.slug, town.slug);
      const planningData = getPlanningData(county.slug, town.slug);

      const largestPending = planningData?.pendingApplications
        ?.filter((a) => a.units)
        .sort((a, b) => (b.units ?? 0) - (a.units ?? 0))[0];
      const faqData = {
        medianPrice: soldData?.stats.medianPrice,
        medianByType: soldData?.stats.medianByType,
        transactionCount12m: soldData?.stats.transactionCount12m,
        yoyChange: soldData?.stats.yoyChange,
        context: town.context,
        pipelineUnits: planningData?.summary.pendingUnits || undefined,
        pendingCount: planningData?.summary.pending || undefined,
        largestScheme: largestPending?.units
          ? { address: largestPending.address, units: largestPending.units }
          : undefined,
        newBuildPremium: soldData?.stats.newBuildPremium,
        councilName: planningData?.localAuthority,
        soldDataAsOf: soldData?.updatedAt,
      };

      // Town page copy
      const townUrl = `/locations/${county.slug}/${town.slug}`;
      const townCopy = [
        ...flattenToText(getTownOverview(town.name, county.name, county.slug)),
        ...flattenToText(
          getDataDrivenOverview(town.name, county.name, county.slug, town.slug, {
            context: town.context,
            medianPrice: soldData?.stats.medianPrice,
            medianByType: soldData?.stats.medianByType,
            transactionCount12m: soldData?.stats.transactionCount12m,
            yoyChange: soldData?.stats.yoyChange,
            newBuildCount: soldData?.stats.newBuildCount,
          }).map((p) => p.text)
        ),
        ...flattenToText(
          getTownFaqs(town.name, county.name, county.slug, town.slug, faqData)
        ),
      ];
      checkCopy(townCopy, county.slug, town.slug, null, townUrl);
      recordParas(townCopy, townUrl, [town.name, county.name]);

      // Data-level degeneracy (rendered by components, sourced from JSON)
      if (planningData) {
        const decided =
          planningData.summary.approved + planningData.summary.refused;
        if (decided === 0 && planningData.summary.pending > 0) {
          findings.push({
            severity: "info",
            type: "ALL_PENDING_PLANNING",
            county: county.slug,
            town: town.slug,
            service: null,
            url: townUrl,
            detail: `Planning dataset has ${planningData.summary.pending} apps, none decided — approval stats suppressed by component guard`,
          });
        }
      }
      if (soldData?.stats.yoyChange === 0) {
        findings.push({
          severity: "info",
          type: "FLAT_YOY",
          county: county.slug,
          town: town.slug,
          service: null,
          url: townUrl,
          detail: "YoY change is exactly 0 — must render neutrally, never '+0%'",
        });
      }

      // Service pages
      for (const serviceSlug of serviceSlugs) {
        const url = `/locations/${county.slug}/${town.slug}/${serviceSlug}`;
        servicePageCount++;
        const deal = getDealExample(serviceSlug, town.name);
        const serviceCopy = [
          ...flattenToText(
            getEnrichedMarketCommentary(
              serviceSlug,
              county.slug,
              town.name,
              county.name,
              faqData
            )
          ),
          ...flattenToText(
            getServicePageSections(
              serviceSlug,
              town.name,
              county.name,
              faqData,
              county.slug
            )
          ),
          ...flattenToText(
            getServiceFaqsWithData(serviceSlug, town.name, county.name, faqData)
          ),
          ...flattenToText(deal),
        ];
        checkCopy(
          serviceCopy,
          county.slug,
          town.slug,
          serviceSlug,
          url,
          faqData.largestScheme ? [faqData.largestScheme.address] : []
        );
        recordParas(serviceCopy, url, [town.name, county.name]);

        // Percentage-constant harvest (catches "always 47.0%" class of bug)
        for (const text of serviceCopy) {
          for (const m of text.matchAll(/\b(\d{1,3}(?:\.\d)?)%/g)) {
            pctCount.set(m[1], (pctCount.get(m[1]) ?? 0) + 1);
          }
        }
      }
    }

    function checkCopy(
      paragraphs: string[],
      countySlug: string,
      townSlug: string,
      service: string | null,
      url: string,
      dataDerivedStrings: string[] = []
    ) {
      let text = paragraphs.join("\n");
      // Real-world strings pulled from the data (scheme addresses etc.) can
      // legitimately contain place-like street names ("Cambridge Road") —
      // scrub them before gazetteer matching.
      for (const s of dataDerivedStrings) {
        if (!s) continue;
        text = text.split(s).join("‹address›");
        const short = s.split(",").slice(0, 2).join(",");
        if (short && short !== s) text = text.split(short).join("‹address›");
      }

      // REGION_LEAK
      for (const [region, patterns] of leakRegexes) {
        if (region === countyRegion || region === "uk-generic") continue;
        for (const { anchor, re } of patterns) {
          re.lastIndex = 0;
          if (!re.test(text)) continue;
          // Allowlist: the anchor is this page's own town/county or a
          // sibling town in the same county (e.g. Newport, Shropshire)
          const anchorLower = anchor.toLowerCase();
          if (
            townSlug.replace(/-/g, " ").includes(anchorLower) ||
            countySlug.replace(/-/g, " ").includes(anchorLower) ||
            townNamesInCounty.some((n) => n.toLowerCase() === anchorLower) ||
            CROSS_REGION_ALLOWLIST[`${countySlug}/${townSlug}`]?.some(
              (a) => a.toLowerCase() === anchorLower
            )
          ) {
            continue;
          }
          findings.push({
            severity: "critical",
            type: "REGION_LEAK",
            county: countySlug,
            town: townSlug,
            service,
            url,
            detail: `Copy for ${countyRegion} page mentions "${anchor}" (${region} anchor)`,
          });
        }
      }

      // DEGENERATE_NUMBER — literals that should never render
      if (/NaN|£undefined|\bundefined\b|£null|Infinity/.test(text)) {
        findings.push({
          severity: "critical",
          type: "DEGENERATE_NUMBER",
          county: countySlug,
          town: townSlug,
          service,
          url,
          detail: `Literal NaN/undefined/Infinity in copy: "${text.match(/.{0,40}(NaN|undefined|null|Infinity).{0,40}/)?.[0]}"`,
        });
      }
      if (/\+0(\.0)?%/.test(text)) {
        findings.push({
          severity: "warning",
          type: "DEGENERATE_NUMBER",
          county: countySlug,
          town: townSlug,
          service,
          url,
          detail: `"+0%" growth claim in copy — flat figures must render neutrally`,
        });
      }

      // UNREPLACED_TOKEN
      const token = text.match(/\$\{[^}]*\}|\{\{[^}]*\}\}|%TOWN%|%COUNTY%|\[town\]|\[county\]/i);
      if (token) {
        findings.push({
          severity: "critical",
          type: "UNREPLACED_TOKEN",
          county: countySlug,
          town: townSlug,
          service,
          url,
          detail: `Unreplaced template token: "${token[0]}"`,
        });
      }
    }

    function recordParas(paragraphs: string[], url: string, names: string[]) {
      const hashes: string[] = [];
      for (const p of paragraphs) {
        if (p.length < 120) continue; // skip headings/short strings
        const h = sha1(normalise(p, names));
        hashes.push(h);
        const entry = paraCount.get(h);
        if (entry) entry.count++;
        else paraCount.set(h, { count: 1, sample: p.slice(0, 160) });
      }
      pageParas.push({ url, hashes });
    }
  }

  console.warn = realWarn;

  // ── Aggregate: boilerplate index ──
  const sharedParas = [...paraCount.entries()]
    .filter(([, v]) => v.count > 100)
    .sort((a, b) => b[1].count - a[1].count);

  const sharedHashSet = new Set(sharedParas.map(([h]) => h));
  let totalParas = 0;
  let sharedTotal = 0;
  const worstPages: { url: string; sharedPct: number; paras: number }[] = [];
  for (const page of pageParas) {
    if (page.hashes.length === 0) continue;
    const shared = page.hashes.filter((h) => sharedHashSet.has(h)).length;
    totalParas += page.hashes.length;
    sharedTotal += shared;
    worstPages.push({
      url: page.url,
      sharedPct: Math.round((shared / page.hashes.length) * 100),
      paras: page.hashes.length,
    });
  }
  worstPages.sort((a, b) => b.sharedPct - a.sharedPct);

  // ── Aggregate: percentage constants across service pages ──
  const suspiciousPcts = [...pctCount.entries()]
    .filter(([, count]) => count > servicePageCount * 0.5 && count > 200)
    .sort((a, b) => b[1] - a[1]);
  for (const [pct, count] of suspiciousPcts) {
    // Quoted rate ranges ("65%", "70% LTGDV") are intentional product terms —
    // report as info so a human can judge, critical only if a derived-looking
    // decimal (e.g. "47.0") saturates the estate.
    findings.push({
      severity: /\.\d/.test(pct) ? "critical" : "info",
      type: "CONSTANT_METRIC",
      county: "",
      town: "",
      service: null,
      url: "",
      detail: `"${pct}%" appears on ${count} of ${servicePageCount} service pages — verify it is a quoted term, not a broken derived metric`,
    });
  }

  // ── Report ──
  const outDir = path.join(process.cwd(), "data", "generated", "content-audit");
  fs.mkdirSync(outDir, { recursive: true });

  const critical = findings.filter((f) => f.severity === "critical");
  const warnings = findings.filter((f) => f.severity === "warning");
  const infos = findings.filter((f) => f.severity === "info");

  const report = {
    generatedAt: new Date().toISOString(),
    pagesAudited: pageParas.length,
    summary: {
      critical: critical.length,
      warning: warnings.length,
      info: infos.length,
      boilerplateIndexPct:
        totalParas > 0 ? Math.round((sharedTotal / totalParas) * 100) : 0,
    },
    findings,
    boilerplate: {
      sharedParagraphs: sharedParas.slice(0, 40).map(([h, v]) => ({
        hash: h,
        pages: v.count,
        sample: v.sample,
      })),
      worstPages: worstPages.slice(0, 30),
    },
  };
  fs.writeFileSync(
    path.join(outDir, "report.json"),
    JSON.stringify(report, null, 2)
  );

  const byType = new Map<string, Finding[]>();
  for (const f of findings) {
    const list = byType.get(`${f.severity}/${f.type}`) ?? [];
    list.push(f);
    byType.set(`${f.severity}/${f.type}`, list);
  }

  const md: string[] = [
    `# Location Copy Audit — ${new Date().toISOString().slice(0, 10)}`,
    "",
    `Pages audited: **${pageParas.length}** (county + town + town×service)`,
    "",
    `| Severity | Count |`,
    `| --- | --- |`,
    `| Critical | ${critical.length} |`,
    `| Warning | ${warnings.length} |`,
    `| Info | ${infos.length} |`,
    "",
    `**Boilerplate index:** ${report.summary.boilerplateIndexPct}% of long paragraphs sitewide are template paragraphs shared by >100 pages (after normalising place names and figures).`,
    "",
    "## Findings by type",
    "",
  ];
  for (const [key, list] of [...byType.entries()].sort()) {
    md.push(`### ${key} (${list.length})`);
    md.push("");
    for (const f of list.slice(0, 20)) {
      md.push(`- \`${f.url || "sitewide"}\` — ${f.detail}`);
    }
    if (list.length > 20) md.push(`- …and ${list.length - 20} more (see report.json)`);
    md.push("");
  }
  md.push("## Most-shared template paragraphs");
  md.push("");
  for (const [, v] of sharedParas.slice(0, 15)) {
    md.push(`- **${v.count} pages** — “${v.sample}…”`);
  }
  md.push("");
  md.push("## Pages with highest boilerplate share");
  md.push("");
  for (const p of worstPages.slice(0, 15)) {
    md.push(`- \`${p.url}\` — ${p.sharedPct}% of ${p.paras} paragraphs shared`);
  }
  md.push("");
  fs.writeFileSync(path.join(outDir, "report.md"), md.join("\n"));

  console.log(`\nAudited ${pageParas.length} pages`);
  console.log(`Critical: ${critical.length} · Warning: ${warnings.length} · Info: ${infos.length}`);
  console.log(`Boilerplate index: ${report.summary.boilerplateIndexPct}%`);
  console.log(`Report: ${path.join(outDir, "report.md")}`);

  if (critical.length > 0) {
    console.error(`\n❌ ${critical.length} critical finding(s) — see report.md`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
