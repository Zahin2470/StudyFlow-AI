import type { StorageProvider } from "./storage-provider";
import { LocalStorageProvider } from "./local-storage.provider";

// Chosen at runtime via STORAGE_PROVIDER. Only "local" is implemented right
// now — s3/supabase adapters get added here the same way once there are
// real credentials in .env, without touching DocumentService or any route.
function createProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? "local";

  switch (provider) {
    case "local":
      return new LocalStorageProvider();
    default:
      throw new Error(
        `STORAGE_PROVIDER="${provider}" isn't implemented yet — only "local" is available. ` +
          `Add an adapter in src/server/services/storage/ and register it here.`
      );
  }
}

export const storageProvider = createProvider();
