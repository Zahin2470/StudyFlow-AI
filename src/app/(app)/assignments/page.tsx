import { auth } from "@/server/auth";
import { CourseService } from "@/server/services/course.service";
import { AssignmentService } from "@/server/services/assignment.service";
import { AssignmentsClient } from "@/components/app/assignments/assignments-client";

export default async function AssignmentsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [courses, assignments] = await Promise.all([
    CourseService.list(userId),
    AssignmentService.list(userId),
  ]);

  return <AssignmentsClient courses={courses} assignments={JSON.parse(JSON.stringify(assignments))} />;
}
