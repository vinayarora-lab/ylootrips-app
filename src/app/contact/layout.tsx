import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Contact YlooTrips — Plan Your India Trip Today',
  description: 'Get in touch with YlooTrips to plan your perfect India journey. We reply within 1 hour via WhatsApp or email. Custom itineraries, group tours, and honeymoon packages.',
  keywords: 'contact YlooTrips, India tour inquiry, plan India trip, custom India tour, India travel agent contact',
  openGraph: {
    title: 'Contact YlooTrips | Plan Your India Trip',
    description: 'Get your custom India itinerary in 1 hour. WhatsApp, email, or fill in our form.',
    url: 'https://www.ylootrips.com/contact',
  },
  alternates: { canonical: 'https://www.ylootrips.com/contact' },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
