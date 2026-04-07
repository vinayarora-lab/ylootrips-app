import { Shield, Lock, CreditCard, CheckCircle2, Globe, Smartphone } from 'lucide-react';

export default function TrustBadges({ isInternational }: { isInternational?: boolean }) {
  return (
    <div className="bg-cream-light border border-primary/10 rounded-lg p-4 mt-6">
      {/* Badges row */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Lock className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium">256-bit SSL</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-medium">PCI-DSS Compliant</span>
        </div>
        {isInternational ? (
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Globe className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium">Intl. Cards Accepted</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Smartphone className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium">UPI · EMI · 0% Interest</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-text-secondary">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium">No Card Details Stored</span>
        </div>
        {!isInternational && (
          <div className="flex items-center gap-1.5 text-text-secondary">
            <CreditCard className="w-4 h-4 text-secondary" />
            <span className="text-xs font-medium">GST Invoice Provided</span>
          </div>
        )}
      </div>

      {/* Payment logos */}
      <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-primary/8 flex-wrap">
        {isInternational ? (
          <>
            {[
              { l: 'VISA', c: 'text-blue-700' },
              { l: 'MC', c: 'text-red-600' },
              { l: 'AMEX', c: 'text-blue-900' },
              { l: 'PayPal', c: 'text-blue-700' },
              { l: 'USD $', c: 'text-green-700' },
            ].map(({ l, c }) => (
              <span key={l} className={`${c} text-[10px] font-bold px-2 py-1 bg-white rounded border border-gray-200`}>{l}</span>
            ))}
          </>
        ) : (
          <>
            {[
              { l: 'UPI', c: 'text-green-700' },
              { l: 'VISA', c: 'text-blue-700' },
              { l: 'MC', c: 'text-red-600' },
              { l: 'RuPay', c: 'text-orange-600' },
              { l: 'NetBanking', c: 'text-gray-700' },
              { l: 'EMI', c: 'text-purple-700' },
            ].map(({ l, c }) => (
              <span key={l} className={`${c} text-[10px] font-bold px-2 py-1 bg-white rounded border border-gray-200`}>{l}</span>
            ))}
          </>
        )}
      </div>

      <p className="text-center text-[9px] text-primary/35 mt-2 tracking-wide">
        Payments processed securely · Your financial data is never stored on our servers
      </p>
    </div>
  );
}
