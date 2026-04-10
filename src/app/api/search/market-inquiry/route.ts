import { NextRequest, NextResponse } from 'next/server';
import { generateTicket, logLeadToSheet } from '@/lib/leads';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'connectylootrips@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone,
      package: packageName,
      destination,
      sourceUrl,
      marketPrice,
      ourPrice,
      priceDiff,
      guests,
    } = body;

    if (!name || !email || !phone || !destination) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ticket = generateTicket();
    const subject = `🏔️ [${ticket}] Market Package Inquiry: ${packageName || destination} — ${name}`;

    const adminBody = `
NEW MARKET PACKAGE INQUIRY
==========================
TICKET: ${ticket}

CUSTOMER DETAILS
Name:    ${name}
Email:   ${email}
Phone:   ${phone}
Guests:  ${guests || 'Not specified'}

PACKAGE DETAILS
Package:     ${packageName || destination}
Destination: ${destination}

PRICING
Market Price (source): ${marketPrice ? `₹${Number(marketPrice).toLocaleString('en-IN')}` : 'Not available'}
Our Price (market+10%): ${ourPrice ? `₹${Number(ourPrice).toLocaleString('en-IN')}` : 'Not available'}
Our Margin:            ${priceDiff ? `₹${Number(priceDiff).toLocaleString('en-IN')}` : 'N/A'}

⚡ SOURCE TO BOOK FROM:
${sourceUrl || 'N/A'}

ACTION REQUIRED:
1. Book from the source link above at market price (₹${marketPrice ? Number(marketPrice).toLocaleString('en-IN') : '?'})
2. Charge customer our price (₹${ourPrice ? Number(ourPrice).toLocaleString('en-IN') : '?'})
3. Margin earned: ₹${priceDiff ? Number(priceDiff).toLocaleString('en-IN') : '?'}
4. Contact customer within 1 hour

—
YlooTrips Automated Notification
    `.trim();

    const customerBody = `
Hi ${name},

Thank you for your interest in the ${packageName || destination} trip!

We've received your inquiry and our travel expert will contact you within 1 hour with availability, payment options, and your personalised itinerary.

YOUR SUPPORT TICKET
Ticket No: ${ticket}
Please quote this number in all communications with us.

INQUIRY SUMMARY
Package:    ${packageName || destination}
Guests:     ${guests || 'Not specified'}
Our Price:  ${ourPrice ? `₹${Number(ourPrice).toLocaleString('en-IN')} per person` : 'Quote pending'}

We'll be in touch shortly. You can also reach us on:
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
            subject,
            text: adminBody,
          }),
        }),
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'YlooTrips <onboarding@resend.dev>',
            to: [email],
            subject: `[${ticket}] Your trip inquiry for ${destination} — YlooTrips`,
            text: customerBody,
          }),
        }),
      ]);
    }

    // Log to Google Sheet
    await logLeadToSheet({
      ticket,
      type: 'Market Inquiry',
      name,
      email,
      phone,
      destination,
      packageName: packageName || destination,
      price: ourPrice ? `₹${Number(ourPrice).toLocaleString('en-IN')}` : '',
      guests: guests || '',
      notes: `Source: ${sourceUrl || 'N/A'} | Market: ₹${marketPrice || '?'} | Margin: ₹${priceDiff || '?'}`,
    });

    // Forward to backend contact API
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || '';
      if (backendUrl) {
        await fetch(`${backendUrl}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name, email, phone,
            destination: packageName || destination,
            message: `[${ticket}] Market package inquiry for ${destination}. Source: ${sourceUrl}. Market price: ₹${marketPrice}. Our price: ₹${ourPrice}.`,
          }),
        });
      }
    } catch { /* non-fatal */ }

    return NextResponse.json({ success: true, ticket });
  } catch (err) {
    console.error('Market inquiry error:', err);
    return NextResponse.json({ error: 'Failed to send inquiry' }, { status: 500 });
  }
}
