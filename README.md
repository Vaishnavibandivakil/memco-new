# MEMCO Skyline · Jutaku

Next.js site for the Jutaku Experience Centre.

## Run locally

```bash
npm install
npm run dev
```

## Direct visit requests

The `/book-visit` form posts to `/api/visit-requests`. The server sends the request to `info@memcoskyline.com` through [Resend](https://resend.com/docs/send-with-nextjs). Visitors see a confirmation only when Resend accepts the message.

Set these server-side environment variables locally in `.env.local` and in the Vercel project for Production:

```text
RESEND_API_KEY=<your Resend API key>
RESEND_FROM_EMAIL=Jutaku Visits <visits@memcoskyline.com>
```

Verify `memcoskyline.com` for sending in Resend before using that sender address. The API key must remain server-side; do not prefix it with `NEXT_PUBLIC_`. Redeploy after setting the Vercel variables. Without both values, the form shows an unavailable message and does not claim the request was sent.
