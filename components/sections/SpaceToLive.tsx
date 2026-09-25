"use client";
import { useRef } from "react";
import { Chars } from "@/components/Chars";
import { gsap, useScene } from "@/lib/motion";
import { ROOMS } from "@/lib/data";

/* Reference 01:20–01:30 — the landscaping photo holds (sticky) while a paper arch simply scrolls up over it;
   "THE SPACE TO live in" surfaces inside the arch; the interiors follow as an offset collage over a
   deep colour block, each picture opening upward and drifting. */
export function SpaceToLive() {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q(".sp-bg img"), { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: q(".sp-intro")[0], start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(q(".sp-script"), { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power2.inOut", delay: 0.8, scrollTrigger: { trigger: q(".sp-title")[0], start: "top 80%", once: true } });
    q(".sp-card").forEach((c) => {
      gsap.fromTo(c.querySelector(".sp-img"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 88%", once: true } });
    });
    gsap.fromTo(q(".sp-block"), { yPercent: 25 }, { yPercent: -25, ease: "none", scrollTrigger: { trigger: q(".sp-collage")[0], start: "top bottom", end: "bottom top", scrub: true } });
  });

  const [bed, kitchen, entry, bath] = ROOMS;
  const card = (r: typeof bed, cls: string, p = 8) => (
    <figure className={`sp-card ${cls}`}>
      <div className="sp-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={r.photo} alt={r.caption} loading="lazy" data-parallax={p} />
      </div>
      <figcaption><span className="caps-serif" data-fade>{r.name}</span><span data-fade data-delay="0.1">{r.italic}</span></figcaption>
    </figure>
  );
  return (
    <section id="interiors" ref={root} className="sp" data-tone="light">
      <div className="sp-intro">
        <div className="sp-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/rooftop-bbq.jpg" alt="Rooftop lounge, MEMCO Skyline" loading="lazy" />
        </div>
        <div className="sp-arch">
          <h2 className="disp sp-title" data-chars>
            <Chars text="THE" /><br /><Chars text="SPACE" /><br /><Chars text="TO" />
          </h2>
          <span className="script sp-script">Live in</span>
        </div>
      </div>
      <div className="sp-collage">
        <span className="sp-block" aria-hidden />
        {card(bed, "sp-a")}
        <p className="caps-serif sp-note" data-lines>Professionally managed. Every home has access to all of it.</p>
        {card(kitchen, "sp-b")}
        {card(bath, "sp-c", 6)}
        {card(entry, "sp-d")}
      </div>
    </section>
  );
}
