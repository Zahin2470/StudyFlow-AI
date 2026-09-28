"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { StickyNote, Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { NoteForm } from "./note-form";
import { apiRequest } from "@/lib/api-client";
import type { NoteInput } from "@/lib/schemas/academic.schema";

type Course = { id: string; code: string; name: string };
type Note = {
  id: string;
  title: string;
  content: string;
  courseId: string;
  updatedAt: string;
  course: { code: string; color: string };
};

export function NotesClient({ courses, notes }: { courses: Course[]; notes: Note[] }) {
  const router = useRouter();
  const [courseFilter, setCourseFilter] = useState("all");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Note | null>(null);

  const filtered = useMemo(
    () => (courseFilter === "all" ? notes : notes.filter((n) => n.courseId === courseFilter)),
    [notes, courseFilter]
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    await apiRequest(`/api/notes/${id}`, { method: "DELETE" });
    router.refresh();
  };

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={StickyNote}
        title="Add a course first"
        description="Notes belong to a course — head to Courses and add one, then come back here."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Notes"
        subtitle={`${filtered.length} note${filtered.length === 1 ? "" : "s"}`}
        action={
          <button className="btn-primary flex items-center gap-1.5" onClick={() => setModal("add")}>
            <Plus size={16} /> New Note
          </button>
        }
      />

      <select className="input-field mb-6 w-56" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
        <option value="all">All courses</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.code}
          </option>
        ))}
      </select>

      {filtered.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="No notes yet"
          description="Capture lecture notes, reading summaries, or anything worth remembering per course."
          action={
            <button className="btn-primary" onClick={() => setModal("add")}>
              Write your first note
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="card-flat group relative overflow-hidden p-5"
            >
              <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: note.course.color }} />
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink/40">{note.course.code}</p>
                  <h3 className="mt-0.5 truncate font-display text-base font-semibold text-ink">{note.title}</h3>
                </div>
                <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => {
                      setEditing(note);
                      setModal("edit");
                    }}
                    className="rounded-full p-1.5 text-ink/40 hover:bg-paper hover:text-ink"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="rounded-full p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-ink/60">{note.content || "No content yet."}</p>
              <p className="mt-3 text-xs text-ink/40">Updated {format(new Date(note.updatedAt), "MMM d")}</p>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modal === "add"} onClose={() => setModal(null)} title="New note">
        <NoteForm courses={courses} onDone={() => setModal(null)} />
      </Modal>
      <Modal open={modal === "edit"} onClose={() => setModal(null)} title="Edit note">
        {editing && (
          <NoteForm
            courses={courses}
            noteId={editing.id}
            initial={editing as unknown as Partial<NoteInput>}
            onDone={() => setModal(null)}
          />
        )}
      </Modal>
    </>
  );
}
