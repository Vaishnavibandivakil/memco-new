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

export function isCorporateOnlyQuestion(question: string): boolean {
  return /\bmemco\b/i.test(question) &&
    /\b(founder|founded|ceo|chairman|leadership|engineering|corporate|company history|other businesses|incorporated|what does memco do)\b/i.test(question) &&
    !/\b(jutaku|this project)\b/i.test(question);
}

export function isProjectBrandQuestion(question: string): boolean {
  return !isCorporateOnlyQuestion(question) &&
    /\b(memco|jutaku|skyline)\b/i.test(question) &&
    !/\b(capital of|bitcoin|recipe|weather|coding|programming)\b/i.test(question);
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
