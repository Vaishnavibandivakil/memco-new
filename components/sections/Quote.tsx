"use client";
import { useRef } from "react";
import { Split } from "@/components/Split";
import { gsap, useScene } from "@/lib/motion";

/* AIR 00:03–00:08 meets ERA: an edge-to-edge sans headline on paper, the quote set as a block beside a
   photograph, then a wide photograph that widens to full bleed as it passes. */
export function Quote() {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q(".st-wide"), { clipPath: "inset(0% 9% 0% 9%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: q(".st-wide")[0], start: "top 95%", end: "top 20%", scrub: 1 } });
  });
  return (
    <section ref={root} className="st" data-tone="light">
      <p className="lbl st-kicker" data-fade>Jutaku <i>·</i> Urban lifestyle ecosystem</p>
      <Split left="THE LUXURY" mid={<span className="lbl">MEMCO <i>·</i> 40+ years <i>·</i> Bengaluru</span>} right="OF COMING HOME" />
      <div className="st-grid">
        <div className="st-copy">
          <p className="caps-serif st-say" data-lines>Every home should be unique and special, just like the people who live in it.</p>
          <p className="lbl" data-fade data-delay="0.3">MEMCO Skyline <i>·</i> Jutaku</p>
        </div>
        <figure className="st-pic" data-rise>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/design-lobby.webp" alt="Lobby, MEMCO Skyline" loading="lazy" data-parallax="8" />
        </figure>
      </div>
      <div className="st-wide">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/rooftop-dining.jpg" alt="Rooftop dining, MEMCO Skyline" loading="lazy" data-parallax="8" />
      </div>
    </section>
  );
}
