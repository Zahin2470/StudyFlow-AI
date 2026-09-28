import { prisma } from "@/lib/prisma";
import { startOfWeek, subWeeks, format, differenceInMinutes } from "date-fns";
import { courseGradeSummary, creditWeightedGpa } from "@/lib/gpa";

// Every series here is computed from real rows (StudySession, GradeEntry,
// Assignment) — nothing is randomly generated or hardcoded, per the
// anti-pattern in ARCHITECTURE.md §70.

export async function weeklyStudyMinutes(userId: string, weeks = 8) {
  const since = startOfWeek(subWeeks(new Date(), weeks - 1));
  const sessions = await prisma.studySession.findMany({
    where: { userId, completed: true, scheduledStart: { gte: since } },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < weeks; i++) {
    const weekStart = startOfWeek(subWeeks(new Date(), weeks - 1 - i));
    buckets.set(format(weekStart, "MMM d"), 0);
  }

  for (const s of sessions) {
    const minutes = s.actualDurationMin ?? differenceInMinutes(s.scheduledEnd, s.scheduledStart);
    const weekKey = format(startOfWeek(s.scheduledStart), "MMM d");
    if (buckets.has(weekKey)) buckets.set(weekKey, (buckets.get(weekKey) ?? 0) + minutes);
  }

  return [...buckets.entries()].map(([week, minutes]) => ({ week, minutes }));
}

export async function gpaTrend(userId: string) {
  const semesters = await prisma.semester.findMany({
    where: { userId },
    orderBy: { startDate: "asc" },
    include: { courses: { include: { gradeEntries: true } } },
  });

  return semesters
    .map((semester) => {
      const courses = semester.courses.map((c) => ({
        credits: c.credits,
        summary: courseGradeSummary(c.gradeEntries),
      }));
      return { semester: semester.name, gpa: creditWeightedGpa(courses) };
    })
    .filter((s) => s.gpa !== null);
}

export async function assignmentCompletionByCourse(userId: string) {
  const courses = await prisma.course.findMany({
    where: { userId },
    include: { assignments: true },
  });

  return courses
    .filter((c) => c.assignments.length > 0)
    .map((c) => {
      const done = c.assignments.filter((a) => a.status === "SUBMITTED" || a.status === "GRADED").length;
      return {
        course: c.code,
        completionRate: Math.round((done / c.assignments.length) * 100),
      };
    });
}
