import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { groupMessageSchema } from "@/lib/schemas/academic.schema";
import { StudyGroupService } from "@/server/services/study-group.service";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    return NextResponse.json(await StudyGroupService.listMessages(params.id, userId));
  } catch {
    return errorResponse("NOT_FOUND", "Group not found.", 404);
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = groupMessageSchema.safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const message = await StudyGroupService.postMessage(params.id, userId, parsed.data.content);
    return NextResponse.json(message, { status: 201 });
  } catch {
    return errorResponse("NOT_FOUND", "Group not found.", 404);
  }
}
