import { auth } from "@/server/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="card-flat p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Good to see you, {session?.user?.name?.split(" ")[0]}.
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        Auth is wired up end to end. Courses, assignments, today&apos;s focus and the rest of the
        dashboard land in Phase 3, once the academic data model from Phase 2 exists.
      </p>
    </div>
  );
}
