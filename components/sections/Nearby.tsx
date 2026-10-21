"use client";
import { useRef, useState } from "react";
import { gsap, useScene } from "@/lib/motion";

const FEATURE_IMAGE = "/images/tower-hero.webp";
const COLLAGE = [
  { src: "/images/sports-turf.webp", label: "Sports turf" },
  { src: "/images/clubhouse-exterior.webp", label: "Clubhouse exterior" },
  { src: "/images/residence-living.webp", label: "Living room" },
  { src: "/images/kanso-coworking.webp", label: "Kanso coworking studio" },
  { src: "/images/squash-court.webp", label: "Squash court" },
  { src: "/images/experience-centre-new.webp", label: "Experience centre" },
  { src: "/images/sports-turf.webp", label: "Sports turf view" },
];
const FEATURE = { src: FEATURE_IMAGE, label: "MEMCO Skyline tower" };
type Photo = (typeof COLLAGE)[number];
const FACTS = [
  { value: "600 M", label: "Singasandra Metro", note: "The closest metro connection." },
  { value: "1.2 KM", label: "Hosa Road Metro", note: "Another station within easy reach." },
  { value: "3 KM", label: "Electronic City", note: "A major work hub close to home." },
  { value: "10", label: "Healthcare", note: "Healthcare destinations nearby." },
  { value: "9", label: "Education", note: "Education destinations nearby." },
  { value: "4", label: "IT Parks", note: "Work districts in the neighbourhood." },
];

/* The chosen collage image fills the next scroll scene beneath the headline and cards. */
export function Nearby() {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<gsap.core.Timeline | null>(null);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [overlayOrigin, setOverlayOrigin] = useState(FEATURE.label);

  const selectPhoto = (photo: Photo, tile: HTMLElement) => {
    if (!root.current) return;
    const next = root.current.querySelector<HTMLElement>(".nb-next");
    const gallery = root.current.querySelector<HTMLElement>(".nb-gallery");
    const overlayIsExpanding = next ? Number(gsap.getProperty(next, "opacity")) > 0.01 : false;
    if (next && gallery && !overlayIsExpanding) {
      setOverlayOrigin(photo.label);
      const tileRect = tile.getBoundingClientRect();
      const galleryRect = gallery.getBoundingClientRect();
      gsap.set(next, {
        left: `${((tileRect.left - galleryRect.left) / galleryRect.width) * 100}%`,
        top: `${((tileRect.top - galleryRect.top) / galleryRect.height) * 100}%`,
        width: `${(tileRect.width / galleryRect.width) * 100}%`,
        height: `${(tileRect.height / galleryRect.height) * 100}%`,
        autoAlpha: 0,
      });
      if (selected) scene.current?.invalidate();
    }
    setSelected(photo);
    root.current.dataset.photoSelected = "true";
    root.current.style.setProperty("--nb-selected-photo", `url("${photo.src}")`);
  };

  useScene(root, ({ reduced, mobile }) => {
    if (!root.current) return;
    if (reduced) {
      root.current.dataset.canvasReady = "true";
      root.current.dataset.tone = "light";
      return;
    }

    const q = gsap.utils.selector(root);
    const feature = q(".nb-feature")[0];
    const next = q(".nb-next")[0];
    const shade = q(".nb-shade")[0];
    const gallery = q(".nb-gallery")[0];
    const tiles = q(".nb-tile");
    const hint = q(".nb-canvas-hint")[0];
    const marquee = q(".nb-marquee")[0];
    const mosaicFeatureRect = mobile
      ? { left: "51%", top: "26.5%", width: "47%", height: "22.5%" }
      : { left: "32%", top: "27%", width: "36%", height: "46%" };
    const mobileMosaicRects = [
      { left: "2%", top: "2%", width: "47%", height: "22.5%" },
      { left: "2%", top: "26.5%", width: "47%", height: "22.5%" },
      { left: "51%", top: "2%", width: "47%", height: "22.5%" },
      { left: "2%", top: "51%", width: "47%", height: "22.5%" },
      { left: "51%", top: "51%", width: "47%", height: "22.5%" },
      { left: "2%", top: "75.5%", width: "47%", height: "22.5%" },
      { left: "51%", top: "75.5%", width: "47%", height: "22.5%" },
    ];
    const desktopMosaicRects = [
      { left: "0%", top: "-3%", width: "30.5%", height: "51%" },
      { left: "0%", top: "50%", width: "30.5%", height: "54%" },
      { left: "32%", top: "-3%", width: "36%", height: "27%" },
      { left: "32%", top: "75%", width: "36%", height: "29%" },
      { left: "69.5%", top: "-3%", width: "30.5%", height: "26%" },
      { left: "69.5%", top: "25%", width: "30.5%", height: "23%" },
      { left: "69.5%", top: "50%", width: "30.5%", height: "54%" },
    ];
    const mobileCanvasRects = [
      { left: "13.2%", top: "14%", width: "30.36%", height: "14.4%" },
      { left: "13.2%", top: "33.2%", width: "30.36%", height: "14.4%" },
      { left: "56.44%", top: "14%", width: "30.36%", height: "14.4%" },
      { left: "13.2%", top: "52.4%", width: "30.36%", height: "14.4%" },
      { left: "56.44%", top: "52.4%", width: "30.36%", height: "14.4%" },
      { left: "13.2%", top: "71.6%", width: "30.36%", height: "14.4%" },
      { left: "56.44%", top: "71.6%", width: "30.36%", height: "14.4%" },
    ];
    const mobileCanvasFeatureRect = { left: "56.44%", top: "33.2%", width: "30.36%", height: "14.4%" };
    const desktopCanvasRects = [
      { left: "9.5%", top: "15.8%", width: "9.9%", height: "14.44%" },
      { left: "21.2%", top: "42.4%", width: "9.9%", height: "14.44%" },
      { left: "45.05%", top: "15.8%", width: "9.9%", height: "14.44%" },
      { left: "29.3%", top: "69%", width: "9.9%", height: "14.44%" },
      { left: "80.6%", top: "15.8%", width: "9.9%", height: "14.44%" },
      { left: "68.9%", top: "42.4%", width: "9.9%", height: "14.44%" },
      { left: "60.8%", top: "69%", width: "9.9%", height: "14.44%" },
    ];
    const desktopCanvasFeatureRect = { left: "45.05%", top: "42.4%", width: "9.9%", height: "14.44%" };

    gsap.set(feature, mobile ? mobileCanvasFeatureRect : desktopCanvasFeatureRect);
    tiles.forEach((tile, index) => gsap.set(tile, (mobile ? mobileCanvasRects : desktopCanvasRects)[index]));
    root.current.dataset.canvasReady = "false";
    (gallery as HTMLElement).inert = true;
    gsap.set(next, { ...mosaicFeatureRect, autoAlpha: 0 });
    gsap.set(shade, { opacity: 0 });
    gsap.set(hint, { autoAlpha: 0 });
    gsap.set(marquee, { yPercent: -50, xPercent: -4, autoAlpha: 0 });

    const timeline = gsap.timeline({
      onUpdate: () => {
        if (!root.current) return;
        const progress = timeline.progress();
        const featureWidth = Number.parseFloat((feature as HTMLElement).style.width);
        const visibleTile = tiles.find((tile) => tile.getAttribute("data-selected-tile") !== "true") ?? tiles[0];
        const canvasReady = featureWidth >= (mobile ? 45 : 30)
          && Number(gsap.getProperty(visibleTile, "opacity")) > 0.45;
        root.current.dataset.canvasReady = canvasReady ? "true" : "false";
        root.current.dataset.overlayActive = timeline.time() >= 0.86 ? "true" : "false";
        (gallery as HTMLElement).inert = !canvasReady;
        root.current.dataset.tone = progress < 0.66 ? "light" : "dark";
      },
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (mobile ? 4.4 : 3.9)}`,
        scrub: 0.65,
        invalidateOnRefresh: true,
      },
    });
    scene.current = timeline;
    const mosaicRects = mobile ? mobileMosaicRects : desktopMosaicRects;
    tiles.forEach((tile, index) => timeline.to(tile, { ...mosaicRects[index], duration: 0.45, ease: "power1.inOut" }, 0));
    timeline.to(feature, { ...mosaicFeatureRect, duration: 0.45, ease: "power1.inOut" }, 0);
    timeline
      .to(hint, { autoAlpha: 1, duration: 0.07, ease: "none" }, 0.44)
      .to(hint, { autoAlpha: 0, duration: 0.08, ease: "none" }, 0.78)
      .to(next, { autoAlpha: 1, duration: 0.06, ease: "none" }, 0.8)
      .fromTo([...tiles, feature], { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.18, ease: "none" }, 1.04)
      .to(next, { left: "0%", top: "0%", width: "100%", height: "100%", duration: 0.42, ease: "power1.inOut" }, 0.8)
      .to(marquee, { autoAlpha: 1, duration: 0.05, ease: "none" }, 1.25)
      .to(marquee, { xPercent: -65, duration: 0.74, ease: "none" }, 1.25)
      .to(shade, { opacity: 1, duration: 0.36, ease: "none" }, 1.25);

    q(".nb-fact").forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0.35, y: 16 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            end: "top 70%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => {
      scene.current = null;
      if (!root.current) return;
      root.current.dataset.tone = "light";
      root.current.dataset.canvasReady = "false";
      root.current.dataset.overlayActive = "false";
      (gallery as HTMLElement).inert = false;
    };
  });

  return (
    <section id="living" ref={root} className="nb" data-tone="light" data-own-reveals aria-label="Living and location">
      <div id="location" className="nb-stage">
        <div className="nb-gallery">
          <div className="nb-collage">
            {COLLAGE.map((photo, index) => (
              <button className={`nb-tile nb-tile-${index + 1}`} key={`${photo.src}-${index}`} type="button"
                data-selected-tile={selected?.label === photo.label ? "true" : undefined}
                data-overlay-origin={overlayOrigin === photo.label ? "true" : undefined}
                aria-pressed={selected?.label === photo.label}
                aria-label={`Explore ${photo.label}`} onClick={(event) => selectPhoto(photo, event.currentTarget)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt="" loading="lazy" />
              </button>
            ))}
          </div>

          <button className="nb-feature" type="button" aria-label="Explore MEMCO Skyline tower"
            data-selected-tile={!selected || selected.label === FEATURE.label ? "true" : undefined}
            data-overlay-origin={overlayOrigin === FEATURE.label ? "true" : undefined}
            aria-pressed={selected?.label === FEATURE.label}
            onClick={(event) => selectPhoto(FEATURE, event.currentTarget)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FEATURE_IMAGE} alt="" loading="lazy" />
          </button>

          <div className="nb-next" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={selected?.label ?? FEATURE.label} src={selected?.src ?? FEATURE_IMAGE} alt="" />
            <span className="nb-shade" aria-hidden="true" />
          </div>
        </div>

        <p className="nb-canvas-hint lbl">
          {selected ? "Scroll to continue" : "Choose a space to continue"}
        </p>

        <h2 className="nb-marquee disp" aria-label="At the center of life">
          <span aria-hidden="true">AT THE CENTER OF LIFE&nbsp; · &nbsp;AT THE CENTER OF LIFE&nbsp; · &nbsp;AT THE CENTER OF LIFE</span>
        </h2>
      </div>

      <ul className="nb-facts" aria-label="Nearby places">
        {FACTS.map((fact) => (
          <li className="nb-fact" key={fact.label}>
            <span className="nb-fact-value disp">{fact.value}</span>
            <span className="nb-fact-label">{fact.label}</span>
            <span className="nb-fact-note lbl">Begur · South Bengaluru</span>
            <p className="nb-fact-desc">{fact.note}</p>
          </li>
        ))}
      </ul>

    </section>
  );
}
