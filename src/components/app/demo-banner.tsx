import Link from "next/link";
import { Sparkles } from "lucide-react";

// Shown only when the signed-in user is the shared public demo account
// (see src/lib/demo.ts). Sets honest expectations — this is one shared
// account, so changes are visible to other visitors — while pointing
// toward the real conversion action.
export function DemoBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-indigo px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
      <Sparkles size={14} />
      You&apos;re exploring a shared live demo — changes are visible to other visitors.
      <Link href="/register" className="underline underline-offset-2 hover:text-white/80">
        Create your own free account
      </Link>
    </div>
  );
}
