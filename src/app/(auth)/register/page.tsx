"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth.schema";
import { AuthShell } from "@/components/auth/auth-shell";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const { error } = await res.json();
      setServerError(error?.message ?? "Something went wrong.");
      return;
    }
    router.push("/verify-email");
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up StudyFlow for this semester."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input className="input-field" placeholder="Full name" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <input className="input-field" placeholder="Email" type="email" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <input className="input-field" placeholder="Password" type="password" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>
        <div>
          <input className="input-field" placeholder="Institution" {...register("institution")} />
          {errors.institution && (
            <p className="mt-1 text-xs text-red-600">{errors.institution.message}</p>
          )}
        </div>
        <div>
          <select className="input-field" {...register("academicLevel")} defaultValue="">
            <option value="" disabled>
              Academic level
            </option>
            <option value="HIGH_SCHOOL">High School</option>
            <option value="UNDERGRADUATE">Undergraduate</option>
            <option value="GRADUATE">Graduate</option>
          </select>
          {errors.academicLevel && (
            <p className="mt-1 text-xs text-red-600">{errors.academicLevel.message}</p>
          )}
        </div>
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
