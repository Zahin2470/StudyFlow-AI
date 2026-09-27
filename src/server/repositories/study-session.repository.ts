import { prisma } from "@/lib/prisma";
import type { StudySessionInput } from "@/lib/schemas/academic.schema";

export const StudySessionRepository = {
  findAllForUser: (userId: string, range?: { from?: Date; to?: Date }) =>
    prisma.studySession.findMany({
      where: {
        userId,
        ...(range?.from || range?.to
          ? { scheduledStart: { gte: range?.from, lte: range?.to } }
          : {}),
      },
      orderBy: { scheduledStart: "asc" },
      include: { course: { select: { code: true, name: true, color: true } } },
    }),

  findByIdForUser: (id: string, userId: string) =>
    prisma.studySession.findFirst({ where: { id, userId } }),

  create: (userId: string, data: StudySessionInput) =>
    prisma.studySession.create({ data: { ...data, userId } }),

  update: (id: string, userId: string, data: Partial<StudySessionInput>) =>
    prisma.studySession.updateMany({ where: { id, userId }, data }),

  delete: (id: string, userId: string) =>
    prisma.studySession.deleteMany({ where: { id, userId } }),
};
