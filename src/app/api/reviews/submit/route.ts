import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

const DATA_FILE = path.join(process.cwd(), '.data', 'reviews.json');
const getResend = () => new Resend(process.env.RESEND_API_KEY ?? "");

interface Review {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  trip: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  avatarUrl?: string;
  tripPhotoUrl?: string;
  createdAt: string;
}

function readReviews(): Review[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeReviews(reviews: Review[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, country, trip, rating, text, avatarUrl, tripPhotoUrl } = body;

    if (!name || !email || !country || !trip || !rating || !text) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (text.length > 1000) {
      return NextResponse.json({ error: 'Review too long (max 1000 characters).' }, { status: 400 });
    }

    const MAX_B64 = 1_500_000;
    const safeAvatar = avatarUrl && avatarUrl.length <= MAX_B64 ? avatarUrl : undefined;
    const safeTripPhoto = tripPhotoUrl && tripPhotoUrl.length <= MAX_B64 ? tripPhotoUrl : undefined;

    const review: Review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name, email, phone, country, trip,
      rating: Number(rating),
      text,
      status: 'pending',
      ...(safeAvatar ? { avatarUrl: safeAvatar } : {}),
      ...(safeTripPhoto ? { tripPhotoUrl: safeTripPhoto } : {}),
      createdAt: new Date().toISOString(),
    };

    const reviews = readReviews();
    reviews.unshift(review);
    writeReviews(reviews);

    // Notify admin
    const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ylootrips.com'}/admin/reviews`;
    try {
      await getResend().emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: process.env.ADMIN_EMAIL || 'hello@ylootrips.com',
        subject: `⭐ New Review Pending Approval — ${name} (${rating}/5)`,
        html: `
          <h2>New client review submitted</h2>
          <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
            <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><strong>${name}</strong></td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td>${email}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Phone</td><td>${phone || '—'}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Country</td><td>${country}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Trip</td><td>${trip}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Rating</td><td>${'★'.repeat(Number(rating))} (${rating}/5)</td></tr>
          </table>
          <p style="background:#f5f5f5;padding:12px;border-radius:8px;margin:16px 0;">"${text}"</p>
          <a href="${adminUrl}" style="background:#1c1c1c;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
            Review &amp; Approve →
          </a>
        `,
      });
    } catch { /* email failure is non-fatal */ }

    return NextResponse.json({ success: true, id: review.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[review/submit]', msg);
    return NextResponse.json({ error: 'Failed to submit review. Please try again.' }, { status: 500 });
  }
}
