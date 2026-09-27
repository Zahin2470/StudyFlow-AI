"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { courseSchema, type CourseInput } from "@/lib/schemas/academic.schema";
import { apiRequest } from "@/lib/api-client";

const SWATCHES = ["#3454D1", "#5B8266", "#E8A33D", "#8B5CF6", "#EC4899", "#14213C"];

export function CourseForm({
  semesterId,
  initial,
  courseId,
  onDone,
}: {
  semesterId: string;
  initial?: Partial<CourseInput>;
  courseId?: string; // present when editing
  onDone: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: { semesterId, color: SWATCHES[0], credits: 3, ...initial },
  });
  const color = watch("color");

  const onSubmit = async (data: CourseInput) => {
    setServerError(null);
    try {
      if (courseId) {
        await apiRequest(`/api/courses/${courseId}`, { method: "PATCH", body: data });
      } else {
        await apiRequest("/api/courses", { method: "POST", body: data });
      }
      router.refresh();
      onDone();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("semesterId")} value={semesterId} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <input className="input-field" placeholder="Code (CSE311)" {...register("code")} />
          {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>}
        </div>
        <div>
          <input
            className="input-field"
            placeholder="Credits"
            type="number"
            step="0.5"
            {...register("credits")}
          />
          {errors.credits && <p className="mt-1 text-xs text-red-600">{errors.credits.message}</p>}
        </div>
      </div>
      <div>
        <input className="input-field" placeholder="Course name" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <input className="input-field" placeholder="Instructor (optional)" {...register("instructor")} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-ink/60">Color</label>
        <div className="flex gap-2">
          {SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => setValue("color", swatch)}
              className="h-7 w-7 rounded-full ring-offset-2 transition-shadow"
              style={{
                backgroundColor: swatch,
                boxShadow: color === swatch ? `0 0 0 2px white, 0 0 0 4px ${swatch}` : "none",
              }}
              aria-label={`Choose ${swatch}`}
            />
          ))}
        </div>
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : courseId ? "Save changes" : "Add course"}
      </button>
    </form>
  );
}
