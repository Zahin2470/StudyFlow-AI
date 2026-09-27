import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { studySessionSchema } from "@/lib/schemas/academic.schema";
import { StudySessionService } from "@/server/services/study-session.service";

export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const url = new URL(req.url);
  const from = url.searchParams.get("from") ?? undefined;
  const to = url.searchParams.get("to") ?? undefined;
  return NextResponse.json(await StudySessionService.list(userId, from, to));
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = studySessionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  const session = await StudySessionService.create(userId, parsed.data);
  return NextResponse.json(session, { status: 201 });
}
