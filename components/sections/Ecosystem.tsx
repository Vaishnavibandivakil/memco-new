"use client";
import { useRef } from "react";
import SplitType from "split-type";
import { Chars } from "@/components/Chars";
import { gsap, useScene, charsIn } from "@/lib/motion";

/* Reference 01:30–01:37 — two panels of one photograph on paper close their gap and grow to full bleed
   (short scrubbed pin); as it fills, one enormous word surfaces across the top, in front of the photo,
   and stays; the paragraph rises bottom left. */
export function Ecosystem() {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(root);
    const word = q(".ec-word .ch");
    gsap.set(word, { opacity: 0 });
    const s = new SplitType(q(".ec-copy .caps-serif")[0] as HTMLElement, { types: "lines", lineClass: "ln" });
    s.lines?.forEach((l) => { const m = document.createElement("span"); m.className = "ln-mask"; l.parentNode!.insertBefore(m, l); m.appendChild(l); });
    gsap.set(s.lines!, { yPercent: 110 });
    gsap.set(q(".ec-copy .lbl"), { opacity: 0 });
    /* the white word and copy exist only on the full-bleed photo: shown once the photo has filled the screen,
       hidden again whenever the visitor scrolls back into the merge (so no half-word over the paper) */
    let shown = false;
    const show = () => {
      if (shown) return; shown = true;
      charsIn(word, { duration: 1.3, overwrite: true });
      gsap.to(s.lines!, { yPercent: 0, duration: 1.2, stagger: 0.1, delay: 0.6, ease: "power3.out", overwrite: true });
      gsap.to(q(".ec-copy .lbl"), { opacity: 1, duration: 1, delay: 1, overwrite: true });
      gsap.to(q(".ec-shade"), { opacity: 1, duration: 1.4, overwrite: true });
    };
    const hide = () => {
      if (!shown) return; shown = false;
      gsap.to(word, { opacity: 0, duration: 0.3, overwrite: true });
      gsap.to(s.lines!, { yPercent: 110, duration: 0.3, overwrite: true });
      gsap.to(q(".ec-copy .lbl"), { opacity: 0, duration: 0.3, overwrite: true });
      gsap.to(q(".ec-shade"), { opacity: 0, duration: 0.4, overwrite: true });
    };
    const FULL = 0.92; // timeline time at which the merged photo is (almost) full-bleed
    const tl: gsap.core.Timeline = gsap.timeline({
      defaults: { ease: "none" },
      // follows the (smoothed) photo, not the scrollbar: show on the way in, hide on the way back
      onUpdate: () => { if (tl.time() >= FULL) show(); else hide(); },
      scrollTrigger: {
        // three phases over the pin: merge (0–1) → hold the full photo with the word + copy (1–2.4) → release
        trigger: root.current, start: "top top", end: "+=260%", pin: true, scrub: 1.2, anticipatePin: 1, onLeave: show,
        // on paper at first, on the photo once it has grown: the chrome follows
        onUpdate: (st) => { root.current!.dataset.tone = st.progress > 0.2 ? "dark" : "light"; },
      },
    });
    tl.fromTo(q(".ec-frame"), { width: "58vw", height: "58vh" }, { width: "100vw", height: "100vh", duration: 1, ease: "power2.inOut" }, 0)
      .fromTo(q(".ec-split"), { scaleY: 1 }, { scaleY: 0, duration: 0.45 }, 0)
      .fromTo(q(".ec-frame img"), { scale: 1.2 }, { scale: 1, duration: 1 }, 0)
      /* hold: the merged photo stays put while the word and paragraph settle; a very slow push-in keeps it alive */
      .to(q(".ec-frame img"), { scale: 1.05, duration: 1.4 }, 1)
      .to({}, { duration: 0.2 });
    return () => s.revert();
  });
  return (
    <section ref={root} className="ec" data-tone="light" data-own-reveals>
      <div className="ec-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/tower.webp" alt="MEMCO Skyline tower" loading="lazy" />
        <span className="ec-split" aria-hidden />
        <span className="ec-shade" aria-hidden />
      </div>
      <h2 className="disp ec-word"><Chars text="ECOSYSTEM" /></h2>
      <div className="ec-copy">
        <p className="caps-serif">646 private spaces open onto podium studios, a park with 290 preserved trees, and a roof with a 56 ft pool.</p>
        <p className="lbl">MEMCO · 40+ years · Bengaluru</p>
      </div>
    </section>
  );
}
