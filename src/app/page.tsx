'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star, Shield, Clock, Phone, CheckCircle,
  ChevronRight, Sparkles, Plane, Hotel, MapPin,
  Award, Lock, HeadphonesIcon, Users, TrendingUp,
  ArrowRight, MessageCircle, Calendar,
} from 'lucide-react';

/* ── Destinations ────────────────────────────────────────────────────── */
const DESTINATIONS = [
  {
    id: 1, label: 'Bali', country: 'Indonesia', nights: '6N/7D',
    price: '₹42,999', tag: 'Honeymoon', tagColor: 'bg-rose-100 text-rose-700',
    href: '/bali-honeymoon-package',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    rating: 4.9, reviews: 312,
  },
  {
    id: 2, label: 'Kashmir', country: 'India', nights: '5N/6D',
    price: '₹24,999', tag: 'Trending', tagColor: 'bg-blue-100 text-blue-700',
    href: '/kashmir-tour-package',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    rating: 4.9, reviews: 528,
  },
  {
    id: 3, label: 'Dubai', country: 'UAE', nights: '5N/6D',
    price: '₹35,999', tag: 'Luxury', tagColor: 'bg-amber-100 text-amber-700',
    href: '/dubai-tour-package-from-delhi',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    rating: 4.8, reviews: 219,
  },
  {
    id: 4, label: 'Maldives', country: 'Maldives', nights: '4N/5D',
    price: '₹89,999', tag: 'Premium', tagColor: 'bg-teal-100 text-teal-700',
    href: '/maldives-luxury-package',
    img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80',
    rating: 5.0, reviews: 94,
  },
  {
    id: 5, label: 'Manali', country: 'India', nights: '4N/5D',
    price: '₹12,999', tag: 'Adventure', tagColor: 'bg-green-100 text-green-700',
    href: '/manali-tour-package',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
    rating: 4.8, reviews: 441,
  },
  {
    id: 6, label: 'Goa', country: 'India', nights: '3N/4D',
    price: '₹9,999', tag: 'Beach', tagColor: 'bg-orange-100 text-orange-700',
    href: '/goa-tour-package',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
    rating: 4.7, reviews: 683,
  },
];

/* ── Reviews ─────────────────────────────────────────────────────────── */
interface LiveReview {
  id: number;
  userName: string;
  userTitle?: string;
  userImage?: string;
  comment: string;
  rating?: number;
  destination?: string;
  tripDate?: string;
  isFeatured?: boolean;
}

/* ── Trust pillars ───────────────────────────────────────────────────── */
const TRUST_PILLARS = [
  { icon: Award, title: 'MSME Certified', sub: 'Govt. of India recognised', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Lock, title: '100% Secure', sub: 'PCI-DSS & 256-bit SSL', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: HeadphonesIcon, title: '24/7 Support', sub: 'Real humans, not bots', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: TrendingUp, title: 'Price Match', sub: 'Best price + ₹500 credit', color: 'text-purple-600', bg: 'bg-purple-50' },
];

/* ── Quick actions ───────────────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { icon: Sparkles, label: 'AI Planner', sub: 'Free itinerary', href: '/trip-planner', bg: 'bg-gray-900', iconColor: 'text-white' },
  { icon: Plane, label: 'Flights', sub: 'Best fares', href: '/flights', bg: 'bg-blue-600', iconColor: 'text-white' },
  { icon: Hotel, label: 'Hotels', sub: '200+ stays', href: '/hotels', bg: 'bg-amber-500', iconColor: 'text-white' },
  { icon: MapPin, label: 'Packages', sub: '40+ trips', href: '/trips', bg: 'bg-emerald-600', iconColor: 'text-white' },
];

/* ── Stats ───────────────────────────────────────────────────────────── */
const STATS = [
  { value: '25K+', label: 'Trips Planned' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '40+', label: 'Countries' },
  { value: '1 hr', label: 'Response Time' },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'india' | 'international' | 'honeymoon'>('all');
  const [reviews, setReviews] = useState<LiveReview[]>([]);

  useEffect(() => {
    fetch('https://trip-backend-65232427280.asia-south1.run.app/api/testimonials')
      .then(r => r.ok ? r.json() : [])
      .then((data: LiveReview[]) => {
        // Sort latest first (highest id), show up to 4
        const sorted = [...data].sort((a, b) => b.id - a.id).slice(0, 4);
        setReviews(sorted);
      })
      .catch(() => setReviews([]));
  }, []);

  const filtered = activeCategory === 'all' ? DESTINATIONS
    : activeCategory === 'india' ? DESTINATIONS.filter(d => d.country === 'India')
    : activeCategory === 'international' ? DESTINATIONS.filter(d => d.country !== 'India')
    : DESTINATIONS.filter(d => d.tag === 'Honeymoon');

  return (
    <div className="bg-[#F5F1EB] min-h-full">

      {/* ── HERO — pulls up under the sticky topbar with negative margin ── */}
      <section className="relative -mt-14 h-[72vw] min-h-[300px] max-h-[420px] overflow-hidden">
        {/* Ocean hero video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=60"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-ocean.mp4" type="video/mp4" />
          {/* Fallback image if video fails */}
          <Image
            src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=85"
            alt="Ocean travel"
            fill className="object-cover" priority
          />
        </video>
        {/* Gradient: soft at top (nav sits here), ocean teal at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-teal-900/20 to-black/85" />

        {/* Hero text — padded top to clear the topbar (56px) */}
        <div className="absolute bottom-0 left-0 right-0 p-5 pb-7">
          <p className="text-[#F5753A] text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            Trusted by 25,000+ travellers
          </p>
          <h1 className="font-playfair text-white text-[2rem] leading-[1.1] font-semibold mb-3">
            Your extraordinary<br />journey awaits
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-white/80 text-[11px] font-semibold">4.9 · 2,400+ verified reviews</span>
          </div>
        </div>

      </section>

      {/* ── SEARCH BAR ─────────────────────────────────────────────────── */}
      <section className="px-4 -mt-5 relative z-10">
        <Link href="/trip-planner" className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-xl border border-gray-100 active:scale-[0.98] transition-transform">
          <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
            <Sparkles size={17} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">AI Trip Planner</p>
            <p className="text-sm font-semibold text-gray-700 truncate">Where would you like to go?</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <ChevronRight size={15} className="text-gray-500" />
          </div>
        </Link>
      </section>

      {/* ── QUICK ACTIONS ──────────────────────────────────────────────── */}
      <section className="px-4 mt-5">
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ icon: Icon, label, sub, href, bg, iconColor }) => (
            <Link key={href} href={href} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
              <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center shadow-md`}>
                <Icon size={24} className={iconColor} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-900 leading-tight">{label}</p>
                <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRUST STRIP ────────────────────────────────────────────────── */}
      <section className="mx-4 mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-4">
          {STATS.map(({ value, label }, i) => (
            <div key={label} className={`flex flex-col items-center justify-center py-4 ${i < 3 ? 'border-r border-gray-100' : ''}`}>
              <span className="text-base font-black text-gray-900 leading-tight">{value}</span>
              <span className="text-[9px] font-semibold text-gray-400 mt-0.5 text-center leading-tight px-1">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED DESTINATIONS ───────────────────────────────────────── */}
      <section className="mt-7 px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Handpicked For You</p>
            <h2 className="font-playfair text-2xl text-gray-900 font-semibold leading-tight">
              Curated<br />Collections
            </h2>
          </div>
          <Link href="/trips" className="text-xs font-bold text-gray-500 underline underline-offset-2 active:opacity-70">
            View all
          </Link>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          {(['all', 'india', 'international', 'honeymoon'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {cat === 'all' ? 'All' : cat === 'india' ? '🇮🇳 India' : cat === 'international' ? '🌍 International' : '💑 Honeymoon'}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
          {filtered.map(dest => (
            <Link
              key={dest.id}
              href={dest.href}
              className="shrink-0 w-[200px] bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 active:scale-[0.97] transition-transform"
            >
              {/* Image */}
              <div className="relative h-[130px]">
                <Image src={dest.img} alt={dest.label} fill className="object-cover" />
                {/* Tag */}
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${dest.tagColor} shadow-sm`}>
                  {dest.tag}
                </span>
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
                {/* Nights */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <p className="text-white font-playfair font-semibold text-base leading-tight">{dest.label}</p>
                    <p className="text-white/80 text-[10px] font-medium">{dest.country}</p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="px-3 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400">{dest.nights}</p>
                    <p className="text-base font-black text-gray-900 leading-tight">{dest.price}<span className="text-[10px] font-semibold text-gray-400">/person</span></p>
                  </div>
                  <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star size={10} className="fill-amber-500 text-amber-500" />
                    <span className="text-[11px] font-bold text-amber-700">{dest.rating}</span>
                  </div>
                </div>
                <div className="mt-2.5 w-full bg-gray-900 rounded-xl py-2 flex items-center justify-center gap-1.5">
                  <span className="text-white text-[11px] font-bold">View Package</span>
                  <ArrowRight size={11} className="text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── WHY YLOO — TRUST BUILDERS ───────────────────────────────────── */}
      <section className="mt-8 px-4">
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Why Choose Us</p>
          <h2 className="font-playfair text-2xl text-gray-900 font-semibold leading-tight">
            Built on trust,<br />backed by experts
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {TRUST_PILLARS.map(({ icon: Icon, title, sub, color, bg }) => (
            <div key={title} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <p className="text-sm font-bold text-gray-900 leading-tight">{title}</p>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">{sub}</p>
            </div>
          ))}
        </div>

        {/* Guarantee bar */}
        <div className="mt-3 bg-gray-900 rounded-2xl px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <CheckCircle size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">100% Money-Back Guarantee</p>
            <p className="text-white/60 text-[11px] mt-0.5">Free cancellation up to 14 days before travel</p>
          </div>
        </div>
      </section>

      {/* ── AI PLANNER PROMO ─────────────────────────────────────────────── */}
      <section className="mt-6 mx-4">
        <Link href="/trip-planner" className="relative block overflow-hidden rounded-3xl active:scale-[0.98] transition-transform">
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
            alt="AI Trip Planner"
            width={800} height={340}
            className="w-full h-44 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-5">
            <div className="inline-flex items-center gap-1.5 bg-amber-500 rounded-full px-3 py-1 self-start mb-2">
              <Sparkles size={11} className="text-white" />
              <span className="text-white text-[10px] font-black uppercase tracking-wider">Free · AI Powered</span>
            </div>
            <h3 className="font-playfair text-white text-xl font-semibold leading-tight mb-1">
              Plan your perfect<br />trip in 30 seconds
            </h3>
            <p className="text-white/70 text-[11px]">Groq AI · Gemini · GPT-4o</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-white text-xs font-bold">Try free now</span>
              <ArrowRight size={14} className="text-white" />
            </div>
          </div>
        </Link>
      </section>

      {/* ── VERIFIED REVIEWS ─────────────────────────────────────────────── */}
      <section className="mt-8 px-4">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Social Proof</p>
            <h2 className="font-playfair text-2xl text-gray-900 font-semibold leading-tight">
              Real stories,<br />real travellers
            </h2>
          </div>
          <Link href="/reviews" className="text-xs font-bold text-gray-500 underline underline-offset-2">
            2,400+ reviews
          </Link>
        </div>

        {/* Rating summary */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4 flex items-center gap-4">
          <div className="text-center">
            <p className="font-playfair text-5xl font-bold text-gray-900 leading-none">4.9</p>
            <div className="flex items-center gap-0.5 mt-1 justify-center">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-1 font-medium">out of 5</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5,4,3,2,1].map((star, i) => {
              const widths = ['92%','6%','1%','0.5%','0.5%'];
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-3">{star}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: widths[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review cards — live from website */}
        <div className="space-y-3">
          {reviews.length === 0 ? (
            // Skeleton loaders while fetching
            [1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 bg-gray-100 rounded w-full" />
                  <div className="h-2.5 bg-gray-100 rounded w-4/5" />
                </div>
              </div>
            ))
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  {r.userImage ? (
                    <Image
                      src={r.userImage} alt={r.userName} width={44} height={44}
                      className="w-11 h-11 rounded-full object-cover border-2 border-gray-100 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 font-bold text-lg">
                      {r.userName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900 truncate">{r.userName}</p>
                      <div className="flex items-center gap-0.5 shrink-0 ml-2">
                        {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                          <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium">{r.userTitle ?? ''}</p>
                  </div>
                </div>

                {/* Review text */}
                <p className="text-[13px] text-gray-700 leading-relaxed">"{r.comment}"</p>

                {/* Trip badge */}
                <div className="mt-3 flex items-center gap-1.5">
                  <CheckCircle size={12} className="text-emerald-500 fill-emerald-100 shrink-0" />
                  <span className="text-[11px] font-semibold text-gray-500">
                    Verified trip{r.destination ? ` · ${r.destination}` : ''}{r.tripDate ? ` · ${r.tripDate}` : ''}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <Link
          href="/reviews"
          className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-200 bg-white rounded-2xl py-3.5 text-sm font-bold text-gray-700 active:scale-[0.98] transition-transform shadow-sm"
        >
          Read all 2,400+ reviews
          <ChevronRight size={16} />
        </Link>
      </section>

      {/* ── CERTIFICATIONS ───────────────────────────────────────────────── */}
      <section className="mt-8 mx-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 text-center">
          Verified & Certified
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '🏛️', title: 'MSME', sub: 'Govt. Registered' },
            { icon: '🔒', title: 'SSL 256-bit', sub: 'End-to-end secure' },
            { icon: '💳', title: 'PCI-DSS', sub: 'Payment certified' },
            { icon: '📋', title: 'GST Reg.', sub: 'Tax compliant' },
            { icon: '⭐', title: 'ISO Rated', sub: '4.9 / 5.0' },
            { icon: '🛡️', title: 'Insured', sub: 'Licensed ops' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <span className="text-2xl mb-1">{icon}</span>
              <p className="text-[11px] font-bold text-gray-900">{title}</p>
              <p className="text-[10px] text-gray-400 leading-tight">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONCIERGE CTA ────────────────────────────────────────────────── */}
      <section className="mt-6 mx-4 mb-6">
        <div className="bg-gray-900 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=60"
              alt="" fill className="object-cover"
            />
          </div>
          <div className="relative px-5 py-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0">
                <HeadphonesIcon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white font-playfair text-lg font-semibold leading-tight">
                  Speak to your<br />travel expert
                </p>
                <p className="text-white/60 text-[11px] mt-1">Response guaranteed in 1 hour</p>
              </div>
            </div>

            {/* Expert stats */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex -space-x-2">
                {['photo-1500648767791-00dcc994a43e','photo-1580489944761-15a19d654956','photo-1570295999919-56ceb5ecca61'].map((id, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 overflow-hidden">
                    <Image src={`https://images.unsplash.com/${id}?w=80&q=80`} alt="" width={32} height={32} className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white text-xs font-bold">50+ Travel Experts</p>
                <p className="text-white/50 text-[10px]">Available right now</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/contact"
                className="flex-1 bg-amber-500 rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
              >
                <MessageCircle size={16} className="text-white" />
                <span className="text-white text-sm font-bold">WhatsApp Us</span>
              </Link>
              <Link
                href="/contact"
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
              >
                <Phone size={16} className="text-white" />
                <span className="text-white text-sm font-bold">Call Now</span>
              </Link>
            </div>

            <p className="text-white/40 text-[10px] text-center mt-3 font-medium">
              +91 84278 31127 · hello@ylootrips.com
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURED SERVICES ─────────────────────────────────────────────── */}
      <section className="px-4 mb-8">
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Everything You Need</p>
          <h2 className="font-playfair text-2xl text-gray-900 font-semibold">Our Services</h2>
        </div>
        <div className="space-y-3">
          {[
            { icon: Calendar, label: 'Custom Itineraries', sub: 'Tailored to your style, pace & budget', href: '/contact', color: 'bg-indigo-100 text-indigo-600' },
            { icon: Plane, label: 'Flight Bookings', sub: 'Best fares across 50+ airlines', href: '/flights', color: 'bg-blue-100 text-blue-600' },
            { icon: Hotel, label: 'Hotel Reservations', sub: '200+ curated properties across India', href: '/hotels', color: 'bg-amber-100 text-amber-600' },
            { icon: Users, label: 'Group Travel', sub: 'Corporate & group trips — 20% off', href: '/contact', color: 'bg-emerald-100 text-emerald-600' },
          ].map(({ icon: Icon, label, sub, href, color }) => (
            <Link
              key={label} href={href}
              className="flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-gray-100 shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                <Icon size={19} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">{label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">{sub}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
