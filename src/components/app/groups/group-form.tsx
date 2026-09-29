"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { studyGroupSchema, type StudyGroupInput } from "@/lib/schemas/academic.schema";
import { apiRequest } from "@/lib/api-client";

export function GroupForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudyGroupInput>({ resolver: zodResolver(studyGroupSchema) });

  const onSubmit = async (data: StudyGroupInput) => {
    setServerError(null);
    try {
      await apiRequest("/api/groups", { method: "POST", body: data });
      router.refresh();
      onDone();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input className="input-field" placeholder="Group name" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <textarea className="input-field min-h-[70px]" placeholder="What's this group for? (optional)" {...register("description")} />
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating…" : "Create group"}
      </button>
    </form>
  );
}
