"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function MarketingNav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-light/60 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-display text-xl font-semibold text-ink">StudyFlow</span>
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-2 text-sm text-ink/70 hover:text-ink">
            Log in
          </Link>
          <ThemeToggle />
          <Link href="/register" className="btn-primary">
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
