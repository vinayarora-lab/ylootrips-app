import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), '.data', 'hotel-bookings.json');

function readBookings(): Record<string, unknown>[] {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function writeBookings(bookings: Record<string, unknown>[]) {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const evtRef = searchParams.get('evtRef');
    const txnid = searchParams.get('txnid');
    const bookings = readBookings();
    if (txnid) {
        const booking = bookings.find((b: Record<string, unknown>) => b.txnid === txnid);
        return NextResponse.json({ data: booking || null });
    }
    if (evtRef) {
        const booking = bookings.find((b: Record<string, unknown>) => b.evtRef === evtRef);
        return NextResponse.json({ data: booking || null });
    }
    return NextResponse.json({ data: bookings.slice().reverse() }); // newest first
}

export async function POST(req: NextRequest) {
    try {
        const booking = await req.json();
        const bookings = readBookings();
        bookings.push({ ...booking, savedAt: new Date().toISOString() });
        writeBookings(bookings);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { txnid, status, evtRef } = body;
        const bookings = readBookings();
        // Look up by txnid OR by evtRef
        const idx = bookings.findIndex((b: Record<string, unknown>) =>
            b.txnid === txnid || (evtRef && b.evtRef === evtRef)
        );
        if (idx !== -1) {
            const updates: Record<string, unknown> = {};
            if (status !== undefined) updates.status = status;
            if (evtRef !== undefined) updates.evtRef = evtRef;
            bookings[idx] = { ...bookings[idx], ...updates };
            writeBookings(bookings);
        }
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

