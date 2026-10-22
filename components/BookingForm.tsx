"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Armchair } from "lucide-react";
import { SubpageHeader } from "@/components/SubpageHeader";

type VisitDate = { iso: string; day: string; label: string; year: number };

function upcomingDates(): VisitDate[] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const dates: VisitDate[] = [];
  for (const date = new Date(today); date.getFullYear() === today.getFullYear(); date.setDate(date.getDate() + 1)) {
    dates.push({
      iso: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      day: new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(date),
      label: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(date),
      year: date.getFullYear(),
    });
  }
  return dates;
}

function slotLabel(hour: number) {
  const format = (value: number) => `${value % 12 || 12}:00 ${value < 12 ? "AM" : "PM"}`;
  return `${format(hour)} – ${format(hour + 1)}`;
}

export function BookingForm() {
  const [dates] = useState(upcomingDates);
  const [selectedDate, setSelectedDate] = useState(dates[0].iso);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const chosenDate = dates.find((date) => date.iso === selectedDate) ?? dates[0];

  async function submitVisit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedSlot === null || submitStatus === "sending" || submitStatus === "sent") return;
    setSubmitStatus("sending");
    setSubmitError("");
    try {
      const response = await fetch("/api/visit-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, hour: selectedSlot, guests, name: name.trim(), phone: phone.trim(), email: email.trim() }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "We couldn't send your request. Please try again.");
      setSubmitStatus("sent");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We couldn't send your request. Please try again.");
      setSubmitStatus("error");
    }
  }

  return (
    <main className="bk-page" data-tone="light">
      <aside className="bk-scene">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bk-scene-image" src="/images/design-living.webp" alt="Living room at MEMCO Skyline" />
        <div className="bk-scene-shade" aria-hidden="true" />
        <Link className="bk-scene-brand" href="/#top" aria-label="MEMCO Skyline home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/lockup-h.png" alt="MEMCO Skyline" />
          <span aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/jutaku.png" alt="Jutaku" />
        </Link>
        <div className="bk-scene-foot"><span>JUTAKU EXPERIENCE</span><span>MEMCO SKYLINE · BENGALURU</span></div>
      </aside>

      <div className="bk-main">
        <SubpageHeader label="Jutaku / Visit" closeHref="/#jutaku-experience" closeLabel="Jutaku Experience" />
        <header className="bk-heading">
          <h1>See JUTAKU<br /><span>in person.</span></h1>
          <p>Visit the Experience Centre in Singasandra. Choose a day and time for your one-hour walkthrough.</p>
        </header>

        <form className="bk-form" onSubmit={submitVisit}>
          <div className="bk-card-heading"><span>PLAN YOUR VISIT</span><h2>Book an appointment</h2></div>

          <fieldset className="bk-group">
            <legend>Choose a day <span>Through 31 Dec {dates[dates.length - 1].year}</span></legend>
            <div className="bk-dates" aria-label="Preferred dates">
              {dates.map((date) => (
                <button key={date.iso} type="button" className={`bk-date${selectedDate === date.iso ? " is-selected" : ""}`} aria-label={`${date.day}, ${date.label} ${date.year}`} aria-pressed={selectedDate === date.iso} onClick={() => { setSelectedDate(date.iso); setSelectedSlot(null); setSubmitStatus("idle"); }}>
                  <small>{date.day}</small><strong>{date.label}</strong>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="bk-group">
            <legend>Choose a time <span>{chosenDate.day}, {chosenDate.label}</span></legend>
            <div className="bk-slots">
              {Array.from({ length: 9 }, (_, index) => index + 9).map((hour) => {
                const now = new Date();
                const past = selectedDate === dates[0].iso && hour <= now.getHours();
                return <button key={hour} type="button" disabled={past} className={`bk-slot${selectedSlot === hour ? " is-selected" : ""}`} aria-pressed={selectedSlot === hour} aria-label={slotLabel(hour)} onClick={() => { setSelectedSlot(hour); setSubmitStatus("idle"); }}>{`${hour % 12 || 12}:00 ${hour < 12 ? "AM" : "PM"}`}</button>;
              })}
            </div>
          </fieldset>

          <div className="bk-group bk-guests">
            <div className="bk-guests-heading">
              <p>Guests</p>
              <output aria-live="polite">{guests} {guests === 1 ? "guest" : "guests"}</output>
            </div>
            <div className="bk-guest-seats" role="group" aria-label="Number of guests">
              {Array.from({ length: 12 }, (_, index) => index + 1).map((count) => (
                <button
                  key={count}
                  type="button"
                  className={`bk-guest-seat${count <= guests ? " is-occupied" : ""}${count === guests ? " is-selected" : ""}`}
                  aria-label={`${count} ${count === 1 ? "guest" : "guests"}`}
                  aria-pressed={count === guests}
                  onClick={() => { setGuests(count); setSubmitStatus("idle"); }}
                >
                  <Armchair size={22} strokeWidth={1.7} aria-hidden="true" />
                  <span aria-hidden="true">{count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bk-fields">
            <label>Your name *<input required autoComplete="name" placeholder="Full name" value={name} onChange={(event) => { setName(event.target.value); setSubmitStatus("idle"); }} /></label>
            <label>Phone number *<input required type="tel" inputMode="tel" autoComplete="tel" minLength={10} placeholder="Mobile number" value={phone} onChange={(event) => { setPhone(event.target.value); setSubmitStatus("idle"); }} /></label>
            <label className="bk-email">Email address *<input required type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => { setEmail(event.target.value); setSubmitStatus("idle"); }} /></label>
          </div>

          <div className="bk-finish">
            <button type="submit" className="bk-submit" disabled={selectedSlot === null || submitStatus === "sending" || submitStatus === "sent"}>{submitStatus === "sending" ? "Sending request…" : submitStatus === "sent" ? "Request sent" : "Request a visit"}</button>
            <p>We&apos;ll contact you to confirm your visit.</p>
            {selectedSlot === null && <span className="bk-slot-prompt">Select a time to continue.</span>}
            {submitStatus === "error" && <p className="bk-submit-error" role="alert">{submitError}</p>}
            {submitStatus === "sent" && (
              <div className="bk-ready" role="status">
                <strong>Your request has been sent.</strong>
                <p>{chosenDate.day}, {chosenDate.label} · {selectedSlot === null ? "" : slotLabel(selectedSlot)} · {guests} {guests === 1 ? "guest" : "guests"}. The MEMCO Skyline team will contact you to confirm availability.</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
