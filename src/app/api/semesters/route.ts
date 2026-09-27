import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { semesterSchema } from "@/lib/schemas/academic.schema";
import { SemesterService } from "@/server/services/semester.service";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  return NextResponse.json(await SemesterService.list(userId));
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = semesterSchema.safeParse(await req.json());
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  const semester = await SemesterService.create(userId, parsed.data);
  return NextResponse.json(semester, { status: 201 });
}
