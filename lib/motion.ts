"use client";
import { useEffect, useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type SceneCtx = { reduced: boolean; mobile: boolean };

/** Scoped GSAP scene: rebuilt on breakpoint / reduced-motion change, fully reverted on unmount. */
export function useScene(ref: RefObject<HTMLElement | null>, build: (c: SceneCtx) => void | (() => void)) {
  useIso(() => {
    if (!ref.current) return;
    const mm = gsap.matchMedia(ref.current);
    // "any" always matches — gsap only runs the callback when at least one condition is true
    mm.add({ any: "all", reduced: "(prefers-reduced-motion: reduce)", mobile: "(max-width: 760px)" }, (c) =>
      build(c.conditions as SceneCtx),
    );
    return () => mm.revert();
  }, []);
}

/* Lenis instance is shared through window so any scene can pause scrolling (intro, drawers). */
declare global { interface Window { __lenis?: Lenis } }
export const lenis = () => (typeof window !== "undefined" ? window.__lenis : undefined);
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const l = lenis();
  if (id === "location") {
    const project = document.getElementById("project");
    const horizontal = ScrollTrigger.getAll()
      .filter((trigger) => trigger.trigger === project)
      .sort((a, b) => (b.end - b.start) - (a.end - a.start))[0];
    if (horizontal) {
      const destination = horizontal.end - 2;
      if (l) l.scrollTo(destination, { duration: 1.2 });
      else window.scrollTo({ top: destination, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      return;
    }
  }
  if (l) l.scrollTo(el, { duration: 1.2 });
  else el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}

/* Readable, left-to-right type motion. Keep it transform/opacity only for smooth frames. */
export function charsIn(chars: Element[] | NodeListOf<Element>, opts: gsap.TweenVars = {}) {
  return gsap.fromTo(chars,
    { opacity: 0, yPercent: 22 },
    { opacity: 1, yPercent: 0, duration: 0.7, ease: "power3.out", stagger: { amount: 0.32, from: "start" }, ...opts });
}
export function charsOut(chars: Element[] | NodeListOf<Element>, opts: gsap.TweenVars = {}) {
  return gsap.to(chars, { opacity: 0, yPercent: -12, duration: 0.32, ease: "power2.in", stagger: { amount: 0.16, from: "start" }, ...opts });
}
