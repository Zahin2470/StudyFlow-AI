import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { StudyGroupService } from "@/server/services/study-group.service";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; taskId: string } }
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const { completed } = await req.json();
  try {
    await StudyGroupService.toggleTask(params.taskId, params.id, userId, !!completed);
    return NextResponse.json({ message: "Updated." });
  } catch {
    return errorResponse("NOT_FOUND", "Task not found.", 404);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; taskId: string } }
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    await StudyGroupService.deleteTask(params.taskId, params.id, userId);
    return NextResponse.json({ message: "Task deleted." });
  } catch {
    return errorResponse("NOT_FOUND", "Task not found.", 404);
  }
}
