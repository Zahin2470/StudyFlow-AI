import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { gradeEntrySchema } from "@/lib/schemas/academic.schema";
import { GradeService } from "@/server/services/grade.service";

export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const courseId = new URL(req.url).searchParams.get("courseId") ?? undefined;
  return NextResponse.json(await GradeService.listEntries(userId, courseId));
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = gradeEntrySchema.safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const entry = await GradeService.createEntry(userId, parsed.data);
    return NextResponse.json(entry, { status: 201 });
  } catch {
    return errorResponse("COURSE_NOT_FOUND", "That course doesn't exist.", 400);
  }
}
