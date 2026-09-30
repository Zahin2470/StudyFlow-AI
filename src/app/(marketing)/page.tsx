import { BookOpen, CalendarClock, Sparkles } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { AmbientGlow } from "@/components/marketing/ambient-glow";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { ExploreDemoButton } from "@/components/marketing/explore-demo-button";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Everything connected",
    description: "Courses, assignments, and exams live in one place — your GPA updates itself as grades come in.",
  },
  {
    icon: CalendarClock,
    title: "A plan, not just a list",
    description: "The study planner and timer turn deadlines into scheduled sessions, and log real time as you work.",
  },
  {
    icon: Sparkles,
    title: "An assistant that knows your week",
    description: "Ask about your workload and get answers grounded in your actual courses and due dates — not generic advice.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <MarketingNav />

      <header className="relative overflow-hidden px-6 pb-20 pt-20">
        <AmbientGlow />
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            Your academic life,
            <br />
            finally under control.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink/70">
            StudyFlow brings your courses, assignments, exams, study schedule,
            notes and grades into one place — and an AI assistant that actually
            understands how they connect.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a href="/register" className="btn-primary px-6 py-3 text-base">
              Get Started Free
            </a>
            <ExploreDemoButton className="btn-secondary px-6 py-3 text-base" />
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-3xl px-4">
          <DashboardPreview />
        </div>
      </header>

      <section className="border-t border-slate-light px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title}>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-indigo/10 text-indigo">
                <feature.icon size={17} />
              </div>
              <h3 className="font-display text-base font-semibold text-ink">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-light px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-sm text-ink/50 sm:flex-row">
          <span>© {new Date().getFullYear()} StudyFlow AI</span>
          <div className="flex gap-5">
            <a href="/login" className="hover:text-ink">Log in</a>
            <a href="/register" className="hover:text-ink">Sign up</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
