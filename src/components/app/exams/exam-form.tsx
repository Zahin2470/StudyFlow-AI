"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { examSchema, type ExamInput } from "@/lib/schemas/academic.schema";
import { apiRequest } from "@/lib/api-client";
import { toDateInputValue } from "@/lib/date-utils";

type CourseOption = { id: string; code: string; name: string };

export function ExamForm({
  courses,
  initial,
  examId,
  onDone,
}: {
  courses: CourseOption[];
  initial?: Partial<ExamInput>;
  examId?: string;
  onDone: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExamInput>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      courseId: courses[0]?.id,
      ...initial,
      examDate: toDateInputValue(initial?.examDate as unknown as string) as unknown as Date,
    },
  });

  const onSubmit = async (data: ExamInput) => {
    setServerError(null);
    try {
      if (examId) {
        await apiRequest(`/api/exams/${examId}`, { method: "PATCH", body: data });
      } else {
        await apiRequest("/api/exams", { method: "POST", body: data });
      }
      router.refresh();
      onDone();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <select className="input-field" {...register("courseId")}>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <input className="input-field" placeholder="Title (e.g. Midterm)" {...register("title")} />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-ink/60">Exam date</label>
          <input className="input-field" type="date" {...register("examDate")} />
          {errors.examDate && <p className="mt-1 text-xs text-red-600">{errors.examDate.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink/60">Weight % (optional)</label>
          <input className="input-field" type="number" step="1" {...register("weight")} />
        </div>
      </div>
      <div>
        <input className="input-field" placeholder="Location (optional)" {...register("location")} />
      </div>
      <div>
        <textarea className="input-field min-h-[70px]" placeholder="Notes (optional)" {...register("notes")} />
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : examId ? "Save changes" : "Add exam"}
      </button>
    </form>
  );
}
