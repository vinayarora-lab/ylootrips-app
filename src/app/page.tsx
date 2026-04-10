'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, Heart, Shield, Star, LucideIcon, Wallet, Gift, TrendingUp, Zap, X, CreditCard, Loader2, CheckCircle, BadgePercent, ShieldCheck } from 'lucide-react';
import Hero from '@/components/Hero';
import MobileCategories from '@/components/MobileCategories';
import DestinationCard from '@/components/DestinationCard';
import InternationalTestimonials from '@/components/InternationalTestimonials';
import TrustedHotels from '@/components/TrustedHotels';
import WhyChooseUs from '@/components/WhyChooseUs';
import HowItWorks from '@/components/HowItWorks';
import TrustBanner from '@/components/TrustBanner';
import HolidayPlanner from '@/components/HolidayPlanner';
import MyBookingSection from '@/components/MyBookingSection';
import ReferAndEarn from '@/components/ReferAndEarn';
import HiddenSpots from '@/components/HiddenSpots';
import TripPlannerPromo from '@/components/TripPlannerPromo';
import TrendingPackages from '@/components/TrendingPackages';
import LimitedOffersBanner from '@/components/LimitedOffersBanner';
import MediaPress from '@/components/MediaPress';
import GuaranteeSection from '@/components/GuaranteeSection';
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
  price: string;   // display string e.g. "₹9,999"
  priceNum: number;
  nights: string;
  tag: string;
  href: string;
  urgency: string;
}

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

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

        <div className="overflow-y-auto flex-1">
          {/* ── PAY TAB ── */}
          {tab === 'pay' && (
            <div className="p-5 space-y-4">
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
      <section className="bg-gray-950 py-6 overflow-x-auto">
        <div className="section-container">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">🔥 Top Packages This Week</span>
            <span className="text-gray-500 text-xs">Booked {Math.floor(Date.now() / 3600000) % 60 + 140}+ times</span>
          </div>
          <div className="flex gap-3 min-w-max pb-1">
            {([
              { label: 'Goa', price: '₹9,999', priceNum: 9999, nights: '3N', tag: 'Best Seller', href: '/goa-tour-package', urgency: 'Only 4 slots left' },
              { label: 'Manali', price: '₹12,999', priceNum: 12999, nights: '4N', tag: 'Most Popular', href: '/manali-tour-package', urgency: 'Only 3 slots left' },
              { label: 'Kashmir', price: '₹18,999', priceNum: 18999, nights: '5N', tag: 'Trending', href: '/kashmir-tour-package', urgency: 'Only 5 slots left' },
              { label: 'Dubai', price: '₹35,999', priceNum: 35999, nights: '5N', tag: 'International', href: '/dubai-tour-package-from-delhi', urgency: 'Only 2 slots left' },
              { label: 'Bali', price: '₹42,999', priceNum: 42999, nights: '6N', tag: 'Honeymoon', href: '/bali-honeymoon-package', urgency: 'Only 3 slots left' },
              { label: 'Singapore', price: '₹32,999', priceNum: 32999, nights: '4N', tag: 'New', href: '/singapore-tour-package', urgency: 'Only 4 slots left' },
              { label: 'Thailand', price: '₹28,999', priceNum: 28999, nights: '5N', tag: 'Budget', href: '/thailand-budget-trip', urgency: 'Only 6 slots left' },
              { label: 'Maldives', price: '₹89,999', priceNum: 89999, nights: '4N', tag: 'Luxury', href: '/maldives-luxury-package', urgency: 'Only 2 slots left' },
            ] as HomePkg[]).map((pkg) => (
              <button key={pkg.href} onClick={() => setActivePackage(pkg)}
                className="group flex-shrink-0 bg-gray-900 border border-gray-800 hover:border-amber-500/50 rounded-xl px-4 py-3 transition-all hover:bg-gray-800 min-w-[140px] text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wide">{pkg.tag}</span>
                  <span className="text-[9px] text-gray-500">{pkg.nights}</span>
                </div>
                <p className="text-white font-bold text-sm">{pkg.label}</p>
                <p className="text-amber-300 font-black text-base mt-0.5">{pkg.price}</p>
                <p className="text-red-400 text-[10px] mt-1 font-medium">{pkg.urgency}</p>
                <div className="mt-2 bg-amber-500 group-hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-widest text-center rounded-lg py-1.5 transition-colors">
                  Book Now
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Limited-Time Offers Banner */}
      <LimitedOffersBanner />

      {/* Trust Banner — payment methods + badges */}
      <TrustBanner />

      {/* Press coverage + partner logos */}
      <MediaPress />

      {/* ── Cashback & Wallet Banner ── */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 py-8 md:py-10">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Left: headline */}
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

            {/* Middle: 3 perks */}
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

            {/* Right: CTA */}
            <Link
              href="/cashback"
              className="shrink-0 flex items-center gap-2 bg-white text-amber-600 hover:bg-amber-50 font-bold text-sm px-6 py-3 rounded-full transition-all shadow-lg shadow-black/10 whitespace-nowrap"
            >
              <Wallet size={16} />
              {balance > 0 ? `Use ${fp(balance)} Now` : 'View WanderLoot'}
              <ArrowUpRight size={15} />
            </Link>

          </div>
        </div>
      </section>

      {/* Trending Packages — 3D cards with direct Book Now */}
      <TrendingPackages />

      {/* Trusted Partner Hotels */}
      <TrustedHotels />

      {/* Error Banner */}
      {error && (
        <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
          <div className="section-container">
            <p className="text-terracotta text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Philosophy Section - CMS Driven */}
      <section className="py-16 md:py-24 lg:py-32 bg-cream">
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

      {/* Destinations Section - CMS Driven */}
      <section className="py-16 md:py-24 lg:py-32 bg-cream-dark">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-10 md:mb-16">
            <div>
              <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
                {destinationsSection?.eyebrow || 'Destinations'}
              </p>
              <h2 className="font-display text-display-lg text-primary">
                {destinationsSection?.title?.split(' ').map((word, i, arr) => (
                  i >= arr.length - 2 ? <span key={i} className="italic">{word} </span> : <span key={i}>{word} </span>
                )) || <>Where will your<br /><span className="italic">story begin?</span></>}
              </h2>
            </div>
            <Link href={destinationsSection?.ctaLink || '/destinations'} className="btn-ghost group">
              <span>{destinationsSection?.ctaText || 'View All Destinations'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Destinations Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[500px] bg-cream animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                  variant={index === 0 ? 'featured' : 'default'}
                />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Hidden Gems section */}
      <HiddenSpots />

      {/* AI Trip Planner Promo */}
      <TripPlannerPromo />

      {/* Holiday & Weekend Planner */}
      <HolidayPlanner />


      {/* Guarantees — zero-risk booking promise */}
      <GuaranteeSection />

      {/* International Testimonials — static, from real traveler countries */}
      <InternationalTestimonials />

      {/* Why Choose YlooTrips */}
      <WhyChooseUs />

      {/* How It Works */}
      <HowItWorks />

      {/* Refer & Earn */}
      <ReferAndEarn />

      {/* My Booking Portal */}
      <MyBookingSection />

      {/* CTA Section - CMS Driven */}
      <section className="relative py-20 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={ctaSection?.imageUrl || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80'}
            alt="India mountain landscape — start your journey with YlooTrips"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/60" />
        </div>

        <div className="relative z-10 section-container text-center text-cream">
          <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4 md:mb-6">
            {ctaSection?.eyebrow || 'Ready to Begin?'}
          </p>
          <h2 className="font-display text-display-xl max-w-3xl mx-auto mb-6 md:mb-8 text-balance">
            {ctaSection?.title || <>Let us craft your next<span className="italic"> unforgettable journey</span></>}
          </h2>
          <p className="text-base md:text-body-lg text-cream/70 max-w-xl mx-auto mb-8 md:mb-12">
            {ctaSection?.description || 'Tell us about your dream destination, and our travel experts will design a bespoke experience just for you.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link href={ctaSection?.ctaLink || '/contact'} className="btn-primary bg-cream text-primary hover:bg-cream-dark">
              <span>{ctaSection?.ctaText || 'Plan Your Journey'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href="/destinations" className="btn-outline border-cream/30 text-cream hover:bg-cream/10">
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Home package booking drawer */}
      {activePackage && <HomeBookingDrawer pkg={activePackage} onClose={() => setActivePackage(null)} />}
    </>
  );
}
