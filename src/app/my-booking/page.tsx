'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search, CheckCircle, Clock, Plane, Calendar, Users,
  MapPin, Ticket, Copy, MessageCircle, ArrowLeft, AlertCircle,
  RefreshCw, Receipt, Shield, Download, Star, Zap,
  Wallet, ChevronRight, Bell, Compass, Globe,
  Mountain, Sparkles, BookOpen, Heart, X
} from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';

function fmt(n: number) { return new Intl.NumberFormat('en-IN').format(Math.round(n)); }

/* ─── Booking Reference Hero Card ─── */
function RefCard({ ref: bookingRef, label, gradient }: { ref: string; label: string; gradient: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(bookingRef).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className={`relative rounded-3xl p-7 text-white shadow-2xl overflow-hidden ${gradient}`}>
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="relative z-10">
        <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em] mb-2">{label}</p>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl sm:text-4xl font-black tracking-widest font-mono">{bookingRef}</span>
          <button onClick={copy}
            className="shrink-0 w-10 h-10 bg-white/20 hover:bg-white/35 backdrop-blur rounded-xl flex items-center justify-center transition-all active:scale-95">
            <Copy size={16} />
          </button>
        </div>
        {copied
          ? <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Copied! 🎉</span>
          : <span className="text-xs text-white/60">Tap to copy your booking reference</span>
        }
      </div>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toUpperCase();
  const isGreen = ['PAID', 'CONFIRMED', 'SUCCESS', 'TICKET_ISSUED'].includes(s);
  const isRed = ['CANCELLED', 'FAILED', 'REFUNDED'].includes(s);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider
      ${isGreen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''}
      ${isRed ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
      ${!isGreen && !isRed ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : ''}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse
        ${isGreen ? 'bg-emerald-400' : isRed ? 'bg-red-400' : 'bg-amber-400'}`} />
      {status}
    </span>
  );
}

/* ─── Glass Card wrapper ─── */
function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Payment Receipt ─── */
function PaymentReceipt({ lines, total, paymentMethod, paymentStatus, paidAt, receiptId }: {
  lines: { label: string; amount: number; sub?: boolean }[];
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paidAt?: string;
  receiptId: string;
}) {
  const [copied, setCopied] = useState(false);
  const isPaid = ['PAID', 'SUCCESS', 'CONFIRMED'].includes((paymentStatus || '').toUpperCase());

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Receipt size={15} className="text-amber-400" />
          <span className="text-white font-bold text-sm">Payment Receipt</span>
        </div>
        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${isPaid ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-gray-900'}`}>
          {isPaid ? '✓ PAID' : 'PENDING'}
        </span>
      </div>
      <div className="px-5 py-5 space-y-4">
        <div className="flex justify-between text-xs">
          <div>
            <p className="text-white/40 mb-1">Receipt No.</p>
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-bold text-white/80">{receiptId}</p>
              <button onClick={() => { navigator.clipboard.writeText(receiptId); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="text-white/30 hover:text-amber-400 transition-colors"><Copy size={11} /></button>
            </div>
            {copied && <p className="text-emerald-400 text-[10px] mt-0.5">Copied!</p>}
          </div>
          <div className="text-right">
            <p className="text-white/40 mb-1">Issued</p>
            <p className="font-medium text-white/80">
              {paidAt ? new Date(paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="h-px bg-white/10" />
        <div className="space-y-2">
          {lines.map((line) => (
            <div key={line.label} className={`flex justify-between ${line.sub ? 'text-xs text-white/40 pl-3' : 'text-sm text-white/70'}`}>
              <span>{line.label}</span>
              <span className={line.sub ? '' : 'font-semibold text-white/90'}>₹{fmt(line.amount)}</span>
            </div>
          ))}
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex justify-between items-center">
          <span className="font-bold text-white">Total Paid</span>
          <span className="text-2xl font-black text-amber-400">₹{fmt(total)}</span>
        </div>
        {paymentMethod && (
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3">
            <Shield size={13} className="text-emerald-400 shrink-0" />
            <p className="text-xs text-white/50">
              Paid via <span className="font-semibold text-white/80 capitalize">{paymentMethod.replace('_', ' ')}</span>
              <span className="text-white/30"> · Secured by Easebuzz</span>
            </p>
          </div>
        )}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-white/30">YlooTrips Official Receipt</span>
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-amber-400 transition-colors">
            <Download size={11} />Print
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Timeline ─── */
function Timeline({ steps }: { steps: { label: string; done: boolean }[] }) {
  const firstPending = steps.findIndex(s => !s.done);
  return (
    <GlassCard>
      <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">Journey Status</p>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all
              ${step.done ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : i === firstPending ? 'bg-amber-500/20 border-2 border-amber-400' : 'bg-white/5 border border-white/10'}`}>
              {step.done
                ? <CheckCircle size={15} className="text-white" />
                : <Clock size={13} className={i === firstPending ? 'text-amber-400' : 'text-white/20'} />
              }
            </div>
            <span className={`text-sm font-semibold
              ${step.done ? 'text-emerald-400' : i === firstPending ? 'text-amber-400' : 'text-white/20'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

/* ─── Trip Booking Card ─── */
function TripBookingCard({ data }: { data: Record<string, unknown> }) {
  const ref = (data.bookingReference as string) || '';
  const total = Number(data.finalAmount || data.totalAmount || 0);
  const steps = [
    { label: 'Booking Confirmed ✅', done: true },
    { label: 'Payment Received', done: (data.paymentStatus as string)?.toUpperCase() === 'PAID' },
    { label: 'Trip Preparation 🗺️', done: false },
    { label: 'Your Journey ✈️', done: false },
  ];
  return (
    <div className="space-y-5">
      <RefCard ref={ref} label="Trip Booking Reference" gradient="bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500" />
      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <p className="text-white font-bold text-lg">Trip Details</p>
          <StatusBadge status={(data.paymentStatus as string) || 'PENDING'} />
        </div>
        <div className="space-y-4">
          {!!data.trip && (
            <>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={15} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide">Destination</p>
                  <p className="text-white font-semibold">{String((data.trip as Record<string, unknown>).destination ?? '')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Zap size={15} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide">Trip</p>
                  <p className="text-white font-semibold">{String((data.trip as Record<string, unknown>).title ?? '')}</p>
                </div>
              </div>
            </>
          )}
          {!!data.travelDate && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={15} className="text-amber-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide">Travel Date</p>
                <p className="text-white font-semibold">{new Date(String(data.travelDate)).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          )}
          {data.numberOfGuests != null && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Users size={15} className="text-amber-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide">Guests</p>
                <p className="text-white font-semibold">{Number(data.numberOfGuests)}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <p className="text-white/40 text-xs uppercase tracking-wide">Amount Paid</p>
            <p className="text-2xl font-black text-amber-400">₹{fmt(total)}</p>
          </div>
        </div>
      </GlassCard>
      <Timeline steps={steps} />
      <PaymentReceipt
        receiptId={ref}
        lines={[{ label: 'Trip Package', amount: total }]}
        total={total}
        paymentMethod={data.paymentMode as string | undefined}
        paymentStatus={(data.paymentStatus as string) || 'PENDING'}
        paidAt={(data.createdAt || data.bookingDate) as string | undefined}
      />
    </div>
  );
}

/* ─── Event Booking Card ─── */
function EventBookingCard({ data }: { data: Record<string, unknown> }) {
  const ref = (data.bookingReference as string) || '';
  const total = Number(data.finalAmount || data.totalAmount || 0);
  const ticketCount = Number(data.numberOfTickets || 1);
  const perTicket = ticketCount > 0 ? Math.round(total / ticketCount) : total;
  const receiptLines = ticketCount > 1
    ? [{ label: `Ticket × ${ticketCount}`, amount: total }, { label: `  ₹${fmt(perTicket)} per ticket`, amount: perTicket * ticketCount, sub: true }]
    : [{ label: 'Ticket', amount: total }];
  return (
    <div className="space-y-5">
      <RefCard ref={ref} label="Event Booking Reference" gradient="bg-gradient-to-br from-purple-500 via-violet-500 to-pink-500" />
      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <p className="text-white font-bold text-lg">Event Details</p>
          <StatusBadge status={(data.paymentStatus as string) || 'PENDING'} />
        </div>
        <div className="space-y-4">
          {!!data.event && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Ticket size={15} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide">Event</p>
                <p className="text-white font-semibold">{String((data.event as Record<string, unknown>).title ?? '')}</p>
              </div>
            </div>
          )}
          {!!data.eventDate && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={15} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide">Date</p>
                <p className="text-white font-semibold">{new Date(String(data.eventDate)).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          )}
          {data.numberOfTickets != null && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Ticket size={15} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide">Tickets</p>
                <p className="text-white font-semibold">{ticketCount}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <p className="text-white/40 text-xs uppercase tracking-wide">Amount Paid</p>
            <p className="text-2xl font-black text-purple-400">₹{fmt(total)}</p>
          </div>
        </div>
      </GlassCard>
      <PaymentReceipt
        receiptId={ref}
        lines={receiptLines}
        total={total}
        paymentMethod={data.paymentMode as string | undefined}
        paymentStatus={(data.paymentStatus as string) || 'PENDING'}
        paidAt={data.createdAt as string | undefined}
      />
    </div>
  );
}

/* ─── Flight Booking Card ─── */
function FlightBookingCard({ data }: { data: Record<string, unknown> }) {
  const ref = (data.txnid as string) || '';
  const flight = data.flight as Record<string, unknown> | undefined;
  const passengers = (data.passengers as Record<string, unknown>[]) || [];
  const contact = data.contact as Record<string, unknown> | undefined;
  const total = Number(flight?.price || 0);
  const baseFare = Math.round(total * 0.82);
  const taxes = Math.round(total * 0.18);
  const convFee = 249;
  const steps = [
    { label: 'Booking Received 📥', done: true },
    { label: 'Payment Confirmed 💳', done: (data.status as string)?.toUpperCase() !== 'PENDING' },
    { label: 'Ticket Issued 🎟️', done: ['TICKET_ISSUED', 'CONFIRMED'].includes((data.status as string)?.toUpperCase()) },
    { label: 'Bon Voyage! ✈️', done: false },
  ];
  return (
    <div className="space-y-5">
      <RefCard ref={ref} label="Flight Booking Reference" gradient="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500" />
      {flight && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-bold">Flight Info</p>
            <StatusBadge status={(data.status as string) || 'CONFIRMED'} />
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4">
            <div className="text-center">
              <p className="text-4xl font-black text-white">{flight.from as string}</p>
              <p className="text-white/40 text-xs mt-1">{flight.dep as string}</p>
            </div>
            <div className="flex-1 flex flex-col items-center px-4">
              <p className="text-white/40 text-xs mb-2">{flight.dur as string}</p>
              <div className="w-full flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border-2 border-white/40" />
                <div className="flex-1 h-px bg-white/20 relative">
                  <Plane size={12} className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-sky-400" />
                </div>
                <div className="w-2 h-2 rounded-full border-2 border-white/40" />
              </div>
              <p className="text-white/40 text-xs mt-2">{(flight.stops as number) === 0 ? 'Non-stop' : `${flight.stops} stop`}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-white">{flight.to as string}</p>
              <p className="text-white/40 text-xs mt-1">{flight.arr as string}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: 'Airline', value: flight.airline as string },
              { label: 'Flight No.', value: flight.flightNum as string },
              { label: 'Date', value: flight.date as string },
              { label: 'Passengers', value: String(passengers.length) },
            ].map(item => (
              <div key={item.label} className="bg-white/5 rounded-xl p-3">
                <p className="text-white/40 text-xs uppercase tracking-wide">{item.label}</p>
                <p className="text-white font-semibold mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
      {passengers.length > 0 && (
        <GlassCard>
          <p className="text-white font-bold mb-3">Passengers</p>
          <div className="space-y-2">
            {passengers.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-black text-sm shrink-0">{i + 1}</div>
                <div>
                  <p className="font-semibold text-white text-sm">{p.title as string} {p.firstName as string} {p.lastName as string}</p>
                  <p className="text-white/40 text-xs">{p.gender as string} · {p.nationality as string}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
      <Timeline steps={steps} />
      <PaymentReceipt
        receiptId={ref}
        lines={[
          { label: 'Base Fare', amount: baseFare },
          { label: 'Taxes & Fees', amount: taxes },
          { label: 'Convenience Fee', amount: convFee },
        ]}
        total={total + convFee}
        paymentMethod={data.paymentMethod as string | undefined}
        paymentStatus={(data.status as string) || 'CONFIRMED'}
        paidAt={data.savedAt as string | undefined}
      />
      <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="font-bold text-sky-300 text-sm">E-Ticket 🎫</p>
          <p className="text-sky-400/60 text-xs mt-0.5">Will be sent to {contact?.email as string || 'your email'} within 30 min</p>
        </div>
        <a
          href={`https://wa.me/918427831127?text=Hi!%20I%20booked%20flight%20${encodeURIComponent(ref)}.%20Please%20send%20my%20e-ticket.`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white text-xs font-bold rounded-xl hover:bg-sky-400 transition-colors"
        >
          <MessageCircle size={14} />
          Get Ticket
        </a>
      </div>
    </div>
  );
}

/* ─── Booking Search Sheet ─── */
function BookingSearchSheet({ onClose, onResult }: {
  onClose: () => void;
  onResult: (r: { type: 'trip' | 'event' | 'flight'; data: Record<string, unknown> }) => void;
}) {
  const searchParams = useSearchParams();
  const prefillRef = searchParams.get('ref') || '';
  const [reference, setReference] = useState(prefillRef);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim() || !email.trim()) { setError('Enter your booking reference and email.'); return; }
    setLoading(true); setError(null);
    const ref = reference.trim().toUpperCase();
    try {
      if (ref.startsWith('FLT-')) {
        const res = await fetch(`/api/admin/flight-bookings?txnid=${encodeURIComponent(ref)}`);
        const json = await res.json();
        if (!json.data) { setError('Booking not found. Check your reference and try again.'); return; }
        if ((json.data.contact?.email as string || '').toLowerCase() !== email.trim().toLowerCase()) { setError("Email doesn't match our records."); return; }
        onResult({ type: 'flight', data: json.data });
      } else if (ref.startsWith('EVT-')) {
        const flightRes = await fetch(`/api/admin/flight-bookings?evtRef=${encodeURIComponent(ref)}`);
        const flightJson = await flightRes.json();
        if (flightJson.data) {
          const b = flightJson.data as Record<string, unknown>;
          if (((b.contact as Record<string, unknown>)?.email as string || '').toLowerCase() !== email.trim().toLowerCase()) { setError("Email doesn't match our records."); return; }
          onResult({ type: 'flight', data: b }); return;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/event-bookings/${encodeURIComponent(ref)}`);
        if (!res.ok) { setError('Booking not found. Check your reference.'); return; }
        const booking = await res.json();
        if ((booking.customerEmail as string || '').toLowerCase() !== email.trim().toLowerCase()) { setError("Email doesn't match our records."); return; }
        onResult({ type: 'event', data: booking });
      } else {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/bookings/${encodeURIComponent(ref)}`);
        if (!res.ok) { setError('Booking not found. Check your reference.'); return; }
        const booking = await res.json();
        if ((booking.customerEmail as string || '').toLowerCase() !== email.trim().toLowerCase()) { setError("Email doesn't match our records."); return; }
        onResult({ type: 'trip', data: booking });
      }
    } catch {
      setError('Something went wrong. Try again or WhatsApp us.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="px-5 pb-6 pt-2 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 24px)' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-black text-gray-900">Track Your Booking</h2>
              <p className="text-xs text-gray-400 mt-0.5">Enter your reference & email to find your booking</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform">
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Booking Reference</label>
              <input
                type="text"
                value={reference}
                onChange={e => setReference(e.target.value)}
                placeholder="BK-123456 · EVT-ABC123 · FLT-123456"
                className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 font-mono text-sm transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email used when booking"
                className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-sm transition-all"
                required
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <AlertCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <><RefreshCw size={18} className="animate-spin" />Looking up...</> : <><Search size={18} />Find My Booking</>}
            </button>
          </form>

          {/* Reference type hints */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { prefix: 'BK-', label: 'Trip', emoji: '🗺️', color: 'border-amber-200 text-amber-600 bg-amber-50' },
              { prefix: 'EVT-', label: 'Event', emoji: '🎟️', color: 'border-purple-200 text-purple-600 bg-purple-50' },
              { prefix: 'FLT-', label: 'Flight', emoji: '✈️', color: 'border-sky-200 text-sky-600 bg-sky-50' },
            ].map(h => (
              <div key={h.prefix} className={`${h.color} border rounded-xl p-2.5 text-center`}>
                <p className="text-lg mb-0.5">{h.emoji}</p>
                <p className="text-[10px] font-black font-mono">{h.prefix}</p>
                <p className="text-[10px] mt-0.5 opacity-70">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Profile Page (MMT-style) ─── */
function ProfilePage({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { balance } = useWallet();

  const menuSections = [
    {
      title: 'My Trips',
      items: [
        { icon: <Ticket size={20} className="text-amber-500" />, label: 'Track / Find Booking', sub: 'BK · EVT · FLT reference', action: onOpenSearch, bg: 'bg-amber-50' },
        { icon: <Heart size={20} className="text-rose-500" />, label: 'Wishlist', sub: 'Saved destinations', href: '/destinations/domestic', bg: 'bg-rose-50' },
      ],
    },
    {
      title: 'WanderLoot Rewards',
      items: [
        { icon: <Wallet size={20} className="text-green-600" />, label: 'Cashback Wallet', sub: balance > 0 ? `₹${balance} available` : 'Earn 10% on every trip', href: '/cashback', bg: 'bg-green-50' },
        { icon: <span className="text-lg">🎁</span>, label: 'Refer & Earn', sub: 'Invite friends, earn cashback', href: 'https://wa.me/918427831127?text=Hi!%20I%20want%20to%20refer%20a%20friend%20to%20YlooTrips.', external: true, bg: 'bg-purple-50' },
      ],
    },
    {
      title: 'Explore',
      items: [
        { icon: <Mountain size={20} className="text-amber-600" />, label: 'Domestic Trips', sub: '150+ India destinations', href: '/destinations/domestic', bg: 'bg-amber-50' },
        { icon: <Globe size={20} className="text-blue-500" />, label: 'International', sub: '50+ countries', href: '/destinations/international', bg: 'bg-blue-50' },
        { icon: <span className="text-lg">🎉</span>, label: 'Events', sub: 'Concerts, experiences & more', href: '/events', bg: 'bg-pink-50' },
        { icon: <Sparkles size={20} className="text-orange-500" />, label: 'AI Trip Planner', sub: 'Plan with Yloo AI', href: '/trip-planner', bg: 'bg-orange-50' },
      ],
    },
    {
      title: 'Help & Info',
      items: [
        { icon: <MessageCircle size={20} className="text-green-500" />, label: 'WhatsApp Support', sub: 'Responds in under 1 hour', href: 'https://wa.me/918427831127?text=Hi!%20I%20need%20help.', external: true, bg: 'bg-green-50' },
        { icon: <BookOpen size={20} className="text-indigo-500" />, label: 'Travel Blogs', sub: 'Tips, guides & inspiration', href: '/blogs', bg: 'bg-indigo-50' },
        { icon: <Compass size={20} className="text-gray-500" />, label: 'About YlooTrips', sub: 'Our story & team', href: '/about', bg: 'bg-gray-50' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* Profile Hero Card */}
      <div className="relative bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 pt-16 pb-8 px-4">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-3xl">🧳</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-0.5">Welcome back</p>
            <h1 className="text-white font-black text-2xl leading-tight">Hi Traveler! 👋</h1>
            <p className="text-white/60 text-sm mt-0.5">YlooTrips Member</p>
          </div>
          <div className="shrink-0">
            <ChevronRight size={22} className="text-white/50" />
          </div>
        </div>

        {/* Wallet balance pill */}
        {balance > 0 && (
          <Link href="/cashback" className="mt-4 inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 active:scale-95 transition-transform">
            <Wallet size={14} className="text-white" />
            <span className="text-white font-bold text-sm">₹{balance} WanderLoot Cash</span>
            <ChevronRight size={14} className="text-white/60" />
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mx-4 -mt-5 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg px-4 py-5">
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <Search size={22} className="text-amber-500" />, label: 'Find Booking', action: onOpenSearch },
              { icon: <MessageCircle size={22} className="text-green-500" />, label: 'Support', href: 'https://wa.me/918427831127?text=Hi!%20I%20need%20help.' },
              { icon: <Bell size={22} className="text-blue-500" />, label: 'Notifications', badge: true },
            ].map(({ icon, label, action, href, badge }) => {
              const inner = (
                <div className="flex flex-col items-center gap-2 relative">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center relative">
                    {icon}
                    {badge && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
                  </div>
                  <span className="text-xs font-semibold text-gray-600 text-center leading-tight">{label}</span>
                </div>
              );
              if (action) return <button key={label} onClick={action} className="active:scale-95 transition-transform">{inner}</button>;
              if (href?.startsWith('http')) return <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="active:scale-95 transition-transform">{inner}</a>;
              return <Link key={label} href={href || '#'} className="active:scale-95 transition-transform">{inner}</Link>;
            })}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-4 mt-4 space-y-4">
        {menuSections.map(section => (
          <div key={section.title} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <p className="px-4 pt-4 pb-2 text-xs font-black uppercase tracking-widest text-gray-400">{section.title}</p>
            {section.items.map((item: {
              icon: React.ReactNode; label: string; sub?: string; bg: string;
              action?: () => void; href?: string; external?: boolean;
            }, idx) => {
              const content = (
                <div className="flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                    {item.sub && <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>}
                  </div>
                  <ChevronRight size={16} className="text-blue-400 shrink-0" />
                </div>
              );
              const divider = idx < section.items.length - 1 ? <div className="h-px bg-gray-50 ml-16" /> : null;
              if (item.action) return <div key={item.label}><button className="w-full text-left" onClick={item.action}>{content}</button>{divider}</div>;
              if (item.external) return <div key={item.label}><a href={item.href} target="_blank" rel="noopener noreferrer">{content}</a>{divider}</div>;
              return <div key={item.label}><Link href={item.href || '#'}>{content}</Link>{divider}</div>;
            })}
          </div>
        ))}

        {/* Trust strip */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {[
              { label: '⭐ 4.9 Rating', sub: '2,400+ reviews' },
              { label: '📜 MSME Certified', sub: 'Govt. of India' },
              { label: '🔒 Secure Pay', sub: 'PCI-DSS' },
            ].map(({ label, sub }) => (
              <div key={label} className="text-center">
                <p className="text-xs font-bold text-gray-700">{label}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Content ─── */
function MyBookingContent() {
  const searchParams = useSearchParams();
  const prefillRef = searchParams.get('ref') || '';

  const [showSearch, setShowSearch] = useState(!!prefillRef);
  const [result, setResult] = useState<{ type: 'trip' | 'event' | 'flight'; data: Record<string, unknown> } | null>(null);

  const handleResult = (r: { type: 'trip' | 'event' | 'flight'; data: Record<string, unknown> }) => {
    setShowSearch(false);
    setResult(r);
  };

  if (result) {
    return (
      <div
        className="min-h-screen bg-[#0a0a0f] pb-24"
        style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(245,158,11,0.15), transparent)' }}
      >
        <div className="max-w-lg mx-auto px-4 py-8">
          <button
            onClick={() => setResult(null)}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 font-medium transition-colors mb-6"
          >
            <ArrowLeft size={16} />Back to My Trips
          </button>

          {result.type === 'trip' && <TripBookingCard data={result.data} />}
          {result.type === 'event' && <EventBookingCard data={result.data} />}
          {result.type === 'flight' && <FlightBookingCard data={result.data} />}

          <a
            href="https://wa.me/918427831127?text=Hi!%20I%20need%20help%20with%20my%20booking."
            target="_blank" rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-2xl transition-all"
          >
            <MessageCircle size={18} />Need help? Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfilePage onOpenSearch={() => setShowSearch(true)} />
      {showSearch && (
        <Suspense fallback={null}>
          <BookingSearchSheet onClose={() => setShowSearch(false)} onResult={handleResult} />
        </Suspense>
      )}
    </>
  );
}

export default function MyBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <MyBookingContent />
    </Suspense>
  );
}
