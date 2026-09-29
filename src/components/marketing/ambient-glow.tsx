"use client";

import { motion } from "framer-motion";

// The one ambient, non-user-triggered motion on the page (frontend-design
// skill: "use non-user-triggered motion sparingly and deliberately"). Two
// soft, low-opacity blurred fields in the existing indigo/amber tokens —
// not a gradient wash, just enough drift to feel alive behind the hero.
export function AmbientGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-indigo/10 blur-3xl dark:bg-indigo/15"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-40 h-[22rem] w-[22rem] rounded-full bg-amber/10 blur-3xl dark:bg-amber/10"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
