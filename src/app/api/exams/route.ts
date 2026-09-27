import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { examSchema } from "@/lib/schemas/academic.schema";
import { ExamService } from "@/server/services/exam.service";

export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const courseId = new URL(req.url).searchParams.get("courseId") ?? undefined;
  return NextResponse.json(await ExamService.list(userId, courseId));
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = examSchema.safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const exam = await ExamService.create(userId, parsed.data);
    return NextResponse.json(exam, { status: 201 });
  } catch {
    return errorResponse("COURSE_NOT_FOUND", "That course doesn't exist.", 400);
  }
}
