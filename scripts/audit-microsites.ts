/**
 * Microsite Network Audit
 *
 * Checks each microsite in the registry for:
 *   - HTTP status (is it deployed and responding?)
 *   - CC backlink presence (does the footer link to CC?)
 *   - Blog post count
 *   - Local repo existence
 *
 * Usage:
 *   npx tsx scripts/audit-microsites.ts
 *   npx tsx scripts/audit-microsites.ts --site manchester-dev
 *   npx tsx scripts/audit-microsites.ts --json
 */

import fs from "fs";
import path from "path";
import { MICROSITES, getMicrositeBySlug, type MicrositeConfig } from "../microsites.config";

// ── Config ──────────────────────────────────────────────────────────────────

const PROJECTS_DIR = path.resolve(__dirname, "../../");
const OUTPUT_DIR = path.join(process.cwd(), "data", "generated", "microsite-audit");

// ── Types ───────────────────────────────────────────────────────────────────

interface AuditResult {
  slug: string;
  domain: string;
  brandName: string;
  type: string;
  status: string;
  localRepoFound: boolean;
  localRepoPath: string | null;
  httpStatus: number | null;
  httpError: string | null;
  hasCCBacklink: boolean;
  ccBacklinkUrl: string | null;
  blogPostCount: number;
  networkSitesCount: number;
  hasNetworkFooter: boolean;
  lastCommitDate: string | null;
  auditedAt: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function findRepoDir(config: MicrositeConfig): string | null {
  const candidates = [config.repoName, config.repoName.toLowerCase()];
  for (const name of candidates) {
    const dir = path.join(PROJECTS_DIR, name);
    if (fs.existsSync(dir) && fs.existsSync(path.join(dir, "package.json"))) {
      return dir;
    }
  }
  return null;
}

function countBlogPosts(repoDir: string): number {
  const candidates = [
    path.join(repoDir, "src/data/blog-posts.ts"),
    path.join(repoDir, "src/data/blog-posts-full.ts"),
  ];
  for (const f of candidates) {
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, "utf-8");
      return (content.match(/"slug":/g) || []).length;
    }
  }
  return 0;
}

function checkNetworkSites(repoDir: string): { count: number; hasCCLink: boolean; ccUrl: string | null } {
  const filePath = path.join(repoDir, "src/data/network-sites.ts");
  if (!fs.existsSync(filePath)) return { count: 0, hasCCLink: false, ccUrl: null };

  const content = fs.readFileSync(filePath, "utf-8");
  const count = (content.match(/"url":/g) || []).length;

  // Check for CC link
  const ccMatch = content.match(/"url":\s*"(https?:\/\/constructioncapital[^"]+)"/);
  return {
    count,
    hasCCLink: !!ccMatch,
    ccUrl: ccMatch ? ccMatch[1] : null,
  };
}

function checkNetworkFooter(repoDir: string): boolean {
  const footerPath = path.join(repoDir, "src/components/layout/NetworkFooter.tsx");
  return fs.existsSync(footerPath);
}

function getLastCommitDate(repoDir: string): string | null {
  try {
    const { execSync } = require("child_process");
    const date = execSync("git log -1 --format=%ci", { cwd: repoDir, stdio: "pipe" })
      .toString()
      .trim();
    return date;
  } catch {
    return null;
  }
}

async function checkHttp(domain: string): Promise<{ status: number | null; error: string | null }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`https://${domain}`, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return { status: res.status, error: null };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { status: null, error: msg.slice(0, 100) };
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const siteFlag = args.indexOf("--site");
const siteSlug = siteFlag !== -1 ? args[siteFlag + 1] : undefined;
const jsonOutput = args.includes("--json");
const skipHttp = args.includes("--skip-http");

const sites = siteSlug
  ? [getMicrositeBySlug(siteSlug)].filter(Boolean) as MicrositeConfig[]
  : MICROSITES;

if (siteSlug && sites.length === 0) {
  console.error(`Site not found: ${siteSlug}`);
  process.exit(1);
}

async function main() {
  console.log(`\nAuditing ${sites.length} microsite(s)...\n`);

  const results: AuditResult[] = [];

  for (const site of sites) {
    if (!jsonOutput) process.stdout.write(`  ${site.slug.padEnd(25)}`);

    const repoDir = findRepoDir(site);
    const blogCount = repoDir ? countBlogPosts(repoDir) : 0;
    const networkInfo = repoDir ? checkNetworkSites(repoDir) : { count: 0, hasCCLink: false, ccUrl: null };
    const hasFooter = repoDir ? checkNetworkFooter(repoDir) : false;
    const lastCommit = repoDir ? getLastCommitDate(repoDir) : null;

    let httpStatus: number | null = null;
    let httpError: string | null = null;

    if (!skipHttp) {
      const http = await checkHttp(site.domain);
      httpStatus = http.status;
      httpError = http.error;
    }

    const result: AuditResult = {
      slug: site.slug,
      domain: site.domain,
      brandName: site.brandName,
      type: site.type,
      status: site.status,
      localRepoFound: !!repoDir,
      localRepoPath: repoDir,
      httpStatus,
      httpError,
      hasCCBacklink: networkInfo.hasCCLink,
      ccBacklinkUrl: networkInfo.ccUrl,
      blogPostCount: blogCount,
      networkSitesCount: networkInfo.count,
      hasNetworkFooter: hasFooter,
      lastCommitDate: lastCommit,
      auditedAt: new Date().toISOString(),
    };

    results.push(result);

    if (!jsonOutput) {
      const statusIcon = httpStatus === 200 ? "OK" : httpStatus ? `${httpStatus}` : "DOWN";
      const ccIcon = networkInfo.hasCCLink ? "CC-LINK" : "NO-CC";
      console.log(
        `${statusIcon.padEnd(6)} ${ccIcon.padEnd(10)} blog:${blogCount.toString().padEnd(4)} ${repoDir ? "LOCAL" : "NO-REPO"}`
      );
    }
  }

  // Save report
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const reportPath = path.join(OUTPUT_DIR, "report.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), "utf-8");

  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    // Summary
    const live = results.filter((r) => r.httpStatus === 200).length;
    const withCC = results.filter((r) => r.hasCCBacklink).length;
    const withBlog = results.filter((r) => r.blogPostCount > 0).length;
    const withRepo = results.filter((r) => r.localRepoFound).length;
    const totalPosts = results.reduce((sum, r) => sum + r.blogPostCount, 0);

    console.log(`\n--- Summary ---`);
    console.log(`Total sites:      ${results.length}`);
    console.log(`Live (HTTP 200):  ${live}`);
    console.log(`CC backlink:      ${withCC}`);
    console.log(`Has blog posts:   ${withBlog} (${totalPosts} total)`);
    console.log(`Local repo:       ${withRepo}`);
    console.log(`\nReport saved: ${reportPath}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
