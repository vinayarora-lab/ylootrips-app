'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Phone, Mail, MessageCircle } from 'lucide-react';

function BookingSuccessContent() {
  const params = useSearchParams();
  const txnid = params.get('txnid') || '';
  const ref = txnid.replace('MKT-', 'YLO-');

  return (
    <div className="min-h-screen bg-cream-light flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div>
          <h1 className="font-display text-2xl text-primary mb-2">Booking Confirmed!</h1>
          <p className="text-secondary text-sm">
            Your payment was successful. Our team will contact you within 1 hour to share your complete trip details and itinerary.
          </p>
        </div>

        {txnid && (
          <div className="bg-white border border-primary/10 rounded-2xl p-5 text-left space-y-2">
            <p className="text-xs text-secondary uppercase tracking-widest font-medium">Booking Reference</p>
            <p className="font-mono text-lg font-bold text-primary">{ref}</p>
            <p className="text-xs text-secondary">Save this reference for all future communication.</p>
          </div>
        )}

        <div className="bg-white border border-primary/10 rounded-2xl p-5 text-left space-y-3">
          <p className="text-xs text-secondary uppercase tracking-widest font-medium mb-1">What happens next?</p>
          {[
            'Our travel expert reviews your booking within 1 hour',
            'You receive a detailed itinerary & payment receipt by email',
            'We coordinate hotels, transport & all logistics for you',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-accent text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-sm text-primary/80">{step}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary rounded-2xl p-5 space-y-3">
          <p className="text-cream text-sm font-medium">Need help? Reach us directly:</p>
          <div className="flex gap-3">
            <a href="https://wa.me/918427831127" target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-green-600 transition-colors">
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a href="tel:+918427831127"
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-cream text-xs font-medium py-2.5 rounded-xl hover:bg-white/20 transition-colors">
              <Phone size={14} /> Call Us
            </a>
            <a href="mailto:connectylootrips@gmail.com"
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-cream text-xs font-medium py-2.5 rounded-xl hover:bg-white/20 transition-colors">
              <Mail size={14} /> Email
            </a>
          </div>
        </div>

        <Link href="/" className="inline-block text-sm text-accent hover:underline">
          ← Back to YlooTrips
        </Link>
      </div>
    </div>
  );
}

export default function MarketBookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-light" />}>
      <BookingSuccessContent />
    </Suspense>
  );
}
