import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY || '';
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT || '';
const EASEBUZZ_ENV = process.env.EASEBUZZ_ENV || 'test';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trip-backend-65232427280.asia-south1.run.app/api';
// Reuse the same backend event proxy as flights (price = ₹1/unit, numberOfTickets = total amount)
const HOTEL_EVENT_ID = process.env.HOTEL_EVENT_ID
  ? Number(process.env.HOTEL_EVENT_ID)
  : process.env.FLIGHT_EVENT_ID
  ? Number(process.env.FLIGHT_EVENT_ID)
  : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hotel, guest, checkIn, checkOut, rooms, adults, nights } = body;

    if (!hotel || !guest?.name || !guest?.email || !guest?.phone) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    if (!hotel.totalPrice || hotel.totalPrice <= 0) {
      return NextResponse.json(
        { error: 'Hotel price unavailable. Please search again.' },
        { status: 400 }
      );
    }

    const txnid = `HTL-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const firstname = guest.name.split(' ')[0] || 'Guest';
    const email = guest.email;
    const rawPhone = guest.phone.replace(/\D/g, '');
    const phone = rawPhone.length >= 10 ? rawPhone.slice(-10) : rawPhone.padStart(10, '0');
    const totalPayable = Math.round(hotel.totalPrice);

    const bookingSummary = {
      txnid,
      createdAt: new Date().toISOString(),
      hotel,
      guest,
      checkIn,
      checkOut,
      rooms,
      adults,
      nights,
      status: 'PENDING',
    };

    // Persist booking (non-fatal)
    try {
      await fetch(`${SITE_URL}/api/admin/hotel-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingSummary),
      });
    } catch { /* non-fatal */ }

    // ── Option 1: Backend event proxy (same pattern as flights) ──────────────
    if (HOTEL_EVENT_ID) {
      try {
        const specialRequests = JSON.stringify({ txnid, hotel, guest, checkIn, checkOut, rooms, adults, nights });

        const createRes = await fetch(`${BACKEND_URL}/event-bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: HOTEL_EVENT_ID,
            customerName: guest.name,
            customerEmail: email,
            customerPhone: phone || guest.phone,
            eventDate: checkIn,
            paymentMethod: 'upi',
            numberOfTickets: totalPayable, // ₹1/unit → charges correct amount
            specialRequests,
          }),
        });

        if (!createRes.ok) {
          const errBody = await createRes.text().catch(() => '');
          console.error('Hotel proxy: event booking failed', createRes.status, errBody);
          return NextResponse.json(
            { error: 'Payment gateway unavailable. Please try again.' },
            { status: 502 }
          );
        }

        const createData = await createRes.json();
        const ref = createData.bookingReference; // EVT-XXXXXXXX
        if (!ref) {
          console.error('Hotel proxy: no bookingReference', createData);
          return NextResponse.json({ error: 'Booking creation failed. Please try again.' }, { status: 502 });
        }

        // Save EVT ref → HTL txnid mapping so success handler redirects to hotel page
        try {
          await fetch(`${SITE_URL}/api/admin/hotel-bookings`, {
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
          console.error('Hotel proxy: payment initiation failed', payRes.status);
          return NextResponse.json({ error: 'Could not initiate payment. Please try again.' }, { status: 502 });
        }

        const payData = await payRes.json();
        if (payData.paymentUrl) {
          return NextResponse.json({ paymentUrl: payData.paymentUrl, txnid, evtRef: ref });
        }
        return NextResponse.json(
          { error: payData.error || 'No payment URL received from gateway.' },
          { status: 502 }
        );
      } catch (err) {
        console.error('Hotel proxy: unexpected error', err);
        return NextResponse.json({ error: 'Payment gateway error. Please try again.' }, { status: 500 });
      }
    }

    // ── Option 2: Direct Easebuzz keys ────────────────────────────────────────
    if (EASEBUZZ_KEY && EASEBUZZ_SALT) {
      const amount = String(totalPayable.toFixed(2));
      const productinfo = `Hotel: ${hotel.name} | ${checkIn} to ${checkOut} | ${rooms} room(s)`;
      const udf1 = txnid;
      const udf2 = email;
      const hashStr = [
        EASEBUZZ_KEY, txnid, amount, productinfo, firstname, email,
        udf1, udf2, '', '', '',
        '', '', '', '', '',
        EASEBUZZ_SALT,
      ].join('|');
      const hash = crypto.createHash('sha512').update(hashStr).digest('hex');

      const payUrl = EASEBUZZ_ENV === 'production'
        ? 'https://pay.easebuzz.in/payment/initiateLink'
        : 'https://testpay.easebuzz.in/payment/initiateLink';

      const formData = new URLSearchParams({
        key: EASEBUZZ_KEY, txnid, amount, productinfo, firstname, email,
        phone: phone || '9999999999', udf1, udf2,
        udf3: '', udf4: '', udf5: '', hash,
        surl: `${SITE_URL}/api/payment/success`,
        furl: `${SITE_URL}/api/payment/failure`,
      });

      const ebRes = await fetch(payUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });
      const ebJson = await ebRes.json();

      if (ebJson.status === 1 && ebJson.data) {
        const redirectBase = EASEBUZZ_ENV === 'production'
          ? 'https://pay.easebuzz.in'
          : 'https://testpay.easebuzz.in';
        return NextResponse.json({ paymentUrl: `${redirectBase}/pay/${ebJson.data}`, txnid });
      }

      return NextResponse.json(
        { error: ebJson.error_desc || ebJson.message || 'Payment gateway error' },
        { status: 502 }
      );
    }

    // ── Option 3: WhatsApp fallback ───────────────────────────────────────────
    const msg = encodeURIComponent(
      `🏨 New Hotel Booking Request!\n\nHotel: ${hotel.name}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nRooms: ${rooms} | Adults: ${adults}\n\nGuest: ${guest.name}\nEmail: ${email}\nPhone: ${guest.phone}\n\nTotal: ₹${totalPayable.toLocaleString('en-IN')}\nRef: ${txnid}\n\nPlease send payment link.`
    );
    return NextResponse.json({
      paymentUrl: `https://wa.me/918427831127?text=${msg}`,
      txnid,
      fallback: true,
    });
  } catch (err) {
    console.error('Hotel payment initiation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
