import Link from "next/link";
import { BLOG_STORIES } from "@/lib/blog";

export function BlogPreview() {
  return (
    <section id="blog" className="blog-preview" data-tone="light" aria-labelledby="blog-preview-title">
      <div className="blog-preview-inner">
        <div className="blog-preview-layout">
          <div className="blog-preview-cards" aria-label="Featured journal topics">
            {BLOG_STORIES.slice(0, 2).map((story, index) => (
              <article className={`blog-preview-card blog-preview-card--${index + 1}`} key={story.slug}>
                <Link href={`/blog/${story.slug}`}>
                  <div className="blog-preview-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={story.image} alt={story.alt} loading="lazy" />
                  </div>
                  <p className="blog-preview-card-meta">{String(index + 1).padStart(2, "0")} / {story.category}</p>
                  <h3>{story.title}</h3>
                </Link>
              </article>
            ))}
          </div>
          <div className="blog-preview-heading">
            <h2 id="blog-preview-title" className="caps-serif">Blogs</h2>
            <p className="blog-preview-intro">Ideas on home, shared spaces and the neighbourhood around us.</p>
          </div>
          <div className="blog-preview-index">
            <p className="blog-preview-list-label lbl">Five blogs to explore</p>
            <ol className="blog-preview-list">
              {BLOG_STORIES.map((story, index) => (
                <li key={story.slug}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Link href={`/blog/${story.slug}`}>{story.title}</Link>
                  <small>{story.category}</small>
                </li>
              ))}
            </ol>
            <Link className="blog-preview-link" href="/blog">Explore the blog</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
