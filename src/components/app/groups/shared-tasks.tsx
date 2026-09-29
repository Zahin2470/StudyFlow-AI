"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/api-client";

type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  completed: boolean;
  createdBy: { name: string };
};

export function SharedTasks({ groupId, initialTasks }: { groupId: string; initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const refresh = async () => {
    const res = await fetch(`/api/groups/${groupId}/tasks`);
    if (res.ok) setTasks(await res.json());
  };

  const addTask = async () => {
    if (!title.trim()) return;
    setAdding(true);
    try {
      await apiRequest(`/api/groups/${groupId}/tasks`, { method: "POST", body: { title: title.trim() } });
      setTitle("");
      await refresh();
    } finally {
      setAdding(false);
    }
  };

  const toggle = async (task: Task) => {
    await apiRequest(`/api/groups/${groupId}/tasks/${task.id}`, {
      method: "PATCH",
      body: { completed: !task.completed },
    });
    await refresh();
  };

  const remove = async (id: string) => {
    await apiRequest(`/api/groups/${groupId}/tasks/${id}`, { method: "DELETE" });
    await refresh();
  };

  return (
    <div className="card-flat p-5">
      <h2 className="mb-3 font-display text-base font-semibold text-ink">Shared Tasks</h2>
      <div className="mb-3 flex gap-2">
        <input
          className="input-field flex-1"
          placeholder="Add a task for the group…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask} disabled={adding} className="btn-secondary px-3">
          <Plus size={16} />
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className="py-4 text-center text-sm text-ink/50">No shared tasks yet.</p>
      ) : (
        <div className="space-y-1.5">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group flex items-center gap-2.5 rounded-card px-2 py-1.5 hover:bg-paper"
            >
              <input type="checkbox" checked={task.completed} onChange={() => toggle(task)} />
              <span className={`flex-1 text-sm ${task.completed ? "text-ink/40 line-through" : "text-ink"}`}>
                {task.title}
              </span>
              {task.dueDate && (
                <span className="text-xs text-ink/40">{format(new Date(task.dueDate), "MMM d")}</span>
              )}
              <button
                onClick={() => remove(task.id)}
                className="rounded-full p-1 text-ink/30 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
