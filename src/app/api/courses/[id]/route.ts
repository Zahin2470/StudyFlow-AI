import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { courseSchema } from "@/lib/schemas/academic.schema";
import { CourseService } from "@/server/services/course.service";
import { CourseRepository } from "@/server/repositories/course.repository";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const course = await CourseRepository.findByIdForUser(params.id, userId);
  if (!course) return errorResponse("NOT_FOUND", "Course not found.", 404);
  return NextResponse.json(course);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = courseSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const updated = await CourseService.update(params.id, userId, parsed.data);
    return NextResponse.json(updated);
  } catch {
    return errorResponse("NOT_FOUND", "Course not found.", 404);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    await CourseService.delete(params.id, userId);
    return NextResponse.json({ message: "Course deleted." });
  } catch {
    return errorResponse("NOT_FOUND", "Course not found.", 404);
  }
}
