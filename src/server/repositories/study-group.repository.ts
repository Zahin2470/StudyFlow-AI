import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import type { StudyGroupInput } from "@/lib/schemas/academic.schema";

function generateInviteCode() {
  return crypto.randomBytes(4).toString("hex"); // 8 chars, easy to type/share
}

export const StudyGroupRepository = {
  isMember: async (groupId: string, userId: string) =>
    !!(await prisma.groupMembership.findUnique({ where: { groupId_userId: { groupId, userId } } })),

  findAllForUser: (userId: string) =>
    prisma.studyGroup.findMany({
      where: { memberships: { some: { userId } } },
      include: { _count: { select: { memberships: true } } },
      orderBy: { createdAt: "desc" },
    }),

  findByIdForMember: async (id: string, userId: string) => {
    const isMember = await StudyGroupRepository.isMember(id, userId);
    if (!isMember) return null;
    return prisma.studyGroup.findUnique({
      where: { id },
      include: {
        memberships: { include: { user: { select: { id: true, name: true } } } },
        _count: { select: { memberships: true } },
      },
    });
  },

  findByInviteCode: (inviteCode: string) => prisma.studyGroup.findUnique({ where: { inviteCode } }),

  // Group + owner membership created together — a group can't exist without
  // its owner being a member, so this is one transaction, not two writes.
  create: (userId: string, data: StudyGroupInput) =>
    prisma.$transaction(async (tx) => {
      const group = await tx.studyGroup.create({
        data: { ...data, ownerId: userId, inviteCode: generateInviteCode() },
      });
      await tx.groupMembership.create({
        data: { groupId: group.id, userId, role: "OWNER" },
      });
      return group;
    }),

  join: async (inviteCode: string, userId: string) => {
    const group = await prisma.studyGroup.findUnique({ where: { inviteCode } });
    if (!group) throw new Error("INVALID_CODE");

    const existing = await StudyGroupRepository.isMember(group.id, userId);
    if (existing) return group;

    await prisma.groupMembership.create({ data: { groupId: group.id, userId, role: "MEMBER" } });
    return group;
  },

  leave: async (groupId: string, userId: string) => {
    const group = await prisma.studyGroup.findUnique({ where: { id: groupId } });
    if (group?.ownerId === userId) throw new Error("OWNER_CANNOT_LEAVE");
    await prisma.groupMembership.deleteMany({ where: { groupId, userId } });
  },

  deleteAsOwner: async (groupId: string, userId: string) => {
    const result = await prisma.studyGroup.deleteMany({ where: { id: groupId, ownerId: userId } });
    if (result.count === 0) throw new Error("NOT_FOUND_OR_NOT_OWNER");
  },
};
