import { ExamRepository } from "@/server/repositories/exam.repository";
import type { ExamInput } from "@/lib/schemas/academic.schema";

export class ExamService {
  static list(userId: string, courseId?: string) {
    return ExamRepository.findAllForUser(userId, courseId);
  }

  static async create(userId: string, input: ExamInput) {
    try {
      return await ExamRepository.create(userId, input);
    } catch (err) {
      if (err instanceof Error && err.message === "COURSE_NOT_FOUND") throw err;
      throw new Error("INTERNAL_ERROR");
    }
  }

  static async update(id: string, userId: string, input: Partial<ExamInput>) {
    const updated = await ExamRepository.update(id, userId, input);
    if (!updated) throw new Error("NOT_FOUND");
    return updated;
  }

  static async delete(id: string, userId: string) {
    const deleted = await ExamRepository.delete(id, userId);
    if (!deleted) throw new Error("NOT_FOUND");
  }
}
