'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Phone, Search, MapPin, Calendar, Users, CheckCircle,
  Clock, XCircle, ChevronRight, Luggage, ArrowLeft,
} from 'lucide-react';

interface Booking {
  bookingReference: string;
  tripTitle: string;
  destination: string;
  travelDate: string;
  guests: number;
  totalAmount: number;
  paidAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN').format(Math.round(n));
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === 'confirmed' || s === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        <CheckCircle size={11} /> {status}
      </span>
    );
  }
  if (s === 'cancelled') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
        <XCircle size={11} /> Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
      <Clock size={11} /> Pending
    </span>
  );
}

function PaymentBadge({ paymentStatus, paidAmount, totalAmount }: {
  paymentStatus: string; paidAmount: number; totalAmount: number;
}) {
  if (paymentStatus === 'paid') {
    return <span className="text-emerald-600 font-semibold text-sm">Paid ₹{fmt(paidAmount)}</span>;
  }
  if (paymentStatus === 'partial') {
    return (
      <span className="text-amber-600 font-semibold text-sm">
        ₹{fmt(paidAmount)} paid of ₹{fmt(totalAmount)}
      </span>
    );
  }
  return <span className="text-gray-400 text-sm">₹{fmt(totalAmount)} due</span>;
}

export default function MyTripsPage() {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '').slice(-10);
    if (digits.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/history?phone=${digits}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      setBookings(data.bookings);
    } catch {
      setError('Could not fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-playfair text-xl font-bold text-gray-900">My Trips</h1>
            <p className="text-xs text-gray-400">View your booking history</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Search card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Phone size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Find Your Bookings</p>
              <p className="text-sm text-gray-500">Enter the mobile number used while booking</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter mobile number"
                maxLength={15}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 text-sm"
            >
              <Search size={16} />
              {loading ? 'Searching…' : 'Search'}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
        </div>

        {/* Results */}
        {bookings !== null && (
          <>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                <Luggage size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="font-semibold text-gray-700 mb-1">No bookings found</p>
                <p className="text-sm text-gray-400">
                  No trips found for this number. Bookings made via WhatsApp or with a different number won&apos;t appear here.
                </p>
                <Link
                  href="/trips"
                  className="inline-block mt-5 px-6 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-full hover:bg-amber-700 transition-colors"
                >
                  Browse Trips
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 px-1">
                  {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
                </p>
                {bookings.map((b) => (
                  <Link
                    key={b.bookingReference}
                    href={`/my-booking?ref=${b.bookingReference}`}
                    className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-amber-200 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-amber-700 transition-colors">
                          {b.tripTitle}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                          {b.destination && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin size={11} /> {b.destination}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar size={11} />
                            {new Date(b.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Users size={11} /> {b.guests} guest{b.guests !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <StatusBadge status={b.status} />
                          <PaymentBadge
                            paymentStatus={b.paymentStatus}
                            paidAmount={b.paidAmount}
                            totalAmount={b.totalAmount}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs font-mono text-gray-400">{b.bookingReference}</span>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-amber-500 transition-colors mt-auto" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Help text (shown before search) */}
        {bookings === null && !loading && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">
              Need help?{' '}
              <a href="https://wa.me/918427831127" className="text-amber-600 underline">
                WhatsApp us
              </a>
              {' '}and we&apos;ll pull up your booking instantly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
