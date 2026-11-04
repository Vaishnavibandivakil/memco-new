"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUp, ArrowUpRight, Coins, Grid2X2, House, Layers, MapPin, Mic, Train, TrendingUp, X } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ChatReply } from "@/lib/chat";
import { ChatOrb } from "@/components/ChatOrb";

type Message = {
  id: number;
  role: "assistant" | "visitor";
  text: string;
  details?: ChatReply["details"];
  sections?: ChatReply["sections"];
  action?: ChatReply["action"];
};
type SpeechRecognizer = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognizer;
  webkitSpeechRecognition?: new () => SpeechRecognizer;
};

const suggestions = [
  { label: "The homes", question: "Tell me about the homes" },
  { label: "Amenities", question: "What amenities are there?" },
  { label: "Investment", question: "What are the investment advantages?" },
  { label: "Book a visit", question: "How can I book a visit?" },
];
const followups = [
  { label: "Pricing", question: "What is the pricing?" },
  { label: "Investment", question: "What are the investment advantages?" },
  { label: "Booking", question: "How can I book a visit?" },
  { label: "Jutaku experience", question: "What is the Jutaku Experience Centre?" },
  { label: "Amenities", question: "What amenities are there?" },
  { label: "Homes", question: "Tell me about the homes" },
  { label: "Location", question: "Where is Jutaku?" },
];
const investmentIcons = [House, Layers, Coins, MapPin, Train, Grid2X2, TrendingUp];

export function ChatAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [launcherVisible, setLauncherVisible] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [answerMode, setAnswerMode] = useState<"ai" | "curated" | null>(null);
  const [listening, setListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState("");
  const nextId = useRef(1);
  const speech = useRef<SpeechRecognizer | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const chatRoot = useRef<HTMLDivElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);
  const pending = useRef(false);
  const chatRequest = useRef<AbortController | null>(null);
  const isWelcome = messages.length === 0;

  useEffect(() => {
    const openFromQuickActions = () => setOpen(true);
    window.addEventListener("jutaku:open-chat", openFromQuickActions);
    return () => window.removeEventListener("jutaku:open-chat", openFromQuickActions);
  }, []);

  const closeChat = useCallback(() => {
    chatRequest.current?.abort();
    chatRequest.current = null;
    pending.current = false;
    speech.current?.abort();
    speech.current = null;
    setOpen(false);
    setDraft("");
    setMessages([]);
    setSending(false);
    setAnswerMode(null);
    setListening(false);
    setSpeechStatus("");
    nextId.current = 1;
  }, []);

  useEffect(() => () => { speech.current?.abort(); chatRequest.current?.abort(); }, []);

  useEffect(() => {
    if (pathname === "/location") {
      const frame = window.requestAnimationFrame(() => {
        setLauncherVisible(false);
        closeChat();
      });
      return () => window.cancelAnimationFrame(frame);
    }
    const hero = pathname === "/" ? document.querySelector<HTMLElement>(".op") : null;
    if (!hero) {
      const frame = window.requestAnimationFrame(() => setLauncherVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }
    let previous: boolean | null = null;
    const update = () => {
      const visible = hero.getBoundingClientRect().bottom <= window.innerHeight;
      if (visible === previous) return;
      previous = visible;
      setLauncherVisible(visible);
    };
    const frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname, closeChat]);

  useEffect(() => {
    if (!open) return;
    const root = chatRoot.current;
    const mobile = window.matchMedia("(max-width: 760px)");
    const viewport = window.visualViewport;
    let largestHeight = 0;

    const syncViewport = () => {
      if (!root) return;
      const isMobile = mobile.matches;
      document.documentElement.classList.toggle("chat-mobile-open", isMobile);
      if (!isMobile) {
        root.style.removeProperty("--chat-visual-top");
        root.style.removeProperty("--chat-visual-height");
        root.classList.remove("has-keyboard");
        return;
      }
      const height = viewport?.height ?? window.innerHeight;
      largestHeight = Math.max(largestHeight, height);
      root.style.setProperty("--chat-visual-top", `${viewport?.offsetTop ?? 0}px`);
      root.style.setProperty("--chat-visual-height", `${height}px`);
      root.classList.toggle("has-keyboard", document.activeElement === input.current && largestHeight - height > 120);
    };

    syncViewport();
    viewport?.addEventListener("resize", syncViewport);
    viewport?.addEventListener("scroll", syncViewport);
    window.addEventListener("resize", syncViewport);
    window.addEventListener("focusin", syncViewport);
    window.addEventListener("focusout", syncViewport);
    mobile.addEventListener("change", syncViewport);
    return () => {
      viewport?.removeEventListener("resize", syncViewport);
      viewport?.removeEventListener("scroll", syncViewport);
      window.removeEventListener("resize", syncViewport);
      window.removeEventListener("focusin", syncViewport);
      window.removeEventListener("focusout", syncViewport);
      mobile.removeEventListener("change", syncViewport);
      document.documentElement.classList.remove("chat-mobile-open");
      root?.style.removeProperty("--chat-visual-top");
      root?.style.removeProperty("--chat-visual-height");
      root?.classList.remove("has-keyboard");
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      hasOpened.current = true;
      if (!window.matchMedia("(max-width: 760px)").matches) input.current?.focus();
    } else if (hasOpened.current) {
      const quickToggle = document.querySelector<HTMLButtonElement>(".quick-actions-toggle");
      if (quickToggle && window.matchMedia("(max-width: 1150px)").matches) quickToggle.focus();
      else launcher.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open && transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeChat(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeChat]);

  async function send(question: string) {
    const text = question.trim();
    if (!text || pending.current) return;
    pending.current = true;
    setSending(true);
    const history = messages.slice(-8).map(({ role, text: content }) => ({ role: role === "visitor" ? "user" : "assistant", content }));
    setMessages((current) => [...current, { id: nextId.current++, role: "visitor", text }]);
    setDraft("");
    input.current?.focus();
    const controller = new AbortController();
    chatRequest.current = controller;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: text }] }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Chat request failed");
      const result = await response.json() as { reply: ChatReply; mode: "ai" | "curated" };
      if (controller.signal.aborted || typeof result.reply?.text !== "string") return;
      const reply = result.reply;
      setAnswerMode(result.mode);
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: reply.text, details: reply.details, sections: reply.sections, action: reply.action }]);
    } catch {
      if (controller.signal.aborted) return;
      const reply: ChatReply = { topic: "other", text: "I’m having trouble answering right now. Please try again in a moment." };
      setAnswerMode("curated");
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: reply.text, details: reply.details, sections: reply.sections, action: reply.action }]);
    } finally {
      if (!controller.signal.aborted) {
        pending.current = false;
        chatRequest.current = null;
        setSending(false);
      }
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(draft);
  }

  function toggleMicrophone() {
    if (speech.current) {
      const recognition = speech.current;
      speech.current = null;
      recognition.abort();
      setListening(false);
      setSpeechStatus("Stopped listening.");
      return;
    }
    const voiceWindow = window as SpeechWindow;
    const Recognizer = voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition;
    if (!Recognizer) {
      setSpeechStatus("Voice input isn’t available in this browser.");
      return;
    }
    const recognition = new Recognizer();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      if (speech.current !== recognition) return;
      const spoken = event.results[0]?.[0]?.transcript?.trim();
      if (spoken) {
        setDraft((current) => [current.trim(), spoken].filter(Boolean).join(" "));
        setSpeechStatus("Ready to send.");
        input.current?.focus();
      }
    };
    recognition.onerror = (event) => {
      if (speech.current !== recognition) return;
      speech.current = null;
      setSpeechStatus(event.error === "not-allowed" ? "Microphone access was blocked." : "Couldn’t hear that. Please try again.");
      setListening(false);
    };
    recognition.onend = () => {
      if (speech.current !== recognition) return;
      setListening(false);
      speech.current = null;
    };
    speech.current = recognition;
    try {
      recognition.start();
      setListening(true);
      setSpeechStatus("Listening…");
    } catch {
      speech.current = null;
      setListening(false);
      setSpeechStatus("Voice input couldn’t start. Please try again.");
    }
  }

  if (pathname === "/privacy-policy" || pathname === "/terms-and-conditions" || pathname === "/location") return null;

  return (
    <div ref={chatRoot} className={`chat-root${open ? " is-open" : ""}`}>
      {open && (
        <section className={`chat-panel${isWelcome ? " is-welcome" : " is-conversation"}`} id="jutaku-chat-panel" role="dialog" aria-modal="false" aria-label="Jutaku assistant" data-lenis-prevent>
          <header className="chat-head">
            <div className="chat-identity"><strong>Jutaku assistant</strong><span>{answerMode === "ai" ? "AI guide" : "Website guide"}</span></div>
            <button type="button" className="chat-close" onClick={closeChat} aria-label="Close chat"><X size={18} strokeWidth={1.6} /></button>
          </header>

          {isWelcome ? (
            <div className="chat-welcome">
              <div className="chat-welcome-art">
                <ChatOrb />
                <div className="chat-suggestions" aria-label="Suggested questions">
                  {suggestions.map((item) => (
                    <button type="button" key={item.label} onClick={() => send(item.question)}>{item.label}<ArrowUpRight size={11} aria-hidden="true" /></button>
                  ))}
                </div>
              </div>
              <div className="chat-welcome-copy"><p>Welcome to Jutaku</p><h2>How can I help you?</h2><span>Ask about the homes, amenities and life at Jutaku.</span></div>
            </div>
          ) : (
            <div className="chat-transcript" ref={transcript} role="log" aria-live="polite" aria-relevant="additions text">
              {messages.map((message) => (
                <div key={message.id} className={`chat-message is-${message.role}`}>
                  <div className="chat-message-content">
                    <p>{message.text}</p>
                    {message.sections?.map((section, sectionIndex) => (
                      <div className="chat-answer-section" key={section.heading}>
                        <h3>{section.heading}</h3>
                        <div className="chat-answer-items">
                          {section.items.map((item, itemIndex) => {
                            const Icon = investmentIcons[sectionIndex === 0 ? itemIndex : itemIndex + 3];
                            return <div className="chat-answer-item" key={item.title}><span className="chat-answer-icon"><Icon size={16} strokeWidth={1.7} aria-hidden="true" /></span><div><strong>{item.title}</strong><span>{item.body}</span></div></div>;
                          })}
                        </div>
                      </div>
                    ))}
                    {message.details && (
                      <ul className="chat-message-details">
                        {message.details.map((detail) => <li key={detail}>{detail}</li>)}
                      </ul>
                    )}
                    {message.action && (
                      <a href={message.action.href} onClick={closeChat}>{message.action.label}<ArrowUpRight size={14} aria-hidden="true" /></a>
                    )}
                  </div>
                </div>
              ))}
              {sending && <div className="chat-message is-assistant"><div className="chat-message-content"><p role="status">Thinking…</p></div></div>}
            </div>
          )}

          <div className="chat-bottom">
            {!isWelcome && (
              <div className="chat-followups" aria-label="Explore more topics">
                {followups.map((item) => <button type="button" key={item.label} onClick={() => send(item.question)}>{item.label}</button>)}
              </div>
            )}
            <form className="chat-form" onSubmit={onSubmit}>
              <label className="sr-only" htmlFor="jutaku-chat-input">Your question</label>
              <input ref={input} id="jutaku-chat-input" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={300} placeholder="Ask about Jutaku…" autoComplete="off" />
              <button type="button" className={`chat-mic${listening ? " is-listening" : ""}`} onClick={toggleMicrophone} aria-label={listening ? "Stop listening" : "Speak your question"} aria-pressed={listening} title={listening ? "Stop listening" : "Speak your question"}><Mic size={17} strokeWidth={1.8} /></button>
              <button type="submit" aria-label="Send question" disabled={!draft.trim() || sending}><ArrowUp size={18} strokeWidth={1.8} /></button>
            </form>
            {speechStatus ? <p className="chat-voice-status" role="status">{speechStatus}</p> : <p className="chat-note">AI answers can be incomplete. Don’t share private details; confirm prices with the team.</p>}
          </div>
        </section>
      )}
      {launcherVisible && (
        <button ref={launcher} type="button" className={`chat-launcher${open ? " is-open" : ""}`} onClick={() => open ? closeChat() : setOpen(true)} aria-expanded={open} aria-controls="jutaku-chat-panel" aria-label={open ? "Close chat" : "Open Jutaku assistant"}>
          {open ? <X size={22} strokeWidth={2} aria-hidden="true" /> : <ChatOrb />}
        </button>
      )}
    </div>
  );
}
