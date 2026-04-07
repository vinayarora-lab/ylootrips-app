'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, MapPin, Ticket, Lock, CheckCircle, ChevronLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { Event as EventType, TicketLineItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import TrustBadges from '@/components/TrustBadges';
import PaintSplashBg from '@/components/PaintSplashBg';

const PAYMENT_OPTIONS = [
    { id: 'upi', label: 'UPI', note: 'No extra charges' },
    { id: 'credit_card', label: 'Credit Card', note: '+3% processing fee' },
    { id: 'debit_card', label: 'Debit Card', note: '+3% processing fee' },
];

function parseTicketLines(param: string | null): TicketLineItem[] {
    if (!param) return [];
    try {
        const decoded = decodeURIComponent(param);
        const parsed = JSON.parse(decoded) as TicketLineItem[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function EventCheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const eventId = searchParams.get('eventId');
    const ticketsParam = searchParams.get('tickets');
    const dateParam = searchParams.get('date');
    const ticketLinesParam = searchParams.get('ticketLines');
    const ticketLines = useMemo(() => parseTicketLines(ticketLinesParam), [ticketLinesParam]);

    const [event, setEvent] = useState<EventType | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        numberOfTickets: Number(ticketsParam) || 1,
        eventDate: dateParam || '',
        paymentMethod: 'upi',
        specialRequests: '',
    });

    const hasTicketLines = ticketLines.length > 0;

    useEffect(() => {
        if (!eventId) {
            router.push('/events');
            return;
        }
        const fetchEvent = async () => {
            try {
                const response = await api.getEventById(Number(eventId));
                setEvent(response.data);
                if (!formData.eventDate && response.data?.eventDate) {
                    setFormData(prev => ({ ...prev, eventDate: response.data.eventDate }));
                }
            } catch {
                router.push('/events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!event) return;
        if (!formData.paymentMethod?.trim()) {
            setCheckoutError('Please select a payment method.');
            return;
        }
        setCheckoutError(null);
        setSubmitting(true);
        try {
            const bookingPayload: {
                eventId: number;
                customerName: string;
                customerEmail: string;
                customerPhone: string;
                eventDate: string;
                paymentMethod: string;
                specialRequests?: string;
                ticketLines?: TicketLineItem[];
                numberOfTickets?: number;
            } = {
                eventId: event.id,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                eventDate: formData.eventDate || event.eventDate,
                paymentMethod: formData.paymentMethod,
                specialRequests: formData.specialRequests || undefined,
            };
            if (hasTicketLines) {
                bookingPayload.ticketLines = ticketLines;
            } else {
                bookingPayload.numberOfTickets = formData.numberOfTickets;
            }
            const createRes = await api.createEventBooking(bookingPayload);
            const booking = createRes.data;
            const ref = booking.bookingReference;
            if (!ref) throw new Error('No booking reference returned');
            const paymentRes = await api.initiateEventPayment(ref);
            const paymentData = paymentRes.data;
            if (paymentData.success === false) throw new Error(paymentData.error || 'Failed to initiate payment');
            if (paymentData.paymentUrl) {
                window.location.href = paymentData.paymentUrl;
            } else {
                throw new Error('No payment URL received');
            }
        } catch (err: any) {
            const msg = err.response?.data?.error || err.message || 'Something went wrong. Please try again.';
            setCheckoutError(msg);
            setSubmitting(false);
        }
    };

    const baseTotal = useMemo(() => {
        if (!event) return 0;
        if (hasTicketLines && event.ticketTypes?.length) {
            return ticketLines.reduce((sum, line) => {
                const tt = event.ticketTypes!.find(t => t.id === line.ticketTypeId);
                if (!tt) return sum;
                const p = typeof tt.price === 'number' ? tt.price : parseFloat(String(tt.price ?? 0));
                return sum + p * line.quantity;
            }, 0);
        }
        const p = typeof event.price === 'number' ? event.price : parseFloat(String(event.price ?? 0));
        return p * formData.numberOfTickets;
    }, [event, hasTicketLines, ticketLines, formData.numberOfTickets]);
    const isCard = formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card';
    const surchargePercent = isCard ? 3 : 0;
    const surchargeAmount = (baseTotal * surchargePercent) / 100;
    const finalTotal = baseTotal + surchargeAmount;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream pt-below-nav px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-primary/70">Loading...</p>
                </div>
            </div>
        );
    }

    if (!event) return null;

    const dateStr = typeof event.eventDate === 'string' ? event.eventDate : '';

    return (
        <PaintSplashBg className="min-h-screen pt-below-nav">
            {/* ─── BMS-style step indicator header ─── */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-20 md:top-24 z-30 section-container">
                <div className="flex items-center py-3 gap-3 max-w-5xl mx-auto">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                    </button>
                    <h1 className="flex-1 text-center text-[17px] font-semibold text-gray-900 truncate">
                        {event?.title || 'Complete Booking'}
                    </h1>
                    <div className="w-8" />
                </div>
                {/* Step indicator */}
                <div className="flex items-center pb-3 gap-2 max-w-5xl mx-auto">
                    <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-gray-300 text-gray-500 text-[11px] font-bold flex items-center justify-center">1</span>
                        <span className="text-[13px] text-gray-400">Ticket</span>
                    </div>
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-400 rotate-180" />
                    <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                        <span className="text-[13px] font-semibold text-gray-900">Review &amp; Proceed to Pay</span>
                    </div>
                </div>
            </div>

            <div className="section-container py-6 md:py-8 lg:py-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <section className="bg-white/60 backdrop-blur-sm p-5 md:p-6 border border-primary/10 rounded-xl">
                                    <h2 className="text-xl md:text-2xl font-light mb-4">Event summary</h2>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Ticket className="text-secondary mt-1 shrink-0" size={20} />
                                            <div>
                                                <p className="text-caption text-primary/70">Event</p>
                                                <p className="text-body-lg">{event.title}</p>
                                            </div>
                                        </div>
                                        {dateStr && (
                                            <div className="flex items-start gap-3">
                                                <Calendar className="text-secondary mt-1 shrink-0" size={20} />
                                                <div>
                                                    <p className="text-caption text-primary/70">Date</p>
                                                    <p className="text-body-lg">
                                                        {new Date(dateStr).toLocaleDateString('en-IN', {
                                                            weekday: 'short',
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {event.venueName && (
                                            <div className="flex items-start gap-3">
                                                <MapPin className="text-secondary mt-1 shrink-0" size={20} />
                                                <div>
                                                    <p className="text-caption text-primary/70">Venue</p>
                                                    <p className="text-body-lg">{event.venueName}{event.city ? `, ${event.city}` : ''}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Your details</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-caption text-primary/70 mb-2 block">Full name *</label>
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
                                                <label className="text-caption text-primary/70 mb-2 block">Email *</label>
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
                                                <label className="text-caption text-primary/70 mb-2 block">Phone *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.customerPhone}
                                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                                    className="w-full p-4 border border-primary/20 bg-white text-primary"
                                                    placeholder="10-digit mobile"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Tickets</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {hasTicketLines ? (
                                            <div className="md:col-span-2">
                                                <p className="text-primary/70 text-sm mb-2">Your selection:</p>
                                                <ul className="space-y-2 bg-cream-light p-4 rounded border border-primary/10">
                                                    {ticketLines.map((line) => {
                                                        const tt = event.ticketTypes?.find(t => t.id === line.ticketTypeId);
                                                        const name = tt?.name ?? `Ticket type #${line.ticketTypeId}`;
                                                        const p = tt ? (typeof tt.price === 'number' ? tt.price : parseFloat(String(tt.price ?? 0))) : 0;
                                                        return (
                                                            <li key={line.ticketTypeId} className="flex justify-between text-primary">
                                                                <span>{name} × {line.quantity}</span>
                                                                <span>{formatPrice(p * line.quantity)}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="text-caption text-primary/70 mb-2 block">Number of tickets *</label>
                                                <select
                                                    value={formData.numberOfTickets}
                                                    onChange={(e) => setFormData({ ...formData, numberOfTickets: Number(e.target.value) })}
                                                    className="w-full p-4 border border-primary/20 bg-white text-primary"
                                                >
                                                    {Array.from({ length: Math.min(event.capacity ?? 10, 20) }, (_, i) => i + 1).map((n) => (
                                                        <option key={n} value={n}>{n} {n === 1 ? 'ticket' : 'tickets'}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-caption text-primary/70 mb-2 block">Event date *</label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.eventDate}
                                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                                className="w-full p-4 border border-primary/20 bg-white text-primary"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Payment method</h2>
                                    <p className="text-sm text-primary/70 mb-4">
                                        Card payments include a 3% processing fee. UPI has no extra charges.
                                    </p>
                                    <div className="space-y-3">
                                        {PAYMENT_OPTIONS.map((opt) => (
                                            <label
                                                key={opt.id}
                                                className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${formData.paymentMethod === opt.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-primary/20 bg-white hover:border-primary/30'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={opt.id}
                                                    checked={formData.paymentMethod === opt.id}
                                                    onChange={() => setFormData({ ...formData, paymentMethod: opt.id })}
                                                    className="sr-only"
                                                />
                                                <span className="font-medium text-primary">{opt.label}</span>
                                                <span className="text-sm text-primary/60">{opt.note}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <TrustBadges />
                                </section>

                                {checkoutError && (
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                                        {checkoutError}
                                    </div>
                                )}

                                <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:gap-4 pt-6">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary flex-1 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Redirecting to payment...' : 'Pay & book'}
                                    </button>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 text-body-sm text-primary/70">
                                        <Lock size={16} />
                                        <span>Secure payment</span>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="lg:sticky lg:top-[7.5rem] h-fit order-first lg:order-0">
                            <div className="bg-white/60 backdrop-blur-sm p-6 md:p-8 border border-primary/10 rounded-xl">
                                <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Order summary</h2>
                                <div className="space-y-4 mb-6">
                                    {hasTicketLines && event.ticketTypes ? (
                                        <>
                                            {ticketLines.map((line) => {
                                                const tt = event.ticketTypes!.find(t => t.id === line.ticketTypeId);
                                                const name = tt?.name ?? `Type #${line.ticketTypeId}`;
                                                const p = tt ? (typeof tt.price === 'number' ? tt.price : parseFloat(String(tt.price ?? 0))) : 0;
                                                return (
                                                    <div key={line.ticketTypeId} className="flex justify-between text-body-lg">
                                                        <span>{name} × {line.quantity}</span>
                                                        <span>{formatPrice(p * line.quantity)}</span>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <div className="flex justify-between text-body-lg">
                                            <span>Ticket price × {formData.numberOfTickets}</span>
                                            <span>{formatPrice(baseTotal)}</span>
                                        </div>
                                    )}
                                    {surchargePercent > 0 && (
                                        <div className="flex justify-between text-body-sm text-primary/70">
                                            <span>Card processing fee (3%)</span>
                                            <span>+{formatPrice(surchargeAmount)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="pt-6 border-t border-primary/10 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg md:text-xl font-light">Total</span>
                                        <span className="text-2xl md:text-3xl font-light">{formatPrice(finalTotal)}</span>
                                    </div>
                                </div>
                                <div className="space-y-3 text-body-sm text-primary/70">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-green-600 mt-1 shrink-0" />
                                        <span>Instant confirmation</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-green-600 mt-1 shrink-0" />
                                        <span>E-ticket & details by email</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PaintSplashBg>
    );
}

export default function EventCheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-cream pt-below-nav px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                        <p className="text-primary/70">Loading checkout...</p>
                    </div>
                </div>
            }
        >
            <EventCheckoutContent />
        </Suspense>
    );
}
