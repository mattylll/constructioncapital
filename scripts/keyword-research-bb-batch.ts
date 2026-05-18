/**
 * Bradley Benner batch — keyword research for the highest-impression GSC
 * location pages that are not converting clicks.
 *
 * Locations targeted (drawn from May 2026 GSC opportunity report):
 *   - Stafford (Staffordshire)         — 935 imp / 1 click, pos 7.1
 *   - Nottinghamshire / Nottingham      — 878 / 632 imp combined
 *   - Poole (Dorset) / commercial      — 707 imp / 1 click
 *   - Derbyshire                       — 657 imp / 1 click
 *   - Hull (East Riding) / bridging    — 444 imp / 1 click
 *   - Portsmouth (Hampshire) / bridging — 408 imp / 1 click
 *   - Wolverhampton (West Mids) / brid — 300 imp / 2 click
 *   - Sussex / county hub               — 344 imp / 2 click
 *   - Oxford (Oxfordshire) / commercial — 117 imp / 2 click
 *
 * Pulls keyword_overview + related_keywords for each target so we can build
 * entity-variant lists for H1/H2/H3 differentiation per Benner methodology.
 *
 * Output: data/generated/keyword-research/bb-batch-<date>.{json,md}
 *
 * Usage: npx tsx scripts/keyword-research-bb-batch.ts
 */

import * as fs from "fs";
import * as path from "path";

// ── Targets ───────────────────────────────────────────────────────────────

interface Target {
  city: string;            // primary entity (Wikipedia title)
  county: string;          // parent administrative area
  countySlug: string;
  citySlug: string;
  service: string;         // GSC product the page targets
  gscNote: string;
}

const TARGETS: Target[] = [
  { city: "Stafford", county: "Staffordshire", countySlug: "staffordshire", citySlug: "stafford", service: "commercial-mortgages", gscNote: "935 imp / 1 click pos 15.3" },
  { city: "Stafford", county: "Staffordshire", countySlug: "staffordshire", citySlug: "stafford", service: "development-finance", gscNote: "county hub 935 imp" },
  { city: "Nottingham", county: "Nottinghamshire", countySlug: "nottinghamshire", citySlug: "nottingham", service: "development-finance", gscNote: "632 imp / 2 click pos 10.8" },
  { city: "Poole", county: "Dorset", countySlug: "dorset", citySlug: "poole", service: "commercial-mortgages", gscNote: "707 imp / 1 click pos 18.5" },
  { city: "Hull", county: "East Riding of Yorkshire", countySlug: "east-riding-of-yorkshire", citySlug: "hull", service: "bridging-loans", gscNote: "444 imp / 1 click pos 10.0" },
  { city: "Portsmouth", county: "Hampshire", countySlug: "hampshire", citySlug: "portsmouth", service: "bridging-loans", gscNote: "408 imp / 1 click pos 19.5" },
  { city: "Wolverhampton", county: "West Midlands", countySlug: "west-midlands", citySlug: "wolverhampton", service: "bridging-loans", gscNote: "300 imp / 2 click pos 11.8" },
  { city: "Harlow", county: "Essex", countySlug: "essex", citySlug: "harlow", service: "bridging-loans", gscNote: "216 imp / 2 click pos 32.8" },
  { city: "Oxford", county: "Oxfordshire", countySlug: "oxfordshire", citySlug: "oxford", service: "commercial-mortgages", gscNote: "117 imp / 2 click pos 18.9" },
];

// Service-specific keyword variants
const SERVICE_VARIANTS: Record<string, string[]> = {
  "commercial-mortgages": [
    "commercial mortgages",
    "commercial mortgage",
    "commercial mortgage broker",
    "commercial mortgage lenders",
    "commercial mortgage rates",
  ],
  "development-finance": [
    "development finance",
    "property development finance",
    "development loans",
    "development loan",
    "construction finance",
    "property development loans",
  ],
  "bridging-loans": [
    "bridging loans",
    "bridging loan",
    "bridging finance",
    "commercial bridging",
    "auction bridging",
    "fast bridging loan",
    "short term property loan",
  ],
};

// ── DFS plumbing ──────────────────────────────────────────────────────────

const ENV_PATH = path.join(process.cwd(), ".env.local");
const DATAFORSEO_AUTH = (() => {
  if (process.env.DATAFORSEO_AUTH) return process.env.DATAFORSEO_AUTH;
  if (fs.existsSync(ENV_PATH)) {
    const m = fs.readFileSync(ENV_PATH, "utf-8").match(/DATAFORSEO_AUTH=([^\s]+)/);
    if (m) return m[1];
  }
  return null;
})();

if (!DATAFORSEO_AUTH) {
  console.error("Missing DATAFORSEO_AUTH in env or .env.local");
  process.exit(1);
}

const UK_LOCATION_CODE = 2826;

interface KeywordInfo {
  keyword: string;
  search_volume: number | null;
  cpc: number | null;
  competition_level: string | null;
  competition_index: number | null;
  intent: string | null;
}

async function dfs(endpoint: string, body: unknown): Promise<unknown> {
  const res = await fetch(`https://api.dataforseo.com/v3${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${DATAFORSEO_AUTH}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`DFS ${endpoint} -> HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

function buildSeeds(t: Target): string[] {
  const variants = SERVICE_VARIANTS[t.service] ?? [];
  const out: string[] = [];
  const places = [t.city, t.county, `${t.city} ${t.county}`];
  for (const v of variants) {
    for (const p of places) {
      out.push(`${v} ${p.toLowerCase()}`);
      out.push(`${v} in ${p.toLowerCase()}`);
    }
  }
  // De-dupe
  return [...new Set(out)];
}

async function fetchOverview(keywords: string[]): Promise<Map<string, KeywordInfo>> {
  const result = new Map<string, KeywordInfo>();
  const batch = keywords.slice(0, 100);
  const body = [
    { keywords: batch, location_code: UK_LOCATION_CODE, language_code: "en" },
  ];
  const json = (await dfs("/dataforseo_labs/google/keyword_overview/live", body)) as {
    tasks?: { result?: { items?: {
      keyword: string;
      keyword_info?: { search_volume?: number; cpc?: number; competition_level?: string; competition_index?: number };
      search_intent_info?: { main_intent?: string };
    }[] }[] }[];
  };
  const items = json.tasks?.[0]?.result?.[0]?.items ?? [];
  for (const item of items) {
    const info = item.keyword_info ?? {};
    const intent = item.search_intent_info ?? {};
    result.set(item.keyword.toLowerCase(), {
      keyword: item.keyword,
      search_volume: info.search_volume ?? null,
      cpc: info.cpc ?? null,
      competition_level: info.competition_level ?? null,
      competition_index: info.competition_index ?? null,
      intent: intent.main_intent ?? null,
    });
  }
  return result;
}

async function fetchRelated(seed: string): Promise<KeywordInfo[]> {
  const body = [
    {
      keyword: seed,
      location_code: UK_LOCATION_CODE,
      language_code: "en",
      limit: 20,
      depth: 1,
    },
  ];
  try {
    const json = (await dfs("/dataforseo_labs/google/related_keywords/live", body)) as {
      tasks?: { result?: { items?: {
        keyword_data?: {
          keyword: string;
          keyword_info?: { search_volume?: number; cpc?: number; competition_level?: string; competition_index?: number };
          search_intent_info?: { main_intent?: string };
        };
      }[] }[] }[];
    };
    const items = json.tasks?.[0]?.result?.[0]?.items ?? [];
    return items.flatMap((it) => {
      const kd = it.keyword_data;
      if (!kd) return [];
      return [{
        keyword: kd.keyword,
        search_volume: kd.keyword_info?.search_volume ?? null,
        cpc: kd.keyword_info?.cpc ?? null,
        competition_level: kd.keyword_info?.competition_level ?? null,
        competition_index: kd.keyword_info?.competition_index ?? null,
        intent: kd.search_intent_info?.main_intent ?? null,
      }];
    });
  } catch (e) {
    console.error(`  related fetch failed for "${seed}":`, (e as Error).message);
    return [];
  }
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  console.error(`Bradley Benner batch keyword research — ${today}`);
  console.error(`Targets: ${TARGETS.length}`);

  const out: {
    target: Target;
    seeds: KeywordInfo[];
    related: KeywordInfo[];
  }[] = [];

  for (const t of TARGETS) {
    console.error(`\n→ ${t.city} / ${t.service} (${t.gscNote})`);
    const seeds = buildSeeds(t);
    console.error(`  ${seeds.length} seed keywords`);
    const overviewMap = await fetchOverview(seeds);
    const seedRows = seeds.map(
      (s) => overviewMap.get(s.toLowerCase()) ?? {
        keyword: s, search_volume: null, cpc: null, competition_level: null, competition_index: null, intent: null,
      }
    );

    // Pick top 2 seeds with volume for related-keywords expansion
    const withVol = seedRows.filter((r) => r.search_volume && r.search_volume > 0)
      .sort((a, b) => (b.search_volume ?? 0) - (a.search_volume ?? 0));
    const expansionSeeds = withVol.slice(0, 2);
    console.error(`  ${withVol.length} seeds with volume; expanding top ${expansionSeeds.length}`);

    const related: KeywordInfo[] = [];
    for (const e of expansionSeeds) {
      const r = await fetchRelated(e.keyword);
      related.push(...r);
      await new Promise((r) => setTimeout(r, 300));
    }
    // De-dupe related by keyword
    const seen = new Set<string>();
    const dedupedRelated = related.filter((r) => {
      const k = r.keyword.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    out.push({ target: t, seeds: seedRows, related: dedupedRelated });
  }

  const outDir = path.join(process.cwd(), "data", "generated", "keyword-research");
  fs.mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, `bb-batch-${today}.json`);
  const mdPath = path.join(outDir, `bb-batch-${today}.md`);
  fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2), "utf-8");

  // Markdown summary
  const lines: string[] = [
    `# Bradley Benner batch keyword research — ${today}`,
    ``,
    `Source: DataForSEO Labs \`keyword_overview/live\` + \`related_keywords/live\`, location_code 2826 (UK), en.`,
    ``,
    `Targets are GSC high-impression / low-CTR location pages on constructioncapital.co.uk.`,
    ``,
  ];

  const fmtVol = (v: number | null) => (v == null ? "  — " : String(v).padStart(5));
  const fmtCpc = (v: number | null) => (v == null ? "  — " : `£${v.toFixed(2)}`);

  for (const row of out) {
    const t = row.target;
    lines.push(`\n## ${t.city} — ${t.service}`);
    lines.push(`\n_${t.gscNote}_\n`);
    lines.push(`### Seed keyword volumes`);
    const withVol = row.seeds.filter((s) => s.search_volume && s.search_volume > 0)
      .sort((a, b) => (b.search_volume ?? 0) - (a.search_volume ?? 0));
    if (withVol.length === 0) {
      lines.push(`(No volume data returned by DFS for these seed phrases.)`);
    } else {
      lines.push(`| Vol | CPC | Comp | Intent | Keyword |`);
      lines.push(`|---:|---:|:---|:---|:---|`);
      for (const k of withVol.slice(0, 12)) {
        lines.push(`| ${fmtVol(k.search_volume)} | ${fmtCpc(k.cpc)} | ${k.competition_level ?? "—"} | ${k.intent ?? "—"} | \`${k.keyword}\` |`);
      }
    }

    lines.push(`\n### Related keywords (top 15 by volume)`);
    const relWithVol = row.related.filter((r) => r.search_volume && r.search_volume > 0)
      .sort((a, b) => (b.search_volume ?? 0) - (a.search_volume ?? 0));
    if (relWithVol.length === 0) {
      lines.push(`(No related keywords returned with volume.)`);
    } else {
      lines.push(`| Vol | CPC | Comp | Intent | Keyword |`);
      lines.push(`|---:|---:|:---|:---|:---|`);
      for (const k of relWithVol.slice(0, 15)) {
        lines.push(`| ${fmtVol(k.search_volume)} | ${fmtCpc(k.cpc)} | ${k.competition_level ?? "—"} | ${k.intent ?? "—"} | \`${k.keyword}\` |`);
      }
    }
  }

  fs.writeFileSync(mdPath, lines.join("\n"), "utf-8");
  console.error(`\nWrote ${jsonPath}`);
  console.error(`Wrote ${mdPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
