"use client";
import { useRef } from "react";
import { Chars } from "@/components/Chars";
import { gsap, useScene } from "@/lib/motion";
import { Gallery } from "@/components/sections/Gallery";

/* Reference 01:20–01:30 — the landscaping photo holds (sticky) while a paper arch simply scrolls up over it;
   "THE SPACE TO live in" surfaces inside the arch; the interiors follow as the AIR-style numbered gallery. */
export function SpaceToLive() {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q(".sp-bg img"), { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: q(".sp-intro")[0], start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(q(".sp-script"), { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power2.inOut", delay: 0.8, scrollTrigger: { trigger: q(".sp-title")[0], start: "top 80%", once: true } });
  });

  return (
    <section id="interiors" ref={root} className="sp" data-tone="light">
      <div className="sp-intro">
        <div className="sp-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/rooftop-bbq.jpg" alt="Rooftop lounge, MEMCO Skyline" loading="lazy" />
        </div>
        <div className="sp-arch">
          {/* two lines: THE SPACE / TO live in */}
          <h2 className="disp sp-title" data-chars>
            <Chars text="THE SPACE" /><br />
            <span className="sp-l2"><Chars text="TO" /><span className="script sp-script">Live in</span></span>
          </h2>
        </div>
      </div>
      <Gallery />
    </section>
  );
}
