"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, LogOut, Trash2, Check } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { MessageBoard } from "./message-board";
import { SharedTasks } from "./shared-tasks";
import { apiRequest } from "@/lib/api-client";

type Member = { user: { id: string; name: string }; role: string };
type Task = { id: string; title: string; dueDate: string | null; completed: boolean; createdBy: { name: string } };

export function GroupDetailClient({
  group,
  currentUserId,
  tasks,
}: {
  group: { id: string; name: string; description: string | null; inviteCode: string; ownerId: string; memberships: Member[] };
  currentUserId: string;
  tasks: Task[];
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const isOwner = group.ownerId === currentUserId;

  const copyCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const leaveOrDelete = async () => {
    if (isOwner) {
      if (!confirm("Delete this group for everyone? This can't be undone.")) return;
      await apiRequest(`/api/groups/${group.id}`, { method: "DELETE" });
    } else {
      if (!confirm("Leave this group?")) return;
      await apiRequest(`/api/groups/${group.id}/leave`, { method: "POST" });
    }
    router.push("/groups");
  };

  return (
    <>
      <PageHeader
        title={group.name}
        subtitle={group.description || undefined}
        action={
          <button onClick={leaveOrDelete} className="btn-secondary flex items-center gap-1.5 text-sm text-red-600">
            {isOwner ? <Trash2 size={14} /> : <LogOut size={14} />}
            {isOwner ? "Delete group" : "Leave group"}
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <button
          onClick={copyCode}
          className="flex items-center gap-2 rounded-card border border-slate-light bg-white px-3 py-1.5 text-sm text-ink/70 hover:bg-paper"
        >
          {copied ? <Check size={14} className="text-sage" /> : <Copy size={14} />}
          Invite code: <span className="font-mono font-medium text-ink">{group.inviteCode}</span>
        </button>
        <div className="flex -space-x-2">
          {group.memberships.map((m) => (
            <span
              key={m.user.id}
              title={m.user.name}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo/10 text-xs font-medium text-indigo"
            >
              {m.user.name[0]}
            </span>
          ))}
        </div>
        <span className="text-xs text-ink/50">{group.memberships.length} members</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <MessageBoard groupId={group.id} currentUserId={currentUserId} />
        </div>
        <div className="lg:col-span-2">
          <SharedTasks groupId={group.id} initialTasks={tasks} />
        </div>
      </div>
    </>
  );
}
