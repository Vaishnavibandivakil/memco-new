import { Chars } from "@/components/Chars";
import { RERA } from "@/lib/data";
import { PRICE, PRICE_NOTE } from "@/lib/content";

/* Reference 01:37 — the "licence obtained" page: stacked condensed caps, each line surfacing letter by
   letter in turn, a hairline dropping from the kicker, greenery hanging in from the corner. */
export function Credentials() {
  return (
    <section id="pricing" className="cr" data-tone="light">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="cr-deco" src="/images/walking-trails.jpg" alt="" loading="lazy" data-rise />
      <p className="lbl cr-kicker" data-fade>Smart ownership at Jutaku<br /><span className="dim">A private home. Shared possibilities.</span></p>
      <i className="cr-rule" aria-hidden data-draw />
      <h2 className="cr-body disp">
        <span className="cr-line" data-chars><Chars text="RERA" /><sup>*</sup></span>
        <span className="cr-line" data-chars data-delay="0.15"><Chars text="REGISTERED" /></span>
        <span className="cr-line" data-chars data-delay="0.3"><Chars text="STARTING FROM" /></span>
        <span className="cr-line" data-chars data-delay="0.45"><Chars text={PRICE.toUpperCase()} /></span>
      </h2>
      <p className="lbl cr-fine" data-fade data-delay="0.6">*{RERA}<br />{PRICE_NOTE}</p>
      <div className="cr-stamp" aria-hidden="true" data-fade data-delay="0.75">
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="120" cy="120" r="106" stroke="currentColor" strokeWidth="7" />
          <circle cx="120" cy="120" r="94" stroke="currentColor" strokeWidth="2" strokeDasharray="2 4" />
          <text x="120" y="65" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="800" letterSpacing="2.6">MEMCO SKYLINE</text>
          <text x="120" y="193" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="800" letterSpacing="3">JUTAKU</text>
          <rect x="8" y="86" width="224" height="69" fill="var(--paper)" stroke="currentColor" strokeWidth="5" />
          <text x="120" y="113" textAnchor="middle" fill="currentColor" fontSize="17" fontWeight="800" letterSpacing="4">RERA</text>
          <text x="120" y="142" textAnchor="middle" fill="currentColor" fontSize="25" fontWeight="900" letterSpacing="1">REGISTERED</text>
        </svg>
      </div>
    </section>
  );
}
