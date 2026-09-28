import { auth } from "@/server/auth";
import { BookOpen, ListChecks, GraduationCap, Flame, Award } from "lucide-react";
import { CourseService } from "@/server/services/course.service";
import { AssignmentService } from "@/server/services/assignment.service";
import { ExamService } from "@/server/services/exam.service";
import { GradeService } from "@/server/services/grade.service";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/dashboard/stat-card";
import { UpcomingList } from "@/components/app/dashboard/upcoming-list";
import { StatusChart } from "@/components/app/dashboard/status-chart";

// Every number here comes from a real query — no placeholder charts, no
// fake streaks. The AI insight card is Phase 7 and is simply absent from
// this page until it exists (see ARCHITECTURE.md §12/§70).
export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const firstName = session!.user.name?.split(" ")[0] ?? "there";

  const [courses, assignments, exams, gpaBreakdown] = await Promise.all([
    CourseService.list(userId),
    AssignmentService.list(userId),
    ExamService.list(userId),
    GradeService.getGpaBreakdown(userId),
  ]);

  const pendingAssignments = assignments.filter((a) => a.status !== "SUBMITTED" && a.status !== "GRADED");
  const twoWeeksOut = new Date();
  twoWeeksOut.setDate(twoWeeksOut.getDate() + 14);

  const upcoming = [
    ...assignments
      .filter((a) => a.dueDate <= twoWeeksOut && a.status !== "SUBMITTED" && a.status !== "GRADED")
      .map((a) => ({
        id: a.id,
        title: a.title,
        date: a.dueDate.toISOString(),
        kind: "assignment" as const,
        priority: a.priority,
        courseCode: a.course.code,
        courseColor: a.course.color,
      })),
    ...exams
      .filter((e) => e.examDate <= twoWeeksOut)
      .map((e) => ({
        id: e.id,
        title: e.title,
        date: e.examDate.toISOString(),
        kind: "exam" as const,
        courseCode: e.course.code,
        courseColor: e.course.color,
      })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const statusCounts = {
    "Not started": assignments.filter((a) => a.status === "NOT_STARTED").length,
    "In progress": assignments.filter((a) => a.status === "IN_PROGRESS").length,
    Submitted: assignments.filter((a) => a.status === "SUBMITTED").length,
    Graded: assignments.filter((a) => a.status === "GRADED").length,
  };

  return (
    <>
      <PageHeader title={`Good to see you, ${firstName}.`} subtitle="Here's where things stand." />

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={BookOpen} label="Courses" value={courses.length} index={0} />
        <StatCard icon={ListChecks} label="Pending" value={pendingAssignments.length} index={1} />
        <StatCard icon={GraduationCap} label="Upcoming exams" value={exams.length} index={2} />
        <StatCard
          icon={Award}
          label="GPA"
          value={gpaBreakdown.cumulativeGpa != null ? gpaBreakdown.cumulativeGpa.toFixed(2) : "—"}
          index={3}
        />
        <StatCard icon={Flame} label="Due this week" value={upcoming.filter((u) => {
          const days = (new Date(u.date).getTime() - Date.now()) / 86_400_000;
          return days <= 7;
        }).length} index={4} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card-elevated p-6 lg:col-span-3">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">Today&apos;s Focus</h2>
          <UpcomingList items={upcoming.slice(0, 6)} />
        </div>
        <div className="card-flat p-6 lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">Assignment Status</h2>
          <StatusChart data={Object.entries(statusCounts).map(([name, value]) => ({ name, value }))} />
        </div>
      </div>
    </>
  );
}
