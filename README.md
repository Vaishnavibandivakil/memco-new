# MEMCO Skyline · Jutaku

Next.js site for the Jutaku Experience Centre.

## Run locally

```bash
npm install
npm run dev
```

## CRM form integration

Website forms call local Next.js route handlers, which validate requests and forward them to the appropriate MEMCO service. Enquiries go directly to the CRM capture endpoint, while visit availability and booking use the public Python API.

- `/brochure` posts to `/api/enquiries`, which forwards to `https://crm.memcoskyline.com/api/analytics/contact/capture`.
- `/book-visit` reads `/api/visit-availability` and posts to `/api/visit-requests`. These forward to `/api/booking/availability` and `/api/booking/book`.
- The browser calls only the local Next.js routes; backend hosts remain server-side.

No authentication is required by the supplied APIs. Both base URLs can be overridden server-side when needed:

```text
MEMCO_API_BASE_URL=https://api.memcoskyline.com
MEMCO_CRM_BASE_URL=https://crm.memcoskyline.com
```

`base_iso` is the fixed launch-date anchor. The form uses the `day_index` values returned by availability and calculates a date as `base_iso + (day_index - 1)`. For example, index 164 maps to 11 November 2026.

## Jutaku AI assistant

The site chat posts recent messages to `/api/chat`. Add `OMEGA_API_KEY` to `.env.local` for local development and to the Vercel project's Production environment to enable live AI replies. Redeploy after adding the Vercel variable. Do not prefix it with `NEXT_PUBLIC_` or expose it in browser code. The optional `OMEGA_CHAT_MODEL` variable defaults to `omega-plus`. The server calls [Omega Plus's OpenAI-compatible chat endpoint](https://omegaplusapi.com/documentation); it does not use an OpenAI API key.

The assistant is grounded in project facts in `lib/chat-knowledge.ts`. Review those facts when prices, amenities, metro service or contact details change. Requests are bounded and rate limited. If the key is absent or the upstream service fails, the chat returns the site's existing curated answers so visitors still get basic help. Confirm that the Omega Plus account has API access and billing or quota available before expecting AI replies on the live site.
