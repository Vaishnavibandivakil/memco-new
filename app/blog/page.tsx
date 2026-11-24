import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BLOG_STORIES } from "@/lib/blog";
import { SubpageHeader } from "@/components/SubpageHeader";

export const metadata: Metadata = {
  title: "Blog · MEMCO Skyline Jutaku",
  description: "Journal topics on life at Jutaku, its shared spaces and its Bengaluru neighbourhood.",
};

export default function BlogPage() {
  return (
    <main className="blog-page">
      <SubpageHeader closeHref="/#blog" />
      <div className="blog-page-inner">
        <p className="lbl blog-preview-eyebrow">Jutaku / Journal</p>
        <h1>Stories<span>.</span></h1>
        <p className="blog-page-intro">Full stories are on their way. Here is what we will be exploring.</p>
        <div className="blog-page-topics" aria-label="Upcoming journal topics">
          {BLOG_STORIES.map((story, index) => (
            <article key={story.slug}>
              <div className="blog-page-topic-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.image} alt={story.alt} loading="lazy" />
              </div>
              <div className="blog-page-topic-copy">
                <p className="lbl">{String(index + 1).padStart(2, "0")} / {story.category}</p>
                <h2>{story.title}</h2>
                <p>{story.summary}</p>
              </div>
            </article>
          ))}
        </div>
        <Link className="blog-page-home" href="/#blog">Back to Jutaku <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </main>
  );
}
