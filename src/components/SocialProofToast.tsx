'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, Star, Clock } from 'lucide-react';

// Stat-based toasts — no fake individual bookings
const statToasts = [
  { icon: Users,      color: 'text-blue-500',  bg: 'bg-blue-50',   text: '25,000+ travelers have planned their trip with us' },
  { icon: Star,       color: 'text-yellow-500', bg: 'bg-yellow-50', text: '4.9★ rated on Google · 2,400+ verified reviews' },
  { icon: TrendingUp, color: 'text-green-500',  bg: 'bg-green-50',  text: '98% of our travelers would book with us again' },
  { icon: Clock,      color: 'text-purple-500', bg: 'bg-purple-50', text: 'Average response time: under 45 minutes' },
  { icon: Users,      color: 'text-blue-500',   bg: 'bg-blue-50',   text: 'Travelers from 40+ countries planned with us this month' },
  { icon: Star,       color: 'text-yellow-500', bg: 'bg-yellow-50', text: 'Free cancellation up to 14 days before departure' },
];

export default function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const initial = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(initial);
  }, [dismissed]);

  useEffect(() => {
    if (!visible || dismissed) return;
    const hide = setTimeout(() => {
      setVisible(false);
      const next = setTimeout(() => {
        setIdx(c => (c + 1) % statToasts.length);
        setVisible(true);
      }, 15000);
      return () => clearTimeout(next);
    }, 5000);
    return () => clearTimeout(hide);
  }, [visible, dismissed]);

  if (dismissed || !visible) return null;

  const toast = statToasts[idx];
  const Icon = toast.icon;

  return (
    <div className={`fixed bottom-24 left-4 z-50 max-w-[290px] bg-white border border-primary/10 shadow-xl rounded-xl p-4 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2.5 right-3 text-primary/25 hover:text-primary/60 text-xs leading-none"
        aria-label="Dismiss"
      >✕</button>
      <div className="flex items-start gap-3">
        <div className={`${toast.bg} w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5`}>
          <Icon className={`w-4 h-4 ${toast.color}`} />
        </div>
        <p className="text-sm text-primary/80 leading-snug pr-4">{toast.text}</p>
      </div>
    </div>
  );
}
