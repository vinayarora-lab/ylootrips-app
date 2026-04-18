'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search, Star, Wifi, Waves, Dumbbell, UtensilsCrossed, Car, MapPin,
  BedDouble, ChevronDown, ChevronUp,
  Info, Loader2, AlertCircle, X, CreditCard, Users,
} from 'lucide-react';
import Image from 'next/image';
import type { HotelResult } from '@/app/api/hotels/search/route';

// ── Popular destinations ───────────────────────────────────────────────────────
const POPULAR = [
  { city: 'Goa',      emoji: '🏖️', label: 'Beach' },
  { city: 'Manali',   emoji: '🏔️', label: 'Mountains' },
  { city: 'Jaipur',   emoji: '🏰', label: 'Heritage' },
  { city: 'Kerala',   emoji: '🌴', label: 'Backwaters' },
  { city: 'Udaipur',  emoji: '🌸', label: 'Lake City' },
  { city: 'Mumbai',   emoji: '🌆', label: 'City' },
];

// ── Amenity icon map ───────────────────────────────────────────────────────────
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi size={11} />,
  'WiFi': <Wifi size={11} />,
  'Pool': <Waves size={11} />,
  'Swimming Pool': <Waves size={11} />,
  'Gym': <Dumbbell size={11} />,
  'Fitness center': <Dumbbell size={11} />,
  'Restaurant': <UtensilsCrossed size={11} />,
  'Parking': <Car size={11} />,
  'Free parking': <Car size={11} />,
};

function AmenityPill({ label }: { label: string }) {
  const icon = Object.entries(AMENITY_ICONS).find(([k]) =>
    label.toLowerCase().includes(k.toLowerCase())
  )?.[1];
  return (
    <span className="flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-1 rounded-full">
      {icon}{label}
    </span>
  );
}

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={10} className={i < stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
      ))}
    </span>
  );
}

// ── Booking modal (payment via Easebuzz) ───────────────────────────────────────
interface BookingModalProps {
  hotel: HotelResult;
  nights: number;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  onClose: () => void;
}

function BookingModal({ hotel, nights, checkIn, checkOut, rooms, adults, onClose }: BookingModalProps) {
  const [guest, setGuest] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fmt = (n: number) => n ? `₹${n.toLocaleString('en-IN')}` : 'Price on request';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/hotels/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotel, guest, checkIn, checkOut, rooms, adults, nights }),
      });
      const data = await res.json();
      if (!res.ok || !data.paymentUrl) {
        setError(data.error || 'Failed to initiate payment. Please try again.');
        setLoading(false);
        return;
      }
      window.location.href = data.paymentUrl;
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 backdrop-blur-sm p-0">
      <div className="bg-white w-full rounded-t-3xl shadow-2xl overflow-hidden" style={{ maxHeight: '92dvh' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="bg-[#1B3A6B] text-white px-5 py-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-base leading-snug">{hotel.name}</h2>
            <p className="text-white/60 text-[11px] mt-0.5">
              {checkIn} → {checkOut} · {nights}N · {rooms} room{rooms > 1 ? 's' : ''} · {adults} guest{adults > 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Total */}
        <div className="bg-amber-50 px-5 py-3 flex items-center justify-between border-b border-amber-100">
          <span className="text-sm text-gray-600 font-medium">Total amount</span>
          <span className="text-2xl font-extrabold text-[#1B3A6B]">{fmt(hotel.totalPrice)}</span>
        </div>

        {/* Form */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(92dvh - 160px)' }}>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {[
              { label: 'Full Name', type: 'text', key: 'name', placeholder: 'As per ID proof' },
              { label: 'Email Address', type: 'email', key: 'email', placeholder: 'Confirmation sent here' },
              { label: 'Phone Number', type: 'tel', key: 'phone', placeholder: '+91 XXXXX XXXXX' },
            ].map(({ label, type, key, placeholder }) => (
              <div key={key}>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">{label} *</label>
                <input
                  type={type} required
                  value={guest[key as keyof typeof guest]}
                  onChange={e => setGuest({ ...guest, [key]: e.target.value })}
                  placeholder={placeholder}
                  style={{ fontSize: '16px' }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#1B3A6B] transition-colors"
                />
              </div>
            ))}

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                <AlertCircle size={15} className="shrink-0" />{error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-amber-200/50 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-transform">
              {loading
                ? <><Loader2 size={16} className="animate-spin" /><span>Redirecting to payment…</span></>
                : <><CreditCard size={16} /><span>Pay {fmt(hotel.totalPrice)}</span></>}
            </button>
            <p className="text-center text-[10px] text-gray-400">Secure payment · Powered by Easebuzz · SSL encrypted</p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Guest selector bottom-sheet ────────────────────────────────────────────────
function GuestSelectorModal({
  adults, rooms, onApply, onClose,
}: {
  adults: number;
  rooms: number;
  onApply: (adults: number, rooms: number) => void;
  onClose: () => void;
}) {
  const [localAdults, setLocalAdults] = useState(adults);
  const [localRooms, setLocalRooms]   = useState(rooms);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl shadow-2xl px-5 pt-4 pb-6">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <h3 className="text-base font-extrabold text-gray-900 mb-5">Rooms &amp; Guests</h3>

        {[
          { label: 'Rooms', sub: 'Number of rooms', value: localRooms, min: 1, max: 5, set: setLocalRooms },
          { label: 'Adults', sub: '12+ years', value: localAdults, min: 1, max: 10, set: setLocalAdults },
        ].map(({ label, sub, value, min, max, set }) => (
          <div key={label} className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
            <div>
              <p className="text-sm font-bold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
            <div className="flex items-center gap-5">
              <button onClick={() => set(Math.max(min, value - 1))}
                className="w-9 h-9 rounded-full border-2 border-[#1B3A6B] text-[#1B3A6B] font-extrabold flex items-center justify-center text-lg leading-none disabled:opacity-30"
                disabled={value <= min}>−</button>
              <span className="text-xl font-extrabold text-gray-900 w-5 text-center">{value}</span>
              <button onClick={() => set(Math.min(max, value + 1))}
                className="w-9 h-9 rounded-full bg-[#1B3A6B] text-white font-extrabold flex items-center justify-center text-lg leading-none disabled:opacity-30"
                disabled={value >= max}>+</button>
            </div>
          </div>
        ))}

        <button onClick={() => { onApply(localAdults, localRooms); onClose(); }}
          className="w-full mt-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold py-4 rounded-xl text-sm shadow-lg shadow-amber-200/50">
          Apply
        </button>
      </div>
    </div>
  );
}

// ── Hotel card ─────────────────────────────────────────────────────────────────
interface HotelCardProps {
  hotel: HotelResult;
  nights: number;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
}

function HotelCard({ hotel, nights, checkIn, checkOut, rooms, adults }: HotelCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fmt = (n: number) => n ? `₹${n.toLocaleString('en-IN')}` : 'Price on request';

  return (
    <>
      {showModal && (
        <BookingModal hotel={hotel} nights={nights} checkIn={checkIn}
          checkOut={checkOut} rooms={rooms} adults={adults}
          onClose={() => setShowModal(false)} />
      )}

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          {hotel.thumbnail ? (
            <Image src={hotel.thumbnail} alt={hotel.name} fill className="object-cover" sizes="393px" unoptimized />
          ) : (
            <div className="h-full bg-gray-100 flex items-center justify-center">
              <BedDouble size={36} className="text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Type badge */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-extrabold px-2 py-1 rounded-lg uppercase tracking-wide">
            {hotel.type}
          </span>

          {/* Demo badge */}
          {hotel.isDemo && (
            <span className="absolute top-3 right-3 bg-amber-400/90 text-gray-800 text-[10px] font-extrabold px-2 py-1 rounded-lg">
              Sample prices
            </span>
          )}

          {/* Star + rating overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <StarRating stars={hotel.starClass} />
            {hotel.overallRating > 0 && (
              <span className="bg-green-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                {hotel.overallRating.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Name + reviews */}
          <div className="mb-2">
            <h3 className="font-extrabold text-gray-900 text-base leading-snug">{hotel.name}</h3>
            {hotel.reviewCount > 0 && (
              <p className="text-[11px] text-gray-400 mt-0.5">{hotel.reviewCount.toLocaleString('en-IN')} reviews</p>
            )}
          </div>

          {/* Description */}
          {hotel.description && (
            <p className={`text-xs text-gray-500 leading-relaxed mb-3 ${expanded ? '' : 'line-clamp-2'}`}>
              {hotel.description}
            </p>
          )}

          {/* Amenities */}
          {hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {hotel.amenities.slice(0, expanded ? undefined : 3).map(a => (
                <AmenityPill key={a} label={a} />
              ))}
              {!expanded && hotel.amenities.length > 3 && (
                <span className="text-[10px] text-[#1B3A6B] font-bold self-center">
                  +{hotel.amenities.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Check-in/out times */}
          <div className="flex gap-3 text-[10px] text-gray-400 mb-3">
            <span>Check-in: <strong className="text-gray-700">{hotel.checkIn}</strong></span>
            <span>Check-out: <strong className="text-gray-700">{hotel.checkOut}</strong></span>
          </div>

          {/* Price + Book Now */}
          <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200">
            <div>
              <p className="text-xl font-extrabold text-[#1B3A6B]">{fmt(hotel.pricePerNight)}</p>
              <p className="text-[10px] text-gray-400 font-medium">
                per night{nights > 1 && ` · ${fmt(hotel.totalPrice)} total (${nights}N)`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setExpanded(v => !v)}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button onClick={() => setShowModal(true)} disabled={!hotel.totalPrice}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-sm shadow-amber-200 disabled:opacity-50 active:scale-95 transition-transform">
                <CreditCard size={13} />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function today() { return new Date().toISOString().slice(0, 10); }
function tomorrow() {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const diff = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.round(diff / 86400000));
}

function formatDate(dateStr: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  return {
    day:     d.getDate(),
    month:   d.toLocaleDateString('en-US', { month: 'short' }),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    year:    d.getFullYear(),
  };
}

type SortKey = 'rating' | 'price_asc' | 'price_desc' | 'reviews';
const SORT_LABELS: { value: SortKey; label: string }[] = [
  { value: 'rating',     label: 'Best rated' },
  { value: 'price_asc',  label: 'Low → High' },
  { value: 'price_desc', label: 'High → Low' },
  { value: 'reviews',    label: 'Most reviewed' },
];

function sortHotels(hotels: HotelResult[], key: SortKey) {
  return [...hotels].sort((a, b) => {
    if (key === 'rating')     return b.overallRating - a.overallRating;
    if (key === 'price_asc')  return a.pricePerNight - b.pricePerNight;
    if (key === 'price_desc') return b.pricePerNight - a.pricePerNight;
    if (key === 'reviews')    return b.reviewCount - a.reviewCount;
    return 0;
  });
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function HotelSearch() {
  const searchParams = useSearchParams();

  const [query,    setQuery]   = useState(searchParams.get('q') ?? '');
  const [checkIn,  setCheckIn] = useState(searchParams.get('check_in')  ?? today());
  const [checkOut, setCheckOut]= useState(searchParams.get('check_out') ?? tomorrow());
  const [adults,   setAdults]  = useState(parseInt(searchParams.get('adults') ?? '2'));
  const [rooms,    setRooms]   = useState(parseInt(searchParams.get('rooms')  ?? '1'));

  const [results,     setResults]    = useState<HotelResult[]>([]);
  const [nights,      setNights]     = useState(1);
  const [resultQuery, setResultQuery]= useState('');
  const [isDemo,      setIsDemo]     = useState(false);
  const [loading,     setLoading]    = useState(false);
  const [error,       setError]      = useState('');
  const [sortKey,     setSortKey]    = useState<SortKey>('rating');
  const [searched,    setSearched]   = useState(false);
  const [guestOpen,   setGuestOpen]  = useState(false);
  const didAutoSearch = useRef(false);

  const search = useCallback(async () => {
    if (!query.trim() || !checkIn || !checkOut) return;
    setLoading(true); setError(''); setSearched(true);
    const params = new URLSearchParams({ q: query.trim(), check_in: checkIn, check_out: checkOut, adults: String(adults), rooms: String(rooms) });
    const res = await fetch(`/api/hotels/search?${params}`);
    if (!res.ok) { setError('Failed to fetch hotels. Please try again.'); setLoading(false); return; }
    const data = await res.json();
    setResults(data.data ?? []);
    setNights(data.nights ?? 1);
    setResultQuery(data.query ?? query);
    setIsDemo(data.isDemo ?? false);
    setLoading(false);
  }, [query, checkIn, checkOut, adults, rooms]);

  const sorted = useMemo(() => sortHotels(results, sortKey), [results, sortKey]);

  useEffect(() => {
    if (didAutoSearch.current) return;
    if (query.trim() && checkIn && checkOut) { didAutoSearch.current = true; search(); }
  }, [query, checkIn, checkOut, search]);

  const nightsCount  = nightsBetween(checkIn, checkOut);
  const checkInFmt   = formatDate(checkIn);
  const checkOutFmt  = formatDate(checkOut);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Navy gradient header ─────────────────────────────── */}
      <div className="bg-gradient-to-b from-[#1B3A6B] to-[#2D60AA] px-4 pt-4 pb-24">
        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">YlooTrips</p>
        <h1 className="font-playfair text-xl text-white font-bold mb-1">Search Hotels</h1>
        <p className="text-white/50 text-xs">Live rates from Google Hotels</p>
      </div>

      {/* ── Floating search card ─────────────────────────────── */}
      <div className="px-3 -mt-[4.5rem] relative z-10 pb-5">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Destination */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Where</p>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-[#1B3A6B] shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                placeholder="City or hotel name"
                style={{ fontSize: '16px' }}
                className="flex-1 text-lg font-extrabold text-gray-900 placeholder:text-gray-300 placeholder:font-normal outline-none bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery('')}><X size={15} className="text-gray-400" /></button>
              )}
            </div>
          </div>

          {/* Dates row */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
            {/* Check-in */}
            <div className="relative px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">Check-in</p>
              {checkInFmt ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-gray-900">{checkInFmt.day}</span>
                    <span className="text-sm font-bold text-gray-600">{checkInFmt.month}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">{checkInFmt.weekday} {checkInFmt.year}</p>
                </>
              ) : (
                <p className="text-sm text-gray-400 font-semibold mt-1">Select date</p>
              )}
              <input type="date" value={checkIn} min={today()}
                onChange={e => setCheckIn(e.target.value)}
                style={{ fontSize: '16px' }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>

            {/* Check-out */}
            <div className="relative px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">
                Check-out {nightsCount > 0 && <span className="text-[#1B3A6B]">· {nightsCount}N</span>}
              </p>
              {checkOutFmt ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-gray-900">{checkOutFmt.day}</span>
                    <span className="text-sm font-bold text-gray-600">{checkOutFmt.month}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">{checkOutFmt.weekday} {checkOutFmt.year}</p>
                </>
              ) : (
                <p className="text-sm text-gray-400 font-semibold mt-1">Select date</p>
              )}
              <input type="date" value={checkOut} min={checkIn || today()}
                onChange={e => setCheckOut(e.target.value)}
                style={{ fontSize: '16px' }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>

          {/* Rooms & Guests */}
          <button onClick={() => setGuestOpen(true)}
            className="w-full px-4 py-3 border-b border-gray-100 flex items-center justify-between active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-[#1B3A6B]" />
              <div className="text-left">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 leading-none mb-0.5">Rooms &amp; Guests</p>
                <p className="text-sm font-extrabold text-gray-900">{rooms} Room{rooms > 1 ? 's' : ''}, {adults} Adult{adults > 1 ? 's' : ''}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Search button */}
          <div className="p-4">
            <button onClick={search} disabled={loading || !query.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold py-4 rounded-xl text-sm uppercase tracking-widest shadow-lg shadow-amber-200/60 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Searching Hotels…</>
                : <><Search className="w-4 h-4" />Search Hotels</>}
            </button>
          </div>
        </div>

        {/* Popular destinations — shown before search */}
        {!searched && !loading && (
          <div className="mt-5">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-3">Popular Destinations</p>
            <div className="grid grid-cols-3 gap-2.5">
              {POPULAR.map(dest => (
                <button key={dest.city} onClick={() => setQuery(dest.city)}
                  className="bg-white rounded-2xl p-3 text-left shadow-sm border border-gray-100 active:scale-95 transition-transform">
                  <p className="text-2xl mb-1.5">{dest.emoji}</p>
                  <p className="text-xs font-extrabold text-gray-800">{dest.city}</p>
                  <p className="text-[10px] text-gray-400">{dest.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={15} className="shrink-0" />{error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="flex gap-1.5 mt-2">
                    {[...Array(3)].map((_, j) => <div key={j} className="h-6 w-16 bg-gray-200 rounded-full" />)}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-6 bg-gray-200 rounded w-24" />
                    <div className="h-9 bg-gray-200 rounded-xl w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && searched && results.length > 0 && (
          <div className="mt-5">
            {/* Results header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-extrabold text-gray-800">{results.length} hotels in {resultQuery}</p>
                <p className="text-[10px] text-gray-400">{nights}N · {adults} guest{adults > 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Sort pills */}
            <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {SORT_LABELS.map(({ value, label }) => (
                <button key={value} onClick={() => setSortKey(value)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all border ${
                    sortKey === value
                      ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]'
                      : 'bg-white text-gray-500 border-gray-200'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Demo notice */}
            {isDemo && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-4 py-3 mb-4">
                <Info size={13} className="shrink-0 mt-0.5" />
                <span>Showing <strong>sample hotel prices</strong> — add your SerpAPI key for live rates.</span>
              </div>
            )}

            <div className="space-y-4">
              {sorted.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} nights={nights}
                  checkIn={checkIn} checkOut={checkOut} rooms={rooms} adults={adults} />
              ))}
            </div>

            {/* Help CTA */}
            <div className="mt-6 bg-[#1B3A6B] rounded-2xl p-5 text-center">
              <p className="font-bold text-white mb-1">Need help choosing?</p>
              <p className="text-white/60 text-xs mb-4">Our travel experts find you the best deal + bundle with flights & activities.</p>
              <a
                href={`https://wa.me/918427831127?text=${encodeURIComponent(`Hi! I'm looking for a hotel in ${resultQuery} from ${checkIn} to ${checkOut} for ${adults} guests.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-extrabold px-5 py-2.5 rounded-xl text-sm active:scale-95 transition-transform">
                💬 Chat with a Travel Expert
              </a>
            </div>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="mt-4 text-center py-12 bg-white rounded-2xl shadow-sm">
            <p className="text-4xl mb-3">🏨</p>
            <p className="font-extrabold text-gray-800 mb-1">No hotels found</p>
            <p className="text-sm text-gray-400">Try a different destination or dates.</p>
          </div>
        )}
      </div>

      {/* Guest selector modal */}
      {guestOpen && (
        <GuestSelectorModal
          adults={adults} rooms={rooms}
          onApply={(a, r) => { setAdults(a); setRooms(r); }}
          onClose={() => setGuestOpen(false)}
        />
      )}
    </div>
  );
}
