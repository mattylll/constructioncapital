import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsDb } from "@/lib/analytics-db";

/**
 * Analytics query API - used by the admin dashboard.
 * Protected by a simple token check.
 */
function isAuthorized(request: NextRequest): boolean {
  const token = request.headers.get("x-analytics-token");
  const expected = process.env.ANALYTICS_SECRET;
  if (!expected) return false;
  
return token === expected;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const siteId = searchParams.get("site_id");
  const days = parseInt(searchParams.get("days") || "7", 10);
  const path = searchParams.get("path");

  const db = getAnalyticsDb();

  try {
    switch (query) {
      case "overview": {
        const result = await db.batch([
          // Total pageviews
          {
            sql: `SELECT COUNT(*) as count FROM events WHERE site_id = ? AND event_type = 'pageview' AND created_at >= datetime('now', ?)`,
            args: [siteId, `-${days} days`],
          },
          // Unique visitors
          {
            sql: `SELECT COUNT(DISTINCT visitor_id) as count FROM events WHERE site_id = ? AND event_type = 'pageview' AND created_at >= datetime('now', ?)`,
            args: [siteId, `-${days} days`],
          },
          // Unique sessions
          {
            sql: `SELECT COUNT(DISTINCT session_id) as count FROM events WHERE site_id = ? AND event_type = 'pageview' AND created_at >= datetime('now', ?)`,
            args: [siteId, `-${days} days`],
          },
          // New visitors
          {
            sql: `SELECT COUNT(DISTINCT visitor_id) as count FROM events WHERE site_id = ? AND event_type = 'pageview' AND is_new_visitor = 1 AND created_at >= datetime('now', ?)`,
            args: [siteId, `-${days} days`],
          },
          // Avg session duration from leave events
          {
            sql: `SELECT AVG(CAST(json_extract(data, '$.dur') AS INTEGER)) as avg_dur FROM events WHERE site_id = ? AND event_type = 'leave' AND created_at >= datetime('now', ?)`,
            args: [siteId, `-${days} days`],
          },
        ]);

        return NextResponse.json({
          pageviews: result[0].rows[0]?.count ?? 0,
          visitors: result[1].rows[0]?.count ?? 0,
          sessions: result[2].rows[0]?.count ?? 0,
          new_visitors: result[3].rows[0]?.count ?? 0,
          avg_duration: Math.round(
            (result[4].rows[0]?.avg_dur as number) ?? 0
          ),
        });
      }

      case "pageviews_by_day": {
        const result = await db.execute({
          sql: `SELECT date(created_at) as day, COUNT(*) as count
                FROM events
                WHERE site_id = ? AND event_type = 'pageview' AND created_at >= datetime('now', ?)
                GROUP BY date(created_at)
                ORDER BY day`,
          args: [siteId, `-${days} days`],
        });
        
return NextResponse.json(result.rows);
      }

      case "top_pages": {
        const result = await db.execute({
          sql: `SELECT path, COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors
                FROM events
                WHERE site_id = ? AND event_type = 'pageview' AND created_at >= datetime('now', ?)
                GROUP BY path
                ORDER BY views DESC
                LIMIT 20`,
          args: [siteId, `-${days} days`],
        });
        
return NextResponse.json(result.rows);
      }

      case "referrers": {
        const result = await db.execute({
          sql: `SELECT
                  CASE
                    WHEN referrer IS NULL OR referrer = '' THEN '(direct)'
                    ELSE referrer
                  END as source,
                  COUNT(*) as count
                FROM events
                WHERE site_id = ? AND event_type = 'pageview' AND created_at >= datetime('now', ?)
                GROUP BY source
                ORDER BY count DESC
                LIMIT 20`,
          args: [siteId, `-${days} days`],
        });
        
return NextResponse.json(result.rows);
      }

      case "countries": {
        const result = await db.execute({
          sql: `SELECT country, COUNT(DISTINCT visitor_id) as visitors
                FROM events
                WHERE site_id = ? AND event_type = 'pageview' AND country != '' AND created_at >= datetime('now', ?)
                GROUP BY country
                ORDER BY visitors DESC
                LIMIT 20`,
          args: [siteId, `-${days} days`],
        });
        
return NextResponse.json(result.rows);
      }

      case "devices": {
        const result = await db.execute({
          sql: `SELECT
                  CASE
                    WHEN viewport_w < 768 THEN 'Mobile'
                    WHEN viewport_w < 1024 THEN 'Tablet'
                    ELSE 'Desktop'
                  END as device,
                  COUNT(DISTINCT visitor_id) as visitors
                FROM events
                WHERE site_id = ? AND event_type = 'pageview' AND created_at >= datetime('now', ?)
                GROUP BY device
                ORDER BY visitors DESC`,
          args: [siteId, `-${days} days`],
        });
        
return NextResponse.json(result.rows);
      }

      case "scroll_depth": {
        const result = await db.execute({
          sql: `SELECT
                  CAST(json_extract(data, '$.depth') AS INTEGER) as depth,
                  COUNT(*) as count
                FROM events
                WHERE site_id = ? AND event_type = 'scroll' AND created_at >= datetime('now', ?)
                ${path ? "AND path = ?" : ""}
                GROUP BY depth
                ORDER BY depth`,
          args: path
            ? [siteId, `-${days} days`, path]
            : [siteId, `-${days} days`],
        });
        
return NextResponse.json(result.rows);
      }

      case "heatmap": {
        const result = await db.execute({
          sql: `SELECT
                  CAST(json_extract(data, '$.x') AS INTEGER) as x,
                  CAST(json_extract(data, '$.y') AS INTEGER) as y,
                  CAST(json_extract(data, '$.pw') AS INTEGER) as page_w,
                  CAST(json_extract(data, '$.ph') AS INTEGER) as page_h,
                  json_extract(data, '$.el') as element
                FROM events
                WHERE site_id = ? AND event_type = 'click' AND path = ? AND created_at >= datetime('now', ?)
                LIMIT 5000`,
          args: [siteId, path || "/", `-${days} days`],
        });
        
return NextResponse.json(result.rows);
      }

      case "live": {
        const result = await db.execute({
          sql: `SELECT COUNT(DISTINCT session_id) as active
                FROM events
                WHERE site_id = ? AND event_type = 'pageview' AND created_at >= datetime('now', '-5 minutes')`,
          args: [siteId],
        });
        
return NextResponse.json({ active: result.rows[0]?.active ?? 0 });
      }

      case "sites": {
        const result = await db.execute({
          sql: `SELECT * FROM sites ORDER BY name`,
          args: [],
        });
        
return NextResponse.json(result.rows);
      }

      default:
        return NextResponse.json(
          { error: "Unknown query" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Analytics query error:", error);
    
return NextResponse.json(
      { error: "Query failed" },
      { status: 500 }
    );
  }
}
