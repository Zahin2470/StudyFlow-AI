import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/app/sidebar";
import { MobileNav } from "@/components/app/mobile-nav";
import { UserMenu } from "@/components/app/user-menu";
import { SearchBar } from "@/components/app/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";

// Authenticated shell: sidebar (desktop) + bottom nav (mobile) + header with
// search and the account menu. Individual pages render their own PageHeader
// for the title/actions — this layout only owns the chrome that's constant
// across every authenticated route.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-slate-light bg-surface px-6 py-3">
          <SearchBar />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu name={session.user.name ?? "Student"} />
          </div>
        </header>
        <main className="flex-1 px-6 py-8 pb-24 lg:pb-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
