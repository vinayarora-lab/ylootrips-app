'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, Search, Plane, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function MyBookingSection() {
  const router = useRouter();
  const [ref, setRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = ref.trim().toUpperCase();
    if (trimmed) router.push(`/my-booking?ref=${encodeURIComponent(trimmed)}`);
    else router.push('/my-booking');
  };

  const types = [
    { prefix: 'BK-', label: 'Trip Booking', icon: <MapPin size={16} />, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { prefix: 'EVT-', label: 'Event Booking', icon: <Calendar size={16} />, color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { prefix: 'FLT-', label: 'Flight Booking', icon: <Plane size={16} />, color: 'bg-sky-50 text-sky-600 border-sky-200' },
  ];

  return (
    <section className="py-12 md:py-20 bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

          {/* Left — text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-5">
              <Ticket size={14} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Booking Portal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Already booked?<br />
              <span className="text-amber-400">Track it here.</span>
            </h2>
            <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto lg:mx-0 mb-8">
              No login needed. Just your booking reference and email — see your status, receipt, and full trip details instantly.
            </p>

            {/* Type pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {types.map(t => (
                <div key={t.prefix} className={`flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-xs font-semibold ${t.color}`}>
                  {t.icon}
                  <span className="font-mono font-black">{t.prefix}</span>
                  <span className="hidden sm:inline opacity-70">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — quick lookup card */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Search size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold">Quick Lookup</p>
                  <p className="text-white/40 text-xs">Enter your reference to continue</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                    Booking Reference
                  </label>
                  <input
                    type="text"
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    placeholder="BK-123456 · EVT-ABC · FLT-123"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/30 font-mono text-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98]"
                >
                  <Search size={16} />
                  Track My Booking
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-center gap-2 text-white/30 text-xs">
                <Ticket size={12} />
                <span>Reference sent to your email after booking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
