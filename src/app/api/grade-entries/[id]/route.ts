import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { gradeEntrySchema } from "@/lib/schemas/academic.schema";
import { GradeService } from "@/server/services/grade.service";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = gradeEntrySchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const updated = await GradeService.updateEntry(params.id, userId, parsed.data);
    return NextResponse.json(updated);
  } catch {
    return errorResponse("NOT_FOUND", "Grade entry not found.", 404);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    await GradeService.deleteEntry(params.id, userId);
    return NextResponse.json({ message: "Grade entry deleted." });
  } catch {
    return errorResponse("NOT_FOUND", "Grade entry not found.", 404);
  }
}
