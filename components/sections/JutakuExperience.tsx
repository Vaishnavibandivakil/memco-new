"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { scrollToId } from "@/lib/motion";

export function JutakuExperience() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const bookButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!bookingOpen) return;
    const root = document.documentElement;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBookingOpen(false);
      if (event.key !== "Tab") return;
      const dialog = document.querySelector<HTMLElement>(".jx-dialog");
      const focusable = dialog?.querySelectorAll<HTMLElement>("button, a[href]");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    root.classList.add("jx-booking-open");
    const opener = bookButton.current;
    window.__lenis?.stop();
    window.addEventListener("keydown", onKeyDown);
    closeButton.current?.focus();
    return () => {
      root.classList.remove("jx-booking-open");
      window.__lenis?.start();
      window.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [bookingOpen]);

  return (
    <section className="jx" data-tone="dark" aria-labelledby="jutaku-experience-title">
      <div className="jx-stage">
        <div className="jx-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/jutaku-experience-art.jpg" alt="Illustrated homes beside a landscaped waterfront" loading="lazy" />
        </div>
        <div className="jx-content">
          <h2 id="jutaku-experience-title">
            <span className="jx-title-lead">Book for</span>
            <span className="jx-title-main">Jutaku</span>
            <span className="jx-title-main">Experience</span>
          </h2>
          <button ref={bookButton} type="button" className="pill lbl jx-book-btn" onClick={() => setBookingOpen(true)}>
            Book Now <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
      <section id="interiors" className="jx-arch" data-tone="light" aria-labelledby="interiors-title">
        <h2 id="interiors-title" className="disp jx-arch-title">The space<br />to <span>live in</span></h2>
      </section>
      {bookingOpen && (
        <div className="jx-modal" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}>
          <div className="jx-dialog" role="dialog" aria-modal="true" aria-labelledby="jx-dialog-title" aria-describedby="jx-dialog-copy">
            <button ref={closeButton} type="button" className="jx-dialog-close" aria-label="Close booking dialog" onClick={() => setBookingOpen(false)}><X size={24} strokeWidth={2.4} /></button>
            <div className="jx-dialog-art" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/jutaku-white.png" alt="" />
            </div>
            <div className="jx-dialog-body">
              <span className="jx-dialog-meta">A personal invitation · Singasandra</span>
              <h2 id="jx-dialog-title"><span>See what life at</span><span>Jutaku feels like.</span></h2>
              <p id="jx-dialog-copy">Come by for a one-hour walkthrough of the Experience Centre. We’ll show you around and make time for your questions.</p>
              <div className="jx-dialog-actions">
                <Link className="jx-dialog-primary" href="/book-visit">Book now <span aria-hidden="true">↗</span></Link>
                <button type="button" className="jx-dialog-contact" onClick={() => { setBookingOpen(false); requestAnimationFrame(() => scrollToId("contact")); }}>Contact us</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
