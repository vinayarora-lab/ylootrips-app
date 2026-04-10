import { NextRequest, NextResponse } from 'next/server';
import { generateTicket, logLeadToSheet } from '@/lib/leads';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trip-backend-65232427280.asia-south1.run.app/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'connectylootrips@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const MARKET_EVENT_ID = process.env.HOTEL_EVENT_ID
  ? Number(process.env.HOTEL_EVENT_ID)
  : process.env.FLIGHT_EVENT_ID
  ? Number(process.env.FLIGHT_EVENT_ID)
  : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, packageTitle, destination, sourceUrl, ourPrice, marketPrice, priceDiff, guests } = body;

    if (!name || !email || !phone || !ourPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const totalPayable = Math.round(Number(ourPrice));
    if (totalPayable <= 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    const txnid = `MKT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const ticket = generateTicket();
    const rawPhone = phone.replace(/\D/g, '');
    const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : rawPhone.padStart(10, '0');

    // Store booking
    const bookingSummary = {
      txnid, ticket,
      createdAt: new Date().toISOString(),
      packageTitle, destination, sourceUrl,
      ourPrice: totalPayable, marketPrice, priceDiff,
      guest: { name, email, phone },
      guests,
      status: 'PENDING',
    };

    try {
      await fetch(`${SITE_URL}/api/admin/market-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingSummary),
      });
    } catch { /* non-fatal */ }

    // Log to Google Sheet
    await logLeadToSheet({
      ticket,
      type: 'Market Inquiry',
      name, email, phone,
      destination,
      packageName: packageTitle,
      price: `₹${totalPayable.toLocaleString('en-IN')}`,
      guests: guests || '',
      notes: `PAYMENT INITIATED | Source: ${sourceUrl || 'N/A'} | Market: ₹${marketPrice || '?'} | Margin: ₹${priceDiff || '?'}`,
    });

    // Admin notification email
    if (RESEND_API_KEY) {
      const adminBody = `
NEW MARKET TRIP BOOKING — PAYMENT INITIATED
===========================================
TICKET: ${ticket}
TXN ID: ${txnid}

CUSTOMER
Name:    ${name}
Email:   ${email}
Phone:   ${phone}
Guests:  ${guests || 'Not specified'}

PACKAGE
Title:       ${packageTitle}
Destination: ${destination}

PRICING
Market Price:   ₹${Number(marketPrice || 0).toLocaleString('en-IN')}
Our Price:      ₹${totalPayable.toLocaleString('en-IN')}
Margin:         ₹${Number(priceDiff || 0).toLocaleString('en-IN')}

⚡ SOURCE TO BOOK FROM:
${sourceUrl || 'N/A'}

ACTION: Book from source above after payment confirms.
      `.trim();

      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'YlooTrips <onboarding@resend.dev>',
          to: [ADMIN_EMAIL],
          subject: `[${ticket}] 💳 Market Booking Payment: ${packageTitle} — ${name}`,
          text: adminBody,
        }),
      }).catch(() => {});
    }

    // ── Easebuzz via backend event proxy ─────────────────────────────────────
    if (MARKET_EVENT_ID) {
      try {
        const specialRequests = JSON.stringify({ txnid, ticket, packageTitle, destination, sourceUrl, guest: { name, email, phone }, guests });

        const createRes = await fetch(`${BACKEND_URL}/event-bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: MARKET_EVENT_ID,
            customerName: name,
            customerEmail: email,
            customerPhone: cleanPhone,
            eventDate: new Date().toISOString().slice(0, 10),
            paymentMethod: 'upi',
            numberOfTickets: totalPayable,
            specialRequests,
          }),
        });

        if (!createRes.ok) {
          const errTxt = await createRes.text().catch(() => '');
          console.error('Market book: event booking failed', createRes.status, errTxt);
          return NextResponse.json({ error: 'Payment gateway unavailable. Please try again.' }, { status: 502 });
        }

        const createData = await createRes.json();
        const ref = createData.bookingReference;
        if (!ref) {
          return NextResponse.json({ error: 'Booking creation failed. Please try again.' }, { status: 502 });
        }

        // Save EVT ref → MKT txnid mapping
        try {
          await fetch(`${SITE_URL}/api/admin/market-bookings`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ txnid, evtRef: ref }),
          });
        } catch { /* non-fatal */ }

        const payRes = await fetch(`${BACKEND_URL}/payment/event/initiate/${ref}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!payRes.ok) {
          return NextResponse.json({ error: 'Could not initiate payment. Please try again.' }, { status: 502 });
        }

        const payData = await payRes.json();
        if (payData.paymentUrl) {
          return NextResponse.json({ paymentUrl: payData.paymentUrl, txnid, ticket });
        }
        return NextResponse.json({ error: payData.error || 'No payment URL received.' }, { status: 502 });
      } catch (err) {
        console.error('Market book: proxy error', err);
        return NextResponse.json({ error: 'Payment gateway error. Please try again.' }, { status: 500 });
      }
    }

    // WhatsApp fallback
    const waMsg = encodeURIComponent(
      `🌍 New Market Trip Booking!\n\nPackage: ${packageTitle}\nDestination: ${destination}\n\nGuest: ${name}\nEmail: ${email}\nPhone: ${phone}\nGuests: ${guests || 'N/A'}\n\nAmount: ₹${totalPayable.toLocaleString('en-IN')}\nTicket: ${ticket}\nSource: ${sourceUrl || 'N/A'}`
    );
    return NextResponse.json({
      paymentUrl: `https://wa.me/918427831127?text=${waMsg}`,
      txnid, ticket, fallback: true,
    });
  } catch (err) {
    console.error('Market book error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
