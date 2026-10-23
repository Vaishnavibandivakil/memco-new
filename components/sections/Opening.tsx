"use client";
import { useEffect, useRef, useState } from "react";
import { Chars } from "@/components/Chars";
import { gsap, ScrollTrigger, useScene, charsIn, charsOut } from "@/lib/motion";
import { HOTSPOTS, REASONS } from "@/lib/content";
import { openHomes } from "@/components/sections/Homes";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* The landing page opens directly on the existing, scroll-led tower scene. */
export function Opening() {
  const root = useRef<HTMLElement>(null);
  const [spot, setSpot] = useState<string | null>(null);
  const [spotsOn, setSpotsOn] = useState(false);

  useScene(root, () => {
    const q = gsap.utils.selector(root);
    /* Start at the same crop as the final intro frame, then reveal more of the photo on scroll. */
    gsap.fromTo(q(".op-media"), { scale: 1.06 }, { scale: 1, ease: "none", immediateRender: false, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1.2 } });
    /* the title drifts a touch faster than the page as it leaves */
    gsap.to(q(".op-titlewrap"), { yPercent: -18, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "+=100%", scrub: true } });
    /* hotspots live between "title gone" and "dome arriving" */
    ScrollTrigger.create({ start: () => window.innerHeight * 0.55, end: () => window.innerHeight * 2.15, onToggle: (s) => setSpotsOn(s.isActive) });

  });

  return (
    <>
      <section id="top" ref={root} className="op" data-tone="dark">
        <div className="op-sticky">
          <div className="op-clip">
            <div className="op-media">
              <div className="cover" style={{ ["--ar" as string]: 1672 / 940 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/jutaku-exterior-hero.webp" alt="Jutaku residential tower and experience centre in daylight" fetchPriority="high" />
                <div className={`spots${spotsOn ? " is-on" : ""}`}>
                  {HOTSPOTS.map((h, i) => (
                    <div key={h.id} data-spot={h.id} className={`spot${spot === h.id ? " is-open" : ""}${h.x > 55 ? " flip" : ""}`} style={{ left: `${h.x}%`, top: `${h.y}%`, ["--i" as string]: i }}
                      onMouseEnter={() => setSpot(h.id)} onMouseLeave={() => setSpot(null)}>
                      <button type="button" className="spot-dot" aria-expanded={spot === h.id} aria-label={h.title}
                        onClick={() => setSpot(spot === h.id ? null : h.id)} onFocus={() => setSpot(h.id)} onBlur={() => setSpot(null)}>
                        <span />
                      </button>
                      <div className="spot-card" role="note">
                        <h3 className="caps-serif">{h.title}</h3>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={h.photo} alt="" loading="lazy" />
                        <p>{h.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="op-shade" />
          </div>
          <button type="button" className="round op-view" onClick={() => openHomes()}>
            <svg viewBox="0 0 100 100" aria-hidden><circle cx="50" cy="50" r="48" /></svg>
            <span className="lbl">View available<br />homes</span>
          </button>
        </div>

        {/* scrolls with the page, above the sticky photo */}
        <div className="op-titlewrap">
          <h1 className="op-title">
            <span className="op-l1 disp"><Chars text="MEMCO" /></span>
            <span className="op-l2 disp"><Chars text="SKYLINE" /></span>
            {/* Jutaku sub-brand mark, reversed white on photography (§05) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="op-script" src="/brand/jutaku-white.png" alt="Jutaku" width={379} height={260} />
          </h1>
          <div className="op-row">
            <span className="caps-serif">The luxury</span>
            <span className="lbl">Begur <i>·</i> South Bengaluru</span>
            <span className="caps-serif">of coming home</span>
          </div>
        </div>
      </section>
      <Reasons />
    </>
  );
}

/* The dome + carousel. Arrows or auto-advance (only while on screen); the heading letters blur out and
   the next heading's letters surface, the copy rises. */
const SLIDE_MS = 5200;

function Reasons() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const busy = useRef(false);
  const inView = useRef(false);
  const first = useRef(true);

  const go = (dir: 1 | -1) => {
    if (busy.current || !root.current) return;
    busy.current = true;
    const cur = root.current.querySelector(".rs-head.is-on");
    gsap.to(root.current.querySelectorAll(".rs-copy.is-on > *"), { opacity: 0, y: -12, duration: 0.4, stagger: 0.05 });
    // functional update: the auto-advance interval holds an old closure
    const done = () => { setI((c) => (c + dir + REASONS.length) % REASONS.length); busy.current = false; };
    if (cur) charsOut(cur.querySelectorAll(".ch"), { onComplete: done });
    else done();
  };

  /* new slide → play its letters + copy (slide 0's first showing is played by the page reveal) */
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = root.current;
    if (!el || document.documentElement.classList.contains("reduced")) return;
    const head = el.querySelector(".rs-head.is-on");
    if (!head) return;
    charsIn(head.querySelectorAll(".ch"), { duration: 1 });
    gsap.fromTo(el.querySelectorAll(".rs-copy.is-on > *"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, delay: 0.35, ease: "power3.out" });
  }, [i]);

  /* plays on its own: every SLIDE_MS while the carousel is on screen; the pager bar fills as the timer.
     Arrows still work, and pressing one restarts the timer. */
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const el = root.current?.querySelector(".rs-stage");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting; setTick((t) => t + 1); }, { threshold: [0, 0.25] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!inView.current) return;
    const t = window.setTimeout(() => go(1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, tick]);

  useScene(root, ({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q(".dome-arc text"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
    /* the rim type travels along the curve while the dome rises and passes — right to left, like the reel */
    gsap.fromTo(q(".dome-arc textPath"), { attr: { startOffset: "64%" } }, { attr: { startOffset: "36%" }, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top -70%", scrub: 1.2 } });
    gsap.fromTo(q(".rs-line"), { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: "power3.inOut", scrollTrigger: { trigger: q(".rs-line")[0], start: "top 85%", once: true } });
  });

  return (
    <section ref={root} className="rs" data-tone="light" aria-label="Three reasons to choose Jutaku">
      <div className="dome" aria-hidden>
        <svg className="dome-arc" viewBox="0 0 1000 1000">
          <defs><path id="arc" d="M 50,500 A 450,450 0 0 1 950,500" /></defs>
          <text><textPath href="#arc" startOffset="50%" textAnchor="middle">THREE · REASONS · TO · CHOOSE · JUTAKU</textPath></text>
        </svg>
      </div>
      <div className="rs-body">
        <div className="rs-emblem" data-fade>
          <span className="lbl">Begur</span><span className="mark" /><span className="lbl">Bengaluru</span>
        </div>
        <i className="rs-line" aria-hidden />
        <p className="lbl rs-kicker" data-fade>The luxury of coming home<br /><span className="dim">Own 500 · Experience 50,000</span></p>

        <div className="rs-stage">
          <div className="rs-heads">
            {REASONS.map((r, k) => (
              <h2 key={r.title} className={`disp rs-head${k === i ? " is-on" : ""}`} aria-hidden={k !== i} {...(k === 0 ? { "data-chars": "" } : {})}>
                <Chars text={r.title.toUpperCase()} />
              </h2>
            ))}
          </div>
          <div className="rs-pager" data-fade>
            <button type="button" onClick={() => { go(-1); }} aria-label="Previous reason"><ChevronLeft size={20} strokeWidth={1.8} aria-hidden="true" /></button>
            <i>
              {/* timer: fills this slide's third of the bar over SLIDE_MS; key restarts it on every slide */}
              <b key={`${i}-${tick}`} style={{ ["--from" as string]: i / REASONS.length, ["--to" as string]: (i + 1) / REASONS.length, ["--ms" as string]: `${SLIDE_MS}ms` }} />
            </i>
            <button type="button" onClick={() => go(1)} aria-label="Next reason"><ChevronRight size={20} strokeWidth={1.8} aria-hidden="true" /></button>
          </div>
          <div className="rs-copies">
            {REASONS.map((r, k) => (
              <div key={r.title} className={`rs-copy${k === i ? " is-on" : ""}`}>
                <p>{r.body}</p>
                <p className="lbl">{r.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
