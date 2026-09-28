import { auth } from "@/server/auth";
import { CourseService } from "@/server/services/course.service";
import { DocumentService } from "@/server/services/document.service";
import { DocumentsClient } from "@/components/app/documents/documents-client";

export default async function DocumentsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [courses, documents] = await Promise.all([
    CourseService.list(userId),
    DocumentService.list(userId),
  ]);

  return <DocumentsClient courses={courses} documents={JSON.parse(JSON.stringify(documents))} />;
}
