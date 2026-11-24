"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, projectScrollTarget } from "@/lib/motion";
import { takeReturnScroll } from "@/components/ReturnNavigation";

/* Lenis on window, driven by the GSAP ticker so ScrollTrigger and smooth scroll share one clock. */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("reduced");
      return;
    }
    const l = new Lenis({
      lerp: 0.13,
      wheelMultiplier: 1,
      virtualScroll: (input) => {
        // Slow the final project panel before a large wheel gesture can skip the CTA.
        if (window.innerWidth <= 760 || !(input.event instanceof WheelEvent)) return true;
        const project = document.getElementById("project");
        const homesButton = project?.querySelector<HTMLElement>(".gm-view");
        const placePanel = project?.querySelector<HTMLElement>(".gm");
        const track = project?.querySelector<HTMLElement>(".hz-track");
        if (!project || !homesButton || !placePanel || !track) return true;
        const trigger = ScrollTrigger.getAll().find((item) => item.trigger === project && item.pin);
        if (!trigger || l.targetScroll < trigger.start || l.targetScroll > trigger.end) return true;
        const travel = Math.max(1, track.scrollWidth - window.innerWidth);
        const scrollRange = Math.max(1, trigger.end - trigger.start);
        const nextProgress = Math.max(0, Math.min(1, (l.targetScroll + input.deltaY - trigger.start) / scrollRange));
        const buttonLeft = placePanel.offsetLeft + homesButton.offsetLeft - nextProgress * travel;
        const reveal = Math.max(0, Math.min(1, (window.innerWidth * 2 - buttonLeft) / (window.innerWidth * 1.2)));
        input.deltaY *= 1 - reveal * .9;
        return true;
      },
    });
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
    const returnY = takeReturnScroll(window.location.pathname);
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (returnY === null && !id) return;

    let active = true;
    let timer = 0;
    let frame = 0;
    void document.fonts.ready.then(() => {
      if (!active) return;
      timer = window.setTimeout(() => {
        if (!active) return;
        ScrollTrigger.refresh();
        frame = window.requestAnimationFrame(() => {
          if (returnY !== null) {
            if (window.__lenis) window.__lenis.scrollTo(returnY, { immediate: true });
            else window.scrollTo(0, returnY);
            return;
          }
          const target = document.getElementById(id);
          if (!target) return;
          const projectTarget = projectScrollTarget(target);
          if (projectTarget !== null) {
            if (window.__lenis) window.__lenis.scrollTo(projectTarget, { immediate: true });
            else window.scrollTo(0, projectTarget);
            return;
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
