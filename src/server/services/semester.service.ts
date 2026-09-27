import { SemesterRepository } from "@/server/repositories/semester.repository";
import type { SemesterInput } from "@/lib/schemas/academic.schema";
import { prisma } from "@/lib/prisma";

export class SemesterService {
  static list(userId: string) {
    return SemesterRepository.findAllForUser(userId);
  }

  static async create(userId: string, input: SemesterInput) {
    // Only one active semester at a time — activating a new one deactivates the rest.
    if (input.isActive) {
      await prisma.semester.updateMany({ where: { userId }, data: { isActive: false } });
    }
    return SemesterRepository.create(userId, input);
  }

  static async update(id: string, userId: string, input: Partial<SemesterInput>) {
    if (input.isActive) {
      await prisma.semester.updateMany({ where: { userId }, data: { isActive: false } });
    }
    const result = await SemesterRepository.update(id, userId, input);
    if (result.count === 0) throw new Error("NOT_FOUND");
    return SemesterRepository.findByIdForUser(id, userId);
  }

  static async delete(id: string, userId: string) {
    const result = await SemesterRepository.delete(id, userId);
    if (result.count === 0) throw new Error("NOT_FOUND");
  }
}
