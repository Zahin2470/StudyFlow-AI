"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/demo";

const DEMO_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DEMO !== "false";

// The one signature interactive moment on the page (frontend-design skill:
// "spend your boldness in one place"). A stylized echo of the real
// dashboard — same tokens, same card language — not a generic browser
// mockup. Tilts toward the cursor, and is itself a real entry point into
// the live demo, not just decoration.
export function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 10);
    rotateX.set(py * -10);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
  };

  const enterDemo = async () => {
    if (!DEMO_ENABLED) return;
    setLoading(true);
    await signIn("credentials", { email: DEMO_EMAIL, password: DEMO_PASSWORD, callbackUrl: "/dashboard" });
  };

  const barHeights = [40, 65, 50, 80, 60, 90, 45];

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={reset}
      onClick={enterDemo}
      role="button"
      aria-label="Explore the live demo"
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="card-elevated relative mx-auto w-full max-w-xl cursor-pointer p-5"
    >
      <motion.div
        animate={{ opacity: hovered && DEMO_ENABLED ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 z-10 flex items-center justify-center rounded-card bg-ink/60 backdrop-blur-[2px]"
      >
        <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink">
          <PlayCircle size={16} className="text-indigo" />
          {loading ? "Loading demo…" : "Click to explore live"}
        </span>
      </motion.div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-display text-sm font-semibold text-ink">Good to see you, Amara.</p>
          <p className="text-xs text-ink/50">Here&apos;s where things stand.</p>
        </div>
        <span className="rounded-full bg-sage/15 px-2.5 py-1 text-xs font-medium text-sage">GPA 3.74</span>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2.5">
        {[
          { label: "Courses", value: "5" },
          { label: "Pending", value: "8" },
          { label: "Due this week", value: "3" },
        ].map((stat) => (
          <div key={stat.label} className="card-flat p-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-ink/40">{stat.label}</p>
            <p className="mt-1 font-display text-lg font-semibold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-3">
        <div className="card-flat col-span-3 p-3.5">
          <p className="mb-2.5 text-xs font-medium text-ink/60">Today&apos;s Focus</p>
          <div className="space-y-2">
            {[
              { label: "Database ER diagram", tag: "CSE311", done: true },
              { label: "Algorithms problem set", tag: "CSE221", done: false },
              { label: "Midterm review session", tag: "CSE311", done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <CheckCircle2
                  size={13}
                  className={item.done ? "text-sage" : "text-slate"}
                  fill={item.done ? "currentColor" : "none"}
                />
                <span className={`flex-1 truncate text-xs ${item.done ? "text-ink/40 line-through" : "text-ink/80"}`}>
                  {item.label}
                </span>
                <span className="shrink-0 text-[10px] text-ink/40">{item.tag}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card-flat col-span-2 flex items-end justify-between gap-1 p-3.5">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="w-full rounded-sm bg-indigo/70"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
