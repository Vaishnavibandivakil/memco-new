import Link from "next/link";
import { EMAIL } from "@/lib/data";
import { SubpageHeader } from "@/components/SubpageHeader";

type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalPageProps = {
  label: string;
  title: string;
  introduction: string;
  sections: LegalSection[];
  relatedHref: string;
  relatedLabel: string;
};

export function LegalPage({ label, title, introduction, sections, relatedHref, relatedLabel }: LegalPageProps) {
  return (
    <main className="legal-page" data-tone="light">
      <aside className="legal-scene">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="legal-scene-image" src="/images/design-living.webp" alt="Living space at Jutaku" />
        <Link className="legal-scene-brand" href="/#top" aria-label="MEMCO Skyline home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/lockup-h.png" alt="MEMCO Skyline" />
          <span aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/jutaku.png" alt="Jutaku" />
        </Link>
        <p className="legal-scene-caption lbl">Jutaku · Begur, South Bengaluru</p>
      </aside>

      <div className="legal-main">
        <div className="legal-shell">
          <SubpageHeader label={`Jutaku / ${label}`} closeHref="/#contact" closeLabel="Contact" />
          <header className="legal-heading">
            <h1>{title}</h1>
            <p>{introduction}</p>
            <small>Last updated 22 October 2026</small>
          </header>

          <div className="legal-sections">
            {sections.map((section, index) => (
              <section className="legal-section" key={section.title}>
                <span className="legal-section-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>

          <footer className="legal-footer">
            <p>Questions about this page? <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
            <Link href={relatedHref}>{relatedLabel}</Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
