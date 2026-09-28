import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { noteSchema } from "@/lib/schemas/academic.schema";
import { NoteService } from "@/server/services/note.service";

export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const courseId = new URL(req.url).searchParams.get("courseId") ?? undefined;
  return NextResponse.json(await NoteService.list(userId, courseId));
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = noteSchema.safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const note = await NoteService.create(userId, parsed.data);
    return NextResponse.json(note, { status: 201 });
  } catch {
    return errorResponse("COURSE_NOT_FOUND", "That course doesn't exist.", 400);
  }
}
