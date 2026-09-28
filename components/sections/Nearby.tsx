"use client";
import { useRef } from "react";
import { Split } from "@/components/Split";
import { gsap, ScrollTrigger, useScene } from "@/lib/motion";
import { COUNTS } from "@/lib/data";

const PICK = ["Metro", "Healthcare", "Education", "IT Parks"];
const CARDS = PICK.map((k) => ({ label: k, n: COUNTS.find(([c]) => c === k)?.[1] ?? 0 }));

/* AIR's "AT THE CENTER ——— OF LIFE" page, set in the ERA manner: flat MEMCO green, a rectangular photograph on
   one half, and on the other the statement plus four figures on hairlines (MEMCO's own "Explore Nearby"
   counts), which count up as they arrive. */
export function Nearby() {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(root);
    const cards = q(".nb-card");
    gsap.set(cards, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: q(".nb-cards")[0], start: "top 85%",
      onEnter: () => {
        gsap.to(cards, { opacity: 1, y: 0, duration: 1.2, stagger: 0.12, ease: "expo.out" });
        cards.forEach((c, i) => {
          const el = c.querySelector(".nb-n")!; const o = { v: 0 };
          gsap.to(o, { v: CARDS[i].n, duration: 1.6, delay: 0.2 + i * 0.12, ease: "power2.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
        });
      },
      onLeaveBack: () => gsap.set(cards, { opacity: 0, y: 30 }),
    });
  });
  return (
    <section id="location" ref={root} className="nb" data-tone="dark">
      <Split left="AT THE CENTER" mid={<span className="lbl">Begur <i>·</i> South Bengaluru</span>} right="OF LIFE" />
      <div className="nb-grid">
        {/* photo half: the tower, framed as a plain rectangle */}
        <figure className="nb-arch" data-rise>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/tower.webp" alt="MEMCO Skyline and its neighbourhood" loading="lazy" data-parallax="8" />
        </figure>
        {/* AIR half: the statement and four figures on hairlines */}
        <div className="nb-side">
          <p className="caps-serif nb-say" data-lines>Singasandra Metro is 600 m away, Hosa Road Metro 1.2 km, Electronic City 3 km.</p>
          <p className="lbl dim" data-fade data-delay="0.3">Off NH7 on Manipal County Road</p>
          <ul className="nb-cards">
            {CARDS.map((c) => (
              <li key={c.label} className="nb-card">
                <span className="disp nb-n">{c.n}</span>
                <span className="nb-foot"><span className="caps-serif nb-label">{c.label}</span><span className="lbl nb-sub">Nearby</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
