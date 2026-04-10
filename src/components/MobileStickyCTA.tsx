'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Ticket, MessageCircle, Sparkles } from 'lucide-react';

const WA_NUMBER = '918427831127';
const WA_MSG = encodeURIComponent('Hi! I want to book a trip. Please share the best package price and available dates.');
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

const TABS = [
    { label: 'Home',     href: '/',            icon: Home },
    { label: 'Trips',    href: '/destinations/domestic', icon: Compass },
    { label: 'My Trips', href: '/my-booking',  icon: Ticket },
] as const;

const HIDDEN_PATHS = ['/checkout', '/payment', '/admin'];

export default function MobileStickyCTA() {
    const pathname = usePathname();

    if (HIDDEN_PATHS.some(p => pathname?.startsWith(p))) return null;

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname?.startsWith(href);

    const isPlannerActive = pathname?.startsWith('/trip-planner');

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.10)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <div className="grid grid-cols-5 h-16">
                {TABS.map(({ label, href, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-all duration-150 active:scale-90 select-none ${
                                active ? 'text-amber-600' : 'text-gray-400'
                            }`}
                        >
                            {active && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-amber-500" />
                            )}
                            <div className={`p-1.5 rounded-xl transition-all duration-150 ${active ? 'bg-amber-50' : ''}`}>
                                <Icon
                                    size={21}
                                    strokeWidth={active ? 2.4 : 1.8}
                                    className={active ? 'text-amber-600' : 'text-gray-400'}
                                />
                            </div>
                            <span className={active ? 'font-bold' : ''}>{label}</span>
                        </Link>
                    );
                })}

                {/* AI Planner — centre highlight tab */}
                <Link
                    href="/trip-planner"
                    className="relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold select-none active:scale-90 transition-all duration-150"
                >
                    {isPlannerActive && (
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-amber-500" />
                    )}
                    {/* Floating pill button */}
                    <div className={`flex flex-col items-center justify-center w-14 h-14 -mt-6 rounded-2xl shadow-lg transition-all duration-150 ${
                        isPlannerActive
                            ? 'bg-amber-600 shadow-amber-500/40'
                            : 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/30'
                    }`}>
                        <Sparkles size={20} strokeWidth={2} className="text-white" />
                        <span className="text-white text-[9px] font-bold mt-0.5 leading-none">Plan AI</span>
                    </div>
                    <span className={`mt-1 ${isPlannerActive ? 'text-amber-600' : 'text-gray-400'}`}>AI Trip</span>
                </Link>

                {/* WhatsApp — Chat tab */}
                <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-green-600 transition-all duration-150 active:scale-90 select-none"
                >
                    <div className="p-1.5 rounded-xl bg-green-50">
                        <MessageCircle size={21} strokeWidth={1.8} className="text-green-600" fill="rgba(22,163,74,0.15)" />
                    </div>
                    <span>Chat</span>
                </a>
            </div>
        </nav>
    );
}
