"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { lenis, scrollToId } from "@/lib/motion";

const DISMISSED_KEY = "jutaku-lifestyle-dismissed";
export const openLifestylePopup = () => window.dispatchEvent(new Event("lifestyle:open"));

export function LifestylePopup() {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    const show = () => {
      previousFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    const onFirstScroll = () => {
      if (window.scrollY < 80 || sessionStorage.getItem(DISMISSED_KEY)) return;
      window.removeEventListener("scroll", onFirstScroll);
      timer = window.setTimeout(() => {
        if (!sessionStorage.getItem(DISMISSED_KEY) && !document.documentElement.classList.contains("panel-open")) show();
      }, 40_000);
    };
    window.addEventListener("lifestyle:open", show);
    window.addEventListener("scroll", onFirstScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("lifestyle:open", show);
      window.removeEventListener("scroll", onFirstScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lenis()?.stop();
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
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
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setOpen(false);
  };
  const choose = (section: string) => {
    close();
    window.setTimeout(() => scrollToId(section), 80);
  };

  if (!open) return null;
  return (
    <div className="lifestyle-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section className="lifestyle-dialog" role="dialog" aria-modal="true" aria-labelledby="lifestyle-title" aria-describedby="lifestyle-description">
        <div className="lifestyle-topline">
          <span className="lifestyle-eyebrow">Welcome / Jutaku</span>
          <button ref={closeButton} className="lifestyle-close" type="button" aria-label="Close preferences" onClick={close}><X size={20} strokeWidth={1.6} /></button>
        </div>
        <div className="lifestyle-copy">
          <span className="lifestyle-index">01 — 02</span>
          <h2 id="lifestyle-title">What are you<br /><em>looking for?</em></h2>
          <p id="lifestyle-description">Let us personalise your Skyline experience.</p>
        </div>
        <div className="lifestyle-choices">
          <button type="button" onClick={() => choose("living")}>
            <span className="lifestyle-choice-no">01</span>
            <span className="lifestyle-choice-title">Individual Living</span>
            <span className="lifestyle-choice-desc">A private space, connected to more.</span>
            <span className="lifestyle-choice-action">Explore</span>
          </button>
          <button type="button" onClick={() => choose("amenities")}>
            <span className="lifestyle-choice-no">02</span>
            <span className="lifestyle-choice-title">Modern Couple</span>
            <span className="lifestyle-choice-desc">Your place together, with more within reach.</span>
            <span className="lifestyle-choice-action">Explore</span>
          </button>
        </div>
        <p className="lifestyle-foot">MEMCO Skyline · Jutaku</p>
      </section>
    </div>
  );
}
