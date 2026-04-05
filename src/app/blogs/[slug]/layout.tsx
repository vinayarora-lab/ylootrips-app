import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const API_URL = 'https://trip-backend-65232427280.asia-south1.run.app/api';

interface Blog {
  id: number;
  title: string;
  shortDescription: string;
  imageUrl: string;
  slug: string;
  authorName: string;
  publishedDate: string;
  category: string;
  readTime: string;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${API_URL}/blogs/${slug}`, { next: { revalidate: 3600 } });
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
  const blog = await getBlog(slug);

  if (!blog) {
    const name = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return {
      title: `${name} | YlooTrips — India Travel Experts`,
      description: 'Read expert India travel articles and destination guides from the YlooTrips editorial team.',
      alternates: { canonical: `https://www.ylootrips.com/blogs/${slug}` },
    };
  }

  const url = `https://www.ylootrips.com/blogs/${slug}`;
  const image = blog.imageUrl || 'https://www.ylootrips.com/og-image.jpg';
  const description = blog.shortDescription || `Read "${blog.title}" — expert India travel advice from YlooTrips.`;

  return {
    title: blog.title,
    description: description.length > 160 ? description.slice(0, 157) + '...' : description,
    keywords: [
      blog.category,
      'India travel',
      'India travel guide',
      'YlooTrips',
      blog.title,
    ].join(', '),
    openGraph: {
      title: `${blog.title} | YlooTrips`,
      description,
      url,
      type: 'article',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${blog.title} | YlooTrips`,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default function BlogDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
