"use client";

import { motion } from "framer-motion";
import { format, differenceInCalendarDays } from "date-fns";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api-client";

type Exam = {
  id: string;
  title: string;
  examDate: string;
  location: string | null;
  weight: number | null;
  course: { code: string; color: string };
};

export function ExamRow({ exam, index, onEdit }: { exam: Exam; index: number; onEdit: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const daysAway = differenceInCalendarDays(new Date(exam.examDate), new Date());

  const handleDelete = async () => {
    if (!confirm(`Delete "${exam.title}"?`)) return;
    setBusy(true);
    await apiRequest(`/api/exams/${exam.id}`, { method: "DELETE" });
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
      <span className="h-9 w-1 shrink-0 rounded-full" style={{ backgroundColor: exam.course.color }} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{exam.title}</p>
        <div className="flex items-center gap-2 text-xs text-ink/50">
          <span>{exam.course.code}</span>
          {exam.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {exam.location}
            </span>
          )}
        </div>
      </div>
      {exam.weight != null && <Badge tone="indigo">{exam.weight}%</Badge>}
      <Badge tone={daysAway <= 3 ? "amber" : "neutral"}>
        {daysAway === 0 ? "Today" : daysAway > 0 ? `In ${daysAway}d` : "Past"}
      </Badge>
      <span className="w-20 shrink-0 text-right text-xs text-ink/50">
        {format(new Date(exam.examDate), "MMM d")}
      </span>
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
