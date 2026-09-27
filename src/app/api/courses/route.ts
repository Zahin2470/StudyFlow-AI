import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { courseSchema } from "@/lib/schemas/academic.schema";
import { CourseService } from "@/server/services/course.service";

export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const semesterId = new URL(req.url).searchParams.get("semesterId") ?? undefined;
  return NextResponse.json(await CourseService.list(userId, semesterId));
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = courseSchema.safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const course = await CourseService.create(userId, parsed.data);
    return NextResponse.json(course, { status: 201 });
  } catch {
    return errorResponse("SEMESTER_NOT_FOUND", "That semester doesn't exist.", 400);
  }
}
