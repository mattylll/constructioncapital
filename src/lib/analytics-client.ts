/**
 * Client-side helper for fetching analytics data from the dashboard.
 */

const BASE = "/api/analytics";

async function query(
  q: string,
  params: Record<string, string> = {}
): Promise<unknown> {
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("_analytics_token") || ""
      : "";

  const sp = new URLSearchParams({ q, ...params });
  const res = await fetch(`${BASE}?${sp.toString()}`, {
    headers: { "x-analytics-token": token },
  });

  if (!res.ok) {
    throw new Error(`Analytics query failed: ${res.status}`);
  }

  return res.json();
}

export interface OverviewData {
  pageviews: number;
  visitors: number;
  sessions: number;
  new_visitors: number;
  avg_duration: number;
}

export interface PageviewsByDay {
  day: string;
  count: number;
}

export interface TopPage {
  path: string;
  views: number;
  visitors: number;
}

export interface Referrer {
  source: string;
  count: number;
}

export interface Country {
  country: string;
  visitors: number;
}

export interface Device {
  device: string;
  visitors: number;
}

export interface ScrollDepth {
  depth: number;
  count: number;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  page_w: number;
  page_h: number;
  element: string;
}

export interface Site {
  id: string;
  name: string;
  domain: string;
  created_at: string;
}

export const analytics = {
  overview: (siteId: string, days = 7) =>
    query("overview", { site_id: siteId, days: String(days) }) as Promise<OverviewData>,

  pageviewsByDay: (siteId: string, days = 7) =>
    query("pageviews_by_day", { site_id: siteId, days: String(days) }) as Promise<PageviewsByDay[]>,

  topPages: (siteId: string, days = 7) =>
    query("top_pages", { site_id: siteId, days: String(days) }) as Promise<TopPage[]>,

  referrers: (siteId: string, days = 7) =>
    query("referrers", { site_id: siteId, days: String(days) }) as Promise<Referrer[]>,

  countries: (siteId: string, days = 7) =>
    query("countries", { site_id: siteId, days: String(days) }) as Promise<Country[]>,

  devices: (siteId: string, days = 7) =>
    query("devices", { site_id: siteId, days: String(days) }) as Promise<Device[]>,

  scrollDepth: (siteId: string, days = 7, path?: string) =>
    query("scroll_depth", {
      site_id: siteId,
      days: String(days),
      ...(path ? { path } : {}),
    }) as Promise<ScrollDepth[]>,

  heatmap: (siteId: string, path: string, days = 7) =>
    query("heatmap", { site_id: siteId, path, days: String(days) }) as Promise<HeatmapPoint[]>,

  live: (siteId: string) =>
    query("live", { site_id: siteId }) as Promise<{ active: number }>,

  sites: () => query("sites") as Promise<Site[]>,
};
