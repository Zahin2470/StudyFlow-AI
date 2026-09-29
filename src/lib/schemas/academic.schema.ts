import { z } from "zod";

export const semesterSchema = z
  .object({
    name: z.string().min(2, "Name is too short").max(60),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    isActive: z.boolean().optional().default(false),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });
export type SemesterInput = z.infer<typeof semesterSchema>;

export const courseSchema = z.object({
  semesterId: z.string().min(1, "Select a semester"),
  code: z.string().min(1, "Enter a course code").max(20),
  name: z.string().min(2, "Enter a course name").max(120),
  instructor: z.string().max(120).optional(),
  credits: z.coerce.number().min(0).max(12),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use a hex color")
    .default("#3454D1"),
});
export type CourseInput = z.infer<typeof courseSchema>;

export const assignmentSchema = z.object({
  courseId: z.string().min(1, "Select a course"),
  title: z.string().min(2, "Enter a title").max(160),
  description: z.string().max(2000).optional(),
  dueDate: z.coerce.date(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "SUBMITTED", "GRADED"]).default("NOT_STARTED"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  weight: z.coerce.number().min(0).max(100).optional(),
});
export type AssignmentInput = z.infer<typeof assignmentSchema>;

export const examSchema = z.object({
  courseId: z.string().min(1, "Select a course"),
  title: z.string().min(2, "Enter a title").max(160),
  examDate: z.coerce.date(),
  location: z.string().max(120).optional(),
  notes: z.string().max(2000).optional(),
  weight: z.coerce.number().min(0).max(100).optional(),
});
export type ExamInput = z.infer<typeof examSchema>;

export const studySessionSchema = z
  .object({
    courseId: z.string().optional(),
    title: z.string().max(160).optional(),
    scheduledStart: z.coerce.date(),
    scheduledEnd: z.coerce.date(),
    completed: z.boolean().optional().default(false),
    actualDurationMin: z.coerce.number().int().min(0).optional(),
  })
  .refine((data) => data.scheduledEnd > data.scheduledStart, {
    message: "End time must be after start time",
    path: ["scheduledEnd"],
  });
export type StudySessionInput = z.infer<typeof studySessionSchema>;

export const noteSchema = z.object({
  courseId: z.string().min(1, "Select a course"),
  title: z.string().min(1, "Enter a title").max(160),
  content: z.string().max(20000).default(""),
});
export type NoteInput = z.infer<typeof noteSchema>;

// File itself is validated separately (size/type) in the upload route since
// it arrives via multipart form-data, not JSON — this covers the metadata.
export const documentMetaSchema = z.object({
  courseId: z.string().min(1, "Select a course"),
  title: z.string().min(1, "Enter a title").max(160),
});
export type DocumentMetaInput = z.infer<typeof documentMetaSchema>;

export const gradeEntrySchema = z
  .object({
    courseId: z.string().min(1, "Select a course"),
    label: z.string().min(1, "Enter a label").max(120),
    score: z.coerce.number().min(0),
    maxScore: z.coerce.number().positive("Must be greater than 0"),
    weight: z.coerce.number().min(0).max(100),
    assignmentId: z.string().optional(),
    examId: z.string().optional(),
  })
  .refine((data) => data.score <= data.maxScore, {
    message: "Score can't exceed the max score",
    path: ["score"],
  });
export type GradeEntryInput = z.infer<typeof gradeEntrySchema>;

export const studyGroupSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80),
  description: z.string().max(500).optional(),
});
export type StudyGroupInput = z.infer<typeof studyGroupSchema>;

export const joinGroupSchema = z.object({
  inviteCode: z.string().min(4, "Enter a valid invite code"),
});

export const groupMessageSchema = z.object({
  content: z.string().min(1, "Message can't be empty").max(2000),
});
export type GroupMessageInput = z.infer<typeof groupMessageSchema>;

export const groupTaskSchema = z.object({
  title: z.string().min(1, "Enter a title").max(160),
  dueDate: z.coerce.date().optional(),
});
export type GroupTaskInput = z.infer<typeof groupTaskSchema>;
