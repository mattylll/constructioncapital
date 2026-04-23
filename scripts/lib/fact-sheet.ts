/**
 * Assembles the fact sheet the daily generator hands to Claude.
 *
 * Input streams:
 *   - RSS items (from scripts/lib/rss.ts)
 *   - Scheduled publication hits (from scripts/config/news-sources.ts)
 *   - Internal data deltas (town-stats, planning)
 *
 * Output: a ranked list of candidate stories, each with source citations.
 */

import type { FeedItem } from "./rss";
import type {
  RssSource,
  ScheduledRelease,
} from "../config/news-sources";

export interface CandidateStory {
  /** Stable id for logging — first 8 chars of sha of title+url. */
  id: string;
  /** The suggested angle / headline idea. */
  headline: string;
  /** Short summary for Claude's context. */
  summary: string;
  /** Which NewsCategory this would fit. */
  suggestedCategory:
    | "rate-update"
    | "lender-news"
    | "market-commentary"
    | "deal-announcement"
    | "regulatory";
  /** Ranking score (higher = more prominent). */
  score: number;
  /** Citations that back up the headline. */
  citations: { label: string; url: string }[];
  /** Where this candidate came from. */
  origin: "rss" | "schedule" | "internal";
}

interface FeedItemWithMeta extends FeedItem {
  weight: number;
  bias: RssSource["bias"];
}

/**
 * Main ranker. Combines all streams and sorts by score.
 */
export function buildFactSheet(input: {
  feedItems: FeedItemWithMeta[];
  scheduledHits: ScheduledRelease[];
  today: Date;
  maxCandidates: number;
}): CandidateStory[] {
  const candidates: CandidateStory[] = [];

  for (const item of input.feedItems) {
    const age = hoursBetween(input.today, new Date(item.published));
    if (age > 48) continue; // Skip anything older than 48h

    const recencyScore = Math.max(0, 1 - age / 48);
    const score = recencyScore * item.weight;
    const category = guessCategory(item);

    candidates.push({
      id: hashShort(`${item.feedId}|${item.link}`),
      headline: item.title,
      summary: item.summary,
      suggestedCategory: category,
      score,
      citations: [
        { label: `${item.feedName} — ${new Date(item.published).toLocaleDateString("en-GB")}`, url: item.link },
      ],
      origin: "rss",
    });
  }

  for (const release of input.scheduledHits) {
    const age = daysBetween(input.today, new Date(release.date));
    if (Math.abs(age) > 2) continue; // Only count as "hit" within 2 days

    const recencyScore = 1 - Math.abs(age) / 2;
    const score = 1.5 + recencyScore; // Scheduled releases get a meaningful boost

    candidates.push({
      id: hashShort(release.id),
      headline: `${release.name} — ${release.publisher}`,
      summary: `Scheduled publication from ${release.publisher} on ${release.date}.`,
      suggestedCategory: release.category,
      score,
      citations: [
        { label: `${release.publisher} — ${release.name}`, url: release.url },
      ],
      origin: "schedule",
    });
  }

  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, input.maxCandidates);
}

/**
 * Pair an RSS source with its items for downstream ranking.
 */
export function annotateItems(
  items: FeedItem[],
  sources: RssSource[]
): FeedItemWithMeta[] {
  const bySource = new Map(sources.map((s) => [s.id, s]));
  return items.map((item) => {
    const src = bySource.get(item.feedId);
    return {
      ...item,
      weight: src?.weight ?? 1,
      bias: src?.bias ?? [],
    };
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function hoursBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / 36e5;
}

function daysBetween(a: Date, b: Date): number {
  return (a.getTime() - b.getTime()) / 864e5;
}

function hashShort(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36).slice(0, 8);
}

const CATEGORY_KEYWORDS: Record<CandidateStory["suggestedCategory"], string[]> = {
  "rate-update": [
    "rate",
    "interest",
    "mpc",
    "bank rate",
    "boe",
    "base rate",
    "pricing",
    "margin",
  ],
  "lender-news": [
    "lender",
    "launch",
    "product",
    "facility",
    "challenger",
    "specialist",
    "new product",
    "capital raise",
  ],
  "market-commentary": [
    "market",
    "hpi",
    "transaction",
    "sales",
    "prices",
    "index",
    "ons",
    "supply",
    "demand",
  ],
  "deal-announcement": [
    "loan",
    "funded",
    "completion",
    "deal",
    "gdv",
    "scheme",
    "development",
    "backed",
  ],
  regulatory: [
    "fca",
    "regulator",
    "consultation",
    "policy",
    "minister",
    "planning reform",
    "building safety",
    "pra",
    "hmrc",
    "treasury",
  ],
};

function guessCategory(
  item: FeedItemWithMeta
): CandidateStory["suggestedCategory"] {
  const text = `${item.title} ${item.summary}`.toLowerCase();
  const scores: Record<CandidateStory["suggestedCategory"], number> = {
    "rate-update": 0,
    "lender-news": 0,
    "market-commentary": 0,
    "deal-announcement": 0,
    regulatory: 0,
  };

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const cat = category as CandidateStory["suggestedCategory"];
    for (const kw of keywords) {
      if (text.includes(kw)) scores[cat] += 1;
    }
  }

  for (const bias of item.bias) scores[bias] += 0.5;

  return (Object.entries(scores) as [
    CandidateStory["suggestedCategory"],
    number
  ][]).sort((a, b) => b[1] - a[1])[0][0];
}
