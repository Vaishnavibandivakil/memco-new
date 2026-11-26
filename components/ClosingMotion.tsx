"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion";

export function ClosingMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const view = document.querySelector<HTMLElement>(".sv");

      if (view) {
        const viewTimeline = gsap.timeline({ paused: true });
        viewTimeline
          .fromTo(view.querySelector(".sv-kicker"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" })
          .fromTo(view.querySelectorAll(".sv-title > span"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.14 }, "-=0.28")
          .fromTo(view.querySelector(".sv-sub"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.42");
        ScrollTrigger.create({ trigger: view, start: "top 72%", once: true, onEnter: () => viewTimeline.play() });
      }

    });

    return () => context.revert();
  }, []);

  return null;
}
