import Link from "next/link";
import { ArrowDownRight, X } from "lucide-react";
import { ReturnLink } from "@/components/ReturnNavigation";

export function FloorPlanExplorer() {
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
        <ReturnLink className="fp-close" href="/#choose-home" aria-label="Close floor plans"><X size={20} strokeWidth={1.7} aria-hidden="true" /></ReturnLink>
      </header>

      <div className="fp-heading">
        <div>
          <p className="fp-kicker">From the supplied project drawings</p>
          <h1>Floor plans<span className="fp-heading-dot">.</span></h1>
        </div>
        <p>Explore an individual Urban Unit, two adjoining homes and their place on a typical floor.</p>
      </div>

      <div className="fp-layouts">
        <section className="fp-layout" aria-labelledby="fp-urban-title">
          <div className="fp-layout-copy"><span>01 / Individual home</span><h2 id="fp-urban-title">Urban Unit</h2><p>A Studio Type 1 home with its own kitchen, bathroom and patio.</p></div>
          <figure className="fp-layout-image fp-layout-image--single">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/floor-plans/urban-unit.webp" alt="Individual Studio Type 1 floor plan" />
            <figcaption>Individual layout</figcaption>
          </figure>
        </section>

        <section className="fp-layout" aria-labelledby="fp-pair-title">
          <div className="fp-layout-copy"><span>02 / Adjoining homes</span><h2 id="fp-pair-title">Two Urban Units</h2><p>A mirrored pair of separate homes, each with its own entrance and facilities.</p></div>
          <figure className="fp-layout-image fp-layout-image--pair">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/floor-plans/paired-urban-units.webp" alt="Two adjoining mirrored Studio Type 1 floor plans" loading="lazy" />
            <figcaption>Paired layout</figcaption>
          </figure>
        </section>

        <section className="fp-layout fp-layout--wide" aria-labelledby="fp-floor-title">
          <div className="fp-layout-copy"><span>03 / Building layout</span><h2 id="fp-floor-title">Across the floor</h2><p>The isometric view shows one core; the drawing below shows the arrangement across a typical floor.</p></div>
          <div className="fp-layout-views">
            <figure className="fp-layout-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/floor-plans/one-core.webp" alt="Isometric layout of a core with Urban Units, corridor, stairs and lifts" loading="lazy" />
              <figcaption>One core</figcaption>
            </figure>
            <figure className="fp-layout-image fp-layout-image--strip">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/floor-plans/typical-floor.webp" alt="Typical floor drawing showing three cores and Urban Units" loading="lazy" />
              <figcaption>Typical floor · levels 02, 04, 06, 08, 10 and 12</figcaption>
            </figure>
          </div>
        </section>
      </div>

      <footer className="fp-footer">
        <p>See the spaces in person.</p>
        <Link href="/book-visit">Book a visit <ArrowDownRight size={18} aria-hidden="true" /></Link>
      </footer>
    </main>
  );
}
