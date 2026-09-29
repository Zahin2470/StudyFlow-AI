import { prisma } from "@/lib/prisma";

export const GroupMessageRepository = {
  // Newest 50 for now — good enough at MVP scale; paginate if a group's
  // history grows large enough to matter.
  findRecent: (groupId: string) =>
    prisma.groupMessage.findMany({
      where: { groupId },
      orderBy: { createdAt: "asc" },
      take: 50,
      include: { user: { select: { id: true, name: true } } },
    }),

  create: (groupId: string, userId: string, content: string) =>
    prisma.groupMessage.create({
      data: { groupId, userId, content },
      include: { user: { select: { id: true, name: true } } },
    }),
};
