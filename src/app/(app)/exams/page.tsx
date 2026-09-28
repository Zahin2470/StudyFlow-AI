import { auth } from "@/server/auth";
import { CourseService } from "@/server/services/course.service";
import { ExamService } from "@/server/services/exam.service";
import { ExamsClient } from "@/components/app/exams/exams-client";

export default async function ExamsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [courses, exams] = await Promise.all([
    CourseService.list(userId),
    ExamService.list(userId),
  ]);

  return <ExamsClient courses={courses} exams={JSON.parse(JSON.stringify(exams))} />;
}
