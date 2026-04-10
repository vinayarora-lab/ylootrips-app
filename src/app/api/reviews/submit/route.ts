import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, country, trip, rating, text } = body;

    if (!name || !email || !country || !trip || !rating || !text) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (text.length > 1000) {
      return NextResponse.json({ error: 'Review too long (max 1000 characters).' }, { status: 400 });
    }

    await connectDB();
    const review = await Review.create({ name, email, phone, country, trip, rating: Number(rating), text });

    // Notify admin
    const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ylootrips.com'}/admin/reviews`;
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: process.env.ADMIN_EMAIL || 'connectylootrips@gmail.com',
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
          <a href="${adminUrl}" style="background:#d97706;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
            Review &amp; Approve →
          </a>
        `,
      });
    } catch { /* email failure is non-fatal */ }

    return NextResponse.json({ success: true, id: review._id });
  } catch (err) {
    console.error('[review/submit]', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
