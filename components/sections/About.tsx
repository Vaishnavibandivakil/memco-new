"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const leaders = [
  { name: "Joshua Rajkumar", role: "CEO, MEMCO", note: "Leads MEMCO, the Bengaluru engineering company behind MEMCO Skyline.", image: "/images/joshua-rajkumar.jpg" },
  { name: "Miriam Rajkumar", role: "Director, MEMCO", note: "Part of the parent company's leadership team as MEMCO expands into real estate.", image: "/images/miriam-rajkumar.jpg" },
  { name: "VPS Raju", role: "Project Director, Real Estate", note: "Leads MEMCO's real estate project work and development direction.", image: "/images/vps-raju.jpg" },
];

export function About() {
  const section = useRef<HTMLElement>(null);
  const portraits = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!section.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % leaders.length), 4500);
    return () => window.clearInterval(timer);
  }, [inView, paused]);

  useEffect(() => {
    const rail = portraits.current;
    const card = rail?.children[active] as HTMLElement | undefined;
    if (!rail || !card) return;
    rail.scrollTo({ left: card.offsetLeft - rail.offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, [active]);

  const select = (index: number) => setActive((index + leaders.length) % leaders.length);

  return (
    <section id="about" ref={section} className="about" data-tone="light" aria-labelledby="about-title">
      <div className="about-layout">
        <div className="about-copy">
          <div className="about-intro">
            <p className="lbl">About MEMCO Skyline</p>
            <h2 id="about-title">The experience <span>behind Jutaku.</span></h2>
            <p>Jutaku is a MEMCO Skyline project backed by 41 years of experience at its parent company, MEMCO Associates. Founded in Bengaluru in 1985, MEMCO works across engineering, infrastructure and technology.</p>
            <a href="https://memco.in/" target="_blank" rel="noopener noreferrer">Meet the parent company <span aria-hidden="true">↗</span></a>
          </div>

          <div className="about-team">
            <div className="about-team-heading"><p className="lbl">The people behind MEMCO</p><a href="https://memco.in/leadership/" target="_blank" rel="noopener noreferrer">MEMCO leadership <span aria-hidden="true">↗</span></a></div>
            <div className="about-team-list">
              {leaders.map((person, index) => (
                <article key={person.name} className={active === index ? "is-active" : ""}>
                  <h3><button type="button" onClick={() => select(index)} aria-label={`Show ${person.name}'s portrait`} aria-pressed={active === index}>{person.name}</button></h3>
                  <p className="about-role">{person.role}</p>
                  <p>{person.note}</p>
                </article>
              ))}
            </div>
            <Link className="about-book" href="/book-visit">Meet the Jutaku team at the Experience Centre</Link>
          </div>
        </div>

        <div className="about-portraits" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
          <div className="about-portrait-viewport" ref={portraits} aria-label="MEMCO leadership portraits">
            {leaders.map((person, index) => (
              <button key={person.name} className={`about-portrait-card${active === index ? " is-active" : ""}`} type="button" onClick={() => select(index)} aria-label={`Show ${person.name}'s details`} aria-pressed={active === index}>
                <Image src={person.image} alt={person.name} width={570} height={696} sizes="(max-width: 900px) 70vw, 28vw" />
                <span className="about-portrait-name">{person.name}</span>
                <span className="about-portrait-dot" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="about-portrait-controls">
            <span className="about-portrait-count">0{active + 1} / 0{leaders.length}</span>
            <span className="about-portrait-progress" aria-hidden="true"><span style={{ width: `${((active + 1) / leaders.length) * 100}%` }} /></span>
            <button type="button" onClick={() => select(active - 1)} aria-label="Previous leader">←</button>
            <button type="button" onClick={() => select(active + 1)} aria-label="Next leader">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
