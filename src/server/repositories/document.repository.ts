import { prisma } from "@/lib/prisma";

type CreateDocumentData = {
  courseId: string;
  title: string;
  fileUrl: string;
  storageKey: string;
  fileType: string;
  fileSize: number;
};

export const DocumentRepository = {
  findAllForUser: (userId: string, courseId?: string) =>
    prisma.document.findMany({
      where: { course: { userId }, ...(courseId ? { courseId } : {}) },
      orderBy: { createdAt: "desc" },
      include: { course: { select: { code: true, name: true, color: true } } },
    }),

  findByIdForUser: (id: string, userId: string) =>
    prisma.document.findFirst({ where: { id, course: { userId } } }),

  create: async (userId: string, data: CreateDocumentData) => {
    const course = await prisma.course.findFirst({ where: { id: data.courseId, userId } });
    if (!course) throw new Error("COURSE_NOT_FOUND");
    return prisma.document.create({ data });
  },

  delete: async (id: string, userId: string) => {
    const existing = await prisma.document.findFirst({ where: { id, course: { userId } } });
    if (!existing) return null;
    await prisma.document.delete({ where: { id } });
    return existing; // caller needs storageKey to delete the underlying file
  },
};
