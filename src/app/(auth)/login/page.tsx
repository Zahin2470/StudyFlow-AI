"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schema";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const res = await signIn("credentials", { ...data, redirect: false });
    if (res?.error) {
      setServerError("Incorrect email or password.");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-medium text-indigo">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input className="input-field" placeholder="Email" type="email" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <input className="input-field" placeholder="Password" type="password" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-indigo">
            Forgot password?
          </Link>
        </div>
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </button>
      </form>
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="btn-secondary mt-3 w-full"
      >
        Continue with Google
      </button>
    </AuthShell>
  );
}
