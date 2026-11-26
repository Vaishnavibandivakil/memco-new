"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const leaders = [
  { name: "Joshua Rajkumar", role: "CEO, MEMCO", note: "Leads MEMCO, the Bengaluru engineering company behind MEMCO Skyline.", image: "/images/joshua-rajkumar.jpg" },
  { name: "Miriam Rajkumar", role: "Director, MEMCO", note: "Part of the parent company's leadership team as MEMCO expands into real estate.", image: "/images/miriam-rajkumar.jpg" },
  { name: "VPS Raju", role: "Project Director, Real Estate", note: "Leads MEMCO's real estate project work and development direction.", image: "/images/vps-raju.jpg" },
];

export function About() {
  const portraits = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const select = (index: number) => {
    if (suppressClick.current) return;
    setActive(index);
    const rail = portraits.current;
    const card = rail?.children[index] as HTMLElement | undefined;
    if (rail && card) rail.scrollTo({ left: card.offsetLeft - rail.offsetLeft, behavior: "smooth" });
  };

  const updateProgress = () => {
    const rail = portraits.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setProgress(max > 0 ? rail.scrollLeft / max : 0);
    const firstCard = rail.firstElementChild as HTMLElement | null;
    if (firstCard) {
      const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap) || 0;
      setActive(Math.min(leaders.length - 1, Math.round(rail.scrollLeft / (firstCard.offsetWidth + gap))));
    }
  };

  const finishDrag = (rail: HTMLDivElement, pointerId: number) => {
    if (drag.current?.moved) {
      suppressClick.current = true;
      window.requestAnimationFrame(() => { suppressClick.current = false; });
    }
    drag.current = null;
    rail.classList.remove("is-dragging");
    if (rail.hasPointerCapture(pointerId)) rail.releasePointerCapture(pointerId);
  };

  return (
    <section id="about" className="about" data-tone="light" aria-labelledby="about-title">
      <div className="about-layout">
        <div className="about-copy">
          <div className="about-intro">
            <p className="lbl">About MEMCO Skyline</p>
            <h2 id="about-title">The experience <span>behind Jutaku.</span></h2>
            <p>Jutaku is a MEMCO Skyline project backed by 41 years of experience at its parent company, MEMCO Associates. Founded in Bengaluru in 1985, MEMCO works across engineering, infrastructure and technology.</p>
            <div className="about-actions">
              <a className="about-action" href="https://memco.in/" target="_blank" rel="noopener noreferrer">Meet the parent company</a>
              <a className="about-action" href="https://memco.in/leadership/" target="_blank" rel="noopener noreferrer">MEMCO leadership</a>
            </div>
          </div>

        </div>

        <div className="about-portraits">
          <div className="about-portraits-heading"><p className="lbl">The people behind MEMCO</p></div>
          <div className="about-portrait-stage">
            <div className="about-portrait-viewport" ref={portraits} aria-label="MEMCO leadership portraits" onScroll={updateProgress}
              onPointerDown={(event) => { if (event.pointerType === "mouse" && event.button === 0) drag.current = { startX: event.clientX, startScroll: event.currentTarget.scrollLeft, moved: false }; }}
              onPointerMove={(event) => {
                if (!drag.current) return;
                const delta = event.clientX - drag.current.startX;
                if (!drag.current.moved && Math.abs(delta) > 4) {
                  drag.current.moved = true;
                  event.currentTarget.classList.add("is-dragging");
                  event.currentTarget.setPointerCapture(event.pointerId);
                }
                if (drag.current.moved) event.currentTarget.scrollLeft = drag.current.startScroll - delta;
              }}
              onPointerUp={(event) => finishDrag(event.currentTarget, event.pointerId)}
              onPointerCancel={(event) => finishDrag(event.currentTarget, event.pointerId)}
              onPointerLeave={(event) => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) drag.current = null; }}>
              {leaders.map((person, index) => (
                <button key={person.name} className={`about-portrait-card${active === index ? " is-active" : ""}`} type="button" onClick={() => select(index)} aria-label={`${person.name}, ${person.role}. ${person.note}`} aria-pressed={active === index}>
                  <span className="about-portrait-photo"><Image src={person.image} alt={person.name} width={570} height={696} sizes="(max-width: 900px) 70vw, 28vw" draggable={false} /></span>
                  <span className="about-portrait-label"><strong>{person.name}</strong><span>{person.role}</span></span>
                </button>
              ))}
            </div>
          </div>
          <span className="about-portrait-progress" aria-hidden="true"><span style={{ left: `${progress * 66.667}%` }} /></span>
        </div>
      </div>
    </section>
  );
}
