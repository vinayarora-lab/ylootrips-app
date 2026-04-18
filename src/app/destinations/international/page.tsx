'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Globe, MessageCircle, Star, Clock, Users, X, CreditCard, Loader2, CheckCircle, ShieldCheck, BadgePercent } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useWallet } from '@/context/WalletContext';
import PaymentOptions from '@/components/PaymentOptions';
import PromoCodeInput from '@/components/PromoCodeInput';

const regions = [
  { label: '🌐 All', value: 'All' },
  { label: '🌏 Southeast Asia', value: 'Southeast Asia' },
  { label: '🌍 Middle East', value: 'Middle East' },
  { label: '🇪🇺 Europe', value: 'Europe' },
  { label: '🌿 South Asia', value: 'South Asia' },
  { label: '🌊 Island Escapes', value: 'Islands' },
];

interface IntlDestination {
  name: string;
  country: string;
  region: string;
  image: string;
  description: string;
  priceINR: number;
  duration: string;
  rating: number;
  reviews: number;
  href: string;
  badge?: string;
  badgeColor?: string;
  highlights: string[];
  visa: string;
}

const INTERNATIONAL_DESTINATIONS: IntlDestination[] = [
  {
    name: 'Bali, Indonesia',
    country: 'Indonesia',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    description: 'Rice terraces, ancient temples, private villas and world-class sunsets — the Island of Gods beckons.',
    priceINR: 52499,
    duration: '6 Nights / 7 Days',
    rating: 4.9,
    reviews: 623,
    href: '/bali-honeymoon-package',
    badge: 'Most Popular',
    badgeColor: 'bg-pink-500',
    highlights: ['Tegalalang Rice Terrace', 'Private Pool Villa', 'Tanah Lot Sunset', 'Uluwatu Kecak Dance'],
    visa: 'Visa free for Indians',
  },
  {
    name: 'Dubai, UAE',
    country: 'UAE',
    region: 'Middle East',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    description: 'Burj Khalifa, desert safaris, gold souks and world-class malls — Dubai never sleeps.',
    priceINR: 36499,
    duration: '5 Nights / 6 Days',
    rating: 4.8,
    reviews: 1284,
    href: '/dubai-tour-package-from-delhi',
    badge: 'Best Value',
    badgeColor: 'bg-gray-800',
    highlights: ['Burj Khalifa At The Top', 'Desert Safari BBQ', 'Dubai Mall', 'Palm Jumeirah'],
    visa: 'Visa on arrival',
  },
  {
    name: 'Bangkok & Phuket, Thailand',
    country: 'Thailand',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80',
    description: 'Grand Palace, Phi Phi islands, floating markets, world-class street food and legendary nightlife.',
    priceINR: 49499,
    duration: '5 Nights / 6 Days',
    rating: 4.8,
    reviews: 2041,
    href: '/thailand-budget-trip',
    badge: 'Top Rated',
    badgeColor: 'bg-green-600',
    highlights: ['Phi Phi Islands Day Trip', 'Grand Palace', 'Floating Markets', 'Thai Cooking Class'],
    visa: 'Visa free (30 days)',
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800&q=80',
    description: 'Futuristic gardens, Universal Studios, Marina Bay Sands and Michelin-starred street food.',
    priceINR: 32999,
    duration: '4 Nights / 5 Days',
    rating: 4.8,
    reviews: 892,
    href: '/singapore-tour-package',
    badge: 'Family Fave',
    badgeColor: 'bg-blue-600',
    highlights: ['Universal Studios', 'Gardens by the Bay', 'Marina Bay Sands', 'Sentosa Island'],
    visa: 'Visa on arrival / e-Visa',
  },
  {
    name: 'Maldives',
    country: 'Maldives',
    region: 'Islands',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    description: 'Overwater villas, crystal lagoons and coral reefs — the world\'s ultimate luxury escape.',
    priceINR: 89999,
    duration: '4 Nights / 5 Days',
    rating: 4.9,
    reviews: 437,
    href: '/maldives-luxury-package',
    badge: 'Luxury',
    badgeColor: 'bg-violet-600',
    highlights: ['Overwater Bungalow', 'Snorkelling & Diving', 'Sunset Cruise', 'Private Beach Dinner'],
    visa: 'Visa free (30 days)',
  },
  {
    name: 'Sri Lanka',
    country: 'Sri Lanka',
    region: 'South Asia',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80',
    description: 'Ancient ruins, tea plantations, elephant encounters and pristine beaches just 1.5 hrs from India.',
    priceINR: 28999,
    duration: '5 Nights / 6 Days',
    rating: 4.7,
    reviews: 312,
    href: '/contact?destination=sri-lanka',
    highlights: ['Sigiriya Rock Fortress', 'Kandy Temple', 'Tea Estates', 'Whale Watching Mirissa'],
    visa: 'e-Visa (₹2,500)',
  },
  {
    name: 'Vietnam',
    country: 'Vietnam',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    description: 'Ha Long Bay, Hoi An lanterns, Hanoi street food and Da Nang beaches — Asia\'s rising star.',
    priceINR: 51499,
    duration: '7 Nights / 8 Days',
    rating: 4.8,
    reviews: 289,
    href: '/contact?destination=vietnam',
    badge: 'Trending',
    badgeColor: 'bg-gray-800',
    highlights: ['Ha Long Bay Cruise', 'Hoi An Old Town', 'Hanoi Street Food Tour', 'Da Nang Beach'],
    visa: 'e-Visa ($25)',
  },
  {
    name: 'Japan',
    country: 'Japan',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    description: 'Cherry blossoms, bullet trains, ancient temples and the world\'s best food culture.',
    priceINR: 172799,
    duration: '7 Nights / 8 Days',
    rating: 4.9,
    reviews: 198,
    href: '/contact?destination=japan',
    badge: 'Premium',
    badgeColor: 'bg-rose-600',
    highlights: ['Mt. Fuji View', 'Tokyo Shibuya', 'Kyoto Temples', 'Osaka Street Food'],
    visa: 'Visa required (₹4,500)',
  },
  {
    name: 'Georgia & Azerbaijan',
    country: 'Georgia',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80',
    description: 'Old Tbilisi, Caucasus mountains, Baku\'s flame towers — budget Europe for Indian travelers.',
    priceINR: 54999,
    duration: '6 Nights / 7 Days',
    rating: 4.7,
    reviews: 156,
    href: '/contact?destination=georgia-azerbaijan',
    highlights: ['Old Tbilisi', 'Kazbegi Mountains', 'Baku Old City', 'Flame Towers'],
    visa: 'Visa free (Georgia) / e-Visa (Azer)',
  },
  {
    name: 'Paris & Europe',
    country: 'France',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description: 'Eiffel Tower, Louvre, Swiss Alps, Rome\'s Colosseum — the European dream holiday.',
    priceINR: 189999,
    duration: '10 Nights / 11 Days',
    rating: 4.9,
    reviews: 421,
    href: '/contact?destination=europe',
    badge: 'Dream Trip',
    badgeColor: 'bg-blue-700',
    highlights: ['Eiffel Tower', 'Swiss Alps', 'Colosseum Rome', 'Amsterdam Canals'],
    visa: 'Schengen Visa required',
  },
  {
    name: 'Nepal & Bhutan',
    country: 'Nepal',
    region: 'South Asia',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    description: 'Everest base camp treks, Tiger\'s Nest monastery and Himalayan kingdoms just next door.',
    priceINR: 37799,
    duration: '6 Nights / 7 Days',
    rating: 4.8,
    reviews: 267,
    href: '/contact?destination=nepal-bhutan',
    highlights: ['Everest Base Camp', "Tiger's Nest", 'Pokhara Lakeside', 'Paro Valley'],
    visa: 'No visa for Indians (Nepal)',
  },
  {
    name: 'Kenya Safari',
    country: 'Kenya',
    region: 'Islands',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
    description: 'Witness the Great Migration, big five safaris and Masai Mara — the trip of a lifetime.',
    priceINR: 224999,
    duration: '7 Nights / 8 Days',
    rating: 4.9,
    reviews: 134,
    href: '/contact?destination=kenya-safari',
    badge: 'Bucket List',
    badgeColor: 'bg-gray-800',
    highlights: ['Masai Mara Safari', 'Great Migration', 'Amboseli Elephant Park', 'Nairobi'],
    visa: 'e-Visa required',
  },
];

// ── Booking Drawer ────────────────────────────────────────────────────────────
function BookingDrawer({ d, onClose }: { d: IntlDestination; onClose: () => void }) {
  const [tab, setTab] = useState<'pay' | 'callback'>('pay');
  const [guests, setGuests] = useState('2');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [payStep, setPayStep] = useState<'options' | 'form'>('options');
  const [chargeNow, setChargeNow] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<'full' | 'emi' | 'partial'>('full');
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoCashback, setPromoCashback] = useState(0);
  const [applyWallet, setApplyWallet] = useState(false);
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbSent, setCbSent] = useState(false);
  const [cbSending, setCbSending] = useState(false);
  const { balance: walletBalance, addCashback, deductBalance } = useWallet();

  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    return () => { document.body.style.overflow = prev; };
  }, []);

  const totalPrice = d.priceINR * Number(guests || 2);
  const discountAmt = Math.round(totalPrice * 0.05);
  const priceAfterDiscount = totalPrice - discountAmt;
  const maxWalletUsable = Math.round(priceAfterDiscount * 0.10);
  const walletDeduction = applyWallet ? Math.min(walletBalance, maxWalletUsable) : 0;
  const finalPrice = Math.max(0, priceAfterDiscount - walletDeduction);

  const handlePaymentSelected = (payload: { mode: 'full' | 'emi' | 'partial'; amountNow: number; paymentMethod?: string }) => {
    setChargeNow(payload.amountNow);
    setPaymentMode(payload.mode);
    setPaymentMethod(payload.paymentMethod ?? 'upi');
    setPayStep('form');
  };

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
          packageTitle: d.name,
          destination: d.name,
          sourceUrl: `https://ylootrips.com${d.href}`,
          ourPrice: finalPrice,
          chargeNow: chargeNow ?? finalPrice,
          paymentMode, paymentMethod,
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
          destination: d.name,
          message: `Callback request for international trip: ${d.name} (${d.duration}). Budget: ₹${d.priceINR.toLocaleString('en-IN')}/person. Guests: ${guests}. Client wants custom price + EMI options.`,
        }),
      });
    } catch { /* non-fatal */ }
    setCbSent(true);
    setCbSending(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[calc(92vh-64px)] sm:max-h-[92vh] flex flex-col mb-16 sm:mb-0">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{d.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {d.duration} &nbsp;·&nbsp;
              <Star className="w-3 h-3 fill-gray-400 text-gray-400" /> {d.rating} ({d.reviews.toLocaleString()} reviews)
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 shrink-0 ml-3">
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setTab('pay')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold transition-colors ${
              tab === 'pay' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <CreditCard size={15} /> Book & Pay Now
          </button>
          <button
            onClick={() => setTab('callback')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold transition-colors ${
              tab === 'callback' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            📞 Free Callback
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* ── PAY TAB ── */}
          {tab === 'pay' && (
            <div className="p-4 space-y-4">
              {/* Guests selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Number of Guests</label>
                <div className="flex gap-2">
                  {['1','2','3','4','5','6'].map(n => (
                    <button key={n} onClick={() => { setGuests(n); setPayStep('options'); setChargeNow(null); }}
                      className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all ${
                        guests === n ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}>{n}</button>
                  ))}
                </div>
              </div>

              {/* Promo code */}
              {payStep === 'options' && (
                <PromoCodeInput
                  orderTotal={priceAfterDiscount}
                  appliedCode={promoCode}
                  discountAmount={promoCashback}
                  onApply={(code, discount) => {
                    const cb = addCashback(discount, `PROMO-${code}-${Date.now()}`, `Promo code: ${code}`);
                    setPromoCode(code); setPromoCashback(cb);
                  }}
                  onRemove={() => {
                    if (promoCashback > 0) deductBalance(promoCashback, `PROMO-REMOVE-${promoCode}`);
                    setPromoCode(null); setPromoCashback(0);
                  }}
                />
              )}

              {/* WanderLoot wallet */}
              {payStep === 'options' && walletBalance > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">WanderLoot 💸</p>
                      <p className="text-xs text-gray-600">Balance: ₹{walletBalance.toLocaleString('en-IN')} · Use up to ₹{maxWalletUsable.toLocaleString('en-IN')}</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={applyWallet} onChange={e => { setApplyWallet(e.target.checked); setPayStep('options'); setChargeNow(null); }} className="w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-700">Apply</span>
                    </label>
                  </div>
                  {applyWallet && walletDeduction > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                      <span className="text-gray-700">💰 WanderLoot applied</span>
                      <span className="font-semibold text-green-700">−₹{walletDeduction.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Payment Options */}
              {payStep === 'options' && (
                <PaymentOptions
                  tripPrice={finalPrice}
                  tripTitle={d.name}
                  onProceed={(payload) => handlePaymentSelected(payload)}
                />
              )}

              {/* Step 2: Customer details */}
              {payStep === 'form' && (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-green-800">
                        {paymentMode === 'partial' ? '20% Advance Selected' : paymentMode === 'emi' ? 'EMI Selected' : 'Full Payment Selected'}
                      </p>
                      <p className="text-[11px] text-green-600 mt-0.5">Paying now: ₹{(chargeNow ?? finalPrice).toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={() => { setPayStep('options'); setPayError(''); }} className="text-xs text-green-700 underline">Change</button>
                  </div>
                  <form onSubmit={handlePay} className="space-y-2.5">
                    <p className="text-xs font-semibold text-gray-700">Enter your details to continue</p>
                    <input required type="text" placeholder="Full name"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900" />
                    <input required type="email" placeholder="Email address"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900" />
                    <input required type="tel" placeholder="Phone number"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900" />
                    {payError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{payError}</p>}
                    <button type="submit" disabled={paying}
                      className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-60 transition-colors">
                      {paying ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                      {paying ? 'Redirecting…' : `Pay ₹${(chargeNow ?? finalPrice).toLocaleString('en-IN')} via Easebuzz`}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center">🔒 Secured by Easebuzz · No hidden charges · Full refund policy</p>
                  </form>
                </div>
              )}
            </div>
          )}
          {/* ── CALLBACK TAB ── */}
          {tab === 'callback' && (
            <div className="p-5 bg-[#1a2535] min-h-full">
              {cbSent ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white/70" />
                  </div>
                  <p className="font-display text-xl text-white">You're all set! 🎉</p>
                  <p className="text-white/60 text-sm max-w-xs">Our Yloo travel expert will call you within <span className="text-white font-bold">1 hour</span> with a custom {d.name} package price, itinerary & flexible EMI plan.</p>
                  <p className="text-white/30 text-[11px] mt-2">📱 Expect a call from +91 84278 31127</p>
                  <button onClick={onClose} className="mt-3 px-6 py-2.5 bg-white text-gray-900 font-bold rounded-xl text-sm">Done</button>
                </div>
              ) : (
                <form onSubmit={handleCallback} className="space-y-4">
                  <div className="flex items-start gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-xl">✈️</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Yloo Concierge Callback</p>
                      <p className="text-white/60 text-xs mt-0.5">Get a personal call with custom price, detailed itinerary & flexible EMI — no advance needed.</p>
                    </div>
                  </div>

                  {/* Trust chips */}
                  <div className="grid grid-cols-3 gap-2">
                    {[['📞', 'Free call'], ['💳', 'EMI plans'], ['🔒', 'No advance']].map(([icon, label]) => (
                      <div key={label} className="bg-white/8 rounded-xl py-2 text-center">
                        <p className="text-lg">{icon}</p>
                        <p className="text-white/60 text-[10px] font-medium mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* What you get */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
                    {[
                      'Custom itinerary for ' + d.name,
                      'Best price + exclusive discount',
                      'Visa assistance & travel tips',
                      'Flexible 3/6/12 month EMI options',
                    ].map(item => (
                      <p key={item} className="text-white/70 text-xs flex items-center gap-2">
                        <span className="text-white/60 text-[10px]">✓</span> {item}
                      </p>
                    ))}
                  </div>

                  <input required type="text" placeholder="Your name"
                    value={cbName} onChange={e => setCbName(e.target.value)}
                    className="w-full px-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40" />
                  <input required type="tel" placeholder="Phone number (we'll call you)"
                    value={cbPhone} onChange={e => setCbPhone(e.target.value)}
                    className="w-full px-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40" />

                  <button type="submit" disabled={cbSending}
                    className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 font-bold text-sm py-3.5 rounded-xl hover:bg-gray-100 disabled:opacity-60 transition-colors">
                    {cbSending ? <Loader2 size={14} className="animate-spin" /> : '📞'}
                    {cbSending ? 'Booking callback…' : 'Get Free Callback + EMI Options'}
                  </button>
                  <p className="text-white/30 text-[10px] text-center">Mon–Sun 9am–10pm · Response within 1 hour</p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function IntlCard({ d }: { d: IntlDestination }) {
  const { currency } = useCurrency();
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden border border-primary/8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
        {/* Image */}
        <Link href={d.href} className="block relative aspect-[4/3] overflow-hidden shrink-0">
          <Image
            src={d.image} alt={d.name} fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Country pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full">
            <MapPin className="w-2.5 h-2.5" />
            {d.country}
          </div>

          {/* Badge */}
          {d.badge && (
            <div className={`absolute top-3 right-3 ${d.badgeColor} text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full`}>
              {d.badge}
            </div>
          )}

          {/* Rating */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
            <Star className="w-3 h-3 fill-white text-white" />
            <span className="text-xs font-bold">{d.rating}</span>
            <span className="text-[10px] opacity-70">({d.reviews.toLocaleString()})</span>
          </div>

          {/* Visa info */}
          <div className="absolute bottom-3 right-3 bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full">
            {d.visa}
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <h3 className="font-display text-xl text-primary leading-tight">{d.name}</h3>
          <p className="text-sm text-secondary leading-relaxed line-clamp-2">{d.description}</p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-secondary">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{d.duration}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />Small group</span>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-1">
            {d.highlights.slice(0, 3).map((h) => (
              <span key={h} className="text-[10px] bg-primary/5 text-primary/70 px-2 py-0.5 rounded-full">{h}</span>
            ))}
            {d.highlights.length > 3 && (
              <span className="text-[10px] text-primary/40 px-1 py-0.5">+{d.highlights.length - 3} more</span>
            )}
          </div>

          {/* Trust badges strip */}
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">
              💳 EMI from ₹{Math.ceil(d.priceINR / 3).toLocaleString('en-IN')}/mo
            </span>
            <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-semibold">
              🔒 Secure Easebuzz
            </span>
            <span className="text-[10px] bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-full font-semibold">
              5% Early Bird
            </span>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-3 border-t border-primary/8 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-secondary uppercase tracking-wider block">from</span>
              <span className="font-display text-xl text-primary">{formatPriceWithCurrency(d.priceINR, currency)}</span>
              <span className="text-[10px] text-secondary"> / person</span>
            </div>
            <div className="flex gap-2">
              <Link
                href={d.href}
                className="flex items-center gap-1 text-primary/60 text-xs font-medium px-3 py-2.5 rounded-full border border-primary/15 hover:border-primary/40 transition-colors"
              >
                Details <ArrowUpRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setShowDrawer(true)}
                className="flex items-center gap-1.5 bg-primary text-cream text-xs font-bold px-4 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" /> Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDrawer && <BookingDrawer d={d} onClose={() => setShowDrawer(false)} />}
    </>
  );
}

export default function InternationalDestinationsPage() {
  const [activeRegion, setActiveRegion] = useState('All');

  const filtered = useMemo(() =>
    activeRegion === 'All'
      ? INTERNATIONAL_DESTINATIONS
      : INTERNATIONAL_DESTINATIONS.filter((d) => d.region === activeRegion),
    [activeRegion]
  );

  return (
    <>
      <PageHero
        title="Explore the World"
        subtitle="Curated international journeys designed for Indian travelers — visa support, INR pricing, 24/7 on-trip assistance."
        breadcrumb="International"
        backgroundImage="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
        overlayClassName="bg-gradient-to-b from-secondary/40 via-primary/60 to-primary/90"
      />

      {/* Trust bar */}
      <section className="py-6 bg-secondary/5 border-b border-primary/8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              '✈️  Visa assistance included',
              '💳  INR pricing · no forex surprises',
              '🗣  Hindi & English-speaking guides',
              '📞  24/7 on-trip emergency support',
            ].map((item) => (
              <span key={item} className="text-xs md:text-sm text-primary/70 font-medium">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Region filter */}
      <section className="py-4 md:py-5 bg-cream-dark border-b border-primary/8 sticky top-0 z-30">
        <div className="section-container">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {regions.map((r) => (
              <button
                key={r.value}
                onClick={() => setActiveRegion(r.value)}
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-200 rounded-full ${
                  activeRegion === r.value
                    ? 'bg-secondary text-cream shadow-sm'
                    : 'bg-white text-primary/70 border border-primary/15 hover:border-secondary/40 hover:text-secondary'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destination grid */}
      <section className="py-4 bg-cream">
        <div className="section-container">
          <div className="flex flex-col justify-between gap-2 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-2">
                {activeRegion === 'All' ? 'Across the globe' : activeRegion}
              </p>
              <h2 className="font-playfair text-2xl text-primary font-semibold">
                {activeRegion === 'All' ? 'Where in the world?' : `Explore ${activeRegion}`}
              </h2>
            </div>
            <p className="text-sm text-primary/50">{filtered.length} destination{filtered.length !== 1 ? 's' : ''}</p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map((d) => (
                <IntlCard key={d.name} d={d} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-secondary">
              <p className="text-4xl mb-3">🌍</p>
              <p className="font-display text-xl">Coming soon</p>
              <p className="text-sm mt-1">We're adding more destinations — WhatsApp us for custom packages.</p>
            </div>
          )}
        </div>
      </section>

      {/* Countries we cover */}
      <section className="py-10 bg-cream-dark border-y border-primary/8">
        <div className="section-container text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-5">Popular with Indian travelers</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {['🇹🇭','🇧🇦','🇬🇧','🇫🇷','🇮🇹','🇪🇸','🇬🇷','🇹🇷','🇯🇵','🇸🇬','🇦🇺','🇺🇸','🇲🇻','🇰🇪','🇵🇹','🇳🇿','🇨🇭','🇦🇹','🇲🇦','🇦🇪'].map(flag => (
              <span key={flag} className="text-2xl">{flag}</span>
            ))}
          </div>
          <p className="text-primary/40 text-xs mt-3">+ many more</p>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-8 px-4 bg-gray-900 text-white">
        <div className="text-center">
          <Globe className="w-8 h-8 text-white/30 mx-auto mb-3" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#C4A77D] mb-2">International Travel Specialists</p>
          <h2 className="font-playfair text-2xl font-semibold mb-3">Ready to explore the world?</h2>
          <p className="text-white/55 text-[13px] leading-relaxed mb-6">
            We handle visa, flights, hotels & guides. You just pack and go.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/918427831127?text=Hi%2C+I'm+interested+in+an+international+trip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-2xl font-bold text-sm active:scale-[0.97] transition-transform"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
            <Link href="/contact" className="flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3.5 rounded-2xl font-semibold text-sm active:scale-[0.97] transition-transform">
              Plan My World Trip
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
