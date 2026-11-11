"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, House, Send, TrendingUp } from "lucide-react";
import { SubpageHeader } from "@/components/SubpageHeader";

type Interest = "Self use" | "Investment";

export function BrochureForm() {
  const [countryCode, setCountryCode] = useState("+91");
  const [interest, setInterest] = useState<Interest | "">("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const details = new FormData(form);
    const name = String(details.get("name") ?? "").trim();
    const phone = String(details.get("phone") ?? "").trim();
    const email = String(details.get("email") ?? "").trim();
    const params = new URLSearchParams(window.location.search);
    setSubmitStatus("sending");
    setSubmitError("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: `${countryCode}${phone.replace(/\D/g, "")}`,
          email,
          interest,
          pageUrl: window.location.href,
          utmSource: params.get("utm_source") || "",
          utmMedium: params.get("utm_medium") || "",
          utmCampaign: params.get("utm_campaign") || "",
          consent: details.get("consent") === "on",
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "We couldn't submit your enquiry. Please try again.");
      setSubmitStatus("sent");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We couldn't submit your enquiry. Please try again.");
      setSubmitStatus("error");
    }
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
          <SubpageHeader closeHref="/#jutaku-experience" />
          <div className="br-content">
            <h1>Discover more<br />about Jutaku.</h1>
            <p className="br-intro">Share a few details and the MEMCO Skyline team will contact you.</p>

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

              <button type="submit" className="br-submit" disabled={submitStatus === "sending" || submitStatus === "sent"}>
                {submitStatus === "sent" ? <CheckCircle2 size={17} strokeWidth={1.8} aria-hidden="true" /> : <Send size={17} strokeWidth={1.8} aria-hidden="true" />}
                {submitStatus === "sending" ? "Submitting…" : submitStatus === "sent" ? "Enquiry submitted" : "Submit enquiry"}
              </button>
              {submitStatus === "error" && <p className="br-submit-error" role="alert">{submitError}</p>}
              {submitStatus === "sent" && <p className="br-submit-success" role="status">Thank you. MEMCO Skyline received your enquiry and the team will contact you.</p>}
              <Link className="br-visit" href="/book-visit"><CalendarDays size={18} strokeWidth={1.8} aria-hidden="true" /> Book a site visit</Link>
            </form>
          </div>
          <p className="br-foot lbl">Jutaku · Singasandra, South Bengaluru</p>
        </div>
      </div>
    </main>
  );
}
