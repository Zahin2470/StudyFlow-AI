import { prisma } from "@/lib/prisma";
import type { ExamInput } from "@/lib/schemas/academic.schema";

export const ExamRepository = {
  findAllForUser: (userId: string, courseId?: string) =>
    prisma.exam.findMany({
      where: { course: { userId }, ...(courseId ? { courseId } : {}) },
      orderBy: { examDate: "asc" },
      include: { course: { select: { code: true, name: true, color: true } } },
    }),

  findByIdForUser: (id: string, userId: string) =>
    prisma.exam.findFirst({ where: { id, course: { userId } } }),

  create: async (userId: string, data: ExamInput) => {
    const course = await prisma.course.findFirst({ where: { id: data.courseId, userId } });
    if (!course) throw new Error("COURSE_NOT_FOUND");
    return prisma.exam.create({ data });
  },

  update: async (id: string, userId: string, data: Partial<ExamInput>) => {
    const existing = await prisma.exam.findFirst({ where: { id, course: { userId } } });
    if (!existing) return null;
    return prisma.exam.update({ where: { id }, data });
  },

  delete: async (id: string, userId: string) => {
    const existing = await prisma.exam.findFirst({ where: { id, course: { userId } } });
    if (!existing) return null;
    return prisma.exam.delete({ where: { id } });
  },
};
