"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Armchair, ChevronLeft, ChevronRight } from "lucide-react";
import { SubpageHeader } from "@/components/SubpageHeader";

type AvailabilitySlot = {
  slot_start: string;
  slot_end: string;
  label: string;
  available: number;
  is_full: boolean;
  booked_count: number;
};

type AvailabilityDay = {
  day_index: number;
  iso: string;
  day: string;
  label: string;
  year: number;
  slots: AvailabilitySlot[];
};

type AvailabilityResponse = {
  base_iso?: string;
  days?: Array<{ day_index: number; date?: string; day_label?: string; slots: AvailabilitySlot[] }>;
  error?: string;
};

type BookingResponse = {
  error?: string;
  duplicate?: boolean;
  confirmationCode?: string;
  slotLabel?: string;
};

function isoForDay(baseIso: string, dayIndex: number) {
  const date = new Date(`${baseIso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + dayIndex - 1);
  return date.toISOString().slice(0, 10);
}

function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function currentMinutesInIndia() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const value = (type: "hour" | "minute") => Number(parts.find((part) => part.type === type)?.value || 0);
  return value("hour") * 60 + value("minute");
}

function slotMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function displayDate(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  return {
    day: new Intl.DateTimeFormat("en-IN", { weekday: "short", timeZone: "UTC" }).format(date),
    label: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" }).format(date),
    year: date.getUTCFullYear(),
  };
}

export function BookingForm() {
  const datesRef = useRef<HTMLDivElement>(null);
  const [dateScroll, setDateScroll] = useState({ back: false, forward: false });
  const [baseIso, setBaseIso] = useState("");
  const [dates, setDates] = useState<AvailabilityDay[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState<"loading" | "ready" | "error">("loading");
  const [availabilityError, setAvailabilityError] = useState("");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState<{ code?: string; label?: string; duplicate?: boolean }>({});

  const chosenDate = dates.find((date) => date.day_index === selectedDayIndex);
  const chosenSlot = chosenDate?.slots.find((slot) => slot.slot_start === selectedSlot);
  const maxGuests = Math.max(1, Math.min(12, chosenSlot?.available ?? 12));

  useEffect(() => {
    const controller = new AbortController();
    async function loadAvailability() {
      try {
        const response = await fetch("/api/visit-availability", { cache: "no-store", signal: controller.signal });
        const result = await response.json() as AvailabilityResponse;
        if (!response.ok || !result.base_iso || !Array.isArray(result.days)) {
          throw new Error(result.error || "Visit times are temporarily unavailable.");
        }

        const today = todayInIndia();
        const nowMinutes = currentMinutesInIndia();
        const upcoming = result.days.flatMap((day) => {
          if (!Number.isInteger(day.day_index) || !Array.isArray(day.slots)) return [];
          const iso = typeof day.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day.date)
            ? day.date
            : isoForDay(result.base_iso!, day.day_index);
          if (iso < today) return [];
          const shown = displayDate(iso);
          return [{
            ...day,
            ...shown,
            iso,
            slots: day.slots.filter((slot) => !slot.is_full && slot.available > 0 && (iso > today || slotMinutes(slot.slot_start) > nowMinutes)),
          }];
        }).filter((day) => day.slots.length > 0);

        if (!upcoming.length) {
          throw new Error("The booking calendar has no upcoming visit dates. Please contact the MEMCO Skyline team.");
        }

        setBaseIso(result.base_iso);
        setDates(upcoming);
        setSelectedDayIndex(upcoming[0].day_index);
        setAvailabilityStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        setAvailabilityError(error instanceof Error ? error.message : "Visit times are temporarily unavailable.");
        setAvailabilityStatus("error");
      }
    }
    void loadAvailability();
    return () => controller.abort();
  }, []);

  const updateDateScroll = useCallback(() => {
    const row = datesRef.current;
    if (!row) return;
    setDateScroll({ back: row.scrollLeft > 2, forward: row.scrollLeft + row.clientWidth < row.scrollWidth - 2 });
  }, []);

  useEffect(() => {
    const row = datesRef.current;
    if (!row) return;
    const observer = new ResizeObserver(updateDateScroll);
    observer.observe(row);
    row.addEventListener("scroll", updateDateScroll, { passive: true });
    updateDateScroll();
    return () => { observer.disconnect(); row.removeEventListener("scroll", updateDateScroll); };
  }, [dates, updateDateScroll]);

  function moveDates(direction: -1 | 1) {
    const row = datesRef.current;
    const card = row?.querySelector<HTMLElement>(".bk-date");
    if (!row || !card) return;
    const gap = Number.parseFloat(getComputedStyle(row).columnGap) || 0;
    row.scrollBy({ left: direction * (card.offsetWidth + gap) * 7, behavior: "smooth" });
  }

  async function submitVisit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!chosenDate || !selectedSlot || submitStatus === "sending" || submitStatus === "sent") return;
    const params = new URLSearchParams(window.location.search);
    setSubmitStatus("sending");
    setSubmitError("");
    try {
      const response = await fetch("/api/visit-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseIso,
          date: chosenDate.iso,
          dayIndex: chosenDate.day_index,
          slotStart: selectedSlot,
          guests,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          pageUrl: window.location.href,
          utmSource: params.get("utm_source") || "",
          utmMedium: params.get("utm_medium") || "",
          utmCampaign: params.get("utm_campaign") || "",
        }),
      });
      const result = await response.json() as BookingResponse;
      if (!response.ok) throw new Error(result.error || "We couldn't book your visit. Please try again.");
      setConfirmation({ code: result.confirmationCode, label: result.slotLabel, duplicate: result.duplicate });
      setSubmitStatus("sent");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We couldn't book your visit. Please try again.");
      setSubmitStatus("error");
    }
  }

  return (
    <main className="bk-page" data-tone="light">
      <aside className="bk-scene">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bk-scene-image" src="/images/experience-centre-booking.webp" alt="Inside the Jutaku Experience Centre, with the project model and visitor seating" />
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
        <SubpageHeader closeHref="/#jutaku-experience" />
        <header className="bk-heading">
          <h1>See Jutaku<br /><span>in person.</span></h1>
          <p>Visit the Experience Centre in Singasandra. Choose a day and time for your one-hour walkthrough.</p>
        </header>

        <form className="bk-form" onSubmit={submitVisit}>
          <div className="bk-card-heading"><span>PLAN YOUR VISIT</span><h2>Book an appointment</h2></div>

          {availabilityStatus === "loading" && <p className="bk-availability-note" role="status">Loading available visit times…</p>}
          {availabilityStatus === "error" && <p className="bk-availability-error" role="alert">{availabilityError}</p>}

          <fieldset className="bk-group" disabled={availabilityStatus !== "ready"}>
            <legend>Choose a day <span>{dates.length ? `${dates[0].label} – ${dates[dates.length - 1].label} ${dates[dates.length - 1].year}` : "Live booking calendar"}</span></legend>
            <div className="bk-date-carousel">
              <button type="button" className="bk-date-arrow" aria-label="Show previous dates" disabled={!dateScroll.back} onClick={() => moveDates(-1)}><ChevronLeft size={20} strokeWidth={1.8} aria-hidden="true" /></button>
              <div ref={datesRef} className="bk-dates" aria-label="Available visit dates">
                {dates.map((date) => (
                  <button key={date.day_index} type="button" className={`bk-date${selectedDayIndex === date.day_index ? " is-selected" : ""}`} aria-label={`${date.day}, ${date.label} ${date.year}`} aria-pressed={selectedDayIndex === date.day_index} onClick={() => { setSelectedDayIndex(date.day_index); setSelectedSlot(null); setGuests(1); setSubmitStatus("idle"); }}>
                    <small>{date.day}</small><strong>{date.label}</strong>
                  </button>
                ))}
              </div>
              <button type="button" className="bk-date-arrow" aria-label="Show later dates" disabled={!dateScroll.forward} onClick={() => moveDates(1)}><ChevronRight size={20} strokeWidth={1.8} aria-hidden="true" /></button>
            </div>
          </fieldset>

          <fieldset className="bk-group" disabled={availabilityStatus !== "ready" || !chosenDate}>
            <legend>Choose a time <span>{chosenDate ? `${chosenDate.day}, ${chosenDate.label}` : "Select a date"}</span></legend>
            <div className="bk-slots">
              {chosenDate?.slots.map((slot) => (
                <button key={slot.slot_start} type="button" className={`bk-slot${selectedSlot === slot.slot_start ? " is-selected" : ""}`} aria-pressed={selectedSlot === slot.slot_start} aria-label={`${slot.label}, ${slot.available} seats available`} onClick={() => { setSelectedSlot(slot.slot_start); setGuests((count) => Math.min(count, Math.max(1, slot.available))); setSubmitStatus("idle"); }}>
                  {slot.label.split(" - ")[0]}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="bk-group bk-guests">
            <div className="bk-guests-heading">
              <p>Guests</p>
              <output aria-live="polite">{guests} {guests === 1 ? "guest" : "guests"}</output>
            </div>
            <div className="bk-guest-seats" role="group" aria-label="Number of guests">
              {Array.from({ length: maxGuests }, (_, index) => index + 1).map((count) => (
                <button key={count} type="button" disabled={!selectedSlot} className={`bk-guest-seat${count <= guests ? " is-occupied" : ""}${count === guests ? " is-selected" : ""}`} aria-label={`${count} ${count === 1 ? "guest" : "guests"}`} aria-pressed={count === guests} onClick={() => { setGuests(count); setSubmitStatus("idle"); }}>
                  <Armchair size={22} strokeWidth={1.7} aria-hidden="true" />
                  <span aria-hidden="true">{count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bk-fields">
            <label>Your name *<input required autoComplete="name" placeholder="Full name" value={name} onChange={(event) => { setName(event.target.value); setSubmitStatus("idle"); }} /></label>
            <label>Phone number *<input required type="tel" inputMode="tel" autoComplete="tel" minLength={10} placeholder="Mobile number" value={phone} onChange={(event) => { setPhone(event.target.value); setSubmitStatus("idle"); }} /></label>
            <label className="bk-email">Email address <span>(optional)</span><input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => { setEmail(event.target.value); setSubmitStatus("idle"); }} /></label>
          </div>

          <div className="bk-finish">
            <button type="submit" className="bk-submit" disabled={availabilityStatus !== "ready" || !selectedSlot || submitStatus === "sending" || submitStatus === "sent"}>{submitStatus === "sending" ? "Booking visit…" : submitStatus === "sent" ? "Visit booked" : "Book a visit"}</button>
            <p>Your booking is saved by MEMCO Skyline and forwarded to the sales CRM.</p>
            {availabilityStatus === "ready" && !selectedSlot && <span className="bk-slot-prompt">Select a time to continue.</span>}
            {submitStatus === "error" && <p className="bk-submit-error" role="alert">{submitError}</p>}
            {submitStatus === "sent" && chosenDate && chosenSlot && (
              <div className="bk-ready" role="status">
                <strong>{confirmation.duplicate ? "You already have this booking." : "Your visit is confirmed."}</strong>
                <p>{confirmation.label || `${chosenDate.day}, ${chosenDate.label} · ${chosenSlot.label}`} · {guests} {guests === 1 ? "guest" : "guests"}.</p>
                {confirmation.code && <p>Confirmation code: <strong>{confirmation.code}</strong></p>}
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
