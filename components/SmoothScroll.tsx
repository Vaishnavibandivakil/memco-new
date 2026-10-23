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
    const l = new Lenis({ lerp: 0.13, wheelMultiplier: 1 });
    window.__lenis = l;
    if (document.documentElement.classList.contains("intro-active")) l.stop();
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

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    let active = true;
    let timer = 0;
    let frame = 0;
    void document.fonts.ready.then(() => {
      if (!active) return;
      timer = window.setTimeout(() => {
        if (!active) return;
        ScrollTrigger.refresh();
        frame = window.requestAnimationFrame(() => {
          const target = document.getElementById(id);
          if (!target) return;
          if (id === "location") {
            const project = document.getElementById("project");
            const horizontal = ScrollTrigger.getAll().find((trigger) => trigger.trigger === project && trigger.pin);
            if (horizontal) {
              const destination = horizontal.end - 2;
              if (window.__lenis) window.__lenis.scrollTo(destination, { immediate: true });
              else window.scrollTo(0, destination);
              return;
            }
          }
          if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
          else target.scrollIntoView({ behavior: "auto", block: "start" });
        });
      }, 350);
    });

    return () => { active = false; window.clearTimeout(timer); window.cancelAnimationFrame(frame); };
  }, []);
  return null;
}
