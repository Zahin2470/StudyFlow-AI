"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  index,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="card-flat p-5"
    >
      <div className="flex items-center gap-2 text-ink/50">
        <Icon size={16} />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-display text-3xl font-semibold text-ink">{value}</p>
    </motion.div>
  );
}
