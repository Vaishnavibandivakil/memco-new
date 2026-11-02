import { NextResponse } from "next/server";
import { answerChat, unknownMemcoAnswer } from "@/lib/chat";
import { CHAT_INSTRUCTIONS, CHAT_SCOPE_INSTRUCTIONS } from "@/lib/chat-knowledge";
import { isPlainCalculation, omegaChatRequest, omegaChatText, omegaScope, type OmegaTurn } from "@/lib/omega-chat";

export const runtime = "nodejs";

const MAX_BODY = 6000;
const MAX_TURNS = 9;
const WINDOW_MS = 60_000;
const LIMIT = 12;
const requests = new Map<string, { count: number; reset: number }>();

function validTurns(value: unknown): value is OmegaTurn[] {
  return Array.isArray(value) && value.length > 0 && value.length <= MAX_TURNS &&
    value.every((turn) => turn && typeof turn === "object" &&
      (turn.role === "user" || turn.role === "assistant") &&
      typeof turn.content === "string" && turn.content.trim().length > 0 &&
      turn.content.length <= (turn.role === "user" ? 300 : 1500)) &&
    value.at(-1)?.role === "user";
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
  const outOfScope = () => NextResponse.json({ reply: answerChat("unrelated question"), mode: "curated" }, { headers: { "Cache-Control": "no-store" } });
  if (isPlainCalculation(lastQuestion)) return outOfScope();
  const fallback = () => NextResponse.json({ reply: curated.topic === "other" ? unknownMemcoAnswer() : curated, mode: "curated" }, { headers: { "Cache-Control": "no-store" } });
  const key = process.env.OMEGA_API_KEY;
  if (!key) return fallback();

  let projectVerified = false;
  try {
    const model = process.env.OMEGA_CHAT_MODEL || "omega-plus";
    const callOmega = async (instructions: string, history: OmegaTurn[], maxTokens: number, timeout: number) => {
      const upstream = await fetch("https://api.omegaplusapi.com/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(omegaChatRequest(instructions, history, model, maxTokens)),
        cache: "no-store",
        signal: AbortSignal.timeout(timeout),
      });
      if (!upstream.ok) throw new Error(`Omega API returned ${upstream.status}`);
      return upstream.json();
    };
    const scope = omegaScope(await callOmega(CHAT_SCOPE_INSTRUCTIONS, turns.slice(-5), 16, 15_000));
    if (scope === "other") return outOfScope();
    projectVerified = true;
    const text = omegaChatText(await callOmega(CHAT_INSTRUCTIONS, turns, 600, 25_000));
    if (!text) return fallback();
    return NextResponse.json({ reply: { topic: curated.topic, text: text.slice(0, 2000), action: curated.action }, mode: "ai" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Jutaku chat request failed:", error instanceof Error ? error.message : "unknown");
    return projectVerified || /\b(memco|jutaku|skyline)\b/i.test(lastQuestion) ? fallback() : outOfScope();
  }
}
