"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowUpRight, Play, X } from "lucide-react";
import { INSIGHT_VIDEOS, type InsightVideo } from "@/lib/insights";
import { SubpageHeader } from "@/components/SubpageHeader";

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
      <div className="insights-spread">
        <div className="insights-spread-cover">
          <button type="button" className="insights-cover-film" onClick={() => setPlaying(videos[0])} aria-label={`Watch ${videos[0].title}`}>
            <InsightImage video={videos[0]} />
            <span className="insights-cover-details" aria-hidden="true">
              <span className="insights-cover-category">01 / {videos[0].category}</span>
              <span className="insights-cover-bottom"><strong>Inside Jutaku</strong><span>Watch film <Play size={12} fill="currentColor" /></span></span>
            </span>
          </button>
        </div>
        <div className="insights-spread-page">
          <div className="insights-spread-top lbl"><span>Jutaku / Insights</span><Link href="/insights">View all films</Link></div>
          <h2 id="insights-title">The Jutaku<br />journal.</h2>
          <p className="insights-spread-intro">Films from the Experience Centre, its people and the spaces taking shape.</p>
          <div className="insights-spread-films" aria-label="More featured films">
            {videos.slice(1).map((video, index) => (
              <button type="button" className="insights-spread-film" key={video.id} onClick={() => setPlaying(video)} aria-label={`Watch ${video.title}`}>
                <span className="insights-spread-film-caption"><small>0{index + 2} / {video.category}</small><strong>{video.previewTitle ?? video.title}</strong></span>
                <span className="insights-spread-film-image"><InsightImage video={video} /><span className="insights-film-play" aria-hidden="true"><Play size={15} fill="currentColor" /></span></span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}

export function InsightsLibrary() {
  const [playing, setPlaying] = useState<InsightVideo | null>(null);
  return (
    <main className="insights-page">
      <SubpageHeader className="insights-page-header" label="Jutaku / Insights" closeHref="/#insights" closeLabel="Insights" />
      <div className="insights-page-intro"><p className="insights-eyebrow lbl">Jutaku / Films 01—06</p><h1 className="disp">The Jutaku<br />journal</h1><p>Visit the Experience Centre, meet the people involved and see the spaces taking shape.</p></div>
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
