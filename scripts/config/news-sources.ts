/**
 * Curated sources for the daily news pipeline.
 *
 * The generator pulls:
 *   1. RSS feeds from UK property-finance press
 *   2. Scheduled economic / regulatory publications
 *   3. Internal data deltas (already handled in scripts/lib/fact-sheet.ts)
 *
 * Feed URLs are intentionally a short, curated list — quality over breadth.
 * If a feed starts producing noise, swap it out here; no code changes needed.
 */

export interface RssSource {
  /** Short slug for logs and citations. */
  id: string;
  /** Human-readable name for attribution. */
  name: string;
  /** Feed URL. */
  url: string;
  /** Weight used when ranking candidate stories (1 = baseline, >1 = boost). */
  weight: number;
  /** Categories this feed tends to produce signal for. */
  bias: Array<
    | "rate-update"
    | "lender-news"
    | "market-commentary"
    | "deal-announcement"
    | "regulatory"
  >;
}

/**
 * Starting feed list — Matt to confirm / swap. All are public RSS.
 * If any feed URL 404s at runtime we skip it silently; swap the URL and run again.
 */
export const RSS_SOURCES: RssSource[] = [
  {
    id: "bridging-commercial",
    name: "Bridging & Commercial",
    url: "https://www.bridgingandcommercial.co.uk/news.rss",
    weight: 1.3,
    bias: ["lender-news", "rate-update"],
  },
  {
    id: "property-industry-eye",
    name: "Property Industry Eye",
    url: "https://propertyindustryeye.com/feed/",
    weight: 1.0,
    bias: ["market-commentary", "regulatory"],
  },
  {
    id: "property-week",
    name: "Property Week",
    url: "https://www.propertyweek.com/rss/news/3.rss",
    weight: 1.2,
    bias: ["deal-announcement", "market-commentary"],
  },
  {
    id: "inside-housing",
    name: "Inside Housing",
    url: "https://www.insidehousing.co.uk/rss/news",
    weight: 1.0,
    bias: ["regulatory", "market-commentary"],
  },
  {
    id: "bisnow-uk",
    name: "Bisnow UK",
    url: "https://www.bisnow.com/london/rss",
    weight: 1.0,
    bias: ["deal-announcement", "market-commentary"],
  },
  {
    id: "property-funds-world",
    name: "Property Funds World",
    url: "https://www.propertyfundsworld.com/feed",
    weight: 0.9,
    bias: ["lender-news", "deal-announcement"],
  },
  {
    id: "uk-finance",
    name: "UK Finance",
    url: "https://www.ukfinance.org.uk/press/press-releases.xml",
    weight: 1.1,
    bias: ["regulatory", "rate-update"],
  },
  {
    id: "bank-of-england",
    name: "Bank of England",
    url: "https://www.bankofengland.co.uk/news.xml",
    weight: 1.4,
    bias: ["rate-update", "regulatory"],
  },
];

/**
 * Scheduled publication calendar — the generator checks whether today is on
 * or near a known release date and, if so, boosts that topic.
 *
 * Dates are ISO (YYYY-MM-DD). Add upcoming entries ahead of time.
 */
export interface ScheduledRelease {
  id: string;
  name: string;
  publisher: string;
  date: string; // ISO
  url: string;
  category:
    | "rate-update"
    | "lender-news"
    | "market-commentary"
    | "deal-announcement"
    | "regulatory";
}

export const SCHEDULED_RELEASES: ScheduledRelease[] = [
  // 2026 MPC meetings — confirm dates against BoE calendar as they're set
  {
    id: "boe-mpc-2026-05-08",
    name: "MPC Bank Rate decision",
    publisher: "Bank of England",
    date: "2026-05-08",
    url: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes",
    category: "rate-update",
  },
  {
    id: "ons-hpi-2026-04-23",
    name: "House Price Index — February 2026",
    publisher: "ONS",
    date: "2026-04-23",
    url: "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/housepriceindex/latest",
    category: "market-commentary",
  },
  {
    id: "hmrc-sdlt-monthly",
    name: "SDLT receipts",
    publisher: "HMRC",
    date: "2026-04-22",
    url: "https://www.gov.uk/government/statistics/monthly-property-transactions-completed-in-the-uk-with-value-40000-or-above",
    category: "market-commentary",
  },
];

/**
 * How many candidate stories to surface in the fact sheet before Claude
 * is asked to pick one for the day.
 */
export const CANDIDATES_PER_RUN = 5;
