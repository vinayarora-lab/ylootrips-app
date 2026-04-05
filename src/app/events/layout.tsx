import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'India Events & Experiences — Corporate, Weddings & Adventures',
  description: 'Plan corporate offsites, destination weddings, cultural festivals, and group adventures across India. 500+ events delivered. Pan-India reach. Get a free quote within 1 hour.',
  keywords: 'India events, corporate events India, destination weddings India, group travel India, India cultural festivals, team outing India, India event planning, India adventure events',
  openGraph: {
    title: 'India Events & Experiences | YlooTrips — India Travel Experts',
    description: 'Corporate offsites, destination weddings, cultural festivals, and group adventures across India. 500+ events. Pan-India reach.',
    url: 'https://www.ylootrips.com/events',
    images: [
      {
        url: 'https://www.ylootrips.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'YlooTrips India events — corporate offsites, weddings, cultural experiences',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Events & Experiences | YlooTrips',
    description: 'Corporate offsites, destination weddings, and group adventures across India. 500+ events delivered.',
    images: ['https://www.ylootrips.com/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/events' },
};

export default function EventsLayout({ children }: { children: ReactNode }) {
  return children;
}
