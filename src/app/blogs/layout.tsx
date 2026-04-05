import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'India Travel Blog — Tips, Guides & Inspiration | YlooTrips',
  description: 'Expert India travel guides and articles — best time to visit, safety tips, budget breakdowns, destination comparisons, and insider knowledge from 25,000+ trips. Written by YlooTrips travel experts.',
  keywords: 'India travel blog, India travel tips, India travel guide, best time visit India, India travel advice, India solo travel, India budget travel, India destinations blog',
  openGraph: {
    title: 'India Travel Blog | YlooTrips — India Travel Experts',
    description: 'Expert India travel guides — best time to visit, safety tips, budget breakdowns, and insider destination knowledge from 25,000+ trips.',
    url: 'https://www.ylootrips.com/blogs',
    images: [
      {
        url: 'https://www.ylootrips.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'YlooTrips India Travel Blog — expert guides and tips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Travel Blog | YlooTrips',
    description: 'Expert India travel guides — tips, safety, budget and destination inspiration.',
    images: ['https://www.ylootrips.com/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/blogs' },
};

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return children;
}
