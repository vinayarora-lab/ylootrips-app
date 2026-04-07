import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.ylootrips.com';
const API_URL = 'https://trip-backend-65232427280.asia-south1.run.app/api';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static pages ──────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/trips`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/destinations`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/destinations/domestic`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/destinations/international`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/events`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/hotels`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blogs`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },

    // International SEO pages
    { url: `${BASE_URL}/india-travel-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.92 },

    // Curated tour itinerary pages
    { url: `${BASE_URL}/tours/golden-triangle-10-day`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tours/kerala-south-india-14-day`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tours/rajasthan-heritage-7-day`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },

    // Blog posts
    { url: `${BASE_URL}/blogs/first-time-india-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${BASE_URL}/blogs/best-time-to-visit-india`, lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${BASE_URL}/blogs/india-vs-thailand`, lastModified: now, changeFrequency: 'monthly', priority: 0.82 },
    { url: `${BASE_URL}/blogs/solo-female-travel-india`, lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${BASE_URL}/blogs/2-week-india-trip-budget`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
  ];

  // ── Dynamic: trip detail pages ────────────────────────────────
  const tripsData = await fetchJson<{ content?: Array<{ id: number }> } | Array<{ id: number }>>('/trips/paginated?page=0&size=200');
  const tripItems: Array<{ id: number }> = Array.isArray(tripsData)
    ? tripsData
    : (tripsData as any)?.content ?? [];

  const tripPages: MetadataRoute.Sitemap = tripItems.map((t) => ({
    url: `${BASE_URL}/trips/${t.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // ── Dynamic: destination pages ────────────────────────────────
  const destinations = await fetchJson<Array<{ slug?: string; id: number }>>('/destinations');
  const destinationPages: MetadataRoute.Sitemap = (destinations ?? []).map((d) => ({
    url: d.slug ? `${BASE_URL}/destinations/${d.slug}` : `${BASE_URL}/destinations/${d.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // ── Dynamic: event pages ──────────────────────────────────────
  const eventsData = await fetchJson<{ content?: Array<{ id: number; slug?: string }> } | Array<{ id: number; slug?: string }>>('/events?page=0&size=100');
  const eventItems: Array<{ id: number; slug?: string }> = Array.isArray(eventsData)
    ? eventsData
    : (eventsData as any)?.content ?? [];

  const eventPages: MetadataRoute.Sitemap = eventItems.map((e) => ({
    url: `${BASE_URL}/events/${e.slug || e.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...tripPages, ...destinationPages, ...eventPages];
}
