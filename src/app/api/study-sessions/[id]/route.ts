import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { studySessionSchema } from "@/lib/schemas/academic.schema";
import { StudySessionService } from "@/server/services/study-session.service";
import { StudySessionRepository } from "@/server/repositories/study-session.repository";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const session = await StudySessionRepository.findByIdForUser(params.id, userId);
  if (!session) return errorResponse("NOT_FOUND", "Study session not found.", 404);
  return NextResponse.json(session);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = studySessionSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const updated = await StudySessionService.update(params.id, userId, parsed.data);
    return NextResponse.json(updated);
  } catch {
    return errorResponse("NOT_FOUND", "Study session not found.", 404);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    await StudySessionService.delete(params.id, userId);
    return NextResponse.json({ message: "Study session deleted." });
  } catch {
    return errorResponse("NOT_FOUND", "Study session not found.", 404);
  }
}
