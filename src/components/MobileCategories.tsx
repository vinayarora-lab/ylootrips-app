'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PRIMARY = [
  { emoji: '✨', label: 'Free Itinerary', sub: 'AI-powered', href: '/trip-planner', highlight: true },
  { emoji: '🏕️', label: 'Domestic Trips', sub: 'India packages', href: '/destinations/domestic' },
  { emoji: '🌍', label: 'International', sub: 'Global tours', href: '/destinations/international' },
  { emoji: '✈️', label: 'Flights', sub: 'Book cheap', href: '/?tab=flights' },
];

const SECONDARY = [
  { emoji: '🎉', label: 'Events', sub: 'Live events', href: '/events' },
  { emoji: '🏨', label: 'Hotels', sub: 'Best stays', href: '/?tab=hotels' },
  { emoji: '🗺️', label: 'Plan Journey', sub: 'Custom trip', href: '/trip-planner' },
  { emoji: '📞', label: 'Talk to Expert', sub: 'Free consult', href: '/contact' },
];

export default function MobileCategories() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="md:hidden bg-white px-4 pb-4 pt-0 -mt-5 relative z-10">
      <div className="rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-gray-100 overflow-hidden">
        {/* Top heading */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">What are you looking for?</p>
        </div>

        {/* Primary grid — always visible */}
        <div className="grid grid-cols-4 gap-0 border-t border-gray-50">
          {PRIMARY.map(({ emoji, label, sub, href, highlight }) => (
            <Link
              key={href + label}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 py-4 px-1 text-center transition-all active:scale-95 select-none ${
                highlight ? 'bg-amber-50 border-b-2 border-amber-400' : ''
              }`}
            >
              <span className="text-2xl">{emoji}</span>
              <p className={`text-[11px] font-bold leading-tight ${highlight ? 'text-amber-700' : 'text-gray-800'}`}>
                {label}
              </p>
              <p className="text-[9px] text-gray-400 leading-tight">{sub}</p>
            </Link>
          ))}
        </div>

        {/* Secondary grid — expandable */}
        {expanded && (
          <div className="grid grid-cols-4 gap-0 border-t border-gray-50">
            {SECONDARY.map(({ emoji, label, sub, href }) => (
              <Link
                key={href + label}
                href={href}
                className="flex flex-col items-center justify-center gap-1 py-4 px-1 text-center transition-all active:scale-95 select-none"
              >
                <span className="text-2xl">{emoji}</span>
                <p className="text-[11px] font-bold text-gray-800 leading-tight">{label}</p>
                <p className="text-[9px] text-gray-400 leading-tight">{sub}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-2.5 border-t border-gray-50 text-[11px] text-gray-400 font-medium"
        >
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
          {expanded ? 'Show less' : 'More options'}
        </button>
      </div>
    </section>
  );
}
