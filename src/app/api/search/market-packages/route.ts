import { NextRequest, NextResponse } from 'next/server';

const SERPAPI_KEY = process.env.SERPAPI_KEY || '';
const MARKUP = 1.10; // 10% above market

export interface MarketPackage {
  title: string;
  url: string;
  snippet: string;
  source: string;
  marketPrice: number | null;
  ourPrice: number | null;
  priceDiff: number | null;
  destination: string;
}

function extractPrice(text: string): number | null {
  // Match Indian price patterns: ₹6,999 or Rs. 6999 or 6,999/-
  const patterns = [
    /₹\s*([\d,]+)/,
    /Rs\.?\s*([\d,]+)/i,
    /([\d,]+)\s*\/-/,
    /starting\s+(?:from\s+)?(?:₹|Rs\.?)\s*([\d,]+)/i,
    /price[:\s]+(?:₹|Rs\.?)\s*([\d,]+)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const n = parseInt(m[1].replace(/,/g, ''), 10);
      if (n > 500 && n < 500000) return n;
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const destination = req.nextUrl.searchParams.get('destination') || '';
  if (!destination) return NextResponse.json({ data: [], destination: '' });

  if (!SERPAPI_KEY) {
    return NextResponse.json({ data: [], destination, error: 'Search not configured' });
  }

  try {
    // Search BanBanjara for packages matching destination
    const query = `site:banbanjara.com ${destination} tour package price`;
    const params = new URLSearchParams({
      engine: 'google',
      q: query,
      api_key: SERPAPI_KEY,
      num: '6',
      gl: 'in',
      hl: 'en',
    });

    const res = await fetch(`https://serpapi.com/search.json?${params}`);
    if (!res.ok) throw new Error('SerpAPI error');
    const data = await res.json();

    const raw = (data.organic_results || []) as {
      title?: string;
      link?: string;
      snippet?: string;
    }[];

    const packages: MarketPackage[] = raw.slice(0, 5).map((r) => {
      const combined = `${r.title || ''} ${r.snippet || ''}`;
      const marketPrice = extractPrice(combined);
      const ourPrice = marketPrice ? Math.round(marketPrice * MARKUP) : null;
      const priceDiff = marketPrice && ourPrice ? ourPrice - marketPrice : null;

      return {
        title: r.title || `${destination} Tour Package`,
        url: r.link || `https://banbanjara.com`,
        snippet: r.snippet || '',
        source: 'BanBanjara.com',
        marketPrice,
        ourPrice,
        priceDiff,
        destination,
      };
    });

    return NextResponse.json({ data: packages, destination });
  } catch (err) {
    console.error('Market package search error:', err);
    return NextResponse.json({ data: [], destination, error: 'Search failed' });
  }
}
