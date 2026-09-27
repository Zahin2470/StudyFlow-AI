"use client";

import { motion } from "framer-motion";
import { format, isPast } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, priorityTone, statusTone, statusLabel } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api-client";

type Row = {
  id: string;
  title: string;
  dueDate: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "GRADED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  course: { code: string; color: string };
};

export function AssignmentRow({
  assignment,
  index,
  onEdit,
}: {
  assignment: Row;
  index: number;
  onEdit: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const overdue = isPast(new Date(assignment.dueDate)) && assignment.status !== "GRADED" && assignment.status !== "SUBMITTED";

  const toggleComplete = async () => {
    setBusy(true);
    try {
      await apiRequest(`/api/assignments/${assignment.id}`, {
        method: "PATCH",
        body: { status: assignment.status === "SUBMITTED" ? "IN_PROGRESS" : "SUBMITTED" },
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${assignment.title}"?`)) return;
    setBusy(true);
    await apiRequest(`/api/assignments/${assignment.id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: busy ? 0.5 : 1, x: 0 }}
      transition={{ duration: 0.18, delay: index * 0.03 }}
      className="card-flat group flex items-center gap-4 px-4 py-3"
    >
      <button
        onClick={toggleComplete}
        disabled={busy}
        aria-label="Toggle complete"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
        style={{
          borderColor: assignment.status === "SUBMITTED" ? "#5B8266" : "#A9AFBC",
          backgroundColor: assignment.status === "SUBMITTED" ? "#5B8266" : "transparent",
        }}
      >
        {assignment.status === "SUBMITTED" && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            width="10"
            height="10"
            viewBox="0 0 10 10"
          >
            <path d="M1 5l2.5 2.5L9 2" stroke="white" strokeWidth="1.5" fill="none" />
          </motion.svg>
        )}
      </button>

      <span
        className="h-8 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: assignment.course.color }}
      />

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            assignment.status === "SUBMITTED" ? "text-ink/40 line-through" : "text-ink"
          }`}
        >
          {assignment.title}
        </p>
        <p className="text-xs text-ink/50">{assignment.course.code}</p>
      </div>

      <span className={`text-xs ${overdue ? "font-medium text-red-600" : "text-ink/50"}`}>
        {format(new Date(assignment.dueDate), "MMM d")}
      </span>

      <Badge tone={priorityTone(assignment.priority)}>{assignment.priority}</Badge>
      <Badge tone={statusTone(assignment.status)}>{statusLabel(assignment.status)}</Badge>

      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button onClick={onEdit} className="rounded-full p-1.5 text-ink/40 hover:bg-paper hover:text-ink">
          <Pencil size={14} />
        </button>
        <button onClick={handleDelete} className="rounded-full p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600">
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
