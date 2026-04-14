import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY || '';
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT || '';
const EASEBUZZ_ENV = process.env.EASEBUZZ_ENV || 'production';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ylootrips.com';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trip-backend-65232427280.asia-south1.run.app/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingReference, chargeNow, totalAmount, customerName, customerEmail, customerPhone, tripTitle } = body;

    if (!bookingReference || !chargeNow || chargeNow <= 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const amount = String(Number(chargeNow).toFixed(2));
    const txnid = `TRP-${bookingReference}-${Date.now()}`;
    const firstname = (customerName || 'Traveler').split(' ')[0];
    const email = customerEmail || 'traveler@ylootrips.com';
    const rawPhone = (customerPhone || '').replace(/\D/g, '');
    const phone = rawPhone.length >= 10 ? rawPhone.slice(-10) : (rawPhone || '9999999999').padStart(10, '0');
    const productinfo = tripTitle
      ? `${tripTitle.substring(0, 100)} (Advance)`
      : `Trip Advance Payment - ${bookingReference}`;

    // ── Direct Easebuzz with partial amount ───────────────────────────────────
    if (EASEBUZZ_KEY && EASEBUZZ_SALT) {
      const udf1 = bookingReference;
      const udf2 = String(totalAmount || chargeNow); // store total for reference
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
        key: EASEBUZZ_KEY,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        phone,
        udf1,
        udf2,
        udf3: '',
        udf4: '',
        udf5: '',
        hash,
        surl: `${SITE_URL}/payment/success?ref=${bookingReference}`,
        furl: `${SITE_URL}/payment/failure?ref=${bookingReference}`,
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
        return NextResponse.json({
          paymentUrl: `${redirectBase}/pay/${ebJson.data}`,
          txnid,
          isPartial: true,
          chargeNow,
          totalAmount,
        });
      }

      console.error('Easebuzz partial payment error:', ebJson);
      return NextResponse.json(
        { error: ebJson.error_desc || ebJson.message || 'Payment gateway error' },
        { status: 502 }
      );
    }

    // ── Fallback: forward to external backend with amount override ────────────
    // The external backend's /payment/initiate/:ref now receives { pg: '', amount: chargeNow }
    // If it still charges full price, add EASEBUZZ_KEY + EASEBUZZ_SALT to Vercel env vars
    const backendRes = await fetch(`${BACKEND_URL}/payment/initiate/${bookingReference}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pg: '', amount: chargeNow }),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text().catch(() => '');
      console.error('Backend partial payment failed:', backendRes.status, errText);
      return NextResponse.json(
        { error: 'Could not initiate partial payment. Please contact support.' },
        { status: 502 }
      );
    }

    const backendData = await backendRes.json();
    return NextResponse.json({
      ...backendData,
      isPartial: true,
      chargeNow,
      totalAmount,
    });
  } catch (err) {
    console.error('Partial payment initiation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
