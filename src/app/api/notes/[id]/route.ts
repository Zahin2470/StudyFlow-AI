import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { noteSchema } from "@/lib/schemas/academic.schema";
import { NoteService } from "@/server/services/note.service";
import { NoteRepository } from "@/server/repositories/note.repository";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const note = await NoteRepository.findByIdForUser(params.id, userId);
  if (!note) return errorResponse("NOT_FOUND", "Note not found.", 404);
  return NextResponse.json(note);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = noteSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const updated = await NoteService.update(params.id, userId, parsed.data);
    return NextResponse.json(updated);
  } catch {
    return errorResponse("NOT_FOUND", "Note not found.", 404);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    await NoteService.delete(params.id, userId);
    return NextResponse.json({ message: "Note deleted." });
  } catch {
    return errorResponse("NOT_FOUND", "Note not found.", 404);
  }
}
