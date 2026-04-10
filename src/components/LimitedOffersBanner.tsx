'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, X, ArrowRight, Tag } from 'lucide-react';

/* Countdown that ends ~36h from first client render */
const DURATION = 36 * 3600_000 + 14 * 60_000;

function pad(n: number) { return String(Math.max(0, n)).padStart(2, '0'); }

function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    setMounted(true);
    const saleEnd = Date.now() + DURATION;
    setDiff(saleEnd - Date.now());
    const t = setInterval(() => setDiff(saleEnd - Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  // Render placeholder on server / before hydration to avoid mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5">
        {['HRS', 'MIN', 'SEC'].map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            {i > 0 && <span className="text-white/60 font-bold text-sm">:</span>}
            <div className="flex flex-col items-center">
              <div className="bg-black/30 backdrop-blur-sm text-white font-mono font-black text-lg leading-none px-2 py-1 rounded min-w-[2.5rem] text-center tabular-nums">--</div>
              <span className="text-white/55 text-[9px] uppercase tracking-widest mt-0.5">{label}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {[
        { val: pad(h), label: 'HRS' },
        { val: pad(m), label: 'MIN' },
        { val: pad(s), label: 'SEC' },
      ].map(({ val, label }, i) => (
        <div key={label} className="flex items-center gap-1">
          {i > 0 && <span className="text-white/60 font-bold text-sm">:</span>}
          <div className="flex flex-col items-center">
            <div className="bg-black/30 backdrop-blur-sm text-white font-mono font-black text-lg leading-none px-2 py-1 rounded min-w-[2.5rem] text-center tabular-nums">
              {val}
            </div>
            <span className="text-white/55 text-[9px] uppercase tracking-widest mt-0.5">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const OFFERS = [
  { code: 'YLOO15', discount: '15% OFF', label: 'All Trips', color: 'bg-violet-600' },
  { code: 'FIRST10', discount: '10% OFF', label: 'First Booking', color: 'bg-emerald-600' },
  { code: 'GROUP20', discount: '20% OFF', label: '4+ People', color: 'bg-amber-600' },
];

export default function LimitedOffersBanner() {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#1C1C1C] via-[#2d1f0e] to-[#1C1C1C] overflow-hidden">
      {/* Background shimmer stripes */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(196,167,125,0.4) 20px, rgba(196,167,125,0.4) 22px)',
        }}
      />

      <div className="relative z-10 section-container py-5 md:py-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">

          {/* Label */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-terracotta text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5 fill-white" />
              Flash Sale
            </div>
            <div className="text-white text-sm font-semibold hidden sm:block">
              Ends in
            </div>
            <Countdown />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-10 bg-white/15" />

          {/* Promo codes */}
          <div className="flex flex-wrap items-center justify-center gap-3 flex-1">
            {OFFERS.map(({ code, discount, label, color }) => (
              <button
                key={code}
                onClick={() => copyCode(code)}
                className="group flex items-center gap-2 bg-white/10 hover:bg-white/18 border border-white/15 hover:border-white/30 text-white rounded-xl px-4 py-2 transition-all"
              >
                <Tag className="w-3.5 h-3.5 text-accent shrink-0" />
                <div className="text-left">
                  <div className="text-xs text-white/55 leading-none">{label}</div>
                  <div className="font-bold text-sm leading-tight text-accent">{discount}</div>
                </div>
                <div className={`${color} text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ml-1`}>
                  {copied === code ? '✓ Copied!' : code}
                </div>
              </button>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/trips"
            className="shrink-0 flex items-center gap-2 bg-accent hover:bg-accent-warm text-primary text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all shadow-lg whitespace-nowrap"
          >
            Book Now
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors p-1"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
