'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Compass, Search, CheckCircle, Clock, Plane, Calendar, Users,
  MapPin, Ticket, Copy, MessageCircle, ArrowRight, AlertCircle,
  RefreshCw, Home
} from 'lucide-react';
import Link from 'next/link';

interface BookingResult {
  type: 'trip' | 'event' | 'flight';
  data: Record<string, unknown>;
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toUpperCase();
  const isGreen = s === 'PAID' || s === 'CONFIRMED' || s === 'SUCCESS' || s === 'TICKET_ISSUED';
  const isRed = s === 'CANCELLED' || s === 'FAILED' || s === 'REFUNDED';
  const isYellow = !isGreen && !isRed;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
        ${isGreen ? 'bg-green-100 text-green-700' : ''}
        ${isRed ? 'bg-red-100 text-red-700' : ''}
        ${isYellow ? 'bg-amber-100 text-amber-700' : ''}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isGreen ? 'bg-green-500' : isRed ? 'bg-red-500' : 'bg-amber-500'}`} />
      {status}
    </span>
  );
}

function TripBookingCard({ data }: { data: Record<string, unknown> }) {
  const [copied, setCopied] = useState(false);
  const ref = (data.bookingReference as string) || '';

  const copy = () => {
    navigator.clipboard.writeText(ref).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const steps = [
    { label: 'Confirmed', done: true },
    { label: 'Payment Received', done: (data.paymentStatus as string)?.toUpperCase() === 'PAID' },
    { label: 'Trip Preparation', done: false },
    { label: 'Your Journey ✈️', done: false },
  ];

  return (
    <div className="space-y-5">
      {/* Booking ref card */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mb-1">Booking Reference</p>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold tracking-wider">{ref}</span>
          <button onClick={copy} className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors" title="Copy">
            <Copy size={16} />
          </button>
        </div>
        {copied && <p className="text-xs text-amber-200 mt-1">Copied! 🎉</p>}
      </div>

      {/* Details card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-lg">Trip Details</h3>
        {!!data.trip && (
          <>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Destination</p>
                <p className="font-semibold text-gray-900">{String((data.trip as Record<string, unknown>).destination ?? '')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Compass size={18} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Trip</p>
                <p className="font-semibold text-gray-900">{String((data.trip as Record<string, unknown>).title ?? '')}</p>
              </div>
            </div>
          </>
        )}
        {!!data.travelDate && (
          <div className="flex items-start gap-3">
            <Calendar size={18} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Travel Date</p>
              <p className="font-semibold text-gray-900">{new Date(String(data.travelDate)).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        )}
        {data.numberOfGuests != null && (
          <div className="flex items-start gap-3">
            <Users size={18} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Guests</p>
              <p className="font-semibold text-gray-900">{Number(data.numberOfGuests)}</p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Amount Paid</p>
            <p className="text-2xl font-bold text-gray-900">₹{Number(data.finalAmount || data.totalAmount || 0).toLocaleString('en-IN')}</p>
          </div>
          <StatusBadge status={(data.paymentStatus as string) || 'PENDING'} />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Booking Timeline</h3>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-green-500' : i === steps.findIndex(s => !s.done) ? 'bg-amber-100 border-2 border-amber-400' : 'bg-gray-100'}`}>
                {step.done
                  ? <CheckCircle size={16} className="text-white" />
                  : <Clock size={14} className={i === steps.findIndex(s => !s.done) ? 'text-amber-500' : 'text-gray-400'} />
                }
              </div>
              <span className={`text-sm font-medium ${step.done ? 'text-green-700' : i === steps.findIndex(s => !s.done) ? 'text-amber-700' : 'text-gray-400'}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventBookingCard({ data }: { data: Record<string, unknown> }) {
  const [copied, setCopied] = useState(false);
  const ref = (data.bookingReference as string) || '';

  const copy = () => {
    navigator.clipboard.writeText(ref).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-purple-100 text-xs font-bold uppercase tracking-widest mb-1">Event Booking Reference</p>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold tracking-wider">{ref}</span>
          <button onClick={copy} className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
            <Copy size={16} />
          </button>
        </div>
        {copied && <p className="text-xs text-purple-200 mt-1">Copied! 🎉</p>}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-lg">Event Details</h3>
        {!!data.event && (
          <div className="flex items-start gap-3">
            <Ticket size={18} className="text-purple-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Event</p>
              <p className="font-semibold text-gray-900">{String((data.event as Record<string, unknown>).title ?? '')}</p>
            </div>
          </div>
        )}
        {!!data.eventDate && (
          <div className="flex items-start gap-3">
            <Calendar size={18} className="text-purple-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Event Date</p>
              <p className="font-semibold text-gray-900">{new Date(String(data.eventDate)).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        )}
        {data.numberOfTickets != null && (
          <div className="flex items-start gap-3">
            <Ticket size={18} className="text-purple-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Tickets</p>
              <p className="font-semibold text-gray-900">{Number(data.numberOfTickets)}</p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Amount Paid</p>
            <p className="text-2xl font-bold text-gray-900">₹{Number(data.finalAmount || data.totalAmount || 0).toLocaleString('en-IN')}</p>
          </div>
          <StatusBadge status={(data.paymentStatus as string) || 'PENDING'} />
        </div>
      </div>
    </div>
  );
}

function FlightBookingCard({ data }: { data: Record<string, unknown> }) {
  const [copied, setCopied] = useState(false);
  const ref = (data.txnid as string) || '';
  const flight = data.flight as Record<string, unknown> | undefined;
  const passengers = (data.passengers as Record<string, unknown>[]) || [];
  const contact = data.contact as Record<string, unknown> | undefined;

  const copy = () => {
    navigator.clipboard.writeText(ref).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const steps = [
    { label: 'Booking Received', done: true },
    { label: 'Payment Confirmed', done: (data.status as string)?.toUpperCase() !== 'PENDING' },
    { label: 'Ticket Issued', done: (data.status as string)?.toUpperCase() === 'TICKET_ISSUED' || (data.status as string)?.toUpperCase() === 'CONFIRMED' },
    { label: 'Bon Voyage! ✈️', done: false },
  ];

  return (
    <div className="space-y-5">
      {/* Boarding pass style card */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mb-1">Flight Booking</p>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold tracking-wider">{ref}</span>
              <button onClick={copy} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                <Copy size={14} />
              </button>
            </div>
            {copied && <p className="text-xs text-amber-200 mt-1">Copied!</p>}
          </div>
          <StatusBadge status={(data.status as string) || 'CONFIRMED'} />
        </div>

        {flight && (
          <div className="flex items-center justify-between mt-2 bg-white/15 rounded-xl p-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{flight.from as string}</p>
              <p className="text-amber-100 text-xs mt-1">{flight.dep as string}</p>
            </div>
            <div className="flex-1 flex flex-col items-center px-4">
              <p className="text-amber-100 text-xs mb-1">{flight.dur as string}</p>
              <div className="w-full flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border-2 border-white/60" />
                <div className="flex-1 h-px bg-white/40 relative">
                  <Plane size={12} className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-white" />
                </div>
                <div className="w-2 h-2 rounded-full border-2 border-white/60" />
              </div>
              <p className="text-amber-100 text-xs mt-1">{(flight.stops as number) === 0 ? 'Non-stop' : `${flight.stops} stop`}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{flight.to as string}</p>
              <p className="text-amber-100 text-xs mt-1">{flight.arr as string}</p>
            </div>
          </div>
        )}
      </div>

      {/* Flight details */}
      {flight && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Flight Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Airline</p>
              <p className="font-semibold text-gray-900">{flight.airline as string}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Flight No.</p>
              <p className="font-semibold text-gray-900">{flight.flightNum as string}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
              <p className="font-semibold text-gray-900">{flight.date as string}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Passengers</p>
              <p className="font-semibold text-gray-900">{passengers.length}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">₹{Number(flight.price || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Passengers */}
      {passengers.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-3">Passengers</h3>
          <div className="space-y-2">
            {passengers.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">{i + 1}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{p.title as string} {p.firstName as string} {p.lastName as string}</p>
                  <p className="text-xs text-gray-400">{p.gender as string} · {p.nationality as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status timeline */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Booking Status</h3>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-green-500' : i === steps.findIndex(s => !s.done) ? 'bg-amber-100 border-2 border-amber-400' : 'bg-gray-100'}`}>
                {step.done
                  ? <CheckCircle size={16} className="text-white" />
                  : <Clock size={14} className={i === steps.findIndex(s => !s.done) ? 'text-amber-500' : 'text-gray-400'} />
                }
              </div>
              <span className={`text-sm font-medium ${step.done ? 'text-green-700' : i === steps.findIndex(s => !s.done) ? 'text-amber-700' : 'text-gray-400'}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Download boarding pass visual */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="font-bold text-amber-800 text-sm">Boarding Pass</p>
          <p className="text-amber-600 text-xs mt-0.5">E-ticket will be sent to {contact?.email as string || 'your email'} within 30 min</p>
        </div>
        <a
          href={`https://wa.me/918427831127?text=Hi!%20I%20booked%20flight%20${encodeURIComponent(ref)}.%20Please%20send%20my%20e-ticket.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition-colors"
        >
          <MessageCircle size={14} />
          Get Ticket
        </a>
      </div>
    </div>
  );
}

function MyBookingContent() {
  const searchParams = useSearchParams();
  const prefillRef = searchParams.get('ref') || '';

  const [reference, setReference] = useState(prefillRef);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim() || !email.trim()) {
      setError('Please enter both your booking reference and email.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    const ref = reference.trim().toUpperCase();

    try {
      if (ref.startsWith('FLT-')) {
        // Flight booking lookup
        const res = await fetch(`/api/admin/flight-bookings?txnid=${encodeURIComponent(ref)}`);
        const json = await res.json();
        const booking = json.data;
        if (!booking) { setError('Booking not found. Please check your reference.'); return; }
        const bookingEmail = (booking.contact?.email as string || '').toLowerCase();
        if (bookingEmail !== email.trim().toLowerCase()) {
          setError('Email does not match our records. Please check and try again.');
          return;
        }
        setResult({ type: 'flight', data: booking as Record<string, unknown> });
      } else if (ref.startsWith('EVT-')) {
        // First check if it's a flight proxy
        const flightRes = await fetch(`/api/admin/flight-bookings?evtRef=${encodeURIComponent(ref)}`);
        const flightJson = await flightRes.json();
        if (flightJson.data) {
          const booking = flightJson.data as Record<string, unknown>;
          const bookingEmail = ((booking.contact as Record<string, unknown>)?.email as string || '').toLowerCase();
          if (bookingEmail !== email.trim().toLowerCase()) {
            setError('Email does not match our records. Please check and try again.');
            return;
          }
          setResult({ type: 'flight', data: booking });
          return;
        }
        // Regular event booking
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/event-bookings/${encodeURIComponent(ref)}`);
        if (!res.ok) { setError('Booking not found. Please check your reference.'); return; }
        const booking = await res.json();
        const bookingEmail = (booking.customerEmail as string || '').toLowerCase();
        if (bookingEmail !== email.trim().toLowerCase()) {
          setError('Email does not match our records. Please check and try again.');
          return;
        }
        setResult({ type: 'event', data: booking as Record<string, unknown> });
      } else {
        // Trip booking (BK- or other)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/bookings/${encodeURIComponent(ref)}`);
        if (!res.ok) { setError('Booking not found. Please check your reference.'); return; }
        const booking = await res.json();
        const bookingEmail = (booking.customerEmail as string || '').toLowerCase();
        if (bookingEmail !== email.trim().toLowerCase()) {
          setError('Email does not match our records. Please check and try again.');
          return;
        }
        setResult({ type: 'trip', data: booking as Record<string, unknown> });
      }
    } catch {
      setError('Something went wrong. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setReference('');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-600">YlooTrips</Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5">
            <Home size={14} /> Home
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10 md:py-16">
        {!result ? (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Compass size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Track Your Booking ✈️</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                No account needed — just your booking reference and the email you used when booking.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLookup} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Booking Reference
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. BK-123456, EVT-ABC123, FLT-123456"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent font-mono text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email used at booking"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                  required
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Looking up...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Find My Booking
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                No account needed — just your booking reference and email
              </p>
            </form>

            {/* Prefix hints */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { prefix: 'BK-', label: 'Trip Booking', icon: '🗺️', color: 'bg-amber-50 border-amber-200 text-amber-700' },
                { prefix: 'EVT-', label: 'Event Booking', icon: '🎟️', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                { prefix: 'FLT-', label: 'Flight Booking', icon: '✈️', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              ].map(hint => (
                <div key={hint.prefix} className={`${hint.color} border rounded-xl p-3 text-center`}>
                  <p className="text-lg mb-1">{hint.icon}</p>
                  <p className="text-xs font-bold font-mono">{hint.prefix}</p>
                  <p className="text-xs mt-0.5 opacity-80">{hint.label}</p>
                </div>
              ))}
            </div>

            {/* WhatsApp help */}
            <a
              href="https://wa.me/918427831127?text=Hi!%20I%20need%20help%20with%20my%20booking."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Need help? Chat with us
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Back button */}
            <button
              onClick={reset}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              <ArrowRight size={16} className="rotate-180" />
              Search another booking
            </button>

            {/* Booking cards */}
            {result.type === 'trip' && <TripBookingCard data={result.data} />}
            {result.type === 'event' && <EventBookingCard data={result.data} />}
            {result.type === 'flight' && <FlightBookingCard data={result.data} />}

            {/* WhatsApp help */}
            <a
              href="https://wa.me/918427831127?text=Hi!%20I%20need%20help%20with%20my%20booking."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              <MessageCircle size={18} />
              Need help? Chat with us on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <MyBookingContent />
    </Suspense>
  );
}
