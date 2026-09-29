import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { chatRequestSchema } from "@/lib/schemas/ai.schema";
import { AiService } from "@/server/services/ai.service";

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = chatRequestSchema.safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const reply = await AiService.chat(userId, parsed.data.messages);
    return NextResponse.json({ reply });
  } catch (err) {
    if (err instanceof Error && err.message === "AI_NOT_CONFIGURED") {
      return errorResponse(
        "AI_NOT_CONFIGURED",
        "Add AI_PROVIDER and AI_API_KEY to your .env to enable the assistant.",
        503
      );
    }
    return errorResponse("AI_ERROR", "The assistant couldn't respond just now. Try again.", 502);
  }
}
