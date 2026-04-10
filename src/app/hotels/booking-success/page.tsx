'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, BedDouble, Home, Phone } from 'lucide-react';

function HotelBookingSuccessContent() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid') || '';
  const status = searchParams.get('status') || 'success';

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-cream-light flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {isSuccess ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <h1 className="font-display text-3xl text-primary mb-3">Booking Confirmed!</h1>
            <p className="text-secondary text-sm mb-6">
              Your hotel booking has been successfully placed. Our team will send you a confirmation
              shortly.
            </p>

            <div className="bg-cream-light rounded-xl p-5 text-left mb-6 space-y-3">
              <div className="flex items-center gap-3">
                <BedDouble className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <p className="text-[11px] text-secondary uppercase tracking-widest">Booking Reference</p>
                  <p className="font-mono font-bold text-primary text-sm">{txnid}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <p className="text-[11px] text-secondary uppercase tracking-widest">Support</p>
                  <a href="tel:+918427831127" className="font-semibold text-primary text-sm hover:text-accent transition-colors">
                    +91 84278 31127
                  </a>
                </div>
              </div>
            </div>

            <p className="text-xs text-secondary mb-8">
              Check your email for booking details. If you have any questions, call us or message us
              on WhatsApp — we&apos;re available Mon–Sun, 9am–9pm IST.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BedDouble className="w-9 h-9 text-red-500" />
            </div>
            <h1 className="font-display text-3xl text-primary mb-3">Payment Failed</h1>
            <p className="text-secondary text-sm mb-6">
              We couldn&apos;t process your payment. No charges were made. Please try again or contact us
              for help.
            </p>
            {txnid && (
              <p className="text-xs text-secondary mb-6">
                Reference: <span className="font-mono font-bold">{txnid}</span>
              </p>
            )}
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/hotels"
            className="flex-1 flex items-center justify-center gap-2 bg-accent text-primary font-semibold py-3 rounded-xl hover:bg-accent/90 transition-colors text-sm"
          >
            <BedDouble size={15} />
            Search Hotels
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 border border-sand/60 text-secondary font-semibold py-3 rounded-xl hover:bg-cream-light transition-colors text-sm"
          >
            <Home size={15} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HotelBookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-light flex items-center justify-center">
          <p className="text-secondary text-sm">Loading…</p>
        </div>
      }
    >
      <HotelBookingSuccessContent />
    </Suspense>
  );
}
