"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";

export function JoinForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest("/api/groups/join", { method: "POST", body: { inviteCode: code.trim() } });
      router.refresh();
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="input-field"
        placeholder="Invite code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-primary w-full" type="submit" disabled={submitting || !code.trim()}>
        {submitting ? "Joining…" : "Join group"}
      </button>
    </form>
  );
}
