"use client";
import { useEffect, useRef, useState } from "react";
import { Split } from "@/components/Split";
import { gsap, scrollToId } from "@/lib/motion";
import { ROOMS } from "@/lib/data";

const MS = 5200;

/* AIR 00:20–00:24: "A TANGIBLE SENSE ——— OF STATUS", then a large photograph beside a quiet panel with a
   big index number, segment progress bars and the caption. Advances on its own; the bars are the timer. */
export function Gallery() {
  const root = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!live) return;
    const t = window.setTimeout(() => setI((v) => (v + 1) % ROOMS.length), MS);
    return () => clearTimeout(t);
  }, [i, live]);
  useEffect(() => {
    const el = root.current;
    if (!el || document.documentElement.classList.contains("reduced")) return;
    gsap.fromTo(el.querySelectorAll(".gl-panel .is-on"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: "power3.out" });
  }, [i]);

  const r = ROOMS[i];
  return (
    <div ref={root} className="gl">
      <Split left="THE FEELING" mid={<span className="lbl">Bedroom <i>·</i> Kitchen <i>·</i> Entry <i>·</i> Bathroom</span>} right="OF HOME" />
      <div className="gl-body">
        <div className="gl-pics">
          {ROOMS.map((x, k) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={x.slug} src={x.photo} alt={x.caption} loading="lazy" className={k === i ? "is-on" : ""} />
          ))}
        </div>
        <aside className="gl-panel">
          <div className="gl-bars">
            {ROOMS.map((x, k) => (
              <button key={x.slug} type="button" aria-label={x.name} onClick={() => setI(k)} className={k < i ? "done" : k === i ? "now" : ""}>
                <b key={`${k}-${i}-${live}`} style={{ ["--ms" as string]: `${MS}ms`, animationPlayState: live ? "running" : "paused" }} />
              </button>
            ))}
          </div>
          <span className="disp gl-num is-on" key={`n${i}`}>{String(i + 1).padStart(2, "0")}</span>
          <div className="gl-text">
            <p className="caps-serif gl-name is-on" key={`t${i}`}>{r.name}</p>
            <p className="gl-cap is-on" key={`c${i}`}>{r.italic}</p>
          </div>
          <button type="button" className="pill lbl gl-cta" onClick={() => scrollToId("contact")}>Book a visit <span aria-hidden>+</span></button>
        </aside>
      </div>
    </div>
  );
}
