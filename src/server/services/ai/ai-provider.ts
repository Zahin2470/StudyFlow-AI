// The interface the rest of the app depends on — matches the diagram in
// ARCHITECTURE.md §5. AiService only ever talks to this; adapters below are
// swappable via AI_PROVIDER without touching any route or component.
export type ChatMessage = { role: "user" | "assistant"; content: string };

export interface AiProvider {
  chat(input: { systemPrompt: string; messages: ChatMessage[] }): Promise<string>;

  /**
   * Must return raw text that is valid JSON matching the shape AiService
   * asks for in its prompt — AiService validates it with Zod before it ever
   * reaches the database or UI (see ARCHITECTURE.md §5's "validated AI
   * output" requirement). A provider returning malformed JSON is expected
   * and handled by the caller, not by this interface.
   */
  generateJson(input: { systemPrompt: string; userPrompt: string }): Promise<string>;
}
