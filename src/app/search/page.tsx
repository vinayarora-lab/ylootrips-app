'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, MapPin, Calendar, Users, ArrowUpRight, Check, ChevronDown, ChevronUp,
  Tag, CreditCard, Phone, Loader2, AlertCircle, Sparkles, ExternalLink,
} from 'lucide-react';
import type { MarketPackage } from '@/app/api/search/market-packages/route';

// ── All our listed trips (domestic + international packages) ─────────────────
const OUR_TRIPS = [
  // Domestic
  { slug: 'auli-package-from-delhi', title: 'Auli Snow Package from Delhi', location: 'Auli, Uttarakhand', keywords: ['auli', 'uttarakhand', 'joshimath', 'snow'], duration: '5D/4N', priceINR: 7349, image: 'https://images.unsplash.com/photo-1610631787813-9eeb1a2386cc?w=600&q=80', category: 'Snow Tour', highlights: ["Asia's longest cable car", 'Gorson Bugyal trek', 'Optional snow skiing'], href: '/destinations/domestic' },
  { slug: 'jibhi-tirthan-valley-trip', title: 'Jibhi Tirthan Valley Trip', location: 'Jibhi, Himachal Pradesh', keywords: ['jibhi', 'tirthan', 'himachal', 'jalori', 'kullu'], duration: '5D/4N', priceINR: 7349, image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=600&q=80', category: 'Nature Tour', highlights: ['Jalori Pass at 10,800 ft', 'Sarolsar Lake trek', 'Jibhi Waterfall'], href: '/destinations/domestic' },
  { slug: 'manali-solang-kasol-tour', title: 'Manali, Solang & Kasol Tour', location: 'Manali + Kasol, Himachal Pradesh', keywords: ['manali', 'kasol', 'solang', 'himachal', 'kullu', 'parvati'], duration: '5D/4N', priceINR: 6999, image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=600&q=80', category: 'Adventure Tour', highlights: ['Solang Valley adventure', 'Atal Tunnel & Sissu', 'Manikaran Sahib'], href: '/manali-tour-package' },
  { slug: 'kedarnath-yatra-from-delhi', title: 'Kedarnath Yatra from Delhi', location: 'Kedarnath, Uttarakhand', keywords: ['kedarnath', 'uttarakhand', 'char dham', 'haridwar', 'rishikesh', 'gaurikund'], duration: '5D/4N', priceINR: 8399, image: 'https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=600&q=80', category: 'Pilgrimage', highlights: ['16 km trek at 11,755 ft', 'Devprayag confluence', 'One of 12 Jyotirlingas'], href: '/destinations/domestic' },
  { slug: 'lakshadweep-tour', title: 'Lakshadweep Island Tour', location: 'Agatti & Bangaram, Lakshadweep', keywords: ['lakshadweep', 'agatti', 'bangaram', 'islands', 'kochi'], duration: '5D/4N', priceINR: 23100, image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&q=80', category: 'Beach & Water Sports', highlights: ['Snorkeling & scuba diving', 'Dolphin & turtle sightings', 'Island hopping'], href: '/destinations/domestic' },
  { slug: 'coorg-tour-bangalore', title: 'Coorg Weekend Tour', location: 'Coorg (Kodagu), Karnataka', keywords: ['coorg', 'kodagu', 'karnataka', 'bangalore', 'bengaluru', 'coffee', 'mandalpatti'], duration: '3D/2N', priceINR: 3499, image: 'https://images.unsplash.com/photo-1604228741639-a9f66a5a30f4?w=600&q=80', category: 'Nature Tour', highlights: ['Mandalpatti Viewpoint', 'Abbey Falls', 'Elephant Camp'], href: '/destinations/domestic' },
  { slug: 'spiti-valley-winter', title: 'Winter Spiti Valley Tour', location: 'Spiti Valley, Himachal Pradesh', keywords: ['spiti', 'kaza', 'tabo', 'key monastery', 'himachal', 'chitkul', 'chicham'], duration: '8D/7N', priceINR: 15749, image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&q=80', category: 'Adventure Tour', highlights: ["World's highest suspension bridge", "World's highest post office", 'Key & Tabo Monasteries'], href: '/destinations/domestic' },
  { slug: 'chopta-tungnath-trek', title: 'Chopta Tungnath & Chandrashila Trek', location: 'Chopta, Uttarakhand', keywords: ['chopta', 'tungnath', 'chandrashila', 'uttarakhand', 'trek'], duration: '3D/2N', priceINR: 5199, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', category: 'Trek', highlights: ['Highest Shiva temple', 'Chandrashila Peak 13,000 ft', 'Deoriatal Lake'], href: '/destinations/domestic' },
  { slug: 'kedarkantha-trek', title: 'Kedarkantha Trek', location: 'Sankri, Uttarakhand', keywords: ['kedarkantha', 'sankri', 'uttarakhand', 'trek', 'juda ka talab'], duration: '5D/4N', priceINR: 4799, image: 'https://images.unsplash.com/photo-1622911208006-54aea5f1e693?w=600&q=80', category: 'Trek', highlights: ['360° views at 12,500 ft', 'Frozen lake camping', 'Rhododendron forests'], href: '/destinations/domestic' },
  { slug: 'kheerganga-trek', title: 'Kheerganga Trek with Camping', location: 'Kasol, Himachal Pradesh', keywords: ['kheerganga', 'kasol', 'barshaini', 'parvati', 'himachal', 'trek'], duration: '2D/1N', priceINR: 1299, image: 'https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600&q=80', category: 'Trek', highlights: ['Natural hot springs', '18 km round trip', 'Bonfire & music'], href: '/destinations/domestic' },
  { slug: 'hampta-pass-trek', title: 'Hampta Pass Trek + Chandratal', location: 'Manali, Himachal Pradesh', keywords: ['hampta', 'chandratal', 'manali', 'himachal', 'trek', 'spiti', 'lahaul'], duration: '5D/4N', priceINR: 7349, image: 'https://images.unsplash.com/photo-1543489822-c49534f3271f?w=600&q=80', category: 'Trek', highlights: ['Cross Hampta Pass 14,039 ft', 'Chandratal Lake', '4 nights camping'], href: '/destinations/domestic' },
  { slug: 'sar-pass-trek', title: 'Sar Pass Trek', location: 'Kasol, Himachal Pradesh', keywords: ['sar pass', 'kasol', 'grahan', 'himachal', 'trek', 'parvati'], duration: '5D/4N', priceINR: 6299, image: 'https://images.unsplash.com/photo-1566977776052-6e61e35bf9be?w=600&q=80', category: 'Trek', highlights: ['Cross at 13,799 ft', 'Frozen lakes & snow valleys', '48 km total trek'], href: '/destinations/domestic' },
  { slug: 'prashar-lake-trek', title: 'Prashar Lake Trek & Camping', location: 'Mandi, Himachal Pradesh', keywords: ['prashar', 'mandi', 'himachal', 'trek', 'lake'], duration: '2D/1N', priceINR: 2799, image: 'https://images.unsplash.com/photo-1543393470-b2ec9e6eaa47?w=600&q=80', category: 'Trek', highlights: ['Sacred lake at 8,900 ft', '360° Himalayan views', 'Beginner-friendly'], href: '/destinations/domestic' },
  { slug: 'har-ki-dun-trek', title: 'Har Ki Dun Trek with Camping', location: 'Sankri, Uttarakhand', keywords: ['har ki dun', 'sankri', 'uttarakhand', 'garhwal', 'trek'], duration: '7D/6N', priceINR: 8399, image: 'https://images.unsplash.com/photo-1574948493174-24aa5a7e4ea1?w=600&q=80', category: 'Trek', highlights: ['Glacial valley 11,800 ft', 'Mahabharata-era villages', 'Year-round accessible'], href: '/destinations/domestic' },
  { slug: 'roopkund-trek', title: 'Roopkund Trek', location: 'Lohajung, Uttarakhand', keywords: ['roopkund', 'lohajung', 'uttarakhand', 'trek', 'mystery lake', 'trishul'], duration: '8D/7N', priceINR: 12599, image: 'https://images.unsplash.com/photo-1567961877371-6dd51cc16462?w=600&q=80', category: 'Trek', highlights: ['Mystery Lake 16,499 ft', 'Skeletal remains from 9th century', 'Ali & Bedni Bugyals'], href: '/destinations/domestic' },
  { slug: 'chadar-trek', title: 'Chadar Trek — Frozen Zanskar', location: 'Leh, Ladakh', keywords: ['chadar', 'zanskar', 'leh', 'ladakh', 'frozen river', 'trek'], duration: '9D/8N', priceINR: 17999, image: 'https://images.unsplash.com/photo-1609151162840-6d36e82b0a63?w=600&q=80', category: 'Trek', highlights: ['Frozen Zanskar River trek', 'Nerak Waterfall frozen 56 ft', '−30°C adventure'], href: '/destinations/domestic' },
  // Package pages
  { slug: 'goa-tour-package', title: 'Goa Tour Package', location: 'Goa', keywords: ['goa', 'beach', 'calangute', 'baga', 'anjuna', 'panjim', 'panaji'], duration: '4D/3N', priceINR: 9999, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', category: 'Beach Tour', highlights: ['North & South Goa beaches', 'Water sports', 'Dudhsagar Falls'], href: '/goa-tour-package' },
  { slug: 'kashmir-tour-package', title: 'Kashmir Tour Package', location: 'Kashmir', keywords: ['kashmir', 'srinagar', 'gulmarg', 'pahalgam', 'dal lake', 'sonamarg', 'j&k'], duration: '5D/4N', priceINR: 18999, image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80', category: 'Hill Station', highlights: ['Dal Lake shikara ride', 'Gulmarg gondola', 'Pahalgam valley'], href: '/kashmir-tour-package' },
  { slug: 'kerala-tour-package', title: 'Kerala Tour Package', location: 'Kerala', keywords: ['kerala', 'kochi', 'munnar', 'alleppey', 'backwaters', 'houseboat', 'thekkady'], duration: '5D/4N', priceINR: 15999, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', category: 'Nature Tour', highlights: ['Kerala backwaters houseboat', 'Munnar tea estates', 'Thekkady wildlife'], href: '/kerala-tour-package' },
  // International
  { slug: 'bali-honeymoon-package', title: 'Bali Honeymoon Package', location: 'Bali, Indonesia', keywords: ['bali', 'indonesia', 'ubud', 'seminyak', 'kuta', 'honeymoon'], duration: '6N', priceINR: 52499, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', category: 'International', highlights: ['Ubud rice terraces', 'Seminyak beach', 'Temple visits'], href: '/bali-honeymoon-package' },
  { slug: 'dubai-tour-package', title: 'Dubai Tour Package from Delhi', location: 'Dubai, UAE', keywords: ['dubai', 'uae', 'burj khalifa', 'desert safari', 'abu dhabi'], duration: '5N', priceINR: 36499, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', category: 'International', highlights: ['Burj Khalifa', 'Desert safari', 'Dubai Mall'], href: '/dubai-tour-package-from-delhi' },
  { slug: 'thailand-budget-trip', title: 'Thailand Budget Trip', location: 'Bangkok + Phuket, Thailand', keywords: ['thailand', 'bangkok', 'phuket', 'krabi', 'pattaya', 'phi phi'], duration: '5N', priceINR: 49499, image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80', category: 'International', highlights: ['Bangkok temples', 'Phi Phi Islands', 'Thai street food'], href: '/thailand-budget-trip' },
  { slug: 'singapore-tour-package', title: 'Singapore Tour Package', location: 'Singapore', keywords: ['singapore', 'marina bay', 'sentosa', 'gardens by the bay', 'universal studios'], duration: '4N', priceINR: 32999, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80', category: 'International', highlights: ['Marina Bay Sands', 'Sentosa Island', 'Gardens by the Bay'], href: '/singapore-tour-package' },
  { slug: 'maldives-luxury-package', title: 'Maldives Luxury Package', location: 'Maldives', keywords: ['maldives', 'overwater bungalow', 'snorkeling', 'diving', 'atoll'], duration: '4N', priceINR: 89999, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', category: 'International', highlights: ['Overwater villa', 'Coral reef snorkeling', 'Private beach'], href: '/maldives-luxury-package' },
];

function matchTrips(query: string) {
  if (!query) return [];
  const q = query.toLowerCase();
  return OUR_TRIPS.filter((t) =>
    t.keywords.some((k) => q.includes(k) || k.includes(q)) ||
    t.location.toLowerCase().includes(q) ||
    t.title.toLowerCase().includes(q)
  );
}

// ── Trip card (our packages) ──────────────────────────────────────────────────
function OurTripCard({ trip }: { trip: typeof OUR_TRIPS[0] }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-primary/8 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative h-44 overflow-hidden">
        <Image src={trip.image} alt={trip.title} fill className="object-cover" unoptimized sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="bg-accent text-primary text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">{trip.category}</span>
        </div>
        <div className="absolute bottom-3 left-3">
          <p className="text-white font-display text-xl">₹{trip.priceINR.toLocaleString('en-IN')}<span className="text-sm font-normal">/person</span></p>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-base text-primary mb-1 leading-snug">{trip.title}</h3>
        <p className="text-[11px] text-secondary flex items-center gap-1 mb-3"><MapPin size={10} />{trip.location} · {trip.duration}</p>
        <ul className="space-y-1 mb-4 flex-1">
          {trip.highlights.map((h) => (
            <li key={h} className="flex items-start gap-1.5 text-xs text-primary/70">
              <Check size={11} className="text-green-600 shrink-0 mt-0.5" />{h}
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-primary/8">
          <Link href={`/contact?destination=${encodeURIComponent(trip.title)}`}
            className="flex items-center justify-center gap-1 bg-accent text-primary text-xs font-bold uppercase tracking-wide py-2.5 rounded-xl hover:bg-accent/90 transition-colors">
            <CreditCard size={11} />Book Now
          </Link>
          <Link href={trip.href}
            className="flex items-center justify-center gap-1 border border-primary/20 text-primary text-xs font-medium py-2.5 rounded-xl hover:bg-primary hover:text-cream transition-all">
            Details <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Market package card ───────────────────────────────────────────────────────
function MarketCard({ pkg, guests }: { pkg: MarketPackage; guests: string }) {
  const [showInquiry, setShowInquiry] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleInquire = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('/api/search/market-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          package: pkg.title,
          destination: pkg.destination,
          sourceUrl: pkg.url,
          marketPrice: pkg.marketPrice,
          ourPrice: pkg.ourPrice,
          priceDiff: pkg.priceDiff,
          guests,
        }),
      });
      setSent(true);
    } catch {
      setSent(true); // show success regardless
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-primary/8 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">Market Package</span>
              <span className="text-[10px] text-secondary">via {pkg.source}</span>
            </div>
            <h3 className="font-display text-base text-primary leading-snug">{pkg.title}</h3>
          </div>
          {pkg.ourPrice && (
            <div className="text-right shrink-0">
              {pkg.marketPrice && <p className="text-[11px] text-secondary line-through">₹{pkg.marketPrice.toLocaleString('en-IN')}</p>}
              <p className="font-display text-xl text-primary">₹{pkg.ourPrice.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-secondary">per person</p>
            </div>
          )}
        </div>
        {pkg.snippet && <p className="text-xs text-primary/60 leading-relaxed mb-3 line-clamp-2">{pkg.snippet}</p>}
        {pkg.priceDiff && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700 mb-3">
            All-inclusive YlooTrips service: ₹{pkg.priceDiff.toLocaleString('en-IN')} included
          </div>
        )}
        {sent ? (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
            <Check size={14} /> Inquiry sent! We'll respond within 1 hour.
          </div>
        ) : showInquiry ? (
          <form onSubmit={handleInquire} className="space-y-2 mt-3 pt-3 border-t border-primary/8">
            <input required type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-cream-light border border-sand/60 rounded-xl text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus:border-accent" />
            <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 bg-cream-light border border-sand/60 rounded-xl text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus:border-accent" />
            <input required type="tel" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2.5 bg-cream-light border border-sand/60 rounded-xl text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus:border-accent" />
            <div className="flex gap-2">
              <button type="submit" disabled={sending}
                className="flex-1 flex items-center justify-center gap-1.5 bg-accent text-primary text-xs font-bold py-2.5 rounded-xl hover:bg-accent/90 disabled:opacity-60">
                {sending ? <Loader2 size={13} className="animate-spin" /> : <CreditCard size={13} />}
                {sending ? 'Sending…' : 'Book This Trip'}
              </button>
              <button type="button" onClick={() => setShowInquiry(false)}
                className="px-3 py-2.5 border border-sand/60 rounded-xl text-secondary text-xs hover:bg-cream-light">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setShowInquiry(true)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-accent text-primary text-xs font-bold py-2.5 rounded-xl hover:bg-accent/90 transition-colors">
              <CreditCard size={13} /> Book Now
            </button>
            <a href={pkg.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 border border-primary/20 text-secondary text-xs py-2.5 px-3 rounded-xl hover:bg-cream-light transition-colors">
              <ExternalLink size={12} /> Source
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Search results content ────────────────────────────────────────────────────
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [to, setTo] = useState(searchParams.get('to') || '');
  const [from, setFrom] = useState(searchParams.get('from') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [searchInput, setSearchInput] = useState(to);

  const [ourMatches, setOurMatches] = useState<typeof OUR_TRIPS>([]);
  const [marketPackages, setMarketPackages] = useState<MarketPackage[]>([]);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState('');
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (destination: string) => {
    if (!destination.trim()) return;
    setSearched(true);
    const matches = matchTrips(destination);
    setOurMatches(matches);

    if (matches.length === 0) {
      setMarketLoading(true);
      setMarketError('');
      try {
        const res = await fetch(`/api/search/market-packages?destination=${encodeURIComponent(destination)}`);
        const data = await res.json();
        setMarketPackages(data.data || []);
      } catch {
        setMarketError('Could not load market packages.');
      } finally {
        setMarketLoading(false);
      }
    } else {
      setMarketPackages([]);
    }
  }, []);

  useEffect(() => {
    const dest = searchParams.get('to') || searchParams.get('from') || '';
    setTo(dest);
    setSearchInput(dest);
    setFrom(searchParams.get('from') || '');
    setGuests(searchParams.get('guests') || '2');
    setDate(searchParams.get('date') || '');
    if (dest) runSearch(dest);
  }, [searchParams, runSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput) params.set('to', searchInput);
    if (from) params.set('from', from);
    if (guests) params.set('guests', guests);
    if (date) params.set('date', date);
    router.push(`/search?${params.toString()}`);
  };

  const noResults = searched && ourMatches.length === 0 && !marketLoading && marketPackages.length === 0;

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Search bar */}
      <section className="bg-primary py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl text-white mb-6 text-center">Find Your Perfect Trip</h1>
          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 flex items-center gap-2 bg-cream-light rounded-xl px-4 py-3">
                <MapPin size={15} className="text-accent shrink-0" />
                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Where do you want to go?"
                  className="bg-transparent text-sm text-primary placeholder:text-secondary/50 outline-none w-full" />
              </div>
              <div className="flex items-center gap-2 bg-cream-light rounded-xl px-4 py-3">
                <Calendar size={15} className="text-accent shrink-0" />
                <input type="date" value={date} min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-sm text-primary outline-none w-full" />
              </div>
              <button type="submit"
                className="flex items-center justify-center gap-2 bg-accent text-primary font-semibold rounded-xl py-3 hover:bg-accent/90 transition-colors">
                <Search size={16} />Search
              </button>
            </div>
            <div className="flex items-center gap-4 mt-3 px-1">
              <label className="flex items-center gap-2 text-sm text-secondary">
                <Users size={14} className="text-accent" /> Guests:
                <select value={guests} onChange={(e) => setGuests(e.target.value)}
                  className="bg-cream-light text-primary rounded-lg px-2 py-1.5 outline-none text-sm">
                  {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              {from && <span className="text-xs text-secondary">From: <strong>{from}</strong></span>}
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {!searched && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🗺️</p>
            <p className="font-display text-2xl text-primary mb-2">Search any destination</p>
            <p className="text-secondary text-sm">Enter a city, state, or country above to find trips</p>
          </div>
        )}

        {/* Our matched trips */}
        {ourMatches.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-accent mb-1">Packages for "{to}"</p>
                <h2 className="font-display text-2xl text-primary">{ourMatches.length} trip{ourMatches.length !== 1 ? 's' : ''} found</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {ourMatches.map((trip) => <OurTripCard key={trip.slug} trip={trip} />)}
            </div>
          </>
        )}

        {/* Market search loading */}
        {marketLoading && (
          <div className="text-center py-16">
            <Loader2 size={32} className="animate-spin text-accent mx-auto mb-4" />
            <p className="font-display text-xl text-primary mb-2">Searching market packages…</p>
            <p className="text-secondary text-sm">Finding best available trips for "{to}" from BanBanjara & other sources</p>
          </div>
        )}

        {/* Market results */}
        {!marketLoading && marketPackages.length > 0 && (
          <>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 text-sm">Market packages for "{to}"</p>
                <p className="text-xs text-amber-700 mt-0.5">We don't have a fixed package for this destination yet, but we've sourced options from BanBanjara. Our price includes full YlooTrips service + support.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {marketPackages.map((pkg, i) => <MarketCard key={i} pkg={pkg} guests={guests} />)}
            </div>
          </>
        )}

        {/* Market error */}
        {marketError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={15} />{marketError}
          </div>
        )}

        {/* No results → Plan Your Trip */}
        {(noResults || (searched && ourMatches.length === 0 && marketPackages.length === 0 && !marketLoading)) && (
          <div className="max-w-2xl mx-auto text-center py-10">
            <p className="text-4xl mb-4">🗺️</p>
            <h2 className="font-display text-2xl text-primary mb-3">No packages found for "{to}"</h2>
            <p className="text-secondary text-sm mb-8">We'll build a custom itinerary just for you — or try our AI trip planner for instant ideas.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Link href={`/trip-planner?destination=${encodeURIComponent(to)}&guests=${guests}${date ? `&date=${date}` : ''}`}
                className="flex flex-col items-center gap-2 bg-primary text-cream p-6 rounded-2xl hover:bg-primary/90 transition-colors">
                <Sparkles size={28} className="text-accent" />
                <span className="font-display text-lg">AI Trip Planner</span>
                <span className="text-cream/70 text-xs">Get a custom day-by-day itinerary for {to} instantly</span>
              </Link>
              <Link href={`/contact?destination=${encodeURIComponent(to)}&guests=${guests}&message=Hi! I'm looking for a trip to ${to}${guests ? ` for ${guests} guests` : ''}${date ? ` around ${date}` : ''}. Please help plan a custom itinerary.`}
                className="flex flex-col items-center gap-2 bg-white border-2 border-primary text-primary p-6 rounded-2xl hover:bg-cream-light transition-colors">
                <Phone size={28} className="text-accent" />
                <span className="font-display text-lg">Talk to an Expert</span>
                <span className="text-primary/60 text-xs">We'll plan a custom trip & get back within 1 hour</span>
              </Link>
            </div>

            <div className="bg-cream-light rounded-xl p-5 text-left">
              <p className="font-semibold text-primary text-sm mb-3">Popular destinations we cover:</p>
              <div className="flex flex-wrap gap-2">
                {['Manali', 'Goa', 'Kashmir', 'Kerala', 'Bali', 'Dubai', 'Thailand', 'Kedarkantha', 'Spiti Valley', 'Lakshadweep'].map((dest) => (
                  <button key={dest} onClick={() => { setSearchInput(dest); router.push(`/search?to=${dest}&guests=${guests}`); }}
                    className="bg-white border border-primary/15 text-primary text-xs px-3 py-1.5 rounded-full hover:bg-accent hover:border-accent transition-colors">
                    {dest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-accent" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
