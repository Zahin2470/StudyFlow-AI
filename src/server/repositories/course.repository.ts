import { prisma } from "@/lib/prisma";
import type { CourseInput } from "@/lib/schemas/academic.schema";

export const CourseRepository = {
  findAllForUser: (userId: string, semesterId?: string) =>
    prisma.course.findMany({
      where: { userId, ...(semesterId ? { semesterId } : {}) },
      orderBy: { code: "asc" },
    }),

  findByIdForUser: (id: string, userId: string) =>
    prisma.course.findFirst({ where: { id, userId } }),

  create: (userId: string, data: CourseInput) => prisma.course.create({ data: { ...data, userId } }),

  update: (id: string, userId: string, data: Partial<CourseInput>) =>
    prisma.course.updateMany({ where: { id, userId }, data }),

  delete: (id: string, userId: string) => prisma.course.deleteMany({ where: { id, userId } }),
};
