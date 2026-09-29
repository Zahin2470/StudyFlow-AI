import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { studyGroupSchema } from "@/lib/schemas/academic.schema";
import { StudyGroupService } from "@/server/services/study-group.service";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  return NextResponse.json(await StudyGroupService.list(userId));
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = studyGroupSchema.safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  const group = await StudyGroupService.create(userId, parsed.data);
  return NextResponse.json(group, { status: 201 });
}
