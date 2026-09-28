"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chars } from "@/components/Chars";
import { getInventory, typeName, SAMPLE_NOTE, type Unit } from "@/lib/inventory";
import { HomePlanSvg } from "@/components/HomePlanSvg";
import { EMAIL } from "@/lib/data";
import { gsap, charsIn, lenis } from "@/lib/motion";

/* open from anywhere: every "View available homes" / "Select a home" button calls this */
export const openHomes = () => window.dispatchEvent(new Event("homes:open"));

const PHOTO_CARDS = [
  { title: "Own 500. Experience 50,000", body: "Professionally managed. Every home has access to all of it.", photo: "/images/club-cowork.jpg" },
  { title: "Serenity Park", body: "290 of the trees on the plot were kept where they stood.", photo: "/images/serenity-park.webp" },
  { title: "Skyline Sports Deck", body: "Pickleball, box cricket and squash on the roof. 18,800 sq ft.", photo: "/images/rooftop-squash.webp" },
];
const PAGE = 11;

/* Reference 00:20–00:26 — "APARTMENTS 25": big title with a live count, quiet filters, a grid of plan cards
   with photo cards dropped in between. Not on the landing page: it is a full-screen panel that rises over the
   site when a "view homes" button is pressed, and closes with ✕ or Esc. Plans are the sample set from
   lib/inventory until CAD arrives. */
export function Homes() {
  const root = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setOpen(true);
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("homes:open", on);
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("homes:open", on); window.removeEventListener("keydown", key); };
  }, []);

  /* rise from the bottom edge, then the title letters and filters settle; page scroll pauses underneath */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = document.documentElement.classList.contains("reduced");
    if (open) {
      lenis()?.stop();
      document.documentElement.classList.add("panel-open");
      scroller.current?.scrollTo(0, 0);
      gsap.set(el, { visibility: "visible" });
      if (reduced) { gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" }); return; }
      gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" });
      gsap.set(el.querySelectorAll(".hm-title .ch"), { opacity: 0 });
      charsIn(el.querySelectorAll(".hm-title .ch"), { delay: 0.55 });
      gsap.fromTo(el.querySelectorAll(".hm-count, .hm-filters, .hm-close, .hm-grid"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.7, ease: "power3.out" });
    } else {
      document.documentElement.classList.remove("panel-open");
      lenis()?.start();
      if (reduced) { gsap.set(el, { visibility: "hidden" }); return; }
      gsap.to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut", onComplete: () => { gsap.set(el, { visibility: "hidden" }); } });
    }
  }, [open]);
  const all = useMemo(() => getInventory().flatMap((l) => l.units), []);
  const levels = useMemo(() => [...new Set(all.map((u) => u.level))], [all]);
  const [type, setType] = useState("all");
  const [level, setLevel] = useState("all");
  const [facing, setFacing] = useState("all");
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [shown, setShown] = useState(PAGE);

  const list = all.filter((u) =>
    (type === "all" || u.type === type) &&
    (level === "all" || u.level === Number(level)) &&
    (facing === "all" || u.facing.toLowerCase().startsWith(facing)) &&
    (!onlyOpen || u.status === "available"));

  const cards: ({ kind: "unit"; u: Unit } | { kind: "photo"; i: number })[] = [];
  list.slice(0, shown).forEach((u, i) => {
    cards.push({ kind: "unit", u });
    if (i % 5 === 1 && (i - 1) / 5 < PHOTO_CARDS.length) cards.push({ kind: "photo", i: (i - 1) / 5 });
  });

  const ask = (u: Unit) => `mailto:${EMAIL}?subject=${encodeURIComponent(`Enquiry: unit ${u.code}`)}&body=${encodeURIComponent(`Hi MEMCO Skyline, I'm interested in unit ${u.code} (${typeName(u.type)}, level ${u.level}). Could you share details?`)}`;

  return (
    <section id="homes" ref={root} className="hm" role="dialog" aria-modal="true" aria-label="Available homes" aria-hidden={!open} data-own-reveals>
      <button type="button" className="hm-close lbl" onClick={() => setOpen(false)} aria-label="Close homes">Close <span aria-hidden>✕</span></button>
      <div className="hm-scroll" ref={scroller} data-lenis-prevent>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hm-bloom" src="/images/gazebos.webp" alt="" loading="lazy" />
      <header className="hm-head">
        <h2 className="disp hm-title"><Chars text="HOMES" /></h2>
        <span className="disp hm-count" aria-live="polite">{list.length}</span>
      </header>
      <div className="hm-filters">
        <label className="lbl">Type
          <select value={type} onChange={(e) => { setType(e.target.value); setShown(PAGE); }}>
            <option value="all">All</option><option value="URBAN">Urban Unit</option><option value="CORNER">Corner Urban Unit</option>
          </select>
        </label>
        <label className="lbl">Level
          <select value={level} onChange={(e) => { setLevel(e.target.value); setShown(PAGE); }}>
            <option value="all">All</option>
            {levels.map((l) => <option key={l} value={l}>{String(l).padStart(2, "0")}</option>)}
          </select>
        </label>
        <label className="lbl">Facing
          <select value={facing} onChange={(e) => { setFacing(e.target.value); setShown(PAGE); }}>
            <option value="all">All</option><option value="north">North</option><option value="south">South</option>
          </select>
        </label>
        <label className="lbl hm-check"><input type="checkbox" checked={onlyOpen} onChange={(e) => { setOnlyOpen(e.target.checked); setShown(PAGE); }} /> Available only</label>
        <span className="lbl hm-note">{SAMPLE_NOTE}</span>
      </div>

      <div className="hm-grid">
        {cards.map((c) =>
          c.kind === "unit" ? (
            <a key={c.u.code} className={`hm-card${c.u.status !== "available" ? " is-sold" : ""}`} href={ask(c.u)}>
              <p className="lbl hm-card-top">{c.u.type === "CORNER" ? "Corner" : "Urban"} · Level {String(c.u.level).padStart(2, "0")}</p>
              <div className="hm-plan"><HomePlanSvg unit={c.u} /></div>
              <p className="lbl hm-card-meta">Unit {c.u.code} · {c.u.facing.split(" · ")[0]}</p>
              <h3 className="caps-serif">{typeName(c.u.type)}</h3>
              <p className="lbl hm-card-status">{c.u.status === "available" ? "Available · Enquire" : "Sold"}</p>
            </a>
          ) : (
            <figure key={`p${c.i}`} className="hm-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PHOTO_CARDS[c.i].photo} alt="" loading="lazy" />
              <figcaption><span className="caps-serif">{PHOTO_CARDS[c.i].title}</span><span>{PHOTO_CARDS[c.i].body}</span></figcaption>
            </figure>
          ),
        )}
      </div>
      {shown < list.length && (
        <button type="button" className="pill lbl hm-more" onClick={() => setShown((s) => s + PAGE)}>Show more homes</button>
      )}
      {list.length === 0 && <p className="caps-serif hm-empty">No homes match these filters.</p>}
      </div>
    </section>
  );
}
