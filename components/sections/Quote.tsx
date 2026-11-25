"use client";
import { useRef, useState } from "react";
import { Split } from "@/components/Split";
import { AreaBreakdownChart } from "@/components/AreaBreakdownChart";
import { gsap, useScene } from "@/lib/motion";
import { INSIGHT_VIDEOS } from "@/lib/insights";
import { VideoModal } from "@/components/Insights";
import { Play } from "lucide-react";

/* Lead with the project film, then show the ownership statement and interactive area breakdown. */
export function Quote() {
  const root = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  useScene(root, ({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q(".st-wide"), { clipPath: "inset(25% 34% 25% 34%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: q(".st-wide")[0], start: "top 95%", end: "top 12%", scrub: 1 } });
  });
  return (
    <section ref={root} className="st" data-tone="light">
      <div className="st-wide">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/rooftop-dining.jpg" alt="" loading="lazy" />
        <iframe
          className="st-wide-film"
          src={`https://www.youtube-nocookie.com/embed/${INSIGHT_VIDEOS[0].id}?autoplay=1&mute=1&loop=1&playlist=${INSIGHT_VIDEOS[0].id}&controls=0&disablekb=1&fs=0&playsinline=1&rel=0`}
          title={`${INSIGHT_VIDEOS[0].title} — background film`}
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
          aria-hidden="true"
        />
        <button type="button" className="featured-film featured-film--light" onClick={() => setPlaying(true)} aria-label="Watch the Jutaku project explainer">
          <span className="featured-film-icon"><Play size={16} fill="currentColor" aria-hidden="true" /></span>
          <span><small>01 / The project</small><strong>Watch the project explainer</strong></span>
        </button>
      </div>
      <Split className="st-split" left="OWN 500 SQ.FT." right="EXPERIENCE 50,000 SQ.FT." />
      <div className="st-grid">
        <AreaBreakdownChart />
      </div>
      <VideoModal video={playing ? INSIGHT_VIDEOS[0] : null} onClose={() => setPlaying(false)} />
    </section>
  );
}
