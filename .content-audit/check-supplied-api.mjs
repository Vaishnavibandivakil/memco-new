const base = 'https://api.memcoskyline.com';
const paths = [
  '/',
  '/docs',
  '/openapi.json',
  '/swagger',
  '/swagger.json',
  '/api/public/slot-availability',
  '/api/public/slot-availability/',
  '/api/booking/availability',
  '/api/booking/availability/',
  '/api/analytics/contact/capture',
  '/api/analytics/contact/capture/',
  '/api/public/book-slot',
  '/api/booking/book',
];

for (const path of paths) {
  try {
    const response = await fetch(base + path, {
      method: 'GET',
      headers: { Origin: 'http://localhost:3000' },
      redirect: 'manual',
      signal: AbortSignal.timeout(15000),
    });
    const text = await response.text();
    console.log(JSON.stringify({
      path,
      status: response.status,
      type: response.headers.get('content-type'),
      allow: response.headers.get('allow'),
      cors: response.headers.get('access-control-allow-origin'),
      location: response.headers.get('location'),
      body: text.slice(0, 240),
    }));
  } catch (error) {
    console.log(JSON.stringify({ path, error: error.message }));
  }
}

const spec = await (await fetch(base + '/openapi.json')).json();
console.log('\nOPENAPI PATHS');
for (const [path, operations] of Object.entries(spec.paths)) {
  console.log(path + ' -> ' + Object.keys(operations).map(method => method.toUpperCase()).join(', '));
}
console.log('\nOPENAPI SCHEMAS');
for (const [name, schema] of Object.entries(spec.components?.schemas ?? {})) {
  console.log(JSON.stringify({ name, required: schema.required ?? [], properties: Object.keys(schema.properties ?? {}) }));
}
for (const path of ['/api/leads', '/api/booking/availability', '/api/booking/book', '/api/analytics/contact/capture', '/api/booking/event']) {
  console.log('\nOPERATION ' + path);
  console.log(JSON.stringify(spec.paths[path], null, 2));
}
for (const name of ['LeadSubmission', 'BookSlotRequest', 'BookingEvent']) {
  console.log('\nSCHEMA ' + name);
  console.log(JSON.stringify(spec.components.schemas[name], null, 2));
}
