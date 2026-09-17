import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://collegefootballranked.com"),
  title: {
    default: "College Football Rankings 2026: Consensus Top 25 Poll | College Football Ranked",
    template: "%s | College Football Ranked",
  },
  description:
    "Explore the official 2026 College Football Rankings voted on by fans and analysts nationwide. Track live consensus Top 25 poll movements, points, first-place votes, and submit your weekly ballot.",
  keywords: [
    "college football rankings",
    "cfb top 25",
    "college football poll",
    "ap poll alternative",
    "ncaa football rankings",
    "weekly college football rankings",
    "college football power rankings",
    "cfb rankings 2026",
    "college football top 25",
    "consensus football poll",
  ],
  authors: [{ name: "College Football Ranked Team" }],
  creator: "College Football Ranked",
  publisher: "College Football Ranked",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "College Football Rankings 2026: Consensus Top 25 Poll",
    description:
      "Explore official live college football rankings voted on by fans and analysts. Track weekly Top 25 movements, first-place votes, and submit your ballot.",
    url: "https://collegefootballranked.com",
    siteName: "College Football Ranked",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "College Football Rankings 2026: Consensus Top 25 Poll",
    description:
      "Live democratic consensus college football rankings. Track weekly Top 25 movements and submit your vote.",
    creator: "@CFRanked",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0c0f14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <GoogleAnalytics />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
