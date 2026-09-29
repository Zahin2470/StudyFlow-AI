import { StudyGroupRepository } from "@/server/repositories/study-group.repository";
import { GroupMessageRepository } from "@/server/repositories/group-message.repository";
import { GroupTaskRepository } from "@/server/repositories/group-task.repository";
import type { StudyGroupInput, GroupTaskInput } from "@/lib/schemas/academic.schema";

// Every method re-checks membership before touching group data — a group's
// id being guessable is not the same as being allowed to read it.
export class StudyGroupService {
  static list(userId: string) {
    return StudyGroupRepository.findAllForUser(userId);
  }

  static create(userId: string, input: StudyGroupInput) {
    return StudyGroupRepository.create(userId, input);
  }

  static async getDetail(groupId: string, userId: string) {
    const group = await StudyGroupRepository.findByIdForMember(groupId, userId);
    if (!group) throw new Error("NOT_FOUND");
    return group;
  }

  static async join(inviteCode: string, userId: string) {
    try {
      return await StudyGroupRepository.join(inviteCode, userId);
    } catch (err) {
      if (err instanceof Error && err.message === "INVALID_CODE") throw err;
      throw new Error("INTERNAL_ERROR");
    }
  }

  static async leave(groupId: string, userId: string) {
    const isMember = await StudyGroupRepository.isMember(groupId, userId);
    if (!isMember) throw new Error("NOT_FOUND");
    await StudyGroupRepository.leave(groupId, userId);
  }

  static deleteAsOwner(groupId: string, userId: string) {
    return StudyGroupRepository.deleteAsOwner(groupId, userId);
  }

  static async listMessages(groupId: string, userId: string) {
    if (!(await StudyGroupRepository.isMember(groupId, userId))) throw new Error("NOT_FOUND");
    return GroupMessageRepository.findRecent(groupId);
  }

  static async postMessage(groupId: string, userId: string, content: string) {
    if (!(await StudyGroupRepository.isMember(groupId, userId))) throw new Error("NOT_FOUND");
    return GroupMessageRepository.create(groupId, userId, content);
  }

  static async listTasks(groupId: string, userId: string) {
    if (!(await StudyGroupRepository.isMember(groupId, userId))) throw new Error("NOT_FOUND");
    return GroupTaskRepository.findAllForGroup(groupId);
  }

  static async createTask(groupId: string, userId: string, input: GroupTaskInput) {
    if (!(await StudyGroupRepository.isMember(groupId, userId))) throw new Error("NOT_FOUND");
    return GroupTaskRepository.create(groupId, userId, input);
  }

  static async toggleTask(taskId: string, groupId: string, userId: string, completed: boolean) {
    if (!(await StudyGroupRepository.isMember(groupId, userId))) throw new Error("NOT_FOUND");
    const result = await GroupTaskRepository.toggle(taskId, groupId, completed);
    if (result.count === 0) throw new Error("NOT_FOUND");
  }

  static async deleteTask(taskId: string, groupId: string, userId: string) {
    if (!(await StudyGroupRepository.isMember(groupId, userId))) throw new Error("NOT_FOUND");
    const result = await GroupTaskRepository.delete(taskId, groupId);
    if (result.count === 0) throw new Error("NOT_FOUND");
  }
}
