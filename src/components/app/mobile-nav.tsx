"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard, BookOpen, ListChecks, MoreHorizontal } from "lucide-react";

// Bottom nav for mobile (brief §7) — only the three live sections plus a
// "More" affordance pointing back to the sidebar's full list on desktop-width.
const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/assignments", label: "Tasks", icon: ListChecks },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-light bg-white lg:hidden">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs",
              active ? "text-indigo" : "text-ink/50"
            )}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
      <div className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs text-ink/30">
        <MoreHorizontal size={20} />
        More
      </div>
    </nav>
  );
}
