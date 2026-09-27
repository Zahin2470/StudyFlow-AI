"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/lib/api-client";

type CourseCardData = {
  id: string;
  code: string;
  name: string;
  instructor: string | null;
  credits: number;
  color: string;
};

export function CourseCard({
  course,
  index,
  onEdit,
}: {
  course: CourseCardData;
  index: number;
  onEdit: () => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete ${course.code}? This also removes its assignments and exams.`)) return;
    setDeleting(true);
    try {
      await apiRequest(`/api/courses/${course.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: deleting ? 0.4 : 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="card-flat group relative overflow-hidden p-5"
    >
      <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: course.color }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">{course.code}</p>
          <h3 className="mt-0.5 font-display text-base font-semibold text-ink">{course.name}</h3>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={onEdit} className="rounded-full p-1.5 text-ink/40 hover:bg-paper hover:text-ink">
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="rounded-full p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 text-xs text-ink/50">
        {course.instructor && (
          <span className="flex items-center gap-1">
            <User size={12} /> {course.instructor}
          </span>
        )}
        <span>{course.credits} credits</span>
      </div>
    </motion.div>
  );
}
