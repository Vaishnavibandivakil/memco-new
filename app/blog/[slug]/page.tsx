import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { SubpageHeader } from "@/components/SubpageHeader";
import { BLOG_STORIES } from "@/lib/blog";

type StoryPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_STORIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = BLOG_STORIES.find((item) => item.slug === slug);
  if (!story) return { title: "Blog not found · MEMCO Skyline Jutaku" };
  return {
    title: `${story.title} · MEMCO Skyline Jutaku`,
    description: story.summary,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const storyIndex = BLOG_STORIES.findIndex((item) => item.slug === slug);
  if (storyIndex < 0) notFound();

  const story = BLOG_STORIES[storyIndex];
  const nextStory = BLOG_STORIES[(storyIndex + 1) % BLOG_STORIES.length];

  return (
    <main className="blog-article">
      <div className="blog-article-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={story.image} alt={story.alt} />
        <span className="blog-article-photo-label lbl">MEMCO Skyline · Jutaku</span>
      </div>
      <article className="blog-article-main">
        <SubpageHeader closeHref="/blog" />
        <div className="blog-article-content">
          <p className="blog-article-category lbl">{String(storyIndex + 1).padStart(2, "0")} / {story.category}</p>
          <h1>{story.title}</h1>
          <p className="blog-article-lede">{story.summary}</p>
          <div className="blog-article-body">
            {story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <nav className="blog-article-navigation" aria-label="Blog navigation">
            <Link href="/blog">All blogs <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <Link href={`/blog/${nextStory.slug}`}>Next blog <span>{nextStory.title}</span> <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </nav>
        </div>
      </article>
    </main>
  );
}
