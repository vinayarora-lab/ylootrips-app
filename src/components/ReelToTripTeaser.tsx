'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Instagram, Sparkles, ArrowRight, MapPin, Clock, Zap } from 'lucide-react';

const EXAMPLES = [
  { label: 'Blue city streets & desert vibes', emoji: '🏜️' },
  { label: 'Houseboat in misty backwaters', emoji: '🌿' },
  { label: 'Snow peaks & monastery trek', emoji: '🏔️' },
];

const PREVIEW_CHIPS = ['5-Day Itinerary', 'Budget Breakdown', 'Packing List', 'Instagram Spots', 'Local Phrases'];

export default function ReelToTripTeaser() {
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleGo = (desc?: string) => {
    const q = (desc ?? input).trim();
    if (!q) return;
    router.push(`/reel-to-trip?desc=${encodeURIComponent(q)}`);
  };

  return (
    <section className="py-10 px-4 bg-gradient-to-br from-[#0e0e18] via-[#12101e] to-[#0e0e18]">
      <div className="max-w-4xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-pink-500/30 text-pink-300 text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
            <Instagram className="w-3.5 h-3.5" />
            New — Reel → Real Trip
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">

          {/* Left — headline + input */}
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-white font-semibold leading-tight mb-2">
              Saw a travel reel?<br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Turn it into your trip.
              </span>
            </h2>
            <p className="text-white/50 text-sm mb-5 leading-relaxed">
              Describe any reel — our AI finds the destination and builds a full itinerary in seconds.
            </p>

            {/* Input box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex gap-2 mb-4 focus-within:border-purple-500/50 transition-colors">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGo()}
                placeholder="Describe what you saw in the reel…"
                className="flex-1 bg-transparent text-white text-sm placeholder-white/25 px-3 py-2.5 outline-none"
              />
              <button
                onClick={() => handleGo()}
                disabled={!input.trim()}
                className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate
              </button>
            </div>

            {/* Quick example chips */}
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map(({ label, emoji }) => (
                <button
                  key={label}
                  onClick={() => handleGo(label)}
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white/90 text-[11px] px-3 py-1.5 rounded-full transition-all active:scale-95"
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Right — preview card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            {/* Mock destination header */}
            <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 rounded-xl p-3 flex items-center gap-3 border border-purple-500/20">
              <div className="w-9 h-9 rounded-lg bg-purple-500/30 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Jodhpur, Rajasthan</p>
                <p className="text-white/40 text-[10px]">Blue City · Desert vibes · Oct–Mar</p>
              </div>
              <div className="ml-auto flex items-center gap-1 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30">
                <Zap className="w-2.5 h-2.5" />
                AI
              </div>
            </div>

            {/* What you get */}
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-2">What you get instantly</p>
              <div className="flex flex-wrap gap-1.5">
                {PREVIEW_CHIPS.map(chip => (
                  <span key={chip} className="bg-white/8 border border-white/10 text-white/60 text-[10px] px-2.5 py-1 rounded-full">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Mock day */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/8">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">1</span>
                <p className="text-white/80 text-xs font-semibold">Blue City Exploration</p>
                <Clock className="w-3 h-3 text-white/20 ml-auto" />
              </div>
              <p className="text-white/35 text-[10px] leading-relaxed pl-8">Mehrangarh Fort at sunrise → Clocktower market → Ghanta Ghar bazaar → sunset at Jaswant Thada…</p>
            </div>

            {/* CTA */}
            <a
              href="/reel-to-trip"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-xs font-semibold transition-all"
            >
              Try with your reel
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
