"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion";

export function ClosingMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const view = document.querySelector<HTMLElement>(".sv");
      const contact = document.querySelector<HTMLElement>(".cl");

      if (view) {
        const viewTimeline = gsap.timeline({ paused: true });
        viewTimeline
          .fromTo(view.querySelector(".sv-kicker"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" })
          .fromTo(view.querySelectorAll(".sv-title > span"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.14 }, "-=0.28")
          .fromTo(view.querySelector(".sv-sub"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.42");
        ScrollTrigger.create({ trigger: view, start: "top 72%", once: true, onEnter: () => viewTimeline.play() });
      }

      if (contact) {
        const contactTimeline = gsap.timeline({ paused: true });
        contactTimeline
          .fromTo(contact.querySelector(".cl-contact .mark"), { autoAlpha: 0, scale: 0.88 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out" })
          .fromTo(contact.querySelector(".cl-phone"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" }, "-=0.24")
          .fromTo(contact.querySelector(".cl-info"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.45");
        ScrollTrigger.create({ trigger: contact, start: "top 80%", once: true, onEnter: () => contactTimeline.play() });
      }
    });

    return () => context.revert();
  }, []);

  return null;
}
