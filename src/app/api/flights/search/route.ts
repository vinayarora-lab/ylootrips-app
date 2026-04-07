import { NextRequest, NextResponse } from 'next/server';

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
const AMADEUS_BASE = process.env.AMADEUS_ENV === 'production'
    ? 'https://api.amadeus.com'
    : 'https://test.api.amadeus.com';

// ── Airline colours ────────────────────────────────────────────────────────────
const AIRLINE_COLORS: Record<string, string> = {
    'IndiGo': '#3a2cbf', 'Air India': '#c8102e', 'SpiceJet': '#e21836',
    'Akasa Air': '#f97316', 'Air India Express': '#d4002a', 'Vistara': '#7b2d8b',
    'AirAsia India': '#e21836', 'Go First': '#e87722', 'GoAir': '#e87722',
    'Alliance Air': '#003580', 'Blue Dart': '#002B5C',
};
const AIRLINE_CODE_COLORS: Record<string, string> = {
    '6E': '#3a2cbf', 'AI': '#c8102e', 'SG': '#e21836', 'QP': '#f97316',
    'IX': '#d4002a', 'UK': '#7b2d8b', 'I5': '#e21836', 'G8': '#e87722',
};

function airlineColor(name: string, code: string) {
    return AIRLINE_COLORS[name] ?? AIRLINE_CODE_COLORS[code] ?? '#6B7355';
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(h: number, m: number) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
function addMin(time: string, mins: number) {
    const [h, m] = time.split(':').map(Number);
    const t = h * 60 + m + mins;
    return fmt(Math.floor(t / 60) % 24, t % 60);
}
function durationFmt(mins: number) {
    return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;
}

// ── SerpAPI Google Flights ────────────────────────────────────────────────────
async function fetchSerpApi(
    origin: string, dest: string, date: string, adults: number
): Promise<{ isDemo: false; data: FlightResult[] } | null> {
    if (!SERPAPI_KEY) return null;
    try {
        const params = new URLSearchParams({
            engine: 'google_flights',
            departure_id: origin,
            arrival_id: dest,
            outbound_date: date,
            adults: String(adults),
            currency: 'INR',
            hl: 'en',
            type: '2',
            api_key: SERPAPI_KEY,
        });

        const res = await fetch(`https://serpapi.com/search?${params}`, {
            next: { revalidate: 300 },
        });
        if (!res.ok) return null;

        const json = await res.json();
        const allFlights = [
            ...(json.best_flights ?? []),
            ...(json.other_flights ?? []),
        ];

        if (!allFlights.length) return null;

        const data: FlightResult[] = allFlights.map((offer: SerpFlight, i: number) => {
            const legs: SerpLeg[] = offer.flights ?? [];
            const first = legs[0];
            const last = legs[legs.length - 1];
            const stops = legs.length - 1;
            const totalDur = offer.total_duration ?? legs.reduce((s: number, l: SerpLeg) => s + (l.duration ?? 0), 0);

            const airlineName = first?.airline ?? 'Unknown';
            const flightNum = first?.flight_number ?? `FL${i + 1}`;
            const code = flightNum.replace(/\d+/, '').trim();

            const depTime = (first?.departure_airport?.time ?? '').substring(11, 16) || '00:00';
            const arrTime = (last?.arrival_airport?.time ?? '').substring(11, 16) || addMin(depTime, totalDur);

            const totalPrice = Math.round((offer.price ?? 0) * 1.2 / 100) * 100;

            return {
                id: `SERP-${i}`,
                isDemo: false,
                airline: airlineName,
                airlineCode: code,
                airlineColor: airlineColor(airlineName, code),
                airlineLogo: offer.airline_logo ?? first?.airline_logo ?? '',
                flightNumber: flightNum,
                departure: {
                    airport: first?.departure_airport?.id ?? origin,
                    terminal: String(first?.departure_airport?.terminal ?? ''),
                    time: depTime,
                },
                arrival: {
                    airport: last?.arrival_airport?.id ?? dest,
                    terminal: String(last?.arrival_airport?.terminal ?? ''),
                    time: arrTime,
                },
                durationFormatted: durationFmt(totalDur),
                durationMinutes: totalDur,
                stops,
                stopInfo: stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`,
                pricePerPerson: Math.round(totalPrice / adults),
                totalPrice,
                currency: 'INR',
                seatsLeft: null,
            };
        });

        return { isDemo: false, data };
    } catch {
        return null;
    }
}

// ── Amadeus fallback ──────────────────────────────────────────────────────────
async function getAmadeusToken(): Promise<string | null> {
    if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET) return null;
    try {
        const res = await fetch(`${AMADEUS_BASE}/v1/security/oauth2/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: AMADEUS_CLIENT_ID,
                client_secret: AMADEUS_CLIENT_SECRET,
            }),
        });
        const json = await res.json();
        return json.access_token ?? null;
    } catch { return null; }
}

function parseAmadeusOffer(offer: Record<string, unknown>, adults: number): FlightResult {
    const itin = (offer.itineraries as Record<string, unknown>[])[0];
    const segs = itin.segments as Record<string, unknown>[];
    const first = segs[0] as Record<string, unknown>;
    const last = segs[segs.length - 1] as Record<string, unknown>;
    const dep = first.departure as Record<string, unknown>;
    const arr = last.arrival as Record<string, unknown>;
    const price = offer.price as Record<string, unknown>;
    const carrierCode = String((offer.validatingAirlineCodes as string[])?.[0] ?? first.carrierCode ?? '');

    const dStr = String((itin as Record<string, unknown>).duration ?? 'PT0M');
    const dm = dStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const dH = parseInt(dm?.[1] ?? '0'), dM = parseInt(dm?.[2] ?? '0');
    const total = Math.round(parseFloat(String(price.grandTotal ?? price.total ?? 0)) * 1.2 * 100) / 100;

    return {
        id: String(offer.id),
        isDemo: false,
        airline: carrierCode,
        airlineCode: carrierCode,
        airlineColor: AIRLINE_CODE_COLORS[carrierCode] ?? '#555',
        airlineLogo: '',
        flightNumber: `${first.carrierCode}${first.number}`,
        departure: { airport: String((dep as Record<string, unknown>).iataCode), terminal: String((dep as Record<string, unknown>).terminal ?? ''), time: String((dep as Record<string, unknown>).at ?? '').substring(11, 16) },
        arrival: { airport: String((arr as Record<string, unknown>).iataCode), terminal: String((arr as Record<string, unknown>).terminal ?? ''), time: String((arr as Record<string, unknown>).at ?? '').substring(11, 16) },
        durationFormatted: `${dH}h ${String(dM).padStart(2, '0')}m`,
        durationMinutes: dH * 60 + dM,
        stops: segs.length - 1,
        stopInfo: segs.length === 1 ? 'Non-stop' : `${segs.length - 1} stop${segs.length > 2 ? 's' : ''}`,
        pricePerPerson: Math.round(total / adults),
        totalPrice: total,
        currency: 'INR',
        seatsLeft: (offer.numberOfBookableSeats as number) ?? null,
    };
}

async function fetchAmadeus(
    origin: string, dest: string, date: string, adults: number
): Promise<{ isDemo: false; data: FlightResult[] } | null> {
    const token = await getAmadeusToken();
    if (!token) return null;
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
        if (!json.data?.length) return null;

        return {
            isDemo: false,
            data: (json.data as Record<string, unknown>[]).map(o => parseAmadeusOffer(o, adults)),
        };
    } catch { return null; }
}

// ── Demo data ─────────────────────────────────────────────────────────────────
const ROUTE_DATA: Record<string, { duration: number; basePrice: number }> = {
    'DEL-GOI': { duration: 135, basePrice: 5800 }, 'GOI-DEL': { duration: 135, basePrice: 5800 },
    'DEL-BOM': { duration: 120, basePrice: 4600 }, 'BOM-DEL': { duration: 120, basePrice: 4600 },
    'DEL-BLR': { duration: 165, basePrice: 6200 }, 'BLR-DEL': { duration: 165, basePrice: 6200 },
    'DEL-MAA': { duration: 175, basePrice: 6500 }, 'MAA-DEL': { duration: 175, basePrice: 6500 },
    'DEL-CCU': { duration: 150, basePrice: 5200 }, 'CCU-DEL': { duration: 150, basePrice: 5200 },
    'DEL-IXL': { duration: 75, basePrice: 9500 },  'IXL-DEL': { duration: 75, basePrice: 9500 },
    'DEL-SXR': { duration: 80, basePrice: 7000 },  'SXR-DEL': { duration: 80, basePrice: 7000 },
    'DEL-JAI': { duration: 55, basePrice: 3200 },  'JAI-DEL': { duration: 55, basePrice: 3200 },
    'BOM-COK': { duration: 90, basePrice: 4200 },  'COK-BOM': { duration: 90, basePrice: 4200 },
    'BOM-JAI': { duration: 110, basePrice: 4800 }, 'JAI-BOM': { duration: 110, basePrice: 4800 },
    'BOM-GOI': { duration: 55, basePrice: 3500 },  'GOI-BOM': { duration: 55, basePrice: 3500 },
    'BLR-VNS': { duration: 175, basePrice: 6800 }, 'VNS-BLR': { duration: 175, basePrice: 6800 },
    'BLR-COK': { duration: 50, basePrice: 2800 },  'COK-BLR': { duration: 50, basePrice: 2800 },
    'DEL-IXZ': { duration: 180, basePrice: 8500 }, 'IXZ-DEL': { duration: 180, basePrice: 8500 },
    'BLR-GOI': { duration: 55, basePrice: 3400 },  'GOI-BLR': { duration: 55, basePrice: 3400 },
};

function buildDemo(origin: string, dest: string, adults: number): { isDemo: true; data: FlightResult[] } {
    const key = `${origin}-${dest}`;
    const { duration: baseDur, basePrice } = ROUTE_DATA[key] ?? { duration: 130, basePrice: 5500 };

    const variants = [
        { code: '6E', name: 'IndiGo', depTime: '06:15', factor: 0.88, stops: 0 },
        { code: 'AI', name: 'Air India', depTime: '09:40', factor: 1.05, stops: 0 },
        { code: 'QP', name: 'Akasa Air', depTime: '13:20', factor: 0.92, stops: 0 },
        { code: 'SG', name: 'SpiceJet', depTime: '17:55', factor: 0.95, stops: 0 },
        { code: '6E', name: 'IndiGo', depTime: '21:10', factor: 0.82, stops: 1 },
    ];

    return {
        isDemo: true,
        data: variants.map((v, i) => {
            const dur = v.stops === 0 ? baseDur : baseDur + 90;
            const total = Math.round((basePrice * v.factor * adults * 1.2) / 100) * 100;
            return {
                id: `DEMO-${i + 1}`,
                isDemo: true,
                airline: v.name,
                airlineCode: v.code,
                airlineColor: airlineColor(v.name, v.code),
                airlineLogo: '',
                flightNumber: `${v.code}${300 + i * 51 + 7}`,
                departure: { airport: origin, terminal: '', time: v.depTime },
                arrival: { airport: dest, terminal: '', time: addMin(v.depTime, dur) },
                durationFormatted: durationFmt(dur),
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

// ── Types ─────────────────────────────────────────────────────────────────────
interface FlightResult {
    id: string; isDemo: boolean;
    airline: string; airlineCode: string; airlineColor: string; airlineLogo: string;
    flightNumber: string;
    departure: { airport: string; terminal: string; time: string };
    arrival: { airport: string; terminal: string; time: string };
    durationFormatted: string; durationMinutes: number;
    stops: number; stopInfo: string;
    pricePerPerson: number; totalPrice: number; currency: string;
    seatsLeft: number | null;
}
interface SerpLeg {
    airline?: string; airline_logo?: string; flight_number?: string; duration?: number;
    departure_airport?: { id?: string; name?: string; time?: string; terminal?: string };
    arrival_airport?: { id?: string; name?: string; time?: string; terminal?: string };
}
interface SerpFlight {
    flights?: SerpLeg[]; total_duration?: number; price?: number;
    airline_logo?: string; type?: string;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
    const sp = req.nextUrl.searchParams;
    const origin = sp.get('origin')?.toUpperCase();
    const dest = sp.get('destination')?.toUpperCase();
    const date = sp.get('date');
    const adults = parseInt(sp.get('adults') ?? '1');

    if (!origin || !dest || !date) {
        return NextResponse.json({ error: 'origin, destination and date required' }, { status: 400 });
    }

    // 1. Try SerpAPI Google Flights (live)
    const serpResult = await fetchSerpApi(origin, dest, date, adults);
    if (serpResult) return NextResponse.json(serpResult);

    // 2. Try Amadeus (live fallback)
    const amadeusResult = await fetchAmadeus(origin, dest, date, adults);
    if (amadeusResult) return NextResponse.json(amadeusResult);

    // 3. Demo data
    return NextResponse.json(buildDemo(origin, dest, adults));
}
