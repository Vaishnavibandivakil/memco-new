/* Reference 00:48 — the photograph scrolls up as a plain full-bleed image; the pull-quote lines rise out of
   their masks on top of it once it is on screen. No pin. */
export function Quote() {
  return (
    <section className="qt" data-tone="dark">
      <div className="qt-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/rooftop-dining.jpg" alt="Rooftop dining, MEMCO Skyline" loading="lazy" data-parallax="7" />
      </div>
      <blockquote className="qt-body">
        <span className="qt-mark" aria-hidden data-fade>&ldquo;</span>
        <p className="caps-serif" data-lines>Every home should be unique and special, just like the people who live in it.</p>
        <footer className="lbl" data-fade data-delay="0.5">MEMCO Skyline<br /><span>Jutaku · Urban lifestyle ecosystem</span></footer>
      </blockquote>
    </section>
  );
}
