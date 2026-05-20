import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Noto_Sans_Malayalam } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { NarratorPanel } from "@/components/narrator-panel";
import "./globals.css";

const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  variable: "--font-malayalam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kerala MCH Tracker · Demo",
  description:
    "BPL Mother & Child Health Tracking and Decision Support — EOI demonstration",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${notoMalayalam.variable}`}
    >
      <body className="font-sans antialiased bg-[var(--surface)] text-[var(--fg)]">
        {children}
        <NarratorPanel />
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
