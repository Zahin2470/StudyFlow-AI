import { prisma } from "@/lib/prisma";
import type { SemesterInput } from "@/lib/schemas/academic.schema";

// Every query here is scoped by userId — this is the only file that talks
// to Prisma for semesters, so ownership can't accidentally be skipped
// somewhere else in the codebase (see ARCHITECTURE.md §8, IDOR mitigation).
export const SemesterRepository = {
  findAllForUser: (userId: string) =>
    prisma.semester.findMany({ where: { userId }, orderBy: { startDate: "desc" } }),

  findByIdForUser: (id: string, userId: string) =>
    prisma.semester.findFirst({ where: { id, userId } }),

  create: (userId: string, data: SemesterInput) =>
    prisma.semester.create({ data: { ...data, userId } }),

  update: (id: string, userId: string, data: Partial<SemesterInput>) =>
    prisma.semester.updateMany({ where: { id, userId }, data }),

  delete: (id: string, userId: string) => prisma.semester.deleteMany({ where: { id, userId } }),
};
