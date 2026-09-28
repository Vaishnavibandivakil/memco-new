"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, scrollToId } from "@/lib/motion";
import { openHomes } from "@/components/sections/Homes";

/* Fixed chrome: a rounded header bar with the MEMCO + Jutaku logos, links and the "Select a home" action,
   and the hairline progress rail with section number (left).
   Colour follows the section under the logo: its data-tone ("dark" | "light") is copied to html[data-tone]. */
const LINKS: [string, string][] = [["location", "Location"], ["amenities", "Amenities"], ["interiors", "Interiors"], ["pricing", "Pricing"], ["contact", "Contact"]];

export function Chrome() {
  const bar = useRef<HTMLSpanElement>(null);
  const [no, setNo] = useState("01");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Esc closes the menu only when it is the top layer — if the homes panel is open, Esc belongs to the panel
    const key = (e: KeyboardEvent) => { if (e.key === "Escape" && !document.documentElement.classList.contains("panel-open")) setOpen(false); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const triggers: ScrollTrigger[] = [];
    const build = () => {
      triggers.splice(0).forEach((t) => t.kill());
      const sections = [...document.querySelectorAll<HTMLElement>("[data-tone]")];
      let tone = "", idx = -1;
      triggers.push(ScrollTrigger.create({
        start: 0, end: "max", refreshPriority: -1,
        onUpdate: (st) => {
          if (bar.current) bar.current.style.transform = `scaleY(${st.progress})`;
          /* the section actually under the logo wins (later siblings overlap earlier ones) */
          let k = -1;
          sections.forEach((el, j) => { const r = el.getBoundingClientRect(); if (r.top <= 40 && r.bottom > 40) k = j; });
          if (k < 0) return;
          const t = sections[k].dataset.tone || "dark";
          if (t !== tone) { tone = t; root.dataset.tone = t; }
          if (k !== idx) { idx = k; setNo(String(k + 1).padStart(2, "0")); }
        },
      }));
      ScrollTrigger.refresh();
    };
    // wait one frame so every section's own pins exist before measuring
    const id = window.setTimeout(build, 30);
    return () => { clearTimeout(id); triggers.forEach((t) => t.kill()); };
  }, []);

  useEffect(() => { gsap.fromTo(".chrome", { opacity: 0 }, { opacity: 1, duration: 1, delay: 2.6 }); }, []);

  return (
    <div className="chrome">
      {/* a normal header: one rounded bar — both logos, section links, the primary action */}
      <header className={`hdr${open ? " is-open" : ""}`}>
        {/* the logo is the switch: the pill opens outward to reveal the links and the action, and stays
            open until the visitor closes it again (logo / ✕ or Esc) — links and the action don't close it */}
        <button type="button" className="hdr-brand" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="hdr-more" aria-label={open ? "Close menu" : "Open menu"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hdr-memco" src="/brand/lockup-h.png" alt="MEMCO Skyline" width={856} height={243} />
          <span className="hdr-div" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hdr-jutaku" src="/brand/jutaku.png" alt="Jutaku" width={379} height={260} />
          <span className="hdr-plus" aria-hidden />
        </button>
        <div className="hdr-more" id="hdr-more" inert={!open}>
          <div className="hdr-inner">
            <nav className="hdr-nav" aria-label="Primary">
              {LINKS.map(([id, label], i) => (
                <a key={id} href={`#${id}`} style={{ ["--i" as string]: i }} onClick={(e) => { e.preventDefault(); scrollToId(id); }}>{label}</a>
              ))}
            </nav>
            <button type="button" className="hdr-cta" style={{ ["--i" as string]: LINKS.length }} onClick={openHomes}>Select a home</button>
          </div>
        </div>
      </header>

      <div className="rail" aria-hidden>
        <span className="rail-line"><span ref={bar} className="rail-fill" /></span>
        <span className="rail-no lbl">{no}</span>
        <span className="rail-scroll lbl">Scroll</span>
      </div>

    </div>
  );
}
