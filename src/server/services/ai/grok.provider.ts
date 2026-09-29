import type { AiProvider, ChatMessage } from "./ai-provider";

// xAI's Grok API is OpenAI-compatible (same request/response shape) — this
// is nearly identical to the OpenAI adapter on purpose. If xAI's API
// diverges from that compatibility in the future, this is the one file to
// update; AiService and everything above it is unaffected either way.
export class GrokProvider implements AiProvider {
  private apiKey = process.env.AI_API_KEY!;
  private model = process.env.AI_MODEL || "grok-2-latest";

  private async complete(messages: { role: string; content: string }[], jsonMode: boolean) {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Grok request failed (${res.status}): ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  chat({ systemPrompt, messages }: { systemPrompt: string; messages: ChatMessage[] }) {
    return this.complete([{ role: "system", content: systemPrompt }, ...messages], false);
  }

  generateJson({ systemPrompt, userPrompt }: { systemPrompt: string; userPrompt: string }) {
    return this.complete(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      true
    );
  }
}
