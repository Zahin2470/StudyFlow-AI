import { prisma } from "@/lib/prisma";
import type { AssignmentInput } from "@/lib/schemas/academic.schema";

// Assignment has no direct userId — ownership is proven through the
// Course relation on every read/write instead (course.userId).
export const AssignmentRepository = {
  findAllForUser: (userId: string, courseId?: string) =>
    prisma.assignment.findMany({
      where: { course: { userId }, ...(courseId ? { courseId } : {}) },
      orderBy: { dueDate: "asc" },
      include: { course: { select: { code: true, name: true, color: true } } },
    }),

  findByIdForUser: (id: string, userId: string) =>
    prisma.assignment.findFirst({ where: { id, course: { userId } } }),

  create: async (userId: string, data: AssignmentInput) => {
    const course = await prisma.course.findFirst({ where: { id: data.courseId, userId } });
    if (!course) throw new Error("COURSE_NOT_FOUND");
    return prisma.assignment.create({ data });
  },

  update: async (id: string, userId: string, data: Partial<AssignmentInput>) => {
    const existing = await prisma.assignment.findFirst({ where: { id, course: { userId } } });
    if (!existing) return null;
    return prisma.assignment.update({ where: { id }, data });
  },

  delete: async (id: string, userId: string) => {
    const existing = await prisma.assignment.findFirst({ where: { id, course: { userId } } });
    if (!existing) return null;
    return prisma.assignment.delete({ where: { id } });
  },
};
