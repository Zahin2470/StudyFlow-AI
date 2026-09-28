"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { gradeEntrySchema, type GradeEntryInput } from "@/lib/schemas/academic.schema";
import { apiRequest } from "@/lib/api-client";

export function GradeEntryForm({
  courseId,
  initial,
  entryId,
  onDone,
}: {
  courseId: string;
  initial?: Partial<GradeEntryInput>;
  entryId?: string;
  onDone: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GradeEntryInput>({
    resolver: zodResolver(gradeEntrySchema),
    defaultValues: { courseId, weight: 10, maxScore: 100, ...initial },
  });

  const onSubmit = async (data: GradeEntryInput) => {
    setServerError(null);
    try {
      if (entryId) {
        await apiRequest(`/api/grade-entries/${entryId}`, { method: "PATCH", body: data });
      } else {
        await apiRequest("/api/grade-entries", { method: "POST", body: data });
      }
      router.refresh();
      onDone();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input type="hidden" {...register("courseId")} value={courseId} />
      <input className="input-field" placeholder="Label (e.g. Midterm, Homework 3)" {...register("label")} />
      {errors.label && <p className="text-xs text-red-600">{errors.label.message}</p>}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="mb-1 block text-xs text-ink/60">Score</label>
          <input className="input-field" type="number" step="0.1" {...register("score")} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink/60">Out of</label>
          <input className="input-field" type="number" step="0.1" {...register("maxScore")} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink/60">Weight %</label>
          <input className="input-field" type="number" step="1" {...register("weight")} />
        </div>
      </div>
      {errors.score && <p className="text-xs text-red-600">{errors.score.message}</p>}
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : entryId ? "Save changes" : "Add grade"}
      </button>
    </form>
  );
}
