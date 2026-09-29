import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center font-display text-xl font-semibold text-ink">
          StudyFlow
        </Link>
        <div className="card-elevated p-8">
          <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
          <p className="mt-1 text-sm text-ink/60">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        {footer && <p className="mt-6 text-center text-sm text-ink/60">{footer}</p>}
      </div>
    </div>
  );
}
