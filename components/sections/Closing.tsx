import { PHONE, EMAIL, ADDRESS, RERA } from "@/lib/data";
import { InsightsPreview } from "@/components/Insights";
import { ClosingMotion } from "@/components/ClosingMotion";
import Link from "next/link";

export function Closing() {
  const tel = PHONE.replace(/[^+\d]/g, "");
  return (
    <>
      <ClosingMotion />
      <section className="sv" data-tone="dark">
        <div className="sv-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/rooftop-pool.jpg" alt="Skyline Aqua Lounge, the rooftop pool deck on level 22" loading="lazy" data-parallax="8" />
        </div>
        <p className="lbl sv-kicker">Skyline Aqua Lounge · Level 22</p>
        <h2 className="disp sv-title">
          <span>A 56 FT POOL</span>
          <span>ON LEVEL 22</span>
        </h2>
        <p className="lbl sv-sub">Open 24 hours</p>
      </section>

      <InsightsPreview />

      <section id="contact" className="cl" data-tone="dark">
        <div className="cl-contact">
          <span className="mark mark-light" aria-hidden />
          <a className="disp cl-phone" href={`tel:${tel}`}>{PHONE}</a>
          <div className="cl-info">
            <p className="lbl">Experience Centre · now open</p>
            <p className="lbl dim">{ADDRESS}</p>
            <p className="lbl"><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          </div>
        </div>
        <footer className="cl-foot">
          <div className="cl-foot-main">
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
          </div>
          <nav className="cl-policy-links lbl" aria-label="Legal information">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          </nav>
        </footer>
      </section>
    </>
  );
}
