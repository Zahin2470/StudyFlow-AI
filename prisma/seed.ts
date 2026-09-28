import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Phase 1 seed: just a demo user, so the login flow can be tested without
// registering by hand. Course/assignment/exam seed data is added once
// those models exist in Phase 2 (see ARCHITECTURE.md §12).
async function main() {
  const passwordHash = await bcrypt.hash("Password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@studyflow.ai" },
    update: {},
    create: {
      name: "Demo Student",
      email: "demo@studyflow.ai",
      passwordHash,
      institution: "East West University",
      academicLevel: "UNDERGRADUATE",
      emailVerified: new Date(),
    },
  });

  const semester = await prisma.semester.create({
    data: {
      userId: user.id,
      name: "Fall 2026",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-12-20"),
      isActive: true,
    },
  });

  const [database, algorithms] = await Promise.all([
    prisma.course.create({
      data: {
        userId: user.id,
        semesterId: semester.id,
        code: "CSE311",
        name: "Database Systems",
        instructor: "Dr. Rahman",
        credits: 3,
        color: "#3454D1",
      },
    }),
    prisma.course.create({
      data: {
        userId: user.id,
        semesterId: semester.id,
        code: "CSE221",
        name: "Algorithms",
        instructor: "Dr. Chowdhury",
        credits: 3,
        color: "#5B8266",
      },
    }),
  ]);

  await prisma.assignment.createMany({
    data: [
      {
        courseId: database.id,
        title: "ER Diagram Assignment",
        dueDate: new Date("2026-09-15"),
        status: "IN_PROGRESS",
        priority: "HIGH",
        weight: 10,
      },
      {
        courseId: algorithms.id,
        title: "Dynamic Programming Problem Set",
        dueDate: new Date("2026-09-20"),
        status: "NOT_STARTED",
        priority: "MEDIUM",
        weight: 8,
      },
    ],
  });

  await prisma.exam.create({
    data: {
      courseId: database.id,
      title: "Midterm",
      examDate: new Date("2026-10-10"),
      location: "Room 402",
      weight: 25,
    },
  });

  await prisma.studySession.create({
    data: {
      userId: user.id,
      courseId: database.id,
      title: "Review normalization",
      scheduledStart: new Date("2026-09-14T18:00:00"),
      scheduledEnd: new Date("2026-09-14T19:30:00"),
      completed: false,
    },
  });

  await prisma.gradeEntry.createMany({
    data: [
      { courseId: database.id, label: "Homework 1", score: 18, maxScore: 20, weight: 10 },
      { courseId: database.id, label: "Quiz 1", score: 8, maxScore: 10, weight: 5 },
      { courseId: algorithms.id, label: "Problem Set 1", score: 27, maxScore: 30, weight: 15 },
    ],
  });

  console.log("Seeded demo@studyflow.ai / Password123 with a sample semester, 2 courses, an assignment set, an exam, a study session, and grade entries.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
