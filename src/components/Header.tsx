'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Ticket } from 'lucide-react';

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
        { name: 'Events 🎉', href: '/events' },
        { name: 'Blogs ✍️', href: '/blogs' },
        { name: 'About', href: '/about' },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-3'
                    : hasHero
                        ? 'bg-transparent py-6'
                        : 'bg-white/95 backdrop-blur-lg border-b border-gray-100 py-4'
            }`}>
                <div className="section-container">
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
                            <Link href="/contact"
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-md shadow-amber-500/20">
                                <Sparkles size={13} />
                                Plan Journey
                            </Link>
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`lg:hidden relative z-10 p-2 rounded-full transition-all duration-300 ${
                                    hasHero && !isScrolled && !isMobileMenuOpen
                                        ? 'text-white hover:bg-white/10'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}>
                                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu — full screen with glassmorphism */}
            <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
                isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />

                {/* Slide-in panel */}
                <div className={`absolute right-0 top-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-500 ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <div className="flex flex-col h-full pt-20 pb-8 px-6">
                        <nav className="flex flex-col gap-1 flex-1">
                            {navLinks.map((link, i) => (
                                <Link key={link.name} href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-300 ${
                                        isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                                    } ${isActive(link.href)
                                        ? 'bg-amber-50 text-amber-600'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                    style={{ transitionDelay: isMobileMenuOpen ? `${i * 60 + 100}ms` : '0ms' }}>
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        <Link href="/my-booking" onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border border-amber-400 text-amber-600 transition-all duration-500 ${
                                isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                            style={{ transitionDelay: '400ms' }}>
                            <Ticket size={15} />
                            Track My Booking
                        </Link>
                        <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white transition-all duration-500 shadow-lg shadow-amber-500/30 ${
                                isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                            style={{ transitionDelay: '480ms' }}>
                            <Sparkles size={16} />
                            Plan Your Journey
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
