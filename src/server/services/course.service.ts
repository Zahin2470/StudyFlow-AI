import { CourseRepository } from "@/server/repositories/course.repository";
import { SemesterRepository } from "@/server/repositories/semester.repository";
import type { CourseInput } from "@/lib/schemas/academic.schema";

export class CourseService {
  static list(userId: string, semesterId?: string) {
    return CourseRepository.findAllForUser(userId, semesterId);
  }

  static async create(userId: string, input: CourseInput) {
    const semester = await SemesterRepository.findByIdForUser(input.semesterId, userId);
    if (!semester) throw new Error("SEMESTER_NOT_FOUND");
    return CourseRepository.create(userId, input);
  }

  static async update(id: string, userId: string, input: Partial<CourseInput>) {
    const result = await CourseRepository.update(id, userId, input);
    if (result.count === 0) throw new Error("NOT_FOUND");
    return CourseRepository.findByIdForUser(id, userId);
  }

  static async delete(id: string, userId: string) {
    const result = await CourseRepository.delete(id, userId);
    if (result.count === 0) throw new Error("NOT_FOUND");
  }
}
