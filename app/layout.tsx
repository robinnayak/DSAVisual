// export const runtime = "edge";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: 'DSA Topics & LeetCode Questions',
  description: 'Browse core DSA topics like Arrays, Linked Lists, Graphs with curated LeetCode practice problems.',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
            <head>
        {/* pub-4432854709401834 */}
        <GoogleAdsense pId="4432854709401834" />
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
