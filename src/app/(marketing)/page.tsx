import Link from "next/link";

// Phase 1 scope: hero + nav only, enough to establish the visual identity
// and give the auth flow somewhere to start from. Features/How it works/
// Pricing sections (brief §9) are static content — added once Phase 3's
// dashboard exists to screenshot for the preview, not before.
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-xl font-semibold text-ink">StudyFlow</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-ink/70 hover:text-ink">
            Log in
          </Link>
          <Link href="/register" className="btn-primary">
            Get Started Free
          </Link>
        </div>
      </nav>

      <header className="mx-auto max-w-4xl px-6 pb-24 pt-16 text-center">
        <h1 className="font-display text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          Your academic life,
          <br />
          finally under control.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink/70">
          StudyFlow brings your courses, assignments, exams, study schedule, notes and grades into
          one place — and an AI assistant that actually understands how they connect.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/register" className="btn-primary px-6 py-3 text-base">
            Get Started Free
          </Link>
          <Link href="/login" className="btn-secondary px-6 py-3 text-base">
            Explore Demo
          </Link>
        </div>
      </header>
    </div>
  );
}
