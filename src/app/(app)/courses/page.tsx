import { auth } from "@/server/auth";
import { SemesterService } from "@/server/services/semester.service";
import { CourseService } from "@/server/services/course.service";
import { CoursesClient } from "@/components/app/courses/courses-client";

// Server Component — reads go straight through the service layer (no need
// to round-trip through our own API from the server); mutations still go
// through the API routes from the client, via CoursesClient's forms.
export default async function CoursesPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [semesters, courses] = await Promise.all([
    SemesterService.list(userId),
    CourseService.list(userId),
  ]);

  return <CoursesClient semesters={semesters} courses={courses} />;
}
