import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Contact YlooTrips — Plan Your India Trip Today',
  description: 'Get in touch with YlooTrips India Pvt. Ltd. to plan your perfect India journey. Reply within 1 hour via WhatsApp (+91 84278 31127) or email. Custom itineraries, group tours, and honeymoon packages.',
  keywords: 'contact YlooTrips, India tour inquiry, plan India trip, custom India tour, India travel agent contact, WhatsApp India tour, New Delhi travel agent',
  openGraph: {
    title: 'Contact YlooTrips | Plan Your India Trip Today',
    description: 'Get your custom India itinerary in 1 hour. WhatsApp +91 84278 31127 or email connectylootrips@gmail.com.',
    url: 'https://www.ylootrips.com/contact',
    images: [
      {
        url: 'https://www.ylootrips.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact YlooTrips — plan your India trip',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact YlooTrips | Plan Your India Trip',
    description: 'Get your custom India itinerary in 1 hour. WhatsApp or email us.',
    images: ['https://www.ylootrips.com/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/contact' },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Contact', url: 'https://www.ylootrips.com/contact' },
      ]} />
      {children}
    </>
  );
}
