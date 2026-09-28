"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";

type CourseOption = { id: string; code: string; name: string };

export function UploadForm({ courses, onDone }: { courses: CourseOption[]; onDone: () => void }) {
  const router = useRouter();
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Choose a file.");
      return;
    }
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);
    formData.append("title", title || file.name);

    try {
      const res = await fetch("/api/documents", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? "Upload failed.");
      router.refresh();
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select className="input-field" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.code} — {c.name}
          </option>
        ))}
      </select>
      <input
        className="input-field"
        placeholder="Title (optional — defaults to filename)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-slate-light px-6 py-8 text-center hover:border-indigo/40">
        <UploadCloud size={22} className="text-ink/40" />
        <span className="text-sm text-ink/60">
          {file ? file.name : "Click to choose a file (PDF, Word, image, or text — up to 15MB)"}
        </span>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,image/png,image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-primary w-full" type="submit" disabled={uploading}>
        {uploading ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
