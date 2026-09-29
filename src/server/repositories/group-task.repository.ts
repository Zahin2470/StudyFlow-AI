import { prisma } from "@/lib/prisma";
import type { GroupTaskInput } from "@/lib/schemas/academic.schema";

export const GroupTaskRepository = {
  findAllForGroup: (groupId: string) =>
    prisma.groupSharedTask.findMany({
      where: { groupId },
      orderBy: [{ completed: "asc" }, { dueDate: "asc" }],
      include: { createdBy: { select: { name: true } } },
    }),

  create: (groupId: string, userId: string, data: GroupTaskInput) =>
    prisma.groupSharedTask.create({ data: { ...data, groupId, createdById: userId } }),

  toggle: (id: string, groupId: string, completed: boolean) =>
    prisma.groupSharedTask.updateMany({ where: { id, groupId }, data: { completed } }),

  delete: (id: string, groupId: string) =>
    prisma.groupSharedTask.deleteMany({ where: { id, groupId } }),
};
