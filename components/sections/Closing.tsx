import { InsightsPreview } from "@/components/Insights";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { ClosingMotion } from "@/components/ClosingMotion";

export function Closing() {
  return (
    <>
      <ClosingMotion />
      <section className="sv" data-tone="dark">
        <div className="sv-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/rooftop-pool.jpg" alt="Skyline Aqua Lounge rooftop pool deck" loading="lazy" data-parallax="8" />
        </div>
        <p className="lbl sv-kicker">Skyline Aqua Lounge · Rooftop</p>
        <h2 className="disp sv-title">
          <span>A 56 FT POOL</span>
          <span>ABOVE THE CITY</span>
        </h2>
        <p className="lbl sv-sub">24/7 access planned</p>
      </section>
      <BlogPreview />
      <InsightsPreview />
    </>
  );
}
