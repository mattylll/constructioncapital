import { NextRequest, NextResponse } from "next/server";

/**
 * HTTP Basic Auth gate for /admin/*.
 *
 * Requires `ADMIN_PASSWORD` (and optionally `ADMIN_USER`) in the environment.
 * If `ADMIN_PASSWORD` is not set, the admin section is hard-locked so a
 * misconfiguration doesn't accidentally expose it.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const expectedUser = process.env.ADMIN_USER ?? "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return new NextResponse(
      "Admin not configured. Set ADMIN_PASSWORD in the environment.",
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = atob(authHeader.slice("Basic ".length));
    const [user, ...passwordParts] = decoded.split(":");
    const password = passwordParts.join(":");
    if (user === expectedUser && password === expectedPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Construction Capital Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
