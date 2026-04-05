'use client';

import { useState, useEffect } from 'react';
import { useVisitor } from '@/context/VisitorContext';
import { useCurrency } from '@/context/CurrencyContext';
import { X } from 'lucide-react';

export default function VisitorSwitcher() {
  const { visitor, setVisitor, hasChosen } = useVisitor();
  const { setCurrency } = useCurrency();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState<'indian' | 'foreigner' | null>(null);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || dismissed) return null;

  const choose = (type: 'indian' | 'foreigner') => {
    setAnimating(type);
    setTimeout(() => {
      setVisitor(type);
      setCurrency(type === 'indian' ? 'INR' : 'USD');
      setAnimating(null);
    }, 200);
  };

  /* ── After choosing: slim persistent bar ── */
  if (hasChosen && visitor) {
    return (
      <div className="w-full bg-primary text-cream">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 h-9 flex items-center justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40 hidden sm:block">
            Personalised for
          </span>
          <div className="flex items-center gap-1 mx-auto sm:mx-0">
            <span className="text-sm">{visitor === 'indian' ? '🇮🇳' : '🌍'}</span>
            <span className="text-[11px] font-medium tracking-widest uppercase text-cream/90">
              {visitor === 'indian' ? 'Indian Traveler' : 'International Visitor'}
            </span>
            <span className="text-cream/20 mx-2">|</span>
            <button
              onClick={() => choose(visitor === 'indian' ? 'foreigner' : 'indian')}
              className="text-[10px] uppercase tracking-widest text-cream/50 hover:text-cream transition-colors"
            >
              Switch
            </button>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-cream/30 hover:text-cream/70 transition-colors ml-auto"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  /* ── First visit: prominent chooser bar ── */
  return (
    <div className="w-full bg-primary">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
        {/* Label */}
        <span className="text-[11px] uppercase tracking-[0.2em] text-cream/50 shrink-0">
          I am travelling as
        </span>

        {/* Options */}
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          {/* Indian */}
          <button
            onClick={() => choose('indian')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold uppercase tracking-widest border transition-all duration-200
              ${animating === 'indian'
                ? 'bg-accent border-accent text-primary scale-95'
                : visitor === 'indian'
                  ? 'bg-accent border-accent text-primary'
                  : 'border-cream/20 text-cream/80 hover:border-cream/60 hover:text-cream hover:bg-cream/10'
              }`}
          >
            <span className="text-base">🇮🇳</span>
            <span>Indian Resident</span>
            <span className="text-[9px] opacity-60 font-normal tracking-wider hidden sm:inline">· ₹ INR</span>
          </button>

          <span className="text-cream/20 text-xs">or</span>

          {/* Foreigner */}
          <button
            onClick={() => choose('foreigner')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold uppercase tracking-widest border transition-all duration-200
              ${animating === 'foreigner'
                ? 'bg-accent border-accent text-primary scale-95'
                : visitor === 'foreigner'
                  ? 'bg-accent border-accent text-primary'
                  : 'border-cream/20 text-cream/80 hover:border-cream/60 hover:text-cream hover:bg-cream/10'
              }`}
          >
            <span className="text-base">🌍</span>
            <span>International Visitor</span>
            <span className="text-[9px] opacity-60 font-normal tracking-wider hidden sm:inline">· $ USD</span>
          </button>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="text-cream/25 hover:text-cream/60 transition-colors sm:ml-auto"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
