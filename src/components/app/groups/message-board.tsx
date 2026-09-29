"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { format } from "date-fns";

type Message = { id: string; content: string; createdAt: string; user: { id: string; name: string } };

// No websocket infra in this build — polling every 5s is the honest MVP
// version of "live" group chat. Swapping this for a real subscription
// (Pusher, a WebSocket route, etc.) later only touches this file.
export function MessageBoard({ groupId, currentUserId }: { groupId: string; currentUserId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    const res = await fetch(`/api/groups/${groupId}/messages`);
    if (res.ok) setMessages(await res.json());
  }, [groupId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await fetch(`/api/groups/${groupId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      setInput("");
      await fetchMessages();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card-flat flex h-[420px] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/50">No messages yet — say hi.</p>
        ) : (
          messages.map((m) => {
            const mine = m.user.id === currentUserId;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] rounded-card px-3 py-2 text-sm ${mine ? "bg-indigo text-white" : "bg-paper text-ink"}`}>
                  {!mine && <p className="mb-0.5 text-xs font-medium opacity-60">{m.user.name}</p>}
                  {m.content}
                  <p className={`mt-0.5 text-[10px] ${mine ? "text-white/60" : "text-ink/40"}`}>
                    {format(new Date(m.createdAt), "h:mm a")}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-slate-light p-3">
        <input
          className="input-field flex-1"
          placeholder="Message the group…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo text-white disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
