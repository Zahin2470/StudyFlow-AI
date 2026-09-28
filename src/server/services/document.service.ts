import { DocumentRepository } from "@/server/repositories/document.repository";
import { storageProvider } from "@/server/services/storage";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "@/server/services/storage/storage-provider";

export class DocumentService {
  static list(userId: string, courseId?: string) {
    return DocumentRepository.findAllForUser(userId, courseId);
  }

  static async upload(
    userId: string,
    input: { courseId: string; title: string; file: File }
  ) {
    if (!ALLOWED_MIME_TYPES.includes(input.file.type)) {
      throw new Error("UNSUPPORTED_FILE_TYPE");
    }
    if (input.file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error("FILE_TOO_LARGE");
    }

    const buffer = Buffer.from(await input.file.arrayBuffer());
    const { url, key } = await storageProvider.upload({
      buffer,
      filename: input.file.name,
      mimeType: input.file.type,
      userId,
    });

    try {
      return await DocumentRepository.create(userId, {
        courseId: input.courseId,
        title: input.title,
        fileUrl: url,
        storageKey: key,
        fileType: input.file.type,
        fileSize: input.file.size,
      });
    } catch (err) {
      // Course didn't belong to this user — clean up the file we just wrote
      // so a rejected upload doesn't leave an orphaned file on disk.
      await storageProvider.delete(key);
      throw err;
    }
  }

  static async delete(id: string, userId: string) {
    const deleted = await DocumentRepository.delete(id, userId);
    if (!deleted) throw new Error("NOT_FOUND");
    await storageProvider.delete(deleted.storageKey);
  }
}
