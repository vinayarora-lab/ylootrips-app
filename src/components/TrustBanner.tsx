import { CreditCard, Lock, ShieldCheck, Clock, Star, Phone } from 'lucide-react';

export default function TrustBanner() {
  return (
    <div className="bg-cream-light border-b border-primary/8">
      {/* Trust badges row */}
      <div className="section-container py-4 border-b border-primary/6">
        <div className="flex flex-wrap items-center justify-center gap-5 md:gap-10">
          <div className="flex items-center gap-2 text-primary/70">
            <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
            <span className="text-caption uppercase tracking-wider font-medium">Govt. Registered</span>
          </div>
          <div className="flex items-center gap-2 text-primary/70">
            <Lock className="w-4 h-4 text-secondary shrink-0" />
            <span className="text-caption uppercase tracking-wider font-medium">256-bit SSL</span>
          </div>
          <div className="flex items-center gap-2 text-primary/70">
            <Clock className="w-4 h-4 text-terracotta shrink-0" />
            <span className="text-caption uppercase tracking-wider font-medium">Reply in 1 Hr · 7 Days</span>
          </div>
          <div className="flex items-center gap-2 text-primary/70">
            <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span className="text-caption uppercase tracking-wider font-medium">24/7 On-Trip Support</span>
          </div>
          {/* Google Rating */}
          <div className="flex items-center gap-1.5 border-l border-primary/10 pl-5 ml-1">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-3 h-3 fill-[#FBBC05] text-[#FBBC05]" />
              ))}
            </div>
            <span className="text-caption font-bold text-primary/80">4.9</span>
            <span className="text-caption text-primary/40">Google Reviews</span>
          </div>
        </div>
      </div>

      {/* Payment methods row */}
      <div className="section-container py-2.5">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <CreditCard className="w-3.5 h-3.5 text-primary/30 shrink-0" />
          <span className="text-[9px] uppercase tracking-widest text-primary/30 shrink-0 mr-1">Secure payments</span>
          {[
            { label: 'Visa', cls: 'text-blue-700 bg-blue-50' },
            { label: 'Mastercard', cls: 'text-red-600 bg-red-50' },
            { label: 'Amex', cls: 'text-blue-800 bg-blue-50' },
            { label: 'UPI', cls: 'text-green-700 bg-green-50' },
            { label: 'RuPay', cls: 'text-orange-600 bg-orange-50' },
            { label: 'Net Banking', cls: 'text-gray-700 bg-gray-100' },
            { label: 'EMI ✦ 0%', cls: 'text-purple-700 bg-purple-50' },
          ].map(({ label, cls }) => (
            <span key={label} className={`${cls} text-[9px] font-bold px-2 py-1 rounded border border-black/5 whitespace-nowrap`}>
              {label}
            </span>
          ))}
          <span className="text-[9px] text-primary/25 hidden md:inline ml-2">· No card details stored · PCI-DSS compliant</span>
        </div>
      </div>
    </div>
  );
}
