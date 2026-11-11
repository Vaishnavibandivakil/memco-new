import fs from 'node:fs';

const test = lines => [{ listen: 'test', script: { type: 'text/javascript', exec: lines } }];
const bookingBody = `{
  "name": "CRM TEST - Delete Me",
  "phone": "{{test_phone}}",
  "email": "{{test_email}}",
  "day_index": {{day_index}},
  "slot_start": "{{slot_start}}",
  "quantity": 1,
  "page_url": "http://localhost:3000/book-visit"
}`;
const collection = {
  info: {
    name: 'Jutaku Forms - CRM and Booking API Integration',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    description: 'Tests direct CRM lead capture at crm.memcoskyline.com plus visit availability and booking at api.memcoskyline.com. Safe verification requests do not create records.',
  },
  variable: [
    { key: 'website_base_url', value: 'http://localhost:3000' },
    { key: 'api_base_url', value: 'https://api.memcoskyline.com' },
    { key: 'crm_base_url', value: 'https://crm.memcoskyline.com' },
    { key: 'test_phone', value: '' },
    { key: 'test_email', value: 'test@example.com' },
    { key: 'day_index', value: '164' },
    { key: 'slot_start', value: '10:00' },
  ],
  item: [
    {
      name: '01 - Safe backend route verification',
      item: [
        {
          name: 'Availability route exists',
          request: { method: 'GET', url: '{{api_base_url}}/api/booking/availability' },
          event: test(["pm.test('HTTP 200', () => pm.response.to.have.status(200));", "pm.test('Has rolling window', () => { const j=pm.response.json(); pm.expect(j.base_iso).to.eql('2026-06-01'); pm.expect(j.start_day_index).to.be.a('number'); pm.expect(j.days).to.be.an('array'); });"]),
        },
        {
          name: 'Contact route validates input',
          request: { method: 'POST', header: [{ key: 'Content-Type', value: 'application/json' }], body: { mode: 'raw', raw: '{}' }, url: '{{crm_base_url}}/api/analytics/contact/capture' },
          event: test(["pm.test('HTTP 400', () => pm.response.to.have.status(400));", "pm.test('Requires name and phone', () => pm.expect(pm.response.json().error).to.include('name and phone'));"]),
        },
        {
          name: 'Booking route validates input',
          request: { method: 'POST', header: [{ key: 'Content-Type', value: 'application/json' }], body: { mode: 'raw', raw: '{}' }, url: '{{api_base_url}}/api/booking/book' },
          event: test(["pm.test('HTTP 400', () => pm.response.to.have.status(400));", "pm.test('Requires booking fields', () => pm.expect(pm.response.json().detail).to.include('day_index'));" ]),
        },
      ],
    },
    {
      name: '02 - Local website validation',
      item: [
        {
          name: 'Enquiry missing fields',
          request: { method: 'POST', header: [{ key: 'Content-Type', value: 'application/json' }], body: { mode: 'raw', raw: '{}' }, url: '{{website_base_url}}/api/enquiries' },
          event: test(["pm.test('HTTP 400', () => pm.response.to.have.status(400));"]),
        },
        {
          name: 'Booking missing fields',
          request: { method: 'POST', header: [{ key: 'Content-Type', value: 'application/json' }], body: { mode: 'raw', raw: '{}' }, url: '{{website_base_url}}/api/visit-requests' },
          event: test(["pm.test('HTTP 400', () => pm.response.to.have.status(400));"]),
        },
      ],
    },
    {
      name: '03 - Manual production submissions',
      item: [
        {
          name: 'Create or update test enquiry',
          request: {
            method: 'POST',
            description: 'Creates or updates a real CRM lead. Set test_phone to a number you control first.',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: { mode: 'raw', raw: JSON.stringify({ name: 'CRM TEST - Delete Me', phone: '{{test_phone}}', email: '{{test_email}}', message: 'Controlled website integration test', form_id: 'postman-crm-test', page_url: 'http://localhost:3000/brochure' }, null, 2) },
            url: '{{crm_base_url}}/api/analytics/contact/capture',
          },
          event: [{ listen: 'prerequest', script: { type: 'text/javascript', exec: ["if (!pm.variables.get('test_phone')) { pm.execution.skipRequest(); throw new Error('Set test_phone to a number you control.'); }"] } }, ...test(["pm.test('CRM accepted enquiry', () => pm.response.to.have.status(200));"])],
        },
        {
          name: 'Book controlled test slot',
          request: {
            method: 'POST',
            description: 'Creates a real booking. Copy current base_iso, day_index and slot_start from availability first.',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: { mode: 'raw', raw: bookingBody },
            url: '{{api_base_url}}/api/booking/book',
          },
          event: [{ listen: 'prerequest', script: { type: 'text/javascript', exec: ["if (!pm.variables.get('test_phone')) { pm.execution.skipRequest(); throw new Error('Set test_phone and current availability variables before sending.'); }"] } }, ...test(["pm.test('CRM processed booking', () => pm.response.to.have.status(200));"])],
        },
      ],
    },
  ],
};

fs.mkdirSync(new URL('../postman/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../postman/Jutaku-Forms.postman_collection.json', import.meta.url), `${JSON.stringify(collection, null, 2)}\n`);
console.log('Postman collection generated for CRM leads and public booking APIs.');
