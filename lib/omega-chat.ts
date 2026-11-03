export type OmegaTurn = { role: "user" | "assistant"; content: string };

export function omegaChatRequest(instructions: string, turns: OmegaTurn[], model = "omega-plus", maxTokens = 600) {
  return {
    model,
    max_tokens: maxTokens,
    stream: false,
    messages: [{ role: "system", content: instructions }, ...turns],
  };
}

export function omegaScope(payload: unknown): "project" | "other" {
  return /^PROJECT\b/i.test(omegaChatText(payload).trim()) ? "project" : "other";
}

export function isPlainCalculation(question: string): boolean {
  const expression = question.trim().replace(/^(?:what(?:'s| is)\s+)/i, "");
  return /\d/.test(expression) && /^[\d\s+*/^%().=\-]+\??$/.test(expression);
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
