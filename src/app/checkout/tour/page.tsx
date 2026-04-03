'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Users, MapPin, Lock, CheckCircle, ChevronRight } from 'lucide-react';
import PaymentMethods from '@/components/PaymentMethods';
import TrustBadges from '@/components/TrustBadges';
import CheckoutStepper from '@/components/CheckoutStepper';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';
import { formatPriceWithCurrency } from '@/lib/utils';
import { api } from '@/lib/api';

// Tour data: prices in INR (USD × 84)
const TOURS: Record<string, { title: string; priceINR: number; priceUSD: number; duration: string; location: string; route: string }> = {
  'golden-triangle-10-day': {
    title: '10-Day Golden Triangle Tour',
    priceINR: 117600,
    priceUSD: 1400,
    duration: '10 Days / 9 Nights',
    location: 'Delhi · Agra · Jaipur',
    route: '/tours/golden-triangle-10-day',
  },
  'kerala-south-india-14-day': {
    title: '14-Day Kerala & South India Tour',
    priceINR: 159600,
    priceUSD: 1900,
    duration: '14 Days / 13 Nights',
    location: 'Kochi · Munnar · Alleppey · Pondicherry',
    route: '/tours/kerala-south-india-14-day',
  },
  'rajasthan-heritage-7-day': {
    title: '7-Day Rajasthan Heritage Tour',
    priceINR: 79800,
    priceUSD: 950,
    duration: '7 Days / 6 Nights',
    location: 'Jaipur · Jodhpur · Udaipur',
    route: '/tours/rajasthan-heritage-7-day',
  },
};

function TourCheckoutContent() {
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const { visitor } = useVisitor();

  const slug = searchParams.get('tour') || '';
  const guestsParam = Number(searchParams.get('guests')) || 1;
  const dateParam = searchParams.get('date') || '';

  const tour = TOURS[slug];
  const fp = (p: number) => formatPriceWithCurrency(p, currency);

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
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
    paymentMethod: visitor === 'foreigner' ? 'credit_card' : 'credit_card',
  });

  if (!tour) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-primary mb-4">Tour Not Found</h1>
          <Link href="/trips" className="btn-primary">Browse Tours</Link>
        </div>
      </div>
    );
  }

  // Price per person in correct currency
  const pricePerPerson = visitor === 'foreigner' ? tour.priceUSD : tour.priceINR;
  const basePrice = pricePerPerson * formData.numberOfGuests;
  const discountPercent = formData.paymentMethod === 'upi' ? 5
    : (formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') ? 3 : 0;
  const discountAmount = (basePrice * discountPercent) / 100;
  const totalPrice = basePrice - discountAmount;
  // Always pass INR amount to payment gateway
  const totalINR = tour.priceINR * formData.numberOfGuests * (1 - discountPercent / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentMethod) { alert('Please select a payment method'); return; }
    setSubmitting(true);

    let paymentType = 'FULL';
    if (selectedEmi) paymentType = 'EMI';
    else if (formData.paymentMethod === 'half_payment') paymentType = 'HALF_PAYMENT';

    try {
      // Try API booking with tour slug as identifier
      const bookingData = {
        tourSlug: slug,
        tourTitle: tour.title,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        numberOfGuests: formData.numberOfGuests,
        travelDate: formData.travelDate,
        specialRequests: formData.specialRequests,
        paymentMethod: formData.paymentMethod === 'half_payment'
          ? (halfPaymentCardType === 'credit' ? 'credit_card' : 'debit_card')
          : formData.paymentMethod,
        paymentType,
        totalAmount: totalINR,
        emiEnabled: selectedEmi !== null,
        emiTenure: selectedEmi?.tenure || null,
        emiMonthlyAmount: selectedEmi?.monthlyAmount || null,
        emiTotalAmount: selectedEmi?.totalAmount || null,
        emiInterestRate: selectedEmi?.interestRate || null,
      };

      const bookingResponse = await api.createBooking(bookingData);
      const booking = bookingResponse.data;
      const paymentResponse = await api.initiatePayment(booking.bookingReference);
      const paymentData = paymentResponse.data;

      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
        return;
      }
      throw new Error('No payment URL received');
    } catch {
      // Fallback: WhatsApp booking with all details
      const emiNote = selectedEmi ? `%0AEMI: ${selectedEmi.tenure} months @ ${formatPriceWithCurrency(selectedEmi.monthlyAmount, currency)}/mo` : '';
      const msg = [
        `Hi! I'd like to book the *${tour.title}*`,
        `Name: ${formData.customerName}`,
        `Email: ${formData.customerEmail}`,
        `Phone: ${formData.customerPhone}`,
        `Guests: ${formData.numberOfGuests}`,
        `Travel Date: ${formData.travelDate || 'TBD'}`,
        `Payment: ${formData.paymentMethod.replace('_', ' ')} — ${paymentType}`,
        `Total: ${fp(totalPrice)}`,
        formData.specialRequests ? `Requests: ${formData.specialRequests}` : '',
      ].filter(Boolean).join('%0A');

      window.open(`https://wa.me/918427831127?text=${msg}${emiNote}`, '_blank');
      setDone(true);
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl text-primary mb-3">Booking Request Sent!</h1>
          <p className="text-primary/65 mb-2">We&apos;ve opened WhatsApp with your booking details.</p>
          <p className="text-primary/65 mb-8">Our team will confirm your booking and payment link within <strong>1 hour</strong>.</p>
          <Link href={tour.route} className="btn-primary">Back to Tour</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8 md:py-16">
      <div className="section-container">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-caption text-primary/40 uppercase tracking-wider mb-6 pt-6">
            <Link href="/trips" className="hover:text-primary transition-colors">Tours</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={tour.route} className="hover:text-primary transition-colors">{tour.title}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary">Checkout</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl md:text-display-xl mb-2">Complete Your Booking</h1>
          {visitor === 'foreigner' && (
            <p className="text-secondary mb-4 flex items-center gap-2 text-sm">
              <span>🌍</span>
              <span>International cards accepted · Prices shown in {currency} · No hidden fees</span>
            </p>
          )}

          <CheckoutStepper currentStep={2} />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Tour Summary */}
                <section className="bg-cream-light p-5 md:p-6 border border-primary/10">
                  <h2 className="text-xl font-light mb-4">Tour Summary</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-secondary mt-1 shrink-0" />
                      <div>
                        <p className="text-caption text-primary/50">Destination</p>
                        <p className="text-body-lg font-medium text-primary">{tour.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar size={20} className="text-secondary mt-1 shrink-0" />
                      <div>
                        <p className="text-caption text-primary/50">Duration</p>
                        <p className="text-body-lg text-primary">{tour.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users size={20} className="text-secondary mt-1 shrink-0" />
                      <div>
                        <p className="text-caption text-primary/50">Tour</p>
                        <p className="text-body-lg text-primary">{tour.title}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Personal Info */}
                <section>
                  <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Personal Information</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="text-caption text-primary/60 mb-2 block uppercase tracking-wider">Full Name *</label>
                      <input
                        required
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full p-4 border border-primary/20 bg-white text-primary"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-caption text-primary/60 mb-2 block uppercase tracking-wider">Email Address *</label>
                        <input
                          required
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                          className="w-full p-4 border border-primary/20 bg-white text-primary"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-caption text-primary/60 mb-2 block uppercase tracking-wider">Phone / WhatsApp *</label>
                        <input
                          required
                          type="tel"
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          className="w-full p-4 border border-primary/20 bg-white text-primary"
                          placeholder="+1 555 000 0000"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Travel Details */}
                <section>
                  <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Travel Details</h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-caption text-primary/60 mb-2 block uppercase tracking-wider">Preferred Start Date *</label>
                      <input
                        required
                        type="date"
                        value={formData.travelDate}
                        onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-4 border border-primary/20 bg-white text-primary"
                      />
                    </div>
                    <div>
                      <label className="text-caption text-primary/60 mb-2 block uppercase tracking-wider">Number of Travelers *</label>
                      <select
                        value={formData.numberOfGuests}
                        onChange={(e) => setFormData({ ...formData, numberOfGuests: Number(e.target.value) })}
                        className="w-full p-4 border border-primary/20 bg-white text-primary"
                      >
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                {/* Special Requests */}
                <section>
                  <h2 className="text-xl font-light mb-4">Special Requests</h2>
                  <textarea
                    rows={3}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="w-full p-4 border border-primary/20 bg-white text-primary"
                    placeholder="Dietary requirements, room preferences, anniversary setup, mobility needs…"
                  />
                </section>

                {/* Payment */}
                <section>
                  {visitor === 'foreigner' && (
                    <div className="mb-5 p-4 bg-blue-50 border border-blue-200 text-sm text-blue-800">
                      <p className="font-semibold mb-1">💳 International Payment Info</p>
                      <p>Payment is processed securely in INR via our gateway. Your bank converts to your local currency automatically. Visa, Mastercard, and Amex accepted. No surcharges from our side.</p>
                    </div>
                  )}
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
                  <TrustBadges isInternational={visitor === 'foreigner'} />
                </section>

                <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1 py-4 text-sm uppercase tracking-widest disabled:opacity-50"
                  >
                    {submitting ? 'Processing…' : 'Confirm & Pay'}
                  </button>
                  <div className="flex items-center justify-center gap-2 text-sm text-primary/50">
                    <Lock size={15} /> Secure Payment
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:sticky lg:top-24 h-fit order-first lg:order-none">
              <div className="bg-cream-light p-6 md:p-8 border border-primary/10">
                <h2 className="text-xl font-light mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm text-primary/70">
                    <span>Price per person</span>
                    <span>{fp(pricePerPerson)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-primary/70">
                    <span>Travelers</span>
                    <span>× {formData.numberOfGuests}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Payment discount ({discountPercent}%)</span>
                      <span>−{fp(discountAmount)}</span>
                    </div>
                  )}
                  {selectedEmi && (
                    <div className="flex justify-between text-sm text-secondary font-medium">
                      <span>EMI ({selectedEmi.tenure} months)</span>
                      <span>{fp(visitor === 'foreigner' ? selectedEmi.monthlyAmount / 84 : selectedEmi.monthlyAmount)}/mo</span>
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-primary/10 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-light">Total</span>
                    <span className="font-display text-3xl text-primary">{fp(totalPrice)}</span>
                  </div>
                  {visitor === 'foreigner' && (
                    <p className="text-xs text-primary/40 mt-1">Charged in INR · bank converts at live rate</p>
                  )}
                  <p className="text-xs text-green-700 font-medium mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    No hidden fees · all taxes included
                  </p>
                </div>

                {/* What's included highlights */}
                <div className="border-t border-primary/10 pt-4 space-y-2">
                  {[
                    'Private guide throughout',
                    'All accommodation included',
                    'Airport & station transfers',
                    'All monument entry fees',
                    '24/7 YlooTrips support',
                    'Free cancellation (7 days)',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-primary/60">
                      <CheckCircle size={13} className="text-green-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* EMI Highlight */}
                <div className="mt-5 p-3 bg-accent/15 border border-accent/30">
                  <p className="text-xs font-medium text-primary mb-1">💳 EMI Available</p>
                  <p className="text-xs text-primary/60">
                    Pay as low as {fp(Math.ceil(pricePerPerson * formData.numberOfGuests / 3))}/month on credit card. Select EMI in payment below.
                  </p>
                </div>

                {visitor === 'foreigner' && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200">
                    <p className="text-xs font-medium text-blue-800 mb-1">🌍 International Payment</p>
                    <p className="text-xs text-blue-700">Visa · Mastercard · Amex accepted. Secure gateway. No extra charges.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TourCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    }>
      <TourCheckoutContent />
    </Suspense>
  );
}
