import { EMAIL } from "@/lib/data";

type VisitRequest = {
  date?: unknown;
  hour?: unknown;
  guests?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
};

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

  const { date, hour, guests, name, phone, email } = details;
  const dateValue = typeof date === "string" ? date.trim() : "";
  const nameValue = typeof name === "string" ? name.trim() : "";
  const phoneValue = typeof phone === "string" ? phone.trim() : "";
  const emailValue = typeof email === "string" ? email.trim() : "";
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(dateValue) && !Number.isNaN(Date.parse(`${dateValue}T00:00:00Z`));
  const validHour = Number.isInteger(hour) && Number(hour) >= 9 && Number(hour) <= 17;
  const validGuests = Number.isInteger(guests) && Number(guests) >= 1 && Number(guests) <= 12;
  const validName = nameValue.length >= 2 && nameValue.length <= 100;
  const validPhone = /^[+\d()\s-]{10,24}$/.test(phoneValue);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) && emailValue.length <= 254;
  if (!validDate || !validHour || !validGuests || !validName || !validPhone || !validEmail) {
    return Response.json({ error: "Please check your details and choose a date and time." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return Response.json({ error: "Online booking is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const hourValue = Number(hour);
  const displayDate = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${dateValue}T00:00:00Z`));
  const time = `${hourValue % 12 || 12}:00 ${hourValue < 12 ? "AM" : "PM"} – ${(hourValue + 1) % 12 || 12}:00 ${hourValue + 1 < 12 ? "AM" : "PM"}`;
  const message = [
    "New Jutaku Experience Centre visit request",
    "",
    `Name: ${nameValue}`,
    `Phone: ${phoneValue}`,
    `Email: ${emailValue}`,
    `Preferred date: ${displayDate}`,
    `Preferred time: ${time} IST`,
    `Guests: ${guests}`,
    "",
    "Please contact the visitor to confirm availability.",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [EMAIL],
        reply_to: emailValue,
        subject: `Jutaku visit request — ${displayDate}`,
        text: message,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Resend rejected a visit request", response.status);
      return Response.json({ error: "We couldn't send your request. Please try again shortly." }, { status: 502 });
    }
  } catch (error) {
    console.error("Visit request delivery failed", error);
    return Response.json({ error: "We couldn't send your request. Please try again shortly." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
