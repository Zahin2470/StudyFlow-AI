import type { AiProvider, ChatMessage } from "./ai-provider";

// Gemini's generateContent API has a different shape than the OpenAI-style
// adapters (roles are "user"/"model", content is nested under "parts", the
// system prompt is a separate field) — isolated here so that difference
// never leaks into AiService.
export class GeminiProvider implements AiProvider {
  private apiKey = process.env.AI_API_KEY!;
  private model = process.env.AI_MODEL || "gemini-1.5-flash";

  private async generate(systemPrompt: string, contents: { role: string; parts: { text: string }[] }[], jsonMode: boolean) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        ...(jsonMode ? { generationConfig: { responseMimeType: "application/json" } } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Gemini request failed (${res.status}): ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }

  chat({ systemPrompt, messages }: { systemPrompt: string; messages: ChatMessage[] }) {
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    return this.generate(systemPrompt, contents, false);
  }

  generateJson({ systemPrompt, userPrompt }: { systemPrompt: string; userPrompt: string }) {
    return this.generate(systemPrompt, [{ role: "user", parts: [{ text: userPrompt }] }], true);
  }
}
