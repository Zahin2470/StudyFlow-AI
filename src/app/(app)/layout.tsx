import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

// Minimal authenticated shell for Phase 1 — just proves the session is real.
// Sidebar/header chrome and dashboard widgets are Phase 3 (see ARCHITECTURE.md §12).
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-slate-light bg-white px-6 py-4">
        <span className="font-display text-lg font-semibold text-ink">StudyFlow</span>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
