"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Eye,
  Users,
  Clock,
  MousePointerClick,
  ArrowUpRight,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  TrendingUp,
  Activity,
} from "lucide-react";
import Link from "next/link";
import {
  analytics,
  type OverviewData,
  type PageviewsByDay,
  type TopPage,
  type Referrer,
  type Device,
  type ScrollDepth,
  type Site,
} from "@/lib/analytics-client";

const PERIODS = [
  { label: "Today", days: 1 },
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
];

export default function AnalyticsDashboard() {
  const [token, setToken] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [days, setDays] = useState(7);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [chartData, setChartData] = useState<PageviewsByDay[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [scrollData, setScrollData] = useState<ScrollDepth[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auth
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("_analytics_token", token);
    setIsAuthed(true);
  }

  // Load sites on auth
  useEffect(() => {
    if (!isAuthed) {
      const saved = sessionStorage.getItem("_analytics_token");
      if (saved) {
        setToken(saved);
        setIsAuthed(true);
      }
      
return;
    }
    analytics.sites().then((s) => {
      setSites(s);
      if (s.length > 0 && !selectedSite) setSelectedSite(s[0].id);
    }).catch(() => {
      setIsAuthed(false);
      sessionStorage.removeItem("_analytics_token");
      setError("Invalid token");
    });
  }, [isAuthed, selectedSite]);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!selectedSite) return;
    setLoading(true);
    setError("");
    try {
      const [ov, chart, pages, refs, devs, scroll, live] = await Promise.all([
        analytics.overview(selectedSite, days),
        analytics.pageviewsByDay(selectedSite, days),
        analytics.topPages(selectedSite, days),
        analytics.referrers(selectedSite, days),
        analytics.devices(selectedSite, days),
        analytics.scrollDepth(selectedSite, days),
        analytics.live(selectedSite),
      ]);
      setOverview(ov);
      setChartData(chart);
      setTopPages(pages);
      setReferrers(refs);
      setDevices(devs);
      setScrollData(scroll);
      setLiveCount(live.active);
    } catch (err) {
      setError("Failed to load analytics data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedSite, days]);

  useEffect(() => {
    if (isAuthed && selectedSite) fetchData();
  }, [isAuthed, selectedSite, days, fetchData]);

  // Refresh live count every 30s
  useEffect(() => {
    if (!isAuthed || !selectedSite) return;
    const interval = setInterval(() => {
      analytics.live(selectedSite).then((l) => setLiveCount(l.active));
    }, 30000);
    
return () => clearInterval(interval);
  }, [isAuthed, selectedSite]);

  if (!isAuthed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a]">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 p-8">
          <div className="text-center">
            <BarChart3 className="mx-auto mb-4 h-10 w-10 text-[#c9a84c]" />
            <h1 className="text-xl font-bold text-white">Analytics</h1>
            <p className="mt-1 text-sm text-white/50">Enter your access token</p>
          </div>
          {error && <p className="text-center text-sm text-red-400">{error}</p>}
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Analytics secret token"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a84c] focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-[#c9a84c] px-4 py-3 text-sm font-bold text-[#0a0a1a] hover:bg-[#b8943f]"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  const maxChart = Math.max(...chartData.map((d) => d.count), 1);
  const deviceIcons = { Desktop: Monitor, Mobile: Smartphone, Tablet: Tablet };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-[#c9a84c]" />
            <h1 className="text-lg font-bold">Analytics</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400">
              <Activity className="h-3 w-3" />
              {liveCount} live
            </div>
            {/* Site selector */}
            {sites.length > 1 && (
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
            {/* Period selector */}
            <div className="flex rounded-lg border border-white/10">
              {PERIODS.map((p) => (
                <button
                  key={p.days}
                  onClick={() => setDays(p.days)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    days === p.days
                      ? "bg-[#c9a84c] text-[#0a0a1a]"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {loading && !overview ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9a84c] border-t-transparent" />
          </div>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {[
                { label: "Visitors", value: overview?.visitors ?? 0, icon: Users },
                { label: "Page Views", value: overview?.pageviews ?? 0, icon: Eye },
                { label: "Sessions", value: overview?.sessions ?? 0, icon: TrendingUp },
                { label: "New Visitors", value: overview?.new_visitors ?? 0, icon: ArrowUpRight },
                { label: "Avg Duration", value: `${overview?.avg_duration ?? 0}s`, icon: Clock },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-5"
                >
                  <div className="mb-3 flex items-center gap-2 text-xs text-white/40">
                    <card.icon className="h-3.5 w-3.5" />
                    {card.label}
                  </div>
                  <p className="text-2xl font-bold tabular-nums">
                    {typeof card.value === "number"
                      ? card.value.toLocaleString()
                      : card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="mb-8 rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="mb-4 text-sm font-semibold text-white/60">
                Page Views
              </h2>
              <div className="flex h-40 items-end gap-1">
                {chartData.map((d) => (
                  <div key={d.day} className="group relative flex flex-1 flex-col items-center">
                    <div className="absolute -top-8 hidden rounded bg-white/10 px-2 py-1 text-[10px] text-white group-hover:block">
                      {d.count} views
                    </div>
                    <div
                      className="w-full rounded-t bg-[#c9a84c]/80 transition-all hover:bg-[#c9a84c]"
                      style={{
                        height: `${Math.max((d.count / maxChart) * 100, 2)}%`,
                        minHeight: 2,
                      }}
                    />
                    <span className="mt-1 text-[9px] text-white/30">
                      {new Date(d.day).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid: Pages, Referrers, Devices */}
            <div className="mb-8 grid gap-6 lg:grid-cols-3">
              {/* Top Pages */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white/60">Top Pages</h2>
                  <Link
                    href={`/admin/analytics/heatmap?site=${selectedSite}`}
                    className="flex items-center gap-1 text-xs text-[#c9a84c] hover:underline"
                  >
                    <MousePointerClick className="h-3 w-3" />
                    Heatmap
                  </Link>
                </div>
                <div className="space-y-2">
                  {topPages.map((p) => (
                    <div key={p.path} className="flex items-center gap-3">
                      <Link
                        href={`/admin/analytics/heatmap?site=${selectedSite}&path=${encodeURIComponent(p.path)}`}
                        className="flex-1 truncate text-sm text-white/80 hover:text-[#c9a84c]"
                      >
                        {p.path}
                      </Link>
                      <span className="tabular-nums text-xs text-white/40">
                        {p.views}
                      </span>
                    </div>
                  ))}
                  {topPages.length === 0 && (
                    <p className="text-sm text-white/30">No data yet</p>
                  )}
                </div>
              </div>

              {/* Referrers */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <h2 className="mb-4 text-sm font-semibold text-white/60">
                  Traffic Sources
                </h2>
                <div className="space-y-2">
                  {referrers.map((r) => (
                    <div key={r.source} className="flex items-center gap-3">
                      <Globe className="h-3.5 w-3.5 shrink-0 text-white/20" />
                      <span className="flex-1 truncate text-sm text-white/80">
                        {r.source}
                      </span>
                      <span className="tabular-nums text-xs text-white/40">
                        {r.count}
                      </span>
                    </div>
                  ))}
                  {referrers.length === 0 && (
                    <p className="text-sm text-white/30">No data yet</p>
                  )}
                </div>
              </div>

              {/* Devices & Scroll */}
              <div className="space-y-6">
                {/* Devices */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                  <h2 className="mb-4 text-sm font-semibold text-white/60">
                    Devices
                  </h2>
                  <div className="space-y-3">
                    {devices.map((d) => {
                      const Icon =
                        deviceIcons[d.device as keyof typeof deviceIcons] || Monitor;
                      const total = devices.reduce((s, x) => s + x.visitors, 0);
                      const pct = total > 0 ? Math.round((d.visitors / total) * 100) : 0;
                      
return (
                        <div key={d.device} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-white/80">
                              <Icon className="h-3.5 w-3.5 text-white/30" />
                              {d.device}
                            </div>
                            <span className="text-xs text-white/40">{pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-[#c9a84c]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {devices.length === 0 && (
                      <p className="text-sm text-white/30">No data yet</p>
                    )}
                  </div>
                </div>

                {/* Scroll Depth */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                  <h2 className="mb-4 text-sm font-semibold text-white/60">
                    Scroll Depth
                  </h2>
                  <div className="space-y-2">
                    {[25, 50, 75, 100].map((depth) => {
                      const match = scrollData.find((s) => s.depth === depth);
                      const count = match?.count ?? 0;
                      const maxCount = Math.max(
                        ...scrollData.map((s) => s.count),
                        1
                      );
                      
return (
                        <div key={depth} className="flex items-center gap-3">
                          <span className="w-10 text-xs text-white/40">
                            {depth}%
                          </span>
                          <div className="flex-1">
                            <div className="h-1.5 rounded-full bg-white/5">
                              <div
                                className="h-full rounded-full bg-[#c9a84c]/60"
                                style={{
                                  width: `${(count / maxCount) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                          <span className="w-10 text-right tabular-nums text-xs text-white/40">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
