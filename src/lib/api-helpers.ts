import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

// Shared by every route handler under /api — re-validates the session
// server-side even though middleware already gated the route (see
// ARCHITECTURE.md §3: "never trust the client-side redirect alone").
export async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user.id;
}

export function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export function unauthorized() {
  return errorResponse("UNAUTHORIZED", "You need to be logged in.", 401);
}
