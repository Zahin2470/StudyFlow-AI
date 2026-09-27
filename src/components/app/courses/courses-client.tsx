"use client";

import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { CourseCard } from "./course-card";
import { CourseForm } from "./course-form";
import { SemesterForm } from "./semester-form";
import type { CourseInput } from "@/lib/schemas/academic.schema";

type Semester = { id: string; name: string; isActive: boolean };
type Course = {
  id: string;
  code: string;
  name: string;
  instructor: string | null;
  credits: number;
  color: string;
  semesterId: string;
};

export function CoursesClient({
  semesters,
  courses,
}: {
  semesters: Semester[];
  courses: Course[];
}) {
  const activeSemester = semesters.find((s) => s.isActive) ?? semesters[0];
  const [selectedSemesterId, setSelectedSemesterId] = useState(activeSemester?.id);
  const [modal, setModal] = useState<"add-semester" | "add-course" | "edit-course" | null>(null);
  const [editing, setEditing] = useState<Course | null>(null);

  // No semester yet — nothing else on this page can exist without one.
  if (semesters.length === 0) {
    return (
      <>
        <PageHeader title="Courses" subtitle="Set up a semester to start adding courses." />
        <EmptyState
          icon={BookOpen}
          title="Create your first semester"
          description="Courses, assignments, and exams all belong to a semester — start there."
          action={
            <button className="btn-primary" onClick={() => setModal("add-semester")}>
              Create semester
            </button>
          }
        />
        <Modal open={modal === "add-semester"} onClose={() => setModal(null)} title="New semester">
          <SemesterForm onDone={() => setModal(null)} />
        </Modal>
      </>
    );
  }

  const visibleCourses = courses.filter((c) => c.semesterId === selectedSemesterId);

  return (
    <>
      <PageHeader
        title="Courses"
        subtitle={`${visibleCourses.length} course${visibleCourses.length === 1 ? "" : "s"} this semester`}
        action={
          <button className="btn-primary flex items-center gap-1.5" onClick={() => setModal("add-course")}>
            <Plus size={16} /> Add Course
          </button>
        }
      />

      {semesters.length > 1 && (
        <select
          className="input-field mb-6 w-56"
          value={selectedSemesterId}
          onChange={(e) => setSelectedSemesterId(e.target.value)}
        >
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      )}

      {visibleCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Add the courses you're taking this semester to start tracking assignments and exams."
          action={
            <button className="btn-primary" onClick={() => setModal("add-course")}>
              Add your first course
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCourses.map((course, i) => (
            <CourseCard
              key={course.id}
              course={course}
              index={i}
              onEdit={() => {
                setEditing(course);
                setModal("edit-course");
              }}
            />
          ))}
        </div>
      )}

      <Modal open={modal === "add-course"} onClose={() => setModal(null)} title="Add course">
        <CourseForm semesterId={selectedSemesterId!} onDone={() => setModal(null)} />
      </Modal>

      <Modal open={modal === "edit-course"} onClose={() => setModal(null)} title="Edit course">
        {editing && (
          <CourseForm
            semesterId={editing.semesterId}
            courseId={editing.id}
            initial={editing as Partial<CourseInput>}
            onDone={() => setModal(null)}
          />
        )}
      </Modal>
    </>
  );
}
