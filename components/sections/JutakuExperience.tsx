import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { INSIGHT_VIDEOS } from "@/lib/insights";

export function JutakuExperience() {
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
        <div className="jx-featured-film">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/experience-center-reception.webp" alt="" loading="lazy" />
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${INSIGHT_VIDEOS[2].id}?autoplay=1&mute=1&loop=1&playlist=${INSIGHT_VIDEOS[2].id}&controls=0&disablekb=1&fs=0&playsinline=1&rel=0`}
            title="Experience Centre film — playing automatically without sound"
            allow="autoplay; encrypted-media; picture-in-picture"
            loading="lazy"
            tabIndex={-1}
          />
        </div>
      </section>
    </section>
  );
}
