import { NextResponse } from "next/server";
import { requireUserId, unauthorized, errorResponse } from "@/lib/api-helpers";
import { DocumentService } from "@/server/services/document.service";
import { DocumentRepository } from "@/server/repositories/document.repository";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const doc = await DocumentRepository.findByIdForUser(params.id, userId);
  if (!doc) return errorResponse("NOT_FOUND", "Document not found.", 404);
  return NextResponse.json(doc);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  try {
    await DocumentService.delete(params.id, userId);
    return NextResponse.json({ message: "Document deleted." });
  } catch {
    return errorResponse("NOT_FOUND", "Document not found.", 404);
  }
}
