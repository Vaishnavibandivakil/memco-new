import type { Metadata, Viewport } from "next";
import { Montserrat, Pinyon_Script, Playfair } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Chrome } from "@/components/Chrome";

/* Display: Playfair at its narrowest width and highest optical size (condensed, hairline serif caps).
   Script: Pinyon for the one-word flourishes. Labels/body stay on MEMCO's brand sans, Montserrat. */
const display = Playfair({ subsets: ["latin"], axes: ["wdth", "opsz"], variable: "--font-display", display: "swap" });
const script = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });
const sans = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "MEMCO Skyline · Jutaku, Begur, South Bengaluru",
  description: "Own 500 sq.ft. Experience 50,000 sq.ft. 646 private spaces between Singasandra and Hosa Road Metro, Begur, South Bengaluru.",
};
export const viewport: Viewport = { themeColor: "#0f2b21", width: "device-width", initialScale: 1 };

const boot = "var d=document.documentElement;d.classList.add('js');if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('reduced');";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${script.variable} ${sans.variable}`} data-tone="dark" suppressHydrationWarning>
      <body>
        {/* flags before first paint so intro states never flash; without JS everything is visible */}
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <SmoothScroll />
        {children}
        <Chrome />
      </body>
    </html>
  );
}
