'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Plane, Mail, Phone, Download, Clock, ArrowRight, Home } from 'lucide-react';

function fmt(n: number) { return new Intl.NumberFormat('en-IN').format(n); }

interface FlightBooking {
    txnid: string;
    flight: {
        airline: string; flightNum: string; from: string; to: string;
        dep: string; arr: string; date: string; dur: string; stops: number; price: number;
    };
    passengers: Array<{ title: string; firstName: string; lastName: string; dob: string; gender: string; nationality: string }>;
    contact: { email: string; phone: string };
}

function SuccessContent() {
    const sp = useSearchParams();
    const txnid = sp.get('txnid');

    const [booking, setBooking] = useState<FlightBooking | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        // Retrieve from sessionStorage
        if (typeof window === 'undefined') return;
        const raw = sessionStorage.getItem('pendingFlightBooking');
        if (!raw) return;

        try {
            const data = JSON.parse(raw);
            const bookingWithTxn = { ...data, txnid: txnid || data.txnid || 'FLT-UNKNOWN' };
            setBooking(bookingWithTxn);

            // Send confirmation email (once)
            if (!sessionStorage.getItem(`email_sent_${txnid}`)) {
                sessionStorage.setItem(`email_sent_${txnid}`, '1');
                fetch('/api/flights/send-confirmation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'client_confirmation',
                        booking: bookingWithTxn,
                        to: data.contact.email,
                    }),
                }).then(() => setEmailSent(true)).catch(() => {});
            } else {
                setEmailSent(true);
            }

            // Clear after reading (optional: keep for reload)
        } catch { /* ignore */ }
    }, [txnid]);

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-500 mb-2">Booking Reference: <strong>{txnid}</strong></p>
                    <p className="text-gray-500 mb-6">Our team will send your e-ticket within 30 minutes.</p>
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors">
                        <Home size={16} /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const { flight, passengers, contact } = booking;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-amber-600">YlooTrips</Link>
                    <span className="text-sm text-gray-500">Booking Confirmed</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

                {/* Success Banner */}
                <div className="bg-green-500 rounded-2xl p-6 text-white text-center shadow-lg">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={36} className="text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-1">Booking Confirmed! ✈️</h1>
                    <p className="text-green-100 text-sm">Ref: <strong className="text-white">{booking.txnid}</strong></p>
                    <p className="text-green-100 text-sm mt-1">
                        {emailSent
                            ? `Confirmation sent to ${contact.email}`
                            : 'Sending confirmation email...'
                        }
                    </p>
                </div>

                {/* Flight Summary */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4">Flight Details</p>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold">
                                {flight.airline.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{flight.airline}</p>
                                <p className="text-xs text-gray-400 uppercase">{flight.flightNum}</p>
                            </div>
                        </div>

                        <div className="flex-1 flex items-center justify-center gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{flight.dep}</p>
                                <p className="text-xs text-gray-500 font-semibold">{flight.from}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} />{flight.dur}</p>
                                <div className="w-24 flex items-center gap-1 my-1">
                                    <div className="w-2 h-2 rounded-full border-2 border-gray-300" />
                                    <div className="flex-1 h-px bg-gray-300 relative">
                                        <Plane size={11} className="text-amber-500 absolute -top-1.5 left-1/2 -translate-x-1/2" />
                                    </div>
                                    <div className="w-2 h-2 rounded-full border-2 border-gray-300" />
                                </div>
                                <p className={`text-xs font-semibold ${flight.stops === 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{flight.arr}</p>
                                <p className="text-xs text-gray-500 font-semibold">{flight.to}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                            <p className="font-semibold text-gray-800">{flight.date}</p>
                            <p className="text-lg font-bold text-amber-600 mt-1">₹{fmt(flight.price)}</p>
                        </div>
                    </div>
                </div>

                {/* Passengers */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4">Passengers</p>
                    <div className="space-y-3">
                        {passengers.map((p, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{p.title} {p.firstName} {p.lastName}</p>
                                    <p className="text-xs text-gray-400">{p.gender} · {p.nationality} · DOB: {p.dob}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* What happens next */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4">What Happens Next</p>
                    <div className="space-y-4">
                        {[
                            { icon: Mail, title: 'E-Ticket by Email', desc: `Your flight ticket will be sent to ${contact.email} within 30 minutes.`, color: 'bg-blue-100 text-blue-600' },
                            { icon: Phone, title: 'SMS Confirmation', desc: `Booking summary sent to ${contact.phone}.`, color: 'bg-green-100 text-green-600' },
                            { icon: Clock, title: '24/7 Support', desc: 'Need help? WhatsApp us anytime at +91 84278 31127.', color: 'bg-amber-100 text-amber-600' },
                        ].map(item => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="flex items-start gap-3">
                                    <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={`/my-booking?ref=${encodeURIComponent(booking.txnid)}`}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors">
                        <ArrowRight size={16} /> Track My Booking
                    </Link>
                    <a href={`https://wa.me/918427831127?text=Hi!%20I%20booked%20flight%20${encodeURIComponent(booking.txnid)}.%20Please%20send%20my%20e-ticket%20to%20${encodeURIComponent(contact.email)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-xl transition-colors">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Track on WhatsApp
                    </a>
                    <Link href="/"
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl transition-colors">
                        <Home size={16} /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function FlightBookingSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
