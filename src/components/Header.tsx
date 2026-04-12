'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Ticket, ChevronRight } from 'lucide-react';
import FlashSaleBanner from '@/components/FlashSaleBanner';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const hasHero = pathname === '/';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Trips 🏕️', href: '/destinations/domestic' },
        { name: 'International 🌍', href: '/destinations/international' },
        { name: 'Real Trips 📸', href: '/reel-to-trip' },
        { name: 'Holiday Planner 🤖', href: '/trip-planner' },
        { name: 'Events 🎉', href: '/events' },
        { name: 'Blogs ✍️', href: '/blogs' },
        { name: 'About', href: '/about' },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
                    : hasHero
                        ? 'bg-transparent'
                        : 'bg-white/95 backdrop-blur-lg border-b border-gray-100'
            }`}>
                <div className="hidden sm:block"><FlashSaleBanner /></div>
                <div className={`section-container transition-all duration-500 ${
                    isScrolled ? 'py-3' : hasHero ? 'py-6' : 'py-4'
                }`}>
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/" className="relative z-10 group">
                            <img
                                src="/logo.png"
                                alt="YlooTrips"
                                className={`h-9 md:h-11 w-auto object-contain transition-all duration-500 group-hover:scale-105 ${
                                    hasHero && !isScrolled && !isMobileMenuOpen ? 'brightness-0 invert' : ''
                                }`}
                            />
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href}
                                    className={`relative px-4 py-2 text-[11px] uppercase tracking-[0.12em] font-semibold rounded-full transition-all duration-300 ${
                                        isActive(link.href)
                                            ? 'bg-amber-500/10 text-amber-600'
                                            : hasHero && !isScrolled
                                                ? 'text-white/80 hover:text-white hover:bg-white/10'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}>
                                    {link.name}
                                    {isActive(link.href) && (
                                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* CTA + Mobile toggle */}
                        <div className="flex items-center gap-2">
                            {/* Track Booking */}
                            <Link href="/my-booking"
                                className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                                    hasHero && !isScrolled
                                        ? 'border-amber-400/50 text-amber-300 hover:bg-amber-400/10'
                                        : 'border-amber-400 text-amber-600 hover:bg-amber-50'
                                }`}>
                                <Ticket size={12} />
                                My Booking
                            </Link>
                            {/* Plan Journey */}
                            <Link href="/trip-planner"
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-md shadow-amber-500/20">
                                <Sparkles size={13} />
                                Plan Journey
                            </Link>
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`lg:hidden relative z-10 p-2.5 rounded-full transition-all duration-300 ${
                                    hasHero && !isScrolled && !isMobileMenuOpen
                                        ? 'text-white bg-black/30 hover:bg-black/40 border border-white/20'
                                        : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
                                }`}>
                                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu — full-screen luxury dark overlay (z-[60] > header z-50, eliminates double logo) */}
            <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${
                isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}>
                {/* Full-screen dark panel slides up */}
                <div
                    className={`absolute inset-0 transition-transform duration-500 ease-out ${
                        isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
                    style={{
                        background: 'linear-gradient(160deg,#0d0d14 0%,#151520 50%,#0d0d14 100%)',
                    }}
                >
                    {/* Ambient glows */}
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                    {/* Subtle grid */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                        style={{ backgroundImage:'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />

                    <div className="relative flex flex-col h-full px-6 pt-5 pb-8"
                         style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)' }}>

                        {/* Top bar — logo + close */}
                        <div className="flex items-center justify-between mb-10">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                                <img src="/logo.png" alt="YlooTrips" className="h-9 w-auto object-contain brightness-0 invert" />
                            </Link>
                            <button onClick={() => setIsMobileMenuOpen(false)}
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors active:scale-90">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Nav links */}
                        <nav className="flex flex-col flex-1">
                            {navLinks.map((link, i) => (
                                <div key={link.name}>
                                    <Link href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center justify-between py-4 transition-all duration-300 active:scale-[0.98] ${
                                            isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
                                        } ${isActive(link.href) ? 'text-amber-400' : 'text-white/85 hover:text-white'}`}
                                        style={{ transitionDelay: isMobileMenuOpen ? `${i * 55 + 80}ms` : '0ms' }}>
                                        <span className="font-semibold text-xl tracking-tight">{link.name}</span>
                                        <ChevronRight size={18} className={isActive(link.href) ? 'text-amber-400' : 'text-white/20'} />
                                    </Link>
                                    {i < navLinks.length - 1 && (
                                        <div className="h-px bg-white/5" />
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Trust micro-line */}
                        <div className="flex items-center gap-2 mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[10px] text-white/25 uppercase tracking-widest">4.9★ · 25,000+ trips · MSME certified</span>
                        </div>

                        {/* Bottom CTAs */}
                        <div className="flex flex-col gap-3"
                            style={{ transitionDelay: isMobileMenuOpen ? '380ms' : '0ms' }}>
                            <Link href="/my-booking" onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold border border-white/15 text-white/70 bg-white/5 transition-all duration-500 ${
                                    isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                                }`}
                                style={{ transitionDelay: isMobileMenuOpen ? '360ms' : '0ms' }}>
                                <Ticket size={15} />
                                Track My Booking
                            </Link>
                            <Link href="/trip-planner" onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 transition-all duration-500 ${
                                    isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                                }`}
                                style={{ transitionDelay: isMobileMenuOpen ? '430ms' : '0ms' }}>
                                <Sparkles size={16} />
                                Plan Your Journey
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
