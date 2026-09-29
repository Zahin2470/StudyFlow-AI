import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { groupTaskSchema } from "@/lib/schemas/academic.schema";
import { StudyGroupService } from "@/server/services/study-group.service";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    return NextResponse.json(await StudyGroupService.listTasks(params.id, userId));
  } catch {
    return errorResponse("NOT_FOUND", "Group not found.", 404);
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = groupTaskSchema.safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const task = await StudyGroupService.createTask(params.id, userId, parsed.data);
    return NextResponse.json(task, { status: 201 });
  } catch {
    return errorResponse("NOT_FOUND", "Group not found.", 404);
  }
}
