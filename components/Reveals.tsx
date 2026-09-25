"use client";
import { useEffect } from "react";
import SplitType from "split-type";
import { gsap, ScrollTrigger, charsIn } from "@/lib/motion";

/* One pass over the page wiring the reel's text behaviours plus image motion:
   [data-chars]    letters of <Chars/> surface in random order out of a blur
   [data-lines]    statement lines rise out of their masks, one after another
   [data-fade]     small labels / buttons fade up
   [data-draw]     hairlines draw downward
   [data-rise]     photographs open upward from their base
   [data-parallax] image drifts against the scroll (value = % travel)
   Every reveal plays when its block comes into view and resets when you scroll back above it, so it plays
   again next time. Elements inside the horizontal track are skipped; that scene wires its own. */
export function Reveals() {
  useEffect(() => {
    if (document.documentElement.classList.contains("reduced")) return;
    const splits: SplitType[] = [];
    const ctx = gsap.context(() => {});

    const reveal = (el: Element, show: () => void, hide: () => void, start = "top 82%") => {
      hide();
      ScrollTrigger.create({ trigger: el, start, onEnter: show, onLeaveBack: hide });
    };
    const delay = (el: Element) => Number((el as HTMLElement).dataset.delay || 0);

    const build = () => ctx.add(() => {
      const skip = (el: Element) => !!el.closest("[data-own-reveals]");

      document.querySelectorAll("[data-chars]").forEach((el) => {
        if (skip(el)) return;
        const chars = el.querySelectorAll(".ch");
        reveal(el, () => charsIn(chars, { delay: delay(el), overwrite: true }), () => gsap.set(chars, { opacity: 0, overwrite: true }));
      });

      document.querySelectorAll<HTMLElement>("[data-lines]").forEach((el) => {
        if (skip(el)) return;
        const s = new SplitType(el, { types: "lines", lineClass: "ln" });
        splits.push(s);
        s.lines?.forEach((l) => { const m = document.createElement("span"); m.className = "ln-mask"; l.parentNode!.insertBefore(m, l); m.appendChild(l); });
        el.style.visibility = "visible";
        reveal(el,
          () => gsap.fromTo(s.lines!, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.3, ease: "power3.out", stagger: 0.12, delay: delay(el), overwrite: true }),
          () => gsap.set(s.lines!, { yPercent: 110, opacity: 0, overwrite: true }));
      });

      document.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
        if (skip(el)) return;
        reveal(el,
          () => gsap.fromTo(el, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay: delay(el), overwrite: true }),
          () => gsap.set(el, { opacity: 0, y: 22, overwrite: true }), "top 90%");
      });

      document.querySelectorAll<HTMLElement>("[data-draw]").forEach((el) => {
        if (skip(el)) return;
        reveal(el,
          () => gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 1.6, ease: "power3.inOut", delay: delay(el), overwrite: true }),
          () => gsap.set(el, { scaleY: 0, overwrite: true }), "top 88%");
      });

      document.querySelectorAll<HTMLElement>("[data-rise]").forEach((el) => {
        if (skip(el)) return;
        reveal(el,
          () => gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.out", delay: delay(el), overwrite: true }),
          () => gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)", overwrite: true }), "top 92%");
      });

      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const p = Number(el.dataset.parallax || 10);
        gsap.fromTo(el, { yPercent: -p }, { yPercent: p, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
      ScrollTrigger.refresh();
    });

    // after every section has created its own pins (timeout, not rAF: rAF can stall in background tabs)
    const id = window.setTimeout(build, 60);
    return () => { clearTimeout(id); ctx.revert(); splits.forEach((s) => s.revert()); };
  }, []);
  return null;
}
