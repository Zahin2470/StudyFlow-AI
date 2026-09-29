import { notFound } from "next/navigation";
import { auth } from "@/server/auth";
import { StudyGroupService } from "@/server/services/study-group.service";
import { GroupDetailClient } from "@/components/app/groups/group-detail-client";

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const userId = session!.user.id;

  try {
    const [group, tasks] = await Promise.all([
      StudyGroupService.getDetail(params.id, userId),
      StudyGroupService.listTasks(params.id, userId),
    ]);
    return (
      <GroupDetailClient
        group={JSON.parse(JSON.stringify(group))}
        currentUserId={userId}
        tasks={JSON.parse(JSON.stringify(tasks))}
      />
    );
  } catch {
    notFound();
  }
}
