"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  BookOpen,
  ListChecks,
  CalendarClock,
  CalendarDays,
  GraduationCap,
  StickyNote,
  FileText,
  Award,
  BarChart3,
  Users,
  Sparkles,
} from "lucide-react";

// Full nav from the brief (§8) is shown for orientation, but only the items
// with a real destination are clickable — the rest carry a "Soon" tag
// instead of linking to a page that doesn't exist yet (anti-pattern §70:
// no fake frontend functionality not connected to a backend).
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, live: true },
  { href: "/courses", label: "My Courses", icon: BookOpen, live: true },
  { href: "/assignments", label: "Assignments", icon: ListChecks, live: true },
  { href: "/planner", label: "Study Planner", icon: CalendarClock, live: true },
  { href: "/calendar", label: "Calendar", icon: CalendarDays, live: true },
  { href: "/exams", label: "Exams", icon: GraduationCap, live: true },
  { href: "/notes", label: "Notes", icon: StickyNote, live: true },
  { href: "/documents", label: "Documents", icon: FileText, live: true },
  { href: "/gpa", label: "GPA & Grades", icon: Award, live: true },
  { href: "/analytics", label: "Analytics", icon: BarChart3, live: true },
  { href: "/groups", label: "Study Groups", icon: Users, live: false },
  { href: "/assistant", label: "AI Assistant", icon: Sparkles, live: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-light bg-white lg:flex lg:flex-col">
      <div className="px-6 py-6">
        <Link href="/dashboard" className="font-display text-xl font-semibold text-ink">
          StudyFlow
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ href, label, icon: Icon, live }) => {
          const active = live && pathname.startsWith(href);
          const content = (
            <span
              className={clsx(
                "flex items-center justify-between rounded-card px-3 py-2 text-sm transition-colors",
                active && "bg-indigo/10 font-medium text-indigo",
                !active && live && "text-ink/70 hover:bg-paper hover:text-ink",
                !live && "text-ink/30"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon size={17} />
                {label}
              </span>
              {!live && (
                <span className="rounded-full bg-slate-light px-1.5 py-0.5 text-[10px] font-medium text-ink/40">
                  Soon
                </span>
              )}
            </span>
          );

          return live ? (
            <Link key={href} href={href}>
              {content}
            </Link>
          ) : (
            <div key={href} className="cursor-not-allowed" aria-disabled title="Coming in a later phase">
              {content}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
