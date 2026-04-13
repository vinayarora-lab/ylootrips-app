'use client';

import { useState } from 'react';
import { Plane, ArrowUpDown, Calendar, Users, Search, Clock, Zap, MessageCircle, AlertCircle } from 'lucide-react';

const CITIES = [
  // ── India ──────────────────────────────────────────────
  { name: 'New Delhi',             code: 'DEL', intl: false },
  { name: 'Mumbai',                code: 'BOM', intl: false },
  { name: 'Bangalore',             code: 'BLR', intl: false },
  { name: 'Chennai',               code: 'MAA', intl: false },
  { name: 'Hyderabad',             code: 'HYD', intl: false },
  { name: 'Kolkata',               code: 'CCU', intl: false },
  { name: 'Jaipur',                code: 'JAI', intl: false },
  { name: 'Goa (Dabolim)',         code: 'GOI', intl: false },
  { name: 'Kochi',                 code: 'COK', intl: false },
  { name: 'Pune',                  code: 'PNQ', intl: false },
  { name: 'Ahmedabad',             code: 'AMD', intl: false },
  { name: 'Varanasi',              code: 'VNS', intl: false },
  { name: 'Amritsar',              code: 'ATQ', intl: false },
  { name: 'Leh',                   code: 'IXL', intl: false },
  { name: 'Srinagar',              code: 'SXR', intl: false },
  { name: 'Port Blair (Andaman)',  code: 'IXZ', intl: false },
  { name: 'Udaipur',               code: 'UDR', intl: false },
  { name: 'Jodhpur',               code: 'JDH', intl: false },
  { name: 'Bagdogra (Darjeeling)', code: 'IXB', intl: false },
  { name: 'Chandigarh',            code: 'IXC', intl: false },
  { name: 'Dehradun',              code: 'DED', intl: false },
  { name: 'Indore',                code: 'IDR', intl: false },
  { name: 'Bhopal',                code: 'BHO', intl: false },
  { name: 'Nagpur',                code: 'NAG', intl: false },
  { name: 'Patna',                 code: 'PAT', intl: false },
  { name: 'Bhubaneswar',           code: 'BBI', intl: false },
  { name: 'Guwahati',              code: 'GAU', intl: false },
  { name: 'Thiruvananthapuram',    code: 'TRV', intl: false },
  { name: 'Coimbatore',            code: 'CJB', intl: false },
  { name: 'Mangalore',             code: 'IXE', intl: false },
  // ── South-East Asia ────────────────────────────────────
  { name: 'Dubai (UAE)',           code: 'DXB', intl: true },
  { name: 'Abu Dhabi (UAE)',       code: 'AUH', intl: true },
  { name: 'Bangkok, Thailand',     code: 'BKK', intl: true },
  { name: 'Phuket, Thailand',      code: 'HKT', intl: true },
  { name: 'Bali (Denpasar)',       code: 'DPS', intl: true },
  { name: 'Singapore',             code: 'SIN', intl: true },
  { name: 'Kuala Lumpur',          code: 'KUL', intl: true },
  { name: 'Colombo (Sri Lanka)',   code: 'CMB', intl: true },
  { name: 'Kathmandu (Nepal)',     code: 'KTM', intl: true },
  { name: 'Dhaka (Bangladesh)',    code: 'DAC', intl: true },
  { name: 'Male (Maldives)',       code: 'MLE', intl: true },
  { name: 'Hanoi (Vietnam)',       code: 'HAN', intl: true },
  { name: 'Ho Chi Minh City',      code: 'SGN', intl: true },
  { name: 'Manila (Philippines)',  code: 'MNL', intl: true },
  { name: 'Jakarta (Indonesia)',   code: 'CGK', intl: true },
  // ── Middle East ────────────────────────────────────────
  { name: 'Riyadh (Saudi Arabia)', code: 'RUH', intl: true },
  { name: 'Doha (Qatar)',          code: 'DOH', intl: true },
  { name: 'Muscat (Oman)',         code: 'MCT', intl: true },
  { name: 'Kuwait City',           code: 'KWI', intl: true },
  { name: 'Bahrain',               code: 'BAH', intl: true },
  { name: 'Istanbul (Turkey)',     code: 'IST', intl: true },
  // ── Europe ─────────────────────────────────────────────
  { name: 'London (Heathrow)',     code: 'LHR', intl: true },
  { name: 'Paris (CDG)',           code: 'CDG', intl: true },
  { name: 'Frankfurt (Germany)',   code: 'FRA', intl: true },
  { name: 'Amsterdam',             code: 'AMS', intl: true },
  { name: 'Zurich (Switzerland)',  code: 'ZRH', intl: true },
  { name: 'Rome (Italy)',          code: 'FCO', intl: true },
  { name: 'Barcelona (Spain)',     code: 'BCN', intl: true },
  { name: 'Vienna (Austria)',      code: 'VIE', intl: true },
  { name: 'Moscow (Russia)',       code: 'SVO', intl: true },
  // ── East Asia & Pacific ────────────────────────────────
  { name: 'Tokyo (Japan)',         code: 'NRT', intl: true },
  { name: 'Osaka (Japan)',         code: 'KIX', intl: true },
  { name: 'Seoul (South Korea)',   code: 'ICN', intl: true },
  { name: 'Beijing (China)',       code: 'PEK', intl: true },
  { name: 'Shanghai (China)',      code: 'PVG', intl: true },
  { name: 'Hong Kong',             code: 'HKG', intl: true },
  { name: 'Sydney (Australia)',    code: 'SYD', intl: true },
  { name: 'Melbourne (Australia)', code: 'MEL', intl: true },
  // ── Americas ───────────────────────────────────────────
  { name: 'New York (JFK)',        code: 'JFK', intl: true },
  { name: 'San Francisco',         code: 'SFO', intl: true },
  { name: 'Toronto (Canada)',      code: 'YYZ', intl: true },
  { name: 'Vancouver (Canada)',    code: 'YVR', intl: true },
  // ── Africa ─────────────────────────────────────────────
  { name: 'Nairobi (Kenya)',       code: 'NBO', intl: true },
  { name: 'Johannesburg (SA)',     code: 'JNB', intl: true },
];

interface FlightResult {
  id: string;
  isDemo: boolean;
  airline: string;
  airlineCode: string;
  airlineColor: string;
  flightNumber: string;
  departure: { airport: string; terminal: string; time: string };
  arrival:   { airport: string; terminal: string; time: string };
  durationFormatted: string;
  durationMinutes: number;
  stops: number;
  stopInfo: string;
  pricePerPerson: number;
  totalPrice: number;
  currency: string;
  seatsLeft: number | null;
}

const todayStr = new Date().toISOString().split('T')[0];

function fmt(n: number) { return new Intl.NumberFormat('en-IN').format(n); }

function airlineInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function FlightSearch() {
  const [from, setFrom]         = useState('DEL');
  const [to, setTo]             = useState('GOI');
  const [tripType, setTripType] = useState<'return' | 'oneway'>('return');
  const [date, setDate]         = useState('');
  const [returnDate, setReturn] = useState('');
  const [passengers, setPass]   = useState(2);
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState<FlightResult[] | null>(null);
  const [isDemo, setIsDemo]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [sortBy, setSortBy]     = useState<'price' | 'duration'>('price');

  const swap = () => { setFrom(to); setTo(from); setResults(null); };

  const cityName = (code: string) => CITIES.find(c => c.code === code)?.name ?? code;

  const handleSearch = async () => {
    if (!date) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const params = new URLSearchParams({
        origin: from,
        destination: to,
        date,
        adults: String(passengers),
      });
      const res = await fetch(`/api/flights/search?${params}`);
      const json = await res.json();

      if (json.error) throw new Error(json.error);

      setResults(json.data ?? []);
      setIsDemo(json.isDemo ?? false);
    } catch {
      setError('Could not load flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sorted = results
    ? [...results].sort((a, b) =>
        sortBy === 'price'
          ? a.totalPrice - b.totalPrice
          : a.durationMinutes - b.durationMinutes
      )
    : null;

  const waText = (f: FlightResult) =>
    encodeURIComponent(
      `Hi, I'd like to book a flight:\n` +
      `Route: ${f.departure.airport} → ${f.arrival.airport}\n` +
      `Date: ${date}\n` +
      `Flight: ${f.airline} ${f.flightNumber}\n` +
      `Dep: ${f.departure.time}  Arr: ${f.arrival.time}\n` +
      `Passengers: ${passengers}\n` +
      `Price: ₹${fmt(f.totalPrice)} total`
    );

  return (
    <section className="py-14 md:py-20 bg-primary text-cream">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-caption uppercase tracking-[0.3em] text-accent mb-3">Live Prices</p>
          <h2 className="font-display text-display-lg">
            Find the best <span className="italic">flight fares</span>
          </h2>
          <p className="text-cream/55 text-body-sm max-w-md mx-auto mt-3">
            Compare flights across all airlines. Results shown right here — no redirects.
          </p>
        </div>

        {/* Search card */}
        <div className="max-w-3xl mx-auto bg-cream text-primary p-6 md:p-8 shadow-2xl">
          {/* Trip type */}
          <div className="flex gap-2 mb-5">
            {(['return', 'oneway'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTripType(t); setResults(null); }}
                className={`px-5 py-2 text-xs uppercase tracking-widest transition-colors ${
                  tripType === t ? 'bg-primary text-cream' : 'bg-cream-dark text-primary hover:bg-primary/10'
                }`}
              >
                {t === 'return' ? 'Round Trip' : 'One Way'}
              </button>
            ))}
          </div>

          {/* From / swap / To */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_40px_1fr] gap-3 items-end mb-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-primary/45 mb-1.5">From</label>
              <div className="relative">
                <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary rotate-45 pointer-events-none" />
                <select value={from} onChange={(e) => { setFrom(e.target.value); setResults(null); }}
                  className="w-full pl-9 pr-3 py-3 bg-cream-dark text-sm text-primary focus:outline-none focus:ring-1 focus:ring-secondary">
                  <optgroup label="🇮🇳 India">
                    {CITIES.filter(c => !c.intl).map((c) => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                  </optgroup>
                  <optgroup label="✈️ International">
                    {CITIES.filter(c => c.intl).map((c) => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                  </optgroup>
                </select>
              </div>
            </div>

            <button onClick={swap} className="h-[46px] flex items-center justify-center bg-secondary/10 hover:bg-secondary/20 text-secondary transition-colors">
              <ArrowUpDown className="w-4 h-4" />
            </button>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-primary/45 mb-1.5">To</label>
              <div className="relative">
                <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
                <select value={to} onChange={(e) => { setTo(e.target.value); setResults(null); }}
                  className="w-full pl-9 pr-3 py-3 bg-cream-dark text-sm text-primary focus:outline-none focus:ring-1 focus:ring-secondary">
                  <optgroup label="🇮🇳 India">
                    {CITIES.filter(c => !c.intl).map((c) => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                  </optgroup>
                  <optgroup label="✈️ International">
                    {CITIES.filter(c => c.intl).map((c) => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Dates + passengers */}
          <div className={`grid gap-3 mb-5 ${tripType === 'return' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-primary/45 mb-1.5">
                {tripType === 'return' ? 'Departure' : 'Travel Date'}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
                <input type="date" value={date} min={todayStr}
                  onChange={(e) => { setDate(e.target.value); setResults(null); }}
                  className="w-full pl-9 pr-3 py-3 bg-cream-dark text-sm text-primary focus:outline-none focus:ring-1 focus:ring-secondary" />
              </div>
            </div>

            {tripType === 'return' && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-primary/45 mb-1.5">Return</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
                  <input type="date" value={returnDate} min={date || todayStr}
                    onChange={(e) => setReturn(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 bg-cream-dark text-sm text-primary focus:outline-none focus:ring-1 focus:ring-secondary" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-primary/45 mb-1.5">Passengers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
                <select value={passengers} onChange={(e) => { setPass(Number(e.target.value)); setResults(null); }}
                  className="w-full pl-9 pr-3 py-3 bg-cream-dark text-sm text-primary focus:outline-none focus:ring-1 focus:ring-secondary">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button onClick={handleSearch} disabled={!date || loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-cream py-4 text-sm uppercase tracking-widest hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />Searching flights...</>
            ) : (
              <><Search className="w-4 h-4" />Search Flights</>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-3xl mx-auto mt-4 flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-cream px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Demo notice */}
        {sorted && isDemo && (
          <div className="max-w-3xl mx-auto mt-4 flex items-center gap-2 bg-accent/20 border border-accent/30 text-cream px-4 py-2.5 text-xs">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-accent" />
            Sample prices shown — add Amadeus API keys in <code className="font-mono bg-white/10 px-1">.env</code> for live fares
          </div>
        )}

        {/* Results */}
        {sorted && sorted.length > 0 && (
          <div className="max-w-3xl mx-auto mt-6 space-y-3">
            {/* Results header */}
            <div className="flex items-center justify-between">
              <p className="text-cream/70 text-sm">
                <span className="font-semibold text-cream">{sorted.length} flights</span> · {cityName(from)} → {cityName(to)} · {date}
              </p>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest">
                <span className="text-cream/40">Sort:</span>
                {(['price', 'duration'] as const).map(s => (
                  <button key={s} onClick={() => setSortBy(s)}
                    className={`px-3 py-1 transition-colors ${sortBy === s ? 'bg-accent text-primary font-semibold' : 'text-cream/60 hover:text-cream'}`}>
                    {s === 'price' ? 'Cheapest' : 'Fastest'}
                  </button>
                ))}
              </div>
            </div>

            {sorted.map((f, i) => (
              <div key={f.id}
                className={`bg-cream text-primary p-5 flex flex-col sm:flex-row sm:items-center gap-4 relative ${i === 0 && sortBy === 'price' ? 'ring-2 ring-green-500' : ''}`}>

                {/* Best deal badge */}
                {i === 0 && sortBy === 'price' && (
                  <div className="absolute -top-2.5 left-4 flex items-center gap-1 bg-green-500 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold">
                    <Zap className="w-2.5 h-2.5" /> Best Price
                  </div>
                )}

                {/* Airline logo */}
                <div className="shrink-0 flex items-center gap-3 min-w-[120px]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: f.airlineColor }}>
                    {airlineInitials(f.airline)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary">{f.airline}</p>
                    <p className="text-[10px] text-primary/45 uppercase">{f.flightNumber}</p>
                  </div>
                </div>

                {/* Times */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-xl font-display text-primary">{f.departure.time}</p>
                    <p className="text-[10px] uppercase tracking-widest text-primary/50">{f.departure.airport}</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-[10px] text-primary/40 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {f.durationFormatted}
                    </p>
                    <div className="w-full flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full border border-primary/30" />
                      <div className="flex-1 h-px bg-primary/20" />
                      {f.stops > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />}
                      {f.stops > 0 && <div className="flex-1 h-px bg-primary/20" />}
                      <Plane className="w-3 h-3 text-secondary" />
                    </div>
                    <p className={`text-[10px] font-medium uppercase tracking-widest ${f.stops === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                      {f.stopInfo}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xl font-display text-primary">{f.arrival.time}</p>
                    <p className="text-[10px] uppercase tracking-widest text-primary/50">{f.arrival.airport}</p>
                  </div>
                </div>

                {/* Price + Book */}
                <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                  <div className="text-right">
                    <p className="font-display text-2xl text-primary">₹{fmt(f.totalPrice)}</p>
                    <p className="text-[10px] text-primary/45">
                      ₹{fmt(f.pricePerPerson)}/person · {passengers} pax
                    </p>
                    {f.seatsLeft && f.seatsLeft <= 5 && (
                      <p className="text-[10px] text-red-500 font-semibold animate-pulse">
                        {f.seatsLeft} seats left!
                      </p>
                    )}
                  </div>
                  <a
                    href={`https://wa.me/918427831127?text=${waText(f)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Book Now
                  </a>
                </div>
              </div>
            ))}

            <p className="text-center text-cream/30 text-[10px] uppercase tracking-widest pt-2">
              Prices indicative · Final fare confirmed on booking · Contact us to book
            </p>
          </div>
        )}

        {sorted && sorted.length === 0 && (
          <div className="max-w-3xl mx-auto mt-6 text-center py-10 bg-cream/5 text-cream/60 text-sm">
            No flights found for this route on {date}. Try a different date or ask us for alternatives.
          </div>
        )}
      </div>
    </section>
  );
}
