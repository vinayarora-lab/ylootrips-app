import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, importPKCS8 } from 'jose';

const FILE_NAME = 'booking-notes.json';
const GCS_API = 'https://storage.googleapis.com';

// Build a short-lived Google OAuth2 access token from service account credentials
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

type BookingDetails = { notes: string; flightsPdf?: string; hotelsPdf?: string; itineraryPdf?: string; [k: string]: unknown };

async function readNotes(token: string): Promise<Record<string, BookingDetails>> {
  const bucket = process.env.GCS_BUCKET || '';
  const res = await fetch(
    `${GCS_API}/storage/v1/b/${bucket}/o/${encodeURIComponent(FILE_NAME)}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  );
  if (res.status === 404) return {};
  if (!res.ok) return {};
  const raw = await res.json();
  const result: Record<string, BookingDetails> = {};
  for (const [key, val] of Object.entries(raw)) {
    result[key] = typeof val === 'string' ? { notes: val } : (val as BookingDetails);
  }
  return result;
}

async function writeNotes(token: string, notes: Record<string, BookingDetails>) {
  const bucket = process.env.GCS_BUCKET || '';
  const body = JSON.stringify(notes);
  const res = await fetch(
    `${GCS_API}/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(FILE_NAME)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': String(Buffer.byteLength(body)),
      },
      body,
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GCS write failed: ${err}`);
  }
}

// GET /api/admin/booking-notes?ref=BK-123
export async function GET(req: NextRequest) {
  const token = req.headers.get('x-admin-token') || '';
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const accessToken = await getAccessToken();
    const ref = req.nextUrl.searchParams.get('ref');
    const all = await readNotes(accessToken);
    return NextResponse.json({ details: ref ? (all[ref] ?? null) : all });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}

// POST /api/admin/booking-notes  body: { ref, details }
export async function POST(req: NextRequest) {
  const token = req.headers.get('x-admin-token') || '';
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { ref, details } = await req.json();
    if (!ref) return NextResponse.json({ error: 'Missing ref' }, { status: 400 });
    const accessToken = await getAccessToken();
    const existing = await readNotes(accessToken);
    if (!details) delete existing[ref];
    else existing[ref] = details;
    await writeNotes(accessToken, existing);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}
