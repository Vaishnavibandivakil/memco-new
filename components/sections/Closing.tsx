import { Chars } from "@/components/Chars";
import { PHONE, EMAIL, ADDRESS, RERA } from "@/lib/data";

/* Reference 01:38–01:44 — "PERFECT SEA VIEWS": a full-bleed photograph scrolls in with its title surfacing
   on top; the deep contact page follows and the phone number writes itself in giant condensed numerals. */
export function Closing() {
  const tel = PHONE.replace(/[^+\d]/g, "");
  return (
    <>
      <section className="sv" data-tone="dark">
        <div className="sv-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/rooftop-pool.jpg" alt="Skyline Aqua Lounge, the rooftop pool deck on level 22" loading="lazy" data-parallax="8" />
        </div>
        <p className="lbl sv-kicker" data-fade>Skyline Aqua Lounge · Level 22</p>
        <h2 className="disp sv-title">
          <span data-chars><Chars text="A 56 FT POOL" /></span>
          <span data-chars data-delay="0.2"><Chars text="ON LEVEL 22" /></span>
        </h2>
        <p className="lbl sv-sub" data-fade data-delay="0.6">Open 24 hours</p>
      </section>

      <section id="contact" className="cl" data-tone="dark">
        <div className="cl-contact">
          <span className="mark mark-light" aria-hidden data-fade />
          <a className="disp cl-phone" href={`tel:${tel}`} data-chars><Chars text="+91 91872 24980" /></a>
          <div className="cl-info">
            <p className="lbl" data-fade data-delay="0.3">Experience Center · now open</p>
            <p className="lbl dim" data-fade data-delay="0.4">{ADDRESS}</p>
            <p className="lbl" data-fade data-delay="0.5"><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          </div>
        </div>
        <footer className="cl-foot">
          {/* co-branding lockup (§05): MEMCO leads, Jutaku follows at 70% of its height — reversed white on green */}
          <div className="cl-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cl-memco" src="/brand/lockup-h-white.png" alt="MEMCO Skyline" width={856} height={243} />
            <span className="cl-div" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cl-jutaku" src="/brand/jutaku-white.png" alt="Jutaku" width={379} height={260} />
          </div>
          <p className="lbl cl-legal">MEMCO Skyline · Jutaku<br /><span className="dim">RERA {RERA}</span></p>
          <p className="lbl cl-right">© 2026 MEMCO<br /><span className="dim">All rights reserved</span></p>
        </footer>
      </section>
    </>
  );
}
