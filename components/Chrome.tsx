"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, scrollToId } from "@/lib/motion";
import { WA } from "@/lib/data";
import { openHomes } from "@/components/sections/Homes";

/* Fixed chrome from the reference: rotating seal (top-left), stacked serif CTA + small links (top-right),
   hairline progress rail with section number (left), round contact button (bottom-right).
   Colour follows the section under the logo: its data-tone ("dark" | "light") is copied to html[data-tone]. */
export function Chrome() {
  const seal = useRef<SVGSVGElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [no, setNo] = useState("01");

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
          if (seal.current) seal.current.style.transform = `rotate(${st.progress * 540}deg)`;
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
      <a className="seal" href="#top" onClick={(e) => { e.preventDefault(); scrollToId("top"); }} aria-label="MEMCO Skyline · Jutaku, back to top">
        <svg ref={seal} viewBox="0 0 100 100" aria-hidden>
          <defs><path id="seal-path" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
          <text><textPath href="#seal-path" startOffset="0">MEMCO · SKYLINE · JUTAKU · BEGUR · MEMCO · SKYLINE · JUTAKU · BEGUR ·</textPath></text>
        </svg>
        <span className="seal-mark" aria-hidden />
      </a>

      <nav className="topnav" aria-label="Primary">
        <button type="button" className="topnav-cta" onClick={openHomes}>Select<br />a home</button>
        <a className="lbl" href={WA()} target="_blank" rel="noreferrer">Book a visit</a>
        <a className="lbl" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>Contact</a>
      </nav>

      <div className="rail" aria-hidden>
        <span className="rail-line"><span ref={bar} className="rail-fill" /></span>
        <span className="rail-no lbl">{no}</span>
        <span className="rail-scroll lbl">Scroll</span>
      </div>

      <a className="fab" href={WA()} target="_blank" rel="noreferrer" aria-label="Chat with MEMCO Skyline on WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden><path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Zm0 1.6a7.2 7.2 0 1 1-3.7 13.4l-.3-.2-2.6.7.7-2.5-.2-.3A7.2 7.2 0 0 1 12 4.8Zm-3 3.6c-.2 0-.5 0-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3 .6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.3-1.8-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6 6 0 0 1-3-2.6c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5l-.8-2c-.2-.5-.4-.4-.5-.4H9Z" /></svg>
      </a>
    </div>
  );
}
