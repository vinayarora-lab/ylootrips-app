'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Lock, CheckCircle, Shield, CreditCard, RefreshCw,
  Users, Calendar, MapPin, Phone, Mail, MessageCircle,
  Star, ChevronRight, BadgeCheck, Globe, Clock,
} from 'lucide-react';
import PaymentMethods from '@/components/PaymentMethods';
import PromoCodeInput from '@/components/PromoCodeInput';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';
import { useWallet } from '@/context/WalletContext';
import { formatPriceWithCurrency } from '@/lib/utils';
import { PromoCode } from '@/lib/promoCodes';
import { api } from '@/lib/api';

// Tour data — all amounts in INR (fp() converts display currency)
const TOURS: Record<string, {
  title: string; priceINR: number; priceUSD: number;
  duration: string; location: string; route: string;
  image: string; rating: number; reviews: number;
  includes: string[];
  // Set tripId after creating in admin panel → enables direct Easebuzz payment
  tripId: number | null;
}> = {
  'golden-triangle-10-day': {
    title: '10-Day Golden Triangle Tour',
    priceINR: 117600, priceUSD: 1400,
    duration: '10 Days / 9 Nights',
    location: 'Delhi · Agra · Jaipur',
    route: '/tours/golden-triangle-10-day',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    rating: 4.9, reviews: 312,
    tripId: null, // TODO: set after creating in admin panel
    includes: ['Private English-speaking guide', 'All accommodation (4★)', 'Airport & station transfers', 'All monument entry fees', 'Daily breakfast included', 'Local SIM card'],
  },
  'kerala-south-india-14-day': {
    title: '14-Day Kerala & South India Tour',
    priceINR: 159600, priceUSD: 1900,
    duration: '14 Days / 13 Nights',
    location: 'Kochi · Munnar · Alleppey · Pondicherry',
    route: '/tours/kerala-south-india-14-day',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    rating: 4.9, reviews: 287,
    tripId: null,
    includes: ['Private English-speaking guide', 'Houseboat stay (1 night)', '4★ hotels throughout', 'All transfers', 'Spice plantation tour', 'Daily breakfast'],
  },
  'rajasthan-heritage-7-day': {
    title: '7-Day Rajasthan Heritage Tour',
    priceINR: 79800, priceUSD: 950,
    duration: '7 Days / 6 Nights',
    location: 'Jaipur · Jodhpur · Udaipur',
    route: '/tours/rajasthan-heritage-7-day',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80',
    rating: 4.8, reviews: 194,
    tripId: null,
    includes: ['Private English-speaking guide', 'Heritage haveli stays', 'Desert safari (camel/jeep)', 'All fort & palace tickets', 'Private AC vehicle', 'Daily breakfast'],
  },
};

// Keywords for searching each tour in the DB
const TOUR_KEYWORDS: Record<string, string[]> = {
  'golden-triangle-10-day': ['golden triangle', 'golden', 'agra', 'jaipur', 'delhi agra'],
  'kerala-south-india-14-day': ['kerala', 'south india', 'kochi', 'alleppey', 'backwater'],
  'rajasthan-heritage-7-day': ['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'heritage'],
};

function TourCheckoutContent() {
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const { visitor } = useVisitor();

  const { balance: walletBalance, addCashback, deductBalance } = useWallet();

  const slug = searchParams.get('tour') || '';
  const guestsParam = Number(searchParams.get('guests')) || 1;
  const dateParam = searchParams.get('date') || '';

  const tour = TOURS[slug];
  const fp = (p: number) => formatPriceWithCurrency(p, currency);

  const [tripId, setTripId] = useState<number | null>(tour?.tripId ?? null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [applyWallet, setApplyWallet] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [done, setDone] = useState(false);
  const [doneViaContact, setDoneViaContact] = useState(false);

  const [selectedEmi, setSelectedEmi] = useState<{
    tenure: number; monthlyAmount: number; totalAmount: number;
    interestRate: number; interestAmount: number; noCost: boolean;
    label: string; description: string;
  } | null>(null);
  const [halfPaymentCardType, setHalfPaymentCardType] = useState<'credit' | 'debit'>('credit');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    numberOfGuests: guestsParam,
    travelDate: dateParam,
    specialRequests: '',
    paymentMethod: 'credit_card',
  });

  // Try to resolve a tripId from the backend database
  useEffect(() => {
    if (!tour || tripId !== null) return;

    const keywords = TOUR_KEYWORDS[slug] || [];

    const tryFind = async () => {
      // Strategy 1: search by specific keywords
      for (const kw of keywords) {
        try {
          const res = await api.searchTrips(kw);
          const trips: Array<{ id: number; title: string }> = Array.isArray(res.data) ? res.data : (res.data?.content || []);
          if (trips.length > 0) {
            setTripId(trips[0].id);
            return;
          }
        } catch { /* try next */ }
      }

      // Strategy 2: fetch all trips and match locally
      try {
        const allRes = await api.getTrips();
        const allTrips: Array<{ id: number; title: string }> = Array.isArray(allRes.data) ? allRes.data : (allRes.data?.content || []);
        const match = allTrips.find((t) => {
          const tLower = t.title.toLowerCase();
          return keywords.some((kw) => tLower.includes(kw));
        });
        if (match) {
          setTripId(match.id);
        }
      } catch { /* no match */ }
    };

    tryFind();
  }, [tour, slug, tripId]);

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-primary mb-4">Tour Not Found</h1>
          <Link href="/trips" className="btn-primary">Browse Tours</Link>
        </div>
      </div>
    );
  }

  // All prices in INR — fp() converts to display currency automatically
  const pricePerPerson = tour.priceINR;
  const basePrice = pricePerPerson * formData.numberOfGuests;
  const discountPercent = formData.paymentMethod === 'upi' ? 5
    : (formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') ? 3 : 0;
  const discountAmount = (basePrice * discountPercent) / 100;
  const priceAfterDiscount = basePrice - discountAmount - promoDiscount;
  const maxWalletUsable = Math.round(Math.max(0, priceAfterDiscount) * 0.10); // cap at 10% of order
  const walletDeduction = applyWallet ? Math.min(walletBalance, maxWalletUsable) : 0;
  const totalPrice = Math.max(0, priceAfterDiscount - walletDeduction);
  const totalINR = totalPrice;
  const cashbackAmount = Math.round(totalPrice * 0.10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.travelDate) { setPaymentError('Please select a travel date'); return; }
    setSubmitting(true);
    setPaymentError(null);

    let paymentType = 'FULL';
    if (selectedEmi) paymentType = 'EMI';
    else if (formData.paymentMethod === 'half_payment') paymentType = 'HALF_PAYMENT';

    const resolvedPaymentMethod = formData.paymentMethod === 'half_payment'
      ? (halfPaymentCardType === 'credit' ? 'credit_card' : 'debit_card')
      : formData.paymentMethod;

    const baseBookingFields = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      numberOfGuests: formData.numberOfGuests,
      travelDate: formData.travelDate,
      specialRequests: `[Tour: ${tour.title}]${formData.specialRequests ? ' ' + formData.specialRequests : ''}`,
      paymentMethod: resolvedPaymentMethod,
      paymentType,
      emiEnabled: selectedEmi !== null,
      emiTenure: selectedEmi?.tenure || null,
      emiMonthlyAmount: selectedEmi?.monthlyAmount || null,
      emiTotalAmount: selectedEmi?.totalAmount || null,
      emiInterestRate: selectedEmi?.interestRate || null,
    };

    // Attempt 1: with tripId (if resolved from DB)
    // Attempt 2: with tourSlug + totalAmount (might work if backend accepts it)
    const payloads = [
      ...(tripId ? [{ ...baseBookingFields, trip: { id: tripId } }] : []),
      { ...baseBookingFields, tourSlug: slug, tourTitle: tour.title, totalAmount: totalINR },
    ];

    for (const payload of payloads) {
      try {
        const bookingResponse = await api.createBooking(payload);
        const booking = bookingResponse.data;
        if (!booking?.bookingReference) continue;

        const paymentResponse = await api.initiatePayment(booking.bookingReference);
        const paymentData = paymentResponse.data;

        if (paymentData?.paymentUrl) {
          // Store pending wallet/cashback info — credited only after payment confirmed
          sessionStorage.setItem(`ylootrips-pending-${booking.bookingReference}`, JSON.stringify({
              walletDeduction,
              totalPrice,
              tripName: tour.title,
          }));
          window.location.href = paymentData.paymentUrl;
          return;
        }
      } catch (err) {
        console.error('[TourCheckout] Attempt failed:', err);
      }
    }

    // Final fallback: submit contact inquiry — team sends payment link manually
    try {
      await api.submitContactInquiry({
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
        destination: tour.title,
        travelers: String(formData.numberOfGuests),
        preferredDates: formData.travelDate,
        message: `TOUR BOOKING REQUEST\nTour: ${tour.title}\nGuests: ${formData.numberOfGuests}\nDate: ${formData.travelDate || 'TBD'}\nPayment: ${resolvedPaymentMethod} (${paymentType})\nTotal: ${fp(totalPrice)}\n${walletDeduction > 0 ? `Wallet Applied: ${fp(walletDeduction)}\n` : ''}${formData.specialRequests ? 'Requests: ' + formData.specialRequests : ''}`,
      });
      // No cashback for manual inquiry — credited only after confirmed online payment
      setDoneViaContact(true);
    } catch {
      setPaymentError('Could not process. Please WhatsApp us directly.');
      setSubmitting(false);
    }
  };

  // ── Success screens ──────────────────────────────────────────
  if (done) {
    return (
      <SuccessScreen
        title="Payment Successful!"
        subtitle="Your booking is confirmed. Check your email for the confirmation and itinerary."
        icon="✅"
        cta={{ label: 'Back to Tour', href: tour.route }}
      />
    );
  }

  if (doneViaContact) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-1">Request Received!</h1>
              <p className="text-white/85 text-sm">We'll send your payment link within 1 hour</p>
            </div>

            <div className="p-8">
              {/* Booking summary */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image src={tour.image} alt={tour.title} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-amber-900 text-sm">{tour.title}</div>
                    <div className="text-xs text-amber-700">{tour.location} · {tour.duration}</div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-amber-800 font-medium">
                  <span>{formData.numberOfGuests} traveler{formData.numberOfGuests > 1 ? 's' : ''}</span>
                  <span className="font-bold">{fp(totalPrice)}</span>
                </div>
              </div>

              {/* What happens next */}
              <h2 className="font-semibold text-gray-800 mb-4">What happens next?</h2>
              <div className="space-y-3 mb-8">
                {[
                  { step: '1', icon: '📋', text: 'Our team reviews your booking details' },
                  { step: '2', icon: '🔒', text: 'We send you a secure Easebuzz payment link via WhatsApp & email' },
                  { step: '3', icon: '💳', text: 'You pay online — Visa, Mastercard, Amex accepted' },
                  { step: '4', icon: '✉️', text: 'Instant booking confirmation + detailed itinerary' },
                ].map(({ step, icon, text }) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm shrink-0">{icon}</div>
                    <p className="text-sm text-gray-600">{text}</p>
                  </div>
                ))}
              </div>

              {/* Security badges */}
              <div className="flex justify-center gap-4 mb-6 py-4 bg-gray-50 rounded-xl">
                {['🔒 256-bit SSL', '🏛️ Ministry Registered', '💳 PCI-DSS'].map((b) => (
                  <span key={b} className="text-xs text-gray-500 font-medium">{b}</span>
                ))}
              </div>

              <div className="flex gap-3">
                <a
                  href={`https://wa.me/918427831127?text=Hi!%20I%20just%20submitted%20a%20booking%20for%20${encodeURIComponent(tour.title)}.%20My%20name%20is%20${encodeURIComponent(formData.customerName)}.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-bold rounded-xl transition-colors"
                >
                  <MessageCircle size={16} /> WhatsApp Us
                </a>
                <Link href={tour.route} className="flex-1 flex items-center justify-center py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                  Back to Tour
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout Form ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Security top bar */}
      <div className="bg-gray-900 text-white py-2.5">
        <div className="section-container">
          <div className="flex items-center justify-center gap-6 text-xs">
            <span className="flex items-center gap-1.5"><Lock size={11} className="text-green-400" /> 256-bit SSL Encrypted</span>
            <span className="hidden sm:flex items-center gap-1.5"><Shield size={11} className="text-blue-400" /> PCI-DSS Compliant</span>
            <span className="hidden sm:flex items-center gap-1.5"><BadgeCheck size={11} className="text-amber-400" /> Ministry of Tourism Registered</span>
            <span className="flex items-center gap-1.5"><Globe size={11} className="text-purple-400" /> International Cards Accepted</span>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="section-container py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/trips" className="hover:text-gray-700">Tours</Link>
            <ChevronRight size={12} />
            <Link href={tour.route} className="hover:text-gray-700 max-w-[160px] truncate">{tour.title}</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium">Secure Checkout</span>
          </nav>
        </div>
      </div>

      <div className="section-container py-8 md:py-12">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">Complete your booking · Payment processed by Easebuzz (RBI licensed)</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* ── FORM (left, 3 cols) ── */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* International payment notice */}
              {visitor === 'foreigner' && (
                <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <Globe size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">International Booking</p>
                    <p className="text-xs text-blue-700 mt-0.5">All major international cards accepted · Prices shown in {currency} · Payment processed in INR by your bank at live rate · No extra charges</p>
                  </div>
                </div>
              )}

              {/* Section: Traveler Details */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">1</div>
                  <h2 className="font-semibold text-gray-800">Traveler Details</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input
                      required type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-gray-50"
                      placeholder="As on your passport"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          required type="email"
                          value={formData.customerEmail}
                          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-gray-50"
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone / WhatsApp *</label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          required type="tel"
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-gray-50"
                          placeholder="+1 555 000 0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Trip Details */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">2</div>
                  <h2 className="font-semibold text-gray-800">Trip Details</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Preferred Start Date *</label>
                      <div className="relative">
                        <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          required type="date"
                          value={formData.travelDate}
                          onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Number of Travelers *</label>
                      <div className="relative">
                        <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          value={formData.numberOfGuests}
                          onChange={(e) => setFormData({ ...formData, numberOfGuests: Number(e.target.value) })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 appearance-none"
                        >
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Special Requests</label>
                    <textarea
                      rows={2}
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 resize-none"
                      placeholder="Dietary needs, room preferences, anniversaries, mobility requirements…"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Payment */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">3</div>
                  <h2 className="font-semibold text-gray-800">Payment Method</h2>
                  <Lock size={13} className="text-green-500 ml-auto" />
                  <span className="text-xs text-green-600 font-medium">Secured by Easebuzz</span>
                </div>
                <div className="p-6">
                  <PaymentMethods
                    selectedMethod={formData.paymentMethod}
                    onMethodChange={(method) => {
                      setFormData({ ...formData, paymentMethod: method });
                      if (method !== 'credit_card') setSelectedEmi(null);
                    }}
                    amount={totalINR}
                    selectedEmi={selectedEmi}
                    onEmiChange={(emi) => setSelectedEmi(emi)}
                    onHalfPaymentCardTypeChange={(t) => setHalfPaymentCardType(t)}
                    isInternational={visitor === 'foreigner'}
                  />

                  {/* Payment card logos */}
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    {['VISA', 'MC', 'AMEX', 'UPI', 'Netbanking'].map((m) => (
                      <span key={m} className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded border border-gray-200">{m}</span>
                    ))}
                    <span className="text-xs text-gray-400 ml-1">All cards accepted</span>
                  </div>
                </div>
              </div>

              {/* Promo code section */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">4</div>
                  <h2 className="font-semibold text-gray-800">Promo Code</h2>
                </div>
                <div className="p-6">
                  <PromoCodeInput
                    orderTotal={basePrice - discountAmount}
                    appliedCode={promoCode}
                    discountAmount={promoDiscount}
                    onApply={(code, discount, _promo: PromoCode) => {
                      setPromoCode(code);
                      setPromoDiscount(discount);
                    }}
                    onRemove={() => { setPromoCode(null); setPromoDiscount(0); }}
                  />
                </div>
              </div>

              {/* Wallet balance section */}
              {walletBalance > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">₹</span>
                      </div>
                      <div>
                        <p className="font-semibold text-amber-900 text-sm">WanderLoot 💸</p>
                        <p className="text-xs text-amber-700">Balance: {fp(walletBalance)} · Use up to {fp(maxWalletUsable)} here</p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyWallet}
                        onChange={(e) => setApplyWallet(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Apply</span>
                    </label>
                  </div>
                  {applyWallet && walletDeduction > 0 && (
                    <div className="mt-3 pt-3 border-t border-amber-200 flex items-center justify-between">
                      <span className="text-sm text-amber-800">💰 WanderLoot cashback applied</span>
                      <span className="text-sm font-bold text-green-700">−{fp(walletDeduction)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {paymentError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <p className="font-semibold mb-1">⚠️ Payment could not be initiated</p>
                  <p className="mb-2">{paymentError}</p>
                  <a
                    href={`https://wa.me/918427831127?text=Hi! I need help booking ${encodeURIComponent(tour.title)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-green-700 font-semibold underline"
                  >
                    <MessageCircle size={14} /> Contact us on WhatsApp
                  </a>
                </div>
              )}

              {/* Terms + Submit */}
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-amber-500 shrink-0" />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" className="text-amber-600 underline">Terms & Conditions</a>
                    {' '}and{' '}
                    <a href="/privacy" target="_blank" className="text-amber-600 underline">Privacy Policy</a>.
                    I understand that by clicking &quot;Pay Securely&quot; I will be redirected to Easebuzz&#39;s secure payment page.
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={submitting || !agreed}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
                >
                  <Lock size={15} />
                  {submitting ? 'Processing…' : `Pay Securely — ${fp(totalPrice)}`}
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Shield size={12} className="text-green-500" />
                  Your payment info is encrypted and never stored on our servers
                </div>
              </div>
            </form>
          </div>

          {/* ── ORDER SUMMARY (right, 2 cols) ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">

              {/* Tour card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="relative h-36">
                  <Image src={tour.image} alt={tour.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-sm leading-tight">{tour.title}</h3>
                    <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin size={10} /> {tour.location}
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold">{tour.rating}</span>
                    <span className="text-xs text-gray-400">({tour.reviews})</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Clock size={12} /> {tour.duration}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> Private tour</span>
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Price per person</span>
                      <span>{fp(pricePerPerson)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>× {formData.numberOfGuests} traveler{formData.numberOfGuests > 1 ? 's' : ''}</span>
                      <span>{fp(basePrice)}</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span>Payment discount ({discountPercent}% off)</span>
                        <span>−{fp(discountAmount)}</span>
                      </div>
                    )}
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span>🏷️ Promo ({promoCode})</span>
                        <span>−{fp(promoDiscount)}</span>
                      </div>
                    )}
                    {walletDeduction > 0 && (
                      <div className="flex justify-between text-sm text-amber-600 font-medium">
                        <span>💰 WanderLoot</span>
                        <span>−{fp(walletDeduction)}</span>
                      </div>
                    )}
                    {selectedEmi && (
                      <div className="flex justify-between text-sm text-blue-600 font-medium">
                        <span>EMI ({selectedEmi.tenure} months)</span>
                        <span>{fp(selectedEmi.monthlyAmount)}/mo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-3 border-t border-gray-100">
                    <span className="font-bold text-gray-800">Total Payable</span>
                    <span className="text-2xl font-bold text-amber-600">{fp(totalPrice)}</span>
                  </div>
                  {visitor === 'foreigner' && (
                    <p className="text-[10px] text-gray-400 text-right mt-1">Charged in INR · bank converts at live rate</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-green-700 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    No hidden fees · all taxes included
                  </div>
                  {cashbackAmount > 0 && (
                    <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                      🎉 You&apos;ll earn <strong>{fp(cashbackAmount)}</strong> cashback on this booking!
                    </div>
                  )}
                </div>
              </div>

              {/* What's included */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h4 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle size={15} className="text-green-500" /> What&apos;s Included
                </h4>
                <ul className="space-y-2">
                  {tour.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Lock, label: '256-bit SSL', sub: 'Encrypted checkout', color: 'text-green-600', bg: 'bg-green-50' },
                    { icon: CreditCard, label: 'PCI-DSS', sub: 'Certified gateway', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { icon: RefreshCw, label: 'Free Cancel', sub: '7 days before trip', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { icon: BadgeCheck, label: 'Govt. Licensed', sub: 'Ministry of Tourism', color: 'text-purple-600', bg: 'bg-purple-50' },
                  ].map(({ icon: Icon, label, sub, color, bg }) => (
                    <div key={label} className={`flex flex-col items-center text-center p-3 ${bg} rounded-xl`}>
                      <Icon size={18} className={`${color} mb-1`} />
                      <div className="text-xs font-bold text-gray-700">{label}</div>
                      <div className="text-[10px] text-gray-500">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <a
                href="https://wa.me/918427831127?text=Hi!%20I%20have%20a%20question%20about%20booking%20a%20tour."
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <MessageCircle size={16} /> Questions? WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ title, subtitle, icon, cta }: { title: string; subtitle: string; icon: string; cta: { label: string; href: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-6">{icon}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-500 mb-8">{subtitle}</p>
        <Link href={cta.href} className="btn-primary">{cta.label}</Link>
      </div>
    </div>
  );
}

export default function TourCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" /></div>}>
      <TourCheckoutContent />
    </Suspense>
  );
}
