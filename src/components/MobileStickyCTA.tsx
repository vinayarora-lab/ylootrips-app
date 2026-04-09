'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Zap, MessageCircle } from 'lucide-react';

const WA_NUMBER = '918427831127';
const WA_MSG = encodeURIComponent('Hi! I want to book a trip. Please share the best package price and available dates.');
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

export default function MobileStickyCTA() {
    const pathname = usePathname();

    if (
        pathname?.includes('/checkout') ||
        pathname?.includes('/payment') ||
        pathname === '/contact' ||
        pathname?.includes('/admin') ||
        (pathname?.includes('/events/') && pathname?.endsWith('/tickets'))
    ) {
        return null;
    }

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden shadow-2xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <div className="flex">
                {/* WhatsApp — left half */}
                <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 font-bold text-sm"
                >
                    <MessageCircle size={18} className="fill-white" />
                    Get Instant Price
                </a>

                {/* Book Now — right half */}
                <Link
                    href="/trips"
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-4 font-bold text-sm"
                >
                    <Zap size={18} />
                    Book Now
                </Link>
            </div>
        </div>
    );
}
