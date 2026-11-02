import { NextResponse } from "next/server";
import { answerChat } from "@/lib/chat";
import { CHAT_INSTRUCTIONS } from "@/lib/chat-knowledge";

export const runtime = "nodejs";

type Turn = { role: "user" | "assistant"; content: string };
const MAX_BODY = 6000;
const MAX_TURNS = 9;
const WINDOW_MS = 60_000;
const LIMIT = 12;
const requests = new Map<string, { count: number; reset: number }>();

function validTurns(value: unknown): value is Turn[] {
  return Array.isArray(value) && value.length > 0 && value.length <= MAX_TURNS &&
    value.every((turn) => turn && typeof turn === "object" &&
      (turn.role === "user" || turn.role === "assistant") &&
      typeof turn.content === "string" && turn.content.trim().length > 0 &&
      turn.content.length <= (turn.role === "user" ? 300 : 1500)) &&
    value.at(-1)?.role === "user";
}

function responseText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const result = payload as { output_text?: unknown; output?: { type?: string; content?: { type?: string; text?: string }[] }[] };
  if (typeof result.output_text === "string") return result.output_text.trim();
  return result.output?.flatMap((item) => item.type === "message" ? item.content ?? [] : [])
    .filter((item) => item.type === "output_text" && typeof item.text === "string")
    .map((item) => item.text!.trim()).join("\n").trim() ?? "";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
    }
  }

  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const current = requests.get(ip);
  const limit = current && current.reset > now ? current : { count: 0, reset: now + WINDOW_MS };
  if (++limit.count > LIMIT) {
    return NextResponse.json({ error: "Please wait a moment before asking another question." }, { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": "60" } });
  }
  requests.set(ip, limit);
  if (requests.size > 1000) for (const [key, entry] of requests) if (entry.reset <= now) requests.delete(key);

  let turns: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) return NextResponse.json({ error: "Message is too long." }, { status: 413 });
    turns = JSON.parse(raw).messages;
  } catch {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }
  if (!validTurns(turns)) return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });

  const lastQuestion = turns.at(-1)!.content;
  const curated = answerChat(lastQuestion);
  const fallback = () => NextResponse.json({ reply: curated, mode: "curated" }, { headers: { "Cache-Control": "no-store" } });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return fallback();

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || "gpt-6-luna",
        instructions: CHAT_INSTRUCTIONS,
        input: turns,
        reasoning: { effort: "none" },
        max_output_tokens: 420,
        store: false,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(18_000),
    });
    if (!upstream.ok) {
      console.error("Jutaku chat API error:", upstream.status);
      return fallback();
    }
    const text = responseText(await upstream.json());
    if (!text) return fallback();
    return NextResponse.json({ reply: { topic: curated.topic, text: text.slice(0, 2000), action: curated.action }, mode: "ai" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Jutaku chat request failed:", error instanceof Error ? error.name : "unknown");
    return fallback();
  }
}
