"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export function ChatPanel({ aiAvailable }: { aiAvailable: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! Ask me about your deadlines, workload, or how to prioritize this week.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || sending) return;
    const next = [...messages, { role: "user" as const, content: input.trim() }];
    setMessages(next);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? "Something went wrong.");
      setMessages([...next, { role: "assistant", content: json.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  if (!aiAvailable) {
    return (
      <div className="card-flat flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 rounded-full bg-indigo/10 p-3 text-indigo">
          <Sparkles size={22} />
        </div>
        <h3 className="font-display text-lg font-semibold text-ink">Assistant not configured yet</h3>
        <p className="mt-1 max-w-sm text-sm text-ink/60">
          Add <code className="rounded bg-paper px-1 py-0.5">AI_PROVIDER</code> and{" "}
          <code className="rounded bg-paper px-1 py-0.5">AI_API_KEY</code> to your <code>.env</code> to
          turn this on — see the README for supported providers.
        </p>
      </div>
    );
  }

  return (
    <div className="card-flat flex h-[520px] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-card px-3.5 py-2.5 text-sm ${
                m.role === "user" ? "bg-indigo text-white" : "bg-paper text-ink"
              }`}
            >
              {m.content}
            </div>
          </motion.div>
        ))}
        {sending && <p className="text-xs text-ink/40">Thinking…</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-slate-light p-3">
        <input
          className="input-field flex-1"
          placeholder="Ask about your workload…"
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
