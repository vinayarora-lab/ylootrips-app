'use client';

import { useVisitor } from '@/context/VisitorContext';
import Image from 'next/image';

export default function VisitorSelector() {
  const { hasChosen, setVisitor } = useVisitor();

  // Don't render once a choice has been made
  if (hasChosen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:flex-row">
      {/* ── Indian Traveler Card ─────────────────── */}
      <button
        onClick={() => setVisitor('indian')}
        className="relative flex-1 group overflow-hidden flex flex-col items-center justify-center text-cream cursor-pointer focus:outline-none"
        aria-label="I am an Indian traveler"
      >
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=80"
          alt="India Gate, Delhi — Indian traveler option"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        {/* Dark overlay — lightens on hover */}
        <div className="absolute inset-0 bg-primary/65 group-hover:bg-primary/45 transition-all duration-500" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
          <span className="text-6xl md:text-7xl" role="img" aria-label="Indian flag">🇮🇳</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
            I&apos;m from <span className="italic">India</span>
          </h2>
          <p className="text-cream/75 text-base md:text-lg max-w-xs leading-relaxed">
            See domestic getaways &amp; international trips from India
          </p>
          <div className="mt-4 border border-cream/30 group-hover:bg-cream group-hover:text-primary text-cream px-8 py-3 text-sm uppercase tracking-widest font-medium transition-all duration-300">
            Explore
          </div>
        </div>

        {/* Side label (desktop) */}
        <div className="absolute bottom-6 left-6 text-caption uppercase tracking-[0.3em] text-cream/40">
          Indian Traveler
        </div>
      </button>

      {/* Divider line (desktop only) */}
      <div className="hidden md:block w-px bg-white/20 z-10 shrink-0" />

      {/* ── International Traveler Card ──────────── */}
      <button
        onClick={() => setVisitor('foreigner')}
        className="relative flex-1 group overflow-hidden flex flex-col items-center justify-center text-cream cursor-pointer focus:outline-none"
        aria-label="I am an international traveler visiting India"
      >
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&q=80"
          alt="Taj Mahal, Agra — international traveler visiting India"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-primary/65 group-hover:bg-primary/45 transition-all duration-500" />

        <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
          <span className="text-6xl md:text-7xl" role="img" aria-label="Globe">🌍</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
            Visiting <span className="italic">India</span>
          </h2>
          <p className="text-cream/75 text-base md:text-lg max-w-xs leading-relaxed">
            Browse curated India tours, treks &amp; experiences for international visitors
          </p>
          <div className="mt-4 border border-cream/30 group-hover:bg-cream group-hover:text-primary text-cream px-8 py-3 text-sm uppercase tracking-widest font-medium transition-all duration-300">
            Discover India
          </div>
        </div>

        <div className="absolute bottom-6 right-6 text-caption uppercase tracking-[0.3em] text-cream/40">
          International Traveler
        </div>
      </button>

      {/* Top branding */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-cream/80">
        <span className="font-serif text-2xl font-bold tracking-tighter">YlooTrips</span>
        <p className="text-center text-xs uppercase tracking-[0.25em] text-cream/50 mt-1">Who are you traveling as?</p>
      </div>
    </div>
  );
}
