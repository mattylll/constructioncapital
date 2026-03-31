import { NextResponse } from "next/server";
import { getAnalyticsDb } from "@/lib/analytics-db";

// CORS headers for cross-origin tracking
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

interface TrackingEvent {
  t: string; // event type
  ts: number; // timestamp
  d: Record<string, unknown>; // event data
}

interface TrackingPayload {
  site_id: string;
  session_id: string;
  visitor_id: string;
  is_new: boolean;
  events: TrackingEvent[];
}

export async function POST(request: Request) {
  try {
    // Handle sendBeacon (text/plain content type)
    let body: TrackingPayload;
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = JSON.parse(text);
    }

    const { site_id, session_id, visitor_id, is_new, events } = body;

    if (!site_id || !session_id || !visitor_id || !Array.isArray(events)) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Cap batch size
    const batch = events.slice(0, 50);
    if (batch.length === 0) {
      return NextResponse.json({ ok: true }, { headers: corsHeaders });
    }

    const db = getAnalyticsDb();

    // Get user-agent and approximate country from headers
    const ua = request.headers.get("user-agent") || "";
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("x-nf-country-code") ||
      request.headers.get("cf-ipcountry") ||
      "";

    // Insert events in a batch
    const statements = batch.map((evt) => {
      const d = evt.d || {};
      return {
        sql: `INSERT INTO events (site_id, session_id, visitor_id, event_type, path, url, referrer, title, data, screen_w, screen_h, viewport_w, viewport_h, language, ua, country, is_new_visitor, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        args: [
          site_id,
          session_id,
          visitor_id,
          evt.t,
          (d.path as string) || null,
          (d.url as string) || null,
          (d.ref as string) || null,
          (d.title as string) || null,
          JSON.stringify(d),
          (d.sw as number) || null,
          (d.sh as number) || null,
          (d.vw as number) || null,
          (d.vh as number) || null,
          (d.lang as string) || null,
          ua,
          country,
          is_new ? 1 : 0,
        ],
      };
    });

    await db.batch(statements);

    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  } catch (error) {
    console.error("Analytics collect error:", error);
    return NextResponse.json(
      { error: "Failed to collect events" },
      { status: 500, headers: corsHeaders }
    );
  }
}
