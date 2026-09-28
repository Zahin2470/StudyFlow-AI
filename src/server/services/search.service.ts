import { prisma } from "@/lib/prisma";

export type SearchResult = {
  id: string;
  type: "course" | "assignment" | "exam" | "note" | "document";
  title: string;
  subtitle: string;
  href: string;
};

// One query per entity rather than a single raw SQL UNION — keeps ownership
// filtering identical to every other repository in the app, and five small
// indexed queries is fast enough at MVP scale (see ARCHITECTURE.md §9 if
// this ever needs to become a real search index).
export async function globalSearch(userId: string, query: string): Promise<SearchResult[]> {
  if (query.trim().length < 2) return [];
  const q = query.trim();

  const [courses, assignments, exams, notes, documents] = await Promise.all([
    prisma.course.findMany({
      where: { userId, OR: [{ name: { contains: q, mode: "insensitive" } }, { code: { contains: q, mode: "insensitive" } }] },
      take: 5,
    }),
    prisma.assignment.findMany({
      where: { course: { userId }, title: { contains: q, mode: "insensitive" } },
      include: { course: { select: { code: true } } },
      take: 5,
    }),
    prisma.exam.findMany({
      where: { course: { userId }, title: { contains: q, mode: "insensitive" } },
      include: { course: { select: { code: true } } },
      take: 5,
    }),
    prisma.note.findMany({
      where: { course: { userId }, title: { contains: q, mode: "insensitive" } },
      include: { course: { select: { code: true } } },
      take: 5,
    }),
    prisma.document.findMany({
      where: { course: { userId }, title: { contains: q, mode: "insensitive" } },
      include: { course: { select: { code: true } } },
      take: 5,
    }),
  ]);

  return [
    ...courses.map((c) => ({ id: c.id, type: "course" as const, title: c.name, subtitle: c.code, href: "/courses" })),
    ...assignments.map((a) => ({
      id: a.id,
      type: "assignment" as const,
      title: a.title,
      subtitle: a.course.code,
      href: "/assignments",
    })),
    ...exams.map((e) => ({
      id: e.id,
      type: "exam" as const,
      title: e.title,
      subtitle: e.course.code,
      href: "/exams",
    })),
    ...notes.map((n) => ({
      id: n.id,
      type: "note" as const,
      title: n.title,
      subtitle: n.course.code,
      href: "/notes",
    })),
    ...documents.map((d) => ({
      id: d.id,
      type: "document" as const,
      title: d.title,
      subtitle: d.course.code,
      href: "/documents",
    })),
  ];
}
