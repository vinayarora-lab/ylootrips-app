import type { Metadata } from 'next';
import { Suspense } from 'react';
import TripPlannerChat from '@/components/TripPlannerChat';

export const metadata: Metadata = {
  title: 'Yloo AI Trip Planner — YlooTrips',
  description: 'Plan any trip worldwide with Yloo AI — get a personalised day-by-day itinerary in seconds. India, Bali, Dubai, Thailand and beyond.',
  openGraph: {
    title: 'Yloo AI Trip Planner — YlooTrips',
    description: 'Plan any trip worldwide with Yloo AI — personalised itineraries for India and international destinations.',
    url: 'https://ylootrips.com/trip-planner',
  },
};

export default function TripPlannerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-light" />}>
      <TripPlannerChat />
    </Suspense>
  );
}
