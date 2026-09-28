"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Modal } from "@/components/ui/modal";
import { FocusTimer } from "./focus-timer";
import { SessionList } from "./session-list";
import { StudySessionForm } from "./study-session-form";

type Course = { id: string; code: string; name: string };
type Session = {
  id: string;
  title: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  completed: boolean;
  course: { code: string; color: string } | null;
};

export function PlannerClient({ courses, sessions }: { courses: Course[]; sessions: Session[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const upcoming = sessions.filter((s) => !s.completed || new Date(s.scheduledStart) >= new Date());

  return (
    <>
      <PageHeader
        title="Study Planner"
        subtitle="Schedule sessions, or start the timer and log time as you go."
        action={
          <button className="btn-primary flex items-center gap-1.5" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Schedule Session
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <FocusTimer courses={courses} />
        </div>
        <div className="card-flat p-6 lg:col-span-3">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">Upcoming & Recent</h2>
          <SessionList sessions={upcoming} />
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule a study session">
        <StudySessionForm courses={courses} onDone={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}
