"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, ListChecks, GraduationCap, StickyNote, FileText } from "lucide-react";
import type { SearchResult } from "@/server/services/search.service";

const ICONS = {
  course: BookOpen,
  assignment: ListChecks,
  exam: GraduationCap,
  note: StickyNote,
  document: FileText,
} as const;

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) setResults(await res.json());
    }, 250); // debounce so every keystroke doesn't fire a query
    return () => clearTimeout(timeout);
  }, [query]);

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-xs" ref={ref}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
      <input
        className="input-field pl-9"
        placeholder="Search courses, assignments…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && query.trim().length >= 2 && (
        <div className="card-elevated absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto py-1">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-ink/50">No matches.</p>
          ) : (
            results.map((r) => {
              const Icon = ICONS[r.type];
              return (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => go(r.href)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-paper"
                >
                  <Icon size={14} className="shrink-0 text-ink/40" />
                  <span className="truncate text-ink">{r.title}</span>
                  <span className="ml-auto shrink-0 text-xs text-ink/40">{r.subtitle}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
