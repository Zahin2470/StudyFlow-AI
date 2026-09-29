import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { StudyGroupService } from "@/server/services/study-group.service";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    return NextResponse.json(await StudyGroupService.getDetail(params.id, userId));
  } catch {
    return errorResponse("NOT_FOUND", "Group not found.", 404);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    await StudyGroupService.deleteAsOwner(params.id, userId);
    return NextResponse.json({ message: "Group deleted." });
  } catch {
    return errorResponse("NOT_FOUND", "Group not found, or you're not its owner.", 404);
  }
}
