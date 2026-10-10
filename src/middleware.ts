import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const userId = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (userId) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/home/:path*", "/deal/:path*", "/notes", "/notes/:path*", "/nest/:path*", "/nest", "/api/:path*"],
};
