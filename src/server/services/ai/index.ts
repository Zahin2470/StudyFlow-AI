import type { AiProvider } from "./ai-provider";
import { OpenAiProvider } from "./openai.provider";
import { GeminiProvider } from "./gemini.provider";
import { GrokProvider } from "./grok.provider";

// Selected once via AI_PROVIDER — same factory pattern as the storage
// provider in Phase 5. AiService and every route depend only on the
// AiProvider interface, never on a concrete adapter.
function createProvider(): AiProvider | null {
  if (!process.env.AI_API_KEY) return null; // no key configured — handled by callers

  switch (process.env.AI_PROVIDER ?? "gemini") {
    case "openai":
      return new OpenAiProvider();
    case "grok":
      return new GrokProvider();
    case "gemini":
      return new GeminiProvider();
    default:
      return null;
  }
}

export const aiProvider = createProvider();
