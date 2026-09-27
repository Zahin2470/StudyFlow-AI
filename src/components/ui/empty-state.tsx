import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card-flat flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-indigo/10 p-3 text-indigo">
        <Icon size={22} />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink/60">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
