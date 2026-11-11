# Jutaku form API testing

Import `Jutaku-Forms.postman_collection.json` into Postman or Thunder Client. The website uses this split:

- Enquiry leads: `POST https://crm.memcoskyline.com/api/analytics/contact/capture`
- Visit availability: `GET https://api.memcoskyline.com/api/booking/availability`
- Visit booking: `POST https://api.memcoskyline.com/api/booking/book`
- Local website routes: `http://localhost:3000`

The browser submits to the local Next.js routes. Those server routes validate the data and forward it to the appropriate backend host.

Start the site with `npm run dev` before running local requests. Use Postman Desktop or its Desktop Agent for `localhost`; the Cloud Agent cannot connect to your computer.

## Safe checks

Folder **01 - Safe backend route verification** checks all three production routes with either a GET request or an invalid empty POST. These checks create no lead or booking.

Folder **02 - Local website validation** checks the Next.js handlers using invalid payloads. These requests also create no records.

## Day index

`base_iso: 2026-06-01` is the fixed visit-calendar anchor:

```text
date = base_iso + (day_index - 1 days)
```

Copy `day_index` and `slot_start` from the selected availability item into the booking request. On 11 November 2026, index 164 represents that date.

## Controlled live test

Folder **03 - Manual production submissions** can create real CRM leads and visit bookings. It remains skipped until `test_phone` contains a number you control. Clearly mark test records and arrange their removal afterward.

No Authorization header or API key is required by the supplied endpoints.
