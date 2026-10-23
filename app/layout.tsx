import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ChatAssistant } from "@/components/ChatAssistant";
import "./globals.css";

/* Brand guidelines §04: Montserrat only — Bold 700 headlines/numerals, SemiBold 600 sub-heads/labels/buttons,
   Regular 400 body. Self-hosted from app/fonts (variable wght axis) so the site never depends on reaching
   fonts.googleapis.com — when that download fails Next silently falls back to Arial at the wrong metrics. */
const sans = localFont({ src: "./fonts/montserrat-var.woff2", weight: "300 800", variable: "--font-sans", display: "swap", fallback: ["Arial", "Helvetica", "sans-serif"] });

export const metadata: Metadata = {
  title: "MEMCO Skyline · Jutaku, Begur, South Bengaluru",
  description: "Own 500 sq.ft. Experience 50,000 sq.ft. 646 private spaces between Singasandra and Hosa Road Metro, Begur, South Bengaluru.",
};
export const viewport: Viewport = { themeColor: "#006e42", width: "device-width", initialScale: 1 };

const boot = "var d=document.documentElement;d.classList.add('js');if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('reduced');if(location.pathname==='/')d.classList.add(!location.hash&&!d.classList.contains('reduced')?'intro-active':'intro-seen');";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={sans.variable} data-tone="dark" suppressHydrationWarning>
      <body>
        {/* flags before first paint so motion states never flash; without JS everything is visible */}
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        {children}
        <ChatAssistant />
      </body>
    </html>
  );
}
