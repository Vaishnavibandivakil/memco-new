import { memcoApiFetch, readJson, responseMessage } from "@/lib/memco-api";

type VisitRequest = {
  baseIso?: unknown;
  date?: unknown;
  dayIndex?: unknown;
  slotStart?: unknown;
  guests?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  pageUrl?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
};

type AvailabilitySlot = { slot_start?: unknown; available?: unknown; is_full?: unknown };
type AvailabilityDay = { day_index?: unknown; slots?: unknown };

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

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "Please submit the visit form again." }, { status: 415 });
  }

  let details: VisitRequest;
  try {
    details = await request.json() as VisitRequest;
    if (!details || typeof details !== "object" || Array.isArray(details)) throw new Error("Invalid request");
  } catch {
    return Response.json({ error: "Please submit the visit form again." }, { status: 400 });
  }

  const baseIso = typeof details.baseIso === "string" ? details.baseIso.trim() : "";
  const date = typeof details.date === "string" ? details.date.trim() : "";
  const dayIndex = Number(details.dayIndex);
  const slotStart = typeof details.slotStart === "string" ? details.slotStart.trim() : "";
  const guests = Number(details.guests);
  const name = typeof details.name === "string" ? details.name.trim() : "";
  const phone = typeof details.phone === "string" ? details.phone.trim() : "";
  const email = typeof details.email === "string" ? details.email.trim() : "";
  const phoneDigits = phone.replace(/\D/g, "");
  const validBase = /^\d{4}-\d{2}-\d{2}$/.test(baseIso);
  const validDayIndex = Number.isInteger(dayIndex) && dayIndex >= 1 && dayIndex <= 100_000;
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= todayInIndia();
  const validSlot = /^\d{2}:\d{2}$/.test(slotStart);
  const validGuests = Number.isInteger(guests) && guests >= 1 && guests <= 12;
  const validName = name.length >= 2 && name.length <= 100;
  const validPhone = phoneDigits.length >= 10 && phoneDigits.length <= 15;
  const validEmail = !email || (email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  const dateMatchesIndex = validBase && validDayIndex && isoForDay(baseIso, dayIndex) === date;

  if (!validBase || !validDayIndex || !validDate || !dateMatchesIndex || !validSlot || !validGuests || !validName || !validPhone || !validEmail) {
    const fields: Record<string, string> = {};
    if (!validName) fields.name = "Enter your full name (2–100 characters).";
    if (!validPhone) fields.phone = "Enter a valid phone number with 10–15 digits.";
    if (!validEmail) fields.email = "Enter a valid email address.";
    if (!validBase || !validDayIndex || !validDate || !dateMatchesIndex) fields.date = "Choose a valid upcoming date from the calendar.";
    if (!validSlot) fields.slot = "Choose an available visit time.";
    if (!validGuests) fields.guests = "Choose between 1 and 12 guests.";
    return Response.json({ error: Object.values(fields).join(" "), fields }, { status: 400 });
  }

  try {
    const availabilityResponse = await memcoApiFetch("/api/booking/availability");
    const availability = await readJson(availabilityResponse);
    const currentBaseIso = typeof availability.base_iso === "string" ? availability.base_iso : "";
    const days = Array.isArray(availability.days) ? availability.days as AvailabilityDay[] : [];
    const day = days.find((item) => Number(item.day_index) === dayIndex);
    const slots = day && Array.isArray(day.slots) ? day.slots as AvailabilitySlot[] : [];
    const slot = slots.find((item) => item.slot_start === slotStart);
    const seats = typeof slot?.available === "number" ? slot.available : slot?.is_full === true ? 0 : 1;

    if (!availabilityResponse.ok || currentBaseIso !== baseIso || !slot || slot.is_full === true || seats < guests) {
      return Response.json({ error: "That visit time is no longer available. Please refresh and choose another time." }, { status: 409 });
    }

    const optionalString = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";
    const bookingResponse = await memcoApiFetch("/api/booking/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone: phoneDigits,
        ...(email ? { email } : {}),
        day_index: dayIndex,
        slot_start: slotStart,
        quantity: guests,
        page_url: optionalString(details.pageUrl, 1_000),
        utm_source: optionalString(details.utmSource),
        utm_medium: optionalString(details.utmMedium),
        utm_campaign: optionalString(details.utmCampaign),
      }),
    });
    const result = await readJson(bookingResponse);
    if (!bookingResponse.ok || result.success === false) {
      console.error("MEMCO API rejected a visit booking", bookingResponse.status, result);
      return Response.json({ error: responseMessage(result, "We couldn't book your visit. Please try again shortly.") }, { status: bookingResponse.status === 409 ? 409 : 502 });
    }

    if (result.ok === false && result.reason === "not_enough_seats") {
      return Response.json({ error: responseMessage(result, "That visit time is full. Please choose another time.") }, { status: 409 });
    }

    return Response.json({
      ok: true,
      duplicate: result.ok === false && result.reason === "already_booked" || result.duplicate === true,
      bookingId: typeof result.booking_id === "string" ? result.booking_id : undefined,
      confirmationCode: typeof result.confirmation_code === "string" ? result.confirmation_code : undefined,
      slotLabel: typeof result.slot_label === "string" ? result.slot_label : undefined,
    });
  } catch (error) {
    console.error("MEMCO API visit booking failed", error);
    return Response.json({ error: "Online booking is temporarily unavailable. Please try again shortly." }, { status: 502 });
  }
}
