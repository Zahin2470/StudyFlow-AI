"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { semesterSchema, type SemesterInput } from "@/lib/schemas/academic.schema";
import { apiRequest } from "@/lib/api-client";

export function SemesterForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SemesterInput>({
    resolver: zodResolver(semesterSchema),
    defaultValues: { isActive: true },
  });

  const onSubmit = async (data: SemesterInput) => {
    setServerError(null);
    try {
      await apiRequest("/api/semesters", { method: "POST", body: data });
      router.refresh();
      onDone();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input className="input-field" placeholder="e.g. Fall 2026" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-ink/60">Start date</label>
          <input className="input-field" type="date" {...register("startDate")} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink/60">End date</label>
          <input className="input-field" type="date" {...register("endDate")} />
          {errors.endDate && <p className="mt-1 text-xs text-red-600">{errors.endDate.message}</p>}
        </div>
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating…" : "Create semester"}
      </button>
    </form>
  );
}
