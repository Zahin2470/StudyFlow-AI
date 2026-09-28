import { auth } from "@/server/auth";
import { AssignmentService } from "@/server/services/assignment.service";
import { ExamService } from "@/server/services/exam.service";
import { StudySessionService } from "@/server/services/study-session.service";
import { PageHeader } from "@/components/app/page-header";
import { MonthCalendar } from "@/components/app/calendar/month-calendar";

export default async function CalendarPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [assignments, exams, sessions] = await Promise.all([
    AssignmentService.list(userId),
    ExamService.list(userId),
    StudySessionService.list(userId),
  ]);

  const events = [
    ...assignments.map((a) => ({
      id: `a-${a.id}`,
      title: a.title,
      date: a.dueDate.toISOString(),
      kind: "assignment" as const,
      priority: a.priority,
      courseCode: a.course.code,
      courseColor: a.course.color,
    })),
    ...exams.map((e) => ({
      id: `e-${e.id}`,
      title: e.title,
      date: e.examDate.toISOString(),
      kind: "exam" as const,
      courseCode: e.course.code,
      courseColor: e.course.color,
    })),
    ...sessions.map((s) => ({
      id: `s-${s.id}`,
      title: s.title ?? "Study session",
      date: s.scheduledStart.toISOString(),
      kind: "session" as const,
      courseCode: s.course?.code ?? "General",
      courseColor: s.course?.color ?? "#A9AFBC",
    })),
  ];

  return (
    <>
      <PageHeader title="Calendar" subtitle="Assignments, exams, and study sessions in one view." />
      <MonthCalendar events={events} />
    </>
  );
}
