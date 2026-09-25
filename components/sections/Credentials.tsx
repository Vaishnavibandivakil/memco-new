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
      <p className="lbl cr-kicker" data-fade>The luxury of coming home<br /><span className="dim">Book your Jutaku Experience</span></p>
      <i className="cr-rule" aria-hidden data-draw />
      <h2 className="cr-body disp">
        <span className="cr-line" data-chars><Chars text="RERA" /><sup>*</sup></span>
        <span className="cr-line" data-chars data-delay="0.15"><Chars text="REGISTERED" /></span>
        <span className="cr-line" data-chars data-delay="0.3"><Chars text="STARTING FROM" /></span>
        <span className="cr-line" data-chars data-delay="0.45"><Chars text={PRICE.toUpperCase()} /></span>
      </h2>
      <p className="lbl cr-fine" data-fade data-delay="0.6">*{RERA}<br />{PRICE_NOTE}</p>
    </section>
  );
}
