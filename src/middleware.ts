import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

// Gate every (app) route and every /api route except auth's own endpoints.
// The route handlers themselves re-check ownership on top of this — this
// middleware only proves "someone is logged in," not "this row is theirs."
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  const isAppRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/courses") ||
    req.nextUrl.pathname.startsWith("/assignments") ||
    req.nextUrl.pathname.startsWith("/exams") ||
    req.nextUrl.pathname.startsWith("/calendar") ||
    req.nextUrl.pathname.startsWith("/planner") ||
    req.nextUrl.pathname.startsWith("/notes") ||
    req.nextUrl.pathname.startsWith("/documents") ||
    req.nextUrl.pathname.startsWith("/gpa") ||
    req.nextUrl.pathname.startsWith("/analytics") ||
    req.nextUrl.pathname.startsWith("/assistant");

  if (isAppRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  if (isAuthRoute) return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/courses/:path*",
    "/assignments/:path*",
    "/exams/:path*",
    "/calendar/:path*",
    "/planner/:path*",
    "/notes/:path*",
    "/documents/:path*",
    "/gpa/:path*",
    "/analytics/:path*",
    "/assistant/:path*",
  ],
};
