"use client";

import { useEffect, useRef, useState } from "react";
import { Chars } from "@/components/Chars";
import { gsap, charsIn, lenis } from "@/lib/motion";
import { X } from "lucide-react";

export const openHomes = () => window.dispatchEvent(new Event("homes:open"));

export function Homes() {
  const root = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setOpen(true);
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("homes:open", on);
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("homes:open", on); window.removeEventListener("keydown", key); };
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = document.documentElement.classList.contains("reduced");
    gsap.killTweensOf(element);
    if (open) {
      lenis()?.stop();
      document.documentElement.classList.add("panel-open");
      scroller.current?.scrollTo(0, 0);
      gsap.set(element, { visibility: "visible" });
      if (reduced) { gsap.set(element, { clipPath: "inset(0% 0% 0% 0%)" }); return; }
      gsap.fromTo(element, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" });
      gsap.set(element.querySelectorAll(".hm-title .ch"), { opacity: 0 });
      charsIn(element.querySelectorAll(".hm-title .ch"), { delay: 0.55 });
      gsap.fromTo(element.querySelectorAll(".hm-count, .hm-plans-intro, .hm-plan-entry"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.7, ease: "power3.out" });
    } else {
      document.documentElement.classList.remove("panel-open");
      lenis()?.start();
      if (reduced) { gsap.set(element, { visibility: "hidden" }); return; }
      gsap.to(element, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut", onComplete: () => { gsap.set(element, { visibility: "hidden" }); } });
    }
  }, [open]);

  return (
    <section id="homes" ref={root} className="hm" role="dialog" aria-modal="true" aria-label="Home plans" aria-hidden={!open} data-own-reveals>
      <button type="button" className="hm-close lbl" onClick={() => setOpen(false)} aria-label="Close homes"><X size={19} strokeWidth={1.8} aria-hidden="true" /></button>
      <div className="hm-scroll" ref={scroller} data-lenis-prevent>
        <header className="hm-head">
          <h2 className="disp hm-title"><Chars text="HOMES" /></h2>
          <span className="disp hm-count">03</span>
        </header>
        <div className="hm-plans-intro"><span>Floor plans</span><span>From the supplied MEMCO Skyline Jutaku drawings</span></div>
        <div className="hm-plan-collection">
          <article className="hm-plan-entry">
            <div className="hm-plan-copy">
              <p className="hm-plan-index">01 / A home of your own</p>
              <h3>Urban Unit</h3>
              <p>A private studio with its own kitchen, bathroom and patio. The drawing shows how the rooms sit together in one compact home.</p>
              <span className="hm-plan-detail">Studio Type 1 · individual layout</span>
            </div>
            <figure className="hm-plan-media hm-plan-media--single">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/floor-plans/urban-unit.webp" alt="Individual Studio Type 1 floor plan showing kitchen, bathroom, living area and patio" loading="lazy" />
              <figcaption>Individual Urban Unit</figcaption>
            </figure>
          </article>

          <article className="hm-plan-entry hm-plan-entry--reverse">
            <div className="hm-plan-copy">
              <p className="hm-plan-index">02 / Side by side</p>
              <h3>Two Urban Units</h3>
              <p>The paired drawing shows adjoining mirrored homes. Each unit has its own entrance, kitchen, bathroom and patio.</p>
              <span className="hm-plan-detail">Two separate Studio Type 1 homes</span>
            </div>
            <figure className="hm-plan-media hm-plan-media--pair">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/floor-plans/paired-urban-units.webp" alt="Two adjoining mirrored Studio Type 1 floor plans, each with a separate entrance" loading="lazy" />
              <figcaption>Adjoining Urban Units</figcaption>
            </figure>
          </article>

          <article className="hm-plan-entry hm-plan-entry--floor">
            <div className="hm-plan-copy">
              <p className="hm-plan-index">03 / The bigger picture</p>
              <h3>Across the floor</h3>
              <p>See how the individual homes connect to a shared corridor and one of the building&apos;s three cores.</p>
              <span className="hm-plan-detail">One core · typical floor</span>
            </div>
            <div className="hm-floor-drawings">
              <figure className="hm-plan-media hm-plan-media--core">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/floor-plans/one-core.webp" alt="Isometric plan of one core, showing Urban Units around the shared corridor, stairs and lifts" loading="lazy" />
                <figcaption>One core · isometric view</figcaption>
              </figure>
              <figure className="hm-plan-media hm-plan-media--typical">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/floor-plans/typical-floor.webp" alt="Typical floor drawing showing three cores and the arrangement of Urban Units" loading="lazy" />
                <figcaption>Typical floor · levels 02, 04, 06, 08, 10 and 12</figcaption>
              </figure>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
