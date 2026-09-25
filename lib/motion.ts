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
  if (l) l.scrollTo(el, { duration: 1.8 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/* The reel's letter reveal: letters surface in random order out of a soft blur, slightly stretched,
   and settle. Timed (not scrubbed), so it always plays at the same calm speed. */
export function charsIn(chars: Element[] | NodeListOf<Element>, opts: gsap.TweenVars = {}) {
  return gsap.fromTo(chars,
    { opacity: 0, scaleY: 1.35, yPercent: 12, filter: "blur(10px)" },
    { opacity: 1, scaleY: 1, yPercent: 0, filter: "blur(0px)", duration: 1.15, ease: "power2.out", stagger: { amount: 0.75, from: "random" }, ...opts });
}
export function charsOut(chars: Element[] | NodeListOf<Element>, opts: gsap.TweenVars = {}) {
  return gsap.to(chars, { opacity: 0, scaleY: 1.3, filter: "blur(10px)", duration: 0.55, ease: "power2.in", stagger: { amount: 0.3, from: "random" }, ...opts });
}
