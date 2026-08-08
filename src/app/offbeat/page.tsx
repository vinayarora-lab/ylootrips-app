import type { Metadata } from 'next';
import OffbeatLanding from '@/components/OffbeatLanding';

export const metadata: Metadata = {
  title: 'Offbeat & Hidden Gems of India — YlooTrips',
  description: 'Discover India\'s best-kept secrets — Spiti Valley, Ziro Valley, Dzukou Valley, Majuli Island, Chopta & Gokarna. Plan your offbeat India trip with YlooTrips.',
  openGraph: {
    title: 'Offbeat & Hidden Gems of India — YlooTrips',
    description: 'Secret valleys, tribal frontiers, sacred coastlines. We take you to the India most people never find.',
    url: 'https://www.ylootrips.com/offbeat',
  },
  alternates: { canonical: 'https://www.ylootrips.com/offbeat' },
};

export default function OffbeatPage() {
  return <OffbeatLanding />;
}
