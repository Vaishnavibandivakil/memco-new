"use client";
import { useRef } from "react";
import SplitType from "split-type";
import { Chars } from "@/components/Chars";
import { gsap, ScrollTrigger, useScene, charsIn, PROJECT_TRAVEL_FRACTION } from "@/lib/motion";
import { ROUTE } from "@/lib/nearby-route";
import { openHomes } from "@/components/sections/Homes";
import { LocationStory } from "@/components/sections/LocationStory";

const PRINCIPLES = [
  { title: "Purpose-led design", detail: "Spaces shaped for everyday routines, not just for the view." },
  { title: "Functional flow", detail: "Layouts planned for living, working and moving through the day." },
  { title: "Shared by design", detail: "Music rooms, hosting kitchens and workspaces put occasional-use space to work for the community." },
  { title: "Nature in the plan", detail: "Preserved trees and the planned 12,000 sq ft Serenity Park shape the grounds." },
];

/* The page scroll drives one horizontal project sequence on desktop and mobile. */
export function Concept() {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ reduced, mobile, shortLandscape }) => {
    const q = gsap.utils.selector(root);
    const track = q(".hz-track")[0] as HTMLElement;
    const dist = () => track.scrollWidth - window.innerWidth;
    if (reduced || shortLandscape) return;
    if (mobile) {
      gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: root.current, start: "top top", end: () => `+=${dist() * 1.25}`,
          pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
      return;
    }
    const move = gsap.timeline({
      scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist() * 1.9 / PROJECT_TRAVEL_FRACTION}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
    });
    move.to(track, { x: () => -dist(), duration: PROJECT_TRAVEL_FRACTION, ease: "none" });
    move.to({}, { duration: 1 - PROJECT_TRAVEL_FRACTION });

    /* the Design panel is on screen when the pin starts */
    const s = new SplitType(q(".ds-statement")[0] as HTMLElement, { types: "lines", lineClass: "ln" });
    s.lines?.forEach((l) => { const m = document.createElement("span"); m.className = "ln-mask"; l.parentNode!.insertBefore(m, l); m.appendChild(l); });
    gsap.set(q(".ds-statement")[0], { visibility: "visible" });
    gsap.set(s.lines!, { yPercent: 110 });
    gsap.set(q(".ds-fade"), { opacity: 0, y: 16 });
    const designPhotos = q(".ds-hero");
    gsap.set(designPhotos, { opacity: 0, y: 18, scale: 0.985 });
    ScrollTrigger.create({
      trigger: root.current, start: "top 65%", once: true,
      onEnter: () => {
        gsap.to(s.lines!, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "power3.out" });
        gsap.to(q(".ds-fade"), { opacity: 1, y: 0, duration: 1, stagger: 0.12, delay: 0.3, ease: "power3.out" });
        gsap.to(designPhotos, { opacity: 1, y: 0, scale: 1, duration: 1.05, stagger: 0.12, delay: 0.4, ease: "power3.out" });
      },
    });

    /* later panels: timed reveals keyed to the horizontal position */
    const when = (el: Element, play: () => void, start = "left 80%") =>
      ScrollTrigger.create({ trigger: el, containerAnimation: move, start, once: true, onEnter: play });

    const conceptLines = q(".cc-line");
    gsap.set(conceptLines, { yPercent: 112 });
    when(q(".cc-statement")[0], () => {
      gsap.to(conceptLines, { yPercent: 0, duration: 1.05, stagger: 0.13, ease: "power3.out" });
    }, "left 88%");

    q(".dp-photo, .cc-hero").forEach((photo) => {
      gsap.fromTo(photo, { clipPath: "inset(0% 0% 0% 100%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: photo, containerAnimation: move, start: "left 100%", end: "left 70%", scrub: 1 },
      });
      gsap.fromTo(photo.querySelector("img"), { scale: 1.16 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: photo, containerAnimation: move, start: "left 100%", end: "left 70%", scrub: 1 },
      });
    });

    q(".hz [data-hchars]").forEach((el) => {
      const chars = el.querySelectorAll(".ch");
      gsap.set(chars, { opacity: 0 });
      when(el, () => charsIn(chars, { delay: Number((el as HTMLElement).dataset.delay || 0) }));
    });
    q(".hz [data-hfade]").forEach((el) => {
      const homesButton = el.classList.contains("gm-view");
      gsap.set(el, { opacity: 0, y: 18 });
      when(el, () => gsap.to(el, { opacity: 1, y: 0, duration: homesButton ? .55 : 1, ease: "power3.out", delay: Number((el as HTMLElement).dataset.delay || 0) }), homesButton ? "left 120%" : "left 88%");
    });
    /* the photo opens as it slides in */
    gsap.fromTo(q(".gm-pic"), { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: q(".gm-pic")[0], containerAnimation: move, start: "left 100%", end: "left 45%", scrub: true } });
    gsap.fromTo(q(".gm-pic img"), { xPercent: 12, scale: 1.15 }, { xPercent: -6, scale: 1.05, ease: "none", scrollTrigger: { trigger: q(".gm-pic")[0], containerAnimation: move, start: "left 100%", end: "right 0%", scrub: true } });
    return () => s.revert();
  });

  return (
    <section id="project" ref={root} className="hz" data-tone="light" data-own-reveals tabIndex={0} aria-label="Project, swipe sideways to explore sections">
      <div className="hz-track">
        <div id="design" className="hz-panel ds">
          <div className="ds-body">
            <p className="lbl ds-kicker ds-fade">01 / Design</p>
            <h2 className="caps-serif ds-statement">Built around <span>real life</span></h2>
            <p className="ds-intro ds-fade">Your private Urban Unit, around 500 sq ft super built-up, sits within a planned 50,000 sq ft ecosystem of shared spaces.</p>
          </div>
          <figure className="ds-hero ds-fade">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/intro/principles-bedroom.webp" alt="Urban Unit bedroom with a built-in desk and storage" loading="lazy" />
          </figure>
        </div>

        <div id="principles" className="hz-panel dp">
          <div className="dp-content">
            <div className="dp-heading">
              <p className="lbl" data-hfade>02 / Our approach</p>
              <h2 className="caps-serif" data-hfade>Design principles</h2>
              <p data-hfade>Private rooms serve everyday life. Spaces used less often are planned for the wider community.</p>
            </div>
            <ol className="dp-list" aria-label="Design principles">
              {PRINCIPLES.map((item, index) => <li key={item.title} data-hfade><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div></li>)}
            </ol>
          </div>
          <figure className="dp-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/intro/shared-workspace.webp" alt="Shared work room with a table and lounge seating" loading="lazy" />
          </figure>
        </div>

        <div className="hz-panel dp-mobile-detail" aria-label="Design principles in detail">
          <div className="dp-mobile-detail-inner">
            <p className="lbl">02 / Our approach</p>
            <h2>In practice.</h2>
            <ol className="dp-mobile-list" aria-label="Design principles">
              {PRINCIPLES.map((item, index) => <li key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div></li>)}
            </ol>
          </div>
        </div>

        <div id="concept" className="hz-panel cc">
          <div className="cc-body">
            <p className="lbl cc-kicker" data-hfade>03 / The concept</p>
            <h2 className="caps-serif cc-statement" aria-label="Smart ownership. More life, shared.">
              <span className="cc-line-mask"><span className="cc-line">Smart ownership.</span></span>
              <span className="cc-line-mask"><span className="cc-line">More life, shared.</span></span>
            </h2>
            <p className="cc-intro" data-hfade>A compact private home handles everyday life. Music rooms, hosting kitchens and workspaces become planned shared spaces for the occasions that call for more.</p>
          </div>
          <figure className="cc-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/intro/urban-unit-interior.webp" alt="Urban Unit interior with living, sleeping and work space" loading="lazy" />
          </figure>
        </div>

        <div className="hz-panel cp">
          <div className="cp-content">
            <div className="cp-heading">
              <p className="lbl" data-hfade>04 / What this means</p>
              <h2 className="caps-serif" data-hfade>What comes with your home</h2>
            </div>
            <div className="cc-points">
              <article data-hfade><span>01</span><div><h3>A private base</h3><p>A standard 500.45 sq ft super built-up unit includes 327.13 sq ft of private living space.</p></div></article>
              <article data-hfade><span>02</span><div><h3>Space when you need it</h3><p>Planned shared spaces give you room to work, create and host when life calls for more.</p></div></article>
              <article data-hfade><span>03</span><div><h3>A shared ecosystem</h3><p>Professionally managed spaces connect 646 private Urban Units into one community.</p></div></article>
            </div>
          </div>
        </div>

        <LocationStory />

        {/* The place follows the nearby-stations graphic. */}
        <div className="hz-panel gm">
          <span className="gm-country lbl" data-hfade>Located between</span>
          <h2 className="gm-words disp" aria-label="Located between Begur Road and Hosa Road">
            <span className="gm-w1" data-hchars><Chars text="BEGUR ROAD" /></span>
            <span className="gm-w2" data-hchars data-delay="0.15"><Chars text="AND" /></span>
            <span className="gm-w3" data-hchars data-delay="0.3"><Chars text="HOSA ROAD" /></span>
          </h2>
          <figure className="gm-pic">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/intro/rooftop.webp" alt="Jutaku rooftop social space" loading="lazy" />
          </figure>
          <div className="gm-side">
            <h3 className="caps-serif" data-hfade>The metro, close to home</h3>
            <p data-hfade data-delay="0.1">Singasandra Metro is about {ROUTE[0].distance} from Jutaku and Hosa Road Metro about {ROUTE[1].distance}. Kudlu Gate and Beratena Agrahara are the next Yellow Line stops in either direction.</p>
          </div>
          <button type="button" className="round gm-view" data-hfade onClick={() => openHomes()}>
            <svg viewBox="0 0 100 100" aria-hidden><circle cx="50" cy="50" r="48" /></svg>
            <span className="lbl">View available<br />homes</span>
          </button>
        </div>
      </div>
    </section>
  );
}
