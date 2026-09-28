import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { documentMetaSchema } from "@/lib/schemas/academic.schema";
import { DocumentService } from "@/server/services/document.service";

export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const courseId = new URL(req.url).searchParams.get("courseId") ?? undefined;
  return NextResponse.json(await DocumentService.list(userId, courseId));
}

// Multipart, not JSON — the file itself can't travel as JSON. Metadata
// fields are validated the same way as everywhere else, just pulled out of
// FormData instead of a parsed body.
export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return errorResponse("VALIDATION_ERROR", "Attach a file.", 400);
  }

  const parsed = documentMetaSchema.safeParse({
    courseId: formData.get("courseId"),
    title: formData.get("title"),
  });
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  try {
    const doc = await DocumentService.upload(userId, { ...parsed.data, file });
    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "UNSUPPORTED_FILE_TYPE") {
      return errorResponse("UNSUPPORTED_FILE_TYPE", "That file type isn't supported.", 415);
    }
    if (err instanceof Error && err.message === "FILE_TOO_LARGE") {
      return errorResponse("FILE_TOO_LARGE", "Files are limited to 15MB.", 413);
    }
    return errorResponse("COURSE_NOT_FOUND", "That course doesn't exist.", 400);
  }
}
