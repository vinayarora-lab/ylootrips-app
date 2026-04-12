'use client';

import { useEffect, useState } from 'react';
import { Zap, X, ArrowRight, Tag, CreditCard, Loader2, CheckCircle, BadgePercent, ShieldCheck } from 'lucide-react';

/* Countdown that ends ~36h from first client render */
const DURATION = 36 * 3600_000 + 14 * 60_000;

function pad(n: number) { return String(Math.max(0, n)).padStart(2, '0'); }

function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    setMounted(true);
    const saleEnd = Date.now() + DURATION;
    setDiff(saleEnd - Date.now());
    const t = setInterval(() => setDiff(saleEnd - Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5">
        {['HRS', 'MIN', 'SEC'].map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            {i > 0 && <span className="text-white/60 font-bold text-sm">:</span>}
            <div className="flex flex-col items-center">
              <div className="bg-black/30 backdrop-blur-sm text-white font-mono font-black text-lg leading-none px-2 py-1 rounded min-w-[2.5rem] text-center tabular-nums">--</div>
              <span className="text-white/55 text-[9px] uppercase tracking-widest mt-0.5">{label}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {[
        { val: pad(h), label: 'HRS' },
        { val: pad(m), label: 'MIN' },
        { val: pad(s), label: 'SEC' },
      ].map(({ val, label }, i) => (
        <div key={label} className="flex items-center gap-1">
          {i > 0 && <span className="text-white/60 font-bold text-sm">:</span>}
          <div className="flex flex-col items-center">
            <div className="bg-black/30 backdrop-blur-sm text-white font-mono font-black text-lg leading-none px-2 py-1 rounded min-w-[2.5rem] text-center tabular-nums">
              {val}
            </div>
            <span className="text-white/55 text-[9px] uppercase tracking-widest mt-0.5">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const OFFERS = [
  { code: 'YLOO15', discount: '15% OFF', label: 'All Trips', color: 'bg-violet-600' },
  { code: 'FIRST10', discount: '10% OFF', label: 'First Booking', color: 'bg-emerald-600' },
  { code: 'GROUP20', discount: '20% OFF', label: '4+ People', color: 'bg-amber-600' },
];

const PACKAGES = [
  { label: 'Goa', price: '₹9,999', priceNum: 9999, nights: '3N', tag: 'Best Seller' },
  { label: 'Manali', price: '₹12,999', priceNum: 12999, nights: '4N', tag: 'Most Popular' },
  { label: 'Kashmir', price: '₹18,999', priceNum: 18999, nights: '5N', tag: 'Trending' },
  { label: 'Dubai', price: '₹35,999', priceNum: 35999, nights: '5N', tag: 'International' },
  { label: 'Bali', price: '₹42,999', priceNum: 42999, nights: '6N', tag: 'Honeymoon' },
  { label: 'Thailand', price: '₹28,999', priceNum: 28999, nights: '5N', tag: 'Budget' },
  { label: 'Singapore', price: '₹32,999', priceNum: 32999, nights: '4N', tag: 'New' },
  { label: 'Maldives', price: '₹89,999', priceNum: 89999, nights: '4N', tag: 'Luxury' },
];

type Pkg = typeof PACKAGES[number];

function FlashSaleDrawer({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<Pkg | null>(null);
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

  const totalPrice = selected ? selected.priceNum * Number(guests || 2) : 0;
  // Flash sale 15% off (YLOO15) instead of 5%
  const discountAmt = Math.round(totalPrice * 0.15);
  const finalPrice = totalPrice - discountAmt;
  const emi = Math.ceil(finalPrice / 3);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setPaying(true); setPayError('');
    try {
      const res = await fetch('/api/market/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone, guests,
          packageTitle: `${selected.label} ${selected.nights} Flash Sale Package`,
          destination: selected.label,
          sourceUrl: 'https://ylootrips.com/#flash-sale',
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
          destination: selected?.label || 'Flash Sale',
          message: `Flash Sale callback request for ${selected?.label || 'any package'} (${selected?.nights || ''}, ${selected?.price || ''}/person). Guests: ${guests}. Client wants 15% flash sale price + EMI options.`,
        }),
      });
    } catch { /* non-fatal */ }
    setCbSent(true); setCbSending(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[calc(92vh-64px)] sm:max-h-[92vh] flex flex-col mb-16 sm:mb-0">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#1C1C1C] to-[#2d1f0e] border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1.5 bg-terracotta text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                <Zap className="w-3 h-3 fill-white" /> Flash Sale
              </span>
              <span className="text-amber-400 text-xs font-bold">15% OFF — Use YLOO15</span>
            </div>
            <h3 className="text-white font-bold text-base">Book Your Flash Sale Trip</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-white/60 shrink-0 ml-3"><X size={18} /></button>
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
              {/* Step 1: Pick destination */}
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2">1. Choose your destination</p>
                <div className="grid grid-cols-4 gap-2">
                  {PACKAGES.map(pkg => (
                    <button key={pkg.label} onClick={() => { setSelected(pkg); setShowForm(false); setPayError(''); }}
                      className={`flex flex-col items-center py-2.5 px-1 rounded-xl border text-center transition-all ${selected?.label === pkg.label ? 'bg-gray-900 border-gray-900 text-white' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-400'}`}>
                      <p className="text-[11px] font-bold leading-tight">{pkg.label}</p>
                      <p className={`text-[9px] mt-0.5 ${selected?.label === pkg.label ? 'text-amber-300' : 'text-gray-400'}`}>{pkg.price}</p>
                      <p className={`text-[9px] ${selected?.label === pkg.label ? 'text-white/60' : 'text-gray-400'}`}>{pkg.nights}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selected && (
                <>
                  {/* Step 2: Guests */}
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-1.5">2. Number of guests</p>
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
                      <span className="text-gray-500">{selected.price} × {guests} guest{Number(guests) > 1 ? 's' : ''}</span>
                      <span className="text-gray-500 line-through">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-700 font-semibold">
                      <span className="flex items-center gap-1"><BadgePercent size={13} /> Flash Sale 15% OFF (YLOO15)</span>
                      <span>− ₹{discountAmt.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2.5 flex justify-between">
                      <span className="font-bold text-gray-900">Total payable</span>
                      <div className="text-right">
                        <p className="font-display text-2xl text-gray-900">₹{finalPrice.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-green-600 font-semibold">You save ₹{discountAmt.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>

                  {/* EMI */}
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

                  {/* Trust */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: <ShieldCheck size={14} className="text-green-600" />, label: '100% Refund', sub: 'if unavailable' },
                      { icon: <CreditCard size={14} className="text-blue-600" />, label: 'Easebuzz PG', sub: 'PCI-DSS secure' },
                      { icon: <BadgePercent size={14} className="text-amber-600" />, label: '15% OFF', sub: 'flash sale price' },
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
                    {['Visa', 'Mastercard', 'UPI', 'Net Banking', 'RuPay', '0% EMI'].map(m => (
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
                          {paying ? 'Redirecting…' : `Pay ₹${finalPrice.toLocaleString('en-IN')} via Easebuzz`}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setPayError(''); }}
                          className="px-4 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Back</button>
                      </div>
                      <p className="text-[10px] text-gray-400 text-center">🔒 256-bit SSL · Secured by Easebuzz · No card details stored</p>
                    </form>
                  )}
                </>
              )}

              {!selected && (
                <p className="text-center text-sm text-gray-400 py-4">👆 Select a destination above to see pricing & EMI</p>
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
                  <p className="text-white/60 text-sm max-w-xs">Our expert calls you within <span className="text-amber-400 font-bold">1 hour</span> with the flash sale price + EMI plan.</p>
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
                      <p className="text-white/60 text-xs mt-0.5">Get flash sale price locked in + EMI options — no advance needed.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[['🔥','15% Flash Off'],['💳','EMI plans'],['🔒','No advance']].map(([icon,label]) => (
                      <div key={label} className="bg-white/8 rounded-xl py-2 text-center">
                        <p className="text-lg">{icon}</p>
                        <p className="text-white/60 text-[10px] font-medium mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
                    {['Flash sale price guaranteed', 'Custom itinerary + best dates', 'Group discount for 4+ pax', '0% EMI up to 12 months'].map(item => (
                      <p key={item} className="text-white/70 text-xs flex items-center gap-2">
                        <span className="text-amber-400">✓</span> {item}
                      </p>
                    ))}
                  </div>
                  {/* Optional: pick destination for callback */}
                  <div>
                    <p className="text-white/60 text-xs mb-2">Interested in (optional):</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {PACKAGES.map(pkg => (
                        <button key={pkg.label} type="button" onClick={() => setSelected(selected?.label === pkg.label ? null : pkg)}
                          className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all ${selected?.label === pkg.label ? 'bg-amber-400 border-amber-400 text-gray-900' : 'bg-white/8 border-white/15 text-white/70 hover:border-white/30'}`}>
                          {pkg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input required type="text" placeholder="Your name" value={cbName} onChange={e => setCbName(e.target.value)}
                    className="w-full px-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400" />
                  <input required type="tel" placeholder="Phone number (we'll call you)" value={cbPhone} onChange={e => setCbPhone(e.target.value)}
                    className="w-full px-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400" />
                  <button type="submit" disabled={cbSending}
                    className="w-full flex items-center justify-center gap-2 bg-amber-400 text-gray-900 font-bold text-sm py-3.5 rounded-xl hover:bg-amber-300 disabled:opacity-60 transition-colors">
                    {cbSending ? <Loader2 size={14} className="animate-spin" /> : '📞'}
                    {cbSending ? 'Booking callback…' : 'Get Free Callback + Flash Sale Price'}
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

export default function LimitedOffersBanner() {
  const [visible, setVisible] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!visible) return null;

  return (
    <>
      <div className="relative bg-gradient-to-r from-[#1C1C1C] via-[#2d1f0e] to-[#1C1C1C] overflow-hidden">
        {/* Background shimmer stripes */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(196,167,125,0.4) 20px, rgba(196,167,125,0.4) 22px)',
          }}
        />

        <div className="relative z-10 section-container py-5 md:py-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">

            {/* Label */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 bg-terracotta text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                <Zap className="w-3.5 h-3.5 fill-white" />
                Flash Sale
              </div>
              <div className="text-white text-sm font-semibold hidden sm:block">
                Ends in
              </div>
              <Countdown />
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-white/15" />

            {/* Promo codes */}
            <div className="flex flex-wrap items-center justify-center gap-3 flex-1">
              {OFFERS.map(({ code, discount, label, color }) => (
                <button
                  key={code}
                  onClick={() => copyCode(code)}
                  className="group flex items-center gap-2 bg-white/10 hover:bg-white/18 border border-white/15 hover:border-white/30 text-white rounded-xl px-4 py-2 transition-all"
                >
                  <Tag className="w-3.5 h-3.5 text-accent shrink-0" />
                  <div className="text-left">
                    <div className="text-xs text-white/55 leading-none">{label}</div>
                    <div className="font-bold text-sm leading-tight text-accent">{discount}</div>
                  </div>
                  <div className={`${color} text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ml-1`}>
                    {copied === code ? '✓ Copied!' : code}
                  </div>
                </button>
              ))}
            </div>

            {/* CTA — opens drawer */}
            <button
              onClick={() => setShowDrawer(true)}
              className="shrink-0 flex items-center gap-2 bg-accent hover:bg-accent-warm text-primary text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all shadow-lg whitespace-nowrap"
            >
              Book Now
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors p-1"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {showDrawer && <FlashSaleDrawer onClose={() => setShowDrawer(false)} />}
    </>
  );
}
