import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Inter, Playfair_Display } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import Providers from "@/components/Providers";
import { OrganizationJsonLd } from "@/components/JsonLd";
import SecurityShield from "@/components/SecurityShield";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ActiveUserPing from "@/components/ActiveUserPing";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const GA_ID = 'G-D70RVF66E1';

export const metadata: Metadata = {
  title: {
    default: "YlooTrips — India Tour Packages for International Travelers",
    template: "%s | YlooTrips — India Travel Experts"
  },
  description: "Plan your India trip with YlooTrips India Pvt. Ltd. Luxury & budget India tour packages — Golden Triangle, Kerala, Rajasthan, Himalayas. Trusted by 25,000+ travelers from USA, UK, Australia & Europe. 4.9★ rated. Get a custom quote in 1 hour.",
  keywords: [
    "India tour packages",
    "luxury India travel",
    "best India travel company",
    "India trip planner",
    "Golden Triangle tour",
    "Kerala tour package",
    "Rajasthan tour",
    "India travel for Americans",
    "India visa for US citizens",
    "India tours from USA",
    "India tours from UK",
    "India travel guide",
    "best time to visit India",
    "India travel tips",
    "YlooTrips",
  ].join(", "),
  openGraph: {
    title: "YlooTrips | Best India Tour Packages for International Travelers",
    description: "Handcrafted India travel experiences — Golden Triangle, Kerala, Rajasthan & more. Trusted by 25K+ travelers from 40+ countries. Get your custom itinerary in 1 hour.",
    type: "website",
    siteName: "YlooTrips",
    url: "https://www.ylootrips.com",
    images: [
      {
        url: "https://www.ylootrips.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YlooTrips — India Tour Packages for International Travelers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YlooTrips | India Tour Packages for International Travelers",
    description: "Handcrafted India travel — Golden Triangle, Kerala, Rajasthan. Trusted by 25K+ travelers from 40+ countries.",
    images: ["https://www.ylootrips.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.ylootrips.com",
    languages: {
      "en-US": "https://www.ylootrips.com",
      "en-GB": "https://www.ylootrips.com",
      "en-AU": "https://www.ylootrips.com",
      "en-CA": "https://www.ylootrips.com",
      "en-IE": "https://www.ylootrips.com",
      "en": "https://www.ylootrips.com",
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
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
  verification: {
    google: '9C1_Q3HeFI5G6i2JTyjPllbVtlomtZQzOsWDVekljY0',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        {/* Force light mode — prevent system dark mode from inverting the site */}
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#F5F1EB" />
        {/* Viewport — critical for mobile rendering */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <OrganizationJsonLd />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>

        <Providers>
          <ActiveUserPing />
          <SecurityShield />
          <ExitIntentPopup />
          <Suspense fallback={<div className="h-24 bg-cream" />}>
            <Header />
          </Suspense>
          <main className="min-h-screen pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <WhatsAppButton phoneNumber="918427831127" />
          <MobileStickyCTA />
        </Providers>
      </body>
    </html>
  );
}
