import { auth } from "@/server/auth";
import { CourseService } from "@/server/services/course.service";
import { NoteService } from "@/server/services/note.service";
import { NotesClient } from "@/components/app/notes/notes-client";

export default async function NotesPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [courses, notes] = await Promise.all([CourseService.list(userId), NoteService.list(userId)]);

  return <NotesClient courses={courses} notes={JSON.parse(JSON.stringify(notes))} />;
}
