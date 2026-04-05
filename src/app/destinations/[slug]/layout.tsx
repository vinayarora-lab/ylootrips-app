import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const API_URL = 'https://trip-backend-65232427280.asia-south1.run.app/api';

interface DestinationDetail {
  destination: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    country: string;
    region: string;
    slug: string;
  };
  overview?: string;
  bestTimeToVisit?: string;
  highlights?: string[];
  galleryImages?: string[];
}

async function getDestination(slug: string): Promise<DestinationDetail | null> {
  try {
    const res = await fetch(`${API_URL}/destinations/${slug}/details`, {
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getDestination(slug);

  if (!detail) {
    const name = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return {
      title: `${name} — India Destination Guide | YlooTrips — India Travel Experts`,
      description: `Discover ${name} with YlooTrips. Expert-curated tours, highlights, best time to visit, and local tips for traveling to ${name}, India.`,
      alternates: { canonical: `https://www.ylootrips.com/destinations/${slug}` },
    };
  }

  const dest = detail.destination;
  const description = detail.overview || dest.description;
  const truncatedDesc =
    description.length > 155
      ? description.slice(0, 152) + '...'
      : description;
  const image =
    (detail.galleryImages && detail.galleryImages[0]) ||
    dest.imageUrl ||
    'https://www.ylootrips.com/og-image.jpg';
  const url = `https://www.ylootrips.com/destinations/${slug}`;

  const bestTime = detail.bestTimeToVisit
    ? ` Best time to visit: ${detail.bestTimeToVisit}.`
    : '';

  return {
    title: `${dest.name} — ${dest.country} Destination Guide`,
    description: `Explore ${dest.name}, ${dest.country} with YlooTrips. ${truncatedDesc}${bestTime}`.slice(0, 160),
    keywords: [
      `${dest.name} tour`,
      `${dest.name} travel guide`,
      `visit ${dest.name}`,
      `${dest.country} destinations`,
      'India tour packages',
      'YlooTrips',
    ].join(', '),
    openGraph: {
      title: `${dest.name}, ${dest.country} — Travel Guide | YlooTrips`,
      description: `Discover ${dest.name} — expert travel guide covering highlights, best time to visit, activities, culture and cuisine.`,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${dest.name}, ${dest.country} — YlooTrips travel guide`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dest.name} Travel Guide | YlooTrips`,
      description: `Discover ${dest.name}, ${dest.country} — highlights, best time to visit, and expert tips.`,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default function DestinationDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
