/**
 * Social Media Publisher
 *
 * Publishes generated social content to LinkedIn, X/Twitter, and Facebook.
 * Each platform has its own API integration.
 *
 * Env:
 *   LINKEDIN_ACCESS_TOKEN     — LinkedIn OAuth2 access token
 *   LINKEDIN_PERSON_URN       — LinkedIn person URN (e.g., urn:li:person:xxx)
 *   TWITTER_API_KEY           — X/Twitter API key
 *   TWITTER_API_SECRET        — X/Twitter API secret
 *   TWITTER_ACCESS_TOKEN      — X/Twitter access token
 *   TWITTER_ACCESS_SECRET     — X/Twitter access token secret
 *   FACEBOOK_PAGE_TOKEN       — Facebook page access token
 *   FACEBOOK_PAGE_ID          — Facebook page ID
 *
 * Usage:
 *   npx tsx scripts/publish-social.ts --platform linkedin --county hertfordshire
 *   npx tsx scripts/publish-social.ts --platform twitter --all
 *   npx tsx scripts/publish-social.ts --all --all-platforms
 *   npx tsx scripts/publish-social.ts --platform linkedin --county hertfordshire --dry-run
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

// ── Types ───────────────────────────────────────────────────────────────────

interface SocialPost {
  platform: "linkedin" | "twitter" | "facebook";
  content: string;
  hashtags: string[];
  sourceType: string;
  county: string;
  generatedAt: string;
}

interface PublishLogEntry {
  platform: string;
  county: string;
  sourceType: string;
  postId: string;
  publishedAt: string;
  contentHash: string;
}

// ── Config ──────────────────────────────────────────────────────────────────

const SOCIAL_DIR = path.join(process.cwd(), "data", "generated", "social-content");
const LOG_PATH = path.join(SOCIAL_DIR, "published-log.json");
const RATE_LIMIT_MS = 2000;

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const platformFlag = args.indexOf("--platform");
const platformFilter = platformFlag !== -1 ? args[platformFlag + 1] : undefined;
const countyFlag = args.indexOf("--county");
const countyFilter = countyFlag !== -1 ? args[countyFlag + 1] : undefined;
const isAllCounties = args.includes("--all");
const isAllPlatforms = args.includes("--all-platforms");
const isDryRun = args.includes("--dry-run");

// ── Helpers ─────────────────────────────────────────────────────────────────

function loadPublishLog(): PublishLogEntry[] {
  if (!fs.existsSync(LOG_PATH)) return [];
  return JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));
}

function savePublishLog(log: PublishLogEntry[]): void {
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), "utf-8");
}

function contentHash(content: string): string {
  return crypto.createHash("md5").update(content).digest("hex").slice(0, 12);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function getLatestDate(): string | null {
  if (!fs.existsSync(SOCIAL_DIR)) return null;
  const dates = fs.readdirSync(SOCIAL_DIR)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();
  return dates[0] || null;
}

// ── Platform Publishers ─────────────────────────────────────────────────────

async function publishToLinkedIn(content: string): Promise<string> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  if (!accessToken || !personUrn) {
    throw new Error("Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_PERSON_URN");
  }

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn API ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.id || "published";
}

async function publishToTwitter(content: string): Promise<string> {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    throw new Error("Missing Twitter API credentials (TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET)");
  }

  // OAuth 1.0a signing
  const url = "https://api.twitter.com/2/tweets";
  const method = "POST";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");

  const params: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const paramString = Object.keys(params)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join("&");

  const signatureBase = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`;
  const signature = crypto.createHmac("sha1", signingKey).update(signatureBase).digest("base64");

  const authHeader = `OAuth ${Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
    .join(", ")}, oauth_signature="${encodeURIComponent(signature)}"`;

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: content }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twitter API ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.data?.id || "published";
}

async function publishToFacebook(content: string): Promise<string> {
  const pageToken = process.env.FACEBOOK_PAGE_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!pageToken || !pageId) {
    throw new Error("Missing FACEBOOK_PAGE_TOKEN or FACEBOOK_PAGE_ID");
  }

  const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: content,
      access_token: pageToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Facebook API ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.id || "published";
}

const publishers: Record<string, (content: string) => Promise<string>> = {
  linkedin: publishToLinkedIn,
  twitter: publishToTwitter,
  facebook: publishToFacebook,
};

// ── Main ────────────────────────────────────────────────────────────────────

if (!platformFilter && !isAllPlatforms) {
  console.log("Usage:");
  console.log("  npx tsx scripts/publish-social.ts --platform linkedin --county hertfordshire");
  console.log("  npx tsx scripts/publish-social.ts --platform twitter --all");
  console.log("  npx tsx scripts/publish-social.ts --all --all-platforms");
  console.log("  npx tsx scripts/publish-social.ts --platform linkedin --all --dry-run");
  console.log("\nAvailable content:");

  const latestDate = getLatestDate();
  if (latestDate) {
    const dateDir = path.join(SOCIAL_DIR, latestDate);
    console.log(`\nLatest: ${latestDate}`);
    for (const county of fs.readdirSync(dateDir).sort()) {
      const countyDir = path.join(dateDir, county);
      if (!fs.statSync(countyDir).isDirectory()) continue;
      const files = fs.readdirSync(countyDir).filter((f) => f.endsWith(".json") && f !== "all.json");
      console.log(`  ${county}: ${files.map((f) => f.replace(".json", "")).join(", ")}`);
    }
  }
  process.exit(0);
}

async function main() {
  const platforms = isAllPlatforms
    ? ["linkedin", "twitter", "facebook"]
    : [platformFilter!];

  const latestDate = getLatestDate();
  if (!latestDate) {
    console.error("No social content found. Run generate-social-content.ts first.");
    process.exit(1);
  }

  const dateDir = path.join(SOCIAL_DIR, latestDate);
  console.log(`Publishing from: ${latestDate}`);

  // Get counties
  let counties: string[];
  if (countyFilter) {
    counties = [countyFilter];
  } else if (isAllCounties) {
    counties = fs.readdirSync(dateDir)
      .filter((c) => fs.statSync(path.join(dateDir, c)).isDirectory())
      .sort();
  } else {
    console.error("Specify --county <slug> or --all");
    process.exit(1);
  }

  const log = loadPublishLog();
  const published = new Set(log.map((e) => `${e.platform}:${e.contentHash}`));

  let totalPublished = 0;
  let totalSkipped = 0;

  for (const county of counties) {
    console.log(`\n${county}`);

    for (const platform of platforms) {
      const filePath = path.join(dateDir, county, `${platform}.json`);
      if (!fs.existsSync(filePath)) {
        console.log(`  [SKIP] No ${platform} content`);
        continue;
      }

      const posts: SocialPost[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      for (const post of posts) {
        const hash = contentHash(post.content);
        const key = `${platform}:${hash}`;

        if (published.has(key)) {
          totalSkipped++;
          continue;
        }

        if (isDryRun) {
          console.log(`  [DRY RUN] ${platform} — ${post.sourceType} — ${post.content.slice(0, 60)}...`);
          totalPublished++;
          continue;
        }

        try {
          process.stdout.write(`  [${platform.toUpperCase()}] ${post.sourceType}... `);

          const publisher = publishers[platform];
          if (!publisher) throw new Error(`No publisher for ${platform}`);

          const postId = await publisher(post.content);

          log.push({
            platform,
            county,
            sourceType: post.sourceType,
            postId,
            publishedAt: new Date().toISOString(),
            contentHash: hash,
          });

          console.log(`OK (${postId})`);
          totalPublished++;
          await sleep(RATE_LIMIT_MS);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          console.log(`ERROR: ${msg.slice(0, 100)}`);
        }
      }
    }
  }

  savePublishLog(log);

  console.log(`\n--- Done ---`);
  console.log(`Published: ${totalPublished}`);
  console.log(`Skipped (already published): ${totalSkipped}`);
  console.log(`Log: ${LOG_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
