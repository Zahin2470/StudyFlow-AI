"use client";

import { useMemo, useState } from "react";
import { ListChecks, Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/app/page-header";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { AssignmentRow } from "./assignment-row";
import { AssignmentForm } from "./assignment-form";
import type { AssignmentInput } from "@/lib/schemas/academic.schema";

type Course = { id: string; code: string; name: string; color: string };
type Assignment = {
  id: string;
  title: string;
  dueDate: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "GRADED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  courseId: string;
  course: { code: string; color: string };
};

export function AssignmentsClient({
  courses,
  assignments,
}: {
  courses: Course[];
  assignments: Assignment[];
}) {
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Assignment | null>(null);

  const filtered = useMemo(
    () => (courseFilter === "all" ? assignments : assignments.filter((a) => a.courseId === courseFilter)),
    [assignments, courseFilter]
  );

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Add a course first"
        description="Assignments belong to a course — head to Courses and add one, then come back here."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Assignments"
        subtitle={`${filtered.length} assignment${filtered.length === 1 ? "" : "s"}`}
        action={
          <button className="btn-primary flex items-center gap-1.5" onClick={() => setModal("add")}>
            <Plus size={16} /> Add Assignment
          </button>
        }
      />

      <select
        className="input-field mb-6 w-56"
        value={courseFilter}
        onChange={(e) => setCourseFilter(e.target.value)}
      >
        <option value="all">All courses</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.code}
          </option>
        ))}
      </select>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Nothing here yet"
          description="Add an assignment to start tracking it toward its due date."
          action={
            <button className="btn-primary" onClick={() => setModal("add")}>
              Add assignment
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {filtered.map((a, i) => (
              <AssignmentRow
                key={a.id}
                assignment={a}
                index={i}
                onEdit={() => {
                  setEditing(a);
                  setModal("edit");
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal open={modal === "add"} onClose={() => setModal(null)} title="Add assignment">
        <AssignmentForm courses={courses} onDone={() => setModal(null)} />
      </Modal>

      <Modal open={modal === "edit"} onClose={() => setModal(null)} title="Edit assignment">
        {editing && (
          <AssignmentForm
            courses={courses}
            assignmentId={editing.id}
            initial={editing as unknown as Partial<AssignmentInput>}
            onDone={() => setModal(null)}
          />
        )}
      </Modal>
    </>
  );
}
