import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'India Hotels & Stays — Heritage Havelis to Luxury Resorts',
  description: 'Book handpicked hotels across India — palace havelis in Rajasthan, houseboat stays in Kerala, Himalayan lodges, and Goa beach resorts. Curated by YlooTrips experts.',
  keywords: 'India hotels, Rajasthan heritage hotels, Kerala houseboat, Goa beach resorts, Himalayan lodges, luxury India hotels, boutique India stays, India accommodation',
  openGraph: {
    title: 'India Hotels & Stays | YlooTrips — India Travel Experts',
    description: 'Handpicked hotels across India — from palace havelis to houseboat stays. Curated by travel experts.',
    url: 'https://www.ylootrips.com/hotels',
    images: [
      {
        url: 'https://www.ylootrips.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'India hotels — heritage havelis, luxury resorts and houseboat stays',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Hotels & Stays | YlooTrips',
    description: 'Handpicked hotels across India — from palace havelis to houseboat stays.',
    images: ['https://www.ylootrips.com/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/hotels' },
};

export default function HotelsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Hotels', url: 'https://www.ylootrips.com/hotels' },
      ]} />
      {children}
    </>
  );
}
