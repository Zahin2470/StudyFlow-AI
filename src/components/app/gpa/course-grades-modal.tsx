"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { GradeEntryForm } from "./grade-entry-form";
import { apiRequest } from "@/lib/api-client";
import type { GradeEntryInput } from "@/lib/schemas/academic.schema";

type Entry = { id: string; label: string; score: number; maxScore: number; weight: number };

export function CourseGradesModal({
  open,
  onClose,
  courseId,
  courseName,
  entries,
}: {
  open: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  entries: Entry[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this grade entry?")) return;
    await apiRequest(`/api/grade-entries/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Grades — ${courseName}`}>
      <div className="mb-4 space-y-2">
        {entries.length === 0 ? (
          <p className="text-sm text-ink/50">No grades entered yet.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 rounded-card border border-slate-light px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{entry.label}</p>
                <p className="text-xs text-ink/50">
                  {entry.score}/{entry.maxScore} · {entry.weight}% weight
                </p>
              </div>
              <button
                onClick={() => {
                  setEditing(entry);
                  setShowForm(true);
                }}
                className="rounded-full p-1.5 text-ink/40 hover:bg-paper hover:text-ink"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                className="rounded-full p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>

      {showForm ? (
        <GradeEntryForm
          courseId={courseId}
          entryId={editing?.id}
          initial={editing as Partial<GradeEntryInput> | undefined}
          onDone={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="btn-secondary flex w-full items-center justify-center gap-1.5"
        >
          <Plus size={15} /> Add grade
        </button>
      )}
    </Modal>
  );
}
