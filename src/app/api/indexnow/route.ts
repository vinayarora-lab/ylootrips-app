/**
 * IndexNow — submits all YlooTrips URLs to Bing, Yandex, Google (via IndexNow protocol)
 * Triggers immediate crawling of new/updated pages
 *
 * Call: GET /api/indexnow  (also auto-called on deploy)
 */

import { NextResponse } from 'next/server';

const HOST = 'https://www.ylootrips.com';
const KEY = 'fcbdc72ba8354feb90a430b55ea69636';
const KEY_LOCATION = `${HOST}/${KEY}.txt`;

// All important pages to submit
const URLS = [
  // Core pages
  `${HOST}/`,
  `${HOST}/trips`,
  `${HOST}/destinations`,
  `${HOST}/blogs`,
  `${HOST}/about`,
  `${HOST}/contact`,
  `${HOST}/events`,

  // Package landing pages (high-value SEO)
  `${HOST}/dubai-tour-package-from-delhi`,
  `${HOST}/bali-honeymoon-package`,
  `${HOST}/thailand-budget-trip`,
  `${HOST}/maldives-luxury-package`,
  `${HOST}/singapore-tour-package`,
  `${HOST}/kashmir-tour-package`,
  `${HOST}/manali-tour-package`,
  `${HOST}/goa-tour-package`,
  `${HOST}/kerala-tour-package`,

  // Blog posts
  `${HOST}/blogs/best-time-to-visit-bali`,
  `${HOST}/blogs/dubai-trip-cost-from-india`,
  `${HOST}/blogs/thailand-itinerary-5-days`,
  `${HOST}/blogs/india-travel-guide`,
];

const ENGINES = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

export async function GET() {
  const results: Record<string, number> = {};

  const body = {
    host: 'www.ylootrips.com',
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS,
  };

  await Promise.allSettled(
    ENGINES.map(async (engine) => {
      try {
        const res = await fetch(engine, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(body),
        });
        results[engine] = res.status;
      } catch {
        results[engine] = 0;
      }
    })
  );

  return NextResponse.json({
    submitted: URLS.length,
    urls: URLS,
    engines: results,
    timestamp: new Date().toISOString(),
  });
}
