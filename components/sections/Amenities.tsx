"use client";
import { useRef, useState } from "react";
import { gsap, lenis, useScene } from "@/lib/motion";
import { AMENITY_SLIDES } from "@/lib/content";

/* Reference 01:08–01:20 — pinned full-bleed amenity photos, each wiping in on a diagonal;
   the index at the top right lights the current one, its caption sits bottom left. */
export function Amenities() {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const activeIndex = useRef(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  useScene(root, ({ reduced, mobile }) => {
    if (reduced || mobile) return;
    const q = gsap.utils.selector(root);
    const slides = q(".am-slide");
    const names = q(".am-list li");
    const caps = q(".am-cap");
    const setActive = (i: number) => {
      activeIndex.current = i;
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
    timeline.current = tl;
    slides.forEach((s, i) => {
      const img = s.querySelector("img");
      if (i === 0) { tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.4 }, 0); return; }
      const at = STEP * i;
      tl.to(s, { clipPath: "polygon(0% 0%, 135% 0%, 100% 100%, -35% 100%)", duration: STEP, ease: "power2.inOut" }, at)
        .fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.4 }, at)
        .to(slides[i - 1].querySelector("img"), { xPercent: -8, duration: STEP }, at);
    });
    tl.to({}, { duration: 0.4 });
    return () => { timeline.current = null; };
  });

  const selectAmenity = (index: number) => {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setMobileIndex(index);
      return;
    }
    const tl = timeline.current;
    const trigger = tl?.scrollTrigger;
    if (!tl || !trigger) return;
    const time = index === 0 ? 0 : 0.8 * (index + 1);
    const progress = Math.min(1, time / tl.duration());
    const target = trigger.start + progress * (trigger.end - trigger.start);
    const duration = Math.min(3.8, 0.8 + Math.abs(index - activeIndex.current) * 0.32);
    const smooth = lenis();
    if (smooth) smooth.scrollTo(target, { duration });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section id="amenities" ref={root} className="am" data-tone="dark" aria-label="Amenities from arrival to rooftop">
      {AMENITY_SLIDES.map((a, i) => (
        <div key={a.name} className={`am-slide${mobileIndex === i ? " is-mobile-active" : ""}`} style={{ zIndex: i + 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="am-slide-main" src={a.photo} alt={a.name} loading="lazy" />
          <p className="am-mobile-title caps-serif">{a.name}</p>
          <div className="am-mobile-cap">
            <p className="caps-serif">{a.body}</p>
          </div>
        </div>
      ))}
      <div className="am-shade" />
      <ol className="am-list caps-serif">
        {AMENITY_SLIDES.map((a, i) => (
          <li key={a.name} className={mobileIndex === i ? "is-mobile-on" : undefined}>
            <button type="button" className="am-list-desktop" onClick={() => selectAmenity(i)} aria-label={`Show ${a.name}`}>{a.name}</button>
            <button type="button" className="am-list-mobile" aria-pressed={mobileIndex === i} onClick={() => setMobileIndex(i)}>{a.name}</button>
          </li>
        ))}
      </ol>
      <div className="am-caps">
        {AMENITY_SLIDES.map((a) => (
          <div key={a.name} className="am-cap">
            <p className="caps-serif">{a.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
