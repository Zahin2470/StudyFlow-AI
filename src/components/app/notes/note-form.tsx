"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { noteSchema, type NoteInput } from "@/lib/schemas/academic.schema";
import { apiRequest } from "@/lib/api-client";

type CourseOption = { id: string; code: string; name: string };

export function NoteForm({
  courses,
  initial,
  noteId,
  onDone,
}: {
  courses: CourseOption[];
  initial?: Partial<NoteInput>;
  noteId?: string;
  onDone: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: { courseId: courses[0]?.id, content: "", ...initial },
  });

  const onSubmit = async (data: NoteInput) => {
    setServerError(null);
    try {
      if (noteId) {
        await apiRequest(`/api/notes/${noteId}`, { method: "PATCH", body: data });
      } else {
        await apiRequest("/api/notes", { method: "POST", body: data });
      }
      router.refresh();
      onDone();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <select className="input-field" {...register("courseId")}>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.code} — {c.name}
          </option>
        ))}
      </select>
      <div>
        <input className="input-field" placeholder="Title" {...register("title")} />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>
      <textarea
        className="input-field min-h-[180px]"
        placeholder="Write your note…"
        {...register("content")}
      />
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : noteId ? "Save changes" : "Add note"}
      </button>
    </form>
  );
}
