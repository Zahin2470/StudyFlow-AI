import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { joinGroupSchema } from "@/lib/schemas/academic.schema";
import { StudyGroupService } from "@/server/services/study-group.service";

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = joinGroupSchema.safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const group = await StudyGroupService.join(parsed.data.inviteCode, userId);
    return NextResponse.json(group);
  } catch {
    return errorResponse("INVALID_CODE", "That invite code doesn't match any group.", 404);
  }
}
