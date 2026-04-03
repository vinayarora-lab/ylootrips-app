import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'India Hotels & Stays — Heritage Havelis to Luxury Resorts',
  description: 'Book handpicked hotels across India — palace havelis in Rajasthan, houseboat stays in Kerala, Himalayan lodges, and Goa beach resorts. Curated by YlooTrips.',
  keywords: 'India hotels, Rajasthan heritage hotels, Kerala houseboat, Goa beach resorts, Himalayan lodges, luxury India hotels, boutique India stays',
  openGraph: {
    title: 'India Hotels & Stays | YlooTrips',
    description: 'Handpicked hotels across India — from palace havelis to houseboat stays.',
    url: 'https://www.ylootrips.com/hotels',
  },
  alternates: { canonical: 'https://www.ylootrips.com/hotels' },
};

export default function HotelsLayout({ children }: { children: ReactNode }) {
  return children;
}
