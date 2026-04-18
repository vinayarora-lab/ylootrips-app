'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  Home, Compass, Ticket, Sparkles, Wallet,
  Globe, Mountain, Instagram, X, Bell, Search, Star, Shield, Clock,
} from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

const HIDDEN_BOTTOM_NAV = ['/checkout', '/payment', '/admin'];

/* ════════════════════════════════════════════════════════════════════════
   PHASE 1 — LOGO SPLASH  (1.8 s, then auto-advances to onboarding)
════════════════════════════════════════════════════════════════════════ */
function LogoSplash({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  const [exit, setExit]       = useState(false);

  useEffect(() => {
    // Fade logo in
    const t1 = setTimeout(() => setVisible(true), 80);
    // Start exit fade-out after 1.8 s
    const t2 = setTimeout(() => setExit(true), 1800);
    // Notify parent after exit animation (300 ms)
    const t3 = setTimeout(() => onDone(), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="absolute inset-0 z-[300] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #0f0f0f 0%, #1a1a1a 60%, #111 100%)',
        opacity: exit ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Subtle radial glow behind logo */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 260, height: 260,
          background: 'radial-gradient(circle, rgba(245,117,58,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.82) translateY(12px)',
          transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        className="flex flex-col items-center gap-5"
      >
        <Image
          src="/logo.png"
          alt="YlooTrips"
          width={200}
          height={68}
          className="w-48 object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
          priority
        />
        <div className="flex items-center gap-2">
          <span className="block w-10 h-px bg-white/20" />
          <p className="text-white/50 text-[10px] font-semibold tracking-[0.25em] uppercase">
            Travel Redefined
          </p>
          <span className="block w-10 h-px bg-white/20" />
        </div>
      </div>

      {/* Loading dots */}
      <div
        className="absolute bottom-16 flex gap-1.5"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease 0.4s' }}
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/40"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PHASE 2 — ONBOARDING SLIDES  (3 slides, then go to app)
════════════════════════════════════════════════════════════════════════ */
const SLIDES = [
  {
    img:    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=90',
    tag:    'Welcome to YlooTrips',
    title:  'Extraordinary\nJourneys Begin\nHere',
    sub:    'Trusted by 25,000+ travellers from 40+ countries worldwide',
    accent: '#F5753A',
  },
  {
    img:    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=90',
    tag:    'AI-Powered Planning',
    title:  'Your Perfect\nItinerary in\n30 Seconds',
    sub:    'Groq AI + Gemini craft a bespoke plan just for you — completely free',
    accent: '#3B82F6',
  },
  {
    img:    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=90',
    tag:    'Travel With Confidence',
    title:  'MSME Certified,\n100% Secure,\n24/7 Support',
    sub:    'PCI-DSS compliant · Free cancellation · Real humans always available',
    accent: '#10B981',
  },
];

function OnboardingSlides({ onDone }: { onDone: () => void }) {
  const [slide,  setSlide]  = useState(0);
  const [fading, setFading] = useState(false);
  const [entered, setEntered] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Entrance animation
  useEffect(() => { setTimeout(() => setEntered(true), 60); }, []);

  const go = (next: number) => {
    if (fading) return;
    setFading(true);
    setTimeout(() => { setSlide(next); setFading(false); }, 280);
  };

  const goNext = () => {
    if (timer.current) clearTimeout(timer.current);
    if (slide < SLIDES.length - 1) go(slide + 1); else onDone();
  };

  // Auto-advance every 4 s
  useEffect(() => {
    timer.current = setTimeout(goNext, 4000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [slide]); // eslint-disable-line react-hooks/exhaustive-deps

  const s      = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div
      className="absolute inset-0 z-[200] overflow-hidden bg-black"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.35s ease',
      }}
    >
      {/* BG image */}
      <div className={`absolute inset-0 transition-opacity duration-280 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        <Image src={s.img} alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/92" />
      </div>

      {/* Logo top-left */}
      <div className="absolute top-12 left-5 z-10">
        <Image
          src="/logo.png" alt="YlooTrips"
          width={110} height={38}
          className="w-28 object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* Skip */}
      <button
        onClick={onDone}
        className="absolute top-12 right-5 z-10 text-white/60 text-[11px] font-bold tracking-widest uppercase bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/15"
      >
        Skip
      </button>

      {/* Bottom content */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-6 pb-12 transition-all duration-280 ${fading ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}
      >
        {/* Progress dots */}
        <div className="flex gap-2 mb-7">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => go(i)} className="p-1 -m-1">
              <span
                className="block rounded-full transition-all duration-500"
                style={{
                  width:      i === slide ? 32 : 8,
                  height:     8,
                  background: i === slide ? s.accent : 'rgba(255,255,255,0.30)',
                }}
              />
            </button>
          ))}
        </div>

        {/* Tag */}
        <p
          className="text-[10px] font-black uppercase tracking-[0.22em] mb-3"
          style={{ color: s.accent }}
        >
          {s.tag}
        </p>

        {/* Heading */}
        <h1 className="font-playfair text-white text-[2rem] leading-[1.08] font-semibold mb-4 whitespace-pre-line">
          {s.title}
        </h1>

        {/* Sub */}
        <p className="text-white/65 text-[13px] leading-relaxed mb-7">{s.sub}</p>

        {/* Trust pills */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {[
            { icon: Star,   label: '4.9★ Rated',      color: '#FBBF24' },
            { icon: Shield, label: 'MSME Certified',  color: '#34D399' },
            { icon: Clock,  label: '1 hr Response',   color: '#60A5FA' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/15">
              <Icon size={11} style={{ color }} />
              <span className="text-white text-[11px] font-semibold">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        {isLast ? (
          <button
            onClick={onDone}
            className="w-full py-4 rounded-2xl text-white text-[15px] font-black tracking-wide active:scale-[0.97] transition-transform shadow-lg"
            style={{ background: s.accent, boxShadow: `0 8px 32px ${s.accent}55` }}
          >
            Start Exploring  →
          </button>
        ) : (
          <button
            onClick={goNext}
            className="w-full py-4 rounded-2xl text-white text-[15px] font-bold active:scale-[0.97] transition-transform border border-white/25 bg-white/12 backdrop-blur-sm"
          >
            Continue  →
          </button>
        )}

        <p className="text-white/30 text-[10px] text-center mt-4 font-medium">
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   TOP BAR  (transparent on home, opaque on scroll / inner pages)
════════════════════════════════════════════════════════════════════════ */
function AppTopBar() {
  const pathname  = usePathname();
  const isHome    = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(false); // reset on route change
    const el = document.getElementById('app-scroll');
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 55);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, [pathname]);

  const glass = isHome && !scrolled;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${glass ? 'bg-transparent' : 'bg-[#F5F1EB]/96 backdrop-blur-md border-b border-black/6 shadow-sm'}`}>
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/" className="active:opacity-75 transition-opacity">
          <Image
            src="/logo.png" alt="YlooTrips"
            width={110} height={38}
            className={`h-7 w-auto object-contain transition-all duration-300 ${glass ? '[filter:brightness(0)_invert(1)]' : ''}`}
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all ${glass ? 'bg-white/20 backdrop-blur-sm border border-white/20' : 'bg-white shadow-sm border border-gray-100'}`}
          >
            <Search size={16} className={glass ? 'text-white' : 'text-gray-600'} />
          </Link>
          <button
            className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all relative ${glass ? 'bg-white/20 backdrop-blur-sm border border-white/20' : 'bg-white shadow-sm border border-gray-100'}`}
          >
            <Bell size={16} className={glass ? 'text-white' : 'text-gray-600'} />
            <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-[#F5753A] rounded-full border border-white" />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   BOTTOM TAB BAR
════════════════════════════════════════════════════════════════════════ */
function BottomTabBar() {
  const pathname = usePathname();
  const { balance } = useWallet();
  const [tripsOpen, setTripsOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tripsOpen) return;
    const h = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) setTripsOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [tripsOpen]);

  useEffect(() => { setTripsOpen(false); }, [pathname]);

  if (HIDDEN_BOTTOM_NAV.some(p => pathname?.startsWith(p))) return null;

  const isHome    = pathname === '/';
  const isDom     = !!pathname?.startsWith('/destinations/domestic');
  const isIntl    = !!pathname?.startsWith('/destinations/international');
  const isReel    = !!pathname?.startsWith('/reel-to-trip');
  const isTrips   = isDom || isIntl || isReel;
  const isPlan    = !!pathname?.startsWith('/trip-planner');
  const isMyTrips = !!pathname?.startsWith('/my-booking');
  const isWallet  = !!pathname?.startsWith('/cashback');

  return (
    <div className="shrink-0 relative">
      {/* Sheet backdrop */}
      {tripsOpen && (
        <div className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-[2px]" onClick={() => setTripsOpen(false)} />
      )}

      {/* Trips sheet */}
      {tripsOpen && (
        <div
          ref={sheetRef}
          className="absolute bottom-full left-3 right-3 mb-2 z-[80] bg-white rounded-3xl overflow-hidden border border-gray-100"
          style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.18)' }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Explore</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">Where to next?</p>
            </div>
            <button onClick={() => setTripsOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-90">
              <X size={14} className="text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            {[
              { href: '/destinations/domestic',      Icon: Mountain,  label: 'Domestic',      sub: '150+ India trips',  bg: 'bg-gray-900',                                     active: isDom },
              { href: '/destinations/international', Icon: Globe,     label: 'International', sub: '50+ countries',    bg: 'bg-gradient-to-br from-blue-400 to-indigo-500',   active: isIntl },
              { href: '/reel-to-trip',               Icon: Instagram, label: 'Reel → Trip',   sub: 'Upload & plan ✨',  bg: 'bg-gradient-to-br from-pink-500 to-indigo-500',   active: isReel },
              { href: '/trip-planner',               Icon: Sparkles,  label: 'AI Planner',    sub: 'Smart itinerary',  bg: 'bg-gradient-to-br from-emerald-400 to-teal-500',  active: isPlan },
            ].map(({ href, Icon, label, sub, bg, active }) => (
              <Link key={href} href={href} onClick={() => setTripsOpen(false)}
                className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl bg-gray-50 border border-gray-100 active:scale-95 transition-all">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shadow-md`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-[13px] text-gray-900">{label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                </div>
                {active && <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">● Active</span>}
              </Link>
            ))}
          </div>
          <div className="px-4 pb-4 flex flex-wrap gap-2">
            {['Manali 🏔️','Kashmir ⛪','Bali 🌴','Dubai ✈️','Goa 🏖️','Kerala 🌿'].map(tag => {
              const d = tag.split(' ')[0].toLowerCase();
              return (
                <Link key={tag} href={['bali','dubai'].includes(d) ? `/destinations/international?q=${d}` : `/destinations/domestic?q=${d}`}
                  onClick={() => setTripsOpen(false)}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 active:scale-95 transition-transform">
                  {tag}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Nav bar */}
      <nav
        className="bg-white/96 backdrop-blur-2xl border-t border-gray-200/60"
        style={{ boxShadow: '0 -1px 0 rgba(0,0,0,0.04), 0 -8px 32px rgba(0,0,0,0.07)', paddingBottom: 'env(safe-area-inset-bottom,0px)' }}
      >
        <div className="grid grid-cols-5 h-16 px-1">

          <Tab href="/" active={isHome} label="Home">
            <Home size={20} strokeWidth={isHome ? 2.5 : 1.8} />
          </Tab>

          <button onClick={() => setTripsOpen(v => !v)} className="relative flex flex-col items-center justify-center active:scale-90 transition-all select-none">
            {(isTrips || tripsOpen) && <Pip />}
            <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all ${isTrips || tripsOpen ? 'bg-gray-100' : ''}`}>
              <Compass size={20} strokeWidth={isTrips || tripsOpen ? 2.5 : 1.8} className={isTrips || tripsOpen ? 'text-gray-900' : 'text-gray-400'} />
              <span className={`text-[10px] leading-none ${isTrips || tripsOpen ? 'font-bold text-gray-800' : 'font-medium text-gray-400'}`}>Trips</span>
            </div>
          </button>

          {/* Raised AI button */}
          <Link href="/trip-planner" className="relative flex flex-col items-center justify-center active:scale-90 transition-all select-none">
            <div className={`w-[54px] h-[54px] -mt-5 rounded-[18px] flex flex-col items-center justify-center shadow-xl ${isPlan ? 'bg-gray-700' : 'bg-gray-900'} shadow-gray-900/40`}>
              <Sparkles size={19} className="text-white" strokeWidth={2} />
              <span className="text-white text-[9px] font-black leading-none mt-0.5">AI</span>
            </div>
            <span className={`text-[10px] mt-1 leading-none ${isPlan ? 'font-bold text-gray-700' : 'font-medium text-gray-400'}`}>Plan</span>
          </Link>

          <Tab href="/cashback" active={isWallet} label={balance > 0 ? 'Cash' : 'Wallet'} color={balance > 0 ? 'emerald' : 'gray'}>
            <div className="relative">
              <Wallet size={20} strokeWidth={isWallet ? 2.5 : 1.8} className={isWallet ? 'text-emerald-600' : balance > 0 ? 'text-emerald-500' : 'text-gray-400'} />
              {balance > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[13px] px-1 bg-emerald-500 text-white text-[7px] font-bold rounded-full flex items-center justify-center">
                  ₹{balance >= 1000 ? `${Math.floor(balance/1000)}k` : balance}
                </span>
              )}
            </div>
          </Tab>

          <Tab href="/my-booking" active={isMyTrips} label="My Trips">
            <Ticket size={20} strokeWidth={isMyTrips ? 2.5 : 1.8} />
          </Tab>

        </div>
      </nav>
    </div>
  );
}

function Pip() {
  return <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-gray-900" />;
}

function Tab({ href, active, label, color = 'gray', children }: {
  href: string; active: boolean; label: string; color?: string; children: React.ReactNode;
}) {
  const col = color === 'emerald' ? 'text-emerald-600' : 'text-gray-900';
  const bg  = color === 'emerald' ? 'bg-emerald-50'  : 'bg-gray-100';
  const dot = color === 'emerald' ? 'bg-emerald-500' : 'bg-gray-900';
  return (
    <Link href={href} className="relative flex flex-col items-center justify-center active:scale-90 transition-all select-none">
      {active && <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full ${dot}`} />}
      <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl ${active ? bg : ''}`}>
        <div className={active ? col : 'text-gray-400'}>{children}</div>
        <span className={`text-[10px] leading-none ${active ? `font-bold ${col}` : 'font-medium text-gray-400'}`}>{label}</span>
      </div>
    </Link>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   APP SHELL  — Phone frame + splash orchestration
════════════════════════════════════════════════════════════════════════ */
type Phase = 'logo' | 'onboarding' | 'app';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>('app'); // default 'app' until we check storage
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('yloo_onboarded');
    if (!seen) {
      setPhase('logo');
    }
    setReady(true);
  }, []);

  const handleLogoDone      = () => setPhase('onboarding');
  const handleOnboardingDone = () => {
    localStorage.setItem('yloo_onboarded', '1');
    setPhase('app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black md:flex md:items-center md:justify-center md:p-8">

      {/* ── Phone frame ── */}
      <div
        className="
          relative w-full bg-[#F5F1EB] flex flex-col overflow-hidden
          md:w-[393px] md:min-h-[852px] md:max-h-[852px]
          md:rounded-[44px]
          md:shadow-[0_0_0_10px_#1c1c1c,0_0_0_11px_#2a2a2a,0_40px_120px_rgba(0,0,0,0.85)]
        "
        style={{ height: '100dvh' }}
      >
        {/* Dynamic Island (desktop only) */}
        <div className="hidden md:flex absolute top-3.5 left-1/2 -translate-x-1/2 w-[120px] h-[37px] bg-black rounded-full z-[100] items-center justify-between px-5 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-gray-800" />
          <div className="w-4 h-4 rounded-full bg-[#111] border border-gray-800" />
        </div>

        {/* ── Splash phases ── */}
        {ready && phase === 'logo'       && <LogoSplash      onDone={handleLogoDone} />}
        {ready && phase === 'onboarding' && <OnboardingSlides onDone={handleOnboardingDone} />}

        {/* ── Main app (always rendered, hidden behind splash) ── */}
        <div className={`flex flex-col flex-1 overflow-hidden transition-opacity duration-500 ${phase === 'app' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <AppTopBar />
          <div id="app-scroll" className="flex-1 overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
            {children}
          </div>
          <BottomTabBar />
        </div>
      </div>

      {/* Keyframe for loading dots */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
