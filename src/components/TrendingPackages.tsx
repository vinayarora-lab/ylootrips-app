'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import type { MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Star, Clock, MapPin, Flame, Shield, Eye, Zap, TrendingUp, X, CreditCard, Loader2, BadgePercent } from 'lucide-react';
import { api } from '@/lib/api';
import { Trip } from '@/types';
import { formatPriceWithCurrency, calculateDiscount } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';
import { useWallet } from '@/context/WalletContext';
import { getDestinationImageUrl } from '@/lib/destinationImages';
import PaymentOptions from '@/components/PaymentOptions';
import PromoCodeInput from '@/components/PromoCodeInput';

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

/* ── Booking Drawer ───────────────────────────────────────────────── */
function TrendingBookingDrawer({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  const { balance: walletBalance, addCashback, deductBalance } = useWallet();
  const [guests, setGuests] = useState('2');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [payStep, setPayStep] = useState<'options' | 'form'>('options');
  const [chargeNow, setChargeNow] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoCashback, setPromoCashback] = useState(0);
  const [applyWallet, setApplyWallet] = useState(false);

  const rawPrice = Number(trip.price) || 0;
  const rawOrig = trip.originalPrice ? Number(trip.originalPrice) || 0 : 0;
  const pricePerPerson = rawOrig > 0 && rawOrig < rawPrice ? rawOrig : rawPrice;
  const mrpPerPerson = rawOrig > 0 && rawOrig < rawPrice ? rawPrice : rawOrig || rawPrice;

  const totalPrice = pricePerPerson * Number(guests || 2);
  const mrpTotal = mrpPerPerson * Number(guests || 2);
  const discountAmt = mrpTotal > totalPrice ? mrpTotal - totalPrice : 0;
  const maxWalletUsable = Math.floor(totalPrice * 0.10);
  const walletDeduction = applyWallet ? Math.min(walletBalance, maxWalletUsable) : 0;
  const effectiveTotal = Math.max(0, totalPrice - walletDeduction);

  const handlePaymentSelected = (payload: { amountNow: number; mode: string; paymentMethod?: string }) => {
    setChargeNow(payload.amountNow);
    setPaymentMode(payload.mode);
    setPaymentMethod(payload.paymentMethod ?? 'upi');
    setPayStep('form');
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true); setPayError('');
    try {
      const res = await fetch('/api/market/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone, guests,
          packageTitle: trip.title,
          destination: trip.destination,
          sourceUrl: `https://ylootrips.com/trips/${trip.id}`,
          ourPrice: effectiveTotal,
          chargeNow: chargeNow ?? effectiveTotal,
          paymentMode, paymentMethod,
          marketPrice: mrpTotal, priceDiff: discountAmt,
          promoCode, walletDeduction,
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) { window.location.href = data.paymentUrl; }
      else { setPayError(data.error || 'Payment failed. Please try again.'); }
    } catch { setPayError('Network error. Please try again.'); }
    finally { setPaying(false); }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[calc(92vh-64px)] sm:max-h-[90vh] flex flex-col mb-16 sm:mb-0">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wide">{trip.duration}</span>
            <h3 className="font-bold text-gray-900 text-lg mt-1 line-clamp-1">{trip.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{trip.destination}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 shrink-0 ml-3"><X size={18} /></button>
        </div>

        <div className="overflow-y-auto flex-1 overscroll-contain">
          <div className="p-5 space-y-4 pb-6">

            {/* Guests */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Number of Guests</label>
              <div className="flex gap-2">
                {['1','2','3','4','5','6'].map(n => (
                  <button key={n} onClick={() => { setGuests(n); setChargeNow(null); setPayStep('options'); }}
                    className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all ${guests === n ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}>{n}</button>
                ))}
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">₹{pricePerPerson.toLocaleString('en-IN')} × {guests} guest{Number(guests) > 1 ? 's' : ''}</span>
                <span className="text-gray-700 font-medium">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <span className="flex items-center gap-1"><BadgePercent size={13} /> Package discount</span>
                  <span className="font-semibold">− ₹{discountAmt.toLocaleString('en-IN')}</span>
                </div>
              )}
              {promoCashback > 0 && (
                <div className="flex justify-between text-sm text-amber-700">
                  <span>🎟 Promo cashback credited to wallet</span>
                  <span className="font-semibold">+₹{promoCashback.toLocaleString('en-IN')}</span>
                </div>
              )}
              {walletDeduction > 0 && (
                <div className="flex justify-between text-sm text-amber-700">
                  <span>💰 WanderLoot wallet</span>
                  <span className="font-semibold">− ₹{walletDeduction.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total payable</span>
                <div className="text-right">
                  <p className="font-display text-2xl text-gray-900">₹{effectiveTotal.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-gray-400">incl. all taxes</p>
                </div>
              </div>
            </div>

            {/* Payment options step */}
            {payStep === 'options' && (
              <>
                <PromoCodeInput
                  orderTotal={totalPrice}
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

                {walletBalance > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💰</span>
                        <div>
                          <p className="text-sm font-bold text-amber-900">WanderLoot Wallet</p>
                          <p className="text-xs text-amber-600">Balance: ₹{walletBalance.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs text-amber-700 font-medium">Use up to ₹{maxWalletUsable.toLocaleString('en-IN')}</span>
                        <input type="checkbox" checked={applyWallet} onChange={e => setApplyWallet(e.target.checked)} className="w-4 h-4 accent-amber-500" />
                      </label>
                    </div>
                    {applyWallet && walletDeduction > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-800 font-semibold bg-amber-100 rounded-lg px-2.5 py-1.5">
                        <span>💰</span> WanderLoot applied · −₹{walletDeduction.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                )}

                <PaymentOptions
                  tripPrice={effectiveTotal}
                  tripTitle={trip.title}
                  onProceed={handlePaymentSelected}
                />
              </>
            )}

            {/* Details form step */}
            {payStep === 'form' && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3.5">
                  <p className="text-xs font-bold text-green-800 mb-1">✅ Plan selected</p>
                  <p className="text-sm text-green-700">{paymentMode}</p>
                  <p className="text-sm font-bold text-green-900">Paying now: ₹{(chargeNow ?? effectiveTotal).toLocaleString('en-IN')}</p>
                  {chargeNow !== null && chargeNow < effectiveTotal && (
                    <p className="text-xs text-green-600 mt-0.5">Remaining ₹{(effectiveTotal - chargeNow).toLocaleString('en-IN')} due before trip</p>
                  )}
                </div>
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
                      {paying ? 'Redirecting…' : `Pay ₹${(chargeNow ?? effectiveTotal).toLocaleString('en-IN')} via Easebuzz`}
                    </button>
                    <button type="button" onClick={() => { setPayStep('options'); setPayError(''); }}
                      className="px-4 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Back</button>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center">🔒 256-bit SSL · Secured by Easebuzz · No card details stored</p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Individual Card ──────────────────────────────────────────────── */
function TrendingCard({ trip, rank, onBook }: { trip: Trip; rank: number; onBook: (trip: Trip) => void }) {
  const { currency } = useCurrency();
  const { visitor } = useVisitor();
  const fp = (p: typeof trip.price) => formatPriceWithCurrency(p, currency);
  // Always show higher number as MRP (crossed out) and lower as offer price
  const rawPrice = Number(trip.price) || 0;
  const rawOrig = trip.originalPrice ? Number(trip.originalPrice) || 0 : 0;
  const offerPrice = rawOrig > 0 && rawOrig < rawPrice ? trip.originalPrice! : trip.price;
  const mrpPrice = rawOrig > 0 && rawOrig < rawPrice ? trip.price : trip.originalPrice;
  const discount = mrpPrice ? calculateDiscount(mrpPrice, offerPrice) : 0;
  const spotsLeft = getSpotsLeft(trip.id);
  const viewers = getViewers(trip.id);
  const isStatic = trip.id >= 9000;
  const slug = (trip as any).slug as string | undefined;
  const packageHref = slug ? `/${slug}` : `/trips/${trip.id}`;
  const bookHref = isStatic ? packageHref : (visitor === 'foreigner' ? '/tours' : `/checkout?tripId=${trip.id}`);
  const detailHref = isStatic ? packageHref : `/trips/${trip.id}`;
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

        <Link href={detailHref}>
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
                <span className="font-display text-2xl text-primary">{fp(offerPrice)}</span>
                {mrpPrice && Number(mrpPrice) !== Number(offerPrice) && (
                  <span className="text-sm text-primary/35 line-through">{fp(mrpPrice)}</span>
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
            <button
              onClick={() => onBook(trip)}
              className="col-span-3 flex items-center justify-center gap-1.5 bg-primary text-cream py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-secondary transition-colors rounded-lg shadow-md hover:shadow-lg"
            >
              <Zap className="w-3.5 h-3.5" />
              Book Now
            </button>
            <Link
              href={detailHref}
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

/* ── Static fallback packages (shown if API fails or returns empty) ── */
const STATIC_TRENDING: Trip[] = [
  { id: 9001, title: 'Bali Honeymoon Package', destination: 'Bali, Indonesia', duration: '6N/7D', price: 52499, originalPrice: 65999, rating: 4.9, reviewCount: 312, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', isFeatured: true, isTrending: true, isPopular: true, category: 'International', description: '', highlights: [], includes: [], excludes: [], difficulty: 'Easy', maxGroupSize: 2, slug: 'bali-honeymoon-package' } as any,
  { id: 9002, title: 'Kashmir Paradise Tour', destination: 'Srinagar, Kashmir', duration: '6N/7D', price: 18999, originalPrice: 24999, rating: 4.9, reviewCount: 428, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', isFeatured: true, isTrending: true, isPopular: true, category: 'Domestic', description: '', highlights: [], includes: [], excludes: [], difficulty: 'Easy', maxGroupSize: 10, slug: 'kashmir-tour-package' } as any,
  { id: 9003, title: 'Kerala Backwaters & Beaches', destination: 'Kerala, India', duration: '7N/8D', price: 22499, originalPrice: 28999, rating: 4.8, reviewCount: 356, imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80', isFeatured: true, isTrending: true, isPopular: true, category: 'Domestic', description: '', highlights: [], includes: [], excludes: [], difficulty: 'Easy', maxGroupSize: 10, slug: 'kerala-tour-package' } as any,
  { id: 9004, title: 'Dubai Luxury Escape', destination: 'Dubai, UAE', duration: '5N/6D', price: 45999, originalPrice: 57999, rating: 4.8, reviewCount: 289, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', isFeatured: true, isTrending: true, isPopular: true, category: 'International', description: '', highlights: [], includes: [], excludes: [], difficulty: 'Easy', maxGroupSize: 6, slug: 'dubai-tour-package-from-delhi' } as any,
  { id: 9005, title: 'Maldives Luxury Package', destination: 'Maldives', duration: '5N/6D', price: 89999, originalPrice: 115000, rating: 4.9, reviewCount: 198, imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80', isFeatured: true, isTrending: true, isPopular: true, category: 'International', description: '', highlights: [], includes: [], excludes: [], difficulty: 'Easy', maxGroupSize: 4, slug: 'maldives-luxury-package' } as any,
  { id: 9006, title: 'Goa Beach Holiday', destination: 'Goa, India', duration: '4N/5D', price: 12999, originalPrice: 16999, rating: 4.7, reviewCount: 512, imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', isFeatured: true, isTrending: true, isPopular: true, category: 'Domestic', description: '', highlights: [], includes: [], excludes: [], difficulty: 'Easy', maxGroupSize: 10, slug: 'goa-tour-package' } as any,
];

/* ── Main Component ───────────────────────────────────────────────── */
export default function TrendingPackages() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState<Trip | null>(null);

  useEffect(() => {
    api.getTrendingTrips()
      .then(r => {
        const data = (r.data || []).slice(0, 6);
        setTrips(data.length >= 3 ? data : STATIC_TRENDING);
      })
      .catch(() =>
        api.getFeaturedTrips()
          .then(r => {
            const data = (r.data || []).slice(0, 6);
            setTrips(data.length >= 3 ? data : STATIC_TRENDING);
          })
          .catch(() => setTrips(STATIC_TRENDING))
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-cream to-cream-dark overflow-hidden">
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(trips.length > 0 ? trips : STATIC_TRENDING).map((trip, i) => (
              <TrendingCard key={trip.id} trip={trip} rank={i + 1} onBook={setActiveBooking} />
            ))}
          </div>
        )}

        {/* Booking drawer */}
        {activeBooking && (
          <TrendingBookingDrawer trip={activeBooking} onClose={() => setActiveBooking(null)} />
        )}

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
