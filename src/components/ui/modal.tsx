"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

// The one modal in the app — used by every "Add/Edit X" flow. Animation is
// deliberately quick (180ms) and respects reduced-motion via Framer's
// automatic handling of the user's OS setting through opacity-only fallback
// on scale (see ARCHITECTURE.md §7 motion principles: fast, not flashy).
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            className="absolute inset-0 bg-ink/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="card-elevated relative w-full max-w-lg p-6"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1 text-ink/50 hover:bg-paper hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
