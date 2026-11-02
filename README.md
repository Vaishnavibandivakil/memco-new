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

## Jutaku AI assistant

The site chat posts recent messages to `/api/chat`. Add `OPENAI_API_KEY` to `.env.local` for local development and to the Vercel project's Production environment to enable live AI replies. Redeploy after adding the Vercel variable. Do not prefix it with `NEXT_PUBLIC_` or expose it in browser code. The optional `OPENAI_CHAT_MODEL` variable defaults to `gpt-6-luna`.

The assistant is grounded in project facts in `lib/chat-knowledge.ts`. Review those facts when prices, amenities, metro service or contact details change. Requests are bounded and rate limited, and the API sends `store: false` to OpenAI. If the key is absent or the upstream service fails, the chat returns the site's existing curated answers so visitors still get basic help. Confirm that the OpenAI account has API access and billing enabled before expecting AI replies on the live site.
