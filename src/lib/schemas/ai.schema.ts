import { z } from "zod";

// What the AI is asked to return for a study plan — validated before any of
// it reaches the database or UI (ARCHITECTURE.md §5). If the model's JSON
// doesn't match this, AiService retries once with a stricter prompt, then
// surfaces a plain error rather than guessing at a fix.
export const studyPlanSuggestionSchema = z.object({
  sessions: z
    .array(
      z.object({
        courseId: z.string(),
        date: z.string(), // "yyyy-MM-dd" — combined with startTime client-side
        startTime: z.string(), // "HH:mm"
        durationMin: z.number().int().min(15).max(240),
        reason: z.string().max(200),
      })
    )
    .max(14),
});
export type StudyPlanSuggestion = z.infer<typeof studyPlanSuggestionSchema>;

export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(30),
});
