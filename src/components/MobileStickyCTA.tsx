'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Ticket, Sparkles, Wallet, Globe, Mountain, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@/context/WalletContext';

const HIDDEN_PATHS = ['/checkout', '/payment', '/admin'];

export default function MobileStickyCTA() {
    const pathname = usePathname();
    const { balance } = useWallet();
    const [tripsOpen, setTripsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!tripsOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setTripsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [tripsOpen]);

    useEffect(() => { setTripsOpen(false); }, [pathname]);

    if (HIDDEN_PATHS.some(p => pathname?.startsWith(p))) return null;

    const isHome = pathname === '/';
    const isDomestic = pathname?.startsWith('/destinations/domestic');
    const isInternational = pathname?.startsWith('/destinations/international');
    const isTrips = isDomestic || isInternational;
    const isPlannerActive = pathname?.startsWith('/trip-planner');
    const isWallet = pathname?.startsWith('/cashback');
    const isMyTrips = pathname?.startsWith('/my-booking');

    return (
        <>
            {/* Trips popup sheet */}
            {tripsOpen && (
                <div
                    ref={popupRef}
                    className="fixed bottom-[76px] left-3 right-3 z-[80] bg-white/95 backdrop-blur-2xl rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-250"
                    style={{ boxShadow: '0 -4px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Explore</span>
                            <p className="text-sm font-bold text-gray-900 mt-0.5">Where to next?</p>
                        </div>
                        <button
                            onClick={() => setTripsOpen(false)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform"
                        >
                            <X size={14} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-3 p-4">
                        <Link
                            href="/destinations/domestic"
                            onClick={() => setTripsOpen(false)}
                            className="group flex flex-col items-center gap-3 py-5 px-3 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-100/80 active:scale-95 transition-all duration-150"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-300/40">
                                <Mountain size={24} className="text-white" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-sm text-gray-900">Domestic</div>
                                <div className="text-[11px] text-amber-600 font-semibold mt-0.5">150+ India trips</div>
                            </div>
                            {isDomestic && (
                                <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">● Active</span>
                            )}
                        </Link>

                        <Link
                            href="/destinations/international"
                            onClick={() => setTripsOpen(false)}
                            className="group flex flex-col items-center gap-3 py-5 px-3 rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-50 border border-blue-100/80 active:scale-95 transition-all duration-150"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-300/40">
                                <Globe size={24} className="text-white" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-sm text-gray-900">International</div>
                                <div className="text-[11px] text-blue-600 font-semibold mt-0.5">50+ countries</div>
                            </div>
                            {isInternational && (
                                <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">● Active</span>
                            )}
                        </Link>
                    </div>

                    {/* Quick tags */}
                    <div className="px-4 pb-5 flex flex-wrap gap-2">
                        {['Manali 🏔️', 'Kedarnath ⛪', 'Spiti 🗻', 'Bali 🌴', 'Dubai ✈️', 'Thailand 🐘'].map((tag) => {
                            const dest = tag.split(' ')[0].toLowerCase();
                            const isIntl = ['bali', 'dubai', 'thailand'].includes(dest);
                            return (
                                <Link
                                    key={tag}
                                    href={isIntl ? `/destinations/international?q=${dest}` : `/destinations/domestic?q=${dest}`}
                                    onClick={() => setTripsOpen(false)}
                                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 active:scale-95 transition-transform hover:bg-gray-200"
                                >
                                    {tag}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Bottom Nav */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                {/* Glass background */}
                <div className="mx-0 bg-white/90 backdrop-blur-2xl border-t border-gray-200/60" style={{ boxShadow: '0 -1px 0 rgba(0,0,0,0.06), 0 -8px 32px rgba(0,0,0,0.08)' }}>
                    <div className="grid grid-cols-5 h-16 px-1">

                        {/* Home */}
                        <Link
                            href="/"
                            className="relative flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-90 select-none"
                        >
                            <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 ${isHome ? 'bg-amber-50' : ''}`}>
                                <Home size={20} strokeWidth={isHome ? 2.5 : 1.8} className={isHome ? 'text-amber-500' : 'text-gray-400'} />
                                <span className={`text-[10px] font-${isHome ? 'bold' : 'medium'} ${isHome ? 'text-amber-600' : 'text-gray-400'}`}>Home</span>
                            </div>
                            {isHome && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-amber-500" />}
                        </Link>

                        {/* Trips */}
                        <button
                            onClick={() => setTripsOpen(!tripsOpen)}
                            className="relative flex flex-col items-center justify-center transition-all duration-200 active:scale-90 select-none"
                        >
                            <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 ${isTrips || tripsOpen ? 'bg-amber-50' : ''}`}>
                                <Compass size={20} strokeWidth={isTrips || tripsOpen ? 2.5 : 1.8} className={isTrips || tripsOpen ? 'text-amber-500' : 'text-gray-400'} />
                                <span className={`text-[10px] font-${isTrips || tripsOpen ? 'bold' : 'medium'} ${isTrips || tripsOpen ? 'text-amber-600' : 'text-gray-400'}`}>Trips</span>
                            </div>
                            {(isTrips || tripsOpen) && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-amber-500" />}
                            <span className={`absolute bottom-2 text-[7px] transition-transform duration-200 ${tripsOpen ? 'rotate-180 text-amber-500' : 'text-gray-300'}`}>▲</span>
                        </button>

                        {/* AI Planner — centre raised button */}
                        <Link
                            href="/trip-planner"
                            className="relative flex flex-col items-center justify-center select-none active:scale-90 transition-all duration-200"
                        >
                            <div className={`flex flex-col items-center justify-center w-[54px] h-[54px] -mt-7 rounded-[18px] transition-all duration-200 ${
                                isPlannerActive
                                    ? 'bg-amber-600 shadow-xl shadow-amber-500/50'
                                    : 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/40'
                            }`}>
                                <Sparkles size={19} strokeWidth={2} className="text-white" />
                                <span className="text-white text-[9px] font-black mt-0.5 leading-none tracking-tight">AI</span>
                            </div>
                            <span className={`text-[10px] font-bold mt-1 ${isPlannerActive ? 'text-amber-600' : 'text-gray-400'}`}>Plan Trip</span>
                        </Link>

                        {/* Wallet */}
                        <Link
                            href="/cashback"
                            className="relative flex flex-col items-center justify-center transition-all duration-200 active:scale-90 select-none"
                        >
                            <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 relative ${isWallet ? 'bg-green-50' : balance > 0 ? 'bg-green-50/60' : ''}`}>
                                <Wallet size={20} strokeWidth={isWallet ? 2.5 : 1.8} className={isWallet ? 'text-green-600' : balance > 0 ? 'text-green-500' : 'text-gray-400'} />
                                {balance > 0 && (
                                    <span className="absolute -top-0.5 right-1.5 min-w-[18px] h-[14px] px-1 bg-green-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none">
                                        ₹{balance >= 1000 ? `${(balance / 1000).toFixed(1)}k` : balance}
                                    </span>
                                )}
                                <span className={`text-[10px] font-${isWallet ? 'bold' : 'medium'} ${isWallet ? 'text-green-600' : balance > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                                    {balance > 0 ? 'Cash' : 'Wallet'}
                                </span>
                            </div>
                            {isWallet && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-green-500" />}
                        </Link>

                        {/* My Trips */}
                        <Link
                            href="/my-booking"
                            className="relative flex flex-col items-center justify-center transition-all duration-200 active:scale-90 select-none"
                        >
                            <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 ${isMyTrips ? 'bg-amber-50' : ''}`}>
                                <Ticket size={20} strokeWidth={isMyTrips ? 2.5 : 1.8} className={isMyTrips ? 'text-amber-500' : 'text-gray-400'} />
                                <span className={`text-[10px] font-${isMyTrips ? 'bold' : 'medium'} ${isMyTrips ? 'text-amber-600' : 'text-gray-400'}`}>My Trips</span>
                            </div>
                            {isMyTrips && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-amber-500" />}
                        </Link>

                    </div>
                </div>
            </nav>
        </>
    );
}
