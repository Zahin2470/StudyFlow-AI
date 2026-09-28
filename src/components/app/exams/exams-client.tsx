"use client";

import { useState } from "react";
import { GraduationCap, Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/app/page-header";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { ExamRow } from "./exam-row";
import { ExamForm } from "./exam-form";
import type { ExamInput } from "@/lib/schemas/academic.schema";

type Course = { id: string; code: string; name: string };
type Exam = {
  id: string;
  title: string;
  examDate: string;
  location: string | null;
  weight: number | null;
  courseId: string;
  course: { code: string; color: string };
};

export function ExamsClient({ courses, exams }: { courses: Course[]; exams: Exam[] }) {
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Exam | null>(null);

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="Add a course first"
        description="Exams belong to a course — head to Courses and add one, then come back here."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Exams"
        subtitle={`${exams.length} upcoming or past exam${exams.length === 1 ? "" : "s"}`}
        action={
          <button className="btn-primary flex items-center gap-1.5" onClick={() => setModal("add")}>
            <Plus size={16} /> Add Exam
          </button>
        }
      />

      {exams.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No exams scheduled"
          description="Add an exam date so it shows up on your dashboard and calendar."
          action={
            <button className="btn-primary" onClick={() => setModal("add")}>
              Add exam
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {exams.map((exam, i) => (
              <ExamRow
                key={exam.id}
                exam={exam}
                index={i}
                onEdit={() => {
                  setEditing(exam);
                  setModal("edit");
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal open={modal === "add"} onClose={() => setModal(null)} title="Add exam">
        <ExamForm courses={courses} onDone={() => setModal(null)} />
      </Modal>
      <Modal open={modal === "edit"} onClose={() => setModal(null)} title="Edit exam">
        {editing && (
          <ExamForm
            courses={courses}
            examId={editing.id}
            initial={editing as unknown as Partial<ExamInput>}
            onDone={() => setModal(null)}
          />
        )}
      </Modal>
    </>
  );
}
