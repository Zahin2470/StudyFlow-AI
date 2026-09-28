"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { studySessionSchema, type StudySessionInput } from "@/lib/schemas/academic.schema";
import { apiRequest } from "@/lib/api-client";
import { toDateTimeInputValue } from "@/lib/date-utils";

type CourseOption = { id: string; code: string; name: string };

export function StudySessionForm({
  courses,
  initial,
  onDone,
}: {
  courses: CourseOption[];
  initial?: Partial<StudySessionInput>;
  onDone: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudySessionInput>({
    resolver: zodResolver(studySessionSchema),
    defaultValues: {
      ...initial,
      scheduledStart: toDateTimeInputValue(initial?.scheduledStart as unknown as string) as unknown as Date,
      scheduledEnd: toDateTimeInputValue(initial?.scheduledEnd as unknown as string) as unknown as Date,
    },
  });

  const onSubmit = async (data: StudySessionInput) => {
    setServerError(null);
    try {
      await apiRequest("/api/study-sessions", { method: "POST", body: data });
      router.refresh();
      onDone();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input className="input-field" placeholder="What are you studying? (optional)" {...register("title")} />
      </div>
      <div>
        <select className="input-field" {...register("courseId")}>
          <option value="">No specific course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-ink/60">Starts</label>
          <input className="input-field" type="datetime-local" {...register("scheduledStart")} />
          {errors.scheduledStart && (
            <p className="mt-1 text-xs text-red-600">{errors.scheduledStart.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink/60">Ends</label>
          <input className="input-field" type="datetime-local" {...register("scheduledEnd")} />
          {errors.scheduledEnd && (
            <p className="mt-1 text-xs text-red-600">{errors.scheduledEnd.message}</p>
          )}
        </div>
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Scheduling…" : "Schedule session"}
      </button>
    </form>
  );
}
