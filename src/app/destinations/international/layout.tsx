import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'International Destinations — Asia, Europe, Africa & More',
  description: 'Explore international destinations curated by YlooTrips — Southeast Asia, Europe, Africa, and beyond. Expertly planned tours for Indian travelers heading abroad.',
  keywords: 'international destinations India, international tour packages from India, Southeast Asia tour, Europe tour from India, Africa safari, international travel India',
  openGraph: {
    title: 'International Destinations | YlooTrips — India Travel Experts',
    description: 'Expertly curated international destinations for Indian travelers — Asia, Europe, Africa, and beyond.',
    url: 'https://www.ylootrips.com/destinations/international',
    images: [
      {
        url: 'https://www.ylootrips.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'International destinations curated by YlooTrips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'International Destinations | YlooTrips',
    description: 'Expertly curated international tours — Asia, Europe, Africa and beyond.',
    images: ['https://www.ylootrips.com/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/destinations/international' },
};

export default function InternationalLayout({ children }: { children: ReactNode }) {
  return children;
}
