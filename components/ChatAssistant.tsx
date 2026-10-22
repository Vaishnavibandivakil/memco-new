"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUp, ArrowUpRight, Coins, Grid2X2, House, Layers, MapPin, Mic, Train, TrendingUp, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { answerChat, type ChatReply } from "@/lib/chat";

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

function ChatOrb() {
  return (
    <span className="chat-orb" aria-hidden="true">
      <span className="chat-orb-glow" />
      <span className="chat-orb-dots">
        {Array.from({ length: 25 }, (_, index) => <i key={index} />)}
      </span>
    </span>
  );
}

export function ChatAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [launcherVisible, setLauncherVisible] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState("");
  const nextId = useRef(1);
  const speech = useRef<SpeechRecognizer | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);
  const isWelcome = messages.length === 0;

  const closeChat = useCallback(() => {
    speech.current?.stop();
    speech.current = null;
    setOpen(false);
    setDraft("");
    setMessages([]);
    setListening(false);
    setSpeechStatus("");
    nextId.current = 1;
  }, []);

  useEffect(() => () => { speech.current?.stop(); }, []);

  useEffect(() => {
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
      if (!visible) closeChat();
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
    if (open) {
      hasOpened.current = true;
      input.current?.focus();
    } else if (hasOpened.current) {
      launcher.current?.focus();
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

  function send(question: string) {
    const text = question.trim();
    if (!text) return;
    const reply = answerChat(text);
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "visitor", text },
      { id: nextId.current++, role: "assistant", text: reply.text, details: reply.details, sections: reply.sections, action: reply.action },
    ]);
    setDraft("");
    input.current?.focus();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(draft);
  }

  function toggleMicrophone() {
    if (listening) {
      speech.current?.stop();
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
      const spoken = event.results[0]?.[0]?.transcript?.trim();
      if (spoken) {
        setDraft((current) => [current.trim(), spoken].filter(Boolean).join(" "));
        setSpeechStatus("Ready to send.");
        input.current?.focus();
      }
    };
    recognition.onerror = (event) => {
      setSpeechStatus(event.error === "not-allowed" ? "Microphone access was blocked." : "Couldn’t hear that. Please try again.");
      setListening(false);
    };
    recognition.onend = () => {
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

  return (
    <div className="chat-root">
      {open && (
        <section className={`chat-panel${isWelcome ? " is-welcome" : " is-conversation"}`} id="jutaku-chat-panel" role="dialog" aria-modal="false" aria-label="Jutaku sales chat" data-lenis-prevent>
          <header className="chat-head">
            <div className="chat-identity"><strong>Sales chat</strong><span>Jutaku</span></div>
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
              <div className="chat-welcome-copy"><p>Welcome to Jutaku</p><h2>How can I help you?</h2><span>Explore the homes, the neighbourhood, and life here.</span></div>
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
              <button type="submit" aria-label="Send question" disabled={!draft.trim()}><ArrowUp size={18} strokeWidth={1.8} /></button>
            </form>
            {speechStatus ? <p className="chat-voice-status" role="status">{speechStatus}</p> : <p className="chat-note">For current availability and prices, please confirm with the team.</p>}
          </div>
        </section>
      )}
      {launcherVisible && (
        <button ref={launcher} type="button" className={`chat-launcher${open ? " is-open" : ""}`} onClick={() => open ? closeChat() : setOpen(true)} aria-expanded={open} aria-controls="jutaku-chat-panel" aria-label={open ? "Close chat" : "Open sales chat"}>
          {open ? <X size={20} strokeWidth={1.6} /> : <ChatOrb />}
        </button>
      )}
    </div>
  );
}
