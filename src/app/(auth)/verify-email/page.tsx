import { AuthShell } from "@/components/auth/auth-shell";

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Check your inbox" subtitle="One more step.">
      <p className="text-sm text-ink/80">
        We sent a verification link to your email. Click it to activate your account — you can
        still explore StudyFlow while you wait, but you&apos;ll need to verify before adding real
        data.
      </p>
    </AuthShell>
  );
}
