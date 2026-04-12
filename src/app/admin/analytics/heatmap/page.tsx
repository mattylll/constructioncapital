"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Flame, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { analytics, type HeatmapPoint, type TopPage } from "@/lib/analytics-client";

function drawHeatmap(
  canvas: HTMLCanvasElement,
  points: HeatmapPoint[],
  scaleX: number,
  scaleY: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (points.length === 0) return;

  // Draw each click as a radial gradient
  const radius = 30;
  points.forEach((p) => {
    const x = p.x * scaleX;
    const y = p.y * scaleY;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(255, 0, 0, 0.3)");
    gradient.addColorStop(0.4, "rgba(255, 165, 0, 0.15)");
    gradient.addColorStop(1, "rgba(255, 165, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  });

  // Second pass - bright dots at exact click points
  ctx.fillStyle = "rgba(255, 60, 0, 0.6)";
  points.forEach((p) => {
    const x = p.x * scaleX;
    const y = p.y * scaleY;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

export default function HeatmapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a]">
          <Loader2 className="h-8 w-8 animate-spin text-[#c9a84c]" />
        </div>
      }
    >
      <HeatmapContent />
    </Suspense>
  );
}

function HeatmapContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get("site") || "";
  const initialPath = searchParams.get("path") || "/";

  const [selectedPath, setSelectedPath] = useState(initialPath);
  const [pages, setPages] = useState<TopPage[]>([]);
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [days, setDays] = useState(7);
  const [siteUrl, setSiteUrl] = useState("");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get site domain
  useEffect(() => {
    if (!siteId) return;
    analytics.sites().then((sites) => {
      const site = sites.find((s) => s.id === siteId);
      if (site) setSiteUrl(`https://${site.domain}`);
    });
  }, [siteId]);

  // Load top pages for selector
  useEffect(() => {
    if (!siteId) return;
    analytics.topPages(siteId, 30).then(setPages);
  }, [siteId]);

  // Load heatmap data
  const loadHeatmap = useCallback(async () => {
    if (!siteId || !selectedPath) return;
    setLoading(true);
    try {
      const data = await analytics.heatmap(siteId, selectedPath, days);
      setPoints(data);
    } catch (err) {
      console.error("Failed to load heatmap:", err);
    } finally {
      setLoading(false);
    }
  }, [siteId, selectedPath, days]);

  useEffect(() => {
    loadHeatmap();
  }, [loadHeatmap]);

  // Render heatmap overlay when iframe loads
  useEffect(() => {
    if (!iframeLoaded || !canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Match canvas to iframe size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = iframe.scrollHeight || rect.height;
    canvas.style.height = `${canvas.height}px`;

    // Scale click coordinates to current viewport
    const refWidth = points[0]?.page_w || 1440;
    const refHeight = points[0]?.page_h || 3000;
    const scaleX = canvas.width / refWidth;
    const scaleY = canvas.height / refHeight;

    drawHeatmap(canvas, points, scaleX, scaleY);
  }, [iframeLoaded, points]);

  if (!siteId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a] text-white">
        <p>No site selected. Go back to the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/analytics"
              className="flex items-center gap-1 text-sm text-white/50 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              <h1 className="font-bold">Heatmap</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Page selector */}
            <select
              value={selectedPath}
              onChange={(e) => {
                setSelectedPath(e.target.value);
                setIframeLoaded(false);
              }}
              className="max-w-[200px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
            >
              {pages.map((p) => (
                <option key={p.path} value={p.path}>
                  {p.path} ({p.views} views)
                </option>
              ))}
            </select>

            {/* Period */}
            <div className="flex rounded-lg border border-white/10">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1.5 text-xs font-medium ${
                    days === d
                      ? "bg-orange-500 text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>

            <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/40">
              {points.length} clicks
            </span>
          </div>
        </div>
      </header>

      {/* Heatmap viewport */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-xl border border-white/10"
          style={{ minHeight: 600 }}
        >
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0a1a]/80">
              <Loader2 className="h-8 w-8 animate-spin text-[#c9a84c]" />
            </div>
          )}

          {/* Site iframe */}
          {siteUrl && (
            <iframe
              ref={iframeRef}
              src={`${siteUrl}${selectedPath}`}
              className="w-full border-0"
              style={{ height: 800, pointerEvents: "none" }}
              onLoad={() => setIframeLoaded(true)}
              sandbox="allow-same-origin allow-scripts"
            />
          )}

          {/* Heatmap canvas overlay */}
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute left-0 top-0 w-full"
            style={{ height: 800, mixBlendMode: "screen" }}
          />

          {points.length === 0 && !loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0a1a]/60">
              <p className="text-white/40">No click data for this page yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
