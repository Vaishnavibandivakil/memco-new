export type OmegaTurn = { role: "user" | "assistant"; content: string };

export function omegaChatRequest(instructions: string, turns: OmegaTurn[], model = "omega-plus") {
  return {
    model,
    max_tokens: 600,
    stream: false,
    messages: [{ role: "system", content: instructions }, ...turns],
  };
}

export function omegaChatText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const response = payload as { choices?: { message?: { content?: unknown } }[] };
  const content = response.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content
    .filter((part): part is { type: "text"; text: string } => part?.type === "text" && typeof part.text === "string")
    .map((part) => part.text.trim())
    .filter(Boolean)
    .join("\n");
}
