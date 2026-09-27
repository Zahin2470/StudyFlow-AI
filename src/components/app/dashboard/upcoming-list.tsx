"use client";

import { motion } from "framer-motion";
import { format, isToday, isTomorrow } from "date-fns";
import { Badge, priorityTone } from "@/components/ui/badge";

type Item = {
  id: string;
  title: string;
  date: string;
  kind: "assignment" | "exam";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  courseCode: string;
  courseColor: string;
};

function friendlyDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEE, MMM d");
}

// The dashboard's one deliberate reveal — items stagger in on load, then sit
// still. See ARCHITECTURE.md §7: motion spent on a few real moments, not
// sprinkled everywhere.
export function UpcomingList({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink/50">
        Nothing due in the next two weeks. Enjoy the calm.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
          className="flex items-center gap-3 rounded-card px-3 py-2.5 hover:bg-paper"
        >
          <span className="h-8 w-1 shrink-0 rounded-full" style={{ backgroundColor: item.courseColor }} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{item.title}</p>
            <p className="text-xs text-ink/50">
              {item.courseCode} · {item.kind === "exam" ? "Exam" : "Assignment"}
            </p>
          </div>
          <span className="shrink-0 text-xs text-ink/50">{friendlyDate(item.date)}</span>
          {item.priority && <Badge tone={priorityTone(item.priority)}>{item.priority}</Badge>}
        </motion.div>
      ))}
    </div>
  );
}
