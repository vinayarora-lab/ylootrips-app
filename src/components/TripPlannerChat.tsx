'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send, MapPin, Clock, Lightbulb, Star, ChevronDown, ChevronUp, Loader2, Sparkles, Calendar, Wallet, Package, CreditCard, ArrowUpRight, Instagram } from 'lucide-react';
import type { MarketPackage } from '@/app/api/search/market-packages/route';

// ── Destination → our package page mapping ────────────────────────────────────
const TRIP_LINKS: { keywords: string[]; href: string; title: string }[] = [
  { keywords: ['manali', 'solang', 'kasol', 'rohtang'], href: '/manali-tour-package', title: 'Manali Tour Package' },
  { keywords: ['goa', 'calangute', 'baga', 'anjuna', 'panjim'], href: '/goa-tour-package', title: 'Goa Tour Package' },
  { keywords: ['kashmir', 'srinagar', 'gulmarg', 'pahalgam', 'sonamarg', 'dal lake'], href: '/kashmir-tour-package', title: 'Kashmir Tour Package' },
  { keywords: ['kerala', 'munnar', 'alleppey', 'kochi', 'backwater', 'thekkady', 'kovalam'], href: '/kerala-tour-package', title: 'Kerala Tour Package' },
  { keywords: ['bali', 'ubud', 'seminyak', 'kuta', 'indonesia'], href: '/bali-honeymoon-package', title: 'Bali Honeymoon Package' },
  { keywords: ['dubai', 'uae', 'burj', 'abu dhabi', 'desert safari'], href: '/dubai-tour-package-from-delhi', title: 'Dubai Tour Package' },
  { keywords: ['thailand', 'bangkok', 'phuket', 'pattaya', 'krabi', 'phi phi'], href: '/thailand-budget-trip', title: 'Thailand Budget Trip' },
  { keywords: ['singapore', 'marina bay', 'sentosa'], href: '/singapore-tour-package', title: 'Singapore Tour Package' },
  { keywords: ['maldives', 'overwater', 'atoll'], href: '/maldives-luxury-package', title: 'Maldives Luxury Package' },
  { keywords: ['kedarkantha', 'sankri', 'juda ka talab'], href: '/destinations/domestic', title: 'Kedarkantha Trek' },
  { keywords: ['spiti', 'kaza', 'tabo', 'key monastery', 'chicham'], href: '/destinations/domestic', title: 'Spiti Valley Tour' },
  { keywords: ['chopta', 'tungnath', 'chandrashila'], href: '/destinations/domestic', title: 'Chopta Trek' },
  { keywords: ['kedarnath', 'char dham', 'gaurikund'], href: '/destinations/domestic', title: 'Kedarnath Yatra' },
  { keywords: ['lakshadweep', 'agatti', 'bangaram'], href: '/destinations/domestic', title: 'Lakshadweep Tour' },
  { keywords: ['coorg', 'kodagu', 'mandalpatti', 'abbey falls'], href: '/destinations/domestic', title: 'Coorg Tour' },
  { keywords: ['jibhi', 'tirthan', 'jalori'], href: '/destinations/domestic', title: 'Jibhi Tirthan Valley' },
  { keywords: ['auli', 'joshimath', 'gorson'], href: '/destinations/domestic', title: 'Auli Snow Package' },
  { keywords: ['chadar', 'zanskar', 'ladakh', 'leh'], href: '/destinations/domestic', title: 'Chadar Trek' },
  { keywords: ['roopkund', 'lohajung', 'bedni bugyal'], href: '/destinations/domestic', title: 'Roopkund Trek' },
  { keywords: ['har ki dun', 'garhwal', 'swargarohini'], href: '/destinations/domestic', title: 'Har Ki Dun Trek' },
  { keywords: ['hampta', 'chandratal'], href: '/destinations/domestic', title: 'Hampta Pass Trek' },
  { keywords: ['sar pass', 'grahan'], href: '/destinations/domestic', title: 'Sar Pass Trek' },
  { keywords: ['kheerganga', 'barshaini'], href: '/destinations/domestic', title: 'Kheerganga Trek' },
  { keywords: ['dayara', 'raithal', 'bugyal'], href: '/destinations/domestic', title: 'Dayara Bugyal Trek' },
  { keywords: ['prashar', 'mandi lake'], href: '/destinations/domestic', title: 'Prashar Lake Trek' },
  { keywords: ['nag tibba', 'pantwari'], href: '/destinations/domestic', title: 'Nag Tibba Trek' },
];

function findTrip(destination: string) {
  const d = destination.toLowerCase();
  return TRIP_LINKS.find((t) => t.keywords.some((k) => d.includes(k))) || null;
}

interface Activity {
  time: string;
  activity: string;
  details: string;
  tip?: string;
}

interface Day {
  day: number;
  title: string;
  theme: string;
  activities: Activity[];
}

interface Itinerary {
  destination: string;
  duration: string;
  travelStyle: string;
  estimatedBudget: string;
  highlights: string[];
  days: Day[];
  packingTips: string[];
  bestTimeToVisit: string;
  localInsights: string;
}

const SUGGESTIONS = [
  "Plan a 5-day trip to Bali for 2 people, honeymoon, budget ₹80,000",
  "7-day Thailand trip — Bangkok + Phuket, budget traveller",
  "5-day Manali trip for 2 people on a budget of ₹25,000",
  "Dubai 4 nights, family with kids, mid-range budget",
  "7-day Kerala backwaters and beaches, luxury style",
  "Singapore 5 days, couple, first international trip",
];

/* ── Holiday / Long Weekend Calendar ─────────────────────────────────────── */
const HOLIDAYS = [
  { date: 'Apr 14', day: 'Tue', name: 'Ambedkar Jayanti', type: 'holiday', totalDays: 3, note: 'Take Apr 15 off → 3-day weekend', destinations: ['Jaipur', 'Agra', 'Rishikesh'], emoji: '🇮🇳' },
  { date: 'May 1', day: 'Fri', name: 'May Day / Labour Day', type: 'long', totalDays: 3, note: 'Fri–Sun long weekend', destinations: ['Goa', 'Coorg', 'Ooty'], emoji: '🎉' },
  { date: 'May 31', day: 'Sun', name: 'Buddha Purnima', type: 'holiday', totalDays: 3, note: 'Sat–Mon long weekend', destinations: ['Bodh Gaya', 'Dharamshala', 'Spiti'], emoji: '🪔' },
  { date: 'Jun 6–7', day: 'Sat–Sun', name: 'Eid al-Adha', type: 'holiday', totalDays: 4, note: 'Fri–Mon — 4 days with leave!', destinations: ['Dubai', 'Turkey', 'Malaysia'], emoji: '🌙' },
  { date: 'Aug 15', day: 'Sat', name: 'Independence Day', type: 'long', totalDays: 3, note: 'Thu–Sat — add a leave for 5 days!', destinations: ['Ladakh', 'Manali', 'Andaman'], emoji: '🇮🇳' },
  { date: 'Aug 20', day: 'Thu', name: 'Janmashtami', type: 'holiday', totalDays: 4, note: 'Thu–Sun — take Fri off for 4 days', destinations: ['Mathura', 'Vrindavan', 'Nainital'], emoji: '🪈' },
  { date: 'Sep 7', day: 'Mon', name: 'Ganesh Chaturthi', type: 'long', totalDays: 3, note: 'Sat–Mon long weekend', destinations: ['Mumbai', 'Goa', 'Hampi'], emoji: '🐘' },
  { date: 'Oct 2', day: 'Fri', name: 'Gandhi Jayanti / Dussehra', type: 'long', totalDays: 4, note: 'Fri–Mon — 4-day weekend!', destinations: ['Mysuru', 'Kullu', 'Varanasi'], emoji: '🎆' },
  { date: 'Nov 8', day: 'Sun', name: 'Diwali', type: 'festival', totalDays: 5, note: 'Multi-day festival break', destinations: ['Jaisalmer', 'Pushkar', 'Goa'], emoji: '✨' },
  { date: 'Dec 25', day: 'Thu', name: 'Christmas', type: 'long', totalDays: 4, note: 'Thu–Sun — 4-day getaway!', destinations: ['Goa', 'Manali', 'Bali'], emoji: '🎄' },
  { date: 'Dec 31', day: 'Wed', name: 'New Year\'s Eve', type: 'festival', totalDays: 3, note: 'Ring in 2027 on a trip!', destinations: ['Dubai', 'Thailand', 'Goa'], emoji: '🎊' },
];

function HolidayCalendar({ onSelect }: { onSelect: (q: string) => void }) {
  const typeStyle: Record<string, string> = {
    long: 'bg-green-100 text-green-700 border-green-200',
    holiday: 'bg-amber-100 text-amber-700 border-amber-200',
    festival: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  const typeLabel: Record<string, string> = {
    long: '🟢 Long Weekend',
    holiday: '🟡 Holiday',
    festival: '🌟 Festival Break',
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <p className="text-sm font-bold text-primary">📅 Long Weekends & Holiday Calendar 2026</p>
          <p className="text-xs text-secondary mt-0.5">Tap any holiday to plan your trip instantly</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {HOLIDAYS.map((h) => (
          <div
            key={h.name}
            className="bg-white border border-cream-dark rounded-2xl p-4 hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer active:scale-[0.98]"
            onClick={() => onSelect(`Plan a ${h.totalDays}-day trip for ${h.destinations[0]} around ${h.name} (${h.date}), budget trip for 2 people`)}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl shrink-0 mt-0.5">{h.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-primary">{h.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeStyle[h.type]}`}>
                    {typeLabel[h.type]}
                  </span>
                </div>
                <p className="text-xs text-secondary mt-0.5">{h.date} ({h.day}) · {h.note}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {h.destinations.map(dest => (
                    <button
                      key={dest}
                      onClick={e => { e.stopPropagation(); onSelect(`Plan a ${h.totalDays}-day trip to ${dest} for ${h.name} break (${h.date}), budget trip for 2 people`); }}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 active:scale-95 transition-transform hover:bg-amber-100"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-lg font-black text-amber-500">{h.totalDays}D</div>
                <div className="text-[10px] text-secondary">off</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TIME_COLORS: Record<string, string> = {
  Morning: 'bg-amber-50 text-amber-700 border-amber-200',
  Afternoon: 'bg-orange-50 text-orange-700 border-orange-200',
  Evening: 'bg-purple-50 text-purple-700 border-purple-200',
  Night: 'bg-slate-50 text-slate-700 border-slate-200',
};

function DayCard({ day, index }: { day: Day; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="border border-cream-dark rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-cream-light transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center text-white text-sm font-bold">
            {day.day}
          </span>
          <div>
            <p className="font-semibold text-primary text-sm sm:text-base">{day.title}</p>
            <p className="text-xs text-secondary mt-0.5">{day.theme}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-secondary flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-secondary flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-cream-dark">
          {day.activities.map((act, i) => (
            <div key={i} className="pt-4">
              <span
                className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border mb-2 ${
                  TIME_COLORS[act.time] || 'bg-cream text-secondary border-cream-dark'
                }`}
              >
                {act.time}
              </span>
              <p className="font-medium text-primary text-sm mb-1">{act.activity}</p>
              <p className="text-sm text-secondary leading-relaxed">{act.details}</p>
              {act.tip && (
                <div className="flex items-start gap-2 mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">{act.tip}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function YlooCallbackCard({ destination }: { destination: string }) {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: 'not-provided@ylootrips.com',
          phone: form.phone,
          destination,
          message: `Callback request from trip planner for: ${destination}. Client wants itinerary + EMI options.`,
        }),
      });
    } catch { /* non-fatal */ }
    setSent(true);
    setSending(false);
  };

  if (sent) return (
    <div className="bg-primary rounded-2xl p-6 text-center space-y-2">
      <div className="text-3xl">🎉</div>
      <p className="font-display text-lg text-cream">You're on the list!</p>
      <p className="text-cream-dark text-sm">Our Yloo travel expert will call you within <strong className="text-accent">1 hour</strong> with a personalised {destination} itinerary, pricing & flexible EMI options.</p>
      <p className="text-cream/50 text-xs mt-2">📱 Expect a call from +91 84278 31127</p>
    </div>
  );

  return (
    <div className="bg-primary rounded-2xl overflow-hidden">
      {/* Top badge */}
      <div className="bg-accent/20 border-b border-accent/20 px-5 py-2 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <p className="text-accent text-xs font-semibold uppercase tracking-widest">Yloo Concierge Service</p>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xl">✈️</span>
          </div>
          <div>
            <h3 className="font-display text-lg text-cream leading-snug mb-1">
              We'll build your {destination} trip personally
            </h3>
            <p className="text-cream-dark text-sm leading-relaxed">
              Our expert calls you within <span className="text-accent font-semibold">1 hour</span> with a custom itinerary, best prices & flexible <span className="text-accent font-semibold">EMI payment plans</span> — no advance needed.
            </p>
          </div>
        </div>

        {/* Quick trust points */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: '📞', label: 'Free callback' },
            { icon: '💳', label: 'EMI options' },
            { icon: '🔒', label: 'No advance' },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/8 rounded-xl px-3 py-2 text-center">
              <p className="text-lg">{icon}</p>
              <p className="text-cream-dark text-[10px] font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input
            required type="text" placeholder="Your name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-cream placeholder:text-cream/40 outline-none focus:border-accent"
          />
          <input
            required type="tel" placeholder="Phone number (we'll call you)"
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-cream placeholder:text-cream/40 outline-none focus:border-accent"
          />
          <button type="submit" disabled={sending}
            className="w-full flex items-center justify-center gap-2 bg-accent text-primary font-bold text-sm py-3 rounded-xl hover:bg-accent/90 disabled:opacity-60 transition-colors">
            {sending ? <Loader2 size={14} className="animate-spin" /> : '📞'}
            {sending ? 'Booking your callback…' : 'Get Free Callback + EMI Options'}
          </button>
          <p className="text-cream/40 text-[10px] text-center">We'll respond within 1 hour · Mon–Sun 9am–10pm</p>
        </form>
      </div>
    </div>
  );
}

function PackageCard({ pkg, destination }: { pkg: MarketPackage; destination: string }) {
  const [tab, setTab] = useState<'pay' | 'callback'>('pay');
  const [form, setForm] = useState({ name: '', email: '', phone: '', guests: '2' });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbName, setCbName] = useState('');
  const [cbSent, setCbSent] = useState(false);
  const [cbSending, setCbSending] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);

  // Calculate EMI (3-month approx)
  const emiAmount = pkg.ourPrice ? Math.ceil((pkg.ourPrice * Number(form.guests || 2)) / 3) : null;
  const savings = pkg.marketPrice && pkg.ourPrice ? pkg.marketPrice - pkg.ourPrice : null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setPayError('');

    if (!pkg.ourPrice) {
      const waMsg = encodeURIComponent(
        `Hi! I'm interested in the "${pkg.title}" trip to ${destination}.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nGuests: ${form.guests}\n\nPlease send me the price and availability.`
      );
      window.open(`https://wa.me/918427831127?text=${waMsg}`, '_blank');
      setPaying(false);
      return;
    }

    try {
      const res = await fetch('/api/market/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          guests: form.guests,
          packageTitle: pkg.title,
          destination,
          sourceUrl: pkg.url,
          ourPrice: pkg.ourPrice,
          marketPrice: pkg.marketPrice,
          priceDiff: pkg.priceDiff,
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
          destination,
          message: `Callback request for package: "${pkg.title}" to ${destination}. Client wants EMI options and personalised pricing.`,
        }),
      });
    } catch { /* non-fatal */ }
    setCbSent(true);
    setCbSending(false);
  };

  return (
    <div className="bg-white border border-primary/10 rounded-2xl overflow-hidden shadow-sm">
      {/* Package header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <span className="inline-block bg-accent/15 text-primary text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1">Trip Package</span>
            <p className="font-display text-sm text-primary leading-snug">{pkg.title}</p>
            <p className="text-xs text-secondary mt-0.5">{destination}</p>
          </div>
          {pkg.ourPrice ? (
            <div className="text-right shrink-0">
              {pkg.marketPrice && (
                <p className="text-[11px] text-secondary line-through">₹{pkg.marketPrice.toLocaleString('en-IN')}</p>
              )}
              <p className="font-display text-xl text-primary">₹{pkg.ourPrice.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-secondary">per person</p>
              {savings && savings > 0 && (
                <span className="inline-block bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-0.5">
                  Save ₹{savings.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm font-semibold text-primary">Custom quote</p>
          )}
        </div>
        {pkg.snippet && (
          <p className="text-xs text-primary/60 leading-relaxed line-clamp-2 mb-2">{pkg.snippet}</p>
        )}
        {/* EMI & perks strip */}
        {pkg.ourPrice && (
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
              💳 EMI from ₹{Math.ceil(pkg.ourPrice / 3).toLocaleString('en-IN')}/mo
            </span>
            <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-100">
              🔒 Secure Easebuzz PG
            </span>
            <span className="bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-green-100">
              ✅ 100% Refund Policy
            </span>
          </div>
        )}
      </div>

      {/* Tab switcher */}
      <div className="border-t border-cream-dark flex">
        <button
          onClick={() => setTab('pay')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors ${
            tab === 'pay'
              ? 'bg-primary text-cream'
              : 'bg-cream-light text-secondary hover:text-primary'
          }`}
        >
          <CreditCard size={12} /> Book & Pay Now
        </button>
        <div className="w-px bg-cream-dark" />
        <button
          onClick={() => setTab('callback')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors ${
            tab === 'callback'
              ? 'bg-primary text-cream'
              : 'bg-cream-light text-secondary hover:text-primary'
          }`}
        >
          📞 Free Callback
        </button>
      </div>

      {/* Tab content */}
      {tab === 'pay' && (
        <div className="border-t border-cream-dark bg-cream-light p-4">
          {!showPayForm ? (
            <div className="space-y-3">
              {/* EMI highlight */}
              {pkg.ourPrice && emiAmount && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-800">Pay in easy EMIs</p>
                    <p className="text-[11px] text-blue-600 mt-0.5">3 months · No cost EMI available</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-display text-blue-800">₹{emiAmount.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-blue-500">/month × 3</p>
                  </div>
                </div>
              )}
              {/* Discount highlight */}
              {savings && savings > 0 && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-green-800">Exclusive Yloo Price</p>
                    <p className="text-[11px] text-green-600 mt-0.5">You save vs. market price</p>
                  </div>
                  <p className="text-lg font-display text-green-700">−₹{savings.toLocaleString('en-IN')}</p>
                </div>
              )}
              <button
                onClick={() => setShowPayForm(true)}
                className="w-full flex items-center justify-center gap-2 bg-primary text-cream text-xs font-bold py-3 rounded-xl hover:bg-primary-light transition-colors"
              >
                <CreditCard size={13} />
                {pkg.ourPrice ? `Proceed to Pay ₹${(pkg.ourPrice * Number(form.guests || 2)).toLocaleString('en-IN')}` : 'Get Custom Quote'}
              </button>
              <p className="text-[10px] text-secondary text-center">🔒 Secure payment · Full refund if trip unavailable</p>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-2">
              <p className="text-xs font-semibold text-primary mb-1">
                {pkg.ourPrice ? `Booking for ${form.guests} guest(s) — ₹${(pkg.ourPrice * Number(form.guests || 2)).toLocaleString('en-IN')} total` : 'Enter your details for a custom quote'}
              </p>
              <input required type="text" placeholder="Full name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-sand/60 rounded-lg text-xs text-primary outline-none focus:border-accent" />
              <input required type="email" placeholder="Email address" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-sand/60 rounded-lg text-xs text-primary outline-none focus:border-accent" />
              <input required type="tel" placeholder="Phone number" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-sand/60 rounded-lg text-xs text-primary outline-none focus:border-accent" />
              <input type="number" placeholder="Number of guests" min="1" value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-sand/60 rounded-lg text-xs text-primary outline-none focus:border-accent" />
              {payError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{payError}</p>}
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={paying}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-cream text-xs font-bold py-2.5 rounded-xl hover:bg-primary-light disabled:opacity-60 transition-colors">
                  {paying ? <Loader2 size={13} className="animate-spin" /> : <CreditCard size={13} />}
                  {paying ? 'Redirecting…' : pkg.ourPrice ? `Pay ₹${(pkg.ourPrice * Number(form.guests || 2)).toLocaleString('en-IN')} via Easebuzz` : 'Request Quote'}
                </button>
                <button type="button" onClick={() => { setShowPayForm(false); setPayError(''); }}
                  className="text-xs text-secondary px-3 py-2.5 border border-sand/60 rounded-xl hover:bg-white">Back</button>
              </div>
              <p className="text-[10px] text-secondary text-center">🔒 Secure payment via Easebuzz · No hidden charges</p>
            </form>
          )}
        </div>
      )}

      {tab === 'callback' && (
        <div className="border-t border-cream-dark bg-primary p-4">
          {cbSent ? (
            <div className="text-center py-2">
              <p className="text-2xl mb-1">🎉</p>
              <p className="text-cream font-semibold text-sm">You're all set!</p>
              <p className="text-cream-dark text-xs mt-1">Our Yloo expert will call you within <span className="text-accent font-bold">1 hour</span> with a custom price, itinerary & EMI plan.</p>
              <p className="text-cream/40 text-[10px] mt-2">📱 Expect call from +91 84278 31127</p>
            </div>
          ) : (
            <form onSubmit={handleCallback} className="space-y-2">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-base">✈️</span>
                </div>
                <div>
                  <p className="text-cream text-xs font-bold">Yloo Concierge Callback</p>
                  <p className="text-cream-dark text-[11px] mt-0.5">Get a personal call with custom price + flexible EMI — no advance needed.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {[['📞', 'Free call'], ['💳', 'EMI plans'], ['🔒', 'No advance']].map(([icon, label]) => (
                  <div key={label} className="bg-white/8 rounded-lg py-1.5 text-center">
                    <p className="text-sm">{icon}</p>
                    <p className="text-cream/70 text-[9px] font-medium">{label}</p>
                  </div>
                ))}
              </div>
              <input required type="text" placeholder="Your name"
                value={cbName} onChange={(e) => setCbName(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-cream placeholder:text-cream/40 outline-none focus:border-accent" />
              <input required type="tel" placeholder="Phone number (we'll call you)"
                value={cbPhone} onChange={(e) => setCbPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-cream placeholder:text-cream/40 outline-none focus:border-accent" />
              <button type="submit" disabled={cbSending}
                className="w-full flex items-center justify-center gap-2 bg-accent text-primary text-xs font-bold py-2.5 rounded-xl hover:bg-accent/90 disabled:opacity-60 transition-colors">
                {cbSending ? <Loader2 size={13} className="animate-spin" /> : '📞'}
                {cbSending ? 'Scheduling callback…' : 'Get Free Callback + EMI Options'}
              </button>
              <p className="text-cream/40 text-[10px] text-center">Mon–Sun 9am–10pm · Response within 1 hour</p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function MarketSection({ destination }: { destination: string }) {
  const [packages, setPackages] = useState<MarketPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/search/market-packages?destination=${encodeURIComponent(destination)}`)
      .then((r) => r.json())
      .then((d) => setPackages(d.data || []))
      .finally(() => setLoading(false));
  }, [destination]);

  if (loading) return (
    <div className="flex items-center gap-2 text-sm text-secondary py-6 justify-center">
      <Loader2 size={14} className="animate-spin" /> Finding packages for {destination}…
    </div>
  );

  if (!packages.length) return <YlooCallbackCard destination={destination} />;

  return (
    <div className="space-y-4">
      <p className="text-xs text-secondary font-medium uppercase tracking-widest">Available Packages — {destination}</p>
      {packages.map((pkg, i) => (
        <PackageCard key={i} pkg={pkg} destination={destination} />
      ))}
    </div>
  );
}

function ItineraryDisplay({ itinerary, onBookNow, matchedTrip, onShowMarket }: {
  itinerary: Itinerary;
  onBookNow: () => void;
  matchedTrip: { href: string; title: string } | null;
  onShowMarket: () => void;
}) {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Trip Overview */}
      <div className="bg-primary rounded-2xl p-5 sm:p-6 text-cream">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold leading-tight">{itinerary.destination}</h2>
            <p className="text-cream-dark text-sm mt-0.5">{itinerary.travelStyle} Travel</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-primary-light rounded-xl px-4 py-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-cream-dark">Duration</p>
              <p className="text-sm font-medium text-cream">{itinerary.duration}</p>
            </div>
          </div>
          <div className="bg-primary-light rounded-xl px-4 py-3 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-cream-dark">Budget</p>
              <p className="text-sm font-medium text-cream">{itinerary.estimatedBudget}</p>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-primary-light rounded-xl px-4 py-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-cream-dark">Best Time</p>
              <p className="text-sm font-medium text-cream">{itinerary.bestTimeToVisit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      {(itinerary.highlights?.length ?? 0) > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-primary text-sm">Trip Highlights</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {itinerary.highlights.map((h, i) => (
              <span key={i} className="bg-cream border border-cream-dark text-secondary text-xs px-3 py-1.5 rounded-full">
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Day-by-Day */}
      {itinerary.days?.length > 0 && (
        <div>
          <h3 className="font-semibold text-primary mb-3 text-sm">Day-by-Day Itinerary</h3>
          <div className="space-y-3">
            {itinerary.days.map((day, i) => (
              <DayCard key={i} day={day} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Local Insight */}
      {itinerary.localInsights && (
        <div className="bg-sage/10 border border-sage/20 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-sage-dark flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-sage-dark mb-1">Local Insight from Yloo</p>
              <p className="text-sm text-primary/80 leading-relaxed">{itinerary.localInsights}</p>
            </div>
          </div>
        </div>
      )}

      {/* Packing Tips */}
      {(itinerary.packingTips?.length ?? 0) > 0 && (
        <div className="bg-cream rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-secondary" />
            <h3 className="font-semibold text-primary text-sm">What to Pack</h3>
          </div>
          <ul className="space-y-1.5">
            {itinerary.packingTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Book CTA */}
      <div className="bg-gradient-warm rounded-2xl p-5 sm:p-6 text-center">
        <h3 className="font-display text-lg sm:text-xl font-semibold text-white mb-1">Love this itinerary?</h3>
        <p className="text-white/80 text-sm mb-4">
          {matchedTrip
            ? 'This trip is available in our catalogue — book directly.'
            : 'Our experts will source this trip and handle all bookings for you.'}
        </p>
        {matchedTrip ? (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={matchedTrip.href}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold text-sm px-8 py-3 rounded-xl hover:bg-cream transition-colors shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4" />
              View {matchedTrip.title}
            </Link>
            <button
              onClick={onShowMarket}
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              Compare Market Packages
            </button>
          </div>
        ) : (
          <button
            onClick={onShowMarket}
            className="w-full sm:w-auto bg-white text-primary font-semibold text-sm px-8 py-3 rounded-xl hover:bg-cream transition-colors shadow-sm"
          >
            Find & Book This Trip →
          </button>
        )}
        <p className="text-white/60 text-xs mt-3">Free consultation · No hidden charges</p>
      </div>

    </div>
  );
}

const REAL_TRIPS = [
  {
    title: 'Golden Triangle',
    subtitle: 'Delhi · Agra · Jaipur',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80',
    price: '₹1,16,200',
    duration: '10 Days',
    badge: '⭐ Most Popular',
    href: '/trips/golden-triangle-10-day',
  },
  {
    title: 'Kerala & South India',
    subtitle: 'Kochi · Munnar · Alleppey · Varkala',
    image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&q=80',
    price: '₹1,57,700',
    duration: '14 Days',
    badge: '🏆 Top Rated',
    href: '/trips/kerala-south-india-14-day',
  },
  {
    title: 'Rajasthan Heritage',
    subtitle: 'Jaipur · Jodhpur · Udaipur · Jaisalmer',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80',
    price: '₹78,850',
    duration: '7 Days',
    badge: '🎨 Cultural',
    href: '/trips/rajasthan-heritage-7-day',
  },
];

const POPULAR_PACKAGES = [
  { name: '🏔️ Manali', href: '/manali-tour-package' },
  { name: '🏖️ Goa', href: '/goa-tour-package' },
  { name: '❄️ Kashmir', href: '/kashmir-tour-package' },
  { name: '🌴 Kerala', href: '/kerala-tour-package' },
  { name: '✈️ Bali', href: '/bali-honeymoon-package' },
  { name: '🏙️ Dubai', href: '/dubai-tour-package-from-delhi' },
];

function RealTripsSidebar() {
  return (
    <div className="space-y-4 pb-12">
      {/* Curated tours card */}
      <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-primary">
          <p className="text-xs font-black uppercase tracking-widest text-accent">✨ Real Itineraries</p>
          <p className="text-[10px] text-cream-dark mt-0.5">Handcrafted by YlooTrips experts</p>
        </div>
        <div className="divide-y divide-cream-dark">
          {REAL_TRIPS.map((trip) => (
            <a
              key={trip.href}
              href={trip.href}
              className="flex gap-3 p-3 hover:bg-cream-light transition-colors group"
            >
              <img
                src={trip.image}
                alt={trip.title}
                className="w-[72px] h-[56px] rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-accent/90 uppercase tracking-wide leading-none mb-0.5">{trip.badge}</p>
                <p className="font-bold text-primary text-[13px] leading-tight">{trip.title}</p>
                <p className="text-[10px] text-secondary mt-0.5 truncate">{trip.subtitle}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-bold text-primary">{trip.price}</span>
                  <span className="text-[10px] text-secondary">· {trip.duration}</span>
                </div>
              </div>
              <ArrowUpRight size={14} className="text-secondary shrink-0 mt-1 group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
        <div className="p-3 border-t border-cream-dark">
          <a
            href="/trips"
            className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-primary border border-primary/20 rounded-xl py-2.5 hover:bg-primary hover:text-cream transition-colors"
          >
            View All Trips <ArrowUpRight size={12} />
          </a>
        </div>
      </div>

      {/* Popular packages grid */}
      <div className="bg-white rounded-2xl border border-cream-dark p-4 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-3">Popular Packages</p>
        <div className="grid grid-cols-2 gap-2">
          {POPULAR_PACKAGES.map((pkg) => (
            <a
              key={pkg.href}
              href={pkg.href}
              className="text-center text-xs font-semibold text-primary bg-cream rounded-xl py-2.5 hover:bg-primary hover:text-cream transition-colors"
            >
              {pkg.name}
            </a>
          ))}
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="bg-primary rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-bold text-accent mb-1">💬 Talk to a Trip Expert</p>
        <p className="text-[11px] text-cream-dark mb-3 leading-relaxed">
          Get a personalised quote with pricing &amp; itinerary in under 1 hour.
        </p>
        <a
          href="https://wa.me/918427831127"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-500 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-green-600 transition-colors"
        >
          💬 WhatsApp Us Now
        </a>
        <p className="text-[10px] text-cream/40 text-center mt-2">Mon–Sun · 9am–10pm IST</p>
      </div>
    </div>
  );
}

export default function TripPlannerChat() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null); // kept for future use
  const [hasSearched, setHasSearched] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [failedDestination, setFailedDestination] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const marketRef = useRef<HTMLDivElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
    }
  };

  useEffect(() => {
    if (itinerary && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [itinerary]);

  // Auto-submit if ?q= or ?destination= param is passed
  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('destination');
    if (q) {
      setInput(q);
      handleSubmit(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (query?: string) => {
    const message = (query || input).trim();
    if (!message || loading) return;

    setInput('');
    setLoading(true);
    setError(null);
    setItinerary(null);
    setFailedDestination('');
    setHasSearched(true);

    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const res = await fetch('/api/trip-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show callback card instead of dead-end error
        setFailedDestination(message);
        return;
      }

      setItinerary(data.itinerary);
      setShowMarket(false);
    } catch {
      setFailedDestination(message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMarket = () => {
    setShowMarket(true);
    setTimeout(() => {
      marketRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleBookNow = () => {
    if (!itinerary) return;
    const trip = findTrip(itinerary.destination);
    if (trip) {
      router.push(trip.href);
    } else {
      handleShowMarket();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Hero Header */}
      <div className="bg-primary pt-5 pb-8 px-4 relative overflow-hidden">
        {/* Real Trips pill — top right */}
        <a
          href="/reel-to-trip"
          className="absolute top-3 right-3 sm:right-5 z-10 flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full px-3 py-1.5 shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-transform"
        >
          <Instagram className="w-3 h-3 text-white" />
          <span className="text-white text-[10px] font-black">Reel → Trip</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </a>

        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-accent/20 border border-accent/30 text-accent text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <Calendar className="w-3 h-3" />
            Holiday Planner · Powered by Yloo AI
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-cream font-bold mb-2 leading-tight">
            Plan Your Next Holiday 🗓️
          </h1>
          <p className="text-cream-dark text-sm max-w-sm mx-auto leading-relaxed">
            Pick a long weekend below — or type any destination to get an AI itinerary in seconds.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-4">
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-6 xl:items-start">
          <div>
        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-cream-dark p-3 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/50 mb-2 px-1">✨ Ask Yloo AI anything</p>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            placeholder="e.g. 5-day Bali trip for 2, honeymoon, budget ₹80,000…"
            rows={2}
            className="w-full resize-none text-sm text-primary placeholder-secondary/40 bg-transparent outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-cream-dark">
            <p className="text-[10px] text-secondary/50 hidden sm:block">Enter to generate · Shift+Enter new line</p>
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || loading}
              className="ml-auto flex items-center gap-2 bg-gray-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-black/20"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Planning…</>
              ) : (
                <><Sparkles className="w-4 h-4" />Plan My Trip</>
              )}
            </button>
          </div>
        </div>

        {/* Holiday Calendar + AI Suggestions */}
        {!hasSearched && (
          <>
            <HolidayCalendar onSelect={(q) => handleSubmit(q)} />
            <div className="mt-4">
              <p className="text-xs text-secondary font-semibold mb-2 px-1 uppercase tracking-widest">Or try a quick example:</p>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(s)}
                    className="text-left text-sm text-primary bg-white border border-cream-dark rounded-xl px-4 py-3 hover:border-accent hover:bg-cream transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center py-12">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-warm flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <p className="text-primary font-medium text-sm">Yloo AI is crafting your itinerary…</p>
              <p className="text-secondary text-xs">This usually takes 10–15 seconds</p>
            </div>
          </div>
        )}

        {/* AI failed — show callback card instead of error */}
        {failedDestination && !itinerary && (
          <div className="mt-6 pb-12">
            <p className="text-xs text-secondary px-1 mb-3">Our AI is busy — let our team plan this for you instead</p>
            <YlooCallbackCard destination={failedDestination} />
          </div>
        )}

        {/* Itinerary Result */}
        {itinerary && (
          <div ref={resultRef} className="mt-6">
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-xs text-secondary">Your personalised itinerary is ready</p>
              <button
                onClick={() => { setItinerary(null); setHasSearched(false); setShowMarket(false); }}
                className="text-xs text-accent hover:underline"
              >
                Plan another trip
              </button>
            </div>
            <ItineraryDisplay
              itinerary={itinerary}
              onBookNow={handleBookNow}
              matchedTrip={findTrip(itinerary.destination)}
              onShowMarket={handleShowMarket}
            />
          </div>
        )}

        {/* Market packages — rendered outside ItineraryDisplay so scroll works */}
        {itinerary && showMarket && (
          <div ref={marketRef} className="mt-4 pb-12">
            <MarketSection destination={itinerary.destination} />
          </div>
        )}
        {itinerary && !showMarket && <div className="pb-12" />}
          </div>
          {/* Real trips sidebar — desktop only */}
          <div className="hidden xl:block sticky top-20">
            <RealTripsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
