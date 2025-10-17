import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Al-Quran Digital - AI-Powered Quran Learning App",
  description: "Advanced Quran learning application with AI tutor, SRS system, advanced search, and comprehensive features for Malaysia & Indonesia. Built with Next.js 15 and modern React stack.",
  keywords: ["Al-Quran", "Quran", "Islamic", "AI Tutor", "SRS Learning", "Quran Search", "Malaysia", "Indonesia", "Next.js", "TypeScript"],
  authors: [{ name: "Niaga Hub", url: "https://github.com/thisisniagahub" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Al-Quran Digital - AI-Powered Quran Learning",
    description: "Advanced Quran learning with AI tutor, SRS system, and comprehensive features for Malaysia & Indonesia",
    url: "https://al-quran-z-ai.vercel.app",
    siteName: "Al-Quran Digital",
    type: "website",
    locale: "ms_MY",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Quran Digital - AI-Powered Quran Learning",
    description: "Advanced Quran learning with AI tutor, SRS system, and comprehensive features",
    creator: "@niagahub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
