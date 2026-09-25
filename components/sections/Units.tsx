"use client";
import { useRef } from "react";
import { Chars } from "@/components/Chars";
import { gsap, useScene } from "@/lib/motion";
import { openHomes } from "@/components/sections/Homes";

/* Reference 01:00–01:08 — a full-bleed "aerial" photograph scrolls by; the pale page slides over it on a
   slanted edge; a sheared slit of photo opens into a window as it rises (scrubbed, no pin) while the
   typology name surfaces letter by letter across its foot, in front of the photo; then the statement. */
export function Units() {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q(".un-win"),
      { clipPath: "polygon(46% 6%, 54% 0%, 54% 94%, 46% 100%)" },
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "none", scrollTrigger: { trigger: q(".un-stage")[0], start: "top 95%", end: "top 15%", scrub: 1 } });
    gsap.fromTo(q(".un-win img"), { scale: 1.35 }, { scale: 1, ease: "none", scrollTrigger: { trigger: q(".un-stage")[0], start: "top bottom", end: "bottom top", scrub: 1 } });
  });
  return (
    <>
      <section className="ae" data-tone="dark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/tower.webp" alt="MEMCO Skyline and its neighbourhood, Begur" loading="lazy" data-parallax="10" />
      </section>
      <section ref={root} className="un" data-tone="light">
        <div className="un-stage">
          <div className="un-meta" data-fade>
            <p className="lbl">Homes</p>
            <p className="disp un-num">646</p>
            <p className="lbl">About</p>
            <p className="disp un-num">500 SQ FT</p>
          </div>
          <div className="un-win">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/interior-kitchen-entry.jpg" alt="Kitchen entry view, Urban Unit" loading="lazy" />
          </div>
          <div className="un-meta-r" data-fade data-delay="0.2">
            <p>Every home opens onto 50,000 sq ft of shared, professionally managed spaces.</p>
            <button type="button" className="pill lbl" onClick={() => openHomes()}>Explore the homes</button>
          </div>
          <h2 className="disp un-title" data-chars>
            <Chars text="URBAN UNITS" />
          </h2>
          <p className="lbl un-sub" data-fade data-delay="0.4">Urban Unit <i>·</i> Corner Urban Unit</p>
        </div>
        <div className="un-say">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="un-deco" src="/images/design-trees.webp" alt="" loading="lazy" data-rise />
          <i className="un-line" aria-hidden data-draw />
          <p className="lbl" data-fade>The feeling of home</p>
          <h2 className="caps-serif cc-statement" data-lines data-delay="0.2">Private homes of about 500 sq ft each, opening onto 50,000 sq ft you share with your neighbours.</h2>
          <span className="mark" aria-hidden data-fade data-delay="0.5" />
        </div>
      </section>
    </>
  );
}
