"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock, Sparkles } from "lucide-react";
import { format } from "date-fns";
import type { StudyPlanSuggestion } from "@/lib/schemas/ai.schema";

type Course = { id: string; code: string; color: string };

export function StudyPlanPanel({ aiAvailable, courses }: { aiAvailable: boolean; courses: Course[] }) {
  const router = useRouter();
  const [plan, setPlan] = useState<StudyPlanSuggestion["sessions"]>([]);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const courseMap = new Map(courses.map((c) => [c.id, c]));

  const generate = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/ai/study-plan/generate", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? "Couldn't generate a plan.");
      setPlan(json.sessions);
      setChecked(new Set(json.sessions.map((_: unknown, i: number) => i)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const approve = async () => {
    setSaving(true);
    setError(null);
    try {
      const selected = plan.filter((_, i) => checked.has(i));
      const res = await fetch("/api/ai/study-plan/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessions: selected }),
      });
      if (!res.ok) throw new Error("Couldn't save the plan.");
      setSaved(true);
      setPlan([]);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-elevated p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">AI Study Plan</h2>
        <button
          onClick={generate}
          disabled={!aiAvailable || loading}
          className="btn-secondary flex items-center gap-1.5 text-sm disabled:opacity-40"
        >
          <Sparkles size={14} /> {loading ? "Thinking…" : "Generate"}
        </button>
      </div>

      {!aiAvailable && (
        <p className="text-sm text-ink/50">Configure an AI provider to generate a plan.</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-sage">Added to your planner.</p>}

      {plan.length > 0 && (
        <>
          <div className="space-y-2">
            <AnimatePresence>
              {plan.map((s, i) => {
                const course = courseMap.get(s.courseId);
                return (
                  <motion.label
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex cursor-pointer items-start gap-3 rounded-card border border-slate-light p-3"
                  >
                    <input
                      type="checkbox"
                      checked={checked.has(i)}
                      onChange={() => toggle(i)}
                      className="mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: course?.color ?? "#A9AFBC" }} />
                        <span className="text-sm font-medium text-ink">{course?.code ?? "Course"}</span>
                        <span className="flex items-center gap-1 text-xs text-ink/50">
                          <CalendarClock size={11} />
                          {format(new Date(s.date), "MMM d")} · {s.startTime} · {s.durationMin}min
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-ink/60">{s.reason}</p>
                    </div>
                  </motion.label>
                );
              })}
            </AnimatePresence>
          </div>
          <button
            onClick={approve}
            disabled={saving || checked.size === 0}
            className="btn-primary mt-4 w-full"
          >
            {saving ? "Adding…" : `Add ${checked.size} to Planner`}
          </button>
        </>
      )}
    </div>
  );
}
