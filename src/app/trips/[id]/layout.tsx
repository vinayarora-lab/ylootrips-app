import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const API_URL = 'https://trip-backend-65232427280.asia-south1.run.app/api';

interface Trip {
  id: number;
  title: string;
  description?: string;
  shortDescription?: string;
  destination?: string;
  duration?: string;
  price?: number | string;
  imageUrl?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
}

async function getTrip(id: string): Promise<Trip | null> {
  try {
    const res = await fetch(`${API_URL}/trips/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const trip = await getTrip(id);

  if (!trip) {
    return {
      title: 'Trip Details | YlooTrips — India Travel Experts',
      description: 'Explore curated India tour packages with YlooTrips. Expert-guided trips to Rajasthan, Kerala, Himalayas and beyond.',
    };
  }

  const description = trip.shortDescription || trip.description || '';
  const truncatedDesc = description.length > 160 ? description.slice(0, 157) + '...' : description;
  const ogDesc = `${trip.title} — ${trip.duration ? trip.duration + ' · ' : ''}${trip.destination ? trip.destination + ' · ' : ''}Expert guided India tour. Book with YlooTrips.`;
  const image = trip.imageUrl || (trip.images && trip.images[0]) || 'https://www.ylootrips.com/og-image.jpg';
  const url = `https://www.ylootrips.com/trips/${id}`;
  const price = trip.price ? (typeof trip.price === 'number' ? trip.price.toString() : trip.price) : undefined;

  return {
    title: `${trip.title}${trip.duration ? ' — ' + trip.duration : ''}`,
    description: truncatedDesc || ogDesc,
    keywords: [
      trip.title,
      trip.destination || 'India',
      'India tour package',
      'India trip',
      'YlooTrips',
      trip.duration || '',
    ]
      .filter(Boolean)
      .join(', '),
    openGraph: {
      title: `${trip.title} | YlooTrips — India Travel Experts`,
      description: ogDesc,
      url,
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${trip.title} — YlooTrips India tour`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${trip.title} | YlooTrips`,
      description: ogDesc,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default function TripDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
