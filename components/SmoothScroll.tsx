"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion";

/* Lenis on window, driven by the GSAP ticker so ScrollTrigger and smooth scroll share one clock. */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("reduced");
      return;
    }
    const l = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    window.__lenis = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    /* re-measure every trigger when the page height settles (fonts, lazy images, filters) */
    let t = 0, h = 0;
    const ro = new ResizeObserver(() => {
      const nh = document.body.scrollHeight;
      if (Math.abs(nh - h) < 2) return;
      h = nh; clearTimeout(t); t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.body);
    return () => { ro.disconnect(); clearTimeout(t); gsap.ticker.remove(tick); l.destroy(); delete window.__lenis; };
  }, []);
  return null;
}
