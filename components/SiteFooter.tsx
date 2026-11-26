import { PHONE, EMAIL, ADDRESS, RERA } from "@/lib/data";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import Link from "next/link";

const socialProfiles = [
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61588163955913" },
  { name: "Instagram", href: "https://www.instagram.com/memcoskyline/" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/memco-skyline/" },
  { name: "X", href: "https://x.com/MEMCOSkyline" },
  { name: "YouTube", href: "https://www.youtube.com/channel/UCdxanh_k5M852obG9aocTNg" },
] as const;

function SocialIcon({ name }: { name: (typeof socialProfiles)[number]["name"] }) {
  if (name === "Instagram") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
  if (name === "YouTube") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></svg>;
  if (name === "Facebook") return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14.5 21v-8h2.8l.4-3.2h-3.2V7.7c0-.9.3-1.5 1.6-1.5h1.7V3.3a21 21 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3v2.3H8.3V13h2.8v8h3.4Z" /></svg>;
  if (name === "LinkedIn") return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.1 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3.5 9.5h3.2V20H3.5V9.5Zm5.2 0h3.1V11c.5-.9 1.6-1.7 3.2-1.7 3.4 0 4 2.2 4 5V20h-3.2v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V20H8.7V9.5Z" /></svg>;
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.3 3H21l-7.6 8.7L22.3 21h-7l-5.5-7.2L3.5 21H.2l8.1-9.3L1.8 3h7.1l5 6.6L17.3 3Zm-1.2 16h1.9L7.8 4.9H5.7L16.1 19Z" /></svg>;
}

export function SiteFooter() {
  const tel = PHONE.replace(/[^+\d]/g, "");
  return (
      <section id="contact" className="cl" data-tone="dark">
        <footer className="cl-foot">
          <div className="cl-foot-columns">
            <div className="cl-brand-block">
              <div className="cl-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="cl-memco" src="/brand/lockup-h-white.png" alt="MEMCO Skyline" width={856} height={243} />
                <span className="cl-div" aria-hidden />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="cl-jutaku" src="/brand/jutaku-white.png" alt="Jutaku" width={379} height={260} />
              </div>
              <p>Urban living, thoughtfully shared.</p>
            </div>
            <div className="cl-contact">
              <h2>Contact</h2>
              <p className="cl-contact-address">Experience Centre · now open<br />{ADDRESS}</p>
              <a className="cl-phone" href={`tel:${tel}`}>{PHONE}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </div>
            <div className="cl-updates">
              <NewsletterSignup />
              <nav className="cl-socials" aria-label="Social media">
                {socialProfiles.map(({ name, href }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`MEMCO Skyline on ${name}`}><SocialIcon name={name} /></a>)}
              </nav>
            </div>
          </div>
          <div className="cl-foot-main">
            <p className="lbl cl-legal">MEMCO Skyline · Jutaku<br /><span className="dim">RERA {RERA}</span></p>
            <p className="lbl cl-right">© 2026 MEMCO<br /><span className="dim">All rights reserved</span></p>
          </div>
          <nav className="cl-policy-links lbl" aria-label="Legal information">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          </nav>
        </footer>
      </section>
  );
}
