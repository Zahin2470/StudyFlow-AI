import { prisma } from "@/lib/prisma";
import { GradeEntryRepository } from "@/server/repositories/grade-entry.repository";
import type { GradeEntryInput } from "@/lib/schemas/academic.schema";
import { courseGradeSummary, creditWeightedGpa } from "@/lib/gpa";

export class GradeService {
  static listEntries(userId: string, courseId?: string) {
    return GradeEntryRepository.findAllForUser(userId, courseId);
  }

  static async createEntry(userId: string, input: GradeEntryInput) {
    try {
      return await GradeEntryRepository.create(userId, input);
    } catch (err) {
      if (err instanceof Error && err.message === "COURSE_NOT_FOUND") throw err;
      throw new Error("INTERNAL_ERROR");
    }
  }

  static async updateEntry(id: string, userId: string, input: Partial<GradeEntryInput>) {
    const updated = await GradeEntryRepository.update(id, userId, input);
    if (!updated) throw new Error("NOT_FOUND");
    return updated;
  }

  static async deleteEntry(id: string, userId: string) {
    const deleted = await GradeEntryRepository.delete(id, userId);
    if (!deleted) throw new Error("NOT_FOUND");
  }

  /**
   * Full GPA breakdown for a user: every semester with its courses, each
   * course's derived grade (from courseGradeSummary), semester GPA, and a
   * cumulative GPA across all semesters. Nothing here is read from a stored
   * GPA column — it's recomputed from GradeEntry rows every time.
   */
  static async getGpaBreakdown(userId: string) {
    const semesters = await prisma.semester.findMany({
      where: { userId },
      orderBy: { startDate: "desc" },
      include: {
        courses: {
          include: { gradeEntries: true },
        },
      },
    });

    const semesterBreakdowns = semesters.map((semester) => {
      const courses = semester.courses.map((course) => ({
        id: course.id,
        code: course.code,
        name: course.name,
        credits: course.credits,
        color: course.color,
        gradeEntries: course.gradeEntries,
        summary: courseGradeSummary(course.gradeEntries),
      }));

      return {
        id: semester.id,
        name: semester.name,
        isActive: semester.isActive,
        courses,
        gpa: creditWeightedGpa(courses),
      };
    });

    const allCourses = semesterBreakdowns.flatMap((s) => s.courses);
    const cumulativeGpa = creditWeightedGpa(allCourses);

    return { semesters: semesterBreakdowns, cumulativeGpa };
  }
}
