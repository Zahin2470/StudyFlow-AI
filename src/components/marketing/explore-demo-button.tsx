"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/demo";

// Signs the visitor in as the real seeded demo account through the exact
// same Credentials flow /login uses — no separate "demo mode" auth path,
// no read-only stub pages. They land on /dashboard fully authenticated and
// every feature (Courses, Planner, AI Assistant, Groups...) genuinely works.
// Set NEXT_PUBLIC_ENABLE_DEMO=false to pull this off a production deploy
// without touching any other code.
const DEMO_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DEMO !== "false";

export function ExploreDemoButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  if (!DEMO_ENABLED) return null;

  const handleClick = async () => {
    setLoading(true);
    await signIn("credentials", {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Loading demo…" : "Explore Demo"}
    </button>
  );
}
