import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { StudyGroupService } from "@/server/services/study-group.service";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    await StudyGroupService.leave(params.id, userId);
    return NextResponse.json({ message: "Left the group." });
  } catch (err) {
    if (err instanceof Error && err.message === "OWNER_CANNOT_LEAVE") {
      return errorResponse("OWNER_CANNOT_LEAVE", "Transfer ownership or delete the group instead of leaving it.", 400);
    }
    return errorResponse("NOT_FOUND", "Group not found.", 404);
  }
}
