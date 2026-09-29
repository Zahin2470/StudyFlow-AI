import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { AiService } from "@/server/services/ai.service";

export async function POST() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    const plan = await AiService.generateStudyPlan(userId);
    return NextResponse.json(plan);
  } catch (err) {
    if (err instanceof Error && err.message === "AI_NOT_CONFIGURED") {
      return errorResponse(
        "AI_NOT_CONFIGURED",
        "Add AI_PROVIDER and AI_API_KEY to your .env to enable the assistant.",
        503
      );
    }
    if (err instanceof Error && err.message === "NO_COURSES") {
      return errorResponse("NO_COURSES", "Add a course first — a study plan needs something to plan around.", 400);
    }
    return errorResponse("AI_ERROR", "Couldn't generate a valid plan just now. Try again.", 502);
  }
}
