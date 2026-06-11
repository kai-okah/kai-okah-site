import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kai Okah",
  description: "Personal site of Kai Okah, software engineering student.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
