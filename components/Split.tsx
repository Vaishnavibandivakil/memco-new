"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useScene } from "@/lib/motion";

/* Split headline: the two halves sit on the page margins ("THE FEELING ——— OF HOME") joined by a fine hairline,
   so the space between them reads as deliberate. As the line scrolls in, the halves slide out from the centre
   and the hairlines draw outward with them. The centre piece is a short label or buttons. */
export function Split({ left, right, mid, className = "" }: { left: string; right: string; mid?: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useScene(ref, ({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(ref);
    const st = { trigger: ref.current, start: "top 98%", end: "top 55%", scrub: 1 };
    gsap.fromTo(q(".sl-l"), { xPercent: 55, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "power2.out", scrollTrigger: st });
    gsap.fromTo(q(".sl-r"), { xPercent: -55, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "power2.out", scrollTrigger: st });
    gsap.fromTo(q(".sl-rule"), { scaleX: 0 }, { scaleX: 1, ease: "power2.out", scrollTrigger: { ...st, start: "top 90%", end: "top 50%" } });
    if (q(".sl-m").length) gsap.fromTo(q(".sl-m"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, ease: "power2.out", scrollTrigger: { ...st, start: "top 80%", end: "top 55%" } });
  });
  return (
    <div ref={ref} className={`split ${className}`}>
      <span className="disp sl-l">{left}</span>
      {/* the joint: tapered hairlines meeting at the centre piece (a short label or the buttons) */}
      <span className="sl-mid" aria-hidden={mid ? undefined : true}>
        <i className="sl-rule sl-rule-l" />
        {mid ? <span className="sl-m">{mid}</span> : null}
        {mid ? <i className="sl-rule sl-rule-r" /> : null}
      </span>
      <span className="disp sl-r">{right}</span>
    </div>
  );
}
