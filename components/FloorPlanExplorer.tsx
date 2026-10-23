"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownRight, X } from "lucide-react";

const FLOORS = [0, ...Array.from({ length: 14 }, (_, index) => index + 1)];

export function FloorPlanExplorer({ initialFloor = 0 }: { initialFloor?: number }) {
  const [floor, setFloor] = useState(initialFloor);
  const ground = floor === 0;
  const even = floor >= 2 && floor <= 12 && floor % 2 === 0;
  const src = ground ? "/images/floor-plans/ground-floor.png" : even ? "/images/floor-plans/even-floors.png" : "/images/floor-plans/building-plans.png";
  const title = ground ? "Ground floor master plan" : `Level ${String(floor).padStart(2, "0")}`;

  return (
    <main className="fp-page">
      <header className="fp-header">
        <Link className="fp-brand" href="/#top" aria-label="MEMCO Skyline home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/lockup-h.png" alt="MEMCO Skyline" />
          <span aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/jutaku.png" alt="Jutaku" />
        </Link>
        <Link className="fp-close" href="/#choose-home" aria-label="Close floor plans and return to the home page"><X size={20} strokeWidth={1.7} aria-hidden="true" /></Link>
      </header>

      <div className="fp-heading">
        <div>
          <p className="fp-kicker">Explore the spaces</p>
          <h1>Floor plans<span className="fp-heading-dot">.</span></h1>
        </div>
        <p>Explore the ground floor master plan and the supplied building layouts. Select a level to see its plan.</p>
      </div>

      <nav className="fp-levels" aria-label="Choose a floor">
        {FLOORS.map((level) => (
          <button key={level} type="button" className={floor === level ? "is-active" : ""} aria-current={floor === level ? "true" : undefined} onClick={() => setFloor(level)}>
            {level === 0 ? "Ground" : String(level).padStart(2, "0")}
          </button>
        ))}
      </nav>

      <section className="fp-drawing" aria-live="polite" aria-label={title}>
        <div className="fp-drawing-head">
          <div><span>{ground ? "Master plan" : even ? "Even floor plan" : "Building plan"}</span><h2>{title}</h2></div>
        </div>
        <figure className={ground || even ? "fp-image fp-image--wide" : "fp-image fp-image--overview"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={src} src={src} alt={ground ? "Ground floor master plan supplied by the project" : even ? "Building floor plan labeled for levels 2, 4, 6, 8, 10 and 12" : "Building plan sheet with layouts for levels 1, 3, 5, 7, 9, 11, 13 and 14, plus terrace and stilt"} />
        </figure>
        <p className="fp-caption">{ground ? "Ground floor master plan" : even ? "The supplied drawing identifies this plan for levels 02, 04, 06, 08, 10 and 12." : "The selected level is labeled on the building plan sheet."}</p>
      </section>

      {!ground && <section id="studio-type-1" className="fp-unit-detail" aria-label="Studio unit layout">
        <div><span>Inside the plan</span><h2>Studio Type 1</h2><p>A closer look at the studio unit layout shown in the building plans.</p></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/floor-plans/studio-type-1.png" alt="Studio Type 1 layout with two adjoining units" loading="lazy" />
      </section>}

      <footer className="fp-footer">
        <p>See the spaces in person.</p>
        <Link href="/book-visit">Book a visit <ArrowDownRight size={18} aria-hidden="true" /></Link>
      </footer>
    </main>
  );
}
