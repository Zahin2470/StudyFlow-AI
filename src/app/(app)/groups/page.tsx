import { auth } from "@/server/auth";
import { StudyGroupService } from "@/server/services/study-group.service";
import { GroupsClient } from "@/components/app/groups/groups-client";

export default async function GroupsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const groups = await StudyGroupService.list(userId);
  return <GroupsClient groups={groups} />;
}
