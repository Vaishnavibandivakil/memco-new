"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { lenis } from "@/lib/motion";

const NEXT_PROMPT_KEY = "jutaku-find-your-fit-next-prompt-v4";
const PROMPT_COOLDOWN = 4 * 24 * 60 * 60 * 1_000;
const promptOnCooldown = () => {
  try { return Number(window.localStorage.getItem(NEXT_PROMPT_KEY)) > Date.now(); }
  catch { return false; }
};
const rememberPrompt = () => {
  try { window.localStorage.setItem(NEXT_PROMPT_KEY, String(Date.now() + PROMPT_COOLDOWN)); }
  catch { /* Private browsing can block storage; the current visit still prompts only once. */ }
};
export const openLifestylePopup = () => window.dispatchEvent(new Event("lifestyle:open"));

export function LifestylePopup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const promptedThisVisit = useRef(false);

  useEffect(() => {
    let timer: number | undefined;
    const show = (manual = false) => {
      if (!manual && (promptedThisVisit.current || promptOnCooldown())) return;
      if (document.querySelector(".lifestyle-dialog")) return;
      window.clearTimeout(timer);
      promptedThisVisit.current = true;
      rememberPrompt();
      previousFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    const showWhenAvailable = () => {
      if (promptedThisVisit.current || promptOnCooldown()) return;
      if (document.hidden || document.documentElement.classList.contains("panel-open") || document.documentElement.classList.contains("intro-active")) {
        timer = window.setTimeout(showWhenAvailable, 1_000);
        return;
      }
      show();
    };
    const onFirstScroll = () => {
      if (window.scrollY < 80) return;
      window.removeEventListener("scroll", onFirstScroll);
      if (promptOnCooldown()) return;
      timer = window.setTimeout(showWhenAvailable, 10_000);
    };
    const onManualOpen = () => show(true);
    window.addEventListener("lifestyle:open", onManualOpen);
    window.addEventListener("scroll", onFirstScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("lifestyle:open", onManualOpen);
      window.removeEventListener("scroll", onFirstScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lenis()?.stop();
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
      if (event.key !== "Tab") return;
      const items = document.querySelectorAll<HTMLElement>(".lifestyle-dialog button");
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis()?.start();
      window.removeEventListener("keydown", onKey);
      previousFocus.current?.focus();
    };
  }, [open]);

  const close = () => {
    setOpen(false);
  };
  const choose = (page: "/individual-living" | "/modern-couple") => {
    close();
    router.push(page);
  };

  if (!open) return null;
  return (
    <div className="lifestyle-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section className="lifestyle-dialog" role="dialog" aria-modal="true" aria-labelledby="lifestyle-title" aria-describedby="lifestyle-description">
        <div className="lifestyle-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/interior-bedroom-open-plan.jpg" alt="A light-filled home at Jutaku" />
        </div>
        <div className="lifestyle-content">
          <div className="lifestyle-topline">
            <span className="lifestyle-eyebrow">A home that fits you</span>
            <button ref={closeButton} className="lifestyle-close" type="button" aria-label="Close preferences" onClick={close}><X size={19} strokeWidth={1.6} /></button>
          </div>
          <div className="lifestyle-copy">
            <h2 id="lifestyle-title">What are you<br />looking for?</h2>
            <p id="lifestyle-description">Let us personalise your Skyline experience.</p>
          </div>
          <div className="lifestyle-choices">
            <button type="button" onClick={() => choose("/individual-living")}>
              <span className="lifestyle-choice-no">01</span>
              <span className="lifestyle-choice-text"><strong>Individual living</strong><small>A private space, connected to more.</small></span>
              <span className="lifestyle-choice-mark" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => choose("/modern-couple")}>
              <span className="lifestyle-choice-no">02</span>
              <span className="lifestyle-choice-text"><strong>Modern couple</strong><small>Your place together, with more within reach.</small></span>
              <span className="lifestyle-choice-mark" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
