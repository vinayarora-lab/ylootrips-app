import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const API_URL = 'https://trip-backend-65232427280.asia-south1.run.app/api';

interface Event {
  id: number;
  title: string;
  shortDescription?: string;
  imageUrl?: string;
  slug?: string;
  category?: string;
  city?: string;
  eventDate?: string;
  price?: number | string;
}

async function getEvent(slugOrId: string): Promise<Event | null> {
  try {
    const res = await fetch(`${API_URL}/events/${slugOrId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugOrId: string }>;
}): Promise<Metadata> {
  const { slugOrId } = await params;
  const event = await getEvent(slugOrId);

  if (!event) {
    return {
      title: 'India Event Details | YlooTrips — India Travel Experts',
      description: 'Explore curated events and experiences across India with YlooTrips. Corporate offsites, weddings, cultural festivals, and group adventures.',
      alternates: { canonical: `https://www.ylootrips.com/events/${slugOrId}` },
    };
  }

  const url = `https://www.ylootrips.com/events/${event.slug || event.id}`;
  const image = event.imageUrl || 'https://www.ylootrips.com/og-image.jpg';
  const location = event.city ? ` in ${event.city}` : ' across India';
  const description =
    event.shortDescription ||
    `${event.title}${location}. Book tickets and plan your experience with YlooTrips.`;
  const truncatedDesc =
    description.length > 160 ? description.slice(0, 157) + '...' : description;

  return {
    title: `${event.title}${event.city ? ' — ' + event.city : ''}`,
    description: truncatedDesc,
    keywords: [
      event.title,
      event.category || 'India event',
      event.city || 'India',
      'India events',
      'YlooTrips events',
    ]
      .filter(Boolean)
      .join(', '),
    openGraph: {
      title: `${event.title} | YlooTrips — India Travel Experts`,
      description: truncatedDesc,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${event.title} — YlooTrips event`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.title} | YlooTrips`,
      description: truncatedDesc,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default function EventDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
