'use client';

import { useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock, Users, Star, MapPin, Check, X, ChevronDown, Shield,
  RefreshCw, MessageCircle, Zap, Award, Eye, TrendingDown,
  Calendar, ChevronRight, Quote, Phone, CreditCard, Loader2,
  CheckCircle, BadgePercent, ShieldCheck,
} from 'lucide-react';
import { TourJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';

/* ─────────────────────────────────────────────────────────────────── */
/*  Types                                                              */
/* ─────────────────────────────────────────────────────────────────── */
export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string;
  hotel: string;
  activities?: string[];
  image?: string;
}

export interface Review {
  name: string;
  country: string;
  flag: string;
  rating: number;
  text: string;
  date: string;
  trip: string;
}

export interface PackageData {
  // Routing
  slug: string;
  canonicalUrl: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;

  // Hero
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;

  // Quick stats
  duration: string;
  groupSize: string;
  difficulty: string;
  startLocation: string;

  // Pricing
  priceINR: number;
  priceUSD: number;
  originalPriceINR?: number;
  depositPercent?: number; // default 30

  // Content sections
  tagline: string;
  overview: string[];          // array of paragraphs
  highlights: string[];
  gallery: { src: string; alt: string; label: string }[];

  // Itinerary
  itinerary: ItineraryDay[];

  // Inclusions
  includes: string[];
  excludes: string[];

  // Reviews
  reviews: Review[];
  avgRating: number;
  reviewCount: number;

  // FAQ
  faqs: { question: string; answer: string }[];

  // Related packages
  related: { title: string; href: string; priceINR: number; image: string }[];

  // Booking
  whatsappMsg: string;
  bookingHref: string;

  // Schema
  schemaHighlights?: string[];
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Helpers                                                            */
/* ─────────────────────────────────────────────────────────────────── */
function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}
function fmtUSD(n: number) {
  return '$' + n.toLocaleString('en-US');
}
function spotsLeft(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffffffff;
  const v = (Math.abs(h) % 9) + 1;
  return v <= 5 ? v : null;
}
function viewers(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 17 + slug.charCodeAt(i)) & 0xffffffff;
  return (Math.abs(h) % 20) + 4;
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Sticky Booking Sidebar                                             */
/* ─────────────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────────── */
/*  Package Booking Drawer                                             */
/* ─────────────────────────────────────────────────────────────────── */
function PackageBookingDrawer({ pkg, onClose }: { pkg: PackageData; onClose: () => void }) {
  const [tab, setTab] = useState<'pay' | 'callback'>('pay');
  const [guests, setGuests] = useState('2');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbSent, setCbSent] = useState(false);
  const [cbSending, setCbSending] = useState(false);

  const totalPrice = pkg.priceINR * Number(guests || 2);
  const discountAmt = Math.round(totalPrice * 0.05);
  const finalPrice = totalPrice - discountAmt;
  const emi = Math.ceil(finalPrice / 3);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setPayError('');
    try {
      const res = await fetch('/api/market/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          guests,
          packageTitle: pkg.heroTitle,
          destination: pkg.heroTitle,
          sourceUrl: pkg.canonicalUrl,
          ourPrice: finalPrice,
          marketPrice: totalPrice,
          priceDiff: discountAmt,
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setPayError(data.error || 'Payment failed. Please try again.');
      }
    } catch {
      setPayError('Network error. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const handleCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    setCbSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cbName,
          email: 'not-provided@ylootrips.com',
          phone: cbPhone,
          destination: pkg.heroTitle,
          message: `Callback request for: ${pkg.heroTitle} (${pkg.duration}). Price: ₹${pkg.priceINR.toLocaleString('en-IN')}/person. Guests: ${guests}. Client wants custom price + EMI options.`,
        }),
      });
    } catch { /* non-fatal */ }
    setCbSent(true);
    setCbSending(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: 'min(92vh, calc(100dvh - 32px))' }}>
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{pkg.heroTitle}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{pkg.duration} · {pkg.groupSize}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 shrink-0 ml-3">
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100">
          <button onClick={() => setTab('pay')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold transition-colors ${tab === 'pay' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
            <CreditCard size={15} /> Book & Pay Now
          </button>
          <button onClick={() => setTab('callback')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold transition-colors ${tab === 'callback' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
            📞 Free Callback
          </button>
        </div>

        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* PAY TAB */}
          {tab === 'pay' && (
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Number of Guests</label>
                <div className="flex gap-2">
                  {['1','2','3','4','5','6'].map(n => (
                    <button key={n} onClick={() => setGuests(n)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all ${guests === n ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}>{n}</button>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">₹{pkg.priceINR.toLocaleString('en-IN')} × {guests} guest{Number(guests) > 1 ? 's' : ''}</span>
                  <span className="text-gray-700 font-medium">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-green-700">
                  <span className="flex items-center gap-1"><BadgePercent size={13} /> Early bird 5% off</span>
                  <span className="font-semibold">− ₹{discountAmt.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total payable</span>
                  <span className="font-display text-xl text-gray-900">₹{finalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* EMI */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-800">No-cost EMI available</p>
                  <p className="text-[11px] text-blue-500 mt-0.5">3 easy monthly installments</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-display text-blue-800">₹{emi.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-blue-400">/month × 3</p>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: <ShieldCheck size={14} className="text-green-600" />, label: '100% Refund', sub: 'if unavailable' },
                  { icon: <CreditCard size={14} className="text-blue-600" />, label: 'Secure PG', sub: 'Easebuzz' },
                  { icon: <BadgePercent size={14} className="text-amber-600" />, label: '5% Off', sub: 'early bird' },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <div className="flex justify-center mb-1">{icon}</div>
                    <p className="text-[11px] font-bold text-gray-800">{label}</p>
                    <p className="text-[9px] text-gray-400">{sub}</p>
                  </div>
                ))}
              </div>

              {!showForm ? (
                <button onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-gray-800 transition-colors">
                  <CreditCard size={15} /> Proceed to Pay ₹{finalPrice.toLocaleString('en-IN')}
                </button>
              ) : (
                <form onSubmit={handlePay} className="space-y-2.5">
                  <p className="text-xs font-semibold text-gray-700">Enter your details to continue</p>
                  <input required type="text" placeholder="Full name"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900" />
                  <input required type="email" placeholder="Email address"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900" />
                  <input required type="tel" placeholder="Phone number"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900" />
                  {payError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{payError}</p>}
                  <div className="flex gap-2">
                    <button type="submit" disabled={paying}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold text-sm py-3 rounded-xl hover:bg-gray-800 disabled:opacity-60 transition-colors">
                      {paying ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                      {paying ? 'Redirecting…' : `Pay ₹${finalPrice.toLocaleString('en-IN')} via Easebuzz`}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); setPayError(''); }}
                      className="px-4 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Back</button>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center">🔒 Secured by Easebuzz · No hidden charges · Full refund policy</p>
                </form>
              )}
            </div>
          )}

          {/* CALLBACK TAB */}
          {tab === 'callback' && (
            <div className="p-5 bg-[#1a2535] min-h-full">
              {cbSent ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-amber-400/20 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-amber-400" />
                  </div>
                  <p className="font-display text-xl text-white">You're all set! 🎉</p>
                  <p className="text-white/60 text-sm max-w-xs">Our Yloo travel expert will call you within <span className="text-amber-400 font-bold">1 hour</span> with a custom package price, itinerary & flexible EMI plan.</p>
                  <p className="text-white/30 text-[11px] mt-2">📱 Expect a call from +91 84278 31127</p>
                  <button onClick={onClose} className="mt-3 px-6 py-2.5 bg-amber-400 text-gray-900 font-bold rounded-xl text-sm">Done</button>
                </div>
              ) : (
                <form onSubmit={handleCallback} className="space-y-4">
                  <div className="flex items-start gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                      <span className="text-xl">✈️</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Yloo Concierge Callback</p>
                      <p className="text-white/60 text-xs mt-0.5">Get a personal call with custom price, detailed itinerary & flexible EMI — no advance needed.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[['📞', 'Free call'], ['💳', 'EMI plans'], ['🔒', 'No advance']].map(([icon, label]) => (
                      <div key={label} className="bg-white/8 rounded-xl py-2 text-center">
                        <p className="text-lg">{icon}</p>
                        <p className="text-white/60 text-[10px] font-medium mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
                    {[
                      `Custom itinerary for ${pkg.heroTitle}`,
                      'Best price + exclusive discount',
                      'Visa assistance & travel tips',
                      'Flexible 3/6/12 month EMI options',
                    ].map(item => (
                      <p key={item} className="text-white/70 text-xs flex items-center gap-2">
                        <span className="text-amber-400 text-[10px]">✓</span> {item}
                      </p>
                    ))}
                  </div>
                  <input required type="text" placeholder="Your name"
                    value={cbName} onChange={e => setCbName(e.target.value)}
                    className="w-full px-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400" />
                  <input required type="tel" placeholder="Phone number (we'll call you)"
                    value={cbPhone} onChange={e => setCbPhone(e.target.value)}
                    className="w-full px-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400" />
                  <button type="submit" disabled={cbSending}
                    className="w-full flex items-center justify-center gap-2 bg-amber-400 text-gray-900 font-bold text-sm py-3.5 rounded-xl hover:bg-amber-300 disabled:opacity-60 transition-colors">
                    {cbSending ? <Loader2 size={14} className="animate-spin" /> : '📞'}
                    {cbSending ? 'Booking callback…' : 'Get Free Callback + EMI Options'}
                  </button>
                  <p className="text-white/25 text-[10px] text-center">We reply within 1 hour · No spam · No obligation</p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingSidebar({ pkg, onOpenDrawer }: { pkg: PackageData; onOpenDrawer: () => void }) {
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState('');
  const slots = spotsLeft(pkg.slug);
  const live = viewers(pkg.slug);
  const total = pkg.priceINR * guests;
  const emi = Math.ceil(total / 6);
  const deposit = Math.ceil(total * (pkg.depositPercent ?? 30) / 100);

  return (
    <div className="space-y-4">
      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-xl border border-primary/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5">
          <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">Starting from</p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-white">{fmt(pkg.priceINR)}</span>
            <span className="text-white/55 text-sm">/ person</span>
          </div>
          {pkg.originalPriceINR && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white/40 text-xs line-through">{fmt(pkg.originalPriceINR)}</span>
              <span className="bg-terracotta text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {Math.round((1 - pkg.priceINR / pkg.originalPriceINR) * 100)}% OFF
              </span>
            </div>
          )}
          <p className="text-white/50 text-xs mt-1">≈ {fmtUSD(pkg.priceUSD)} for international travelers</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Live signals */}
          <div className="flex items-center gap-2 text-xs text-primary/55">
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span><strong className="text-primary">{live} people</strong> viewing this package right now</span>
          </div>
          {slots && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
              <span className="text-red-700 text-xs font-semibold">Only {slots} slots left for this month!</span>
            </div>
          )}

          {/* Guests */}
          <div>
            <label className="text-[10px] text-primary/50 uppercase tracking-widest font-semibold mb-1.5 block">
              <Users className="w-3 h-3 inline mr-1" />Travelers
            </label>
            <select
              value={guests}
              onChange={e => setGuests(+e.target.value)}
              className="w-full p-3 border border-primary/15 bg-cream/40 text-primary rounded-xl text-sm focus:outline-none focus:border-secondary"
            >
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-[10px] text-primary/50 uppercase tracking-widest font-semibold mb-1.5 block">
              <Calendar className="w-3 h-3 inline mr-1" />Travel Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-primary/15 bg-cream/40 text-primary rounded-xl text-sm focus:outline-none focus:border-secondary"
            />
          </div>

          {/* Price breakdown */}
          <div className="bg-cream/60 rounded-xl p-4 border border-primary/8 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-primary/55">{fmt(pkg.priceINR)} × {guests}</span>
              <span className="font-medium">{fmt(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-700">
              <span>10% WanderLoot cashback</span>
              <span>+{fmt(Math.ceil(total * 0.1))}</span>
            </div>
            <div className="border-t border-primary/10 pt-2 flex justify-between font-semibold">
              <span className="text-primary">Total</span>
              <span className="font-display text-xl text-primary">{fmt(total)}</span>
            </div>
            <div className="text-xs text-primary/40 text-right">
              Advance: {fmt(deposit)} · Balance on arrival
            </div>
          </div>

          {/* EMI */}
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
            <TrendingDown className="w-4 h-4 text-violet-600 shrink-0" />
            <p className="text-xs text-violet-800">
              <strong>No-cost EMI</strong> from <strong>{fmt(emi)}/mo</strong> for 6 months
            </p>
          </div>

          {/* Book button */}
          <button
            onClick={onOpenDrawer}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-cream py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <Zap className="w-4 h-4" />
            Book Now
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/918427831127?text=${encodeURIComponent(pkg.whatsappMsg + (date ? ` Date: ${date}.` : '') + ` Guests: ${guests}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Shield, label: 'Secure Pay', color: 'text-blue-600' },
              { icon: RefreshCw, label: 'Free Cancel', color: 'text-green-600' },
              { icon: Award, label: '4.9★ Rated', color: 'text-amber-600' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-[10px] text-primary/45 uppercase tracking-wide leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details card */}
      <div className="bg-white rounded-2xl border border-primary/10 p-5 space-y-3">
        <p className="text-xs font-bold text-primary uppercase tracking-widest">Package Details</p>
        {[
          { label: 'Duration', value: pkg.duration },
          { label: 'Group Size', value: pkg.groupSize },
          { label: 'Difficulty', value: pkg.difficulty },
          { label: 'Starts At', value: pkg.startLocation },
          { label: 'Cancellation', value: 'Free up to 14 days' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-primary/50">{label}</span>
            <span className="font-medium text-primary text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* Help */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
        <p className="text-xs font-bold text-amber-800 mb-1">Need help planning?</p>
        <p className="text-xs text-amber-700 mb-3">Our experts reply in under 1 hour</p>
        <a
          href="https://wa.me/918427831127"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1ebe5d] px-4 py-2 rounded-full transition-colors"
        >
          <Phone className="w-3 h-3" /> +91 84278 31127
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Mobile Sticky Bar                                                  */
/* ─────────────────────────────────────────────────────────────────── */
function MobileBar({ pkg, onOpenDrawer }: { pkg: PackageData; onOpenDrawer: () => void }) {
  return (
    <div className="lg:hidden fixed bottom-16 left-0 right-0 z-[60] bg-white border-t border-primary/10 shadow-2xl px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-primary/50 uppercase tracking-wider">Starting from</p>
        <p className="font-display text-xl text-primary leading-none">{fmt(pkg.priceINR)}<span className="text-sm font-sans text-primary/40"> /person</span></p>
      </div>
      <a
        href={`https://wa.me/918427831127?text=${encodeURIComponent(pkg.whatsappMsg)}`}
        target="_blank" rel="noopener noreferrer"
        className="shrink-0 px-3 py-2.5 border border-[#25D366] text-[#25D366] text-xs font-bold rounded-xl hover:bg-green-50 transition-colors"
      >
        WhatsApp
      </a>
      <button
        onClick={onOpenDrawer}
        className="shrink-0 flex items-center gap-1.5 bg-primary text-cream px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-secondary transition-colors"
      >
        <Zap className="w-3.5 h-3.5" />
        Book Now
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Main Layout                                                        */
/* ─────────────────────────────────────────────────────────────────── */
export default function PackagePageLayout({ pkg }: { pkg: PackageData }) {
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const slots = spotsLeft(pkg.slug);

  return (
    <>
      {/* Schema */}
      <TourJsonLd
        name={pkg.heroTitle}
        description={pkg.metaDescription}
        url={pkg.canonicalUrl}
        image={pkg.ogImage}
        price={pkg.priceINR.toString()}
        currency="INR"
        duration={pkg.duration}
        startLocation={pkg.startLocation}
        destination={pkg.heroTitle.split(' from')[0].split(' Package')[0].trim()}
        highlights={pkg.schemaHighlights ?? pkg.highlights.slice(0, 6)}
        rating={pkg.avgRating}
        reviewCount={pkg.reviewCount}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Tour Packages', url: 'https://www.ylootrips.com/trips' },
        { name: pkg.heroTitle, url: pkg.canonicalUrl },
      ]} />
      <FaqJsonLd faqs={pkg.faqs} />

      {/* ── HERO ── */}
      <section className="relative h-[62vh] min-h-[420px] overflow-hidden">
        <Image src={pkg.heroImage} alt={pkg.heroTitle} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />

        {/* Urgency badge */}
        {slots && (
          <div className="absolute top-6 right-6 bg-red-500 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full animate-pulse shadow-lg">
            Only {slots} slots left!
          </div>
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="section-container pb-12 w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-white/60 text-xs uppercase tracking-wider mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/trips" className="hover:text-white transition-colors">Packages</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/90">{pkg.heroTitle}</span>
            </nav>
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-2">{pkg.tagline}</p>
            <h1 className="font-display text-display-xl text-white max-w-3xl">{pkg.heroTitle}</h1>
            <p className="text-white/75 text-body-lg mt-3 max-w-2xl">{pkg.heroSubtitle}</p>

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-4 mt-5 text-white/90 text-sm">
              {[
                { icon: Clock, text: pkg.duration },
                { icon: MapPin, text: pkg.startLocation },
                { icon: Users, text: pkg.groupSize },
                { icon: Star, text: `${pkg.avgRating}★ (${pkg.reviewCount} reviews)` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-accent" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE TOP BAR ── */}
      <div className="lg:hidden bg-white border-b border-primary/10 sticky top-0 z-30 shadow-sm px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] text-primary/50 uppercase tracking-wider">Starting from</p>
          <p className="font-display text-xl text-primary">{fmt(pkg.priceINR)}<span className="text-xs font-sans text-primary/40"> /person</span></p>
        </div>
        <div className="flex gap-2">
          <a
            href={`https://wa.me/918427831127?text=${encodeURIComponent(pkg.whatsappMsg)}`}
            target="_blank" rel="noopener noreferrer"
            className="px-3 py-2 border border-primary/15 text-primary text-xs rounded-lg hover:bg-cream transition-colors font-semibold"
          >
            WhatsApp
          </a>
          <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-1.5 bg-primary text-cream px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-secondary transition-colors">
            <Zap className="w-3 h-3" /> Book
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <div className="section-container py-12 md:py-16 pb-32 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">

          {/* ── Left: Content ── */}
          <div className="lg:col-span-2 space-y-14">

            {/* Gallery */}
            <section>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {pkg.gallery.map((img, i) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden rounded-xl group ${i === 0 ? 'col-span-2 md:col-span-1 row-span-2 md:row-span-1' : ''}`}
                    style={{ minHeight: i === 0 ? '260px' : '140px' }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="text-white text-[11px] font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
                        {img.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Overview */}
            <section id="overview">
              <h2 className="font-display text-3xl text-primary mb-5">Package Overview</h2>
              <div className="space-y-4">
                {pkg.overview.map((para, i) => (
                  <p key={i} className="text-primary/70 leading-relaxed text-base">{para}</p>
                ))}
              </div>

              {/* Highlights */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-cream-light border border-primary/8 p-3 rounded-xl">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-primary/80">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section id="itinerary">
              <h2 className="font-display text-3xl text-primary mb-2">Day-by-Day Itinerary</h2>
              <p className="text-primary/50 text-sm mb-6">Detailed plan — every day planned to perfection</p>
              <div className="space-y-3">
                {pkg.itinerary.map((day) => (
                  <div key={day.day} className="border border-primary/10 bg-cream-light rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-cream-dark/50 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-full bg-primary text-cream text-sm font-bold flex items-center justify-center shrink-0">
                        {day.day}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-primary text-sm">Day {day.day}: {day.title}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-primary/45">
                          {day.meals && <span>🍽 {day.meals}</span>}
                          {day.hotel && day.hotel !== 'Departure' && <span>🏨 {day.hotel}</span>}
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-primary/40 shrink-0 transition-transform duration-300 ${openDay === day.day ? 'rotate-180' : ''}`} />
                    </button>
                    {openDay === day.day && (
                      <div className="px-5 pb-5 border-t border-primary/8">
                        <p className="text-primary/70 text-sm leading-relaxed mt-4">{day.description}</p>
                        {day.activities && day.activities.length > 0 && (
                          <ul className="mt-3 space-y-1.5">
                            {day.activities.map((a, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-primary/65">
                                <ChevronRight className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Includes / Excludes */}
            <section id="inclusions">
              <h2 className="font-display text-3xl text-primary mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-green-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Included
                  </h3>
                  <ul className="space-y-2.5">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-primary/75">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <X className="w-4 h-4" /> Not Included
                  </h3>
                  <ul className="space-y-2.5">
                    {pkg.excludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-primary/75">
                        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section id="reviews">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-3xl text-primary">Traveler Reviews</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-5 h-5 ${i <= Math.round(pkg.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-primary">{pkg.avgRating}</span>
                    <span className="text-primary/45 text-sm">({pkg.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pkg.reviews.map((r, i) => (
                  <div key={i} className="bg-cream-light border border-primary/8 rounded-2xl p-5 relative">
                    <Quote className="absolute top-4 right-4 w-6 h-6 text-accent/30" />
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-lg shrink-0">
                        {r.flag}
                      </div>
                      <div>
                        <div className="font-semibold text-primary text-sm">{r.name}</div>
                        <div className="text-xs text-primary/45">{r.country} · {r.date}</div>
                      </div>
                      <div className="ml-auto flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-primary/65 text-sm leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
                    <p className="text-[10px] text-accent uppercase tracking-wider mt-2 font-medium">{r.trip}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Mid-page CTA */}
            <section className="bg-primary rounded-2xl p-8 text-center text-cream">
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3">Ready to Book?</p>
              <h3 className="font-display text-2xl md:text-3xl mb-3">{pkg.heroTitle}</h3>
              <p className="text-cream/60 text-sm mb-6 max-w-md mx-auto">
                Secure your spot today. Only {slots ?? 8} slots available this season.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => setDrawerOpen(true)} className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-warm text-primary px-8 py-3.5 text-sm font-bold uppercase tracking-widest rounded-xl transition-all">
                  <Zap className="w-4 h-4" /> Book Now — {fmt(pkg.priceINR)}/person
                </button>
                <a
                  href={`https://wa.me/918427831127?text=${encodeURIComponent(pkg.whatsappMsg)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-3.5 text-sm font-semibold rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="font-display text-3xl text-primary mb-2">Frequently Asked Questions</h2>
              <p className="text-primary/50 text-sm mb-6">Everything you need to know before booking</p>
              <div className="space-y-3">
                {pkg.faqs.map((faq, i) => (
                  <div key={i} className="border border-primary/10 bg-cream-light rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-cream-dark/40 transition-colors"
                    >
                      <span className="font-semibold text-primary text-sm pr-4">{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-primary/40 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-5 border-t border-primary/8">
                        <p className="pt-4 text-primary/65 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Related packages */}
            {pkg.related.length > 0 && (
              <section>
                <h2 className="font-display text-3xl text-primary mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {pkg.related.map((r, i) => (
                    <Link key={i} href={r.href} className="group bg-cream-light border border-primary/8 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                      <div className="relative h-36">
                        <Image src={r.image} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-primary/20" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-primary group-hover:text-secondary transition-colors line-clamp-2">{r.title}</h3>
                        <p className="text-xs text-secondary mt-1 font-medium">From {fmt(r.priceINR)}/person</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <BookingSidebar pkg={pkg} onOpenDrawer={() => setDrawerOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <MobileBar pkg={pkg} onOpenDrawer={() => setDrawerOpen(true)} />

      {/* Booking Drawer */}
      {drawerOpen && <PackageBookingDrawer pkg={pkg} onClose={() => setDrawerOpen(false)} />}
    </>
  );
}
