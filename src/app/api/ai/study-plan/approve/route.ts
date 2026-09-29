import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { studyPlanSuggestionSchema } from "@/lib/schemas/ai.schema";
import { StudySessionService } from "@/server/services/study-session.service";

const approveSchema = z.object({ sessions: studyPlanSuggestionSchema.shape.sessions });

// Turns approved AI suggestions into real StudySession rows through the
// exact same service Phase 4's planner form uses — the AI doesn't get a
// side channel into the database, it produces suggestions a human approves.
export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = approveSchema.safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  const created = await Promise.all(
    parsed.data.sessions.map((s) => {
      const scheduledStart = new Date(`${s.date}T${s.startTime}:00`);
      const scheduledEnd = new Date(scheduledStart.getTime() + s.durationMin * 60_000);
      return StudySessionService.create(userId, {
        courseId: s.courseId,
        title: s.reason.slice(0, 160),
        scheduledStart,
        scheduledEnd,
        completed: false,
      });
    })
  );

  return NextResponse.json({ created: created.length });
}
