"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow } from "date-fns";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";

type Session = {
  id: string;
  title: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  completed: boolean;
  course: { code: string; color: string } | null;
};

function dayLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEEE, MMM d");
}

export function SessionList({ sessions }: { sessions: Session[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, Session[]>();
    for (const s of sessions) {
      const key = format(new Date(s.scheduledStart), "yyyy-MM-dd");
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [sessions]);

  const toggleComplete = async (s: Session) => {
    setBusyId(s.id);
    try {
      await apiRequest(`/api/study-sessions/${s.id}`, {
        method: "PATCH",
        body: { completed: !s.completed },
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this study session?")) return;
    setBusyId(id);
    await apiRequest(`/api/study-sessions/${id}`, { method: "DELETE" });
    router.refresh();
  };

  if (sessions.length === 0) {
    return <p className="py-10 text-center text-sm text-ink/50">No study sessions scheduled yet.</p>;
  }

  return (
    <div className="space-y-6">
      {grouped.map(([key, group]) => (
        <div key={key}>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink/40">
            {dayLabel(group[0].scheduledStart)}
          </h4>
          <div className="space-y-2">
            {group.map((s, i) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: busyId === s.id ? 0.5 : 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.15 }}
                className="card-flat flex items-center gap-3 px-4 py-3"
              >
                <button
                  onClick={() => toggleComplete(s)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                  style={{
                    borderColor: s.completed ? "#5B8266" : "#A9AFBC",
                    backgroundColor: s.completed ? "#5B8266" : "transparent",
                  }}
                  aria-label="Toggle complete"
                >
                  {s.completed && (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M1 5l2.5 2.5L9 2" stroke="white" strokeWidth="1.5" fill="none" />
                    </svg>
                  )}
                </button>
                <span
                  className="h-8 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: s.course?.color ?? "#A9AFBC" }}
                />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${s.completed ? "text-ink/40 line-through" : "text-ink"}`}>
                    {s.title || "Study session"}
                  </p>
                  <p className="text-xs text-ink/50">
                    {format(new Date(s.scheduledStart), "h:mm a")} – {format(new Date(s.scheduledEnd), "h:mm a")}
                    {s.course && ` · ${s.course.code}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="rounded-full p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
