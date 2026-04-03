import Link from 'next/link';
import { CreditCard, Lock, ShieldCheck, Clock } from 'lucide-react';

const paymentMethods = [
  { label: 'Visa', color: 'text-blue-700', bg: 'bg-blue-50' },
  { label: 'Mastercard', color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Amex', color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'PayPal', color: 'text-blue-800', bg: 'bg-blue-50' },
  { label: 'Bank Transfer', color: 'text-gray-700', bg: 'bg-gray-100' },
];

export default function TrustBanner() {
  return (
    <div className="bg-cream-light border-y border-primary/8">
      <div className="section-container py-6 md:py-8">
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-6 md:gap-4">

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-6 justify-center">
            <div className="flex items-center gap-2 text-primary/70">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span className="text-caption uppercase tracking-wider font-medium">Verified Travel Company</span>
            </div>
            <div className="flex items-center gap-2 text-primary/70">
              <Lock className="w-4 h-4 text-secondary shrink-0" />
              <span className="text-caption uppercase tracking-wider font-medium">Secure SSL Payments</span>
            </div>
            <div className="flex items-center gap-2 text-primary/70">
              <Clock className="w-4 h-4 text-terracotta shrink-0" />
              <span className="text-caption uppercase tracking-wider font-medium">Reply in &lt;1 Hour</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary/40 shrink-0" />
            <div className="flex items-center gap-1.5">
              {paymentMethods.map(({ label, color, bg }) => (
                <span
                  key={label}
                  className={`${bg} ${color} text-[10px] font-bold px-2 py-1 rounded border border-black/5 whitespace-nowrap`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
