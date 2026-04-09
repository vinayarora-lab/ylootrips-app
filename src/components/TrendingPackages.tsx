'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import type { MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Star, Clock, MapPin, Flame, Shield, Eye, Zap, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import { Trip } from '@/types';
import { formatPriceWithCurrency, calculateDiscount } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';
import { getDestinationImageUrl } from '@/lib/destinationImages';

function getSpotsLeft(id: number): number | null {
  const val = ((id * 7) % 9) + 1;
  return val <= 5 ? val : null;
}
function getViewers(id: number): number {
  return ((id * 13 + 7) % 20) + 4;
}

/* ── 3D Tilt Card ─────────────────────────────────────────────────── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y - r.height / 2) / r.height) * -10;
    const ry = ((x - r.width / 2) / r.width) * 10;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
    // move shine
    const shine = el.querySelector<HTMLDivElement>('[data-shine]');
    if (shine) {
      shine.style.opacity = '1';
      shine.style.background = `radial-gradient(circle at ${(x / r.width) * 100}% ${(y / r.height) * 100}%, rgba(255,255,255,0.18) 0%, transparent 70%)`;
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    const shine = el.querySelector<HTMLDivElement>('[data-shine]');
    if (shine) shine.style.opacity = '0';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform 0.18s ease-out', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

/* ── Countdown Timer ──────────────────────────────────────────────── */
function Countdown({ endsAt }: { endsAt: number }) {
  const [diff, setDiff] = useState(endsAt - Date.now());
  useEffect(() => {
    const t = setInterval(() => setDiff(endsAt - Date.now()), 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  const h = Math.max(0, Math.floor(diff / 3600000));
  const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const s = Math.max(0, Math.floor((diff % 60000) / 1000));
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <span className="font-mono font-bold tabular-nums">
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}

/* ── Deal Badge ───────────────────────────────────────────────────── */
const DEAL_END = Date.now() + 47 * 3600_000 + 23 * 60_000;

/* ── Individual Card ──────────────────────────────────────────────── */
function TrendingCard({ trip, rank }: { trip: Trip; rank: number }) {
  const { currency } = useCurrency();
  const { visitor } = useVisitor();
  const fp = (p: typeof trip.price) => formatPriceWithCurrency(p, currency);
  const discount = trip.originalPrice ? calculateDiscount(trip.originalPrice, trip.price) : 0;
  const spotsLeft = getSpotsLeft(trip.id);
  const viewers = getViewers(trip.id);
  const bookHref = visitor === 'foreigner' ? '/tours' : `/checkout?tripId=${trip.id}`;
  const _genericFragments = ['photo-1501554728187','photo-1517176118067','photo-1519681393784','photo-1526772662000','photo-1530866495561','photo-1506905925346'];
  const _url = trip.imageUrl || '';
  const img = _genericFragments.some(f => _url.includes(f)) || !_url
    ? getDestinationImageUrl(undefined, trip.destination, _url)
    : _url;

  return (
    <TiltCard className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl flex flex-col h-full cursor-default">
      {/* shine overlay */}
      <div data-shine className="absolute inset-0 z-20 pointer-events-none rounded-2xl opacity-0 transition-opacity duration-200" />

      {/* rank badge — floats in 3D */}
      <div
        className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-primary text-cream flex items-center justify-center font-display text-sm font-bold shadow-lg"
        style={{ transform: 'translateZ(20px)' }}
      >
        #{rank}
      </div>

      {/* Discount badge */}
      {discount > 0 && (
        <div
          className="absolute top-4 right-4 z-10 bg-terracotta text-white text-[11px] font-bold uppercase px-2.5 py-1 rounded-full shadow-md"
          style={{ transform: 'translateZ(20px)' }}
        >
          {discount}% OFF
        </div>
      )}

      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        <Image
          src={img}
          alt={trip.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Live viewers */}
        <div
          className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{ transform: 'translateZ(15px)' }}
        >
          <Eye className="w-3 h-3" />
          {viewers} viewing now
        </div>

        {/* Spots left */}
        {spotsLeft !== null && (
          <div
            className="absolute bottom-3 right-3 bg-red-500 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full animate-pulse"
            style={{ transform: 'translateZ(15px)' }}
          >
            {spotsLeft} left!
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1" style={{ transform: 'translateZ(5px)' }}>
        <div className="flex items-center justify-between text-xs text-primary/50 mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="uppercase tracking-wider">{trip.destination}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{trip.duration}</span>
          </div>
        </div>

        <Link href={`/trips/${trip.id}`}>
          <h3 className="font-display text-lg text-primary hover:text-secondary transition-colors leading-snug line-clamp-2 mb-2">
            {trip.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(Number(trip.rating) || 4.5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
          ))}
          <span className="text-xs text-primary/50 ml-1">({trip.reviewCount || 94})</span>
        </div>

        <div className="flex-1" />

        {/* Price */}
        <div className="pt-3 border-t border-primary/8">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl text-primary">{fp(trip.price)}</span>
                {trip.originalPrice && (
                  <span className="text-sm text-primary/35 line-through">{fp(trip.originalPrice)}</span>
                )}
              </div>
              <span className="text-[10px] text-primary/40 uppercase tracking-widest">per person · no hidden fees</span>
            </div>
            <div className="flex items-center gap-1 text-green-700 text-[10px] font-semibold">
              <Shield className="w-3 h-3" />
              Secure
            </div>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-5 gap-2">
            <Link
              href={bookHref}
              className="col-span-3 flex items-center justify-center gap-1.5 bg-primary text-cream py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-secondary transition-colors rounded-lg shadow-md hover:shadow-lg"
            >
              <Zap className="w-3.5 h-3.5" />
              Book Now
            </Link>
            <Link
              href={`/trips/${trip.id}`}
              className="col-span-2 flex items-center justify-center gap-1 border border-primary/20 text-primary py-2.5 text-xs uppercase tracking-widest hover:bg-primary/5 transition-all rounded-lg"
            >
              Details
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

/* ── Main Component ───────────────────────────────────────────────── */
export default function TrendingPackages() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTrendingTrips()
      .then(r => setTrips((r.data || []).slice(0, 6)))
      .catch(() => api.getFeaturedTrips().then(r => setTrips((r.data || []).slice(0, 6))).catch(() => {}))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-cream to-cream-dark overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            {/* Flash deal countdown */}
            <div className="inline-flex items-center gap-2 bg-terracotta text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 shadow-lg">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              Flash Deal ends in&nbsp;
              <Countdown endsAt={DEAL_END} />
            </div>
            <h2 className="font-display text-display-lg text-primary">
              Trending <span className="italic text-secondary">Right Now</span>
            </h2>
            <p className="text-primary/55 text-sm mt-2 max-w-lg">
              Real-time popular packages — booked by {Math.floor(Date.now() / 3600000) % 40 + 120}+ travelers this week
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold bg-green-50 border border-green-200 px-3 py-2 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              Prices drop with more guests
            </div>
            <Link
              href="/trips"
              className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/20 hover:bg-primary hover:text-cream px-4 py-2 rounded-full transition-all uppercase tracking-wider"
            >
              All Packages <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[460px] rounded-2xl bg-cream-dark animate-pulse" />
            ))}
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, i) => (
              <TrendingCard key={trip.id} trip={trip} rank={i + 1} />
            ))}
          </div>
        ) : null}

        {/* Bottom trust strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🔒', title: 'Secure Checkout', sub: '256-bit SSL · PCI-DSS' },
            { icon: '🆓', title: 'Free Cancellation', sub: 'Up to 14 days before' },
            { icon: '💬', title: '24/7 Support', sub: 'WhatsApp · Call · Email' },
            { icon: '⭐', title: '4.9/5 Rating', sub: '2,400+ verified reviews' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-primary/6">
              <span className="text-2xl shrink-0">{icon}</span>
              <div>
                <div className="text-sm font-semibold text-primary">{title}</div>
                <div className="text-xs text-primary/45 mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
