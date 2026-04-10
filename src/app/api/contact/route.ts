import { NextRequest, NextResponse } from 'next/server';
import { generateTicket, logLeadToSheet } from '@/lib/leads';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'connectylootrips@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, destination, travelers, preferredDates, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const ticket = generateTicket();

    const adminBody = `
NEW CONTACT INQUIRY
===================
TICKET: ${ticket}

CUSTOMER DETAILS
Name:        ${name}
Email:       ${email}
Phone:       ${phone || 'Not provided'}
Destination: ${destination || 'Not specified'}
Travelers:   ${travelers || 'Not specified'}
Dates:       ${preferredDates || 'Flexible'}

MESSAGE:
${message || '(no message)'}

—
YlooTrips Automated Notification
    `.trim();

    const customerBody = `
Hi ${name},

Thank you for reaching out to YlooTrips!

We've received your inquiry and our travel expert will contact you within 24 hours.

YOUR SUPPORT TICKET
Ticket No: ${ticket}
Please quote this number in all communications with us.

INQUIRY SUMMARY
Destination: ${destination || 'To be discussed'}
Travelers:   ${travelers || 'To be discussed'}
Dates:       ${preferredDates || 'Flexible'}

We look forward to planning your perfect trip!

📱 WhatsApp: +91 84278 31127
📧 Email: connectylootrips@gmail.com

Best regards,
YlooTrips Team
    `.trim();

    // Send emails via Resend
    if (RESEND_API_KEY) {
      await Promise.allSettled([
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'YlooTrips <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject: `[${ticket}] New Inquiry: ${destination || 'General'} — ${name}`,
            text: adminBody,
          }),
        }),
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'YlooTrips <onboarding@resend.dev>',
            to: [email],
            subject: `[${ticket}] We received your inquiry — YlooTrips`,
            text: customerBody,
          }),
        }),
      ]);
    }

    // Log to Google Sheet
    await logLeadToSheet({
      ticket,
      type: 'Contact Form',
      name,
      email,
      phone: phone || '',
      destination: destination || '',
      guests: travelers || '',
      notes: `Dates: ${preferredDates || 'Flexible'} | Msg: ${(message || '').slice(0, 100)}`,
    });

    // Forward to backend
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || '';
      if (backendUrl) {
        await fetch(`${backendUrl}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name, email, phone,
            destination,
            message: `[${ticket}] ${message || ''}`,
          }),
        });
      }
    } catch { /* non-fatal */ }

    return NextResponse.json({ success: true, ticket, message: "Thank you! We'll get back to you within 24 hours." });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
