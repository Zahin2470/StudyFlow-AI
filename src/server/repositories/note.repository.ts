import { prisma } from "@/lib/prisma";
import type { NoteInput } from "@/lib/schemas/academic.schema";

export const NoteRepository = {
  findAllForUser: (userId: string, courseId?: string) =>
    prisma.note.findMany({
      where: { course: { userId }, ...(courseId ? { courseId } : {}) },
      orderBy: { updatedAt: "desc" },
      include: { course: { select: { code: true, name: true, color: true } } },
    }),

  findByIdForUser: (id: string, userId: string) =>
    prisma.note.findFirst({ where: { id, course: { userId } } }),

  create: async (userId: string, data: NoteInput) => {
    const course = await prisma.course.findFirst({ where: { id: data.courseId, userId } });
    if (!course) throw new Error("COURSE_NOT_FOUND");
    return prisma.note.create({ data });
  },

  update: async (id: string, userId: string, data: Partial<NoteInput>) => {
    const existing = await prisma.note.findFirst({ where: { id, course: { userId } } });
    if (!existing) return null;
    return prisma.note.update({ where: { id }, data });
  },

  delete: async (id: string, userId: string) => {
    const existing = await prisma.note.findFirst({ where: { id, course: { userId } } });
    if (!existing) return null;
    return prisma.note.delete({ where: { id } });
  },
};
