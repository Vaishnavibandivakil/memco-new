"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Chars } from "@/components/Chars";
import { HomePlanSvg } from "@/components/HomePlanSvg";
import { getInventory, typeName } from "@/lib/inventory";
import { gsap, charsIn, lenis } from "@/lib/motion";

export const openHomes = () => window.dispatchEvent(new Event("homes:open"));

const PLANS = getInventory().flatMap((level) => level.units).slice(0, 11);

const PHOTO_CARDS = [
  { image: "/images/club-cowork.jpg", title: "More beyond your door.", detail: "Shared places for work and everyday life." },
  { image: "/images/serenity-park.webp", title: "Room to breathe.", detail: "Green space woven into daily life." },
] as const;

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
    if (open) {
      lenis()?.stop();
      document.documentElement.classList.add("panel-open");
      scroller.current?.scrollTo(0, 0);
      gsap.set(element, { visibility: "visible" });
      if (reduced) { gsap.set(element, { clipPath: "inset(0% 0% 0% 0%)" }); return; }
      gsap.fromTo(element, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" });
      gsap.set(element.querySelectorAll(".hm-title .ch"), { opacity: 0 });
      charsIn(element.querySelectorAll(".hm-title .ch"), { delay: 0.55 });
      gsap.fromTo(element.querySelectorAll(".hm-count, .hm-close, .hm-grid"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.7, ease: "power3.out" });
    } else {
      document.documentElement.classList.remove("panel-open");
      lenis()?.start();
      if (reduced) { gsap.set(element, { visibility: "hidden" }); return; }
      gsap.to(element, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut", onComplete: () => { gsap.set(element, { visibility: "hidden" }); } });
    }
  }, [open]);

  return (
    <section id="homes" ref={root} className="hm" role="dialog" aria-modal="true" aria-label="Home plans" aria-hidden={!open} data-own-reveals>
      <button type="button" className="hm-close lbl" onClick={() => setOpen(false)} aria-label="Close homes"><span aria-hidden>✕</span></button>
      <div className="hm-scroll" ref={scroller} data-lenis-prevent>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hm-bloom" src="/images/gazebos.webp" alt="" loading="lazy" />
        <header className="hm-head">
          <h2 className="disp hm-title"><Chars text="HOMES" /></h2>
          <span className="disp hm-count">{PLANS.length.toString().padStart(2, "0")}</span>
        </header>
        <div className="hm-plans-intro"><span>Floor plan previews</span><span>Illustrative placeholders while the final home plans are prepared</span></div>
        <div className="hm-grid hm-single-grid">
          {PLANS.map((plan, index) => (
            <Fragment key={plan.code}>
            <article className="hm-card">
              <p className="lbl hm-card-top">{String(index + 1).padStart(2, "0")} / Layout preview</p>
              <div className="hm-plan"><HomePlanSvg unit={plan} /></div>
              <h3 className="caps-serif">{typeName(plan.type)}</h3>
            </article>
            {(index === 1 || index === 6) && <figure className="hm-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PHOTO_CARDS[index === 1 ? 0 : 1].image} alt="" loading="lazy" />
              <figcaption><span className="caps-serif">{PHOTO_CARDS[index === 1 ? 0 : 1].title}</span><span>{PHOTO_CARDS[index === 1 ? 0 : 1].detail}</span></figcaption>
            </figure>}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
