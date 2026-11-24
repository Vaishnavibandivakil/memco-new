import { PHONE, EMAIL, ADDRESS, RERA } from "@/lib/data";
import { InsightsPreview } from "@/components/Insights";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { ClosingMotion } from "@/components/ClosingMotion";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import Link from "next/link";

export function Closing() {
  const tel = PHONE.replace(/[^+\d]/g, "");
  return (
    <>
      <ClosingMotion />
      <section className="sv" data-tone="dark">
        <div className="sv-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/rooftop-pool.jpg" alt="Skyline Aqua Lounge rooftop pool deck" loading="lazy" data-parallax="8" />
        </div>
        <p className="lbl sv-kicker">Skyline Aqua Lounge · Rooftop</p>
        <h2 className="disp sv-title">
          <span>A 56 FT POOL</span>
          <span>ABOVE THE CITY</span>
        </h2>
        <p className="lbl sv-sub">24/7 access planned</p>
      </section>

      <BlogPreview />
      <InsightsPreview />

      <section id="contact" className="cl" data-tone="dark">
        <footer className="cl-foot">
          <div className="cl-foot-columns">
            <div className="cl-brand-block">
              <div className="cl-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="cl-memco" src="/brand/lockup-h-white.png" alt="MEMCO Skyline" width={856} height={243} />
                <span className="cl-div" aria-hidden />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="cl-jutaku" src="/brand/jutaku-white.png" alt="Jutaku" width={379} height={260} />
              </div>
              <p>Urban living, thoughtfully shared.</p>
            </div>
            <div className="cl-contact">
              <h2>Contact</h2>
              <p className="cl-contact-address">Experience Centre · now open<br />{ADDRESS}</p>
              <a className="cl-phone" href={`tel:${tel}`}>{PHONE}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </div>
            <NewsletterSignup />
          </div>
          <div className="cl-foot-main">
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
