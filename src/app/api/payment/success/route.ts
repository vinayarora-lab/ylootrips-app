import { NextRequest, NextResponse } from 'next/server';

// Disable body parsing to handle form-urlencoded data properly
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Easebuzz sends form-urlencoded data via POST
    // Parse the raw body as form data
    const contentType = request.headers.get('content-type') || '';

    let txnid: string | null = null;
    let status: string = 'success';
    let easepayid: string | null = null;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      // Parse form-urlencoded data
      const formData = await request.formData();
      txnid = formData.get('txnid')?.toString() || formData.get('udf1')?.toString() || null;
      status = formData.get('status')?.toString() || 'success';
      easepayid = formData.get('easepayid')?.toString() || null;
    } else {
      // Try to parse as JSON (fallback)
      try {
        const body = await request.json();
        txnid = body.txnid || body.udf1 || null;
        status = body.status || 'success';
        easepayid = body.easepayid || null;
      } catch {
        // If JSON parsing fails, try to get from URL search params
        const url = new URL(request.url);
        txnid = url.searchParams.get('txnid') || url.searchParams.get('udf1');
        status = url.searchParams.get('status') || 'success';
        easepayid = url.searchParams.get('easepayid');
      }
    }

    if (!txnid) {
      return NextResponse.redirect(
        new URL(`/payment/failure?error=Missing transaction ID`, request.url),
        { status: 303 }
      );
    }

    // Redirect to frontend success page with GET parameters
    const baseUrl = request.nextUrl.origin;

    // Direct flight bookings (EASEBUZZ_KEY mode) go to flight success page
    if (txnid.startsWith('FLT-')) {
      const flightSuccessUrl = new URL('/flights/booking-success', baseUrl);
      flightSuccessUrl.searchParams.set('txnid', txnid);
      flightSuccessUrl.searchParams.set('status', status);
      return NextResponse.redirect(flightSuccessUrl, { status: 303 });
    }

    // Hotel bookings go to hotel booking success page
    if (txnid.startsWith('HTL-')) {
      const hotelSuccessUrl = new URL('/hotels/booking-success', baseUrl);
      hotelSuccessUrl.searchParams.set('txnid', txnid);
      hotelSuccessUrl.searchParams.set('status', status);
      if (easepayid) hotelSuccessUrl.searchParams.set('easepayid', easepayid);
      return NextResponse.redirect(hotelSuccessUrl, { status: 303 });
    }

    // Backend-proxied bookings arrive with EVT- prefix — check both hotels and flights
    if (txnid.startsWith('EVT-')) {
      // Check hotel bookings first
      try {
        const lookup = await fetch(`${baseUrl}/api/admin/hotel-bookings?evtRef=${txnid}`);
        if (lookup.ok) {
          const data = await lookup.json();
          if (data.data) {
            const hotelTxnid = (data.data as Record<string, string>).txnid || txnid;
            await fetch(`${baseUrl}/api/admin/hotel-bookings`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ txnid: hotelTxnid, status: 'PAID' }),
            }).catch(() => {});
            const hotelSuccessUrl = new URL('/hotels/booking-success', baseUrl);
            hotelSuccessUrl.searchParams.set('txnid', hotelTxnid);
            hotelSuccessUrl.searchParams.set('status', status);
            if (easepayid) hotelSuccessUrl.searchParams.set('easepayid', easepayid);
            return NextResponse.redirect(hotelSuccessUrl, { status: 303 });
          }
        }
      } catch { /* fall through to flight check */ }

      // Check flight bookings
      try {
        const lookup = await fetch(`${baseUrl}/api/admin/flight-bookings?evtRef=${txnid}`);
        if (lookup.ok) {
          const data = await lookup.json();
          if (data.data) {
            const flightTxnid = (data.data as Record<string, string>).txnid || txnid;
            const flightSuccessUrl = new URL('/flights/booking-success', baseUrl);
            flightSuccessUrl.searchParams.set('txnid', flightTxnid);
            flightSuccessUrl.searchParams.set('status', status);
            await fetch(`${baseUrl}/api/admin/flight-bookings`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ txnid: flightTxnid, status: 'PAID' }),
            }).catch(() => {});
            return NextResponse.redirect(flightSuccessUrl, { status: 303 });
          }
        }
      } catch { /* fall through to regular event success */ }
    }

    const successUrl = new URL(`/payment/success`, baseUrl);
    successUrl.searchParams.set('txnid', txnid);
    successUrl.searchParams.set('status', status);

    // Preserve other important fields as query params
    if (easepayid) {
      successUrl.searchParams.set('easepayid', easepayid);
    }

    return NextResponse.redirect(successUrl, { status: 303 });
  } catch {
    const baseUrl = request.nextUrl.origin;
    return NextResponse.redirect(
      new URL(`/payment/failure?error=Failed to process payment response`, baseUrl),
      { status: 303 }
    );
  }
}

// Also handle GET requests (fallback)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const txnid = searchParams.get('txnid');
  const status = searchParams.get('status') || 'success';

  if (!txnid) {
    return NextResponse.redirect(
      new URL('/payment/failure?error=Missing transaction ID', request.url),
      { status: 303 }
    );
  }

  // Redirect to frontend success page
  const successUrl = new URL('/payment/success', request.url);
  successUrl.searchParams.set('txnid', txnid);
  successUrl.searchParams.set('status', status);

  return NextResponse.redirect(successUrl, { status: 303 });
}
