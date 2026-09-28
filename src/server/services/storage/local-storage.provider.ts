import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";
import type { StorageProvider } from "./storage-provider";

// Default adapter for local development — no cloud credentials required.
// Files land in /public/uploads/<userId>/<key>, served directly by Next.js
// as static assets, so `fileUrl` works immediately with zero config.
// Swap STORAGE_PROVIDER to "s3" or "supabase" in .env once real credentials
// exist; nothing outside this file needs to change (DocumentService only
// depends on the StorageProvider interface).
const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export class LocalStorageProvider implements StorageProvider {
  async upload({ buffer, filename, userId }: { buffer: Buffer; filename: string; mimeType: string; userId: string }) {
    const dir = path.join(UPLOAD_ROOT, userId);
    await mkdir(dir, { recursive: true });

    const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const key = `${userId}/${crypto.randomUUID()}-${safeName}`;
    await writeFile(path.join(UPLOAD_ROOT, ...key.split("/")), buffer);

    return { url: `/uploads/${key}`, key };
  }

  async delete(key: string) {
    try {
      await unlink(path.join(UPLOAD_ROOT, ...key.split("/")));
    } catch {
      // Already gone — deleting the DB row shouldn't fail because the file did.
    }
  }
}
