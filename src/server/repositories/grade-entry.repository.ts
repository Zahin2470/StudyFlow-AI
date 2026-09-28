import { prisma } from "@/lib/prisma";
import type { GradeEntryInput } from "@/lib/schemas/academic.schema";

export const GradeEntryRepository = {
  findAllForUser: (userId: string, courseId?: string) =>
    prisma.gradeEntry.findMany({
      where: { course: { userId }, ...(courseId ? { courseId } : {}) },
      orderBy: { createdAt: "asc" },
    }),

  findByIdForUser: (id: string, userId: string) =>
    prisma.gradeEntry.findFirst({ where: { id, course: { userId } } }),

  create: async (userId: string, data: GradeEntryInput) => {
    const course = await prisma.course.findFirst({ where: { id: data.courseId, userId } });
    if (!course) throw new Error("COURSE_NOT_FOUND");
    return prisma.gradeEntry.create({ data });
  },

  update: async (id: string, userId: string, data: Partial<GradeEntryInput>) => {
    const existing = await prisma.gradeEntry.findFirst({ where: { id, course: { userId } } });
    if (!existing) return null;
    return prisma.gradeEntry.update({ where: { id }, data });
  },

  delete: async (id: string, userId: string) => {
    const existing = await prisma.gradeEntry.findFirst({ where: { id, course: { userId } } });
    if (!existing) return null;
    return prisma.gradeEntry.delete({ where: { id } });
  },
};
