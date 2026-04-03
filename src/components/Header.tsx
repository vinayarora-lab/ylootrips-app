'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Pages that have a full-screen hero with dark overlay (navbar should be light)
    const pagesWithHero = ['/'];
    const hasHero = pagesWithHero.includes(pathname);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Domestic', href: '/destinations/domestic' },
        { name: 'International', href: '/destinations/international' },
        { name: 'Events', href: '/events' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'About', href: '/about' },
    ];

    const isNavActive = (link: { name: string; href: string }) => pathname === link.href;

    // Determine text color based on page type and scroll state
    const getTextColor = () => {
        if (isScrolled || isMobileMenuOpen) return 'text-primary';
        if (hasHero) return 'text-white';
        return 'text-primary';
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-smooth ${isScrolled
                    ? 'bg-cream/95 blur-overlay py-4 shadow-sm'
                    : hasHero
                        ? 'bg-transparent py-6 md:py-8'
                        : 'bg-cream py-6 md:py-8 border-b border-primary/5'
                    }`}
            >
                <div className="section-container">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/" className="relative z-10">
                            <img
                                src="/logo.png"
                                alt="YlooTrips"
                                className={`h-10 md:h-12 w-auto object-contain transition-all duration-500 ${hasHero && !isScrolled && !isMobileMenuOpen
                                        ? 'brightness-0 invert'
                                        : ''
                                    }`}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-caption uppercase tracking-[0.15em] font-medium transition-all duration-500 hover-line ${isNavActive(link)
                                        ? 'text-secondary'
                                        : `${getTextColor()} hover:text-secondary`
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* CTA & Mobile Toggle */}
                        <div className="flex items-center gap-6">
                            <Link
                                href="/contact"
                                className={`hidden md:flex items-center gap-2 text-caption uppercase tracking-[0.15em] font-medium transition-all duration-500 ${getTextColor()} hover:text-secondary`}
                            >
                                <span>Plan Your Journey</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`lg:hidden relative z-10 p-2 -mr-2 transition-colors duration-500 ${getTextColor()}`}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-40 bg-cream transition-all duration-700 ease-smooth lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
            >
                <div className="h-full flex flex-col justify-center items-center">
                    <nav className="flex flex-col items-center gap-8">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`font-display text-4xl md:text-5xl transition-all duration-500 ${isNavActive(link) ? 'text-secondary' : 'text-primary hover:text-secondary'
                                    } ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                style={{ transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : '0ms' }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <Link
                        href="/contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`mt-12 btn-primary ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                        style={{ transitionDelay: isMobileMenuOpen ? '500ms' : '0ms' }}
                    >
                        Plan Your Journey
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </>
    );
}
