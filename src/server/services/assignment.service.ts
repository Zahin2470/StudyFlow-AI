import { AssignmentRepository } from "@/server/repositories/assignment.repository";
import type { AssignmentInput } from "@/lib/schemas/academic.schema";

export class AssignmentService {
  static list(userId: string, courseId?: string) {
    return AssignmentRepository.findAllForUser(userId, courseId);
  }

  static async create(userId: string, input: AssignmentInput) {
    try {
      return await AssignmentRepository.create(userId, input);
    } catch (err) {
      if (err instanceof Error && err.message === "COURSE_NOT_FOUND") throw err;
      throw new Error("INTERNAL_ERROR");
    }
  }

  static async update(id: string, userId: string, input: Partial<AssignmentInput>) {
    const updated = await AssignmentRepository.update(id, userId, input);
    if (!updated) throw new Error("NOT_FOUND");
    return updated;
  }

  static async delete(id: string, userId: string) {
    const deleted = await AssignmentRepository.delete(id, userId);
    if (!deleted) throw new Error("NOT_FOUND");
  }
}
