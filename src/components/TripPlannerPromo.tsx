'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, MapPin, Clock, Wallet } from 'lucide-react';

const EXAMPLES = [
  '5 days in Manali, ₹20,000 budget',
  '3 days Goa beach trip for 2',
  'Kerala backwaters, honeymoon, 7 days',
  'Rajasthan heritage tour, 10 days',
];

export default function TripPlannerPromo() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [active, setActive] = useState(false);

  const handleGo = (query?: string) => {
    const q = (query || input).trim();
    if (!q) return;
    router.push(`/trip-planner?q=${encodeURIComponent(q)}`);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleGo();
  };

  return (
    <section className="relative bg-primary overflow-hidden py-16 sm:py-20">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, #C4A77D 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C17F59 0%, transparent 50%)`
      }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">

        {/* Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 text-accent text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Yloo AI Trip Planner
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <h2 className="font-display text-display-lg text-cream leading-tight mb-3">
            Get your itinerary<br className="hidden sm:block" />
            <span className="text-accent italic"> in seconds. Free.</span>
          </h2>
          <p className="text-cream-dark text-sm sm:text-base max-w-md mx-auto">
            Tell Yloo your destination, budget, and travel style — get a complete day-by-day plan instantly.
          </p>
        </div>

        {/* Input */}
        <div className="max-w-2xl mx-auto mb-6">
          <div
            className={`flex items-center bg-white rounded-2xl overflow-hidden transition-shadow ${active ? 'shadow-[0_0_0_3px_rgba(196,167,125,0.4)]' : 'shadow-lg'}`}
          >
            <MapPin className="w-4 h-4 text-secondary ml-4 flex-shrink-0" />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              onFocus={() => setActive(true)}
              onBlur={() => setActive(false)}
              placeholder="e.g. 5 days in Manali, ₹20,000 budget, adventure lover..."
              className="flex-1 px-3 py-4 text-sm text-primary placeholder-secondary/50 bg-transparent outline-none"
            />
            <button
              onClick={() => handleGo()}
              className="flex-shrink-0 m-1.5 flex items-center gap-2 bg-primary hover:bg-primary-light text-cream text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Plan It Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Example chips */}
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                onClick={() => handleGo(ex)}
                className="text-xs text-cream/60 hover:text-cream bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-full transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Value props */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[
            { icon: Sparkles, label: 'AI-generated in seconds' },
            { icon: Clock, label: 'Day-by-day itinerary' },
            { icon: Wallet, label: '100% free, no sign-up' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-cream/50 text-xs">
              <Icon className="w-3.5 h-3.5 text-accent/70" />
              {label}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
