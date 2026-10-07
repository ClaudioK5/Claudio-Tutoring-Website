import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/token";

/**
 * Optimistic gate for page navigations only. Server actions (POST) are not redirected
 * here: every action verifies the session itself before touching data.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (request.method !== "GET" || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const authenticated = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!authenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
