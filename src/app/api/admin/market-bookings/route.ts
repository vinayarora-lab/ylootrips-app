import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), '.data', 'market-bookings.json');

async function readStore(): Promise<Record<string, unknown>> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeStore(data: Record<string, unknown>) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET(req: NextRequest) {
  const txnid = req.nextUrl.searchParams.get('txnid');
  const evtRef = req.nextUrl.searchParams.get('evtRef');
  const store = await readStore();

  if (evtRef) {
    const entry = Object.values(store).find(
      (b) => (b as Record<string, string>).evtRef === evtRef
    );
    return NextResponse.json({ data: entry || null });
  }
  if (txnid) return NextResponse.json({ data: store[txnid] || null });
  return NextResponse.json({ data: store });
}

export async function POST(req: NextRequest) {
  const booking = await req.json();
  const store = await readStore();
  store[booking.txnid] = booking;
  await writeStore(store);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const { txnid, evtRef, status } = await req.json();
  const store = await readStore();
  if (store[txnid]) {
    const existing = store[txnid] as Record<string, unknown>;
    if (evtRef) existing.evtRef = evtRef;
    if (status) existing.status = status;
    await writeStore(store);
  }
  return NextResponse.json({ success: true });
}
