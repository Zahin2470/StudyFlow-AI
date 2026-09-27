import { clsx } from "clsx";

const tones = {
  neutral: "bg-slate-light text-ink/70",
  indigo: "bg-indigo/10 text-indigo",
  amber: "bg-amber/15 text-amber",
  sage: "bg-sage/15 text-sage",
  danger: "bg-red-100 text-red-700",
} as const;

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

// Domain-specific mappings so callers don't repeat this logic everywhere.
export function priorityTone(priority: "LOW" | "MEDIUM" | "HIGH") {
  return { LOW: "neutral", MEDIUM: "indigo", HIGH: "amber" }[priority] as keyof typeof tones;
}

export function statusTone(status: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "GRADED") {
  return {
    NOT_STARTED: "neutral",
    IN_PROGRESS: "indigo",
    SUBMITTED: "sage",
    GRADED: "sage",
  }[status] as keyof typeof tones;
}

export function statusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
