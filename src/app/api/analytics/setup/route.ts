import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsDb, initAnalyticsSchema } from "@/lib/analytics-db";

function isAuthorized(request: NextRequest): boolean {
  const token = request.headers.get("x-analytics-token");
  const expected = process.env.ANALYTICS_SECRET;
  if (!expected) return false;
  return token === expected;
}

/** POST /api/analytics/setup - initialize schema and optionally add a site */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Initialize schema
    await initAnalyticsSchema();

    // Optionally add a site
    const body = await request.json().catch(() => null);
    if (body?.site_id && body?.name && body?.domain) {
      const db = getAnalyticsDb();
      await db.execute({
        sql: `INSERT OR IGNORE INTO sites (id, name, domain) VALUES (?, ?, ?)`,
        args: [body.site_id, body.name, body.domain],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics setup error:", error);
    return NextResponse.json(
      { error: "Setup failed", details: String(error) },
      { status: 500 }
    );
  }
}
