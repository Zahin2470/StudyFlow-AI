"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { FileText, Image as ImageIcon, File as FileIcon, Trash2, Download, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { UploadForm } from "./upload-form";
import { apiRequest } from "@/lib/api-client";

type Course = { id: string; code: string; name: string };
type Doc = {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  courseId: string;
  createdAt: string;
  course: { code: string; color: string };
};

function fileIcon(type: string) {
  if (type.startsWith("image/")) return ImageIcon;
  if (type === "application/pdf") return FileText;
  return FileIcon;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsClient({ courses, documents }: { courses: Course[]; documents: Doc[] }) {
  const router = useRouter();
  const [courseFilter, setCourseFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(
    () => (courseFilter === "all" ? documents : documents.filter((d) => d.courseId === courseFilter)),
    [documents, courseFilter]
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    await apiRequest(`/api/documents/${id}`, { method: "DELETE" });
    router.refresh();
  };

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Add a course first"
        description="Documents belong to a course — head to Courses and add one, then come back here."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Documents"
        subtitle={`${filtered.length} file${filtered.length === 1 ? "" : "s"}`}
        action={
          <button className="btn-primary flex items-center gap-1.5" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Upload
          </button>
        }
      />

      <select className="input-field mb-6 w-56" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
        <option value="all">All courses</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.code}
          </option>
        ))}
      </select>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload syllabi, slides, or readings to keep them attached to the right course."
          action={
            <button className="btn-primary" onClick={() => setModalOpen(true)}>
              Upload a file
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((doc, i) => {
            const Icon = fileIcon(doc.fileType);
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: i * 0.03 }}
                className="card-flat group flex items-center gap-4 px-4 py-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-indigo/10 text-indigo">
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{doc.title}</p>
                  <p className="text-xs text-ink/50">
                    {doc.course.code} · {formatSize(doc.fileSize)} · {format(new Date(doc.createdAt), "MMM d")}
                  </p>
                </div>
                <a
                  href={doc.fileUrl}
                  download
                  className="rounded-full p-1.5 text-ink/40 hover:bg-paper hover:text-ink"
                >
                  <Download size={14} />
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="rounded-full p-1.5 text-ink/40 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload a document">
        <UploadForm courses={courses} onDone={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}
