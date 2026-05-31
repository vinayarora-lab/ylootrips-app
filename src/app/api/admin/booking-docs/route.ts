import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, importPKCS8 } from 'jose';

const GCS_API = 'https://storage.googleapis.com';
const NOTES_FILE = 'booking-notes.json';
type PdfType = 'flights' | 'hotels' | 'itinerary';
type BookingDetails = { notes: string; flightsPdf?: string; hotelsPdf?: string; itineraryPdf?: string; [k: string]: unknown };
const PDF_FIELD: Record<PdfType, string> = { flights: 'flightsPdf', hotels: 'hotelsPdf', itinerary: 'itineraryPdf' };

async function getAccessToken(): Promise<{ token: string; bucket: string }> {
  const raw = process.env.GCS_CREDENTIALS || '';
  if (!raw) throw new Error('GCS_CREDENTIALS not set');
  const bucket = process.env.GCS_BUCKET || '';
  if (!bucket) throw new Error('GCS_BUCKET not set');
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
  if (!tokenRes.ok) throw new Error(tokenData.error_description || 'Token fetch failed');
  return { token: tokenData.access_token, bucket };
}

async function readAll(token: string, bucket: string): Promise<Record<string, BookingDetails>> {
  const res = await fetch(
    `${GCS_API}/storage/v1/b/${bucket}/o/${encodeURIComponent(NOTES_FILE)}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  );
  if (res.status === 404 || !res.ok) return {};
  const raw = await res.json();
  const result: Record<string, BookingDetails> = {};
  for (const [k, v] of Object.entries(raw)) {
    result[k] = typeof v === 'string' ? { notes: v } : (v as BookingDetails);
  }
  return result;
}

async function writeAll(token: string, bucket: string, data: Record<string, BookingDetails>) {
  const body = JSON.stringify(data);
  const res = await fetch(
    `${GCS_API}/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(NOTES_FILE)}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': String(Buffer.byteLength(body)) },
      body,
    }
  );
  if (!res.ok) throw new Error(`GCS write failed: ${await res.text()}`);
}

// POST: upload a PDF (multipart form: ref, type, file)
export async function POST(req: NextRequest) {
  const adminToken = req.headers.get('x-admin-token') || '';
  if (!adminToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const form = await req.formData();
    const ref = form.get('ref') as string;
    const docType = form.get('type') as PdfType;
    const file = form.get('file') as File | null;
    if (!ref || !docType || !file) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    if (!PDF_FIELD[docType]) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    const { token, bucket } = await getAccessToken();
    const objectName = `booking-pdfs/${ref}/${docType}.pdf`;
    const fileBuffer = await file.arrayBuffer();

    // Upload PDF
    const upRes = await fetch(
      `${GCS_API}/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(objectName)}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/pdf' },
        body: fileBuffer,
      }
    );
    if (!upRes.ok) throw new Error(`Upload failed: ${await upRes.text()}`);

    // Save path in booking-notes.json
    const all = await readAll(token, bucket);
    if (!all[ref]) all[ref] = { notes: '' };
    all[ref][PDF_FIELD[docType]] = objectName;
    await writeAll(token, bucket, all);

    return NextResponse.json({ ok: true, path: objectName });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}

// DELETE: remove a PDF (?ref=X&type=flights)
export async function DELETE(req: NextRequest) {
  const adminToken = req.headers.get('x-admin-token') || '';
  if (!adminToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ref = req.nextUrl.searchParams.get('ref') || '';
  const docType = req.nextUrl.searchParams.get('type') as PdfType;
  if (!ref || !PDF_FIELD[docType]) return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  try {
    const { token, bucket } = await getAccessToken();
    const objectName = `booking-pdfs/${ref}/${docType}.pdf`;
    // Delete file (ignore 404)
    await fetch(
      `${GCS_API}/storage/v1/b/${bucket}/o/${encodeURIComponent(objectName)}`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
    );
    // Remove reference from booking-notes.json
    const all = await readAll(token, bucket);
    if (all[ref]) {
      delete all[ref][PDF_FIELD[docType]];
      await writeAll(token, bucket, all);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
