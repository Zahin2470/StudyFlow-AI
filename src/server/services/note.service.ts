import { NoteRepository } from "@/server/repositories/note.repository";
import type { NoteInput } from "@/lib/schemas/academic.schema";

export class NoteService {
  static list(userId: string, courseId?: string) {
    return NoteRepository.findAllForUser(userId, courseId);
  }

  static async create(userId: string, input: NoteInput) {
    try {
      return await NoteRepository.create(userId, input);
    } catch (err) {
      if (err instanceof Error && err.message === "COURSE_NOT_FOUND") throw err;
      throw new Error("INTERNAL_ERROR");
    }
  }

  static async update(id: string, userId: string, input: Partial<NoteInput>) {
    const updated = await NoteRepository.update(id, userId, input);
    if (!updated) throw new Error("NOT_FOUND");
    return updated;
  }

  static async delete(id: string, userId: string) {
    const deleted = await NoteRepository.delete(id, userId);
    if (!deleted) throw new Error("NOT_FOUND");
  }
}
