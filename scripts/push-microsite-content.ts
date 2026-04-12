/**
 * Push Generated Content to Microsite Repos
 *
 * Takes listicle articles from data/generated/microsite-content/{slug}/listicles/
 * and appends them to the corresponding microsite's blog-posts.ts file.
 *
 * Usage:
 *   npx tsx scripts/push-microsite-content.ts --site manchester-dev
 *   npx tsx scripts/push-microsite-content.ts --all
 *   npx tsx scripts/push-microsite-content.ts --all --commit
 *   npx tsx scripts/push-microsite-content.ts --dry-run --site manchester-dev
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { MICROSITES, getMicrositeBySlug, type MicrositeConfig } from "../microsites.config";

// ── Config ──────────────────────────────────────────────────────────────────

const PROJECTS_DIR = path.resolve(__dirname, "../../");
const CONTENT_DIR = path.join(process.cwd(), "data", "generated", "microsite-content");
const PUSH_LOG_PATH = path.join(CONTENT_DIR, "push-log.json");

// ── Types ───────────────────────────────────────────────────────────────────

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  image: string;
  localStats: { stat: string; source: string }[];
  relatedServices?: string[];
  relatedAreas?: string[];
}

interface PushLogEntry {
  site: string;
  slug: string;
  pushedAt: string;
  repoPath: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function findRepoDir(config: MicrositeConfig): string | null {
  const candidates = [
    config.repoName,
    config.repoName.toLowerCase(),
  ];
  for (const name of candidates) {
    const dir = path.join(PROJECTS_DIR, name);
    if (fs.existsSync(dir) && fs.existsSync(path.join(dir, "package.json"))) {
      return dir;
    }
  }
  return null;
}

function loadPushLog(): PushLogEntry[] {
  if (!fs.existsSync(PUSH_LOG_PATH)) return [];
  return JSON.parse(fs.readFileSync(PUSH_LOG_PATH, "utf-8"));
}

function savePushLog(log: PushLogEntry[]): void {
  fs.mkdirSync(path.dirname(PUSH_LOG_PATH), { recursive: true });
  fs.writeFileSync(PUSH_LOG_PATH, JSON.stringify(log, null, 2), "utf-8");
}

function loadGeneratedArticles(siteSlug: string): BlogPost[] {
  const listicleDir = path.join(CONTENT_DIR, siteSlug, "listicles");
  if (!fs.existsSync(listicleDir)) return [];

  return fs
    .readdirSync(listicleDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(listicleDir, f), "utf-8")));
}

function loadExistingBlogSlugs(repoDir: string): Set<string> {
  // Try both blog-posts.ts and blog-posts-full.ts
  const candidates = [
    path.join(repoDir, "src/data/blog-posts.ts"),
    path.join(repoDir, "src/data/blog-posts-full.ts"),
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const slugs = new Set<string>();
      const matches = content.matchAll(/"slug":\s*"([^"]+)"/g);
      for (const m of matches) {
        slugs.add(m[1]);
      }
      return slugs;
    }
  }
  return new Set();
}

function appendToBlogPosts(repoDir: string, newPosts: BlogPost[]): string {
  // Find the blog data file
  const candidates = [
    path.join(repoDir, "src/data/blog-posts.ts"),
    path.join(repoDir, "src/data/blog-posts-full.ts"),
  ];

  let targetFile = "";
  for (const f of candidates) {
    if (fs.existsSync(f)) {
      targetFile = f;
      break;
    }
  }

  if (!targetFile) {
    // Create blog-posts.ts if none exists
    targetFile = path.join(repoDir, "src/data/blog-posts.ts");
    fs.writeFileSync(
      targetFile,
      `export const blogPosts = ${JSON.stringify(newPosts, null, 2)};\n`,
      "utf-8"
    );
    return targetFile;
  }

  // Read existing file and append new posts to the array
  let content = fs.readFileSync(targetFile, "utf-8");

  // Find the closing bracket of the array — last occurrence of "];"
  const lastBracket = content.lastIndexOf("];");
  if (lastBracket === -1) {
    // Malformed file — just append
    console.log(`    [WARN] Could not find array end in ${targetFile}, creating new file`);
    const allPosts = [...newPosts];
    fs.writeFileSync(
      targetFile,
      `export const blogPosts = ${JSON.stringify(allPosts, null, 2)};\n`,
      "utf-8"
    );
    return targetFile;
  }

  // Insert new posts before the closing bracket
  const postsJson = newPosts
    .map((p) => `  ${JSON.stringify(p, null, 2).replace(/\n/g, "\n  ")}`)
    .join(",\n");

  const before = content.slice(0, lastBracket).trimEnd();
  const needsComma = before.endsWith("}") || before.endsWith('"') || before.endsWith("]");

  content = `${before}${needsComma ? "," : ""}\n${postsJson}\n];\n`;
  fs.writeFileSync(targetFile, content, "utf-8");
  return targetFile;
}

// ── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const siteFlag = args.indexOf("--site");
const siteSlug = siteFlag !== -1 ? args[siteFlag + 1] : undefined;
const isAll = args.includes("--all");
const shouldCommit = args.includes("--commit");
const isDryRun = args.includes("--dry-run");

if (!siteSlug && !isAll) {
  console.log("Usage:");
  console.log("  npx tsx scripts/push-microsite-content.ts --site <slug> [--commit] [--dry-run]");
  console.log("  npx tsx scripts/push-microsite-content.ts --all [--commit]");
  console.log("\nAvailable sites:");
  MICROSITES.forEach((m) => console.log(`  ${m.slug.padEnd(25)} ${m.brandName}`));
  process.exit(0);
}

const sites = isAll
  ? MICROSITES.filter((m) => m.status !== "pending")
  : [getMicrositeBySlug(siteSlug!)].filter(Boolean) as MicrositeConfig[];

if (sites.length === 0) {
  console.error(`Site not found: ${siteSlug}`);
  process.exit(1);
}

const pushLog = loadPushLog();
const alreadyPushed = new Set(pushLog.map((e) => `${e.site}:${e.slug}`));

let totalPushed = 0;
let totalSkipped = 0;

for (const site of sites) {
  console.log(`\n${site.slug} (${site.brandName})`);

  const repoDir = findRepoDir(site);
  if (!repoDir) {
    console.log(`  [SKIP] Repo not found locally: ${site.repoName}`);
    totalSkipped++;
    continue;
  }

  const articles = loadGeneratedArticles(site.slug);
  if (articles.length === 0) {
    console.log(`  [SKIP] No generated content found`);
    totalSkipped++;
    continue;
  }

  // Filter out already-pushed and already-existing articles
  const existingSlugs = loadExistingBlogSlugs(repoDir);
  const newArticles = articles.filter(
    (a) => !existingSlugs.has(a.slug) && !alreadyPushed.has(`${site.slug}:${a.slug}`)
  );

  if (newArticles.length === 0) {
    console.log(`  [SKIP] All ${articles.length} articles already pushed`);
    continue;
  }

  console.log(`  [PUSH] ${newArticles.length} new article(s) to ${repoDir}`);

  if (isDryRun) {
    for (const a of newArticles) {
      console.log(`    [DRY RUN] Would push: ${a.slug}`);
    }
    continue;
  }

  // Append to blog data file
  const targetFile = appendToBlogPosts(repoDir, newArticles);
  console.log(`  [WROTE] ${targetFile}`);

  // Record in push log
  for (const a of newArticles) {
    pushLog.push({
      site: site.slug,
      slug: a.slug,
      pushedAt: new Date().toISOString(),
      repoPath: repoDir,
    });
  }
  totalPushed += newArticles.length;

  // Commit and push if requested
  if (shouldCommit) {
    try {
      const relPath = path.relative(repoDir, targetFile);
      execSync(`git add "${relPath}"`, { cwd: repoDir, stdio: "pipe" });
      execSync(
        `git commit -m "content: add ${newArticles.length} listicle article(s) with CC backlinks"`,
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
        console.log(`  [ERROR] Git: ${msg.slice(0, 200)}`);
      }
    }
  }
}

// Save push log
savePushLog(pushLog);

console.log(`\n--- Done ---`);
console.log(`Pushed: ${totalPushed} articles`);
console.log(`Skipped: ${totalSkipped} sites`);
