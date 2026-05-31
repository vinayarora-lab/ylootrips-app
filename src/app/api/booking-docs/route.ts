import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, importPKCS8 } from 'jose';

const GCS_API = 'https://storage.googleapis.com';
const NOTES_FILE = 'booking-notes.json';
const PDF_FIELD: Record<string, string> = { flights: 'flightsPdf', hotels: 'hotelsPdf', itinerary: 'itineraryPdf' };
const PDF_LABEL: Record<string, string> = { flights: 'Flight-Tickets', hotels: 'Hotel-Voucher', itinerary: 'Itinerary' };

async function getAccessToken(): Promise<{ token: string; bucket: string }> {
  const raw = process.env.GCS_CREDENTIALS || '';
  if (!raw) throw new Error('Not configured');
  const bucket = process.env.GCS_BUCKET || '';
  if (!bucket) throw new Error('Not configured');
  const creds = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
  const now = Math.floor(Date.now() / 1000);
  const privateKey = await importPKCS8(creds.private_key, 'RS256');
  const jwt = await new SignJWT({ scope: 'https://www.googleapis.com/auth/devstorage.read_write' })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt(now)
    .setIssuer(creds.client_email)
    .setAudience('https://oauth2.googleapis.com/token')
    .setExpirationTime(now + 3600)
    .sign(privateKey);
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) throw new Error('Token fetch failed');
  return { token: tokenData.access_token, bucket };
}

// GET /api/booking-docs?ref=X&type=flights — proxies PDF for client download
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref');
  const docType = req.nextUrl.searchParams.get('type');
  if (!ref || !docType || !PDF_FIELD[docType]) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }
  try {
    const { token, bucket } = await getAccessToken();

    // Read booking-notes.json to get the PDF object path
    const notesRes = await fetch(
      `${GCS_API}/storage/v1/b/${bucket}/o/${encodeURIComponent(NOTES_FILE)}?alt=media`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
    );
    if (!notesRes.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const all = await notesRes.json();
    const details = all[ref];
    if (!details) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const objectPath: string = details[PDF_FIELD[docType]];
    if (!objectPath) return NextResponse.json({ error: 'Document not available yet' }, { status: 404 });

    // Fetch the PDF from GCS and proxy it
    const pdfRes = await fetch(
      `${GCS_API}/storage/v1/b/${bucket}/o/${encodeURIComponent(objectPath)}?alt=media`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!pdfRes.ok) return NextResponse.json({ error: 'File not found' }, { status: 404 });

    const filename = `${PDF_LABEL[docType] || docType}-${ref}.pdf`;
    return new NextResponse(pdfRes.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Error fetching document' }, { status: 500 });
  }
}
