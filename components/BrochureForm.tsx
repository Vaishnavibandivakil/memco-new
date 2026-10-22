"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const brochurePath = "/brochure/jutaku-project-overview.pdf";

export function BrochureForm() {
  const [downloaded, setDownloaded] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const link = document.createElement("a");
    link.href = brochurePath;
    link.download = "Jutaku-project-overview.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setDownloaded(true);
  }

  return (
    <main className="br-page" data-tone="light">
      <div className="br-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/design-living.webp" alt="Living space at Jutaku" />
        <span className="lbl">MEMCO Skyline · Jutaku</span>
      </div>
      <div className="br-main">
        <Link className="br-back" href="/#jutaku-experience">← <span>Back to Jutaku Experience</span></Link>
        <div className="br-content">
          <p className="lbl br-kicker">Jutaku / Project overview</p>
          <h1>Take a closer look<br />at Jutaku.</h1>
          <p className="br-intro">Enter your details to download a short overview of the homes, shared spaces and neighbourhood.</p>

          <form className="br-form" onSubmit={onSubmit}>
            <label htmlFor="br-name">Full name <span>*</span></label>
            <input id="br-name" name="name" type="text" autoComplete="name" required placeholder="Your name" />

            <label htmlFor="br-phone">Phone number <span>*</span></label>
            <input id="br-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" minLength={10} required placeholder="Your mobile number" />

            <label htmlFor="br-email">Email address <span>*</span></label>
            <input id="br-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />

            <button type="submit">Download project overview</button>
            <p className="br-privacy">Your details stay on this device. This form does not send them to MEMCO Skyline.</p>
            {downloaded && <p className="br-success" role="status">Your download has started. <a href={brochurePath} download="Jutaku-project-overview.pdf">Download again</a></p>}
          </form>
        </div>
        <p className="br-foot lbl">Jutaku · Begur, South Bengaluru</p>
      </div>
    </main>
  );
}
