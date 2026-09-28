import { NextResponse } from "next/server";
import { requireUserId, unauthorized } from "@/lib/api-helpers";
import { globalSearch } from "@/server/services/search.service";

export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const q = new URL(req.url).searchParams.get("q") ?? "";
  return NextResponse.json(await globalSearch(userId, q));
}
