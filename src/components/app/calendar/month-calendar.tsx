"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge, priorityTone } from "@/components/ui/badge";

type CalEvent = {
  id: string;
  title: string;
  date: string;
  kind: "assignment" | "exam" | "session";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  courseCode: string;
  courseColor: string;
};

const KIND_LABEL = { assignment: "Assignment", exam: "Exam", session: "Study session" } as const;

export function MonthCalendar({ events }: { events: CalEvent[] }) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<Date>(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalEvent[]>();
    for (const e of events) {
      const key = format(new Date(e.date), "yyyy-MM-dd");
      map.set(key, [...(map.get(key) ?? []), e]);
    }
    return map;
  }, [events]);

  const selectedEvents = eventsByDay.get(format(selected, "yyyy-MM-dd")) ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="card-flat p-5 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">{format(cursor, "MMMM yyyy")}</h2>
          <div className="flex gap-1">
            <button
              onClick={() => setCursor((c) => subMonths(c, 1))}
              className="rounded-full p-1.5 text-ink/50 hover:bg-paper hover:text-ink"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCursor((c) => addMonths(c, 1))}
              className="rounded-full p-1.5 text-ink/50 hover:bg-paper hover:text-ink"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink/40">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDay.get(key) ?? [];
            const inMonth = isSameMonth(day, cursor);
            const isSelected = isSameDay(day, selected);

            return (
              <button
                key={key}
                onClick={() => setSelected(day)}
                className={`flex h-16 flex-col items-center rounded-card border p-1.5 text-left transition-colors ${
                  isSelected
                    ? "border-indigo bg-indigo/5"
                    : "border-transparent hover:bg-paper"
                } ${!inMonth ? "opacity-30" : ""}`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                    isToday(day) ? "bg-indigo text-white" : "text-ink/70"
                  }`}
                >
                  {format(day, "d")}
                </span>
                <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: e.courseColor }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card-elevated p-5">
        <h3 className="mb-3 font-display text-base font-semibold text-ink">
          {format(selected, "EEEE, MMM d")}
        </h3>
        {selectedEvents.length === 0 ? (
          <p className="text-sm text-ink/50">Nothing scheduled.</p>
        ) : (
          <div className="space-y-2">
            {selectedEvents.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.15 }}
                className="rounded-card border border-slate-light p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">{e.title}</span>
                  {e.priority && <Badge tone={priorityTone(e.priority)}>{e.priority}</Badge>}
                </div>
                <p className="mt-0.5 text-xs text-ink/50">
                  {e.courseCode} · {KIND_LABEL[e.kind]}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
