import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, importPKCS8 } from 'jose';

const FILE_NAME = 'booking-notes.json';
const GCS_API = 'https://storage.googleapis.com';

async function getAccessToken(): Promise<string> {
  const raw = process.env.GCS_CREDENTIALS || '';
  if (!raw) throw new Error('GCS_CREDENTIALS not set');
  const creds = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
  const now = Math.floor(Date.now() / 1000);
  const privateKey = await importPKCS8(creds.private_key, 'RS256');
  const jwt = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/devstorage.read_write',
  })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt(now)
    .setIssuer(creds.client_email)
    .setAudience('https://oauth2.googleapis.com/token')
    .setExpirationTime(now + 3600)
    .sign(privateKey);

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) throw new Error(tokenData.error_description || 'Token fetch failed');
  return tokenData.access_token;
}

// GET /api/booking-notes?ref=BK-123 — public, used by clients on /my-booking
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref');
  if (!ref) return NextResponse.json({ details: null });
  try {
    const bucket = process.env.GCS_BUCKET || '';
    if (!bucket) return NextResponse.json({ details: null });
    const accessToken = await getAccessToken();
    const res = await fetch(
      `${GCS_API}/storage/v1/b/${bucket}/o/${encodeURIComponent(FILE_NAME)}?alt=media`,
      { headers: { Authorization: `Bearer ${accessToken}` }, cache: 'no-store' }
    );
    if (!res.ok) return NextResponse.json({ details: null });
    const all: Record<string, unknown> = await res.json();
    const val = all[ref] ?? null;
    // Migrate old string format
    if (typeof val === 'string') {
      return NextResponse.json({ details: { notes: val, flights: [], hotels: [], itinerary: [] } });
    }
    return NextResponse.json({ details: val });
  } catch {
    return NextResponse.json({ details: null });
  }
}
