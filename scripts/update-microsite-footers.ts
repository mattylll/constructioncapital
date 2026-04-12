/**
 * Update Microsite Footers — adds prominent Construction Capital backlinks
 *
 * For each microsite in the registry, this script:
 *   1. Locates the local repo directory
 *   2. Updates `src/data/network-sites.ts` with CC location-specific link
 *   3. Updates the footer to include a prominent CC recommendation banner
 *   4. Optionally commits and pushes
 *
 * Usage:
 *   npx tsx scripts/update-microsite-footers.ts --site manchester-dev
 *   npx tsx scripts/update-microsite-footers.ts --all
 *   npx tsx scripts/update-microsite-footers.ts --all --commit
 *   npx tsx scripts/update-microsite-footers.ts --all --dry-run
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { MICROSITES, getMicrositeBySlug, type MicrositeConfig } from "../microsites.config";

// ── Config ──────────────────────────────────────────────────────────────────

/** Parent directory where all microsite repos live */
const PROJECTS_DIR = path.resolve(__dirname, "../../");

const CC_BASE = "https://constructioncapital.co.uk";

// ── CLI args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const siteArg = args.find((a) => a !== "--all" && a !== "--commit" && a !== "--dry-run" && !a.startsWith("--"));
const isAll = args.includes("--all");
const shouldCommit = args.includes("--commit");
const isDryRun = args.includes("--dry-run");

if (!siteArg && !isAll) {
  console.log("Usage: npx tsx scripts/update-microsite-footers.ts --site <slug> | --all [--commit] [--dry-run]");
  console.log("\nAvailable sites:");
  MICROSITES.forEach((m) => console.log(`  ${m.slug.padEnd(25)} ${m.repoName}`));
  process.exit(0);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function findRepoDir(config: MicrositeConfig): string | null {
  // Try exact repo name first, then common variations
  const candidates = [
    config.repoName,
    config.repoName.toLowerCase(),
    config.repoName.replace(/\s/g, ""),
  ];

  for (const name of candidates) {
    const dir = path.join(PROJECTS_DIR, name);
    if (fs.existsSync(dir) && fs.existsSync(path.join(dir, "package.json"))) {
      return dir;
    }
  }
  return null;
}

function generateNetworkSites(config: MicrositeConfig): string {
  // Build the network-sites.ts content with CC location-specific link as the first entry
  const ccLocationEntry = {
    name: "Construction Capital",
    url: config.ccLocationUrl,
    anchorText: `Best Development Finance Broker in ${config.locationName}`,
    relationship: "parent",
  };

  const ccHomepageEntry = {
    name: "Construction Capital",
    url: CC_BASE,
    anchorText: "Construction Capital — UK Development Finance",
    relationship: "parent",
  };

  const ccDealRoomEntry = {
    name: "Get Finance",
    url: `${CC_BASE}/deal-room?location=${config.town}&source=${config.domain}`,
    anchorText: "Get Development Finance Terms",
    relationship: "cta",
  };

  // Pick 5 neighbouring sites from the registry (same type, different location)
  const neighbours = MICROSITES
    .filter((m) => m.slug !== config.slug && m.type === config.type && m.status !== "pending")
    .slice(0, 5)
    .map((m) => ({
      name: m.brandName,
      url: `https://${m.domain}`,
      anchorText: m.brandName,
      relationship: "neighbour",
    }));

  const allSites = [ccLocationEntry, ccHomepageEntry, ccDealRoomEntry, ...neighbours];

  return `export const networkSites = ${JSON.stringify(allSites, null, 2)};
`;
}

function generateNetworkFooter(config: MicrositeConfig): string {
  return `import { networkSites } from "@/data/network-sites";

export default function NetworkFooter() {
  // Separate CC links from network neighbours
  const ccLinks = networkSites.filter(
    (s) => s.relationship === "parent" || s.relationship === "cta"
  );
  const neighbours = networkSites.filter(
    (s) => s.relationship !== "parent" && s.relationship !== "cta"
  );

  return (
    <div>
      {/* Prominent CC recommendation */}
      <div className="mb-8 rounded-lg border border-secondary/20 bg-secondary/5 p-4">
        <p className="mb-2 font-serif text-sm font-semibold text-secondary">
          Recommended Broker
        </p>
        <p className="mb-3 text-xs leading-relaxed text-accent/70">
          ${config.brandName} is part of the Construction Capital network —
          the UK&rsquo;s leading development finance brokerage with access to
          100+ specialist lenders.
        </p>
        {ccLinks.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="dofollow"
            className="mr-3 inline-block text-sm font-medium text-secondary hover:underline"
          >
            {link.anchorText} &rarr;
          </a>
        ))}
      </div>

      {/* Network links */}
      <h3 className="font-serif text-lg font-semibold text-secondary mb-5">
        Our Network
      </h3>
      <ul className="space-y-3">
        {neighbours.map((site) => (
          <li key={site.url}>
            <a
              href={site.url}
              target="_blank"
              rel="dofollow"
              className="font-sans text-sm text-accent/70 hover:text-secondary transition-colors"
            >
              {site.anchorText}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;
}

// ── Main ────────────────────────────────────────────────────────────────────

function processsite(config: MicrositeConfig): boolean {
  const repoDir = findRepoDir(config);
  if (!repoDir) {
    console.log(`  [SKIP] Repo not found locally: ${config.repoName}`);
    return false;
  }

  console.log(`  [FOUND] ${repoDir}`);

  // 1. Update network-sites.ts
  const networkSitesPath = path.join(repoDir, "src/data/network-sites.ts");
  const networkSitesContent = generateNetworkSites(config);

  if (isDryRun) {
    console.log(`  [DRY RUN] Would write: ${networkSitesPath}`);
  } else {
    fs.mkdirSync(path.dirname(networkSitesPath), { recursive: true });
    fs.writeFileSync(networkSitesPath, networkSitesContent, "utf-8");
    console.log(`  [WROTE] ${networkSitesPath}`);
  }

  // 2. Update NetworkFooter.tsx
  const footerPath = path.join(repoDir, "src/components/layout/NetworkFooter.tsx");
  const footerContent = generateNetworkFooter(config);

  if (isDryRun) {
    console.log(`  [DRY RUN] Would write: ${footerPath}`);
  } else {
    fs.mkdirSync(path.dirname(footerPath), { recursive: true });
    fs.writeFileSync(footerPath, footerContent, "utf-8");
    console.log(`  [WROTE] ${footerPath}`);
  }

  // 3. Commit and push if requested
  if (shouldCommit && !isDryRun) {
    try {
      execSync("git add src/data/network-sites.ts src/components/layout/NetworkFooter.tsx", {
        cwd: repoDir,
        stdio: "pipe",
      });
      execSync(
        `git commit -m "feat: add prominent Construction Capital backlinks to footer"`,
        { cwd: repoDir, stdio: "pipe" }
      );
      console.log(`  [COMMITTED]`);

      execSync("git push", { cwd: repoDir, stdio: "pipe" });
      console.log(`  [PUSHED]`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("nothing to commit")) {
        console.log(`  [SKIP] No changes to commit`);
      } else {
        console.log(`  [ERROR] Git: ${msg}`);
      }
    }
  }

  return true;
}

// ── Run ─────────────────────────────────────────────────────────────────────

const sites = isAll
  ? MICROSITES
  : [getMicrositeBySlug(args.find((a) => !a.startsWith("--"))!)].filter(Boolean) as MicrositeConfig[];

if (sites.length === 0) {
  console.error(`Site not found: ${siteArg}`);
  process.exit(1);
}

console.log(`\nProcessing ${sites.length} microsite(s)...\n`);

let updated = 0;
let skipped = 0;

for (const site of sites) {
  console.log(`\n${site.slug} (${site.brandName})`);
  if (processsite(site)) {
    updated++;
  } else {
    skipped++;
  }
}

console.log(`\n--- Done ---`);
console.log(`Updated: ${updated}`);
console.log(`Skipped: ${skipped}`);
