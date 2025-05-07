// app/layout.tsx
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/component/nav/Navbar";
import { getDefaultMetadata } from "@/lib/seo";
import GoogleAdsense from "@/component/GoogleAdsense";
import GoogleAnalytics from "@/component/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = getDefaultMetadata({
  title: "DSA Topics & LeetCode Questions",
  description:
    "Browse core DSA topics like Arrays, Linked Lists, Graphs with curated LeetCode practice problems.",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Site Verification */}
        <meta
          name="google-site-verification"
          content="Gqs9619d1r7X2xDIeBjrGseUsT1_z6il6JOv-GsIfiw"
        />

        {/* ✅ Google AdSense (replace with your publisher ID if different) */}
        <GoogleAdsense pId="4432854709401834" />

        {/* ✅ Google Analytics */}
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
