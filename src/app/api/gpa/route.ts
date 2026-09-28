import { NextResponse } from "next/server";
import { requireUserId, unauthorized } from "@/lib/api-helpers";
import { GradeService } from "@/server/services/grade.service";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  return NextResponse.json(await GradeService.getGpaBreakdown(userId));
}
