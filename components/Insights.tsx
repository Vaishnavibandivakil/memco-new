"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Play, X } from "lucide-react";
import { INSIGHT_VIDEOS, type InsightVideo } from "@/lib/insights";

function InsightImage({ video }: { video: InsightVideo }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={video.image}
      alt=""
      loading="lazy"
      onError={(event) => { event.currentTarget.src = video.fallbackImage; }}
      onLoad={(event) => {
        const image = event.currentTarget;
        if (image.naturalWidth < 500 && !image.src.endsWith(video.fallbackImage)) image.src = video.fallbackImage;
      }}
    />
  );
}

function VideoModal({ video, onClose }: { video: InsightVideo | null; onClose: () => void }) {
  useEffect(() => {
    if (!video) return;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = priorOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [video, onClose]);

  if (!video || typeof document === "undefined") return null;
  return createPortal(
    <div className="insight-modal" role="dialog" aria-modal="true" aria-label={video.title} onClick={onClose}>
      <div className="insight-modal-inner" onClick={(event) => event.stopPropagation()}>
        <div className="insight-modal-top"><div><span>{video.category}</span><h2>{video.title}</h2></div><button type="button" onClick={onClose} aria-label="Close video"><X size={22} /></button></div>
        <div className="insight-player"><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
        <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">Watch on YouTube <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    </div>, document.body,
  );
}

export function InsightsPreview() {
  const [playing, setPlaying] = useState<InsightVideo | null>(null);
  const videos = INSIGHT_VIDEOS.slice(0, 3);

  return (
    <section id="insights" className="insights-preview" data-tone="light" aria-labelledby="insights-title">
      <div className="insights-preview-top">
        <p className="insights-eyebrow lbl">Jutaku / Insights</p>
        <Link href="/insights" className="insights-all lbl">View all films <ArrowUpRight size={13} aria-hidden="true" /></Link>
      </div>
      <h2 id="insights-title" className="sr-only">Stories from Jutaku</h2>
      <div className="insights-artboard" aria-label="Featured films">
        {videos.map((video, index) => (
          <div className={`insights-feature insights-feature-${index + 1}`} key={video.id}>
            <button type="button" className="insights-feature-image" onClick={() => setPlaying(video)} aria-label={`Watch ${video.title}`}>
              <InsightImage video={video} />
              <span className="insights-feature-play lbl" aria-hidden="true"><Play size={12} fill="currentColor" /> Play film</span>
            </button>
            {index < 2 ? (
              <div className="insights-feature-caption">
                <span>{String(index + 1).padStart(2, "0")} / {video.category}</span>
                <span>{video.previewTitle ?? video.title}</span>
              </div>
            ) : (
              <div className="insights-feature-note">
                <span>03 / {video.category}</span>
                <p>Small private spaces, a larger world to explore. See the places and people shaping life at Jutaku.</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="insights-preview-foot lbl"><span>MEMCO Skyline · South Bengaluru</span><span>Films 01 — 03</span></div>
      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}

export function InsightsLibrary() {
  const [playing, setPlaying] = useState<InsightVideo | null>(null);
  return (
    <main className="insights-page">
      <header className="insights-page-header"><Link href="/#insights" className="lbl"><ArrowLeft size={18} aria-hidden="true" /> Back to site</Link><span className="lbl">MEMCO Skyline / Jutaku</span></header>
      <div className="insights-page-intro"><p className="insights-eyebrow lbl">Jutaku / Films 01—06</p><h1 className="disp">The Jutaku<br />journal</h1><p>Meet the people, explore the places, and see the ideas behind the Jutaku experience.</p></div>
      <div className="insights-library" aria-label="Jutaku videos">
        {INSIGHT_VIDEOS.map((video, index) => (
          <button type="button" className="insights-library-card" key={video.id} onClick={() => setPlaying(video)} aria-label={`Watch ${video.title}`}>
            <span className="insights-library-media"><InsightImage video={video} /><span className="insights-library-play"><Play size={18} fill="currentColor" aria-hidden="true" /></span></span>
            <span className="insights-library-meta"><small>{String(index + 1).padStart(2, "0")} / {video.category}</small><strong>{video.title}</strong><span>{video.description}</span></span>
          </button>
        ))}
      </div>
      <footer className="insights-page-footer"><span>Jutaku, Begur · South Bengaluru</span><Link href="/book-visit">Visit the Experience Centre <ArrowUpRight size={16} aria-hidden="true" /></Link></footer>
      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </main>
  );
}
