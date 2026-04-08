'use client';

import { useState } from 'react';
import { Tag, CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { applyPromoCode, PROMO_CODES, PromoCode } from '@/lib/promoCodes';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';

interface PromoCodeInputProps {
  orderTotal: number;           // INR amount before promo
  appliedCode: string | null;
  discountAmount: number;
  onApply: (code: string, discount: number, promo: PromoCode) => void;
  onRemove: () => void;
}

export default function PromoCodeInput({
  orderTotal,
  appliedCode,
  discountAmount,
  onApply,
  onRemove,
}: PromoCodeInputProps) {
  const { currency } = useCurrency();
  const fp = (p: number) => formatPriceWithCurrency(p, currency);

  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);

  const handleApply = () => {
    setError(null);
    const result = applyPromoCode(input, orderTotal);
    if (result.valid) {
      onApply(result.promo.code, result.discount, result.promo);
      setInput('');
    } else {
      setError(result.error);
    }
  };

  const handleQuickApply = (code: string) => {
    setError(null);
    const result = applyPromoCode(code, orderTotal);
    if (result.valid) {
      onApply(result.promo.code, result.discount, result.promo);
      setShowList(false);
    } else {
      setError(result.error);
      setShowList(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Applied state */}
      {appliedCode ? (
        <div className="flex items-center justify-between gap-3 p-3.5 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2.5">
            <CheckCircle size={17} className="text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-800">{appliedCode} applied!</p>
              <p className="text-xs text-green-700">You save {fp(discountAmount)} 🎉</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
          >
            <X size={15} className="text-green-600" />
          </button>
        </div>
      ) : (
        <>
          {/* Input row */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" />
              <input
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(null); }}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApply())}
                placeholder="Enter promo code"
                className="w-full pl-9 pr-4 py-3 border border-primary/20 bg-white rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent uppercase"
              />
            </div>
            <button
              type="button"
              onClick={handleApply}
              disabled={!input.trim()}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Apply
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1.5 px-1">
              <X size={12} /> {error}
            </p>
          )}

          {/* View available codes toggle */}
          <button
            type="button"
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            {showList ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {showList ? 'Hide offers' : 'View available promo codes'}
          </button>

          {/* Available codes list */}
          {showList && (
            <div className="space-y-2 pt-1">
              {PROMO_CODES.map((promo) => {
                const eligible = orderTotal >= promo.minOrder;
                return (
                  <div
                    key={promo.code}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                      eligible
                        ? 'border-amber-200 bg-amber-50 cursor-pointer hover:bg-amber-100'
                        : 'border-gray-100 bg-gray-50 opacity-60'
                    }`}
                    onClick={() => eligible && handleQuickApply(promo.code)}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-xs font-bold bg-white border border-dashed border-amber-400 text-amber-700 px-2 py-0.5 rounded-lg shrink-0">
                        {promo.code}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-primary truncate">{promo.title}</p>
                        {!eligible && (
                          <p className="text-[10px] text-red-500">
                            Min ₹{promo.minOrder.toLocaleString('en-IN')} required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-bold text-amber-600">
                        {promo.type === 'percent' ? `${promo.value}% OFF` : `₹${promo.value} OFF`}
                      </span>
                      {eligible && (
                        <p className="text-[10px] text-green-600 font-medium">Tap to apply</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
