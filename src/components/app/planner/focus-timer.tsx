"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";

type CourseOption = { id: string; code: string; name: string };
const PRESETS = [25, 45, 60];
const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// A real countdown timer, not a decorative widget — finishing it (or
// stopping early) offers to log the actual elapsed time as a StudySession,
// so "Study Timer" in the brief produces real data instead of a toy.
export function FocusTimer({ courses }: { courses: CourseOption[] }) {
  const router = useRouter();
  const [presetMin, setPresetMin] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [courseId, setCourseId] = useState("");
  const [saved, setSaved] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const totalSeconds = presetMin * 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const elapsedMin = Math.round((totalSeconds - secondsLeft) / 60);

  const start = () => {
    if (!startedAt) setStartedAt(new Date());
    setRunning(true);
    setSaved(false);
  };

  const reset = (min = presetMin) => {
    setRunning(false);
    setPresetMin(min);
    setSecondsLeft(min * 60);
    setStartedAt(null);
    setSaved(false);
  };

  const saveSession = async () => {
    if (!startedAt || elapsedMin === 0) return;
    const now = new Date();
    await apiRequest("/api/study-sessions", {
      method: "POST",
      body: {
        courseId: courseId || undefined,
        title: "Focus session",
        scheduledStart: startedAt.toISOString(),
        scheduledEnd: now.toISOString(),
        completed: true,
        actualDurationMin: elapsedMin,
      },
    });
    setSaved(true);
    router.refresh();
    reset();
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="card-elevated p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">Study Timer</h2>

      <div className="flex flex-col items-center">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgb(var(--color-slate-light))" strokeWidth="8" />
            <motion.circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke="#3454D1"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - progress) }}
              transition={{ duration: 0.3, ease: "linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-display text-2xl font-semibold text-ink">
            {mm}:{ss}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {PRESETS.map((min) => (
            <button
              key={min}
              onClick={() => reset(min)}
              disabled={running}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                presetMin === min ? "bg-indigo text-white" : "bg-paper text-ink/60"
              }`}
            >
              {min}m
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button onClick={() => reset(presetMin)} className="rounded-full p-2 text-ink/50 hover:bg-paper">
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => (running ? setRunning(false) : start())}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo text-white hover:bg-indigo-hover"
          >
            {running ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>
        </div>

        {elapsedMin > 0 && !running && (
          <div className="mt-5 w-full space-y-2 border-t border-slate-light pt-4">
            <select className="input-field" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="">No specific course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}
                </option>
              ))}
            </select>
            <button onClick={saveSession} className="btn-secondary w-full text-sm">
              {saved ? "Saved!" : `Log ${elapsedMin} min as a study session`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
