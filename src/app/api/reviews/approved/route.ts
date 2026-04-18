import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), '.data', 'reviews.json');

export const dynamic = 'force-dynamic';

interface Review {
  id: string;
  status: string;
  createdAt: string;
}

function readReviews(): Review[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const reviews = readReviews()
      .filter(r => r.status === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error('[reviews/approved]', err);
    return NextResponse.json({ reviews: [] });
  }
}
