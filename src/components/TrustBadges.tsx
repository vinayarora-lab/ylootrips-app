import { Shield, Lock, CreditCard, CheckCircle, Globe } from 'lucide-react';

export default function TrustBadges({ isInternational }: { isInternational?: boolean }) {
    return (
        <div className="bg-cream-light border border-primary/10 rounded-lg p-4 mt-6">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                {/* SSL Secure */}
                <div className="flex items-center gap-2 text-text-secondary">
                    <Lock size={18} className="text-green-600" />
                    <span className="text-sm">SSL Secured</span>
                </div>

                {/* Payment Security */}
                <div className="flex items-center gap-2 text-text-secondary">
                    <Shield size={18} className="text-blue-600" />
                    <span className="text-sm">Safe Payment</span>
                </div>

                {isInternational ? (
                    <div className="flex items-center gap-2 text-text-secondary">
                        <Globe size={18} className="text-purple-600" />
                        <span className="text-sm">International Cards</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-text-secondary">
                        <CreditCard size={18} className="text-purple-600" />
                        <span className="text-sm">EMI Available</span>
                    </div>
                )}

                {/* Verified */}
                <div className="flex items-center gap-2 text-text-secondary">
                    <CheckCircle size={18} className="text-green-600" />
                    <span className="text-sm">Verified Partner</span>
                </div>
            </div>

            {/* Payment logos */}
            <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-primary/10">
                <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-gray-200">
                    <span className="text-xs font-bold text-blue-600">VISA</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-gray-200">
                    <span className="text-xs font-bold text-red-600">MC</span>
                </div>
                {isInternational ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-gray-200">
                        <span className="text-xs font-bold text-blue-900">AMEX</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-gray-200">
                        <span className="text-xs font-bold text-orange-600">RuPay</span>
                    </div>
                )}
                {isInternational ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-gray-200">
                        <span className="text-xs font-bold text-green-700">USD</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-gray-200">
                        <span className="text-xs font-bold text-green-600">UPI</span>
                    </div>
                )}
            </div>
        </div>
    );
}
