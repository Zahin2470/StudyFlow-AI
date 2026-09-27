import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { examSchema } from "@/lib/schemas/academic.schema";
import { ExamService } from "@/server/services/exam.service";
import { ExamRepository } from "@/server/repositories/exam.repository";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const exam = await ExamRepository.findByIdForUser(params.id, userId);
  if (!exam) return errorResponse("NOT_FOUND", "Exam not found.", 404);
  return NextResponse.json(exam);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = examSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const updated = await ExamService.update(params.id, userId, parsed.data);
    return NextResponse.json(updated);
  } catch {
    return errorResponse("NOT_FOUND", "Exam not found.", 404);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    await ExamService.delete(params.id, userId);
    return NextResponse.json({ message: "Exam deleted." });
  } catch {
    return errorResponse("NOT_FOUND", "Exam not found.", 404);
  }
}
