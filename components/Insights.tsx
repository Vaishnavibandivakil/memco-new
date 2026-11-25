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

export function VideoModal({ video, onClose }: { video: InsightVideo | null; onClose: () => void }) {
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
  const videos = INSIGHT_VIDEOS.filter((video) => video.id !== INSIGHT_VIDEOS[0].id && video.id !== INSIGHT_VIDEOS[2].id);

  return (
    <section id="insights" className="insights-preview" data-tone="light" aria-labelledby="insights-title">
      <div className="insights-flow">
        <div className="insights-flow-heading">
          <p className="lbl">Insights / films</p>
          <h2 id="insights-title">More from Jutaku.</h2>
          <p>Follow the landscape, shared spaces and people behind the project.</p>
          <Link className="insights-flow-all" href="/insights">View all films</Link>
        </div>
        <ol className="insights-flow-list" aria-label="More Jutaku films">
          {videos.map((video, index) => (
            <li key={video.id}>
              <button type="button" className="insights-flow-film" onClick={() => setPlaying(video)} aria-label={`Watch ${video.title}`}>
                <span className="insights-flow-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="insights-flow-image"><InsightImage video={video} /><span className="insights-flow-play"><Play size={15} fill="currentColor" aria-hidden="true" /></span></span>
                <span className="insights-flow-copy"><small>{video.category}</small><strong>{video.previewTitle ?? video.title}</strong><span>{video.description}</span></span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}

export function InsightsLibrary() {
  const [playing, setPlaying] = useState<InsightVideo | null>(null);
  return (
    <main className="insights-page">
      <SubpageHeader className="insights-page-header" closeHref="/#insights" />
      <div className="insights-page-intro"><p className="insights-eyebrow lbl">Films 01—{String(INSIGHT_VIDEOS.length).padStart(2, "0")}</p><h1 className="disp">The Jutaku<br />journal</h1><p>Follow the project vision, tree relocation, Experience Centre and events as Jutaku takes shape.</p></div>
      <div className="insights-library" aria-label="Jutaku videos">
        {INSIGHT_VIDEOS.map((video, index) => (
          <button type="button" className="insights-library-card" key={video.id} onClick={() => setPlaying(video)} aria-label={`Watch ${video.title}`}>
            <span className="insights-library-media"><InsightImage video={video} /><span className="insights-library-play"><Play size={18} fill="currentColor" aria-hidden="true" /></span></span>
            <span className="insights-library-meta"><small>{String(index + 1).padStart(2, "0")} / {video.category}</small><strong>{video.title}</strong><span>{video.description}</span></span>
          </button>
        ))}
      </div>
      <footer className="insights-page-footer"><span>Jutaku, Singasandra · South Bengaluru</span><Link href="/book-visit">Visit the Experience Centre <ArrowUpRight size={16} aria-hidden="true" /></Link></footer>
      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </main>
  );
}
