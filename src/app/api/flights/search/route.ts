import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
const AMADEUS_BASE = process.env.AMADEUS_ENV === 'production'
  ? 'https://api.amadeus.com'
  : 'https://test.api.amadeus.com';

// ── Airline info ──────────────────────────────────────────────────────────────
const AIRLINES: Record<string, { name: string; color: string }> = {
  '6E': { name: 'IndiGo',           color: '#3a2cbf' },
  'AI': { name: 'Air India',        color: '#c8102e' },
  'SG': { name: 'SpiceJet',         color: '#c8102e' },
  'QP': { name: 'Akasa Air',        color: '#f97316' },
  'IX': { name: 'Air India Express',color: '#d4002a' },
  'UK': { name: 'Vistara',          color: '#7b2d8b' },
  'I5': { name: 'AirAsia India',    color: '#e21836' },
  'G8': { name: 'Go First',         color: '#e87722' },
};

// ── Amadeus token ─────────────────────────────────────────────────────────────
async function getToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET) return null;
  try {
    const res = await fetch(`${AMADEUS_BASE}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });
    const json = await res.json();
    return json.access_token ?? null;
  } catch {
    return null;
  }
}

// ── Parse Amadeus offer ───────────────────────────────────────────────────────
function parseOffer(offer: Record<string, unknown>, adults: number) {
  const itin = (offer.itineraries as Record<string, unknown>[])[0];
  const segs = itin.segments as Record<string, unknown>[];
  const first = segs[0] as Record<string, unknown>;
  const last  = segs[segs.length - 1] as Record<string, unknown>;
  const dep = first.departure as Record<string, unknown>;
  const arr = last.arrival as Record<string, unknown>;
  const price = offer.price as Record<string, unknown>;
  const carrierCode = String((offer.validatingAirlineCodes as string[])?.[0] ?? first.carrierCode ?? '');
  const airline = AIRLINES[carrierCode] ?? { name: carrierCode, color: '#555' };

  const durationStr = String(itin.duration ?? 'PT0M');
  const dMatch = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const dHours = parseInt(dMatch?.[1] ?? '0');
  const dMins  = parseInt(dMatch?.[2] ?? '0');
  const dFormatted = `${dHours}h ${String(dMins).padStart(2, '0')}m`;

  const total = parseFloat(String(price.grandTotal ?? price.total ?? 0));
  const perPerson = Math.round(total / adults);

  return {
    id: String(offer.id),
    isDemo: false,
    airline: airline.name,
    airlineCode: carrierCode,
    airlineColor: airline.color,
    flightNumber: `${first.carrierCode}${first.number}`,
    departure: {
      airport: String(dep.iataCode),
      terminal: String(dep.terminal ?? ''),
      time: String(dep.at ?? '').substring(11, 16),
    },
    arrival: {
      airport: String(arr.iataCode),
      terminal: String(arr.terminal ?? ''),
      time: String(arr.at ?? '').substring(11, 16),
    },
    durationFormatted: dFormatted,
    durationMinutes: dHours * 60 + dMins,
    stops: segs.length - 1,
    stopInfo: segs.length === 1 ? 'Non-stop' : `${segs.length - 1} stop${segs.length > 2 ? 's' : ''}`,
    pricePerPerson: perPerson,
    totalPrice: total,
    currency: 'INR',
    seatsLeft: (offer.numberOfBookableSeats as number) ?? null,
  };
}

// ── Demo data ─────────────────────────────────────────────────────────────────
function fmt(h: number, m: number) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
function addMin(time: string, mins: number) {
  const [h, m] = time.split(':').map(Number);
  const t = h * 60 + m + mins;
  return fmt(Math.floor(t / 60) % 24, t % 60);
}

const ROUTE_DATA: Record<string, { duration: number; basePrice: number }> = {
  'DEL-GOI': { duration: 135, basePrice: 5800 }, 'GOI-DEL': { duration: 135, basePrice: 5800 },
  'DEL-BOM': { duration: 120, basePrice: 4600 }, 'BOM-DEL': { duration: 120, basePrice: 4600 },
  'DEL-BLR': { duration: 165, basePrice: 6200 }, 'BLR-DEL': { duration: 165, basePrice: 6200 },
  'DEL-MAA': { duration: 175, basePrice: 6500 }, 'MAA-DEL': { duration: 175, basePrice: 6500 },
  'DEL-CCU': { duration: 150, basePrice: 5200 }, 'CCU-DEL': { duration: 150, basePrice: 5200 },
  'DEL-IXL': { duration:  75, basePrice: 9500 }, 'IXL-DEL': { duration:  75, basePrice: 9500 },
  'DEL-SXR': { duration:  80, basePrice: 7000 }, 'SXR-DEL': { duration:  80, basePrice: 7000 },
  'DEL-JAI': { duration:  55, basePrice: 3200 }, 'JAI-DEL': { duration:  55, basePrice: 3200 },
  'BOM-COK': { duration:  90, basePrice: 4200 }, 'COK-BOM': { duration:  90, basePrice: 4200 },
  'BOM-JAI': { duration: 110, basePrice: 4800 }, 'JAI-BOM': { duration: 110, basePrice: 4800 },
  'BOM-GOI': { duration:  55, basePrice: 3500 }, 'GOI-BOM': { duration:  55, basePrice: 3500 },
  'BLR-VNS': { duration: 175, basePrice: 6800 }, 'VNS-BLR': { duration: 175, basePrice: 6800 },
  'BLR-COK': { duration:  50, basePrice: 2800 }, 'COK-BLR': { duration:  50, basePrice: 2800 },
  'DEL-IXZ': { duration: 180, basePrice: 8500 }, 'IXZ-DEL': { duration: 180, basePrice: 8500 },
  'BLR-GOI': { duration:  55, basePrice: 3400 }, 'GOI-BLR': { duration:  55, basePrice: 3400 },
};

function buildDemo(origin: string, dest: string, date: string, adults: number) {
  const key = `${origin}-${dest}`;
  const { duration: baseDur, basePrice } = ROUTE_DATA[key] ?? { duration: 130, basePrice: 5500 };

  const variants = [
    { airline: '6E', name: 'IndiGo',     color: '#3a2cbf', depTime: '06:15', factor: 0.88, stops: 0 },
    { airline: 'AI', name: 'Air India',  color: '#c8102e', depTime: '09:40', factor: 1.05, stops: 0 },
    { airline: 'QP', name: 'Akasa Air',  color: '#f97316', depTime: '13:20', factor: 0.92, stops: 0 },
    { airline: 'SG', name: 'SpiceJet',   color: '#c8102e', depTime: '17:55', factor: 0.95, stops: 0 },
    { airline: '6E', name: 'IndiGo',     color: '#3a2cbf', depTime: '21:10', factor: 0.82, stops: 1 },
  ];

  return {
    isDemo: true,
    data: variants.map((v, i) => {
      const dur = v.stops === 0 ? baseDur : baseDur + 90;
      const total = Math.round((basePrice * v.factor * adults) / 100) * 100;
      const fnNum = 300 + i * 51 + 7;
      return {
        id: `DEMO-${i + 1}`,
        isDemo: true,
        airline: v.name,
        airlineCode: v.airline,
        airlineColor: v.color,
        flightNumber: `${v.airline}${fnNum}`,
        departure: { airport: origin, terminal: '', time: v.depTime },
        arrival:   { airport: dest,   terminal: '', time: addMin(v.depTime, dur) },
        durationFormatted: `${Math.floor(dur / 60)}h ${String(dur % 60).padStart(2, '0')}m`,
        durationMinutes: dur,
        stops: v.stops,
        stopInfo: v.stops === 0 ? 'Non-stop' : '1 stop',
        pricePerPerson: Math.round(total / adults),
        totalPrice: total,
        currency: 'INR',
        seatsLeft: Math.floor(Math.random() * 7) + 3,
      };
    }),
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const origin = sp.get('origin')?.toUpperCase();
  const dest   = sp.get('destination')?.toUpperCase();
  const date   = sp.get('date');
  const adults = parseInt(sp.get('adults') ?? '1');

  if (!origin || !dest || !date) {
    return NextResponse.json({ error: 'origin, destination and date required' }, { status: 400 });
  }

  const token = await getToken();

  if (!token) {
    return NextResponse.json(buildDemo(origin, dest, date, adults));
  }

  try {
    const url = new URL(`${AMADEUS_BASE}/v2/shopping/flight-offers`);
    url.searchParams.set('originLocationCode', origin);
    url.searchParams.set('destinationLocationCode', dest);
    url.searchParams.set('departureDate', date);
    url.searchParams.set('adults', String(adults));
    url.searchParams.set('max', '8');
    url.searchParams.set('currencyCode', 'INR');

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });

    const json = await res.json();
    if (!json.data) throw new Error('No flight data');

    return NextResponse.json({
      isDemo: false,
      data: (json.data as Record<string, unknown>[]).map((o) => parseOffer(o, adults)),
    });
  } catch {
    return NextResponse.json(buildDemo(origin, dest, date, adults));
  }
}
