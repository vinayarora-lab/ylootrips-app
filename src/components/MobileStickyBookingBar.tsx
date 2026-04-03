'use client';

import { formatPriceWithCurrency } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';

interface MobileStickyBookingBarProps {
    price: number | string;
    onBook: () => void;
    disabled?: boolean;
    spotsLeft?: number;
}

export default function MobileStickyBookingBar({ price, onBook, disabled, spotsLeft }: MobileStickyBookingBarProps) {
    const { currency } = useCurrency();
    const { visitor } = useVisitor();
    const fp = (p: number | string) => formatPriceWithCurrency(p, currency);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-primary/10 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-xl font-semibold text-primary">{fp(price)}</div>
                    <div className="text-xs text-primary/50">per person · no hidden fees</div>
                    {spotsLeft && spotsLeft <= 5 && (
                        <div className="text-xs text-red-500 font-medium mt-0.5">
                            Only {spotsLeft} spots left!
                        </div>
                    )}
                </div>
                <button
                    onClick={onBook}
                    disabled={disabled}
                    className="btn-primary text-sm px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                    {visitor === 'foreigner' ? 'Book & Pay Online' : 'Book Now'}
                </button>
            </div>
        </div>
    );
}
