'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currency, toggle: toggleCurrency } = useCurrency();
  const { visitor, setVisitor, hasChosen } = useVisitor();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Nav links depend on visitor type:
  // Indian   → shows Domestic + International
  // Foreigner → hides International outbound (they only care about India trips)
  const links = visitor === 'foreigner'
    ? [
        { name: 'India Trips', href: '/trips' },
        { name: 'Destinations', href: '/destinations' },
        { name: 'Flights', href: '/#flight-search' },
        { name: 'Events', href: '/events' },
        { name: 'India Guide', href: '/india-travel-guide' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
      ]
    : [
        { name: 'Domestic', href: '/destinations/domestic' },
        { name: 'International', href: '/destinations/international' },
        { name: 'Flights', href: '/#flight-search' },
        { name: 'Events', href: '/events' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
      ];

  const toggleVisitor = () =>
    setVisitor(visitor === 'indian' ? 'foreigner' : 'indian');

  const borderClass = scrolled
    ? 'border-primary/30 text-primary hover:bg-primary hover:text-cream'
    : 'border-primary/20 text-primary hover:bg-primary hover:text-cream';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-[#F4F1EA]/90 backdrop-blur-md border-b border-black/5' : 'py-8 bg-transparent'}`}>
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex justify-between items-center">

        <Link href="/" className="z-50 relative">
          <span className="font-serif text-3xl font-bold tracking-tighter">LocalHi.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm uppercase tracking-widest font-medium hover-underline"
            >
              {link.name}
            </Link>
          ))}

          {/* Visitor type toggle — always visible */}
          <button
            onClick={toggleVisitor}
            title={visitor === 'indian' ? 'Switch to International mode' : 'Switch to Indian mode'}
            className={`flex items-center gap-2 text-xs font-semibold tracking-widest uppercase border rounded-full px-3.5 py-1.5 transition-all duration-300 ${borderClass}`}
          >
            <span className={visitor === 'indian' ? 'opacity-100' : 'opacity-35'}>🇮🇳</span>
            <span className="opacity-20 text-[10px]">/</span>
            <span className={visitor === 'foreigner' ? 'opacity-100' : 'opacity-35'}>🌍</span>
            <span className="text-[9px] opacity-40 hidden lg:inline">
              {visitor === 'indian' ? 'IN' : visitor === 'foreigner' ? 'INTL' : ''}
            </span>
          </button>

          {/* Currency toggle */}
          <button
            onClick={toggleCurrency}
            aria-label={`Switch to ${currency === 'USD' ? 'INR' : 'USD'}`}
            className={`flex items-center gap-0.5 text-xs font-semibold tracking-widest uppercase border rounded-full px-3 py-1.5 transition-all duration-300 ${borderClass}`}
          >
            <span className={currency === 'INR' ? 'opacity-100' : 'opacity-40'}>₹</span>
            <span className="mx-1 opacity-30">/</span>
            <span className={currency === 'USD' ? 'opacity-100' : 'opacity-40'}>$</span>
          </button>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-50 relative p-2">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile full-screen menu */}
        <div className={`fixed inset-0 bg-[#F4F1EA] z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-serif text-4xl text-primary hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}

          {/* Visitor toggle — mobile (always visible) */}
          <button
            onClick={() => { toggleVisitor(); setIsOpen(false); }}
            className="flex items-center gap-3 border border-primary/30 rounded-full px-6 py-3 text-sm font-semibold tracking-widest uppercase text-primary"
          >
            <span className={visitor === 'indian' ? 'opacity-100' : 'opacity-40'}>🇮🇳 Indian</span>
            <span className="opacity-30">/</span>
            <span className={visitor === 'foreigner' ? 'opacity-100' : 'opacity-40'}>🌍 International</span>
          </button>

          {/* Currency toggle — mobile */}
          <button
            onClick={() => { toggleCurrency(); setIsOpen(false); }}
            className="flex items-center gap-2 border border-primary/30 rounded-full px-6 py-3 text-sm font-semibold tracking-widest uppercase text-primary"
          >
            <span className={currency === 'INR' ? 'opacity-100' : 'opacity-40'}>₹ INR</span>
            <span className="opacity-30">/</span>
            <span className={currency === 'USD' ? 'opacity-100' : 'opacity-40'}>$ USD</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
