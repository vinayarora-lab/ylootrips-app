'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Plane, Calendar, Users, User, Mail, Phone, Shield, ChevronRight,
    Info, CheckCircle, CreditCard, Smartphone, Building2, Globe, Luggage,
    ArrowRight, Star, Clock, MapPin
} from 'lucide-react';

function fmt(n: number) { return new Intl.NumberFormat('en-IN').format(n); }

const INDIA_CODES = new Set([
    'DEL','BOM','BLR','MAA','HYD','CCU','JAI','GOI','COK','PNQ',
    'AMD','VNS','ATQ','IXL','SXR','UDR','JDH','IXC','DED','IXZ'
]);

interface Passenger {
    title: 'Mr' | 'Ms' | 'Mrs';
    firstName: string;
    lastName: string;
    dob: string;
    gender: 'Male' | 'Female';
    nationality: string;
    passportNo: string;
    passportExpiry: string;
}

const defaultPassenger = (): Passenger => ({
    title: 'Mr',
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    nationality: 'Indian',
    passportNo: '',
    passportExpiry: '',
});

function PassengerCard({
    index, passenger, isInternational, onChange,
}: {
    index: number;
    passenger: Passenger;
    isInternational: boolean;
    onChange: (field: keyof Passenger, value: string) => void;
}) {
    const [open, setOpen] = useState(index === 0);

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                        <User size={16} className="text-amber-600" />
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-gray-900 text-sm">Traveller {index + 1} · Adult</p>
                        {passenger.firstName
                            ? <p className="text-xs text-gray-500">{passenger.title} {passenger.firstName} {passenger.lastName}</p>
                            : <p className="text-xs text-amber-600">Fill details required</p>
                        }
                    </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 transition-colors ${passenger.firstName && passenger.lastName && passenger.dob ? 'border-green-500 bg-green-500' : 'border-gray-300'} flex items-center justify-center`}>
                    {passenger.firstName && passenger.lastName && passenger.dob && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    )}
                </div>
            </button>

            {open && (
                <div className="px-5 pb-5 border-t border-gray-100">
                    {/* Title + Gender */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title *</label>
                            <div className="flex gap-2">
                                {(['Mr', 'Ms', 'Mrs'] as const).map(t => (
                                    <button key={t} type="button"
                                        onClick={() => onChange('title', t)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${passenger.title === t ? 'bg-amber-500 text-white border-amber-500' : 'border-gray-300 text-gray-600 hover:border-amber-400'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Gender *</label>
                            <div className="flex gap-2">
                                {(['Male', 'Female'] as const).map(g => (
                                    <button key={g} type="button"
                                        onClick={() => onChange('gender', g)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${passenger.gender === g ? 'bg-amber-500 text-white border-amber-500' : 'border-gray-300 text-gray-600 hover:border-amber-400'}`}>
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">First Name *</label>
                            <input type="text" placeholder="As on ID/Passport" value={passenger.firstName}
                                onChange={e => onChange('firstName', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Last Name *</label>
                            <input type="text" placeholder="As on ID/Passport" value={passenger.lastName}
                                onChange={e => onChange('lastName', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                        </div>
                    </div>

                    {/* DOB + Nationality */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date of Birth *</label>
                            <input type="date" value={passenger.dob} max={new Date().toISOString().split('T')[0]}
                                onChange={e => onChange('dob', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nationality</label>
                            <input type="text" placeholder="Indian" value={passenger.nationality}
                                onChange={e => onChange('nationality', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                        </div>
                    </div>

                    {/* International: Passport */}
                    {isInternational && (
                        <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="col-span-2">
                                <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 mb-3">
                                    <Globe size={12} /> International Flight — Passport Required
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Passport Number *</label>
                                <input type="text" placeholder="A1234567" value={passenger.passportNo}
                                    onChange={e => onChange('passportNo', e.target.value.toUpperCase())}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-amber-400 uppercase" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Passport Expiry *</label>
                                <input type="date" value={passenger.passportExpiry}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={e => onChange('passportExpiry', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function FlightBookContent() {
    const sp = useSearchParams();

    const airline = sp.get('airline') || '';
    const code = sp.get('code') || '';
    const flightNum = sp.get('flightNum') || '';
    const from = sp.get('from') || '';
    const to = sp.get('to') || '';
    const dep = sp.get('dep') || '';
    const arr = sp.get('arr') || '';
    const date = sp.get('date') || '';
    const dur = sp.get('dur') || '';
    const stops = parseInt(sp.get('stops') || '0');
    const pax = parseInt(sp.get('pax') || '1');
    const price = parseInt(sp.get('price') || '0');

    const isInternational = !INDIA_CODES.has(from) || !INDIA_CODES.has(to);

    const [passengers, setPassengers] = useState<Passenger[]>(
        Array.from({ length: Math.max(1, pax) }, defaultPassenger)
    );
    const [contact, setContact] = useState({ email: '', phone: '' });
    const [gstEnabled, setGstEnabled] = useState(false);
    const [gst, setGst] = useState({ gstin: '', company: '' });
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [agreed, setAgreed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const convFee = 249;
    const totalPayable = price + convFee;

    const updatePassenger = (i: number, field: keyof Passenger, value: string) => {
        setPassengers(prev => {
            const updated = [...prev];
            updated[i] = { ...updated[i], [field]: value };
            return updated;
        });
    };

    const validate = () => {
        for (const p of passengers) {
            if (!p.firstName.trim() || !p.lastName.trim() || !p.dob) return false;
            if (isInternational && (!p.passportNo.trim() || !p.passportExpiry)) return false;
        }
        if (!contact.email.includes('@') || contact.phone.length < 10) return false;
        if (!agreed) return false;
        return true;
    };

    const handlePay = async () => {
        if (price <= 0) {
            setError('Flight price is unavailable. Please go back and search again, or contact us on WhatsApp.');
            return;
        }
        if (!validate()) {
            setError('Please fill all required fields and accept the terms.');
            return;
        }
        setError(null);
        setSubmitting(true);

        const bookingData = {
            flight: { airline, code, flightNum, from, to, dep, arr, date, dur, stops, pax, price: totalPayable },
            passengers,
            contact,
            gst: gstEnabled ? gst : null,
            paymentMethod,
        };

        if (typeof window !== 'undefined') {
            sessionStorage.setItem('pendingFlightBooking', JSON.stringify(bookingData));
        }

        try {
            const res = await fetch('/api/flights/initiate-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            if (json.paymentUrl) {
                window.location.href = json.paymentUrl;
            } else {
                throw new Error('Could not get payment URL');
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Payment initiation failed. Please try again.';
            setError(msg);
            setSubmitting(false);
        }
    };

    const paymentMethods = [
        { id: 'upi', label: 'UPI', sub: 'PhonePe, Google Pay, Paytm', icon: Smartphone, badge: '5% OFF' },
        { id: 'credit_card', label: 'Credit Card', sub: 'Visa, Mastercard, Amex', icon: CreditCard, badge: '3% OFF' },
        { id: 'debit_card', label: 'Debit Card', sub: 'Visa, Mastercard, RuPay', icon: CreditCard, badge: '3% OFF' },
        { id: 'netbanking', label: 'Net Banking', sub: 'All major banks supported', icon: Building2, badge: '' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-amber-600">YlooTrips</Link>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Plane size={14} className="text-amber-500" />
                        <span className="font-semibold text-gray-900">{from}</span>
                        <ArrowRight size={12} />
                        <span className="font-semibold text-gray-900">{to}</span>
                        <span className="text-gray-400 mx-1">·</span>
                        <span>{date}</span>
                        <span className="text-gray-400 mx-1">·</span>
                        <span>{pax} Pax</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-semibold">
                        <Shield size={12} /> Secure Booking
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="bg-amber-500">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
                    <div className="flex items-center gap-3 text-sm font-semibold text-white">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-white text-amber-600 text-xs font-bold flex items-center justify-center">1</span>
                            <span>Traveller Details</span>
                        </div>
                        <ChevronRight size={14} className="text-amber-200" />
                        <div className="flex items-center gap-2 opacity-60">
                            <span className="w-6 h-6 rounded-full border border-amber-200 text-xs font-bold flex items-center justify-center">2</span>
                            <span>Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            {price <= 0 && (
                <div className="bg-red-50 border-b border-red-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
                        <Info size={16} className="text-red-500 shrink-0" />
                        <p className="text-sm text-red-700 font-medium">
                            Price is unavailable for this flight. Online payment is disabled.
                            Please{' '}
                            <a
                                href={`https://wa.me/918427831127?text=${encodeURIComponent(`Hi, I want to book flight ${airline} ${flightNum} (${from}→${to}) on ${date}. Please share the price and payment link.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-red-800 font-semibold"
                            >
                                contact us on WhatsApp
                            </a>
                            {' '}to complete this booking.
                        </p>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

                    {/* LEFT: Forms */}
                    <div className="space-y-5">

                        {/* Flight Summary Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">Your Flight</p>
                            <div className="flex items-center justify-between gap-4">
                                {/* Airline */}
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                        {code || airline.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{airline}</p>
                                        <p className="text-xs text-gray-400 uppercase">{flightNum}</p>
                                    </div>
                                </div>

                                {/* Route */}
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900">{dep}</p>
                                        <p className="text-xs text-gray-400 font-semibold uppercase">{from}</p>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center gap-0.5">
                                        <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={9} />{dur}</p>
                                        <div className="w-full flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full border-2 border-gray-300" />
                                            <div className="flex-1 h-px bg-gray-300 relative">
                                                <Plane size={12} className="text-amber-500 absolute -top-1.5 left-1/2 -translate-x-1/2" />
                                            </div>
                                            <div className="w-2 h-2 rounded-full border-2 border-gray-300" />
                                        </div>
                                        <p className={`text-xs font-semibold ${stops === 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                            {stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900">{arr}</p>
                                        <p className="text-xs text-gray-400 font-semibold uppercase">{to}</p>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                                    <p className="font-semibold text-gray-800 text-sm">{date}</p>
                                </div>
                            </div>
                        </div>

                        {/* Passenger forms */}
                        <div>
                            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Users size={16} className="text-amber-500" /> Traveller Details
                            </h2>
                            <div className="space-y-3">
                                {passengers.map((p, i) => (
                                    <PassengerCard key={i} index={i} passenger={p}
                                        isInternational={isInternational}
                                        onChange={(field, val) => updatePassenger(i, field, val)} />
                                ))}
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Mail size={16} className="text-amber-500" /> Contact Details
                                <span className="text-xs font-normal text-gray-400">(Booking details & e-ticket sent here)</span>
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address *</label>
                                    <div className="relative">
                                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="email" placeholder="your@email.com" value={contact.email}
                                            onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                                            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Mobile Number *</label>
                                    <div className="relative">
                                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="tel" placeholder="+91 98765 43210" value={contact.phone}
                                            onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                                            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* GST Details (optional) */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <button type="button" onClick={() => setGstEnabled(!gstEnabled)}
                                className="w-full flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">GST Details (Optional — for business travelers)</span>
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${gstEnabled ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {gstEnabled ? 'Added' : 'Add'}
                                </span>
                            </button>
                            {gstEnabled && (
                                <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">GSTIN</label>
                                        <input type="text" placeholder="22AAAAA0000A1Z5" value={gst.gstin}
                                            onChange={e => setGst(g => ({ ...g, gstin: e.target.value.toUpperCase() }))}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Company Name</label>
                                        <input type="text" placeholder="Your Company Pvt Ltd" value={gst.company}
                                            onChange={e => setGst(g => ({ ...g, company: e.target.value }))}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard size={16} className="text-amber-500" /> Choose Payment Method
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {paymentMethods.map(m => {
                                    const Icon = m.icon;
                                    return (
                                        <label key={m.id}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === m.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>
                                            <input type="radio" name="payMethod" value={m.id} checked={paymentMethod === m.id}
                                                onChange={() => setPaymentMethod(m.id)} className="sr-only" />
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === m.id ? 'bg-amber-500' : 'bg-gray-100'}`}>
                                                <Icon size={18} className={paymentMethod === m.id ? 'text-white' : 'text-gray-500'} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-gray-800">{m.label}</p>
                                                    {m.badge && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{m.badge}</span>}
                                                </div>
                                                <p className="text-xs text-gray-400">{m.sub}</p>
                                            </div>
                                            {paymentMethod === m.id && <CheckCircle size={16} className="text-amber-500 shrink-0" />}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Terms + CTA */}
                        {error && (
                            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                <Info size={15} className="mt-0.5 shrink-0" /> {error}
                            </div>
                        )}

                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                                className="mt-0.5 rounded border-gray-300 text-amber-500 focus:ring-amber-400" />
                            <span className="text-sm text-gray-600">
                                I agree to the <Link href="/terms" className="text-amber-600 hover:underline">Terms & Conditions</Link> and{' '}
                                <Link href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</Link>. I confirm that all passenger details are correct.
                            </span>
                        </label>

                        <button onClick={handlePay} disabled={submitting || !agreed || price <= 0}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base transition-all shadow-lg shadow-amber-500/30 active:scale-[0.99] flex items-center justify-center gap-3">
                            {submitting ? (
                                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing Payment...</>
                            ) : price <= 0 ? (
                                <>Price unavailable — contact us</>
                            ) : (
                                <><Shield size={18} /> Pay ₹{fmt(totalPayable)} Securely</>
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-400">
                            🔒 Secured by Easebuzz · 256-bit SSL Encryption · PCI DSS Compliant
                        </p>
                    </div>

                    {/* RIGHT: Fare Summary (sticky) */}
                    <div className="lg:sticky lg:top-20 space-y-4">

                        {/* Fare Breakdown */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                                <Luggage size={15} className="text-amber-500" /> Fare Summary
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Base Fare ({pax} × adult)</span>
                                    <span className="font-medium">₹{fmt(Math.round(price * 0.82))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Taxes & Fees</span>
                                    <span className="font-medium">₹{fmt(price - Math.round(price * 0.82))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Convenience Fee</span>
                                    <span className="font-medium">₹{fmt(convFee)}</span>
                                </div>
                                <div className="h-px bg-gray-200 my-2" />
                                <div className="flex justify-between text-base font-bold text-gray-900">
                                    <span>Total Payable</span>
                                    <span className="text-amber-600">₹{fmt(totalPayable)}</span>
                                </div>
                                <p className="text-xs text-gray-400">Inclusive of all applicable taxes</p>
                            </div>

                            {/* Instant discount preview */}
                            {(paymentMethod === 'upi' || paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                                <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                    <span className="text-green-600 text-xs font-semibold">
                                        {paymentMethod === 'upi' ? '🎉 5% OFF with UPI!' : '🎉 3% OFF with Card!'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* What you get */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h3 className="font-bold text-gray-900 mb-3 text-sm">What&apos;s Included</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                {[
                                    '✈️ Confirmed e-ticket via email',
                                    '🧳 15 kg check-in baggage',
                                    '💼 7 kg cabin baggage',
                                    '📱 24/7 YlooTrips support',
                                    '🔄 Free date change (T&C apply)',
                                ].map(item => (
                                    <div key={item} className="flex items-start gap-2">
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Star size={14} className="text-amber-500 fill-amber-500" />
                                <span className="text-sm font-bold text-gray-800">Trusted by 25,000+ Travelers</span>
                            </div>
                            <div className="space-y-1.5 text-xs text-gray-600">
                                <div className="flex items-center gap-1.5"><Shield size={11} className="text-green-500" /> Govt. registered · MSME certified</div>
                                <div className="flex items-center gap-1.5"><Clock size={11} className="text-blue-500" /> E-ticket sent within 30 minutes</div>
                                <div className="flex items-center gap-1.5"><CheckCircle size={11} className="text-green-500" /> Best price guarantee</div>
                            </div>
                        </div>

                        {/* Need help */}
                        <a href="https://wa.me/918427831127?text=Hi!%20I%20need%20help%20booking%20a%20flight."
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 w-full p-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl transition-colors font-semibold text-sm">
                            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Need help? Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FlightBookPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <FlightBookContent />
        </Suspense>
    );
}
