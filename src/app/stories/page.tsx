import type { Metadata } from 'next';
import StoryFeed from '@/components/StoryFeed';

export const metadata: Metadata = {
  title: 'Travel Stories — Real Travelogues by Indian Travellers | YlooTrips',
  description:
    'Read authentic travel stories from real travellers across India. Get inspired for your next trip — and share your own adventure.',
  openGraph: {
    title: 'Travel Stories — Real Travelogues | YlooTrips',
    description: 'Read and share authentic travel stories from across India.',
    url: 'https://www.ylootrips.com/stories',
  },
  alternates: { canonical: 'https://www.ylootrips.com/stories' },
};

export default function StoriesPage() {
  return <StoryFeed />;
}
