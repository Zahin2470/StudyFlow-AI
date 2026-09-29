import type { AiProvider, ChatMessage } from "./ai-provider";

// OpenAI-compatible Chat Completions API. Model is overridable via
// AI_MODEL since OpenAI's lineup changes faster than this file should need to.
export class OpenAiProvider implements AiProvider {
  private apiKey = process.env.AI_API_KEY!;
  private model = process.env.AI_MODEL || "gpt-4o-mini";

  private async complete(messages: { role: string; content: string }[], jsonMode: boolean) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
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
      throw new Error(`OpenAI request failed (${res.status}): ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  chat({ systemPrompt, messages }: { systemPrompt: string; messages: ChatMessage[] }) {
    return this.complete(
      [{ role: "system", content: systemPrompt }, ...messages],
      false
    );
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
