import { auth } from "@/server/auth";
import { CourseService } from "@/server/services/course.service";
import { StudySessionService } from "@/server/services/study-session.service";
import { PlannerClient } from "@/components/app/planner/planner-client";

export default async function PlannerPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [courses, sessions] = await Promise.all([
    CourseService.list(userId),
    StudySessionService.list(userId),
  ]);

  return <PlannerClient courses={courses} sessions={JSON.parse(JSON.stringify(sessions))} />;
}
