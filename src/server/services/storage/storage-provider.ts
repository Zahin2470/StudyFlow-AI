// Same abstraction pattern as the AI provider in ARCHITECTURE.md §5: the
// rest of the app only ever talks to this interface, so swapping the local
// disk adapter for S3 or Supabase Storage later is a one-file change.
export interface StorageProvider {
  upload(input: {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    userId: string;
  }): Promise<{ url: string; key: string }>;

  delete(key: string): Promise<void>;
}

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
