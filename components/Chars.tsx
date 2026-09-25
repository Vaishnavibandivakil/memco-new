import { Fragment } from "react";

/** Splits text into word-wrapped letter spans (SSR-safe, no layout shift). Screen readers get the plain string. */
export function Chars({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden>
            {[...w].map((c, j) => <span className="ch" key={j}>{c}</span>)}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
