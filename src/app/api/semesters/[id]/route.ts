import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { semesterSchema } from "@/lib/schemas/academic.schema";
import { SemesterService } from "@/server/services/semester.service";
import { SemesterRepository } from "@/server/repositories/semester.repository";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const semester = await SemesterRepository.findByIdForUser(params.id, userId);
  if (!semester) return errorResponse("NOT_FOUND", "Semester not found.", 404);
  return NextResponse.json(semester);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = semesterSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const updated = await SemesterService.update(params.id, userId, parsed.data);
    return NextResponse.json(updated);
  } catch {
    return errorResponse("NOT_FOUND", "Semester not found.", 404);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    await SemesterService.delete(params.id, userId);
    return NextResponse.json({ message: "Semester deleted." });
  } catch {
    return errorResponse("NOT_FOUND", "Semester not found.", 404);
  }
}
