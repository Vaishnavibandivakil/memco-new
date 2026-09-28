"use client";
import { useRef } from "react";
import SplitType from "split-type";
import { Chars } from "@/components/Chars";
import { gsap, ScrollTrigger, useScene, charsIn } from "@/lib/motion";
import { ROUTE } from "@/lib/content";
import { openHomes } from "@/components/sections/Homes";

/* The coast road, traced point for point from the ERA reel (01:01): a calligraphic stroke that sweeps up
   from the lower left, folds back on itself three times (switchbacks), runs a soft wave through the middle,
   drops into one deep dip and trails off. Coordinates are the reel frame's own pixels (viewBox below). */
const VB = { x: 280, y: 150, w: 1240, h: 180 };
const ROAD = "M288,318 C360,305 460,285 505,265 C520,258 505,252 490,249 C500,244 560,244 610,245 C640,246 650,256 634,264 C640,270 690,266 730,262 C780,257 815,252 835,258 C842,264 820,270 816,273 C860,276 900,268 960,270 C1010,273 1060,276 1100,262 C1120,254 1135,258 1160,274 C1190,293 1215,313 1238,308 C1258,302 1256,270 1275,252 C1295,240 1350,244 1400,249 C1440,253 1480,260 1510,265";
const ROAD_X = [288, 1510];
/* dots float just above the road, as in the reel; ROUTE order, then the MEMCO mark in the middle */
const DOTS: [number, number][] = [[490, 230], [684, 245], [1117, 232], [1301, 221]];
const HOME: [number, number] = [900, 242];

/* Reference 00:52–01:02 — one horizontal run on paper: the concept statement → "NEW GOLDEN MILE" with the
   portrait photo and the side note → "THE COAST YOU WANTED" and the drawn coast road.
   Vertical scroll drives the track; each block plays its own timed reveal as it slides into view.
   Type always sits above the photographs. */
export function Concept() {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ reduced, mobile }) => {
    const q = gsap.utils.selector(root);
    if (reduced) return;

    const track = q(".hz-track")[0] as HTMLElement;
    const dist = () => track.scrollWidth - window.innerWidth;
    const move = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
    });

    /* panel 1 is on screen when the pin starts — its lines play on vertical entry */
    const s = new SplitType(q(".cc-statement")[0] as HTMLElement, { types: "lines", lineClass: "ln" });
    s.lines?.forEach((l) => { const m = document.createElement("span"); m.className = "ln-mask"; l.parentNode!.insertBefore(m, l); m.appendChild(l); });
    gsap.set(q(".cc-statement")[0], { visibility: "visible" });
    gsap.set(s.lines!, { yPercent: 110 });
    gsap.set(q(".cc-fade"), { opacity: 0, y: 16 });
    ScrollTrigger.create({
      trigger: root.current, start: "top 65%", once: true,
      onEnter: () => {
        gsap.to(s.lines!, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "power3.out" });
        gsap.to(q(".cc-fade"), { opacity: 1, y: 0, duration: 1, stagger: 0.12, delay: 0.3, ease: "power3.out" });
      },
    });

    /* later panels: timed reveals keyed to the horizontal position */
    const when = (el: Element, play: () => void, start = "left 80%") =>
      ScrollTrigger.create({ trigger: el, containerAnimation: move, start, once: true, onEnter: play });

    q(".hz [data-hchars]").forEach((el) => {
      const chars = el.querySelectorAll(".ch");
      gsap.set(chars, { opacity: 0 });
      when(el, () => charsIn(chars, { delay: Number((el as HTMLElement).dataset.delay || 0) }));
    });
    q(".hz [data-hfade]").forEach((el) => {
      gsap.set(el, { opacity: 0, y: 18 });
      when(el, () => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: Number((el as HTMLElement).dataset.delay || 0) }), "left 88%");
    });
    /* the photo opens as it slides in */
    gsap.fromTo(q(".gm-pic"), { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: q(".gm-pic")[0], containerAnimation: move, start: "left 100%", end: "left 45%", scrub: true } });
    gsap.fromTo(q(".gm-pic img"), { xPercent: 12, scale: 1.15 }, { xPercent: -6, scale: 1.05, ease: "none", scrollTrigger: { trigger: q(".gm-pic")[0], containerAnimation: move, start: "left 100%", end: "right 0%", scrub: true } });
    /* stops are placed from the traced coordinates; each lights up as the drawn line reaches it */
    const path = q(".pl-road")[0];
    const stops = q(".pl-stop") as HTMLElement[];
    const at = [...DOTS, HOME];
    stops.forEach((el, k) => { el.style.left = `${((at[k][0] - VB.x) / VB.w) * 100}%`; el.style.top = `${((at[k][1] - VB.y) / VB.h) * 100}%`; });
    const reach = at.map(([x]) => (x - ROAD_X[0]) / (ROAD_X[1] - ROAD_X[0]));
    /* animated, not scrubbed: when the panel is on screen the pen draws the whole road in one timed stroke,
       lighting each stop as it passes; a soft highlight then keeps travelling along the line.
       Leaving back to the left resets it so it draws again next time. */
    const glow = q(".pl-glow")[0];
    const drawn = { p: 0 };
    const paint = () => {
      (path as HTMLElement).style.strokeDashoffset = String(1 - drawn.p); // raw: GSAP would round these fractional units
      stops.forEach((el, k) => el.classList.toggle("is-on", drawn.p >= reach[k] - 0.03));
    };
    const draw = gsap.timeline({ paused: true })
      .to(drawn, { p: 1, duration: 3.2, ease: "power2.inOut", onUpdate: paint })
      .fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.4");
    const run = { o: 0.12 };
    const flow = gsap.fromTo(run, { o: 0.12 }, { o: -1, duration: 4.2, ease: "none", repeat: -1, paused: true, onUpdate: () => { (glow as HTMLElement).style.strokeDashoffset = String(run.o); } });
    paint();
    ScrollTrigger.create({
      trigger: q(".rc")[0], containerAnimation: move, start: "left 45%", end: "right 0%",
      onEnter: () => { draw.play(); flow.play(); },
      onEnterBack: () => flow.play(),
      onLeave: () => flow.pause(),
      onLeaveBack: () => { draw.pause(0); drawn.p = 0; paint(); flow.pause(); },
    });
    /* decoration drifts */
    gsap.to(q(".cc-deco"), { yPercent: -18, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: () => `+=${dist() + window.innerHeight}`, scrub: true } });

    if (mobile) ScrollTrigger.refresh();
    return () => s.revert();
  });

  return (
    <section ref={root} className="hz" data-tone="light" data-own-reveals>
      <div className="hz-track">
        {/* panel 1 — the concept */}
        <div className="hz-panel cc">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cc-deco cc-tl" src="/images/gazebos.webp" alt="" loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cc-deco cc-br" src="/images/serenity-park.webp" alt="" loading="lazy" />
          <div className="cc-body">
            <p className="lbl cc-fade">The concept</p>
            <h2 className="caps-serif cc-statement">Jutaku is an urban lifestyle ecosystem: 646 private spaces opening onto 50,000 sq ft of professionally managed spaces.</h2>
            <p className="cc-small cc-fade">At MEMCO Skyline we build homes that stay small on purpose, so the ecosystem around them can be large.</p>
            <span className="mark cc-fade" aria-hidden />
          </div>
        </div>

        {/* panel 2 — the place */}
        <div className="hz-panel gm">
          <span className="gm-country lbl" data-hfade>I n d i a</span>
          <h2 className="gm-words disp" aria-label="Begur, South Bengaluru">
            <span className="gm-w1" data-hchars><Chars text="BEGUR," /></span>
            <span className="gm-w2" data-hchars data-delay="0.15"><Chars text="SOUTH" /></span>
            <span className="gm-w3" data-hchars data-delay="0.3"><Chars text="BENGALURU" /></span>
          </h2>
          <figure className="gm-pic">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/design-living.webp" alt="Living room, MEMCO Skyline" loading="lazy" />
          </figure>
          <div className="gm-side">
            <h3 className="caps-serif" data-hfade>Between Singasandra and Hosa Road</h3>
            <p data-hfade data-delay="0.1">Singasandra Metro is 600 m away, Hosa Road Metro 1.2 km, Electronic City 3 km. Off NH7 on Manipal County Road.</p>
          </div>
          <button type="button" className="round gm-view" data-hfade onClick={() => openHomes()}>
            <svg viewBox="0 0 100 100" aria-hidden><circle cx="50" cy="50" r="48" /></svg>
            <span className="lbl">View available<br />homes</span>
          </button>
        </div>

        {/* panel 3 — the road */}
        <div className="hz-panel rc">
          <h2 className="disp rc-title">
            <span data-hchars><Chars text="EVERYTHING" /></span>
            <span className="script" data-hfade data-delay="0.5">within</span>
            <span data-hchars data-delay="0.2"><Chars text="REACH" /></span>
          </h2>
          <div className="pl-maprow">
            <svg className="pl-map" viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} role="img" aria-label="Distances from MEMCO Skyline">
              <defs>
                {/* brush taper: the stroke thins out at both ends */}
                <linearGradient id="road-taper" gradientUnits="userSpaceOnUse" x1={ROAD_X[0]} x2={ROAD_X[1]} y1="0" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.1" /><stop offset="0.07" stopColor="#fff" />
                  <stop offset="0.93" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0.05" />
                </linearGradient>
                <mask id="road-mask" maskUnits="userSpaceOnUse" x={VB.x} y={VB.y} width={VB.w} height={VB.h}><rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} fill="url(#road-taper)" /></mask>
              </defs>
              <path className="pl-road" d={ROAD} pathLength={1} mask="url(#road-mask)" />
              {/* light travelling along the drawn road */}
              <path className="pl-glow" d={ROAD} pathLength={1} mask="url(#road-mask)" />
            </svg>
            <ol className="pl-stops">
              {ROUTE.map((r) => (
                <li key={r.name} className="pl-stop">
                    <span className="pl-lab"><b>{r.name}</b><span>{r.dist}</span></span><i />
                  </li>
              ))}
              <li className="pl-stop pl-home" aria-label="MEMCO Skyline"><span className="pl-lab"><span className="mark" /></span><i /></li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
