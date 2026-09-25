"use client";
import { useRef } from "react";
import { gsap, useScene } from "@/lib/motion";
import { WA } from "@/lib/data";
import { AMENITY_SLIDES } from "@/lib/content";

/* Reference 01:08–01:20 — pinned full-bleed amenity photos, each wiping in on a diagonal;
   the index at the top right lights the current one, its caption sits bottom left. */
export function Amenities() {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(root);
    const slides = q(".am-slide");
    const names = q(".am-list li");
    const caps = q(".am-cap");
    const setActive = (i: number) => {
      names.forEach((n, j) => n.classList.toggle("is-on", j === i));
      caps.forEach((c, j) => c.classList.toggle("is-on", j === i));
    };
    setActive(0);
    gsap.set(slides.slice(1), { clipPath: "polygon(135% 0%, 135% 0%, 100% 100%, 100% 100%)" });
    const STEP = 0.8;
    const tl: gsap.core.Timeline = gsap.timeline({
      defaults: { ease: "none" },
      // runs as the scrub catches up, so the index/caption track the picture, not the scrollbar
      onUpdate: () => setActive(gsap.utils.clamp(0, slides.length - 1, Math.floor((tl.time() - 0.4) / STEP))),
      scrollTrigger: { trigger: root.current, start: "top top", end: `+=${slides.length * 80}%`, pin: true, scrub: 0.8 },
    });
    slides.forEach((s, i) => {
      const img = s.querySelector("img");
      if (i === 0) { tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.4 }, 0); return; }
      const at = STEP * i;
      tl.to(s, { clipPath: "polygon(0% 0%, 135% 0%, 100% 100%, -35% 100%)", duration: STEP, ease: "power2.inOut" }, at)
        .fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.4 }, at)
        .to(slides[i - 1].querySelector("img"), { xPercent: -8, duration: STEP }, at);
    });
    tl.to({}, { duration: 0.4 });
  });

  return (
    <section id="amenities" ref={root} className="am" data-tone="dark" aria-label="Amenities">
      {AMENITY_SLIDES.map((a, i) => (
        <div key={a.name} className="am-slide" style={{ zIndex: i + 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.photo} alt={a.name} loading="lazy" />
        </div>
      ))}
      <div className="am-shade" />
      <ol className="am-list caps-serif">
        {AMENITY_SLIDES.map((a) => <li key={a.name}>{a.name}</li>)}
      </ol>
      <div className="am-caps">
        {AMENITY_SLIDES.map((a) => (
          <div key={a.name} className="am-cap">
            <p className="lbl">{a.label}</p>
            <p className="caps-serif">{a.body}</p>
          </div>
        ))}
      </div>
      <a className="am-book lbl" href={WA()} target="_blank" rel="noreferrer">Book a visit<br />now</a>
    </section>
  );
}
