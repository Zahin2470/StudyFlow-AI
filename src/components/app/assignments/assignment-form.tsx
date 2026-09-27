"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { assignmentSchema, type AssignmentInput } from "@/lib/schemas/academic.schema";
import { apiRequest } from "@/lib/api-client";
import { toDateInputValue } from "@/lib/date-utils";

type CourseOption = { id: string; code: string; name: string };

export function AssignmentForm({
  courses,
  initial,
  assignmentId,
  onDone,
}: {
  courses: CourseOption[];
  initial?: Partial<AssignmentInput>;
  assignmentId?: string;
  onDone: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentInput>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      status: "NOT_STARTED",
      priority: "MEDIUM",
      courseId: courses[0]?.id,
      ...initial,
      dueDate: toDateInputValue(initial?.dueDate as unknown as string) as unknown as Date,
    },
  });

  const onSubmit = async (data: AssignmentInput) => {
    setServerError(null);
    try {
      if (assignmentId) {
        await apiRequest(`/api/assignments/${assignmentId}`, { method: "PATCH", body: data });
      } else {
        await apiRequest("/api/assignments", { method: "POST", body: data });
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
        <input className="input-field" placeholder="Title" {...register("title")} />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>
      <div>
        <textarea
          className="input-field min-h-[80px]"
          placeholder="Description (optional)"
          {...register("description")}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs text-ink/60">Due date</label>
          <input className="input-field" type="date" {...register("dueDate")} />
          {errors.dueDate && <p className="mt-1 text-xs text-red-600">{errors.dueDate.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink/60">Priority</label>
          <select className="input-field" {...register("priority")}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink/60">Status</label>
          <select className="input-field" {...register("status")}>
            <option value="NOT_STARTED">Not started</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="GRADED">Graded</option>
          </select>
        </div>
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : assignmentId ? "Save changes" : "Add assignment"}
      </button>
    </form>
  );
}
