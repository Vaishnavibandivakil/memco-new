import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const helper = fs.readFileSync(new URL('../lib/memco-api.ts', import.meta.url), 'utf8');
const savedFetch = globalThis.fetch;

async function loadRoute(path) {
  const route = fs.readFileSync(new URL(path, import.meta.url), 'utf8')
    .replace(/^import \{[^\n]+\} from "@\/lib\/memco-api";\r?\n/m, '');
  const compiled = ts.transpileModule(`${helper}\n${route}`, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}#${Math.random()}`);
}

const enquiry = await loadRoute('../app/api/enquiries/route.ts');
const availability = await loadRoute('../app/api/visit-availability/route.ts');
const booking = await loadRoute('../app/api/visit-requests/route.ts');
const jsonRequest = (path, body, type = 'application/json') => new Request(`http://localhost${path}`, {
  method: 'POST',
  headers: { 'Content-Type': type },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});
const baseIso = '2026-06-01';
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const tomorrow = new Date(`${today}T00:00:00Z`);
tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
const date = tomorrow.toISOString().slice(0, 10);
const todayIndex = Math.round((new Date(`${today}T00:00:00Z`).getTime() - new Date(`${baseIso}T00:00:00Z`).getTime()) / 86_400_000) + 1;
const dayIndex = Math.round((tomorrow.getTime() - new Date(`${baseIso}T00:00:00Z`).getTime()) / 86_400_000) + 1;
const slots = [{ slot_start: '10:00', slot_end: '11:00', label: '10:00 AM - 11:00 AM', available: 12, is_full: false, booked_count: 0 }];
const liveAvailability = { base_iso: baseIso, start_day_index: dayIndex, end_day_index: dayIndex + 29, days: [{ day_index: dayIndex, date, day_label: `Day ${dayIndex}`, slots }] };
const validEnquiry = { name: 'Integration Test', phone: '+919999999999', email: 'test@example.com', interest: 'Self use', consent: true, pageUrl: 'http://localhost:3000/brochure' };
const validBooking = { baseIso, date, dayIndex, slotStart: '10:00', guests: 2, name: 'Integration Test', phone: '9999999999', email: '', pageUrl: 'http://localhost:3000/book-visit' };

async function expectStatus(name, responsePromise, status) {
  const response = await responsePromise;
  assert.equal(response.status, status, name);
  console.log(`PASS ${name}: HTTP ${status}`);
  return response;
}

try {
  let calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options, body: options.body ? JSON.parse(options.body) : undefined });
    return new Response(JSON.stringify({ success: true, status: 'created', lead_id: 'lead_test' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  await expectStatus('Enquiry rejects wrong content type', enquiry.POST(jsonRequest('/api/enquiries', validEnquiry, 'text/plain')), 415);
  await expectStatus('Enquiry rejects missing fields', enquiry.POST(jsonRequest('/api/enquiries', {})), 400);
  const enquiryResponse = await expectStatus('Enquiry forwards to CRM capture', enquiry.POST(jsonRequest('/api/enquiries', validEnquiry)), 200);
  assert.deepEqual(await enquiryResponse.json(), { ok: true, status: 'created', leadId: 'lead_test' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://crm.memcoskyline.com/api/analytics/contact/capture');
  assert.equal(calls[0].body.phone, '919999999999');

  calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    return new Response(JSON.stringify(liveAvailability), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  const availabilityResponse = await expectStatus('Availability forwards to public API', availability.GET(), 200);
  assert.deepEqual(await availabilityResponse.json(), liveAvailability);
  assert.deepEqual(calls, ['https://api.memcoskyline.com/api/booking/availability']);

  const todayAvailability = {
    base_iso: baseIso,
    start_day_index: todayIndex,
    end_day_index: todayIndex,
    days: [{ day_index: todayIndex, date: today, day_label: `Day ${todayIndex}`, slots: [{ ...slots[0], slot_start: '00:00' }] }],
  };
  globalThis.fetch = async () => new Response(JSON.stringify(todayAvailability), { status: 200, headers: { 'Content-Type': 'application/json' } });
  const filteredAvailabilityResponse = await expectStatus('Availability removes elapsed slots for today', availability.GET(), 200);
  const filteredAvailability = await filteredAvailabilityResponse.json();
  assert.deepEqual(filteredAvailability.days[0].slots, []);

  calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), body: options.body ? JSON.parse(options.body) : undefined });
    const body = String(url).endsWith('/availability')
      ? liveAvailability
      : { success: true, ok: true, booking_id: 'booking_test', confirmation_code: 'JUTAKU-TEST', slot_label: '10:00 AM - 11:00 AM' };
    return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  await expectStatus('Booking rejects missing fields', booking.POST(jsonRequest('/api/visit-requests', {})), 400);
  await expectStatus('Booking rejects an elapsed slot for today', booking.POST(jsonRequest('/api/visit-requests', {
    ...validBooking,
    date: today,
    dayIndex: todayIndex,
    slotStart: '00:00',
  })), 400);
  const bookingResponse = await expectStatus('Booking checks availability and forwards to public API', booking.POST(jsonRequest('/api/visit-requests', validBooking)), 200);
  assert.deepEqual(await bookingResponse.json(), { ok: true, duplicate: false, bookingId: 'booking_test', confirmationCode: 'JUTAKU-TEST', slotLabel: '10:00 AM - 11:00 AM' });
  assert.deepEqual(calls.map((call) => call.url), [
    'https://api.memcoskyline.com/api/booking/availability',
    'https://api.memcoskyline.com/api/booking/book',
  ]);
  assert.equal(calls[1].body.day_index, dayIndex);
  assert.equal(calls[1].body.quantity, 2);
  assert.equal(calls[1].body.base_iso, undefined);

  globalThis.fetch = async () => new Response(JSON.stringify({ ...liveAvailability, days: [{ day_index: dayIndex, date, day_label: `Day ${dayIndex}`, slots: [{ ...slots[0], available: 1 }] }] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  await expectStatus('Booking rejects insufficient capacity', booking.POST(jsonRequest('/api/visit-requests', validBooking)), 409);
  console.log('PASS Hybrid CRM and booking API checks use mocked responses; no production lead or booking was created.');
} finally {
  globalThis.fetch = savedFetch;
}
