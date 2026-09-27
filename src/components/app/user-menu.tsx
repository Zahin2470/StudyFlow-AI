"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export function UserMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo/10 text-indigo transition-transform hover:scale-105"
        aria-label="Account menu"
      >
        <User size={16} />
      </button>
      {open && (
        <div className="card-elevated absolute right-0 mt-2 w-44 py-1">
          <div className="border-b border-slate-light px-3 py-2 text-sm font-medium text-ink">{name}</div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink/70 hover:bg-paper"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
