'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export default function MobileStickyCTA() {
    const pathname = usePathname();

    // Don't show on checkout, payment, contact (user already there), admin, or event tickets (Proceed bar needs the space)
    if (pathname?.includes('/checkout') || pathname?.includes('/payment') || pathname === '/contact' || pathname?.includes('/admin') || (pathname?.includes('/events/') && pathname?.endsWith('/tickets'))) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex-1">
                    <p className="text-sm font-medium text-primary">Plan Your Dream Trip</p>
                    <p className="text-xs text-text-secondary">Custom packages • EMI available</p>
                </div>
                <Link
                    href="/contact"
                    className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                    <Calendar size={18} />
                    Get Quote
                </Link>
            </div>
        </div>
    );
}
