'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Users, MapPin, Lock, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { Trip } from '@/types';
import { formatPriceWithCurrency } from '@/lib/utils';
import PaymentMethods from '@/components/PaymentMethods';
import PaymentOptions from '@/components/PaymentOptions';
import TrustBadges from '@/components/TrustBadges';
import CheckoutStepper from '@/components/CheckoutStepper';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';
import { useWallet } from '@/context/WalletContext';
import PromoCodeInput from '@/components/PromoCodeInput';
import type { PromoCode } from '@/lib/promoCodes';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currency } = useCurrency();
    const { visitor } = useVisitor();
    const { balance: walletBalance, addCashback, deductBalance } = useWallet();
    const fp = (p: number) => formatPriceWithCurrency(p, currency);

    const tripId = searchParams.get('tripId');
    const guests = Number(searchParams.get('guests')) || 1;
    const date = searchParams.get('date') || '';

    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [bookingReference, setBookingReference] = useState<string | undefined>(undefined);
    const [halfPaymentCardType, setHalfPaymentCardType] = useState<'credit' | 'debit'>('credit');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [applyWallet, setApplyWallet] = useState(false);
    const [promoCode, setPromoCode] = useState<string | null>(null);
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [selectedEmi, setSelectedEmi] = useState<{
        tenure: number;
        monthlyAmount: number;
        totalAmount: number;
        interestRate: number;
        interestAmount: number;
        noCost: boolean;
        label: string;
        description: string;
    } | null>(null);

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        numberOfGuests: guests,
        travelDate: date,
        specialRequests: '',
        paymentMethod: 'upi',
    });

    useEffect(() => {
        const fetchTrip = async () => {
            if (!tripId) {
                router.push('/trips');
                return;
            }

            try {
                const response = await api.getTripById(Number(tripId));
                setTrip(response.data);
                setFormData(prev => ({
                    ...prev,
                    numberOfGuests: guests,
                    travelDate: date,
                }));
            } catch {
                router.push('/trips');
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [tripId, guests, date, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!trip) return;

        setErrorMessage(null);
        setSubmitting(true);

        try {
            // Determine payment type
            let paymentType = 'FULL';
            if (selectedEmi !== null) {
                paymentType = 'EMI';
            } else if (formData.paymentMethod === 'half_payment') {
                paymentType = 'HALF_PAYMENT';
            }

            // paymentMethod sent to backend — empty string signals "show all Easebuzz modes"
            const effectiveMethod = formData.paymentMethod === 'half_payment'
                ? (halfPaymentCardType === 'credit' ? 'credit_card' : 'debit_card')
                : formData.paymentMethod || 'upi';

            const bookingData = {
                trip: { id: trip.id },
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                numberOfGuests: formData.numberOfGuests,
                travelDate: formData.travelDate,
                specialRequests: formData.specialRequests,
                paymentMethod: effectiveMethod,
                pg: '',           // tell backend: empty pg → Easebuzz shows all payment modes
                paymentType: paymentType,
                // EMI details
                emiEnabled: selectedEmi !== null,
                emiTenure: selectedEmi?.tenure || null,
                emiMonthlyAmount: selectedEmi?.monthlyAmount || null,
                emiTotalAmount: selectedEmi?.totalAmount || null,
                emiInterestRate: selectedEmi?.interestRate || null,
            };

            const bookingResponse = await api.createBooking(bookingData);
            const booking = bookingResponse.data;
            setBookingReference(booking.bookingReference);

            // Pass pg: '' so backend sends empty pg to Easebuzz → all payment options shown
            const paymentResponse = await api.initiatePayment(booking.bookingReference, { pg: '' });
            const paymentData = paymentResponse.data;

            if (paymentData.success === false) {
                throw new Error(paymentData.error || 'Failed to initiate payment');
            }

            if (paymentData.paymentUrl) {
                // Store pending wallet/cashback info — credited only after payment confirmed
                sessionStorage.setItem(`ylootrips-pending-${booking.bookingReference}`, JSON.stringify({
                    walletDeduction,
                    totalPrice,
                    tripName: trip.title,
                }));
                window.location.href = paymentData.paymentUrl;
            } else {
                throw new Error(paymentData.error || 'Failed to get payment URL from Easebuzz. Please check your payment gateway configuration.');
            }
        } catch (error: any) {
            let msg = 'Failed to create booking. Please try again.';

            if (error.response) {
                const errorData = error.response.data;
                if (errorData?.error) {
                    msg = errorData.error;
                } else if (errorData?.message) {
                    msg = errorData.message;
                } else if (typeof errorData === 'string') {
                    msg = errorData;
                }
            } else if (error.message) {
                msg = error.message;
            }

            setErrorMessage(msg);
            setSubmitting(false);
        }
    };

    const basePrice = trip ? (typeof trip.price === 'number' ? trip.price : parseFloat(trip.price.toString())) * formData.numberOfGuests : 0;
    const discountPercent = formData.paymentMethod === 'upi' ? 5 : (formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') ? 3 : 0;
    const discountAmount = (basePrice * discountPercent) / 100;
    const priceAfterDiscount = basePrice - discountAmount - promoDiscount;
    const maxWalletUsable = Math.round(Math.max(0, priceAfterDiscount) * 0.10); // cap at 10% of order
    const walletDeduction = applyWallet ? Math.min(walletBalance, maxWalletUsable) : 0;
    const totalPrice = Math.max(0, priceAfterDiscount - walletDeduction);
    const cashbackAmount = Math.round(totalPrice * 0.10);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-light mb-4">Trip Not Found</h1>
                    <button onClick={() => router.push('/trips')} className="btn-primary">
                        Back to Trips
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream py-8 md:py-16">
            <div className="section-container">
                <div className="max-w-5xl mx-auto">
                    <h1 className="font-display text-2xl sm:text-3xl md:text-display-xl mb-2 pt-6 md:pt-8">Complete Your Booking</h1>
                    {visitor === 'foreigner' && (
                        <p className="text-secondary mb-4 flex items-center gap-2">
                            <span>💳</span>
                            <span>International cards accepted · Prices shown in {currency}</span>
                        </p>
                    )}

                    {/* Progress stepper */}
                    <CheckoutStepper currentStep={2} />

                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <section className="bg-cream-light p-5 md:p-6 border border-primary/10">
                                    <h2 className="text-xl md:text-2xl font-light mb-4">Trip Summary</h2>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <MapPin size={20} className="text-secondary mt-1" />
                                            <div>
                                                <p className="text-caption text-text-secondary">Destination</p>
                                                <p className="text-body-lg">{trip.destination}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Calendar size={20} className="text-secondary mt-1" />
                                            <div>
                                                <p className="text-caption text-text-secondary">Duration</p>
                                                <p className="text-body-lg">{trip.duration}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Users size={20} className="text-secondary mt-1" />
                                            <div>
                                                <p className="text-caption text-text-secondary">Trip Title</p>
                                                <p className="text-body-lg">{trip.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Personal Information</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-caption text-text-secondary mb-2 block">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                className="w-full p-4 border border-primary/20 bg-white text-primary"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-caption text-text-secondary mb-2 block">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.customerEmail}
                                                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                                    className="w-full p-4 border border-primary/20 bg-white text-primary"
                                                    placeholder="john@example.com"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-caption text-text-secondary mb-2 block">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.customerPhone}
                                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                                    className="w-full p-4 border border-primary/20 bg-white text-primary"
                                                    placeholder="912345678900"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Travel Details</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-caption text-text-secondary mb-2 block">
                                                Travel Date *
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.travelDate}
                                                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full p-4 border border-primary/20 bg-white text-primary"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-caption text-text-secondary mb-2 block">
                                                Number of Guests *
                                            </label>
                                            <select
                                                required
                                                value={formData.numberOfGuests}
                                                onChange={(e) => setFormData({ ...formData, numberOfGuests: Number(e.target.value) })}
                                                className="w-full p-4 border border-primary/20 bg-white text-primary"
                                            >
                                                {Array.from({ length: trip.maxGroupSize || 10 }, (_, i) => i + 1).map((num) => (
                                                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Special Requests</h2>
                                    <textarea
                                        value={formData.specialRequests}
                                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                        rows={4}
                                        className="w-full p-4 border border-primary/20 bg-white text-primary"
                                        placeholder="Any special requests or dietary requirements..."
                                    />
                                </section>

                                <section>
                                    {visitor === 'foreigner' && (
                                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-sm text-blue-800 rounded">
                                            <p className="font-medium mb-1">💳 International Payment Info</p>
                                            <p className="text-blue-700">Payment is processed securely in INR via our payment gateway. Your bank will automatically convert to your local currency at the current exchange rate. No surcharges from our side — Visa, Mastercard, and Amex accepted.</p>
                                        </div>
                                    )}

                                    {/* EMI + Flexible Payment Options */}
                                    <PaymentOptions
                                        tripPrice={totalPrice}
                                        tripTitle={trip.title}
                                        onProceed={(payload) => {
                                            // Map PaymentOptions selection → existing checkout state
                                            if (payload.mode === 'emi' && payload.emiPlan) {
                                                setSelectedEmi({
                                                    tenure: payload.emiPlan.months,
                                                    monthlyAmount: payload.emiPlan.monthlyAmount,
                                                    totalAmount: payload.emiPlan.totalAmount,
                                                    interestRate: 0,
                                                    interestAmount: 0,
                                                    noCost: true,
                                                    label: `${payload.emiPlan.months} Months`,
                                                    description: `No-cost EMI · ${payload.emiPlan.months} months`,
                                                });
                                                setFormData(f => ({ ...f, paymentMethod: 'credit_card' }));
                                            } else if (payload.mode === 'partial') {
                                                setFormData(f => ({ ...f, paymentMethod: 'half_payment' }));
                                                setSelectedEmi(null);
                                            } else {
                                                setSelectedEmi(null);
                                                setFormData(f => ({ ...f, paymentMethod: payload.paymentMethod || 'upi' }));
                                            }
                                        }}
                                    />

                                    {/* Legacy method picker — shown for international or fallback */}
                                    {visitor === 'foreigner' && (
                                        <div className="mt-4">
                                            <PaymentMethods
                                                selectedMethod={formData.paymentMethod}
                                                onMethodChange={(method) => {
                                                    setFormData({ ...formData, paymentMethod: method });
                                                    if (method !== 'credit_card') setSelectedEmi(null);
                                                }}
                                                amount={totalPrice}
                                                bookingReference={bookingReference}
                                                selectedEmi={selectedEmi}
                                                onEmiChange={(emi) => setSelectedEmi(emi)}
                                                onHalfPaymentCardTypeChange={(cardType) => setHalfPaymentCardType(cardType)}
                                                isInternational={true}
                                            />
                                        </div>
                                    )}
                                    <TrustBadges isInternational={visitor === 'foreigner'} />
                                </section>

                                {/* Promo code section */}
                                <section>
                                    <h2 className="text-xl md:text-2xl font-light mb-3">Promo Code</h2>
                                    <PromoCodeInput
                                        orderTotal={basePrice - discountAmount}
                                        appliedCode={promoCode}
                                        discountAmount={promoDiscount}
                                        onApply={(code, discount) => { setPromoCode(code); setPromoDiscount(discount); }}
                                        onRemove={() => { setPromoCode(null); setPromoDiscount(0); }}
                                    />
                                </section>

                                {/* WanderLoot wallet section */}
                                {walletBalance > 0 && (
                                    <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center shrink-0">
                                                    <span className="text-white text-sm">₹</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-amber-900">WanderLoot 💸</p>
                                                    <p className="text-xs text-amber-700">Balance: {fp(walletBalance)} · Use up to {fp(maxWalletUsable)} on this booking</p>
                                                </div>
                                            </div>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={applyWallet}
                                                    onChange={(e) => setApplyWallet(e.target.checked)}
                                                    className="w-4 h-4 accent-amber-500"
                                                />
                                                <span className="text-xs font-semibold text-amber-800">Apply</span>
                                            </label>
                                        </div>
                                        {applyWallet && walletDeduction > 0 && (
                                            <div className="mt-3 pt-3 border-t border-amber-200 flex items-center justify-between text-sm">
                                                <span className="text-amber-800">💰 WanderLoot cashback applied</span>
                                                <span className="font-semibold text-green-700">−{fp(walletDeduction)}</span>
                                            </div>
                                        )}
                                    </section>
                                )}

                                {errorMessage && (
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="flex flex-col gap-4 pt-6">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-amber-500" />
                                        <span className="text-xs text-gray-600">
                                            I agree to the <a href="/terms" target="_blank" className="text-amber-600 underline">Terms &amp; Conditions</a> and{' '}
                                            <a href="/privacy" target="_blank" className="text-amber-600 underline">Privacy Policy</a>.
                                        </span>
                                    </label>
                                    <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:gap-4">
                                    <button
                                        type="submit"
                                        disabled={submitting || !agreed}
                                        className="btn-primary flex-1 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Processing...' : 'Complete Booking'}
                                    </button>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 text-body-sm text-text-secondary">
                                        <Lock size={16} />
                                        <span>Secure Payment</span>
                                    </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="lg:sticky lg:top-24 h-fit order-first lg:order-none">
                            <div className="bg-cream-light p-6 md:p-8 border border-primary/10">
                                <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    {/* Original Price (if exists) - shown first with strikethrough */}
                                    {trip.originalPrice && trip.originalPrice > trip.price && (
                                        <div className="flex justify-between text-body-lg text-text-secondary">
                                            <span className="line-through">Original Price</span>
                                            <span className="line-through">{fp(trip.originalPrice)} × {formData.numberOfGuests}</span>
                                        </div>
                                    )}

                                    {/* Current Trip Price */}
                                    <div className="flex justify-between text-body-lg">
                                        <span>Trip Price</span>
                                        <span className="font-medium">{fp(trip.price)} × {formData.numberOfGuests}</span>
                                    </div>

                                    {/* Show savings if original price was higher */}
                                    {trip.originalPrice && trip.originalPrice > trip.price && (
                                        <div className="flex justify-between text-body-sm text-success">
                                            <span>You Save</span>
                                            <span>-{fp((trip.originalPrice - trip.price) * formData.numberOfGuests)}</span>
                                        </div>
                                    )}

                                    {/* Payment Method Discount */}
                                    {discountPercent > 0 && (
                                        <div className="flex justify-between text-body-lg text-success">
                                            <span>Payment Discount ({discountPercent}%)</span>
                                            <span>-{fp(discountAmount)}</span>
                                        </div>
                                    )}

                                    {/* Promo discount */}
                                    {promoDiscount > 0 && (
                                        <div className="flex justify-between text-body-lg text-green-600">
                                            <span>🏷️ Promo ({promoCode})</span>
                                            <span>-{fp(promoDiscount)}</span>
                                        </div>
                                    )}

                                    {/* Wallet deduction */}
                                    {walletDeduction > 0 && (
                                        <div className="flex justify-between text-body-lg text-amber-600">
                                            <span>💰 WanderLoot</span>
                                            <span>-{fp(walletDeduction)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-primary/10 mb-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg md:text-xl font-light">Total Payable</span>
                                        <span className="text-2xl md:text-3xl font-light">{fp(totalPrice)}</span>
                                    </div>
                                    <p className="text-xs text-green-700 font-medium mt-1 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                                        No hidden fees · all taxes included
                                    </p>
                                </div>

                                {/* Cashback preview */}
                                {cashbackAmount > 0 && (
                                    <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-800">
                                        <span>🎉</span>
                                        <span>You'll earn <strong>{fp(cashbackAmount)}</strong> cashback (10%) on this booking!</span>
                                    </div>
                                )}

                                <div className="space-y-2 text-body-sm text-text-secondary mb-3">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-success mt-1 shrink-0" />
                                        <span>Instant confirmation</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-success mt-1 shrink-0" />
                                        <span>Free cancellation up to 7 days before departure</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-success mt-1 shrink-0" />
                                        <span>24/7 customer support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading checkout...</p>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
