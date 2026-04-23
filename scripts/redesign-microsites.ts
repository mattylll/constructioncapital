/**
 * Redesign Microsite Propagator
 *
 * Uses the Manchester Development Finance repo as the MASTER TEMPLATE and
 * applies its redesigned files (components, globals.css, shells, data types)
 * across all sibling microsites, parameterised per-location.
 *
 * Workflow per site:
 *   1. Locate the local repo directory (clone if missing).
 *   2. Copy TEMPLATE_FILES from Manchester, verbatim.
 *   3. Generate/overwrite PARAMETERISED_FILES (site-config.ts, network-sites.ts,
 *      market-data.ts, homepage H1/meta) using per-site data.
 *   4. Assign a deterministic accent colour from the slug hash.
 *   5. Commit and optionally push.
 *
 * Usage:
 *   npx tsx scripts/redesign-microsites.ts --site manchester-dev --dry-run
 *   npx tsx scripts/redesign-microsites.ts --site barnet-dev --commit
 *   npx tsx scripts/redesign-microsites.ts --type development-finance --commit
 *   npx tsx scripts/redesign-microsites.ts --type bridging --commit
 *   npx tsx scripts/redesign-microsites.ts --all --commit --push
 *   npx tsx scripts/redesign-microsites.ts --all --limit 5 --dry-run
 *
 * Flags:
 *   --site <slug>       Single site
 *   --type <t>          All sites of given type (development-finance | bridging | niche)
 *   --all               All sites except the master (manchester-dev)
 *   --limit <n>         Cap processed sites (useful for phased rollout)
 *   --dry-run           No file writes, no git
 *   --commit            Create a commit in each repo
 *   --push              Push to remote (implies --commit)
 *   --skip-master       Skip manchester-dev (default true; use --include-master to override)
 *   --include-master    Run on manchester-dev too (idempotency check)
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { execSync } from "child_process";
import {
  MICROSITES,
  getMicrositeBySlug,
  type MicrositeConfig,
} from "../microsites.config";

// ─── Config ─────────────────────────────────────────────────────────────────

const PROJECTS_DIR = path.resolve(__dirname, "../../");
const MASTER_SLUG = "manchester-dev";
const LOG_PATH = path.join(
  process.cwd(),
  "data",
  "generated",
  "microsite-content",
  "redesign-log.json",
);
const CC_BASE = "https://constructioncapital.co.uk";

// Keyword winner override — populated from SERP analysis master-brief.json when present.
// For each site slug, the H1/meta will use this keyword phrasing.
const KEYWORD_OVERRIDE_PATH = path.join(
  process.cwd(),
  "data",
  "generated",
  "serp-analysis",
  "keyword-winners.json",
);

// ─── File manifest ──────────────────────────────────────────────────────────
// Files synced VERBATIM from Manchester master to every sibling. These must
// not contain site-specific values (brand name, location, coordinates, etc.)
// Anything site-specific belongs in PARAMETERISED_FILES.
const TEMPLATE_FILES: string[] = [
  // Design system
  "src/app/globals.css",
  // App shell — reads siteConfig to template brand/keyword/phone/meta
  "src/app/layout.tsx",
  "src/app/page.tsx",
  // Schema.org generators — siteConfig-driven, site-agnostic
  "src/lib/schema.ts",
  // Lead capture API route — identical across all sites, reads GHL + Resend
  // credentials from each site's .env.local. Notifications are centralised
  // via GHL's own notification settings (one master inbox).
  "src/app/api/leads/route.ts",
  // Layout primitives
  "src/components/Header.tsx",
  "src/components/Footer.tsx",
  "src/components/layout/NetworkFooter.tsx",
  // Reusable UI
  "src/components/HeroSection.tsx",
  "src/components/StatsBar.tsx",
  "src/components/StickyContactCTA.tsx",
  "src/components/LeadCaptureForm.tsx",
  "src/components/LoanCalculator.tsx",
  "src/components/FAQAccordion.tsx",
  "src/components/BlogCard.tsx",
  "src/components/AreaCard.tsx",
  "src/components/TestimonialCard.tsx",
  "src/components/AnimatedCounter.tsx",
  "src/components/ScrollReveal.tsx",
  "src/components/Breadcrumbs.tsx",
  "src/components/SchemaInjector.tsx",
  "src/components/CookieConsent.tsx",
  // New components introduced by the redesign
  "src/components/LenderPanel.tsx",
  "src/components/ProductMatrix.tsx",
  "src/components/MarketSnapshot.tsx",
  "src/components/TrustBand.tsx",
  // pSEO scaffolding (shared)
  "src/components/pseo/MarketDataGrid.tsx",
  "src/components/pseo/BlogContent.tsx",
  "src/components/pseo/DirectAnswer.tsx",
  "src/components/pseo/ConditionalBlocks.tsx",
  // Types (shared)
  "src/data/types.ts",
];

// Files that need per-site generation (overwrite with templatised output).
// Not a literal sync — each site gets its own version produced by a generator.
// Notes:
//  - src/data/market-data.ts contains per-area pSEO data and is NOT overwritten here.
//  - src/app/page.tsx, layout.tsx are synced verbatim from master; they read all
//    site-specific values from siteConfig + homeMarketSnapshot.
const PARAMETERISED_FILES = {
  siteConfig: "src/data/site-config.ts",
  networkSites: "src/data/network-sites.ts",
  homeMarketSnapshot: "src/data/home-market-snapshot.ts",
} as const;

// ─── CLI ────────────────────────────────────────────────────────────────────

interface Args {
  site?: string;
  type?: MicrositeConfig["type"];
  all: boolean;
  limit?: number;
  dryRun: boolean;
  commit: boolean;
  push: boolean;
  includeMaster: boolean;
}

function parseArgs(): Args {
  const a = process.argv.slice(2);
  const get = (k: string) => {
    const i = a.indexOf(k);
    return i >= 0 ? a[i + 1] : undefined;
  };
  const has = (k: string) => a.includes(k);
  return {
    site: get("--site"),
    type: get("--type") as Args["type"],
    all: has("--all"),
    limit: get("--limit") ? parseInt(get("--limit")!, 10) : undefined,
    dryRun: has("--dry-run"),
    commit: has("--commit"),
    push: has("--push"),
    includeMaster: has("--include-master"),
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function findRepoDir(cfg: MicrositeConfig): string | null {
  const candidates = [cfg.repoName, cfg.repoName.toLowerCase()];
  for (const name of candidates) {
    const dir = path.join(PROJECTS_DIR, name);
    if (fs.existsSync(dir) && fs.existsSync(path.join(dir, "package.json"))) {
      return dir;
    }
  }
  return null;
}

function sh(cmd: string, cwd: string): string {
  return execSync(cmd, { cwd, stdio: ["pipe", "pipe", "pipe"] })
    .toString()
    .trim();
}

function ensureClean(repoDir: string): { clean: boolean; status: string } {
  const status = sh("git status --porcelain", repoDir);
  return { clean: status.length === 0, status };
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

/**
 * Read an existing site's phone number from its current site-config.ts, so
 * propagation preserves a site-specific phone if one has been set. Falls back
 * to the default if the file or field is missing.
 */
function readExistingPhone(repoDir: string): string | null {
  const p = path.join(repoDir, "src/data/site-config.ts");
  if (!fs.existsSync(p)) return null;
  try {
    const txt = fs.readFileSync(p, "utf-8");
    const match = txt.match(/"?phone"?\s*:\s*"([^"]+)"/);
    if (match && match[1] && !/^0\d{2} 1234 5678$/.test(match[1])) return match[1];
  } catch {
    // ignore
  }
  return null;
}

// Deterministic HSL accent per slug — spread across hue wheel, fixed S/L.
function accentForSlug(slug: string): { hex: string; hsl: string; hue: number } {
  const hash = crypto.createHash("sha256").update(slug).digest();
  const hue = hash[0] * 360 / 256; // 0-360
  const h = Math.round(hue);
  const hsl = `hsl(${h}, 72%, 52%)`;
  // Convert HSL → HEX
  const s = 0.72;
  const l = 0.52;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hp < 1) { r = c; g = x; b = 0; }
  else if (hp < 2) { r = x; g = c; b = 0; }
  else if (hp < 3) { r = 0; g = c; b = x; }
  else if (hp < 4) { r = 0; g = x; b = c; }
  else if (hp < 5) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  const m = l - c / 2;
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return { hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`, hsl, hue: h };
}

// ─── Keyword winner resolution ──────────────────────────────────────────────

interface KeywordWinner {
  siteSlug: string;
  winnerKeyword: string;
  loserKeyword?: string;
  volume?: number | null;
}

function loadKeywordWinners(): Map<string, KeywordWinner> {
  const m = new Map<string, KeywordWinner>();
  if (!fs.existsSync(KEYWORD_OVERRIDE_PATH)) return m;
  try {
    const arr = JSON.parse(fs.readFileSync(KEYWORD_OVERRIDE_PATH, "utf-8")) as KeywordWinner[];
    for (const w of arr) m.set(w.siteSlug, w);
  } catch {
    // ignore
  }
  return m;
}

function defaultKeyword(cfg: MicrositeConfig): string {
  const loc = cfg.locationName.toLowerCase();
  if (cfg.type === "development-finance") return `development finance ${loc}`;
  if (cfg.type === "bridging") return `bridging finance ${loc}`;
  return cfg.brandName.toLowerCase();
}

// ─── Per-site local market stats ────────────────────────────────────────────

interface LocalMarketStats {
  medianPrice: number | null;
  transactions12m: number | null;
  planningApprovals12m: number | null;
  pipelineUnits: number | null;
  pipelineGdv: number | null;
  source: "town-stats" | "planning" | "fallback";
}

function loadLocalMarketStats(cfg: MicrositeConfig): LocalMarketStats {
  const townStatsPath = path.join(
    process.cwd(),
    "data",
    "generated",
    "town-stats",
    cfg.county,
    `${cfg.town}.json`,
  );
  if (fs.existsSync(townStatsPath)) {
    try {
      const s = JSON.parse(fs.readFileSync(townStatsPath, "utf-8"));
      return {
        medianPrice: s.medianPrice ?? s.median_price ?? null,
        transactions12m: s.transactions12m ?? s.transactions_12m ?? null,
        planningApprovals12m: s.planningApprovals12m ?? s.planning_approvals_12m ?? null,
        pipelineUnits: s.pipelineUnits ?? s.pipeline_units ?? null,
        pipelineGdv: s.pipelineGdv ?? s.pipeline_gdv ?? null,
        source: "town-stats",
      };
    } catch {
      // fall through
    }
  }
  // fallback: planning data only
  const planPath = path.join(
    process.cwd(),
    "data",
    "generated",
    "planning",
    cfg.county,
    cfg.town,
    "latest.json",
  );
  if (fs.existsSync(planPath)) {
    try {
      const p = JSON.parse(fs.readFileSync(planPath, "utf-8"));
      return {
        medianPrice: null,
        transactions12m: null,
        planningApprovals12m: p.approvals12m ?? null,
        pipelineUnits: p.totalUnits ?? p.pipelineUnits ?? null,
        pipelineGdv: p.totalGdv ?? p.pipelineGdv ?? null,
        source: "planning",
      };
    } catch {
      // fall through
    }
  }
  return {
    medianPrice: null,
    transactions12m: null,
    planningApprovals12m: null,
    pipelineUnits: null,
    pipelineGdv: null,
    source: "fallback",
  };
}

// ─── File generators ────────────────────────────────────────────────────────

function defaultKeywordFor(cfg: MicrositeConfig): string {
  const loc = cfg.locationName.toLowerCase();
  if (cfg.type === "development-finance") return `development finance ${loc}`;
  if (cfg.type === "bridging") return `bridging finance ${loc}`;
  return cfg.brandName.toLowerCase();
}

function generateSiteConfig(
  cfg: MicrositeConfig,
  accent: ReturnType<typeof accentForSlug>,
  keyword: string,
  phone: string,
): string {
  const isBridging = cfg.type === "bridging";
  const serviceNoun = isBridging ? "bridging finance" : "development finance";
  const heroSubtitle = isBridging
    ? "Regulated and unregulated bridging, auction, and commercial finance \u2014 placed with 100+ specialist lenders and priced against your specific exit. Indicative terms in 24\u201348 hours."
    : "Senior debt, stretch senior, mezzanine, JV equity, and exit finance \u2014 sourced from 100+ specialist lenders, structured around your scheme. Indicative terms in 48 hours.";
  const obj = {
    name: cfg.brandName,
    domain: cfg.domain,
    locationName: cfg.locationName,
    county: cfg.county,
    town: cfg.town,
    tagline: `Specialist ${serviceNoun[0].toUpperCase() + serviceNoun.slice(1)} in ${cfg.locationName}`,
    description: `Expert ${serviceNoun} broker serving ${cfg.locationName} and surrounding areas. Competitive rates, 100+ lender panel, indicative terms in 48 hours. Part of the Construction Capital network.`,
    keyword,
    heroSubtitle,
    phone,
    email: `enquiries@${cfg.domain}`,
    address: {
      street: cfg.locationName,
      city: cfg.locationName,
      postcode: "",
      country: "United Kingdom",
    },
    coordinates: { lat: 0, lon: 0 },
    siteType: cfg.type,
    ccLocationUrl: cfg.ccLocationUrl,
    accent: { hex: accent.hex, hsl: accent.hsl, hue: accent.hue },
    stats: [
      { value: "\u00A3300M+", label: "Arranged" },
      { value: "100+", label: "Lenders" },
      { value: "48hr", label: "Decisions" },
      { value: "90%", label: isBridging ? "Max LTV" : "Max LTC" },
    ],
    ghlSiteTag: cfg.brandName.replace(/\s+/g, ""),
    ghlSource: `${cfg.brandName} Website`,
    ghlWidgetId: "",
  };
  return `// Auto-generated per site by scripts/redesign-microsites.ts — do not edit by hand.\nexport const siteConfig = ${JSON.stringify(obj, null, 2)} as const;\n`;
}

function generateHomeMarketSnapshot(cfg: MicrositeConfig, stats: LocalMarketStats): string {
  const s: Array<{ value: string; label: string; footnote?: string }> = [];
  const fmtMoney = (n: number | null): string | null =>
    n == null ? null : n >= 1e9 ? `£${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `£${(n / 1e6).toFixed(0)}M` : n >= 1e3 ? `£${Math.round(n / 1e3)}k` : `£${n}`;

  if (stats.pipelineUnits != null) {
    s.push({
      value: stats.pipelineUnits.toLocaleString(),
      label: "Units in planning",
      footnote: "Current pipeline, local authority",
    });
  }
  if (stats.pipelineGdv != null) {
    const v = fmtMoney(stats.pipelineGdv);
    if (v) s.push({ value: v, label: "Combined GDV", footnote: "Across live pipeline" });
  }
  if (stats.transactions12m != null) {
    s.push({
      value: stats.transactions12m.toLocaleString(),
      label: "Transactions",
      footnote: "HM Land Registry · last 12 months",
    });
  }
  if (stats.medianPrice != null) {
    const v = fmtMoney(stats.medianPrice);
    if (v) s.push({ value: v, label: "Median price", footnote: "HM Land Registry" });
  }
  if (stats.planningApprovals12m != null && s.length < 4) {
    s.push({
      value: stats.planningApprovals12m.toLocaleString(),
      label: "Planning approvals",
      footnote: "Last 12 months",
    });
  }

  // Always emit 4 stats — pad with sensible fallbacks
  const fallbacks: Array<{ value: string; label: string; footnote: string }> = [
    { value: "100+", label: "Lenders", footnote: "Active on panel" },
    { value: "48hr", label: "Indicative terms", footnote: "From complete enquiry" },
    { value: "£300M+", label: "Arranged", footnote: "Across the network" },
    { value: "90%", label: "Max LTC", footnote: "Stretch senior" },
  ];
  while (s.length < 4 && fallbacks.length > 0) s.push(fallbacks.shift()!);

  const sourceParts: string[] = [];
  if (stats.source === "town-stats") sourceParts.push("HM Land Registry");
  if (stats.source !== "fallback") sourceParts.push(`${cfg.locationName} LPA`);
  sourceParts.push("last 12 months");
  const source = sourceParts.join(" · ");

  const obj = {
    locationName: cfg.locationName,
    source,
    stats: s.slice(0, 4),
  };
  return `// Auto-generated per site by scripts/redesign-microsites.ts — do not edit by hand.\nexport interface HomeMarketStat {\n  value: string;\n  label: string;\n  footnote?: string;\n}\n\nexport interface HomeMarketSnapshot {\n  locationName: string;\n  source: string;\n  stats: HomeMarketStat[];\n}\n\nexport const homeMarketSnapshot: HomeMarketSnapshot = ${JSON.stringify(obj, null, 2)};\n`;
}

function generateNetworkSites(cfg: MicrositeConfig): string {
  const neighbours = MICROSITES
    .filter((m) => m.slug !== cfg.slug && m.type === cfg.type && m.status !== "pending")
    .slice(0, 8)
    .map((m) => ({
      name: m.brandName,
      url: `https://${m.domain}`,
      anchorText: m.brandName,
      relationship: "neighbour",
    }));

  const items = [
    {
      name: "Construction Capital",
      url: cfg.ccLocationUrl,
      anchorText: `Best Development Finance Broker in ${cfg.locationName}`,
      relationship: "parent",
    },
    {
      name: "Construction Capital",
      url: CC_BASE,
      anchorText: "Construction Capital — UK Development Finance",
      relationship: "parent",
    },
    {
      name: "Get Finance",
      url: `${CC_BASE}/deal-room?location=${cfg.town}&source=${cfg.domain}`,
      anchorText: "Get Development Finance Terms",
      relationship: "cta",
    },
    ...neighbours,
  ];
  return `// Auto-generated by scripts/redesign-microsites.ts — do not edit by hand\nexport const networkSites = ${JSON.stringify(items, null, 2)};\n`;
}

// (Legacy marketData generator removed — src/data/market-data.ts is a
// per-area pSEO data file whose schema predates this redesign and which is
// not overwritten by the redesign pipeline.)

// ─── Template file sync ─────────────────────────────────────────────────────

function syncTemplateFiles(
  masterDir: string,
  targetDir: string,
  dryRun: boolean,
): { copied: string[]; missing: string[] } {
  const copied: string[] = [];
  const missing: string[] = [];
  for (const rel of TEMPLATE_FILES) {
    const src = path.join(masterDir, rel);
    if (!fs.existsSync(src)) {
      missing.push(rel);
      continue;
    }
    const dst = path.join(targetDir, rel);
    if (!dryRun) {
      ensureDir(path.dirname(dst));
      fs.copyFileSync(src, dst);
    }
    copied.push(rel);
  }
  return { copied, missing };
}

// ─── Log ────────────────────────────────────────────────────────────────────

interface RedesignLogEntry {
  siteSlug: string;
  repoDir: string;
  timestamp: string;
  filesCopied: number;
  filesParameterised: number;
  accentHex: string;
  committed: boolean;
  pushed: boolean;
  commitSha: string | null;
  notes: string[];
}

function loadLog(): RedesignLogEntry[] {
  if (!fs.existsSync(LOG_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function saveLog(entries: RedesignLogEntry[]) {
  ensureDir(path.dirname(LOG_PATH));
  fs.writeFileSync(LOG_PATH, JSON.stringify(entries, null, 2), "utf-8");
}

// ─── Per-site runner ────────────────────────────────────────────────────────

async function redesignSite(
  cfg: MicrositeConfig,
  masterDir: string,
  args: Args,
  keywordWinners: Map<string, KeywordWinner>,
): Promise<RedesignLogEntry> {
  const notes: string[] = [];
  const entry: RedesignLogEntry = {
    siteSlug: cfg.slug,
    repoDir: "",
    timestamp: new Date().toISOString(),
    filesCopied: 0,
    filesParameterised: 0,
    accentHex: "",
    committed: false,
    pushed: false,
    commitSha: null,
    notes,
  };

  console.log(`\n━━━ ${cfg.slug} — ${cfg.brandName} ━━━`);

  const repoDir = findRepoDir(cfg);
  if (!repoDir) {
    notes.push(`Repo not found at ${path.join(PROJECTS_DIR, cfg.repoName)} — skip`);
    console.log(`  ✗ Repo not found: ${cfg.repoName}`);
    return entry;
  }
  entry.repoDir = repoDir;

  // Safety: refuse to redesign a dirty repo unless dry-run.
  const state = ensureClean(repoDir);
  if (!state.clean && !args.dryRun) {
    notes.push(`Uncommitted changes in repo — aborting to preserve work:\n${state.status}`);
    console.log(`  ✗ Uncommitted changes in ${repoDir} — skip (use git stash and retry)`);
    return entry;
  }

  // Resolve keyword + accent + stats
  const winner = keywordWinners.get(cfg.slug);
  const keyword = winner?.winnerKeyword ?? defaultKeyword(cfg);
  const accent = accentForSlug(cfg.slug);
  const stats = loadLocalMarketStats(cfg);
  entry.accentHex = accent.hex;
  notes.push(`Keyword: "${keyword}"`);
  notes.push(`Accent: ${accent.hex} (hue ${accent.hue})`);
  notes.push(`Market stats source: ${stats.source}`);

  // 1. Sync template files
  const { copied, missing } = syncTemplateFiles(masterDir, repoDir, args.dryRun);
  entry.filesCopied = copied.length;
  if (missing.length) notes.push(`Master missing files: ${missing.join(", ")}`);
  console.log(`  ✓ Synced ${copied.length} template files${missing.length ? ` (${missing.length} missing from master)` : ""}`);

  // 2. Generate parameterised files
  const phone = readExistingPhone(repoDir) ?? "020 1234 5678";
  const parameterised: Array<{ rel: string; content: string }> = [];
  parameterised.push({
    rel: PARAMETERISED_FILES.siteConfig,
    content: generateSiteConfig(cfg, accent, keyword, phone),
  });
  parameterised.push({
    rel: PARAMETERISED_FILES.networkSites,
    content: generateNetworkSites(cfg),
  });
  parameterised.push({
    rel: PARAMETERISED_FILES.homeMarketSnapshot,
    content: generateHomeMarketSnapshot(cfg, stats),
  });
  for (const p of parameterised) {
    const dst = path.join(repoDir, p.rel);
    if (!args.dryRun) {
      ensureDir(path.dirname(dst));
      fs.writeFileSync(dst, p.content, "utf-8");
    }
  }
  entry.filesParameterised = parameterised.length;
  console.log(`  ✓ Wrote ${parameterised.length} parameterised files`);

  // NOTE: page.tsx, layout.tsx, schema.ts, constants.ts etc. are NOT yet
  // parameterised by this script — Phase 2 (Manchester redesign) will define
  // the final generator shapes. Stub the call here so we can wire them in
  // once the redesign completes.
  notes.push("TODO: homepage/layout/schema generators pending Phase 2 redesign");

  // 3. Commit
  if (args.commit && !args.dryRun) {
    try {
      sh("git add -A", repoDir);
      const status = sh("git diff --cached --name-only", repoDir);
      if (!status) {
        notes.push("No staged changes — skip commit (idempotent)");
        console.log(`  ~ No changes to commit (already in sync)`);
      } else {
        sh(
          `git commit -m "feat: apply network redesign v2 (SERP-led)" -m "Accent: ${accent.hex}. Keyword: ${keyword}. Source: Manchester master template."`,
          repoDir,
        );
        entry.committed = true;
        entry.commitSha = sh("git rev-parse HEAD", repoDir);
        console.log(`  ✓ Committed ${entry.commitSha.slice(0, 8)}`);
        if (args.push) {
          sh("git push", repoDir);
          entry.pushed = true;
          console.log(`  ✓ Pushed`);
        }
      }
    } catch (err) {
      const msg = (err as Error).message.slice(0, 250);
      notes.push(`Git error: ${msg}`);
      console.log(`  ✗ Git error: ${msg}`);
    }
  } else if (args.dryRun) {
    console.log(`  [dry-run] would commit & ${args.push ? "push" : "hold"}`);
  }

  return entry;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  // Resolve master
  const master = getMicrositeBySlug(MASTER_SLUG);
  if (!master) throw new Error(`Master site "${MASTER_SLUG}" not in microsites.config.ts`);
  const masterDir = findRepoDir(master);
  if (!masterDir) throw new Error(`Master repo not found at ${PROJECTS_DIR}/${master.repoName}`);

  // Resolve target sites
  let targets: MicrositeConfig[] = [];
  if (args.site) {
    const s = getMicrositeBySlug(args.site);
    if (!s) { console.error(`Unknown site: ${args.site}`); process.exit(1); }
    targets = [s];
  } else if (args.type) {
    targets = MICROSITES.filter((m) => m.type === args.type);
  } else if (args.all) {
    targets = [...MICROSITES];
  } else {
    console.error("Usage: --site <slug> | --type <t> | --all [--limit N] [--dry-run] [--commit] [--push]");
    process.exit(1);
  }
  if (!args.includeMaster) targets = targets.filter((s) => s.slug !== MASTER_SLUG);
  if (args.limit) targets = targets.slice(0, args.limit);

  if (targets.length === 0) {
    console.log("No target sites matched the filters.");
    process.exit(0);
  }

  console.log(`Master: ${masterDir}`);
  console.log(`Targets: ${targets.length}${args.dryRun ? " (dry-run)" : ""}`);

  const keywordWinners = loadKeywordWinners();
  if (keywordWinners.size === 0) {
    console.log("⚠ No keyword-winners.json found — using default phrasings.");
  } else {
    console.log(`✓ Loaded ${keywordWinners.size} keyword winners`);
  }

  const log = loadLog();
  const entries: RedesignLogEntry[] = [];
  for (const cfg of targets) {
    try {
      const entry = await redesignSite(cfg, masterDir, args, keywordWinners);
      entries.push(entry);
    } catch (err) {
      console.error(`  ✗ ${cfg.slug} failed:`, (err as Error).message);
      entries.push({
        siteSlug: cfg.slug,
        repoDir: "",
        timestamp: new Date().toISOString(),
        filesCopied: 0,
        filesParameterised: 0,
        accentHex: "",
        committed: false,
        pushed: false,
        commitSha: null,
        notes: [`Fatal: ${(err as Error).message.slice(0, 300)}`],
      });
    }
  }

  if (!args.dryRun) {
    saveLog([...log, ...entries]);
    console.log(`\n✓ Log: ${path.relative(process.cwd(), LOG_PATH)} (+${entries.length} entries)`);
  }

  // Summary
  const committed = entries.filter((e) => e.committed).length;
  const pushed = entries.filter((e) => e.pushed).length;
  const errored = entries.filter((e) => e.notes.some((n) => n.startsWith("Fatal") || n.startsWith("Git error"))).length;
  console.log(`\nSummary: ${entries.length} sites | ${committed} committed | ${pushed} pushed | ${errored} errored`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
