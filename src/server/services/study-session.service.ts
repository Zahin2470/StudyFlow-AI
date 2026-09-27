import { StudySessionRepository } from "@/server/repositories/study-session.repository";
import type { StudySessionInput } from "@/lib/schemas/academic.schema";

export class StudySessionService {
  static list(userId: string, from?: string, to?: string) {
    return StudySessionRepository.findAllForUser(userId, {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  static create(userId: string, input: StudySessionInput) {
    return StudySessionRepository.create(userId, input);
  }

  static async update(id: string, userId: string, input: Partial<StudySessionInput>) {
    const result = await StudySessionRepository.update(id, userId, input);
    if (result.count === 0) throw new Error("NOT_FOUND");
    return StudySessionRepository.findByIdForUser(id, userId);
  }

  static async delete(id: string, userId: string) {
    const result = await StudySessionRepository.delete(id, userId);
    if (result.count === 0) throw new Error("NOT_FOUND");
  }
}
