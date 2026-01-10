import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Upbeat - Website Uptime Monitoring",
  description: "Monitor your website's uptime and performance with real-time alerts, beautiful analytics, and comprehensive reporting. Get instant notifications when your site goes down.",
  keywords: ["uptime monitoring", "website monitoring", "performance monitoring", "downtime alerts", "site reliability", "web monitoring"],
  authors: [{ name: "Upbeat" }],
  creator: "Upbeat",
  publisher: "Upbeat",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Upbeat - Website Uptime Monitoring",
    description: "Monitor your website's uptime and performance with real-time alerts and beautiful analytics.",
    siteName: "Upbeat",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Upbeat - Website Uptime Monitoring",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Upbeat - Website Uptime Monitoring",
    description: "Monitor your website's uptime and performance with real-time alerts and beautiful analytics.",
    images: ["/og-image.png"],
    creator: "@upbeat",
  },
  
  // Icons
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  
  // Manifest
  manifest: "/manifest.json",
  
  // Robots
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

// Viewport configuration (separate export required by Next.js 14+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-foreground min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
