"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { VideoModal } from "@/components/Insights";
import { INSIGHT_VIDEOS } from "@/lib/insights";

export function JutakuExperience() {
  const [playing, setPlaying] = useState(false);
  return (
    <section id="jutaku-experience" className="jx" data-tone="dark" aria-labelledby="jutaku-experience-title">
      <div className="jx-stage">
        <div className="jx-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/jutaku-experience-art.jpg" alt="Illustrated homes beside a landscaped waterfront" loading="lazy" />
        </div>
        <div className="jx-content">
          <h2 id="jutaku-experience-title">
            <span className="jx-title-lead">Book your</span>
            <span className="jx-title-main">Jutaku</span>
            <span className="jx-title-main">experience.</span>
          </h2>
          <div className="jx-actions">
            <Link href="/book-visit" className="pill lbl jx-book-btn">Book a visit</Link>
            <Link href="/brochure" className="pill lbl jx-brochure-btn">
              Request details <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
      <section id="interiors" className="jx-arch" data-tone="light" aria-labelledby="interiors-title">
        <h2 id="interiors-title" className="disp jx-arch-title">The space<br />to <span>live in</span></h2>
        <button type="button" className="jx-featured-film" onClick={() => setPlaying(true)} aria-label="Watch the Jutaku Experience Centre film">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/experience-center-reception.webp" alt="" loading="lazy" />
          <span className="jx-featured-shade" aria-hidden="true" />
          <span className="featured-film featured-film--light"><span className="featured-film-icon"><Play size={16} fill="currentColor" aria-hidden="true" /></span><span><small>02 / Experience Centre</small><strong>Watch the Experience Centre film</strong></span></span>
        </button>
      </section>
      <VideoModal video={playing ? INSIGHT_VIDEOS[2] : null} onClose={() => setPlaying(false)} />
    </section>
  );
}
