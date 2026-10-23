"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PHOTOS = [
  "living", "study", "bedroom", "second-bedroom", "pickleball", "football",
  "kitchen", "bowling", "rooftop", "basketball", "creator-studio",
].map((name) => `/images/intro/${name}.webp`);
const FRAMES = [...PHOTOS, "/images/jutaku-exterior-hero.webp"];
const FRAME_MS = 205;

type Phase = "loading" | "cycling" | "reveal" | "expand" | "leave" | "done";

export function IntroLoader() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [frame, setFrame] = useState(0);
  const skipRef = useRef<() => void>(() => {});

  const finish = useCallback(() => {
    document.documentElement.classList.remove("intro-active");
    document.documentElement.classList.add("intro-seen");
    window.__lenis?.start();
    setPhase("done");
  }, []);

  useEffect(() => {
    if (window.location.hash || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skipTimer = window.setTimeout(finish, 0);
      return () => window.clearTimeout(skipTimer);
    }

    document.documentElement.classList.remove("intro-seen");
    document.documentElement.classList.add("intro-active");
    window.__lenis?.stop();
    let cancelled = false;
    const timers: number[] = [];
    const later = (callback: () => void, delay: number) => timers.push(window.setTimeout(() => {
      if (!cancelled) callback();
    }, delay));
    const stop = () => { cancelled = true; timers.forEach(window.clearTimeout); };
    skipRef.current = () => { stop(); finish(); };

    const ready = FRAMES.map((src) => {
      const image = new window.Image();
      image.src = src;
      return image.decode().catch(() => undefined);
    });
    void Promise.all([
      ready[ready.length - 1],
      Promise.race([
        Promise.all(ready),
        new Promise<void>((resolve) => { later(resolve, 1100); }),
      ]),
    ]).then(() => {
      if (cancelled) return;
      setPhase("cycling");
      FRAMES.slice(1).forEach((_, index) => later(() => setFrame(index + 1), (index + 1) * FRAME_MS));
      const end = FRAMES.length * FRAME_MS;
      later(() => setPhase("reveal"), end + 180);
      later(() => setPhase("expand"), end + 870);
      later(() => setPhase("leave"), end + 2150);
      later(finish, end + 2700);
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") skipRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      stop();
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("intro-active");
      window.__lenis?.start();
    };
  }, [finish]);

  if (phase === "done") return null;

  return (
    <div className={`intro-loader intro-loader--${phase}`} role="region" aria-label="Jutaku opening preview">
      <div className={`intro-loader-frame${frame === FRAMES.length - 1 ? " intro-loader-frame--hero" : ""}`} style={{
        ["--intro-width" as string]: `${15 + frame / (FRAMES.length - 1) * 16}vw`,
        ["--intro-height" as string]: `${18 + frame / (FRAMES.length - 1) * 19}vw`,
        ["--intro-mobile-width" as string]: `${30 + frame / (FRAMES.length - 1) * 23}vw`,
        ["--intro-mobile-height" as string]: `${37 + frame / (FRAMES.length - 1) * 27}vw`,
      }} aria-hidden="true">
        {/* The previous image remains visible behind the next small image for a layered photo transition. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="intro-loader-previous" src={FRAMES[Math.max(0, frame - 1)]} alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={frame} className="intro-loader-current" src={FRAMES[frame]} alt="" fetchPriority="high" />
      </div>
      <span className="intro-loader-count" aria-hidden="true">{Math.round(((frame + 1) / FRAMES.length) * 100)}%</span>
      <button className="intro-loader-skip" type="button" onClick={() => skipRef.current()}>Skip intro</button>
    </div>
  );
}
