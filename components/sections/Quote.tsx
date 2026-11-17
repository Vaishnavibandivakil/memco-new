"use client";
import { useRef } from "react";
import { Split } from "@/components/Split";
import { AreaBreakdownChart } from "@/components/AreaBreakdownChart";
import { gsap, useScene } from "@/lib/motion";

/* The ownership statement leads into an interactive area breakdown; the wide photo remains below. */
export function Quote() {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q(".st-wide"), { clipPath: "inset(25% 34% 25% 34%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: q(".st-wide")[0], start: "top 95%", end: "top 12%", scrub: 1 } });
  });
  return (
    <section ref={root} className="st" data-tone="light">
      <p className="lbl st-kicker" data-fade>Smart ownership <i>·</i> Shared by design</p>
      <Split className="st-split" left="OWN 500 SQ.FT." mid={<span className="lbl">Jutaku <i>·</i> Bengaluru</span>} right="EXPERIENCE 50,000 SQ.FT." />
      <div className="st-grid">
        <AreaBreakdownChart />
      </div>
      <div className="st-wide">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/rooftop-dining.jpg" alt="Rooftop dining, MEMCO Skyline" loading="lazy" data-parallax="8" />
      </div>
    </section>
  );
}
