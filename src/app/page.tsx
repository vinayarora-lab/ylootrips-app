'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, Heart, Shield, Star, LucideIcon, Wallet, Gift, TrendingUp, Zap, X, CreditCard, Loader2, CheckCircle, BadgePercent, ShieldCheck, Copy, Check, Users } from 'lucide-react';
import Hero from '@/components/Hero';
import MobileCategories from '@/components/MobileCategories';
import DestinationCard from '@/components/DestinationCard';
import InternationalTestimonials from '@/components/InternationalTestimonials';
import TrustHub from '@/components/TrustHub';
import PlanningHub from '@/components/PlanningHub';
import ReelToTripTeaser from '@/components/ReelToTripTeaser';
import HiddenSpots from '@/components/HiddenSpots';
import TrendingPackages from '@/components/TrendingPackages';
import LimitedOffersBanner from '@/components/LimitedOffersBanner';
import { api } from '@/lib/api';
import { Destination } from '@/types';
import { useVisitor } from '@/context/VisitorContext';
import { useWallet } from '@/context/WalletContext';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';

interface CmsContent {
  pageKey: string;
  pageTitle: string;
  pageDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  sections: Array<{
    sectionKey: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    backgroundColor: string;
  }>;
  stats: Array<{ value: string; label: string }>;
  features: Array<{ icon: string; title: string; description: string }>;
}

// Icon map
const iconMap: Record<string, LucideIcon> = {
  compass: Compass,
  heart: Heart,
  shield: Shield,
  star: Star,
};

// ── Home package type ─────────────────────────────────────────────────────────
interface HomePkg {
  label: string;
  price: string;
  priceNum: number;
  nights: string;
  tag: string;
  href: string;
  urgency: string;
  emoji?: string;
  tagColor?: string;
}

// ── Static details for each package ───────────────────────────────────────────
const PKG_DETAILS: Record<string, { includes: string[]; excludes: string[]; itinerary: string[] }> = {
  '/goa-tour-package': {
    includes: ['3 nights hotel (3★/4★)', 'Airport/railway transfers', 'North & South Goa sightseeing', 'Water sports session (1 hr)', 'Old Goa churches visit', '24/7 travel coordinator'],
    excludes: ['Flights/train tickets', 'Meals (unless specified)', 'Personal expenses & tips', 'Dudhsagar jeep safari (optional ₹1,500)'],
    itinerary: ['Day 1: Arrive Goa → hotel check-in → Baga Beach evening', 'Day 2: North Goa (Calangute, Anjuna, Fort Aguada)', 'Day 3: South Goa (Palolem, Colva) + water sports', 'Day 4: Old Goa churches → departure'],
  },
  '/manali-tour-package': {
    includes: ['4 nights hotel', 'Volvo/cab pickup-drop (Manali)', 'Solang Valley & snow activities', 'Rohtang Pass (subject to permit)', 'Kullu/Manikaran sightseeing', 'Inner-line permit fees'],
    excludes: ['Delhi–Manali flights or Volvo bus fare', 'Rohtang jeep charges (₹1,800–2,200)', 'Meals', 'Personal expenses'],
    itinerary: ['Day 1: Arrival Manali → hotel check-in → Mall Road', 'Day 2: Solang Valley / Rohtang Pass', 'Day 3: Manali local sightseeing (Hadimba, Vashisht)', 'Day 4: Kullu + Manikaran Sahib', 'Day 5: Departure'],
  },
  '/kashmir-tour-package': {
    includes: ['5 nights (hotel + 1N houseboat)', 'Shikara ride on Dal Lake', 'Gulmarg, Pahalgam & Sonamarg day trips', 'All transfers within Kashmir', 'Mughal Gardens & Shankaracharya visit'],
    excludes: ['Flights to Srinagar', 'Gulmarg Gondola (₹700–1,400 extra)', 'Pahalgam pony/ATV (extra)', 'Meals', 'Personal expenses'],
    itinerary: ['Day 1: Arrive Srinagar → Mughal Gardens → houseboat', 'Day 2: Gulmarg (snow activities)', 'Day 3: Pahalgam (Betaab Valley, Aru)', 'Day 4: Sonamarg (Thajiwas Glacier)', 'Day 5: Srinagar local → check-in hotel', 'Day 6: Departure'],
  },
  '/dubai-tour-package-from-delhi': {
    includes: ['5 nights 4★ hotel', 'Visa assistance', 'Desert Safari (dune bashing + BBQ dinner)', 'Burj Khalifa 124th floor entry', 'Dubai Frame + Dubai Frame', 'All airport transfers'],
    excludes: ['Return flights', 'Meals (breakfast only)', 'Dubai visa fee (₹4,500–6,000)', 'Personal shopping', 'Optional tours'],
    itinerary: ['Day 1: Arrive Dubai → hotel → Dubai Marina walk', 'Day 2: Dubai city tour (Gold Souk, Spice Souk, Burj Al Arab)', 'Day 3: Desert Safari + BBQ dinner', 'Day 4: Abu Dhabi day trip (Sheikh Zayed Mosque)', 'Day 5: Burj Khalifa + Dubai Mall', 'Day 6: Departure'],
  },
  '/bali-honeymoon-package': {
    includes: ['6 nights 4★ hotel/villa', 'Airport transfers', 'Uluwatu sunset temple + Kecak show', 'Tegallalang Rice Terraces', 'Ubud art & culture day', 'Tanah Lot temple visit'],
    excludes: ['International flights', 'Visa on arrival (free for Indians)', 'Meals (breakfast only)', 'Personal expenses', 'Nusa Penida boat extra (₹2,500)'],
    itinerary: ['Day 1: Arrive Bali (DPS) → Seminyak hotel', 'Day 2: Seminyak & Kuta beach day', 'Day 3: Ubud (rice terraces + monkey forest)', 'Day 4: Uluwatu sunset temple', 'Day 5: Nusa Penida day trip', 'Day 6: Tanah Lot + spa day', 'Day 7: Departure'],
  },
  '/singapore-tour-package': {
    includes: ['4 nights hotel (Orchard/City area)', 'Sentosa cable car', 'Gardens by the Bay (Cloud Forest)', 'Universal Studios entry', 'MRT city pass (3 days)', 'Airport transfers'],
    excludes: ['Flights', 'Meals', 'Singapore visa (₹3,500–4,500)', 'Personal shopping', 'Night Safari (optional ₹3,200)'],
    itinerary: ['Day 1: Arrive Singapore → Marina Bay Sands view', 'Day 2: Sentosa (Universal Studios)', 'Day 3: Gardens by the Bay + Clarke Quay evening', 'Day 4: Little India, Chinatown, Orchard Rd', 'Day 5: Departure'],
  },
  '/thailand-budget-trip': {
    includes: ['5 nights hotel (Bangkok 3★ + Pattaya 2★)', 'Bangkok–Pattaya–Bangkok transfers', 'Pattaya city tour & Walking Street', 'Floating Market visit', 'Coral Island speedboat trip', 'Airport pickup & drop'],
    excludes: ['Flights to Bangkok', 'Visa on arrival fee (~₹2,000)', 'Meals (breakfast only)', 'Personal expenses', 'Alcazar Show (optional ₹1,200)'],
    itinerary: ['Day 1: Arrive Bangkok → hotel → night bazaar', 'Day 2: Bangkok temples (Grand Palace, Wat Pho)', 'Day 3: Transfer to Pattaya → Coral Island', 'Day 4: Pattaya city tour + Floating Market', 'Day 5: Return Bangkok → shopping (MBK, Chatuchak)', 'Day 6: Departure'],
  },
  '/maldives-luxury-package': {
    includes: ['4 nights overwater/beach villa', 'Speedboat or seaplane transfer', 'Breakfast & dinner (half board)', 'Snorkeling equipment', 'Sunset dolphin cruise', 'Complimentary kayaking'],
    excludes: ['International flights to Malé', 'Lunch & alcoholic beverages', 'Spa treatments', 'Water sports add-ons', 'Personal expenses'],
    itinerary: ['Day 1: Arrive Malé → seaplane/speedboat → resort check-in + beach', 'Day 2: Snorkeling, lagoon swim, sunset cruise', 'Day 3: Sandbank picnic, kayaking, free day at beach', 'Day 4: Early morning dolphin watching → checkout', 'Day 5: Transfer Malé → departure'],
  },
};

// ── Payment drawer for homepage strip ────────────────────────────────────────
function HomeBookingDrawer({ pkg, onClose }: { pkg: HomePkg; onClose: () => void }) {
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
  const [showItinerary, setShowItinerary] = useState(false);

  const details = PKG_DETAILS[pkg.href];
  const totalPrice = pkg.priceNum * Number(guests || 2);
  const discountAmt = Math.round(totalPrice * 0.05);
  const finalPrice = totalPrice - discountAmt;
  const emi = Math.ceil(finalPrice / 3);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true); setPayError('');
    try {
      const res = await fetch('/api/market/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone, guests,
          packageTitle: `${pkg.label} ${pkg.nights} Package`,
          destination: pkg.label,
          sourceUrl: `https://ylootrips.com${pkg.href}`,
          ourPrice: finalPrice, marketPrice: totalPrice, priceDiff: discountAmt,
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) { window.location.href = data.paymentUrl; }
      else { setPayError(data.error || 'Payment failed. Please try again.'); }
    } catch { setPayError('Network error. Please try again.'); }
    finally { setPaying(false); }
  };

  const handleCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    setCbSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cbName, email: 'not-provided@ylootrips.com', phone: cbPhone,
          destination: pkg.label,
          message: `Callback request for ${pkg.label} (${pkg.nights}, ${pkg.price}/person). Guests: ${guests}. Client wants EMI options.`,
        }),
      });
    } catch { /* non-fatal */ }
    setCbSent(true); setCbSending(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      {/* max-h accounts for bottom nav bar (64px) on mobile */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[calc(92vh-64px)] sm:max-h-[90vh] flex flex-col mb-16 sm:mb-0">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wide bg-amber-50 px-2 py-0.5 rounded-full">{pkg.tag}</span>
              <span className="text-xs text-gray-400">{pkg.nights}</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mt-0.5">{pkg.label} Package</h3>
            <p className="text-xs text-red-500 font-medium mt-0.5">⚡ {pkg.urgency}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 shrink-0 ml-3"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(['pay', 'callback'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold transition-colors ${tab === t ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              {t === 'pay' ? <><CreditCard size={14} /> Book & Pay</> : <>📞 Free Callback</>}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* ── PAY TAB ── */}
          {tab === 'pay' && (
            <div className="p-5 space-y-4 pb-6">
              {/* Guests */}
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
                  <span className="text-gray-500">{pkg.price} × {guests} guest{Number(guests) > 1 ? 's' : ''}</span>
                  <span className="text-gray-700 font-medium">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-green-700">
                  <span className="flex items-center gap-1"><BadgePercent size={13} /> Early bird 5% off</span>
                  <span className="font-semibold">− ₹{discountAmt.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-200 pt-2.5 flex justify-between">
                  <span className="font-bold text-gray-900">Total payable</span>
                  <div className="text-right">
                    <p className="font-display text-2xl text-gray-900">₹{finalPrice.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-400">incl. all taxes</p>
                  </div>
                </div>
              </div>

              {/* What's included / excluded */}
              {details && (
                <div className="space-y-2">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-3.5">
                    <p className="text-xs font-bold text-green-800 mb-2 uppercase tracking-wide">✅ What&apos;s Included</p>
                    <ul className="space-y-1">
                      {details.includes.map((item) => (
                        <li key={item} className="text-xs text-green-700 flex items-start gap-1.5"><span className="text-green-500 shrink-0 mt-0.5">✓</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3.5">
                    <p className="text-xs font-bold text-red-800 mb-2 uppercase tracking-wide">❌ Not Included</p>
                    <ul className="space-y-1">
                      {details.excludes.map((item) => (
                        <li key={item} className="text-xs text-red-600 flex items-start gap-1.5"><span className="text-red-400 shrink-0 mt-0.5">✗</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => setShowItinerary(v => !v)}
                    className="w-full text-left text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between hover:bg-gray-100 transition-colors">
                    <span>📅 Day-by-Day Itinerary</span>
                    <span className="text-gray-400">{showItinerary ? '▲' : '▼'}</span>
                  </button>
                  {showItinerary && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-1.5">
                      {details.itinerary.map((day) => (
                        <p key={day} className="text-xs text-gray-700">{day}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* EMI highlight */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-blue-900">0% EMI available</p>
                  <p className="text-xs text-blue-500 mt-0.5">3 / 6 / 12 month plans · No cost</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-blue-800">₹{emi.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-blue-400">/month × 3</p>
                </div>
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: <ShieldCheck size={14} className="text-green-600" />, label: '100% Refund', sub: 'if unavailable' },
                  { icon: <CreditCard size={14} className="text-blue-600" />, label: 'Easebuzz PG', sub: 'PCI-DSS secure' },
                  { icon: <BadgePercent size={14} className="text-amber-600" />, label: '5% Discount', sub: 'early bird' },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <div className="flex justify-center mb-1">{icon}</div>
                    <p className="text-[11px] font-bold text-gray-800">{label}</p>
                    <p className="text-[9px] text-gray-400">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Payment methods */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[10px] text-gray-400 font-medium">Pay via:</p>
                {['Visa', 'Mastercard', 'UPI', 'Net Banking', 'RuPay'].map(m => (
                  <span key={m} className="text-[10px] border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md font-medium">{m}</span>
                ))}
              </div>

              {!showForm ? (
                <button onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold text-sm py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg">
                  <CreditCard size={16} /> Proceed to Pay ₹{finalPrice.toLocaleString('en-IN')}
                </button>
              ) : (
                <form onSubmit={handlePay} className="space-y-2.5">
                  <p className="text-xs font-semibold text-gray-700">Enter your details</p>
                  <input required type="text" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900" />
                  <input required type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900" />
                  <input required type="tel" placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900" />
                  {payError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{payError}</p>}
                  <div className="flex gap-2 pt-1">
                    <button type="submit" disabled={paying}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-60 transition-colors">
                      {paying ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
                      {paying ? 'Redirecting to payment…' : `Pay ₹${finalPrice.toLocaleString('en-IN')} via Easebuzz`}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); setPayError(''); }}
                      className="px-4 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Back</button>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center">🔒 256-bit SSL · Secured by Easebuzz · No card details stored</p>
                </form>
              )}
            </div>
          )}

          {/* ── CALLBACK TAB ── */}
          {tab === 'callback' && (
            <div className="p-5 bg-[#1a2535] min-h-full">
              {cbSent ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-amber-400/20 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-amber-400" />
                  </div>
                  <p className="font-display text-xl text-white">All set! 🎉</p>
                  <p className="text-white/60 text-sm max-w-xs">Our expert calls you within <span className="text-amber-400 font-bold">1 hour</span> with best {pkg.label} price + EMI plan.</p>
                  <p className="text-white/30 text-[11px] mt-1">📱 Expect call from +91 84278 31127</p>
                  <button onClick={onClose} className="mt-3 px-6 py-2.5 bg-amber-400 text-gray-900 font-bold rounded-xl text-sm">Done</button>
                </div>
              ) : (
                <form onSubmit={handleCallback} className="space-y-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                      <span className="text-xl">✈️</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Yloo Concierge Callback</p>
                      <p className="text-white/60 text-xs mt-0.5">Get best price for {pkg.label} + EMI options — no advance needed.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[['📞','Free call'],['💳','EMI plans'],['🔒','No advance']].map(([icon,label]) => (
                      <div key={label} className="bg-white/8 rounded-xl py-2 text-center">
                        <p className="text-lg">{icon}</p>
                        <p className="text-white/60 text-[10px] font-medium mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
                    {[`Custom dates & pricing for ${pkg.label}`, 'Group discount for 4+ pax', '0% EMI upto 12 months', 'Visa & travel insurance help'].map(item => (
                      <p key={item} className="text-white/70 text-xs flex items-center gap-2">
                        <span className="text-amber-400">✓</span> {item}
                      </p>
                    ))}
                  </div>
                  <input required type="text" placeholder="Your name" value={cbName} onChange={e => setCbName(e.target.value)}
                    className="w-full px-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400" />
                  <input required type="tel" placeholder="Phone number (we'll call you)" value={cbPhone} onChange={e => setCbPhone(e.target.value)}
                    className="w-full px-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400" />
                  <button type="submit" disabled={cbSending}
                    className="w-full flex items-center justify-center gap-2 bg-amber-400 text-gray-900 font-bold text-sm py-3.5 rounded-xl hover:bg-amber-300 disabled:opacity-60 transition-colors">
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

export default function Home() {
  const { visitor } = useVisitor();
  const { balance } = useWallet();
  const { currency } = useCurrency();
  const fp = (p: number) => formatPriceWithCurrency(p, currency);
  const [content, setContent] = useState<CmsContent | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activePackage, setActivePackage] = useState<HomePkg | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referralCopied, setReferralCopied] = useState(false);

  const referralLink = 'https://ylootrips.com';
  const whatsappMsg = encodeURIComponent(
    "Hey! Found this amazing travel company — YlooTrips. Use my link to get ₹1,000 off your first trip: https://ylootrips.com 🌍"
  );
  const handleReferralCopy = async () => {
    try { await navigator.clipboard.writeText(referralLink); } catch {
      const el = document.createElement('textarea'); el.value = referralLink;
      document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
    }
    setReferralCopied(true); setTimeout(() => setReferralCopied(false), 2500);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Try combined endpoint first (single request - much faster)
        try {
          const homepageRes = await api.getHomepageData();
          const data = homepageRes.data;

          setContent(data.content);
          setDestinations(data.featuredDestinations || []);
          setError(null);
          return;
        } catch {
          // fall through to individual calls
        }

        // Fallback to individual calls if combined endpoint fails
        const [contentRes, destRes] = await Promise.all([
          api.getPageContent('home'),
          api.getFeaturedDestinations(),
        ]);

        setContent(contentRes.data);
        setDestinations(destRes.data.slice(0, 4));
        setError(null);
      } catch {
        setError('Unable to load content. Please ensure the backend is running and seeded.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ── Visitor-type filtering ────────────────────────────────────────────────
  const visibleDestinations = visitor === 'foreigner'
    ? destinations.filter((d) => !d.country || d.country === 'India')
    : destinations;

  // Get section by key
  const getSection = (key: string) => content?.sections?.find(s => s.sectionKey === key);

  const philosophySection = getSection('philosophy');
  const destinationsSection = getSection('destinations');
  const ctaSection = getSection('cta');

  return (
    <>
      {/* Hero Section - CMS Driven */}
      <Hero
        content={content?.hero}
        stats={content?.stats}
      />

      {/* ── Mobile App-style Category Grid ── */}
      <MobileCategories />

      {/* ── Hot Package Strip ── */}
      <section className="bg-gray-950 py-5 overflow-x-hidden">
        <div className="section-container">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-[11px] font-black uppercase tracking-widest">🔥 Top Packages</span>
              <span className="bg-amber-500/20 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">This Week</span>
            </div>
            <span className="text-gray-600 text-[10px] font-medium">{Math.floor(Date.now() / 3600000) % 60 + 140}+ booked</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {([
              { label: 'Goa', price: '₹9,999', priceNum: 9999, nights: '3N/4D', tag: 'Best Seller', href: '/goa-tour-package', urgency: '4 slots left', emoji: '🏖️', tagColor: 'from-orange-500 to-amber-500' },
              { label: 'Manali', price: '₹12,999', priceNum: 12999, nights: '4N/5D', tag: 'Most Popular', href: '/manali-tour-package', urgency: '3 slots left', emoji: '🏔️', tagColor: 'from-blue-500 to-cyan-500' },
              { label: 'Kashmir', price: '₹18,999', priceNum: 18999, nights: '5N/6D', tag: 'Trending', href: '/kashmir-tour-package', urgency: '5 slots left', emoji: '🌸', tagColor: 'from-rose-500 to-pink-500' },
              { label: 'Dubai', price: '₹35,999', priceNum: 35999, nights: '5N/6D', tag: 'International', href: '/dubai-tour-package-from-delhi', urgency: '2 slots left', emoji: '🏙️', tagColor: 'from-amber-500 to-yellow-500' },
              { label: 'Bali', price: '₹42,999', priceNum: 42999, nights: '6N/7D', tag: 'Honeymoon', href: '/bali-honeymoon-package', urgency: '3 slots left', emoji: '🌴', tagColor: 'from-green-500 to-emerald-500' },
              { label: 'Singapore', price: '₹32,999', priceNum: 32999, nights: '4N/5D', tag: 'New', href: '/singapore-tour-package', urgency: '4 slots left', emoji: '🦁', tagColor: 'from-red-500 to-rose-500' },
              { label: 'Thailand', price: '₹28,999', priceNum: 28999, nights: '5N/6D', tag: 'Budget', href: '/thailand-budget-trip', urgency: '6 slots left', emoji: '🐘', tagColor: 'from-purple-500 to-violet-500' },
              { label: 'Maldives', price: '₹89,999', priceNum: 89999, nights: '4N/5D', tag: 'Luxury', href: '/maldives-luxury-package', urgency: '2 slots left', emoji: '🏝️', tagColor: 'from-sky-500 to-blue-500' },
            ] as HomePkg[]).map((pkg) => (
              <button key={pkg.href} onClick={() => setActivePackage(pkg)}
                className="group flex-shrink-0 relative bg-gray-900 border border-gray-800/80 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 active:scale-95 text-left"
                style={{ minWidth: '155px' }}>
                {/* Emoji header */}
                <div className="relative h-20 flex items-center justify-center overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${pkg.tagColor ?? 'from-amber-500 to-orange-500'} opacity-20`} />
                  <span className="text-4xl">{pkg.emoji ?? '✈️'}</span>
                  {/* Tag badge */}
                  <span className={`absolute top-2 left-2 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-gradient-to-r ${pkg.tagColor ?? 'from-amber-500 to-orange-500'} text-white`}>
                    {pkg.tag}
                  </span>
                  <span className="absolute top-2 right-2 text-[9px] text-gray-400 font-medium">{pkg.nights}</span>
                </div>
                {/* Content */}
                <div className="px-3.5 pb-3.5">
                  <p className="text-white font-bold text-base leading-tight">{pkg.label}</p>
                  <p className="text-amber-400 font-black text-lg leading-tight mt-0.5">{pkg.price}</p>
                  <p className="text-red-400/80 text-[10px] mt-1 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
                    {pkg.urgency}
                  </p>
                  <div className="mt-2.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:from-amber-400 group-hover:to-orange-400 text-black text-[10px] font-black uppercase tracking-widest text-center rounded-xl py-2 transition-all shadow-md shadow-amber-500/20">
                    Book Now →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Limited-Time Offers Banner */}
      <LimitedOffersBanner />


      {/* ── Cashback & Wallet + Referral Banner ── */}
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 py-10 md:py-14">
        <div className="section-container">

          {/* Top row: wallet headline + CTA */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-10">
            <div className="flex items-center gap-5 text-white">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
                <Wallet size={26} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-0.5">WanderLoot</p>
                <h2 className="font-display text-xl md:text-2xl font-bold leading-tight">
                  {balance > 0
                    ? <>You have <span className="underline underline-offset-4">{fp(balance)}</span> cashback waiting!</>
                    : <>Earn 10% Cashback on Every Booking</>}
                </h2>
                <p className="text-white/75 text-sm mt-1">
                  {balance > 0
                    ? 'Apply your wallet balance at checkout to save on your next trip.'
                    : 'Book any trip and get 10% back in your wallet — use it on the next one.'}
                </p>
              </div>
            </div>

            {/* Perks — hidden on mobile */}
            <div className="hidden lg:flex items-center gap-6 text-white/90">
              {[
                { icon: TrendingUp, label: '10% Cashback', sub: 'on every booking' },
                { icon: Gift, label: 'Promo Codes', sub: 'exclusive offers' },
                { icon: Zap, label: 'Instant Credit', sub: 'no waiting period' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none">{label}</p>
                    <p className="text-[11px] text-white/65 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/cashback"
              className="shrink-0 flex items-center gap-2 bg-white text-amber-600 hover:bg-amber-50 font-bold text-sm px-6 py-3 rounded-full transition-all shadow-lg shadow-black/10 whitespace-nowrap"
            >
              <Wallet size={16} />
              {balance > 0 ? `Use ${fp(balance)} Now` : 'View WanderLoot'}
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 mb-8" />

          {/* Referral row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            {/* Left: referral headline */}
            <div className="text-white flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Gift size={18} className="text-white/80" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/70">Refer &amp; Earn</p>
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold mb-1">
                Share travel joy. Earn <span className="underline underline-offset-4">₹1,000</span> per referral.
              </h3>
              <p className="text-white/70 text-sm">
                Your friend gets ₹1,000 off their first trip. You get ₹1,000 credited to your WanderLoot wallet — instantly.
              </p>
              <div className="flex gap-5 mt-3">
                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-white/60" />
                  <span className="text-white text-xs font-semibold">2,400+ referrals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wallet size={13} className="text-white/60" />
                  <span className="text-white text-xs font-semibold">₹24L+ rewards given</span>
                </div>
              </div>
            </div>

            {/* Right: copy link + WhatsApp share */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[280px]">
              {/* Copy link */}
              <div className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-xl px-3 py-2.5 flex-1">
                <span className="text-white text-xs font-mono flex-1 truncate opacity-80">ylootrips.com</span>
                <button
                  onClick={handleReferralCopy}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    referralCopied
                      ? 'bg-green-400/30 text-green-100 border border-green-300/40'
                      : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
                  }`}
                >
                  {referralCopied ? <Check size={11} /> : <Copy size={11} />}
                  {referralCopied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              {/* WhatsApp share */}
              <a
                href={`https://wa.me/?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-black/10 whitespace-nowrap"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Share on WhatsApp
              </a>
            </div>
          </div>

          {/* Reward note */}
          <p className="text-white/40 text-[11px] text-center mt-6">
            Referral reward credited to WanderLoot wallet · Valid for new customers only · No expiry on wallet credits
          </p>

        </div>
      </section>

      {/* Trending Packages — 3D cards with direct Book Now */}
      <TrendingPackages />

      {/* Unified Trust Hub — badges, guarantees, hotels, media, payments */}
      <TrustHub />

      {/* Error Banner */}
      {error && (
        <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
          <div className="section-container">
            <p className="text-terracotta text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Philosophy Section - CMS Driven */}
      <section className="py-10 md:py-16 bg-cream">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
                  {philosophySection?.eyebrow || 'Our Philosophy'}
                </p>
                <h2 className="font-display text-display-lg text-primary">
                  {philosophySection?.title?.split('.').map((part, i) => (
                    <span key={i}>
                      {i === 1 ? <><br /><span className="italic text-secondary">{part.trim()}</span></> : part}
                    </span>
                  )) || <>Travel is not just movement.<br /><span className="italic text-secondary">It&apos;s transformation.</span></>}
                </h2>
              </div>

              <p className="text-body-lg text-primary/70 leading-relaxed">
                {philosophySection?.description || 'We believe that the best journeys are those that leave you changed. Our curated experiences go beyond the ordinary, connecting you with local cultures, hidden treasures, and the stories that make each destination unique.'}
              </p>

              {/* Features - CMS Driven */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 pt-4">
                {(content?.features && content.features.length > 0
                  ? content.features
                  : [
                    { icon: 'compass', title: 'Expert Local Guides', description: '' },
                    { icon: 'heart', title: 'Authentic Experiences', description: '' },
                    { icon: 'shield', title: 'Sustainable Travel', description: '' },
                    { icon: 'star', title: 'Curated Excellence', description: '' },
                  ]
                ).map((feature, index) => {
                  const IconComponent = iconMap[feature.icon] || Compass;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="text-sm text-primary/80">{feature.title}</span>
                    </div>
                  );
                })}
              </div>

              <Link href={philosophySection?.ctaLink || '/about'} className="btn-ghost group inline-flex items-center gap-2 pt-4">
                <span>{philosophySection?.ctaText || 'Discover Our Story'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-2 sm:space-y-4">
                  <div className="relative aspect-portrait overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80"
                      alt="Taj Mahal at sunrise, Agra, India"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&q=80"
                      alt="Kerala backwaters houseboat cruise, South India"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="pt-6 sm:pt-12 space-y-2 sm:space-y-4">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80"
                      alt="Colorful Rajasthani culture and traditions, Jaipur India"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-portrait overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80"
                      alt="Himalayan mountain landscape, North India"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Floating badge with CMS stat */}
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 md:-bottom-6 md:-left-6 bg-accent text-primary px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4">
                <span className="font-display text-xl sm:text-2xl md:text-3xl">
                  {content?.stats?.find(s => s.label?.includes('Year'))?.value || '12+'}
                </span>
                <span className="block text-[10px] sm:text-caption uppercase tracking-widest">
                  {content?.stats?.find(s => s.label?.includes('Year'))?.label || 'Years of Excellence'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden Gems section */}
      <HiddenSpots />

      {/* Planning Hub — How it works + AI Planner + Holiday Planner */}
      <PlanningHub />

      {/* Reel to Trip — compact teaser section */}
      <ReelToTripTeaser />

      {/* International Testimonials — static, from real traveler countries */}
      <InternationalTestimonials />

      {/* Home package booking drawer */}
      {activePackage && <HomeBookingDrawer pkg={activePackage} onClose={() => setActivePackage(null)} />}
    </>
  );
}
