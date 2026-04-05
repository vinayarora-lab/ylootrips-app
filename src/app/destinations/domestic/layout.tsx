import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'India Domestic Destinations — Rajasthan, Kerala, Goa & More',
  description: 'Explore the best domestic travel destinations across India — Rajasthan palaces, Kerala backwaters, Goa beaches, Himalayan landscapes, and cultural treasures. Expert-curated by YlooTrips.',
  keywords: 'India domestic destinations, places to visit in India, Rajasthan tour, Kerala tour, Goa travel, Himachal Pradesh, Uttarakhand, India tourism, best Indian destinations',
  openGraph: {
    title: 'India Domestic Destinations | YlooTrips — India Travel Experts',
    description: 'Explore the best of India — Rajasthan palaces, Kerala backwaters, Goa beaches, and Himalayan highlands. Expert-curated experiences.',
    url: 'https://www.ylootrips.com/destinations/domestic',
    images: [
      {
        url: 'https://www.ylootrips.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'India domestic destinations — Rajasthan, Kerala, Goa, Himalayas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Domestic Destinations | YlooTrips',
    description: 'Explore India — Rajasthan, Kerala, Goa, Himalayas and beyond. Expert-curated by YlooTrips.',
    images: ['https://www.ylootrips.com/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/destinations/domestic' },
};

export default function DomesticLayout({ children }: { children: ReactNode }) {
  return children;
}
