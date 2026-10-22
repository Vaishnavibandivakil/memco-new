"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, House, MessageCircle, TrendingUp } from "lucide-react";
import { PHONE } from "@/lib/data";

type Interest = "Self use" | "Investment";

export function BrochureForm() {
  const [countryCode, setCountryCode] = useState("+91");
  const [interest, setInterest] = useState<Interest | "">("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const details = new FormData(form);
    const name = String(details.get("name") ?? "").trim();
    const phone = String(details.get("phone") ?? "").trim();
    const email = String(details.get("email") ?? "").trim();
    const message = [
      "Hello MEMCO Skyline, I'd like to know more about Jutaku.",
      "",
      `Name: ${name}`,
      `Phone: ${countryCode} ${phone}`,
      email ? `Email: ${email}` : "",
      `Interest: ${interest}`,
    ].filter(Boolean).join("\n");
    const number = PHONE.replace(/\D/g, "");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="br-page" data-tone="light">
      <div className="br-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/design-living.webp" alt="Living space at Jutaku" />
        <span className="lbl">MEMCO Skyline · Jutaku</span>
      </div>
      <div className="br-main">
        <div className="br-shell">
          <Link className="br-back" href="/#jutaku-experience"><ArrowLeft size={17} aria-hidden="true" /><span>Back to Jutaku Experience</span></Link>
          <div className="br-content">
            <p className="lbl br-kicker">Jutaku / Enquiry</p>
            <h1>Discover more<br />about Jutaku.</h1>
            <p className="br-intro">Share a few details and connect with the MEMCO Skyline team on WhatsApp.</p>

            <form className="br-form" onSubmit={onSubmit}>
              <label htmlFor="br-name">Full name <span>*</span></label>
              <input id="br-name" name="name" type="text" autoComplete="name" required placeholder="Enter your full name" />

              <label htmlFor="br-phone">Phone number <span>*</span></label>
              <div className="br-phone-row">
                <select name="countryCode" aria-label="Country calling code" value={countryCode} onChange={(event) => setCountryCode(event.target.value)}>
                  <option value="+91">IN +91</option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                  <option value="+971">AE +971</option>
                  <option value="+65">SG +65</option>
                </select>
                <input id="br-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" pattern={countryCode === "+91" ? "[0-9]{10}" : "[0-9]{7,15}"} required placeholder={countryCode === "+91" ? "Enter 10-digit phone number" : "Enter phone number"} />
              </div>

              <label htmlFor="br-email">Email address</label>
              <input id="br-email" name="email" type="email" autoComplete="email" placeholder="Enter your email" />

              <fieldset className="br-interest">
                <legend>I&apos;m interested in <span>*</span></legend>
                <div className="br-interest-options">
                  <label className={interest === "Self use" ? "is-selected" : ""}>
                    <input type="radio" name="interest" value="Self use" required checked={interest === "Self use"} onChange={() => setInterest("Self use")} />
                    <House size={19} strokeWidth={1.7} aria-hidden="true" /> Self use
                  </label>
                  <label className={interest === "Investment" ? "is-selected" : ""}>
                    <input type="radio" name="interest" value="Investment" required checked={interest === "Investment"} onChange={() => setInterest("Investment")} />
                    <TrendingUp size={19} strokeWidth={1.7} aria-hidden="true" /> Investment
                  </label>
                </div>
              </fieldset>

              <label className="br-consent">
                <input type="checkbox" name="consent" required />
                <span>I agree to be contacted by MEMCO Skyline via call, WhatsApp or email about my enquiry.</span>
              </label>

              <button type="submit" className="br-submit"><MessageCircle size={17} strokeWidth={1.8} aria-hidden="true" /> Submit via WhatsApp</button>
              <Link className="br-visit" href="/book-visit"><CalendarDays size={18} strokeWidth={1.8} aria-hidden="true" /> Book a site visit</Link>
            </form>
          </div>
          <p className="br-foot lbl">Jutaku · Begur, South Bengaluru</p>
        </div>
      </div>
    </main>
  );
}
