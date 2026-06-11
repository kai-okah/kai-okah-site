import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

// Self-hosted at build time by next/font — zero external requests at runtime.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Software engineering student at the University of Duisburg-Essen. " +
  "Small, honest tools with public source — and an open inbox.";

// Icons and the Open Graph image are wired automatically from the files
// next to this one (icon.svg, favicon.ico, apple-icon.png,
// opengraph-image.png) — App Router file conventions.
export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.brand} — Software Engineering Student`,
    template: `%s · ${profile.brand}`,
  },
  description,
  openGraph: {
    title: profile.brand,
    description,
    url: "/",
    siteName: profile.brand,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

// Runs before first paint so the page never flashes the wrong theme:
// use the saved choice if there is one, otherwise follow the system.
const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="dark";}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the script above sets data-theme on <html>
    // before React hydrates, which React would otherwise flag as a mismatch.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
