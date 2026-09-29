"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Plus, LogIn } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { GroupForm } from "./group-form";
import { JoinForm } from "./join-form";

type Group = { id: string; name: string; description: string | null; _count: { memberships: number } };

export function GroupsClient({ groups }: { groups: Group[] }) {
  const [modal, setModal] = useState<"create" | "join" | null>(null);

  return (
    <>
      <PageHeader
        title="Study Groups"
        subtitle={`${groups.length} group${groups.length === 1 ? "" : "s"}`}
        action={
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-1.5" onClick={() => setModal("join")}>
              <LogIn size={15} /> Join
            </button>
            <button className="btn-primary flex items-center gap-1.5" onClick={() => setModal("create")}>
              <Plus size={16} /> Create
            </button>
          </div>
        }
      />

      {groups.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No study groups yet"
          description="Create a group for your class, or join one with an invite code from a classmate."
          action={
            <button className="btn-primary" onClick={() => setModal("create")}>
              Create a group
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
            >
              <Link href={`/groups/${group.id}`} className="card-flat block p-5 hover:bg-paper">
                <h3 className="font-display text-base font-semibold text-ink">{group.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink/60">{group.description || "No description."}</p>
                <p className="mt-3 text-xs text-ink/40">
                  {group._count.memberships} member{group._count.memberships === 1 ? "" : "s"}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="Create a study group">
        <GroupForm onDone={() => setModal(null)} />
      </Modal>
      <Modal open={modal === "join"} onClose={() => setModal(null)} title="Join a study group">
        <JoinForm onDone={() => setModal(null)} />
      </Modal>
    </>
  );
}
