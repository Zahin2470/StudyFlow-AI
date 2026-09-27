import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { assignmentSchema } from "@/lib/schemas/academic.schema";
import { AssignmentService } from "@/server/services/assignment.service";
import { AssignmentRepository } from "@/server/repositories/assignment.repository";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const assignment = await AssignmentRepository.findByIdForUser(params.id, userId);
  if (!assignment) return errorResponse("NOT_FOUND", "Assignment not found.", 404);
  return NextResponse.json(assignment);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = assignmentSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const updated = await AssignmentService.update(params.id, userId, parsed.data);
    return NextResponse.json(updated);
  } catch {
    return errorResponse("NOT_FOUND", "Assignment not found.", 404);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    await AssignmentService.delete(params.id, userId);
    return NextResponse.json({ message: "Assignment deleted." });
  } catch {
    return errorResponse("NOT_FOUND", "Assignment not found.", 404);
  }
}
