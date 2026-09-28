"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { CourseGradesModal } from "./course-grades-modal";

type CourseSummary = {
  id: string;
  code: string;
  name: string;
  credits: number;
  color: string;
  summary: { percentage: number; points: number; letter: string; weightGraded: number } | null;
  gradeEntries: { id: string; label: string; score: number; maxScore: number; weight: number }[];
};

type SemesterBreakdown = {
  id: string;
  name: string;
  isActive: boolean;
  courses: CourseSummary[];
  gpa: number | null;
};

export function GpaClient({
  semesters,
  cumulativeGpa,
}: {
  semesters: SemesterBreakdown[];
  cumulativeGpa: number | null;
}) {
  const activeSemester = semesters.find((s) => s.isActive) ?? semesters[0];
  const [selectedId, setSelectedId] = useState(activeSemester?.id);
  const [openCourse, setOpenCourse] = useState<CourseSummary | null>(null);

  if (semesters.length === 0 || semesters.every((s) => s.courses.length === 0)) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="No courses to grade yet"
        description="Once you've added courses, come back here to log grades and see your GPA calculated automatically."
      />
    );
  }

  const selected = semesters.find((s) => s.id === selectedId) ?? semesters[0];

  return (
    <>
      <PageHeader title="GPA & Grades" subtitle="Calculated live from the grades you've entered — nothing here is typed in by hand." />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="card-elevated p-6"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-ink/50">Cumulative GPA</p>
          <p className="mt-1 font-display text-4xl font-semibold text-ink">
            {cumulativeGpa != null ? cumulativeGpa.toFixed(2) : "—"}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.06 }}
          className="card-flat p-6"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{selected.name} GPA</p>
          <p className="mt-1 font-display text-4xl font-semibold text-ink">
            {selected.gpa != null ? selected.gpa.toFixed(2) : "—"}
          </p>
        </motion.div>
      </div>

      {semesters.length > 1 && (
        <select className="input-field mb-6 w-56" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      )}

      <div className="space-y-2">
        {selected.courses.map((course, i) => (
          <motion.button
            key={course.id}
            onClick={() => setOpenCourse(course)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.18 }}
            className="card-flat flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-paper"
          >
            <span className="h-9 w-1 shrink-0 rounded-full" style={{ backgroundColor: course.color }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {course.code} — {course.name}
              </p>
              <p className="text-xs text-ink/50">{course.credits} credits</p>
            </div>
            {course.summary ? (
              <>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-light">
                  <div
                    className="h-full rounded-full bg-indigo"
                    style={{ width: `${Math.min(course.summary.percentage, 100)}%` }}
                  />
                </div>
                <span className="w-14 text-right text-sm font-medium text-ink">
                  {course.summary.percentage.toFixed(0)}%
                </span>
                <span className="w-10 text-right text-sm text-ink/60">{course.summary.letter}</span>
              </>
            ) : (
              <span className="text-xs text-ink/40">No grades yet</span>
            )}
          </motion.button>
        ))}
      </div>

      {openCourse && (
        <CourseGradesModal
          open={!!openCourse}
          onClose={() => setOpenCourse(null)}
          courseId={openCourse.id}
          courseName={`${openCourse.code} — ${openCourse.name}`}
          entries={openCourse.gradeEntries}
        />
      )}
    </>
  );
}
